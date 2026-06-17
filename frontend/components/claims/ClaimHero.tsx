"use client";

import { useState } from "react";
import Breadcrum from "@/components/Breadcrum";

export default function ClaimHero() {
  const [urgent, setUrgent] = useState(false);

  return (
    <>
      <style>{CSS}</style>
      <section className="clh-section">
        <div className="clh-inner">
          {/* Breadcrumb */}
          <div className="clh-trail-wrapper">
            <Breadcrum crumbs={[{ label: "Home", href: "/" }, { label: "Claims" }]} />
          </div>

          {/* ── LEFT COLUMN ── */}
          <div className="clh-left">
            <h1 className="clh-title">
              We fight for your
              <br />
              <span style={{ color: "#F15A40" }}>claim so you </span>
              <span style={{ color: "#20BEC6" }}>don&apos;t have to</span>
            </h1>

            <p className="clh-desc">
              Filing a claim shouldn&apos;t be a battle. TransIndia&apos;s dedicated claims team
              handles every document, follows up with insurers, and ensures your
              rightful payout — without the runaround.
            </p>

            {/* ── BENTO CARDS ── */}
            <div className="clh-bento">

              {/* Row 1 — Full width: Emergency Helpline */}
              <a href="tel:18004567890" className="clh-card clh-card--full clh-card--call">
                <div className="clh-card-icon">
                  <img src="/images/claims/claims-hero/Call.svg" alt="Call" width={26} height={26} />
                </div>
                <div className="clh-card-text">
                  <p className="clh-card-label">Emergency Claim Helpline</p>
                  <p className="clh-card-value">1800-456-7890</p>
                </div>
              </a>

              {/* Row 2 — Two equal cards: Email + WhatsApp */}
              <div className="clh-card-row">
                <a href="mailto:claims@transindia.com" className="clh-card clh-card--half clh-card--dark">
                  <div className="clh-card-icon">
                    <img src="/images/claims/claims-hero/Email.svg" alt="Email" width={24} height={24} />
                  </div>
                  <div className="clh-card-text">
                    <p className="clh-card-label">Email for Claims</p>
                    <p className="clh-card-value">Claim@transindia.com</p>
                  </div>
                </a>

                <a href="https://wa.me/917510715195" className="clh-card clh-card--half clh-card--dark">
                  <div className="clh-card-icon">
                    <img src="/images/claims/claims-hero/Chat.svg" alt="Chat" width={24} height={24} />
                  </div>
                  <div className="clh-card-text">
                    <p className="clh-card-label">Whatsapp Claims</p>
                    <p className="clh-card-value">+91 7510715195</p>
                  </div>
                </a>
              </div>

              {/* Row 3 — Full width: Important notice */}
              <div className="clh-card clh-card--full clh-card--warn">
                <div className="clh-card-icon clh-card-icon--warn">
                  <img src="/images/claims/claims-hero/Error.svg" alt="Warning" width={22} height={22} />
                </div>
                <p className="clh-card-warn-text">
                  <span className="clh-card-warn-bold">Important</span> : Intimate your claim as soon as possible.
                  Most policies require intimation within 24–48 hours of an incident.
                  Late intimation can complicate the process.
                </p>
              </div>

            </div>
          </div>

          {/* ── RIGHT COLUMN — Form ── */}
          <div className="clh-form-wrap">
            <h2 className="clh-form-title">Claim Intimation Form</h2>
            <form className="clh-form">
              <div className="clh-row">
                <div className="clh-group">
                  <label className="clh-label">Your Name</label>
                  <input type="text" placeholder="Full Name" className="clh-input" />
                </div>
                <div className="clh-group">
                  <label className="clh-label">Mobile Number</label>
                  <input type="text" placeholder="+91 0000000000" className="clh-input" />
                </div>
              </div>

              <div className="clh-group">
                <label className="clh-label">Policy Number</label>
                <input type="text" placeholder="XXXXXXXXXX" className="clh-input" />
              </div>

              <div className="clh-group">
                <label className="clh-label">Insurance Type</label>
                <select className="clh-input clh-select">
                  <option>Life Insurance</option>
                  <option>Health Insurance</option>
                  <option>Motor Insurance</option>
                  <option>Travel Insurance</option>
                </select>
              </div>

              <div className="clh-group">
                <label className="clh-label">Claim Type</label>
                <select className="clh-input clh-select">
                  <option>Death Claim</option>
                  <option>Maturity Claim</option>
                  <option>Surrender Claim</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="clh-group">
                <label className="clh-label">Brief Description</label>
                <textarea
                  placeholder="Describe the incident briefly, what happened, when and any immediate action taken..."
                  rows={4}
                  className="clh-input clh-textarea"
                />
              </div>

              <div className="clh-group" style={{ gap: "6px" }}>
                <div>
                  <label className="clh-label" style={{ fontSize: "14px", color: "#000", fontWeight: "700" }}>Upload Supporting Documents</label>
                  <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#8c8c8c", fontWeight: "600" }}>JPG, PNG, PDF up to 10 MB each, You can upload multiple files</p>
                </div>
                <div className="clh-upload-box">
                  <input type="file" multiple className="clh-upload-input" />
                  <div className="clh-upload-content">
                    <img src="/images/claims/claims-hero/cloud-upload.svg" alt="Upload" width={28} height={28} />
                    <div className="clh-upload-text">
                      <p><span className="clh-upload-link">Click to upload</span> or drag and drop files here</p>
                      <p className="clh-upload-empty">No files uploaded yet</p>
                    </div>
                  </div>
                </div>
              </div>

              <label className="clh-checkbox-row">
                <input
                  type="checkbox"
                  checked={urgent}
                  onChange={(e) => setUrgent(e.target.checked)}
                  className="clh-checkbox"
                />
                This is an urgent / emergency claim- please call me immediately
              </label>

              <button type="submit" className="clh-submit">
                Submit Claim Intimation
              </button>
            </form>
          </div>

        </div>
      </section>
    </>
  );
}

const CSS = `
  /* ── Section ── */
  .clh-section {
    background: url('/images/claims/claims-hero-banner.png') center/cover no-repeat, #0b1240;
    position: relative;
    overflow: visible;
    padding-top: 150px;
    padding-bottom: 80px;
    font-family: 'matterregular', sans-serif;
  }

  /* ── Inner: wider form column, tighter gap ── */
  .clh-inner {
    max-width: 1350px;
    margin: 0 auto;
    padding: 0 32px;
    display: grid;
    grid-template-columns: 1fr 580px;
    gap: 40px;
    align-items: start;
    position: relative;
    z-index: 2;
  }

  /* ── Breadcrumb ── */
  .clh-trail-wrapper {
    position: absolute;
    top: -25px;
    left: 32px;
  }

  /* ── Left column ── */
  .clh-left {
    color: #fff;
    padding-top: 16px;
  }

  .clh-title {
    font-size: 52px;
    font-weight: 800;
    color: #fff;
    line-height: 1.15;
    margin: 0 0 20px 0;
    letter-spacing: -0.5px;
  }

  .clh-desc {
    font-size: 15px;
    color: rgba(255,255,255,0.78);
    line-height: 1.75;
    margin: 0 0 28px 0;
    max-width: 520px;
  }

  /* ── BENTO card grid ── */
  .clh-bento {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 560px;
  }

  .clh-card-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  /* ── Base card ── */
  .clh-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    border-radius: 14px;
    text-decoration: none;
    border: 1px solid rgba(255,255,255,0.08);
    transition: opacity 0.18s, transform 0.15s;
  }

  .clh-card--call  { background: #12235A; color:#B5C1DA;  }
  .clh-card--dark  { background: #12235A; color:#B5C1DA; }
  .clh-card--warn  {
    background: rgba(63, 17, 34, 0.39);
    border: 1px solid #C98388;
    color: #B5C1DA
    cursor: default;
    align-items: flex-start;
  }

  .clh-card-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }



  .clh-card-label {
    font-size: 11px;
    font-weight: 500;
    color: rgba(255,255,255,0.55);
    margin: 0 0 4px 0;
    letter-spacing: 0.2px;
  }

  .clh-card-value {
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    margin: 0;
    line-height: 1.2;
  }

  .clh-card-warn-text {
    font-size: 13px;
    color: rgba(255,255,255,0.82);
    line-height: 1.65;
    margin: 0;
  }

  .clh-card-warn-bold {
    color: #FF2F43;
    font-weight: 700;
  }

  /* ── Form wrapper (narrower, taller) ── */
  .clh-form-wrap {
    background: #fff;
    border-radius: 20px;
    padding: 20px 28px 32px 28px;
    box-shadow: 0 20px 60px rgba(10,20,90,0.22), 0 4px 16px rgba(0,0,0,0.08);
    position: sticky;
    top: 100px;
    margin-top: -60px;
  }

  .clh-form-title {
    font-size: 20px;
    font-weight: 800;
    color: #0b1240;
    margin: 0 0 16px 0;
    font-family: var(--font-sora), 'Sora', sans-serif;
  }

  .clh-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .clh-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .clh-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .clh-label {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
  }

  .clh-input {
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 13px;
    color: #111827;
    font-family: 'matterregular', sans-serif;
    background: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
    box-sizing: border-box;
    appearance: auto;
  }
  .clh-input:focus {
    border-color: #20BEC6;
    box-shadow: 0 0 0 3px rgba(32,190,198,0.12);
  }

  .clh-select { cursor: pointer; }
  .clh-textarea { resize: none; }

  .clh-checkbox-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 12px;
    color: #6b7280;
    line-height: 1.5;
    cursor: pointer;
  }

  .clh-checkbox {
    width: 14px;
    height: 14px;
    margin-top: 2px;
    accent-color: #20BEC6;
    flex-shrink: 0;
  }

  .clh-submit {
    background: #15833E;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    padding: 13px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(26,122,71,0.35);
    width: 100%;
  }

  /* ── Upload Box Styles ── */
  .clh-upload-box {
    position: relative;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
    text-align: center;
    transition: border-color 0.2s;
    cursor: pointer;
  }
  .clh-upload-box:hover {
    border-color: #20BEC6;
  }
  .clh-upload-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  .clh-upload-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .clh-upload-text {
    text-align: left;
    font-size: 13px;
    color: #6b7280;
  }
  .clh-upload-text p {
    margin: 0;
    line-height: 1.4;
  }
  .clh-upload-link {
    color: #0066FF;
    font-weight: 600;
  }
  .clh-upload-empty {
    font-size: 12px;
    color: #9ca3af;
  }


  /* ── 1400px (xl) ── */
  @media (max-width: 1400px) {
    .clh-inner { grid-template-columns: 1fr 520px; gap: 32px; }
  }

  /* ── 1200px ── */
  @media (max-width: 1200px) {
    .clh-inner { grid-template-columns: 1fr 440px; gap: 28px; }
    .clh-title { font-size: 44px; }
    .clh-desc { max-width: 100%; }
  }

  /* ── 1024px ── */
  @media (max-width: 1024px) {
    .clh-section { padding-top: 130px; padding-bottom: 60px; }
    .clh-inner { grid-template-columns: 1fr 380px; gap: 24px; padding: 0 24px; }
    .clh-title { font-size: 38px; }
    .clh-form-wrap { padding: 28px 22px; }
    .clh-trail-wrapper { top: -45px; left: 24px; }
  }

  /* ── 900px: stack vertically ── */
  @media (max-width: 900px) {
    .clh-section { padding-top: 110px; padding-bottom: 48px; }
    .clh-inner { grid-template-columns: 1fr; gap: 32px; padding: 0 24px; }
    .clh-title { font-size: 34px; }
    .clh-bento { max-width: 100%; }
    .clh-form-wrap { position: static; padding: 28px 24px; margin-top: 0; }
    .clh-card-row { grid-template-columns: 1fr 1fr; }
  }

  /* ── 768px (narrow tablet) ── */
  @media (max-width: 768px) {
    .clh-section { padding-top: 105px; }
    .clh-inner { padding: 0 20px; gap: 28px; }
    .clh-title { font-size: 30px; }
    .clh-desc { font-size: 14px; }
    .clh-form-title { font-size: 18px; }
    .clh-form-wrap { padding: 24px 20px; border-radius: 18px; }
    .clh-row { grid-template-columns: 1fr 1fr; }
  }

  /* ── 600px (mobile) ── */
  @media (max-width: 600px) {
    .clh-section { padding-top: 100px; padding-bottom: 32px; background: #0b1240; }
    .clh-inner { padding: 0 16px; gap: 40px; }
    .clh-trail-wrapper { display: none; }
    .clh-title { font-size: 26px; letter-spacing: -0.3px; }
    .clh-desc { font-size: 13.5px; margin-bottom: 18px; }

    /* Bento: keep 2-col for row-2 cards, collapse important card */
    .clh-bento { gap: 8px; padding-top: 20px; }
    .clh-card-row { grid-template-columns: 1fr 1fr; gap: 8px; }
    .clh-card { padding: 12px 12px; gap: 10px; border-radius: 12px; }
    .clh-card-icon { width: 36px; height: 36px; }
    .clh-card-label { font-size: 10px; }
    .clh-card-value { font-size: 12px; }
    .clh-card-warn-text { font-size: 12px; }

    /* Form */
    .clh-form-wrap { padding: 40px 16px 20px 16px; border-radius: 16px; }
    .clh-form-title { font-size: 16px; margin-bottom: 16px; }
    .clh-form { gap: 10px; }
    .clh-row { grid-template-columns: 1fr; }
    .clh-input { padding: 8px 11px; font-size: 12.5px; }
    .clh-label { font-size: 11.5px; }
  }

  /* ── 400px (xs phones) ── */
  @media (max-width: 400px) {
    .clh-title { font-size: 22px; }
    .clh-card-row { grid-template-columns: 1fr; }
    .clh-card-value { font-size: 11px; }
  }
`;
