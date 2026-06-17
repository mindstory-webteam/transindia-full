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

const STATUS_STYLES = {
  new: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  contacted: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  converted: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  closed: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
};

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
    return () => {
      isMounted = false;
    };
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
      <div className="flex h-[60vh] items-center justify-center text-slate-400">
        <Loader2 size={22} className="mr-2 animate-spin" />
        Loading lead…
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <Link
        to="/leads"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={16} />
        Back to leads
      </Link>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{lead.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={14} />
                {lead.email || "—"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone size={14} />
                {lead.phone || "—"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} />
                {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "—"}
              </span>
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            Delete
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={saving}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition disabled:opacity-50 ${
                    lead.status === s
                      ? STATUS_STYLES[s]
                      : "bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
              <MessageSquare size={13} />
              Message
            </label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
              {lead.message || <span className="text-slate-400">No message provided.</span>}
            </div>
          </div>

          {lead.service && (
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                Requested Service
              </label>
              <p className="text-sm text-slate-700">
                {typeof lead.service === "object" ? lead.service.title : lead.service}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}