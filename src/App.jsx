import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID  = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const supabase   = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  bg:"#07080f", card:"#0d1117", card2:"#0a0d15", border:"#1a2030",
  orange:"#FF5C1A", orangeLight:"#FF8A5B",
  green:"#1DDB8B", greenDark:"#065f46",
  text:"#e2e8f0", muted:"#4b5563", soft:"#94a3b8",
  danger:"#f87171", warn:"#fbbf24", purple:"#a78bfa", purpleDark:"#7c3aed",
  blue:"#60a5fa",
};

// ─── GLOBAL CSS ────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{background:${C.bg};font-family:'Outfit',sans-serif;}
  ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px;}
  ::selection{background:${C.orange}40;color:#fff;}

  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes glow{0%,100%{box-shadow:0 0 20px ${C.orange}40}50%{box-shadow:0 0 60px ${C.orange}80,0 0 120px ${C.orange}40}}
  @keyframes rotate3d{0%{transform:perspective(600px) rotateY(-25deg) rotateX(10deg) scale(.85);opacity:0}
    60%{transform:perspective(600px) rotateY(8deg) rotateX(-3deg) scale(1.05)}
    100%{transform:perspective(600px) rotateY(0deg) rotateX(0deg) scale(1);opacity:1}}
  @keyframes particle{0%{transform:translateY(0) translateX(0);opacity:1}100%{transform:translateY(-120px) translateX(var(--dx,20px));opacity:0}}
  @keyframes borderAnim{0%,100%{border-color:${C.orange}60}50%{border-color:${C.green}60}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
  @keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes logoReveal{
    0%{transform:perspective(800px) rotateY(90deg) scale(0.5);opacity:0;filter:blur(20px)}
    50%{transform:perspective(800px) rotateY(-15deg) scale(1.1);opacity:.8;filter:blur(2px)}
    100%{transform:perspective(800px) rotateY(0deg) scale(1);opacity:1;filter:blur(0)}
  }
  @keyframes ringPulse{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.5);opacity:0}}

  .fade{animation:fadeUp .5s ease forwards;}
  .fadeIn{animation:fadeIn .4s ease forwards;}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  .float{animation:float 3s ease-in-out infinite;}
  .glow{animation:glow 2s ease-in-out infinite;}
  .hover-lift{transition:all .2s;cursor:pointer;}
  .hover-lift:hover{transform:translateY(-3px);box-shadow:0 8px 32px #00000060;}
  input:focus,textarea:focus,select:focus{border-color:${C.orange}88!important;outline:none;box-shadow:0 0 0 3px ${C.orange}15;}
  button:active{transform:scale(.97);}
  .shimmer{background:linear-gradient(90deg,transparent 25%,${C.orange}20 50%,transparent 75%);background-size:200% 100%;animation:shimmer 2s infinite;}
`;

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────
const inp = {
  width:"100%", background:"#080c16", border:`1px solid ${C.border}`,
  borderRadius:12, padding:"12px 16px", color:C.text, fontSize:13,
  fontFamily:"'Outfit',sans-serif", outline:"none", transition:"all .2s",
};

const Btn = ({ children, onClick, variant="primary", style={}, disabled=false, loading=false }) => {
  const v = {
    primary:{ background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`, color:"#07080f", fontWeight:800 },
    ghost:{ background:"transparent", color:C.soft, border:`1px solid ${C.border}` },
    green:{ background:`linear-gradient(135deg,${C.greenDark},${C.green})`, color:"#07080f", fontWeight:800 },
    purple:{ background:`linear-gradient(135deg,${C.purpleDark},${C.purple})`, color:"#fff", fontWeight:800 },
    danger:{ background:`linear-gradient(135deg,#7f1d1d,${C.danger})`, color:"#fff", fontWeight:800 },
    glass:{ background:"rgba(255,255,255,.06)", color:C.text, border:`1px solid rgba(255,255,255,.12)`, backdropFilter:"blur(12px)" },
  };
  return (
    <button onClick={disabled||loading ? undefined : onClick} disabled={disabled||loading}
      style={{ padding:"11px 22px", borderRadius:12, border:"none", cursor:disabled||loading?"not-allowed":"pointer",
        fontFamily:"'Outfit',sans-serif", fontSize:14, transition:"all .2s",
        opacity:disabled?0.5:1, display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8,
        ...v[variant], ...style }}>
      {loading ? <><SpinIcon size={14}/> Loading...</> : children}
    </button>
  );
};

const SpinIcon = ({ size=18, color=C.orange }) => (
  <span className="spin" style={{ width:size, height:size, border:`2px solid ${color}30`,
    borderTopColor:color, borderRadius:"50%", display:"inline-block", flexShrink:0 }} />
);

const ScoreRing = ({ score, size=90, color }) => {
  const r = 36, circ = 2*Math.PI*r;
  const pct = Math.max(0,Math.min(100,score));
  const col = color || (pct>=75?C.green:pct>=50?C.warn:C.danger);
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#1a2030" strokeWidth="6"/>
      <circle cx="40" cy="40" r={r} fill="none" stroke={col} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
        strokeLinecap="round" transform="rotate(-90 40 40)"
        style={{transition:"stroke-dashoffset 1.2s ease"}}/>
      <text x="40" y="44" textAnchor="middle" fill={col} fontSize="16" fontWeight="800" fontFamily="Outfit">{pct}%</text>
    </svg>
  );
};

const ScoreBar = ({ score, color }) => (
  <div style={{ background:"#0a0e18", borderRadius:4, height:5, overflow:"hidden", marginTop:5 }}>
    <div style={{ height:"100%", width:`${score}%`, background:color, borderRadius:4, transition:"width 1.2s ease" }}/>
  </div>
);

const Tag = ({ children, color=C.blue, bg }) => (
  <span style={{ background:bg||`${color}20`, color, fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:700, whiteSpace:"nowrap" }}>
    {children}
  </span>
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

// ─── PDF TEXT EXTRACTION (client-side) ─────────────────────────────────────
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
    <div style={{ background:C.bg, color:C.text, fontFamily:"'Outfit',sans-serif", overflowX:"hidden" }}>
      <style>{css}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000,
        background:scrolled?"rgba(7,8,15,.92)":"transparent",
        backdropFilter:scrolled?"blur(20px)":"none",
        borderBottom:scrolled?`1px solid ${C.border}`:"none",
        transition:"all .3s", padding:"0 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ fontWeight:900, fontSize:22, background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            ⚡ TakePlace
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <Btn variant="glass" onClick={onGetStarted} style={{ padding:"8px 20px", fontSize:13 }}>Sign In</Btn>
            <Btn onClick={onGetStarted} style={{ padding:"8px 20px", fontSize:13 }}>Get Started Free →</Btn>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        padding:"120px 24px 80px", position:"relative", overflow:"hidden" }}>
        {[["15%","20%","#FF5C1A"],["75%","60%","#1DDB8B"],["50%","80%","#a78bfa"]].map(([l,t,c],i)=>(
          <div key={i} style={{ position:"absolute", left:l, top:t, width:500, height:500, borderRadius:"50%",
            background:`radial-gradient(circle,${c}15,transparent 70%)`, pointerEvents:"none", filter:"blur(40px)" }}/>
        ))}
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.border}40 1px,transparent 1px),linear-gradient(90deg,${C.border}40 1px,transparent 1px)`,
          backgroundSize:"60px 60px", opacity:.3, pointerEvents:"none" }}/>

        <div style={{ textAlign:"center", maxWidth:820, position:"relative", zIndex:1 }}>
          <div className="fade" style={{ display:"inline-flex", alignItems:"center", gap:8,
            background:`${C.orange}15`, border:`1px solid ${C.orange}40`, borderRadius:20,
            padding:"6px 16px", marginBottom:28, fontSize:12, color:C.orangeLight, fontWeight:700 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:C.orange, display:"inline-block", animation:"pulse 1.5s infinite" }}/>
            AI-Powered Job Platform for Indian Freshers
          </div>

          <div className="fade" style={{ fontWeight:900, fontSize:"clamp(38px,6vw,72px)", lineHeight:1.1,
            marginBottom:24, animationDelay:".1s" }}>
            Land Your Dream Job<br/>
            <span style={{ background:`linear-gradient(135deg,${C.orange},${C.orangeLight},${C.warn})`,
              backgroundSize:"200%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              animation:"gradShift 4s ease infinite" }}>
              Faster with AI
            </span>
          </div>

          <div className="fade" style={{ fontSize:17, color:C.soft, lineHeight:1.8, marginBottom:40,
            maxWidth:580, margin:"0 auto 40px", animationDelay:".2s" }}>
            Real live jobs · AI resume analyzer · ATS score · Keyword gap finder · One-click rewrite.<br/>
            <strong style={{ color:C.text }}>Everything you need. Zero guesswork.</strong>
          </div>

          <div className="fade" style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", animationDelay:".3s" }}>
            <Btn onClick={onGetStarted} style={{ padding:"15px 36px", fontSize:16, borderRadius:14 }}
              >🚀 Start Free — No Credit Card</Btn>
            <Btn variant="glass" onClick={()=>document.getElementById("features").scrollIntoView({behavior:"smooth"})}
              style={{ padding:"15px 28px", fontSize:16, borderRadius:14 }}>See How It Works ↓</Btn>
          </div>

          <div className="fade" style={{ display:"flex", gap:0, justifyContent:"center", marginTop:64,
            background:C.card, border:`1px solid ${C.border}`, borderRadius:20, overflow:"hidden",
            maxWidth:560, margin:"64px auto 0", animationDelay:".4s" }}>
            {stats.map((s,i)=>(
              <div key={i} style={{ flex:1, padding:"20px 10px", borderRight:i<stats.length-1?`1px solid ${C.border}`:"none", textAlign:"center" }}>
                <div style={{ fontWeight:900, fontSize:24, color:C.orange }}>{s.n}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:"80px 24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ fontSize:12, color:C.orange, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>How It Works</div>
          <div style={{ fontWeight:800, fontSize:36, color:C.text }}>Three Steps to More Interviews</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24 }}>
          {[
            { step:"01", icon:"📋", title:"Paste JD + Upload Resume", desc:"Drop the job description and paste or upload your resume (PDF, DOCX, or TXT). Takes 30 seconds." },
            { step:"02", icon:"🧠", title:"AI Analyzes Everything", desc:"Groq-powered AI scans keywords, scores your match, finds gaps, and judges every project for relevance." },
            { step:"03", icon:"✨", title:"Download Optimized Resume", desc:"Get a rewritten ATS-friendly resume instantly. Download as PDF or DOCX and apply with confidence." },
          ].map((s,i)=>(
            <div key={i} className="hover-lift" style={{ background:C.card, border:`1px solid ${C.border}`,
              borderRadius:20, padding:32, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:16, right:20, fontWeight:900, fontSize:40,
                color:`${C.orange}15`, fontFamily:"'DM Mono',monospace" }}>{s.step}</div>
              <div style={{ fontSize:40, marginBottom:16 }}>{s.icon}</div>
              <div style={{ fontWeight:800, fontSize:18, color:C.text, marginBottom:10 }}>{s.title}</div>
              <div style={{ color:C.soft, fontSize:14, lineHeight:1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding:"80px 24px", background:"#0a0d14" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontSize:12, color:C.green, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>Features</div>
            <div style={{ fontWeight:800, fontSize:36, color:C.text }}>Built for Indian Freshers</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20 }}>
            {features.map((f,i)=>(
              <div key={i} className="hover-lift" style={{ background:C.bg, border:`1px solid ${C.border}`,
                borderRadius:18, padding:28, display:"flex", gap:18 }}>
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
            <div key={i} className="hover-lift" style={{ background:C.card, border:`1px solid ${C.border}`,
              borderRadius:20, padding:28 }}>
              <div style={{ color:C.orange, fontSize:24, marginBottom:14 }}>❝</div>
              <div style={{ color:C.soft, fontSize:14, lineHeight:1.8, marginBottom:20 }}>{t.text}</div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:42, height:42, borderRadius:"50%",
                  background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:800, fontSize:13, color:"#07080f" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight:700, color:C.text, fontSize:14 }}>{t.name}</div>
                  <div style={{ color:C.muted, fontSize:12 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:"80px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:600, margin:"0 auto", background:C.card,
          border:`1px solid ${C.border}`, borderRadius:28, padding:"60px 40px",
          position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 50% 0%,${C.orange}10,transparent 60%)`, pointerEvents:"none" }}/>
          <div className="float" style={{ fontSize:56, marginBottom:16 }}>⚡</div>
          <div style={{ fontWeight:900, fontSize:32, color:C.text, marginBottom:12 }}>
            It's Your Time.<br/><span style={{ color:C.orange }}>TakePlace.</span>
          </div>
          <div style={{ color:C.soft, fontSize:15, marginBottom:32, lineHeight:1.7 }}>
            Join 12,000+ freshers who optimized their resumes and landed interviews faster.
          </div>
          <Btn onClick={onGetStarted} style={{ padding:"16px 48px", fontSize:17, borderRadius:16 }}>
            Start Free Now →
          </Btn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"24px", textAlign:"center" }}>
        <div style={{ color:C.muted, fontSize:12 }}>
          © 2026 TakePlace · Built for Indian Freshers ·{" "}
          <a href="mailto:support@takeplace.in" style={{ color:C.orange, textDecoration:"none" }}>support@takeplace.in</a>
        </div>
      </footer>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// AUTH PAGE
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
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center",
      justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
      <style>{css}</style>
      {[["8%","15%","#FF5C1A"],["75%","65%","#1DDB8B"],["40%","85%","#a78bfa"]].map(([l,t,c],i)=>(
        <div key={i} style={{ position:"absolute", left:l, top:t, width:400, height:400, borderRadius:"50%",
          background:`radial-gradient(circle,${c}12,transparent 70%)`, pointerEvents:"none", filter:"blur(30px)" }}/>
      ))}
      <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.border}30 1px,transparent 1px),linear-gradient(90deg,${C.border}30 1px,transparent 1px)`,
        backgroundSize:"50px 50px", opacity:.4, pointerEvents:"none" }}/>

      <div className="fade" style={{ width:"100%", maxWidth:440, background:C.card,
        border:`1px solid ${C.border}`, borderRadius:28, padding:40, position:"relative", zIndex:1,
        boxShadow:"0 32px 80px #00000060" }}>

        <button onClick={onBack} style={{ background:"none", border:"none", color:C.muted,
          fontSize:12, cursor:"pointer", fontFamily:"'Outfit',sans-serif", marginBottom:24, display:"flex", alignItems:"center", gap:4 }}>
          ← Back to home
        </button>

        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div className="float" style={{ fontSize:52, marginBottom:8 }}>⚡</div>
          <div style={{ fontWeight:900, fontSize:28, background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,
            backgroundSize:"200%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            animation:"gradShift 3s ease infinite" }}>TakePlace</div>
          <div style={{ color:C.muted, fontSize:12, marginTop:4 }}>
            {mode==="login"?"Welcome back 👋":mode==="register"?"Create your account ✨":"Reset your password 🔑"}
          </div>
        </div>

        {mode!=="forgot" && (
          <>
            <button onClick={handleGoogle} disabled={googleLoading}
              style={{ width:"100%", padding:"12px", borderRadius:12, border:`1px solid ${C.border}`,
                background:"#0a0d16", color:C.text, fontSize:14, cursor:"pointer",
                fontFamily:"'Outfit',sans-serif", fontWeight:600, display:"flex",
                alignItems:"center", justifyContent:"center", gap:10, marginBottom:20,
                transition:"all .2s" }}>
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
              <span style={{ color:C.muted, fontSize:12 }}>or</span>
              <div style={{ flex:1, height:1, background:C.border }}/>
            </div>

            <div style={{ display:"flex", background:"#080c16", borderRadius:12, padding:4, marginBottom:24 }}>
              {["login","register"].map(m=>(
                <button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}}
                  style={{ flex:1, padding:"10px", borderRadius:10, border:"none", cursor:"pointer",
                    fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:13, transition:"all .2s",
                    background:mode===m?C.border:"transparent", color:mode===m?C.text:C.muted }}>
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

        {err && <div style={{ color:C.danger, fontSize:12, marginTop:12, background:"#450a0a30",
          padding:"8px 12px", borderRadius:8, border:"1px solid #7f1d1d40" }}>⚠ {err}</div>}
        {msg && <div style={{ color:C.green, fontSize:12, marginTop:12, background:`${C.green}10`,
          padding:"8px 12px", borderRadius:8 }}>{msg}</div>}

        {mode==="forgot" ? (
          <>
            <Btn onClick={handleForgot} loading={loading} style={{ width:"100%", marginTop:20, padding:"13px" }}>
              Send Reset Email →
            </Btn>
            <button onClick={()=>{setMode("login");setErr("");setMsg("");}}
              style={{ width:"100%", marginTop:12, padding:"10px", background:"none", border:"none",
                color:C.muted, fontSize:13, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}>
              ← Back to Sign In
            </button>
          </>
        ) : (
          <>
            <Btn onClick={handle} loading={loading} style={{ width:"100%", marginTop:20, padding:"13px", fontSize:15 }}>
              {mode==="login"?"Sign In →":"Create Account →"}
            </Btn>
            {mode==="login" && (
              <button onClick={()=>{setMode("forgot");setErr("");setMsg("");}}
                style={{ width:"100%", marginTop:12, padding:"8px", background:"none", border:"none",
                  color:C.muted, fontSize:12, cursor:"pointer", fontFamily:"'Outfit',sans-serif",
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
// LOGO SPLASH (3D animation)
// ══════════════════════════════════════════════════════════════════════════
function LogoSplash({ onDone }) {
  const [phase, setPhase] = useState(0);
  useEffect(()=>{
    const t1=setTimeout(()=>setPhase(1),400);
    const t2=setTimeout(()=>setPhase(2),1400);
    const t3=setTimeout(()=>onDone(),2600);
    return ()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[]);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center",
      justifyContent:"center", flexDirection:"column", position:"relative", overflow:"hidden" }}>
      <style>{css}</style>
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 50% 50%,${C.orange}20,transparent 60%)`, pointerEvents:"none" }}/>

      {phase>=1 && [0,1,2].map(i=>(
        <div key={i} style={{ position:"absolute", width:120, height:120, borderRadius:"50%",
          border:`2px solid ${C.orange}`, opacity:0,
          animation:`ringPulse 1.5s ease-out ${i*0.4}s forwards` }}/>
      ))}

      <div style={{ animation:phase>=1?"logoReveal .9s cubic-bezier(.34,1.56,.64,1) forwards":"none",
        opacity:phase>=1?1:0, textAlign:"center" }}>
        <div style={{ fontSize:100, lineHeight:1, filter:`drop-shadow(0 0 40px ${C.orange}80)` }}>⚡</div>
        <div style={{ fontWeight:900, fontSize:52, marginTop:12,
          background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          TakePlace
        </div>
        {phase>=2 && (
          <div className="fadeIn" style={{ color:C.muted, fontSize:15, marginTop:8, letterSpacing:1 }}>
            It's your time. TakePlace.
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// RESUME ANALYZER  ← localStorage persistence added here
// ══════════════════════════════════════════════════════════════════════════
function ResumeAnalyzer() {
  // ── CHANGED: lazy-init from localStorage ──
  const [jd, setJd] = useState(() => localStorage.getItem("tp_jd") || "");
  const [resume, setResume] = useState(() => localStorage.getItem("tp_resume") || "");
  // ──────────────────────────────────────────
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [section, setSection] = useState("analysis");
  const [downloading, setDownloading] = useState("");
  const fileRef = useRef();

  const handleFile = async (e) => {
    const f = e.target.files[0]; if(!f) return;
    setFileName(f.name); setErr("");
    try {
      let text = "";
      if (f.type==="application/pdf"||f.name.endsWith(".pdf")) text = await extractTextFromPDF(f);
      else if (f.name.endsWith(".docx")) text = await extractTextFromDOCX(f);
      else { const r=new FileReader(); r.onload=ev=>{ setResume(ev.target.result); localStorage.setItem("tp_resume", ev.target.result); }; r.readAsText(f); return; }
      setResume(text);
      localStorage.setItem("tp_resume", text);
    } catch(e2) { setErr("Could not read file: "+e2.message); }
  };

  const analyze = async () => {
    if (!jd.trim()||!resume.trim()) { setErr("Fill in both Job Description and Resume."); return; }
    setLoading(true); setErr(""); setResult(null);

    const jdT = jd.trim().slice(0,700);
    const reT = resume.trim().slice(0,800);

    try {
      const p1 = `You are a senior ATS analyst. Analyze this resume against the job description. Return ONLY valid JSON, no markdown, no explanation.

JD: ${jdT}

RESUME: ${reT}

Return this exact JSON:
{"matchScore":75,"atsScore":80,"verdict":"Strong Match","summary":"Two sentence summary of fit.","strongMatches":[{"skill":"React.js","reason":"Listed in both JD and resume","strength":90}],"missingKeywords":[{"keyword":"Docker","importance":"High","tip":"Add to Skills section"}],"weakAreas":[{"area":"Metrics","detail":"No quantified achievements"}],"projectFit":[{"name":"TakePlace","relevance":88,"reason":"Full-stack, matches JD","keep":true,"suggestion":"Highlight the Gemini API integration"}],"suggestedSkillsToAdd":["Kubernetes","CI/CD"],"improvements":["Add metrics to experience bullets","Include Docker in skills","Quantify user numbers for TakePlace"]}`;

      const raw1 = await callAI(p1, 1400, "json");
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
- Keep it to one page worth of content
- NO JSON, NO markdown, plain text only

JD: ${jdT.slice(0,400)}

RESUME: ${reT}`;

      const raw2 = await callAI(p2, 1600, "text");
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
      <div style={{ marginBottom:28 }}>
        <div style={{ fontWeight:800, fontSize:24, color:C.text, marginBottom:4 }}>⚡ AI Resume Analyzer</div>
        <div style={{ color:C.muted, fontSize:13 }}>Paste JD + upload/paste your resume → AI finds every gap, scores your match, and rewrites your resume.</div>
      </div>

      {!result && (
        <div className="fade">
          {err && <div style={{ background:"#450a0a", border:"1px solid #7f1d1d", borderRadius:12,
            padding:"12px 16px", marginBottom:16, color:C.danger, fontSize:13 }}>⚠ {err}</div>}

          {/* JD Box */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:32, height:32, borderRadius:10, background:`${C.orange}20`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📋</div>
              <div>
                <div style={{ fontWeight:700, color:C.text, fontSize:15 }}>Job Description</div>
                <div style={{ color:C.muted, fontSize:11 }}>Paste the full JD — more detail = better analysis</div>
              </div>
              {jd && <Tag color={jd.length>200?C.green:C.warn}>{jd.split(/\s+/).filter(Boolean).length} words</Tag>}
            </div>
            <textarea value={jd}
              onChange={e=>{ setJd(e.target.value); localStorage.setItem("tp_jd", e.target.value); }}
              placeholder={"Paste the job description here...\n\nWe are looking for a Full Stack Developer with experience in React, Node.js..."}
              style={{...inp, minHeight:180, resize:"vertical", lineHeight:1.8}}/>
          </div>

          {/* Resume Box */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:22 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:10, background:`${C.purple}20`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📄</div>
                <div>
                  <div style={{ fontWeight:700, color:C.text, fontSize:15 }}>Your Resume</div>
                  <div style={{ color:C.muted, fontSize:11 }}>Paste text OR upload PDF / DOCX / TXT</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>fileRef.current.click()}
                  style={{ padding:"7px 14px", borderRadius:10, border:`1px solid ${C.border}`,
                    background:`${C.purple}15`, color:C.purple, fontSize:12, cursor:"pointer",
                    fontFamily:"'Outfit',sans-serif", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                  📁 Upload PDF/DOCX/TXT
                </button>
              </div>
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.doc"
              onChange={handleFile} style={{ display:"none" }}/>
            {fileName && (
              <div style={{ background:`${C.green}10`, border:`1px solid ${C.green}30`, borderRadius:8,
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
          </div>

          <Btn onClick={analyze} disabled={!jd.trim()||!resume.trim()||loading}
            style={{ width:"100%", padding:"15px", fontSize:16, borderRadius:14 }}>
            {loading?<><SpinIcon size={16}/> Analyzing...</>:"🔍 Analyze & Optimize Resume"}
          </Btn>
        </div>
      )}

      {loading && !result && (
        <div style={{ textAlign:"center", padding:"80px 20px" }}>
          <div style={{ fontSize:72, marginBottom:20, animation:"float 2s ease-in-out infinite" }}>🧠</div>
          <div style={{ fontWeight:800, fontSize:24, color:C.text, marginBottom:8 }}>Analyzing Your Resume</div>
          <div style={{ color:C.muted, fontSize:13, marginBottom:28, lineHeight:1.8 }}>
            AI is reading the JD, scanning every keyword,<br/>scoring your match, and writing your optimized resume...
          </div>
          <SpinIcon size={40} color={C.orange}/>
        </div>
      )}

      {result && (
        <div className="fade">
          {/* Score Cards */}
          <div style={{ background:`linear-gradient(135deg,${C.purple}12,${C.orange}08)`,
            border:`1px solid ${C.purple}30`, borderRadius:20, padding:28, marginBottom:18 }}>
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:40, marginBottom:20, flexWrap:"wrap" }}>
              <div style={{ textAlign:"center" }}>
                <ScoreRing score={result.matchScore}/>
                <div style={{ color:C.muted, fontSize:12, marginTop:6, fontWeight:600 }}>Match Score</div>
              </div>
              <div style={{ width:1, height:80, background:C.border }}/>
              <div style={{ textAlign:"center" }}>
                <ScoreRing score={result.atsScore} color={C.blue}/>
                <div style={{ color:C.muted, fontSize:12, marginTop:6, fontWeight:600 }}>ATS Score</div>
              </div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ display:"inline-block", padding:"8px 24px", borderRadius:20,
                background:result.matchScore>=75?"#052e16":result.matchScore>=50?"#451a03":"#450a0a",
                color:scoreColor(result.matchScore), fontWeight:800, fontSize:15, marginBottom:12 }}>
                {result.verdict}
              </div>
              <div style={{ color:C.soft, fontSize:14, lineHeight:1.8, maxWidth:520, margin:"0 auto" }}>{result.summary}</div>
            </div>
          </div>

          {/* Tab nav */}
          <div style={{ display:"flex", gap:8, marginBottom:18, overflowX:"auto", paddingBottom:4 }}>
            {[["analysis","📊 Analysis"],["missing","⚠️ Gaps"],["projects","🏗️ Projects"],["resume","✨ Optimized"]].map(([k,l])=>(
              <button key={k} onClick={()=>setSection(k)}
                style={{ padding:"9px 18px", borderRadius:20,
                  border:`1px solid ${section===k?C.orange:C.border}`,
                  background:section===k?`${C.orange}15`:"transparent",
                  color:section===k?C.orange:C.soft, cursor:"pointer",
                  fontFamily:"'Outfit',sans-serif", fontWeight:section===k?700:400,
                  fontSize:13, whiteSpace:"nowrap", transition:"all .2s" }}>
                {l}
              </button>
            ))}
          </div>

          {/* Analysis Tab */}
          {section==="analysis" && (
            <div className="fade">
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
                  <span style={{ fontSize:18 }}>✅</span>
                  <div style={{ fontWeight:700, color:C.text, fontSize:16 }}>Strong Matches</div>
                  <Tag color={C.green} bg="#052e16">{result.strongMatches?.length||0} found</Tag>
                </div>
                {result.strongMatches?.length>0 ? result.strongMatches.map((m,i)=>(
                  <div key={i} style={{ marginBottom:14, background:"#0a0e18", borderRadius:12, padding:16, border:"1px solid #052e16" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                      <div style={{ fontWeight:700, color:C.text }}>{m.skill}</div>
                      <div style={{ fontWeight:800, fontSize:16, color:scoreColor(m.strength) }}>{m.strength}%</div>
                    </div>
                    <div style={{ color:C.muted, fontSize:12, marginBottom:8 }}>{m.reason}</div>
                    <ScoreBar score={m.strength} color={C.green}/>
                  </div>
                )) : <div style={{ color:C.muted, fontSize:13 }}>No strong matches detected.</div>}
              </div>

              {result.suggestedSkillsToAdd?.length>0 && (
                <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:16 }}>
                  <div style={{ fontWeight:700, color:C.text, fontSize:16, marginBottom:14 }}>🎯 Skills to Add</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {result.suggestedSkillsToAdd.map((s,i)=>(
                      <Tag key={i} color={C.purple}>+ {s}</Tag>
                    ))}
                  </div>
                </div>
              )}

              {result.improvements?.length>0 && (
                <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:16 }}>
                  <div style={{ fontWeight:700, color:C.text, fontSize:16, marginBottom:14 }}>📝 What to Improve</div>
                  {result.improvements.map((imp,i)=>(
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10,
                      background:"#0a0e18", borderRadius:10, padding:"10px 14px" }}>
                      <span style={{ color:C.orange, flexShrink:0 }}>→</span>
                      <span style={{ color:C.soft, fontSize:13 }}>{imp}</span>
                    </div>
                  ))}
                </div>
              )}

              {result.weakAreas?.length>0 && (
                <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:22 }}>
                  <div style={{ fontWeight:700, color:C.text, fontSize:16, marginBottom:14 }}>⚡ Weak Areas</div>
                  {result.weakAreas.map((w,i)=>(
                    <div key={i} style={{ background:"#0a0e18", borderRadius:12, padding:16, marginBottom:10, border:"1px solid #451a03" }}>
                      <div style={{ fontWeight:700, color:C.warn, fontSize:14, marginBottom:4 }}>{w.area}</div>
                      <div style={{ color:C.soft, fontSize:13, lineHeight:1.7 }}>{w.detail}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Gaps Tab */}
          {section==="missing" && (
            <div className="fade">
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:22 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
                  <span style={{ fontSize:18 }}>⚠️</span>
                  <div style={{ fontWeight:700, color:C.text, fontSize:16 }}>Missing Keywords</div>
                  <Tag color={C.danger} bg="#450a0a">{result.missingKeywords?.length||0} gaps</Tag>
                </div>
                {result.missingKeywords?.length>0 ? result.missingKeywords.map((m,i)=>(
                  <div key={i} style={{ background:"#0a0e18", borderRadius:12, padding:16, marginBottom:12,
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
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {section==="projects" && (
            <div className="fade">
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:22 }}>
                <div style={{ fontWeight:700, color:C.text, fontSize:16, marginBottom:4 }}>🏗️ Project Relevance</div>
                <div style={{ color:C.muted, fontSize:12, marginBottom:18 }}>Which projects to keep, remove, or reframe for this role</div>
                {result.projectFit?.length>0 ? result.projectFit.map((p,i)=>(
                  <div key={i} style={{ background:"#0a0e18", borderRadius:14, padding:18, marginBottom:14,
                    border:`1px solid ${p.keep?"#14532d":"#1c1917"}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                      <div style={{ fontWeight:700, color:C.text, fontSize:15 }}>{p.name}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Tag color={scoreColor(p.relevance)}>{p.relevance}% match</Tag>
                        <Tag color={p.keep?C.green:C.muted} bg={p.keep?"#052e16":"#1c1917"}>
                          {p.keep?"✓ Keep":"Low priority"}
                        </Tag>
                      </div>
                    </div>
                    <div style={{ color:C.soft, fontSize:13, marginBottom:10 }}>{p.reason}</div>
                    <ScoreBar score={p.relevance} color={scoreColor(p.relevance)}/>
                    {p.suggestion && (
                      <div style={{ marginTop:12, background:`${C.purple}10`, border:`1px solid ${C.purple}25`,
                        borderRadius:10, padding:"10px 14px", color:C.soft, fontSize:13 }}>
                        💡 <strong style={{ color:C.purple }}>Suggestion:</strong> {p.suggestion}
                      </div>
                    )}
                  </div>
                )) : <div style={{ color:C.muted, fontSize:13 }}>No projects detected in your resume.</div>}
              </div>
            </div>
          )}

          {/* Optimized Resume Tab */}
          {section==="resume" && (
            <div className="fade">
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:22 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18, flexWrap:"wrap", gap:12 }}>
                  <div>
                    <div style={{ fontWeight:700, color:C.text, fontSize:16 }}>✨ Optimized Resume</div>
                    <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>ATS-ready · Jake format · Action verbs · Keyword-matched</div>
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <Btn variant="ghost" onClick={()=>navigator.clipboard.writeText(result.optimizedResume||"")}
                      style={{ padding:"8px 14px", fontSize:12 }}>📋 Copy</Btn>
                    <Btn variant="purple" onClick={()=>handleDownload("pdf")}
                      loading={downloading==="pdf"} style={{ padding:"8px 14px", fontSize:12 }}>
                      ⬇ PDF
                    </Btn>
                    <Btn variant="green" onClick={()=>handleDownload("docx")}
                      loading={downloading==="docx"} style={{ padding:"8px 14px", fontSize:12 }}>
                      ⬇ DOCX
                    </Btn>
                  </div>
                </div>

                <div style={{ display:"flex", gap:12, marginBottom:16, flexWrap:"wrap" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, background:`${C.green}10`,
                    border:`1px solid ${C.green}30`, borderRadius:10, padding:"8px 14px" }}>
                    <ScoreRing score={result.matchScore} size={50}/>
                    <div>
                      <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>Role Match</div>
                      <div style={{ color:C.muted, fontSize:11 }}>After optimization</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, background:`${C.blue}10`,
                    border:`1px solid ${C.blue}30`, borderRadius:10, padding:"8px 14px" }}>
                    <ScoreRing score={result.atsScore} size={50} color={C.blue}/>
                    <div>
                      <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>ATS Score</div>
                      <div style={{ color:C.muted, fontSize:11 }}>System readability</div>
                    </div>
                  </div>
                </div>

                <div style={{ background:"#060a12", border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
                  <pre style={{ whiteSpace:"pre-wrap", fontSize:12.5, color:C.soft, lineHeight:1.95,
                    fontFamily:"'DM Mono',monospace", maxHeight:560, overflowY:"auto" }}>
                    {result.optimizedResume}
                  </pre>
                </div>

                <div style={{ marginTop:14, background:`${C.green}08`, border:`1px solid ${C.green}25`,
                  borderRadius:12, padding:"12px 16px", fontSize:13, color:C.soft, lineHeight:1.7 }}>
                  💡 <strong style={{ color:C.green }}>Pro tip:</strong> Download as PDF for job portals. Download DOCX to edit further in Google Docs.
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop:20 }}>
            {/* ── CHANGED: clear localStorage on reset ── */}
            <Btn variant="ghost" onClick={()=>{
              setResult(null); setErr(""); setJd(""); setResume(""); setFileName("");
              localStorage.removeItem("tp_jd"); localStorage.removeItem("tp_resume");
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
// MAIN APP (after login)
// ══════════════════════════════════════════════════════════════════════════
function MainApp({ user, onLogout }) {
  const [tab, setTab] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");
  const [search, setSearch] = useState("software engineer fresher");
  const [location, setLocation] = useState("hyderabad");
  const [expandedJob, setExpandedJob] = useState(null);
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

  const TABS=[["🔥","Jobs"],["⚡","Resume"]];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Outfit',sans-serif" }}>
      <style>{css}</style>

      {/* Header */}
      <div style={{ background:C.card, borderBottom:`1px solid ${C.border}`, padding:"0 20px",
        position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:820, margin:"0 auto", display:"flex", alignItems:"center",
          justifyContent:"space-between", height:60 }}>
          <div style={{ fontWeight:900, fontSize:20, background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>⚡ TakePlace</div>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ fontSize:13, color:C.muted, display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:28, height:28, borderRadius:"50%",
                background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, fontSize:11, color:"#07080f" }}>
                {name[0].toUpperCase()}
              </div>
              <span style={{ display:"none" }}>{name.split(" ")[0]}</span>
            </div>
            <Btn variant="ghost" onClick={onLogout} style={{ padding:"7px 14px", fontSize:12 }}>Logout</Btn>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background:C.card, borderBottom:`1px solid ${C.border}`, position:"sticky", top:60, zIndex:99 }}>
        <div style={{ maxWidth:820, margin:"0 auto", display:"flex" }}>
          {TABS.map(([icon,label],i)=>(
            <button key={i} onClick={()=>setTab(i)}
              style={{ flex:1, padding:"14px 6px", border:"none", background:"transparent",
                cursor:"pointer", color:tab===i?C.orange:C.muted,
                fontFamily:"'Outfit',sans-serif", fontWeight:tab===i?800:400, fontSize:14,
                borderBottom:`2px solid ${tab===i?C.orange:"transparent"}`,
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
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20, marginBottom:22 }}>
              <div style={{ fontWeight:700, color:C.text, fontSize:15, marginBottom:14 }}>🔍 Find Jobs</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                <input style={inp} placeholder="Role (react developer...)" value={search}
                  onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
                <input style={inp} placeholder="City (hyderabad...)" value={location}
                  onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
              </div>
              <Btn onClick={()=>fetchJobs()} style={{ width:"100%" }}>🔍 Search Jobs</Btn>
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:18, color:C.text }}>Live Job Feed</div>
              {!jobsLoading&&jobs.length>0&&(
                <div style={{ display:"flex", alignItems:"center", gap:6, background:"#052e16",
                  borderRadius:20, padding:"5px 14px" }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, animation:"pulse 1.5s infinite" }}/>
                  <span style={{ color:C.green, fontSize:11, fontWeight:700 }}>{jobs.length} live jobs</span>
                </div>
              )}
            </div>

            {jobsLoading && (
              <div style={{ textAlign:"center", padding:"60px 20px" }}>
                <SpinIcon size={40} color={C.orange}/>
                <div style={{ color:C.muted, fontSize:14, marginTop:14 }}>Fetching real jobs...</div>
              </div>
            )}
            {jobsError && (
              <div style={{ background:"#450a0a", border:"1px solid #7f1d1d", borderRadius:14,
                padding:22, color:C.danger, textAlign:"center", fontSize:14 }}>{jobsError}</div>
            )}

            {!jobsLoading&&jobs.map((job,i)=>{
              const isExp=expandedJob===job.id;
              return (
                <div key={job.id} className="fade hover-lift" style={{ background:C.card,
                  border:`1px solid ${C.border}`, borderRadius:16, padding:"18px 20px",
                  marginBottom:12, borderLeft:`3px solid ${C.orange}`,
                  animationDelay:`${i*0.04}s` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:16, color:C.text }}>{job.title}</div>
                      <div style={{ color:C.soft, fontSize:12, marginTop:3 }}>{job.company} · {job.location}</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ color:C.green, fontWeight:800, fontSize:14 }}>{job.salary}</div>
                      <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{job.posted}</div>
                    </div>
                  </div>
                  <div style={{ color:C.muted, fontSize:12, lineHeight:1.7, marginBottom:12,
                    background:"#0a0e18", borderRadius:10, padding:"10px 12px" }}>
                    {isExp?job.description:job.descriptionShort+(job.description.length>220?"...":"")}
                    {job.description.length>220&&(
                      <button onClick={()=>setExpandedJob(isExp?null:job.id)}
                        style={{ background:"none", border:"none", color:C.blue, fontSize:11,
                          cursor:"pointer", marginLeft:6, fontFamily:"'Outfit',sans-serif" }}>
                        {isExp?"Show less ▲":"Read more ▼"}
                      </button>
                    )}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <Tag color={C.blue}>{job.category}</Tag>
                    <div style={{ display:"flex", gap:8 }}>
                      <Btn variant="ghost" onClick={()=>setTab(1)} style={{ fontSize:11, padding:"7px 12px" }}>⚡ Analyze</Btn>
                      <Btn onClick={()=>window.open(job.url,"_blank")} style={{ fontSize:12, padding:"8px 18px" }}>Apply →</Btn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── RESUME TAB ── */}
        {tab===1 && <ResumeAnalyzer/>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROOT
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
    supabase.auth.onAuthStateChange((_,session)=>{
      if (session?.user) { setUser(session.user); if(page!=="app") setPage("splash"); }
      else { setUser(null); setPage("landing"); }
    });
  },[]);

  const handleLogin = (u) => { setUser(u); setPage("splash"); };
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setPage("landing"); };

  if (appLoading) return (
    <div style={{ minHeight:"100vh", background:"#07080f", display:"flex", alignItems:"center",
      justifyContent:"center", flexDirection:"column", gap:16 }}>
      <style>{css}</style>
      <span className="spin" style={{ width:44, height:44, border:`3px solid ${C.orange}30`,
        borderTopColor:C.orange, borderRadius:"50%", display:"inline-block" }}/>
      <div style={{ color:C.muted, fontSize:14, fontFamily:"'Outfit',sans-serif" }}>Loading TakePlace...</div>
    </div>
  );

  if (page==="landing") return <LandingPage onGetStarted={()=>setPage("auth")}/>;
  if (page==="auth")    return <AuthPage onLogin={handleLogin} onBack={()=>setPage("landing")}/>;
  if (page==="splash")  return <LogoSplash onDone={()=>setPage("app")}/>;
  return <MainApp user={user} onLogout={handleLogout}/>;
}
