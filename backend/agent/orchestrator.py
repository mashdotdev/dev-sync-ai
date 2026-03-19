"""
DevSync Orchestrator — Gemini agent with all integration tools.
Results are accumulated in SyncContext as tools run, so the router
doesn't need to parse the model's final text response.
"""

from agents import Agent
from agents.extensions.models.litellm_model import LitellmModel  # type: ignore[import]

from config import settings

from .tools import (
    add_linear_comment,
    add_notion_comment,
    flag_blocker,
    flag_scope_creep,
    get_github_commits,
    get_github_diff,
    get_linear_issues,
    get_notion_tickets,
    get_open_prs,
    post_slack_message,
    save_sync_event_tool,
    update_linear_issue,
    update_notion_status,
)

SYSTEM_PROMPT = """You are DevSync, an AI agent that keeps software projects in sync.

Your job every run:
1. Call get_github_commits with since = 7 days ago (ISO-8601).
2. Call get_notion_tickets and/or get_linear_issues to get open tickets.
3. Cross-reference commits with tickets by keyword or ticket ID in commit message.
4. For each matched ticket: call update_notion_status or update_linear_issue, then add_notion_comment or add_linear_comment.
5. For each commit with NO matching ticket: call flag_scope_creep.
6. For each ticket with NO recent commits: call flag_blocker.
7. Call post_slack_message with a human-readable summary.
8. Call save_sync_event_tool with event_type="sync_complete" and a JSON payload.

Use every relevant tool. Do not skip steps."""


def build_agent() -> Agent:
    model = LitellmModel(
        model="gemini/gemini-2.5-flash",
        api_key=settings.gemini_api_key,
    )
    return Agent(
        name="DevSync Orchestrator",
        model=model,
        instructions=SYSTEM_PROMPT,
        tools=[
            get_github_commits,
            get_github_diff,
            get_open_prs,
            get_notion_tickets,
            update_notion_status,
            add_notion_comment,
            get_linear_issues,
            update_linear_issue,
            add_linear_comment,
            flag_scope_creep,
            flag_blocker,
            post_slack_message,
            save_sync_event_tool,
        ],
    )


# Singleton — reused across requests
devsync_agent = build_agent()
