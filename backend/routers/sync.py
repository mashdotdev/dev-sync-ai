import logging

from agents import Runner
from fastapi import APIRouter, HTTPException

import db
from agent.orchestrator import devsync_agent
from agent.tools import SyncContext
from schemas import SyncResult, SyncTriggerRequest, SyncTriggerResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/trigger", response_model=SyncTriggerResponse)
async def trigger_sync(req: SyncTriggerRequest):
    tokens = await db.get_integration_tokens(req.project_id)
    if not tokens:
        raise HTTPException(status_code=404, detail="No integrations found for project")

    gh = tokens.get("github", {})
    nt = tokens.get("notion", {})
    sl = tokens.get("slack", {})
    li = tokens.get("linear", {})

    context = SyncContext(
        project_id=req.project_id,
        github_token=gh.get("token", ""),
        github_owner=gh.get("owner", ""),
        github_repo=gh.get("repo", ""),
        notion_token=nt.get("token", ""),
        notion_database_id=nt.get("databaseId", ""),
        slack_token=sl.get("token", ""),
        slack_channel=sl.get("channel", ""),
        linear_token=li.get("token", ""),
        linear_team_id=li.get("teamId", ""),
    )

    message = (
        f"Sync project {req.project_id}. "
        f"GitHub repo: {context.github_owner}/{context.github_repo}. "
        f"Notion DB: {context.notion_database_id}. "
        f"Linear team: {context.linear_team_id}. "
        f"Slack channel: {context.slack_channel}. "
        f"Trigger: {req.trigger_type}."
    )

    try:
        await Runner.run(devsync_agent, input=message, context=context)

        # Results accumulated by tools directly into context — no text parsing needed
        sync_result = SyncResult(
            tickets_updated=context.tickets_updated,
            blockers_flagged=context.blockers_flagged,
            scope_creep_commits=context.scope_creep_commits,
            slack_summary=context.slack_summary or "Sync completed",
            sync_event_id=context.last_sync_event_id,
        )

        logger.info(
            "Sync complete for %s: %d tickets updated, %d blockers, %d scope creep",
            req.project_id,
            len(sync_result.tickets_updated),
            len(sync_result.blockers_flagged),
            len(sync_result.scope_creep_commits),
        )

        return SyncTriggerResponse(success=True, result=sync_result)

    except Exception as exc:
        logger.exception("Sync failed for project %s", req.project_id)
        return SyncTriggerResponse(success=False, error=str(exc))
