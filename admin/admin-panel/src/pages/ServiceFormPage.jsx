import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createService, updateService, getAllServices } from "../services/api";
import toast from "react-hot-toast";
import { Save, ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, X, Upload, Image as ImageIcon } from "lucide-react";

// ── Cloudinary unsigned upload ────────────────────────────────────────────────
// Go to Cloudinary dashboard → Settings → Upload → Upload presets → Add unsigned preset
// Set folder to "transindia/services" and copy the preset name here
const CLOUD_NAME    = "dzcpj4zcs";         // ← your Cloudinary cloud name
const UPLOAD_PRESET = "transindia_services"; // ← create this unsigned preset in Cloudinary dashboard

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  fd.append("folder", "transindia/services");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Cloudinary upload failed");
  }
  const data = await res.json();
  return data.secure_url; // full https://res.cloudinary.com/... URL
}

// ── Small reusable image picker used in every section ────────────────────────
function ImagePicker({ value, onChange, label = "Image", size = 80 }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Show local preview immediately
    const blobUrl = URL.createObjectURL(file);
    onChange(blobUrl, true); // second arg = "isPending" — not yet uploaded
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url, false);
      toast.success("Image uploaded!");
    } catch (err) {
      onChange("", false);
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const pickerStyle = {
    width: size, height: size,
    border: "2px dashed var(--border)",
    borderRadius: 8,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    cursor: "pointer", background: "#F8FAFC",
    overflow: "hidden", position: "relative", flexShrink: 0,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{label}</span>}
      <div style={pickerStyle} onClick={() => !uploading && inputRef.current?.click()} title="Click to upload">
        {value ? (
          <>
            <img src={value} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            {uploading && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#2563EB", fontWeight: 700 }}>
                Uploading…
              </div>
            )}
          </>
        ) : (
          <>
            {uploading
              ? <span style={{ fontSize: 10, color: "#2563EB", fontWeight: 700 }}>Uploading…</span>
              : <><Upload size={16} color="#94A3B8" /><span style={{ fontSize: 10, color: "#94A3B8", marginTop: 3 }}>Upload</span></>
            }
          </>
        )}
      </div>
      {value && !uploading && (
        <button type="button" onClick={() => onChange("", false)}
          style={{ fontSize: 10, color: "#DC2626", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
          ✕ Remove
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
}

// ── Reusable form helpers ─────────────────────────────────────────────────────
const Input = ({ label, ...props }) => (
  <label style={{ display: "block" }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</span>
    <input {...props} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none", background: "#fff", ...props.style }} />
  </label>
);
const Textarea = ({ label, ...props }) => (
  <label style={{ display: "block" }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</span>
    <textarea {...props} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none", resize: "vertical", background: "#fff", minHeight: 72, ...props.style }} />
  </label>
);
const Select = ({ label, children, ...props }) => (
  <label style={{ display: "block" }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</span>
    <select {...props} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none", background: "#fff" }}>{children}</select>
  </label>
);
const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 16 }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "#F8FAFC", border: "none", borderBottom: open ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
        {open ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
      </button>
      {open && <div style={{ padding: 20 }}>{children}</div>}
    </div>
  );
};

const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 };
const grid3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 };

// ── Defaults ──────────────────────────────────────────────────────────────────
// NOTE: The premium calculator is a frontend-only feature now, so there are no
// calc fields here — the website defines them in InsuranceDetailPage.tsx.
const emptyBenefit = { iconBg: "bg-blue-100", emoji: "🛡️", icon: "", title: "", description: "" };
const emptyStage   = { emoji: "📋", icon: "", age: "", ageColor: "text-blue-600", title: "", description: "", linkText: "", linkColor: "text-blue-700", bg: "bg-gradient-to-br from-blue-50 to-white" };
const emptyFaq     = { question: "", answer: "" };
const emptyStat    = { value: "", label: "" };

const DEFAULTS = {
  slug: "", title: "", badge: "", badgeColor: "bg-indigo-100 text-indigo-700",
  description: "", features: [], buttonText: "Get Quote", buttonColor: "bg-blue-700 hover:bg-blue-800",
  iconBg: "bg-slate-100", image: "", serviceType: "personal", sortOrder: 0, isActive: true,
  heroRestTitle: "", heroAccentWord: "", heroSubtitle: "",
  heroBadgeText: "", heroBadgeBg: "#001250", heroBadgeColor: "#38BDF8",
  heroStats: [], heroCtaLabel: "Talk to an Expert",
  heroCtaBg: "#F4622A", heroAccentColor: "#F4622A", heroAccentColor2: "#38BDF8",
  whyBadge: "", whyTitle: "", whyTitleAccent: "", whyTitleAccentColor: "#F4622A", whyBody: [],
  whyImage: "",
  benefitsBadge: "THE BENEFITS", benefitsTitle: "", benefitsTitleAccent: "",
  benefitsTitleAccentColor: "#F97316", benefitsSubtitle: "", benefits: [],
  stagesBadge: "", stagesTitle: "", stagesTitleAccent: "", stages: [],
  withoutTitle: "", withoutItems: [], withTitle: "", withItems: [],
  ctaHeading: "", ctaBody: "",
  faqBadge: "COMMON QUESTIONS", faqTitle: "", faqTitleAccent: "FAQs",
  faqTitleAccentColor: "#EA580C", faqs: [],
};

function sanitize(data) {
  const arrayFields = ["features", "heroStats", "whyBody", "benefits", "stages", "withoutItems", "withItems", "faqs"];
  const result = { ...DEFAULTS, ...data };
  arrayFields.forEach((key) => { if (!Array.isArray(result[key])) result[key] = []; });
  result.heroStats  = result.heroStats.map((s) => ({ ...emptyStat, ...s }));
  result.benefits   = result.benefits.map((b) => ({ ...emptyBenefit, ...b }));
  result.stages     = result.stages.map((s) => ({ ...emptyStage, ...s }));
  result.faqs       = result.faqs.map((f) => ({ ...emptyFaq, ...f }));
  return result;
}

// ── Main form ─────────────────────────────────────────────────────────────────
export default function ServiceFormPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isEdit   = !!id && id !== "new";

  const [form, setForm]     = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    getAllServices()
      .then((res) => {
        const list = res?.data?.data ?? res?.data ?? [];
        if (!Array.isArray(list)) { toast.error("Unexpected API response"); return; }
        const svc = list.find((s) => s._id === id);
        if (svc) setForm(sanitize(svc));
        else { toast.error("Service not found"); navigate("/services"); }
      })
      .catch(() => toast.error("Failed to load service data"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set       = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setArr    = (key, idx, val) => setForm((f) => { const a = [...f[key]]; a[idx] = val; return { ...f, [key]: a }; });
  const addArr    = (key, item) => setForm((f) => ({ ...f, [key]: [...f[key], item] }));
  const removeArr = (key, idx) => setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }));
  const setArrObj = (key, idx, field, val) => setForm((f) => ({
    ...f, [key]: f[key].map((item, i) => i === idx ? { ...item, [field]: val } : item),
  }));

  // ── All images are already Cloudinary URLs stored in form state ──
  // No FormData needed — just send plain JSON
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check no images still uploading
    const pending = form.image?.startsWith("blob:");
    if (pending) { toast.error("Please wait — image still uploading"); return; }

    setSaving(true);
    try {
      const payload = { ...form };
      if (isEdit) await updateService(id, payload);
      else        await createService(payload);
      toast.success(isEdit ? "Service updated!" : "Service created!");
      navigate("/services");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "#64748B", fontSize: 14 }}>
      Loading service data…
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button type="button" onClick={() => navigate("/services")}
          style={{ padding: "8px", background: "#fff", border: "1px solid var(--border)", borderRadius: 8, display: "flex" }}>
          <ArrowLeft size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>{isEdit ? "Edit Service" : "Add Service"}</h1>
          <p style={{ fontSize: 12, color: "#64748B" }}>Fill in all sections — they power the detail page on the website</p>
        </div>
        <button type="submit" disabled={saving}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#1E40AF", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, opacity: saving ? 0.7 : 1 }}>
          <Save size={15} /> {saving ? "Saving…" : "Save Service"}
        </button>
      </div>

      {/* ── BASIC INFO ── */}
      <Section title="🏷️ Basic Info">
        <div style={{ ...grid2, marginBottom: 14 }}>
          <Input label="Service Title *" value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="e.g. Life Insurance" />
          <Input label="Slug *" value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} required placeholder="life-insurance" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <Textarea label="Short Description (card) *" value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} required />
        </div>
        <div style={{ ...grid3, marginBottom: 14 }}>
          <Input label="Badge Text" value={form.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Popular" />
          <Input label="Badge CSS Classes" value={form.badgeColor} onChange={(e) => set("badgeColor", e.target.value)} />
          <Select label="Service Type" value={form.serviceType} onChange={(e) => set("serviceType", e.target.value)}>
            <option value="personal">Personal</option>
            <option value="corporate">Corporate</option>
          </Select>
        </div>
        <div style={{ ...grid3, marginBottom: 14 }}>
          <Input label="Button Text" value={form.buttonText} onChange={(e) => set("buttonText", e.target.value)} />
          <Input label="Button CSS Classes" value={form.buttonColor} onChange={(e) => set("buttonColor", e.target.value)} />
          <Input label="Icon Bg CSS" value={form.iconBg} onChange={(e) => set("iconBg", e.target.value)} placeholder="bg-slate-100" />
        </div>
        <div style={{ ...grid2, marginBottom: 14 }}>
          <Input label="Sort Order" type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} />
          <Select label="Status" value={form.isActive ? "true" : "false"} onChange={(e) => set("isActive", e.target.value === "true")}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Features (card bullets)</span>
          {form.features.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <input value={f} onChange={(e) => setArr("features", i, e.target.value)} placeholder={`Feature ${i + 1}`}
                style={{ flex: 1, padding: "8px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none" }} />
              <button type="button" onClick={() => removeArr("features", i)} style={{ padding: "8px", background: "none", border: "1px solid #FEE2E2", borderRadius: 6, color: "#DC2626", display: "flex" }}><Trash2 size={13} /></button>
            </div>
          ))}
          <button type="button" onClick={() => addArr("features", "")} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "none", display: "flex", alignItems: "center", gap: 4 }}><Plus size={12} />Add feature</button>
        </div>

        {/* ── Main service image ── */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, padding: 14, background: "#F8FAFC", borderRadius: 10, border: "1px solid var(--border)" }}>
          <ImagePicker
            label="Service Card Image"
            value={form.image}
            onChange={(url) => set("image", url)}
            size={100}
          />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Or paste image URL</span>
            <input
              value={form.image && !form.image.startsWith("blob:") ? form.image : ""}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://res.cloudinary.com/... or /images/life.svg"
              style={{ width: "100%", padding: "8px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none" }}
            />
            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>
              Upload via the picker (goes to Cloudinary) or paste an existing URL
            </p>
          </div>
        </div>
      </Section>

      {/* ── HERO ── */}
      <Section title="🦸 Hero Section">
        <div style={{ ...grid2, marginBottom: 14 }}>
          <Input label="Hero Title (rest)" value={form.heroRestTitle} onChange={(e) => set("heroRestTitle", e.target.value)} placeholder="Protect the people" />
          <Input label="Hero Accent Word" value={form.heroAccentWord} onChange={(e) => set("heroAccentWord", e.target.value)} placeholder="who matter" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <Textarea label="Hero Subtitle" value={form.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} rows={2} />
        </div>
        <div style={{ ...grid3, marginBottom: 14 }}>
          <Input label="Badge Text" value={form.heroBadgeText} onChange={(e) => set("heroBadgeText", e.target.value)} />
          <Input label="Badge Bg Color" type="color" value={form.heroBadgeBg} onChange={(e) => set("heroBadgeBg", e.target.value)} />
          <Input label="Badge Text Color" type="color" value={form.heroBadgeColor} onChange={(e) => set("heroBadgeColor", e.target.value)} />
        </div>
        <div style={{ ...grid3, marginBottom: 14 }}>
          <Input label="CTA Button Label" value={form.heroCtaLabel} onChange={(e) => set("heroCtaLabel", e.target.value)} />
          <Input label="CTA Button Color" type="color" value={form.heroCtaBg} onChange={(e) => set("heroCtaBg", e.target.value)} />
          <Input label="Accent Color 1" type="color" value={form.heroAccentColor} onChange={(e) => set("heroAccentColor", e.target.value)} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Hero Stats</span>
        {form.heroStats.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <input value={s.value} onChange={(e) => setArrObj("heroStats", i, "value", e.target.value)} placeholder="98.7%"
              style={{ flex: 1, padding: "8px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none" }} />
            <input value={s.label} onChange={(e) => setArrObj("heroStats", i, "label", e.target.value)} placeholder="Claims Settled"
              style={{ flex: 2, padding: "8px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none" }} />
            <button type="button" onClick={() => removeArr("heroStats", i)} style={{ padding: "8px", background: "none", border: "1px solid #FEE2E2", borderRadius: 6, color: "#DC2626", display: "flex" }}><Trash2 size={13} /></button>
          </div>
        ))}
        <button type="button" onClick={() => addArr("heroStats", { ...emptyStat })} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "none", display: "flex", alignItems: "center", gap: 4 }}><Plus size={12} />Add stat</button>
      </Section>

      {/* ── WHY ── */}
      <Section title="❓ Why Section" defaultOpen={false}>
        <div style={{ ...grid2, marginBottom: 14 }}>
          <Input label="Badge Text" value={form.whyBadge} onChange={(e) => set("whyBadge", e.target.value)} placeholder="WHY LIFE INSURANCE?" />
          <Input label="Accent Color" type="color" value={form.whyTitleAccentColor} onChange={(e) => set("whyTitleAccentColor", e.target.value)} />
        </div>
        <div style={{ ...grid2, marginBottom: 14 }}>
          <Input label="Title" value={form.whyTitle} onChange={(e) => set("whyTitle", e.target.value)} />
          <Input label="Title Accent" value={form.whyTitleAccent} onChange={(e) => set("whyTitleAccent", e.target.value)} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Body Paragraphs</span>
        {form.whyBody.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <textarea value={p} onChange={(e) => setArr("whyBody", i, e.target.value)} rows={2}
              style={{ flex: 1, padding: "8px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none", resize: "vertical" }} />
            <button type="button" onClick={() => removeArr("whyBody", i)} style={{ padding: "8px", background: "none", border: "1px solid #FEE2E2", borderRadius: 6, color: "#DC2626", display: "flex", alignSelf: "flex-start" }}><Trash2 size={13} /></button>
          </div>
        ))}
        <button type="button" onClick={() => addArr("whyBody", "")} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "none", display: "flex", alignItems: "center", gap: 4, marginBottom: 14 }}><Plus size={12} />Add paragraph</button>
        {/* Why section illustration image */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: 12, background: "#F8FAFC", borderRadius: 8, border: "1px solid var(--border)" }}>
          <ImagePicker label="Why Section Image" value={form.whyImage} onChange={(url) => set("whyImage", url)} size={80} />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 4 }}>Shown beside the why-section text on the detail page</span>
            <input value={form.whyImage && !form.whyImage.startsWith("blob:") ? form.whyImage : ""}
              onChange={(e) => set("whyImage", e.target.value)} placeholder="Or paste URL"
              style={{ width: "100%", padding: "7px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none" }} />
          </div>
        </div>
      </Section>

      {/* ── BENEFITS ── */}
      <Section title="✅ Benefits" defaultOpen={false}>
        <div style={{ ...grid3, marginBottom: 14 }}>
          <Input label="Section Badge" value={form.benefitsBadge} onChange={(e) => set("benefitsBadge", e.target.value)} />
          <Input label="Title" value={form.benefitsTitle} onChange={(e) => set("benefitsTitle", e.target.value)} />
          <Input label="Title Accent" value={form.benefitsTitleAccent} onChange={(e) => set("benefitsTitleAccent", e.target.value)} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <Textarea label="Subtitle" value={form.benefitsSubtitle} onChange={(e) => set("benefitsSubtitle", e.target.value)} rows={2} />
        </div>
        {form.benefits.map((b, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              {/* Icon image picker */}
              <ImagePicker
                label="Icon"
                value={b.icon || ""}
                onChange={(url) => setArrObj("benefits", i, "icon", url)}
                size={52}
              />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={b.emoji} onChange={(e) => setArrObj("benefits", i, "emoji", e.target.value)} placeholder="🛡️"
                    style={{ width: 46, padding: "7px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 18, textAlign: "center" }} />
                  <input value={b.title} onChange={(e) => setArrObj("benefits", i, "title", e.target.value)} placeholder="Benefit title"
                    style={{ flex: 1, padding: "7px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none" }} />
                  <input value={b.iconBg} onChange={(e) => setArrObj("benefits", i, "iconBg", e.target.value)} placeholder="bg-blue-100"
                    style={{ width: 120, padding: "7px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 12, outline: "none" }} />
                  <button type="button" onClick={() => removeArr("benefits", i)} style={{ padding: "7px", background: "none", border: "1px solid #FEE2E2", borderRadius: 6, color: "#DC2626", display: "flex" }}><Trash2 size={13} /></button>
                </div>
                <textarea value={b.description} onChange={(e) => setArrObj("benefits", i, "description", e.target.value)} rows={2} placeholder="Description"
                  style={{ width: "100%", padding: "7px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none", resize: "vertical" }} />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addArr("benefits", { ...emptyBenefit })} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "none", display: "flex", alignItems: "center", gap: 4 }}><Plus size={12} />Add benefit</button>
      </Section>

      {/* ── STAGES ── */}
      <Section title="📅 Life Stages" defaultOpen={false}>
        <div style={{ ...grid3, marginBottom: 14 }}>
          <Input label="Section Badge" value={form.stagesBadge} onChange={(e) => set("stagesBadge", e.target.value)} />
          <Input label="Title" value={form.stagesTitle} onChange={(e) => set("stagesTitle", e.target.value)} />
          <Input label="Title Accent" value={form.stagesTitleAccent} onChange={(e) => set("stagesTitleAccent", e.target.value)} />
        </div>
        {form.stages.map((s, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <ImagePicker label="Icon" value={s.icon || ""} onChange={(url) => setArrObj("stages", i, "icon", url)} size={52} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={s.emoji} onChange={(e) => setArrObj("stages", i, "emoji", e.target.value)} placeholder="🎓"
                    style={{ width: 46, padding: "7px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 18, textAlign: "center" }} />
                  <input value={s.age} onChange={(e) => setArrObj("stages", i, "age", e.target.value)} placeholder="AGE 20-30"
                    style={{ width: 100, padding: "7px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none" }} />
                  <input value={s.title} onChange={(e) => setArrObj("stages", i, "title", e.target.value)} placeholder="Stage title"
                    style={{ flex: 1, padding: "7px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none" }} />
                  <input value={s.linkText} onChange={(e) => setArrObj("stages", i, "linkText", e.target.value)} placeholder="Link text"
                    style={{ width: 120, padding: "7px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none" }} />
                  <button type="button" onClick={() => removeArr("stages", i)} style={{ padding: "7px", background: "none", border: "1px solid #FEE2E2", borderRadius: 6, color: "#DC2626", display: "flex" }}><Trash2 size={13} /></button>
                </div>
                <textarea value={s.description} onChange={(e) => setArrObj("stages", i, "description", e.target.value)} rows={2} placeholder="Description"
                  style={{ width: "100%", padding: "7px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none", resize: "vertical" }} />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addArr("stages", { ...emptyStage })} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "none", display: "flex", alignItems: "center", gap: 4 }}><Plus size={12} />Add stage</button>
      </Section>

      {/* ── WITH / WITHOUT ── */}
      <Section title="⚖️ With / Without Comparison" defaultOpen={false}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <Input label="Without Title" value={form.withoutTitle} onChange={(e) => set("withoutTitle", e.target.value)} style={{ marginBottom: 8 }} />
            {form.withoutItems.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <input value={item} onChange={(e) => setArr("withoutItems", i, e.target.value)} placeholder={`Item ${i + 1}`}
                  style={{ flex: 1, padding: "7px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none" }} />
                <button type="button" onClick={() => removeArr("withoutItems", i)} style={{ padding: "7px", background: "none", border: "1px solid #FEE2E2", borderRadius: 6, color: "#DC2626", display: "flex" }}><Trash2 size={12} /></button>
              </div>
            ))}
            <button type="button" onClick={() => addArr("withoutItems", "")} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "none", display: "flex", alignItems: "center", gap: 4 }}><Plus size={12} />Add</button>
          </div>
          <div>
            <Input label="With Title" value={form.withTitle} onChange={(e) => set("withTitle", e.target.value)} style={{ marginBottom: 8 }} />
            {form.withItems.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <input value={item} onChange={(e) => setArr("withItems", i, e.target.value)} placeholder={`Item ${i + 1}`}
                  style={{ flex: 1, padding: "7px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none" }} />
                <button type="button" onClick={() => removeArr("withItems", i)} style={{ padding: "7px", background: "none", border: "1px solid #FEE2E2", borderRadius: 6, color: "#DC2626", display: "flex" }}><Trash2 size={12} /></button>
              </div>
            ))}
            <button type="button" onClick={() => addArr("withItems", "")} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "none", display: "flex", alignItems: "center", gap: 4 }}><Plus size={12} />Add</button>
          </div>
        </div>
        <div style={{ ...grid2, marginTop: 14 }}>
          <Input label="CTA Heading" value={form.ctaHeading} onChange={(e) => set("ctaHeading", e.target.value)} />
          <Input label="CTA Body" value={form.ctaBody} onChange={(e) => set("ctaBody", e.target.value)} />
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section title="❔ FAQs" defaultOpen={false}>
        <div style={{ ...grid3, marginBottom: 14 }}>
          <Input label="Badge" value={form.faqBadge} onChange={(e) => set("faqBadge", e.target.value)} />
          <Input label="Title" value={form.faqTitle} onChange={(e) => set("faqTitle", e.target.value)} />
          <Input label="Accent" value={form.faqTitleAccent} onChange={(e) => set("faqTitleAccent", e.target.value)} />
        </div>
        {form.faqs.map((f, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <input value={f.question} onChange={(e) => setArrObj("faqs", i, "question", e.target.value)} placeholder="Question"
                style={{ flex: 1, padding: "7px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none" }} />
              <button type="button" onClick={() => removeArr("faqs", i)} style={{ padding: "7px", background: "none", border: "1px solid #FEE2E2", borderRadius: 6, color: "#DC2626", display: "flex" }}><Trash2 size={13} /></button>
            </div>
            <textarea value={f.answer} onChange={(e) => setArrObj("faqs", i, "answer", e.target.value)} rows={2} placeholder="Answer"
              style={{ width: "100%", padding: "7px 10px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none", resize: "vertical" }} />
          </div>
        ))}
        <button type="button" onClick={() => addArr("faqs", { ...emptyFaq })} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "none", display: "flex", alignItems: "center", gap: 4 }}><Plus size={12} />Add FAQ</button>
      </Section>

      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
        <button type="submit" disabled={saving}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 28px", background: "#1E40AF", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, opacity: saving ? 0.7 : 1 }}>
          <Save size={16} /> {saving ? "Saving…" : "Save Service"}
        </button>
      </div>
    </form>
  );
}