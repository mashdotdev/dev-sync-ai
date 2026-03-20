import { Wand2, Code2, BookOpen, Hash, GitBranch, Code, FileText } from "lucide-react";

const BentoGrid = () => {
  return (
    <section id="integrations" className="py-12 pb-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Left tall card — raw code to plain English */}
          <div className="col-span-1 md:col-span-5 rounded-xl border border-white/[0.07] bg-[#0d0d1a] p-8 flex flex-col relative overflow-hidden hover:border-white/20 transition-colors">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#22d3ee] opacity-50" />
            <h3 className="text-xl font-semibold tracking-tight text-white mb-1">
              From raw code to plain English
            </h3>
            <p className="text-sm text-white/60 mb-8">
              We parse the technical jargon so your clients don&apos;t have to.
            </p>

            <div className="flex-1 bg-[#09090f] rounded-md border border-white/5 p-4 font-mono text-xs overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090f] z-10 pointer-events-none" />

              <div className="text-white/40 mb-2">Raw Git Commit:</div>
              <div className="text-[#22d3ee] mb-6">
                feat(auth): implement jwt refresh rotation logic, fix #402
              </div>

              <div className="flex items-center gap-2 text-white/40 mb-2">
                <Wand2 className="w-3 h-3" />
                DevSync Output:
              </div>
              <div className="text-white/80 leading-relaxed">
                &quot;Enhanced system security by updating how user login sessions
                are handled behind the scenes. Users will now stay logged in
                more reliably without compromising safety.&quot;
              </div>

              <div className="mt-6 w-full h-px bg-white/5" />

              <div className="text-white/40 mb-2 mt-4">Linear Ticket:</div>
              <div className="text-[#6366f1]">
                ENG-891: Refactor datagrid pagination offset limits
              </div>
            </div>
          </div>

          {/* Right column — stacked cards */}
          <div className="col-span-1 md:col-span-7 flex flex-col gap-6">

            {/* Real-time connection status */}
            <div className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.01] p-8 flex flex-col justify-center relative overflow-hidden hover:border-white/20 transition-colors">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#6366f1]/5 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-xl font-semibold tracking-tight text-white mb-6 relative z-10">
                Real-time connection status
              </h3>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                {/* GitHub */}
                <div className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Code2 className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">GitHub</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    Connected
                  </div>
                </div>

                {/* Notion */}
                <div className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Notion</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    Connected
                  </div>
                </div>

                {/* Slack — toggle on */}
                <div className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Slack</span>
                  </div>
                  <div className="relative w-8 h-4">
                    <div className="absolute inset-0 bg-[#6366f1] rounded-full border border-[#6366f1]/50" />
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>

                {/* Linear — not connected */}
                <div className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <GitBranch className="w-4 h-4 text-white/30" />
                    <span className="text-sm font-medium text-white/50">Linear</span>
                  </div>
                  <button className="text-xs text-[#6366f1] hover:text-white transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            </div>

            {/* Flow diagram */}
            <div className="h-48 rounded-xl border border-white/[0.07] bg-[#0d0d1a] p-6 flex items-center justify-center relative hover:border-white/20 transition-colors">
              <div className="flex items-center w-full justify-between max-w-xs mx-auto relative z-10">
                <div className="w-12 h-12 rounded-lg bg-[#09090f] border border-white/10 flex items-center justify-center text-white/60">
                  <Code className="w-5 h-5" />
                </div>

                <div className="flex-1 mx-2 relative h-px bg-white/10">
                  <div className="absolute inset-0 flex justify-around items-center">
                    {[0, 0.5, 1].map((delay) => (
                      <span
                        key={delay}
                        className="w-1 h-1 rounded-full bg-[#6366f1] animate-ping"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="w-14 h-14 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/30 flex items-center justify-center text-[#6366f1] shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <span className="text-xs font-semibold tracking-tight">AI</span>
                </div>

                <div className="flex-1 mx-2 h-px bg-white/10" />

                <div className="w-12 h-12 rounded-lg bg-[#09090f] border border-white/10 flex items-center justify-center text-white/60">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <div className="absolute bottom-4 w-full text-center text-xs text-white/40 tracking-widest font-medium uppercase">
                Fully Autonomous Flow
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
