import json
import uuid
from datetime import timedelta, timezone, datetime

import asyncpg

from config import settings

_pool: asyncpg.Pool | None = None


async def create_pool() -> None:
    global _pool
    _pool = await asyncpg.create_pool(settings.database_url, min_size=1, max_size=10)


async def close_pool() -> None:
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


def _pool_required() -> asyncpg.Pool:
    if _pool is None:
        raise RuntimeError("DB pool not initialized")
    return _pool


async def get_integration_tokens(project_id: str) -> dict[str, dict]:
    """Return {provider: {token, ...metadata}} for all integrations on a project."""
    pool = _pool_required()
    rows = await pool.fetch(
        'SELECT type, "accessToken", metadata FROM integration WHERE "projectId" = $1',
        project_id,
    )
    result: dict[str, dict] = {}
    for row in rows:
        meta = {}
        if row["metadata"]:
            try:
                meta = json.loads(row["metadata"])
            except json.JSONDecodeError:
                pass
        result[row["type"]] = {"token": row["accessToken"], **meta}
    return result


async def save_sync_event(project_id: str, event_type: str, payload: dict) -> str:
    """Insert a SyncEvent row and return the new ID."""
    pool = _pool_required()
    event_id = str(uuid.uuid4())
    # Let DB supply createdAt via DEFAULT now()
    await pool.execute(
        'INSERT INTO sync_event (id, "projectId", type, payload) VALUES ($1, $2, $3, $4)',
        event_id,
        project_id,
        event_type,
        json.dumps(payload),
    )
    return event_id


async def save_report(project_id: str, content: str) -> str:
    """Insert a Report row and return the new ID."""
    pool = _pool_required()
    report_id = str(uuid.uuid4())
    # Let DB supply generatedAt via DEFAULT now()
    await pool.execute(
        'INSERT INTO report (id, "projectId", content) VALUES ($1, $2, $3)',
        report_id,
        project_id,
        content,
    )
    return report_id


async def get_sync_events(project_id: str, days: int = 7) -> list[dict]:
    """Fetch sync events from the last N days for a project."""
    pool = _pool_required()
    # Use interval arithmetic in SQL to avoid passing a datetime object
    rows = await pool.fetch(
        """
        SELECT id, type, payload, "createdAt"
        FROM sync_event
        WHERE "projectId" = $1
          AND "createdAt" >= now() - ($2::int * interval '1 day')
        ORDER BY "createdAt" DESC
        """,
        project_id,
        days,
    )
    events = []
    for row in rows:
        payload = {}
        if row["payload"]:
            try:
                payload = json.loads(row["payload"])
            except json.JSONDecodeError:
                pass
        events.append(
            {
                "id": row["id"],
                "type": row["type"],
                "payload": payload,
                "createdAt": row["createdAt"].isoformat(),
            }
        )
    return events
