import React from "react";

interface CorporateCard {
  image: string;
  title: string;
  description: string;
}

const cards: CorporateCard[] = [
  {
    image: "/images/services/services-2section/people.svg",
    title: "Group Health Insurance",
    description:
      "Comprehensive employee medical cover. We negotiate group rates with multiple insurers and manage enrollment & renewals.",
  },
  {
    image: "/images/services/services-2section/Briefcase,.svg",
    title: "Liability Insurance",
    description:
      "Public liability, product liability, professional indemnity, D&O — protect your business from legal and regulatory risk.",
  },
  {
    image: "/images/services/services-2section/fire.svg",
    title: "Property & Fire",
    description:
      "Factory, warehouse, office premises cover. Fire, flood, earthquake, machinery breakdown — comprehensive property protection.",
  },
  {
    image: "/images/services/services-2section/ship.svg",
    title: "Marine & Cargo",
    description:
      "Open cover, specific voyage, and project cargo policies for import, export, and domestic freight movements.",
  },
  {
    image: "/images/services/services-2section/sheld.svg",
    title: "Cyber Insurance",
    description:
      "Data breach, ransomware, cyber liability, and business interruption coverage for the digital era.",
  },
  {
    image: "/images/services/services-2section/repair.svg",
    title: "Engineering Insurance",
    description:
      "Contractors all risk, erection all risk, machinery breakdown, and equipment insurance for projects and industry.",
  },
];

const CorporateRiskManagement: React.FC = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold tracking-wider px-3 py-1.5 rounded-md mb-4">
          FOR BUSINESSES &amp; CORPORATES
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
          Corporate Risk <span className="text-orange-500">Management</span>
        </h2>
        <p className="text-slate-500 text-base md:text-lg max-w-2xl mb-10">
          From SMEs to large enterprises — we design, place, and manage
          comprehensive commercial insurance and employee benefit programs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-orange-50 rounded-3xl overflow-hidden flex flex-col"
            >
              {/* Image panel */}
              <div className="h-48 flex items-center justify-center">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-contain p-6"
                />
              </div>

              {/* Curved white content panel overlapping the image */}
              <div className="bg-white rounded-3xl p-6 flex flex-col flex-1 m-2 mt-0">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {card.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                  {card.description}
                </p>

                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full py-3 transition-colors">
                  Get Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CorporateRiskManagement;