from datetime import datetime, timedelta, timezone

import httpx

BASE = "https://api.github.com"


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"}


async def get_commits(token: str, owner: str, repo: str, since_iso: str | None = None) -> list[dict]:
    if not since_iso:
        since_iso = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    params = {"since": since_iso, "per_page": 30}
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{BASE}/repos/{owner}/{repo}/commits", headers=_headers(token), params=params)
        r.raise_for_status()
    return [
        {
            "sha": c["sha"][:8],
            "message": c["commit"]["message"].split("\n")[0],
            "author": c["commit"]["author"]["name"],
            "url": c["html_url"],
        }
        for c in r.json()
    ]


async def get_diff(token: str, owner: str, repo: str, sha: str) -> str:
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{BASE}/repos/{owner}/{repo}/commits/{sha}",
            headers={**_headers(token), "Accept": "application/vnd.github.diff"},
        )
        r.raise_for_status()
    return r.text[:3000]


async def get_open_prs(token: str, owner: str, repo: str) -> list[dict]:
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{BASE}/repos/{owner}/{repo}/pulls",
            headers=_headers(token),
            params={"state": "open", "per_page": 20},
        )
        r.raise_for_status()
    return [
        {"number": pr["number"], "title": pr["title"], "author": pr["user"]["login"], "url": pr["html_url"]}
        for pr in r.json()
    ]
