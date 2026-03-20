import { CheckCircle } from "lucide-react";

const freelancerFeatures = [
  "Up to 4 reports per month",
  "Basic GitHub & Notion sync",
  "Standard report template",
];

const agencyFeatures = [
  "Unlimited reports",
  "All integrations (Slack, Linear included)",
  "Custom templates & branding",
  "Automated delivery schedules",
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-base text-white/60">
            Start for free. Upgrade when you need more capacity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Freelancer */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.01] p-8 flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-2">Freelancer</h3>
            <p className="text-sm text-white/60 mb-6">
              Perfect for solo developers managing 1-2 clients.
            </p>
            <div className="mb-8">
              <span className="text-4xl font-semibold tracking-tight text-white">$0</span>
              <span className="text-sm text-white/40">/mo</span>
            </div>
            <ul className="flex flex-col gap-4 mb-8 flex-1">
              {freelancerFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-white/70">
                  <CheckCircle className="w-4 h-4 text-[#6366f1] mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-lg px-4 py-3 transition-colors">
              Get Started
            </button>
          </div>

          {/* Agency */}
          <div className="rounded-xl border border-[#6366f1]/50 bg-[#0d0d1a] p-8 flex flex-col relative shadow-[0_0_40px_rgba(99,102,241,0.05)]">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#6366f1] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
              Most Popular
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Agency</h3>
            <p className="text-sm text-white/60 mb-6">
              For small teams handling multiple projects simultaneously.
            </p>
            <div className="mb-8">
              <span className="text-4xl font-semibold tracking-tight text-white">$29</span>
              <span className="text-sm text-white/40">/mo</span>
            </div>
            <ul className="flex flex-col gap-4 mb-8 flex-1">
              {agencyFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-white/70">
                  <CheckCircle className="w-4 h-4 text-[#6366f1] mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full bg-[#6366f1] hover:bg-[#6366f1]/90 text-white text-sm font-medium rounded-lg px-4 py-3 lp-glow-btn transition-colors">
              Upgrade to Agency
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
