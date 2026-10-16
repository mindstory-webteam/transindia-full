"use client";

import RelationshipSection from "@/components/RelationshipSection";
import ProcessStepsSection from "@/components/ProcessStepsSection";
import PartnerFeatureCards from "@/components/PartnerFeatureCards";

export default function InsuranceSection() {
  return (
    <>
      <style>{CSS}</style>
      <section className="ins-section">
        <div className="ins-container">
          {/* ── 1. Heading ── */}
          <div className="ins-heading">
            <h2 className="ins-title">
              Why <span style={{ color: "#F15A3E" }}>Choose </span>
              <span style={{ color: "#00BCD4" }}>Transindia</span>
            </h2>
            <p className="ins-subtitle">
              We cut through the complexity so you always know exactly what
              <br className="ins-br" />
              you&apos;re covered for — and how to use it.
            </p>
          </div>

          {/* ── 2. More Than a Policy. A Partner You Can Rely On. (4 Cards) ── */}
          <PartnerFeatureCards />

          {/* ── 3. Relationship Section Component ── */}
          <div
            style={{
              borderRadius: 24,
              overflow: "hidden",
              border: "1.5px solid #CFEFF5",
              boxShadow: "0 10px 30px rgba(2, 132, 199, 0.08)",
            }}
          >
            <RelationshipSection />
          </div>

          {/* ── Process Steps (From Your First Question to Your Next Claim) ── */}
          <ProcessStepsSection showRenew={true} />
        </div>
      </section>
    </>
  );
}

const CSS = `
  .ins-section {
    background: #F3F7FF;
    padding: clamp(60px, 8vw, 100px) 0;
    font-family: var(--font-sora), "Sora", sans-serif;
  }

  .ins-container {
    max-width: 1360px;
    margin: 0 auto;
    padding: 0 clamp(20px, 4vw, 40px);
  }

  .ins-heading {
    text-align: center;
    margin-bottom: 40px;
  }

  .ins-title {
    font-size: clamp(28px, 3.2vw, 38px);
    font-weight: 800;
    line-height: 1.15;
    color: #1A1A1A;
    margin-bottom: 12px;
    letter-spacing: -0.02em;
  }

  .ins-subtitle {
    font-size: clamp(14px, 1.2vw, 16px);
    line-height: 1.6;
    color: #64748B;
    max-width: 620px;
    margin: 0 auto;
  }

  @media (max-width: 640px) {
    .ins-br {
      display: none;
    }
  }
`;

export { RelationshipSection };
