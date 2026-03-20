import HeroSection from "@/components/sections/hero-section";
import LogoStrip from "@/components/sections/logo-strip";
import Features from "@/components/sections/features";
import BentoGrid from "@/components/sections/bento-grid";
import Pricing from "@/components/sections/pricing";
import CTA from "@/components/sections/cta";
import Footer from "@/components/footer";

const Page = () => {
  return (
    <main className="bg-[#09090f] text-white overflow-x-hidden">
      <HeroSection />
      <LogoStrip />
      <Features />
      <BentoGrid />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
};

export default Page;
