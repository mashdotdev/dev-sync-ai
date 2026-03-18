import React from "react";

const HeroSection = () => {
  return (
    <div className="p-10">
      <div className="relative pt-32 pb-20 overflow-hidden min-h-screen rounded-xl bg-white/2">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Headline */}
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-brand-white leading-[1.1]">
              The AI Agent that manages your freelance workflow{" "}
              <span className="text-brand-primary">while you code.</span>
            </h1>
            <p className="mt-8 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Empower your productivity with DevSync AI. We sync your tools,
              update your clients, and handle the paperwork so you can focus on
              shipping.
            </p>
          </div>

          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button className="bg-brand-primary text-white px-6 py-2 rounded-lg  font-semibold cursor-pointer transition-all transform hover:-translate-y-1">
              Connect your tools
            </button>
            <button className="bg-brand-white text-brand-black px-6 py-2 rounded-lg font-semibold border border-slate-200 hover:bg-slate-50 transition-all">
              Book a Demo
            </button>
          </div>

          {/* Visual Element: AI Hub Visualization */}
          <div className="relative max-w-5xl mx-auto mt-96">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sync Card 1 */}
              <div
                className="glass-effect p-6 rounded-2xl shadow-xl border border-white/40 text-left animate-float"
                style={{ animationDelay: "0s" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 15h12v-2H6v2zm0-4h12V9H6v2zm0-4h12V5H6v2zm0 12h12v-2H6v2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sync Action
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Slack: Progress update posted
                </p>
                <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-full" />
                </div>
                <p className="mt-2 text-[10px] text-slate-400">
                  1 minute ago to #project-updates
                </p>
              </div>

              {/* Central AI Orb */}
              <div className="flex items-center justify-center relative py-12 md:py-0">
                <div className="w-32 h-32 rounded-full bg-linear-to-tr from-indigo-500 to-emerald-400 orb-glow animate-pulse flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Connecting Lines */}
                <svg
                  className="absolute inset-0 w-full h-full -z-10 opacity-20"
                  viewBox="0 0 400 400"
                >
                  <path
                    d="M200,200 L50,100"
                    stroke="#6366f1"
                    strokeDasharray="4"
                    strokeWidth="2"
                  />
                  <path
                    d="M200,200 L350,100"
                    stroke="#6366f1"
                    strokeDasharray="4"
                    strokeWidth="2"
                  />
                  <path
                    d="M200,200 L100,350"
                    stroke="#6366f1"
                    strokeDasharray="4"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Sync Card 2 */}
              <div
                className="glass-effect p-6 rounded-2xl shadow-xl border border-white/40 text-left animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Automation
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Linear: Ticket #102 moved to Done
                </p>
                <div className="mt-2 flex gap-1">
                  <span className="px-2 py-0.5 bg-slate-100 text-[10px] rounded text-slate-500">
                    Feature
                  </span>
                  <span className="px-2 py-0.5 bg-indigo-50 text-[10px] rounded text-indigo-600">
                    Automated
                  </span>
                </div>
                <p className="mt-2 text-[10px] text-slate-400">
                  Triggered by GitHub PR #42 merge
                </p>
              </div>
            </div>

            {/* PDF Preview Card */}
            <div
              className="mt-8 max-w-sm mx-auto glass-effect p-4 rounded-xl shadow-lg border border-white/40 animate-float"
              style={{ animationDelay: "2s" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-12 bg-rose-50 rounded flex items-center justify-center text-rose-500 border border-rose-100">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">
                    Monthly_Report_Nov.pdf
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Generated successfully for client &apos;Acme Corp&apos;
                  </p>
                </div>
                <button className="ml-auto text-indigo-600 text-xs font-medium">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
