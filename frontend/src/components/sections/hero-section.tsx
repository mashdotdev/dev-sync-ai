import {
  ArrowRight,
  Lock,
  LayoutGrid,
  Home,
  FileText,
  Plug,
  Settings,
  Wand2,
  Copy,
  Send,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.12)_0%,transparent_70%)]" />
        <div className="absolute inset-0 lp-dot-grid" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-[#6366f1]/40 bg-[#6366f1]/10 text-[#6366f1] rounded-full px-3 py-1 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse" />
          <span className="text-xs font-medium uppercase tracking-[0.08em]">
            Now in private beta
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-6 leading-[1.1]">
          Your dev tools write <br className="hidden md:block" /> the client
          update.
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10">
          DevSync connects GitHub, Notion, Slack, and Linear — and generates
          polished progress reports autonomously. You just ship.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <a
            href="#"
            className="w-full sm:w-auto bg-[#6366f1] text-white text-sm font-medium rounded-lg px-6 py-3 flex items-center justify-center gap-2 lp-glow-btn hover:bg-[#6366f1]/90 transition-all"
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="w-full sm:w-auto bg-transparent border border-white/20 text-white/90 hover:bg-white/5 text-sm font-medium rounded-lg px-6 py-3 flex items-center justify-center transition-all"
          >
            See how it works
          </a>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex -space-x-3">
            {[
              "bg-indigo-900/50",
              "bg-indigo-800/50",
              "bg-indigo-700/50",
              "bg-indigo-600/50",
            ].map((bg, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full border border-[#09090f] ${bg} flex items-center justify-center`}
              >
                <svg
                  className="w-3 h-3 text-white/50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            ))}
          </div>
          <p className="text-sm text-white/60">
            Trusted by 300+ freelance engineers
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="w-full max-w-[1080px] rounded-xl border border-white/[0.07] bg-[#0d0d1a] lp-dash-shadow overflow-hidden lp-dash-fade">
          {/* macOS bar */}
          <div className="h-10 border-b border-white/5 flex items-center px-4 bg-white/[0.01]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            </div>
            <div className="flex-1 flex items-center justify-center gap-2 text-xs text-white/40 font-mono">
              <Lock className="w-3 h-3" />
              app.devsync.ai
            </div>
          </div>

          <div className="flex h-[500px]">
            {/* Sidebar */}
            <div className="w-16 border-r border-white/5 flex flex-col items-center py-4 gap-6 bg-[#09090f]/50">
              <div className="w-8 h-8 rounded bg-[#6366f1]/20 text-[#6366f1] flex items-center justify-center border border-[#6366f1]/30 mb-2">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div className="relative w-full flex justify-center">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#6366f1] rounded-r" />
                <div className="absolute inset-0 bg-white/5 pointer-events-none" />
                <Home className="w-5 h-5 text-[#6366f1]" />
              </div>
              <FileText className="w-5 h-5 text-white/40" />
              <Plug className="w-5 h-5 text-white/40" />
              <div className="mt-auto pb-4">
                <Settings className="w-5 h-5 text-white/40" />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 flex flex-col gap-6 bg-[#0d0d1a]">
              {/* Header row */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-white">
                    Overview
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Last synced: 2 min ago
                  </div>
                </div>
                <button className="bg-white/5 border border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-2">
                  <Wand2 className="w-3 h-3" />
                  Generate Report
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Reports Generated", value: "47", accent: false },
                  { label: "Active Integrations", value: "4", accent: false },
                  { label: "Commits This Week", value: "112", accent: false },
                  { label: "Pending Reviews", value: "3", accent: true },
                ].map(({ label, value, accent }) => (
                  <div
                    key={label}
                    className="bg-white/[0.02] border border-white/5 rounded-md p-4"
                  >
                    <div className="text-xs text-white/50 mb-1">{label}</div>
                    <div
                      className={`text-2xl font-semibold tracking-tight ${accent ? "text-[#22d3ee]" : "text-white"}`}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart + Report panel */}
              <div className="flex gap-6 flex-1 min-h-0">
                {/* Chart */}
                <div className="flex-1 border border-white/5 rounded-md bg-[#09090f]/50 p-4 flex flex-col overflow-hidden">
                  <div className="text-xs text-white/50 mb-4">
                    Activity (14 days)
                  </div>
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-full border-t border-white/5" />
                      ))}
                    </div>
                    <svg
                      viewBox="0 0 400 100"
                      className="absolute inset-0 w-full h-full"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="chartFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#6366f1"
                            stopOpacity="0.15"
                          />
                          <stop
                            offset="100%"
                            stopColor="#6366f1"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,80 C20,70 40,90 60,60 C80,30 100,50 120,40 C140,30 160,70 180,60 C200,50 220,20 240,30 C260,40 280,10 300,20 C320,30 340,60 360,50 C380,40 400,30 400,30 L400,100 L0,100 Z"
                        fill="url(#chartFill)"
                      />
                      <path
                        d="M0,80 C20,70 40,90 60,60 C80,30 100,50 120,40 C140,30 160,70 180,60 C200,50 220,20 240,30 C260,40 280,10 300,20 C320,30 340,60 360,50 C380,40 400,30 400,30"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2"
                        className="lp-chart-glow"
                      />
                      <circle
                        cx="280"
                        cy="10"
                        r="4"
                        fill="#0d0d1a"
                        stroke="#22d3ee"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* Report panel */}
                <div className="w-1/3 border border-white/5 rounded-md bg-white/[0.01] p-4 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xs text-white/50">Latest Report</div>
                    <div className="flex gap-2">
                      <Copy className="w-3.5 h-3.5 text-white/40" />
                      <Send className="w-3.5 h-3.5 text-white/40" />
                    </div>
                  </div>
                  <div className="flex-1 bg-[#09090f] rounded border border-white/5 p-3 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090f] z-10 pointer-events-none" />
                    <pre className="font-mono text-[10px] leading-relaxed text-white/70">
                      <span className="text-[#6366f1] font-medium">{`# Week 12 Update — Acme Corp\n\n`}</span>
                      <span className="text-[#22d3ee]">{`## Completed This Week\n`}</span>
                      {`• Implemented OAuth2 flow (PR #142)\n• Fixed memory leak in worker\n• Updated React to v18\n\n`}
                      <span className="text-[#22d3ee]">{`## In Progress\n`}</span>
                      {`• Stripe webhook integration\n• Dashboard analytics logic\n\n`}
                      <span className="text-white/30">{`Generating next sections...`}</span>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
