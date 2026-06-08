import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID  = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const supabase   = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── DESIGN TOKENS — WHITE/LIGHT THEME ─────────────────────────────────────
const C = {
  bg:"#ffffff", card:"#f8f9fc", card2:"#f1f4f9", border:"#e2e8f0",
  blue:"#2563eb", blueLight:"#3b82f6", blueDark:"#1d4ed8",
  green:"#16a34a", greenDark:"#14532d",
  text:"#0f172a", muted:"#64748b", soft:"#475569",
  danger:"#dc2626", warn:"#d97706", purple:"#7c3aed", purpleDark:"#5b21b6",
  orange:"#ea580c", orangeLight:"#f97316",
};

// ─── GLOBAL CSS — LIGHT THEME ──────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{background:#ffffff;font-family:'Inter',sans-serif;color:#0f172a;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}
  ::selection{background:${C.blue}30;color:#0f172a;}

  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scaleIn{from{transform:scale(0.95);opacity:0}to{transform:scale(1);opacity:1}}

  .fade{animation:fadeUp .4s ease forwards;}
  .fadeIn{animation:fadeIn .3s ease forwards;}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  .float{animation:float 3s ease-in-out infinite;}
  .hover-lift{transition:all .2s;cursor:pointer;}
  .hover-lift:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.10);}
  input:focus,textarea:focus,select:focus{border-color:${C.blue}!important;outline:none;box-shadow:0 0 0 3px ${C.blue}18;}
  button:active{transform:scale(.98);}
`;

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────
const inp = {
  width:"100%", background:"#ffffff", border:`1.5px solid ${C.border}`,
  borderRadius:10, padding:"11px 14px", color:C.text, fontSize:14,
  fontFamily:"'Inter',sans-serif", outline:"none", transition:"all .2s",
};

const Btn = ({ children, onClick, variant="primary", style={}, disabled=false, loading=false }) => {
  const v = {
    primary:{ background:`linear-gradient(135deg,${C.blue},${C.blueLight})`, color:"#fff", fontWeight:700, boxShadow:"0 2px 8px "+C.blue+"40" },
    ghost:{ background:"transparent", color:C.soft, border:`1.5px solid ${C.border}` },
    green:{ background:`linear-gradient(135deg,${C.greenDark},${C.green})`, color:"#fff", fontWeight:700 },
    purple:{ background:`linear-gradient(135deg,${C.purpleDark},${C.purple})`, color:"#fff", fontWeight:700 },
    danger:{ background:`linear-gradient(135deg,#991b1b,${C.danger})`, color:"#fff", fontWeight:700 },
    glass:{ background:"rgba(255,255,255,.8)", color:C.text, border:`1.5px solid ${C.border}`, backdropFilter:"blur(12px)" },
    cta:{ background:`linear-gradient(135deg,${C.blue},${C.blueDark})`, color:"#fff", fontWeight:800, boxShadow:"0 4px 20px "+C.blue+"50", fontSize:15 },
  };
  return (
    <button onClick={disabled||loading ? undefined : onClick} disabled={disabled||loading}
      style={{ padding:"11px 22px", borderRadius:10, border:"none", cursor:disabled||loading?"not-allowed":"pointer",
        fontFamily:"'Inter',sans-serif", fontSize:14, transition:"all .2s",
        opacity:disabled?0.5:1, display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8,
        ...v[variant], ...style }}>
      {loading ? <><SpinIcon size={14} color={variant==="ghost"?C.blue:"#fff"}/> Loading...</> : children}
    </button>
  );
};

const SpinIcon = ({ size=18, color=C.blue }) => (
  <span className="spin" style={{ width:size, height:size, border:`2px solid ${color}30`,
    borderTopColor:color, borderRadius:"50%", display:"inline-block", flexShrink:0 }} />
);

const ScoreRing = ({ score, size=90, color }) => {
  const r = 36, circ = 2*Math.PI*r;
  const pct = Math.max(0,Math.min(100,score));
  const col = color || (pct>=75?C.green:pct>=50?C.warn:C.danger);
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke={C.border} strokeWidth="6"/>
      <circle cx="40" cy="40" r={r} fill="none" stroke={col} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
        strokeLinecap="round" transform="rotate(-90 40 40)"
        style={{transition:"stroke-dashoffset 1.2s ease"}}/>
      <text x="40" y="44" textAnchor="middle" fill={col} fontSize="16" fontWeight="800" fontFamily="Inter">{pct}%</text>
    </svg>
  );
};

const ScoreBar = ({ score, color }) => (
  <div style={{ background:C.border, borderRadius:4, height:5, overflow:"hidden", marginTop:5 }}>
    <div style={{ height:"100%", width:`${score}%`, background:color, borderRadius:4, transition:"width 1.2s ease" }}/>
  </div>
);

const Tag = ({ children, color=C.blue, bg }) => (
  <span style={{ background:bg||`${color}15`, color, fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:700, whiteSpace:"nowrap", border:`1px solid ${color}30` }}>
    {children}
  </span>
);

const Card = ({ children, style={} }) => (
  <div style={{ background:C.card, border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, ...style }}>
    {children}
  </div>
);

// ─── AI API ─────────────────────────────────────────────────────────────────
async function callAI(prompt, maxTokens=1500, mode="json", retries=2) {
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

// ─── PDF TEXT EXTRACTION ───────────────────────────────────────────────────
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

// ─── DOWNLOAD HELPERS ──────────────────────────────────────────────────────
function downloadTXT(text, filename) {
  const blob = new Blob([text],{type:"text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

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
  doc.setFont("helvetica","normal");
  doc.setFontSize(10);
  const lines = doc.splitTextToSize(text, 180);
  let y=15;
  lines.forEach(line=>{
    if(y>280){doc.addPage();y=15;}
    doc.text(line,15,y);
    y+=5;
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
  const { Document, Packer, Paragraph, TextRun } = window.docx;
  const paragraphs = text.split("\n").map(line=>
    new Paragraph({ children:[new TextRun({ text:line, size:20 })] })
  );
  const doc = new Document({ sections:[{properties:{},children:paragraphs}] });
  const blob = await Packer.toBlob(doc);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// ══════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ══════════════════════════════════════════════════════════════════════════
function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>40);
    window.addEventListener("scroll",h);
    return ()=>window.removeEventListener("scroll",h);
  },[]);

  const stats = [
    { n:"50K+", label:"Jobs Listed" },
    { n:"12K+", label:"Resumes Optimized" },
    { n:"94%",  label:"ATS Pass Rate" },
    { n:"3x",   label:"More Interviews" },
  ];

  const features = [
    { icon:"🔥", title:"Live Job Feed", desc:"Real jobs from Indian companies, updated daily via Adzuna API. Filter by role and city instantly." },
    { icon:"⚡", title:"AI Resume Analyzer", desc:"Paste any JD + your resume. AI scans every keyword gap, scores your match, and tells you exactly what to fix." },
    { icon:"🎯", title:"Project Relevance Check", desc:"AI judges which of your projects to keep, remove, or reframe based on the specific JD you're targeting." },
    { icon:"✨", title:"ATS Resume Rewriter", desc:"One click — get a fully rewritten resume in Jake format, with action verbs and mirrored JD keywords." },
    { icon:"📊", title:"Match Score + ATS Score", desc:"Two scores with % rings show how well your resume matches the JD and how ATS-friendly it is." },
    { icon:"📥", title:"Download PDF & DOCX", desc:"Export your optimized resume in PDF or DOCX format, ready to submit directly to recruiters." },
  ];

  const testimonials = [
    { name:"Priya M.", role:"SDE at Wipro", text:"Got 3 interview calls in one week after using TakePlace. The AI found keywords I was completely missing.", avatar:"PM" },
    { name:"Arun K.", role:"Data Analyst at TCS", text:"Resume score jumped from 42% to 89% after optimization. Exactly what I needed as a fresher.", avatar:"AK" },
    { name:"Sneha R.", role:"Full Stack Dev at Infosys", text:"The project relevance checker is genius. Told me to remove two projects that were hurting my chances.", avatar:"SR" },
  ];

  return (
    <div style={{ background:C.bg, color:C.text, fontFamily:"'Inter',sans-serif", overflowX:"hidden" }}>
      <style>{css}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000,
        background:scrolled?"rgba(255,255,255,.95)":"transparent",
        backdropFilter:scrolled?"blur(20px)":"none",
        borderBottom:scrolled?`1px solid ${C.border}`:"none",
        transition:"all .3s", padding:"0 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ fontWeight:900, fontSize:22, color:C.blue, display:"flex", alignItems:"center", gap:6 }}>
            ⚡ <span>TakePlace</span>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="ghost" onClick={onGetStarted} style={{ padding:"8px 18px", fontSize:13 }}>Sign In</Btn>
            <Btn variant="cta" onClick={onGetStarted} style={{ padding:"8px 20px", fontSize:13 }}>Get Free Access →</Btn>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        padding:"120px 24px 80px", position:"relative", overflow:"hidden",
        background:"linear-gradient(160deg,#eff6ff 0%,#ffffff 50%,#f0fdf4 100%)" }}>
        <div style={{ position:"absolute", top:"10%", right:"5%", width:400, height:400, borderRadius:"50%",
          background:"radial-gradient(circle,#dbeafe,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"10%", left:"5%", width:300, height:300, borderRadius:"50%",
          background:"radial-gradient(circle,#dcfce7,transparent 70%)", pointerEvents:"none" }}/>

        <div style={{ textAlign:"center", maxWidth:820, position:"relative", zIndex:1 }}>
          <div className="fade" style={{ display:"inline-flex", alignItems:"center", gap:8,
            background:`${C.blue}10`, border:`1px solid ${C.blue}30`, borderRadius:20,
            padding:"6px 16px", marginBottom:28, fontSize:12, color:C.blue, fontWeight:700 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:C.blue, display:"inline-block", animation:"pulse 1.5s infinite" }}/>
            AI-Powered Job Platform for Indian Freshers
          </div>

          <div className="fade" style={{ fontWeight:900, fontSize:"clamp(36px,6vw,68px)", lineHeight:1.1,
            marginBottom:24, color:C.text, animationDelay:".1s" }}>
            Land Your Dream Job<br/>
            <span style={{ color:C.blue }}>Faster with AI</span>
          </div>

          <div className="fade" style={{ fontSize:17, color:C.soft, lineHeight:1.8, marginBottom:40,
            maxWidth:580, margin:"0 auto 40px", animationDelay:".2s" }}>
            Real live jobs · AI resume analyzer · ATS score · Keyword gap finder · One-click rewrite.<br/>
            <strong style={{ color:C.text }}>Everything you need. Zero guesswork.</strong>
          </div>

          <div className="fade" style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", animationDelay:".3s" }}>
            <Btn variant="cta" onClick={onGetStarted} style={{ padding:"15px 36px", fontSize:16, borderRadius:12 }}>
              🚀 Start Free — No Credit Card
            </Btn>
            <Btn variant="ghost" onClick={()=>document.getElementById("features").scrollIntoView({behavior:"smooth"})}
              style={{ padding:"15px 28px", fontSize:16, borderRadius:12 }}>See How It Works ↓</Btn>
          </div>

          <div className="fade" style={{ display:"flex", gap:0, justifyContent:"center", marginTop:64,
            background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:20, overflow:"hidden",
            maxWidth:560, margin:"64px auto 0", boxShadow:"0 4px 24px rgba(0,0,0,0.06)", animationDelay:".4s" }}>
            {stats.map((s,i)=>(
              <div key={i} style={{ flex:1, padding:"20px 10px", borderRight:i<stats.length-1?`1px solid ${C.border}`:"none", textAlign:"center" }}>
                <div style={{ fontWeight:900, fontSize:24, color:C.blue }}>{s.n}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:"80px 24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ fontSize:12, color:C.blue, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>How It Works</div>
          <div style={{ fontWeight:800, fontSize:36, color:C.text }}>Three Steps to More Interviews</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24 }}>
          {[
            { step:"01", icon:"📋", title:"Paste JD + Upload Resume", desc:"Drop the job description and paste or upload your resume (PDF, DOCX, or TXT). Takes 30 seconds." },
            { step:"02", icon:"🧠", title:"AI Analyzes Everything", desc:"Groq-powered AI scans keywords, scores your match, finds gaps, and judges every project for relevance." },
            { step:"03", icon:"✨", title:"Download Optimized Resume", desc:"Get a rewritten ATS-friendly resume instantly. Download as PDF or DOCX and apply with confidence." },
          ].map((s,i)=>(
            <div key={i} className="hover-lift" style={{ background:"#ffffff", border:`1.5px solid ${C.border}`,
              borderRadius:20, padding:32, position:"relative", overflow:"hidden",
              boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ position:"absolute", top:16, right:20, fontWeight:900, fontSize:40,
                color:`${C.blue}10`, fontFamily:"'DM Mono',monospace" }}>{s.step}</div>
              <div style={{ fontSize:40, marginBottom:16 }}>{s.icon}</div>
              <div style={{ fontWeight:800, fontSize:18, color:C.text, marginBottom:10 }}>{s.title}</div>
              <div style={{ color:C.soft, fontSize:14, lineHeight:1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding:"80px 24px", background:"#f8fafc" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontSize:12, color:C.green, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>Features</div>
            <div style={{ fontWeight:800, fontSize:36, color:C.text }}>Built for Indian Freshers</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20 }}>
            {features.map((f,i)=>(
              <div key={i} className="hover-lift" style={{ background:"#ffffff", border:`1.5px solid ${C.border}`,
                borderRadius:18, padding:28, display:"flex", gap:18,
                boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:32, flexShrink:0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:8 }}>{f.title}</div>
                  <div style={{ color:C.soft, fontSize:13, lineHeight:1.7 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:"80px 24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ fontSize:12, color:C.purple, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>Success Stories</div>
          <div style={{ fontWeight:800, fontSize:36, color:C.text }}>They Got Hired. You're Next.</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
          {testimonials.map((t,i)=>(
            <div key={i} className="hover-lift" style={{ background:"#ffffff", border:`1.5px solid ${C.border}`,
              borderRadius:20, padding:28, boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ color:C.blue, fontSize:24, marginBottom:14 }}>❝</div>
              <div style={{ color:C.soft, fontSize:14, lineHeight:1.8, marginBottom:20 }}>{t.text}</div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:42, height:42, borderRadius:"50%",
                  background:`linear-gradient(135deg,${C.blue},${C.blueLight})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:800, fontSize:13, color:"#fff" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight:700, color:C.text, fontSize:14 }}>{t.name}</div>
                  <div style={{ color:C.muted, fontSize:12 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section style={{ padding:"60px 24px", background:"#eff6ff" }}>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontSize:12, color:C.blue, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>About</div>
          <div style={{ fontWeight:800, fontSize:30, color:C.text, marginBottom:16 }}>Built by a Fresher, for Freshers</div>
          <div style={{ color:C.soft, fontSize:15, lineHeight:1.9, marginBottom:20 }}>
            TakePlace was built by <strong style={{color:C.blue}}>Raghu Dadigela</strong>, a B.Tech CSE (AI & ML) student who
            felt the real pain of job hunting — endless applications, ATS rejections, and resumes that
            never got shortlisted. So he built the tool he wished existed: real job alerts, honest
            AI analysis, and one-click ATS optimization. No fluff, just results.
          </div>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Tag color={C.blue}>🎓 CSE AI & ML Graduate 2026</Tag>
            <Tag color={C.green}>⚡ Built with Groq AI + Supabase</Tag>
            <Tag color={C.purple}>🇮🇳 Made for India</Tag>
          </div>
        </div>
      </section>

      {/* ── SUPPORT ── */}
      <section style={{ padding:"60px 24px", maxWidth:700, margin:"0 auto", textAlign:"center" }}>
        <div style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:20, padding:"40px 32px",
          boxShadow:"0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>💬</div>
          <div style={{ fontWeight:800, fontSize:22, color:C.text, marginBottom:10 }}>Need Help?</div>
          <div style={{ color:C.soft, fontSize:14, marginBottom:20, lineHeight:1.7 }}>
            Facing an issue? Got feedback? Reach out — Raghu reads every message personally.
          </div>
          <a href="mailto:support@takeplace.in" style={{ display:"inline-flex", alignItems:"center", gap:8,
            background:`linear-gradient(135deg,${C.blue},${C.blueLight})`, color:"#fff", fontWeight:700,
            padding:"12px 28px", borderRadius:10, fontSize:14, textDecoration:"none",
            boxShadow:"0 2px 12px "+C.blue+"40" }}>
            📧 support@takeplace.in
          </a>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:"60px 24px", textAlign:"center", background:"#eff6ff" }}>
        <div style={{ maxWidth:580, margin:"0 auto", background:"#ffffff",
          border:`1.5px solid ${C.border}`, borderRadius:28, padding:"56px 40px",
          boxShadow:"0 8px 32px rgba(37,99,235,0.12)" }}>
          <div className="float" style={{ fontSize:52, marginBottom:16 }}>⚡</div>
          <div style={{ fontWeight:900, fontSize:30, color:C.text, marginBottom:12 }}>
            It's Your Time.<br/><span style={{ color:C.blue }}>TakePlace.</span>
          </div>
          <div style={{ color:C.soft, fontSize:15, marginBottom:32, lineHeight:1.7 }}>
            Join 12,000+ freshers who optimized their resumes and landed interviews faster.
          </div>
          <Btn variant="cta" onClick={onGetStarted} style={{ padding:"16px 48px", fontSize:16, borderRadius:12 }}>
            Start Free Now →
          </Btn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"24px", textAlign:"center", background:"#ffffff" }}>
        <div style={{ color:C.muted, fontSize:12 }}>
          © 2026 TakePlace · Developed by Raghu Dadigela ·{" "}
          <a href="mailto:support@takeplace.in" style={{ color:C.blue, textDecoration:"none", fontWeight:600 }}>support@takeplace.in</a>
        </div>
      </footer>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// AUTH PAGE — WHITE THEME, NO LOGO 3D ANIM
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
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#eff6ff 0%,#ffffff 60%,#f0fdf4 100%)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{css}</style>

      <div className="fade" style={{ width:"100%", maxWidth:420, background:"#ffffff",
        border:`1.5px solid ${C.border}`, borderRadius:24, padding:"36px 36px",
        boxShadow:"0 16px 48px rgba(37,99,235,0.12)", position:"relative", zIndex:1 }}>

        <button onClick={onBack} style={{ background:"none", border:"none", color:C.muted,
          fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", marginBottom:24,
          display:"flex", alignItems:"center", gap:4 }}>
          ← Back to home
        </button>

        {/* Logo — plain, no 3D animation */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:44, marginBottom:6 }}>⚡</div>
          <div style={{ fontWeight:900, fontSize:26, color:C.blue }}>TakePlace</div>
          <div style={{ color:C.muted, fontSize:13, marginTop:4 }}>
            {mode==="login"?"Welcome back 👋":mode==="register"?"Create your account ✨":"Reset your password 🔑"}
          </div>
        </div>

        {mode!=="forgot" && (
          <>
            <button onClick={handleGoogle} disabled={googleLoading}
              style={{ width:"100%", padding:"12px", borderRadius:10, border:`1.5px solid ${C.border}`,
                background:"#ffffff", color:C.text, fontSize:14, cursor:"pointer",
                fontFamily:"'Inter',sans-serif", fontWeight:600, display:"flex",
                alignItems:"center", justifyContent:"center", gap:10, marginBottom:18,
                transition:"all .2s", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
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

            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
              <div style={{ flex:1, height:1, background:C.border }}/>
              <span style={{ color:C.muted, fontSize:12 }}>or</span>
              <div style={{ flex:1, height:1, background:C.border }}/>
            </div>

            {/* Sign In / Register toggle */}
            <div style={{ display:"flex", background:C.card, borderRadius:10, padding:4, marginBottom:22 }}>
              {["login","register"].map(m=>(
                <button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}}
                  style={{ flex:1, padding:"9px", borderRadius:8, border:"none", cursor:"pointer",
                    fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:13, transition:"all .2s",
                    background:mode===m?"#ffffff":"transparent",
                    color:mode===m?C.blue:C.muted,
                    boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>
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

        {err && <div style={{ color:C.danger, fontSize:12, marginTop:12, background:"#fef2f2",
          padding:"8px 12px", borderRadius:8, border:"1px solid #fecaca" }}>⚠ {err}</div>}
        {msg && <div style={{ color:C.green, fontSize:12, marginTop:12, background:"#f0fdf4",
          padding:"8px 12px", borderRadius:8, border:"1px solid #bbf7d0" }}>{msg}</div>}

        {mode==="forgot" ? (
          <>
            <Btn variant="cta" onClick={handleForgot} loading={loading} style={{ width:"100%", marginTop:20, padding:"13px" }}>
              Send Reset Email →
            </Btn>
            <button onClick={()=>{setMode("login");setErr("");setMsg("");}}
              style={{ width:"100%", marginTop:12, padding:"10px", background:"none", border:"none",
                color:C.muted, fontSize:13, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
              ← Back to Sign In
            </button>
          </>
        ) : (
          <>
            <Btn variant="cta" onClick={handle} loading={loading} style={{ width:"100%", marginTop:20, padding:"13px", fontSize:15 }}>
              {mode==="login"?"Sign In →":"Create Account →"}
            </Btn>
            {mode==="login" && (
              <button onClick={()=>{setMode("forgot");setErr("");setMsg("");}}
                style={{ width:"100%", marginTop:12, padding:"8px", background:"none", border:"none",
                  color:C.muted, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif",
                  textDecoration:"underline" }}>
                Forgot password?
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// RESUME ANALYZER — localStorage persistence + recruiter shortlist rate
// ══════════════════════════════════════════════════════════════════════════
function ResumeAnalyzer() {
  const [jd, setJd] = useState(() => localStorage.getItem("tp_jd") || "");
  const [resume, setResume] = useState(() => localStorage.getItem("tp_resume") || "");
  const [fileName, setFileName] = useState(() => localStorage.getItem("tp_fileName") || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [section, setSection] = useState("analysis");
  const [downloading, setDownloading] = useState("");
  const fileRef = useRef();

  const handleFile = async (e) => {
    const f = e.target.files[0]; if(!f) return;
    setFileName(f.name);
    localStorage.setItem("tp_fileName", f.name);
    setErr("");
    try {
      let text = "";
      if (f.type==="application/pdf"||f.name.endsWith(".pdf")) text = await extractTextFromPDF(f);
      else if (f.name.endsWith(".docx")) text = await extractTextFromDOCX(f);
      else {
        const r=new FileReader();
        r.onload=ev=>{ setResume(ev.target.result); localStorage.setItem("tp_resume", ev.target.result); };
        r.readAsText(f); return;
      }
      setResume(text);
      localStorage.setItem("tp_resume", text);
    } catch(e2) { setErr("Could not read file: "+e2.message); }
  };

  // Compute recruiter shortlist rate from matchScore + atsScore
  const recruiterRate = (match, ats) => {
    const base = match * 0.6 + ats * 0.4;
    // Realistic: top 10% of resumes get shortlisted; map 0-100 base to 0-35% shortlist rate
    return Math.min(35, Math.round(base * 0.35));
  };

  const analyze = async () => {
    if (!jd.trim()||!resume.trim()) { setErr("Fill in both Job Description and Resume."); return; }
    setLoading(true); setErr(""); setResult(null);

    const jdT = jd.trim().slice(0,700);
    const reT = resume.trim().slice(0,800);

    try {
      const p1 = `You are a senior ATS analyst and recruiter. Analyze this resume against the job description. Return ONLY valid JSON.

JD: ${jdT}

RESUME: ${reT}

Return exactly this JSON (fill real values):
{"matchScore":75,"atsScore":80,"verdict":"Strong Match","summary":"Two sentence summary.","recruiterImpression":"What a recruiter thinks in 5 seconds seeing this resume.","strongMatches":[{"skill":"React.js","reason":"Listed in both JD and resume","strength":90}],"missingKeywords":[{"keyword":"Docker","importance":"High","tip":"Add to Skills section"}],"weakAreas":[{"area":"Metrics","detail":"No quantified achievements — add numbers"}],"projectFit":[{"name":"Project Name","relevance":88,"reason":"Why it fits or doesn't fit this role","keep":true,"suggestion":"How to improve the description"}],"suggestedSkillsToAdd":["Kubernetes","CI/CD"],"improvements":["Add metrics to experience bullets","Include Docker in skills"]}`;

      const raw1 = await callAI(p1, 1500, "json");
      const analysis = safeJSON(raw1, null);
      if (!analysis?.matchScore) throw new Error("Analysis failed — try again or shorten your inputs.");

      setResult({...analysis, optimizedResume:"⏳ Generating optimized resume..."});
      setSection("analysis");

      const p2 = `Rewrite this resume optimized for the job below. Follow Jake's Resume format strictly.

Rules:
- Section headers ALL CAPS: EDUCATION, EXPERIENCE, PROJECTS, SKILLS, CERTIFICATIONS
- Bullet points start with strong action verbs (Developed, Built, Engineered, Designed, Implemented)
- Mirror keywords from the JD naturally
- Add or estimate metrics where logical (e.g., "Reduced load time by 40%")
- Remove projects with low relevance to this JD
- Keep it to ONE PAGE worth of content maximum
- Remove unwanted or irrelevant skills
- NO JSON, NO markdown, plain text only

JD: ${jdT.slice(0,400)}

RESUME: ${reT}`;

      const raw2 = await callAI(p2, 1800, "text");
      setResult(prev=>({...prev, optimizedResume:raw2.trim()||"Could not generate — please try again."}));
    } catch(e) { setErr(e.message||"Something went wrong. Please try again."); }
    setLoading(false);
  };

  const scoreColor = s => s>=75?C.green:s>=50?C.warn:C.danger;
  const impColor = imp => imp==="High"?C.danger:imp==="Medium"?C.warn:C.green;

  const handleDownload = async (type) => {
    const text = result?.optimizedResume || "";
    if (!text||text.startsWith("⏳")) return;
    setDownloading(type);
    try {
      if (type==="pdf") await downloadPDF(text,"TakePlace_Optimized_Resume.pdf");
      else if (type==="docx") await downloadDOCX(text,"TakePlace_Optimized_Resume.docx");
      else downloadTXT(text,"TakePlace_Optimized_Resume.txt");
    } catch(e) { downloadTXT(text,"TakePlace_Optimized_Resume.txt"); }
    setDownloading("");
  };

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontWeight:800, fontSize:22, color:C.text, marginBottom:4 }}>⚡ AI Resume Analyzer</div>
        <div style={{ color:C.muted, fontSize:13 }}>Paste JD + upload/paste resume → AI finds every gap, scores match, gives recruiter rate, rewrites your resume.</div>
      </div>

      {!result && (
        <div className="fade">
          {err && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12,
            padding:"12px 16px", marginBottom:16, color:C.danger, fontSize:13 }}>⚠ {err}</div>}

          {/* JD Box */}
          <Card style={{ marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:32, height:32, borderRadius:10, background:`${C.blue}15`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📋</div>
              <div>
                <div style={{ fontWeight:700, color:C.text, fontSize:15 }}>Job Description</div>
                <div style={{ color:C.muted, fontSize:11 }}>Paste the full JD — more detail = better analysis</div>
              </div>
              {jd && <Tag color={jd.split(/\s+/).filter(Boolean).length>200?C.green:C.warn}>{jd.split(/\s+/).filter(Boolean).length} words</Tag>}
            </div>
            <textarea value={jd}
              onChange={e=>{ setJd(e.target.value); localStorage.setItem("tp_jd", e.target.value); }}
              placeholder={"Paste the job description here...\n\nWe are looking for a Full Stack Developer with experience in React, Node.js..."}
              style={{...inp, minHeight:180, resize:"vertical", lineHeight:1.8}}/>
          </Card>

          {/* Resume Box */}
          <Card style={{ marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:10, background:`${C.purple}15`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📄</div>
                <div>
                  <div style={{ fontWeight:700, color:C.text, fontSize:15 }}>Your Resume</div>
                  <div style={{ color:C.muted, fontSize:11 }}>Paste text OR upload PDF / DOCX / TXT</div>
                </div>
              </div>
              <button onClick={()=>fileRef.current.click()}
                style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${C.blue}40`,
                  background:`${C.blue}08`, color:C.blue, fontSize:12, cursor:"pointer",
                  fontFamily:"'Inter',sans-serif", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                📁 Upload PDF/DOCX/TXT
              </button>
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.doc"
              onChange={handleFile} style={{ display:"none" }}/>
            {fileName && (
              <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8,
                padding:"6px 12px", marginBottom:10, fontSize:12, color:C.green, display:"flex", alignItems:"center", gap:6 }}>
                ✅ {fileName} loaded
              </div>
            )}
            <textarea value={resume}
              onChange={e=>{ setResume(e.target.value); localStorage.setItem("tp_resume", e.target.value); }}
              placeholder={"Paste resume text here OR upload a file above...\n\nInclude: Education, Experience, Projects, Skills, Certifications"}
              style={{...inp, minHeight:220, resize:"vertical", lineHeight:1.8}}/>
            {resume && (
              <div style={{ marginTop:8, fontSize:11, color:resume.length>400?C.green:C.warn }}>
                {resume.length>400?"✓ Resume looks complete":"⚠ Add more content for better analysis"}
              </div>
            )}
          </Card>

          <Btn variant="cta" onClick={analyze} disabled={!jd.trim()||!resume.trim()||loading}
            style={{ width:"100%", padding:"15px", fontSize:16, borderRadius:12 }}>
            {loading?<><SpinIcon size={16} color="#fff"/> Analyzing...</>:"🔍 Analyze & Optimize Resume"}
          </Btn>
        </div>
      )}

      {loading && !result && (
        <div style={{ textAlign:"center", padding:"80px 20px" }}>
          <div style={{ fontSize:72, marginBottom:20, animation:"float 2s ease-in-out infinite" }}>🧠</div>
          <div style={{ fontWeight:800, fontSize:22, color:C.text, marginBottom:8 }}>Analyzing Your Resume</div>
          <div style={{ color:C.muted, fontSize:13, marginBottom:28, lineHeight:1.8 }}>
            AI is reading the JD, scanning keywords,<br/>scoring your match, and computing recruiter shortlist rate...
          </div>
          <SpinIcon size={40} color={C.blue}/>
        </div>
      )}

      {result && (
        <div className="fade">
          {/* Score Hero */}
          <Card style={{ marginBottom:16, background:"linear-gradient(135deg,#eff6ff,#f0fdf4)", border:`1.5px solid ${C.blue}20` }}>
            {/* Score Rings */}
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:32, marginBottom:20, flexWrap:"wrap" }}>
              <div style={{ textAlign:"center" }}>
                <ScoreRing score={result.matchScore}/>
                <div style={{ color:C.muted, fontSize:12, marginTop:6, fontWeight:600 }}>JD Match Score</div>
              </div>
              <div style={{ width:1, height:80, background:C.border }}/>
              <div style={{ textAlign:"center" }}>
                <ScoreRing score={result.atsScore} color={C.blue}/>
                <div style={{ color:C.muted, fontSize:12, marginTop:6, fontWeight:600 }}>ATS Score</div>
              </div>
              <div style={{ width:1, height:80, background:C.border }}/>
              {/* Recruiter Shortlist Rate */}
              <div style={{ textAlign:"center" }}>
                <div style={{ width:90, height:90, borderRadius:"50%",
                  background:`linear-gradient(135deg,${C.purple}15,${C.purpleDark}10)`,
                  border:`3px solid ${C.purple}`, display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center" }}>
                  <div style={{ fontWeight:900, fontSize:20, color:C.purple }}>
                    {recruiterRate(result.matchScore, result.atsScore)}%
                  </div>
                </div>
                <div style={{ color:C.muted, fontSize:12, marginTop:6, fontWeight:600 }}>Shortlist Rate</div>
              </div>
            </div>

            <div style={{ textAlign:"center" }}>
              <div style={{ display:"inline-block", padding:"7px 22px", borderRadius:20,
                background:result.matchScore>=75?"#f0fdf4":result.matchScore>=50?"#fffbeb":"#fef2f2",
                color:scoreColor(result.matchScore), fontWeight:800, fontSize:14, marginBottom:10,
                border:`1px solid ${scoreColor(result.matchScore)}30` }}>
                {result.verdict}
              </div>
              <div style={{ color:C.soft, fontSize:14, lineHeight:1.8, maxWidth:520, margin:"0 auto 10px" }}>{result.summary}</div>
              {result.recruiterImpression && (
                <div style={{ background:"#fff", border:`1px solid ${C.blue}20`, borderRadius:12,
                  padding:"10px 18px", fontSize:13, color:C.soft, fontStyle:"italic", maxWidth:500, margin:"0 auto" }}>
                  💼 <strong style={{color:C.blue,fontStyle:"normal"}}>Recruiter's 5-sec take:</strong> {result.recruiterImpression}
                </div>
              )}
            </div>
          </Card>

          {/* Tab nav */}
          <div style={{ display:"flex", gap:8, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
            {[["analysis","📊 Analysis"],["missing","⚠️ Gaps"],["projects","🏗️ Projects"],["resume","✨ Optimized"]].map(([k,l])=>(
              <button key={k} onClick={()=>setSection(k)}
                style={{ padding:"9px 18px", borderRadius:20, whiteSpace:"nowrap",
                  border:`1.5px solid ${section===k?C.blue:C.border}`,
                  background:section===k?`${C.blue}10`:"#ffffff",
                  color:section===k?C.blue:C.soft, cursor:"pointer",
                  fontFamily:"'Inter',sans-serif", fontWeight:section===k?700:400,
                  fontSize:13, transition:"all .2s" }}>
                {l}
              </button>
            ))}
          </div>

          {/* Analysis Tab */}
          {section==="analysis" && (
            <div className="fade">
              <Card style={{ marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <span style={{ fontSize:18 }}>✅</span>
                  <div style={{ fontWeight:700, color:C.text, fontSize:16 }}>Strong Matches</div>
                  <Tag color={C.green}>{result.strongMatches?.length||0} found</Tag>
                </div>
                {result.strongMatches?.length>0 ? result.strongMatches.map((m,i)=>(
                  <div key={i} style={{ marginBottom:12, background:"#f0fdf4", borderRadius:12, padding:14, border:"1px solid #bbf7d0" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                      <div style={{ fontWeight:700, color:C.text }}>{m.skill}</div>
                      <div style={{ fontWeight:800, fontSize:15, color:scoreColor(m.strength) }}>{m.strength}%</div>
                    </div>
                    <div style={{ color:C.muted, fontSize:12, marginBottom:8 }}>{m.reason}</div>
                    <ScoreBar score={m.strength} color={C.green}/>
                  </div>
                )) : <div style={{ color:C.muted, fontSize:13 }}>No strong matches detected.</div>}
              </Card>

              {result.suggestedSkillsToAdd?.length>0 && (
                <Card style={{ marginBottom:14 }}>
                  <div style={{ fontWeight:700, color:C.text, fontSize:16, marginBottom:14 }}>🎯 Skills to Add to Resume</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {result.suggestedSkillsToAdd.map((s,i)=>(
                      <Tag key={i} color={C.purple}>+ {s}</Tag>
                    ))}
                  </div>
                </Card>
              )}

              {result.improvements?.length>0 && (
                <Card style={{ marginBottom:14 }}>
                  <div style={{ fontWeight:700, color:C.text, fontSize:16, marginBottom:14 }}>📝 What to Improve</div>
                  {result.improvements.map((imp,i)=>(
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10,
                      background:"#f8fafc", borderRadius:10, padding:"10px 14px", border:`1px solid ${C.border}` }}>
                      <span style={{ color:C.blue, flexShrink:0 }}>→</span>
                      <span style={{ color:C.soft, fontSize:13 }}>{imp}</span>
                    </div>
                  ))}
                </Card>
              )}

              {result.weakAreas?.length>0 && (
                <Card>
                  <div style={{ fontWeight:700, color:C.text, fontSize:16, marginBottom:14 }}>⚡ Weak Areas</div>
                  {result.weakAreas.map((w,i)=>(
                    <div key={i} style={{ background:"#fffbeb", borderRadius:12, padding:14, marginBottom:10, border:"1px solid #fef08a" }}>
                      <div style={{ fontWeight:700, color:C.warn, fontSize:14, marginBottom:4 }}>{w.area}</div>
                      <div style={{ color:C.soft, fontSize:13, lineHeight:1.7 }}>{w.detail}</div>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          )}

          {/* Gaps Tab */}
          {section==="missing" && (
            <div className="fade">
              <Card>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <span style={{ fontSize:18 }}>⚠️</span>
                  <div style={{ fontWeight:700, color:C.text, fontSize:16 }}>Missing Keywords</div>
                  <Tag color={C.danger}>{result.missingKeywords?.length||0} gaps</Tag>
                </div>
                {result.missingKeywords?.length>0 ? result.missingKeywords.map((m,i)=>(
                  <div key={i} style={{ background:"#fef2f2", borderRadius:12, padding:14, marginBottom:12,
                    border:`1px solid ${impColor(m.importance)}30` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ fontWeight:700, color:C.text }}>🔍 {m.keyword}</div>
                      <Tag color={impColor(m.importance)}>{m.importance}</Tag>
                    </div>
                    <div style={{ color:C.soft, fontSize:13, lineHeight:1.7 }}>💡 {m.tip}</div>
                  </div>
                )) : (
                  <div style={{ textAlign:"center", padding:"28px 0", color:C.green, fontSize:15 }}>
                    🎉 No critical missing keywords! Great match.
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Projects Tab */}
          {section==="projects" && (
            <div className="fade">
              <Card>
                <div style={{ fontWeight:700, color:C.text, fontSize:16, marginBottom:4 }}>🏗️ Project Relevance</div>
                <div style={{ color:C.muted, fontSize:12, marginBottom:16 }}>Which projects to keep, remove, or reframe for this role</div>
                {result.projectFit?.length>0 ? result.projectFit.map((p,i)=>(
                  <div key={i} style={{ background:p.keep?"#f0fdf4":"#f8fafc", borderRadius:14, padding:16, marginBottom:12,
                    border:`1.5px solid ${p.keep?"#bbf7d0":C.border}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ fontWeight:700, color:C.text, fontSize:15 }}>{p.name}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <Tag color={scoreColor(p.relevance)}>{p.relevance}% match</Tag>
                        <Tag color={p.keep?C.green:C.muted}>{p.keep?"✓ Keep":"Low priority"}</Tag>
                      </div>
                    </div>
                    <div style={{ color:C.soft, fontSize:13, marginBottom:10 }}>{p.reason}</div>
                    <ScoreBar score={p.relevance} color={scoreColor(p.relevance)}/>
                    {p.suggestion && (
                      <div style={{ marginTop:12, background:`${C.purple}08`, border:`1px solid ${C.purple}20`,
                        borderRadius:10, padding:"10px 14px", color:C.soft, fontSize:13 }}>
                        💡 <strong style={{ color:C.purple }}>Suggestion:</strong> {p.suggestion}
                      </div>
                    )}
                  </div>
                )) : <div style={{ color:C.muted, fontSize:13 }}>No projects detected in your resume.</div>}
              </Card>
            </div>
          )}

          {/* Optimized Resume Tab */}
          {section==="resume" && (
            <div className="fade">
              <Card>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, flexWrap:"wrap", gap:12 }}>
                  <div>
                    <div style={{ fontWeight:700, color:C.text, fontSize:16 }}>✨ ATS-Optimized Resume</div>
                    <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>Single page · Jake format · Action verbs · Keyword-matched · Unwanted skills removed</div>
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <Btn variant="ghost" onClick={()=>navigator.clipboard.writeText(result.optimizedResume||"")}
                      style={{ padding:"8px 14px", fontSize:12 }}>📋 Copy</Btn>
                    <Btn variant="purple" onClick={()=>handleDownload("pdf")}
                      loading={downloading==="pdf"} style={{ padding:"8px 14px", fontSize:12 }}>
                      ⬇ Download PDF
                    </Btn>
                    <Btn variant="green" onClick={()=>handleDownload("docx")}
                      loading={downloading==="docx"} style={{ padding:"8px 14px", fontSize:12 }}>
                      ⬇ Download DOCX
                    </Btn>
                  </div>
                </div>

                <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, background:"#eff6ff",
                    border:`1px solid ${C.blue}20`, borderRadius:10, padding:"8px 14px" }}>
                    <ScoreRing score={result.matchScore} size={50}/>
                    <div>
                      <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>Role Match</div>
                      <div style={{ color:C.muted, fontSize:11 }}>After optimization</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f0fdf4",
                    border:`1px solid ${C.green}20`, borderRadius:10, padding:"8px 14px" }}>
                    <ScoreRing score={result.atsScore} size={50} color={C.green}/>
                    <div>
                      <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>ATS Score</div>
                      <div style={{ color:C.muted, fontSize:11 }}>System readability</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, background:`${C.purple}08`,
                    border:`1px solid ${C.purple}20`, borderRadius:10, padding:"8px 14px" }}>
                    <div style={{ width:50, height:50, borderRadius:"50%", border:`3px solid ${C.purple}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontWeight:900, fontSize:14, color:C.purple }}>
                      {recruiterRate(result.matchScore, result.atsScore)}%
                    </div>
                    <div>
                      <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>Shortlist Rate</div>
                      <div style={{ color:C.muted, fontSize:11 }}>vs all applicants</div>
                    </div>
                  </div>
                </div>

                <div style={{ background:"#f8fafc", border:`1.5px solid ${C.border}`, borderRadius:12, padding:22 }}>
                  <pre style={{ whiteSpace:"pre-wrap", fontSize:12.5, color:C.text, lineHeight:2,
                    fontFamily:"'DM Mono',monospace", maxHeight:560, overflowY:"auto" }}>
                    {result.optimizedResume}
                  </pre>
                </div>

                <div style={{ marginTop:14, background:"#f0fdf4", border:"1px solid #bbf7d0",
                  borderRadius:12, padding:"12px 16px", fontSize:13, color:C.soft, lineHeight:1.7 }}>
                  💡 <strong style={{ color:C.green }}>Pro tip:</strong> Download PDF for job portals. Download DOCX to edit further in Google Docs. Resume is trimmed to single page — unwanted skills removed.
                </div>
              </Card>
            </div>
          )}

          <div style={{ marginTop:18 }}>
            <Btn variant="ghost" onClick={()=>{
              setResult(null); setErr(""); setJd(""); setResume(""); setFileName("");
              localStorage.removeItem("tp_jd"); localStorage.removeItem("tp_resume"); localStorage.removeItem("tp_fileName");
            }} style={{ width:"100%", fontSize:13 }}>
              🔄 Analyze Another Job
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN APP — Tab state persisted, no splash on tab switch
// ══════════════════════════════════════════════════════════════════════════
function MainApp({ user, onLogout }) {
  // FIX 3: persist tab in sessionStorage so tab switches don't reset state
  const [tab, setTab] = useState(() => parseInt(sessionStorage.getItem("tp_tab")||"0"));
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");
  const [search, setSearch] = useState(() => sessionStorage.getItem("tp_search")||"software engineer fresher");
  const [location, setLocation] = useState(() => sessionStorage.getItem("tp_loc")||"hyderabad");
  const [expandedJob, setExpandedJob] = useState(null);
  const name = user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";

  useEffect(()=>{ fetchJobs(); },[]);

  const setTabPersist = (t) => { setTab(t); sessionStorage.setItem("tp_tab", t); };

  const fetchJobs = async (q=search, loc=location) => {
    setJobsLoading(true); setJobsError("");
    sessionStorage.setItem("tp_search", q);
    sessionStorage.setItem("tp_loc", loc);
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

  const TABS=[["🔥","Jobs"],["⚡","Resume"]];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Inter',sans-serif" }}>
      <style>{css}</style>

      {/* Header */}
      <div style={{ background:"#ffffff", borderBottom:`1.5px solid ${C.border}`, padding:"0 20px",
        position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth:820, margin:"0 auto", display:"flex", alignItems:"center",
          justifyContent:"space-between", height:60 }}>
          <div style={{ fontWeight:900, fontSize:20, color:C.blue, display:"flex", alignItems:"center", gap:6 }}>
            ⚡ TakePlace
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:"50%",
                background:`linear-gradient(135deg,${C.blue},${C.blueLight})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, fontSize:12, color:"#fff" }}>
                {name[0].toUpperCase()}
              </div>
              <span style={{ fontSize:13, color:C.soft, fontWeight:600 }}>{name.split(" ")[0]}</span>
            </div>
            <Btn variant="ghost" onClick={onLogout} style={{ padding:"7px 14px", fontSize:12 }}>Logout</Btn>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background:"#ffffff", borderBottom:`1.5px solid ${C.border}`, position:"sticky", top:60, zIndex:99 }}>
        <div style={{ maxWidth:820, margin:"0 auto", display:"flex" }}>
          {TABS.map(([icon,label],i)=>(
            <button key={i} onClick={()=>setTabPersist(i)}
              style={{ flex:1, padding:"14px 6px", border:"none", background:"transparent",
                cursor:"pointer", color:tab===i?C.blue:C.muted,
                fontFamily:"'Inter',sans-serif", fontWeight:tab===i?800:500, fontSize:14,
                borderBottom:`2.5px solid ${tab===i?C.blue:"transparent"}`,
                transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:820, margin:"0 auto", padding:"24px 16px 80px" }}>
        {/* ── JOBS TAB ── */}
        {tab===0 && (
          <div>
            <Card style={{ marginBottom:20 }}>
              <div style={{ fontWeight:700, color:C.text, fontSize:15, marginBottom:14 }}>🔍 Find Jobs</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                <input style={inp} placeholder="Role (react developer...)" value={search}
                  onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
                <input style={inp} placeholder="City (hyderabad...)" value={location}
                  onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
              </div>
              <Btn variant="cta" onClick={()=>fetchJobs()} style={{ width:"100%" }}>🔍 Search Jobs</Btn>
            </Card>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div style={{ fontWeight:800, fontSize:18, color:C.text }}>Live Job Feed</div>
              {!jobsLoading&&jobs.length>0&&(
                <div style={{ display:"flex", alignItems:"center", gap:6, background:"#f0fdf4",
                  borderRadius:20, padding:"5px 14px", border:"1px solid #bbf7d0" }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, animation:"pulse 1.5s infinite" }}/>
                  <span style={{ color:C.green, fontSize:11, fontWeight:700 }}>{jobs.length} live jobs</span>
                </div>
              )}
            </div>

            {jobsLoading && (
              <div style={{ textAlign:"center", padding:"60px 20px" }}>
                <SpinIcon size={40} color={C.blue}/>
                <div style={{ color:C.muted, fontSize:14, marginTop:14 }}>Fetching real jobs...</div>
              </div>
            )}
            {jobsError && (
              <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:14,
                padding:22, color:C.danger, textAlign:"center", fontSize:14 }}>{jobsError}</div>
            )}

            {!jobsLoading&&jobs.map((job,i)=>{
              const isExp=expandedJob===job.id;
              return (
                <div key={job.id} className="fade hover-lift" style={{ background:"#ffffff",
                  border:`1.5px solid ${C.border}`, borderRadius:16, padding:"16px 18px",
                  marginBottom:10, borderLeft:`3px solid ${C.blue}`,
                  animationDelay:`${i*0.04}s`, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{job.title}</div>
                      <div style={{ color:C.soft, fontSize:12, marginTop:2 }}>{job.company} · {job.location}</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ color:C.green, fontWeight:800, fontSize:14 }}>{job.salary}</div>
                      <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{job.posted}</div>
                    </div>
                  </div>
                  <div style={{ color:C.muted, fontSize:12, lineHeight:1.7, marginBottom:12,
                    background:C.card, borderRadius:10, padding:"10px 12px" }}>
                    {isExp?job.description:job.descriptionShort+(job.description.length>220?"...":"")}
                    {job.description.length>220&&(
                      <button onClick={()=>setExpandedJob(isExp?null:job.id)}
                        style={{ background:"none", border:"none", color:C.blue, fontSize:11,
                          cursor:"pointer", marginLeft:6, fontFamily:"'Inter',sans-serif", fontWeight:600 }}>
                        {isExp?"Show less ▲":"Read more ▼"}
                      </button>
                    )}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <Tag color={C.blue}>{job.category}</Tag>
                    <div style={{ display:"flex", gap:8 }}>
                      <Btn variant="ghost" onClick={()=>setTabPersist(1)} style={{ fontSize:11, padding:"7px 12px" }}>⚡ Analyze</Btn>
                      <Btn variant="cta" onClick={()=>window.open(job.url,"_blank")} style={{ fontSize:12, padding:"8px 18px" }}>Apply →</Btn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab===1 && <ResumeAnalyzer/>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROOT — FIX 1: skip splash on login, FIX 3: no splash on tab switch
// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser]           = useState(null);
  const [appLoading, setAppLoading] = useState(true);
  const [page, setPage]           = useState("landing");

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if (session?.user) { setUser(session.user); setPage("app"); }
      setAppLoading(false);
    });
    // FIX 1 & 3: go directly to "app" without splash — no LogoSplash shown on login or tab switch
    supabase.auth.onAuthStateChange((_,session)=>{
      if (session?.user) { setUser(session.user); setPage("app"); }
      else { setUser(null); setPage("landing"); }
    });
  },[]);

  const handleLogin = (u) => { setUser(u); setPage("app"); }; // Direct to app, no splash
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setPage("landing"); };

  if (appLoading) return (
    <div style={{ minHeight:"100vh", background:"#ffffff", display:"flex", alignItems:"center",
      justifyContent:"center", flexDirection:"column", gap:16 }}>
      <style>{css}</style>
      <span className="spin" style={{ width:44, height:44, border:`3px solid ${C.blue}20`,
        borderTopColor:C.blue, borderRadius:"50%", display:"inline-block" }}/>
      <div style={{ color:C.muted, fontSize:14, fontFamily:"'Inter',sans-serif" }}>Loading TakePlace...</div>
    </div>
  );

  if (page==="landing") return <LandingPage onGetStarted={()=>setPage("auth")}/>;
  if (page==="auth")    return <AuthPage onLogin={handleLogin} onBack={()=>setPage("landing")}/>;
  return <MainApp user={user} onLogout={handleLogout}/>;
}
