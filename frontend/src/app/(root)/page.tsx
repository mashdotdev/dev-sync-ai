import CTA from "@/components/sections/cta";
import Features from "@/components/sections/features";
import HeroSection from "@/components/sections/hero-section";

const Page = () => {
  return (
    <main
      className="bg-brand-black font-sans text-brand-white"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage: `
       radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
       radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
     `,
        backgroundSize: "10px 10px",
        imageRendering: "pixelated",
      }}
    >
      <HeroSection />
      <Features />
      <CTA />
    </main>
  );
};

export default Page;
