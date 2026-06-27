// src/controllers/eventController.js
const Event = require("../models/Event");
const cloudinary = require("../config/cloudinary");

// multer-storage-cloudinary puts the secure_url on file.path and the
// public_id on file.filename. Normalise both here.
const mapFiles = (files = []) =>
  files.map((f) => ({
    url: f.path || f.secure_url,
    public_id: f.filename || f.public_id,
  }));

const destroyMany = (publicIds = []) =>
  Promise.all(
    publicIds
      .filter(Boolean)
      .map((id) => cloudinary.uploader.destroy(id).catch(() => null))
  );

// ── GET /api/events ────────────────────────────────────────────────
// Optional query: ?category=Webinar  ?scope=upcoming|past
exports.getEvents = async (req, res, next) => {
  try {
    const { category, scope } = req.query;
    const query = {};

    if (category && category !== "all") query.category = category;

    if (scope === "upcoming" || scope === "past") {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      query.date = scope === "upcoming" ? { $gte: startOfToday } : { $lt: startOfToday };
    }

    const events = await Event.find(query).sort({ date: 1 }); // soonest first
    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/events/:id ────────────────────────────────────────────
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/events ───────────────────────────────────────────────
// multipart/form-data: text fields + image files under the "images" field.
exports.createEvent = async (req, res, next) => {
  try {
    const uploaded = mapFiles(req.files);
    const images = uploaded.map((u) => u.url);
    const imagePublicIds = uploaded.map((u) => u.public_id);

    const event = await Event.create({
      title:       req.body.title,
      date:        req.body.date,
      endDate:     req.body.endDate || undefined,
      time:        req.body.time,
      location:    req.body.location,
      category:    req.body.category,
      description: req.body.description,
      href:        req.body.href,
      imageUrl:    images[0], // cover defaults to the first uploaded image
      images,
      imagePublicIds,
    });

    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/events/:id ────────────────────────────────────────────
// Updates text fields, can append OR replace gallery images, and can
// remove specific images.
//   replaceImages=true            → delete all existing, use the new uploads
//   removeImageIds=id1,id2        → remove these Cloudinary public_ids
//   (new "images" files)          → appended unless replaceImages=true
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // 1) text fields — only overwrite the ones actually sent
    ["title", "date", "endDate", "time", "location", "category", "description", "href"].forEach(
      (f) => {
        if (req.body[f] !== undefined) event[f] = req.body[f];
      }
    );

    // 2) remove selected images
    let removeIds = req.body.removeImageIds;
    if (removeIds) {
      if (typeof removeIds === "string") {
        removeIds = removeIds.split(",").map((s) => s.trim()).filter(Boolean);
      }
      await destroyMany(removeIds);

      const removeSet = new Set(removeIds);
      const keepUrls = [];
      const keepIds = [];
      (event.imagePublicIds || []).forEach((pid, i) => {
        if (!removeSet.has(pid)) {
          keepIds.push(pid);
          keepUrls.push(event.images[i]);
        }
      });
      event.images = keepUrls;
      event.imagePublicIds = keepIds;
    }

    // 3) new uploads — append or replace
    const uploaded = mapFiles(req.files);
    if (uploaded.length) {
      const replace = String(req.body.replaceImages) === "true";
      if (replace) {
        await destroyMany(event.imagePublicIds);
        event.images = uploaded.map((u) => u.url);
        event.imagePublicIds = uploaded.map((u) => u.public_id);
      } else {
        event.images.push(...uploaded.map((u) => u.url));
        event.imagePublicIds.push(...uploaded.map((u) => u.public_id));
      }
    }

    // 4) keep the cover image valid
    if (!event.imageUrl || !event.images.includes(event.imageUrl)) {
      event.imageUrl = event.images[0];
    }

    await event.save();
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/events/:id ─────────────────────────────────────────
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    await destroyMany(event.imagePublicIds); // clean up Cloudinary
    await event.deleteOne();

    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    next(err);
  }
};