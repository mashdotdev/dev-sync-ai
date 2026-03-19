import json
import logging

import httpx
from fastapi import APIRouter, HTTPException

import db
from config import settings
from schemas import GenerateReportRequest, GenerateReportResponse

logger = logging.getLogger(__name__)
router = APIRouter()

REPORT_PROMPT = """You are a technical project manager. Below are recent sync events for a project.
Synthesise them into a concise, client-ready markdown report covering:
- Overall project health
- Tickets completed this period
- Active blockers
- Scope creep / untracked work
- Recommendations

Be factual. Use bullet points and headers. Keep it under 600 words."""


@router.post("/generate", response_model=GenerateReportResponse)
async def generate_report(req: GenerateReportRequest):
    events = await db.get_sync_events(req.project_id, days=req.days)
    if not events:
        raise HTTPException(status_code=404, detail="No sync events found for the requested period")

    events_text = json.dumps(events, indent=2)
    user_message = f"Sync events (last {req.days} days):\n\n{events_text}\n\nGenerate the report."

    # Direct Anthropic API call — no agent overhead needed for a simple generation
    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": settings.anthropic_api_key,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json",
            },
            json={
                "model": "claude-sonnet-4-6",
                "max_tokens": 1024,
                "system": REPORT_PROMPT,
                "messages": [{"role": "user", "content": user_message}],
            },
            timeout=60.0,
        )
        r.raise_for_status()

    content = r.json()["content"][0]["text"]
    report_id = await db.save_report(req.project_id, content)
    return GenerateReportResponse(content=content, report_id=report_id)
