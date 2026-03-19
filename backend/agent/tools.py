"""
@function_tool definitions wrapping integration API clients.
Results are accumulated in SyncContext so the router can read them back
without depending on the model producing a final text response.
"""

import json
from dataclasses import dataclass, field

from agents import RunContextWrapper, function_tool

import db
from integrations import github, linear, notion, slack


@dataclass
class SyncContext:
    project_id: str
    github_token: str = ""
    github_owner: str = ""
    github_repo: str = ""
    notion_token: str = ""
    notion_database_id: str = ""
    slack_token: str = ""
    slack_channel: str = ""
    linear_token: str = ""
    linear_team_id: str = ""
    # Accumulated results — populated as tools run
    tickets_updated: list = field(default_factory=list)
    blockers_flagged: list = field(default_factory=list)
    scope_creep_commits: list = field(default_factory=list)
    slack_summary: str = ""
    last_sync_event_id: str = ""


# ── GitHub ───────────────────────────────────────────────────────────────────


@function_tool
async def get_github_commits(ctx: RunContextWrapper[SyncContext], since: str) -> str:
    """Fetch recent commits from the GitHub repo. since = ISO-8601 date string (e.g. '2025-01-01T00:00:00Z')."""
    c = ctx.context
    commits = await github.get_commits(c.github_token, c.github_owner, c.github_repo, since)
    return json.dumps(commits)


@function_tool
async def get_github_diff(ctx: RunContextWrapper[SyncContext], sha: str) -> str:
    """Fetch the diff for a specific commit SHA (first 3000 chars)."""
    c = ctx.context
    return await github.get_diff(c.github_token, c.github_owner, c.github_repo, sha)


@function_tool
async def get_open_prs(ctx: RunContextWrapper[SyncContext]) -> str:
    """List open pull requests in the GitHub repo."""
    c = ctx.context
    prs = await github.get_open_prs(c.github_token, c.github_owner, c.github_repo)
    return json.dumps(prs)


@function_tool
async def flag_scope_creep(ctx: RunContextWrapper[SyncContext], commit_sha: str, message: str) -> str:
    """Flag a commit as scope creep (no matching ticket). Call once per untracked commit."""
    ctx.context.scope_creep_commits.append(f"{commit_sha}: {message}")
    return json.dumps({"flagged": commit_sha})


@function_tool
async def flag_blocker(ctx: RunContextWrapper[SyncContext], ticket_id: str, title: str) -> str:
    """Flag a ticket as a blocker (no recent commit activity). Call once per stalled ticket."""
    ctx.context.blockers_flagged.append(f"{ticket_id}: {title}")
    return json.dumps({"flagged": ticket_id})


# ── Notion ───────────────────────────────────────────────────────────────────


@function_tool
async def get_notion_tickets(ctx: RunContextWrapper[SyncContext]) -> str:
    """List all tickets/pages from the Notion database."""
    c = ctx.context
    items = await notion.get_database_items(c.notion_token, c.notion_database_id)
    return json.dumps(items)


@function_tool
async def update_notion_status(
    ctx: RunContextWrapper[SyncContext], page_id: str, title: str, status: str
) -> str:
    """Update the Status property of a Notion page and record it as an updated ticket."""
    c = ctx.context
    result = await notion.update_page_status(c.notion_token, page_id, status)
    c.tickets_updated.append(f"{title} → {status}")
    return json.dumps(result)


@function_tool
async def add_notion_comment(ctx: RunContextWrapper[SyncContext], page_id: str, text: str) -> str:
    """Add a discussion comment to a Notion page."""
    c = ctx.context
    result = await notion.add_page_comment(c.notion_token, page_id, text)
    return json.dumps(result)


# ── Linear ───────────────────────────────────────────────────────────────────


@function_tool
async def get_linear_issues(ctx: RunContextWrapper[SyncContext]) -> str:
    """List open issues from the Linear team."""
    c = ctx.context
    issues = await linear.get_issues(c.linear_token, c.linear_team_id)
    return json.dumps(issues)


@function_tool
async def update_linear_issue(
    ctx: RunContextWrapper[SyncContext], issue_id: str, title: str, state_id: str
) -> str:
    """Update the state of a Linear issue and record it as an updated ticket."""
    c = ctx.context
    result = await linear.update_issue_state(c.linear_token, issue_id, state_id)
    c.tickets_updated.append(f"{title} (Linear)")
    return json.dumps(result)


@function_tool
async def add_linear_comment(ctx: RunContextWrapper[SyncContext], issue_id: str, text: str) -> str:
    """Add a comment to a Linear issue."""
    c = ctx.context
    result = await linear.add_issue_comment(c.linear_token, issue_id, text)
    return json.dumps(result)


# ── Slack ────────────────────────────────────────────────────────────────────


@function_tool
async def post_slack_message(ctx: RunContextWrapper[SyncContext], text: str) -> str:
    """Post a message to the configured Slack channel."""
    c = ctx.context
    result = await slack.post_message(c.slack_token, c.slack_channel, text)
    c.slack_summary = text
    return json.dumps(result)


# ── DB ───────────────────────────────────────────────────────────────────────


@function_tool
async def save_sync_event_tool(
    ctx: RunContextWrapper[SyncContext],
    event_type: str,
    payload: str,
) -> str:
    """Save a sync event to the database. payload must be a JSON string."""
    try:
        payload_dict = json.loads(payload)
    except json.JSONDecodeError:
        payload_dict = {"raw": payload}
    event_id = await db.save_sync_event(ctx.context.project_id, event_type, payload_dict)
    ctx.context.last_sync_event_id = event_id
    return json.dumps({"event_id": event_id})
