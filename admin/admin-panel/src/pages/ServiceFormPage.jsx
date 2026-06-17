import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createService, updateService, getAllServices } from "../services/api";
import toast from "react-hot-toast";
import { Save, ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

// ── Reusable helpers ──────────────────────────────────────────────────────
const Input = ({ label, ...props }) => (
  <label style={{ display:"block" }}>
    <span style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>{label}</span>
    <input {...props} style={{ width:"100%", padding:"9px 12px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none", background:"#fff", ...props.style }} />
  </label>
);

const Textarea = ({ label, ...props }) => (
  <label style={{ display:"block" }}>
    <span style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>{label}</span>
    <textarea {...props} style={{ width:"100%", padding:"9px 12px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none", resize:"vertical", background:"#fff", minHeight:72, ...props.style }} />
  </label>
);

const Select = ({ label, children, ...props }) => (
  <label style={{ display:"block" }}>
    <span style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>{label}</span>
    <select {...props} style={{ width:"100%", padding:"9px 12px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none", background:"#fff" }}>
      {children}
    </select>
  </label>
);

const Section = ({ title, children, defaultOpen=true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background:"#fff", borderRadius:12, border:"1px solid var(--border)", overflow:"hidden", marginBottom:16 }}>
      <button type="button" onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", background:"#F8FAFC", border:"none", borderBottom: open?"1px solid var(--border)":"none", cursor:"pointer" }}>
        <span style={{ fontWeight:700, fontSize:14 }}>{title}</span>
        {open ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
      </button>
      {open && <div style={{ padding:20 }}>{children}</div>}
    </div>
  );
};

const grid2 = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 };
const grid3 = { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 };

// ── Defaults ──────────────────────────────────────────────────────────────
const emptyBenefit = { iconBg:"bg-blue-100", emoji:"🛡️", title:"", description:"" };
const emptyStage   = { emoji:"📋", age:"", ageColor:"text-blue-600", title:"", description:"", linkText:"", linkColor:"text-blue-700", bg:"bg-gradient-to-br from-blue-50 to-white" };
const emptyFaq     = { question:"", answer:"" };
const emptyField   = { label:"", type:"select", options:[], stateKey:"", defaultValue:"" };
const emptyStat    = { value:"", label:"" };

const DEFAULTS = {
  slug:"", title:"", badge:"", badgeColor:"bg-indigo-100 text-indigo-700",
  description:"", features:[""], buttonText:"Get Quote", buttonColor:"bg-blue-700 hover:bg-blue-800",
  iconBg:"bg-slate-100", image:"", serviceType:"personal", sortOrder:0, isActive:true,
  heroRestTitle:"", heroAccentWord:"", heroSubtitle:"",
  heroBadgeText:"", heroBadgeBg:"#001250", heroBadgeColor:"#38BDF8",
  heroStats:[{ value:"", label:"" }], heroCtaLabel:"Talk to an Expert",
  heroCtaBg:"#F4622A", heroAccentColor:"#F4622A", heroAccentColor2:"#38BDF8",
  whyBadge:"", whyTitle:"", whyTitleAccent:"", whyTitleAccentColor:"#F4622A", whyBody:[""],
  benefitsBadge:"THE BENEFITS", benefitsTitle:"", benefitsTitleAccent:"",
  benefitsTitleAccentColor:"#F97316", benefitsSubtitle:"",
  benefits:[{ ...emptyBenefit }],
  stagesBadge:"", stagesTitle:"", stagesTitleAccent:"",
  stages:[{ ...emptyStage }],
  withoutTitle:"", withoutItems:[""], withTitle:"", withItems:[""],
  ctaHeading:"", ctaBody:"",
  faqBadge:"COMMON QUESTIONS", faqTitle:"", faqTitleAccent:"FAQs",
  faqTitleAccentColor:"#EA580C", faqs:[{ ...emptyFaq }],
  calcCardTitle:"Get a quote", calcSubmitLabel:"Get My Quote", calcSubmitBg:"#1B8A3A",
  calcFields:[{ ...emptyField }],
};

// ── Main form ─────────────────────────────────────────────────────────────
export default function ServiceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit   = !!id;

  const [form, setForm]       = useState(DEFAULTS);
  const [imageFile, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(isEdit);

  // Load existing data for edit
  useEffect(() => {
    if (!isEdit) return;
    getAllServices().then(res => {
      const svc = res.data.data.find(s => s._id === id);
      if (svc) {
        setForm({ ...DEFAULTS, ...svc });
        if (svc.image) setPreview(svc.image);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  // Generic field setter
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Array item helpers
  const setArr = (key, idx, val) => setForm(f => {
    const arr = [...f[key]];
    arr[idx] = val;
    return { ...f, [key]: arr };
  });
  const addArr    = (key, item)  => setForm(f => ({ ...f, [key]: [...f[key], item] }));
  const removeArr = (key, idx)   => setForm(f => ({ ...f, [key]: f[key].filter((_,i)=>i!==idx) }));

  // Nested object in array
  const setArrObj = (key, idx, field, val) => setForm(f => {
    const arr = f[key].map((item, i) => i===idx ? { ...item, [field]: val } : item);
    return { ...f, [key]: arr };
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      // Append all fields
      const jsonFields = ["heroStats","benefits","stages","faqs","calcFields","features","whyBody","withoutItems","withItems"];
      Object.entries(form).forEach(([k,v]) => {
        if (jsonFields.includes(k)) fd.append(k, JSON.stringify(v));
        else if (v !== null && v !== undefined) fd.append(k, v);
      });
      if (imageFile) fd.append("image", imageFile);

      if (isEdit) {
        await updateService(id, fd);
        toast.success("Service updated!");
      } else {
        await createService(fd);
        toast.success("Service created!");
      }
      navigate("/services");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ color:"#64748B" }}>Loading…</p>;

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <button type="button" onClick={() => navigate("/services")}
          style={{ padding:"8px", background:"#fff", border:"1px solid var(--border)", borderRadius:8, display:"flex" }}>
          <ArrowLeft size={16} />
        </button>
        <div style={{ flex:1 }}>
          <h1 style={{ fontSize:20, fontWeight:800 }}>{isEdit ? "Edit Service" : "Add Service"}</h1>
          <p style={{ fontSize:12, color:"#64748B" }}>Fill in all sections — they power the detail page on the website</p>
        </div>
        <button type="submit" disabled={saving}
          style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"10px 20px", background:"#1E40AF", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, opacity:saving?0.7:1 }}>
          <Save size={15} /> {saving ? "Saving…" : "Save Service"}
        </button>
      </div>

      {/* ── BASIC INFO ─────────────────────────────────────────────────── */}
      <Section title="🏷️ Basic Info">
        <div style={{ ...grid2, marginBottom:14 }}>
          <Input label="Service Title *" value={form.title} onChange={e=>set("title",e.target.value)} required placeholder="e.g. Life Insurance" />
          <Input label="Slug *" value={form.slug} onChange={e=>set("slug",e.target.value.toLowerCase().replace(/\s+/g,"-"))} required placeholder="life-insurance" />
        </div>
        <div style={{ marginBottom:14 }}>
          <Textarea label="Short Description (card)" value={form.description} onChange={e=>set("description",e.target.value)} rows={2} />
        </div>
        <div style={{ ...grid3, marginBottom:14 }}>
          <Input label="Badge Text" value={form.badge} onChange={e=>set("badge",e.target.value)} placeholder="Popular" />
          <Input label="Badge CSS Classes" value={form.badgeColor} onChange={e=>set("badgeColor",e.target.value)} placeholder="bg-indigo-100 text-indigo-700" />
          <Select label="Service Type" value={form.serviceType} onChange={e=>set("serviceType",e.target.value)}>
            <option value="personal">Personal</option>
            <option value="corporate">Corporate</option>
          </Select>
        </div>
        <div style={{ ...grid3, marginBottom:14 }}>
          <Input label="Button Text" value={form.buttonText} onChange={e=>set("buttonText",e.target.value)} />
          <Input label="Button CSS Classes" value={form.buttonColor} onChange={e=>set("buttonColor",e.target.value)} />
          <Input label="Icon Bg CSS" value={form.iconBg} onChange={e=>set("iconBg",e.target.value)} placeholder="bg-slate-100" />
        </div>
        <div style={{ ...grid2, marginBottom:14 }}>
          <Input label="Sort Order" type="number" value={form.sortOrder} onChange={e=>set("sortOrder",Number(e.target.value))} />
          <Select label="Status" value={form.isActive?"true":"false"} onChange={e=>set("isActive",e.target.value==="true")}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </div>

        {/* Features list */}
        <div style={{ marginBottom:14 }}>
          <span style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>Features (card bullets)</span>
          {form.features.map((f,i) => (
            <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
              <input value={f} onChange={e=>setArr("features",i,e.target.value)} placeholder={`Feature ${i+1}`}
                style={{ flex:1, padding:"8px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }} />
              <button type="button" onClick={()=>removeArr("features",i)} style={{ padding:"8px", background:"none", border:"1px solid #FEE2E2", borderRadius:6, color:"#DC2626", display:"flex" }}><Trash2 size={13}/></button>
            </div>
          ))}
          <button type="button" onClick={()=>addArr("features","")} style={{ fontSize:12, color:"#2563EB", background:"none", border:"none", display:"flex", alignItems:"center", gap:4 }}><Plus size={12}/>Add feature</button>
        </div>

        {/* Image upload */}
        <div>
          <span style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>Service Image / Icon</span>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            {preview && <img src={preview} alt="" style={{ width:80, height:60, objectFit:"contain", borderRadius:8, border:"1px solid var(--border)" }} />}
            <input type="file" accept="image/*" onChange={handleImage} style={{ fontSize:13 }} />
          </div>
          <Input label="Or paste image URL" value={form.image} onChange={e=>set("image",e.target.value)} placeholder="/images/services/life.svg" style={{ marginTop:8 }} />
        </div>
      </Section>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <Section title="🦸 Hero Section">
        <div style={{ ...grid2, marginBottom:14 }}>
          <Input label="Hero Title (rest)" value={form.heroRestTitle} onChange={e=>set("heroRestTitle",e.target.value)} placeholder="Protect the people" />
          <Input label="Hero Accent Word" value={form.heroAccentWord} onChange={e=>set("heroAccentWord",e.target.value)} placeholder="who matter" />
        </div>
        <div style={{ marginBottom:14 }}>
          <Textarea label="Hero Subtitle" value={form.heroSubtitle} onChange={e=>set("heroSubtitle",e.target.value)} rows={2} />
        </div>
        <div style={{ ...grid3, marginBottom:14 }}>
          <Input label="Badge Text" value={form.heroBadgeText} onChange={e=>set("heroBadgeText",e.target.value)} />
          <Input label="Badge Bg Color" type="color" value={form.heroBadgeBg} onChange={e=>set("heroBadgeBg",e.target.value)} />
          <Input label="Badge Text Color" type="color" value={form.heroBadgeColor} onChange={e=>set("heroBadgeColor",e.target.value)} />
        </div>
        <div style={{ ...grid3, marginBottom:14 }}>
          <Input label="CTA Button Label" value={form.heroCtaLabel} onChange={e=>set("heroCtaLabel",e.target.value)} />
          <Input label="CTA Button Color" type="color" value={form.heroCtaBg} onChange={e=>set("heroCtaBg",e.target.value)} />
          <Input label="Accent Color 1" type="color" value={form.heroAccentColor} onChange={e=>set("heroAccentColor",e.target.value)} />
        </div>

        {/* Hero stats */}
        <span style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>Hero Stats (3 recommended)</span>
        {form.heroStats.map((s,i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
            <input value={s.value} onChange={e=>setArrObj("heroStats",i,"value",e.target.value)} placeholder="98.7%"
              style={{ flex:1, padding:"8px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }} />
            <input value={s.label} onChange={e=>setArrObj("heroStats",i,"label",e.target.value)} placeholder="Claims Settled"
              style={{ flex:2, padding:"8px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }} />
            <button type="button" onClick={()=>removeArr("heroStats",i)} style={{ padding:"8px", background:"none", border:"1px solid #FEE2E2", borderRadius:6, color:"#DC2626", display:"flex" }}><Trash2 size={13}/></button>
          </div>
        ))}
        <button type="button" onClick={()=>addArr("heroStats",{...emptyStat})} style={{ fontSize:12, color:"#2563EB", background:"none", border:"none", display:"flex", alignItems:"center", gap:4 }}><Plus size={12}/>Add stat</button>
      </Section>

      {/* ── WHY SECTION ───────────────────────────────────────────────── */}
      <Section title="❓ Why Section" defaultOpen={false}>
        <div style={{ ...grid2, marginBottom:14 }}>
          <Input label="Badge Text" value={form.whyBadge} onChange={e=>set("whyBadge",e.target.value)} placeholder="WHY LIFE INSURANCE?" />
          <Input label="Accent Color" type="color" value={form.whyTitleAccentColor} onChange={e=>set("whyTitleAccentColor",e.target.value)} />
        </div>
        <div style={{ ...grid2, marginBottom:14 }}>
          <Input label="Title" value={form.whyTitle} onChange={e=>set("whyTitle",e.target.value)} />
          <Input label="Title Accent" value={form.whyTitleAccent} onChange={e=>set("whyTitleAccent",e.target.value)} />
        </div>
        <span style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>Body Paragraphs</span>
        {form.whyBody.map((p,i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
            <textarea value={p} onChange={e=>setArr("whyBody",i,e.target.value)} rows={2}
              style={{ flex:1, padding:"8px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none", resize:"vertical" }} />
            <button type="button" onClick={()=>removeArr("whyBody",i)} style={{ padding:"8px", background:"none", border:"1px solid #FEE2E2", borderRadius:6, color:"#DC2626", display:"flex", alignSelf:"flex-start" }}><Trash2 size={13}/></button>
          </div>
        ))}
        <button type="button" onClick={()=>addArr("whyBody","")} style={{ fontSize:12, color:"#2563EB", background:"none", border:"none", display:"flex", alignItems:"center", gap:4 }}><Plus size={12}/>Add paragraph</button>
      </Section>

      {/* ── BENEFITS ──────────────────────────────────────────────────── */}
      <Section title="✅ Benefits (8 cards)" defaultOpen={false}>
        <div style={{ ...grid3, marginBottom:14 }}>
          <Input label="Section Badge" value={form.benefitsBadge} onChange={e=>set("benefitsBadge",e.target.value)} />
          <Input label="Title" value={form.benefitsTitle} onChange={e=>set("benefitsTitle",e.target.value)} />
          <Input label="Title Accent" value={form.benefitsTitleAccent} onChange={e=>set("benefitsTitleAccent",e.target.value)} />
        </div>
        <div style={{ marginBottom:14 }}>
          <Textarea label="Subtitle" value={form.benefitsSubtitle} onChange={e=>set("benefitsSubtitle",e.target.value)} rows={2} />
        </div>
        {form.benefits.map((b,i) => (
          <div key={i} style={{ background:"#F8FAFC", borderRadius:8, padding:12, marginBottom:8 }}>
            <div style={{ display:"flex", gap:8, marginBottom:8 }}>
              <input value={b.emoji} onChange={e=>setArrObj("benefits",i,"emoji",e.target.value)} placeholder="🛡️"
                style={{ width:50, padding:"7px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:20, textAlign:"center" }} />
              <input value={b.title} onChange={e=>setArrObj("benefits",i,"title",e.target.value)} placeholder="Benefit title"
                style={{ flex:1, padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }} />
              <input value={b.iconBg} onChange={e=>setArrObj("benefits",i,"iconBg",e.target.value)} placeholder="bg-blue-100"
                style={{ width:130, padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:12, outline:"none" }} />
              <button type="button" onClick={()=>removeArr("benefits",i)} style={{ padding:"7px", background:"none", border:"1px solid #FEE2E2", borderRadius:6, color:"#DC2626", display:"flex" }}><Trash2 size={13}/></button>
            </div>
            <textarea value={b.description} onChange={e=>setArrObj("benefits",i,"description",e.target.value)} rows={2} placeholder="Description"
              style={{ width:"100%", padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none", resize:"vertical" }} />
          </div>
        ))}
        <button type="button" onClick={()=>addArr("benefits",{...emptyBenefit})} style={{ fontSize:12, color:"#2563EB", background:"none", border:"none", display:"flex", alignItems:"center", gap:4 }}><Plus size={12}/>Add benefit</button>
      </Section>

      {/* ── STAGES ────────────────────────────────────────────────────── */}
      <Section title="📅 Life Stages (4 columns)" defaultOpen={false}>
        <div style={{ ...grid3, marginBottom:14 }}>
          <Input label="Section Badge" value={form.stagesBadge} onChange={e=>set("stagesBadge",e.target.value)} />
          <Input label="Title" value={form.stagesTitle} onChange={e=>set("stagesTitle",e.target.value)} />
          <Input label="Title Accent" value={form.stagesTitleAccent} onChange={e=>set("stagesTitleAccent",e.target.value)} />
        </div>
        {form.stages.map((s,i) => (
          <div key={i} style={{ background:"#F8FAFC", borderRadius:8, padding:12, marginBottom:8 }}>
            <div style={{ display:"flex", gap:8, marginBottom:8 }}>
              <input value={s.emoji} onChange={e=>setArrObj("stages",i,"emoji",e.target.value)} placeholder="🎓"
                style={{ width:48, padding:"7px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:20, textAlign:"center" }} />
              <input value={s.age} onChange={e=>setArrObj("stages",i,"age",e.target.value)} placeholder="AGE 20-30"
                style={{ width:110, padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }} />
              <input value={s.title} onChange={e=>setArrObj("stages",i,"title",e.target.value)} placeholder="Stage title"
                style={{ flex:1, padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }} />
              <input value={s.linkText} onChange={e=>setArrObj("stages",i,"linkText",e.target.value)} placeholder="Link text"
                style={{ width:130, padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }} />
              <button type="button" onClick={()=>removeArr("stages",i)} style={{ padding:"7px", background:"none", border:"1px solid #FEE2E2", borderRadius:6, color:"#DC2626", display:"flex" }}><Trash2 size={13}/></button>
            </div>
            <textarea value={s.description} onChange={e=>setArrObj("stages",i,"description",e.target.value)} rows={2} placeholder="Description"
              style={{ width:"100%", padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none", resize:"vertical" }} />
          </div>
        ))}
        <button type="button" onClick={()=>addArr("stages",{...emptyStage})} style={{ fontSize:12, color:"#2563EB", background:"none", border:"none", display:"flex", alignItems:"center", gap:4 }}><Plus size={12}/>Add stage</button>
      </Section>

      {/* ── WITH / WITHOUT ────────────────────────────────────────────── */}
      <Section title="⚖️ With / Without Comparison" defaultOpen={false}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
          <div>
            <Input label="Without Title" value={form.withoutTitle} onChange={e=>set("withoutTitle",e.target.value)} style={{ marginBottom:8 }} />
            {form.withoutItems.map((item,i) => (
              <div key={i} style={{ display:"flex", gap:6, marginBottom:6 }}>
                <input value={item} onChange={e=>setArr("withoutItems",i,e.target.value)} placeholder={`Item ${i+1}`}
                  style={{ flex:1, padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }} />
                <button type="button" onClick={()=>removeArr("withoutItems",i)} style={{ padding:"7px", background:"none", border:"1px solid #FEE2E2", borderRadius:6, color:"#DC2626", display:"flex" }}><Trash2 size={12}/></button>
              </div>
            ))}
            <button type="button" onClick={()=>addArr("withoutItems","")} style={{ fontSize:12, color:"#2563EB", background:"none", border:"none", display:"flex", alignItems:"center", gap:4 }}><Plus size={12}/>Add</button>
          </div>
          <div>
            <Input label="With Title" value={form.withTitle} onChange={e=>set("withTitle",e.target.value)} style={{ marginBottom:8 }} />
            {form.withItems.map((item,i) => (
              <div key={i} style={{ display:"flex", gap:6, marginBottom:6 }}>
                <input value={item} onChange={e=>setArr("withItems",i,e.target.value)} placeholder={`Item ${i+1}`}
                  style={{ flex:1, padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }} />
                <button type="button" onClick={()=>removeArr("withItems",i)} style={{ padding:"7px", background:"none", border:"1px solid #FEE2E2", borderRadius:6, color:"#DC2626", display:"flex" }}><Trash2 size={12}/></button>
              </div>
            ))}
            <button type="button" onClick={()=>addArr("withItems","")} style={{ fontSize:12, color:"#2563EB", background:"none", border:"none", display:"flex", alignItems:"center", gap:4 }}><Plus size={12}/>Add</button>
          </div>
        </div>
        <div style={{ ...grid2, marginTop:14 }}>
          <Input label="CTA Heading" value={form.ctaHeading} onChange={e=>set("ctaHeading",e.target.value)} />
          <Input label="CTA Body" value={form.ctaBody} onChange={e=>set("ctaBody",e.target.value)} />
        </div>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <Section title="❔ FAQs" defaultOpen={false}>
        <div style={{ ...grid3, marginBottom:14 }}>
          <Input label="Badge" value={form.faqBadge} onChange={e=>set("faqBadge",e.target.value)} />
          <Input label="Title" value={form.faqTitle} onChange={e=>set("faqTitle",e.target.value)} />
          <Input label="Accent" value={form.faqTitleAccent} onChange={e=>set("faqTitleAccent",e.target.value)} />
        </div>
        {form.faqs.map((f,i) => (
          <div key={i} style={{ background:"#F8FAFC", borderRadius:8, padding:12, marginBottom:8 }}>
            <div style={{ display:"flex", gap:8, marginBottom:6 }}>
              <input value={f.question} onChange={e=>setArrObj("faqs",i,"question",e.target.value)} placeholder="Question"
                style={{ flex:1, padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }} />
              <button type="button" onClick={()=>removeArr("faqs",i)} style={{ padding:"7px", background:"none", border:"1px solid #FEE2E2", borderRadius:6, color:"#DC2626", display:"flex" }}><Trash2 size={13}/></button>
            </div>
            <textarea value={f.answer} onChange={e=>setArrObj("faqs",i,"answer",e.target.value)} rows={2} placeholder="Answer"
              style={{ width:"100%", padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none", resize:"vertical" }} />
          </div>
        ))}
        <button type="button" onClick={()=>addArr("faqs",{...emptyFaq})} style={{ fontSize:12, color:"#2563EB", background:"none", border:"none", display:"flex", alignItems:"center", gap:4 }}><Plus size={12}/>Add FAQ</button>
      </Section>

      {/* ── CALCULATOR ────────────────────────────────────────────────── */}
      <Section title="🧮 Quote Calculator Card" defaultOpen={false}>
        <div style={{ ...grid3, marginBottom:14 }}>
          <Input label="Card Title" value={form.calcCardTitle} onChange={e=>set("calcCardTitle",e.target.value)} />
          <Input label="Submit Button Label" value={form.calcSubmitLabel} onChange={e=>set("calcSubmitLabel",e.target.value)} />
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Submit Button Color</label>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <input type="color" value={form.calcSubmitBg} onChange={e=>set("calcSubmitBg",e.target.value)} style={{ width:40, height:36, border:"none", borderRadius:6, cursor:"pointer" }} />
              <input value={form.calcSubmitBg} onChange={e=>set("calcSubmitBg",e.target.value)}
                style={{ flex:1, padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }} />
            </div>
          </div>
        </div>

        <span style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:8 }}>Form Fields</span>
        {form.calcFields.map((f,i) => (
          <div key={i} style={{ background:"#F8FAFC", borderRadius:8, padding:12, marginBottom:8 }}>
            <div style={{ display:"flex", gap:8, marginBottom:8 }}>
              <input value={f.label} onChange={e=>setArrObj("calcFields",i,"label",e.target.value)} placeholder="Field label"
                style={{ flex:2, padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }} />
              <select value={f.type} onChange={e=>setArrObj("calcFields",i,"type",e.target.value)}
                style={{ flex:1, padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }}>
                <option value="select">Select</option>
                <option value="date">Date</option>
              </select>
              <input value={f.stateKey} onChange={e=>setArrObj("calcFields",i,"stateKey",e.target.value)} placeholder="stateKey (no spaces)"
                style={{ flex:1, padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }} />
              <input value={f.defaultValue} onChange={e=>setArrObj("calcFields",i,"defaultValue",e.target.value)} placeholder="Default"
                style={{ flex:1, padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }} />
              <button type="button" onClick={()=>removeArr("calcFields",i)} style={{ padding:"7px", background:"none", border:"1px solid #FEE2E2", borderRadius:6, color:"#DC2626", display:"flex" }}><Trash2 size={13}/></button>
            </div>
            {f.type === "select" && (
              <div>
                <span style={{ fontSize:11, color:"#64748B", display:"block", marginBottom:4 }}>Options (comma-separated):</span>
                <input
                  value={(f.options || []).join(",")}
                  onChange={e => setArrObj("calcFields",i,"options",e.target.value.split(",").map(s=>s.trim()).filter(Boolean))}
                  placeholder="Option 1,Option 2,Option 3"
                  style={{ width:"100%", padding:"7px 10px", border:"1.5px solid var(--border)", borderRadius:7, fontSize:13, outline:"none" }}
                />
              </div>
            )}
          </div>
        ))}
        <button type="button" onClick={()=>addArr("calcFields",{...emptyField})} style={{ fontSize:12, color:"#2563EB", background:"none", border:"none", display:"flex", alignItems:"center", gap:4 }}><Plus size={12}/>Add field</button>
      </Section>

      {/* Bottom save */}
      <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:8 }}>
        <button type="submit" disabled={saving}
          style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"12px 28px", background:"#1E40AF", color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:700, opacity:saving?0.7:1 }}>
          <Save size={16} /> {saving ? "Saving…" : "Save Service"}
        </button>
      </div>
    </form>
  );
}