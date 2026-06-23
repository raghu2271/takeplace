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

// ── DESIGN TOKENS ────────────────────────────────────────────────────────────
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
  @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
  @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
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
`;

const inp = {
  width: "100%", background: "#fff", border: `1.5px solid ${C.border}`,
  borderRadius: 10, padding: "12px 14px", color: C.ink, fontSize: 14,
  fontFamily: "'Inter',sans-serif", outline: "none", transition: "border-color .2s",
};

// ── MICRO COMPONENTS ─────────────────────────────────────────────────────────
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

// ── ROLE LIBRARY ─────────────────────────────────────────────────────────────
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

// ── INSTANT FEEDBACK CARD ─────────────────────────────────────────────────────
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

// ── INTERVIEW ROOM ────────────────────────────────────────────────────────────
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

  // live state
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [timeLeft, setTimeLeft] = useState(90);
  const [phase, setPhase] = useState("idle");
  const [genReport, setGenReport] = useState(false);
  const [report, setReport] = useState(null);

  // instant feedback per question
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
    setListening(false);
    setInterimText("");
  };

  const startRecognition = () => {
    if (!speechOK) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    finalTranscriptRef.current = "";

    rec.onresult = (e) => {
      let final = "", interim = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      finalTranscriptRef.current = final;
      // Show final text in main transcript, interim separately
      setLiveText(final.trim());
      setInterimText(interim.trim());
    };

    rec.onerror = () => {};
    rec.onend = () => {
      if (phase === "answering") { try { rec.start(); } catch {} }
    };
    recogRef.current = rec;
    rec.start();
    setListening(true);
  };

  const beginQuestion = async (idx) => {
    setPhase("speaking");
    setLiveText("");
    setInterimText("");
    setInstantFeedback(null);
    finalTranscriptRef.current = "";
    await speak(questions[idx].q);
    setPhase("answering");
    setTimeLeft(QUESTION_TIME);
    setListening(true);
    startRecognition();
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); finishAnswer(idx); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const finishAnswer = async (idx) => {
    clearInterval(timerRef.current);
    stopRecognition();
    setPhase("done-q");
    const finalAnswer = (finalTranscriptRef.current || liveText || "").trim() || "(no answer captured)";
    const newAnswer = { question: questions[idx].q, type: questions[idx].type, answer: finalAnswer };
    setAnswers(prev => { const n = [...prev]; n[idx] = newAnswer; return n; });

    // ── INSTANT per-question AI feedback ──
    setLoadingFeedback(true);
    try {
      const raw = await callGroq(`You are a strict but fair senior interviewer. Score this single answer for the role "${role?.title}" at ${difficulty} level.
Question (${questions[idx].type}): ${questions[idx].q}
Candidate answer: ${finalAnswer.slice(0, 800)}
Return ONLY: {"score":<0-100>,"tip":"<1-2 sentence specific feedback>","what_was_good":"<1 sentence or null>"}`, 400);
      const fb = safeJSON(raw, { score: 50, tip: "Keep practicing!", what_was_good: null });
      setInstantFeedback(fb);
    } catch {
      setInstantFeedback({ score: 50, tip: "Could not load instant feedback. Your answer was recorded.", what_was_good: null });
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
    setScreen("live");
    setAnswers([]); setQIndex(0); setInstantFeedback(null);
    setTimeout(() => beginQuestion(0), 400);
  };

  const wrapInterview = async () => {
    setPhase("idle");
    setGenReport(true);
    try {
      const transcript = answers.map((a, i) =>
        `Q${i + 1} (${a.type}): ${a.question}\nAnswer: ${a.answer}`
      ).join("\n\n");
      const raw = await callGroq(`You are a strict senior hiring panelist. You just interviewed a candidate for "${role.title}" (${difficulty}).
Full interview:
${transcript.slice(0, 4000)}

Score honestly. Return ONLY:
{"overallScore":<0-100>,"verdict":"<Strong Hire|Hire|Borderline|No Hire>","communicationScore":<0-100>,"technicalScore":<0-100>,"confidenceScore":<0-100>,"structureScore":<0-100>,"summary":"<3 sentence honest assessment, speak to candidate as you>","perQuestion":[{"question":"<short version>","score":<0-100>,"feedback":"<1-2 sentence specific>"}],"strengths":["<1>","<2>"],"improvements":["<1>","<2>","<3>"]}`, 2200);
      const data = safeJSON(raw, null);
      if (!data?.overallScore) throw new Error("bad");
      setReport(data);
    } catch {
      setReport({
        overallScore: 0, verdict: "—", communicationScore: 0, technicalScore: 0,
        confidenceScore: 0, structureScore: 0,
        summary: "We couldn't generate feedback this time. Please try again.",
        perQuestion: [], strengths: [], improvements: []
      });
    }
    setGenReport(false);
    setScreen("report");
  };

  const restart = () => {
    window.speechSynthesis?.cancel(); stopRecognition(); clearInterval(timerRef.current);
    setScreen("roles"); setRole(null); setQuestions([]); setAnswers([]);
    setQIndex(0); setReport(null); setInstantFeedback(null);
  };

  const sc = s => s >= 75 ? C.green : s >= 50 ? C.gold : C.red;

  // ── SCREEN: ROLE PICKER ──────────────────────────────────────────────────
  if (screen === "roles") return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 22, color: C.ink, marginBottom: 5 }}>🎤 AI Mock Interview</div>
        <div style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.7 }}>
          Choose a role. The AI interviewer speaks every question out loud. You answer by talking — just like the real thing. Get scored instantly after each answer.
        </div>
      </div>
      {!speechOK && (
        <div style={{ background: C.yellowPale, border: `1px solid ${C.gold}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, color: C.yellow, fontSize: 12 }}>
          ⚠ Voice recognition needs Chrome on desktop or Android for full experience.
        </div>
      )}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {CATS.map(c => <Pill key={c} active={catFilter === c} onClick={() => setCatFilter(c)}>{c}</Pill>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
        {filteredRoles.map(r => (
          <div key={r.id} className="lift" onClick={() => pickRole(r)}
            style={{
              background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 16,
              padding: "18px 16px", boxShadow: "0 1px 6px rgba(0,0,0,.04)",
              borderTop: `3px solid ${C.navy}18`
            }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{r.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: C.ink, marginBottom: 4 }}>{r.title}</div>
            <div style={{ color: C.muted, fontSize: 11.5, lineHeight: 1.65, marginBottom: 10 }}>{r.focus}</div>
            <Tag color={C.teal}>{r.cat}</Tag>
          </div>
        ))}
      </div>
    </div>
  );

  // ── SCREEN: BRIEFING ────────────────────────────────────────────────────────
  if (screen === "brief") return (
    <div className="fade" style={{ maxWidth: 520, margin: "0 auto" }}>
      <button onClick={() => setScreen("roles")} style={{ background: "none", border: "none", color: C.muted, fontSize: 12, cursor: "pointer", marginBottom: 16, fontFamily: "'Inter',sans-serif" }}>← Choose different role</button>
      <div style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ width: 60, height: 60, background: `${C.navy}08`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>
            {role.icon}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 19, color: C.ink }}>{role.title}</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{role.focus}</div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.ink, marginBottom: 10 }}>Experience level</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Entry-level", "Mid-level", "Senior"].map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                style={{
                  flex: 1, padding: "10px 4px", borderRadius: 10,
                  border: `1.5px solid ${difficulty === d ? C.gold : C.border}`,
                  background: difficulty === d ? C.goldPale : "#fff",
                  color: difficulty === d ? C.gold : C.muted,
                  fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif"
                }}>{d}
              </button>
            ))}
          </div>
        </div>

        {loadingQs ? (
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <Spin size={32} />
            <div style={{ color: C.muted, fontSize: 13, marginTop: 12 }}>Preparing your interview questions…</div>
          </div>
        ) : (
          <>
            {genErr && <div style={{ background: C.yellowPale, border: `1px solid ${C.gold}40`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: C.yellow, marginBottom: 12 }}>{genErr}</div>}
            <div style={{
              background: `${C.navy}06`, borderRadius: 12, padding: "14px 16px",
              marginBottom: 20, fontSize: 13, color: C.muted, lineHeight: 1.8,
              border: `1px solid ${C.navy}10`
            }}>
              <strong style={{ color: C.ink }}>How this works:</strong> The AI interviewer will speak {questions.length || 6} questions out loud. When it finishes each question, your mic activates and you have 90 seconds to answer. Speak naturally. You'll get <strong style={{ color: C.gold }}>instant feedback after each answer</strong>, then a full report at the end.
            </div>
            <Btn v="gold" onClick={startInterview} disabled={!questions.length} style={{ width: "100%", padding: "15px", fontSize: 15, borderRadius: 12 }}>
              🎙️ Enter the Interview Room
            </Btn>
          </>
        )}
      </div>
    </div>
  );

  // ── SCREEN: LIVE INTERVIEW ──────────────────────────────────────────────────
  if (screen === "live") {
    const q = questions[qIndex];
    const pct = (timeLeft / QUESTION_TIME) * 100;
    const timeColor = pct > 40 ? C.teal : pct > 15 ? C.gold : C.red;
    const showFeedback = phase === "done-q" && (instantFeedback || loadingFeedback);

    return (
      <div className="fade">
        {/* Progress bar across top */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Tag color={C.navy} bg={`${C.navy}0e`}>{role.icon} {role.title}</Tag>
            <div style={{ display: "flex", gap: 4 }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  width: 28, height: 4, borderRadius: 3,
                  background: i < qIndex ? C.green : i === qIndex ? C.gold : C.border,
                  transition: "background .3s"
                }} />
              ))}
            </div>
            <Tag color={C.muted} bg={C.bg2}>Q {qIndex + 1} / {questions.length}</Tag>
          </div>
        </div>

        {/* INTERVIEW STAGE — the main visual */}
        <div style={{
          background: `linear-gradient(170deg,${C.navy} 0%,${C.navyL} 60%,#1e3a6e 100%)`,
          borderRadius: 22, padding: "26px 20px", marginBottom: 14, position: "relative", overflow: "hidden"
        }}>
          {/* Ambient light */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,146,42,.12),transparent 65%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(12,138,126,.12),transparent 65%)", pointerEvents: "none" }} />

          {/* Two sides */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, position: "relative", zIndex: 1 }}>
            {/* AI Interviewer */}
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                width: 74, height: 74, borderRadius: "50%", margin: "0 auto 10px",
                background: "linear-gradient(135deg,#1a2d50,#2a4070)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
                border: `3px solid ${aiSpeaking ? C.gold : "rgba(255,255,255,.12)"}`,
                animation: aiSpeaking ? "pulseGlow 1.5s infinite" : "none",
                transition: "border-color .3s"
              }}>🧑‍💼</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>AI Interviewer</div>
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 3, color: aiSpeaking ? C.goldL : "rgba(255,255,255,.35)" }}>
                {aiSpeaking ? "Asking…" : "Listening"}
              </div>
              {aiSpeaking && (
                <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: 8, alignItems: "flex-end", height: 18 }}>
                  {[0.45, 0.6, 0.8, 0.6, 0.45].map((d, i) => (
                    <span key={i} className="vbar" style={{
                      height: 16, color: C.goldL,
                      animation: `voiceBar ${d}s ease-in-out ${i * 0.1}s infinite`
                    }} />
                  ))}
                </div>
              )}
            </div>

            <div style={{ color: "rgba(255,255,255,.2)", fontSize: 18, paddingTop: 28 }}>⇆</div>

            {/* User */}
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                width: 74, height: 74, borderRadius: "50%", margin: "0 auto 10px",
                background: "linear-gradient(135deg,#0c4a44,#14706a)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
                border: `3px solid ${listening ? C.tealL : "rgba(255,255,255,.12)"}`,
                animation: listening ? "tealGlow 1.5s infinite" : "none",
                transition: "border-color .3s"
              }}>🧑</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>You</div>
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 3, color: listening ? C.tealL : "rgba(255,255,255,.35)" }}>
                {listening ? "Mic live" : "Stand by"}
              </div>
              {listening && (
                <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: 8, alignItems: "flex-end", height: 18 }}>
                  {[0.5, 0.35, 0.55, 0.4, 0.5].map((d, i) => (
                    <span key={i} className="vbar" style={{
                      height: 16, color: C.tealL,
                      animation: `voiceBar ${d}s ease-in-out ${i * 0.08}s infinite`
                    }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Question card */}
          <div style={{
            marginTop: 22, background: "rgba(255,255,255,.07)",
            border: "1px solid rgba(255,255,255,.1)", borderRadius: 14,
            padding: "14px 16px", position: "relative", zIndex: 1
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Tag color={C.goldL} bg="rgba(200,146,42,.18)">{q?.type}</Tag>
              {phase === "answering" && (
                <span style={{ color: timeColor, fontWeight: 800, fontSize: 13, transition: "color .3s" }}>
                  ⏱ {fmtTime(timeLeft)}
                </span>
              )}
            </div>
            <div style={{ color: "#fff", fontSize: 15, lineHeight: 1.65, fontWeight: 500 }}>{q?.q}</div>
            {phase === "answering" && (
              <div style={{ height: 3, background: "rgba(255,255,255,.12)", borderRadius: 3, marginTop: 12, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: timeColor, borderRadius: 3, transition: "width 1s linear, background .3s" }} />
              </div>
            )}
          </div>
        </div>

        {/* LIVE TRANSCRIPT — single source of truth */}
        <div style={{
          background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 14,
          padding: 16, marginBottom: 12,
          minHeight: showFeedback ? 60 : 100,
          transition: "min-height .3s"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>Your Answer</div>
            {listening && (
              <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.teal, animation: "pulse 1s infinite" }} />
                <span style={{ fontSize: 10, color: C.teal, fontWeight: 700 }}>LIVE</span>
              </div>
            )}
          </div>

          {/* Show final transcript + interim preview */}
          {phase === "speaking" && (
            <div style={{ color: C.soft, fontSize: 13.5, fontStyle: "italic" }}>
              The interviewer is asking the question…
            </div>
          )}
          {phase === "answering" && (
            <div style={{ fontSize: 14, lineHeight: 1.8, color: C.ink }}>
              {liveText && <span>{liveText}</span>}
              {interimText && (
                <span style={{ color: C.soft, fontStyle: "italic" }}>{liveText ? " " : ""}{interimText}</span>
              )}
              {!liveText && !interimText && (
                <span style={{ color: C.soft, fontSize: 13, fontStyle: "italic" }}>
                  Start speaking — your words appear here in real time…
                </span>
              )}
            </div>
          )}
          {phase === "done-q" && !showFeedback && (
            <div style={{ color: C.muted, fontSize: 13 }}>Answer recorded. Getting instant feedback…</div>
          )}
          {phase === "done-q" && liveText && (
            <div style={{ fontSize: 13.5, lineHeight: 1.8, color: C.inkSoft, marginBottom: 4 }}>{liveText}</div>
          )}
        </div>

        {/* Instant feedback or loading */}
        {phase === "done-q" && loadingFeedback && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: C.bg2, borderRadius: 12, fontSize: 13, color: C.muted }}>
            <Spin size={16} /> Scoring your answer…
          </div>
        )}
        {showFeedback && !loadingFeedback && (
          <InstantFeedback
            feedback={instantFeedback}
            onNext={() => proceedNext(qIndex)}
            isLast={qIndex + 1 >= questions.length}
          />
        )}

        {/* Done answering CTA */}
        {phase === "answering" && (
          <Btn v="primary" onClick={() => finishAnswer(qIndex)} style={{ width: "100%", padding: "13px", borderRadius: 12 }}>
            ✅ Done answering — get instant feedback
          </Btn>
        )}
        {!speechOK && phase === "answering" && (
          <textarea
            placeholder="Voice recognition unavailable — type your answer here…"
            onChange={e => { finalTranscriptRef.current = e.target.value; setLiveText(e.target.value); }}
            style={{ ...inp, minHeight: 90, marginTop: 10, resize: "vertical" }}
          />
        )}
      </div>
    );
  }

  // ── SCREEN: GENERATING REPORT ───────────────────────────────────────────────
  if (genReport) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 56, marginBottom: 18, animation: "float 2s ease-in-out infinite" }}>📋</div>
      <div style={{ fontWeight: 800, fontSize: 19, color: C.ink, marginBottom: 8 }}>Preparing your full report…</div>
      <div style={{ color: C.muted, fontSize: 13, marginBottom: 24, maxWidth: 320, margin: "0 auto 24px" }}>
        Reviewing all {questions.length} answers for a complete picture of your performance
      </div>
      <Spin size={36} />
    </div>
  );

  // ── SCREEN: FINAL REPORT ────────────────────────────────────────────────────
  if (screen === "report" && report) return (
    <div className="fade">
      {/* Header scorecard */}
      <div style={{
        background: `linear-gradient(160deg,${C.navy},${C.navyL})`,
        borderRadius: 20, padding: "28px 22px", marginBottom: 16, color: "#fff"
      }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 6, letterSpacing: 1 }}>
            {role.icon} {role.title} · {difficulty}
          </div>
          <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1 }}>{report.overallScore}%</div>
          <div style={{ marginTop: 8 }}>
            <Tag
              color={report.overallScore >= 75 ? C.green : report.overallScore >= 50 ? C.goldL : C.red}
              bg="rgba(255,255,255,.1)"
            >{report.verdict}</Tag>
          </div>
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

      {/* Strengths */}
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

      {/* Improvements */}
      {report.improvements?.length > 0 && (
        <div style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: C.ink, fontSize: 14, marginBottom: 12 }}>🎯 Key areas to improve</div>
          {report.improvements.map((s, i) => (
            <div key={i} style={{ background: C.bg2, borderRadius: 8, padding: "10px 13px", marginBottom: 7, border: `1px solid ${C.border}`, display: "flex", gap: 9 }}>
              <span style={{ color: C.gold, fontWeight: 800, flexShrink: 0 }}>→</span>
              <span style={{ color: C.inkSoft, fontSize: 13 }}>{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Per question */}
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
        <Btn v="gold" onClick={() => pickRole(role)} style={{ flex: 1, padding: "13px" }}>🔁 Retry This Role</Btn>
        <Btn v="ghost" onClick={restart} style={{ flex: 1, padding: "13px" }}>🎲 Try Another Role</Btn>
      </div>
    </div>
  );

  return null;
}

// ── JOBS TAB ─────────────────────────────────────────────────────────────────
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
    sessionStorage.setItem("tp_s", q);
    sessionStorage.setItem("tp_l", loc);
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
          {quickRoles.map(r => (
            <Pill key={r} active={search === r.toLowerCase()} onClick={() => { setSearch(r.toLowerCase()); fetchJobs(r.toLowerCase(), location); }}>
              {r}
            </Pill>
          ))}
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
        const isExp = expanded === job.id;
        const isSaved = saved.includes(job.id);
        return (
          <div key={job.id} className="lift" style={{
            background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 14,
            padding: 16, marginBottom: 8, borderLeft: `4px solid ${C.navy}`,
            animationDelay: `${i * .04}s`, boxShadow: "0 1px 5px rgba(0,0,0,.04)"
          }}>
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
              {job.description.length > 200 && (
                <button onClick={() => setExpanded(isExp ? null : job.id)} style={{ background: "none", border: "none", color: C.gold, fontSize: 11, cursor: "pointer", marginLeft: 5, fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>
                  {isExp ? "Less ▲" : "Read more ▼"}
                </button>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Tag color={C.teal}>{job.category}</Tag>
              <div style={{ display: "flex", gap: 7 }}>
                <button onClick={() => setSaved(s => s.includes(job.id) ? s.filter(x => x !== job.id) : [...s, job.id])}
                  style={{ padding: "6px 11px", borderRadius: 8, border: `1.5px solid ${isSaved ? C.gold : C.border}`, background: isSaved ? C.goldPale : "transparent", cursor: "pointer", fontSize: 13, color: isSaved ? C.gold : C.muted, fontFamily: "'Inter',sans-serif" }}>
                  {isSaved ? "★" : "☆"}
                </button>
                <Btn v="primary" onClick={() => window.open(job.url, "_blank")} small>Apply →</Btn>
              </div>
            </div>
          </div>
        );
      })}
      {!loading && jobs.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          No jobs found. Try a different role or city.
        </div>
      )}
    </div>
  );
}

// ── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onStart }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const reviews = [
    { name: "Priya M.", role: "SDE @ Wipro", text: "The interviewer actually spoke the questions out loud and I had to answer in real time. I got instant feedback after every single answer. Walked into my real interview completely calm.", avatar: "PM", score: 87 },
    { name: "Arun K.", role: "Data Analyst @ TCS", text: "The per-question feedback told me exactly where I rambled. Did three practice rounds. Best interview prep I've ever tried.", avatar: "AK", score: 79 },
    { name: "Sneha R.", role: "Full Stack Dev @ Infosys", text: "26 roles to pick from, found exactly what I was interviewing for. The instant scoring after each answer pushed me to actually improve each round.", avatar: "SR", score: 92 },
  ];

  const steps = [
    { num: "01", title: "Pick your role", desc: "26 roles across engineering, data, business, and design. Entry-level to senior." },
    { num: "02", title: "Face the interviewer", desc: "The AI speaks each question out loud. Your mic activates. You answer on a countdown clock." },
    { num: "03", title: "Get instant feedback", desc: "After each answer, you see your score and specific feedback — before moving to the next question." },
    { num: "04", title: "See your full report", desc: "Communication, technical depth, confidence, structure — scored across all questions with what to fix." },
  ];

  return (
    <div style={{ background: "#fff", color: C.ink, fontFamily: "'Inter',sans-serif", overflowX: "hidden" }}>
      <style>{CSS}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all .3s", padding: "0 24px"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
          <div style={{ fontWeight: 900, fontSize: 22, color: scrolled ? C.navy : "#fff", letterSpacing: -.5 }}>🎤 TakePlace</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={onStart} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 14, color: scrolled ? C.muted : "rgba(255,255,255,.75)", padding: "8px 12px" }}>Sign In</button>
            <Btn v={scrolled ? "gold" : "white"} onClick={onStart} style={{ padding: "9px 22px", fontSize: 14 }}>Start Free →</Btn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "120px 24px 80px", position: "relative", overflow: "hidden",
        background: `linear-gradient(160deg,${C.navy} 0%,${C.navyL} 50%,#1e3a6e 100%)`, color: "#fff"
      }}>
        {/* Background blobs */}
        <div style={{ position: "absolute", top: "8%", right: "5%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle,${C.gold}14,transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(12,138,126,.14),transparent 65%)", pointerEvents: "none" }} />

        <div style={{ textAlign: "center", maxWidth: 800, position: "relative", zIndex: 1 }}>
          {/* Eyebrow */}
          <div className="fade" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${C.gold}16`, border: `1px solid ${C.gold}35`,
            borderRadius: 24, padding: "7px 18px", marginBottom: 30, fontSize: 12.5,
            color: C.goldL, fontWeight: 700, letterSpacing: .3
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.goldL, display: "inline-block", animation: "pulse 1.5s infinite" }} />
            India's most realistic AI interview practice
          </div>

          {/* Headline */}
          <h1 className="fade" style={{
            fontFamily: "'Playfair Display',serif", fontWeight: 900,
            fontSize: "clamp(38px,6vw,66px)", lineHeight: 1.08,
            marginBottom: 24, animationDelay: ".1s", letterSpacing: -.5
          }}>
            The AI interviewer<br />who actually speaks,<br />
            <span style={{ color: C.goldL }}>listens, and scores you.</span>
          </h1>

          <p className="fade" style={{
            fontSize: 17, color: "rgba(255,255,255,.72)", lineHeight: 1.8,
            marginBottom: 44, maxWidth: 560, margin: "0 auto 44px", animationDelay: ".2s"
          }}>
            26 real roles. Real-time spoken questions. 90 seconds to answer on mic.
            Instant score after every answer. Full feedback report at the end.
          </p>

          {/* Stats row */}
          <div className="fade" style={{
            display: "flex", gap: 0, justifyContent: "center", marginBottom: 44,
            background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 16, padding: "18px 0", maxWidth: 480, margin: "0 auto 44px",
            animationDelay: ".25s"
          }}>
            {[["26", "Roles"], ["6", "Questions each"], ["Instant", "Per-Q feedback"], ["90s", "Per answer"]].map(([n, l], i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,.12)" : "none" }}>
                <div style={{ fontWeight: 900, fontSize: 20, color: C.goldL }}>{n}</div>
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.5)", fontWeight: 600, marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>

          <div className="fade" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animationDelay: ".3s" }}>
            <Btn v="gold" onClick={onStart} style={{ padding: "16px 40px", fontSize: 16, borderRadius: 12 }}>
              🎙️ Start Mock Interview — Free
            </Btn>
            <Btn v="outline" onClick={onStart} style={{ padding: "16px 28px", fontSize: 16, borderRadius: 12 }}>
              Browse Live Jobs →
            </Btn>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "90px 24px", background: C.bg2 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, color: C.gold, fontWeight: 800, letterSpacing: 3, marginBottom: 10, textTransform: "uppercase" }}>The process</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 36, color: C.ink, letterSpacing: -.3 }}>Four steps to being ready</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 0 }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                padding: "28px 28px", position: "relative",
                borderRight: i < steps.length - 1 ? `1px solid ${C.border}` : "none"
              }}>
                <div style={{ fontWeight: 900, fontSize: 36, color: `${C.navy}14`, fontFamily: "'Playfair Display',serif", marginBottom: 12 }}>{s.num}</div>
                <div style={{ width: 40, height: 3, background: `linear-gradient(90deg,${C.gold},${C.goldL})`, borderRadius: 3, marginBottom: 14 }} />
                <div style={{ fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 8 }}>{s.title}</div>
                <div style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.75 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TWO PILLARS */}
      <section style={{ padding: "90px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 11, color: C.teal, fontWeight: 800, letterSpacing: 3, marginBottom: 10, textTransform: "uppercase" }}>Two features</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 36, color: C.ink, letterSpacing: -.3 }}>Practice. Then apply.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20 }}>
          <div className="lift" style={{ background: `linear-gradient(155deg,${C.navy},${C.navyL})`, borderRadius: 22, padding: 34, color: "#fff" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎤</div>
            <div style={{ fontWeight: 800, fontSize: 21, marginBottom: 12 }}>AI Mock Interviews</div>
            <div style={{ color: "rgba(255,255,255,.72)", fontSize: 14, lineHeight: 1.9, marginBottom: 20 }}>
              26+ roles from SDE to Civil Engineer. The AI speaks every question out loud. You answer on mic with a live countdown. Get scored instantly after each answer, then a full debrief at the end.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Real spoken questions, real spoken answers", "Live transcript as you talk", "Instant feedback after every single question", "Full debrief: communication, technical, confidence"].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13, color: "rgba(255,255,255,.7)" }}>
                  <span style={{ color: C.goldL, fontWeight: 800, flexShrink: 0 }}>✓</span>{f}
                </div>
              ))}
            </div>
          </div>
          <div className="lift" style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 22, padding: 34, boxShadow: "0 2px 20px rgba(0,0,0,.05)" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔥</div>
            <div style={{ fontWeight: 800, fontSize: 21, marginBottom: 12, color: C.ink }}>Live Job Feed</div>
            <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.9, marginBottom: 20 }}>
              Real, currently-open fresher roles from companies across India. Updated daily. See salary ranges upfront and apply directly on the original listing.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Real listings, updated daily", "Filter by role, city, skills", "Salary ranges shown upfront", "One-tap apply on original posting"].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13, color: C.muted }}>
                  <span style={{ color: C.teal, fontWeight: 800, flexShrink: 0 }}>✓</span>{f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ padding: "90px 24px", background: C.bg2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 11, color: C.purple, fontWeight: 800, letterSpacing: 3, marginBottom: 10, textTransform: "uppercase" }}>Real results</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 36, color: C.ink, letterSpacing: -.3 }}>They practiced here first.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 18 }}>
            {reviews.map((r, i) => (
              <div key={i} className="lift" style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 20, padding: 28, boxShadow: "0 2px 14px rgba(0,0,0,.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  {[...Array(5)].map((_, j) => <span key={j} style={{ color: C.gold, fontSize: 14 }}>★</span>)}
                  <span style={{ marginLeft: 4, background: C.greenPale, color: C.green, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, border: `1px solid ${C.greenBorder}` }}>{r.score}% score</span>
                </div>
                <div style={{ color: C.inkSoft, fontSize: 13.5, lineHeight: 1.8, marginBottom: 18 }}>"{r.text}"</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${C.navy},${C.navyL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#fff" }}>{r.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: C.ink, fontSize: 13.5 }}>{r.name}</div>
                    <div style={{ color: C.muted, fontSize: 12 }}>{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "90px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div className="float" style={{ fontSize: 52, marginBottom: 16 }}>🎤</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 36, color: C.ink, marginBottom: 12, letterSpacing: -.3 }}>
            Your next interview is real.<br />This one can be too.
          </h2>
          <p style={{ color: C.muted, fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
            Sit through a full spoken mock interview, get scored on every answer, and walk into the real one ready.
          </p>
          <Btn v="gold" onClick={onStart} style={{ padding: "16px 48px", fontSize: 16, borderRadius: 12 }}>
            Start Free Now — No Card Required →
          </Btn>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "28px 24px", textAlign: "center", background: "#fff" }}>
        <div style={{ color: C.muted, fontSize: 12 }}>
          © 2026 TakePlace · Built by Raghu Dadigela ·{" "}
          <a href="mailto:support@takeplace.in" style={{ color: C.navy, fontWeight: 600 }}>support@takeplace.in</a>
        </div>
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
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
            {mode === "login" ? "Welcome back 👋" : "Create your free account ✨"}
          </div>
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
            <button key={m} onClick={() => { setMode(m); setErr(""); setMsg(""); }}
              style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13, transition: "all .2s", background: mode === m ? "#fff" : "transparent", color: mode === m ? C.navy : C.muted, boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,.08)" : "none" }}>
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
    { icon: "🎤", label: "Mock Interview", id: 0 },
    { icon: "🔥", label: "Live Jobs", id: 1 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg2, fontFamily: "'Inter',sans-serif", paddingBottom: 72 }}>
      <style>{CSS}
        {`
          @media(min-width:640px){.bottom-nav-wrap{display:none!important;}.top-tab-bar{display:flex!important;}}
          @media(max-width:639px){.top-tab-bar{display:none!important;}.bottom-nav-wrap{display:flex!important;}}
        `}
      </style>

      {/* TOP HEADER */}
      <div style={{ background: "#fff", borderBottom: `1.5px solid ${C.border}`, padding: "0 20px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 10px rgba(0,0,0,.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ fontWeight: 900, fontSize: 20, color: C.navy }}>🎤 TakePlace</div>
          <div className="top-tab-bar" style={{ display: "none", gap: 2 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTabP(t.id)} style={{
                padding: "8px 22px", border: "none", background: "transparent", cursor: "pointer",
                color: tab === t.id ? C.gold : C.muted, fontFamily: "'Inter',sans-serif",
                fontWeight: tab === t.id ? 700 : 500, fontSize: 14,
                borderBottom: `2.5px solid ${tab === t.id ? C.gold : "transparent"}`,
                transition: "all .2s", display: "flex", alignItems: "center", gap: 6
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(m => !m)} style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg,${C.navy},${C.navyL})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 13, color: "#fff", border: "none", cursor: "pointer"
            }}>{initials}</button>
            {menuOpen && (
              <div style={{ position: "absolute", right: 0, top: 44, background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,.12)", padding: 8, minWidth: 160, zIndex: 50 }}>
                <div style={{ padding: "8px 10px", fontSize: 12, color: C.muted, borderBottom: `1px solid ${C.border}`, marginBottom: 6 }}>{name}</div>
                <button onClick={onLogout} style={{ width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, border: "none", background: "transparent", color: C.red, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>🚪 Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "22px 16px" }}>
        {tab === 0 && <InterviewMock />}
        {tab === 1 && <JobsTab />}
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="bottom-nav-wrap bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: `1.5px solid ${C.border}`,
        display: "flex", zIndex: 200, boxShadow: "0 -4px 20px rgba(0,0,0,.07)"
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTabP(t.id)} style={{
            flex: 1, padding: "10px 4px 8px", border: "none", background: "transparent",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: tab === t.id ? C.gold : C.muted, fontFamily: "'Inter',sans-serif", transition: "all .15s"
          }}>
            <div style={{ width: 32, height: 3, borderRadius: 2, background: tab === t.id ? C.gold : "transparent", marginBottom: 2, transition: "background .2s" }} />
            <span style={{ fontSize: 22, lineHeight: 1 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === t.id ? 700 : 500, letterSpacing: .3 }}>{t.label}</span>
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
