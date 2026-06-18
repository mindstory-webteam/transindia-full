import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../axios";
import {
  Search,
  Trash2,
  Eye,
  Users,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Loader2,
  Inbox,
} from "lucide-react";

const STATUS_OPTIONS = ["new", "contacted", "converted", "closed"];

const styles = `
  .leads-page {
    padding: 4px;
  }

  .leads-header {
    margin-bottom: 32px;
  }

  .leads-header h1 {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 4px 0;
  }

  .leads-header p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }

  @media (min-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 12px;
  }

  .stat-icon.blue   { background: #eff6ff; color: #1d4ed8; }
  .stat-icon.sky    { background: #f0f9ff; color: #0369a1; }
  .stat-icon.amber  { background: #fffbeb; color: #b45309; }
  .stat-icon.emerald{ background: #ecfdf5; color: #047857; }

  .stat-label {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    margin: 0 0 4px 0;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  /* Toolbar */
  .toolbar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    padding: 16px;
    margin-bottom: 20px;
  }

  @media (min-width: 1024px) {
    .toolbar {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .search-wrapper {
    position: relative;
    width: 100%;
  }

  @media (min-width: 1024px) {
    .search-wrapper {
      max-width: 300px;
    }
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    padding: 10px 12px 10px 36px;
    font-size: 14px;
    color: #334155;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .search-input::placeholder { color: #94a3b8; }

  .search-input:focus {
    border-color: #60a5fa;
    background: #ffffff;
    box-shadow: 0 0 0 2px rgba(96,165,250,0.2);
  }

  .filter-buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .filter-btn {
    border-radius: 9999px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 500;
    text-transform: capitalize;
    cursor: pointer;
    border: none;
    transition: background 0.15s, color 0.15s;
  }

  .filter-btn.active {
    background: #0f172a;
    color: #ffffff;
  }

  .filter-btn.inactive {
    background: #f1f5f9;
    color: #475569;
  }

  .filter-btn.inactive:hover {
    background: #e2e8f0;
  }

  /* Table */
  .table-container {
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }

  .table-scroll {
    overflow-x: auto;
  }

  .leads-table {
    width: 100%;
    min-width: 720px;
    border-collapse: collapse;
    font-size: 14px;
    text-align: left;
  }

  .leads-table thead {
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
  }

  .leads-table thead th {
    padding: 14px 20px;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #64748b;
  }

  .leads-table thead th.text-right { text-align: right; }

  .leads-table tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.1s;
  }

  .leads-table tbody tr:last-child { border-bottom: none; }

  .leads-table tbody tr:hover { background: #f8fafc; }

  .leads-table td {
    padding: 14px 20px;
    color: #475569;
    vertical-align: middle;
  }

  .td-name {
    font-weight: 500;
    color: #1e293b;
  }

  .td-email { color: #475569; }

  .td-phone {
    font-size: 12px;
    color: #94a3b8;
  }

  .td-message {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #64748b;
  }

  .td-actions { text-align: right; }

  .actions-group {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #64748b;
    transition: background 0.15s, color 0.15s;
    text-decoration: none;
  }

  .action-btn:hover { background: #f1f5f9; color: #1d4ed8; }

  .action-btn.delete:hover { background: #fff1f2; color: #dc2626; }

  .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Status select */
  .status-select {
    cursor: pointer;
    border-radius: 9999px;
    border: none;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 500;
    text-transform: capitalize;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
  }

  .status-select:focus {
    box-shadow: 0 0 0 2px rgba(96,165,250,0.4);
  }

  .status-new       { background: #eff6ff; color: #1d4ed8; box-shadow: inset 0 0 0 1px #bfdbfe; }
  .status-contacted { background: #fffbeb; color: #b45309; box-shadow: inset 0 0 0 1px #fde68a; }
  .status-converted { background: #ecfdf5; color: #047857; box-shadow: inset 0 0 0 1px #a7f3d0; }
  .status-closed    { background: #f1f5f9; color: #475569; box-shadow: inset 0 0 0 1px #cbd5e1; }

  /* Empty / Loading states */
  .table-state-cell {
    padding: 64px 20px;
    text-align: center;
    color: #94a3b8;
  }

  .table-state-cell .state-icon {
    display: block;
    margin: 0 auto 12px;
  }

  .table-state-cell .state-title {
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    margin: 0 0 4px;
  }

  .table-state-cell .state-sub {
    font-size: 12px;
    color: #94a3b8;
    margin: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .spin { animation: spin 0.8s linear infinite; }

  /* Pagination */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #e2e8f0;
    padding: 14px 20px;
  }

  .page-btn {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    padding: 6px 12px;
    font-size: 14px;
    color: #475569;
    background: #ffffff;
    cursor: pointer;
    transition: background 0.15s;
  }

  .page-btn:hover:not(:disabled) { background: #f8fafc; }
  .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .page-info {
    font-size: 14px;
    color: #64748b;
  }
`;

function getStatusClass(status) {
  const map = {
    new: "status-new",
    contacted: "status-contacted",
    converted: "status-converted",
    closed: "status-closed",
  };
  return map[status] || "status-new";
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${accent}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value ?? 0}</p>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const limit = 10;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get("/leads", { params });
      const list = data?.leads ?? data?.data ?? (Array.isArray(data) ? data : []);
      setLeads(list);
      setTotalPages(data?.totalPages ?? data?.pages ?? 1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get("/leads/stats");
      setStats(data?.stats ?? data ?? {});
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  useEffect(() => {
    const t = setTimeout(fetchLeads, 300);
    return () => clearTimeout(t);
  }, [fetchLeads]);

  const handleStatusChange = async (id, newStatus) => {
    const prev = leads;
    setLeads((curr) => curr.map((l) => (l._id === id ? { ...l, status: newStatus } : l)));
    try {
      await api.patch(`/leads/${id}`, { status: newStatus });
      toast.success("Status updated");
      fetchStats();
    } catch (err) {
      setLeads(prev);
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/leads/${id}`);
      toast.success("Lead deleted");
      setLeads((curr) => curr.filter((l) => l._id !== id));
      fetchStats();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete lead");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="leads-page">
        <div className="leads-header">
          <h1>Leads</h1>
          <p>Track and manage incoming quote requests.</p>
        </div>

        <div className="stats-grid">
          <StatCard icon={Users}        label="Total Leads" value={stats?.total}     accent="blue" />
          <StatCard icon={Sparkles}     label="New"         value={stats?.new}       accent="sky" />
          <StatCard icon={PhoneCall}    label="Contacted"   value={stats?.contacted} accent="amber" />
          <StatCard icon={CheckCircle2} label="Converted"   value={stats?.converted} accent="emerald" />
        </div>

        <div className="toolbar">
          <div className="search-wrapper">
            <span className="search-icon"><Search size={16} /></span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="Search name, email, phone…"
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              onClick={() => { setPage(1); setStatusFilter(""); }}
              className={`filter-btn ${statusFilter === "" ? "active" : "inactive"}`}
            >
              All
            </button>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setPage(1); setStatusFilter(s); }}
                className={`filter-btn ${statusFilter === s ? "active" : "inactive"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="table-container">
          <div className="table-scroll">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="table-state-cell">
                        <Loader2 size={22} className="state-icon spin" />
                        Loading leads…
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="table-state-cell">
                        <Inbox size={28} className="state-icon" style={{ color: "#cbd5e1" }} />
                        <p className="state-title">No leads found</p>
                        <p className="state-sub">New quote requests will show up here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id}>
                      <td className="td-name">{lead.name}</td>
                      <td>
                        <div className="td-email">{lead.email}</div>
                        <div className="td-phone">{lead.phone}</div>
                      </td>
                      <td className="td-message">{lead.message || "—"}</td>
                      <td>
                        <select
                          value={lead.status || "new"}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`status-select ${getStatusClass(lead.status)}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}</td>
                      <td className="td-actions">
                        <div className="actions-group">
                          <Link to={`/leads/${lead._id}`} className="action-btn" title="View details">
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(lead._id)}
                            disabled={deletingId === lead._id}
                            className="action-btn delete"
                            title="Delete lead"
                          >
                            {deletingId === lead._id
                              ? <Loader2 size={16} className="spin" />
                              : <Trash2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="page-btn"
              >
                Previous
              </button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 