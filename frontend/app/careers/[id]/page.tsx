"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";
import Breadcrum from "@/components/Breadcrum";

interface JobRole {
  _id: string;
  title: string;
  description: string;
  department?: string;
  role?: string;
  grade?: string;
  reportingTo?: string;
  responsibilities?: string[];
  skills?: string[];
  tags: string[];
  createdAt: string;
}

export default function CareerDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [job, setJob] = useState<JobRole | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchJob() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/careers/jobs`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            const foundJob = data.data.find((j: JobRole) => j._id === id);
            setJob(foundJob || null);
          }
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id]);

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setShowSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/careers/jobs/${id}/apply`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setShowSuccess(true);
        form.reset();
        setTimeout(() => setShowApplyModal(false), 3000);
      } else {
        const errData = await res.json();
        setErrorMsg(errData.message || "Failed to submit application.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="cd-page">
        <Navbar alwaysSolid={true} />

        {/* Hero */}
        <section className="cd-hero">
          <div className="cd-inner">
            <div className="cd-content">
              <div className="cd-trail-wrapper">
                <Breadcrum
                  crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Careers", href: "/careers" },
                    { label: job?.title || "Job Detail" },
                  ]}
                />
              </div>
              <h1 className="cd-title">
                Join Our <span style={{ color: "#F15A40" }}>Mission</span>
                <br />
                <span style={{ color: "#20BEC6" }}>Shape the Future.</span>
              </h1>
              <p className="cd-desc">
                We're looking for passionate people to join us. We value flat hierarchies, clear communication, and full ownership to build India's most trusted insurance marketplace.
              </p>
            </div>
            <div className="cd-mobile-visual">
              <img src="/images/career/careers_hero.png" alt="TransIndia Careers" />
            </div>
            <div className="cd-lg-banner">
              <img src="/images/career/careers_hero.png" alt="TransIndia Careers Banner" />
            </div>
          </div>
        </section>

        <section className="cd-detail-section">
          {loading ? (
            <div className="cd-loading">
              <div className="cd-spinner" />
              <p>Loading job details...</p>
            </div>
          ) : !job ? (
            <div className="cd-not-found">
              <div className="cd-not-found-icon">🔍</div>
              <h2>Job not found</h2>
              <p>The position you're looking for might have been closed or removed.</p>
              <button className="cd-back-btn" onClick={() => router.push("/careers")}>
                View Open Roles
              </button>
            </div>
          ) : (
            <div className="cd-card">
              <div className="cd-job-header">
                <div className="cd-job-header-left">
                  <h2 className="cd-job-title">{job.title}</h2>
                  <div className="cd-job-tags">
                    {job.tags?.map((tag, i) => (
                      <span key={i} className="cd-tag">{tag}</span>
                    ))}
                    {job.createdAt && (
                      <span className="cd-tag">
                        Posted: {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="cd-apply-desktop">
                  <button onClick={() => setShowApplyModal(true)} className="cd-apply-btn">
                    Apply
                  </button>
                </div>
              </div>

              <div className="cd-divider" />

              <div className="cd-job-body">
                {/* Dynamic Job Metadata Table */}
                <div className="cd-meta-table">
                  {job.department && (
                    <div className="cd-meta-row">
                      <div className="cd-meta-label">Department</div>
                      <div className="cd-meta-colon">:</div>
                      <div className="cd-meta-value">{job.department}</div>
                    </div>
                  )}
                  <div className="cd-meta-row">
                    <div className="cd-meta-label">Job Title</div>
                    <div className="cd-meta-colon">:</div>
                    <div className="cd-meta-value">{job.title}</div>
                  </div>
                  {job.role && (
                    <div className="cd-meta-row">
                      <div className="cd-meta-label">Role</div>
                      <div className="cd-meta-colon">:</div>
                      <div className="cd-meta-value">{job.role}</div>
                    </div>
                  )}
                  {job.grade && (
                    <div className="cd-meta-row">
                      <div className="cd-meta-label">Grade</div>
                      <div className="cd-meta-colon">:</div>
                      <div className="cd-meta-value">{job.grade}</div>
                    </div>
                  )}
                  {job.reportingTo && (
                    <div className="cd-meta-row">
                      <div className="cd-meta-label">Reporting To</div>
                      <div className="cd-meta-colon">:</div>
                      <div className="cd-meta-value cd-meta-value-bold">{job.reportingTo}</div>
                    </div>
                  )}
                </div>

                <div className="cd-spacer" />

                {/* Dynamic Responsibilities */}
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div className="cd-list-section">
                    <h3 className="cd-list-heading">Key Responsibilities</h3>
                    <ul className="cd-bullet-list">
                      {job.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Dynamic Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="cd-list-section">
                    <h3 className="cd-list-heading cd-skills-heading">Skills &amp; Competencies Required</h3>
                    <ul className="cd-bullet-list">
                      {job.skills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="cd-apply-mobile-wrap">
                <div className="cd-apply-mobile">
                  <button onClick={() => setShowApplyModal(true)} className="cd-apply-btn">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {showApplyModal && job && (
          <div className="cd-modal-overlay" onClick={() => setShowApplyModal(false)}>
            <div className="cd-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="cd-modal-header">
                <h3 className="cd-modal-title">Apply for {job.title}</h3>
                <button className="cd-modal-close" onClick={() => setShowApplyModal(false)}>
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              
              <form className="cd-modal-form" onSubmit={handleApply}>
                <div className="cd-form-group cd-full-width">
                  <label htmlFor="name">Full Name *</label>
                  <input type="text" id="name" name="name" required placeholder="John Doe" />
                </div>
                
                <div className="cd-form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input type="email" id="email" name="email" required placeholder="john@example.com" />
                </div>
                
                <div className="cd-form-group">
                  <label htmlFor="phone">Mobile *</label>
                  <input type="tel" id="phone" name="phone" required placeholder="9876543210" />
                </div>
                
                <div className="cd-form-group cd-full-width">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={4} placeholder="Your message..." />
                </div>
                
                <div className="cd-form-group cd-full-width">
                  <label htmlFor="resume">Resume *</label>
                  <input type="file" id="resume" name="resume" required accept=".pdf,.doc,.docx" className="cd-file-input" />
                </div>
                
                <div className="cd-form-group cd-full-width cd-modal-actions">
                  <button type="button" className="cd-btn-cancel" onClick={() => setShowApplyModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="cd-btn-submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
                
                {errorMsg && <div className="cd-full-width" style={{ color: "#ef4444", fontSize: "14px", marginTop: "8px" }}>{errorMsg}</div>}
                {showSuccess && <div className="cd-full-width" style={{ color: "#10b981", fontSize: "14px", marginTop: "8px" }}>Application submitted successfully!</div>}
              </form>
            </div>
          </div>
        )}

        <TransindiaFooter />
      </div>
    </>
  );
}

const CSS = `
  .cd-page { min-height: 100vh; background: #f8faff; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; }
  
  /* Hero */
  .cd-hero { background: #000d3a; position: relative; overflow: hidden; padding-top: 150px; padding-bottom: 40px; }
  .cd-inner { max-width: 1350px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; min-height: 400px; position: relative; z-index: 2; }
  .cd-trail-wrapper { margin-bottom: 20px; }
  .cd-content { position: relative; z-index: 10; flex: 0 0 52%; padding-bottom: 48px; }
  .cd-title { font-size: 55px; font-weight: 800; color: #fff; line-height: 1.15; margin: 0 0 14px 0; letter-spacing: -0.5px; }
  .cd-desc { font-size: 15px; color: rgba(255,255,255,0.80); line-height: 1.72; max-width: 540px; margin: 0 0 32px 0; }
  .cd-mobile-visual { display: none; }
  .cd-lg-banner { position: absolute; right: 40px; top: 46%; transform: translateY(-50%); width: 50%; max-width: 650px; z-index: 1; pointer-events: none; }
  .cd-lg-banner img { width: 100%; height: auto; display: block; object-fit: contain; object-position: center right; }
  @media (max-width: 1450px) { .cd-lg-banner { right: 0; } }
  @media (max-width: 1024px) {
    .cd-trail-wrapper { display: none; } .cd-lg-banner { display: none; }
    .cd-hero { background: #000b37; padding-top: 110px; padding-bottom: 60px; overflow: visible; }
    .cd-inner { flex-direction: column; align-items: flex-start; min-height: auto; padding: 0 28px; }
    .cd-content { flex: 0 0 auto; width: 100%; padding-bottom: 20px; }
    .cd-title { font-size: 34px; } .cd-desc { max-width: 100%; margin-bottom: 24px; }
    .cd-mobile-visual { display: block; width: 100%; text-align: center; padding-bottom: 20px; margin-top: 20px; }
    .cd-mobile-visual img { display: inline-block; max-width: 100%; height: auto; }
  }
  @media (max-width: 600px) {
    .cd-hero { padding-top: 100px; } .cd-inner { padding: 0 20px; }
    .cd-content { padding-bottom: 20px; width: 100%; } .cd-title { font-size: 26px; }
    .cd-mobile-visual { display: block; width: 100%; text-align: center; margin-top: 20px; padding-bottom: 20px; }
    .cd-mobile-visual img { max-width: 100%; height: auto; }
  }

  /* Section & Card */
  .cd-detail-section { flex: 1; padding: 50px 80px 80px; }
  .cd-card { max-width: 900px; margin: 0 auto; padding: 50px 60px; }

  .cd-job-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 24px; }
  .cd-job-header-left { flex: 1; }
  .cd-job-title { font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; letter-spacing: -0.5px; }
  .cd-job-tags { display: flex; gap: 10px; flex-wrap: wrap; }
  .cd-tag { display: inline-flex; align-items: center; border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 999px; padding: 6px 14px; font-size: 13px; color: #475569; font-weight: 600; }
  
  .cd-apply-btn { display: inline-flex; align-items: center; justify-content: center; padding: 12px 28px; font-size: 14.5px; font-weight: 700; color: #fff; background: #EC4F34; border: none; border-radius: 8px; cursor: pointer; white-space: nowrap; font-family: 'matterregular', sans-serif; transition: background 0.18s, box-shadow 0.18s, transform 0.18s; }
  .cd-apply-btn:hover { background: #d44026; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(236,79,52,0.15); }
  
  .cd-apply-desktop { display: inline-flex; } 
  .cd-apply-mobile { display: none; }
  .cd-apply-mobile-wrap { display: none; margin-top: 32px; }
  
  .cd-divider { border: none; border-top: 1px solid #e2e8f0; margin: 32px 0; }
  
  .cd-job-body { display: flex; flex-direction: column; gap: 32px; }

  /* Static Content Styling (Light Mode) */
  .cd-meta-table { display: flex; flex-direction: column; gap: 16px; font-size: 16px; }
  .cd-meta-row { display: grid; grid-template-columns: 160px 20px 1fr; align-items: flex-start; }
  .cd-meta-label { font-weight: 700; color: #334155; }
  .cd-meta-colon { font-weight: 700; color: #94a3b8; text-align: center; }
  .cd-meta-value { color: #0f172a; }
  .cd-meta-value-bold { font-weight: 700; color: #0f172a; }

  .cd-spacer { border-top: 1px solid #f1f5f9; margin: 8px 0; }

  .cd-list-section { display: flex; flex-direction: column; gap: 16px; }
  .cd-list-heading { font-size: 19px; font-weight: 700; color: #0f172a; margin: 0;  text-underline-offset: 4px; }
  .cd-skills-heading { text-decoration: none; }
  
  .cd-bullet-list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 10px; list-style-type: disc; }
  .cd-bullet-list li { font-size: 15.5px; color: #475569; line-height: 1.6; }
  .cd-bullet-list li::marker { color: #00b8c4; font-size: 1.1em; }

  /* Modal */
  .cd-modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; animation: cd-fadeIn 0.2s ease-out; }
  .cd-modal-content { background: #fff; border-radius: 16px; width: 100%; max-width: 640px; max-height: 85vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: cd-slideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
  .cd-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; background: #fff; z-index: 10; }
  .cd-modal-title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; }
  .cd-modal-close { background: #f1f5f9; border: none; color: #64748b; cursor: pointer; padding: 8px; border-radius: 50%; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
  .cd-modal-close:hover { background: #e2e8f0; color: #0f172a; }
  .cd-modal-form { padding: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .cd-form-group { display: flex; flex-direction: column; gap: 8px; }
  .cd-full-width { grid-column: 1 / -1; }
  .cd-form-group label { font-size: 14px; font-weight: 700; color: #334155; }
  .cd-form-group input[type="text"], .cd-form-group input[type="email"], .cd-form-group input[type="tel"], .cd-form-group input[type="url"], .cd-form-group textarea { width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: inherit; color: #0f172a; transition: all 0.2s ease; box-sizing: border-box; background: #f8fafc; }
  .cd-form-group input:focus, .cd-form-group textarea:focus { outline: none; border-color: #00b8c4; background: #fff; box-shadow: 0 0 0 4px rgba(0,184,196,0.1); }
  .cd-file-input { width: 100%; padding: 10px; border: 2px dashed #cbd5e1; border-radius: 8px; font-size: 14px; color: #64748b; background: #f8fafc; cursor: pointer; transition: border-color 0.2s; }
  .cd-file-input:hover { border-color: #94a3b8; }
  .cd-file-input::file-selector-button { background: #e2e8f0; border: none; padding: 8px 16px; border-radius: 6px; color: #334155; font-weight: 700; cursor: pointer; margin-right: 16px; transition: background 0.2s; }
  .cd-file-input::file-selector-button:hover { background: #cbd5e1; }
  .cd-modal-actions { display: flex; justify-content: flex-end; gap: 16px; margin-top: 16px; padding-top: 24px; border-top: 1px solid #f1f5f9; }
  .cd-btn-cancel { background: #f1f5f9; color: #475569; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit; transition: background 0.2s; }
  .cd-btn-cancel:hover { background: #e2e8f0; color: #0f172a; }
  .cd-btn-submit { background: #EC4F34; color: #fff; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: 'matterregular', sans-serif; transition: background 0.18s, box-shadow 0.18s, transform 0.18s; }
  .cd-btn-submit:hover { background: #d44026; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(236,79,52,0.15); }
  
  /* Loading/Empty States */
  .cd-loading, .cd-not-found { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 100px 20px; color: #64748b; font-size: 16px; text-align: center; }
  .cd-spinner { width: 48px; height: 48px; border: 4px solid #e2e8f0; border-top-color: #00b8c4; border-radius: 50%; animation: cd-spin 0.8s linear infinite; }
  .cd-back-btn { background: #0f172a; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 16px; }
  
  @keyframes cd-fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cd-slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .cd-detail-section { padding: 40px 32px 64px; }
  }
  @media (max-width: 768px) {
    .cd-detail-section { padding: 32px 20px 56px; }
    .cd-card { padding: 32px 24px; }
    .cd-job-header { flex-direction: column; align-items: stretch; gap: 16px; }
    .cd-apply-desktop { display: none; } 
    .cd-apply-mobile { display: inline-flex; width: 100%; }
    .cd-apply-mobile .cd-apply-btn { width: 100%; }
    .cd-apply-mobile-wrap { display: flex; justify-content: stretch; }
    .cd-meta-row { grid-template-columns: 130px 16px 1fr; font-size: 15px; }
  }
  @media (max-width: 600px) {
    .cd-modal-form { grid-template-columns: 1fr; padding: 24px 20px; }
    .cd-modal-header { padding: 20px 24px; }
    .cd-job-title { font-size: 26px; }
  }
  @media (max-width: 480px) {
    .cd-detail-section { padding: 24px 16px 48px; }
    .cd-card { padding: 24px 16px; }
    .cd-job-title { font-size: 22px; }
    .cd-meta-row { display: flex; flex-direction: column; gap: 4px; }
    .cd-meta-colon { display: none; }
    .cd-meta-label { font-size: 14px; color: #475569; }
    .cd-meta-value { font-size: 15px; }
    .cd-bullet-list { padding-left: 16px; }
    .cd-bullet-list li { font-size: 14.5px; }
    .cd-list-heading { font-size: 17px; }
    .cd-modal-overlay { padding: 10px; }
    .cd-modal-content { max-height: 92vh; }
  }
`;
