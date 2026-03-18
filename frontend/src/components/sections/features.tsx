import { features } from "@/constants";
import React from "react";

const Features = () => {
  return (
    <section className="p-10 container mx-auto">
      <div>Benefits</div>
      <h1 className="text-5xl font-semibold mt-6">
        Why devs love this <br /> AI-Powered project manager
      </h1>

      <div className="mt-12 gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, des, title }) => (
          <div key={title} className="bg-white/2 rounded-xl p-6">
            <Icon />
            <h3 className="mt-4 mb-2">{title}</h3>
            <p className="text-muted-foreground">{des}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
