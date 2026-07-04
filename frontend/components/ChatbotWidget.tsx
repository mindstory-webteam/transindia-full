"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Send, X, Loader2, ChevronRight, User, Phone, Mail, MessageSquare } from "lucide-react";
import { FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";
import AnimatedChatbotIcon from "./AnimatedChatbotIcon";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
interface UserDetails {
  name: string;
  phone: string;
  email: string;
  query: string;
}
type ChatStep =
  | "welcome"
  | "collect_name"
  | "collect_phone"
  | "collect_email"
  | "collect_query"
  | "chat";

// ── Brand tokens ───────────────────────────────────────────────────────────────
const C1 = "#f15a40";   // orange-red
const C2 = "#20bec6";   // teal
const FAB_SIZE   = 60;
const CHAT_W     = 380;
const CHAT_H     = 560;

const QUICK_REPLIES = [
  "Get insurance quote",
  "Renew my policy",
  "File a claim",
  "Talk to an advisor",
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function ChatbotWidget() {
  const [isOpen,     setIsOpen]     = useState(false);
  const [step,       setStep]       = useState<ChatStep>("welcome");
  const [messages,   setMessages]   = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading,  setIsLoading]  = useState(false);
  const [hasBadge,   setHasBadge]   = useState(true);
  const [mounted,    setMounted]    = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "", phone: "", email: "", query: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  // SSR guard
  useEffect(() => { setMounted(true); }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input
  useEffect(() => {
    if (isOpen && step === "chat" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, step]);

  // Clear badge
  useEffect(() => { if (isOpen) setHasBadge(false); }, [isOpen]);

  if (!mounted) return null;

  // ── Fixed panel position (bottom-right) ────────────────────────────────────
  const chatRight  = 24; // Align right edge with FAB
  const chatBottom = 45; // 68px FAB + 16px gap + 24px margin

  // ── Message helpers ────────────────────────────────────────────────────────
  const pushAssistantMsg = (content: string) =>
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content, timestamp: new Date() }]);

  const pushUserMsg = (content: string) =>
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content, timestamp: new Date() }]);

  // ── Step handlers ──────────────────────────────────────────────────────────
  const startChat = () => {
    const lastSubDate = localStorage.getItem("ti_chatbot_last_submission");
    if (lastSubDate === new Date().toDateString()) {
      setStep("chat");
      setMessages([]);
      setTimeout(() => pushAssistantMsg(
        "Welcome back! We have already received your query today, and our team is actively working on it. We will be in touch with you shortly!"
      ), 200);
      return;
    }

    setStep("collect_name");
    setMessages([]);
    setTimeout(() => pushAssistantMsg(
      "Welcome to TransIndia. I am your insurance assistant.\n\nBefore we begin, may I know your name?"
    ), 200);
  };

  const handleSubmitName = (val: string) => {
    if (!val.trim()) return;
    const name = val.trim();
    
    const lowerName = name.toLowerCase().replace(/[^\w\s]/g, "");
    if (["hi", "hello", "hey", "hola", "greetings"].includes(lowerName)) {
      pushUserMsg(name);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        pushAssistantMsg("Hello! Could you please tell me your name so we can proceed?");
      }, 400);
      return;
    }

    setUserDetails(d => ({ ...d, name }));
    pushUserMsg(name);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("collect_phone");
      pushAssistantMsg(`Thank you, ${name}. Could you please share your phone number so we can reach you?`);
    }, 800);
  };

  const handleSubmitPhone = (val: string) => {
    if (!val.trim()) return;
    const phone = val.trim();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      pushUserMsg(phone);
      setTimeout(() => pushAssistantMsg("Please enter a valid 10-digit Indian mobile number (starting with 6–9)."), 400);
      return;
    }
    setUserDetails(d => ({ ...d, phone }));
    pushUserMsg(phone);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("collect_email");
      pushAssistantMsg("Thank you. What is your email address? We will send policy details there.");
    }, 800);
  };

  const handleSubmitEmail = (val: string) => {
    if (!val.trim()) return;
    const email = val.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      pushUserMsg(email);
      setTimeout(() => pushAssistantMsg("That does not appear to be a valid email address. Could you double-check?"), 400);
      return;
    }
    setUserDetails(d => ({ ...d, email }));
    pushUserMsg(email);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("collect_query");
      pushAssistantMsg("Thank you. How can I assist you today? You can select one of the options below or type your own query.");
    }, 800);
  };

  const handleSubmitQuery = async (val: string) => {
    if (!val.trim()) return;
    const query = val.trim();
    const payload = { ...userDetails, query };
    setUserDetails(payload);
    pushUserMsg(query);
    setIsLoading(true);

    try {
      const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
      await fetch(`${API_BASE}/chatbotleads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // Store the submission date to prevent duplicate queries today
      localStorage.setItem("ti_chatbot_last_submission", new Date().toDateString());
    } catch (err) {
      console.error("Failed to save chatbot lead", err);
    }

    setTimeout(() => {
      setIsLoading(false);
      setStep("chat");
      pushAssistantMsg(
        `Thank you. We have noted your query: "${query}"\n\nOur team will reach out to you at ${payload.phone} shortly. Feel free to ask me anything about our insurance plans in the meantime.`
      );
    }, 600);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    const value = inputValue.trim();
    setInputValue("");

    switch (step) {
      case "collect_name":  return handleSubmitName(value);
      case "collect_phone": return handleSubmitPhone(value);
      case "collect_email": return handleSubmitEmail(value);
      case "collect_query": return handleSubmitQuery(value);
    }

    // Free chat phase (backend not yet connected)
    pushUserMsg(value);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      pushAssistantMsg("Thank you for your message. Our team will get back to you shortly. For urgent queries, please call us at 1800 425 8084.");
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const getPlaceholder = () => {
    switch (step) {
      case "collect_name":  return "Enter your full name...";
      case "collect_phone": return "Enter 10-digit mobile number...";
      case "collect_email": return "Enter your email address...";
      case "collect_query": return "Describe your query...";
      default:              return "Type your message...";
    }
  };

  const stepProgress: Record<ChatStep, number> = {
    welcome: 0, collect_name: 25, collect_phone: 50, collect_email: 75, collect_query: 100, chat: 100,
  };
  const showProgress = ["collect_name","collect_phone","collect_email","collect_query"].includes(step);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes chatFadeIn {
          from { opacity:0; transform:scale(0.92) translateY(8px); }
          to   { opacity:1; transform:scale(1)    translateY(0);   }
        }
        @keyframes chatBounce {
          0%,100% { transform:translateY(0);    }
          50%      { transform:translateY(-6px); }
        }
        @keyframes fabPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(241,90,64,.45); }
          70%     { box-shadow: 0 0 0 10px rgba(241,90,64,0); }
        }
        @keyframes chatSpin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes badgePop {
          0%   { transform:scale(0);   }
          60%  { transform:scale(1.3); }
          100% { transform:scale(1);   }
        }
        @keyframes msgSlideIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0);   }
        }

        /* ── FAB ── */
        .ctw-fab {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 9999;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }


        .ctw-fab-img {
          width: 68px;
          height: 68px;
          border-radius: 18px;
          overflow: hidden;
          background: transparent;
          transition: transform .22s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      
        .ctw-badge {
          position: absolute;
          top: -4px; right: -4px;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: ${C2};
          border: 2.5px solid #fff;
          font-size: 10px; font-weight: 700;
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          animation: badgePop .4s cubic-bezier(.34,1.56,.64,1);
        }

        /* ── Chat window ── */
        .ctw-window-anim { animation: chatFadeIn .28s cubic-bezier(.34,1.56,.64,1); }
        .ctw-msg-anim    { animation: msgSlideIn .22s ease; }
        .ctw-spin        { animation: chatSpin 1s linear infinite; }

        .ctw-typing-dot {
          width:7px; height:7px; border-radius:50%;
          background: ${C1};
          display: inline-block;
          animation: chatBounce .9s ease-in-out infinite;
        }
        .ctw-typing-dot:nth-child(2) { animation-delay:.15s; }
        .ctw-typing-dot:nth-child(3) { animation-delay:.30s; }

        .ctw-quick-btn {
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 20px;
          padding: 7px 14px;
          font-size: 12.5px;
          cursor: pointer;
          transition: all .18s ease;
          color: ${C1};
          font-weight: 500;
          white-space: nowrap;
        }
        .ctw-quick-btn:hover {
          background: ${C1};
          color: #fff;
          border-color: ${C1};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(241,90,64,.25);
        }

        .ctw-send-btn { transition: transform .18s ease; }
        .ctw-send-btn:hover:not(:disabled) { transform: scale(1.08); }



        .ctw-start-btn {
          background: ${C1};
          color: #fff; border: none; border-radius: 14px;
          padding: 13px 28px; font-size: 14.5px; font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 6px 20px rgba(241,90,64,.35);
          transition: transform .18s, box-shadow .18s;
          width: 100%;
        }
        .ctw-start-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(241,90,64,.45);
        }

        /* ── Responsive: phones ── */
        @media (max-width: 639px) {
          .ctw-fab { right: 16px; bottom: 16px; }
          .ctw-window {
            position: fixed !important;
            left: 0 !important; right: 0 !important;
            bottom: 0 !important; top: 0 !important;
            width: 100vw !important; max-width: 100vw !important;
            height: 100dvh !important; max-height: 100dvh !important;
            border-radius: 0 !important;
          }
          .ctw-input-mobile { font-size: 16px !important; }
        }

        /* ── Responsive: iPad mini/Air (768–899px) ── */
        @media (min-width: 640px) and (max-width: 899px) {
          .ctw-fab { right: 28px; bottom: 28px; }
          .ctw-window {
            position: fixed !important;
            left: 0 !important; right: 0 !important;
            bottom: 0 !important; top: 0 !important;
            width: 100vw !important; max-width: 100vw !important;
            height: 100dvh !important; max-height: 100dvh !important;
            border-radius: 0 !important;
          }
          .ctw-input-mobile { font-size: 16px !important; }
        }

        /* ── Responsive: iPad Pro (900–1024px) ── */
        @media (min-width: 900px) and (max-width: 1024px) {
          .ctw-fab { right: 32px; bottom: 32px; }
          .ctw-window {
            position: fixed !important;
            left: 0 !important; right: 0 !important;
            bottom: 0 !important; top: 0 !important;
            width: 100vw !important; max-width: 100vw !important;
            height: 100dvh !important; max-height: 100dvh !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      {/* ── Fixed FAB — hidden when chat is open ── */}
      {!isOpen && (
        <div
          className="ctw-fab"
          role="button"
          aria-label="Open chat"
          tabIndex={0}
          onClick={() => setIsOpen(true)}
          onKeyDown={e => e.key === "Enter" && setIsOpen(true)}
        >
          <div style={{ position: "relative" }}>
            <div className="ctw-fab-img">
              <AnimatedChatbotIcon />
            </div>
          </div>
        </div>
      )}


      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className="ctw-window-anim ctw-window"
          style={{
            position: "fixed",
            right: chatRight,
            bottom: chatBottom,
            width: CHAT_W,
            maxWidth: `calc(100vw - 32px)`,
            height: CHAT_H,
            maxHeight: `calc(100vh - 32px)`,
            zIndex: 9998,
            display: "flex",
            flexDirection: "column",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,.16), 0 4px 16px rgba(241,90,64,.1)",
            border: "1px solid rgba(241,90,64,.1)",
            background: "#fff",
            fontFamily: "'matterregular', sans-serif",
          }}
        >
          {/* Header */}
          <div style={{
            background: C1,
            padding: "14px 16px 12px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Logo circle */}
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "#20bec6",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,.15)",
                overflow: "hidden",
              }}>
                <img
                  src="/images/chatbot/bot-img.png"
                  alt="TransIndia"
                  style={{ width: "65%", height: "65%", objectFit: "contain" }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", lineHeight: 1.2 }}>
                  TransIndia Assistant
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.85)", display: "flex", alignItems: "center", gap: 5 }}>
                  
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255,255,255,.2)", border: "none", borderRadius: "50%",
                width: 32, height: 32, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>



          {/* ── Welcome Screen ── */}
          {step === "welcome" ? (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "54px 14px 28px 14px", background: "#f9fafb", gap: 18,
              overflowY: "auto",
            }}>
              {/* Logo */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Image
                  src="/images/logo/transindia.png"
                  alt="TransIndia"
                  width={150}
                  height={50}
                  style={{ objectFit: "contain" }}
                />
              </div>

              <div style={{ textAlign: "center", marginTop: -8 }}>
                <h2 style={{
                  fontSize: 20, fontWeight: 700, color: "#111",
                  margin: "0 0 6px",
                  fontFamily: "var(--font-sora), Sora, sans-serif",
                }}>
                  Welcome to TransIndia
                </h2>
                <p style={{ fontSize: 13.5, color: "#6b7280", margin: 0, lineHeight: 1.55 }}>
                  Your trusted insurance partner. We are here to help you with
                  quotes, renewals, claims, and more.
                </p>
              </div>

              {/* Feature list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                {[
                  { icon: <MessageSquare size={15} />, text: "Get instant insurance quotes" },
                  { icon: <User size={15} />,          text: "Renew or manage your policy"  },
                  { icon: <Phone size={15} />,          text: "24/7 claims support"          },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "#fff", borderRadius: 10, padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    fontSize: 13, color: "#374151",
                  }}>
                    <span style={{ color: C1, flexShrink: 0 }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              <button className="ctw-start-btn" onClick={startChat}>
                Start Chat <ChevronRight size={18} />
              </button>

              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, textAlign: "center" }}>
                By continuing you agree to our Privacy Policy
              </p>
            </div>
          ) : (
            <>
              {/* ── Messages ── */}
              <div style={{
                flex: 1, overflowY: "auto",
                padding: "24px 12px 16px 12px",
                display: "flex", flexDirection: "column", gap: 10,
                background: "#f9fafb",
              }}>
                {/* Step banner */}
                {showProgress && (
                  <div style={{
                    background: "rgba(241,90,64,.06)",
                    border: "1px dashed rgba(241,90,64,.25)",
                    borderRadius: 10, padding: "8px 12px",
                    fontSize: 12, color: C1,
                    display: "flex", alignItems: "center", gap: 7, flexShrink: 0,
                  }}>
                    {step === "collect_name"  && <><User size={13} /> Step 1 of 4</>}
                    {step === "collect_phone" && <><Phone size={13} /> Step 2 of 4</>}
                    {step === "collect_email" && <><Mail size={13} /> Step 3 of 4</>}
                    {step === "collect_query" && <><MessageSquare size={13} /> Step 4 of 4</>}
                  </div>
                )}

                {messages.map(msg => (
                  <div key={msg.id} className="ctw-msg-anim" style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}>
                    {msg.role === "assistant" && (
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "#20bec6",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginRight: 7, marginTop: 2,
                        boxShadow: "0 2px 8px rgba(241,90,64,.25)",
                        overflow: "hidden",
                      }}>
                        <img src="/images/chatbot/bot-img.png" alt="Bot" style={{ width: "65%", height: "65%", objectFit: "contain" }} />
                      </div>
                    )}
                    <div style={{
                      maxWidth: "72%",
                      borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      padding: "10px 13px", fontSize: 13.5, lineHeight: 1.55,
                      ...(msg.role === "user"
                        ? {
                            background: C1,
                            color: "#fff",
                            boxShadow: "0 3px 12px rgba(241,90,64,.22)",
                          }
                        : {
                            background: "#fff", color: "#1a1a1a",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 1px 6px rgba(0,0,0,.06)",
                          }),
                    }}>
                      <p style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {msg.content}
                      </p>
                      <span style={{ display: "block", marginTop: 4, fontSize: 10.5, opacity: .5 }}>
                        {msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "#20bec6",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      overflow: "hidden",
                    }}>
                      <img src="/images/chatbot/bot-img.png" alt="Bot" style={{ width: "65%", height: "65%", objectFit: "contain" }} />
                    </div>
                    <div style={{
                      background: "#fff", border: "1px solid #e5e7eb",
                      borderRadius: "18px 18px 18px 4px",
                      padding: "12px 16px",
                      display: "flex", gap: 5, alignItems: "center",
                      boxShadow: "0 1px 6px rgba(0,0,0,.06)",
                    }}>
                      <span className="ctw-typing-dot" />
                      <span className="ctw-typing-dot" />
                      <span className="ctw-typing-dot" />
                    </div>
                  </div>
                )}

                {/* Quick replies */}
                {step === "collect_query" && !isLoading && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4, paddingLeft: 35 }}>
                    {QUICK_REPLIES.map(qr => (
                      <button key={qr} className="ctw-quick-btn" onClick={() => handleSubmitQuery(qr)}>
                        {qr}
                      </button>
                    ))}
                  </div>
                )}

                {/* Saved details card */}
                {step === "chat" && userDetails.name && (
                  <div style={{
                    background: "rgba(241,90,64,.05)",
                    border: "1px solid rgba(241,90,64,.15)",
                    borderRadius: 14, padding: "12px 14px",
                    fontSize: 12.5, color: "#374151", marginLeft: 35,
                  }}>
                    <div style={{
                      fontWeight: 600, color: C1, marginBottom: 8, fontSize: 11,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                    }}>
                      Contact Details Confirmed
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <User size={12} style={{ color: C1, flexShrink: 0 }} /> {userDetails.name}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Phone size={12} style={{ color: C1, flexShrink: 0 }} /> {userDetails.phone}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Mail size={12} style={{ color: C1, flexShrink: 0 }} /> {userDetails.email}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ── Input bar ── */}
              <div style={{
                padding: "10px 12px",
                borderTop: "1px solid #e5e7eb", background: "#fff",
                display: "flex", gap: 9, flexShrink: 0, alignItems: "center",
              }}>
                <input
                  ref={inputRef}
                  className="ctw-input-mobile"
                  type={step === "collect_email" ? "email" : step === "collect_phone" ? "tel" : "text"}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={getPlaceholder()}
                  disabled={isLoading}
                  maxLength={step === "collect_phone" ? 10 : undefined}
                  style={{
                    flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 14,
                    padding: "10px 14px", fontSize: 13.5, outline: "none",
                    transition: "border-color .2s, box-shadow .2s",
                    opacity: isLoading ? 0.5 : 1, background: "#f9fafb",
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = C1;
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(241,90,64,.1)";
                    e.currentTarget.style.background = "#fff";
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "#f9fafb";
                  }}
                />
                <button
                  className="ctw-send-btn"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  style={{
                    background: C1,
                    color: "#fff", border: "none", borderRadius: 14,
                    width: 44, height: 44,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: inputValue.trim() && !isLoading ? "pointer" : "not-allowed",
                    opacity: !inputValue.trim() || isLoading ? 0.45 : 1, flexShrink: 0,
                    boxShadow: inputValue.trim() ? "0 4px 14px rgba(241,90,64,.3)" : "none",
                  }}
                  aria-label="Send message"
                >
                  {isLoading ? <Loader2 size={18} className="ctw-spin" /> : <Send size={18} />}
                </button>
              </div>

              {/* ── Footer ── */}
              <div style={{
                padding: "6px 14px 8px", background: "#fff",
                textAlign: "center", fontSize: 11, color: "#9ca3af",
                borderTop: "1px solid #f3f4f6", flexShrink: 0,
              }}>
                Powered by <strong style={{ color: C1 }}>TransIndia</strong> · Your data is secure
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
