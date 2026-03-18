import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/");

  return (
    <div className="min-h-screen flex">
      {/* Branding panel — hidden on mobile */}
      <div className="hidden lg:flex flex-1 flex-col p-10 relative overflow-hidden">
        {/* Subtle gradient background */}
        {/* <div className="absolute inset-0 bg-linear-to-br from-[#0d0f17] via-[#111420] to-[#0d0f17]" />
        <div className="absolute top-0 left-0 w-125 h-125 rounded-full bg-blue-600/5 blur-3xl -translate-x-1/2 -translate-y-1/2" /> */}

        {/* Logo */}
        <div className="relative flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 9h5M10 9h5M9 3v5M9 10v5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M5 5l2 2M11 11l2 2M13 5l-2 2M7 11l-2 2"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-brand-black font-semibold text-base tracking-tight">
            DevSync AI
          </span>
        </div>

        {/* Headline copy */}
        <div className="relative z-10 space-y-5 mt-24">
          <h1 className="text-7xl font-bold leading-[1.1] tracking-tight text-brand-black">
            Your workflow.
            <br />
            <span className="text-[#CC7178]">Synced.</span>
            <br />
            Automatically.
          </h1>
          <p className="text-[#8b90a0] text-base leading-relaxed max-w-sm">
            DevSync AI connects your tools and keeps everything updated — so you
            never write another status update again. Join 10,000+ engineers
            streamlining their cycle.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-4 text-[#4a4f62] text-sm mt-auto">
          <span>© 2024 DevSync AI</span>
          <span className="text-[#2a2f42]">·</span>
          <a href="#" className="hover:text-[#8b90a0] transition-colors">
            Privacy
          </a>
          <span className="text-[#2a2f42]">·</span>
          <a href="#" className="hover:text-[#8b90a0] transition-colors">
            Security
          </a>
        </div>
      </div>

      {/* Auth form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
