import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const OAUTH_URLS: Record<string, (projectId: string) => string> = {
  github: (projectId) =>
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo&state=${projectId}`,
  notion: (projectId) =>
    `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/notion/callback`)}&state=${projectId}`,
  slack: (projectId) =>
    `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=chat:write,channels:read&state=${projectId}`,
  linear: (projectId) =>
    `https://linear.app/oauth/authorize?client_id=${process.env.LINEAR_CLIENT_ID}&scope=issues:read,issues:write&response_type=code&state=${projectId}`,
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { provider } = await params;
  const projectId = req.nextUrl.searchParams.get("projectId");

  if (!projectId) {
    return new Response("Missing projectId", { status: 400 });
  }

  const oauthUrl = OAUTH_URLS[provider]?.(projectId);
  if (!oauthUrl) {
    return new Response(`Unknown provider: ${provider}`, { status: 400 });
  }

  redirect(oauthUrl);
}
