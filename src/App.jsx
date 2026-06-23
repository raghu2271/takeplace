import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID  = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const supabase   = createClient(SUPABASE_URL, SUPABASE_KEY);

async function callGroq(prompt, maxTokens = 2000, systemMsg = "") {
  const sys = systemMsg || "You are an expert technical interviewer. Respond with valid JSON only. No markdown, no explanation.";
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: sys },
        { role: "user", content: prompt }
      ],
      max_tokens: maxTokens
    })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "AI service error " + res.status);
  }
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg: "#ffffff", bg2: "#f8fafc", bg3: "#f1f5f9",
  ink: "#0a0e1a", inkSoft: "#1e293b",
  navy: "#0d1b3e", navyL: "#1a2f5a", navyXL: "#253d70",
  gold: "#c8922a", goldL: "#e8a83c", goldPale: "#fefbf3", goldBorder: "#f0d090",
  teal: "#0c8a7e", tealL: "#12b0a2", tealPale: "#f0fdfa",
  blue: "#1d4ed8", blueL: "#3b82f6", bluePale: "#eff6ff",
  green: "#15803d", greenPale: "#f0fdf4", greenBorder: "#86efac",
  red: "#b91c1c", redPale: "#fef2f2",
  yellow: "#b45309", yellowPale: "#fffbeb",
  purple: "#6d28d9", purplePale: "#f5f3ff",
  muted: "#64748b", soft: "#94a3b8", border: "#e2e8f0", borderDark: "#cbd5e1",
  success: "#15803d", warn: "#b45309", danger: "#b91c1c",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap');`;

const CSS = `
  ${FONTS}
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',sans-serif;color:#0a0e1a;background:#fff;-webkit-font-smoothing:antialiased;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes pulseGlow{0%{box-shadow:0 0 0 0 rgba(200,146,42,.5)}70%{box-shadow:0 0 0 16px rgba(200,146,42,0)}100%{box-shadow:0 0 0 0 rgba(200,146,42,0)}}
  @keyframes tealGlow{0%{box-shadow:0 0 0 0 rgba(12,138,126,.5)}70%{box-shadow:0 0 0 16px rgba(12,138,126,0)}100%{box-shadow:0 0 0 0 rgba(12,138,126,0)}}
  @keyframes voiceBar{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  .fade{animation:fadeUp .35s ease forwards;}
  .fadeIn{animation:fadeIn .25s ease forwards;}
  .float{animation:float 3s ease-in-out infinite;}
  .lift{transition:transform .18s ease,box-shadow .18s ease;cursor:pointer;}
  .lift:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.1);}
  input:focus,textarea:focus{outline:none;border-color:#1d4ed8!important;box-shadow:0 0 0 3px #1d4ed820!important;}
  button:active{transform:scale(.97);}
  a{text-decoration:none;color:inherit;}
  .bottom-nav{padding-bottom:env(safe-area-inset-bottom,0px);}
  .vbar{width:3px;border-radius:2px;background:currentColor;display:inline-block;transform-origin:center bottom;}
  .feedback-slide{animation:slideIn .3s ease forwards;}

  /* FULLSCREEN INTERVIEW ROOM */
  .room-fullscreen {
    position:fixed; inset:0; z-index:9999; background:#0a0d14;
    display:flex; flex-direction:column; overflow:hidden;
  }
  .interviewer-video {
    flex:1; position:relative; overflow:hidden;
    background:linear-gradient(160deg,#0d1b3e 0%,#111827 100%);
    display:flex; align-items:center; justify-content:center;
  }
  .candidate-pip {
    position:absolute; bottom:20px; right:20px;
    width:180px; height:135px; border-radius:16px;
    overflow:hidden; border:3px solid rgba(255,255,255,.25);
    background:#111; z-index:10; box-shadow:0 8px 32px rgba(0,0,0,.6);
  }
  .candidate-pip video { width:100%; height:100%; object-fit:cover; transform:scaleX(-1); }
  .room-hud {
    position:absolute; top:0; left:0; right:0;
    padding:18px 24px; display:flex; align-items:center; justify-content:space-between; z-index:20;
    background:linear-gradient(to bottom,rgba(0,0,0,.6),transparent);
  }
  .room-bottom {
    position:absolute; bottom:0; left:0; right:0;
    background:linear-gradient(to top,rgba(0,0,0,.8),transparent);
    padding:20px 24px 80px; z-index:20;
  }
  .room-controls {
    position:absolute; bottom:0; left:0; right:0;
    background:rgba(10,13,20,.9); padding:14px 24px;
    display:flex; align-items:center; justify-content:center; gap:16px; z-index:25;
  }
  .ctrl-btn {
    width:52px; height:52px; border-radius:50%; border:none; cursor:pointer;
    display:flex; align-items:center; justify-content:center; font-size:20px;
    transition:all .2s; font-family:'Inter',sans-serif;
  }
`;

const inp = {
  width: "100%", background: "#fff", border: `1.5px solid ${C.border}`,
  borderRadius: 10, padding: "12px 14px", color: C.ink, fontSize: 14,
  fontFamily: "'Inter',sans-serif", outline: "none", transition: "border-color .2s",
};

// ── MICRO COMPONENTS ──────────────────────────────────────────────────────────
const Spin = ({ size = 18, color = C.gold }) => (
  <span style={{
    width: size, height: size, border: `2.5px solid ${color}25`,
    borderTopColor: color, borderRadius: "50%", display: "inline-block",
    animation: "spin 0.9s linear infinite", flexShrink: 0
  }} />
);

function Btn({ children, onClick, v = "primary", style = {}, disabled = false, loading = false, small = false }) {
  const pad = small ? "8px 16px" : "12px 22px";
  const fs = small ? 13 : 14;
  const vs = {
    primary: { background: C.navy, color: "#fff", fontWeight: 700 },
    gold: { background: `linear-gradient(135deg,#8B6519,${C.gold},${C.goldL})`, color: "#fff", fontWeight: 800, boxShadow: `0 4px 18px ${C.gold}35` },
    teal: { background: `linear-gradient(135deg,#065f5b,${C.teal},${C.tealL})`, color: "#fff", fontWeight: 700 },
    ghost: { background: "transparent", color: C.muted, border: `1.5px solid ${C.border}` },
    danger: { background: C.red, color: "#fff", fontWeight: 700 },
    white: { background: "#fff", color: C.navy, fontWeight: 700, boxShadow: "0 2px 12px rgba(0,0,0,.12)" },
    outline: { background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,.35)", fontWeight: 600 },
    red: { background: "#dc2626", color: "#fff", fontWeight: 700 },
  };
  return (
    <button onClick={disabled || loading ? undefined : onClick} disabled={disabled || loading}
      style={{
        padding: pad, borderRadius: 10, border: "none", cursor: disabled || loading ? "not-allowed" : "pointer",
        fontFamily: "'Inter',sans-serif", fontSize: fs, transition: "all .18s",
        opacity: disabled ? 0.5 : 1, display: "inline-flex", alignItems: "center",
        justifyContent: "center", gap: 7, ...vs[v], ...style
      }}>
      {loading ? <><Spin size={14} color={v === "ghost" ? C.gold : "#fff"} /> Loading…</> : children}
    </button>
  );
}

const Tag = ({ children, color = C.gold, bg }) => (
  <span style={{
    background: bg || `${color}14`, color, fontSize: 11, padding: "3px 10px",
    borderRadius: 20, fontWeight: 700, border: `1px solid ${color}28`, whiteSpace: "nowrap"
  }}>{children}</span>
);

const Pill = ({ children, active, onClick, color = C.gold }) => (
  <button onClick={onClick} style={{
    padding: "5px 14px", borderRadius: 20, border: `1.5px solid ${active ? color : C.border}`,
    background: active ? `${color}12` : "#fff", color: active ? color : C.muted,
    fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all .15s"
  }}>{children}</button>
);

function ScoreRing({ score, size = 80, color, label }) {
  const r = 32, circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score || 0));
  const col = color || (pct >= 75 ? C.green : pct >= 50 ? C.gold : C.red);
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke={C.border} strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={col} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
          strokeLinecap="round" transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dashoffset 1.2s ease" }} />
        <text x="36" y="40" textAnchor="middle" fill={col} fontSize="14" fontWeight="800" fontFamily="Inter">{pct}%</text>
      </svg>
      {label && <div style={{ color: C.muted, fontSize: 10, fontWeight: 600, marginTop: 3 }}>{label}</div>}
    </div>
  );
}

function Bar({ score, color }) {
  return (
    <div style={{ background: C.bg3, borderRadius: 4, height: 5, overflow: "hidden", marginTop: 5 }}>
      <div style={{ height: "100%", width: `${score || 0}%`, background: color || C.gold, borderRadius: 4, transition: "width 1s ease" }} />
    </div>
  );
}

function safeJSON(raw, fallback = {}) {
  if (!raw) return fallback;
  try { return JSON.parse(raw.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim()); }
  catch {
    try { const m = raw.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]); } catch {}
    return fallback;
  }
}

function fmtTime(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ── AI HUMAN AVATAR (SVG interviewer face — woman, professional) ──────────────
function AIInterviewerFace({ speaking, size = 200 }) {
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        {/* Background glow */}
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a3a6e" />
            <stop offset="100%" stopColor="#0d1b3e" />
          </radialGradient>
          <radialGradient id="skinGrad" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#f5c8a0" />
            <stop offset="100%" stopColor="#e8a870" />
          </radialGradient>
          <radialGradient id="hairGrad" cx="50%" cy="20%" r="70%">
            <stop offset="0%" stopColor="#2c1a0e" />
            <stop offset="100%" stopColor="#1a0f08" />
          </radialGradient>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Circle bg */}
        <circle cx="100" cy="100" r="100" fill="url(#bgGrad)" />

        {/* Suit / shoulders */}
        <ellipse cx="100" cy="195" rx="70" ry="40" fill="#1a2f5a" />
        <rect x="30" y="160" width="140" height="50" fill="#1a2f5a" />
        {/* Collar */}
        <polygon points="100,155 85,175 100,170 115,175" fill="#ffffff" opacity="0.9" />
        <polygon points="100,155 85,175 78,165" fill="#f8fafc" opacity="0.9" />
        <polygon points="100,155 115,175 122,165" fill="#f8fafc" opacity="0.9" />

        {/* Neck */}
        <rect x="88" y="140" width="24" height="25" rx="8" fill="url(#skinGrad)" />

        {/* Head */}
        <ellipse cx="100" cy="105" rx="44" ry="50" fill="url(#skinGrad)" filter="url(#softShadow)" />

        {/* Hair — long professional */}
        <ellipse cx="100" cy="75" rx="46" ry="36" fill="url(#hairGrad)" />
        {/* Side hair left */}
        <path d="M56,85 Q50,120 58,150 Q68,148 72,120 Q70,100 72,85 Z" fill="url(#hairGrad)" />
        {/* Side hair right */}
        <path d="M144,85 Q150,120 142,150 Q132,148 128,120 Q130,100 128,85 Z" fill="url(#hairGrad)" />
        {/* Hair top wave */}
        <path d="M58,80 Q70,60 100,58 Q130,60 142,80 Q130,72 100,70 Q70,72 58,80 Z" fill="#2c1a0e" />

        {/* Ears */}
        <ellipse cx="56" cy="108" rx="7" ry="9" fill="#e8a870" />
        <ellipse cx="144" cy="108" rx="7" ry="9" fill="#e8a870" />
        {/* Ear detail */}
        <ellipse cx="56" cy="108" rx="4" ry="6" fill="#d4905c" opacity="0.5" />
        <ellipse cx="144" cy="108" rx="4" ry="6" fill="#d4905c" opacity="0.5" />

        {/* Eyebrows */}
        <path d="M76,88 Q86,83 96,86" stroke="#4a2c0e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M104,86 Q114,83 124,88" stroke="#4a2c0e" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Eyes */}
        {/* Left eye */}
        <ellipse cx="86" cy="100" rx="10" ry="8" fill="white" />
        <ellipse cx="86" cy="100" rx="7" ry="7" fill="#4a2c0e" />
        <ellipse cx="86" cy="100" rx="4.5" ry="4.5" fill="#1a0f08" />
        <ellipse cx="88" cy="98" rx="2" ry="2" fill="white" opacity="0.8" />
        {/* Eye lashes top left */}
        <path d="M76,96 Q78,90 86,92" stroke="#1a0f08" strokeWidth="1.5" fill="none" />
        <path d="M96,96 Q94,90 86,92" stroke="#1a0f08" strokeWidth="1.5" fill="none" />

        {/* Right eye */}
        <ellipse cx="114" cy="100" rx="10" ry="8" fill="white" />
        <ellipse cx="114" cy="100" rx="7" ry="7" fill="#4a2c0e" />
        <ellipse cx="114" cy="100" rx="4.5" ry="4.5" fill="#1a0f08" />
        <ellipse cx="116" cy="98" rx="2" ry="2" fill="white" opacity="0.8" />
        {/* Eye lashes top right */}
        <path d="M104,96 Q106,90 114,92" stroke="#1a0f08" strokeWidth="1.5" fill="none" />
        <path d="M124,96 Q122,90 114,92" stroke="#1a0f08" strokeWidth="1.5" fill="none" />

        {/* Nose */}
        <path d="M97,105 Q96,118 99,122 Q100,124 101,122 Q104,118 103,105" stroke="#c08050" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="96" cy="122" rx="4" ry="2.5" fill="#d4905c" opacity="0.4" />
        <ellipse cx="104" cy="122" rx="4" ry="2.5" fill="#d4905c" opacity="0.4" />

        {/* Mouth — changes when speaking */}
        {speaking ? (
          <>
            <path d="M84,134 Q100,148 116,134" stroke="#b06040" strokeWidth="2" fill="none" strokeLinecap="round" />
            <ellipse cx="100" cy="138" rx="14" ry="7" fill="#8B0000" opacity="0.85" />
            <ellipse cx="100" cy="138" rx="10" ry="4" fill="#cc2222" opacity="0.7" />
            {/* Teeth */}
            <ellipse cx="100" cy="135" rx="9" ry="3" fill="white" opacity="0.9" />
          </>
        ) : (
          <>
            <path d="M88,134 Q100,143 112,134" stroke="#c07050" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M88,134 Q100,136 112,134" stroke="#e8a080" strokeWidth="1" fill="none" opacity="0.5" />
          </>
        )}

        {/* Blush */}
        <ellipse cx="72" cy="118" rx="10" ry="6" fill="#ff9999" opacity="0.18" />
        <ellipse cx="128" cy="118" rx="10" ry="6" fill="#ff9999" opacity="0.18" />

        {/* Earring */}
        <circle cx="56" cy="118" r="3" fill="#c8922a" />
        <circle cx="144" cy="118" r="3" fill="#c8922a" />

        {/* Speaking pulse ring */}
        {speaking && (
          <circle cx="100" cy="105" r="95" fill="none" stroke="#c8922a" strokeWidth="2" opacity="0.4"
            style={{ animation: "pulseRing 1.5s ease-out infinite" }} />
        )}
      </svg>

      {/* Speaking animation overlay */}
      {speaking && (
        <div style={{
          position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 4, alignItems: "flex-end"
        }}>
          {[0.45, 0.6, 0.8, 0.6, 0.45].map((d, i) => (
            <div key={i} style={{
              width: 4, borderRadius: 3, background: C.goldL, height: 20,
              animation: `voiceBar ${d}s ease-in-out ${i * 0.1}s infinite`,
              transformOrigin: "center bottom"
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── ROLE LIBRARY ──────────────────────────────────────────────────────────────
const ROLES = [
  { id: "sde",       title: "Software Engineer",        icon: "💻", cat: "Engineering", focus: "DSA, problem solving, system design" },
  { id: "frontend",  title: "Frontend Developer",        icon: "🎨", cat: "Engineering", focus: "React, JS, CSS, performance, a11y" },
  { id: "backend",   title: "Backend Developer",         icon: "🗄️", cat: "Engineering", focus: "APIs, databases, system design, scaling" },
  { id: "fullstack", title: "Full Stack Developer",      icon: "🧩", cat: "Engineering", focus: "End-to-end app design, REST/GraphQL, deploy" },
  { id: "android",   title: "Android Developer",         icon: "🤖", cat: "Engineering", focus: "Kotlin, lifecycle, architecture, Play Store" },
  { id: "ios",       title: "iOS Developer",             icon: "📱", cat: "Engineering", focus: "Swift, UIKit/SwiftUI, memory, App Store" },
  { id: "devops",    title: "DevOps Engineer",           icon: "⚙️", cat: "Engineering", focus: "CI/CD, containers, IaC, monitoring" },
  { id: "cloud",     title: "Cloud Engineer",            icon: "☁️", cat: "Engineering", focus: "AWS/Azure/GCP, networking, cost, security" },
  { id: "qa",        title: "QA / Test Engineer",        icon: "🧪", cat: "Engineering", focus: "Test design, automation, bug triage" },
  { id: "dba",       title: "Database Administrator",    icon: "🗃️", cat: "Engineering", focus: "SQL tuning, indexing, backups, replication" },
  { id: "security",  title: "Cybersecurity Analyst",     icon: "🛡️", cat: "Engineering", focus: "Threats, vulnerabilities, incident handling" },
  { id: "ds",        title: "Data Scientist",            icon: "📊", cat: "Data",        focus: "Statistics, modeling, experiment design" },
  { id: "da",        title: "Data Analyst",              icon: "📈", cat: "Data",        focus: "SQL, dashboards, business metrics" },
  { id: "mle",       title: "ML Engineer",               icon: "🧠", cat: "Data",        focus: "ML pipelines, model deployment, evaluation" },
  { id: "pm",        title: "Product Manager",           icon: "🧭", cat: "Business",    focus: "Prioritization, metrics, stakeholder mgmt" },
  { id: "ba",        title: "Business Analyst",          icon: "🧾", cat: "Business",    focus: "Requirements gathering, process mapping" },
  { id: "finance",   title: "Finance Analyst",           icon: "💹", cat: "Business",    focus: "Financial modeling, reporting, forecasting" },
  { id: "sales",     title: "Sales Executive",           icon: "🤝", cat: "Business",    focus: "Pitching, objection handling, pipeline" },
  { id: "marketing", title: "Digital Marketing",         icon: "📣", cat: "Business",    focus: "Campaigns, SEO/SEM, analytics" },
  { id: "hr",        title: "HR Generalist",             icon: "🧑‍💼", cat: "Business",    focus: "Hiring, policy, employee relations" },
  { id: "support",   title: "Customer Success",          icon: "🎧", cat: "Business",    focus: "De-escalation, retention, communication" },
  { id: "uiux",      title: "UI/UX Designer",            icon: "✏️", cat: "Design",      focus: "User research, wireframes, design critique" },
  { id: "mech",      title: "Mechanical Engineer",       icon: "🔧", cat: "Core",        focus: "Design, materials, manufacturing" },
  { id: "civil",     title: "Civil Engineer",            icon: "🏗️", cat: "Core",        focus: "Structures, site planning, codes" },
];
const CATS = ["All", "Engineering", "Data", "Business", "Design", "Core"];

const FALLBACK_QUESTIONS = [
  { q: "Tell me about yourself and what draws you to this role.", type: "Intro" },
  { q: "Walk me through a challenging project you worked on recently.", type: "Behavioral" },
  { q: "What are the core technical skills this role requires, and how would you rate yourself in each?", type: "Technical" },
  { q: "Describe a time you disagreed with a teammate. How did you handle it?", type: "Behavioral" },
  { q: "How would you approach your first 30 days in this position?", type: "Situational" },
  { q: "Do you have any questions for us, and is there anything else you'd like us to know?", type: "Closing" },
];

// ── INSTANT FEEDBACK CARD ──────────────────────────────────────────────────────
function InstantFeedback({ feedback, onNext, isLast }) {
  if (!feedback) return null;
  const sc = feedback.score || 0;
  const color = sc >= 75 ? C.green : sc >= 50 ? C.gold : C.red;
  const label = sc >= 75 ? "Strong answer" : sc >= 50 ? "Good attempt" : "Needs work";
  return (
    <div className="feedback-slide" style={{
      background: "#fff", border: `2px solid ${color}40`, borderRadius: 16,
      padding: 20, marginTop: 12, boxShadow: `0 4px 20px ${color}18`
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12, background: `${color}12`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 900, color, flexShrink: 0
        }}>{sc}%</div>
        <div>
          <div style={{ fontWeight: 700, color, fontSize: 14 }}>{label}</div>
          <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>Instant feedback on your answer</div>
        </div>
        <Btn v={isLast ? "gold" : "teal"} onClick={onNext} style={{ marginLeft: "auto", padding: "9px 18px", fontSize: 13 }}>
          {isLast ? "See Full Report →" : "Next Question →"}
        </Btn>
      </div>
      <Bar score={sc} color={color} />
      {feedback.tip && (
        <div style={{
          marginTop: 12, background: C.bg2, borderRadius: 10,
          padding: "10px 13px", fontSize: 13, color: C.inkSoft,
          lineHeight: 1.7, borderLeft: `3px solid ${color}`
        }}>
          <span style={{ fontWeight: 700, color }}>AI Feedback: </span>{feedback.tip}
        </div>
      )}
      {feedback.what_was_good && (
        <div style={{ marginTop: 8, fontSize: 12, color: C.green, display: "flex", gap: 6, alignItems: "flex-start" }}>
          <span>✓</span><span>{feedback.what_was_good}</span>
        </div>
      )}
    </div>
  );
}

// ── FULLSCREEN INTERVIEW ROOM ──────────────────────────────────────────────────
function FullscreenInterviewRoom({
  role, companyName, questions, qIndex, phase, aiSpeaking, listening,
  liveText, interimText, timeLeft, instantFeedback, loadingFeedback,
  onFinishAnswer, onProceedNext, onEndInterview, onToggleMic, micMuted,
  answers
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [camReady, setCamReady] = useState(false);
  const [camErr, setCamErr] = useState(false);

  const QUESTION_TIME = 90;
  const pct = (timeLeft / QUESTION_TIME) * 100;
  const timeColor = pct > 40 ? "#22c55e" : pct > 15 ? C.goldL : "#ef4444";
  const q = questions[qIndex];

  useEffect(() => {
    let active = true;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
      .then(stream => {
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
          setCamReady(true);
        }
      })
      .catch(() => setCamErr(true));
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  return (
    <div className="room-fullscreen">
      <style>{`
        @keyframes pulseRing { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.08);opacity:0} }
        @keyframes voiceBar{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        .vbar{width:4px;border-radius:2px;background:currentColor;display:inline-block;transform-origin:center bottom;}
      `}</style>

      {/* Main interviewer view */}
      <div className="interviewer-video">

        {/* HUD top */}
        <div className="room-hud">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", animation: "pulse 1s infinite" }} />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>LIVE</span>
            {companyName && (
              <div style={{ background: "rgba(255,255,255,.12)", borderRadius: 20, padding: "4px 14px", color: "rgba(255,255,255,.85)", fontSize: 12, fontWeight: 700 }}>
                {companyName}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  width: 24, height: 4, borderRadius: 3,
                  background: i < qIndex ? "#22c55e" : i === qIndex ? C.goldL : "rgba(255,255,255,.2)"
                }} />
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,.12)", borderRadius: 20, padding: "4px 14px", color: "rgba(255,255,255,.8)", fontSize: 12, fontWeight: 700 }}>
              Q{qIndex + 1}/{questions.length}
            </div>
          </div>
        </div>

        {/* AI Interviewer centered */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, zIndex: 5 }}>
          <div style={{
            borderRadius: "50%", padding: 6,
            border: `3px solid ${aiSpeaking ? C.goldL : "rgba(255,255,255,.15)"}`,
            boxShadow: aiSpeaking ? `0 0 0 8px ${C.gold}25, 0 0 40px ${C.gold}30` : "none",
            transition: "all .4s"
          }}>
            <AIInterviewerFace speaking={aiSpeaking} size={180} />
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Priya Sharma</div>
            <div style={{ color: "rgba(255,255,255,.55)", fontSize: 13, marginTop: 3 }}>
              {companyName ? `Senior Hiring Manager · ${companyName}` : `Senior Hiring Manager · ${role?.title}`}
            </div>
            {aiSpeaking && (
              <div style={{ display: "flex", justifyContent: "center", gap: 4, alignItems: "flex-end", marginTop: 10, height: 20 }}>
                {[0.45, 0.6, 0.8, 0.6, 0.45].map((d, i) => (
                  <span key={i} className="vbar" style={{
                    height: 20, color: C.goldL,
                    animation: `voiceBar ${d}s ease-in-out ${i * 0.1}s infinite`
                  }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Question overlay at bottom */}
        <div className="room-bottom">
          {phase === "speaking" && (
            <div style={{ color: "rgba(255,255,255,.55)", fontSize: 13, marginBottom: 8, textAlign: "center" }}>
              Priya is asking question {qIndex + 1}…
            </div>
          )}

          {/* Question card */}
          <div style={{
            background: "rgba(0,0,0,.6)", backdropFilter: "blur(12px)",
            borderRadius: 16, padding: "16px 20px",
            border: `1px solid rgba(255,255,255,.12)`, marginBottom: 12
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ background: `${C.gold}30`, color: C.goldL, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>{q?.type}</span>
              {phase === "answering" && (
                <span style={{ color: timeColor, fontWeight: 900, fontSize: 16, fontVariantNumeric: "tabular-nums" }}>
                  ⏱ {fmtTime(timeLeft)}
                </span>
              )}
            </div>
            <div style={{ color: "#fff", fontSize: 16, lineHeight: 1.6, fontWeight: 500 }}>{q?.q}</div>
            {phase === "answering" && (
              <div style={{ height: 3, background: "rgba(255,255,255,.12)", borderRadius: 3, marginTop: 12, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: timeColor, borderRadius: 3, transition: "width 1s linear" }} />
              </div>
            )}
          </div>

          {/* Live transcript */}
          {phase === "answering" && (
            <div style={{
              background: "rgba(0,0,0,.5)", backdropFilter: "blur(8px)",
              borderRadius: 12, padding: "12px 16px",
              border: `1px solid ${listening ? `${C.tealL}40` : "rgba(255,255,255,.1)"}`,
              minHeight: 60, marginBottom: 10
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                {listening && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.tealL, animation: "pulse 1s infinite" }} />}
                <span style={{ color: listening ? C.tealL : "rgba(255,255,255,.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                  {listening ? "Mic Live — Your Answer" : "Stand by"}
                </span>
              </div>
              <div style={{ color: "#fff", fontSize: 14, lineHeight: 1.7 }}>
                {liveText && <span>{liveText}</span>}
                {interimText && <span style={{ color: "rgba(255,255,255,.45)", fontStyle: "italic" }}>{liveText ? " " : ""}{interimText}</span>}
                {!liveText && !interimText && (
                  <span style={{ color: "rgba(255,255,255,.3)", fontStyle: "italic" }}>Start speaking — transcript appears here…</span>
                )}
              </div>
            </div>
          )}

          {/* Instant feedback in fullscreen */}
          {phase === "done-q" && loadingFeedback && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,.5)", borderRadius: 12, padding: "12px 16px", color: "rgba(255,255,255,.7)", fontSize: 13 }}>
              <span style={{ width: 16, height: 16, border: "2.5px solid rgba(255,255,255,.25)", borderTopColor: C.goldL, borderRadius: "50%", display: "inline-block", animation: "spin .9s linear infinite" }} />
              Scoring your answer…
            </div>
          )}
          {phase === "done-q" && !loadingFeedback && instantFeedback && (
            <div style={{
              background: "rgba(0,0,0,.6)", backdropFilter: "blur(12px)",
              borderRadius: 14, padding: "14px 18px",
              border: `1px solid ${instantFeedback.score >= 75 ? "#22c55e40" : instantFeedback.score >= 50 ? `${C.gold}40` : "#ef444440"}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: instantFeedback.score >= 75 ? "#22c55e20" : instantFeedback.score >= 50 ? `${C.gold}20` : "#ef444420",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: 16,
                  color: instantFeedback.score >= 75 ? "#22c55e" : instantFeedback.score >= 50 ? C.goldL : "#ef4444"
                }}>{instantFeedback.score}%</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
                    {instantFeedback.score >= 75 ? "Strong answer" : instantFeedback.score >= 50 ? "Good attempt" : "Needs work"}
                  </div>
                  {instantFeedback.tip && <div style={{ color: "rgba(255,255,255,.6)", fontSize: 12.5, marginTop: 3, lineHeight: 1.6 }}>{instantFeedback.tip}</div>}
                </div>
                <button
                  onClick={() => onProceedNext(qIndex)}
                  style={{
                    padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                    background: qIndex + 1 >= questions.length ? `linear-gradient(135deg,#8B6519,${C.gold},${C.goldL})` : `linear-gradient(135deg,#065f5b,${C.teal},${C.tealL})`,
                    color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "'Inter',sans-serif",
                    boxShadow: "0 4px 14px rgba(0,0,0,.4)"
                  }}>
                  {qIndex + 1 >= questions.length ? "See Report →" : "Next →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Candidate PiP — camera */}
        <div className="candidate-pip">
          {camReady ? (
            <video ref={videoRef} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 28 }}>🧑</span>
              <span style={{ color: "rgba(255,255,255,.4)", fontSize: 11 }}>{camErr ? "No camera" : "Loading…"}</span>
            </div>
          )}
          {micMuted && (
            <div style={{ position: "absolute", top: 8, right: 8, background: "#ef4444", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🔇</div>
          )}
        </div>
      </div>

      {/* Controls bar */}
      <div className="room-controls">
        {phase === "answering" && (
          <>
            <button onClick={onToggleMic} className="ctrl-btn" style={{ background: micMuted ? "#ef4444" : "rgba(255,255,255,.12)", color: "#fff" }}>
              {micMuted ? "🔇" : "🎙️"}
            </button>
            <button onClick={() => onFinishAnswer(qIndex)} className="ctrl-btn" style={{ background: C.gold, color: "#fff", width: 72, height: 52, borderRadius: 26, fontSize: 13, fontWeight: 700 }}>
              Done ✓
            </button>
            <button onClick={onEndInterview} className="ctrl-btn" style={{ background: "#ef4444", color: "#fff" }}>
              📵
            </button>
          </>
        )}
        {phase === "speaking" && (
          <div style={{ color: "rgba(255,255,255,.5)", fontSize: 13 }}>Priya is speaking — your mic will activate when she's done</div>
        )}
        {phase === "done-q" && !instantFeedback && !loadingFeedback && (
          <div style={{ color: "rgba(255,255,255,.5)", fontSize: 13 }}>Processing…</div>
        )}
      </div>
    </div>
  );
}

// ── RESUME-POWERED INTERVIEW TAB ──────────────────────────────────────────────
function ResumeInterviewTab() {
  const [step, setStep] = useState("setup"); // setup | analyzing | brief | room | report | genreport
  const [resumeText, setResumeText] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Fresher");
  const [resumeProfile, setResumeProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [genErr, setGenErr] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  // live interview state
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [timeLeft, setTimeLeft] = useState(90);
  const [phase, setPhase] = useState("idle");
  const [instantFeedback, setInstantFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [report, setReport] = useState(null);

  const recogRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const timerRef = useRef(null);
  const QUESTION_TIME = 90;

  const speechOK = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const ttsOK = typeof window !== "undefined" && window.speechSynthesis;

  useEffect(() => () => {
    clearInterval(timerRef.current);
    stopRecognition();
    window.speechSynthesis?.cancel();
  }, []);

  const analyzeAndGenerate = async () => {
    if (!resumeText.trim()) return;
    setAnalyzing(true); setStep("analyzing"); setGenErr("");
    try {
      const companyCtx = companyName ? `Target company: ${companyName}. Research their known interview style: focus on what ${companyName} is known for asking. Mirror their culture and difficulty.` : "";
      const raw = await callGroq(
        `You are a senior ${jobTitle || "tech"} interviewer${companyName ? ` at ${companyName}` : ""}. You just read the candidate's resume below.
${companyCtx}
Experience level: ${difficulty}.

Resume:
---
${resumeText.slice(0, 3000)}
---

Generate exactly 7 highly personalized interview questions that:
1. Reference specific projects, tools, or experience mentioned in this resume
2. ${companyName ? `Reflect ${companyName}'s actual interview culture and values` : "Test depth of knowledge"}
3. Mix: 1 intro (ask about specific background), 3 technical (dig into their actual projects/tech stack), 2 behavioral (real scenarios from their experience), 1 closing

Return ONLY:
{"profile":{"name":"<from resume or Candidate>","topSkills":["skill1","skill2","skill3"],"keyProjects":["proj1","proj2"],"experienceLevel":"<Fresher|Junior|Mid>"},"questions":[{"q":"<personalized question>","type":"Intro|Technical|Behavioral|Closing","whyAsked":"<1 sentence why this specifically>"}]}`,
        1800
      );
      const data = safeJSON(raw, null);
      if (!data?.questions?.length) throw new Error("Bad parse");
      setResumeProfile(data.profile);
      setQuestions(data.questions);
      setStep("brief");
    } catch (e) {
      setGenErr("Could not personalize fully — using smart defaults.");
      setQuestions(FALLBACK_QUESTIONS);
      setResumeProfile({ name: "Candidate", topSkills: [], keyProjects: [], experienceLevel: difficulty });
      setStep("brief");
    }
    setAnalyzing(false);
  };

  const speak = (text) => new Promise((resolve) => {
    if (!ttsOK) { resolve(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.96; u.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    // Prefer female voice for "Priya"
    const v = voices.find(v => /en-(US|GB|IN)/i.test(v.lang) && /Female|Samantha|Karen|Moira|Fiona|Veena|Raveena|Google UK English Female/i.test(v.name))
           || voices.find(v => /en/i.test(v.lang));
    if (v) u.voice = v;
    setAiSpeaking(true);
    u.onend = () => { setAiSpeaking(false); resolve(); };
    u.onerror = () => { setAiSpeaking(false); resolve(); };
    window.speechSynthesis.speak(u);
  });

  const stopRecognition = () => {
    try { recogRef.current?.stop(); } catch {}
    setListening(false);
    setInterimText("");
  };

  const startRecognition = () => {
    if (!speechOK) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = true; rec.interimResults = true; rec.lang = "en-US";
    finalTranscriptRef.current = "";
    rec.onresult = (e) => {
      let final = "", interim = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      finalTranscriptRef.current = final;
      setLiveText(final.trim());
      setInterimText(interim.trim());
    };
    rec.onerror = () => {};
    rec.onend = () => { if (phase === "answering") { try { rec.start(); } catch {} } };
    recogRef.current = rec;
    rec.start();
    setListening(true);
  };

  const beginQuestion = async (idx) => {
    setPhase("speaking"); setLiveText(""); setInterimText(""); setInstantFeedback(null);
    finalTranscriptRef.current = "";
    const intro = idx === 0 ? `Hello! I'm Priya Sharma, Senior Hiring Manager${companyName ? ` at ${companyName}` : ""}. Thank you for joining today. I've reviewed your resume. Let's begin. ` : "";
    await speak(intro + questions[idx].q);
    setPhase("answering"); setTimeLeft(QUESTION_TIME); setListening(true); startRecognition();
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); finishAnswer(idx); return 0; } return t - 1; });
    }, 1000);
  };

  const finishAnswer = async (idx) => {
    clearInterval(timerRef.current); stopRecognition(); setPhase("done-q");
    const finalAnswer = (finalTranscriptRef.current || liveText || "").trim() || "(no answer captured)";
    const newAnswer = { question: questions[idx].q, type: questions[idx].type, answer: finalAnswer };
    setAnswers(prev => { const n = [...prev]; n[idx] = newAnswer; return n; });
    setLoadingFeedback(true);
    try {
      const raw = await callGroq(
        `You are a strict senior interviewer${companyName ? ` at ${companyName}` : ""}. Score this answer.
Role: ${jobTitle || "the applied role"} · Level: ${difficulty}
Question (${questions[idx].type}): ${questions[idx].q}
Candidate answer: ${finalAnswer.slice(0, 800)}
${resumeProfile ? `Candidate profile — skills: ${resumeProfile.topSkills?.join(", ")}; projects: ${resumeProfile.keyProjects?.join(", ")}` : ""}
Return ONLY: {"score":<0-100>,"tip":"<1-2 sentence specific actionable feedback>","what_was_good":"<1 sentence or null>"}`, 400
      );
      const fb = safeJSON(raw, { score: 50, tip: "Keep practicing!", what_was_good: null });
      setInstantFeedback(fb);
    } catch {
      setInstantFeedback({ score: 50, tip: "Answer recorded.", what_was_good: null });
    }
    setLoadingFeedback(false);
  };

  const proceedNext = (idx) => {
    setInstantFeedback(null);
    if (idx + 1 < questions.length) {
      setQIndex(idx + 1);
      beginQuestion(idx + 1);
    } else {
      wrapInterview();
    }
  };

  const startInterview = () => {
    setStep("room"); setAnswers([]); setQIndex(0); setInstantFeedback(null);
    setTimeout(() => beginQuestion(0), 600);
  };

  const wrapInterview = async () => {
    setPhase("idle");
    window.speechSynthesis?.cancel();
    setStep("genreport");
    try {
      const transcript = answers.map((a, i) => `Q${i+1} (${a.type}): ${a.question}\nAnswer: ${a.answer}`).join("\n\n");
      const raw = await callGroq(
        `You are a strict senior hiring panelist${companyName ? ` at ${companyName}` : ""}. You just interviewed ${resumeProfile?.name || "the candidate"} for ${jobTitle || "a role"} (${difficulty}).
Full transcript:
${transcript.slice(0, 4000)}
Resume skills: ${resumeProfile?.topSkills?.join(", ") || "N/A"}

Score honestly. Return ONLY:
{"overallScore":<0-100>,"verdict":"<Strong Hire|Hire|Borderline|No Hire>","communicationScore":<0-100>,"technicalScore":<0-100>,"confidenceScore":<0-100>,"structureScore":<0-100>,"resumeAlignmentScore":<0-100>,"summary":"<3-4 sentence honest assessment>","companyFitNote":"<1-2 sentence about ${companyName || "company"} culture fit>","perQuestion":[{"question":"<short>","score":<0-100>,"feedback":"<1-2 sentence>"}],"strengths":["<1>","<2>"],"improvements":["<1>","<2>","<3>"],"nextSteps":["<actionable step 1>","<actionable step 2>"]}`,
        2500
      );
      const data = safeJSON(raw, null);
      if (!data?.overallScore) throw new Error("bad");
      setReport(data);
    } catch {
      setReport({ overallScore: 0, verdict: "—", communicationScore: 0, technicalScore: 0, confidenceScore: 0, structureScore: 0, resumeAlignmentScore: 0, summary: "Could not generate feedback. Please retry.", companyFitNote: "", perQuestion: [], strengths: [], improvements: [], nextSteps: [] });
    }
    setStep("report");
  };

  const endInterview = () => {
    window.speechSynthesis?.cancel(); stopRecognition(); clearInterval(timerRef.current);
    if (answers.length > 0) wrapInterview();
    else { setStep("setup"); setPhase("idle"); }
  };

  const sc = s => s >= 75 ? C.green : s >= 50 ? C.gold : C.red;

  // ── SETUP ──
  if (step === "setup") return (
    <div className="fade">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 900, fontSize: 24, color: C.ink, marginBottom: 6 }}>
          🎯 Resume-Powered Interview
        </div>
        <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, maxWidth: 600 }}>
          Paste your resume. Enter the company and role. Our AI interviewer reads your actual experience and asks personalized questions — exactly what a real interviewer would ask <em>you specifically</em>.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 }}>Target Company</div>
          <input style={inp} placeholder="e.g. Wipro, TCS, Amazon, Google…" value={companyName} onChange={e => setCompanyName(e.target.value)} />
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>AI will mirror their actual interview style</div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 }}>Role Applied For</div>
          <input style={inp} placeholder="e.g. Software Engineer, Data Analyst…" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 }}>Experience Level</div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Fresher", "1-2 years", "3-5 years"].map(d => (
            <button key={d} onClick={() => setDifficulty(d)} style={{
              flex: 1, padding: "10px", borderRadius: 10,
              border: `1.5px solid ${difficulty === d ? C.gold : C.border}`,
              background: difficulty === d ? C.goldPale : "#fff",
              color: difficulty === d ? C.gold : C.muted,
              fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif"
            }}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, textTransform: "uppercase", letterSpacing: .5 }}>Your Resume Text</div>
          <div style={{ fontSize: 11, color: C.muted }}>{resumeText.length} chars</div>
        </div>
        <textarea
          style={{ ...inp, minHeight: 220, resize: "vertical", fontFamily: "monospace", fontSize: 12.5, lineHeight: 1.7 }}
          placeholder={`Paste your full resume text here…\n\nExample:\nRaghu Reddy | B.Tech CSE AI/ML | CGPA 8.5\nSkills: Python, React, Node.js, SQL\nInternship: Infotact Solutions – Built REST APIs…\nProjects: TakePlace (React + Supabase), AgriPrice…`}
          value={resumeText}
          onChange={e => setResumeText(e.target.value)}
        />
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 6, lineHeight: 1.7 }}>
          The AI reads your actual skills, projects, and internships to ask <strong style={{ color: C.ink }}>questions only you can answer</strong> — not generic ones.
        </div>
      </div>

      {!speechOK && (
        <div style={{ background: C.yellowPale, border: `1px solid ${C.gold}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, color: C.yellow, fontSize: 12 }}>
          ⚠ Voice recognition needs Chrome on desktop or Android. You can still type your answers.
        </div>
      )}

      <div style={{ background: `linear-gradient(135deg,${C.navy}08,${C.teal}08)`, border: `1px solid ${C.navy}12`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, color: C.ink, fontSize: 13, marginBottom: 8 }}>What makes this different</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            ["🎥", "Full-screen camera room", "Like a real Zoom interview"],
            ["🧑‍💼", "Human AI interviewer", "Priya Sharma speaks your questions"],
            ["📄", "Resume-aware questions", "AI reads YOUR actual experience"],
            ["🏢", "Company-matched style", "Mirrors that company's real interviews"],
          ].map(([icon, title, desc], i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 12.5, color: C.ink }}>{title}</div>
                <div style={{ fontSize: 11.5, color: C.muted }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Btn v="gold" onClick={analyzeAndGenerate} disabled={!resumeText.trim()} style={{ width: "100%", padding: "16px", fontSize: 15, borderRadius: 12 }}>
        🎙️ Analyze Resume & Generate My Interview →
      </Btn>
    </div>
  );

  // ── ANALYZING ──
  if (step === "analyzing") return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 56, marginBottom: 18, animation: "float 2s ease-in-out infinite" }}>🔍</div>
      <div style={{ fontWeight: 800, fontSize: 20, color: C.ink, marginBottom: 8 }}>Reading your resume…</div>
      <div style={{ color: C.muted, fontSize: 14, marginBottom: 6, maxWidth: 360, margin: "0 auto 6px" }}>
        Extracting your projects, skills, and experience.{companyName ? ` Researching ${companyName}'s interview style.` : ""}
      </div>
      <div style={{ color: C.muted, fontSize: 13, marginBottom: 28 }}>Generating 7 personalized questions just for you.</div>
      <Spin size={40} />
    </div>
  );

  // ── BRIEF ──
  if (step === "brief") return (
    <div className="fade" style={{ maxWidth: 560, margin: "0 auto" }}>
      <button onClick={() => setStep("setup")} style={{ background: "none", border: "none", color: C.muted, fontSize: 12, cursor: "pointer", marginBottom: 16, fontFamily: "'Inter',sans-serif" }}>← Edit resume / company</button>

      {/* Profile card */}
      {resumeProfile && (
        <div style={{ background: `linear-gradient(160deg,${C.navy},${C.navyL})`, borderRadius: 18, padding: "22px 24px", marginBottom: 18, color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>📄</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{resumeProfile.name}</div>
              <div style={{ color: "rgba(255,255,255,.6)", fontSize: 13 }}>{jobTitle || "Applied Role"} · {difficulty}</div>
            </div>
            {companyName && (
              <div style={{ marginLeft: "auto", background: `${C.gold}25`, border: `1px solid ${C.gold}40`, borderRadius: 20, padding: "6px 14px", color: C.goldL, fontWeight: 700, fontSize: 12 }}>
                {companyName}
              </div>
            )}
          </div>
          {resumeProfile.topSkills?.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 6, fontWeight: 600, letterSpacing: .5 }}>DETECTED SKILLS</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {resumeProfile.topSkills.map((s, i) => (
                  <span key={i} style={{ background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.85)", fontSize: 12, padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {resumeProfile.keyProjects?.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 6, fontWeight: 600, letterSpacing: .5 }}>KEY PROJECTS</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {resumeProfile.keyProjects.map((p, i) => (
                  <span key={i} style={{ background: `${C.teal}30`, color: C.tealL, fontSize: 12, padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview questions */}
      <div style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 24, marginBottom: 20, boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 14 }}>
          Your personalized questions ({questions.length})
        </div>
        {questions.map((q, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12, paddingBottom: 12, borderBottom: i < questions.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: `${C.navy}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.navy, flexShrink: 0 }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.6 }}>{q.q}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                <Tag color={C.teal} bg={C.tealPale}>{q.type}</Tag>
                {q.whyAsked && <span style={{ fontSize: 11, color: C.muted, fontStyle: "italic" }}>{q.whyAsked}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {genErr && <div style={{ background: C.yellowPale, border: `1px solid ${C.gold}40`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: C.yellow, marginBottom: 14 }}>{genErr}</div>}

      <div style={{ background: `${C.navy}06`, border: `1px solid ${C.navy}10`, borderRadius: 12, padding: "14px 16px", marginBottom: 20, fontSize: 13, color: C.muted, lineHeight: 1.8 }}>
        <strong style={{ color: C.ink }}>How it works:</strong> You'll enter a full-screen interview room with camera on. Priya (AI interviewer) speaks each question out loud. When she finishes, your mic activates — 90 seconds to answer. Get instant feedback after each answer, then a full report.
      </div>

      <Btn v="gold" onClick={startInterview} style={{ width: "100%", padding: "16px", fontSize: 15, borderRadius: 12 }}>
        🎥 Enter Interview Room →
      </Btn>
    </div>
  );

  // ── FULLSCREEN ROOM ──
  if (step === "room") return (
    <FullscreenInterviewRoom
      role={{ title: jobTitle || "the role" }}
      companyName={companyName}
      questions={questions}
      qIndex={qIndex}
      phase={phase}
      aiSpeaking={aiSpeaking}
      listening={listening}
      liveText={liveText}
      interimText={interimText}
      timeLeft={timeLeft}
      instantFeedback={instantFeedback}
      loadingFeedback={loadingFeedback}
      onFinishAnswer={finishAnswer}
      onProceedNext={proceedNext}
      onEndInterview={endInterview}
      onToggleMic={() => setMicMuted(m => !m)}
      micMuted={micMuted}
      answers={answers}
    />
  );

  // ── GENERATING REPORT ──
  if (step === "genreport") return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 56, marginBottom: 18, animation: "float 2s ease-in-out infinite" }}>📋</div>
      <div style={{ fontWeight: 800, fontSize: 20, color: C.ink, marginBottom: 8 }}>Building your report…</div>
      <div style={{ color: C.muted, fontSize: 14, maxWidth: 320, margin: "0 auto 24px" }}>
        Reviewing all {answers.length} answers against your resume and {companyName ? `${companyName}'s hiring bar` : "the role requirements"}.
      </div>
      <Spin size={40} />
    </div>
  );

  // ── REPORT ──
  if (step === "report" && report) return (
    <div className="fade">
      <div style={{
        background: `linear-gradient(160deg,${C.navy},${C.navyL})`,
        borderRadius: 20, padding: "28px 22px", marginBottom: 16, color: "#fff"
      }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginBottom: 6, letterSpacing: 1 }}>
            {jobTitle || "Interview"}{companyName ? ` · ${companyName}` : ""} · {difficulty}
          </div>
          <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1 }}>{report.overallScore}%</div>
          <div style={{ marginTop: 8 }}>
            <Tag
              color={report.overallScore >= 75 ? C.green : report.overallScore >= 50 ? C.goldL : C.red}
              bg="rgba(255,255,255,.1)"
            >{report.verdict}</Tag>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginBottom: 18 }}>
          {[["Comm.", report.communicationScore], ["Technical", report.technicalScore], ["Confidence", report.confidenceScore], ["Structure", report.structureScore], ["Resume Fit", report.resumeAlignmentScore]].map(([l, v], i) => (
            <div key={i} style={{ textAlign: "center", background: "rgba(255,255,255,.07)", borderRadius: 10, padding: "10px 4px" }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{v}%</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", marginTop: 2, fontWeight: 600 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13.5, lineHeight: 1.8, color: "rgba(255,255,255,.8)", marginBottom: report.companyFitNote ? 12 : 0 }}>{report.summary}</div>
        {report.companyFitNote && (
          <div style={{ background: `${C.gold}18`, border: `1px solid ${C.gold}30`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.goldL }}>
            🏢 {report.companyFitNote}
          </div>
        )}
      </div>

      {report.strengths?.length > 0 && (
        <div style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: C.ink, fontSize: 14, marginBottom: 12 }}>✅ What worked well</div>
          {report.strengths.map((s, i) => (
            <div key={i} style={{ background: C.greenPale, borderRadius: 8, padding: "10px 13px", marginBottom: 7, fontSize: 13, color: C.inkSoft, border: `1px solid ${C.greenBorder}`, display: "flex", gap: 8 }}>
              <span style={{ color: C.green }}>✓</span><span>{s}</span>
            </div>
          ))}
        </div>
      )}

      {report.improvements?.length > 0 && (
        <div style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: C.ink, fontSize: 14, marginBottom: 12 }}>🎯 Areas to improve</div>
          {report.improvements.map((s, i) => (
            <div key={i} style={{ background: C.bg2, borderRadius: 8, padding: "10px 13px", marginBottom: 7, border: `1px solid ${C.border}`, display: "flex", gap: 9 }}>
              <span style={{ color: C.gold, fontWeight: 800, flexShrink: 0 }}>→</span>
              <span style={{ color: C.inkSoft, fontSize: 13 }}>{s}</span>
            </div>
          ))}
        </div>
      )}

      {report.nextSteps?.length > 0 && (
        <div style={{ background: C.bluePale, border: `1px solid ${C.blueL}30`, borderRadius: 14, padding: 18, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: C.blue, fontSize: 14, marginBottom: 12 }}>🚀 Next steps</div>
          {report.nextSteps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 8, fontSize: 13, color: C.inkSoft }}>
              <span style={{ color: C.blue, fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span>{s}
            </div>
          ))}
        </div>
      )}

      {report.perQuestion?.length > 0 && (
        <div style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: C.ink, fontSize: 14, marginBottom: 12 }}>🔍 Question by question</div>
          {report.perQuestion.map((p, i) => (
            <div key={i} style={{ background: C.bg2, borderRadius: 10, padding: "12px 14px", marginBottom: 9, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, gap: 8 }}>
                <div style={{ fontWeight: 600, color: C.ink, fontSize: 12.5 }}>Q{i + 1}. {p.question}</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: sc(p.score), flexShrink: 0 }}>{p.score}%</div>
              </div>
              <div style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.7 }}>{p.feedback}</div>
              <Bar score={p.score} color={sc(p.score)} />
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <Btn v="gold" onClick={() => { setStep("brief"); setAnswers([]); setQIndex(0); setReport(null); }} style={{ flex: 1, padding: "13px" }}>🔁 Retry Same Interview</Btn>
        <Btn v="ghost" onClick={() => { setStep("setup"); setAnswers([]); setQIndex(0); setReport(null); setQuestions([]); setResumeProfile(null); }} style={{ flex: 1, padding: "13px" }}>📄 New Resume</Btn>
      </div>
    </div>
  );

  return null;
}

// ── INTERVIEW MOCK (original, kept intact) ─────────────────────────────────────
function InterviewMock() {
  const [screen, setScreen] = useState("roles");
  const [catFilter, setCatFilter] = useState("All");
  const [role, setRole] = useState(null);
  const [difficulty, setDifficulty] = useState("Mid-level");
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [genErr, setGenErr] = useState("");
  const [loadingQs, setLoadingQs] = useState(false);

  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [timeLeft, setTimeLeft] = useState(90);
  const [phase, setPhase] = useState("idle");
  const [genReport, setGenReport] = useState(false);
  const [report, setReport] = useState(null);
  const [instantFeedback, setInstantFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const recogRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const timerRef = useRef(null);
  const QUESTION_TIME = 90;

  const speechOK = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const ttsOK = typeof window !== "undefined" && window.speechSynthesis;

  useEffect(() => () => {
    clearInterval(timerRef.current);
    stopRecognition();
    window.speechSynthesis?.cancel();
  }, []);

  const filteredRoles = catFilter === "All" ? ROLES : ROLES.filter(r => r.cat === catFilter);

  const pickRole = async (r) => {
    setRole(r); setScreen("brief"); setGenErr(""); setLoadingQs(true); setQuestions([]);
    try {
      const raw = await callGroq(`You are conducting a spoken job interview for the role of "${r.title}" (focus: ${r.focus}). Difficulty: ${difficulty}.
Generate exactly 6 interview questions spoken aloud in this order: 1 warm intro, 3 role-specific technical questions, 1 behavioral, 1 closing. Natural spoken language, no bullet symbols, no code blocks.
Return ONLY: {"questions":[{"q":"<question>","type":"Intro|Technical|Behavioral|Situational|Closing"}]}`, 900);
      const data = safeJSON(raw, null);
      const qs = data?.questions?.length === 6 ? data.questions : FALLBACK_QUESTIONS;
      setQuestions(qs);
    } catch {
      setGenErr("Using a standard question set.");
      setQuestions(FALLBACK_QUESTIONS);
    }
    setLoadingQs(false);
  };

  const speak = (text) => new Promise((resolve) => {
    if (!ttsOK) { resolve(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.97; u.pitch = 0.93;
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(v => /en-(US|GB|IN)/i.test(v.lang) && /Male|David|Daniel|Google/i.test(v.name))
           || voices.find(v => /en/i.test(v.lang));
    if (v) u.voice = v;
    setAiSpeaking(true);
    u.onend = () => { setAiSpeaking(false); resolve(); };
    u.onerror = () => { setAiSpeaking(false); resolve(); };
    window.speechSynthesis.speak(u);
  });

  const stopRecognition = () => {
    try { recogRef.current?.stop(); } catch {}
    setListening(false); setInterimText("");
  };

  const startRecognition = () => {
    if (!speechOK) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = true; rec.interimResults = true; rec.lang = "en-US";
    finalTranscriptRef.current = "";
    rec.onresult = (e) => {
      let final = "", interim = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      finalTranscriptRef.current = final;
      setLiveText(final.trim()); setInterimText(interim.trim());
    };
    rec.onerror = () => {};
    rec.onend = () => { if (phase === "answering") { try { rec.start(); } catch {} } };
    recogRef.current = rec;
    rec.start(); setListening(true);
  };

  const beginQuestion = async (idx) => {
    setPhase("speaking"); setLiveText(""); setInterimText(""); setInstantFeedback(null);
    finalTranscriptRef.current = "";
    await speak(questions[idx].q);
    setPhase("answering"); setTimeLeft(QUESTION_TIME); setListening(true); startRecognition();
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); finishAnswer(idx); return 0; } return t - 1; });
    }, 1000);
  };

  const finishAnswer = async (idx) => {
    clearInterval(timerRef.current); stopRecognition(); setPhase("done-q");
    const finalAnswer = (finalTranscriptRef.current || liveText || "").trim() || "(no answer captured)";
    const newAnswer = { question: questions[idx].q, type: questions[idx].type, answer: finalAnswer };
    setAnswers(prev => { const n = [...prev]; n[idx] = newAnswer; return n; });
    setLoadingFeedback(true);
    try {
      const raw = await callGroq(`You are a strict but fair senior interviewer. Score this single answer for the role "${role?.title}" at ${difficulty} level.
Question (${questions[idx].type}): ${questions[idx].q}
Candidate answer: ${finalAnswer.slice(0, 800)}
Return ONLY: {"score":<0-100>,"tip":"<1-2 sentence specific feedback>","what_was_good":"<1 sentence or null>"}`, 400);
      const fb = safeJSON(raw, { score: 50, tip: "Keep practicing!", what_was_good: null });
      setInstantFeedback(fb);
    } catch {
      setInstantFeedback({ score: 50, tip: "Could not load instant feedback.", what_was_good: null });
    }
    setLoadingFeedback(false);
  };

  const proceedNext = (idx) => {
    setInstantFeedback(null);
    if (idx + 1 < questions.length) { setQIndex(idx + 1); beginQuestion(idx + 1); }
    else wrapInterview();
  };

  const startInterview = () => {
    setScreen("live"); setAnswers([]); setQIndex(0); setInstantFeedback(null);
    setTimeout(() => beginQuestion(0), 400);
  };

  const wrapInterview = async () => {
    setPhase("idle"); setGenReport(true);
    try {
      const transcript = answers.map((a, i) => `Q${i + 1} (${a.type}): ${a.question}\nAnswer: ${a.answer}`).join("\n\n");
      const raw = await callGroq(`You are a strict senior hiring panelist. You just interviewed a candidate for "${role.title}" (${difficulty}).
Full interview:
${transcript.slice(0, 4000)}
Return ONLY:
{"overallScore":<0-100>,"verdict":"<Strong Hire|Hire|Borderline|No Hire>","communicationScore":<0-100>,"technicalScore":<0-100>,"confidenceScore":<0-100>,"structureScore":<0-100>,"summary":"<3 sentence honest assessment>","perQuestion":[{"question":"<short version>","score":<0-100>,"feedback":"<1-2 sentence specific>"}],"strengths":["<1>","<2>"],"improvements":["<1>","<2>","<3>"]}`, 2200);
      const data = safeJSON(raw, null);
      if (!data?.overallScore) throw new Error("bad");
      setReport(data);
    } catch {
      setReport({ overallScore: 0, verdict: "—", communicationScore: 0, technicalScore: 0, confidenceScore: 0, structureScore: 0, summary: "Couldn't generate feedback. Try again.", perQuestion: [], strengths: [], improvements: [] });
    }
    setGenReport(false); setScreen("report");
  };

  const restart = () => {
    window.speechSynthesis?.cancel(); stopRecognition(); clearInterval(timerRef.current);
    setScreen("roles"); setRole(null); setQuestions([]); setAnswers([]);
    setQIndex(0); setReport(null); setInstantFeedback(null);
  };

  const sc = s => s >= 75 ? C.green : s >= 50 ? C.gold : C.red;

  if (screen === "roles") return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 22, color: C.ink, marginBottom: 5 }}>🎤 Quick Mock Interview</div>
        <div style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.7 }}>
          Pick a role — no resume needed. The AI asks generic role-based questions. For personalized questions based on YOUR resume, use the <strong>Resume Interview</strong> tab.
        </div>
      </div>
      {!speechOK && (
        <div style={{ background: C.yellowPale, border: `1px solid ${C.gold}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, color: C.yellow, fontSize: 12 }}>
          ⚠ Voice recognition needs Chrome on desktop or Android.
        </div>
      )}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {CATS.map(c => <Pill key={c} active={catFilter === c} onClick={() => setCatFilter(c)}>{c}</Pill>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
        {filteredRoles.map(r => (
          <div key={r.id} className="lift" onClick={() => pickRole(r)}
            style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 16, padding: "18px 16px", boxShadow: "0 1px 6px rgba(0,0,0,.04)", borderTop: `3px solid ${C.navy}18` }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{r.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: C.ink, marginBottom: 4 }}>{r.title}</div>
            <div style={{ color: C.muted, fontSize: 11.5, lineHeight: 1.65, marginBottom: 10 }}>{r.focus}</div>
            <Tag color={C.teal}>{r.cat}</Tag>
          </div>
        ))}
      </div>
    </div>
  );

  if (screen === "brief") return (
    <div className="fade" style={{ maxWidth: 520, margin: "0 auto" }}>
      <button onClick={() => setScreen("roles")} style={{ background: "none", border: "none", color: C.muted, fontSize: 12, cursor: "pointer", marginBottom: 16, fontFamily: "'Inter',sans-serif" }}>← Choose different role</button>
      <div style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ width: 60, height: 60, background: `${C.navy}08`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>{role.icon}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 19, color: C.ink }}>{role.title}</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{role.focus}</div>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.ink, marginBottom: 10 }}>Experience level</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Entry-level", "Mid-level", "Senior"].map(d => (
              <button key={d} onClick={() => setDifficulty(d)} style={{ flex: 1, padding: "10px 4px", borderRadius: 10, border: `1.5px solid ${difficulty === d ? C.gold : C.border}`, background: difficulty === d ? C.goldPale : "#fff", color: difficulty === d ? C.gold : C.muted, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>{d}</button>
            ))}
          </div>
        </div>
        {loadingQs ? (
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <Spin size={32} />
            <div style={{ color: C.muted, fontSize: 13, marginTop: 12 }}>Preparing questions…</div>
          </div>
        ) : (
          <>
            {genErr && <div style={{ background: C.yellowPale, border: `1px solid ${C.gold}40`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: C.yellow, marginBottom: 12 }}>{genErr}</div>}
            <Btn v="gold" onClick={startInterview} disabled={!questions.length} style={{ width: "100%", padding: "15px", fontSize: 15, borderRadius: 12 }}>🎙️ Start Interview</Btn>
          </>
        )}
      </div>
    </div>
  );

  if (screen === "live") {
    const q = questions[qIndex];
    const pct = (timeLeft / QUESTION_TIME) * 100;
    const timeColor = pct > 40 ? C.teal : pct > 15 ? C.gold : C.red;
    const showFeedback = phase === "done-q" && (instantFeedback || loadingFeedback);
    return (
      <div className="fade">
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Tag color={C.navy} bg={`${C.navy}0e`}>{role.icon} {role.title}</Tag>
            <div style={{ display: "flex", gap: 4 }}>
              {questions.map((_, i) => (
                <div key={i} style={{ width: 28, height: 4, borderRadius: 3, background: i < qIndex ? C.green : i === qIndex ? C.gold : C.border, transition: "background .3s" }} />
              ))}
            </div>
            <Tag color={C.muted} bg={C.bg2}>Q {qIndex + 1} / {questions.length}</Tag>
          </div>
        </div>
        <div style={{ background: `linear-gradient(170deg,${C.navy} 0%,${C.navyL} 60%,#1e3a6e 100%)`, borderRadius: 22, padding: "26px 20px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,146,42,.12),transparent 65%)", pointerEvents: "none" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, position: "relative", zIndex: 1 }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ width: 74, height: 74, borderRadius: "50%", margin: "0 auto 10px", background: "linear-gradient(135deg,#1a2d50,#2a4070)", display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${aiSpeaking ? C.gold : "rgba(255,255,255,.12)"}`, animation: aiSpeaking ? "pulseGlow 1.5s infinite" : "none", transition: "border-color .3s", overflow: "hidden" }}>
                <AIInterviewerFace speaking={aiSpeaking} size={74} />
              </div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>AI Interviewer</div>
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 3, color: aiSpeaking ? C.goldL : "rgba(255,255,255,.35)" }}>{aiSpeaking ? "Speaking…" : "Listening"}</div>
            </div>
            <div style={{ color: "rgba(255,255,255,.2)", fontSize: 18, paddingTop: 28 }}>⇆</div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ width: 74, height: 74, borderRadius: "50%", margin: "0 auto 10px", background: "linear-gradient(135deg,#0c4a44,#14706a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: `3px solid ${listening ? C.tealL : "rgba(255,255,255,.12)"}`, animation: listening ? "tealGlow 1.5s infinite" : "none", transition: "border-color .3s" }}>🧑</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>You</div>
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 3, color: listening ? C.tealL : "rgba(255,255,255,.35)" }}>{listening ? "Mic live" : "Stand by"}</div>
            </div>
          </div>
          <div style={{ marginTop: 22, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "14px 16px", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Tag color={C.goldL} bg="rgba(200,146,42,.18)">{q?.type}</Tag>
              {phase === "answering" && <span style={{ color: timeColor, fontWeight: 800, fontSize: 13 }}>⏱ {fmtTime(timeLeft)}</span>}
            </div>
            <div style={{ color: "#fff", fontSize: 15, lineHeight: 1.65, fontWeight: 500 }}>{q?.q}</div>
            {phase === "answering" && (
              <div style={{ height: 3, background: "rgba(255,255,255,.12)", borderRadius: 3, marginTop: 12, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: timeColor, borderRadius: 3, transition: "width 1s linear" }} />
              </div>
            )}
          </div>
        </div>
        <div style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12, minHeight: showFeedback ? 60 : 100, transition: "min-height .3s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>Your Answer</div>
            {listening && <div style={{ display: "flex", gap: 2, alignItems: "center" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: C.teal, animation: "pulse 1s infinite" }} /><span style={{ fontSize: 10, color: C.teal, fontWeight: 700 }}>LIVE</span></div>}
          </div>
          {phase === "speaking" && <div style={{ color: C.soft, fontSize: 13.5, fontStyle: "italic" }}>The interviewer is asking…</div>}
          {phase === "answering" && (
            <div style={{ fontSize: 14, lineHeight: 1.8, color: C.ink }}>
              {liveText && <span>{liveText}</span>}
              {interimText && <span style={{ color: C.soft, fontStyle: "italic" }}>{liveText ? " " : ""}{interimText}</span>}
              {!liveText && !interimText && <span style={{ color: C.soft, fontSize: 13, fontStyle: "italic" }}>Start speaking…</span>}
            </div>
          )}
          {phase === "done-q" && liveText && <div style={{ fontSize: 13.5, lineHeight: 1.8, color: C.inkSoft }}>{liveText}</div>}
        </div>
        {phase === "done-q" && loadingFeedback && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: C.bg2, borderRadius: 12, fontSize: 13, color: C.muted }}>
            <Spin size={16} /> Scoring…
          </div>
        )}
        {showFeedback && !loadingFeedback && (
          <InstantFeedback feedback={instantFeedback} onNext={() => proceedNext(qIndex)} isLast={qIndex + 1 >= questions.length} />
        )}
        {phase === "answering" && (
          <>
            <Btn v="primary" onClick={() => finishAnswer(qIndex)} style={{ width: "100%", padding: "13px", borderRadius: 12 }}>✅ Done answering</Btn>
            {!speechOK && <textarea placeholder="Type your answer here…" onChange={e => { finalTranscriptRef.current = e.target.value; setLiveText(e.target.value); }} style={{ ...inp, minHeight: 90, marginTop: 10 }} />}
          </>
        )}
      </div>
    );
  }

  if (genReport) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 56, marginBottom: 18, animation: "float 2s ease-in-out infinite" }}>📋</div>
      <div style={{ fontWeight: 800, fontSize: 19, color: C.ink, marginBottom: 8 }}>Generating report…</div>
      <Spin size={36} />
    </div>
  );

  if (screen === "report" && report) return (
    <div className="fade">
      <div style={{ background: `linear-gradient(160deg,${C.navy},${C.navyL})`, borderRadius: 20, padding: "28px 22px", marginBottom: 16, color: "#fff" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 6, letterSpacing: 1 }}>{role.icon} {role.title} · {difficulty}</div>
          <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1 }}>{report.overallScore}%</div>
          <div style={{ marginTop: 8 }}><Tag color={report.overallScore >= 75 ? C.green : report.overallScore >= 50 ? C.goldL : C.red} bg="rgba(255,255,255,.1)">{report.verdict}</Tag></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 18 }}>
          {[["Comm.", report.communicationScore], ["Technical", report.technicalScore], ["Confidence", report.confidenceScore], ["Structure", report.structureScore]].map(([l, v], i) => (
            <div key={i} style={{ textAlign: "center", background: "rgba(255,255,255,.07)", borderRadius: 10, padding: "10px 4px" }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{v}%</div>
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.55)", marginTop: 2, fontWeight: 600 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,.8)", textAlign: "center" }}>{report.summary}</div>
      </div>
      {report.strengths?.length > 0 && (
        <div style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: C.ink, fontSize: 14, marginBottom: 12 }}>✅ What worked well</div>
          {report.strengths.map((s, i) => (<div key={i} style={{ background: C.greenPale, borderRadius: 8, padding: "10px 13px", marginBottom: 7, fontSize: 13, color: C.inkSoft, border: `1px solid ${C.greenBorder}`, display: "flex", gap: 8 }}><span style={{ color: C.green }}>✓</span><span>{s}</span></div>))}
        </div>
      )}
      {report.improvements?.length > 0 && (
        <div style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: C.ink, fontSize: 14, marginBottom: 12 }}>🎯 Improve</div>
          {report.improvements.map((s, i) => (<div key={i} style={{ background: C.bg2, borderRadius: 8, padding: "10px 13px", marginBottom: 7, border: `1px solid ${C.border}`, display: "flex", gap: 9 }}><span style={{ color: C.gold, fontWeight: 800, flexShrink: 0 }}>→</span><span style={{ color: C.inkSoft, fontSize: 13 }}>{s}</span></div>))}
        </div>
      )}
      {report.perQuestion?.length > 0 && (
        <div style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: C.ink, fontSize: 14, marginBottom: 12 }}>🔍 Q by Q</div>
          {report.perQuestion.map((p, i) => (
            <div key={i} style={{ background: C.bg2, borderRadius: 10, padding: "12px 14px", marginBottom: 9, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, gap: 8 }}><div style={{ fontWeight: 600, color: C.ink, fontSize: 12.5 }}>Q{i + 1}. {p.question}</div><div style={{ fontWeight: 800, fontSize: 13, color: sc(p.score), flexShrink: 0 }}>{p.score}%</div></div>
              <div style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.7 }}>{p.feedback}</div>
              <Bar score={p.score} color={sc(p.score)} />
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        <Btn v="gold" onClick={() => pickRole(role)} style={{ flex: 1, padding: "13px" }}>🔁 Retry</Btn>
        <Btn v="ghost" onClick={restart} style={{ flex: 1, padding: "13px" }}>🎲 Other Role</Btn>
      </div>
    </div>
  );

  return null;
}

// ── JOBS TAB ───────────────────────────────────────────────────────────────────
function JobsTab() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => sessionStorage.getItem("tp_s") || "fresher");
  const [location, setLocation] = useState(() => sessionStorage.getItem("tp_l") || "india");
  const [expanded, setExpanded] = useState(null);
  const [saved, setSaved] = useState([]);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async (q = search, loc = location) => {
    setLoading(true);
    sessionStorage.setItem("tp_s", q); sessionStorage.setItem("tp_l", loc);
    try {
      const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&what=${encodeURIComponent(q)}&where=${encodeURIComponent(loc)}&sort_by=date&content-type=application/json`;
      const res = await fetch(url);
      const data = await res.json();
      setJobs(data.results?.length ? data.results.map(j => ({
        id: j.id, title: j.title, company: j.company?.display_name || "Company",
        location: j.location?.display_name || loc,
        salary: j.salary_min ? `₹${Math.round(j.salary_min / 100000)}–${Math.round((j.salary_max || j.salary_min * 1.4) / 100000)} LPA` : "Competitive",
        description: j.description || "", desc200: (j.description || "").slice(0, 200),
        url: j.redirect_url,
        posted: new Date(j.created).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        category: j.category?.label || "Technology",
      })) : []);
    } catch {}
    setLoading(false);
  };

  const quickRoles = ["Fresher", "React Developer", "Node.js", "Data Analyst", "Python", "Java", "Full Stack", "DevOps", "AI ML", "UI UX"];

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 22, color: C.ink, marginBottom: 4 }}>🔥 Live Job Feed</div>
      <div style={{ color: C.muted, fontSize: 13.5, marginBottom: 16, lineHeight: 1.7 }}>Real fresher openings from companies across India · Updated daily</div>
      <div style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 5, textTransform: "uppercase", letterSpacing: .5 }}>Role / Keyword</div>
            <input style={inp} placeholder="e.g. fresher, React, Python…" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchJobs()} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 5, textTransform: "uppercase", letterSpacing: .5 }}>Location</div>
            <input style={inp} placeholder="e.g. india, hyderabad…" value={location} onChange={e => setLocation(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchJobs()} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
          {quickRoles.map(r => <Pill key={r} active={search === r.toLowerCase()} onClick={() => { setSearch(r.toLowerCase()); fetchJobs(r.toLowerCase(), location); }}>{r}</Pill>)}
        </div>
        <Btn v="primary" onClick={() => fetchJobs()} style={{ width: "100%" }}>🔍 Search Jobs</Btn>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>Results</div>
        {!loading && jobs.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.greenPale, borderRadius: 20, padding: "4px 12px", border: `1px solid ${C.greenBorder}` }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "pulse 1.5s infinite" }} />
            <span style={{ color: C.green, fontSize: 11, fontWeight: 700 }}>{jobs.length} live jobs</span>
          </div>
        )}
      </div>
      {loading && <div style={{ textAlign: "center", padding: "60px 0" }}><Spin size={36} /></div>}
      {!loading && jobs.map((job, i) => {
        const isExp = expanded === job.id, isSaved = saved.includes(job.id);
        return (
          <div key={job.id} className="lift" style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 8, borderLeft: `4px solid ${C.navy}`, boxShadow: "0 1px 5px rgba(0,0,0,.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{job.title}</div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{job.company} · {job.location}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ color: C.green, fontWeight: 800, fontSize: 13 }}>{job.salary}</div>
                <div style={{ color: C.muted, fontSize: 11, marginTop: 1 }}>{job.posted}</div>
              </div>
            </div>
            <div style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.7, marginBottom: 12, background: C.bg2, borderRadius: 8, padding: "8px 10px" }}>
              {isExp ? job.description.replace(/<[^>]+>/g, "") : job.desc200.replace(/<[^>]+>/g, "") + (job.description.length > 200 ? "…" : "")}
              {job.description.length > 200 && <button onClick={() => setExpanded(isExp ? null : job.id)} style={{ background: "none", border: "none", color: C.gold, fontSize: 11, cursor: "pointer", marginLeft: 5, fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>{isExp ? "Less ▲" : "Read more ▼"}</button>}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Tag color={C.teal}>{job.category}</Tag>
              <div style={{ display: "flex", gap: 7 }}>
                <button onClick={() => setSaved(s => s.includes(job.id) ? s.filter(x => x !== job.id) : [...s, job.id])} style={{ padding: "6px 11px", borderRadius: 8, border: `1.5px solid ${isSaved ? C.gold : C.border}`, background: isSaved ? C.goldPale : "transparent", cursor: "pointer", fontSize: 13, color: isSaved ? C.gold : C.muted, fontFamily: "'Inter',sans-serif" }}>{isSaved ? "★" : "☆"}</button>
                <Btn v="primary" onClick={() => window.open(job.url, "_blank")} small>Apply →</Btn>
              </div>
            </div>
          </div>
        );
      })}
      {!loading && jobs.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}><div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>No jobs found. Try a different role or city.</div>}
    </div>
  );
}

// ── LANDING PAGE ──────────────────────────────────────────────────────────────
function LandingPage({ onStart }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const reviews = [
    { name: "Priya M.", role: "SDE @ Wipro", text: "I pasted my resume and entered 'Wipro'. The AI asked specifically about my TCS internship project and how it applies to Wipro's scale. That's exactly what happened in the real interview.", avatar: "PM", score: 87 },
    { name: "Arun K.", role: "Data Analyst @ TCS", text: "The camera room made it real. Seeing yourself on screen while an AI interviewer speaks to you — you can't fake it. Fixed my eye contact issues before the real thing.", avatar: "AK", score: 79 },
    { name: "Sneha R.", role: "Full Stack Dev @ Infosys", text: "Resume interview + Amazon = questions about system design from MY projects. They asked about my TakePlace app's architecture. I was so ready.", avatar: "SR", score: 92 },
  ];

  return (
    <div style={{ background: "#fff", color: C.ink, fontFamily: "'Inter',sans-serif", overflowX: "hidden" }}>
      <style>{CSS}</style>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? "rgba(255,255,255,.97)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all .3s", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
          <div style={{ fontWeight: 900, fontSize: 22, color: scrolled ? C.navy : "#fff", letterSpacing: -.5 }}>🎤 TakePlace</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={onStart} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 14, color: scrolled ? C.muted : "rgba(255,255,255,.75)", padding: "8px 12px" }}>Sign In</button>
            <Btn v={scrolled ? "gold" : "white"} onClick={onStart} style={{ padding: "9px 22px", fontSize: 14 }}>Start Free →</Btn>
          </div>
        </div>
      </nav>
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden", background: `linear-gradient(160deg,${C.navy} 0%,${C.navyL} 50%,#1e3a6e 100%)`, color: "#fff" }}>
        <div style={{ position: "absolute", top: "8%", right: "5%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle,${C.gold}14,transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ textAlign: "center", maxWidth: 800, position: "relative", zIndex: 1 }}>
          <div className="fade" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.gold}16`, border: `1px solid ${C.gold}35`, borderRadius: 24, padding: "7px 18px", marginBottom: 30, fontSize: 12.5, color: C.goldL, fontWeight: 700 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.goldL, display: "inline-block", animation: "pulse 1.5s infinite" }} />
            India's only resume-personalized AI interview — with live camera
          </div>
          <h1 className="fade" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(38px,6vw,66px)", lineHeight: 1.08, marginBottom: 24, animationDelay: ".1s" }}>
            Your resume.<br />Their company.<br /><span style={{ color: C.goldL }}>One real interview.</span>
          </h1>
          <p className="fade" style={{ fontSize: 17, color: "rgba(255,255,255,.72)", lineHeight: 1.8, marginBottom: 44, maxWidth: 560, margin: "0 auto 44px", animationDelay: ".2s" }}>
            Paste your resume. Enter the company name. Our AI interviewer reads your actual experience and asks the questions a real hiring manager would ask <em>you specifically</em> — on camera, on mic, on the clock.
          </p>
          <div className="fade" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animationDelay: ".3s" }}>
            <Btn v="gold" onClick={onStart} style={{ padding: "16px 40px", fontSize: 16, borderRadius: 12 }}>🎙️ Start Resume Interview — Free</Btn>
            <Btn v="outline" onClick={onStart} style={{ padding: "16px 28px", fontSize: 16, borderRadius: 12 }}>Browse Live Jobs →</Btn>
          </div>
        </div>
      </section>

      <section style={{ padding: "90px 24px", background: C.bg2 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 11, color: C.purple, fontWeight: 800, letterSpacing: 3, marginBottom: 10, textTransform: "uppercase" }}>Real results</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 36, color: C.ink }}>They practiced here first.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 18 }}>
            {reviews.map((r, i) => (
              <div key={i} className="lift" style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 20, padding: 28, boxShadow: "0 2px 14px rgba(0,0,0,.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  {[...Array(5)].map((_, j) => <span key={j} style={{ color: C.gold, fontSize: 14 }}>★</span>)}
                  <span style={{ marginLeft: 4, background: C.greenPale, color: C.green, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, border: `1px solid ${C.greenBorder}` }}>{r.score}%</span>
                </div>
                <div style={{ color: C.inkSoft, fontSize: 13.5, lineHeight: 1.8, marginBottom: 18 }}>"{r.text}"</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${C.navy},${C.navyL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#fff" }}>{r.avatar}</div>
                  <div><div style={{ fontWeight: 700, color: C.ink, fontSize: 13.5 }}>{r.name}</div><div style={{ color: C.muted, fontSize: 12 }}>{r.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "90px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div className="float" style={{ fontSize: 52, marginBottom: 16 }}>🎤</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 36, color: C.ink, marginBottom: 12 }}>Your next interview is real.<br />This one can be too.</h2>
          <p style={{ color: C.muted, fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>Camera on. Mic live. AI reads your resume. Company style matched. Full debrief at the end.</p>
          <Btn v="gold" onClick={onStart} style={{ padding: "16px 48px", fontSize: 16, borderRadius: 12 }}>Start Free Now →</Btn>
        </div>
      </section>
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "28px 24px", textAlign: "center", background: "#fff" }}>
        <div style={{ color: C.muted, fontSize: 12 }}>© 2026 TakePlace · Built by Raghu Dadigela · <a href="mailto:support@takeplace.in" style={{ color: C.navy, fontWeight: 600 }}>support@takeplace.in</a></div>
      </footer>
    </div>
  );
}

// ── AUTH PAGE ─────────────────────────────────────────────────────────────────
function AuthPage({ onLogin, onBack }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleGoogle = async () => {
    setGLoading(true); setErr("");
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
    if (error) { setErr(error.message); setGLoading(false); }
  };

  const handle = async () => {
    setErr(""); setMsg(""); setLoading(true);
    try {
      if (mode === "register") {
        if (!form.name || !form.email || !form.password) throw new Error("All fields required");
        if (form.password.length < 6) throw new Error("Password must be 6+ characters");
        const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.name } } });
        if (error) throw error;
        setMsg("✅ Account created! Check email to verify, then sign in.");
        setMode("login");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        onLogin(data.user);
      }
    } catch (e) { setErr(e.message || "Something went wrong"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg,${C.navy} 0%,${C.navyL} 60%,#1e3a6e 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{CSS}</style>
      <div className="fade" style={{ width: "100%", maxWidth: 400, background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 24, padding: 32, boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, fontSize: 12, cursor: "pointer", marginBottom: 20, fontFamily: "'Inter',sans-serif" }}>← Back</button>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div style={{ fontSize: 40, marginBottom: 6 }}>🎤</div>
          <div style={{ fontWeight: 900, fontSize: 24, color: C.navy }}>TakePlace</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{mode === "login" ? "Welcome back 👋" : "Create your free account ✨"}</div>
        </div>
        <button onClick={handleGoogle} disabled={gLoading} style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "#fff", color: C.ink, fontSize: 14, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 }}>
          {gLoading ? <Spin size={16} /> : <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>}
          Continue with Google
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} /><span style={{ color: C.muted, fontSize: 12 }}>or</span><div style={{ flex: 1, height: 1, background: C.border }} />
        </div>
        <div style={{ display: "flex", background: C.bg2, borderRadius: 10, padding: 4, marginBottom: 18 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setErr(""); setMsg(""); }} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13, transition: "all .2s", background: mode === m ? "#fff" : "transparent", color: mode === m ? C.navy : C.muted, boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,.08)" : "none" }}>
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mode === "register" && <input style={inp} placeholder="Full name" value={form.name} onChange={e => set("name", e.target.value)} />}
          <input style={inp} placeholder="Email address" type="email" value={form.email} onChange={e => set("email", e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} />
          <input style={inp} placeholder="Password" type="password" value={form.password} onChange={e => set("password", e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} />
        </div>
        {err && <div style={{ color: C.red, fontSize: 12, marginTop: 10, background: C.redPale, padding: "8px 12px", borderRadius: 8 }}>⚠ {err}</div>}
        {msg && <div style={{ color: C.green, fontSize: 12, marginTop: 10, background: C.greenPale, padding: "8px 12px", borderRadius: 8 }}>{msg}</div>}
        <Btn v="gold" onClick={handle} loading={loading} style={{ width: "100%", marginTop: 16, padding: "13px", fontSize: 15 }}>
          {mode === "login" ? "Sign In →" : "Create Account →"}
        </Btn>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
function MainApp({ user, onLogout }) {
  const [tab, setTab] = useState(() => parseInt(sessionStorage.getItem("tp_tab") || "0"));
  const [menuOpen, setMenuOpen] = useState(false);
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const setTabP = (t) => { setTab(t); sessionStorage.setItem("tp_tab", t); };

  const TABS = [
    { icon: "🎯", label: "Resume Interview", id: 0 },
    { icon: "🎤", label: "Quick Mock", id: 1 },
    { icon: "🔥", label: "Live Jobs", id: 2 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg2, fontFamily: "'Inter',sans-serif", paddingBottom: 80 }}>
      <style>{CSS}
        {`
          @media(min-width:640px){.bottom-nav-wrap{display:none!important;}.top-tab-bar{display:flex!important;}}
          @media(max-width:639px){.top-tab-bar{display:none!important;}.bottom-nav-wrap{display:flex!important;}}
        `}
      </style>
      <div style={{ background: "#fff", borderBottom: `1.5px solid ${C.border}`, padding: "0 20px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 10px rgba(0,0,0,.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ fontWeight: 900, fontSize: 20, color: C.navy }}>🎤 TakePlace</div>
          <div className="top-tab-bar" style={{ display: "none", gap: 2 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTabP(t.id)} style={{ padding: "8px 18px", border: "none", background: "transparent", cursor: "pointer", color: tab === t.id ? C.gold : C.muted, fontFamily: "'Inter',sans-serif", fontWeight: tab === t.id ? 700 : 500, fontSize: 13.5, borderBottom: `2.5px solid ${tab === t.id ? C.gold : "transparent"}`, transition: "all .2s", display: "flex", alignItems: "center", gap: 5 }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(m => !m)} style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.navy},${C.navyL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#fff", border: "none", cursor: "pointer" }}>{initials}</button>
            {menuOpen && (
              <div style={{ position: "absolute", right: 0, top: 44, background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,.12)", padding: 8, minWidth: 160, zIndex: 50 }}>
                <div style={{ padding: "8px 10px", fontSize: 12, color: C.muted, borderBottom: `1px solid ${C.border}`, marginBottom: 6 }}>{name}</div>
                <button onClick={onLogout} style={{ width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, border: "none", background: "transparent", color: C.red, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>🚪 Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "22px 16px" }}>
        {tab === 0 && <ResumeInterviewTab />}
        {tab === 1 && <InterviewMock />}
        {tab === 2 && <JobsTab />}
      </div>
      <div className="bottom-nav-wrap bottom-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: `1.5px solid ${C.border}`, display: "flex", zIndex: 200, boxShadow: "0 -4px 20px rgba(0,0,0,.07)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTabP(t.id)} style={{ flex: 1, padding: "10px 4px 8px", border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: tab === t.id ? C.gold : C.muted, fontFamily: "'Inter',sans-serif", transition: "all .15s" }}>
            <div style={{ width: 32, height: 3, borderRadius: 2, background: tab === t.id ? C.gold : "transparent", marginBottom: 2, transition: "background .2s" }} />
            <span style={{ fontSize: 20, lineHeight: 1 }}>{t.icon}</span>
            <span style={{ fontSize: 9.5, fontWeight: tab === t.id ? 700 : 500, letterSpacing: .3 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("landing");

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); setPage("app"); }
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) { setUser(session.user); setPage("app"); }
      else { setUser(null); setPage("landing"); }
    });
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <style>{CSS}</style>
      <span style={{ fontSize: 40 }}>🎤</span>
      <Spin size={36} />
      <div style={{ color: C.muted, fontSize: 14, fontFamily: "'Inter',sans-serif" }}>Loading TakePlace…</div>
    </div>
  );

  if (page === "landing") return <LandingPage onStart={() => setPage("auth")} />;
  if (page === "auth") return <AuthPage onLogin={u => { setUser(u); setPage("app"); }} onBack={() => setPage("landing")} />;
  return <MainApp user={user} onLogout={() => supabase.auth.signOut()} />;
}
