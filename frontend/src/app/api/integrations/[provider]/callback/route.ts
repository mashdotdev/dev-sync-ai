import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import db from "@/utils/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { provider } = await params;
  const code = req.nextUrl.searchParams.get("code");
  const projectId = req.nextUrl.searchParams.get("state");

  if (!code || !projectId) {
    redirect(`/dashboard/integrations?error=missing_params`);
  }

  const project = await db.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project) {
    redirect(`/dashboard/integrations?error=invalid_project`);
  }

  // TODO: Exchange code for access token via provider's token endpoint
  // For now, store a placeholder token to show the connected state
  await db.integration.upsert({
    where: { projectId_type: { projectId, type: provider } },
    create: {
      userId: session.user.id,
      projectId,
      type: provider,
      accessToken: `placeholder_${code}`,
    },
    update: {
      accessToken: `placeholder_${code}`,
    },
  });

  redirect(`/dashboard/integrations?connected=${provider}`);
}
