// FILE LOCATION: components/Services/PersonalInsuranceServices.tsx

import React from "react";
import Link from "next/link";
import {
  INSURANCE_DATA,
  InsuranceDetailData,
} from "../../app/our-services/insuranceData";

// ─── Resolve image URL ────────────────────────────────────────────────────────
// Local paths like "/images/..." live in the Next.js /public folder and must be
// served as-is. Only backend upload paths (e.g. "/uploads/...") need the API
// server root prepended.
function resolveImageUrl(image: string): string {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;

  // Next.js public assets — serve directly, do NOT prefix with API server
  if (image.startsWith("/images")) return image;

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:5000/api";

  const serverRoot = API_BASE.replace(/\/api\/?$/, "");
  return `${serverRoot}${image.startsWith("/") ? "" : "/"}${image}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
const PersonalInsuranceServices = () => {
  // All cards are derived directly from INSURANCE_DATA
  const services: InsuranceDetailData[] = Object.values(INSURANCE_DATA);

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
          {services.map((service) => {
            const imgSrc = resolveImageUrl(service.whyImage);
            // First 4 benefit titles become the feature checklist
            const features = service.benefits
              .slice(0, 4)
              .map((b) => b.title);
            const primaryStat = service.heroStats?.[0];

            return (
              <div
                key={service.slug}
                className="relative rounded-3xl overflow-hidden shadow-sm flex flex-col"
              >
                {/* Image panel — whyImage from INSURANCE_DATA */}
                <div
                  className="h-56 flex items-center justify-center relative z-0 px-6 pt-6 pb-12"
                  style={{ backgroundColor: service.heroBadgeBg }}
                >
                  {imgSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgSrc}
                      alt={service.heroBadgeText}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-5xl select-none opacity-30">🛡️</span>
                  )}
                </div>

                {/* Content panel */}
                <div className="relative -mt-8 z-10 bg-white rounded-4xl p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold text-slate-900">
                      {service.heroBadgeText}
                    </h3>
                    {primaryStat && (
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap"
                        style={{
                          backgroundColor: service.heroBadgeBg,
                          color: service.heroBadgeColor,
                        }}
                      >
                        {primaryStat.value} {primaryStat.label}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    {service.heroSubtitle}
                  </p>

                  {features.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-slate-700"
                        >
                          <span className="text-emerald-500 flex-shrink-0">
                            ✓
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href={`/our-services/${service.slug}`}
                    className="text-white font-semibold rounded-xl py-3 mt-auto transition-opacity hover:opacity-90 text-center block"
                    style={{ backgroundColor: service.heroCtaBg }}
                  >
                    {service.heroCtaLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PersonalInsuranceServices;