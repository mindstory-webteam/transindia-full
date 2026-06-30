const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// ── CRITICAL: Load .env FIRST before any other require() that might
//    read process.env (e.g. cloudinary config, db config) ─────────────────
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors    = require("cors");
const path    = require("path");
const connectDB = require("./src/config/db");

// Connect to database (after dotenv.config so MONGO_URI is available)
connectDB();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// IMPORTANT: origin "*" together with credentials:true is INVALID per the CORS
// spec — browsers drop the Access-Control-Allow-Origin header and the preflight
// fails. With credentials we must reflect an explicit, allow-listed origin.
const STATIC_ALLOWED_ORIGINS = [
  "http://localhost:3000",                  // public site (Next dev)
  "http://localhost:5173",                  // admin (Vite dev)
  "https://transindia-full.vercel.app",     // public site (prod)
  // Add any other fixed production domains here.
];

// Vercel gives every preview deploy a different sub-domain
// (e.g. transindia-full-n87v.vercel.app), so allow them by pattern.
const VERCEL_PREVIEW = /^https:\/\/transindia-full[a-z0-9-]*\.vercel\.app$/;

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser tools (curl, Postman, server-to-server) that send no Origin
    if (!origin) return callback(null, true);

    const allowed =
      STATIC_ALLOWED_ORIGINS.includes(origin) || VERCEL_PREVIEW.test(origin);

    if (allowed) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// cors() automatically answers preflight OPTIONS requests, so no separate
// app.options("*") route is needed (and "*" is invalid in Express 5).
app.use(cors(corsOptions));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve legacy local uploads (kept for backward compat with old records)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",         require("./src/routes/auth"));
app.use("/api/services",     require("./src/routes/services"));
app.use("/api/leads",        require("./src/routes/leads"));
app.use("/api/faqs",         require("./src/routes/faqs"));
app.use("/api/contact",      require("./src/routes/contact"));
app.use("/api/bmileads",     require("./src/routes/bmiLeads"));
app.use("/api/claimleads",   require("./src/routes/claimLeadsRoute"));
app.use("/api/careers",      require("./src/routes/careers"));
app.use("/api/serviceleads", require("./src/routes/servicesFormRoutes"));

app.use("/api/quoteleads", require("./src/routes/quoteLeads"));
app.use("/api/events", require("./src/routes/events"));
app.use("/api/chatbotleads", require("./src/routes/chatbotLeads"));


// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "TransIndia API running ✅" }));

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  // Log the full error (stack + name) so Render logs show the real cause,
  // not just a stripped-down .message
  console.error("Server error:", err);

  // CORS rejection → respond clearly instead of a generic 500
  if (err && typeof err.message === "string" && err.message.startsWith("CORS blocked")) {
    return res.status(403).json({ success: false, message: err.message });
  }

  // Multer file-size limit
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ success: false, message: "File too large. Max 10 MB." });
  }

  // Mongoose validation errors (e.g. bad enum value for insuranceType/claimType)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  // Mongoose bad ObjectId (e.g. malformed :id param)
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: `Invalid ${err.path}: ${err.value}` });
  }

  // Mongo duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    return res.status(409).json({ success: false, message: `Duplicate value for ${field}` });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));