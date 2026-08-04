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
  body?: string;
  tags: string[];
  createdAt: string;
}

export default function CareerDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [job, setJob] = useState<JobRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState<JobRole[]>([]);
  
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

            // Fetch and set similar jobs
            if (foundJob) {
              const others = data.data.filter((j: JobRole) => j._id !== id);
              const sameDept = others.filter((j: JobRole) => j.department === foundJob.department);
              const fallback = sameDept.length >= 2 ? sameDept : others;
              setSimilarJobs(fallback.slice(0, 3));
            }
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
              <h2>Job not found</h2>
              <p>The position you're looking for might have been closed or removed.</p>
              <button className="cd-back-btn" onClick={() => router.push("/careers")}>
                View Open Roles
              </button>
            </div>
          ) : (
            <div className="cd-detail-container">
              {/* Left Column: Main Content */}
              <div className="cd-main-col">
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
                  </div>

                  <div className="cd-divider" />

                  <div className="cd-job-body">
                    {/* Dynamic Body content */}
                    {job.body && (
                      <div 
                        className="cd-rich-text"
                        dangerouslySetInnerHTML={{ __html: job.body }}
                      />
                    )}
                  </div>
                </div>

                {/* About the Company Section */}
                <div className="cd-section-card">
                  <h3 className="cd-section-card-title">About TransIndia</h3>
                  <p className="cd-section-card-p">
                    Transindia Insurance Broking and Risk Management Pvt. Ltd. is a trusted insurance broking and risk management company committed to helping businesses identify, manage, and mitigate their risks through comprehensive insurance solutions.
                  </p>
                  <p className="cd-section-card-p">
                    Established in July 2006, Transindia was built with a vision to bridge the gap between complex insurance products and effective risk management practices. Through our expertise, industry relationships, and service-driven approach, we continue to deliver transparent, reliable, and value-based risk advisory and claims management.
                  </p>
                </div>

                {/* Important Notice */}
                <div className="cd-notice-card">
                  <div className="cd-notice-content">
                    <h4>Important Recruitment Warning</h4>
                    <p>
                      Transindia Insurance Broking does not charge any placement fee or security deposit at any stage of the recruitment process. All legitimate communication will originate only from verified <strong>@transindia.com</strong> email addresses. Please report any suspicious job offerings to <a href="mailto:care@transindia.com">care@transindia.com</a>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Sidebar */}
              <div className="cd-side-col">
                {/* Apply Widget */}
                <div className="cd-side-widget cd-apply-widget">
                  <h3>Interested in this role?</h3>
                  <p>Apply directly using our quick online form.</p>
                  <button onClick={() => setShowApplyModal(true)} className="cd-side-apply-btn">
                    Apply Now
                  </button>
                </div>

                {/* Job Metadata Widget */}
                <div className="cd-side-widget">
                  <h3 className="cd-widget-title">Job Details</h3>
                  <div className="cd-side-meta-list">
                    {job.department && (
                      <div className="cd-side-meta-item">
                        <span className="cd-side-meta-label">Department</span>
                        <span className="cd-side-meta-val">{job.department}</span>
                      </div>
                    )}
                    {job.role && (
                      <div className="cd-side-meta-item">
                        <span className="cd-side-meta-label">Role Category</span>
                        <span className="cd-side-meta-val">{job.role}</span>
                      </div>
                    )}
                    {job.grade && (
                      <div className="cd-side-meta-item">
                        <span className="cd-side-meta-label">Grade Level</span>
                        <span className="cd-side-meta-val">{job.grade}</span>
                      </div>
                    )}
                    {job.reportingTo && (
                      <div className="cd-side-meta-item">
                        <span className="cd-side-meta-label">Reporting To</span>
                        <span className="cd-side-meta-val cd-side-meta-val-bold">{job.reportingTo}</span>
                      </div>
                    )}
                    <div className="cd-side-meta-item">
                      <span className="cd-side-meta-label">Employment Type</span>
                      <span className="cd-side-meta-val">{job.tags?.[1] || "Full-time"}</span>
                    </div>
                    <div className="cd-side-meta-item">
                      <span className="cd-side-meta-label">Location</span>
                      <span className="cd-side-meta-val">{job.tags?.[0] || "Remote"}</span>
                    </div>
                  </div>
                </div>

                {/* Similar Jobs Widget */}
                {similarJobs.length > 0 && (
                  <div className="cd-side-widget">
                    <h3 className="cd-widget-title">Similar Openings</h3>
                    <div className="cd-similar-list">
                      {similarJobs.map((sj) => (
                        <div 
                          key={sj._id} 
                          className="cd-similar-item"
                          onClick={() => router.push(`/careers/${sj._id}`)}
                        >
                          <h4 className="cd-similar-title">{sj.title}</h4>
                          <div className="cd-similar-meta">
                            <span>{sj.tags?.[0] || "Remote"}</span>
                            <span>•</span>
                            <span>{sj.department || "Insurance"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

  /* Section & Grid Layout */
  .cd-detail-section { flex: 1; padding: 48px 0 80px; }
  
  .cd-detail-container {
    max-width: 1350px;
    margin: 0 auto;
    padding: 0 32px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 32px;
    align-items: start;
  }

  .cd-main-col {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .cd-side-col {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  @media (min-width: 1025px) {
    .cd-side-col {
      position: sticky;
      top: 100px;
      height: fit-content;
    }
  }

  /* Card Stylings */
  .cd-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 48px 48px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }

  .cd-section-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 36px 40px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }

  .cd-section-card-title {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 16px 0;
    font-family: var(--font-sora), "Sora", sans-serif;
  }

  .cd-section-card-p {
    font-size: 14.5px;
    line-height: 1.65;
    color: #475569;
    margin: 0 0 14px 0;
  }

  .cd-section-card-p:last-child {
    margin-bottom: 0;
  }

  /* Notice Card */
  .cd-notice-card {
    background-color: #fff8f7;
    border-radius: 12px;
    padding: 24px 28px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }

  .cd-notice-content h4 {
    margin: 0 0 6px 0;
    font-size: 15px;
    font-weight: 700;
    color: #991b1b;
  }

  .cd-notice-content p {
    margin: 0;
    font-size: 13.5px;
    line-height: 1.55;
    color: #7f1d1d;
  }

  .cd-notice-content a {
    color: #EC4F34;
    font-weight: 600;
    text-decoration: underline;
  }

  .cd-notice-content a:hover {
    color: #d44026;
  }

  /* Sidebar widgets */
  .cd-side-widget {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 28px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }

  .cd-apply-widget {
    text-align: center;
    background: linear-gradient(135deg, #000d3a 0%, #0A1A3F 100%);
    color: #ffffff;
    border: none;
  }

  .cd-apply-widget h3 {
    color: #ffffff;
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  .cd-apply-widget p {
    color: rgba(255,255,255,0.75);
    font-size: 13.5px;
    margin: 0 0 20px 0;
    line-height: 1.5;
  }

  .cd-side-apply-btn {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    font-size: 14.5px;
    font-weight: 700;
    color: #fff;
    background: #EC4F34;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'matterregular', sans-serif;
    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
  }

  .cd-side-apply-btn:hover {
    background: #d44026;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(236,79,52,0.25);
  }

  .cd-widget-title {
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 16px 0;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 12px;
    font-family: var(--font-sora), "Sora", sans-serif;
  }

  /* Metadata list */
  .cd-side-meta-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .cd-side-meta-item {
    display: flex;
    justify-content: space-between;
    font-size: 13.5px;
    border-bottom: 1px dashed #f1f5f9;
    padding-bottom: 10px;
    align-items: center;
  }

  .cd-side-meta-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .cd-side-meta-label {
    color: #64748b;
    font-weight: 500;
  }

  .cd-side-meta-val {
    color: #0f172a;
    font-weight: 600;
    text-align: right;
  }

  .cd-side-meta-val-bold {
    font-weight: 700;
  }

  /* Similar jobs list */
  .cd-similar-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .cd-similar-item {
    padding: 14px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.18s ease;
    background: #f8fafc;
  }

  .cd-similar-item:hover {
    border-color: #20BEC6;
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(32, 190, 198, 0.08);
    transform: translateY(-1px);
  }

  .cd-similar-title {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 6px 0;
    transition: color 0.15s;
  }

  .cd-similar-item:hover .cd-similar-title {
    color: #20BEC6;
  }

  .cd-similar-meta {
    display: flex;
    gap: 8px;
    font-size: 11.5px;
    color: #64748b;
    align-items: center;
  }

  /* Detail Card Header elements */
  .cd-job-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
  .cd-job-header-left { flex: 1; }
  .cd-job-title { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; letter-spacing: -0.5px; }
  .cd-job-tags { display: flex; gap: 8px; flex-wrap: wrap; }
  .cd-tag { display: inline-flex; align-items: center; border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 999px; padding: 4px 12px; font-size: 12px; color: #475569; font-weight: 600; }
  
  .cd-divider { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
  
  .cd-job-body { display: flex; flex-direction: column; }

  /* Rich text styles */
  .cd-rich-text {
    font-size: 16px;
    color: #334155;
    line-height: 1.65;
    word-break: break-word;
    overflow-wrap: break-word;
    word-wrap: break-word;
    max-width: 100%;
  }
  .cd-rich-text a {
    word-break: break-all;
  }
  .cd-rich-text table {
    width: 100%;
    border-collapse: collapse;
    display: block;
    overflow-x: auto;
  }
  .cd-rich-text h1, .cd-rich-text h1 * { font-size: 2.0em !important; font-weight: 700; margin-top: 24px; margin-bottom: 8px; color: #0f172a; }
  .cd-rich-text h2, .cd-rich-text h2 * { font-size: 1.6em !important; font-weight: 600; margin-top: 20px; margin-bottom: 6px; color: #0f172a; }
  .cd-rich-text h3, .cd-rich-text h3 * { font-size: 1.35em !important; font-weight: 600; margin-top: 16px; margin-bottom: 4px; color: #0f172a; }
  .cd-rich-text p { font-size: 16px; margin-top: 0; margin-bottom: 12px; color: #334155; }
  .cd-rich-text font[size="1"] { font-size: 12px !important; }
  .cd-rich-text font[size="2"] { font-size: 14px !important; }
  .cd-rich-text font[size="3"] { font-size: 16px !important; }
  .cd-rich-text font[size="4"] { font-size: 18px !important; }
  .cd-rich-text font[size="5"] { font-size: 24px !important; }
  .cd-rich-text font[size="6"] { font-size: 32px !important; }
  .cd-rich-text font[size="7"] { font-size: 48px !important; }
  .cd-rich-text font[face="Sora"] { font-family: 'Sora', sans-serif !important; }
  .cd-rich-text font[face="Arial"] { font-family: Arial, sans-serif !important; }
  .cd-rich-text font[face="Courier New"] { font-family: "Courier New", monospace !important; }
  .cd-rich-text font[face="Georgia"] { font-family: Georgia, serif !important; }
  .cd-rich-text font[face="Times New Roman"] { font-family: "Times New Roman", serif !important; }
  .cd-rich-text font[face="Verdana"] { font-family: Verdana, sans-serif !important; }
  
  /* Inline font style mappings from Quill (space & quote agnostic) */
  .cd-rich-text [style*="font-family"][style*="sora"],
  .cd-rich-text .ql-font-sora {
    font-family: var(--font-sora), "Sora", sans-serif !important;
  }
  .cd-rich-text [style*="font-family"][style*="courier-new"],
  .cd-rich-text .ql-font-courier-new {
    font-family: "Courier New", monospace !important;
  }
  .cd-rich-text [style*="font-family"][style*="times-new-roman"],
  .cd-rich-text .ql-font-times-new-roman {
    font-family: "Times New Roman", serif !important;
  }
  .cd-rich-text [style*="font-family"][style*="georgia"],
  .cd-rich-text .ql-font-georgia {
    font-family: Georgia, serif !important;
  }
  .cd-rich-text [style*="font-family"][style*="verdana"],
  .cd-rich-text .ql-font-verdana {
    font-family: Verdana, sans-serif !important;
  }
  .cd-rich-text [style*="font-family"][style*="arial"],
  .cd-rich-text .ql-font-arial {
    font-family: Arial, sans-serif !important;
  }

  /* Inline font size mappings from Quill (space & quote agnostic) */
  .cd-rich-text [style*="font-size"][style*="12px"],
  .cd-rich-text .ql-size-12px { font-size: 12px !important; }
  .cd-rich-text [style*="font-size"][style*="14px"],
  .cd-rich-text .ql-size-14px { font-size: 14px !important; }
  .cd-rich-text [style*="font-size"][style*="16px"],
  .cd-rich-text .ql-size-16px { font-size: 16px !important; }
  .cd-rich-text [style*="font-size"][style*="18px"],
  .cd-rich-text .ql-size-18px { font-size: 18px !important; }
  .cd-rich-text [style*="font-size"][style*="24px"],
  .cd-rich-text .ql-size-24px { font-size: 24px !important; }
  .cd-rich-text [style*="font-size"][style*="32px"],
  .cd-rich-text .ql-size-32px { font-size: 32px !important; }
  .cd-rich-text [style*="font-size"][style*="48px"],
  .cd-rich-text .ql-size-48px { font-size: 48px !important; }

  .cd-rich-text blockquote { border-left: 4px solid #cbd5e1; padding-left: 12px; color: #64748b; font-style: italic; margin: 16px 0; }
  .cd-rich-text ul { list-style-type: disc !important; padding-left: 20px; margin: 8px 0 16px 0; display: flex; flex-direction: column; gap: 6px; }
  .cd-rich-text ul li { font-size: 16px; color: #334155; line-height: 1.6; }
  .cd-rich-text ul li::marker { color: #0f172a; }
  .cd-rich-text ol { list-style-type: decimal !important; padding-left: 20px; margin: 8px 0 16px 0; display: flex; flex-direction: column; gap: 6px; }
  .cd-rich-text ol li { font-size: 16px; color: #334155; line-height: 1.6; }
  .cd-rich-text ol li::marker { color: #0f172a; }
  .cd-rich-text pre { background: #f1f5f9; padding: 10px; border-radius: 4px; overflow-x: auto; margin: 12px 0; }
  .cd-rich-text code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  .cd-rich-text img { max-width: 100%; height: auto; border-radius: 6px; margin: 12px 0; display: block; }

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
  @keyframes cd-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  
  /* Responsive Breakpoints */
  @media (max-width: 1024px) {
    .cd-detail-section { padding: 32px 0 64px; }
    .cd-detail-container {
      display: flex;
      flex-direction: column;
      gap: 28px;
      padding: 0 24px;
    }
    .cd-side-col {
      order: 1;
      gap: 20px;
    }
    .cd-main-col {
      order: 2;
    }
    .cd-card { padding: 36px 32px; }
  }

  @media (max-width: 768px) {
    .cd-detail-container { padding: 0 20px; }
    .cd-card { padding: 28px 20px; }
    .cd-job-header { flex-direction: column; align-items: stretch; gap: 12px; }
    .cd-job-title { font-size: 24px; }
  }

  @media (max-width: 600px) {
    .cd-modal-form { grid-template-columns: 1fr; padding: 24px 20px; }
    .cd-modal-header { padding: 20px 24px; }
    .cd-section-card { padding: 24px 20px; }
  }

  @media (max-width: 480px) {
    .cd-detail-section { padding: 20px 0 48px; }
    .cd-detail-container { padding: 0 16px; gap: 20px; }
    .cd-card { padding: 24px 16px; }
    .cd-section-card { padding: 20px 16px; }
    .cd-notice-card { padding: 20px 16px; gap: 12px; }
    .cd-job-title { font-size: 20px; }
    .cd-modal-overlay { padding: 10px; }
    .cd-modal-content { max-height: 92vh; }
  }
`;
