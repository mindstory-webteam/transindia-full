"use client";

import { useState } from "react";

export default function TrackClaimSection() {
  const [referenceNumber, setReferenceNumber] = useState("");

  const handleTrack = () => {
    if (!referenceNumber.trim()) return;
    // TODO: wire up tracking logic
    console.log("Tracking claim:", referenceNumber);
  };

  return (
    <section className="bg-[#F8FAFF] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[732px] px-4 sm:px-6 lg:px-0">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="mb-4 inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#158693] shadow-sm">
            Real-time updates
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"  style={{ fontFamily: 'var(--font-sora), "Sora", sans-serif' }}>
            Track your{" "}
            <span className="text-[#00BCD4]">Claim Status</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed mx-auto"  style={{color:"#535862", fontSize:"18px"}}>
            Enter your claim reference number or policy number below to
            <br className="hidden sm:block" /> see exactly where your claim
            stands right now.
          </p>
        </div>

        {/* Card */}
        <div className="flex flex-col justify-center rounded-2xl bg-white px-6 py-8 shadow-sm sm:h-[194px] sm:px-10">
          <label
            htmlFor="claimRef"
            className="block text-sm font-bold text-slate-800"
          >
            Claim Reference / Policy Number
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              id="claimRef"
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              placeholder="eg. TI-CLM-2024-00847"
              className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
            <button
              type="button"
              onClick={handleTrack}
              className="rounded-lg bg-[#2542AD] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 sm:whitespace-nowrap"
            >
              Track Claim
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
