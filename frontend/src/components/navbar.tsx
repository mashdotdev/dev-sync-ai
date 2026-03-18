const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-effect px-6 py-3 rounded-full text-brand-white backdrop-blur-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">D</span>
          </div>
          <span className="font-bold text-lg tracking-tight">DevSync AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-white">
          <a className="hover:text-brand-primary transition-colors" href="#">
            Product
          </a>
          <a className="hover:text-brand-primary transition-colors" href="#">
            Pricing
          </a>
          <a className="hover:text-brand-primary transition-colors" href="#">
            Docs
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            className="text-sm font-medium text-brand-white hover:text-slate-900"
            href="#"
          >
            Sign in
          </a>
          <button className="bg-brand-white text-brand-black px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
