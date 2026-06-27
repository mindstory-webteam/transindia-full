"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";
import Preloader from "@/components/Preloader";
import EventBanner from "@/components/EventBanner";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface EventItem {
  id: string;
  title: string;
  date: string;          // ISO date string, e.g. "2026-07-15"
  endDate?: string;       // ISO date string, for multi-day events
  time?: string;          // e.g. "4:00 PM – 5:30 PM"
  location?: string;      // e.g. "Online Webinar" or a venue/city
  category?: string;      // e.g. "Webinar", "Workshop", "Conference"
  imageUrl: string;        // primary / fallback image
  images?: string[];       // gallery images for the carousel + lightbox
  description?: string;
  href?: string;           // (kept for data compatibility — no longer rendered)
}

interface EventsPageProps {
  events?: EventItem[];    // if passed, the page uses these and skips fetching
  bannerImage?: string;    // right-side hero image; swap for your own
}

// ─────────────────────────────────────────────────────────────
// API base — EDIT THIS (or set NEXT_PUBLIC_API_URL in your env).
// It must point at your backend ORIGIN, with no trailing slash:
//
// OPTION 1 - For production (set in .env.production):
//   NEXT_PUBLIC_API_URL=https://transindia-backend.onrender.com
//
// OPTION 2 - For local development (set in .env.local):
//   NEXT_PUBLIC_API_URL=http://localhost:5000
//
// OPTION 3 - Using Next.js API route (no external backend needed):
//   NEXT_PUBLIC_API_URL=http://localhost:3000
//   (then create app/api/events/route.ts to handle /api/events)
// ─────────────────────────────────────────────────────────────
const RAW_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Normalise the base so the endpoint is always correct no matter how the env
// is written: strip a trailing slash, and strip a trailing "/api" if present
// (we add "/api/events" ourselves — this prevents a doubled "/api/api/events").
const API_BASE = RAW_API_BASE.replace(/\/+$/, "").replace(/\/api$/, "");

const EVENTS_ENDPOINT = `${API_BASE}/api/events`;

const FALLBACK_IMAGE = "https://picsum.photos/seed/transindia-event-fallback/800/600";

// Brand palette (pulled from the TransIndia site)
const ACCENT = "#EC4F34"; // orange
const TEAL = "#2DB9C4";   // teal / cyan
const NAVY = "#0A1A3F";   // deep navy banner base

// Default banner image — swap for your own events visual.
const DEFAULT_BANNER_IMAGE =
  "https://transindia-full.vercel.app/images/about/about-us-hero-lg.png";

// ─────────────────────────────────────────────────────────────
// Sample data — shown ONLY while loading and as a fallback if the
// API can't be reached. Successful responses (even empty) replace it.
// ─────────────────────────────────────────────────────────────
const SAMPLE_EVENTS: EventItem[] = [
  {
    id: "1",
    title: "Understanding Health Insurance: A Beginner's Guide",
    date: "2026-07-15",
    time: "4:00 PM – 5:30 PM",
    location: "Online Webinar",
    category: "Webinar",
    imageUrl: "https://picsum.photos/seed/transindia-health/800/600",
    images: [
      "https://picsum.photos/seed/transindia-health-1/1000/800",
      "https://picsum.photos/seed/transindia-health-2/1000/800",
      "https://picsum.photos/seed/transindia-health-3/1000/800",
    ],
    description:
      "A free live session covering how to choose the right health cover, what riders actually mean, and common claim mistakes to avoid.",
  },
  {
    id: "2",
    title: "Motor Insurance Claims Workshop",
    date: "2026-08-02",
    time: "11:00 AM – 1:00 PM",
    location: "Kochi, Kerala",
    category: "Workshop",
    imageUrl: "https://picsum.photos/seed/transindia-motor/800/600",
    images: [
      "https://picsum.photos/seed/transindia-motor-1/1000/800",
      "https://picsum.photos/seed/transindia-motor-2/1000/800",
      "https://picsum.photos/seed/transindia-motor-3/1000/800",
    ],
    description:
      "A hands-on session on filing a smooth motor claim — documentation, surveyor visits, and timelines explained step by step.",
  },
  {
    id: "3",
    title: "TransIndia Partner Summit 2026",
    date: "2026-09-18",
    endDate: "2026-09-19",
    location: "Bengaluru, Karnataka",
    category: "Conference",
    imageUrl: "https://picsum.photos/seed/transindia-summit/800/600",
    images: [
      "https://picsum.photos/seed/transindia-summit-1/1000/800",
      "https://picsum.photos/seed/transindia-summit-2/1000/800",
      "https://picsum.photos/seed/transindia-summit-3/1000/800",
      "https://picsum.photos/seed/transindia-summit-4/1000/800",
    ],
    description:
      "Our annual gathering for advisors and partners — product updates, panel discussions, and networking over two days.",
  },
  {
    id: "4",
    title: "Retirement Planning for Young Professionals",
    date: "2026-05-10",
    time: "6:00 PM – 7:00 PM",
    location: "Online Webinar",
    category: "Webinar",
    imageUrl: "https://picsum.photos/seed/transindia-retire/800/600",
    images: [
      "https://picsum.photos/seed/transindia-retire-1/1000/800",
      "https://picsum.photos/seed/transindia-retire-2/1000/800",
    ],
    description:
      "Why starting early matters more than the amount — a practical look at term plans, ULIPs, and simple compounding math.",
  },
  {
    id: "5",
    title: "Community Health Check Camp",
    date: "2026-06-05",
    location: "Ernakulam District",
    category: "Community",
    imageUrl: "https://picsum.photos/seed/transindia-camp/800/600",
    images: [
      "https://picsum.photos/seed/transindia-camp-1/1000/800",
      "https://picsum.photos/seed/transindia-camp-2/1000/800",
      "https://picsum.photos/seed/transindia-camp-3/1000/800",
    ],
    description:
      "Free basic health screenings for policyholders and their families, in partnership with local clinics.",
  },
  {
    id: "6",
    title: "Travel Insurance Q&A: Monsoon Edition",
    date: "2026-07-28",
    time: "5:00 PM – 5:45 PM",
    location: "Online Webinar",
    category: "Webinar",
    imageUrl: "https://picsum.photos/seed/transindia-travel/800/600",
    images: [
      "https://picsum.photos/seed/transindia-travel-1/1000/800",
      "https://picsum.photos/seed/transindia-travel-2/1000/800",
      "https://picsum.photos/seed/transindia-travel-3/1000/800",
    ],
    description:
      "Quick answers on trip delays, lost baggage, and medical cover before the monsoon travel season picks up.",
  },
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function formatEventDate(iso: string, endIso?: string): string {
  const start = new Date(iso);
  if (isNaN(start.getTime())) return iso;

  const startStr = start.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  if (!endIso) return startStr;

  const end = new Date(endIso);
  if (isNaN(end.getTime())) return startStr;

  const endStr = end.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}

function isUpcoming(iso: string): boolean {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

function getImages(event: EventItem): string[] {
  if (event.images && event.images.length) return event.images;
  return [event.imageUrl || FALLBACK_IMAGE];
}

// Map a raw API record into a safe EventItem (handles id/_id, missing
// imageUrl, empty image arrays, etc.) so the UI never breaks on bad data.
function normalizeEvent(raw: any, idx: number): EventItem {
  const images: string[] = Array.isArray(raw?.images) ? raw.images.filter(Boolean) : [];
  const cover = raw?.imageUrl || images[0] || FALLBACK_IMAGE;
  return {
    id: String(raw?.id ?? raw?._id ?? `event-${idx}`),
    title: raw?.title ?? "Untitled event",
    date: raw?.date ?? "",
    endDate: raw?.endDate || undefined,
    time: raw?.time || undefined,
    location: raw?.location || undefined,
    category: raw?.category || undefined,
    imageUrl: cover,
    images: images.length ? images : [cover],
    description: raw?.description || undefined,
    href: raw?.href || undefined,
  };
}

const STYLES = `
  .ev-chip { transition: background .15s ease, color .15s ease, border-color .15s ease; }
  .ev-chip:focus-visible {
    outline: 2px solid ${ACCENT};
    outline-offset: 3px;
  }

  /* ── Banner ─────────────────────────────────────────────── */
  .ev-banner {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(900px 520px at 78% 28%, rgba(45,185,196,0.20), transparent 60%),
      radial-gradient(720px 600px at 18% 85%, rgba(236,79,52,0.12), transparent 55%),
      linear-gradient(135deg, #0B1C42 0%, #081530 58%, #0A1A3F 100%);
  }
  .ev-banner-grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 48px;
    align-items: center;
  }
  .ev-banner-img-wrap {
    position: relative;
    min-height: 380px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ev-banner-glow {
    position: absolute;
    width: 70%;
    height: 70%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(45,185,196,0.35), rgba(45,185,196,0) 70%);
    filter: blur(10px);
  }
  .ev-float {
    position: absolute;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.16);
    backdrop-filter: blur(4px);
    animation: evFloat 5s ease-in-out infinite;
  }
  @keyframes evFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  .ev-btn { transition: transform .15s ease, box-shadow .15s ease, background .15s ease, color .15s ease; }
  .ev-btn:hover { transform: translateY(-2px); }
  .ev-btn-primary:hover { box-shadow: 0 12px 24px rgba(236,79,52,0.35); }
  .ev-btn-ghost:hover { background: rgba(255,255,255,0.10); }
  .ev-crumb-link { transition: color .15s ease; }
  .ev-crumb-link:hover { color: #fff; }

  /* ── Gallery card ───────────────────────────────────────── */
  .ev-gcard {
    position: relative;
    height: 380px;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    background: #0b1220;
    box-shadow: 0 1px 2px rgba(15,23,42,0.06);
    transition: transform .2s ease, box-shadow .2s ease;
  }
  .ev-gcard:hover { transform: translateY(-4px); box-shadow: 0 18px 38px rgba(15,23,42,0.18); }
  .ev-gcard:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 3px; }

  .ev-gcard-media { position: absolute; inset: 0; transition: transform .5s ease; }
  .ev-gcard:hover .ev-gcard-media { transform: scale(1.06); }
  .ev-gcard-img {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; display: block;
    transition: opacity .45s ease;
  }
  .ev-gcard-grad {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(6,10,20,0.92) 0%, rgba(6,10,20,0.55) 30%, rgba(6,10,20,0.05) 60%, transparent 100%);
    pointer-events: none;
  }

  /* arrows */
  .ev-arrow {
    position: absolute; top: 42%; transform: translateY(-50%);
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(15,23,42,0.45);
    border: 1px solid rgba(255,255,255,0.25);
    color: #fff; cursor: pointer; opacity: 0;
    transition: opacity .2s ease, background .15s ease;
    backdrop-filter: blur(3px);
  }
  .ev-arrow:hover { background: rgba(15,23,42,0.75); }
  .ev-arrow-l { left: 12px; }
  .ev-arrow-r { right: 12px; }
  .ev-gcard:hover .ev-arrow { opacity: 1; }

  /* dots */
  .ev-dots { position: absolute; top: 14px; left: 0; right: 0; display: flex; gap: 6px; justify-content: center; z-index: 2; }
  .ev-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.45); cursor: pointer; transition: background .15s ease, width .15s ease; }
  .ev-dot-active { background: #fff; width: 18px; border-radius: 999px; }

  /* zoom hint */
  .ev-zoom {
    position: absolute; top: 12px; right: 12px;
    width: 34px; height: 34px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(15,23,42,0.5); border: 1px solid rgba(255,255,255,0.22);
    opacity: 0; transition: opacity .2s ease; pointer-events: none;
  }
  .ev-gcard:hover .ev-zoom { opacity: 1; }

  /* overlay text */
  .ev-gcard-body { position: absolute; left: 0; right: 0; bottom: 0; padding: 20px; z-index: 2; }
  .ev-gcard-date { color: #FFC4B4; font-size: 12px; font-weight: 700; letter-spacing: .03em; margin: 0 0 6px; }
  .ev-gcard-title { color: #fff; font-size: 18px; font-weight: 700; line-height: 1.3; margin: 0; }
  .ev-gcard-desc {
    color: rgba(255,255,255,0.82); font-size: 13.5px; line-height: 1.55;
    margin: 8px 0 0; max-height: 0; opacity: 0; transform: translateY(8px); overflow: hidden;
    transition: max-height .35s ease, opacity .3s ease, transform .3s ease;
  }
  .ev-gcard:hover .ev-gcard-desc { max-height: 120px; opacity: 1; transform: translateY(0); }

  .ev-gchip {
    position: absolute; top: 12px; left: 12px; z-index: 2;
    background: rgba(17,24,39,0.72); color: #fff; font-size: 11.5px; font-weight: 600;
    padding: 5px 10px; border-radius: 999px; letter-spacing: .02em;
  }
  .ev-gpast {
    position: absolute; bottom: 12px; right: 12px; z-index: 2;
    background: rgba(255,255,255,0.92); color: #6B7280; font-size: 11px; font-weight: 600;
    padding: 5px 10px; border-radius: 999px;
  }

  /* ── Lightbox ───────────────────────────────────────────── */
  .ev-lb {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(6,10,20,0.94);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 24px; animation: evFade .2s ease;
  }
  @keyframes evFade { from { opacity: 0; } to { opacity: 1; } }
  .ev-lb-close {
    position: absolute; top: 18px; right: 20px;
    width: 44px; height: 44px; border-radius: 50%;
    background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.2);
    color: #fff; font-size: 22px; line-height: 1; cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: background .15s ease;
  }
  .ev-lb-close:hover { background: rgba(255,255,255,0.2); }
  .ev-lb-stage { position: relative; display: flex; align-items: center; justify-content: center; max-width: 1100px; width: 100%; }
  .ev-lb-img { max-width: 100%; max-height: 74vh; border-radius: 12px; object-fit: contain; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
  .ev-lb-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 48px; height: 48px; border-radius: 50%;
    background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.22);
    color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background .15s ease;
  }
  .ev-lb-nav:hover { background: rgba(255,255,255,0.22); }
  .ev-lb-prev { left: -8px; }
  .ev-lb-next { right: -8px; }
  .ev-lb-caption { display: flex; align-items: center; gap: 14px; margin-top: 18px; color: #fff; max-width: 1100px; width: 100%; justify-content: center; flex-wrap: wrap; text-align: center; }
  .ev-lb-title { font-size: 15px; font-weight: 600; margin: 0; }
  .ev-lb-count { font-size: 13px; color: rgba(255,255,255,0.6); }
  .ev-lb-thumbs { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; justify-content: center; max-width: 700px; }
  .ev-lb-thumb { width: 64px; height: 46px; border-radius: 7px; object-fit: cover; cursor: pointer; opacity: .5; border: 2px solid transparent; transition: opacity .15s ease, border-color .15s ease; }
  .ev-lb-thumb-active { opacity: 1; border-color: ${TEAL}; }

  /* loading skeletons */
  .ev-skel { height: 380px; border-radius: 16px; background: linear-gradient(100deg, #eef1f5 30%, #f7f9fb 50%, #eef1f5 70%); background-size: 200% 100%; animation: evShimmer 1.4s ease infinite; }
  @keyframes evShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  @media (max-width: 880px) {
    .ev-banner-grid { grid-template-columns: 1fr; gap: 30px; text-align: center; }
    .ev-banner-actions { justify-content: center; }
    .ev-banner-crumb { justify-content: center; }
    .ev-banner-img-wrap { order: -1; min-height: 300px; }
    .ev-lb-prev { left: 4px; }
    .ev-lb-next { right: 4px; }
  }

  /* touch devices: no hover, so reveal controls + text */
  @media (hover: none) {
    .ev-arrow { opacity: .9; }
    .ev-gcard-desc { max-height: 120px; opacity: 1; transform: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ev-chip, .ev-btn, .ev-float, .ev-gcard, .ev-gcard-media, .ev-gcard-img,
    .ev-gcard-desc, .ev-arrow, .ev-zoom, .ev-lb, .ev-skel { transition: none !important; animation: none !important; }
  }
`;

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function EventsPage({
  events: eventsProp,
  bannerImage = DEFAULT_BANNER_IMAGE,
}: EventsPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [events, setEvents] = useState<EventItem[]>(eventsProp ?? SAMPLE_EVENTS);
  const [loading, setLoading] = useState<boolean>(!eventsProp);
  const [errored, setErrored] = useState<boolean>(false);
  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);

  // Fetch live events from the API (skipped if a parent passes `events`).
  useEffect(() => {
    if (eventsProp) return;

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErrored(false);

        const res = await fetch(EVENTS_ENDPOINT, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const list = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : null;

        if (list) {
          setEvents(list.map(normalizeEvent));
        } else {
          throw new Error("Unexpected response shape");
        }
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          console.error("Failed to load events from", EVENTS_ENDPOINT, err);
          setErrored(true); // keep SAMPLE_EVENTS so the page still looks alive
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [eventsProp]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return ["all", ...Array.from(set)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    const list =
      activeCategory === "all" ? events : events.filter((e) => e.category === activeCategory);
    // Soonest events first
    return [...list].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, activeCategory]);

  const openLightbox = (images: string[], index: number, title: string) =>
    setLightbox({ images, index, title });

  return (
    <div
      style={{
        overflowX: "hidden",
        width: "100%",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{STYLES}</style>

      <Preloader />
      <Navbar alwaysSolid={true} />

      {/* ───────────────────────── Navy Banner Hero ───────────────────────── */}
     <EventBanner/>

      {/* ───────────────────────── Events gallery section ───────────────────────── */}
      <main id="events" style={{ flex: 1, padding: "72px 20px 100px" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          {/* Section header — pill + two-tone heading */}
          <div
            style={{
              textAlign: "center",
              maxWidth: "640px",
              margin: "0 auto 40px",
              fontFamily: "'matterregular', sans-serif",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "6px 15px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#168A95",
                background: "#E7F6F8",
                marginBottom: 18,
              }}
            >
              What&apos;s On
            </span>

            <h2
              style={{
                fontSize: "clamp(1.9rem, 4vw, 2.5rem)",
                color: "#111827",
                marginBottom: "0.75rem",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              Event <span style={{ color: TEAL }}>Gallery</span>
            </h2>

            <p style={{ fontSize: "1.05rem", color: "#4B5563", lineHeight: 1.6 }}>
              Browse moments from our sessions and meetups. Tap any card to flip through the full
              gallery.
            </p>

            {errored && (
              <p style={{ marginTop: 12, fontSize: 13, color: "#B45309" }}>
                Showing sample events — couldn&apos;t reach the live events service.
              </p>
            )}
          </div>

          {/* Category filter chips */}
          {categories.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: 36,
              }}
            >
              {categories.map((cat) => {
                const active = activeCategory === cat;
                const label = cat === "all" ? "All Events" : cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    className="ev-chip"
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={active}
                    style={{
                      padding: "9px 18px",
                      borderRadius: 999,
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'matterregular', sans-serif",
                      border: `1px solid ${active ? ACCENT : "#E5E7EB"}`,
                      background: active ? "#FFF1ED" : "#fff",
                      color: active ? ACCENT : "#4B5563",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading skeletons */}
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 26,
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="ev-skel" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            /* Empty state */
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 6 }}>
                No events found
              </p>
              <p style={{ fontSize: 14, color: "#6B7280" }}>
                Check back soon — new events are added regularly.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 26,
              }}
            >
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onOpen={openLightbox} />
              ))}
            </div>
          )}
        </div>
      </main>

      <TransindiaFooter />

      {/* ───────────────────────── Lightbox popup ───────────────────────── */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          title={lightbox.title}
          onIndex={(i) => setLightbox((lb) => (lb ? { ...lb, index: i } : lb))}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Gallery card — image carousel + bottom overlay
// ─────────────────────────────────────────────────────────────
function EventCard({
  event,
  onOpen,
}: {
  event: EventItem;
  onOpen: (images: string[], index: number, title: string) => void;
}) {
  const images = getImages(event);
  const [idx, setIdx] = useState(0);
  const upcoming = isUpcoming(event.date);

  const step = (dir: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i + dir + images.length) % images.length);
  };

  return (
    <div
      className="ev-gcard"
      role="button"
      tabIndex={0}
      aria-label={`Open gallery for ${event.title}`}
      onClick={() => onOpen(images, idx, event.title)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(images, idx, event.title);
        }
      }}
      style={{ fontFamily: "'matterregular', sans-serif" }}
    >
      {/* Images (crossfade) */}
      <div className="ev-gcard-media">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${event.title} — ${i + 1}`}
            loading="lazy"
            className="ev-gcard-img"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            style={{ opacity: i === idx ? 1 : 0 }}
          />
        ))}
      </div>

      <div className="ev-gcard-grad" />

      {/* Category chip */}
      {event.category && <span className="ev-gchip">{event.category}</span>}

      {/* Zoom hint */}
      <span className="ev-zoom" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="1.8" />
          <path d="M16 16l4 4M11 8v6M8 11h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>

      {/* Carousel controls */}
      {images.length > 1 && (
        <>
          <button className="ev-arrow ev-arrow-l" aria-label="Previous image" onClick={(e) => step(-1, e)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="ev-arrow ev-arrow-r" aria-label="Next image" onClick={(e) => step(1, e)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="ev-dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`ev-dot ${i === idx ? "ev-dot-active" : ""}`}
                role="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(i);
                }}
              />
            ))}
          </div>
        </>
      )}

      {!upcoming && <span className="ev-gpast">Past event</span>}

      {/* Bottom overlay text */}
      <div className="ev-gcard-body">
        <p className="ev-gcard-date">
          {formatEventDate(event.date, event.endDate)}
          {event.time ? ` · ${event.time}` : ""}
        </p>
        <h3 className="ev-gcard-title">{event.title}</h3>
        {event.description && (
          <p className="ev-gcard-desc">
            {event.description.length > 130
              ? `${event.description.slice(0, 130)}…`
              : event.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Lightbox popup
// ─────────────────────────────────────────────────────────────
function Lightbox({
  images,
  index,
  title,
  onIndex,
  onClose,
}: {
  images: string[];
  index: number;
  title: string;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const prev = () => onIndex((index - 1 + images.length) % images.length);
  const next = () => onIndex((index + 1) % images.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndex((index + 1) % images.length);
      else if (e.key === "ArrowLeft") onIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, images.length, onIndex, onClose]);

  return (
    <div
      className="ev-lb"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
      onClick={onClose}
      style={{ fontFamily: "'matterregular', sans-serif" }}
    >
      <button className="ev-lb-close" aria-label="Close" onClick={onClose}>
        ×
      </button>

      <div className="ev-lb-stage" onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && (
          <button className="ev-lb-nav ev-lb-prev" aria-label="Previous" onClick={prev}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <img
          className="ev-lb-img"
          src={images[index]}
          alt={`${title} — ${index + 1}`}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        {images.length > 1 && (
          <button className="ev-lb-nav ev-lb-next" aria-label="Next" onClick={next}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <div className="ev-lb-caption" onClick={(e) => e.stopPropagation()}>
        <p className="ev-lb-title">{title}</p>
        <span className="ev-lb-count">
          {index + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <div className="ev-lb-thumbs" onClick={(e) => e.stopPropagation()}>
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Thumbnail ${i + 1}`}
              className={`ev-lb-thumb ${i === index ? "ev-lb-thumb-active" : ""}`}
              onClick={() => onIndex(i)}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}