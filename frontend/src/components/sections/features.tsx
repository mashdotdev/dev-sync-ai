import { Database, FilePlus, Upload, PenSquare, Paperclip, Ghost } from "lucide-react";

const featuresList = [
  {
    icon: Database,
    title: "Auto-sync from 4 tools",
    description:
      "Connect GitHub repos, Linear projects, and Notion boards once. We pull the data in real-time securely.",
  },
  {
    icon: FilePlus,
    title: "AI-written client reports",
    description:
      "Our tuned LLM translates commit messages and tickets into non-technical, client-friendly progress updates.",
  },
  {
    icon: Upload,
    title: "One-click export",
    description:
      "Generate beautiful PDFs, copy as Markdown, or sync the final report directly back into a shared Notion page.",
  },
  {
    icon: PenSquare,
    title: "Custom report templates",
    description:
      "Define the tone, structure, and sections. Want it brief and punchy? Or detailed and technical? You decide.",
  },
  {
    icon: Paperclip,
    title: "Direct Slack delivery",
    description:
      "Schedule reports to drop automatically into a shared client Slack channel at 5 PM every Friday.",
  },
  {
    icon: Ghost,
    title: "Zero manual input",
    description: `Never write "Fixed bugs and made improvements" again. Your actual work speaks for itself, translated.`,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="text-base text-white/60 max-w-xl mx-auto">
            Built specifically for technical freelancers and small agencies who
            want to eliminate administrative overhead.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuresList.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="p-6 rounded-xl border border-white/[0.07] bg-white/[0.01] hover:border-[#6366f1]/30 hover:bg-white/[0.02] transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center text-[#6366f1] mb-5">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-white mb-2">
                {title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
