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

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve legacy local uploads (kept for backward compat with old records)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",     require("./src/routes/auth"));
app.use("/api/services", require("./src/routes/services"));
app.use("/api/leads",    require("./src/routes/leads"));
app.use("/api/faqs",     require("./src/routes/faqs"));
app.use("/api/contact",  require("./src/routes/contact"));
app.use("/api/bmileads", require("./src/routes/bmiLeads"));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "TransIndia API running ✅" }));

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  // Multer errors (file too large, wrong type, etc.)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ success: false, message: "File too large. Max 5 MB." });
  }
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));