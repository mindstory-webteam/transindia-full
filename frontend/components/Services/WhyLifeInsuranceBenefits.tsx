import React from "react";

interface BenefitCard {
  image: string;
  iconBg: string;
  title: string;
  description: string;
}

const benefits: BenefitCard[] = [
  {
    image: "/images/life-insurance/icons/income-replacement.png",
    iconBg: "bg-blue-100",
    title: "Income Replacement",
    description:
      "Your family maintains their standard of living. Monthly expenses, EMIs, school fees — all covered even when you're not around.",
  },
  {
    image: "/images/life-insurance/icons/childrens-education.png",
    iconBg: "bg-emerald-100",
    title: "Children's Education",
    description:
      "Lock in your child's education goals — school, college, or professional courses — regardless of what life throws at you.",
  },
  {
    image: "/images/life-insurance/icons/debt-clearance.png",
    iconBg: "bg-yellow-100",
    title: "Debt Clearance",
    description:
      "Home loans, car loans, personal debts — the payout clears them all. Your family inherits your assets, not your liabilities.",
  },
  {
    image: "/images/life-insurance/icons/spouse-protection.png",
    iconBg: "bg-pink-100",
    title: "Spouse Protection",
    description:
      "Ensure your partner is financially secure and independent for life — especially if they're a homemaker or dependent on your income.",
  },
  {
    image: "/images/life-insurance/icons/tax-benefits.png",
    iconBg: "bg-indigo-100",
    title: "Tax Benefits",
    description:
      "Save up to ₹1.5 Lakh/year under Section 80C on premiums paid. Maturity and death proceeds are fully tax-exempt under 10(10D).",
  },
  {
    image: "/images/life-insurance/icons/critical-illness.png",
    iconBg: "bg-rose-100",
    title: "Critical Illness Cover",
    description:
      "Add-on riders cover 40+ critical illnesses — cancer, heart attack, stroke, kidney failure — paying a lump sum on diagnosis.",
  },
  {
    image: "/images/life-insurance/icons/low-premiums.png",
    iconBg: "bg-orange-100",
    title: "Low Locked-In Premiums",
    description:
      "Buy young, pay less for life. Premiums are fixed at the age you buy — waiting even one year can cost thousands more annually.",
  },
  {
    image: "/images/life-insurance/icons/wealth-creation.png",
    iconBg: "bg-cyan-100",
    title: "Wealth Creation",
    description:
      "Endowment and ULIP plans grow your money alongside protecting your life — building a corpus for retirement, marriage, or goals.",
  },
];

const WhyLifeInsuranceBenefits: React.FC = () => {
  return (
    <section className="bg-slate-50 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold tracking-wider px-3 py-1.5 rounded-full mb-4">
            THE BENEFITS
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
            8 reasons life insurance is
            <br />
            <span className="text-orange-500">non-negotiable</span>
          </h2>

          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Life insurance isn't just about death. It's about making sure the
            people who depend on you never have to struggle — no matter what
            happens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white rounded-2xl p-6 text-center shadow-sm"
            >
              <div
                className={`${benefit.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden`}
              >
                <img
                  src={benefit.image}
                  alt={benefit.title}
                  className="w-8 h-8 object-contain"
                />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {benefit.title}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyLifeInsuranceBenefits;