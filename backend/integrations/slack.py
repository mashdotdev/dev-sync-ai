import httpx

BASE = "https://slack.com/api"


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


async def post_message(token: str, channel: str, text: str) -> dict:
    async with httpx.AsyncClient() as client:
        r = await client.post(
            f"{BASE}/chat.postMessage",
            headers=_headers(token),
            json={"channel": channel, "text": text},
        )
        r.raise_for_status()
    data = r.json()
    if not data.get("ok"):
        raise ValueError(f"Slack error: {data.get('error')}")
    return {"ok": True, "ts": data.get("ts")}


async def list_channels(token: str) -> list[dict]:
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{BASE}/conversations.list",
            headers=_headers(token),
            params={"limit": 100, "exclude_archived": True},
        )
        r.raise_for_status()
    data = r.json()
    if not data.get("ok"):
        raise ValueError(f"Slack error: {data.get('error')}")
    return [{"id": c["id"], "name": c["name"]} for c in data.get("channels", [])]
