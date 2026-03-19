import httpx

BASE = "https://api.linear.app/graphql"


def _headers(token: str) -> dict:
    return {"Authorization": token, "Content-Type": "application/json"}


async def get_issues(token: str, team_id: str) -> list[dict]:
    query = """
    query($teamId: String!) {
      team(id: $teamId) {
        issues(first: 50, filter: { state: { type: { nin: ["completed", "cancelled"] } } }) {
          nodes { id title state { name } url }
        }
      }
    }
    """
    async with httpx.AsyncClient() as client:
        r = await client.post(BASE, headers=_headers(token), json={"query": query, "variables": {"teamId": team_id}})
        r.raise_for_status()
    data = r.json()
    nodes = data.get("data", {}).get("team", {}).get("issues", {}).get("nodes", [])
    return [{"id": n["id"], "title": n["title"], "state": n["state"]["name"], "url": n["url"]} for n in nodes]


async def update_issue_state(token: str, issue_id: str, state_id: str) -> dict:
    mutation = "mutation($id: String!, $stateId: String!) { issueUpdate(id: $id, input: { stateId: $stateId }) { success } }"
    async with httpx.AsyncClient() as client:
        r = await client.post(
            BASE,
            headers=_headers(token),
            json={"query": mutation, "variables": {"id": issue_id, "stateId": state_id}},
        )
        r.raise_for_status()
    return r.json().get("data", {}).get("issueUpdate", {})


async def add_issue_comment(token: str, issue_id: str, text: str) -> dict:
    mutation = "mutation($issueId: String!, $body: String!) { commentCreate(input: { issueId: $issueId, body: $body }) { success } }"
    async with httpx.AsyncClient() as client:
        r = await client.post(
            BASE,
            headers=_headers(token),
            json={"query": mutation, "variables": {"issueId": issue_id, "body": text}},
        )
        r.raise_for_status()
    return r.json().get("data", {}).get("commentCreate", {})
