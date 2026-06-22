import React from "react";
import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";

export default function RenewPolicy() {
  return (
    <div style={{ overflowX: "hidden", width: "100%", backgroundColor: "#ffffff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar alwaysSolid={true} />
      
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "180px 20px 80px" }}>
        <div style={{ textAlign: "center", fontFamily: "'matterregular', sans-serif" }}>
          <h1 style={{ fontSize: "2.5rem", color: "#111827", marginBottom: "1rem", fontWeight: "700" }}>
            This page is under maintainance
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#4B5563" }}>
            Please contact in <a href="mailto:care@transindia.com" style={{ color: "#EC4F34", textDecoration: "underline", fontWeight: "600" }}>care@transindia.com</a>
          </p>
        </div>
      </main>

      <TransindiaFooter />
    </div>
  );
}
