"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const JOBS_PER_PAGE = 10;

interface JobRole {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<JobRole | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/careers/jobs`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) setJobs(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const start = (page - 1) * JOBS_PER_PAGE;
  const visibleJobs = jobs.slice(start, start + JOBS_PER_PAGE);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedJob) return;

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/careers/jobs/${selectedJob._id}/apply`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Application submitted successfully!");
        setSelectedJob(null);
      } else {
        alert(data.message || "Failed to submit application. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("An error occurred while submitting your application.");
    } finally {
      setSubmitting(false);
    }
  };

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

          {jobs.length > 0 && (
            <>
              <h1 className="careers-title">
                Be part of <span className="careers-title-accent">our mission</span>
              </h1>
              <p className="careers-subtitle">
                We're looking for passionate people to join us on our mission. We value
                flat hierarchies, clear communication, and full ownership and responsibility.
              </p>
            </>
          )}
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
              <div key={job._id} className="job-item">
                <div className="job-top">
                  <h2 className="job-title">{job.title}</h2>
                  {/* Desktop Apply — hidden on mobile */}
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="job-apply job-apply-desktop"
                  >
                    Apply
                  </button>
                </div>
                <p className="job-desc">{job.description}</p>
                <div className="job-tags">
                  {job.tags[0] && (
                    <span className="job-tag">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {job.tags[0]}
                    </span>
                  )}
                  {job.tags[1] && (
                    <span className="job-tag">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                      {job.tags[1]}
                    </span>
                  )}
                  {job.createdAt && (
                    <span className="job-tag">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Posted: {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                  {/* Mobile Apply — shown only on mobile, sits next to tags */}
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="job-apply job-apply-mobile"
                  >
                    Apply
                  </button>
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

      {/* Application Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Apply for {selectedJob.title}</h3>
              <button className="modal-close" onClick={() => setSelectedJob(null)}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input type="text" id="name" name="name" required placeholder="John Doe" />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" name="email" required placeholder="john@example.com" />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input type="tel" id="phone" name="phone" required placeholder="+91 9876543210" />
              </div>

              <div className="form-group">
                <label htmlFor="resume">Resume (PDF) *</label>
                <input type="file" id="resume" name="resume" accept=".pdf" required className="file-input" />
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">Cover Letter / Message</label>
                <textarea id="message" name="message" rows={3} placeholder="Tell us why you'd be a great fit..."></textarea>
              </div>

              <div className="modal-actions full-width">
                <button type="button" className="btn-cancel" onClick={() => setSelectedJob(null)} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

  @media (max-width: 360px) {
    .job-top { flex-direction: column; align-items: flex-start; gap: 6px; }
  }

  /* ── Modal CSS ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    animation: fadeIn 0.2s ease-out;
  }

  .modal-content {
    background: #ffffff;
    border-radius: 12px;
    width: 100%;
    max-width: 640px;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    
    /* Hide scrollbar */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  
  .modal-content::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    background: #ffffff;
    z-index: 10;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 700;
    color: #111;
    margin: 0;
  }

  .modal-close {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close:hover {
    background: #f3f4f6;
    color: #111;
  }

  .modal-form {
    padding: 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .full-width {
    grid-column: 1 / -1;
  }

  .form-group label {
    font-size: 13.5px;
    font-weight: 600;
    color: #374151;
  }

  .form-group input[type="text"],
  .form-group input[type="email"],
  .form-group input[type="tel"],
  .form-group textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14.5px;
    font-family: inherit;
    color: #111;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #00b8c4;
    box-shadow: 0 0 0 3px rgba(0, 184, 196, 0.15);
  }

  .file-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px dashed #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    color: #4b5563;
    background: #f9fafb;
    cursor: pointer;
  }

  .file-input::file-selector-button {
    background: #e5e7eb;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    color: #374151;
    font-weight: 600;
    cursor: pointer;
    margin-right: 12px;
    transition: background 0.2s;
  }

  .file-input::file-selector-button:hover {
    background: #d1d5db;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 12px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
  }

  .btn-cancel {
    background: #f3f4f6;
    color: #4b5563;
    border: none;
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14.5px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-cancel:hover {
    background: #e5e7eb;
  }

  .btn-submit {
    background: #00b8c4;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14.5px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-submit:hover {
    background: #00a2ac;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @media (max-width: 600px) {
    .modal-form {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .modal-content {
      max-height: 100vh;
      border-radius: 0;
    }
    .modal-overlay {
      padding: 0;
      align-items: flex-end;
    }
    .modal-content {
      border-radius: 16px 16px 0 0;
    }
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
