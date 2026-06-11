import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID  = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const supabase   = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── DESIGN TOKENS — LIGHT PROFESSIONAL THEME ──────────────────────────────
const C = {
  bg:       "#F8FAFC",
  bg2:      "#F1F5F9",
  card:     "#FFFFFF",
  card2:    "#F8FAFC",
  border:   "#E2E8F0",
  borderDark: "#CBD5E1",

  blue:      "#2563EB",
  blueLight: "#3B82F6",
  blueDark:  "#1D4ED8",
  blueGhost: "#EFF6FF",

  green:     "#059669",
  greenLight:"#10B981",
  greenBg:   "#ECFDF5",

  orange:    "#EA580C",
  orangeBg:  "#FFF7ED",

  red:       "#DC2626",
  redBg:     "#FEF2F2",

  amber:     "#D97706",
  amberBg:   "#FFFBEB",

  purple:    "#7C3AED",
  purpleBg:  "#F5F3FF",

  text:      "#0F172A",
  textSoft:  "#475569",
  textMuted: "#94A3B8",
  textLight: "#CBD5E1",
};

// ─── GLOBAL CSS ─────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{background:${C.bg};font-family:'Plus Jakarta Sans',sans-serif;color:${C.text};}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:${C.bg2};}
  ::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px;}
  ::-webkit-scrollbar-thumb:hover{background:${C.borderDark};}
  ::selection{background:${C.blue}20;color:${C.blue};}

  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scaleIn{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes progressFill{from{width:0%}to{width:var(--w)}}
  @keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

  .fade{animation:fadeUp .45s ease forwards;}
  .fadeIn{animation:fadeIn .35s ease forwards;}
  .scaleIn{animation:scaleIn .3s ease forwards;}
  .spin{animation:spin .9s linear infinite;display:inline-block;}
  .float{animation:float 3s ease-in-out infinite;}

  .hover-card{transition:all .2s cubic-bezier(.4,0,.2,1);cursor:pointer;}
  .hover-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.08);}

  input:focus,textarea:focus,select:focus{
    border-color:${C.blue}!important;outline:none;
    box-shadow:0 0 0 3px ${C.blue}18!important;
    background:#fff!important;
  }
  button:active{transform:scale(.98);}

  .progress-bar{
    height:8px;border-radius:99px;background:${C.bg2};overflow:hidden;
  }
  .progress-fill{
    height:100%;border-radius:99px;
    animation:progressFill .9s cubic-bezier(.4,0,.2,1) forwards;
    transition:width .9s cubic-bezier(.4,0,.2,1);
  }

  .tab-active{
    color:${C.blue}!important;
    border-bottom:2px solid ${C.blue}!important;
    font-weight:700!important;
  }

  .badge{
    display:inline-flex;align-items:center;gap:4px;
    padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;
  }

  @media(max-width:640px){
    .hide-mobile{display:none!important;}
    .mobile-full{width:100%!important;}
  }
`;

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const inp = {
  width:"100%", background:C.bg2, border:`1.5px solid ${C.border}`,
  borderRadius:10, padding:"11px 14px", color:C.text, fontSize:13.5,
  fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none", transition:"all .2s",
};

const Btn = ({ children, onClick, variant="primary", style={}, disabled=false, loading=false, size="md" }) => {
  const sizes = {
    sm:{ padding:"7px 14px", fontSize:12, borderRadius:8 },
    md:{ padding:"10px 20px", fontSize:13.5, borderRadius:10 },
    lg:{ padding:"13px 28px", fontSize:15, borderRadius:12 },
    xl:{ padding:"16px 40px", fontSize:16, borderRadius:14 },
  };
  const v = {
    primary:{
      background:`linear-gradient(135deg,${C.blue},${C.blueLight})`,
      color:"#fff", fontWeight:700,
      boxShadow:`0 2px 12px ${C.blue}30`,
    },
    secondary:{
      background:C.card, color:C.text, fontWeight:600,
      border:`1.5px solid ${C.border}`,
      boxShadow:"0 1px 4px rgba(0,0,0,.06)",
    },
    ghost:{
      background:"transparent", color:C.textSoft, fontWeight:500,
      border:`1.5px solid ${C.border}`,
    },
    green:{
      background:`linear-gradient(135deg,${C.green},${C.greenLight})`,
      color:"#fff", fontWeight:700,
      boxShadow:`0 2px 12px ${C.green}25`,
    },
    danger:{
      background:C.red, color:"#fff", fontWeight:700,
    },
    blue_outline:{
      background:C.blueGhost, color:C.blue, fontWeight:700,
      border:`1.5px solid ${C.blue}40`,
    },
    dark:{
      background:C.text, color:"#fff", fontWeight:700,
      boxShadow:"0 2px 12px rgba(0,0,0,.2)",
    },
  };
  return (
    <button onClick={disabled||loading ? undefined : onClick} disabled={disabled||loading}
      style={{
        border:"none", cursor:disabled||loading?"not-allowed":"pointer",
        fontFamily:"'Plus Jakarta Sans',sans-serif",
        transition:"all .2s", opacity:disabled?0.5:1,
        display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7,
        ...sizes[size], ...v[variant], ...style
      }}>
      {loading ? <><SpinIcon size={13}/> Loading...</> : children}
    </button>
  );
};

const SpinIcon = ({ size=18, color=C.blue }) => (
  <span className="spin" style={{ width:size, height:size,
    border:`2px solid ${color}25`, borderTopColor:color,
    borderRadius:"50%", display:"inline-block", flexShrink:0 }} />
);

const ScoreRing = ({ score, size=88, color, label }) => {
  const r=34, circ=2*Math.PI*r;
  const pct=Math.max(0,Math.min(100,score||0));
  const col = color || (pct>=75?C.green:pct>=50?C.amber:C.red);
  return (
    <div style={{ textAlign:"center" }}>
      <svg width={size} height={size} viewBox="0 0 76 76">
        <circle cx="38" cy="38" r={r} fill="none" stroke={C.bg2} strokeWidth="6"/>
        <circle cx="38" cy="38" r={r} fill="none" stroke={col} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
          strokeLinecap="round" transform="rotate(-90 38 38)"
          style={{transition:"stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"}}/>
        <text x="38" y="43" textAnchor="middle" fill={col} fontSize="15" fontWeight="800"
          fontFamily="'Plus Jakarta Sans',sans-serif">{pct}%</text>
      </svg>
      {label && <div style={{ fontSize:11, color:C.textMuted, fontWeight:600, marginTop:4 }}>{label}</div>}
    </div>
  );
};

const ProgressBar = ({ value, color, label, sub }) => (
  <div style={{ marginBottom:12 }}>
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
      <span style={{ fontSize:12.5, fontWeight:600, color:C.text }}>{label}</span>
      <span style={{ fontSize:12, fontWeight:700, color:color||(value>=75?C.green:value>=50?C.amber:C.red) }}>{value}%</span>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width:`${value}%`, background:color||(value>=75?C.green:value>=50?C.amber:C.red) }}/>
    </div>
    {sub && <div style={{ fontSize:11, color:C.textMuted, marginTop:3 }}>{sub}</div>}
  </div>
);

const Tag = ({ children, color=C.blue, bg, style={} }) => (
  <span className="badge" style={{ background:bg||`${color}15`, color, ...style }}>
    {children}
  </span>
);

const Divider = ({ style={} }) => (
  <div style={{ height:1, background:C.border, margin:"20px 0", ...style }}/>
);

const Card = ({ children, style={}, className="" }) => (
  <div className={className} style={{
    background:C.card, border:`1.5px solid ${C.border}`,
    borderRadius:16, padding:24, ...style
  }}>
    {children}
  </div>
);

const SectionTitle = ({ icon, title, sub, badge }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
    {icon && <span style={{ fontSize:18 }}>{icon}</span>}
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontWeight:800, fontSize:16, color:C.text }}>{title}</span>
        {badge}
      </div>
      {sub && <div style={{ fontSize:11.5, color:C.textMuted, marginTop:1 }}>{sub}</div>}
    </div>
  </div>
);

// ─── AI API ──────────────────────────────────────────────────────────────────
async function callAI(prompt, maxTokens=2000, mode="json", retries=2) {
  for (let attempt=0; attempt<=retries; attempt++) {
    try {
      const res = await fetch("/api/ai", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ prompt, maxTokens, mode }),
      });
      if (!res.ok) {
        const errBody = await res.text().catch(()=>"");
        throw new Error("AI error "+res.status+": "+errBody.slice(0,120));
      }
      const data = await res.json();
      return data.text || "";
    } catch(e) {
      if (attempt<retries) { await new Promise(r=>setTimeout(r,1200*(attempt+1))); continue; }
      throw e;
    }
  }
}

function safeJSON(raw, fallback={}) {
  if (!raw) return fallback;
  try {
    const clean = raw.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
    return JSON.parse(clean);
  } catch {
    try { const obj=raw.match(/\{[\s\S]*\}/); if(obj) return JSON.parse(obj[0]); } catch {}
    try { const arr=raw.match(/\[[\s\S]*\]/); if(arr) return JSON.parse(arr[0]); } catch {}
    return fallback;
  }
}

// ─── FILE EXTRACTION ─────────────────────────────────────────────────────────
async function extractTextFromPDF(file) {
  if (!window.pdfjsLib) {
    await new Promise((res,rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const ab = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({data:ab}).promise;
  let text = "";
  for (let i=1;i<=Math.min(pdf.numPages,4);i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(x=>x.str).join(" ")+"\n";
  }
  return text.trim();
}

async function extractTextFromDOCX(file) {
  if (!window.mammoth) {
    await new Promise((res,rej) => {
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
      s.onload=res; s.onerror=rej;
      document.head.appendChild(s);
    });
  }
  const ab = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({arrayBuffer:ab});
  return result.value.trim();
}

// ─── DOWNLOAD HELPERS ────────────────────────────────────────────────────────
async function downloadPDF(text, filename) {
  if (!window.jspdf) {
    await new Promise((res,rej)=>{
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload=res; s.onerror=rej;
      document.head.appendChild(s);
    });
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const lines = text.split("\n");
  let y = 18;
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) { y += 3; return; }
    // Section headers
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && !trimmed.includes("•") && !trimmed.startsWith("–")) {
      if (y > 265) { doc.addPage(); y = 18; }
      doc.setFont("helvetica","bold");
      doc.setFontSize(10.5);
      doc.setTextColor(15,23,42);
      doc.text(trimmed, 15, y);
      doc.setDrawColor(203,213,225);
      doc.line(15, y+1.5, 195, y+1.5);
      y += 7;
    } else if (trimmed.startsWith("•") || trimmed.startsWith("–") || trimmed.startsWith("-")) {
      if (y > 270) { doc.addPage(); y = 18; }
      doc.setFont("helvetica","normal");
      doc.setFontSize(9);
      doc.setTextColor(71,85,105);
      const bulletText = trimmed.replace(/^[•\-–]\s*/,"");
      const wrapped = doc.splitTextToSize("• "+bulletText, 170);
      wrapped.forEach((wl,wi) => {
        if (y > 270) { doc.addPage(); y = 18; }
        doc.text(wl, wi===0?15:19, y);
        y += 4.5;
      });
    } else {
      if (y > 270) { doc.addPage(); y = 18; }
      doc.setFont("helvetica","normal");
      doc.setFontSize(9.5);
      doc.setTextColor(30,41,59);
      const wrapped = doc.splitTextToSize(trimmed, 180);
      wrapped.forEach(wl => {
        if (y > 270) { doc.addPage(); y = 18; }
        doc.text(wl, 15, y);
        y += 4.8;
      });
    }
  });
  doc.save(filename);
}

async function downloadDOCX(text, filename) {
  if (!window.docx) {
    await new Promise((res,rej)=>{
      const s=document.createElement("script");
      s.src="https://unpkg.com/docx@8.2.2/build/index.umd.js";
      s.onload=res; s.onerror=rej;
      document.head.appendChild(s);
    });
  }
  const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, UnderlineType } = window.docx;
  const lines = text.split("\n");
  const paragraphs = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return new Paragraph({ spacing:{ after:80 } });
    const isHeader = trimmed === trimmed.toUpperCase() && trimmed.length > 2 && !trimmed.startsWith("•");
    return new Paragraph({
      children:[new TextRun({
        text: trimmed,
        bold: isHeader,
        size: isHeader ? 22 : 20,
        font:"Calibri",
        color: isHeader ? "0F172A" : "334155",
      })],
      spacing:{ after: isHeader ? 120 : 60 },
      border: isHeader ? { bottom:{ style:BorderStyle.SINGLE, size:6, color:"CBD5E1" } } : undefined,
    });
  });
  const doc = new Document({ sections:[{ properties:{}, children:paragraphs }] });
  const blob = await Packer.toBlob(doc);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

// ══════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ══════════════════════════════════════════════════════════════════════════
function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",h);
    return ()=>window.removeEventListener("scroll",h);
  },[]);

  const stats = [
    { n:"50K+", label:"Jobs Listed", icon:"💼" },
    { n:"12K+", label:"Resumes Optimized", icon:"📄" },
    { n:"94%",  label:"ATS Pass Rate", icon:"✅" },
    { n:"3x",   label:"More Interviews", icon:"🚀" },
  ];

  const features = [
    { icon:"🔥", color:C.orange, title:"Live Job Feed", desc:"Real jobs from Indian companies updated daily. Filter by role, city, and salary instantly." },
    { icon:"⚡", color:C.blue,   title:"AI Resume Analyzer", desc:"Paste any JD + your resume. AI scores your match, finds every keyword gap, tells you what to fix." },
    { icon:"🎯", color:C.purple, title:"Project Relevance Check", desc:"AI judges which projects hurt or help your chances based on the specific JD you're targeting." },
    { icon:"✨", color:C.green,  title:"ATS Resume Rewriter", desc:"One click — fully rewritten ATS resume in Jake format with mirrored JD keywords." },
    { icon:"📊", color:C.amber,  title:"Recruiter Shortlist Score", desc:"See your predicted shortlist probability and what recruiters see when your resume lands on their desk." },
    { icon:"📥", color:C.red,    title:"Download PDF & DOCX", desc:"Export your optimized single-page resume as clean PDF or DOCX, ready to submit directly." },
  ];

  return (
    <div style={{ background:C.bg, color:C.text, fontFamily:"'Plus Jakarta Sans',sans-serif", overflowX:"hidden" }}>
      <style>{css}</style>

      {/* NAVBAR */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000,
        background:scrolled?"rgba(248,250,252,.95)":"transparent",
        backdropFilter:scrolled?"blur(16px)":"none",
        borderBottom:scrolled?`1px solid ${C.border}`:"none",
        transition:"all .3s", padding:"0 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ fontWeight:900, fontSize:22, color:C.blue, letterSpacing:"-0.5px" }}>
            ⚡ TakePlace
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="secondary" onClick={onGetStarted} size="sm">Sign In</Btn>
            <Btn onClick={onGetStarted} size="sm">Get Started Free →</Btn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        padding:"130px 24px 80px", position:"relative", overflow:"hidden",
        background:"linear-gradient(160deg,#EFF6FF 0%,#F8FAFC 50%,#F0FDF4 100%)" }}>
        {/* grid bg */}
        <div style={{ position:"absolute", inset:0,
          backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
          backgroundSize:"50px 50px", opacity:.5, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"10%", right:"5%", width:480, height:480, borderRadius:"50%",
          background:"radial-gradient(circle,#DBEAFE 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"10%", left:"5%", width:360, height:360, borderRadius:"50%",
          background:"radial-gradient(circle,#D1FAE5 0%,transparent 70%)", pointerEvents:"none" }}/>

        <div style={{ textAlign:"center", maxWidth:800, position:"relative", zIndex:1 }}>
          <div className="fade" style={{ display:"inline-flex", alignItems:"center", gap:8,
            background:C.card, border:`1.5px solid ${C.border}`,
            borderRadius:99, padding:"6px 16px", marginBottom:28,
            fontSize:12, color:C.blue, fontWeight:700,
            boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:C.green, display:"inline-block", animation:"pulse 1.5s infinite" }}/>
            AI-Powered Job Platform · Built for Indian Freshers
          </div>

          <h1 className="fade" style={{ fontWeight:900, fontSize:"clamp(36px,6vw,68px)", lineHeight:1.05,
            marginBottom:22, letterSpacing:"-1.5px", animationDelay:".08s", color:C.text }}>
            Land Your Dream Job<br/>
            <span style={{ background:`linear-gradient(135deg,${C.blue},${C.blueLight})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Faster with AI
            </span>
          </h1>

          <p className="fade" style={{ fontSize:17, color:C.textSoft, lineHeight:1.8, marginBottom:40,
            maxWidth:560, margin:"0 auto 40px", animationDelay:".16s" }}>
            Real live jobs · AI resume analyzer · ATS score · Keyword gap finder · One-click rewrite.<br/>
            <strong style={{ color:C.text }}>Everything you need. Zero guesswork.</strong>
          </p>

          <div className="fade" style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", animationDelay:".24s" }}>
            <Btn onClick={onGetStarted} size="xl" style={{ letterSpacing:"-0.3px" }}>
              🚀 Start Free — No Credit Card
            </Btn>
            <Btn variant="secondary" size="xl"
              onClick={()=>document.getElementById("features").scrollIntoView({behavior:"smooth"})}>
              See How It Works ↓
            </Btn>
          </div>

          {/* Stats row */}
          <div className="fade" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0,
            marginTop:60, background:C.card, border:`1.5px solid ${C.border}`, borderRadius:20,
            overflow:"hidden", maxWidth:580, margin:"60px auto 0",
            boxShadow:"0 4px 24px rgba(0,0,0,.06)", animationDelay:".32s" }}>
            {stats.map((s,i)=>(
              <div key={i} style={{ padding:"18px 12px", borderRight:i<stats.length-1?`1px solid ${C.border}`:"none", textAlign:"center" }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontWeight:900, fontSize:22, color:C.blue, letterSpacing:"-0.5px" }}>{s.n}</div>
                <div style={{ fontSize:10.5, color:C.textMuted, fontWeight:600, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:"80px 24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ fontSize:11, color:C.blue, fontWeight:800, letterSpacing:3, marginBottom:10, textTransform:"uppercase" }}>How It Works</div>
          <h2 style={{ fontWeight:900, fontSize:34, color:C.text, letterSpacing:"-0.8px" }}>Three Steps to More Interviews</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
          {[
            { step:"01", icon:"📋", title:"Paste JD + Upload Resume", desc:"Drop the job description and paste or upload your resume (PDF, DOCX, or TXT). Takes 30 seconds.", color:C.blue },
            { step:"02", icon:"🧠", title:"AI Deep Analysis", desc:"Groq-powered AI scans every keyword, scores recruiter shortlist probability, finds gaps, judges each project.", color:C.purple },
            { step:"03", icon:"✨", title:"Download Optimized Resume", desc:"Get a rewritten ATS-friendly single-page resume. Download PDF or DOCX and apply with confidence.", color:C.green },
          ].map((s,i)=>(
            <div key={i} className="hover-card" style={{ background:C.card, border:`1.5px solid ${C.border}`,
              borderRadius:20, padding:32, position:"relative", overflow:"hidden",
              boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
              <div style={{ position:"absolute", top:-8, right:16, fontWeight:900, fontSize:52,
                color:`${s.color}08`, fontFamily:"'IBM Plex Mono',monospace" }}>{s.step}</div>
              <div style={{ width:52, height:52, borderRadius:14, background:`${s.color}12`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, marginBottom:18 }}>
                {s.icon}
              </div>
              <div style={{ fontWeight:800, fontSize:17, color:C.text, marginBottom:10, letterSpacing:"-0.3px" }}>{s.title}</div>
              <div style={{ color:C.textSoft, fontSize:13.5, lineHeight:1.75 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding:"80px 24px", background:C.bg2 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ fontSize:11, color:C.green, fontWeight:800, letterSpacing:3, marginBottom:10, textTransform:"uppercase" }}>Features</div>
            <h2 style={{ fontWeight:900, fontSize:34, color:C.text, letterSpacing:"-0.8px" }}>Built for Indian Freshers</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:18 }}>
            {features.map((f,i)=>(
              <div key={i} className="hover-card" style={{ background:C.card, border:`1.5px solid ${C.border}`,
                borderRadius:18, padding:26, display:"flex", gap:16,
                boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                <div style={{ width:46, height:46, borderRadius:12, background:`${f.color}12`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:6, letterSpacing:"-0.2px" }}>{f.title}</div>
                  <div style={{ color:C.textSoft, fontSize:13, lineHeight:1.7 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:"80px 24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ fontSize:11, color:C.purple, fontWeight:800, letterSpacing:3, marginBottom:10, textTransform:"uppercase" }}>Success Stories</div>
          <h2 style={{ fontWeight:900, fontSize:34, color:C.text, letterSpacing:"-0.8px" }}>They Got Hired. You're Next.</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:18 }}>
          {[
            { name:"Priya M.", role:"SDE at Wipro", text:"Got 3 interview calls in one week after using TakePlace. The AI found keywords I was completely missing from my resume.", avatar:"PM", color:C.blue },
            { name:"Arun K.", role:"Data Analyst at TCS", text:"Resume match score jumped from 42% to 89% after optimization. Exactly what I needed as a fresher with no referrals.", avatar:"AK", color:C.green },
            { name:"Sneha R.", role:"Full Stack Dev at Infosys", text:"The project relevance checker is genius. Told me to remove two projects that were actually hurting my shortlist chances.", avatar:"SR", color:C.purple },
          ].map((t,i)=>(
            <div key={i} className="hover-card" style={{ background:C.card, border:`1.5px solid ${C.border}`,
              borderRadius:20, padding:28, boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
              <div style={{ fontSize:28, color:t.color, marginBottom:14, lineHeight:1 }}>❝</div>
              <div style={{ color:C.textSoft, fontSize:13.5, lineHeight:1.8, marginBottom:20 }}>{t.text}</div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:"50%",
                  background:`linear-gradient(135deg,${t.color},${t.color}99)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:800, fontSize:12, color:"#fff" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight:700, color:C.text, fontSize:13.5 }}>{t.name}</div>
                  <div style={{ color:C.textMuted, fontSize:11.5 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT + DEVELOPER */}
      <section style={{ padding:"80px 24px", background:C.bg2 }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            {/* About */}
            <div style={{ background:C.card, border:`1.5px solid ${C.border}`, borderRadius:20, padding:32, boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
              <div style={{ fontWeight:900, fontSize:20, color:C.text, marginBottom:6, letterSpacing:"-0.4px" }}>About TakePlace</div>
              <div style={{ color:C.textSoft, fontSize:13.5, lineHeight:1.8, marginBottom:18 }}>
                TakePlace is a real-problem-solving platform built for Indian freshers who are tired of generic job boards and resume tips that don't work.
                <br/><br/>
                We combine live job data, AI-powered analysis, and ATS optimization into one place — so you stop guessing and start getting shortlisted.
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {["100% Free","No Credit Card","Groq AI Powered","Real Jobs via Adzuna"].map(t=>(
                  <Tag key={t} color={C.blue}>{t}</Tag>
                ))}
              </div>
            </div>

            {/* Developer */}
            <div style={{ background:`linear-gradient(135deg,${C.blue},${C.blueLight})`, borderRadius:20, padding:32, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-20, right:-20, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,.08)" }}/>
              <div style={{ position:"absolute", bottom:-30, left:-10, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,.06)" }}/>
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ width:56, height:56, borderRadius:16, background:"rgba(255,255,255,.2)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:28, marginBottom:18, backdropFilter:"blur(10px)" }}>👨‍💻</div>
                <div style={{ fontWeight:900, fontSize:18, color:"#fff", marginBottom:4 }}>Developed by Raghu</div>
                <div style={{ color:"rgba(255,255,255,.75)", fontSize:13, marginBottom:16, lineHeight:1.7 }}>
                  Dadigela Raghu Reddy — CS (AIML) final-year student at Mallareddy University, Hyderabad. Built TakePlace to solve a real problem he faced: getting lost in the job search maze as a fresher.
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <a href="https://github.com/raghu227" target="_blank" rel="noreferrer"
                    style={{ background:"rgba(255,255,255,.2)", color:"#fff", padding:"6px 14px",
                      borderRadius:8, fontSize:12, fontWeight:700, textDecoration:"none",
                      display:"flex", alignItems:"center", gap:6 }}>
                    GitHub ↗
                  </a>
                  <a href="https://linkedin.com/in/raghu-reddy" target="_blank" rel="noreferrer"
                    style={{ background:"rgba(255,255,255,.2)", color:"#fff", padding:"6px 14px",
                      borderRadius:8, fontSize:12, fontWeight:700, textDecoration:"none",
                      display:"flex", alignItems:"center", gap:6 }}>
                    LinkedIn ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"80px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:580, margin:"0 auto", background:`linear-gradient(135deg,${C.blue},${C.blueLight})`,
          borderRadius:28, padding:"60px 40px", position:"relative", overflow:"hidden",
          boxShadow:`0 20px 60px ${C.blue}30` }}>
          <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,.08)" }}/>
          <div style={{ position:"absolute", bottom:-30, left:-20, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,.06)" }}/>
          <div style={{ position:"relative", zIndex:1 }}>
            <div className="float" style={{ fontSize:52, marginBottom:16 }}>⚡</div>
            <div style={{ fontWeight:900, fontSize:30, color:"#fff", marginBottom:12, letterSpacing:"-0.8px" }}>
              It's Your Time.<br/>TakePlace.
            </div>
            <div style={{ color:"rgba(255,255,255,.8)", fontSize:15, marginBottom:32, lineHeight:1.7 }}>
              Join 12,000+ freshers who optimized their resumes and landed interviews faster.
            </div>
            <button onClick={onGetStarted} style={{ background:"#fff", color:C.blue,
              padding:"14px 40px", borderRadius:12, border:"none", fontWeight:800,
              fontSize:16, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif",
              boxShadow:"0 4px 20px rgba(0,0,0,.15)", transition:"all .2s" }}>
              Start Free Now →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"28px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", justifyContent:"space-between",
          alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ fontWeight:800, fontSize:16, color:C.blue }}>⚡ TakePlace</div>
          <div style={{ color:C.textMuted, fontSize:12 }}>
            © 2026 TakePlace · Developed by Raghu · Built for Indian Freshers ·{" "}
            <a href="mailto:support@takeplace.in" style={{ color:C.blue, textDecoration:"none", fontWeight:600 }}>
              support@takeplace.in
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// AUTH PAGE — CLEAN WHITE/BLUE
// ══════════════════════════════════════════════════════════════════════════
function AuthPage({ onLogin, onBack }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleGoogle = async () => {
    setGoogleLoading(true); setErr("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider:"google",
      options:{ redirectTo: window.location.origin }
    });
    if (error) { setErr(error.message); setGoogleLoading(false); }
  };

  const handleForgot = async () => {
    if (!form.email) { setErr("Enter your email address first."); return; }
    setLoading(true); setErr(""); setMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo:`${window.location.origin}/reset-password`
    });
    setLoading(false);
    if (error) setErr(error.message);
    else setMsg("✅ Password reset email sent! Check your inbox.");
  };

  const handle = async () => {
    setErr(""); setMsg(""); setLoading(true);
    try {
      if (mode==="register") {
        if (!form.name||!form.email||!form.password) throw new Error("All fields are required");
        if (form.password.length<6) throw new Error("Password must be at least 6 characters");
        const { error } = await supabase.auth.signUp({
          email:form.email, password:form.password,
          options:{ data:{ full_name:form.name } }
        });
        if (error) throw error;
        setMsg("✅ Account created! Check your email to confirm, then sign in.");
        setMode("login");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email:form.email, password:form.password });
        if (error) throw error;
        onLogin(data.user);
      }
    } catch(e) { setErr(e.message||"Something went wrong"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${C.blueGhost} 0%,${C.bg} 50%,#F0FDF4 100%)`,
      display:"flex", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
      <style>{css}</style>

      {/* background decoration */}
      <div style={{ position:"absolute", top:"5%", right:"8%", width:320, height:320, borderRadius:"50%",
        background:"radial-gradient(circle,#DBEAFE 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"8%", left:"5%", width:280, height:280, borderRadius:"50%",
        background:"radial-gradient(circle,#D1FAE5 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:0,
        backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
        backgroundSize:"44px 44px", opacity:.4, pointerEvents:"none" }}/>

      <div className="scaleIn" style={{ width:"100%", maxWidth:440, background:C.card,
        border:`1.5px solid ${C.border}`, borderRadius:24, padding:40, position:"relative", zIndex:1,
        boxShadow:"0 20px 60px rgba(0,0,0,.1)" }}>

        <button onClick={onBack} style={{ background:"none", border:"none", color:C.textMuted,
          fontSize:12.5, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif",
          marginBottom:28, display:"flex", alignItems:"center", gap:4, fontWeight:600 }}>
          ← Back to home
        </button>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:60, height:60, background:`linear-gradient(135deg,${C.blue},${C.blueLight})`,
            borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:28, margin:"0 auto 14px", boxShadow:`0 8px 24px ${C.blue}30` }}>⚡</div>
          <div style={{ fontWeight:900, fontSize:26, color:C.text, letterSpacing:"-0.6px" }}>TakePlace</div>
          <div style={{ color:C.textMuted, fontSize:13, marginTop:4 }}>
            {mode==="login"?"Welcome back 👋":mode==="register"?"Create your free account ✨":"Reset your password"}
          </div>
        </div>

        {mode!=="forgot" && (
          <>
            {/* Google */}
            <button onClick={handleGoogle} disabled={googleLoading}
              style={{ width:"100%", padding:"12px", borderRadius:12, border:`1.5px solid ${C.border}`,
                background:C.card, color:C.text, fontSize:14, cursor:"pointer",
                fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600,
                display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                marginBottom:20, transition:"all .2s",
                boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
              {googleLoading ? <SpinIcon size={16}/> : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Continue with Google
            </button>

            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <div style={{ flex:1, height:1, background:C.border }}/>
              <span style={{ color:C.textMuted, fontSize:12, fontWeight:600 }}>or</span>
              <div style={{ flex:1, height:1, background:C.border }}/>
            </div>

            {/* Tabs */}
            <div style={{ display:"flex", background:C.bg2, borderRadius:12, padding:4, marginBottom:24, border:`1px solid ${C.border}` }}>
              {["login","register"].map(m=>(
                <button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}}
                  style={{ flex:1, padding:"9px", borderRadius:9, border:"none", cursor:"pointer",
                    fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:13, transition:"all .2s",
                    background:mode===m?C.card:"transparent",
                    color:mode===m?C.blue:C.textMuted,
                    boxShadow:mode===m?"0 1px 6px rgba(0,0,0,.08)":"none" }}>
                  {m==="login"?"Sign In":"Register"}
                </button>
              ))}
            </div>
          </>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {mode==="register" && (
            <input style={inp} placeholder="Full name" value={form.name}
              onChange={e=>set("name",e.target.value)}/>
          )}
          <input style={inp} placeholder="Email address" type="email" value={form.email}
            onChange={e=>set("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
          {mode!=="forgot" && (
            <input style={inp} placeholder="Password" type="password" value={form.password}
              onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
          )}
        </div>

        {err && <div style={{ color:C.red, fontSize:12.5, marginTop:14, background:C.redBg,
          padding:"10px 14px", borderRadius:10, border:`1px solid ${C.red}20`, fontWeight:600 }}>⚠ {err}</div>}
        {msg && <div style={{ color:C.green, fontSize:12.5, marginTop:14, background:C.greenBg,
          padding:"10px 14px", borderRadius:10, border:`1px solid ${C.green}20`, fontWeight:600 }}>{msg}</div>}

        {mode==="forgot" ? (
          <>
            <Btn onClick={handleForgot} loading={loading} style={{ width:"100%", marginTop:20, padding:"13px" }} size="lg">
              Send Reset Email →
            </Btn>
            <button onClick={()=>{setMode("login");setErr("");setMsg("");}}
              style={{ width:"100%", marginTop:12, padding:"10px", background:"none", border:"none",
                color:C.textMuted, fontSize:13, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600 }}>
              ← Back to Sign In
            </button>
          </>
        ) : (
          <>
            <Btn onClick={handle} loading={loading} style={{ width:"100%", marginTop:18, padding:"13px", fontSize:15 }} size="lg">
              {mode==="login"?"Sign In →":"Create Account →"}
            </Btn>
            {mode==="login" && (
              <button onClick={()=>{setMode("forgot");setErr("");setMsg("");}}
                style={{ width:"100%", marginTop:10, padding:"8px", background:"none", border:"none",
                  color:C.blue, fontSize:12.5, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif",
                  fontWeight:600 }}>
                Forgot password?
              </button>
            )}
          </>
        )}

        <div style={{ marginTop:24, padding:"14px", background:C.blueGhost, borderRadius:12,
          border:`1px solid ${C.blue}20`, textAlign:"center" }}>
          <div style={{ fontSize:12, color:C.blue, fontWeight:700 }}>
            ⚡ 100% Free · No credit card · Instant access
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// DEEP RESUME ANALYZER
// ══════════════════════════════════════════════════════════════════════════
function ResumeAnalyzer({ savedState, onStateChange }) {
  const [jd, setJd] = useState(savedState.jd || "");
  const [resume, setResume] = useState(savedState.resume || "");
  const [fileName, setFileName] = useState(savedState.fileName || "");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(savedState.result || null);
  const [err, setErr] = useState("");
  const [section, setSection] = useState(savedState.section || "overview");
  const [downloading, setDownloading] = useState("");
  const fileRef = useRef();

  // Persist state to parent on every change
  useEffect(() => {
    onStateChange({ jd, resume, fileName, result, section });
  }, [jd, resume, fileName, result, section]);

  const handleFile = async (e) => {
    const f = e.target.files[0]; if(!f) return;
    setFileName(f.name); setErr("");
    try {
      let text = "";
      if (f.type==="application/pdf"||f.name.endsWith(".pdf")) text = await extractTextFromPDF(f);
      else if (f.name.endsWith(".docx")) text = await extractTextFromDOCX(f);
      else {
        const r=new FileReader();
        r.onload=ev=>setResume(ev.target.result);
        r.readAsText(f); return;
      }
      setResume(text);
    } catch(e2) { setErr("Could not read file: "+e2.message); }
  };

  const LOADING_STEPS = [
    "🔍 Reading job description...",
    "🧠 Scoring keyword matches...",
    "📊 Calculating recruiter shortlist rate...",
    "🏗️ Judging project relevance...",
    "✨ Writing optimized resume...",
    "📄 Finalizing ATS-ready output...",
  ];

  const analyze = async () => {
    if (!jd.trim()||!resume.trim()) { setErr("Fill in both Job Description and Resume."); return; }
    setLoading(true); setErr(""); setResult(null); setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep(p => Math.min(p+1, LOADING_STEPS.length-1));
    }, 2200);

    const jdT = jd.trim().slice(0,900);
    const reT = resume.trim().slice(0,1000);

    try {
      // ── DEEP ANALYSIS PROMPT ──
      const p1 = `You are a senior technical recruiter and ATS specialist with 10+ years experience at top Indian IT companies (TCS, Infosys, Wipro, Cognizant, HCL, Amazon India, Google India).

Analyze this resume against the job description with the same critical eye as a real recruiter. Be precise and realistic.

JD:
${jdT}

RESUME:
${reT}

Return ONLY this exact JSON (no markdown, no extra text):
{
  "matchScore": <0-100 integer: honest JD keyword+skills match percentage>,
  "atsScore": <0-100 integer: ATS parsing friendliness>,
  "recruiterShortlistRate": <0-100 integer: realistic probability a recruiter shortlists this>,
  "verdict": "<one of: Strong Match|Good Match|Moderate Match|Weak Match|Poor Match>",
  "summary": "<2 sentences: what stands out and the single biggest gap>",
  "strengths": [
    {"skill":"<name>","score":<50-100>,"detail":"<why it's strong and how it matches JD>"}
  ],
  "weaknesses": [
    {"area":"<name>","score":<0-50>,"detail":"<specific gap and exact impact on shortlisting>","fix":"<one actionable fix>"}
  ],
  "missingKeywords": [
    {"keyword":"<exact keyword>","importance":"Critical|High|Medium","jdContext":"<where in JD this appears>","tip":"<how to add naturally>"}
  ],
  "projectAnalysis": [
    {"name":"<project name>","relevance":<0-100>,"verdict":"Strong Fit|Moderate Fit|Weak Fit|Remove","reason":"<why>","improvements":"<specific bullet to add or change>","keep":true}
  ],
  "suggestedProjectIdeas": [
    {"title":"<project title for this role>","description":"<what to build and what keywords it adds>","impact":"<why it would improve shortlist rate>"}
  ],
  "atsIssues": ["<specific ATS formatting issue>"],
  "recruiterInsights": ["<what a recruiter notices first>","<red flag if any>","<what would make them call>"],
  "improvements": ["<specific actionable fix>"],
  "skillsToAdd": ["<skill>"],
  "estimatedExperience": "<how it reads to a recruiter: e.g. 0-1 year fresher>",
  "topStrength": "<single most impressive thing about this resume for this role>",
  "topWeakness": "<single biggest reason a recruiter would skip this resume>"
}`;

      const raw1 = await callAI(p1, 2000, "json");
      const analysis = safeJSON(raw1, null);
      if (!analysis?.matchScore) throw new Error("Analysis incomplete — try again or simplify your inputs.");

      setResult({...analysis, optimizedResume:"⏳ Generating your optimized resume..."});
      setSection("overview");
      clearInterval(stepInterval);
      setLoadingStep(4);

      // ── ATS-OPTIMIZED SINGLE PAGE RESUME ──
      const p2 = `You are an expert ATS resume writer. Rewrite this resume for the job below. This is a SINGLE PAGE resume.

STRICT RULES:
1. Section headers in ALL CAPS on their own line: EDUCATION, EXPERIENCE, PROJECTS, TECHNICAL SKILLS, CERTIFICATIONS
2. Bullet points start with STRONG action verbs: Developed, Built, Engineered, Designed, Implemented, Optimized, Architected, Delivered, Reduced, Increased, Automated
3. Mirror EXACT keywords from the JD (do not paraphrase them)
4. Add realistic metrics to every bullet (e.g., "Reduced API response time by 40%", "Built for 500+ users")
5. REMOVE projects with <60% relevance to this JD
6. Remove skills not relevant to this JD
7. Keep skills section focused and JD-matched
8. One page worth of content ONLY (max 550 words total)
9. Plain text ONLY — no JSON, no markdown symbols, no asterisks
10. Name and contact on top: Name | Email | Phone | GitHub | LinkedIn

JD:
${jdT.slice(0,500)}

RESUME:
${reT}

Write the optimized resume now:`;

      const raw2 = await callAI(p2, 1800, "text");
      setResult(prev=>({...prev, optimizedResume:raw2.trim()||"Could not generate — please try again."}));
    } catch(e) {
      setErr(e.message||"Analysis failed. Please try again.");
    }
    clearInterval(stepInterval);
    setLoading(false);
  };

  const sc = s => s>=75?C.green:s>=50?C.amber:C.red;
  const scBg = s => s>=75?C.greenBg:s>=50?C.amberBg:C.redBg;

  const handleDownload = async (type) => {
    const text = result?.optimizedResume || "";
    if (!text||text.startsWith("⏳")) { setErr("Resume is still generating, please wait."); return; }
    setDownloading(type); setErr("");
    try {
      if (type==="pdf") await downloadPDF(text,"TakePlace_ATS_Resume.pdf");
      else await downloadDOCX(text,"TakePlace_ATS_Resume.docx");
    } catch(e2) { setErr("Download failed: "+e2.message); }
    setDownloading("");
  };

  if (loading && !result) return (
    <div style={{ textAlign:"center", padding:"80px 20px" }}>
      <div style={{ width:80, height:80, background:`linear-gradient(135deg,${C.blueGhost},${C.greenBg})`,
        borderRadius:24, display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:38, margin:"0 auto 24px", animation:"float 2s ease-in-out infinite",
        border:`1.5px solid ${C.border}` }}>🧠</div>
      <div style={{ fontWeight:800, fontSize:22, color:C.text, marginBottom:8, letterSpacing:"-0.5px" }}>
        Deep AI Analysis in Progress
      </div>
      <div style={{ color:C.textMuted, fontSize:13, marginBottom:28, lineHeight:1.8 }}>
        Groq AI is analyzing every keyword, scoring your profile,<br/>and writing your optimized ATS resume...
      </div>
      <div style={{ background:C.card, border:`1.5px solid ${C.border}`, borderRadius:16,
        padding:20, maxWidth:380, margin:"0 auto", boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
        {LOADING_STEPS.map((step, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0",
            borderBottom:i<LOADING_STEPS.length-1?`1px solid ${C.border}`:"none",
            opacity:i<=loadingStep?1:.3, transition:"opacity .4s" }}>
            <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0,
              background:i<loadingStep?C.green:i===loadingStep?C.blue:C.bg2,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              {i<loadingStep ? <span style={{ color:"#fff", fontSize:10 }}>✓</span>
                : i===loadingStep ? <SpinIcon size={12} color="#fff"/>
                : null}
            </div>
            <span style={{ fontSize:12.5, color:i<=loadingStep?C.text:C.textMuted, fontWeight:i===loadingStep?700:400 }}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontWeight:900, fontSize:22, color:C.text, marginBottom:4, letterSpacing:"-0.5px" }}>
          ⚡ AI Resume Analyzer
        </div>
        <div style={{ color:C.textMuted, fontSize:13 }}>
          Deep analysis · Recruiter shortlist score · Project judgment · ATS-optimized single-page resume
        </div>
      </div>

      {!result && (
        <div className="fade">
          {err && <div style={{ background:C.redBg, border:`1px solid ${C.red}20`, borderRadius:12,
            padding:"12px 16px", marginBottom:16, color:C.red, fontSize:13, fontWeight:600 }}>⚠ {err}</div>}

          {/* JD Box */}
          <Card style={{ marginBottom:16 }}>
            <SectionTitle icon="📋" title="Job Description"
              sub="Paste the full JD — more detail = better analysis"
              badge={jd && <Tag color={jd.split(/\s+/).filter(Boolean).length>200?C.green:C.amber}>
                {jd.split(/\s+/).filter(Boolean).length} words
              </Tag>}/>
            <textarea value={jd} onChange={e=>setJd(e.target.value)}
              placeholder={"Paste the full job description here...\n\nWe are looking for a Full Stack Developer with experience in React, Node.js, Spring Boot..."}
              style={{...inp, minHeight:180, resize:"vertical", lineHeight:1.8}}/>
          </Card>

          {/* Resume Box */}
          <Card style={{ marginBottom:22 }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18 }}>
              <SectionTitle icon="📄" title="Your Resume"
                sub="Paste text OR upload PDF / DOCX / TXT"/>
              <button onClick={()=>fileRef.current.click()}
                style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${C.border}`,
                  background:C.blueGhost, color:C.blue, fontSize:12.5, cursor:"pointer",
                  fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700,
                  display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                📁 Upload PDF/DOCX/TXT
              </button>
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.doc"
              onChange={handleFile} style={{ display:"none" }}/>
            {fileName && (
              <div style={{ background:C.greenBg, border:`1px solid ${C.green}25`, borderRadius:10,
                padding:"8px 14px", marginBottom:12, fontSize:12.5, color:C.green,
                display:"flex", alignItems:"center", gap:6, fontWeight:600 }}>
                ✅ {fileName} loaded
              </div>
            )}
            <textarea value={resume} onChange={e=>setResume(e.target.value)}
              placeholder={"Paste resume text here OR upload a file above...\n\nInclude: Name, Education, Experience, Projects, Skills, Certifications"}
              style={{...inp, minHeight:220, resize:"vertical", lineHeight:1.8}}/>
            {resume && (
              <div style={{ marginTop:8, fontSize:12, color:resume.length>300?C.green:C.amber, fontWeight:600 }}>
                {resume.length>300?"✓ Resume looks complete — ready for analysis":"⚠ Add more content for accurate analysis"}
              </div>
            )}
          </Card>

          <Btn onClick={analyze} disabled={!jd.trim()||!resume.trim()||loading}
            style={{ width:"100%", padding:"15px", fontSize:15 }} size="xl">
            {loading?<><SpinIcon size={16}/> Analyzing...</>:"🔍 Run Deep Analysis"}
          </Btn>

          <div style={{ marginTop:14, display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
            {["Keyword match score","Recruiter shortlist %","Project judgment","ATS single-page resume"].map(t=>(
              <Tag key={t} color={C.blue}>✓ {t}</Tag>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="fade">
          {/* ── TOP SCORE PANEL ── */}
          <Card style={{ marginBottom:18, background:`linear-gradient(160deg,${C.blueGhost} 0%,${C.card} 60%)` }}>
            {/* Score rings */}
            <div style={{ display:"flex", justifyContent:"center", gap:32, marginBottom:24, flexWrap:"wrap" }}>
              <ScoreRing score={result.matchScore} label="JD Match" color={sc(result.matchScore)}/>
              <ScoreRing score={result.atsScore} label="ATS Score" color={C.blue}/>
              <ScoreRing score={result.recruiterShortlistRate} label="Shortlist Rate" color={sc(result.recruiterShortlistRate)}/>
            </div>

            {/* Verdict */}
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ display:"inline-block", padding:"7px 22px", borderRadius:99,
                background:scBg(result.matchScore), color:sc(result.matchScore),
                fontWeight:800, fontSize:14, marginBottom:12, border:`1px solid ${sc(result.matchScore)}25` }}>
                {result.verdict}
              </div>
              <p style={{ color:C.textSoft, fontSize:14, lineHeight:1.8, maxWidth:520, margin:"0 auto" }}>
                {result.summary}
              </p>
            </div>

            {/* Top strength + weakness callout */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div style={{ background:C.greenBg, border:`1px solid ${C.green}25`, borderRadius:12, padding:14 }}>
                <div style={{ fontSize:11, fontWeight:800, color:C.green, marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Top Strength</div>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.6 }}>{result.topStrength}</div>
              </div>
              <div style={{ background:C.redBg, border:`1px solid ${C.red}20`, borderRadius:12, padding:14 }}>
                <div style={{ fontSize:11, fontWeight:800, color:C.red, marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Top Weakness</div>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.6 }}>{result.topWeakness}</div>
              </div>
            </div>
          </Card>

          {/* ── TAB NAV ── */}
          <div style={{ display:"flex", gap:0, marginBottom:18, background:C.card,
            border:`1.5px solid ${C.border}`, borderRadius:14, overflow:"hidden",
            overflowX:"auto" }}>
            {[
              ["overview","📊 Overview"],
              ["strengths","💪 Strengths"],
              ["gaps","⚠️ Gaps"],
              ["projects","🏗️ Projects"],
              ["resume","✨ Optimized Resume"],
            ].map(([k,l])=>(
              <button key={k} onClick={()=>setSection(k)}
                style={{ flex:1, padding:"11px 14px", border:"none",
                  background:section===k?C.blue:"transparent",
                  color:section===k?"#fff":C.textSoft,
                  cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif",
                  fontWeight:section===k?700:500, fontSize:12.5,
                  whiteSpace:"nowrap", transition:"all .2s",
                  borderRight:`1px solid ${C.border}` }}>
                {l}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ── */}
          {section==="overview" && (
            <div className="fade">
              {/* Recruiter Insights */}
              {result.recruiterInsights?.length>0 && (
                <Card style={{ marginBottom:16 }}>
                  <SectionTitle icon="👔" title="Recruiter's Eye View" sub="What a real recruiter sees in the first 6 seconds"/>
                  {result.recruiterInsights.map((ins,i)=>(
                    <div key={i} style={{ display:"flex", gap:12, padding:"12px 0",
                      borderBottom:i<result.recruiterInsights.length-1?`1px solid ${C.border}`:"none" }}>
                      <div style={{ width:28, height:28, borderRadius:8, background:C.blueGhost,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:14, flexShrink:0 }}>
                        {i===0?"👁":i===1?"🚩":"📞"}
                      </div>
                      <div style={{ fontSize:13.5, color:C.text, lineHeight:1.7, paddingTop:4 }}>{ins}</div>
                    </div>
                  ))}
                </Card>
              )}

              {/* ATS Issues */}
              {result.atsIssues?.length>0 && (
                <Card style={{ marginBottom:16, borderColor:`${C.amber}40` }}>
                  <SectionTitle icon="⚙️" title="ATS Issues Found" sub="Fix these to pass automated screening"
                    badge={<Tag color={C.amber} bg={C.amberBg}>{result.atsIssues.length} issues</Tag>}/>
                  {result.atsIssues.map((iss,i)=>(
                    <div key={i} style={{ display:"flex", gap:10, padding:"9px 14px",
                      background:C.amberBg, borderRadius:10, marginBottom:8,
                      border:`1px solid ${C.amber}20` }}>
                      <span style={{ color:C.amber, flexShrink:0, fontWeight:700 }}>!</span>
                      <span style={{ fontSize:13, color:C.text }}>{iss}</span>
                    </div>
                  ))}
                </Card>
              )}

              {/* Quick Improvements */}
              {result.improvements?.length>0 && (
                <Card style={{ marginBottom:16 }}>
                  <SectionTitle icon="🎯" title="Quick Wins" sub="Do these to increase shortlist rate immediately"/>
                  {result.improvements.map((imp,i)=>(
                    <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start",
                      padding:"10px 0", borderBottom:i<result.improvements.length-1?`1px solid ${C.border}`:"none" }}>
                      <div style={{ width:22, height:22, borderRadius:6, background:C.blueGhost,
                        color:C.blue, fontWeight:800, fontSize:11, flexShrink:0,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {i+1}
                      </div>
                      <span style={{ fontSize:13.5, color:C.textSoft, lineHeight:1.7 }}>{imp}</span>
                    </div>
                  ))}
                </Card>
              )}

              {/* Skills to Add */}
              {result.skillsToAdd?.length>0 && (
                <Card>
                  <SectionTitle icon="➕" title="Skills to Add" sub="These are in the JD but missing from your resume"/>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {result.skillsToAdd.map((s,i)=>(
                      <Tag key={i} color={C.purple} bg={C.purpleBg}>+ {s}</Tag>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ── STRENGTHS TAB ── */}
          {section==="strengths" && (
            <div className="fade">
              <Card style={{ marginBottom:16 }}>
                <SectionTitle icon="💪" title="Your Strengths"
                  sub="Skills that match this JD well"
                  badge={<Tag color={C.green} bg={C.greenBg}>{result.strengths?.length||0} found</Tag>}/>
                {result.strengths?.length>0 ? result.strengths.map((s,i)=>(
                  <div key={i} style={{ marginBottom:18 }}>
                    <ProgressBar value={s.score} color={C.green} label={s.skill} sub={s.detail}/>
                  </div>
                )) : <div style={{ color:C.textMuted, fontSize:13 }}>No strong matches detected for this JD.</div>}
              </Card>

              {result.weaknesses?.length>0 && (
                <Card>
                  <SectionTitle icon="📉" title="Weak Areas"
                    sub="Gaps that reduce your shortlist probability"
                    badge={<Tag color={C.red} bg={C.redBg}>{result.weaknesses.length} gaps</Tag>}/>
                  {result.weaknesses.map((w,i)=>(
                    <div key={i} style={{ background:C.bg2, borderRadius:12, padding:16, marginBottom:12,
                      border:`1px solid ${C.border}` }}>
                      <ProgressBar value={w.score} color={C.red} label={w.area}/>
                      <div style={{ fontSize:13, color:C.textSoft, lineHeight:1.7, marginBottom:8 }}>{w.detail}</div>
                      <div style={{ background:C.amberBg, border:`1px solid ${C.amber}20`,
                        borderRadius:9, padding:"8px 12px", fontSize:12.5, color:C.text }}>
                        💡 <strong style={{ color:C.amber }}>Fix:</strong> {w.fix}
                      </div>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          )}

          {/* ── GAPS TAB ── */}
          {section==="gaps" && (
            <div className="fade">
              <Card>
                <SectionTitle icon="⚠️" title="Missing Keywords"
                  sub="Keywords from the JD not found in your resume"
                  badge={<Tag color={C.red} bg={C.redBg}>{result.missingKeywords?.length||0} missing</Tag>}/>
                {result.missingKeywords?.length>0 ? result.missingKeywords.map((m,i)=>{
                  const ic = m.importance==="Critical"?C.red:m.importance==="High"?C.amber:C.blue;
                  const ib = m.importance==="Critical"?C.redBg:m.importance==="High"?C.amberBg:C.blueGhost;
                  return (
                    <div key={i} style={{ background:C.bg2, borderRadius:14, padding:18, marginBottom:12,
                      border:`1.5px solid ${ic}25` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                        <div style={{ fontWeight:800, fontSize:15, color:C.text }}>🔑 {m.keyword}</div>
                        <Tag color={ic} bg={ib}>{m.importance}</Tag>
                      </div>
                      {m.jdContext && (
                        <div style={{ fontSize:12, color:C.textMuted, marginBottom:8, fontStyle:"italic" }}>
                          From JD: "{m.jdContext}"
                        </div>
                      )}
                      <div style={{ background:C.card, border:`1px solid ${C.border}`,
                        borderRadius:9, padding:"9px 12px", fontSize:13, color:C.textSoft, lineHeight:1.7 }}>
                        💡 {m.tip}
                      </div>
                    </div>
                  );
                }) : (
                  <div style={{ textAlign:"center", padding:"28px 0", color:C.green, fontWeight:700, fontSize:15 }}>
                    🎉 No critical missing keywords! Great JD coverage.
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* ── PROJECTS TAB ── */}
          {section==="projects" && (
            <div className="fade">
              <Card style={{ marginBottom:16 }}>
                <SectionTitle icon="🏗️" title="Project Relevance Analysis"
                  sub="AI judgment on each project — keep, improve, or remove?"/>
                {result.projectAnalysis?.length>0 ? result.projectAnalysis.map((p,i)=>{
                  const vc = p.verdict==="Strong Fit"?C.green:p.verdict==="Moderate Fit"?C.amber:p.verdict==="Remove"?C.red:C.textMuted;
                  const vb = p.verdict==="Strong Fit"?C.greenBg:p.verdict==="Moderate Fit"?C.amberBg:p.verdict==="Remove"?C.redBg:C.bg2;
                  return (
                    <div key={i} style={{ background:C.bg2, borderRadius:14, padding:18, marginBottom:14,
                      border:`1.5px solid ${vc}25` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                        <div style={{ fontWeight:800, fontSize:15, color:C.text }}>{p.name}</div>
                        <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                          <Tag color={sc(p.relevance)}>{p.relevance}% relevant</Tag>
                          <Tag color={vc} bg={vb}>{p.verdict}</Tag>
                        </div>
                      </div>
                      <ProgressBar value={p.relevance} color={vc}/>
                      <div style={{ fontSize:13, color:C.textSoft, lineHeight:1.7, marginBottom:p.improvements?10:0 }}>
                        {p.reason}
                      </div>
                      {p.improvements && (
                        <div style={{ background:C.blueGhost, border:`1px solid ${C.blue}20`,
                          borderRadius:9, padding:"9px 12px", fontSize:12.5, color:C.text, marginTop:10 }}>
                          ✏️ <strong style={{ color:C.blue }}>Improve bullet:</strong> {p.improvements}
                        </div>
                      )}
                    </div>
                  );
                }) : <div style={{ color:C.textMuted, fontSize:13 }}>No projects detected in your resume.</div>}
              </Card>

              {result.suggestedProjectIdeas?.length>0 && (
                <Card style={{ borderColor:`${C.purple}30` }}>
                  <SectionTitle icon="💡" title="Suggested New Projects"
                    sub="Build these to dramatically improve your match for this role"/>
                  {result.suggestedProjectIdeas.map((p,i)=>(
                    <div key={i} style={{ background:C.purpleBg, borderRadius:12, padding:16, marginBottom:12,
                      border:`1px solid ${C.purple}20` }}>
                      <div style={{ fontWeight:800, color:C.text, fontSize:14, marginBottom:6 }}>🚀 {p.title}</div>
                      <div style={{ fontSize:13, color:C.textSoft, marginBottom:8, lineHeight:1.7 }}>{p.description}</div>
                      <div style={{ fontSize:12, color:C.purple, fontWeight:600 }}>📈 Impact: {p.impact}</div>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          )}

          {/* ── OPTIMIZED RESUME TAB ── */}
          {section==="resume" && (
            <div className="fade">
              <Card>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18, flexWrap:"wrap", gap:12 }}>
                  <div>
                    <div style={{ fontWeight:800, fontSize:17, color:C.text, letterSpacing:"-0.3px" }}>✨ ATS-Optimized Resume</div>
                    <div style={{ color:C.textMuted, fontSize:12, marginTop:2 }}>
                      Single page · Jake format · Action verbs · JD keyword-matched · ATS ready
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <Btn variant="secondary" size="sm"
                      onClick={()=>navigator.clipboard.writeText(result.optimizedResume||"")}>
                      📋 Copy Text
                    </Btn>
                    <Btn variant="blue_outline" size="sm"
                      onClick={()=>handleDownload("docx")} loading={downloading==="docx"}>
                      ⬇ Download DOCX
                    </Btn>
                    <Btn size="sm"
                      onClick={()=>handleDownload("pdf")} loading={downloading==="pdf"}>
                      ⬇ Download PDF
                    </Btn>
                  </div>
                </div>

                {/* Score summary */}
                <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" }}>
                  {[
                    { label:"JD Match", score:result.matchScore, color:sc(result.matchScore) },
                    { label:"ATS Score", score:result.atsScore, color:C.blue },
                    { label:"Shortlist Rate", score:result.recruiterShortlistRate, color:sc(result.recruiterShortlistRate) },
                  ].map((s,i)=>(
                    <div key={i} style={{ background:C.bg2, borderRadius:12, padding:"10px 16px",
                      border:`1.5px solid ${C.border}`, display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ fontWeight:900, fontSize:20, color:s.color }}>{s.score}%</div>
                      <div style={{ fontSize:11.5, color:C.textMuted, fontWeight:600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {result.optimizedResume?.startsWith("⏳") ? (
                  <div style={{ textAlign:"center", padding:"40px 0" }}>
                    <SpinIcon size={32}/>
                    <div style={{ color:C.textMuted, fontSize:13, marginTop:12 }}>
                      Writing your optimized resume...
                    </div>
                  </div>
                ) : (
                  <div style={{ background:C.bg2, border:`1.5px solid ${C.border}`, borderRadius:14, padding:24 }}>
                    <pre style={{ whiteSpace:"pre-wrap", fontSize:12.5, color:C.text, lineHeight:2,
                      fontFamily:"'IBM Plex Mono',monospace", maxHeight:600, overflowY:"auto" }}>
                      {result.optimizedResume}
                    </pre>
                  </div>
                )}

                <div style={{ marginTop:16, background:`linear-gradient(135deg,${C.blueGhost},${C.greenBg})`,
                  borderRadius:12, padding:"12px 16px", fontSize:13, color:C.textSoft, lineHeight:1.7,
                  border:`1px solid ${C.border}` }}>
                  💡 <strong style={{ color:C.blue }}>Pro tip:</strong> Download PDF for job portals (Naukri, LinkedIn, company portals). Download DOCX to edit in Google Docs before applying.
                </div>
              </Card>
            </div>
          )}

          {err && (
            <div style={{ background:C.redBg, border:`1px solid ${C.red}20`, borderRadius:12,
              padding:"12px 16px", marginTop:16, color:C.red, fontSize:13, fontWeight:600 }}>
              ⚠ {err}
            </div>
          )}

          <div style={{ marginTop:20 }}>
            <Btn variant="secondary" onClick={()=>{
              setResult(null); setErr(""); setJd(""); setResume(""); setFileName(""); setSection("overview");
            }} style={{ width:"100%", fontSize:13 }}>
              🔄 Analyze Another Role
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════
function MainApp({ user, onLogout }) {
  const [tab, setTab] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");
  const [search, setSearch] = useState("software engineer fresher");
  const [location, setLocation] = useState("hyderabad");
  const [expandedJob, setExpandedJob] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

  // ── Persistent analyzer state — survives tab switches ──
  const [analyzerState, setAnalyzerState] = useState({
    jd:"", resume:"", fileName:"", result:null, section:"overview"
  });

  const name = user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";

  useEffect(()=>{ fetchJobs(); },[]);

  const fetchJobs = async (q=search,loc=location) => {
    setJobsLoading(true); setJobsError("");
    try {
      const url=`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&what=${encodeURIComponent(q)}&where=${encodeURIComponent(loc)}&sort_by=date&content-type=application/json`;
      const res=await fetch(url);
      const data=await res.json();
      if (data.results?.length>0) {
        setJobs(data.results.map(j=>({
          id:j.id, title:j.title,
          company:j.company?.display_name||"Company",
          location:j.location?.display_name||loc,
          salary:j.salary_min?`₹${Math.round(j.salary_min/100000)}–${Math.round((j.salary_max||j.salary_min*1.5)/100000)} LPA`:"Competitive",
          description:j.description||"No description available.",
          descriptionShort:(j.description||"").slice(0,220),
          url:j.redirect_url,
          posted:new Date(j.created).toLocaleDateString("en-IN",{day:"numeric",month:"short"}),
          category:j.category?.label||"Technology",
        })));
      } else setJobsError("No jobs found. Try 'java developer' or 'data analyst'.");
    } catch { setJobsError("Could not load jobs. Check your internet connection."); }
    setJobsLoading(false);
  };

  const TABS=[["💼","Jobs"],["⚡","Analyze Resume"],["ℹ️","About"]];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{css}</style>

      {/* Header */}
      <div style={{ background:C.card, borderBottom:`1.5px solid ${C.border}`, padding:"0 20px",
        position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 8px rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth:860, margin:"0 auto", display:"flex", alignItems:"center",
          justifyContent:"space-between", height:62 }}>
          <div style={{ fontWeight:900, fontSize:20, color:C.blue, letterSpacing:"-0.5px" }}>
            ⚡ TakePlace
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:32, height:32, borderRadius:"50%",
                background:`linear-gradient(135deg,${C.blue},${C.blueLight})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, fontSize:12, color:"#fff", flexShrink:0 }}>
                {name[0].toUpperCase()}
              </div>
              <span className="hide-mobile" style={{ fontSize:13, color:C.textSoft, fontWeight:600 }}>
                {name.split(" ")[0]}
              </span>
            </div>
            <Btn variant="secondary" onClick={onLogout} size="sm">Logout</Btn>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background:C.card, borderBottom:`1.5px solid ${C.border}`,
        position:"sticky", top:62, zIndex:99 }}>
        <div style={{ maxWidth:860, margin:"0 auto", display:"flex" }}>
          {TABS.map(([icon,label],i)=>(
            <button key={i} onClick={()=>setTab(i)}
              style={{ flex:1, padding:"13px 6px", border:"none", background:"transparent",
                cursor:"pointer", color:tab===i?C.blue:C.textMuted,
                fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:tab===i?800:500, fontSize:13.5,
                borderBottom:`2px solid ${tab===i?C.blue:"transparent"}`,
                transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <span>{icon}</span>
              <span className="hide-mobile">{label}</span>
              <span className="show-mobile" style={{ display:"none" }}>{label.split(" ").pop()}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:860, margin:"0 auto", padding:"24px 16px 80px" }}>

        {/* ── JOBS TAB ── */}
        {tab===0 && (
          <div>
            <Card style={{ marginBottom:20 }}>
              <SectionTitle icon="🔍" title="Find Jobs" sub="Search real live jobs from Indian companies"/>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                <input style={inp} placeholder="Role (react developer...)" value={search}
                  onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
                <input style={inp} placeholder="City (hyderabad...)" value={location}
                  onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
              </div>
              <Btn onClick={()=>fetchJobs()} style={{ width:"100%" }}>🔍 Search Jobs</Btn>
            </Card>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:18, color:C.text, letterSpacing:"-0.4px" }}>Live Job Feed</div>
              {!jobsLoading&&jobs.length>0&&(
                <div style={{ display:"flex", alignItems:"center", gap:6, background:C.greenBg,
                  border:`1px solid ${C.green}25`, borderRadius:99, padding:"5px 14px" }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, animation:"pulse 1.5s infinite" }}/>
                  <span style={{ color:C.green, fontSize:11.5, fontWeight:700 }}>{jobs.length} live jobs</span>
                </div>
              )}
            </div>

            {jobsLoading && (
              <div style={{ textAlign:"center", padding:"60px 20px" }}>
                <SpinIcon size={36} color={C.blue}/>
                <div style={{ color:C.textMuted, fontSize:13.5, marginTop:14, fontWeight:600 }}>Fetching live jobs...</div>
              </div>
            )}
            {jobsError && (
              <div style={{ background:C.redBg, border:`1px solid ${C.red}20`, borderRadius:14,
                padding:22, color:C.red, textAlign:"center", fontSize:13.5, fontWeight:600 }}>
                {jobsError}
              </div>
            )}

            {!jobsLoading&&jobs.map((job,i)=>{
              const isExp=expandedJob===job.id;
              return (
                <div key={job.id} className="fade hover-card" style={{ background:C.card,
                  border:`1.5px solid ${C.border}`, borderRadius:16, padding:"18px 20px",
                  marginBottom:12, borderLeft:`3px solid ${C.blue}`,
                  boxShadow:"0 1px 6px rgba(0,0,0,.04)", animationDelay:`${i*0.04}s` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15.5, color:C.text, letterSpacing:"-0.2px" }}>{job.title}</div>
                      <div style={{ color:C.textSoft, fontSize:12.5, marginTop:3 }}>{job.company} · {job.location}</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ color:C.green, fontWeight:800, fontSize:14 }}>{job.salary}</div>
                      <div style={{ color:C.textMuted, fontSize:11, marginTop:2 }}>{job.posted}</div>
                    </div>
                  </div>
                  <div style={{ color:C.textMuted, fontSize:12.5, lineHeight:1.7, marginBottom:12,
                    background:C.bg2, borderRadius:10, padding:"10px 14px", border:`1px solid ${C.border}` }}>
                    {isExp?job.description:job.descriptionShort+(job.description.length>220?"...":"")}
                    {job.description.length>220&&(
                      <button onClick={()=>setExpandedJob(isExp?null:job.id)}
                        style={{ background:"none", border:"none", color:C.blue, fontSize:11.5,
                          cursor:"pointer", marginLeft:6, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700 }}>
                        {isExp?"Show less ▲":"Read more ▼"}
                      </button>
                    )}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <Tag color={C.blue} bg={C.blueGhost}>{job.category}</Tag>
                    <div style={{ display:"flex", gap:8 }}>
                      <Btn variant="secondary" size="sm" onClick={()=>setTab(1)}>⚡ Analyze Resume</Btn>
                      <Btn size="sm" onClick={()=>window.open(job.url,"_blank")}>Apply →</Btn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── RESUME ANALYZER TAB ── no re-mount, state preserved ── */}
        {tab===1 && (
          <ResumeAnalyzer
            savedState={analyzerState}
            onStateChange={setAnalyzerState}
          />
        )}

        {/* ── ABOUT TAB ── */}
        {tab===2 && (
          <div className="fade">
            {/* Developer Card */}
            <div style={{ background:`linear-gradient(135deg,${C.blue} 0%,${C.blueLight} 100%)`,
              borderRadius:24, padding:36, marginBottom:20, position:"relative", overflow:"hidden",
              boxShadow:`0 12px 40px ${C.blue}25` }}>
              <div style={{ position:"absolute", top:-30, right:-30, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,.08)" }}/>
              <div style={{ position:"absolute", bottom:-20, left:-10, width:150, height:150, borderRadius:"50%", background:"rgba(255,255,255,.06)" }}/>
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:20 }}>
                  <div style={{ width:70, height:70, borderRadius:20,
                    background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:36, backdropFilter:"blur(10px)",
                    border:"1.5px solid rgba(255,255,255,.3)" }}>👨‍💻</div>
                  <div>
                    <div style={{ fontWeight:900, fontSize:22, color:"#fff", letterSpacing:"-0.5px" }}>Dadigela Raghu Reddy</div>
                    <div style={{ color:"rgba(255,255,255,.75)", fontSize:13.5, marginTop:2 }}>
                      Founder & Developer, TakePlace
                    </div>
                    <div style={{ color:"rgba(255,255,255,.6)", fontSize:12, marginTop:2 }}>
                      CS (AIML) · Mallareddy University, Hyderabad · 2026
                    </div>
                  </div>
                </div>
                <p style={{ color:"rgba(255,255,255,.85)", fontSize:14, lineHeight:1.85, marginBottom:20 }}>
                  TakePlace was born from a real problem — spending hours tailoring resumes, getting rejected before a human ever saw them, and not knowing why. As a fresher navigating the same job market, Raghu built the tool he wished existed: one that tells you <em>exactly</em> what's wrong, fixes it with AI, and gives you an honest shortlist prediction so you can stop guessing.
                </p>
                <div style={{ display:"flex", gap:10 }}>
                  <a href="https://github.com/raghu227" target="_blank" rel="noreferrer"
                    style={{ background:"rgba(255,255,255,.18)", color:"#fff", padding:"8px 18px",
                      borderRadius:10, fontSize:13, fontWeight:700, textDecoration:"none",
                      border:"1px solid rgba(255,255,255,.25)", display:"flex", alignItems:"center", gap:6 }}>
                    GitHub ↗
                  </a>
                  <a href="https://linkedin.com/in/raghu-reddy" target="_blank" rel="noreferrer"
                    style={{ background:"rgba(255,255,255,.18)", color:"#fff", padding:"8px 18px",
                      borderRadius:10, fontSize:13, fontWeight:700, textDecoration:"none",
                      border:"1px solid rgba(255,255,255,.25)", display:"flex", alignItems:"center", gap:6 }}>
                    LinkedIn ↗
                  </a>
                </div>
              </div>
            </div>

            {/* App Info */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
              <Card>
                <div style={{ fontSize:28, marginBottom:12 }}>⚡</div>
                <div style={{ fontWeight:800, fontSize:16, color:C.text, marginBottom:8 }}>What is TakePlace?</div>
                <p style={{ color:C.textSoft, fontSize:13, lineHeight:1.8 }}>
                  An AI-powered job platform for Indian freshers — live jobs, deep resume analysis, ATS optimization, and recruiter shortlist prediction in one place.
                </p>
              </Card>
              <Card>
                <div style={{ fontSize:28, marginBottom:12 }}>🧠</div>
                <div style={{ fontWeight:800, fontSize:16, color:C.text, marginBottom:8 }}>Powered By</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {[["Groq AI","Llama 3.3 70B — fast + free"],["Adzuna API","Real Indian job listings"],["Supabase","Auth + data"]].map(([t,s])=>(
                    <div key={t} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontWeight:700, fontSize:13, color:C.text }}>{t}</span>
                      <span style={{ fontSize:11.5, color:C.textMuted }}>{s}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Features */}
            <Card style={{ marginBottom:20 }}>
              <SectionTitle icon="✅" title="Everything That's Free" sub="No paywalls. No credit card."/>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  "Live job search","Resume upload (PDF/DOCX)","Deep AI analysis",
                  "Keyword gap finder","Recruiter shortlist score","Project relevance judgment",
                  "ATS-optimized resume","PDF & DOCX download","Account saved across sessions",
                ].map(f=>(
                  <div key={f} style={{ display:"flex", alignItems:"center", gap:8,
                    padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ color:C.green, fontWeight:800, fontSize:14 }}>✓</span>
                    <span style={{ fontSize:13, color:C.text }}>{f}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Support */}
            <Card style={{ background:C.blueGhost, borderColor:`${C.blue}30` }}>
              <SectionTitle icon="💬" title="Support" sub="Questions, feedback, or bug reports?"/>
              <p style={{ color:C.textSoft, fontSize:13.5, lineHeight:1.8, marginBottom:16 }}>
                TakePlace is actively maintained. If you find a bug, have a feature request, or just want to say hi — reach out directly.
              </p>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <a href="mailto:support@takeplace.in"
                  style={{ background:C.blue, color:"#fff", padding:"9px 18px", borderRadius:10,
                    fontSize:13, fontWeight:700, textDecoration:"none",
                    display:"flex", alignItems:"center", gap:6 }}>
                  ✉️ support@takeplace.in
                </a>
                <a href="https://github.com/raghu227" target="_blank" rel="noreferrer"
                  style={{ background:C.card, color:C.text, padding:"9px 18px", borderRadius:10,
                    fontSize:13, fontWeight:700, textDecoration:"none",
                    border:`1.5px solid ${C.border}`, display:"flex", alignItems:"center", gap:6 }}>
                  🐛 Report Issue on GitHub
                </a>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser]             = useState(null);
  const [appLoading, setAppLoading] = useState(true);
  const [page, setPage]             = useState("landing");

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if (session?.user) { setUser(session.user); setPage("app"); }
      setAppLoading(false);
    });
    const { data:{ subscription } } = supabase.auth.onAuthStateChange((_,session)=>{
      if (session?.user) { setUser(session.user); setPage("app"); }   // ← no splash
      else { setUser(null); setPage("landing"); }
    });
    return ()=>subscription.unsubscribe();
  },[]);

  const handleLogin  = (u) => { setUser(u); setPage("app"); };  // ← no splash
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setPage("landing"); };

  if (appLoading) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center",
      justifyContent:"center", flexDirection:"column", gap:16 }}>
      <style>{css}</style>
      <div style={{ width:52, height:52, background:`linear-gradient(135deg,${C.blue},${C.blueLight})`,
        borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:28, boxShadow:`0 8px 24px ${C.blue}30` }}>⚡</div>
      <SpinIcon size={28} color={C.blue}/>
      <div style={{ color:C.textMuted, fontSize:13.5, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600 }}>
        Loading TakePlace...
      </div>
    </div>
  );

  if (page==="landing") return <LandingPage onGetStarted={()=>setPage("auth")}/>;
  if (page==="auth")    return <AuthPage onLogin={handleLogin} onBack={()=>setPage("landing")}/>;
  return <MainApp user={user} onLogout={handleLogout}/>;
}
