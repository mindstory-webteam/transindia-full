// utils/serviceLeadMailer.js
//
// Sends every service-form submission to the office inbox over Office 365 SMTP,
// and (optionally) an acknowledgement back to the customer.
//
// Install once:   npm i nodemailer
//
// .env
//   SMTP_HOST=smtp.office365.com
//   SMTP_PORT=587
//   SMTP_USER=hr@transindia.com
//   SMTP_PASS=your_new_app_password
//   MAIL_FROM_NAME=TransIndia Website
//   LEAD_MAIL_TO=hr@transindia.com            # optional, defaults to SMTP_USER
//   LEAD_MAIL_CC=sales@transindia.com         # optional, comma separated
//   SEND_CUSTOMER_COPY=true                   # optional, default true
//   PUBLIC_API_URL=https://api.transindia.com # used to build document links

const nodemailer = require("nodemailer");

const SMTP_HOST = process.env.SMTP_HOST || "smtp.office365.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "TransIndia Website";
const LEAD_MAIL_TO = process.env.LEAD_MAIL_TO || SMTP_USER;
const LEAD_MAIL_CC = process.env.LEAD_MAIL_CC || "";
const SEND_CUSTOMER_COPY = process.env.SEND_CUSTOMER_COPY !== "false";
const PUBLIC_API_URL = (process.env.PUBLIC_API_URL || "").replace(/\/+$/, "");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Transport (created once, reused) ─────────────────────────────────────────
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!SMTP_USER || !SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,     // 587 starts plain, then upgrades
    requireTLS: true,  // STARTTLS is mandatory for Office 365
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { minVersion: "TLSv1.2", ciphers: "TLSv1.2" },
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  return transporter;
}

/**
 * Optional: call once at server start to fail fast on bad credentials.
 *   const { verifyMailer } = require("./utils/serviceLeadMailer");
 *   verifyMailer();
 */
async function verifyMailer() {
  const t = getTransporter();
  if (!t) {
    console.warn("⚠️  [mailer] SMTP_USER / SMTP_PASS missing — lead emails disabled.");
    return false;
  }
  try {
    await t.verify();
    console.log(`✅ [mailer] SMTP ready on ${SMTP_HOST}:${SMTP_PORT} as ${SMTP_USER}`);
    return true;
  } catch (err) {
    console.error("❌ [mailer] SMTP verify failed:", err.message);
    return false;
  }
}

// ── Field labels, in the order they should appear in the email ───────────────
const FIELD_ORDER = [
  ["name", "Full Name"],
  ["email", "Email Address"],
  ["phone", "Phone Number"],
  ["pincode", "Pincode"],
  ["dob", "Date of Birth"],
  ["gender", "Gender"],
  ["maritalStatus", "Marital Status"],
  ["category", "Coverage / Category"],
  ["coverType", "Cover Type"],
  ["sumInsured", "Sum Insured"],
  ["sumAssured", "Sum Assured"],
  ["policyTerm", "Policy Term"],
  ["annualIncome", "Annual Income"],
  ["smoker", "Smoker"],
  ["conditions", "Pre-existing Conditions"],
  ["cityTier", "City Tier"],
  ["vehicleType", "Type of Vehicle"],
  ["expiryDate", "Policy Expiry Date"],
  ["insuranceNumber", "Insurance Number"],
  ["industries", "Which Industries"],
  ["insuranceType", "Type of Insurance"],
  ["insuranceTypes", "Requirements"],
  ["query", "Customer Query"],
  ["plan", "Interested Plan"],
  ["lastFour", "Confirmed Last 4 Digits"],
  ["address", "Address"],
  ["wantsCallback", "Wants Callback"],
  ["agreeTerms", "Agreed to Terms"],
];

const esc = (v) =>
  String(v == null ? "" : v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function displayValue(key, value) {
  if (value === true || value === "true") return "Yes";
  if (value === false || value === "false") return "No";
  if (key === "dob" || key === "expiryDate") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d.toLocaleDateString("en-IN");
  }
  if (key === "phone") {
    const s = String(value).trim();
    return s.startsWith("+") ? s : `+91 ${s}`;
  }
  return String(value);
}

function collectRows(lead) {
  const rows = [];
  FIELD_ORDER.forEach(([key, label]) => {
    const raw = lead[key];
    if (raw === undefined || raw === null || String(raw).trim() === "") return;
    rows.push([label, displayValue(key, raw)]);
  });
  return rows;
}

function estimateRows(estimate) {
  if (!estimate) return [];
  const map = [
    ["coverage", "Coverage"],
    ["monthly", "Monthly Premium"],
    ["yearly", "Yearly Premium"],
    ["total", "Total"],
  ];
  return map
    .filter(([k]) => estimate[k] && String(estimate[k]).trim() !== "")
    .map(([k, label]) => [label, String(estimate[k])]);
}

// ── HTML builders ────────────────────────────────────────────────────────────
function tableHtml(rows) {
  return rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;font-size:13px;font-weight:700;color:#0B1F4D;width:200px;vertical-align:top;">${esc(
          label
        )}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;font-size:13px;color:#374151;">${esc(
          value
        ).replace(/\n/g, "<br/>")}</td>
      </tr>`
    )
    .join("");
}

function internalHtml(lead, documents) {
  const rows = collectRows(lead);
  const est = estimateRows(lead.estimate);

  const docBlock = documents.length
    ? `<h3 style="margin:24px 0 8px;font-size:13px;font-weight:800;color:#0B1F4D;text-transform:uppercase;letter-spacing:0.06em;">Uploaded Documents (${documents.length})</h3>
       <ul style="margin:0;padding-left:18px;font-size:13px;color:#374151;line-height:1.9;">
         ${documents
           .map((d, i) => {
             const proxy = PUBLIC_API_URL
               ? `${PUBLIC_API_URL}/api/serviceleads/${lead._id}/document/${i}`
               : d.url;
             return `<li><a href="${esc(proxy)}" style="color:#0D9488;font-weight:600;">${esc(
               d.originalName || `Document ${i + 1}`
             )}</a></li>`;
           })
           .join("")}
       </ul>`
    : "";

  const estBlock = est.length
    ? `<h3 style="margin:24px 0 8px;font-size:13px;font-weight:800;color:#0B1F4D;text-transform:uppercase;letter-spacing:0.06em;">Premium Estimate</h3>
       <table style="width:100%;border-collapse:collapse;">${tableHtml(est)}</table>`
    : "";

  return `
  <div style="background:#F1F5F9;padding:28px 16px;font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:660px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;">
      <div style="background:#001250;padding:24px 28px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.12em;color:#5EEAD4;font-weight:700;text-transform:uppercase;">New Website Enquiry</p>
        <h1 style="margin:0;font-size:20px;color:#ffffff;font-weight:800;">${esc(
          lead.serviceTitle || lead.serviceSlug || "Insurance Enquiry"
        )}</h1>
      </div>
      <div style="padding:24px 28px;">
        <table style="width:100%;border-collapse:collapse;">${tableHtml(rows)}</table>
        ${estBlock}
        ${docBlock}
        <p style="margin:24px 0 0;font-size:12px;color:#9CA3AF;line-height:1.7;">
          Lead ID: ${esc(lead._id)}<br/>
          Form type: ${esc(lead.formType || "-")} &middot; Source: ${esc(lead.source || "website")}<br/>
          Received ${esc(new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))} IST
        </p>
      </div>
    </div>
  </div>`;
}

function customerHtml(lead) {
  const service = lead.serviceTitle || "insurance";
  return `
  <div style="background:#F1F5F9;padding:28px 16px;font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;">
      <div style="background:#001250;padding:24px 28px;">
        <h1 style="margin:0;font-size:19px;color:#ffffff;font-weight:800;">Thanks for reaching out, ${esc(
          lead.name || "there"
        )}</h1>
      </div>
      <div style="padding:24px 28px;font-size:14px;color:#374151;line-height:1.75;">
        <p style="margin:0 0 14px;">We have received your enquiry for <strong>${esc(
          service
        )}</strong>. One of our advisors will call you on ${esc(
    displayValue("phone", lead.phone || "")
  )} with the options that suit you best.</p>
        <p style="margin:0 0 14px;">If anything is urgent, just reply to this email and we will pick it up straight away.</p>
        <p style="margin:24px 0 0;font-size:13px;color:#6B7280;">— Team TransIndia Insurance Brokers</p>
      </div>
    </div>
  </div>`;
}

function plainText(lead, documents) {
  const lines = collectRows(lead).map(([l, v]) => `${l}: ${v}`);
  const est = estimateRows(lead.estimate).map(([l, v]) => `${l}: ${v}`);
  if (est.length) lines.push("", "Premium estimate:", ...est);
  if (documents.length) {
    lines.push("", `Documents (${documents.length}):`);
    documents.forEach((d, i) =>
      lines.push(
        `  ${i + 1}. ${d.originalName || "document"} — ${
          PUBLIC_API_URL
            ? `${PUBLIC_API_URL}/api/serviceleads/${lead._id}/document/${i}`
            : d.url
        }`
      )
    );
  }
  lines.push("", `Lead ID: ${lead._id}`, `Source: ${lead.source || "website"}`);
  return lines.join("\n");
}

// ── Public API ───────────────────────────────────────────────────────────────
/**
 * Emails a newly created lead. Never throws — a mail failure must not lose
 * a lead that is already saved in MongoDB.
 *
 * @param {Object}  lead       the saved ServiceLead document
 * @param {Array}   documents  [{ url, publicId, mimeType, originalName }]
 */
async function sendServiceLeadMail(lead, documents = []) {
  const t = getTransporter();
  if (!t) {
    console.warn("⚠️  [mailer] Skipping lead email — SMTP not configured.");
    return { ok: false, reason: "not-configured" };
  }
  if (!LEAD_MAIL_TO) {
    console.warn("⚠️  [mailer] Skipping lead email — no recipient configured.");
    return { ok: false, reason: "no-recipient" };
  }

  const customerEmail = (lead.email || "").trim();

  // 1️⃣ Internal notification
  try {
    await t.sendMail({
      from: `"${MAIL_FROM_NAME}" <${SMTP_USER}>`, // must equal the authenticated mailbox on O365
      to: LEAD_MAIL_TO,
      cc: LEAD_MAIL_CC || undefined,
      replyTo: EMAIL_RE.test(customerEmail) ? customerEmail : undefined,
      subject: `New ${lead.serviceTitle || "insurance"} lead — ${lead.name || "Website visitor"}`,
      text: plainText(lead, documents),
      html: internalHtml(lead, documents),
    });
    console.log(`📧 [mailer] Lead ${lead._id} emailed to ${LEAD_MAIL_TO}`);
  } catch (err) {
    console.error("❌ [mailer] Internal notification failed:", err.message);
    return { ok: false, reason: err.message };
  }

  // 2️⃣ Acknowledgement to the customer (best effort)
  if (SEND_CUSTOMER_COPY && EMAIL_RE.test(customerEmail)) {
    try {
      await t.sendMail({
        from: `"TransIndia Insurance" <${SMTP_USER}>`,
        to: customerEmail,
        subject: `We received your ${lead.serviceTitle || "insurance"} enquiry`,
        text: `Hi ${lead.name || "there"},\n\nWe have received your enquiry for ${
          lead.serviceTitle || "insurance"
        }. One of our advisors will contact you shortly.\n\n— Team TransIndia Insurance Brokers`,
        html: customerHtml(lead),
      });
    } catch (err) {
      console.error("⚠️  [mailer] Customer acknowledgement failed:", err.message);
    }
  }

  return { ok: true };
}

module.exports = { sendServiceLeadMail, verifyMailer, getTransporter };