import { CheckCircle, Zap } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "For solo projects",
    features: ["1 project", "Basic syncing", "GitHub integration"],
    current: true,
    cta: "Current plan",
  },
  {
    name: "Pro",
    price: "$19",
    description: "For active freelancers",
    features: ["Unlimited projects", "All integrations", "PDF reports", "Priority support"],
    current: false,
    cta: "Upgrade to Pro",
  },
  {
    name: "Agency",
    price: "$49",
    description: "For teams & agencies",
    features: ["Everything in Pro", "Team members", "Client portal", "Custom reports"],
    current: false,
    cta: "Upgrade to Agency",
  },
];

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Billing</h1>
        <p className="text-sm text-white/50 mt-1">Manage your subscription plan.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl p-6 flex flex-col gap-5 relative overflow-hidden transition-colors ${
              plan.current
                ? "border border-[#6366f1]/50 bg-[#0d0d1a] shadow-[0_0_30px_rgba(99,102,241,0.06)]"
                : "border border-white/[0.07] bg-[#0d0d1a] hover:border-white/[0.12]"
            }`}
          >
            {plan.current && (
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#22d3ee]" />
            )}

            {/* Plan header */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-semibold text-white">{plan.name}</h3>
                {plan.current && (
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-[#6366f1] text-white px-1.5 py-0.5 rounded-sm">
                    Current
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-semibold tracking-tight text-white">{plan.price}</span>
                <span className="text-sm text-white/40">/mo</span>
              </div>
              <p className="text-xs text-white/40">{plan.description}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/5" />

            {/* Features */}
            <ul className="flex flex-col gap-2.5 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm text-white/70">
                  <CheckCircle className="size-4 text-[#6366f1] shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              disabled={plan.current}
              className={`w-full text-sm font-medium rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center gap-2 ${
                plan.current
                  ? "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
                  : "bg-[#6366f1] hover:bg-[#6366f1]/90 text-white lp-glow-btn"
              }`}
            >
              {!plan.current && <Zap className="size-3.5" />}
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-white/30">
        Stripe billing integration coming soon. Plans displayed above are for preview purposes.
      </p>
    </div>
  );
}
