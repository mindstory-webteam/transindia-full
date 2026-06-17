// FILE LOCATION: components/Services/PersonalInsuranceServices.tsx
// insuranceData.ts lives at: app/our-services/insuranceData.ts
// Import via @/ alias (tsconfig paths must have "@/*": ["./src/*"] or ["/*"] depending on your setup)

import React from "react";
import Link from "next/link";
import { SERVICE_CARDS } from "@/app/our-services/insuranceData";

// ── If you get a module-not-found error, use a relative path instead:
// import { SERVICE_CARDS } from "../../app/our-services/insuranceData";

const PersonalInsuranceServices: React.FC = () => {
  return (
    <section className="bg-slate-50 py-16 px-6 md:px-12 pt-40">
      <div className="max-w-7xl mx-auto">
        <span className="inline-block bg-cyan-100 text-cyan-700 text-xs font-bold tracking-wider px-3 py-1.5 rounded-md mb-4">
          FOR INDIVIDUALS &amp; FAMILIES
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-10">
          Personal Insurance <span className="text-cyan-500">Services</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_CARDS.map((card) => (
            <div
              key={card.title}
              className="relative rounded-3xl overflow-hidden shadow-sm flex flex-col"
            >
              {/* Image panel */}
              <div
                className={`${card.iconBg} h-56 flex items-center justify-center relative z-0`}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Curved white content panel */}
              <div className="relative -mt-8 z-10 bg-white rounded-4xl p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900">
                    {card.title}
                  </h3>
                  <span
                    className={`${card.badgeColor} text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap`}
                  >
                    {card.badge}
                  </span>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {card.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {card.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <span className="text-emerald-500 flex-shrink-0">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Links to /our-services/[slug] */}
                <Link
                  href={`/our-services/${card.slug}`}
                  className={`${card.buttonColor} text-white font-semibold rounded-xl py-3 mt-auto transition-colors text-center block`}
                >
                  {card.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonalInsuranceServices;