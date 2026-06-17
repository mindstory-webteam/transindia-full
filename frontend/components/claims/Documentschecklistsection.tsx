interface DocumentGroup {
  title: string;
  items: string[];
}

const documentGroups: DocumentGroup[] = [
  {
    title: "Life Insurance",
    items: [
      "Original policy document",
      "Death certificate (attested copy)",
      "Nominee's KYC (Aadhaar, PAN)",
      "Bank account details of nominee",
      "Medical records (if applicable)",
      "FIR / post-mortem (accidental death)",
    ],
  },
  {
    title: "Health Insurance",
    items: [
      "Policy card / health card",
      "Doctor's prescription & diagnosis",
      "Hospital discharge summary",
      "Original bills & receipts",
      "Lab reports / investigation results",
      "KYC of insured person",
    ],
  },
  {
    title: "Motor Insurance",
    items: [
      "Policy document / copy",
      "FIR (for accidents or theft)",
      "RC book & driving licence",
      "Repair estimate from garage",
      "Photos of vehicle damage",
      "Bank details for reimbursement",
    ],
  },
];

export default function DocumentsChecklistSection() {
  return (
    <section className="bg-[#ECF3FE] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-10 sm:mb-12 max-w-2xl text-center px-4">
          <span className="mb-3 inline-flex items-center rounded-full bg-orange-50 px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#B74E3B]">
            Be prepared
          </span>
          <h2
            className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight"
            style={{ fontFamily: 'var(--font-sora), "Sora", sans-serif' }}
          >
            Documents you&apos;ll{" "}
            <span className="text-orange-500">typically need</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {documentGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border-t-4 border-[#C1D5DD] bg-white p-5 sm:p-6 shadow-sm"
            >
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-slate-600"
                  >
                    <img
                      src="/images/claims/insurance-claim-section/green-tick.svg"
                      alt="✓"
                      className="mt-0.5 h-4 w-4 flex-shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
