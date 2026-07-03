import {
  Umbrella,
  HeartPulse,
  Car,
  Home,
  Plane,
  Building2,
  type LucideIcon,
} from "lucide-react";

interface ClaimCategory {
  title: string;
  description: string;
  features: string[];
  badge: string;
  icon: LucideIcon;
  image: string;
  gradientColor: string;
  iconWrapClass: string;
  iconColorClass: string;
  badgeClass: string;
}

const claimCategories: ClaimCategory[] = [
  {
    title: "Life Insurance Claims",
    description:
      "Death claims, maturity claims, surrender claims. We prepare documentation, submit to insurer, and follow up until settlement.",
    features: [
      "Death benefit claim",
      "Maturity / survival benefits",
      "Policy surrender",
      "Accidental death rider",
    ],
    badge: "Settlement : 30 days",
    icon: Umbrella,
    image: "/images/claims/MAKE A CLAIM/Life Insurance Claims.png",
    gradientColor: "#F9FFC7",
    iconWrapClass: "bg-white",
    iconColorClass: "text-indigo-500",
    badgeClass: "bg-amber-100 text-amber-700",
  },
  {
    title: "Health Insurance Claims",
    description:
      "Cashless hospitalisation, reimbursement, pre/post hospitalisation, and critical illness claims managed end-to-end.",
    features: [
      "Cashless hospitalisation",
      "Reimbursement claims",
      "Critical illness claim",
      "Day-care procedures",
    ],
    badge: "Settlement : 7 days",
    icon: HeartPulse,
    image: "/images/claims/MAKE A CLAIM/Health Insurance Claims.png",
    gradientColor: "#FFC8CC",
    iconWrapClass: "bg-white",
    iconColorClass: "text-rose-500",
    badgeClass: "bg-pink-100 text-pink-700",
  },
  {
    title: "Motor Insurance Claims",
    description:
      "Accident, theft, and third-party claims. We arrange surveyor, coordinate with garages, and track your claim status daily.",
    features: [
      "Own damage claim",
      "Third-party liability",
      "Theft / total loss",
      "Roadside assistance",
    ],
    badge: "Settlement : 15 days",
    icon: Car,
    image: "/images/claims/MAKE A CLAIM/Motor Insurance Claims.png",
    gradientColor: "#FFE1F3",
    iconWrapClass: "bg-white",
    iconColorClass: "text-rose-500",
    badgeClass: "bg-rose-100 text-rose-700",
  },
  {
    title: "Home / Property Claims",
    description:
      "Fire, flood, burglary, natural calamities. We document damage, coordinate with surveyors, and push for fair assessment.",
    features: [
      "Fire & natural perils",
      "Burglary / theft",
      "Flood damage",
      "Contents cover",
    ],
    badge: "Settlement : 21 days",
    icon: Home,
    image: "/images/claims/MAKE A CLAIM/Home  Property Claims.png",
    gradientColor: "#E6FFD2",
    iconWrapClass: "bg-white",
    iconColorClass: "text-emerald-500",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Travel Insurance Claims",
    description:
      "Trip cancellation, medical abroad, lost baggage, flight delay claims — all handled with international insurer coordination.",
    features: [
      "Trip cancellation",
      "Medical emergency abroad",
      "Lost / delayed baggage",
      "Flight delay compensation",
    ],
    badge: "Settlement : 10 days",
    icon: Plane,
    image: "/images/claims/MAKE A CLAIM/Travel Insurance Claims.png",
    gradientColor: "#D8DFFF",
    iconWrapClass: "bg-white",
    iconColorClass: "text-sky-500",
    badgeClass: "bg-sky-100 text-sky-700",
  },
  {
    title: "Commercial / Business Claims",
    description:
      "Business interruption, liability, marine, and employees benefits claims for corporate policyholders.",
    features: [
      "Business interruption",
      "Public liability",
      "Marine cargo",
      "Group health claims",
    ],
    badge: "Dedicated RM",
    icon: Building2,
    image: "/images/claims/MAKE A CLAIM/Commercial  Business Claims.png",
    gradientColor: "#FFFAE1",
    iconWrapClass: "bg-white",
    iconColorClass: "text-amber-500",
    badgeClass: "bg-amber-100 text-amber-700",
  },
];

export default function InsuranceClaimsSection() {
  return (
    <section className="bg-[#F8FAFF] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-10 sm:mb-12 max-w-2xl text-center px-4">
          <p className="mb-3 mx-auto inline-flex items-center justify-center text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#B74E3B] bg-[#FEF0ED] rounded-2xl px-3 h-7">
            What we handle
          </p>
          <h2
            className="font-extrabold tracking-tight text-slate-900 text-2xl sm:text-3xl lg:text-[38px] leading-tight"
            style={{ fontFamily: 'var(--font-sora), "Sora", sans-serif' }}
          >
            Every type of{" "}
            <span className="text-orange-500">insurance claim</span>
          </h2>
          <p
            className="mt-3 sm:mt-4 sm:text-base leading-relaxed"
            style={{ color: "#535862", fontSize: "18px" }}
          >
            Whether it&apos;s a life, health, motor, or property claim — our
            team knows the process inside out and fights on your behalf.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {claimCategories.map((category) => {
            return (
              <article
                key={category.title}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)]"
              >
                {/* Illustration */}
                <div className="flex h-44 items-center justify-center p-4">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="max-h-full max-w-[220px] w-auto object-contain"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold text-slate-900">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {category.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {category.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <img
                          src="/images/claims/insurance-claim-section/green-tick.svg"
                          alt="✓"
                          className="mt-0.5 h-4 w-4 shrink-0"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Badge — pushed to bottom so all cards align */}
                  <div className="mt-auto pt-5">
                    <div
                      className="flex h-[41px] w-full max-w-[269px] items-center rounded-[9px] pl-3"
                      style={{
                        background: `linear-gradient(90deg, ${category.gradientColor} 0%, #FFFFFF 100%)`,
                      }}
                    >
                      <span
                        className={`text-xs font-semibold ${category.badgeClass.split(" ")[1]}`}
                      >
                        {category.badge}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}