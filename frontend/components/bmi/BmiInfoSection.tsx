export default function BmiInfoSection() {
  return (
    <section className="w-full bg-[#ECF3FE] py-20 mt-10">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="w-full">
        
        {/* TOP: Image Left, Content Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mb-16">
          
          {/* LEFT: Image */}
          <div className="w-full flex flex-col items-center justify-center lg:h-[550px]">
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
            <div className="hidden w-full h-64 bg-slate-50 rounded-xl items-center justify-center text-slate-400 font-medium text-sm border border-dashed border-slate-200">
              Image missing or loading
            </div>
          </div>

          {/* RIGHT: Content */}
          <div className="w-full lg:h-[550px] flex flex-col justify-between py-2">
            <h2 className="text-[24px] lg:text-[28px] xl:text-[32px] font-extrabold text-[#1B2A4A] tracking-tight whitespace-nowrap" style={{ fontFamily: 'var(--font-sora), "Sora", sans-serif' }}>
              What is Body Mass Index (BMI)?
            </h2>

            <div className="flex flex-col h-full justify-between text-[16px] lg:text-[17px] text-[#5B6478] leading-relaxed py-3 text-justify">
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
                A BMI of 25.0 or more is considered overweight, while the healthy range is 18.5 to 24.9. Maintaining your BMI within this healthy optimal range is critical for your well-being, as it significantly lowers the risk of chronic conditions such as heart disease, high blood pressure.
              </p>
            </div>
          </div>
        </div>

        {/* MIDDLE: 4 Horizontal Bento Images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white h-48 sm:h-64">
            <img src="/images/bmi/bmi-img1.png" alt="BMI Category 1" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
          </div>
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white h-48 sm:h-64">
            <img src="/images/bmi/bmi-img2.png" alt="BMI Category 2" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
          </div>
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white h-48 sm:h-64">
            <img src="/images/bmi/bmi-img3.png" alt="BMI Category 3" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
          </div>
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white h-48 sm:h-64">
            <img src="/images/bmi/bmi-img4.png" alt="BMI Category 4" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
          </div>
        </div>

        {/* BOTTOM: Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mt-8">
          
          {/* LEFT: Horizontal Table & Yellow Card */}
          <div className="w-full flex flex-col h-full justify-between">
            <div className="rounded-2xl bg-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-200 mb-4 flex-grow flex flex-col justify-center">
              <table className="w-full text-left text-sm text-[#1B2A4A]">
                <thead className="bg-[#FAFCFF] text-[#5B6478]">
                  <tr>
                    <th className="px-6 py-3 font-semibold border-b border-slate-200 uppercase tracking-wider text-[13px]">BMI Range</th>
                    <th className="px-6 py-3 font-semibold border-b border-slate-200 uppercase tracking-wider text-[13px]">Weight Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-3 font-medium">Below 18.5</td>
                    <td className="px-6 py-3 text-[#F5B544] font-semibold">Underweight</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-3 font-medium">18.5 - 24.9</td>
                    <td className="px-6 py-3 text-[#27AE60] font-semibold">Normal Weight</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-3 font-medium">25.0 - 29.9</td>
                    <td className="px-6 py-3 text-[#F2994A] font-semibold">Overweight</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-3 font-medium">30.0 and above</td>
                    <td className="px-6 py-3 text-[#EB5757] font-semibold">Obesity</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Moved Yellow Card */}
            <div className="flex p-4 rounded-xl bg-[#FFFBEB]">
              <div className="text-[14px] lg:text-[15px] text-[#5B6478] leading-snug">
                Alternatively, you can use a body mass index calculator online to know your BMI instantly.
              </div>
            </div>
          </div>

          {/* RIGHT: Content Layout */}
          <div className="w-full h-full flex flex-col justify-between">
            <div className="mb-2">
              <h2 className="text-[24px] lg:text-[28px] font-extrabold text-[#1A1A2E] tracking-tight" style={{ fontFamily: 'var(--font-sora), "Sora", sans-serif' }}>
                How is BMI Calculated?
              </h2>
            </div>
            
            <p className="text-[#5B6478] text-[15px] leading-snug mb-4 text-justify">
              BMI is calculated by dividing the weight of a person (in Kg) by the square of their height (in meters). Take a look at the BMI formula below:
            </p>

            <div className="flex flex-col flex-grow justify-between gap-3">
              {/* Card 1 */}
              <div className="flex p-4 rounded-xl bg-[#F4F9FF]">
                <div className="text-[14px] lg:text-[15px] text-[#5B6478] leading-snug font-semibold">
                  BMI = weight (kg) / (height (m))^2
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex p-4 rounded-xl bg-[#F2FBF5]">
                <div className="text-[14px] lg:text-[15px] text-[#5B6478] leading-snug">
                  Let's understand the BMI formula with the following example: Suppose your weight is 55 Kg and your height is 1.65m. In this case, you can calculate your BMI by entering your height and weight into the BMI formula, i.e. <span className="font-semibold text-[#1B2A4A]">BMI = 55 / (1.65 x 1.65) = 55 / 2.72 = 20.2</span>.
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
