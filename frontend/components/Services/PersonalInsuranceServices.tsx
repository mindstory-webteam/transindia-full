// FILE LOCATION: components/Services/PersonalInsuranceServices.tsx

import React from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ServiceCard {
  slug: string;
  image: string;
  iconBg: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonColor: string;
  serviceType: string;
}

// ─── Resolve image URL ────────────────────────────────────────────────────────
// Three cases:
//  1. Full Cloudinary URL  (https://res.cloudinary.com/...)  → use as-is
//  2. Relative /uploads/…  (legacy local storage)            → prepend backend base
//  3. Empty / null                                           → return "" → show placeholder
function resolveImageUrl(image: string): string {
  if (!image) return "";

  // Already a full URL (Cloudinary or any https link)
  if (image.startsWith("http://") || image.startsWith("https://")) return image;

  // Relative path — prefix with the backend server root (not /api)
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:5000/api";

  const serverRoot = API_BASE.replace(/\/api\/?$/, "");
  return `${serverRoot}${image.startsWith("/") ? "" : "/"}${image}`;
}

// ─── Server-side fetch ────────────────────────────────────────────────────────
async function fetchPersonalServices(): Promise<ServiceCard[]> {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:5000/api";

  try {
    const res = await fetch(`${API_BASE}/services`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    const all: ServiceCard[] = Array.isArray(json?.data) ? json.data : [];
    return all.filter((s) => s.serviceType === "personal");
  } catch {
    return [];
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const PersonalInsuranceServices = async () => {
  const cards = await fetchPersonalServices();

  return (
    <section className="bg-slate-50 py-16 px-6 md:px-12 pt-40">
      <div className="max-w-7xl mx-auto">
        <span className="inline-block bg-cyan-100 text-cyan-700 text-xs font-bold tracking-wider px-3 py-1.5 rounded-md mb-4">
          FOR INDIVIDUALS &amp; FAMILIES
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-10">
          Personal Insurance <span className="text-cyan-500">Services</span>
        </h2>

        {cards.length === 0 ? (
          <p className="text-slate-400 text-sm">No services available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => {
              const imgSrc = resolveImageUrl(card.image);
              return (
                <div
                  key={card.slug}
                  className="relative rounded-3xl overflow-hidden shadow-sm flex flex-col"
                >
                  {/* Image panel */}
                  <div className={`${card.iconBg} h-56 flex items-center justify-center relative z-0`}>
                    {imgSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgSrc}
                        alt={card.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-5xl select-none opacity-30">🛡️</span>
                    )}
                  </div>

                  {/* Content panel */}
                  <div className="relative -mt-8 z-10 bg-white rounded-4xl p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                      {card.badge && (
                        <span className={`${card.badgeColor} text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap`}>
                          {card.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                      {card.description}
                    </p>

                    {card.features?.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {card.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                            <span className="text-emerald-500 flex-shrink-0">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                  <Link
  href={`/our-services/${card.slug}`}
  className="bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl py-3 mt-auto transition-colors text-center block"
>
  Know More
</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PersonalInsuranceServices;