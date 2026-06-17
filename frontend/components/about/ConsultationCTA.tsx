"use client";

import { useState } from "react";

export default function ConsultationCTA() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    // Simulate API call / form submission
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="cta-section">
      <div className="cta-inner">
        {submitted ? (
          <div className="cta-success">
            <svg
              className="success-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="11" stroke="#fff" strokeWidth="2" />
              <path
                d="M7 12.5l3.5 3.5 6.5-7"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="cta-heading">You&apos;re all set!</h2>
            <p className="cta-sub">
              One of our advisors will reach out to you shortly. No pushy
              sales just honest guidance.
            </p>
          </div>
        ) : (
          <>
            <h2 className="cta-heading">Ready to find the right coverage?</h2>
            <p className="cta-sub">
              Talk to one of our 500+ advisors today no pushy sales, just
              honest guidance.
            </p>
            <button
              className={`cta-btn${loading ? " cta-btn--loading" : ""}`}
              onClick={handleClick}
              disabled={loading}
              aria-label="Get a free consultation"
            >
              {loading ? (
                <span className="spinner" aria-hidden="true" />
              ) : (
                "Get a free consultation"
              )}
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .cta-section {
          background-color: #1149A7;
          padding: 80px 24px;
          text-align: center;
          width: 100%;
        }

        .cta-inner {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .cta-heading {
          font-family: var(--font-sora), "Sora", sans-serif;
          font-size: clamp(26px, 4vw, 36px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          margin: 0;
        }

        .cta-sub {
          font-family: 'matterregular', sans-serif;
          font-size: 16px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.6;
          max-width: 480px;
          margin: 0;
        }

        .cta-btn {
          background-color: #EC4F34;
          color: #ffffff;
          font-family: 'matterregular', sans-serif;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          padding: 14px 32px;
          cursor: pointer;
          margin-top: 8px;
          min-width: 220px;
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, transform 0.15s ease,
            box-shadow 0.2s ease;
        }

      

      


       

        /* Spinner */
        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2.5px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Success state */
        .cta-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .success-icon {
          width: 52px;
          height: 52px;
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Responsive */
        @media (max-width: 480px) {
          .cta-section {
            padding: 60px 20px;
          }

          .cta-btn {
            width: 100%;
            max-width: 340px;
          }
        }
      `}</style>
    </section>
  );
}
