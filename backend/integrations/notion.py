import httpx

BASE = "https://api.notion.com/v1"
NOTION_VERSION = "2022-06-28"


def _headers(token: str) -> dict:
    return {
        "Authorization": f"Bearer {token}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    }


async def get_database_items(token: str, database_id: str) -> list[dict]:
    async with httpx.AsyncClient() as client:
        r = await client.post(
            f"{BASE}/databases/{database_id}/query",
            headers=_headers(token),
            json={"page_size": 50},
            timeout=30.0,
        )
        if not r.is_success:
            raise ValueError(f"Notion API {r.status_code}: {r.text}")
    items = []
    for page in r.json().get("results", []):
        props = page.get("properties", {})
        title_prop = next(
            (v for v in props.values() if v.get("type") == "title"),
            {},
        )
        title = "".join(t["plain_text"] for t in title_prop.get("title", []))
        status_prop = next(
            (v for k, v in props.items() if v.get("type") in ("select", "status")),
            {},
        )
        status_val = (status_prop.get("select") or status_prop.get("status") or {}).get("name", "")
        items.append({"id": page["id"], "title": title, "status": status_val, "url": page["url"]})
    return items


async def update_page_status(token: str, page_id: str, status: str, prop_name: str = "Status") -> dict:
    async with httpx.AsyncClient() as client:
        # Try Notion `status` type first, fall back to `select`
        for payload_type in ("status", "select"):
            r = await client.patch(
                f"{BASE}/pages/{page_id}",
                headers=_headers(token),
                json={"properties": {prop_name: {payload_type: {"name": status}}}},
            )
            if r.is_success:
                return {"ok": True, "page_id": page_id, "status": status, "type": payload_type}
    raise ValueError(f"Notion update failed ({r.status_code}): {r.text}")


async def add_page_comment(token: str, page_id: str, text: str) -> dict:
    async with httpx.AsyncClient() as client:
        r = await client.post(
            f"{BASE}/comments",
            headers=_headers(token),
            json={"parent": {"page_id": page_id}, "rich_text": [{"text": {"content": text}}]},
        )
        r.raise_for_status()
    return {"ok": True, "comment_id": r.json().get("id")}
