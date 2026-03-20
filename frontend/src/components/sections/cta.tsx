const CTA = () => {
  return (
    <section className="py-24 border-y border-white/[0.06] relative overflow-hidden bg-[#0a0a14]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_50%)]" />
      <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">
          Stop writing updates. Start shipping.
        </h2>
        <p className="text-base text-white/60 mb-10">
          Free during beta — no credit card required.
        </p>
        <a
          href="#"
          className="inline-flex items-center justify-center bg-[#6366f1] text-white text-sm font-medium rounded-lg px-8 py-3 lp-glow-btn hover:bg-[#6366f1]/90 transition-all"
        >
          Get Early Access
        </a>
      </div>
    </section>
  );
};

export default CTA;
