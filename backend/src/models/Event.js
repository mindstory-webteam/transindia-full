// src/models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title:       { type: String, required: [true, "Title is required"], trim: true },
    date:        { type: Date,   required: [true, "Event date is required"] },
    endDate:     { type: Date },                 // optional, for multi-day events
    time:        { type: String, trim: true },   // e.g. "4:00 PM – 5:30 PM"
    location:    { type: String, trim: true },   // e.g. "Online Webinar" or a city
    category:    { type: String, trim: true },   // e.g. "Webinar", "Workshop"
    description: { type: String, trim: true },

    imageUrl:    { type: String },               // cover image (defaults to images[0])
    images:      [{ type: String }],             // gallery image URLs (Cloudinary secure_url)
    imagePublicIds: [{ type: String }],          // Cloudinary public_ids (for deletion)

    href:        { type: String, trim: true },   // optional external/registration link
  },
  { timestamps: true }
);

// Expose `id`, drop `_id` / `__v` so the API response matches the frontend EventItem.
eventSchema.set("toJSON", {
  virtuals: true,        // mongoose adds an `id` virtual (string of _id)
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model("Event", eventSchema);