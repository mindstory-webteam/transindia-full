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
  iconBg: string;    // richer pastel - the actual icon box bg
  zoneBg: string;    // lighter pastel - the whole top section bg
  iconColor: string;
  title: string;
  description: string;
}

const tips: TipCard[] = [
  {
    icon: Salad,
    zoneBg: "bg-[#FFF0E6]",
    iconBg: "bg-[#FFC7A1]",
    iconColor: "text-[#1B2A4A]",
    title: "Embrace Healthy Habits",
    description:
      "Small changes like eating a balanced diet, reducing sugar intake, and controlling portion sizes can improve your health and BMI.",
  },
  {
    icon: Activity,
    zoneBg: "bg-[#E6FAF0]",
    iconBg: "bg-[#A3F1C4]",
    iconColor: "text-[#1B2A4A]",
    title: "Stay Active",
    description:
      "If you are wondering, can exercise alone change your BMI; the answer is yes. Staying active, like doing moderate-intensity exercises and strength training, can significantly improve your BMI and health. Even light exercises like walking or yoga can make a big difference.",
  },
  {
    icon: GlassWater,
    zoneBg: "bg-[#F0EBFE]",
    iconBg: "bg-[#CDB4F6]",
    iconColor: "text-[#1B2A4A]",
    title: "Stay Hydrated and Sleep Well",
    description:
      "Drinking enough water throughout the day boosts metabolism and helps control appetite. Getting quality sleep for 7-8 hours also prevents weight-related issues.",
  },
  {
    icon: HeartHandshake,
    zoneBg: "bg-[#FFF8E1]",
    iconBg: "bg-[#FFE082]",
    iconColor: "text-[#1B2A4A]",
    title: "Explore Wellness Programs",
    description:
      "Many insurers offer wellness benefits like gym discounts, fitness challenges, and wellness discounts if you maintain an active and healthy lifestyle.",
  },
  {
    icon: Target,
    zoneBg: "bg-[#E6F4FF]",
    iconBg: "bg-[#93C5FD]",
    iconColor: "text-[#1B2A4A]",
    title: "Set Realistic Goals",
    description:
      "Set realistic goals to achieve your ideal body weight. Focus on gradual improvements rather than drastic changes that are easier to sustain.",
  },
  {
    icon: LineChart,
    zoneBg: "bg-[#FFF0F5]",
    iconBg: "bg-[#F9A8C9]",
    iconColor: "text-[#1B2A4A]",
    title: "Monitor Your Progress",
    description:
      "Regular health check-ups and BMI checks can help to track your progress and keep you motivated. Use mobile apps or wearables to monitor your health metrics easily.",
  },
];

export default function WellnessTips() {
  return (
    <section className="w-full bg-[#ECF3FE] pt-2 pb-10 sm:pb-16 lg:pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#1B2A4A] tracking-tight">
          Tips to Improve Your BMI
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.title}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* TOP: pastel zone inset 10px from card edges */}
                <div className={`m-[10px] rounded-[14px] p-3 ${tip.zoneBg}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-[10px] rounded-[12px] ${tip.iconBg}`}>
                      <Icon className={`h-8 w-8 ${tip.iconColor}`} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900 leading-snug">
                      {tip.title}
                    </h3>
                  </div>
                </div>

                {/* BOTTOM: plain white content */}
                <div className="bg-white px-6 py-5">
                  <p className="text-sm leading-relaxed text-gray-500">
                    {tip.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}