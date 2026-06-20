"use client";

import {
  Salad,
  Activity,
  GlassWater,
  HeartHandshake,
  Target,
  LineChart,
  type LucideIcon,
} from "lucide-react";

interface TipCard {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const tips: TipCard[] = [
  {
    icon: Salad,
    iconBg: "bg-[#FFE4D6]",
    iconColor: "text-[#1B2A4A]",
    title: "Embrace Healthy Habits",
    description:
      "Small changes like eating a balanced diet, reducing sugar intake, and controlling portion sizes can improve your health and BMI.",
  },
  {
    icon: Activity,
    iconBg: "bg-[#FFE4D6]",
    iconColor: "text-[#1B2A4A]",
    title: "Stay Active",
    description:
      "If you are wondering, can exercise alone change your BMI; the answer is yes. Staying active, like doing moderate-intensity exercises and strength training, can significantly improve your BMI and health. Even light exercises like walking or yoga can make a big difference.",
  },
  {
    icon: GlassWater,
    iconBg: "bg-[#D1FADF]",
    iconColor: "text-[#1B2A4A]",
    title: "Stay Hydrated and Sleep Well",
    description:
      "Drinking enough water throughout the day boosts metabolism and helps control appetite. Getting quality sleep for 7-8 hours also prevents weight-related issues.",
  },
  {
    icon: HeartHandshake,
    iconBg: "bg-[#D1FADF]",
    iconColor: "text-[#1B2A4A]",
    title: "Explore Wellness Programs",
    description:
      "Many insurers offer wellness benefits like gym discounts, fitness challenges, and wellness discounts if you maintain an active and healthy lifestyle.",
  },
  {
    icon: Target,
    iconBg: "bg-[#EBE2FB]",
    iconColor: "text-[#1B2A4A]",
    title: "Set Realistic Goals",
    description:
      "Set realistic goals to achieve your ideal body weight. Focus on gradual improvements rather than drastic changes that are easier to sustain.",
  },
  {
    icon: LineChart,
    iconBg: "bg-[#EBE2FB]",
    iconColor: "text-[#1B2A4A]",
    title: "Monitor Your Progress",
    description:
      "Regular health check-ups and BMI checks can help to track your progress and keep you motivated. Use mobile apps or wearables to monitor your health metrics easily.",
  },
];

export default function WellnessTips() {
  return (
    <section className="w-full bg-white py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
          Tips to Improve Your BMI
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.title}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${tip.iconBg}`}
                >
                  <Icon className={`h-8 w-8 ${tip.iconColor}`} strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-gray-900">
                  {tip.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {tip.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}