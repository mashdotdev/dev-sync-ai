import { auth } from "@/utils/auth";
import { headers } from "next/headers";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  return <div>{session?.user.name}</div>;
};

export default Page;
