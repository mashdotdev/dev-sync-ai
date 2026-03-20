import { Code2, BookOpen, Hash, GitBranch } from "lucide-react";

const tools = [
  { icon: Code2, label: "GitHub" },
  { icon: BookOpen, label: "Notion" },
  { icon: Hash, label: "Slack" },
  { icon: GitBranch, label: "Linear" },
];

const LogoStrip = () => {
  return (
    <section className="py-12 border-y border-white/[0.04] bg-white/[0.01]">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center">
        <p className="text-sm text-white/40 mb-8 tracking-tight text-center">
          Your data flows seamlessly from the tools you already use.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 hover:opacity-100 transition-all duration-500">
          {tools.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-xl font-medium tracking-tight text-white"
            >
              <Icon className="w-6 h-6" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoStrip;
