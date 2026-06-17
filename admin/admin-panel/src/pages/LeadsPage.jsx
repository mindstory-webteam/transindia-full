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
  XCircle,
  Loader2,
} from "lucide-react";

const STATUS_OPTIONS = ["new", "contacted", "converted", "closed"];

const STATUS_STYLES = {
  new: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  contacted: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  converted: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  closed: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
};

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-xl font-semibold text-slate-900">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        STATUS_STYLES[status] || STATUS_STYLES.new
      }`}
    >
      {status}
    </span>
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
      // Stats are non-critical; fail silently
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const t = setTimeout(fetchLeads, 300); // debounce search
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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900">Leads</h1>
        <p className="text-sm text-slate-500">Track and manage incoming quote requests.</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Leads"
          value={stats?.total}
          accent="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          icon={Sparkles}
          label="New"
          value={stats?.new}
          accent="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={PhoneCall}
          label="Contacted"
          value={stats?.contacted}
          accent="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={CheckCircle2}
          label="Converted"
          value={stats?.converted}
          accent="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search name, email, phone…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPage(1);
              setStatusFilter("");
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              statusFilter === ""
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setPage(1);
                setStatusFilter(s);
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
                statusFilter === s
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    <Loader2 size={20} className="mx-auto mb-2 animate-spin" />
                    Loading leads…
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{lead.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{lead.email}</div>
                      <div className="text-xs text-slate-400">{lead.phone}</div>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-slate-500">
                      {lead.message || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status || "new"}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className={`cursor-pointer rounded-full border-none px-2.5 py-1 text-xs font-medium capitalize focus:outline-none focus:ring-1 focus:ring-indigo-400 ${
                          STATUS_STYLES[lead.status] || STATUS_STYLES.new
                        }`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/leads/${lead._id}`}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                          title="View details"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(lead._id)}
                          disabled={deletingId === lead._id}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          title="Delete lead"
                        >
                          {deletingId === lead._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}