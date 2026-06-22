export default function BmiInfoSection() {
  return (
    <section className="w-full bg-white py-10 sm:py-14 lg:py-20">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="w-full">

          {/* TOP: Image Left, Content Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-stretch mb-8 sm:mb-12 lg:mb-16">

            {/* LEFT: Image */}
            <div className="w-full flex flex-col items-center justify-center h-[220px] sm:h-[320px] md:h-[400px] lg:h-[500px]">
              <img
                src="/images/bmi/weight-checking.png"
                alt="BMI Risk Spectrum"
                className="w-full object-cover h-full rounded-2xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full bg-slate-50 rounded-xl items-center justify-center text-slate-400 font-medium text-sm border border-dashed border-slate-200">
                Image missing or loading
              </div>
            </div>

            {/* RIGHT: Content */}
            <div className="w-full flex flex-col justify-between py-2 gap-4">
              <h2
                className="text-[20px] sm:text-[24px] lg:text-[28px] xl:text-[32px] font-extrabold text-[#1B2A4A] tracking-tight leading-tight"
                style={{ fontFamily: 'var(--font-sora), "Sora", sans-serif' }}
              >
                What is Body Mass Index (BMI)?
              </h2>

              <div className="flex flex-col gap-3 sm:gap-4 text-[15px] sm:text-[16px] lg:text-[17px] text-[#5B6478] leading-relaxed text-justify">
                <p>
                  Body Mass Index (BMI) is a health screening tool that calculates body fat based on weight and height. Based on the BMI value, a person can be categorised as underweight, normal weight, overweight or obese.
                </p>
                <p>
                  You just need your weight in kilograms and height in meters to use the BMI calculator and determine which weight category you fall into.
                </p>
                <p>
                  Basically, BMI is the ratio of your weight to your height, indicating your overall health status. It serves as a quick and effective initial assessment to identify potential health risks associated with being outside the optimal weight range.
                </p>
                <p>
                  A BMI of 25.0 or more is considered overweight, while the healthy range is 18.5 to 24.9. Maintaining your BMI within this healthy optimal range is critical for your well-being.
                </p>
              </div>
            </div>
          </div>

          {/* MIDDLE: 4 Bento Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 lg:mb-12">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white h-32 sm:h-44 md:h-52 lg:h-56">
                <img
                  src={`/images/bmi/bmi-img${n}.png`}
                  alt={`BMI Category ${n}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>

          {/* BOTTOM: Split Section — Table Left, Calculation Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-stretch mt-4 sm:mt-6 lg:mt-8">

            {/* LEFT: Table & Yellow card */}
            <div className="w-full flex flex-col h-full justify-between gap-4">
              <div className="rounded-2xl bg-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-200">
                <table className="w-full text-sm text-[#1B2A4A] table-fixed">
                  <colgroup>
                    <col className="w-1/2" />
                    <col className="w-1/2" />
                  </colgroup>
                  <thead className="bg-[#FAFCFF] text-[#5B6478]">
                    <tr>
                      <th className="px-4 sm:px-8 py-3 font-semibold border-b border-slate-200 uppercase tracking-wider text-[12px] sm:text-[13px] text-left">BMI Range</th>
                      <th className="px-4 sm:px-8 py-3 font-semibold border-b border-l border-slate-200 uppercase tracking-wider text-[12px] sm:text-[13px] text-left">Weight Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50 transition">
                      <td className="px-4 sm:px-8 py-3 font-medium text-left text-[13px] sm:text-sm">Below 18.5</td>
                      <td className="px-4 sm:px-8 py-3 text-[#F5B544] font-semibold text-left border-l border-slate-200 text-[13px] sm:text-sm">Underweight</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition">
                      <td className="px-4 sm:px-8 py-3 font-medium text-left text-[13px] sm:text-sm">18.5 - 24.9</td>
                      <td className="px-4 sm:px-8 py-3 text-[#27AE60] font-semibold text-left border-l border-slate-200 text-[13px] sm:text-sm">Normal Weight</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition">
                      <td className="px-4 sm:px-8 py-3 font-medium text-left text-[13px] sm:text-sm">25.0 - 29.9</td>
                      <td className="px-4 sm:px-8 py-3 text-[#F2994A] font-semibold text-left border-l border-slate-200 text-[13px] sm:text-sm">Overweight</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition">
                      <td className="px-4 sm:px-8 py-3 font-medium text-left text-[13px] sm:text-sm">30.0 and above</td>
                      <td className="px-4 sm:px-8 py-3 text-[#EB5757] font-semibold text-left border-l border-slate-200 text-[13px] sm:text-sm">Obesity</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* View Plan Button */}
              <button className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-[#ec4f34] hover:bg-[#d6452d] text-white font-bold text-[15px] sm:text-[16px] transition-colors shadow-sm">
                View Plans
              </button>
            </div>

            {/* RIGHT: How BMI is Calculated */}
            <div className="w-full flex flex-col h-full justify-between gap-4">
              <div>
                <h2
                  className="text-[20px] sm:text-[22px] lg:text-[26px] font-extrabold text-[#1A1A2E] tracking-tight leading-tight mb-3"
                  style={{ fontFamily: 'var(--font-sora), "Sora", sans-serif' }}
                >
                  How is BMI Calculated?
                </h2>

                <p className="text-[#5B6478] text-[14px] sm:text-[15px] leading-snug">
                  BMI is calculated by dividing your weight (in Kg) by the square of your height (in meters):
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {/* Formula card */}
                <div className="flex p-3 sm:p-4 rounded-xl bg-[#F4F9FF]">
                  <div className="text-[13px] sm:text-[14px] lg:text-[15px] text-[#5B6478] leading-snug font-semibold">
                    BMI = weight (kg) / (height (m))²
                  </div>
                </div>

                {/* Example card */}
                <div className="flex p-3 sm:p-4 rounded-xl bg-[#F2FBF5]">
                  <div className="text-[13px] sm:text-[14px] lg:text-[15px] text-[#5B6478] leading-snug">
                    For example: If your weight is 55 Kg and height is 1.65m, your BMI is: <span className="font-semibold text-[#1B2A4A]">55 / (1.65 x 1.65) = 20.2</span>.
                  </div>
                </div>

                {/* Yellow card */}
                <div className="flex p-3 sm:p-4 rounded-xl bg-[#FFFBEB]">
                  <div className="text-[13px] sm:text-[14px] lg:text-[15px] text-[#5B6478] leading-snug">
                    Alternatively, you can use a body mass index calculator online to know your BMI instantly.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
