import React from "react";
import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";

export default function Maintenance() {
  return (
    <div
      style={{
        overflowX: "hidden",
        width: "100%",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar alwaysSolid={true} />

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "180px 20px 100px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontFamily: "'matterregular', sans-serif",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              backgroundColor: "#FFF1ED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 28px",
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.7 6.3a1 1 0 0 0-1.4 0L11 8.6 9.4 7 11.7 4.7a1 1 0 0 0 0-1.4 5 5 0 0 0-6.6 6.6L1.3 13.7a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l3.8-3.8 1.6 1.6-2.3 2.3a1 1 0 0 0 0 1.4 5 5 0 0 0 6.6-6.6l3.8-3.8a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0z"
                fill="#EC4F34"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "2.25rem",
              color: "#111827",
              marginBottom: "0.75rem",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            We&apos;ll be right back
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: "1.1rem",
              color: "#4B5563",
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            This page is currently undergoing scheduled maintenance while we
            improve things for you. Please check back shortly.
          </p>

          {/* Contact card */}
          <div
            style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #F0F0F0",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "2rem",
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontSize: "0.95rem",
                color: "#6B7280",
                marginBottom: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Need help right now?
            </p>

            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#EC4F34", fontWeight: 600, marginRight: "8px" }}>
                Call:
              </span>
              
               <a href="tel:18004258084"
                style={{ color: "#111827", textDecoration: "none", fontWeight: 500 }}
              >
                1800 425 8084 (Toll-free, 24/7)
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: "#EC4F34", fontWeight: 600, marginRight: "8px" }}>
                Email:
              </span>
              
               <a  href="mailto:care@transindia.com"
                style={{ color: "#111827", textDecoration: "underline", fontWeight: 500 }}
              >
                care@transindia.com
              </a>
            </div>
          </div>

          {/* Back to home */}
          
            <a href="/"
            style={{
              display: "inline-block",
              backgroundColor: "#EC4F34",
              color: "#ffffff",
              padding: "12px 28px",
              borderRadius: "8px",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "1rem",
            }}
          >
            Back to Home
          </a>
        </div>
      </main>

      <TransindiaFooter />
    </div>
  );
}