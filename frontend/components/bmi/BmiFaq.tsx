"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  { question: "How do I calculate my BMI?", answer: "BMI is calculated by dividing your weight in kilograms by the square of your height in meters. You can use our BMI calculator above for quick results." },
  { question: "What is a normal BMI?", answer: "A normal or healthy BMI range is typically between 18.5 and 24.9." },
  { question: "What is the BMI formula?", answer: "The standard formula is BMI = weight (kg) / (height (m))²." },
  { question: "Is the BMI calculator correct?", answer: "Yes, our calculator uses the standard mathematical formula recognized by health organizations worldwide." },
  { question: "Is BMI 100% accurate?", answer: "BMI is a reliable screening tool but not a diagnostic test. It doesn't account for muscle mass, bone density, or overall body composition." },
  { question: "What is the correct BMI for my age?", answer: "For most adults over 20, the healthy range (18.5-24.9) applies regardless of age. However, ideal BMI can vary slightly for older adults." },
  { question: "Is 20 BMI good?", answer: "Yes, a BMI of 20 falls comfortably within the normal and healthy weight range (18.5 to 24.9)." },
  { question: "Which BMI is OK?", answer: "A BMI between 18.5 and 24.9 is considered 'OK' or healthy for most adults." },
  { question: "Is there a BMI calculator by age?", answer: "For adults, BMI categories do not change with age. However, for children and teens (ages 2-19), BMI percentiles specific to age and sex are used." },
  { question: "Are BMI calculators for males and females different?", answer: "The formula is exactly the same for both males and females. However, interpretation of body fat percentages might differ between genders." },
  { question: "How to lower BMI?", answer: "You can lower your BMI by creating a caloric deficit through a balanced diet and regular physical activity." },
  { question: "How to increase BMI?", answer: "You can increase your BMI by consuming a surplus of nutrient-dense calories and incorporating strength training to build muscle mass." },
  { question: "Does BMI affect diabetes?", answer: "Yes, a high BMI (overweight or obese) is a significant risk factor for developing Type 2 diabetes." },
  { question: "What is a good BMI for a diabetic?", answer: "Diabetics are generally advised to maintain a standard healthy BMI (18.5 - 24.9) to help manage blood sugar levels effectively." },
  { question: "What is the most unhealthy BMI?", answer: "Extremely low BMIs (below 18.5) and highly elevated BMIs (above 30, especially above 40) are associated with severe health risks." },
  { question: "Does BMI change with age?", answer: "Your actual BMI only changes if your height or weight changes. However, as people age, they naturally lose muscle and gain fat, so the same BMI might represent a different body composition." },
  { question: "What is a good BMI for females?", answer: "The healthy BMI range for adult females is the same as for males: 18.5 to 24.9." },
  { question: "Is BMI 20 skinny?", answer: "A BMI of 20 is on the leaner side of the healthy range, but it is not considered underweight or unhealthily skinny." }
];

export default function BmiFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-8 text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#1B2A4A] tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4">
            {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq, i) => {
              const actualIndex = i;
              const isOpen = openIndex === actualIndex;
              return (
                <div key={actualIndex} className="rounded-[10px] bg-[#F5F6F8] overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => handleToggle(actualIndex)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none"
                  >
                    <span className="text-[15px] sm:text-[16px] font-medium text-[#1B2A4A] pr-4">
                      {faq.question}
                    </span>
                    <span className="text-[#1B2A4A] flex-shrink-0">
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-4 sm:p-5 pt-0 text-[14px] sm:text-[15px] text-[#5B6478] leading-relaxed border-t border-slate-200/60 mx-4 sm:mx-5 px-0">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            {faqs.slice(Math.ceil(faqs.length / 2)).map((faq, i) => {
              const actualIndex = i + Math.ceil(faqs.length / 2);
              const isOpen = openIndex === actualIndex;
              return (
                <div key={actualIndex} className="rounded-[10px] bg-[#F5F6F8] overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => handleToggle(actualIndex)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none"
                  >
                    <span className="text-[15px] sm:text-[16px] font-medium text-[#1B2A4A] pr-4">
                      {faq.question}
                    </span>
                    <span className="text-[#1B2A4A] flex-shrink-0">
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-4 sm:p-5 pt-0 text-[14px] sm:text-[15px] text-[#5B6478] leading-relaxed border-t border-slate-200/60 mx-4 sm:mx-5 px-0">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
