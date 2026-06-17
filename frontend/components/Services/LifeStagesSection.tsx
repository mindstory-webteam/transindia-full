import React from "react";

interface LifeStage {
  emoji: string;
  age: string;
  ageColor: string;
  title: string;
  description: string;
  linkText: string;
  linkColor: string;
  bg: string;
}

const lifeStages: LifeStage[] = [
  {
    emoji: "🎓",
    age: "AGE 20 - 30",
    ageColor: "text-cyan-600",
    title: "Just Starting Out",
    description:
      "Lock in ultra-low premiums. A ₹1 Cr term plan at 25 costs ~₹437/mo. Best time to buy is now.",
    linkText: "Term Insurance",
    linkColor: "text-blue-700",
    bg: "bg-gradient-to-br from-blue-50 to-white",
  },
  {
    emoji: "💍",
    age: "AGE 30-40",
    ageColor: "text-orange-500",
    title: "Family & Mortgage",
    description:
      "Protect spouse, kids, home loan. Increase sum assured to cover all liabilities and income replacement.",
    linkText: "Term + Critical Illness",
    linkColor: "text-orange-500",
    bg: "bg-gradient-to-br from-orange-50 to-white",
  },
  {
    emoji: "📈",
    age: "AGE 40–55",
    ageColor: "text-emerald-600",
    title: "Peak Earning Years",
    description:
      "Focus on wealth creation alongside protection. ULIPs and endowment plans build retirement corpus.",
    linkText: "ULIP + Endowment",
    linkColor: "text-emerald-600",
    bg: "bg-gradient-to-br from-emerald-50 to-white",
  },
  {
    emoji: "🏠",
    age: "AGE 55+",
    ageColor: "text-cyan-600",
    title: "Legacy Planning",
    description:
      "Pass on wealth to next generation. Whole life policies ensure estate, assets reach nominees tax-free.",
    linkText: "Whole Life Plan",
    linkColor: "text-cyan-600",
    bg: "bg-gradient-to-br from-cyan-50 to-white",
  },
];

const withoutInsurance = [
  "Family scrambles to pay rent and EMIs",
  "Children's education disrupted or halted",
  "Home loan leads to property seizure",
  "Spouse forced to sell assets to survive",
  "No tax-saving benefit on income",
  "Ageing parents left without support",
];

const withInsurance = [
  "Family's lifestyle secured for 10+ years",
  "Education fund fully pre-funded",
  "All loans cleared from policy payout",
  "Spouse receives lump sum immediately",
  "Save ₹1.5L/year in tax under Sec 80C",
  "Parents receive regular income support",
];

const LifeStagesSection: React.FC = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-cyan-100 text-cyan-700 text-xs font-bold tracking-wider px-3 py-1.5 rounded-full mb-4">
            AT EVERY STAGE OF LIFE
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            <span className="text-slate-900">Your insurance needs</span>
            <br />
            <span className="text-cyan-500">change as you grow</span>
          </h2>
        </div>

        {/* Life stages row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-200 rounded-2xl overflow-hidden mb-10">
          {lifeStages.map((stage, i) => (
            <div
              key={stage.title}
              className={`${stage.bg} p-6 ${
                i !== 0 ? "lg:border-l border-slate-200" : ""
              } ${i % 2 !== 0 ? "sm:border-l border-slate-200" : ""}`}
            >
              <div className="text-3xl mb-6">{stage.emoji}</div>

              <div
                className={`${stage.ageColor} text-xs font-bold tracking-wider mb-2`}
              >
                {stage.age}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-3">
                {stage.title}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                {stage.description}
              </p>

              <div className={`${stage.linkColor} text-sm font-bold`}>
                → {stage.linkText}
              </div>
            </div>
          ))}
        </div>

        {/* Without / With comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Without */}
          <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">😟</span>
              <h3 className="text-lg font-bold text-rose-600">
                Without Life Insurance
              </h3>
            </div>
            <ul className="space-y-3">
              {withoutInsurance.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-slate-600"
                >
                  <span className="text-rose-500 font-bold flex-shrink-0">
                    ✕
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* With */}
          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">😊</span>
              <h3 className="text-lg font-bold text-emerald-600">
                With Life Insurance
              </h3>
            </div>
            <ul className="space-y-3">
              {withInsurance.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-slate-600"
                >
                  <span className="text-emerald-500 font-bold flex-shrink-0">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA bar */}
        <div className="bg-blue-950 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white text-xl font-bold mb-1">
              Still thinking about it?
            </h3>
            <p className="text-slate-300 text-sm">
              Talk to a TransIndia expert — free, no pressure, no sales pitch.
            </p>
          </div>

          <a
            href="#contact"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-3 rounded-lg whitespace-nowrap transition-colors"
          >
            Talk to an Expert
          </a>
        </div>
      </div>
    </section>
  );
};

export default LifeStagesSection;