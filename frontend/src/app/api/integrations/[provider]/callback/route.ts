import { auth } from "@/utils/auth";
import db from "@/utils/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

// ── Token exchange helpers ────────────────────────────────────────────────────

async function exchangeGitHub(code: string): Promise<{ token: string; owner: string; login: string }> {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error_description ?? data.error);

  // Fetch user to get login (owner)
  const user = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${data.access_token}` },
  }).then((r) => r.json());

  return { token: data.access_token, owner: user.login, login: user.login };
}

async function exchangeNotion(code: string): Promise<{ token: string }> {
  const credentials = Buffer.from(
    `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
  ).toString("base64");
  const res = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ grant_type: "authorization_code", code, redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/notion/callback` }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return { token: data.access_token };
}

async function exchangeSlack(code: string): Promise<{ token: string; teamId: string }> {
  const res = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.SLACK_CLIENT_ID ?? "",
      client_secret: process.env.SLACK_CLIENT_SECRET ?? "",
      code,
    }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error);
  return { token: data.access_token, teamId: data.team?.id ?? "" };
}

async function exchangeLinear(code: string): Promise<{ token: string }> {
  const res = await fetch("https://api.linear.app/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.LINEAR_CLIENT_ID ?? "",
      client_secret: process.env.LINEAR_CLIENT_SECRET ?? "",
      code,
      grant_type: "authorization_code",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/linear/callback`,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return { token: data.access_token };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { provider } = await params;
  const code = req.nextUrl.searchParams.get("code");
  const projectId = req.nextUrl.searchParams.get("state");

  if (!code || !projectId) redirect(`/dashboard/integrations?error=missing_params`);

  const project = await db.project.findFirst({
    where: { id: projectId!, userId: session.user.id },
  });
  if (!project) redirect(`/dashboard/integrations?error=invalid_project`);

  try {
    let accessToken = "";
    let metadata: Record<string, string> = {};

    switch (provider) {
      case "github": {
        const result = await exchangeGitHub(code!);
        accessToken = result.token;
        metadata = { owner: result.owner };
        break;
      }
      case "notion": {
        const result = await exchangeNotion(code!);
        accessToken = result.token;
        break;
      }
      case "slack": {
        const result = await exchangeSlack(code!);
        accessToken = result.token;
        metadata = { teamId: result.teamId };
        break;
      }
      case "linear": {
        const result = await exchangeLinear(code!);
        accessToken = result.token;
        break;
      }
      default:
        redirect(`/dashboard/integrations?error=unknown_provider`);
    }

    await db.integration.upsert({
      where: { projectId_type: { projectId: projectId!, type: provider } },
      create: {
        userId: session.user.id,
        projectId: projectId!,
        type: provider,
        accessToken,
        metadata: Object.keys(metadata).length ? JSON.stringify(metadata) : null,
      },
      update: {
        accessToken,
        metadata: Object.keys(metadata).length ? JSON.stringify(metadata) : undefined,
      },
    });
  } catch (err) {
    console.error(`[integrations/${provider}/callback]`, err);
    redirect(`/dashboard/integrations?error=token_exchange_failed`);
  }

  redirect(`/dashboard/integrations?connected=${provider}`);
}
