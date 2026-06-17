

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

const processSteps: ProcessStep[] = [
  {
    step: "STEP - 01",
    title: "Intimate Us",
    description:
      "Call or fill the online form. Our team responds within 2 hours.",
  },
  {
    step: "STEP - 02",
    title: "Document Collection",
    description:
      "We provide a complete document checklist and help gather everything needed.",
  },
  {
    step: "STEP - 03",
    title: "Submit to Insurer",
    description:
      "We file the claim with the insurer and confirm receipt with a reference number.",
  },
  {
    step: "STEP - 04",
    title: "Follow Up Daily",
    description:
      "We track status daily and chase the insurer on your behalf.",
  },
  {
    step: "STEP - 05",
    title: "Settlement",
    description:
      "Claim amount transferred directly to your account. We confirm and close with you.",
  },
];

export default function ClaimsProcessSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-400 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-flex items-center rounded-full bg-cyan-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#158693]">
            Step by step
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl" style={{ fontFamily: 'var(--font-sora), "Sora", sans-serif' }}>
            How our claims{" "}
            <span className="text-cyan-400">process works</span>
          </h2>
          <p className="mt-4 mx-auto max-w-[500px] text-base leading-relaxed" style={{color:"#535862", fontSize:"18px"}}>
            Transparent, fast, and fully supported — from your first call to
            final settlement cheque.
          </p>
        </div>

        {/* Steps */}
        {/* Mobile/tablet: bento 2-col grid. lg+: 5-col flex row */}
        <div className="mt-10 grid grid-cols-2 gap-5 lg:hidden">
          {processSteps.map((item, idx) => (
            <div
              key={item.step}
              className={`relative pt-[10px]${idx === 4 ? " col-span-2" : ""}`}
            >
              <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10 flex items-center justify-center w-32.25 h-10.25">
                <svg width="129" height="41" viewBox="0 0 129 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
                  <path d="M0 4C0 1.79086 1.79086 0 4 0H125C127.209 0 129 1.79086 129 4V17C129 30.2548 118.255 41 105 41H24C10.7452 41 0 30.2548 0 17V4Z" fill="#F15A40"/>
                </svg>
                <span className="relative z-10 pb-1 text-[13px] font-bold text-white tracking-wider">
                  {item.step}
                </span>
              </div>
              <div className={`flex flex-col rounded-[20px] bg-[#0c1a4a] px-6 pt-[70px] pb-6 min-h-[189px] ${idx === 4 ? "w-full" : "w-full"}`}>
                <h3 className="text-[17px] font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13px] leading-[1.6] text-[#D1D5DB]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* lg+: original 5-in-a-row flex layout */}
        <div className="hidden lg:flex flex-wrap justify-center gap-5 mt-10">
          {processSteps.map((item) => (
            <div key={item.step} className="relative pt-2.5">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10 flex items-center justify-center w-32.25 h-10.25">
                <svg width="129" height="41" viewBox="0 0 129 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
                  <path d="M0 4C0 1.79086 1.79086 0 4 0H125C127.209 0 129 1.79086 129 4V17C129 30.2548 118.255 41 105 41H24C10.7452 41 0 30.2548 0 17V4Z" fill="#F15A40"/>
                </svg>
                <span className="relative z-10 pb-1 text-[13px] font-bold text-white tracking-wider">
                  {item.step}
                </span>
              </div>
              <div className="flex flex-col rounded-[20px] bg-[#0c1a4a] px-6 pt-[70px] pb-6 w-[236px] min-h-[189px]">
                <h3 className="text-[17px] font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13px] leading-[1.6] text-[#D1D5DB]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Commitment banner */}
        <div className="mx-auto mt-[60px] flex max-w-[1000px] flex-col items-start gap-4 rounded-[20px] bg-[#EEFFF3] p-6 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center justify-center">
            <img 
              src="/images/claims/claimprocesssection/handshake.svg" 
              alt="Handshake" 
              className="h-[60px] w-[60px] object-contain"
            />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#15803D]">
              TransIndia Claims Commitment
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#15803D]">
              If your claim is delayed beyond IRDAI-mandated timelines due to
              insurer delays, TransIndia will escalate to the insurer&apos;s
              grievance team and IRDAI ombudsman on your behalf — completely
              free of charge. We don&apos;t give up until you&apos;re paid
              what you&apos;re owed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
