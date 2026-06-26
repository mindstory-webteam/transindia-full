"use client";

import React, { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";
import Preloader from "@/components/Preloader";

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
  imageUrl: string;
  description?: string;
  href?: string;           // link to the event/registration page
}

interface EventsPageProps {
  events?: EventItem[];
}

// ─────────────────────────────────────────────────────────────
// Sample data — swap this for a real fetch when ready, e.g.:
//   const [events, setEvents] = useState<EventItem[]>([]);
//   useEffect(() => { getEvents().then(r => setEvents(r.data.data)); }, []);
// then pass `events` in as a prop: <EventsPage events={events} />
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
    description:
      "A free live session covering how to choose the right health cover, what riders actually mean, and common claim mistakes to avoid.",
    href: "#",
  },
  {
    id: "2",
    title: "Motor Insurance Claims Workshop",
    date: "2026-08-02",
    time: "11:00 AM – 1:00 PM",
    location: "Kochi, Kerala",
    category: "Workshop",
    imageUrl: "https://picsum.photos/seed/transindia-motor/800/600",
    description:
      "A hands-on session on filing a smooth motor claim — documentation, surveyor visits, and timelines explained step by step.",
    href: "#",
  },
  {
    id: "3",
    title: "TransIndia Partner Summit 2026",
    date: "2026-09-18",
    endDate: "2026-09-19",
    location: "Bengaluru, Karnataka",
    category: "Conference",
    imageUrl: "https://picsum.photos/seed/transindia-summit/800/600",
    description:
      "Our annual gathering for advisors and partners — product updates, panel discussions, and networking over two days.",
    href: "#",
  },
  {
    id: "4",
    title: "Retirement Planning for Young Professionals",
    date: "2026-05-10",
    time: "6:00 PM – 7:00 PM",
    location: "Online Webinar",
    category: "Webinar",
    imageUrl: "https://picsum.photos/seed/transindia-retire/800/600",
    description:
      "Why starting early matters more than the amount — a practical look at term plans, ULIPs, and simple compounding math.",
    href: "#",
  },
  {
    id: "5",
    title: "Community Health Check Camp",
    date: "2026-06-05",
    location: "Ernakulam District",
    category: "Community",
    imageUrl: "https://picsum.photos/seed/transindia-camp/800/600",
    description:
      "Free basic health screenings for policyholders and their families, in partnership with local clinics.",
    href: "#",
  },
  {
    id: "6",
    title: "Travel Insurance Q&A: Monsoon Edition",
    date: "2026-07-28",
    time: "5:00 PM – 5:45 PM",
    location: "Online Webinar",
    category: "Webinar",
    imageUrl: "https://picsum.photos/seed/transindia-travel/800/600",
    description:
      "Quick answers on trip delays, lost baggage, and medical cover before the monsoon travel season picks up.",
    href: "#",
  },
];

const FALLBACK_IMAGE = "https://picsum.photos/seed/transindia-event-fallback/800/600";
const ACCENT = "#EC4F34";

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

const STYLES = `
  .ev-card { transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
  .ev-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(15,23,42,0.10); border-color: #FBE0D8; }
  .ev-card:hover .ev-card-img { transform: scale(1.05); }
  .ev-card-img { transition: transform .35s ease; }
  .ev-chip { transition: background .15s ease, color .15s ease, border-color .15s ease; }
  .ev-cta { transition: gap .15s ease; }
  .ev-card:hover .ev-cta-arrow { transform: translateX(3px); }
  .ev-cta-arrow { transition: transform .15s ease; }
  .ev-card:focus-visible, .ev-chip:focus-visible {
    outline: 2px solid ${ACCENT};
    outline-offset: 3px;
  }
  @media (prefers-reduced-motion: reduce) {
    .ev-card, .ev-card-img, .ev-chip, .ev-cta-arrow { transition: none !important; }
  }
`;

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function EventsPage({ events = SAMPLE_EVENTS }: EventsPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

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

      <main style={{ flex: 1, padding: "150px 20px 100px" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              textAlign: "center",
              maxWidth: "640px",
              margin: "0 auto 44px",
              fontFamily: "'matterregular', sans-serif",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#FFF1ED",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7 2v3M17 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                  stroke={ACCENT}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1
              style={{
                fontSize: "2.25rem",
                color: "#111827",
                marginBottom: "0.75rem",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Events &amp; Webinars
            </h1>

            <p style={{ fontSize: "1.05rem", color: "#4B5563", lineHeight: 1.6 }}>
              Join our upcoming sessions, workshops, and community meetups — and catch up on the
              ones you missed.
            </p>
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

          {/* Empty state */}
          {filteredEvents.length === 0 ? (
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
                gap: 28,
              }}
            >
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>

      <TransindiaFooter />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Single event card
// ─────────────────────────────────────────────────────────────
function EventCard({ event }: { event: EventItem }) {
  const upcoming = isUpcoming(event.date);

  return (
    <a
      href={event.href || "#"}
      className="ev-card"
      style={{
        display: "block",
        borderRadius: 16,
        border: "1px solid #EEF0F3",
        backgroundColor: "#fff",
        overflow: "hidden",
        textDecoration: "none",
        fontFamily: "'matterregular', sans-serif",
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 190,
          overflow: "hidden",
          backgroundColor: "#F3F4F6",
        }}
      >
        <img
          src={event.imageUrl || FALLBACK_IMAGE}
          alt={event.title}
          loading="lazy"
          className="ev-card-img"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {event.category && (
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              backgroundColor: "rgba(17,24,39,0.78)",
              color: "#fff",
              fontSize: 11.5,
              fontWeight: 600,
              padding: "5px 10px",
              borderRadius: 999,
              letterSpacing: "0.02em",
            }}
          >
            {event.category}
          </span>
        )}

        {!upcoming && (
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "rgba(255,255,255,0.92)",
              color: "#6B7280",
              fontSize: 11,
              fontWeight: 600,
              padding: "5px 10px",
              borderRadius: 999,
            }}
          >
            Past event
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 20px" }}>
        <p
          style={{
            color: ACCENT,
            fontSize: 12.5,
            fontWeight: 700,
            marginBottom: 8,
            letterSpacing: "0.01em",
          }}
        >
          {formatEventDate(event.date, event.endDate)}
          {event.time ? ` · ${event.time}` : ""}
        </p>

        <h3
          style={{
            color: "#111827",
            fontSize: 17,
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: 8,
          }}
        >
          {event.title}
        </h3>

        {event.description && (
          <p style={{ color: "#6B7280", fontSize: 13.5, lineHeight: 1.55, marginBottom: 14 }}>
            {event.description.length > 110
              ? `${event.description.slice(0, 110)}…`
              : event.description}
          </p>
        )}

        {event.location && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 21s-7-6.5-7-11a7 7 0 1 1 14 0c0 4.5-7 11-7 11Z"
                stroke="#9CA3AF"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="2.4" stroke="#9CA3AF" strokeWidth="1.6" />
            </svg>
            <span style={{ color: "#6B7280", fontSize: 13 }}>{event.location}</span>
          </div>
        )}

        <span
          className="ev-cta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: ACCENT,
            fontWeight: 600,
            fontSize: 13.5,
          }}
        >
          {upcoming ? "Register now" : "View recap"}
          <svg
            className="ev-cta-arrow"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke={ACCENT}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </a>
  );
}