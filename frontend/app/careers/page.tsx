"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const jobs = [
  { id: 1,  title: "Product Designer",          description: "We're looking for a mid-level product designer to join our team.",              tags: [" Remote", "Full-time"] },
  { id: 2,  title: "Engineering Manager",        description: "We're looking for an experienced engineering manager to join our team.",        tags: [" Remote", "Full-time"] },
  { id: 3,  title: "Customer Success Manager",   description: "We're looking for a customer success manager to join our team.",                tags: [" Remote", "Full-time"] },
  { id: 4,  title: "Account Executive",          description: "We're looking for an account executive to join our team.",                      tags: [" Remote", "Full-time"] },
  { id: 5,  title: "Marketing Specialist",       description: "We're looking for a creative marketing specialist to grow our brand.",          tags: [" Remote", "Full-time"] },
  { id: 6,  title: "Sales Associate",            description: "We're looking for a driven sales associate to expand our reach.",               tags: [" Remote", "Full-time"] },
  { id: 7,  title: "Data Analyst",               description: "We're looking for a data analyst to turn insights into decisions.",             tags: [" Remote", "Full-time"] },
  { id: 8,  title: "HR Business Partner",        description: "We're looking for an HR partner to support our growing team.",                  tags: [" Remote", "Full-time"] },
  { id: 9,  title: "Content Writer",             description: "We're looking for a content writer to craft compelling insurance narratives.",   tags: [" Remote", "Full-time"] },
  { id: 10, title: "Operations Lead",            description: "We're looking for an operations lead to streamline our processes.",             tags: [" Remote", "Full-time"] },
  { id: 11, title: "UX Researcher",              description: "We're looking for a UX researcher to understand our users deeply.",             tags: [" Remote", "Full-time"] },
  { id: 12, title: "Finance Manager",            description: "We're looking for a finance manager to oversee our financial operations.",      tags: [" Remote", "Full-time"] },
];

const JOBS_PER_PAGE = 10;

export default function CareersPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const start = (page - 1) * JOBS_PER_PAGE;
  const visibleJobs = jobs.slice(start, start + JOBS_PER_PAGE);

  return (
    <>
      <style>{CSS}</style>
      <div className="careers-page">
        <Navbar alwaysSolid={true} />

        {/* Hero */}
        <section className="careers-hero">
          {/* Breadcrumb — hidden on sm/md */}
          <nav className="careers-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="bc-link">Home</Link>
            <span className="bc-sep">›</span>
            <span className="bc-current">Careers</span>
          </nav>

          <h1 className="careers-title">
            Be part of <span className="careers-title-accent">our mission</span>
          </h1>
          <p className="careers-subtitle">
            We're looking for passionate people to join us on our mission. We value
            flat hierarchies, clear communication, and full ownership and responsibility.
          </p>
        </section>

        {/* Job listings */}
        <section className="careers-jobs">
          {jobs.length === 0 ? (
            <div className="no-openings">
              <h2 className="no-openings-title">No openings available</h2>
              <p className="no-openings-desc">
                We don't have any open positions right now, but we're always looking for great people.
                <br />Drop us a line at{" "}
                <a href="mailto:care@transindia.com" className="no-openings-link">care@transindia.com</a>
              </p>
            </div>
          ) : (
          <div className="careers-jobs-grid">
            {visibleJobs.map((job) => (
              <div key={job.id} className="job-item">
                <div className="job-top">
                  <h2 className="job-title">{job.title}</h2>
                  {/* Desktop Apply — hidden on mobile */}
                  <a
                    href={`mailto:care@transindia.com?subject=Application for ${job.title}`}
                    className="job-apply job-apply-desktop"
                  >
                    Apply
                  </a>
                </div>
                <p className="job-desc">{job.description}</p>
                <div className="job-tags">
                  <span className="job-tag">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    {job.tags[0]}
                  </span>
                  <span className="job-tag">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {job.tags[1]}
                  </span>
                  {/* Mobile Apply — shown only on mobile, sits next to tags */}
                  <a
                    href={`mailto:care@transindia.com?subject=Application for ${job.title}`}
                    className="job-apply job-apply-mobile"
                  >
                    Apply
                  </a>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pg-btn pg-arrow"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`pg-btn${page === p ? " pg-active" : ""}`}
                  onClick={() => setPage(p)}
                  aria-current={page === p ? "page" : undefined}
                >
                  {p}
                </button>
              ))}

              <button
                className="pg-btn pg-arrow"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </section>

        <TransindiaFooter />
      </div>
    </>
  );
}

const CSS = `
  .careers-page {
    min-height: 100vh;
    background: #f8faff;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  /* ── Hero ── */
  .careers-hero {
    padding: 140px 80px 52px;
  }

  /* ── Breadcrumb ── */
  .careers-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 24px;
  }

  .bc-link {
    font-size: 13px;
    color: #666;
    text-decoration: none;
    transition: color 0.15s;
  }

  .bc-link:hover { color: #111; }

  .bc-sep {
    font-size: 13px;
    color: #aaa;
  }

  .bc-current {
    font-size: 13px;
    color: #111;
    font-weight: 600;
  }

  .careers-title {
    font-size: 38px;
    font-weight: 800;
    color: #111;
    line-height: 1.2;
    letter-spacing: -0.5px;
    margin: 0 0 16px 0;
  }

  .careers-title-accent { color: #00b8c4; }

  .careers-subtitle {
    font-size: 15px;
    color: #555;
    line-height: 1.7;
    margin: 0;
    max-width: 560px;
  }

  /* ── Jobs section ── */
  .careers-jobs {
    flex: 1;
    padding: 0 80px 80px;
  }

  /* 2-column grid */
  .careers-jobs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 48px;
    border-top: 1px solid #d5d0c8;
  }

  /* Each item — original list-row look */
  .job-item {
    display: flex;
    flex-direction: column;
    padding: 26px 0;
    border-bottom: 1px solid #d5d0c8;
    background: transparent;
  }

  .job-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 8px;
  }

  .job-title {
    font-size: 16px;
    font-weight: 700;
    color: #111;
    margin: 0;
    letter-spacing: -0.2px;
  }

  .job-desc {
    font-size: 13px;
    color: #555;
    margin: 0 0 14px 0;
    line-height: 1.55;
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
    padding: 4px 11px;
    font-size: 11.5px;
    color: #444;
    font-weight: 500;
    background: transparent;
  }

  /* Desktop Apply — visible by default */
  .job-apply-desktop { display: inline-flex !important; }
  /* Mobile Apply — hidden by default */
  .job-apply-mobile  { display: none !important; }

  .job-apply {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 7px 18px;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    background: #111;
    border-radius: 999px;
    text-decoration: none;
    white-space: nowrap;
    letter-spacing: 0.01em;
    transition: background 0.18s, transform 0.15s;
  }

  .job-apply:hover {
    background: #ec4f34;
    transform: translateY(-1px);
  }

  /* ── Empty state ── */
  .no-openings {
    padding: 100px 20px 80px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .no-openings-icon {
    font-size: 48px;
    margin-bottom: 8px;
  }

  .no-openings-title {
    font-size: 22px;
    font-weight: 700;
    color: #111;
    margin: 0;
  }

  .no-openings-desc {
    font-size: 14.5px;
    color: #666;
    line-height: 1.7;
    margin: 0;
    max-width: 420px;
  }

  .no-openings-link {
    color: #00b8c4;
    font-weight: 600;
    text-decoration: none;
  }

  .no-openings-link:hover { text-decoration: underline; }

  /* ── Pagination ── */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 40px;
    flex-wrap: wrap;
  }

  .pg-btn {
    min-width: 36px;
    height: 36px;
    padding: 0 10px;
    border: 1.5px solid #d5d0c8;
    border-radius: 8px;
    background: #fff;
    color: #333;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
    font-family: inherit;
  }

  .pg-btn:hover:not(:disabled) {
    border-color: #00b8c4;
    color: #00b8c4;
  }

  .pg-btn.pg-active {
    background: #00b8c4;
    border-color: #00b8c4;
    color: #fff;
    font-weight: 700;
  }

  .pg-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .pg-arrow {
    font-size: 18px;
    line-height: 1;
  }

  /* ── Responsive ── */

  /* Large desktop (≤ 1280px) */
  @media (max-width: 1280px) {
    .careers-hero { padding: 140px 64px 52px; }
    .careers-jobs { padding: 0 64px 72px; }
  }

  /* Tablet landscape (≤ 1024px) */
  @media (max-width: 1024px) {
    .careers-hero { padding: 130px 48px 44px; }
    .careers-jobs { padding: 0 48px 64px; }
    .careers-title { font-size: 34px; }
    .careers-jobs-grid { column-gap: 32px; }
  }

  /* Tablet portrait (≤ 768px): single column, hide breadcrumb */
  @media (max-width: 768px) {
    .careers-breadcrumb { display: none; }
    .careers-hero { padding: 120px 24px 36px; }
    .careers-jobs { padding: 0 24px 56px; }
    .careers-title { font-size: 30px; }
    .careers-subtitle { font-size: 14.5px; }

    .careers-jobs-grid {
      grid-template-columns: 1fr;
      column-gap: 0;
    }

    .job-item { padding: 22px 0; }
    .job-top { align-items: center; }
    .job-apply { padding: 6px 14px; font-size: 12.5px; }

    .no-openings { padding: 80px 20px 60px; }
    .no-openings-title { font-size: 20px; }
    .no-openings-desc { font-size: 14px; }
  }

  /* Large mobile (≤ 600px) */
  @media (max-width: 600px) {
    .careers-title { font-size: 28px; }
    .job-title { font-size: 15px; }
    .job-desc { font-size: 12.5px; }
    .pagination { gap: 4px; margin-top: 32px; }
  }

  /* Mobile (≤ 480px) */
  @media (max-width: 480px) {
    .careers-hero { padding: 110px 16px 32px; }
    .careers-jobs { padding: 0 16px 48px; }
    .careers-title { font-size: 24px; letter-spacing: 0; }
    .careers-subtitle { font-size: 13.5px; }

    .job-item { padding: 18px 0; }

    /* Hide desktop Apply, show mobile Apply next to tags */
    .job-apply-desktop { display: none !important; }
    .job-apply-mobile  { display: inline-flex !important; }

    .job-tags { gap: 6px; align-items: center; }
    .job-tag { font-size: 11px; padding: 3px 9px; }
    .job-apply { padding: 5px 13px; font-size: 11.5px; }

    .pg-btn { min-width: 32px; height: 32px; font-size: 12px; padding: 0 8px; }
    .pagination { gap: 4px; }

    .no-openings { padding: 60px 16px 48px; }
    .no-openings-title { font-size: 18px; }
  }

  /* Very small mobile (≤ 360px) */
  @media (max-width: 360px) {
    .careers-title { font-size: 22px; }
    .careers-subtitle { font-size: 13px; }
    .careers-hero { padding: 100px 14px 28px; }
    .careers-jobs { padding: 0 14px 40px; }
  }
`;
