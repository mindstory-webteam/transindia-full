"use client";

import { useState } from "react";

type TabType = "General Query" | "Claim Support" | "Complaint";

export default function ContactFormSection() {
  const [activeTab, setActiveTab] = useState<TabType>("General Query");

  /* ── General Query state ── */
  const [gq, setGq] = useState({ name: "", mobile: "", email: "", insuranceType: "Life Insurance", query: "", callback: false });
  const [gqLoading, setGqLoading] = useState(false);
  const [gqDone, setGqDone] = useState(false);

  /* ── Claim Support state ── */
  const [cs, setCs] = useState({ policyNumber: "", policyHolder: "", mobile: "", claimType: "Death Claim", incident: "" });
  const [csLoading, setCsLoading] = useState(false);
  const [csDone, setCsDone] = useState(false);

  /* ── Complaint state ── */
  const [cp, setCp] = useState({ name: "", policyRef: "", mobile: "", category: "Policy Servicing Issue", details: "" });
  const [cpLoading, setCpLoading] = useState(false);
  const [cpDone, setCpDone] = useState(false);

  const tabs: TabType[] = ["General Query", "Claim Support", "Complaint"];

  const submit = async (
    endpoint: string,
    payload: any,
    setLoading: (v: boolean) => void,
    setDone: (v: boolean) => void,
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_BASE}/contact/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const errData = await res.json();
        alert("Error: " + (errData.message || "Failed to submit"));
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form. Please try again.");
    }
    setLoading(false);
  };

  const SuccessBox = ({ msg, note }: { msg: string; note?: string }) => (
    <div className="success-box">
      <div className="success-box-inner">
        <svg width="24" height="24" viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="22" cy="22" r="21" stroke="#2145d6" strokeWidth="2" />
          <path d="M13 22l7 7 11-13" stroke="#2145d6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="success-msg">{msg}</p>
      </div>
      {note && <p className="success-note">{note}</p>}
    </div>
  );

  const SelectArrow = () => (
    <svg
      style={{
        position: "absolute",
        right: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
      }}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path d="M4 6l4 4 4-4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <section className="cfs-section">
      <div className="cfs-inner">

        {/* ── LEFT: FORM COLUMN ── */}
        <div className="cfs-form-col">
          <p className="cfs-eyebrow">SEND US A MESSAGE</p>
          <h2 className="cfs-heading">
            How can we <span className="cfs-hl">help you ?</span> 
          </h2>

          {/* Tabs */}
          <div className="cfs-tabs" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={`cfs-tab${activeTab === tab ? " cfs-tab--active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── GENERAL QUERY ── */}
          {activeTab === "General Query" && (
            gqDone ? (
              <SuccessBox msg="Thanks! We'll get back to you soon." />
            ) : (
              <form className="cfs-form" onSubmit={(e) => submit("general-query", gq, setGqLoading, setGqDone, e)} noValidate>
                <div className="cfs-row">
                  <div className="cfs-group">
                    <label className="cfs-label">Your Name</label>
                    <input className="cfs-input" type="text" placeholder="Your Full Name"
                      value={gq.name} onChange={(e) => setGq({ ...gq, name: e.target.value })} required />
                  </div>
                  <div className="cfs-group">
                    <label className="cfs-label">Mobile Number</label>
                    <input className="cfs-input" type="tel" placeholder="+91 0000000000"
                      value={gq.mobile} onChange={(e) => setGq({ ...gq, mobile: e.target.value.replace(/\D/g, '') })} required />
                  </div>
                </div>

                <div className="cfs-group">
                  <label className="cfs-label">Email Address</label>
                  <input className="cfs-input" type="email" placeholder="youremail@gmail.com"
                    value={gq.email} onChange={(e) => setGq({ ...gq, email: e.target.value })} required />
                </div>

                <div className="cfs-group">
                  <label className="cfs-label">Insurance Type</label>
                  <div className="cfs-select-wrap">
                    <select className="cfs-input cfs-select" value={gq.insuranceType}
                      onChange={(e) => setGq({ ...gq, insuranceType: e.target.value })}>
                      <option>Life Insurance</option>
                      <option>Health Insurance</option>
                      <option>Motor Insurance</option>
                      <option>Travel Insurance</option>
                      <option>Home Insurance</option>
                    </select>
                    <SelectArrow />
                  </div>
                </div>

                <div className="cfs-group">
                  <label className="cfs-label">Your Query</label>
                  <textarea className="cfs-input cfs-textarea" placeholder="Tell us how we can help you..."
                    value={gq.query} onChange={(e) => setGq({ ...gq, query: e.target.value })} rows={4} />
                </div>

                <label className="cfs-checkbox-label" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#4B5563", cursor: "pointer", marginBottom: "8px" }}>
                  <input
                    type="checkbox"
                    style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#0D439D" }}
                    checked={gq.callback}
                    onChange={(e) => setGq({ ...gq, callback: e.target.checked })}
                  />
                  I&apos;d like a callback from an expert
                </label>

                <button type="submit" className={`cfs-submit${gqLoading ? " cfs-submit--loading" : ""}`} disabled={gqLoading}>
                  {gqLoading ? <span className="cfs-spinner" /> : "Send message"}
                </button>
              </form>
            )
          )}

          {/* ── CLAIM SUPPORT ── */}
          {activeTab === "Claim Support" && (
            csDone ? (
              <SuccessBox msg="Your claim request has been submitted!" note="Our claims team will contact you within 24 hours." />
            ) : (
              <form className="cfs-form" onSubmit={(e) => submit("claim-support", cs, setCsLoading, setCsDone, e)} noValidate>
                {/* Emergency notice */}
                <div className="cfs-emergency">
                  <img src="/images/contact-us/contact-form-section/Siren.svg" alt="Siren" style={{ flexShrink: 0, width: "20px", height: "20px" }} />
                  <p><strong>Emergency Claims?</strong> Call our 24/7 claims hotline: <strong className="cfs-phone">1800 - 456 - 7890</strong> for immediate assistance</p>
                </div>

                <div className="cfs-row">
                  <div className="cfs-group">
                    <label className="cfs-label">Policy Number</label>
                    <input className="cfs-input" type="text" placeholder="0000000000"
                      value={cs.policyNumber} onChange={(e) => setCs({ ...cs, policyNumber: e.target.value })} required />
                  </div>
                  <div className="cfs-group">
                    <label className="cfs-label">Policy Holder Name</label>
                    <input className="cfs-input" type="text" placeholder="Full Name"
                      value={cs.policyHolder} onChange={(e) => setCs({ ...cs, policyHolder: e.target.value })} required />
                  </div>
                </div>

                <div className="cfs-group">
                  <label className="cfs-label">Mobile Number</label>
                  <input className="cfs-input" type="tel" placeholder="+91 0000000000"
                    value={cs.mobile} onChange={(e) => setCs({ ...cs, mobile: e.target.value.replace(/\D/g, '') })} required />
                </div>

                <div className="cfs-group">
                  <label className="cfs-label">Claim Type</label>
                  <div className="cfs-select-wrap">
                    <select className="cfs-input cfs-select" value={cs.claimType}
                      onChange={(e) => setCs({ ...cs, claimType: e.target.value })}>
                      <option>Death Claim</option>
                      <option>Maturity Claim</option>
                      <option>Health Claim</option>
                      <option>Motor Claim</option>
                      <option>Property Claim</option>
                    </select>
                    <SelectArrow />
                  </div>
                </div>

                <div className="cfs-group">
                  <label className="cfs-label">Describe the Incident</label>
                  <textarea className="cfs-input cfs-textarea"
                    placeholder="Please describe the incident briefly, including date and circumstances..."
                    value={cs.incident} onChange={(e) => setCs({ ...cs, incident: e.target.value })} rows={4} />
                </div>

                <button type="submit" className={`cfs-submit cfs-submit--green${csLoading ? " cfs-submit--loading" : ""}`} disabled={csLoading}>
                  {csLoading ? <span className="cfs-spinner" /> : "Submit Claim Request"}
                </button>
              </form>
            )
          )}

          {/* ── COMPLAINT ── */}
          {activeTab === "Complaint" && (
            cpDone ? (
              <SuccessBox msg="Your complaint has been submitted!" note="Complaints resolved within 15 days as per IRDAI norms." />
            ) : (
              <form className="cfs-form" onSubmit={(e) => submit("complaint", cp, setCpLoading, setCpDone, e)} noValidate>
                <div className="cfs-row">
                  <div className="cfs-group">
                    <label className="cfs-label">Your Name</label>
                    <input className="cfs-input" type="text" placeholder="Your Full Name"
                      value={cp.name} onChange={(e) => setCp({ ...cp, name: e.target.value })} required />
                  </div>
                  <div className="cfs-group">
                    <label className="cfs-label">Policy / Ref Number</label>
                    <input className="cfs-input" type="text" placeholder="0000000000"
                      value={cp.policyRef} onChange={(e) => setCp({ ...cp, policyRef: e.target.value })} required />
                  </div>
                </div>

                <div className="cfs-group">
                  <label className="cfs-label">Mobile Number</label>
                  <input className="cfs-input" type="tel" placeholder="+91 0000000000"
                    value={cp.mobile} onChange={(e) => setCp({ ...cp, mobile: e.target.value.replace(/\D/g, '') })} required />
                </div>

                <div className="cfs-group">
                  <label className="cfs-label">Complaint Category</label>
                  <div className="cfs-select-wrap">
                    <select className="cfs-input cfs-select" value={cp.category}
                      onChange={(e) => setCp({ ...cp, category: e.target.value })}>
                      <option>Policy Servicing Issue</option>
                      <option>Claim Delay</option>
                      <option>Claim Rejection</option>
                      <option>Mis-selling</option>
                      <option>Premium Related</option>
                      <option>Other</option>
                    </select>
                    <SelectArrow />
                  </div>
                </div>

                <div className="cfs-group">
                  <label className="cfs-label">Complaint Details</label>
                  <textarea className="cfs-input cfs-textarea"
                    placeholder="Please describe your complaint in detail. The more specific you are, the faster we can resolve it."
                    value={cp.details} onChange={(e) => setCp({ ...cp, details: e.target.value })} rows={4} />
                </div>

                <button type="submit" className={`cfs-submit cfs-submit--red${cpLoading ? " cfs-submit--loading" : ""}`} disabled={cpLoading}>
                  {cpLoading ? <span className="cfs-spinner" /> : "Submit Complaint"}
                </button>
                <p className="cfs-irdai-note">Complaints resolved within 15 days as per IRDAI norms</p>
              </form>
            )
          )}
        </div>

        {/* ── RIGHT: MAP + OFFICE + SOCIAL ── */}
        <div className="cfs-info-col">
          <p className="cfs-eyebrow">OUR OFFICE</p>
          <h2 className="cfs-heading">
            Find us <span className="cfs-hl">near you</span>
          </h2>

          <div className="cfs-map-wrap">
            <iframe
              title="Head Office Kochi"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0!2d76.2998!3d9.9312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0872626fb99f93%3A0xe2d9c0bd7e9e6c62!2sErnakulam%2C%20Kochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="220"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="cfs-office-card">
            <div className="cfs-office-info">
              <div className="cfs-office-icon">
                <img src="/images/contact-us/contact-form-section/Company.svg" alt="Office Icon" style={{ width: "24px", height: "24px" }} />
              </div>
              <div>
                <p className="cfs-office-name">Head Office- Kochi</p>
                <p className="cfs-office-addr">
                  1st Floor, Sivel House, Changampuzha Nagar,<br />
                  S. Kalamassery,<br />
                  Cochin – 682 033
                </p>
                <p className="cfs-office-hours">Mon–Sat: 9AM–6PM</p>
              </div>
            </div>
            <a href="https://maps.google.com/?q=Changampuzha+Nagar+Kochi" target="_blank" rel="noopener noreferrer" className="cfs-dir-btn">
              Direction
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M3 11L11 3M11 3H6M11 3v5" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="cfs-social-card">
            <p className="cfs-social-title">Connect on social</p>
            <div className="cfs-social-links">
              <a href="#" className="cfs-social-btn" aria-label="Facebook">
                <img src="/images/contact-us/contact-form-section/facebook.svg" alt="Facebook" style={{ width: "33px", height: "33px" }} />
                <span className="cfs-social-text">Facebook</span>
              </a>
              <a href="#" className="cfs-social-btn" aria-label="Instagram">
                <img src="/images/contact-us/contact-form-section/Instagram.svg" alt="Instagram" style={{ width: "33px", height: "33px" }} />
                <span className="cfs-social-text">Instagram</span>
              </a>
              <a href="#" className="cfs-social-btn" aria-label="YouTube">
                <img src="/images/contact-us/contact-form-section/youtube.svg" alt="YouTube" style={{ width: "33px", height: "33px" }} />
                <span className="cfs-social-text">Youtube</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cfs-section {
          background: #F8FAFF;
          padding: 180px 24px 72px 24px;
          font-family: 'matterregular', sans-serif;
        }

        .cfs-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }

        /* ── EYEBROW ── */
        .cfs-eyebrow {
          display: inline-block;
          background-color: #e0f4f4;
          color: #00b8c4;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 24px;
        }

        /* ── HEADING ── */
        .cfs-heading {
          font-family: var(--font-sora), "Sora", sans-serif;
          font-size: 38px;
          font-weight: 800;
          color: #111827;
          margin: 0 0 24px 0;
          line-height: 1.2;
        }

        .cfs-hl { color: #00b8c4; }

        /* ── TABS ── */
        .cfs-tabs {
          display: inline-flex;
          justify-content: space-between;
          gap: 4px;
          background: #F3F4F6;
          padding: 6px;
          border-radius: 8px;
          margin-bottom: 32px;
          flex-wrap: wrap;
          width: 100%;
          max-width: 520px;
        }

        .cfs-tab {
          padding: 8px 24px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: #6B7280;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'matterregular', sans-serif;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        }

        .cfs-tab--active {
          background: #fff;
          color: #0A1F6E;
          font-weight: 600;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .cfs-tab:hover:not(.cfs-tab--active) {
          color: #374151;
        }

        /* ── FORM ── */
        .cfs-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cfs-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .cfs-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .cfs-label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .cfs-input {
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 14px;
          color: #111827;
          font-family: 'matterregular', sans-serif;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          box-sizing: border-box;
        }

        .cfs-input:focus {
          border-color: #2145d6;
          box-shadow: 0 0 0 3px rgba(33, 69, 214, 0.1);
        }

        .cfs-input::placeholder { color: #9ca3af; }

        .cfs-select-wrap { position: relative; }

        .cfs-select {
          appearance: none;
          cursor: pointer;
          padding-right: 36px;
        }

        .cfs-textarea {
          resize: vertical;
          min-height: 100px;
        }

        /* ── SUBMIT BUTTONS ── */
        .cfs-submit {
          background: #0D439D;
          color: #fff;
          font-family: 'matterregular', sans-serif;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          padding: 14px;
          cursor: pointer;
          width: 100%;
          transition: background 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
        }

        

        .cfs-submit--green { background: #158740; }

        .cfs-submit--red { background: #97430D; }

        .cfs-submit--loading { opacity: 0.8; cursor: not-allowed; }

        /* ── EMERGENCY NOTICE ── */
        .cfs-emergency {
          display: flex;
          gap: 12px;
          align-items: center;
          background: #F0F4FF;
          border-left: 4px solid #0A1F6E;
          border-radius: 12px;
          padding: 16px 20px;
          font-size: 14px;
          color: #111827;
          line-height: 1.5;
        }

        .cfs-emergency p { margin: 0; }
        .cfs-emergency strong { font-weight: 700; color: #111827; }
        .cfs-emergency .cfs-phone { color: #2145d6; font-weight: 700; }

        /* ── IRDAI NOTE ── */
        .cfs-irdai-note {
          font-size: 12px;
          color: #9ca3af;
          text-align: center;
          margin: 0;
        }

        /* ── SPINNER ── */
        .cfs-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2.5px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: cfs-spin 0.7s linear infinite;
        }

        @keyframes cfs-spin { to { transform: rotate(360deg); } }

        /* ── SUCCESS BOX ── */
        .success-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 60px 24px;
          background: #f0f4ff;
          border-radius: 12px;
          text-align: center;
          min-height: 350px;
        }

        .success-box-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .success-msg {
          font-size: 16px;
          font-weight: 600;
          color: #2145d6;
          margin: 0;
        }

        .success-note {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        /* ── MAP ── */
        .cfs-map-wrap {
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
          border: 1px solid #e5e7eb;
        }

        /* ── OFFICE CARD ── */
        .cfs-office-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 14px;
        }

        .cfs-office-info {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .cfs-office-icon {
          width: 36px;
          height: 36px;
          background: #eef1fd;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .cfs-office-name {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .cfs-office-addr {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0 0 6px 0;
        }

        .cfs-office-hours {
          font-size: 12px;
          color: #0A3D91;
          font-weight: 500;
          margin: 0;
        }

        .cfs-dir-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 14px;
          border: 1.5px solid #141B34;
          border-radius: 8px;
          color: #141B34;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.2s, color 0.2s;
          flex-shrink: 0;
          margin-top: 4px;
        }

      

        /* ── SOCIAL CARD ── */
        .cfs-social-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px 20px;
        }

        .cfs-social-title {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 14px 0;
        }

        .cfs-social-links {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: space-between;

        }

        .cfs-social-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          border: 1.5px solid #e5e7eb;
          color: #374151;
          background: #ECF0F9;
          font-family: 'matterregular', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

       

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .cfs-section {
            padding-top: 280px;
          }
          .cfs-inner {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .cfs-row { grid-template-columns: 1fr; }

          .cfs-heading { font-size: 24px; }

          .cfs-social-links { flex-wrap: wrap; }
        }

        @media (max-width: 640px) {
          .cfs-section {
            padding: 72px 16px 48px 16px;
          }
          .cfs-inner {
            gap: 34px;
          }
          .cfs-social-title {
            display: none;
          }
          .cfs-social-text {
            display: none;
          }
          .cfs-tabs {
            flex-wrap: nowrap;
            padding: 4px;
            gap: 2px;
          }
          .cfs-tab {
            flex: 1;
            padding: 8px 4px;
            font-size: 11px;
            white-space: nowrap;
          }
        }
      `}</style>
    </section>
  );
}
