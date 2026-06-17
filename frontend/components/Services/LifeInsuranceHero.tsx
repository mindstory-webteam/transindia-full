"use client";

import { useState } from "react";
import Breadcrum from "@/components/Breadcrum";

const STATS = [
  { value: "98.7%", label: "Claims Settlement Ratio" },
  { value: "20+",   label: "Insurer Partners" },
  { value: "₹5Cr",  label: "Max Sum Assured" },
];

const SUM_ASSURED_OPTIONS = [
  "₹25 lakh", "₹50 lakh", "₹75 lakh", "₹1 crore", "₹2 crore", "₹5 crore",
];

const POLICY_TERM_OPTIONS = [
  "10 years", "15 years", "20 years", "25 years", "30 years",
];

const ANNUAL_INCOME_OPTIONS = [
  "Below ₹3 Lakh", "₹3-6 Lakh", "₹6-12 Lakh", "₹12-25 Lakh", "Above ₹25 Lakh",
];

export default function LifeInsuranceHero() {
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [smoker, setSmoker] = useState("No");
  const [sumAssured, setSumAssured] = useState("₹1 crore");
  const [policyTerm, setPolicyTerm] = useState("30 years");
  const [annualIncome, setAnnualIncome] = useState("₹6-12 Lakh");

  return (
    <>
      <style>{CSS}</style>
      <section className="li-hero">
        <div className="li-inner">
          {/* LEFT */}
          <div className="li-left">
            <div className="li-trail">
              <Breadcrum
                crumbs={[
                  { label: "Home", href: "/" },
                  { label: "Life Insurance" },
                ]}
              />
            </div>

            <h1 className="li-title">
              Protect the people
              <br />
              <span style={{ color: "#F4622A" }}>who matter </span>
              <span style={{ color: "#38BDF8" }}>most</span>
            </h1>

            <p className="li-desc">
              Comprehensive life insurance plans starting from ₹437/month.
              Secure your family&apos;s future with cover up to ₹5 Crore.
            </p>

            <a href="#contact" className="li-btn-orange">
              Talk to an Expert
            </a>

            <div className="li-stats">
              {STATS.map((s, i) => (
                <div className="li-stat-item" key={s.label}>
                  {i !== 0 && <div className="li-stat-divider" />}
                  <div>
                    <div className="li-stat-value">{s.value}</div>
                    <div className="li-stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Premium calculator card */}
          <div className="li-right">
            <div className="li-card">
              <h2 className="li-card-title">Calculate your premium</h2>

              <label className="li-field">
                <span className="li-label">Date of Birth</span>
                <div className="li-input-wrap">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    placeholder="dd/mm/yyyy"
                    className="li-input"
                  />
                  <svg className="li-calendar-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              </label>

              <div className="li-row-2">
                <label className="li-field">
                  <span className="li-label">Gender</span>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="li-select"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="li-field">
                  <span className="li-label">Smoker</span>
                  <select
                    value={smoker}
                    onChange={(e) => setSmoker(e.target.value)}
                    className="li-select"
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </label>
              </div>

              <label className="li-field">
                <span className="li-label">Sum Assured Required</span>
                <select
                  value={sumAssured}
                  onChange={(e) => setSumAssured(e.target.value)}
                  className="li-select"
                >
                  {SUM_ASSURED_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>

              <label className="li-field">
                <span className="li-label">Policy Term</span>
                <select
                  value={policyTerm}
                  onChange={(e) => setPolicyTerm(e.target.value)}
                  className="li-select"
                >
                  {POLICY_TERM_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>

              <label className="li-field">
                <span className="li-label">Annual Income</span>
                <select
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  className="li-select"
                >
                  {ANNUAL_INCOME_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>

              <button className="li-submit">Get My Instant Quote</button>

              <p className="li-disclaimer">No spam. No calls unless you want.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const CSS = `
  .li-hero *{ box-sizing: border-box; font-family: 'matterregular', sans-serif; }

  .li-hero{
    background: #001250;
    padding: 56px 48px;
  }

  .li-inner{
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 48px;
  }

  /* LEFT */
  .li-left{
    flex: 0 0 50%;
    max-width: 600px;
    padding-top: 100px;
  }

  .li-trail{
    margin-bottom: 88px;
  }

  .li-title{
    font-size: clamp(28px, 4vw, 52px);
    font-weight: 800;
    color: #fff;
    line-height: 1.15;
    margin: 0 0 18px;
    letter-spacing: -0.5px;
    margin-bottom: 48px;
  }

  .li-desc{
    font-size: 15px;
    color: rgba(255,255,255,0.72);
    line-height: 1.75;
    max-width: 480px;
    margin: 0 0 42px;
  }

  .li-btn-orange{
    display: inline-flex;
    align-items: center;
    padding: 15px 34px;
    background: #F4622A;
    color: #fff;
    text-decoration: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 800;
    box-shadow: 0 4px 24px rgba(244,98,42,0.45);
    white-space: nowrap;
    transition: transform 0.2s, box-shadow 0.2s;
    margin-bottom: 68px;
  }
  .li-btn-orange:hover{
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(244,98,42,0.6);
  }

  .li-stats{
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .li-stat-item{
    display: flex;
    align-items: center;
    gap: 24px;
    padding-right: 24px;
  }

  .li-stat-divider{
    width: 1px;
    height: 44px;
    background: rgba(255,255,255,0.18);
    flex-shrink: 0;
  }

  .li-stat-value{
    font-size: 56px;
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
  }

  .li-stat-label{
    font-size: 13px;
    color: rgba(255,255,255,0.55);
    margin-top: 4px;
    white-space: nowrap;
  }

  /* RIGHT — Card */
  .li-right{
    flex: 0 0 42%;
    max-width: 800px;
    width: 100%;
    padding-top: 80px;
    
  }

  .li-card{
    background: #fff;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.25);
    width: 100%;
  }

  .li-card-title{
    font-size: 22px;
    font-weight: 800;
    color: #0B1F4D;
    margin: 0 0 24px;
  }

  .li-field{
    display: block;
    margin-bottom: 18px;
  }

  .li-label{
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: #1F2937;
    margin-bottom: 8px;
  }

  .li-input-wrap{
    position: relative;
    display: flex;
    align-items: center;
  }

  .li-input,
  .li-select{
    width: 100%;
    padding: 12px 14px;
    border: 1.5px solid #E2E8F0;
    border-radius: 8px;
    font-size: 14px;
    color: #1F2937;
    background: #fff;
    font-family: 'matterregular', sans-serif;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    transition: border-color 0.15s;
  }
  .li-input:focus,
  .li-select:focus{
    border-color: #38BDF8;
  }

  .li-input{
    padding-right: 40px;
  }

  .li-calendar-icon{
    position: absolute;
    right: 14px;
    pointer-events: none;
  }

  .li-select{
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 20 20' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='5 8 10 13 15 8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 38px;
  }

  .li-row-2{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .li-submit{
    width: 100%;
    padding: 16px;
    background: #1B8A3A;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 800;
    font-family: 'matterregular', sans-serif;
    cursor: pointer;
    margin-top: 6px;
    transition: background 0.2s;
  }
  .li-submit:hover{
    background: #157330;
  }

  .li-disclaimer{
    text-align: center;
    font-size: 12px;
    color: #9CA3AF;
    margin: 12px 0 0;
  }

  /* ── TABLET (≤1024px) ── */
  @media(max-width: 1024px){
    .li-inner{
      flex-direction: column;
      align-items: stretch;
    }
    .li-left,
    .li-right{
      flex: unset;
      max-width: 100%;
      width: 100%;
    }
    .li-left{
      text-align: left;
      margin-bottom: 16px;
    }
    .li-card{
      max-width: 560px;
      margin: 0 auto;
    }
  }

  /* ── MOBILE (≤600px) ── */
  @media(max-width: 600px){
    .li-hero{
      padding: 40px 16px;
    }
    .li-title{
      font-size: clamp(26px, 8vw, 36px);
    }
    .li-desc{
      font-size: 14px;
    }
    .li-btn-orange{
      width: 100%;
      justify-content: center;
      margin-bottom: 36px;
    }
    .li-stats{
      display: none;
    }
    .li-card{
      padding: 24px 20px;
    }
    .li-row-2{
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
`;