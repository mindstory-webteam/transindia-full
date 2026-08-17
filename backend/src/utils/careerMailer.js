

const nodemailer = require("nodemailer");

const SMTP_HOST = process.env.CAREER_SMTP_HOST || "smtp.office365.com";
const SMTP_PORT = Number(process.env.CAREER_SMTP_PORT || 587);

// The authenticated mailbox — this is the address mail is SENT FROM.
const SMTP_USER = process.env.CAREER_SMTP_USER || "";
const SMTP_PASS = process.env.CAREER_SMTP_PASS || "";

const FROM_NAME = process.env.CAREER_MAIL_FROM_NAME || "TransIndia Careers";

// ✅ Applications are DELIVERED TO hr@. Hardcoded fallback so a missing env var
// can never silently route applications somewhere else.
const MAIL_TO = process.env.CAREER_MAIL_TO || "hr@transindia.com";
const MAIL_CC = process.env.CAREER_MAIL_CC || "";

const SEND_APPLICANT_COPY = process.env.SEND_APPLICANT_COPY !== "false";
const ATTACH_RESUME = process.env.ATTACH_RESUME !== "false";

// Exchange Online rejects very large messages; keep attachments sane.
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024; // 8 MB

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Transport (created once, reused) ─────────────────────────────────────────
let transporter = null;

function getCareerTransporter() {
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
    maxConnections: 2,
    maxMessages: 50,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 30000, // resumes are attached, so allow a longer upload
  });

  return transporter;
}

/**
 * Optional boot check:
 *   const { verifyCareerMailer } = require("./utils/careerMailer");
 *   verifyCareerMailer();
 */
async function verifyCareerMailer() {
  const t = getCareerTransporter();
  if (!t) {
    console.warn("⚠️  [careerMailer] CAREER_SMTP_USER / CAREER_SMTP_PASS missing — application emails disabled.");
    return false;
  }
  try {
    await t.verify();
    console.log(`✅ [careerMailer] SMTP ready on ${SMTP_HOST}:${SMTP_PORT} — sending as ${SMTP_USER}, delivering to ${MAIL_TO}`);
    return true;
  } catch (err) {
    console.error("❌ [careerMailer] SMTP verify failed:", err.message);
    return false;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const esc = (v) =>
  String(v == null ? "" : v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatPhone = (p) => {
  const s = String(p || "").trim();
  if (!s) return "";
  return s.startsWith("+") ? s : `+91 ${s}`;
};

const prettySize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Build a clean download filename: rahul-nair-resume.pdf */
function resumeFilename(applicantName, originalName) {
  const safe =
    String(applicantName || "applicant")
      .replace(/[^a-zA-Z0-9 _-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase() || "applicant";
  const ext = (originalName || "").match(/\.[a-zA-Z0-9]+$/);
  return `${safe}-resume${ext ? ext[0].toLowerCase() : ".pdf"}`;
}

function rowsHtml(rows) {
  return rows
    .filter(([, v]) => String(v || "").trim() !== "")
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;font-size:13px;font-weight:700;color:#0B1F4D;width:170px;vertical-align:top;">${esc(
          label
        )}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;font-size:13px;color:#374151;">${esc(
          value
        ).replace(/\n/g, "<br/>")}</td>
      </tr>`
    )
    .join("");
}

// ── HTML templates ───────────────────────────────────────────────────────────
function internalHtml({ application, jobTitle, resumeUrl, attached, fileSize }) {
  const rows = [
    ["Applicant", application.name],
    ["Email", application.email],
    ["Phone", formatPhone(application.phone)],
    ["Applied For", jobTitle],
    ["Message", application.message],
  ];

  const resumeNote = attached
    ? `The resume is attached to this email${fileSize ? ` (${esc(prettySize(fileSize))})` : ""}.`
    : "The resume could not be attached — use the link below.";

  return `
  <div style="background:#F1F5F9;padding:28px 16px;font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;">
      <div style="background:#001250;padding:24px 28px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.12em;color:#5EEAD4;font-weight:700;text-transform:uppercase;">New Job Application</p>
        <h1 style="margin:0;font-size:20px;color:#ffffff;font-weight:800;">${esc(jobTitle || "Career Application")}</h1>
      </div>
      <div style="padding:24px 28px;">
        <table style="width:100%;border-collapse:collapse;">${rowsHtml(rows)}</table>

        <div style="margin:24px 0 0;padding:16px 18px;background:#F0FDFA;border:1px solid #99F6E4;border-radius:10px;">
          <p style="margin:0 0 10px;font-size:13px;color:#0F766E;font-weight:700;">Resume</p>
          <p style="margin:0 0 12px;font-size:13px;color:#374151;line-height:1.6;">${resumeNote}</p>
          ${
            resumeUrl
              ? `<a href="${esc(resumeUrl)}" style="display:inline-block;padding:9px 18px;background:#0D9488;color:#ffffff;text-decoration:none;border-radius:6px;font-size:13px;font-weight:700;">Open stored copy</a>`
              : ""
          }
        </div>

        <p style="margin:24px 0 0;font-size:12px;color:#9CA3AF;line-height:1.7;">
          Application ID: ${esc(application._id)}<br/>
          Received ${esc(new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))} IST<br/>
          Reply to this email to write directly to the candidate.
        </p>
      </div>
    </div>
  </div>`;
}

function applicantHtml({ name, jobTitle }) {
  return `
  <div style="background:#F1F5F9;padding:28px 16px;font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;">
      <div style="background:#001250;padding:24px 28px;">
        <h1 style="margin:0;font-size:19px;color:#ffffff;font-weight:800;">Application received, ${esc(
          name || "there"
        )}</h1>
      </div>
      <div style="padding:24px 28px;font-size:14px;color:#374151;line-height:1.75;">
        <p style="margin:0 0 14px;">Thanks for applying for <strong>${esc(
          jobTitle || "a role"
        )}</strong> at TransIndia Insurance Brokers. We have your resume and our team is reviewing it.</p>
        <p style="margin:0 0 14px;">If your profile matches what the role needs, we will reach out to arrange a conversation. Either way, you will hear from us.</p>
        <p style="margin:24px 0 0;font-size:13px;color:#6B7280;">— Talent Team, TransIndia Insurance Brokers</p>
      </div>
    </div>
  </div>`;
}

function plainText({ application, jobTitle, resumeUrl }) {
  return [
    `New application for: ${jobTitle || "-"}`,
    "",
    `Name:    ${application.name || "-"}`,
    `Email:   ${application.email || "-"}`,
    `Phone:   ${formatPhone(application.phone) || "-"}`,
    application.message ? `\nMessage:\n${application.message}` : "",
    "",
    resumeUrl ? `Resume: ${resumeUrl}` : "",
    "",
    `Application ID: ${application._id}`,
  ]
    .filter((l) => l !== "")
    .join("\n");
}

// ── Public API ───────────────────────────────────────────────────────────────
/**
 * Emails a job application to hr@. Never throws — the application is already
 * saved, so a mail failure must not surface as a submission error.
 *
 * @param {Object} opts
 * @param {Object} opts.application  saved JobApplication document
 * @param {String} opts.jobTitle     the role title
 * @param {String} opts.resumeUrl    Cloudinary secure_url
 * @param {Buffer} [opts.resumeBuffer]    raw file bytes (req.file.buffer)
 * @param {String} [opts.resumeOriginalName]
 * @param {String} [opts.resumeMimeType]
 */
async function sendJobApplicationMail({
  application,
  jobTitle,
  resumeUrl,
  resumeBuffer,
  resumeOriginalName,
  resumeMimeType,
}) {
  const t = getCareerTransporter();
  if (!t) {
    console.warn("⚠️  [careerMailer] Skipping application email — SMTP not configured.");
    return { ok: false, reason: "not-configured" };
  }

  const applicantEmail = (application.email || "").trim();

  // Attach the resume when we still hold the bytes and it is a sane size.
  const attachments = [];
  const canAttach =
    ATTACH_RESUME &&
    Buffer.isBuffer(resumeBuffer) &&
    resumeBuffer.length > 0 &&
    resumeBuffer.length <= MAX_ATTACHMENT_BYTES;

  if (canAttach) {
    attachments.push({
      filename: resumeFilename(application.name, resumeOriginalName),
      content: resumeBuffer,
      contentType: resumeMimeType || "application/pdf",
    });
  } else if (ATTACH_RESUME && Buffer.isBuffer(resumeBuffer)) {
    console.warn(
      `⚠️  [careerMailer] Resume too large to attach (${prettySize(resumeBuffer.length)}), sending link only.`
    );
  }

  // 1️⃣ Notification to hr@
  try {
    await t.sendMail({
      from: `"${FROM_NAME}" <${SMTP_USER}>`, // must equal the authenticated mailbox on O365
      to: MAIL_TO,                           // ✅ hr@transindia.com
      cc: MAIL_CC || undefined,
      replyTo: EMAIL_RE.test(applicantEmail) ? applicantEmail : undefined,
      subject: `New application — ${jobTitle || "Career"} — ${application.name || "Applicant"}`,
      text: plainText({ application, jobTitle, resumeUrl }),
      html: internalHtml({
        application,
        jobTitle,
        resumeUrl,
        attached: attachments.length > 0,
        fileSize: Buffer.isBuffer(resumeBuffer) ? resumeBuffer.length : 0,
      }),
      attachments,
    });
    console.log(`📧 [careerMailer] Application ${application._id} emailed to ${MAIL_TO}`);
  } catch (err) {
    console.error("❌ [careerMailer] HR notification failed:", err.message);
    return { ok: false, reason: err.message };
  }

  // 2️⃣ Confirmation to the applicant (best effort)
  if (SEND_APPLICANT_COPY && EMAIL_RE.test(applicantEmail)) {
    try {
      await t.sendMail({
        from: `"${FROM_NAME}" <${SMTP_USER}>`,
        to: applicantEmail,
        subject: `We received your application — ${jobTitle || "TransIndia"}`,
        text: `Hi ${application.name || "there"},\n\nThanks for applying for ${
          jobTitle || "a role"
        } at TransIndia Insurance Brokers. We have your resume and our team is reviewing it. We will be in touch.\n\n— Talent Team, TransIndia Insurance Brokers`,
        html: applicantHtml({ name: application.name, jobTitle }),
      });
    } catch (err) {
      console.error("⚠️  [careerMailer] Applicant confirmation failed:", err.message);
    }
  }

  return { ok: true };
}

module.exports = {
  sendJobApplicationMail,
  verifyCareerMailer,
  getCareerTransporter,
};