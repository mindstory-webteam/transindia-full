"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AnimatedChatbotIcon({ className = "" }: { className?: string }) {
  
  const blinkAnimation = {
    scaleY: [1, 0.05, 1],
    transition: {
      duration: 0.18, 
      times: [0, 0.4, 1], 
      repeat: Infinity,
      repeatDelay: 3.5, 
      ease: "easeInOut",
    },
  };

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Subtle drop shadow for depth */}
        <filter id="bot-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Green Speech Bubble */}
      <path
        d="M 100 15 C 146.9 15 185 53.1 185 100 C 185 118 179.4 134.7 169.8 148 L 180 178 L 148 169.5 C 133.8 180.2 117.6 185 100 185 C 53.1 185 15 146.9 15 100 C 15 53.1 53.1 15 100 15 Z"
        fill="#8bc34a"
      />

      {/* Back Arm (Waving Hand) */}
      <path
        d="M 65 140 C 40 120 40 95 50 90 C 60 85 75 115 75 135 Z"
        fill="#ffffff"
        stroke="#1a1d1c"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* Body */}
      <rect x="60" y="120" width="80" height="60" rx="30" fill="#f8fafc" stroke="#1a1d1c" strokeWidth="5" />

      {/* Antenna Stick */}
      <rect x="97" y="35" width="6" height="25" fill="#e2e8f0" stroke="#1a1d1c" strokeWidth="5" />
      {/* Antenna Base */}
      <rect x="85" y="55" width="30" height="10" rx="4" fill="#cbd5e1" stroke="#1a1d1c" strokeWidth="5" />
      {/* Antenna Ball */}
      <circle cx="100" cy="30" r="8" fill="#ffffff" stroke="#1a1d1c" strokeWidth="5" />

      {/* Head (with drop shadow) */}
      <rect
        x="45"
        y="60"
        width="110"
        height="76"
        rx="38"
        fill="#ffffff"
        stroke="#1a1d1c"
        strokeWidth="5"
        filter="url(#bot-shadow)"
      />

      {/* Visor */}
      <rect x="58" y="78" width="84" height="34" rx="17" fill="#1a1d1c" />
      {/* Visor Reflection */}
      <path
        d="M 65 82 Q 100 80 135 82 A 15 15 0 0 1 138 90 Q 100 88 62 90 A 15 15 0 0 1 65 82 Z"
        fill="#ffffff"
        opacity="0.15"
      />

      {/* Eyes Group (Wrapped in Framer Motion for Blinking) */}
      <motion.g animate={blinkAnimation} style={{ transformBox: "fill-box", transformOrigin: "50% 75%" }}>
        {/* Left Eye */}
        <circle cx="82" cy="95" r="9" fill="#8bc34a" />
        <circle cx="82" cy="95" r="4.5" fill="#1a1d1c" />
        <circle cx="84" cy="92" r="2.5" fill="#ffffff" />
        <circle cx="79" cy="97" r="1" fill="#ffffff" />

        {/* Right Eye */}
        <circle cx="118" cy="95" r="9" fill="#8bc34a" />
        <circle cx="118" cy="95" r="4.5" fill="#1a1d1c" />
        <circle cx="120" cy="92" r="2.5" fill="#ffffff" />
        <circle cx="115" cy="97" r="1" fill="#ffffff" />
      </motion.g>

      {/* Smile */}
      <path
        d="M 88 118 Q 100 128 112 118"
        fill="none"
        stroke="#1a1d1c"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
