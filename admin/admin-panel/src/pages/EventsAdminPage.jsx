import React, { useState, useEffect, useRef } from "react";
import axios from "../axios";
import { toast } from "react-hot-toast";
import {
  Plus,
  Trash2,
  Edit,
  X,
  Eye,
  FileSpreadsheet,
  Download,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PAGE_STYLES = `
  .events-export-btn { transition: background .15s, border-color .15s, opacity .15s; }
  .events-export-btn:hover:not(:disabled) { background:#F4F7FB; border-color:#CBD5E1; }
  .events-export-btn:disabled { opacity:.5; cursor:not-allowed; }
  .ev-admin-thumb-wrap { position:relative; width:74px; height:56px; border-radius:8px; overflow:hidden; border:1px solid var(--ti-line); background:#F1F5F9; }
  .ev-admin-thumb-wrap img { width:100%; height:100%; object-fit:cover; display:block; }
  .ev-admin-thumb-x {
    position:absolute; top:3px; right:3px; width:20px; height:20px; border-radius:50%;
    background:rgba(15,23,42,0.72); color:#fff; border:none; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
  }
  .ev-dropzone {
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px;
    padding:22px; border:1.5px dashed #CBD5E1; border-radius:10px; cursor:pointer;
    background:#F8FAFC; text-align:center; transition:border-color .15s, background .15s;
  }
  .ev-dropzone:hover { border-color:var(--ti-brand); background:#FFF7F4; }
  .ev-dropzone.drag { border-color:var(--ti-brand); background:#FFF1ED; }
`;

const CATEGORY_OPTIONS = ["Webinar", "Workshop", "Conference", "Community", "Meetup", "Other"];

const emptyForm = {
  title: "",
  category: "Webinar",
  customCategory: "",
  date: "",
  endDate: "",
  time: "",
  location: "",
  description: "",
  href: "",
};

// API model exposes `id` (and removes `_id`); support both just in case.
const getId = (e) => e?.id || e?._id;

const isUpcoming = (iso) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
};

const toDateInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const fmtDate = (iso) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso || "-";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export default function EventsAdminPage() {
  const [activeTab, setActiveTab] = useState("all"); // "all" | "upcoming" | "past"

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]); // [{ url, publicId }]
  const [removedIds, setRemovedIds] = useState([]); // public_ids to delete
  const [newImages, setNewImages] = useState([]); // [{ file, url }]
  const [dragOver, setDragOver] = useState(false);

  const [infoModal, setInfoModal] = useState(null); // { title, text }

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get("/events");
      if (data.success) setEvents(data.data);
    } catch (err) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  // ── Modal open / close ─────────────────────────────────────────────────────
  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      
      // Check if category is in predefined list, if not, it's custom
      const isCustom = event.category && !CATEGORY_OPTIONS.includes(event.category);
      
      setFormData({
        title: event.title || "",
        category: isCustom ? "Other" : (event.category || "Webinar"),
        customCategory: isCustom ? event.category : "",
        date: toDateInput(event.date),
        endDate: toDateInput(event.endDate),
        time: event.time || "",
        location: event.location || "",
        description: event.description || "",
        href: event.href || "",
      });
      const imgs = (event.images || []).map((url, i) => ({
        url,
        publicId: event.imagePublicIds?.[i],
      }));
      setExistingImages(imgs);
    } else {
      setEditingEvent(null);
      setFormData(emptyForm);
      setExistingImages([]);
    }
    setRemovedIds([]);
    setNewImages([]);
    setIsModalOpen(true);
  };

  const clearNewPreviews = () => {
    newImages.forEach((n) => URL.revokeObjectURL(n.url));
  };

  const handleCloseModal = () => {
    clearNewPreviews();
    setIsModalOpen(false);
    setEditingEvent(null);
    setFormData(emptyForm);
    setExistingImages([]);
    setRemovedIds([]);
    setNewImages([]);
    setDragOver(false);
  };

  // ── Image handlers ─────────────────────────────────────────────────────────
  const addFiles = (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;

    const tooBig = files.filter((f) => f.size > 5 * 1024 * 1024);
    const ok = files.filter((f) => f.size <= 5 * 1024 * 1024);
    if (tooBig.length) toast.error(`${tooBig.length} image(s) skipped — over 5 MB`);

    const mapped = ok.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setNewImages((prev) => [...prev, ...mapped]);
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
    e.target.value = ""; // allow re-selecting the same file
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const removeExistingImage = (idx) => {
    const img = existingImages[idx];
    if (img?.publicId) setRemovedIds((prev) => [...prev, img.publicId]);
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx) => {
    setNewImages((prev) => {
      const target = prev[idx];
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      toast.error("Title and date are required");
      return;
    }

    // Determine the final category: use customCategory if "Other" is selected
    const finalCategory = formData.category === "Other" 
      ? formData.customCategory 
      : formData.category;

    if (!finalCategory) {
      toast.error("Please select or enter a category");
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("date", formData.date);
      if (formData.endDate) fd.append("endDate", formData.endDate);
      if (formData.time) fd.append("time", formData.time);
      if (formData.location) fd.append("location", formData.location);
      fd.append("category", finalCategory);
      if (formData.description) fd.append("description", formData.description);
      if (formData.href) fd.append("href", formData.href);

      // IMPORTANT: field name MUST be "images" to match upload.array("images", 10)
      newImages.forEach((n) => fd.append("images", n.file));

      if (editingEvent && removedIds.length) {
        fd.append("removeImageIds", removedIds.join(","));
      }

      // Let the browser set the multipart boundary. Passing FormData makes axios
      // use multipart/form-data automatically; we also override transformRequest
      // so an instance-level JSON transform can't stringify the body.
      const config = { transformRequest: (data) => data };

      if (editingEvent) {
        await axios.put(`/events/${getId(editingEvent)}`, fd, config);
        toast.success("Event updated successfully");
      } else {
        await axios.post("/events", fd, config);
        toast.success("Event created successfully");
      }

      handleCloseModal();
      fetchEvents();
    } catch (err) {
      console.error("Save event failed:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteEvent = (id) => {
    toast(
      (t) => (
        <div>
          <p style={{ margin: "0 0 10px 0", fontWeight: 500 }}>
            Are you sure you want to delete this event?
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{ padding: "6px 12px", border: "1px solid var(--ti-line)", background: "#fff", borderRadius: 4, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await axios.delete(`/events/${id}`);
                  toast.success("Event deleted successfully");
                  fetchEvents();
                } catch (err) {
                  toast.error("Failed to delete event");
                }
              }}
              style={{ padding: "6px 12px", border: "none", background: "#E1483B", color: "#fff", borderRadius: 4, cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  // ── Filtered list (tabs) ─────────────────────────────────────────────────────
  const filteredEvents = events.filter((ev) => {
    if (activeTab === "upcoming") return isUpcoming(ev.date);
    if (activeTab === "past") return !isUpcoming(ev.date);
    return true;
  });

  const upcomingCount = events.filter((e) => isUpcoming(e.date)).length;
  const pastCount = events.length - upcomingCount;

  // ── Exports ──────────────────────────────────────────────────────────────────
  const fileStamp = () => new Date().toISOString().slice(0, 10);

  const exportExcel = () => {
    if (!filteredEvents.length) { toast.error("No events to export"); return; }

    const headers = ["Title", "Category", "Date", "End Date", "Time", "Location", "Images", "Status", "Description"];
    const aoa = [headers];

    filteredEvents.forEach((ev) => {
      aoa.push([
        ev.title || "",
        ev.category || "",
        fmtDate(ev.date),
        ev.endDate ? fmtDate(ev.endDate) : "",
        ev.time || "",
        ev.location || "",
        (ev.images?.length || 0),
        isUpcoming(ev.date) ? "Upcoming" : "Past",
        ev.description || "",
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [
      { wch: 34 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
      { wch: 18 }, { wch: 22 }, { wch: 8 }, { wch: 10 }, { wch: 45 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Events");
    XLSX.writeFile(wb, `events-${fileStamp()}.xlsx`);
    toast.success(`Exported ${filteredEvents.length} event(s)`);
  };

  const exportPDF = () => {
    if (!filteredEvents.length) { toast.error("No events to export"); return; }

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const left = 40;

    doc.setFontSize(15);
    doc.setTextColor(15, 23, 42);
    doc.text("Events", left, 38);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Exported ${new Date().toLocaleString("en-IN")}   •   ${filteredEvents.length} event(s)`,
      left,
      54
    );

    const head = [["Title", "Category", "Date", "Time", "Location", "Images", "Status"]];
    const body = filteredEvents.map((ev) => [
      ev.title || "",
      ev.category || "",
      fmtDate(ev.date),
      ev.time || "",
      ev.location || "",
      String(ev.images?.length || 0),
      isUpcoming(ev.date) ? "Upcoming" : "Past",
    ]);

    autoTable(doc, {
      head,
      body,
      startY: 66,
      styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak", valign: "top" },
      headStyles: { fillColor: [241, 90, 62], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [250, 251, 253] },
      margin: { left: 40, right: 40 },
    });

    doc.save(`events-${fileStamp()}.pdf`);
    toast.success(`Exported ${filteredEvents.length} event(s)`);
  };

  const exportBtnStyle = {
    display: "flex", alignItems: "center", gap: 7, padding: "9px 14px",
    border: "1px solid #E8EDF3", background: "#fff", color: "#0F172A",
    borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
    fontFamily: "inherit",
  };

  const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 15 };
  const labelStyle = { display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14 };

  const tabBtn = (key, label) => (
    <button
      onClick={() => setActiveTab(key)}
      style={{
        padding: "10px 4px", border: "none", background: "none", cursor: "pointer",
        borderBottom: activeTab === key ? "2px solid var(--ti-brand)" : "2px solid transparent",
        color: activeTab === key ? "var(--ti-brand)" : "var(--ti-muted)",
        fontWeight: activeTab === key ? 700 : 500, fontSize: 15,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ maxWidth: 1200 }}>
      <style>{PAGE_STYLES}</style>

      {/* Header card */}
      <div style={{ background: "linear-gradient(120deg, rgb(255, 244, 240) 0%, rgb(255, 255, 255) 58%)", border: "1px solid rgb(251, 224, 216)", borderRadius: "18px", padding: "22px 24px", marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--ti-ink)" }}>Events Management</h1>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => handleOpenModal()}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--ti-brand)", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
          >
            <Plus size={16} /> Add Event
          </button>

          <button className="events-export-btn" onClick={exportExcel} disabled={!filteredEvents.length} style={exportBtnStyle} title="Download as Excel">
            <FileSpreadsheet size={15} color="#16A34A" /> Excel
          </button>
          <button className="events-export-btn" onClick={exportPDF} disabled={!filteredEvents.length} style={exportBtnStyle} title="Download as PDF">
            <Download size={15} color="#DC2626" /> PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 20, borderBottom: "1px solid var(--ti-line)", marginBottom: 24 }}>
        {tabBtn("all", `All (${events.length})`)}
        {tabBtn("upcoming", `Upcoming (${upcomingCount})`)}
        {tabBtn("past", `Past (${pastCount})`)}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid var(--ti-line)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--ti-muted)" }}>Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--ti-muted)" }}>No events found. Create one above.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
              <thead style={{ background: "#F8FAFC", borderBottom: "1px solid var(--ti-line)", textAlign: "left" }}>
                <tr>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Cover</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Title</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Category</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Date</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Location</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", textAlign: "center" }}>Images</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Status</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((ev) => {
                  const cover = ev.imageUrl || ev.images?.[0];
                  const up = isUpcoming(ev.date);
                  return (
                    <tr key={getId(ev)} style={{ borderBottom: "1px solid var(--ti-line)" }}>
                      <td style={{ padding: "12px 20px" }}>
                        <div className="ev-admin-thumb-wrap">
                          {cover ? (
                            <img
                              src={cover}
                              alt={ev.title}
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
                              <ImageIcon size={18} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", fontWeight: 600, maxWidth: 260 }}>{ev.title}</td>
                      <td style={{ padding: "16px 20px", color: "var(--ti-muted)", fontSize: 14 }}>{ev.category || "-"}</td>
                      <td style={{ padding: "16px 20px", color: "var(--ti-muted)", fontSize: 14 }}>
                        {fmtDate(ev.date)}{ev.endDate ? ` – ${fmtDate(ev.endDate)}` : ""}
                      </td>
                      <td style={{ padding: "16px 20px", color: "var(--ti-muted)", fontSize: 14 }}>{ev.location || "-"}</td>
                      <td style={{ padding: "16px 20px", color: "var(--ti-muted)", fontSize: 14, textAlign: "center" }}>{ev.images?.length || 0}</td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{
                          background: up ? "#DEF7EC" : "#F1F5F9",
                          color: up ? "#03543F" : "#64748B",
                          padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600,
                        }}>
                          {up ? "Upcoming" : "Past"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                        {ev.description && (
                          <button onClick={() => setInfoModal({ title: ev.title, text: ev.description })} style={{ background: "none", border: "none", color: "var(--ti-muted)", cursor: "pointer" }} title="View description">
                            <Eye size={16} />
                          </button>
                        )}
                        <button onClick={() => handleOpenModal(ev)} style={{ background: "none", border: "none", color: "var(--ti-muted)", cursor: "pointer" }}><Edit size={16} /></button>
                        <button onClick={() => handleDeleteEvent(getId(ev))} style={{ background: "none", border: "none", color: "#E1483B", cursor: "pointer" }}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EVENT MODAL */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: 640, borderRadius: 12, padding: 24, position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            <button onClick={handleCloseModal} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: "var(--ti-muted)" }}>
              <X size={20} />
            </button>

            <h2 style={{ marginTop: 0, marginBottom: 20 }}>{editingEvent ? "Edit Event" : "Create Event"}</h2>

            <form onSubmit={handleSaveEvent} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Event Title</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={inputStyle} />
              </div>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 180px" }}>
                  <label style={labelStyle}>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ ...inputStyle, background: "#fff" }}>
                    {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {formData.category === "Other" && (
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={labelStyle}>Custom Category</label>
                    <input 
                      type="text" 
                      placeholder="Enter custom category" 
                      value={formData.customCategory} 
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })} 
                      style={inputStyle}
                    />
                  </div>
                )}
                <div style={{ flex: "1 1 180px" }}>
                  <label style={labelStyle}>Location</label>
                  <input type="text" placeholder="Online Webinar / Kochi, Kerala" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 160px" }}>
                  <label style={labelStyle}>Date</label>
                  <input required type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ flex: "1 1 160px" }}>
                  <label style={labelStyle}>End Date <span style={{ color: "var(--ti-muted)", fontWeight: 400 }}>(optional)</span></label>
                  <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ flex: "1 1 160px" }}>
                  <label style={labelStyle}>Time <span style={{ color: "var(--ti-muted)", fontWeight: 400 }}>(optional)</span></label>
                  <input type="text" placeholder="4:00 PM – 5:30 PM" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, fontFamily: "inherit" }} />
              </div>

              <div>
                <label style={labelStyle}>Link <span style={{ color: "var(--ti-muted)", fontWeight: 400 }}>(optional registration URL)</span></label>
                <input type="text" placeholder="https://..." value={formData.href} onChange={(e) => setFormData({ ...formData, href: e.target.value })} style={inputStyle} />
              </div>

              {/* Images */}
              <div>
                <label style={labelStyle}>Gallery Images</label>

                {(existingImages.length > 0 || newImages.length > 0) && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                    {existingImages.map((img, i) => (
                      <div key={`ex-${i}`} className="ev-admin-thumb-wrap" style={{ width: 88, height: 66 }}>
                        <img src={img.url} alt={`existing ${i + 1}`} onError={(e) => { e.currentTarget.style.opacity = 0.3; }} />
                        <button type="button" className="ev-admin-thumb-x" onClick={() => removeExistingImage(i)} title="Remove">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {newImages.map((img, i) => (
                      <div key={`new-${i}`} className="ev-admin-thumb-wrap" style={{ width: 88, height: 66, borderColor: "var(--ti-brand)" }}>
                        <img src={img.url} alt={`new ${i + 1}`} />
                        <button type="button" className="ev-admin-thumb-x" onClick={() => removeNewImage(i)} title="Remove">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Robust dropzone: click OR drag & drop */}
                <div
                  className={`ev-dropzone ${dragOver ? "drag" : ""}`}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <UploadCloud size={22} color="#94A3B8" />
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>
                    Click to upload or drag &amp; drop
                  </span>
                  <span style={{ fontSize: 12, color: "var(--ti-muted)" }}>
                    PNG, JPG, WEBP — the first image is the cover. Up to 10 images, 5 MB each.
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: "10px 16px", borderRadius: 6, border: "none", background: "#f1f5f9", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: "10px 16px", borderRadius: 6, border: "none", background: "var(--ti-brand)", color: "#fff", cursor: saving ? "not-allowed" : "pointer", fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
                  {saving ? "Saving..." : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Info modal (description) */}
      {infoModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 16, width: "100%", maxWidth: 500, position: "relative" }}>
            <button onClick={() => setInfoModal(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
              <X size={20} />
            </button>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{infoModal.title}</h3>
            <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, fontSize: 14, color: "#334155", lineHeight: 1.6, maxHeight: "60vh", overflowY: "auto", whiteSpace: "pre-wrap" }}>
              {infoModal.text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}