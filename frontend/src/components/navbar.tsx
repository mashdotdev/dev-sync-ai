import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 lp-glass-nav transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-[#09090f]" />
          </div>
          <span className="font-semibold text-base tracking-tight text-white">
            DevSync<span className="text-[#6366f1] ml-0.5">AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm text-white/70 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#integrations" className="text-sm text-white/70 hover:text-white transition-colors">
            Integrations
          </Link>
          <Link href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="#docs" className="text-sm text-white/70 hover:text-white transition-colors">
            Docs
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="hidden sm:block text-sm text-white/70 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="bg-[#6366f1] hover:bg-[#6366f1]/90 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            Get Early Access
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
