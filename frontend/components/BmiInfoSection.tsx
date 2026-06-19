export default function BmiInfoSection() {
  return (
    <section className="relative z-10 mx-auto mt-20 max-w-6xl px-6 pb-20">
      <div className="w-full">
        
        {/* TOP: Horizontal Text Content */}
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-[#1B2A4A] lg:text-4xl mb-8 text-center" style={{ fontFamily: 'var(--font-sora), "Sora", sans-serif' }}>
            Understanding Your BMI
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[15px] sm:text-[16px] text-[#5B6478] leading-relaxed">
            <div>
              <p>
                Body Mass Index (BMI) is a simple calculation using a person's height and weight. The formula is BMI = kg/m² where kg is a person's weight in kilograms and m² is their height in metres squared.
              </p>
            </div>
            <div>
              <p>
                A BMI of 25.0 or more is overweight, while the healthy range is 18.5 to 24.9. Maintaining a healthy weight is critical for your well-being. It applies to most adults 18-65 years.
              </p>
            </div>
            <div>
              <ul className="space-y-3 font-medium">
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#F5B544]"></div><span className="text-[#1B2A4A]">Underweight:</span> Poor nutrition</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#27AE60]"></div><span className="text-[#1B2A4A]">Normal weight:</span> Optimal health</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#F2994A]"></div><span className="text-[#1B2A4A]">Overweight:</span> Moderate risk</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#EB5757]"></div><span className="text-[#1B2A4A]">Obesity:</span> High health risk</li>
              </ul>
            </div>
          </div>
        </div>

        {/* MIDDLE: 4 Horizontal Bento Images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="h-32 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-50 transition shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#2C6FE8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-slate-600 text-sm font-semibold">Image 1</span>
          </div>
          <div className="h-32 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-50 transition shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#2C6FE8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-slate-600 text-sm font-semibold">Image 2</span>
          </div>
          <div className="h-32 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-50 transition shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#2C6FE8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-slate-600 text-sm font-semibold">Image 3</span>
          </div>
          <div className="h-32 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-50 transition shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#2C6FE8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-slate-600 text-sm font-semibold">Image 4</span>
          </div>
        </div>

        {/* BOTTOM: Horizontal Table */}
        <div className="rounded-xl bg-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-200">
          <table className="w-full text-left text-sm text-[#1B2A4A]">
            <thead className="bg-[#FAFCFF] text-[#5B6478]">
              <tr>
                <th className="px-6 py-5 font-semibold border-b border-slate-200 uppercase tracking-wider text-[13px]">BMI Range</th>
                <th className="px-6 py-5 font-semibold border-b border-slate-200 uppercase tracking-wider text-[13px]">Weight Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-medium">Below 18.5</td>
                <td className="px-6 py-4 text-[#F5B544] font-semibold">Underweight</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-medium">18.5 - 24.9</td>
                <td className="px-6 py-4 text-[#27AE60] font-semibold">Normal Weight</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-medium">25.0 - 29.9</td>
                <td className="px-6 py-4 text-[#F2994A] font-semibold">Overweight</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-medium">30.0 and above</td>
                <td className="px-6 py-4 text-[#EB5757] font-semibold">Obesity</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
