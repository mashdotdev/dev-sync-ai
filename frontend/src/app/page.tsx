"use client";

import { authClient } from "@/utils/auth-client";

const Page = () => {
const handleCreateUser = async () => {
    await authClient.signUp.email({
      name: "Mashhood",
      email: "mashrtx7@gmail.com",
      password: "stringisking",
    });
  };

  const handleLoginUser = async () => {
    await authClient.signIn.email({
      email: "mashrtx7@gmail.com",
      password: "stringisking",
    });
  };

  return (
    <div className="space-x-16">
      <button onClick={handleCreateUser}>Create user</button>
      <button onClick={handleLoginUser}>Log in</button>
    </div>
  );
};

export default Page;
