import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";

const jobs = [
  {
    id: 1,
    title: "Product Designer",
    description: "We're looking for a mid-level product designer to join our team.",
    tags: ["100% remote", "Full-time"],
  },
  {
    id: 2,
    title: "Engineering Manager",
    description: "We're looking for an experienced engineering manager to join our team.",
    tags: ["100% remote", "Full-time"],
  },
  {
    id: 3,
    title: "Customer Success Manager",
    description: "We're looking for a customer success manager to join our team.",
    tags: ["100% remote", "Full-time"],
  },
  {
    id: 4,
    title: "Account Executive",
    description: "We're looking for an account executive to join our team.",
    tags: ["100% remote", "Full-time"],
  },
];

export default function CareersPage() {
  return (
    <>
      <style>{CSS}</style>
      <div className="careers-page">
        <Navbar alwaysSolid={true} />

        {/* Hero Section */}
        <section className="careers-hero">
          <span className="careers-badge">We're hiring!</span>
          <h1 className="careers-title">Be part of our mission</h1>
          <p className="careers-subtitle">
            We're looking for passionate people to join us on our mission. We value
            <br />
            flat hierarchies, clear communication, and full ownership and responsibility.
          </p>
        </section>

        {/* Jobs List */}
        <section className="careers-jobs">
          <div className="careers-jobs-container">
            {jobs.map((job) => (
              <div key={job.id} className="job-item">
                <div className="job-left">
                  <h2 className="job-title">{job.title}</h2>
                  <p className="job-desc">{job.description}</p>
                  <div className="job-tags">
                    <span className="job-tag">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {job.tags[0]}
                    </span>
                    <span className="job-tag">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {job.tags[1]}
                    </span>
                  </div>
                </div>
                <a href={`mailto:care@transindia.com?subject=Application for ${job.title}`} className="job-apply">
                  Apply ↗
                </a>
              </div>
            ))}
          </div>
        </section>

        <TransindiaFooter />
      </div>
    </>
  );
}

const CSS = `
  .careers-page {
    min-height: 100vh;
    background: #f5f3ef;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  /* ── Hero ── */
  .careers-hero {
    padding: 160px 80px 80px;
    max-width: 900px;
  }

  .careers-badge {
    display: inline-block;
    border: 1.5px solid #111;
    border-radius: 999px;
    padding: 4px 14px;
    font-size: 13px;
    font-weight: 500;
    color: #111;
    margin-bottom: 28px;
  }

  .careers-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    color: #111;
    line-height: 1.1;
    letter-spacing: -1.5px;
    margin: 0 0 20px 0;
  }

  .careers-subtitle {
    font-size: 15px;
    color: #555;
    line-height: 1.7;
    margin: 0;
  }

  /* ── Jobs section ── */
  .careers-jobs {
    flex: 1;
    padding: 0 80px 80px;
  }

  .careers-jobs-container {
    max-width: 900px;
    border-top: 1px solid #d5d0c8;
  }

  .job-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 28px 0;
    border-bottom: 1px solid #d5d0c8;
    gap: 32px;
  }

  .job-left {
    flex: 1;
  }

  .job-title {
    font-size: 17px;
    font-weight: 700;
    color: #111;
    margin: 0 0 6px 0;
    letter-spacing: -0.2px;
  }

  .job-desc {
    font-size: 13.5px;
    color: #555;
    margin: 0 0 14px 0;
    line-height: 1.5;
  }

  .job-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .job-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: 1.5px solid #c5c0b8;
    border-radius: 999px;
    padding: 4px 12px;
    font-size: 12px;
    color: #444;
    font-weight: 500;
    background: transparent;
  }

  .job-apply {
    flex-shrink: 0;
    font-size: 15px;
    font-weight: 700;
    color: #111;
    text-decoration: none;
    white-space: nowrap;
    padding-top: 2px;
    transition: opacity 0.15s;
  }

  .job-apply:hover {
    opacity: 0.6;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .careers-hero {
      padding: 140px 24px 48px;
    }
    .careers-jobs {
      padding: 0 24px 60px;
    }
    .job-item {
      flex-direction: column;
      gap: 16px;
    }
    .job-apply {
      align-self: flex-start;
    }
  }

  @media (max-width: 480px) {
    .careers-hero {
      padding: 130px 16px 40px;
    }
    .careers-jobs {
      padding: 0 16px 48px;
    }
    .careers-title {
      font-size: 2rem;
    }
  }
`;
