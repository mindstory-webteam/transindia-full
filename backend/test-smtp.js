// Run with: node test-smtp.js
// Place next to package.json / .env so dotenv loads the same vars your server uses.

require("dotenv").config();
const nodemailer = require("nodemailer");

const VERBOSE = process.argv.includes("--verbose");

function inspectCred(label, value) {
  if (!value) return `❌ ${label} is EMPTY`;
  const notes = [];
  if (value !== value.trim()) notes.push("has leading/trailing whitespace");
  if (/^["'].*["']$/.test(value)) notes.push("is wrapped in quotes — remove them from .env");
  if (/\s/.test(value)) notes.push("contains a space");
  return `${label}: ${JSON.stringify(value.length > 40 ? value.slice(0, 40) + "…" : value)}` +
    (notes.length ? `  ⚠️  ${notes.join("; ")}` : "");
}

async function test({ label, host, port, user, pass, deliverTo }) {
  console.log(`\n════ ${label} ════`);
  console.log("host:", JSON.stringify(host), " port:", JSON.stringify(port));
  console.log(inspectCred("user", user));
  console.log(`pass length: ${pass ? pass.length : 0} (16 = M365 app password; a normal mailbox password is also fine if SMTP AUTH is on)`);
  console.log("will deliver to:", deliverTo.join(", "));

  if (!user || !pass) {
    console.error(`❌ ${label}: user or pass empty — the env var isn't loading. Check .env location and dotenv.config() placement.`);
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: false,
    requireTLS: true,
    auth: { user, pass },
    tls: { minVersion: "TLSv1.2" },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    debug: VERBOSE,
    logger: VERBOSE,
  });

  const fail = (stage, err) => {
    console.error(`❌ ${label}: ${stage} failed`);
    console.error("   message :", err.message);
    if (err.code) console.error("   code    :", err.code);
    if (err.responseCode) console.error("   smtp    :", err.responseCode);
    if (err.response) console.error("   response:", err.response);
  };

  try {
    await transporter.verify();
    console.log(`✅ ${label}: SMTP login verified`);
  } catch (err) {
    fail("verify()", err);
    transporter.close();
    return false;
  }

  let ok = true;
  for (const to of deliverTo) {
    try {
      const info = await transporter.sendMail({
        from: `"SMTP Test" <${user}>`, // must equal the authenticated mailbox on O365
        to,
        subject: `SMTP test — ${label} — ${new Date().toISOString()}`,
        text: `If you can read this, ${label} can authenticate as ${user} and deliver to ${to}.`,
      });
      console.log(`✅ ${label}: delivered to ${to} — ${info.messageId}`);
      if (info.rejected && info.rejected.length) {
        console.warn(`   ⚠️  rejected recipients:`, info.rejected);
      }
    } catch (err) {
      fail(`sendMail → ${to}`, err);
      ok = false;
    }
  }

  transporter.close();
  return ok;
}

(async () => {
  // SMTP_* powers utils/serviceLeadMailer.js → website enquiries → care@
  const leadOk = await test({
    label: "SERVICE LEAD MAILER (delivers to care@)",
    host: process.env.SMTP_HOST || "smtp.office365.com",
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    deliverTo: [
      process.env.SMTP_USER,                                  // proves submission
      process.env.LEAD_MAIL_TO || "care@transindia.com",      // proves the real route
    ].filter(Boolean),
  });

  // CAREER_SMTP_* powers utils/careerMailer.js → job applications → hr@
  const careerOk = await test({
    label: "CAREER MAILER (delivers to hr@)",
    host: process.env.CAREER_SMTP_HOST || "smtp.office365.com",
    port: process.env.CAREER_SMTP_PORT || 587,
    user: process.env.CAREER_SMTP_USER,
    pass: process.env.CAREER_SMTP_PASS,
    deliverTo: [
      process.env.CAREER_SMTP_USER,
      process.env.CAREER_MAIL_TO || "hr@transindia.com",
    ].filter(Boolean),
  });

  console.log("\n════ SUMMARY ════");
  console.log("service leads:", leadOk ? "✅ working" : "❌ broken");
  console.log("careers      :", careerOk ? "✅ working" : "❌ broken");
  process.exit(leadOk && careerOk ? 0 : 1);
})();