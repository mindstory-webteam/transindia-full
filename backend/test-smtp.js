// Run with: node test-smtp.js
// Put this file in your backend project root (next to package.json / .env)
// so dotenv picks up the same .env your server uses.

require("dotenv").config();
const nodemailer = require("nodemailer");

async function test(label, host, port, user, pass, to) {
  console.log(`\n──── ${label} ────`);
  console.log("host:", JSON.stringify(host));
  console.log("port:", JSON.stringify(port));
  console.log("user:", JSON.stringify(user)); // JSON.stringify exposes hidden whitespace / trailing comments
  console.log("pass length:", pass ? pass.length : 0, "(should be 16 for an M365 app password)");

  if (!user || !pass) {
    console.error(`❌ ${label}: user or pass is empty — env var isn't loading. Check dotenv.config() placement.`);
    return;
  }

  const transporter = nodemailer.createTransport({
  host, port: Number(port), secure: false, requireTLS: true,
  auth: { user, pass },
  tls: { minVersion: "TLSv1.2" },
  debug: true,   // ← add this
  logger: true,  // ← and this
});

  try {
    await transporter.verify();
    console.log(`✅ ${label}: SMTP login verified`);
  } catch (err) {
    console.error(`❌ ${label}: verify() failed —`, err.message);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"SMTP Test" <${user}>`,
      to,
      subject: `Test email — ${label}`,
      text: `If you're reading this, ${label} SMTP is working correctly.`,
    });
    console.log(`✅ ${label}: sendMail OK — messageId ${info.messageId}`);
  } catch (err) {
    console.error(`❌ ${label}: sendMail failed —`, err.message);
  }
}

(async () => {
  await test(
    "LEAD MAILER (hr@)",
    process.env.SMTP_HOST,
    process.env.SMTP_PORT,
    process.env.SMTP_USER,
    process.env.SMTP_PASS,
    process.env.SMTP_USER // send the test to itself
  );

  await test(
    "CAREER MAILER (care@)",
    process.env.CAREER_SMTP_HOST,
    process.env.CAREER_SMTP_PORT,
    process.env.CAREER_SMTP_USER,
    process.env.CAREER_SMTP_PASS,
    process.env.CAREER_SMTP_USER
  );
})();