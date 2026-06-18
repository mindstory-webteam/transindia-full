import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../axios";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Loader2,
  MessageSquare,
} from "lucide-react";

const STATUS_OPTIONS = ["new", "contacted", "converted", "closed"];

const styles = `
  .detail-page {
    max-width: 768px;
    margin: 0 auto;
    padding: 24px 16px;
  }

  @media (min-width: 640px) { .detail-page { padding: 24px; } }
  @media (min-width: 1024px) { .detail-page { padding: 32px; } }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    text-decoration: none;
    margin-bottom: 16px;
    transition: color 0.15s;
  }

  .back-link:hover { color: #0f172a; }

  /* Card */
  .detail-card {
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }

  /* Card Header */
  .detail-card-header {
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-bottom: 1px solid #e2e8f0;
    padding: 24px;
  }

  @media (min-width: 640px) {
    .detail-card-header {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
    }
  }

  .detail-card-header h1 {
    font-size: 20px;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 8px 0;
  }

  .lead-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    font-size: 14px;
    color: #64748b;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .lead-meta li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .delete-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    align-self: flex-start;
    border-radius: 8px;
    border: 1px solid #fecaca;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 500;
    color: #dc2626;
    background: transparent;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
  }

  .delete-btn:hover:not(:disabled) { background: #fff1f2; }
  .delete-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Card Body */
  .detail-card-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* Section label */
  .section-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    margin: 0 0 8px 0;
  }

  /* Status buttons */
  .status-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .status-btn {
    border-radius: 9999px;
    padding: 6px 14px;
    font-size: 14px;
    font-weight: 500;
    text-transform: capitalize;
    cursor: pointer;
    border: none;
    transition: opacity 0.15s, background 0.15s;
  }

  .status-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Active status styles */
  .status-btn.active-new       { background: #eff6ff; color: #1d4ed8; box-shadow: inset 0 0 0 1px #bfdbfe; }
  .status-btn.active-contacted { background: #fffbeb; color: #b45309; box-shadow: inset 0 0 0 1px #fde68a; }
  .status-btn.active-converted { background: #ecfdf5; color: #047857; box-shadow: inset 0 0 0 1px #a7f3d0; }
  .status-btn.active-closed    { background: #f1f5f9; color: #475569; box-shadow: inset 0 0 0 1px #cbd5e1; }

  /* Inactive status style */
  .status-btn.inactive {
    background: #f8fafc;
    color: #64748b;
    box-shadow: inset 0 0 0 1px #e2e8f0;
  }

  .status-btn.inactive:hover:not(:disabled) { background: #f1f5f9; }

  /* Message box */
  .message-box {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    padding: 16px;
    font-size: 14px;
    line-height: 1.6;
    color: #334155;
  }

  .message-empty { color: #94a3b8; }

  /* Service field */
  .service-value {
    font-size: 14px;
    color: #334155;
    margin: 0;
  }

  /* Loading / null state */
  .loading-center {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60vh;
    color: #94a3b8;
    gap: 8px;
    font-size: 14px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .spin { animation: spin 0.8s linear infinite; }
`;

function getActiveClass(status) {
  const map = {
    new: "active-new",
    contacted: "active-contacted",
    converted: "active-converted",
    closed: "active-closed",
  };
  return map[status] || "active-new";
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/leads/${id}`);
        const leadData = data?.lead ?? data?.data ?? data;
        if (isMounted) setLead(leadData);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load lead");
        navigate("/leads");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [id, navigate]);

  const handleStatusChange = async (newStatus) => {
    const prevStatus = lead.status;
    setLead((l) => ({ ...l, status: newStatus }));
    setSaving(true);
    try {
      await api.patch(`/leads/${id}`, { status: newStatus });
      toast.success("Status updated");
    } catch (err) {
      setLead((l) => ({ ...l, status: prevStatus }));
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this lead? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/leads/${id}`);
      toast.success("Lead deleted");
      navigate("/leads");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete lead");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-center">
          <Loader2 size={22} className="spin" />
          Loading lead…
        </div>
      </>
    );
  }

  if (!lead) return null;

  const isActive = (s) => lead.status === s;

  return (
    <>
      <style>{styles}</style>
      <div className="detail-page">
        <Link to="/leads" className="back-link">
          <ArrowLeft size={16} />
          Back to leads
        </Link>

        <div className="detail-card">
          {/* Header */}
          <div className="detail-card-header">
            <div>
              <h1>{lead.name}</h1>
              <ul className="lead-meta">
                <li><Mail size={14} />{lead.email || "—"}</li>
                <li><Phone size={14} />{lead.phone || "—"}</li>
                <li>
                  <Calendar size={14} />
                  {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "—"}
                </li>
              </ul>
            </div>

            <button onClick={handleDelete} disabled={deleting} className="delete-btn">
              {deleting ? <Loader2 size={15} className="spin" /> : <Trash2 size={15} />}
              Delete
            </button>
          </div>

          {/* Body */}
          <div className="detail-card-body">
            {/* Status */}
            <div>
              <p className="section-label">Status</p>
              <div className="status-buttons">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={saving}
                    className={`status-btn ${isActive(s) ? getActiveClass(s) : "inactive"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <p className="section-label">
                <MessageSquare size={13} /> Message
              </p>
              <div className="message-box">
                {lead.message || <span className="message-empty">No message provided.</span>}
              </div>
            </div>

            {/* Requested Service */}
            {lead.service && (
              <div>
                <p className="section-label">Requested Service</p>
                <p className="service-value">
                  {typeof lead.service === "object" ? lead.service.title : lead.service}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}