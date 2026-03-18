import React from "react";

const CTA = () => {
  return (
    <section className="p-10 h-[50vh]">
      <div className="bg-white/2 size-full rounded-xl flex flex-col items-center justify-center gap-6">
        <h3 className="text-5xl lg:text-7xl ">Ready to claim your time?</h3>
        <p className="text-muted-foreground">
          Join over 1,500+ freelance developers who have automated their project
          management with DevSync AI.
        </p>
        <button className="bg-brand-primary text-white px-6 py-2 rounded-lg  font-semibold cursor-pointer transition-all transform hover:-translate-y-1">
          Start today
        </button>
      </div>
    </section>
  );
};

export default CTA;
