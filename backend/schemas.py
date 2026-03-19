from typing import Literal
from pydantic import BaseModel


class SyncResult(BaseModel):
    tickets_updated: list[str]
    blockers_flagged: list[str]
    scope_creep_commits: list[str]
    slack_summary: str
    sync_event_id: str


class SyncTriggerRequest(BaseModel):
    project_id: str
    trigger_type: Literal["manual", "webhook", "scheduled"] = "manual"


class SyncTriggerResponse(BaseModel):
    success: bool
    result: SyncResult | None = None
    error: str | None = None


class GenerateReportRequest(BaseModel):
    project_id: str
    days: int = 7


class GenerateReportResponse(BaseModel):
    content: str
    report_id: str
