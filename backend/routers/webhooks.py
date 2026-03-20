import hashlib
import hmac
import json
import logging

import httpx
from fastapi import APIRouter, BackgroundTasks, HTTPException, Request

import db
from config import settings
from integrations import github, notion

logger = logging.getLogger(__name__)
router = APIRouter()


def _verify_signature(body: bytes, signature: str, secret: str) -> bool:
    if not secret:
        return True
    expected = "sha256=" + hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


async def _find_project_for_repo(repo_full: str) -> str | None:
    pool = db._pool_required()
    owner, _, repo = repo_full.partition("/")
    rows = await pool.fetch(
        'SELECT "projectId", metadata FROM integration WHERE type = $1',
        "github",
    )
    for row in rows:
        if not row["metadata"]:
            continue
        try:
            meta = json.loads(row["metadata"])
        except json.JSONDecodeError:
            continue
        if meta.get("owner") == owner and (not meta.get("repo") or meta.get("repo") == repo):
            return row["projectId"]
    return None


async def _ask_gemini(api_key: str, prompt: str) -> str:
    """Single Gemini call returning text."""
    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            params={"key": api_key},
            json={"contents": [{"parts": [{"text": prompt}]}]},
        )
        r.raise_for_status()
    parts = r.json()["candidates"][0]["content"]["parts"]
    return "".join(p.get("text", "") for p in parts)


async def _run_sync(project_id: str) -> None:
    logger.info("[sync:%s] started", project_id)
    try:
        tokens = await db.get_integration_tokens(project_id)
        gh = tokens.get("github", {})
        nt = tokens.get("notion", {})
        sl = tokens.get("slack", {})

        github_token = gh.get("token", "")
        owner = gh.get("owner", "")
        repo = gh.get("repo", "")
        notion_token = nt.get("token", "")
        notion_db = nt.get("databaseId", "")
        slack_token = sl.get("token", "")
        slack_channel = sl.get("channel", "")

        logger.info("[sync:%s] github=%s/%s notion_db=%s", project_id, owner, repo, notion_db)

        # ── 1. Fetch data ────────────────────────────────────────────────────
        commits = []
        if github_token and owner and repo:
            try:
                commits = await github.get_commits(github_token, owner, repo, None)
                logger.info("[sync:%s] %d commits fetched", project_id, len(commits))
            except Exception as e:
                logger.warning("[sync:%s] github fetch failed: %s", project_id, e)

        tickets = []
        if notion_token and notion_db:
            try:
                tickets = await notion.get_database_items(notion_token, notion_db)
                logger.info("[sync:%s] %d notion tickets fetched", project_id, len(tickets))
            except Exception as e:
                logger.warning("[sync:%s] notion fetch failed: %s", project_id, e)

        if not commits and not tickets:
            logger.warning("[sync:%s] nothing to sync", project_id)
            return

        # ── 2. Ask Gemini to match commits → tickets ─────────────────────────
        match_prompt = f"""You are a project sync assistant. Match each commit to a Notion ticket if the commit message relates to it (by keyword, feature name, or ticket title).

Commits:
{json.dumps(commits, indent=2)}

Notion tickets:
{json.dumps([{"id": t["id"], "title": t["title"], "status": t["status"]} for t in tickets], indent=2)}

For new_status use ONLY one of: "Not started", "In progress", "Done".
Set "Done" if the commit clearly completes the ticket. Set "In progress" if partially done.

Reply ONLY with a JSON object like this (no markdown):
{{
  "matches": [
    {{"commit_sha": "abc123", "ticket_id": "notion-page-id", "ticket_title": "Ticket name", "new_status": "Done"}}
  ],
  "unmatched_commits": ["sha1: commit message", "sha2: commit message"],
  "blocked_tickets": ["ticket title that has no related commit"]
}}"""

        matches = []
        unmatched_commits = [f"{c['sha']}: {c['message']}" for c in commits]
        blocked_tickets = [t["title"] for t in tickets]

        if commits and tickets and settings.gemini_api_key:
            try:
                raw = await _ask_gemini(settings.gemini_api_key, match_prompt)
                # strip markdown fences
                raw = raw.strip()
                if raw.startswith("```"):
                    raw = raw.split("```")[1]
                    if raw.startswith("json"):
                        raw = raw[4:]
                data = json.loads(raw.strip())
                matches = data.get("matches", [])
                unmatched_commits = data.get("unmatched_commits", unmatched_commits)
                blocked_tickets = data.get("blocked_tickets", blocked_tickets)
                logger.info("[sync:%s] %d matches found", project_id, len(matches))
            except Exception as e:
                logger.warning("[sync:%s] gemini matching failed: %s", project_id, e)

        # ── 3. Update Notion tickets (deduplicated by ticket_id) ─────────────
        tickets_updated = []
        seen_ticket_ids: set[str] = set()
        for match in matches:
            ticket_id = match["ticket_id"]
            if ticket_id in seen_ticket_ids:
                continue  # already updated this ticket
            seen_ticket_ids.add(ticket_id)
            try:
                logger.info("[sync:%s] updating ticket %s (%s) → %s", project_id, match["ticket_title"], ticket_id, match["new_status"])
                await notion.update_page_status(notion_token, ticket_id, match["new_status"])
                tickets_updated.append(f"{match['ticket_title']} → {match['new_status']}")
                logger.info("[sync:%s] updated ticket: %s", project_id, match["ticket_title"])
            except Exception as e:
                logger.warning("[sync:%s] notion status update failed for %s (%s → %s): %s", project_id, ticket_id, match["ticket_title"], match["new_status"], e)

        # ── 4. Post Slack summary ────────────────────────────────────────────
        slack_summary = ""
        if slack_token and slack_channel:
            lines = [f"*DevSync report for `{owner}/{repo}`*"]
            if tickets_updated:
                lines.append(f"✅ Updated: {', '.join(tickets_updated)}")
            if unmatched_commits:
                lines.append(f"⚠️ Scope creep ({len(unmatched_commits)} commits): " + ", ".join(unmatched_commits[:3]))
            if blocked_tickets:
                lines.append(f"🔴 Blockers: {', '.join(blocked_tickets[:3])}")
            slack_summary = "\n".join(lines)
            try:
                from integrations import slack as slack_mod
                await slack_mod.post_message(slack_token, slack_channel, slack_summary)
            except Exception as e:
                logger.warning("[sync:%s] slack post failed: %s", project_id, e)

        # ── 5. Save sync event ───────────────────────────────────────────────
        event_id = await db.save_sync_event(project_id, "sync_complete", {
            "tickets_updated": tickets_updated,
            "unmatched_commits": unmatched_commits,
            "blocked_tickets": blocked_tickets,
            "slack_summary": slack_summary,
        })

        logger.info(
            "[sync:%s] done — tickets=%d scope=%d blockers=%d event=%s",
            project_id, len(tickets_updated), len(unmatched_commits), len(blocked_tickets), event_id,
        )

    except Exception:
        logger.exception("[sync:%s] sync failed", project_id)


@router.post("/github")
async def github_webhook(request: Request, background_tasks: BackgroundTasks):
    body = await request.body()
    signature = request.headers.get("X-Hub-Signature-256", "")

    if settings.github_webhook_secret and not _verify_signature(body, signature, settings.github_webhook_secret):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    event_type = request.headers.get("X-GitHub-Event", "")
    if event_type != "push":
        return {"ok": True, "skipped": True, "reason": f"event={event_type} ignored"}

    payload = json.loads(body)
    repo_full = payload.get("repository", {}).get("full_name", "")
    logger.info("GitHub push webhook for repo: %s", repo_full)

    project_id = await _find_project_for_repo(repo_full)
    if not project_id:
        logger.warning("No project found for repo %s", repo_full)
        return {"ok": True, "skipped": True, "reason": "no matching project"}

    background_tasks.add_task(_run_sync, project_id)
    logger.info("Queued background sync for project %s", project_id)
    return {"ok": True, "project_id": project_id, "status": "sync_queued"}
