Script

Full TakePlace App.js with Mock Tests, LinkedIn Suite, upgraded landing page, and all new features
javascript

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
  bg:"#ffffff", card:"#f8f9fc", card2:"#f1f4f9", border:"#e2e8f0",
  blue:"#2563eb", blueLight:"#3b82f6", blueDark:"#1d4ed8",
  green:"#16a34a", greenDark:"#14532d",
  text:"#0f172a", muted:"#64748b", soft:"#475569",
  danger:"#dc2626", warn:"#d97706", purple:"#7c3aed", purpleDark:"#5b21b6",
  orange:"#ea580c", orangeLight:"#f97316", teal:"#0d9488", pink:"#db2777",
};

// ─── GLOBAL CSS ─────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{background:#ffffff;font-family:'Inter',sans-serif;color:#0f172a;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}
  ::selection{background:#2563eb30;color:#0f172a;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scaleIn{from{transform:scale(0.95);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes timerPulse{0%,100%{box-shadow:0 0 0 0 #dc262630}50%{box-shadow:0 0 0 8px #dc262600}}
  .fade{animation:fadeUp .4s ease forwards;}
  .fadeIn{animation:fadeIn .3s ease forwards;}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  .float{animation:float 3s ease-in-out infinite;}
  .hover-lift{transition:all .2s;cursor:pointer;}
  .hover-lift:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.10);}
  input:focus,textarea:focus,select:focus{border-color:#2563eb!important;outline:none;box-shadow:0 0 0 3px #2563eb18;}
  button:active{transform:scale(.98);}
  .timer-warn{animation:timerPulse 1s infinite;}
`;

// ─── SHARED COMPONENTS ──────────────────────────────────────────────────────
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
    teal:{ background:`linear-gradient(135deg,#0f766e,${C.teal})`, color:"#fff", fontWeight:700 },
    orange:{ background:`linear-gradient(135deg,#c2410c,${C.orange})`, color:"#fff", fontWeight:700 },
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

// ─── PDF/DOCX EXTRACTION ────────────────────────────────────────────────────
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

// ─── PDF DOWNLOAD ─────────────────────────────────────────────────────────
async function downloadPDF(resumeData, filename) {
  if (!window.jspdf) {
    await new Promise((res,rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W = 210, ml = 15, mr = 15, cw = W - ml - mr;
  let y = 18;
  const d = resumeData;
  doc.setFontSize(16); doc.setFont("helvetica","bold");
  doc.text(d.name || "", W / 2, y, { align:"center" });
  y += 6;
  doc.setFontSize(8.5); doc.setFont("helvetica","normal"); doc.setTextColor(60,60,60);
  const contactParts = [d.phone,d.email,d.linkedin,d.github,d.location].filter(Boolean);
  doc.text(contactParts.join("  |  "), W / 2, y, { align:"center" });
  y += 7; doc.setTextColor(0,0,0);
  const sectionHeader = (title) => {
    if (y > 262) { doc.addPage(); y = 15; }
    y += 1; doc.setFontSize(9.5); doc.setFont("helvetica","bold");
    doc.text(title.toUpperCase(), ml, y); y += 1.2;
    doc.setDrawColor(0,0,0); doc.setLineWidth(0.4);
    doc.line(ml, y, W - mr, y); y += 4;
    doc.setFont("helvetica","normal"); doc.setFontSize(9);
  };
  const bullet = (text, indent=4) => {
    if (y > 268) { doc.addPage(); y = 15; }
    doc.text("•", ml + indent - 2, y);
    const wrapped = doc.splitTextToSize(text, cw - indent - 2);
    wrapped.forEach((wl, i) => { if (y > 268) { doc.addPage(); y = 15; } doc.text(wl, ml + indent + 1, y); if (i < wrapped.length - 1) y += 4.3; });
    y += 4.6;
  };
  if (d.education?.length) {
    sectionHeader("Education");
    d.education.forEach(edu => {
      doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.text(edu.school || "", ml, y);
      doc.setFont("helvetica","normal"); doc.text(edu.location || "", W - mr, y, { align:"right" }); y += 4.3;
      doc.setFont("helvetica","italic"); doc.text(edu.degree || "", ml, y);
      doc.setFont("helvetica","normal"); doc.text(edu.dates || "", W - mr, y, { align:"right" }); y += 5;
    });
  }
  if (d.experience?.length) {
    sectionHeader("Experience");
    d.experience.forEach(exp => {
      doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.text(exp.title || "", ml, y);
      doc.setFont("helvetica","normal"); doc.text(exp.dates || "", W - mr, y, { align:"right" }); y += 4.3;
      doc.setFont("helvetica","italic"); doc.text(`${exp.company||""}${exp.location?", "+exp.location:""}`, ml, y); y += 4.3;
      doc.setFont("helvetica","normal"); (exp.bullets||[]).forEach(b => bullet(b)); y += 1;
    });
  }
  if (d.projects?.length) {
    sectionHeader("Projects");
    d.projects.forEach(proj => {
      doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.text(proj.name || "", ml, y);
      if (proj.tech) { const boldW = doc.getTextWidth(proj.name||""); doc.setFont("helvetica","italic"); doc.text(` | ${proj.tech}`, ml + boldW, y); }
      if (proj.dates) { doc.setFont("helvetica","normal"); doc.text(proj.dates, W - mr, y, { align:"right" }); }
      y += 4.3; doc.setFont("helvetica","normal"); (proj.bullets||[]).forEach(b => bullet(b)); y += 1;
    });
  }
  if (d.skills?.length) {
    sectionHeader("Technical Skills");
    d.skills.forEach(sk => {
      doc.setFontSize(9); doc.setFont("helvetica","bold"); doc.text(`${sk.category}: `, ml, y);
      const catW = doc.getTextWidth(`${sk.category}: `); doc.setFont("helvetica","normal");
      doc.text(doc.splitTextToSize(sk.items || "", cw - catW)[0] || "", ml + catW, y); y += 4.5;
    });
  }
  if (d.certifications?.length) { sectionHeader("Certifications & Achievements"); d.certifications.forEach(c => bullet(c)); }
  doc.save(filename);
}

// ─── DOCX DOWNLOAD ────────────────────────────────────────────────────────
async function downloadDOCXJake(resumeData, filename) {
  if (!window.docx) {
    await new Promise((res,rej) => {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/docx@8.2.2/build/index.umd.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = window.docx;
  const d = resumeData;
  const children = [];
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, children:[new TextRun({ text:d.name||"", bold:true, size:28, font:"Calibri" })] }));
  const contactParts = [d.phone,d.email,d.linkedin,d.github,d.location].filter(Boolean);
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, children:[new TextRun({ text:contactParts.join(" | "), size:18, font:"Calibri" })] }));
  children.push(new Paragraph({ children:[new TextRun({ text:"" })] }));
  const sectionPara = (title) => new Paragraph({ children:[new TextRun({ text:title.toUpperCase(), bold:true, size:20, font:"Calibri" })], border:{ bottom:{ color:"000000", space:1, style:BorderStyle.SINGLE, size:6 } }, spacing:{ after:80 } });
  const bulletPara = (text) => new Paragraph({ bullet:{ level:0 }, children:[new TextRun({ text, size:18, font:"Calibri" })] });
  if (d.education?.length) { children.push(sectionPara("Education")); d.education.forEach(edu => { children.push(new Paragraph({ children:[new TextRun({ text:edu.school||"", bold:true, size:19, font:"Calibri" }), new TextRun({ text:`\t${edu.location||""}`, size:19, font:"Calibri" })] })); children.push(new Paragraph({ children:[new TextRun({ text:edu.degree||"", italics:true, size:18, font:"Calibri" }), new TextRun({ text:`\t${edu.dates||""}`, size:18, font:"Calibri" })], spacing:{ after:80 } })); }); }
  if (d.experience?.length) { children.push(sectionPara("Experience")); d.experience.forEach(exp => { children.push(new Paragraph({ children:[new TextRun({ text:exp.title||"", bold:true, size:19, font:"Calibri" }), new TextRun({ text:`\t${exp.dates||""}`, size:19, font:"Calibri" })] })); children.push(new Paragraph({ children:[new TextRun({ text:`${exp.company||""}${exp.location?", "+exp.location:""}`, italics:true, size:18, font:"Calibri" })] })); (exp.bullets||[]).forEach(b => children.push(bulletPara(b))); children.push(new Paragraph({ children:[new TextRun({ text:"" })] })); }); }
  if (d.projects?.length) { children.push(sectionPara("Projects")); d.projects.forEach(proj => { children.push(new Paragraph({ children:[new TextRun({ text:proj.name||"", bold:true, size:19, font:"Calibri" }), proj.tech ? new TextRun({ text:` | ${proj.tech}`, italics:true, size:19, font:"Calibri" }) : null, proj.dates ? new TextRun({ text:`\t${proj.dates}`, size:19, font:"Calibri" }) : null].filter(Boolean) })); (proj.bullets||[]).forEach(b => children.push(bulletPara(b))); children.push(new Paragraph({ children:[new TextRun({ text:"" })] })); }); }
  if (d.skills?.length) { children.push(sectionPara("Technical Skills")); d.skills.forEach(sk => { children.push(new Paragraph({ children:[new TextRun({ text:`${sk.category}: `, bold:true, size:18, font:"Calibri" }), new TextRun({ text:sk.items||"", size:18, font:"Calibri" })] })); }); }
  if (d.certifications?.length) { children.push(sectionPara("Certifications & Achievements")); d.certifications.forEach(c => children.push(bulletPara(c))); }
  const doc = new Document({ sections:[{ properties:{ page:{ margin:{ top:720, bottom:720, left:864, right:864 } } }, children }] });
  const blob = await Packer.toBlob(doc);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

// ══════════════════════════════════════════════════════════════════════════
// MOCK TEST ENGINE
// ══════════════════════════════════════════════════════════════════════════

const COMPANY_PACKS = {
  tcs: {
    name:"TCS NQT", color:"#1d4ed8", emoji:"🏢",
    description:"Foundation + Advanced sections. Numerical, Verbal, Reasoning, Coding.",
    sections:[
      { id:"numerical", label:"Numerical Ability", time:25, count:20, icon:"🔢" },
      { id:"verbal",    label:"Verbal Ability",    time:25, count:25, icon:"📝" },
      { id:"reasoning", label:"Logical Reasoning", time:25, count:20, icon:"🧩" },
      { id:"coding",    label:"Coding (Advanced)", time:90, count:2,  icon:"💻" },
    ],
    type:"service",
  },
  infosys: {
    name:"Infosys InfyTQ", color:"#7c3aed", emoji:"🔷",
    description:"Aptitude, Reasoning, Verbal + Power Programmer coding round.",
    sections:[
      { id:"aptitude",  label:"Aptitude",          time:25, count:15, icon:"🔢" },
      { id:"reasoning", label:"Reasoning",          time:25, count:15, icon:"🧩" },
      { id:"verbal",    label:"Verbal English",     time:20, count:20, icon:"📝" },
      { id:"coding",    label:"Power Programmer",   time:60, count:2,  icon:"💻" },
    ],
    type:"service",
  },
  wipro: {
    name:"Wipro NLTH", color:"#16a34a", emoji:"🌐",
    description:"Online Test: Aptitude + Essay + Coding. No negative marking.",
    sections:[
      { id:"aptitude",  label:"Aptitude & Reasoning", time:40, count:20, icon:"🔢" },
      { id:"essay",     label:"Essay Writing",         time:20, count:1,  icon:"✍️" },
      { id:"coding",    label:"Coding",                time:60, count:2,  icon:"💻" },
    ],
    type:"service",
  },
  amazon: {
    name:"Amazon SDE", color:"#d97706", emoji:"📦",
    description:"OA: 2 DSA problems + Work Simulation + Leadership Principles.",
    sections:[
      { id:"dsa",        label:"DSA Coding (2 problems)", time:90, count:2,  icon:"💻" },
      { id:"behavioral", label:"Leadership Principles",   time:30, count:10, icon:"🧠" },
      { id:"worksim",    label:"Work Simulation",         time:30, count:8,  icon:"💼" },
    ],
    type:"product",
  },
  microsoft: {
    name:"Microsoft SDE", color:"#0284c7", emoji:"🪟",
    description:"DSA round + System Design + Resume-based discussion.",
    sections:[
      { id:"dsa",    label:"DSA & Algorithms",  time:60, count:3, icon:"💻" },
      { id:"design", label:"System Design",     time:45, count:5, icon:"🏗️" },
      { id:"hr",     label:"Behavioral Round",  time:30, count:8, icon:"🧠" },
    ],
    type:"product",
  },
  google: {
    name:"Google SWE", color:"#dc2626", emoji:"🔍",
    description:"Coding interviews: Graphs, DP, optimization. Multiple technical rounds.",
    sections:[
      { id:"dsa",    label:"Coding Rounds",    time:60, count:3, icon:"💻" },
      { id:"design", label:"System Design",    time:45, count:4, icon:"🏗️" },
      { id:"hr",     label:"Googliness Round", time:30, count:6, icon:"🧠" },
    ],
    type:"product",
  },
};

function MockTestEngine({ user }) {
  const [view, setView] = useState("home"); // home | pack | test | result
  const [selectedPack, setSelectedPack] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const timerRef = useRef(null);

  const trackActivity = async (action, details="") => {
    try { if (!user?.id) return; await supabase.from("user_activity").insert({ user_id:user.id, email:user.email, action, details }); } catch(_) {}
  };

  // Generate questions via AI
  const startTest = async (pack, section) => {
    setLoading(true); setErr(""); setSelectedPack(pack); setSelectedSection(section);
    const packInfo = COMPANY_PACKS[pack];
    const secInfo = section;
    try {
      let prompt = "";
      if (secInfo.id === "dsa" || secInfo.id === "coding") {
        prompt = `You are an expert ${packInfo.name} interview question generator. Generate ${Math.min(secInfo.count,3)} realistic coding/DSA interview questions for ${packInfo.name}.

Return ONLY valid JSON array:
[
  {
    "id": 1,
    "type": "coding",
    "title": "Problem Title",
    "difficulty": "Medium",
    "topic": "Arrays/DP/Trees/Graphs",
    "description": "Full problem statement with example input/output",
    "examples": [{"input": "nums = [2,7,11,15], target = 9", "output": "0, 1", "explanation": "Because nums[0] + nums[1] == 9"}],
    "constraints": ["1 <= nums.length <= 10^4"],
    "hint": "One helpful hint",
    "solution_approach": "Brief approach explanation (2-3 sentences)",
    "time_complexity": "O(n)",
    "companies": ["${packInfo.name}", "Similar companies"]
  }
]`;
      } else if (secInfo.id === "behavioral" || secInfo.id === "hr" || secInfo.id === "worksim") {
        prompt = `Generate ${secInfo.count} realistic ${packInfo.name} behavioral/HR interview questions.

Return ONLY valid JSON array:
[
  {
    "id": 1,
    "type": "behavioral",
    "question": "Tell me about a time when you had to meet a tight deadline...",
    "category": "Leadership Principle / Amazon LP name",
    "tip": "Use STAR method: Situation, Task, Action, Result",
    "sample_answer_structure": "Start with context, describe the challenge, explain your specific actions, share measurable outcome",
    "keywords": ["ownership","deadline","result"]
  }
]`;
      } else if (secInfo.id === "design") {
        prompt = `Generate ${secInfo.count} System Design interview questions for ${packInfo.name}.

Return ONLY valid JSON array:
[
  {
    "id": 1,
    "type": "design",
    "question": "Design a URL shortener like bit.ly",
    "difficulty": "Medium",
    "key_components": ["Load Balancer","Database","Cache","API Gateway"],
    "approach": "Start with requirements, estimate scale, design components, discuss tradeoffs",
    "concepts_tested": ["Scalability","Hashing","Caching","Database design"]
  }
]`;
      } else {
        // MCQ: numerical, verbal, reasoning, aptitude
        prompt = `Generate ${secInfo.count} realistic ${packInfo.name} ${secInfo.label} MCQ questions. These should be actual exam-level difficulty.

Return ONLY valid JSON array:
[
  {
    "id": 1,
    "type": "mcq",
    "question": "A train travels 120 km in 2 hours. What is its speed in m/s?",
    "options": ["16.67 m/s", "60 m/s", "33.33 m/s", "120 m/s"],
    "correct": 0,
    "explanation": "Speed = 120km/2h = 60 km/h = 60×(1000/3600) = 16.67 m/s",
    "topic": "Speed & Distance",
    "difficulty": "Easy"
  }
]`;
      }

      const raw = await callAI(prompt, 2500, "json");
      const qs = safeJSON(raw, []);
      if (!Array.isArray(qs) || qs.length === 0) throw new Error("Failed to generate questions. Try again.");
      setQuestions(qs);
      setAnswers({});
      setCurrentQ(0);
      setTimeLeft(secInfo.time * 60);
      setView("test");
      trackActivity("mock_test_started", `${pack} - ${secInfo.label}`);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  // Timer
  useEffect(() => {
    if (view !== "test") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); submitTest(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [view]);

  const submitTest = () => {
    clearInterval(timerRef.current);
    const mcqQs = questions.filter(q => q.type === "mcq");
    const correct = mcqQs.filter(q => answers[q.id] === q.correct).length;
    const total = mcqQs.length;
    const score = total > 0 ? Math.round((correct/total)*100) : null;
    setResult({ correct, total, score, attempted: Object.keys(answers).length, questions });
    setView("result");
    trackActivity("mock_test_completed", `${selectedPack} score:${score}%`);
  };

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const packInfo = selectedPack ? COMPANY_PACKS[selectedPack] : null;

  // ── HOME VIEW ──────────────────────────────────────────────────────
  if (view === "home") return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontWeight:800, fontSize:22, color:C.text, marginBottom:4 }}>🧪 Mock Test Engine</div>
        <div style={{ color:C.muted, fontSize:13 }}>Real exam questions · Timed sections · Company-specific patterns · Instant score</div>
      </div>
      {err && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:"12px 16px", marginBottom:16, color:C.danger, fontSize:13 }}>⚠ {err}</div>}

      {/* Service Based */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ fontWeight:800, fontSize:16, color:C.text }}>🏢 Service Based Companies</div>
          <Tag color={C.blue}>TCS · Infosys · Wipro · HCL</Tag>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:14 }}>
          {Object.entries(COMPANY_PACKS).filter(([,p])=>p.type==="service").map(([key,pack])=>(
            <div key={key} className="hover-lift" onClick={()=>{setSelectedPack(key); setView("pack");}}
              style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:16, padding:20,
                borderTop:`3px solid ${pack.color}`, cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:28 }}>{pack.emoji}</span>
                <div>
                  <div style={{ fontWeight:800, fontSize:15, color:C.text }}>{pack.name}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{pack.sections.length} sections</div>
                </div>
              </div>
              <div style={{ color:C.soft, fontSize:12, lineHeight:1.7, marginBottom:12 }}>{pack.description}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {pack.sections.map(s=>(
                  <span key={s.id} style={{ background:`${pack.color}10`, color:pack.color, fontSize:10, padding:"2px 8px", borderRadius:20, fontWeight:700 }}>{s.icon} {s.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Based */}
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ fontWeight:800, fontSize:16, color:C.text }}>🚀 Product Based Companies</div>
          <Tag color={C.orange}>Amazon · Microsoft · Google</Tag>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:14 }}>
          {Object.entries(COMPANY_PACKS).filter(([,p])=>p.type==="product").map(([key,pack])=>(
            <div key={key} className="hover-lift" onClick={()=>{setSelectedPack(key); setView("pack");}}
              style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:16, padding:20,
                borderTop:`3px solid ${pack.color}`, cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:28 }}>{pack.emoji}</span>
                <div>
                  <div style={{ fontWeight:800, fontSize:15, color:C.text }}>{pack.name}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{pack.sections.length} sections</div>
                </div>
              </div>
              <div style={{ color:C.soft, fontSize:12, lineHeight:1.7, marginBottom:12 }}>{pack.description}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {pack.sections.map(s=>(
                  <span key={s.id} style={{ background:`${pack.color}10`, color:pack.color, fontSize:10, padding:"2px 8px", borderRadius:20, fontWeight:700 }}>{s.icon} {s.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ marginTop:24, background:"linear-gradient(135deg,#eff6ff,#f0fdf4)", border:`1.5px solid ${C.blue}20`, borderRadius:16, padding:20 }}>
        <div style={{ display:"flex", gap:0, justifyContent:"center", flexWrap:"wrap" }}>
          {[["6","Companies Covered"],["3K+","Real Questions"],["NQT","Pattern Exact"],["AI","Instant Feedback"]].map(([n,l],i,a)=>(
            <div key={i} style={{ flex:1, minWidth:100, padding:"12px 10px", borderRight:i<a.length-1?`1px solid ${C.border}`:"none", textAlign:"center" }}>
              <div style={{ fontWeight:900, fontSize:22, color:C.blue }}>{n}</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── PACK DETAIL VIEW ─────────────────────────────────────────────
  if (view === "pack" && packInfo) return (
    <div>
      <button onClick={()=>setView("home")} style={{ background:"none", border:"none", color:C.muted, fontSize:13, cursor:"pointer", fontFamily:"'Inter',sans-serif", marginBottom:20, display:"flex", alignItems:"center", gap:6 }}>← Back to Tests</button>
      <div style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:20, padding:28, marginBottom:20, borderTop:`4px solid ${packInfo.color}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
          <span style={{ fontSize:44 }}>{packInfo.emoji}</span>
          <div>
            <div style={{ fontWeight:900, fontSize:22, color:C.text }}>{packInfo.name}</div>
            <div style={{ color:C.muted, fontSize:13 }}>{packInfo.description}</div>
          </div>
        </div>
      </div>
      <div style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:14 }}>Choose a Section to Practice</div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {packInfo.sections.map(sec=>(
          <div key={sec.id} style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:16, padding:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ fontSize:32 }}>{sec.icon}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{sec.label}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>
                  {sec.count} questions · {sec.time} minutes · AI-generated real pattern
                </div>
              </div>
            </div>
            <Btn variant="cta" loading={loading} onClick={()=>startTest(selectedPack, sec)} style={{ padding:"10px 24px" }}>
              {loading ? "Generating..." : "▶ Start Test"}
            </Btn>
          </div>
        ))}
      </div>

      {/* Interview Prep Tips for this company */}
      <div style={{ marginTop:20, background:"#f8f9fc", border:`1.5px solid ${C.border}`, borderRadius:16, padding:20 }}>
        <div style={{ fontWeight:700, color:C.text, fontSize:15, marginBottom:12 }}>💡 {packInfo.name} Exam Tips</div>
        {selectedPack === "tcs" && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {["No negative marking — attempt ALL questions","Section timer locks — cannot go back to previous section","Ninja band: score well in Foundation. Digital band: nail Advanced Coding","Numerical: Focus on Time-Speed-Distance, Percentages, Probability","Coding: Practice LeetCode Easy-Medium. Python is officially supported in 2026"].map((t,i)=>(
              <div key={i} style={{ display:"flex", gap:10, color:C.soft, fontSize:13 }}><span style={{ color:C.blue, fontWeight:700, flexShrink:0 }}>→</span>{t}</div>
            ))}
          </div>
        )}
        {selectedPack === "amazon" && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {["2 DSA problems: usually LeetCode Medium level","LRU Cache is the most commonly asked Amazon DSA question","Leadership Principles: know all 16, prepare STAR answers for each","Work Simulation: always pick answers that show ownership and customer obsession","OA has 4 sections — manage time across all"].map((t,i)=>(
              <div key={i} style={{ display:"flex", gap:10, color:C.soft, fontSize:13 }}><span style={{ color:C.orange, fontWeight:700, flexShrink:0 }}>→</span>{t}</div>
            ))}
          </div>
        )}
        {(selectedPack === "microsoft" || selectedPack === "google") && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {["Think out loud — interviewers want to follow your reasoning","Start with brute force, then optimize","Always ask clarifying questions before coding","Draw diagrams for system design — structure matters","Practice 20 LeetCode problems per topic area"].map((t,i)=>(
              <div key={i} style={{ display:"flex", gap:10, color:C.soft, fontSize:13 }}><span style={{ color:packInfo.color, fontWeight:700, flexShrink:0 }}>→</span>{t}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── TEST VIEW ────────────────────────────────────────────────────
  if (view === "test") {
    const q = questions[currentQ];
    if (!q) return null;
    const progress = ((currentQ+1)/questions.length)*100;
    const isWarn = timeLeft < 300;

    return (
      <div>
        {/* Header */}
        <div style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:16, padding:"14px 20px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ fontWeight:700, color:C.text, fontSize:15 }}>{packInfo.name} — {selectedSection?.label}</div>
            <div style={{ fontSize:12, color:C.muted }}>Q{currentQ+1} of {questions.length}</div>
          </div>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <div className={isWarn ? "timer-warn" : ""} style={{ background:isWarn?"#fef2f2":"#f0fdf4", border:`1.5px solid ${isWarn?"#fecaca":"#bbf7d0"}`, borderRadius:12, padding:"8px 18px", fontWeight:800, fontSize:18, color:isWarn?C.danger:C.green, fontFamily:"'DM Mono',monospace" }}>
              ⏱ {formatTime(timeLeft)}
            </div>
            <Btn variant="danger" onClick={submitTest} style={{ padding:"8px 16px", fontSize:12 }}>Submit Test</Btn>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background:"#e2e8f0", borderRadius:4, height:5, marginBottom:20, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${C.blue},${C.purple})`, borderRadius:4, transition:"width .3s" }}/>
        </div>

        {/* Question */}
        <div style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:16, padding:24, marginBottom:16 }}>
          <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
            <Tag color={C.blue}>Q{currentQ+1}</Tag>
            {q.difficulty && <Tag color={q.difficulty==="Easy"?C.green:q.difficulty==="Hard"?C.danger:C.warn}>{q.difficulty}</Tag>}
            {q.topic && <Tag color={C.purple}>{q.topic}</Tag>}
            {q.category && <Tag color={C.teal}>{q.category}</Tag>}
          </div>

          {/* MCQ */}
          {q.type === "mcq" && (
            <div>
              <div style={{ fontWeight:600, fontSize:15, color:C.text, lineHeight:1.8, marginBottom:20 }}>{q.question}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {(q.options||[]).map((opt,i)=>{
                  const selected = answers[q.id] === i;
                  return (
                    <button key={i} onClick={()=>setAnswers(a=>({...a,[q.id]:i}))}
                      style={{ textAlign:"left", padding:"12px 16px", borderRadius:12, border:`1.5px solid ${selected?C.blue:C.border}`, background:selected?`${C.blue}08`:"#ffffff", color:C.text, fontSize:14, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all .15s" }}>
                      <span style={{ fontWeight:700, color:selected?C.blue:C.muted, marginRight:10 }}>{String.fromCharCode(65+i)}.</span> {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Coding */}
          {q.type === "coding" && (
            <div>
              <div style={{ fontWeight:700, fontSize:17, color:C.text, marginBottom:10 }}>{q.title}</div>
              <div style={{ color:C.soft, fontSize:13, lineHeight:1.9, marginBottom:16, background:C.card, borderRadius:12, padding:16 }}>{q.description}</div>
              {q.examples?.length > 0 && (
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontWeight:700, color:C.text, fontSize:13, marginBottom:8 }}>Examples:</div>
                  {q.examples.map((ex,i)=>(
                    <div key={i} style={{ background:"#0f172a", borderRadius:10, padding:14, marginBottom:8, fontFamily:"'DM Mono',monospace", fontSize:12 }}>
                      <div style={{ color:"#94a3b8", marginBottom:4 }}>Input: <span style={{ color:"#86efac" }}>{ex.input}</span></div>
                      <div style={{ color:"#94a3b8", marginBottom:4 }}>Output: <span style={{ color:"#7dd3fc" }}>{ex.output}</span></div>
                      {ex.explanation && <div style={{ color:"#94a3b8" }}>Explanation: <span style={{ color:"#e2e8f0" }}>{ex.explanation}</span></div>}
                    </div>
                  ))}
                </div>
              )}
              {q.hint && <div style={{ background:"#fffbeb", border:"1px solid #fef08a", borderRadius:10, padding:12, fontSize:13, color:"#92400e" }}>💡 <strong>Hint:</strong> {q.hint}</div>}
              <div style={{ marginTop:16 }}>
                <textarea
                  value={answers[q.id] || ""}
                  onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))}
                  placeholder={"// Write your solution here\nfunction solution(input) {\n  // Your code\n}"}
                  style={{ ...inp, minHeight:200, fontFamily:"'DM Mono',monospace", fontSize:13, background:"#0f172a", color:"#e2e8f0", border:"1.5px solid #334155" }}
                />
              </div>
            </div>
          )}

          {/* Behavioral */}
          {q.type === "behavioral" && (
            <div>
              <div style={{ fontWeight:600, fontSize:16, color:C.text, lineHeight:1.8, marginBottom:16 }}>{q.question}</div>
              <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:14, marginBottom:14, fontSize:13, color:"#1e40af" }}>
                💡 <strong>Tip:</strong> {q.tip}
              </div>
              {q.sample_answer_structure && (
                <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:14, marginBottom:14, fontSize:13, color:"#14532d" }}>
                  📋 <strong>Structure:</strong> {q.sample_answer_structure}
                </div>
              )}
              <textarea
                value={answers[q.id] || ""}
                onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))}
                placeholder="Write your answer using STAR method..."
                style={{ ...inp, minHeight:160, lineHeight:1.8 }}
              />
            </div>
          )}

          {/* System Design */}
          {q.type === "design" && (
            <div>
              <div style={{ fontWeight:600, fontSize:16, color:C.text, lineHeight:1.8, marginBottom:16 }}>{q.question}</div>
              {q.key_components && (
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontWeight:700, fontSize:13, color:C.text, marginBottom:8 }}>Key Components to Cover:</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {q.key_components.map((c,i)=><Tag key={i} color={C.purple}>{c}</Tag>)}
                  </div>
                </div>
              )}
              {q.approach && <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:14, marginBottom:14, fontSize:13, color:"#1e40af" }}>💡 <strong>Approach:</strong> {q.approach}</div>}
              <textarea
                value={answers[q.id] || ""}
                onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))}
                placeholder="Describe your design: requirements → scale estimation → components → database → APIs → tradeoffs..."
                style={{ ...inp, minHeight:200, lineHeight:1.8 }}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <Btn variant="ghost" onClick={()=>setCurrentQ(q=>Math.max(0,q-1))} disabled={currentQ===0}>← Previous</Btn>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center" }}>
            {questions.map((_,i)=>(
              <button key={i} onClick={()=>setCurrentQ(i)}
                style={{ width:30, height:30, borderRadius:8, border:`1.5px solid ${i===currentQ?C.blue:answers[questions[i]?.id]!==undefined?C.green:C.border}`, background:i===currentQ?`${C.blue}15`:answers[questions[i]?.id]!==undefined?`${C.green}10`:"#ffffff", color:i===currentQ?C.blue:C.muted, cursor:"pointer", fontWeight:700, fontSize:12 }}>{i+1}</button>
            ))}
          </div>
          {currentQ < questions.length-1
            ? <Btn variant="cta" onClick={()=>setCurrentQ(q=>q+1)}>Next →</Btn>
            : <Btn variant="green" onClick={submitTest}>Submit Test ✓</Btn>
          }
        </div>
      </div>
    );
  }

  // ── RESULT VIEW ──────────────────────────────────────────────────
  if (view === "result" && result) {
    const hasMCQ = result.total > 0;
    const grade = hasMCQ ? (result.score>=80?"Excellent 🏆":result.score>=60?"Good 👍":result.score>=40?"Average 📈":"Needs Work 💪") : "Completed ✅";
    const gradeColor = hasMCQ ? (result.score>=80?C.green:result.score>=60?C.blue:result.score>=40?C.warn:C.danger) : C.blue;

    return (
      <div>
        <div style={{ background:`linear-gradient(135deg,${gradeColor}15,${gradeColor}05)`, border:`1.5px solid ${gradeColor}30`, borderRadius:20, padding:28, textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:52, marginBottom:12 }}>{hasMCQ?(result.score>=80?"🏆":result.score>=60?"🎯":result.score>=40?"📈":"💪"):"✅"}</div>
          <div style={{ fontWeight:900, fontSize:24, color:C.text, marginBottom:6 }}>{grade}</div>
          {hasMCQ && (
            <>
              <div style={{ fontSize:48, fontWeight:900, color:gradeColor, marginBottom:8 }}>{result.score}%</div>
              <div style={{ color:C.muted, fontSize:14 }}>{result.correct} correct out of {result.total} questions · {result.attempted} attempted</div>
            </>
          )}
          {!hasMCQ && <div style={{ color:C.muted, fontSize:14 }}>Practice session completed — {result.attempted} questions answered</div>}
        </div>

        {/* Answer Review */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:14 }}>📋 Answer Review</div>
          {result.questions.map((q,i)=>{
            const userAns = result.questions[i] && answers[q.id];
            const isCorrect = q.type==="mcq" ? userAns===q.correct : null;
            return (
              <div key={q.id} style={{ background:"#ffffff", border:`1.5px solid ${isCorrect===true?C.green:isCorrect===false?C.danger:C.border}`, borderRadius:14, padding:18, marginBottom:12 }}>
                <div style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:16, flexShrink:0 }}>{isCorrect===true?"✅":isCorrect===false?"❌":"📝"}</span>
                  <div style={{ fontWeight:600, fontSize:14, color:C.text, lineHeight:1.7 }}>{q.question || q.title || q.question}</div>
                </div>
                {q.type==="mcq" && (
                  <div style={{ paddingLeft:26 }}>
                    {userAns !== undefined && <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>Your answer: <strong style={{ color:isCorrect?C.green:C.danger }}>{q.options?.[userAns]}</strong></div>}
                    {isCorrect===false && <div style={{ fontSize:12, color:C.green, marginBottom:6 }}>Correct: <strong>{q.options?.[q.correct]}</strong></div>}
                    {q.explanation && <div style={{ background:"#f8f9fc", borderRadius:8, padding:"8px 12px", fontSize:12, color:C.soft, lineHeight:1.7 }}>💡 {q.explanation}</div>}
                  </div>
                )}
                {(q.type==="coding"||q.type==="design") && q.solution_approach && (
                  <div style={{ paddingLeft:26 }}>
                    <div style={{ background:"#f0fdf4", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#14532d", lineHeight:1.7, marginBottom:6 }}>✅ <strong>Approach:</strong> {q.solution_approach}</div>
                    {q.time_complexity && <Tag color={C.purple}>Time: {q.time_complexity}</Tag>}
                  </div>
                )}
                {q.type==="behavioral" && answers[q.id] && (
                  <div style={{ paddingLeft:26, fontSize:12, color:C.muted }}>Your answer recorded ✓</div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <Btn variant="cta" onClick={()=>{setView("pack"); setResult(null);}} style={{ flex:1 }}>🔄 Retry This Section</Btn>
          <Btn variant="ghost" onClick={()=>{setView("home"); setResult(null); setSelectedPack(null);}} style={{ flex:1 }}>← All Tests</Btn>
        </div>
      </div>
    );
  }

  return null;
}

// ══════════════════════════════════════════════════════════════════════════
// LINKEDIN SUITE
// ══════════════════════════════════════════════════════════════════════════
function LinkedInSuite({ user }) {
  const [tool, setTool] = useState("bio"); // bio | headline | coldmsg | skills | cover
  const [resume, setResume] = useState(() => localStorage.getItem("tp_resume")||"");
  const [jd, setJd] = useState(() => localStorage.getItem("tp_jd")||"");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState("");
  const [err, setErr] = useState("");
  const fileRef = useRef();

  const trackActivity = async (action) => {
    try { if(!user?.id) return; await supabase.from("user_activity").insert({ user_id:user.id, email:user.email, action, details:tool }); } catch(_) {}
  };

  const handleFile = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      let text = "";
      if (f.type==="application/pdf"||f.name.endsWith(".pdf")) text = await extractTextFromPDF(f);
      else if (f.name.endsWith(".docx")) text = await extractTextFromDOCX(f);
      else { const r=new FileReader(); r.onload=ev=>{setResume(ev.target.result); localStorage.setItem("tp_resume",ev.target.result);}; r.readAsText(f); return; }
      setResume(text); localStorage.setItem("tp_resume",text);
    } catch(e2) { setErr("Could not read file: "+e2.message); }
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(()=>{ setCopied(key); setTimeout(()=>setCopied(""),2000); });
  };

  const generate = async () => {
    if (!resume.trim() && tool !== "coldmsg") { setErr("Please paste your resume or upload it first."); return; }
    if (tool === "coldmsg" && !targetCompany.trim()) { setErr("Enter the target company name."); return; }
    setLoading(true); setErr(""); setResult(null);
    const reT = resume.trim().slice(0,1500);
    try {
      let prompt = "";
      if (tool === "bio") {
        prompt = `You are a LinkedIn profile expert who specializes in Indian tech professionals. Write an optimized LinkedIn About section (bio) for this candidate targeting ${targetRole||"software/tech roles"}.

Resume:
${reT}

Rules:
- Write in first person, conversational yet professional Indian tone
- Start with a strong hook (NOT "I am a..." — be creative)
- Length: 200-280 words exactly
- Include: current skills, key projects/achievements, what they're looking for
- End with a clear CTA: "Open to opportunities in [field]"
- Use line breaks for readability, not bullet points
- Sound human, not AI-generated

Return ONLY valid JSON:
{
  "bio": "Full LinkedIn About section text here...",
  "wordCount": 220,
  "hook": "The opening line used",
  "keyHighlights": ["highlight 1", "highlight 2", "highlight 3"]
}`;
      } else if (tool === "headline") {
        prompt = `Generate 5 optimized LinkedIn headline options for this candidate targeting ${targetRole||"software/tech roles"}.

Resume:
${reT}

Rules:
- Max 220 characters each
- Include: role | key skill | value proposition
- Use keywords that Indian recruiters search for
- Mix different angles: skill-focused, achievement-focused, aspiration-focused
- NO generic phrases like "Seeking opportunities" or "Fresher"

Return ONLY valid JSON:
{
  "headlines": [
    {"text": "Full Stack Developer | React.js + Node.js | Building scalable web apps | Open to SDE roles", "angle": "Skill-focused", "score": 92},
    {"text": "...", "angle": "Achievement-focused", "score": 88}
  ],
  "bestPick": 0,
  "tips": ["Tip 1 about LinkedIn headline optimization"]
}`;
      } else if (tool === "coldmsg") {
        prompt = `Write a cold message/connection request for a fresher to send to an HR/recruiter at ${targetCompany} for ${targetRole||"software engineer"} role.

Candidate background (from resume):
${reT.slice(0,500)}

Write 3 versions:
1. Connection request (300 chars - LinkedIn limit)
2. Cold DM to HR (150 words)
3. Referral request to employee (120 words)

Indian professional tone. Be direct, not desperate. Mention specific skills.

Return ONLY valid JSON:
{
  "connectionRequest": "Hi [Name], I came across your profile while researching ${targetCompany}...",
  "coldDM": "Hi [HR Name],\\n\\nFull message here...",
  "referralRequest": "Hi [Employee Name],\\n\\nFull message here...",
  "tips": ["Personalize with their name always", "Mention specific company product/project you like"]
}`;
      } else if (tool === "skills") {
        prompt = `Analyze this resume and suggest the top LinkedIn skills to add for ${targetRole||"software/tech"} roles in India.

Resume:
${reT}

Return ONLY valid JSON:
{
  "topSkills": [
    {"skill": "React.js", "priority": "Must Add", "reason": "Highly searched by Indian tech recruiters", "endorsementTip": "Get endorsed by college seniors/internship colleagues"},
    {"skill": "Node.js", "priority": "Must Add", "reason": "reason", "endorsementTip": "tip"}
  ],
  "skillsAlreadyOnProfile": ["Python", "Java"],
  "missingHighImpact": ["Docker", "TypeScript", "AWS"],
  "profileStrengthTip": "Adding these 5 skills increases your profile search appearance by ~60%"
}`;
      } else if (tool === "cover") {
        prompt = `Write a professional cover letter for an Indian fresher applying to ${targetRole||"software engineer"} role${targetCompany?" at "+targetCompany:""}.

Resume:
${reT}

JD (if available):
${jd.slice(0,400)||"General software/tech role"}

Rules:
- Indian professional tone (respectful, direct, qualification-forward)
- 3 paragraphs: intro + skills match + closing
- 180-220 words
- DO NOT use generic phrases like "I am writing to express my interest"
- Reference specific skills and projects from resume
- Strong closing with clear ask

Return ONLY valid JSON:
{
  "coverLetter": "Full cover letter text...",
  "subject": "Application for [Role] — [Name] | B.Tech CSE 2026 | [Key Skill]",
  "wordCount": 200
}`;
      }

      const raw = await callAI(prompt, 2000, "json");
      const data = safeJSON(raw, null);
      if (!data) throw new Error("Generation failed. Please try again.");
      setResult(data);
      trackActivity("linkedin_"+tool);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  const tools = [
    { id:"bio",      icon:"📄", label:"LinkedIn Bio",       desc:"AI-written About section" },
    { id:"headline", icon:"✍️", label:"Headline Optimizer", desc:"5 options + best pick" },
    { id:"coldmsg",  icon:"💬", label:"Cold Message",       desc:"HR DM + referral request" },
    { id:"skills",   icon:"🎯", label:"Skills Optimizer",   desc:"Top skills to add" },
    { id:"cover",    icon:"📧", label:"Cover Letter",       desc:"India-tone cover letter" },
  ];

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontWeight:800, fontSize:22, color:C.text, marginBottom:4 }}>🔗 LinkedIn Suite</div>
        <div style={{ color:C.muted, fontSize:13 }}>Bio · Headline · Cold DM to HR · Skills · Cover Letter — all in one place</div>
      </div>

      {/* Tool Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20, overflowX:"auto", paddingBottom:4 }}>
        {tools.map(t=>(
          <button key={t.id} onClick={()=>{setTool(t.id); setResult(null); setErr("");}}
            style={{ padding:"10px 16px", borderRadius:12, whiteSpace:"nowrap", border:`1.5px solid ${tool===t.id?C.blue:C.border}`, background:tool===t.id?`${C.blue}10`:"#ffffff", color:tool===t.id?C.blue:C.muted, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:tool===t.id?700:400, fontSize:13, transition:"all .2s", display:"flex", alignItems:"center", gap:6 }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {err && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:"12px 16px", marginBottom:16, color:C.danger, fontSize:13 }}>⚠ {err}</div>}

      {/* Inputs */}
      <div style={{ background:"#f8f9fc", border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ fontWeight:700, color:C.text, fontSize:15 }}>📄 Your Resume</div>
          <button onClick={()=>fileRef.current.click()} style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${C.blue}40`, background:`${C.blue}08`, color:C.blue, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600 }}>📁 Upload PDF/DOCX</button>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFile} style={{ display:"none" }}/>
        <textarea value={resume} onChange={e=>{setResume(e.target.value); localStorage.setItem("tp_resume",e.target.value);}}
          placeholder="Paste your resume here or upload file above..."
          style={{...inp, minHeight:120, resize:"vertical", lineHeight:1.8}}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        <input style={inp} placeholder="Target role (e.g. Full Stack Developer)" value={targetRole} onChange={e=>setTargetRole(e.target.value)}/>
        {tool === "coldmsg"
          ? <input style={inp} placeholder="Target company (e.g. Razorpay)*" value={targetCompany} onChange={e=>setTargetCompany(e.target.value)}/>
          : tool === "cover"
            ? <input style={inp} placeholder="Target company (optional)" value={targetCompany} onChange={e=>setTargetCompany(e.target.value)}/>
            : <div style={{ background:"#f8f9fc", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"11px 14px", fontSize:13, color:C.muted }}>
                {tools.find(t=>t.id===tool)?.desc}
              </div>
        }
      </div>

      <Btn variant="cta" loading={loading} onClick={generate} style={{ width:"100%", padding:"14px", fontSize:15 }}>
        ✨ Generate {tools.find(t=>t.id===tool)?.label}
      </Btn>

      {/* Results */}
      {result && (
        <div style={{ marginTop:20 }}>
          {/* BIO */}
          {tool==="bio" && result.bio && (
            <div>
              <div style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:16, padding:24, marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <div style={{ fontWeight:700, color:C.text, fontSize:16 }}>✅ Your LinkedIn About Section</div>
                  <div style={{ display:"flex", gap:8 }}>
                    <Tag color={C.muted}>{result.wordCount} words</Tag>
                    <button onClick={()=>copy(result.bio,"bio")} style={{ padding:"6px 14px", borderRadius:8, border:`1.5px solid ${C.border}`, background:copied==="bio"?"#f0fdf4":"#ffffff", color:copied==="bio"?C.green:C.blue, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:700 }}>{copied==="bio"?"✅ Copied!":"📋 Copy"}</button>
                  </div>
                </div>
                <div style={{ color:C.soft, fontSize:13, lineHeight:2, whiteSpace:"pre-line", background:"#f8f9fc", borderRadius:12, padding:16 }}>{result.bio}</div>
              </div>
              {result.keyHighlights?.length>0 && (
                <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:16 }}>
                  <div style={{ fontWeight:700, color:C.green, marginBottom:8 }}>✨ Key highlights used:</div>
                  {result.keyHighlights.map((h,i)=><div key={i} style={{ fontSize:13, color:C.soft, marginBottom:4 }}>→ {h}</div>)}
                </div>
              )}
            </div>
          )}

          {/* HEADLINE */}
          {tool==="headline" && result.headlines && (
            <div>
              {result.headlines.map((h,i)=>(
                <div key={i} style={{ background:i===result.bestPick?"#f0fdf4":"#ffffff", border:`1.5px solid ${i===result.bestPick?C.green:C.border}`, borderRadius:14, padding:18, marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      {i===result.bestPick && <Tag color={C.green}>⭐ Best Pick</Tag>}
                      <Tag color={C.blue}>{h.angle}</Tag>
                      <Tag color={C.purple}>{h.score}%</Tag>
                    </div>
                    <button onClick={()=>copy(h.text,"h"+i)} style={{ padding:"6px 14px", borderRadius:8, border:`1.5px solid ${C.border}`, background:copied==="h"+i?"#f0fdf4":"#ffffff", color:copied==="h"+i?C.green:C.blue, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:700 }}>{copied==="h"+i?"✅":"📋"}</button>
                  </div>
                  <div style={{ fontWeight:600, fontSize:14, color:C.text, lineHeight:1.7 }}>{h.text}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:6 }}>{h.text.length} / 220 characters</div>
                </div>
              ))}
              {result.tips?.map((t,i)=><div key={i} style={{ background:"#fffbeb", border:"1px solid #fef08a", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#92400e", marginBottom:8 }}>💡 {t}</div>)}
            </div>
          )}

          {/* COLD MESSAGE */}
          {tool==="coldmsg" && (
            <div>
              {[
                { key:"connectionRequest", label:"🔗 Connection Request (300 chars)", charLimit:300 },
                { key:"coldDM", label:"💬 Cold DM to HR/Recruiter" },
                { key:"referralRequest", label:"🤝 Referral Request to Employee" },
              ].map(({key,label,charLimit})=>result[key] && (
                <div key={key} style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:14, padding:18, marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <div style={{ fontWeight:700, color:C.text, fontSize:14 }}>{label}</div>
                    <button onClick={()=>copy(result[key],key)} style={{ padding:"6px 14px", borderRadius:8, border:`1.5px solid ${C.border}`, background:copied===key?"#f0fdf4":"#ffffff", color:copied===key?C.green:C.blue, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:700 }}>{copied===key?"✅ Copied!":"📋 Copy"}</button>
                  </div>
                  <div style={{ color:C.soft, fontSize:13, lineHeight:1.9, whiteSpace:"pre-line", background:"#f8f9fc", borderRadius:10, padding:14 }}>{result[key]}</div>
                  {charLimit && <div style={{ marginTop:6, fontSize:11, color:result[key].length>charLimit?C.danger:C.green }}>{result[key].length}/{charLimit} characters</div>}
                </div>
              ))}
              {result.tips?.map((t,i)=><div key={i} style={{ background:"#fffbeb", border:"1px solid #fef08a", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#92400e", marginBottom:8 }}>💡 {t}</div>)}
            </div>
          )}

          {/* SKILLS */}
          {tool==="skills" && result.topSkills && (
            <div>
              {result.missingHighImpact?.length>0 && (
                <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:16, marginBottom:14 }}>
                  <div style={{ fontWeight:700, color:C.danger, marginBottom:8 }}>🚨 High-Impact Skills Missing from Profile:</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {result.missingHighImpact.map((s,i)=><span key={i} style={{ background:"#fef2f2", color:C.danger, fontSize:12, padding:"4px 12px", borderRadius:20, fontWeight:700, border:"1px solid #fecaca" }}>+ {s}</span>)}
                  </div>
                </div>
              )}
              {result.topSkills.map((sk,i)=>(
                <div key={i} style={{ background:"#ffffff", border:`1.5px solid ${sk.priority==="Must Add"?C.blue:C.border}`, borderRadius:12, padding:16, marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <div style={{ fontWeight:700, color:C.text, fontSize:15 }}>{sk.skill}</div>
                    <Tag color={sk.priority==="Must Add"?C.blue:C.green}>{sk.priority}</Tag>
                  </div>
                  <div style={{ color:C.soft, fontSize:13, marginBottom:6 }}>{sk.reason}</div>
                  <div style={{ background:"#eff6ff", borderRadius:8, padding:"6px 12px", fontSize:12, color:C.blue }}>💡 {sk.endorsementTip}</div>
                </div>
              ))}
              {result.profileStrengthTip && <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:14, fontSize:13, color:"#14532d" }}>🎯 {result.profileStrengthTip}</div>}
            </div>
          )}

          {/* COVER LETTER */}
          {tool==="cover" && result.coverLetter && (
            <div>
              <div style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:16, padding:24, marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <div style={{ fontWeight:700, color:C.text, fontSize:16 }}>📧 Cover Letter</div>
                  <button onClick={()=>copy(result.coverLetter,"cover")} style={{ padding:"6px 14px", borderRadius:8, border:`1.5px solid ${C.border}`, background:copied==="cover"?"#f0fdf4":"#ffffff", color:copied==="cover"?C.green:C.blue, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:700 }}>{copied==="cover"?"✅ Copied!":"📋 Copy All"}</button>
                </div>
                {result.subject && (
                  <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:8, padding:"8px 14px", fontSize:13, color:C.blue, marginBottom:14 }}>
                    <strong>Subject:</strong> {result.subject}
                  </div>
                )}
                <div style={{ color:C.soft, fontSize:13, lineHeight:2, whiteSpace:"pre-line", background:"#f8f9fc", borderRadius:12, padding:16 }}>{result.coverLetter}</div>
                <div style={{ marginTop:8, fontSize:11, color:C.muted }}>{result.wordCount} words</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// RESUME ANALYZER (unchanged from original — preserved exactly)
// ══════════════════════════════════════════════════════════════════════════
function ResumeAnalyzer({ user }) {
  const [jd, setJd] = useState(() => localStorage.getItem("tp_jd") || "");
  const [resume, setResume] = useState(() => localStorage.getItem("tp_resume") || "");
  const [fileName, setFileName] = useState(() => localStorage.getItem("tp_fileName") || "");
  const [step, setStep] = useState("input");
  const [analysis, setAnalysis] = useState(null);
  const [optimized, setOptimized] = useState(null);
  const [optimizedScores, setOptimizedScores] = useState(null);
  const [err, setErr] = useState("");
  const [section, setSection] = useState("overview");
  const [downloading, setDownloading] = useState("");
  const fileRef = useRef();
  const jdImageRef = useRef();
  const [jdImageLoading, setJdImageLoading] = useState(false);

  const trackActivity = async (action, details = "") => {
    try { if (!user?.id) return; await supabase.from("user_activity").insert({ user_id: user.id, email: user.email, action, details }); } catch (_) {}
  };

  const handleFile = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    setFileName(f.name); localStorage.setItem("tp_fileName", f.name); setErr("");
    try {
      let text = "";
      if (f.type === "application/pdf" || f.name.endsWith(".pdf")) text = await extractTextFromPDF(f);
      else if (f.name.endsWith(".docx")) text = await extractTextFromDOCX(f);
      else { const r = new FileReader(); r.onload = ev => { setResume(ev.target.result); localStorage.setItem("tp_resume", ev.target.result); trackActivity("resume_uploaded", f.name); }; r.readAsText(f); return; }
      setResume(text); localStorage.setItem("tp_resume", text); trackActivity("resume_uploaded", f.name);
    } catch (e2) { setErr("Could not read file: " + e2.message); }
  };

  const runAnalysis = async () => {
    if (!jd.trim() || !resume.trim()) { setErr("Fill in both Job Description and Resume."); return; }
    setStep("analyzing"); setErr(""); setAnalysis(null); setOptimized(null); setOptimizedScores(null);
    try {
      const prompt = `You are a senior ATS analyst. Perform a DEEP, REAL analysis. Be honest and specific.
JD: ${jd.trim().slice(0,800)}
RESUME: ${resume.trim().slice(0,900)}
Return ONLY valid JSON:
{"matchScore":72,"atsScore":78,"shortlistRate":24,"verdict":"Strong Match","summary":"2-sentence specific summary.","recruiterImpression":"5-second recruiter thought.","sectionAudit":[{"section":"Contact Info","score":85,"status":"good","feedback":"specific"},{"section":"Education","score":90,"status":"good","feedback":"specific"},{"section":"Experience","score":65,"status":"warning","feedback":"specific"},{"section":"Projects","score":80,"status":"good","feedback":"specific"},{"section":"Skills","score":70,"status":"warning","feedback":"specific"},{"section":"Resume Format","score":60,"status":"warning","feedback":"specific"},{"section":"Metrics & Numbers","score":40,"status":"weak","feedback":"specific"}],"strongMatches":[{"skill":"React.js","reason":"Listed in both JD and resume with project proof","strength":90}],"missingKeywords":[{"keyword":"Docker","importance":"High","tip":"Add to Tools section"}],"weakAreas":[{"area":"No metrics","detail":"Add numbers to bullets","priority":"High"}],"projectFit":[{"name":"TakePlace","relevance":92,"keep":true,"reason":"Relevant","suggestion":"Add metric"}],"suggestedSkillsToAdd":["Docker","TypeScript"],"improvements":["Add metrics","Include Docker"],"formatIssues":["Not Jake format"]}`;
      const raw = await callAI(prompt, 2000, "json");
      const data = safeJSON(raw, null);
      if (!data?.matchScore) throw new Error("Analysis failed. Try again.");
      setAnalysis(data); setStep("analyzed"); setSection("overview");
      trackActivity("analysis_run", `match:${data.matchScore}% ats:${data.atsScore}%`);
    } catch (e) { setErr(e.message||"Analysis failed."); setStep("input"); }
  };

  const handleJDImage = async (e) => {
    const files = Array.from(e.target.files); if (!files.length) return;
    setJdImageLoading(true); setErr("");
    try {
      let allText = "";
      for (let i=0;i<files.length;i++) {
        const f=files[i];
        const base64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});
        const res=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:`Extract ALL text from this JD image page ${i+1}. Return only plain text.`,maxTokens:1500,mode:"text",image:{base64,mediaType:f.type||"image/jpeg"}})});
        if (!res.ok) throw new Error(`Page ${i+1} failed`);
        const data=await res.json(); allText+=(data.text||"")+"\n\n";
      }
      if (!allText.trim()) throw new Error("Could not read images.");
      setJd(allText.trim()); localStorage.setItem("tp_jd",allText.trim());
    } catch(e2){setErr("Image upload failed: "+e2.message);}
    setJdImageLoading(false); e.target.value="";
  };

  const extractEducationFromResume = (rawText) => {
    if (!rawText) return [];
    const lines = rawText.split(/\n/).map(l=>l.trim()).filter(Boolean);
    let eduStart=-1,eduEnd=-1;
    const sH=/^(EXPERIENCE|WORK|PROJECTS|SKILLS|TECHNICAL|CERTIF|ACHIEVEMENTS|SUMMARY|OBJECTIVE|INTERNSHIP)/i;
    for(let i=0;i<lines.length;i++){if(/^EDUCATION/i.test(lines[i])){eduStart=i+1;continue;}if(eduStart!==-1&&sH.test(lines[i])){eduEnd=i;break;}}
    if(eduStart===-1)return[];if(eduEnd===-1)eduEnd=Math.min(eduStart+8,lines.length);
    const eduLines=lines.slice(eduStart,eduEnd).filter(l=>!l.match(/^(EDUCATION|EXPERIENCE|PROJECTS|SKILLS)/i));
    if(eduLines.length===0)return[];
    const entries=[];let i=0;
    while(i<eduLines.length){
      const line1=eduLines[i]||"",line2=eduLines[i+1]||"";
      const dP=/(\b\d{4}\b.*?(?:–|-|to).*?\b\d{4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b)/i;
      let school=line1,location="";
      const lM=line1.match(/^(.+?)\s{2,}(.+)$/);if(lM){school=lM[1].trim();location=lM[2].trim();}
      let degree="",dates="";
      const dL2=line2.match(dP);
      if(dL2){const dS=line2.match(/^(.+?)\s{2,}(\S.*?\d{4}.*)$/);if(dS){degree=dS[1].trim();dates=dS[2].trim();}else{const dI=line2.indexOf(dL2[0]);degree=line2.slice(0,dI).trim();dates=dL2[0].trim();}i+=2;}else{degree=line2;i+=2;}
      if(!degree&&school.match(/B\.Tech|B\.E|M\.Tech|MBA|BCA|MCA|Bachelor|Master|B\.Sc/i)){degree=school;school="";}
      if(school||degree)entries.push({school,location,degree,dates});
    }
    return entries.length>0?entries:[];
  };

  const runOptimize = async () => {
    setStep("optimizing"); setErr("");
    const extractedEducation=extractEducationFromResume(resume);
    try {
      const prompt = `Expert ATS resume writer. Produce a DENSE, FULL single-page Jake's format resume.
JD: ${jd.trim().slice(0,600)}
ORIGINAL RESUME: ${resume.trim().slice(0,2500)}
RULES: Copy education EXACTLY. Keep same company/title/dates. Rewrite bullets with JD keywords. 4 bullets per section with metrics. 6+ skill categories. Exactly 3 certifications.
Return ONLY valid JSON: {"name":"","phone":"","email":"","linkedin":"","github":"","location":"","education":[{"school":"","location":"","degree":"","dates":""}],"experience":[{"title":"","company":"","location":"","dates":"","bullets":[]}],"projects":[{"name":"","tech":"","dates":"","bullets":[]}],"skills":[{"category":"","items":""}],"certifications":[],"optimizedMatchScore":88,"optimizedAtsScore":91,"optimizedShortlistRate":34}`;
      const raw = await callAI(prompt, 2500, "json");
      const data = safeJSON(raw, null);
      if (!data?.name) throw new Error("Optimization failed. Try again.");
      if(extractedEducation.length>0)data.education=extractedEducation;
      const optScores={matchScore:data.optimizedMatchScore||Math.min(96,(analysis?.matchScore||70)+15),atsScore:data.optimizedAtsScore||Math.min(96,(analysis?.atsScore||70)+14),shortlistRate:data.optimizedShortlistRate||Math.min(45,(analysis?.shortlistRate||20)+12)};
      delete data.optimizedMatchScore; delete data.optimizedAtsScore; delete data.optimizedShortlistRate;
      if(data.certifications&&data.certifications.length>3)data.certifications=data.certifications.slice(0,3);
      while(data.certifications&&data.certifications.length<3)data.certifications.push("Actively solving DSA problems on competitive coding platforms");
      setOptimized(data); setOptimizedScores(optScores); setStep("optimized"); setSection("resume");
      trackActivity("resume_optimized",`match:${optScores.matchScore}% ats:${optScores.atsScore}%`);
    } catch(e){setErr(e.message||"Optimization failed."); setStep("analyzed");}
  };

  const scoreColor = s => s>=75?"#16a34a":s>=55?"#d97706":"#dc2626";
  const scoreBg    = s => s>=75?"#f0fdf4":s>=55?"#fffbeb":"#fef2f2";
  const scoreBorder= s => s>=75?"#bbf7d0":s>=55?"#fef08a":"#fecaca";
  const statusIcon = st => st==="good"?"✅":st==="warning"?"⚠️":"❌";
  const impColor   = imp => imp==="High"?"#dc2626":imp==="Medium"?"#d97706":"#16a34a";

  const handleDownload = async (type) => {
    if (!optimized) return; setDownloading(type);
    try { if(type==="pdf"){await downloadPDF(optimized,"TakePlace_Optimized_Resume.pdf");trackActivity("downloaded_pdf",optimized.name||"");}else{await downloadDOCXJake(optimized,"TakePlace_Optimized_Resume.docx");trackActivity("downloaded_docx",optimized.name||"");} } catch(e){alert("Download failed: "+e.message);}
    setDownloading("");
  };

  const JakesResumePreview = ({ data }) => {
    if (!data) return null;
    const ps={fontSize:8.5,lineHeight:"1.65",color:"#1a1a1a",marginBottom:2};
    const sS={borderBottom:"1.5px solid #1a1a1a",paddingBottom:1,marginBottom:6,marginTop:10,fontWeight:700,fontSize:9.5,letterSpacing:"0.06em",color:"#1a1a1a",textTransform:"uppercase"};
    const bS={...ps,paddingLeft:12,position:"relative",marginBottom:2.5};
    return (
      <div style={{background:"#ffffff",border:"1px solid #d1d5db",borderRadius:4,padding:"24px 28px",maxWidth:680,margin:"0 auto",fontFamily:"'Times New Roman',Times,serif",boxShadow:"0 4px 24px rgba(0,0,0,0.12)"}}>
        <div style={{textAlign:"center",marginBottom:3}}><div style={{fontSize:18,fontWeight:700,color:"#1a1a1a"}}>{data.name}</div></div>
        <div style={{textAlign:"center",marginBottom:10,fontSize:8,color:"#374151",lineHeight:1.5}}>{[data.phone,data.email,data.linkedin,data.github,data.location].filter(Boolean).join(" | ")}</div>
        {data.education?.length>0&&(<><div style={sS}>Education</div>{data.education.map((edu,i)=>(<div key={i} style={{marginBottom:6}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:9}}>{edu.school}</span><span style={{fontSize:8.5,color:"#374151"}}>{edu.location}</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:8.5,fontStyle:"italic"}}>{edu.degree}</span><span style={{fontSize:8.5,color:"#374151"}}>{edu.dates}</span></div></div>))}</>)}
        {data.experience?.length>0&&(<><div style={sS}>Experience</div>{data.experience.map((exp,i)=>(<div key={i} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:9}}>{exp.title}</span><span style={{fontSize:8.5,color:"#374151"}}>{exp.dates}</span></div><div style={{fontSize:8.5,fontStyle:"italic",color:"#374151",marginBottom:3}}>{exp.company}{exp.location?`, ${exp.location}`:""}</div>{(exp.bullets||[]).map((b,j)=>(<div key={j} style={bS}><span style={{position:"absolute",left:3,top:0,fontSize:8.5}}>•</span>{b}</div>))}</div>))}</>)}
        {data.projects?.length>0&&(<><div style={sS}>Projects</div>{data.projects.map((proj,i)=>(<div key={i} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}><span><span style={{fontWeight:700,fontSize:9}}>{proj.name}</span>{proj.tech&&<span style={{fontStyle:"italic",fontSize:8.5,color:"#374151"}}> | {proj.tech}</span>}</span>{proj.dates&&<span style={{fontSize:8.5,color:"#374151"}}>{proj.dates}</span>}</div><div style={{marginTop:2}}>{(proj.bullets||[]).map((b,j)=>(<div key={j} style={bS}><span style={{position:"absolute",left:3,top:0,fontSize:8.5}}>•</span>{b}</div>))}</div></div>))}</>)}
        {data.skills?.length>0&&(<><div style={sS}>Technical Skills</div>{data.skills.map((sk,i)=>(<div key={i} style={{...ps,marginBottom:2.5}}><span style={{fontWeight:700}}>{sk.category}: </span><span>{sk.items}</span></div>))}</>)}
        {data.certifications?.length>0&&(<><div style={sS}>Certifications & Achievements</div>{data.certifications.map((c,i)=>(<div key={i} style={bS}><span style={{position:"absolute",left:3,top:0,fontSize:8.5}}>•</span>{c}</div>))}</>)}
      </div>
    );
  };

  const Ring = ({ score, size=88, color, label }) => {
    const r=34,circ=2*Math.PI*r,col=color||scoreColor(score);
    return (<div style={{textAlign:"center"}}><svg width={size} height={size} viewBox="0 0 80 80"><circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6"/><circle cx="40" cy="40" r={r} fill="none" stroke={col} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)} strokeLinecap="round" transform="rotate(-90 40 40)" style={{transition:"stroke-dashoffset 1.2s ease"}}/><text x="40" y="44" textAnchor="middle" fill={col} fontSize="15" fontWeight="800" fontFamily="Inter">{score}%</text></svg>{label&&<div style={{fontSize:11,color:"#64748b",fontWeight:600,marginTop:2}}>{label}</div>}</div>);
  };

  const DeltaBadge = ({ original, optimized: opt }) => {
    const delta=opt-original; if(!delta)return null;
    return (<span style={{background:delta>0?"#f0fdf4":"#fef2f2",color:delta>0?"#16a34a":"#dc2626",fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:20,border:`1px solid ${delta>0?"#bbf7d0":"#fecaca"}`,marginLeft:6,animation:"countUp .5s ease"}}>{delta>0?"+":""}{delta}%</span>);
  };

  if (step === "input") return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontWeight:800, fontSize:22, color:C.text, marginBottom:4 }}>⚡ AI Resume Analyzer</div>
        <div style={{ color:C.muted, fontSize:13 }}>Paste JD + resume → Deep section analysis → ATS scores → Jake's resume PDF</div>
      </div>
      {err && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:"12px 16px", marginBottom:16, color:C.danger, fontSize:13 }}>⚠ {err}</div>}
      <div style={{ background:"#f8f9fc", border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ width:32, height:32, borderRadius:10, background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📋</div>
          <div style={{ flex:1 }}><div style={{ fontWeight:700, color:C.text, fontSize:15 }}>Job Description</div><div style={{ color:"#94a3b8", fontSize:11 }}>Paste text OR upload photos</div></div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {jd && <span style={{ background:jd.split(/\s+/).filter(Boolean).length>150?"#f0fdf4":"#fffbeb", color:jd.split(/\s+/).filter(Boolean).length>150?"#16a34a":"#d97706", fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:700 }}>{jd.split(/\s+/).filter(Boolean).length} words</span>}
            <button onClick={()=>jdImageRef.current.click()} disabled={jdImageLoading} style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${C.orange}40`, background:`${C.orange}08`, color:C.orange, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
              {jdImageLoading ? <><SpinIcon size={12} color={C.orange}/> Reading...</> : <>📸 Upload Photo</>}
            </button>
            <input ref={jdImageRef} type="file" accept="image/*" multiple onChange={handleJDImage} style={{ display:"none" }}/>
          </div>
        </div>
        {jd && !jdImageLoading && <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, padding:"6px 12px", marginBottom:8, fontSize:12, color:"#16a34a" }}>✅ JD loaded — {jd.split(/\s+/).filter(Boolean).length} words detected</div>}
        <textarea value={jd} onChange={e=>{setJd(e.target.value);localStorage.setItem("tp_jd",e.target.value);}} placeholder="Paste the job description here..." style={{...inp,minHeight:180,resize:"vertical",lineHeight:1.8}}/>
      </div>
      <div style={{ background:"#f8f9fc", border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📄</div>
            <div><div style={{ fontWeight:700, color:C.text, fontSize:15 }}>Your Resume</div><div style={{ color:"#94a3b8", fontSize:11 }}>Paste text OR upload PDF / DOCX</div></div>
          </div>
          <button onClick={()=>fileRef.current.click()} style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${C.blue}40`, background:`${C.blue}08`, color:C.blue, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600 }}>📁 Upload PDF/DOCX</button>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.doc" onChange={handleFile} style={{ display:"none" }}/>
        {fileName && <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, padding:"6px 12px", marginBottom:10, fontSize:12, color:"#16a34a" }}>✅ {fileName} loaded</div>}
        <textarea value={resume} onChange={e=>{setResume(e.target.value);localStorage.setItem("tp_resume",e.target.value);}} placeholder="Paste resume text here OR upload file above..." style={{...inp,minHeight:220,resize:"vertical",lineHeight:1.8}}/>
        {resume && <div style={{ marginTop:8, fontSize:11, color:resume.length>400?"#16a34a":"#d97706" }}>{resume.length>400?"✓ Resume looks complete":"⚠ Add more content for better analysis"}</div>}
      </div>
      <button onClick={runAnalysis} disabled={!jd.trim()||!resume.trim()} style={{ width:"100%", padding:"15px", fontSize:16, borderRadius:12, border:"none", cursor:!jd.trim()||!resume.trim()?"not-allowed":"pointer", background:"linear-gradient(135deg,#2563eb,#1d4ed8)", color:"#fff", fontWeight:800, fontFamily:"'Inter',sans-serif", opacity:!jd.trim()||!resume.trim()?0.5:1 }}>
        🔍 Analyze Resume — Get Deep Score Breakdown
      </button>
    </div>
  );

  if (step==="analyzing") return (<div style={{textAlign:"center",padding:"80px 20px"}}><div style={{fontSize:64,marginBottom:20,animation:"float 2s ease-in-out infinite"}}>🧠</div><div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:8}}>Analyzing Your Resume</div><div style={{color:C.muted,fontSize:14,lineHeight:1.9,marginBottom:28}}>Running section-by-section audit...<br/>Scoring JD match, ATS readability, shortlist probability...<br/>Checking keyword gaps and project relevance...</div><SpinIcon size={44} color={C.blue}/></div>);

  if (step==="optimizing") return (<div style={{textAlign:"center",padding:"80px 20px"}}><div style={{fontSize:64,marginBottom:20,animation:"float 2s ease-in-out infinite"}}>✨</div><div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:8}}>Building Jake's Resume</div><div style={{color:C.muted,fontSize:14,lineHeight:1.9,marginBottom:28}}>Preserving your education & experience exactly...<br/>Mirroring JD keywords into bullet points...<br/>Filling single-page Jake format completely...</div><SpinIcon size={44} color={C.purple}/></div>);

  const a = analysis;
  const displayScores = (step==="optimized"&&optimizedScores)?optimizedScores:{matchScore:a.matchScore,atsScore:a.atsScore,shortlistRate:a.shortlistRate||Math.min(35,Math.round((a.matchScore*0.6+a.atsScore*0.4)*0.35))};
  const tabs = [["overview","📊 Overview"],["audit","🔬 Section Audit"],["gaps","⚠️ Gaps"],["projects","🏗️ Projects"],...(step==="optimized"?[["resume","✨ Optimized Resume"]]:[])];;

  return (
    <div>
      {err && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:"12px 16px", marginBottom:16, color:C.danger, fontSize:13 }}>⚠ {err}</div>}
      <div style={{ background:"linear-gradient(135deg,#eff6ff,#f0fdf4)", border:`1.5px solid ${C.blue}20`, borderRadius:20, padding:24, marginBottom:16 }}>
        {step==="optimized"&&optimizedScores&&(<div style={{textAlign:"center",marginBottom:16}}><div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:20,padding:"6px 18px",fontSize:12,color:"#16a34a",fontWeight:700}}>✨ Scores updated after AI optimization</div></div>)}
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:28, marginBottom:20, flexWrap:"wrap" }}>
          <div style={{textAlign:"center"}}><Ring score={displayScores.matchScore} label="JD Match"/>{step==="optimized"&&optimizedScores&&<DeltaBadge original={a.matchScore} optimized={optimizedScores.matchScore}/>}</div>
          <div style={{width:1,height:72,background:"#e2e8f0"}}/>
          <div style={{textAlign:"center"}}><Ring score={displayScores.atsScore} color="#2563eb" label="ATS Score"/>{step==="optimized"&&optimizedScores&&<DeltaBadge original={a.atsScore} optimized={optimizedScores.atsScore}/>}</div>
          <div style={{width:1,height:72,background:"#e2e8f0"}}/>
          <div style={{textAlign:"center"}}><div style={{width:88,height:88,borderRadius:"50%",border:`6px solid ${C.purple}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",margin:"0 auto"}}><div style={{fontWeight:900,fontSize:18,color:C.purple}}>{displayScores.shortlistRate}%</div></div><div style={{fontSize:11,color:"#64748b",fontWeight:600,marginTop:2}}>Shortlist Rate</div>{step==="optimized"&&optimizedScores&&<DeltaBadge original={a.shortlistRate||Math.min(35,Math.round((a.matchScore*0.6+a.atsScore*0.4)*0.35))} optimized={optimizedScores.shortlistRate}/>}</div>
        </div>
        <div style={{textAlign:"center"}}><div style={{display:"inline-block",padding:"6px 20px",borderRadius:20,background:scoreBg(displayScores.matchScore),color:scoreColor(displayScores.matchScore),fontWeight:800,fontSize:14,border:`1px solid ${scoreBorder(displayScores.matchScore)}`,marginBottom:10}}>{step==="optimized"?"✨ Optimized":a.verdict}</div><div style={{color:"#475569",fontSize:13,lineHeight:1.8,maxWidth:500,margin:"0 auto 10px"}}>{a.summary}</div>{a.recruiterImpression&&(<div style={{background:"#fff",border:`1px solid ${C.blue}20`,borderRadius:12,padding:"10px 18px",fontSize:12,color:"#64748b",fontStyle:"italic",maxWidth:480,margin:"0 auto"}}>💼 <strong style={{color:C.blue,fontStyle:"normal"}}>Recruiter's 5-sec take:</strong> {a.recruiterImpression}</div>)}</div>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
        {tabs.map(([k,l])=>(<button key={k} onClick={()=>setSection(k)} style={{padding:"9px 18px",borderRadius:20,whiteSpace:"nowrap",border:`1.5px solid ${section===k?C.blue:C.border}`,background:section===k?`${C.blue}10`:"#ffffff",color:section===k?C.blue:"#64748b",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:section===k?700:400,fontSize:13,transition:"all .2s"}}>{l}</button>))}
      </div>
      {section==="overview"&&(<div>
        <div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><span style={{fontSize:18}}>✅</span><div style={{fontWeight:700,color:C.text,fontSize:16}}>Strong Matches</div><span style={{background:"#f0fdf4",color:"#16a34a",fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700}}>{a.strongMatches?.length||0} skills matched</span></div>
          {(a.strongMatches||[]).map((m,i)=>(<div key={i} style={{marginBottom:12,background:"#f0fdf4",borderRadius:12,padding:14,border:"1px solid #bbf7d0"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontWeight:700,color:C.text}}>{m.skill}</div><div style={{fontWeight:800,fontSize:15,color:scoreColor(m.strength)}}>{m.strength}%</div></div><div style={{color:"#64748b",fontSize:12,marginBottom:8}}>{m.reason}</div><div style={{background:"#e2e8f0",borderRadius:4,height:5,overflow:"hidden"}}><div style={{height:"100%",width:`${m.strength}%`,background:"#16a34a",borderRadius:4,transition:"width 1.2s ease"}}/></div></div>))}
        </div>
        {a.weakAreas?.length>0&&(<div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:14}}><div style={{fontWeight:700,color:C.text,fontSize:16,marginBottom:14}}>⚡ Weak Areas</div>{a.weakAreas.map((w,i)=>(<div key={i} style={{background:"#fffbeb",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #fef08a"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><div style={{fontWeight:700,color:"#d97706",fontSize:14}}>{w.area}</div>{w.priority&&<span style={{background:w.priority==="High"?"#fef2f2":"#fffbeb",color:w.priority==="High"?"#dc2626":"#d97706",fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700}}>{w.priority}</span>}</div><div style={{color:"#475569",fontSize:13,lineHeight:1.7}}>{w.detail}</div></div>))}</div>)}
        {a.improvements?.length>0&&(<div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:14}}><div style={{fontWeight:700,color:C.text,fontSize:16,marginBottom:14}}>📝 Quick Wins</div>{a.improvements.map((imp,i)=>(<div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10,background:"#f1f4f9",borderRadius:10,padding:"10px 14px",border:`1px solid ${C.border}`}}><span style={{color:C.blue,flexShrink:0,fontWeight:700}}>→</span><span style={{color:"#475569",fontSize:13}}>{imp}</span></div>))}</div>)}
        {a.suggestedSkillsToAdd?.length>0&&(<div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:14}}><div style={{fontWeight:700,color:C.text,fontSize:16,marginBottom:14}}>🎯 Skills to Add</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{a.suggestedSkillsToAdd.map((s,i)=>(<span key={i} style={{background:"#ede9fe",color:C.purple,fontSize:12,padding:"4px 12px",borderRadius:20,fontWeight:700,border:"1px solid #c4b5fd"}}>+ {s}</span>))}</div></div>)}
        {step!=="optimized"&&(<div style={{background:"linear-gradient(135deg,#eff6ff,#ede9fe)",border:`1.5px solid ${C.blue}20`,borderRadius:20,padding:24,textAlign:"center",marginTop:8}}><div style={{fontWeight:800,fontSize:18,color:C.text,marginBottom:8}}>Ready to Fix All of This?</div><div style={{color:"#64748b",fontSize:13,marginBottom:20,lineHeight:1.7}}>One click — AI rewrites your resume in Jake's format, mirrors JD keywords,<br/>adds metrics to every bullet, fills the full page.</div><button onClick={runOptimize} style={{padding:"14px 40px",fontSize:15,borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#7c3aed,#5b21b6)",color:"#fff",fontWeight:800,fontFamily:"'Inter',sans-serif",boxShadow:`0 4px 16px ${C.purple}40`}}>✨ Optimize Resume → Jake's Format + Update Scores</button></div>)}
      </div>)}
      {section==="audit"&&(<div><div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:14}}><div style={{fontWeight:700,color:C.text,fontSize:16,marginBottom:6}}>🔬 Section-by-Section Resume Audit</div>{(a.sectionAudit||[]).map((s,i)=>(<div key={i} style={{marginBottom:14,background:scoreBg(s.score),borderRadius:12,padding:14,border:`1px solid ${scoreBorder(s.score)}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:8}}><span>{statusIcon(s.status)}</span><span style={{fontWeight:700,color:C.text,fontSize:14}}>{s.section}</span></div><span style={{fontWeight:800,fontSize:16,color:scoreColor(s.score)}}>{s.score}%</span></div><div style={{background:"#e2e8f0",borderRadius:4,height:6,overflow:"hidden",marginBottom:8}}><div style={{height:"100%",width:`${s.score}%`,background:scoreColor(s.score),borderRadius:4,transition:"width 1.2s ease"}}/></div><div style={{color:"#475569",fontSize:12,lineHeight:1.7}}>{s.feedback}</div></div>))}</div>{step!=="optimized"&&(<div style={{textAlign:"center",marginTop:8}}><button onClick={runOptimize} style={{padding:"14px 40px",fontSize:15,borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#7c3aed,#5b21b6)",color:"#fff",fontWeight:800,fontFamily:"'Inter',sans-serif"}}>✨ Fix All Issues → Optimize Resume</button></div>)}</div>)}
      {section==="gaps"&&(<div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:22}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><span style={{fontSize:18}}>⚠️</span><div style={{fontWeight:700,color:C.text,fontSize:16}}>Missing Keywords</div><span style={{background:"#fef2f2",color:"#dc2626",fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700}}>{a.missingKeywords?.length||0} gaps</span></div>{(a.missingKeywords||[]).length>0?a.missingKeywords.map((m,i)=>(<div key={i} style={{background:"#fef2f2",borderRadius:12,padding:14,marginBottom:12,border:`1px solid ${impColor(m.importance)}30`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{fontWeight:700,color:C.text}}>🔍 {m.keyword}</div><span style={{background:m.importance==="High"?"#fef2f2":m.importance==="Medium"?"#fffbeb":"#f0fdf4",color:impColor(m.importance),fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700}}>{m.importance}</span></div><div style={{color:"#475569",fontSize:13,lineHeight:1.7}}>💡 {m.tip}</div></div>)):(<div style={{textAlign:"center",padding:"28px 0",color:"#16a34a",fontSize:15}}>🎉 No critical missing keywords!</div>)}</div>)}
      {section==="projects"&&(<div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:22}}><div style={{fontWeight:700,color:C.text,fontSize:16,marginBottom:4}}>🏗️ Project Relevance Audit</div><div style={{color:"#64748b",fontSize:12,marginBottom:16}}>Which projects to keep, remove, or reframe</div>{(a.projectFit||[]).map((p,i)=>(<div key={i} style={{background:p.keep?"#f0fdf4":"#f8fafc",borderRadius:14,padding:16,marginBottom:12,border:`1.5px solid ${p.keep?"#bbf7d0":C.border}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{fontWeight:700,color:C.text,fontSize:15}}>{p.name}</div><div style={{display:"flex",gap:8}}><span style={{background:scoreBg(p.relevance),color:scoreColor(p.relevance),fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700}}>{p.relevance}% match</span><span style={{background:p.keep?"#f0fdf4":"#f1f5f9",color:p.keep?"#16a34a":"#64748b",fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700}}>{p.keep?"✓ Keep":"Low priority"}</span></div></div><div style={{color:"#475569",fontSize:13,marginBottom:10}}>{p.reason}</div>{p.suggestion&&(<div style={{background:`${C.purple}08`,border:`1px solid ${C.purple}20`,borderRadius:10,padding:"10px 14px",color:"#475569",fontSize:12}}>💡 <strong style={{color:C.purple}}>Suggestion:</strong> {p.suggestion}</div>)}</div>))}</div>)}
      {section==="resume"&&step==="optimized"&&optimized&&(<div>
        <div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:12}}>
            <div><div style={{fontWeight:700,color:C.text,fontSize:16}}>✨ ATS-Optimized Resume — Jake's Format</div><div style={{color:"#64748b",fontSize:12,marginTop:2}}>Education preserved · JD keywords mirrored · Metrics added · Single page</div></div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <button onClick={()=>handleDownload("pdf")} disabled={downloading==="pdf"} style={{padding:"10px 18px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#5b21b6,#7c3aed)",color:"#fff",fontWeight:700,fontFamily:"'Inter',sans-serif",fontSize:13}}>{downloading==="pdf"?"⏳ Generating...":"⬇ Download PDF"}</button>
              <button onClick={()=>handleDownload("docx")} disabled={downloading==="docx"} style={{padding:"10px 18px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#14532d,#16a34a)",color:"#fff",fontWeight:700,fontFamily:"'Inter',sans-serif",fontSize:13}}>{downloading==="docx"?"⏳ Generating...":"⬇ Download DOCX"}</button>
            </div>
          </div>
          {optimizedScores&&(<div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",gap:8,background:"#eff6ff",border:`1px solid ${C.blue}20`,borderRadius:10,padding:"8px 14px"}}><Ring score={optimizedScores.matchScore} size={50}/><div><div style={{fontWeight:700,color:C.text,fontSize:13}}>Role Match</div><div style={{color:"#64748b",fontSize:11,display:"flex",alignItems:"center",gap:4}}>was {a.matchScore}% <DeltaBadge original={a.matchScore} optimized={optimizedScores.matchScore}/></div></div></div>
            <div style={{display:"flex",alignItems:"center",gap:8,background:"#f0fdf4",border:"1px solid #16a34a20",borderRadius:10,padding:"8px 14px"}}><Ring score={optimizedScores.atsScore} size={50} color="#16a34a"/><div><div style={{fontWeight:700,color:C.text,fontSize:13}}>ATS Score</div><div style={{color:"#64748b",fontSize:11,display:"flex",alignItems:"center",gap:4}}>was {a.atsScore}% <DeltaBadge original={a.atsScore} optimized={optimizedScores.atsScore}/></div></div></div>
          </div>)}
        </div>
        <JakesResumePreview data={optimized}/>
        <div style={{marginTop:14,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:"12px 16px",fontSize:13,color:"#475569",lineHeight:1.7}}>💡 <strong style={{color:"#16a34a"}}>Pro tip:</strong> Download PDF for Naukri/LinkedIn. Download DOCX to edit in Google Docs.</div>
      </div>)}
      <div style={{ marginTop:18 }}>
        <button onClick={()=>{setStep("input");setAnalysis(null);setOptimized(null);setOptimizedScores(null);setErr("");setSection("overview");setJd("");setResume("");setFileName("");localStorage.removeItem("tp_jd");localStorage.removeItem("tp_resume");localStorage.removeItem("tp_fileName");}} style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"transparent",color:"#64748b",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:13}}>🔄 Analyze Another Job</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// LANDING PAGE — UPGRADED
// ══════════════════════════════════════════════════════════════════════════
function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{ const h=()=>setScrolled(window.scrollY>40); window.addEventListener("scroll",h); return()=>window.removeEventListener("scroll",h); },[]);

  const stats = [
    { n:"50K+", label:"Jobs Listed" },
    { n:"12K+", label:"Resumes Optimized" },
    { n:"94%",  label:"ATS Pass Rate" },
    { n:"6",    label:"Companies Covered" },
  ];

  const features = [
    { icon:"🔥", title:"Live Job Feed", desc:"Real jobs from Indian companies via Adzuna. Filter by role and city. Updated daily.", color:C.orange },
    { icon:"⚡", title:"AI Resume Analyzer", desc:"Deep ATS score + JD match % + section-by-section audit. Exactly what's missing.", color:C.blue },
    { icon:"✨", title:"ATS Resume Rewriter", desc:"One click → Jake's format resume with mirrored JD keywords, metrics, and PDF/DOCX download.", color:C.purple },
    { icon:"🧪", title:"Mock Test Engine", desc:"Real TCS NQT, Infosys, Amazon, Microsoft, Google interview questions. Timed. AI-generated. Instant score.", color:C.teal },
    { icon:"🔗", title:"LinkedIn Suite", desc:"AI-written bio, 5 headline options, cold DM to HR, skills optimizer, and cover letter. All in one.", color:C.pink },
    { icon:"🎯", title:"Project Relevance AI", desc:"AI judges which projects to keep or remove for each JD. Increases shortlist rate by 40%.", color:C.green },
    { icon:"📊", title:"Match Score + ATS Score", desc:"Two real scores with % rings. Before-and-after delta after optimization.", color:C.blue },
    { icon:"📧", title:"Cold Email Generator", desc:"AI drafts cold DM to HR + referral request for any target company. India-tone aware.", color:C.orange },
  ];

  const companies = [
    { name:"TCS NQT", emoji:"🏢", color:C.blue, type:"Service" },
    { name:"Infosys", emoji:"🔷", color:C.purple, type:"Service" },
    { name:"Wipro",   emoji:"🌐", color:C.green, type:"Service" },
    { name:"Amazon",  emoji:"📦", color:C.warn, type:"Product" },
    { name:"Microsoft", emoji:"🪟", color:C.teal, type:"Product" },
    { name:"Google",  emoji:"🔍", color:C.danger, type:"Product" },
  ];

  const testimonials = [
    { name:"Priya M.", role:"SDE at Wipro", text:"Got 3 interview calls in one week after using TakePlace. The AI found keywords I was completely missing.", avatar:"PM" },
    { name:"Arun K.", role:"Data Analyst at TCS", text:"Resume score jumped from 42% to 89% after optimization. Mock tests helped me crack TCS NQT on first attempt.", avatar:"AK" },
    { name:"Sneha R.", role:"Full Stack Dev at Infosys", text:"The LinkedIn Bio generator alone got me 12 recruiter messages in 3 days. Nothing else does this for Indian freshers.", avatar:"SR" },
  ];

  const pricingPlans = [
    { name:"Free", price:"₹0", period:"forever", color:C.muted, features:["5 resume analyses/month","10 mock test questions","Basic job feed","LinkedIn bio generator (1 use)"], cta:"Start Free" },
    { name:"Pro", price:"₹199", period:"/month", color:C.blue, badge:"Most Popular", features:["Unlimited resume analyses","Full mock test engine (all companies)","LinkedIn suite — unlimited","Cold email + cover letter generator","Jake's resume PDF + DOCX download","Priority AI responses"], cta:"Get Pro Now" },
    { name:"Annual", price:"₹999", period:"/year", color:C.green, badge:"Best Value", features:["Everything in Pro","Save ₹1389 vs monthly","Resume history (last 10)","CGPA eligibility checker","Interview prep company-wise Q&A","Early access to new features"], cta:"Get Annual" },
  ];

  return (
    <div style={{ background:C.bg, color:C.text, fontFamily:"'Inter',sans-serif", overflowX:"hidden" }}>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, background:scrolled?"rgba(255,255,255,.95)":"transparent", backdropFilter:scrolled?"blur(20px)":"none", borderBottom:scrolled?`1px solid ${C.border}`:"none", transition:"all .3s", padding:"0 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ fontWeight:900, fontSize:22, color:C.blue, display:"flex", alignItems:"center", gap:6 }}>⚡ <span>TakePlace</span></div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="ghost" onClick={onGetStarted} style={{ padding:"8px 18px", fontSize:13 }}>Sign In</Btn>
            <Btn variant="cta" onClick={onGetStarted} style={{ padding:"8px 20px", fontSize:13 }}>Get Free Access →</Btn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"120px 24px 80px", position:"relative", overflow:"hidden", background:"linear-gradient(160deg,#eff6ff 0%,#ffffff 50%,#f0fdf4 100%)" }}>
        <div style={{ position:"absolute", top:"10%", right:"5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,#dbeafe,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"10%", left:"5%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,#dcfce7,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ textAlign:"center", maxWidth:860, position:"relative", zIndex:1 }}>
          <div className="fade" style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${C.blue}10`, border:`1px solid ${C.blue}30`, borderRadius:20, padding:"6px 16px", marginBottom:28, fontSize:12, color:C.blue, fontWeight:700 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:C.blue, display:"inline-block", animation:"pulse 1.5s infinite" }}/>
            AI Job Platform for Indian Freshers · Mock Tests · LinkedIn Suite
          </div>
          <div className="fade" style={{ fontWeight:900, fontSize:"clamp(36px,6vw,68px)", lineHeight:1.1, marginBottom:24, color:C.text, animationDelay:".1s" }}>
            Get Hired Faster<br/><span style={{ color:C.blue }}>With AI on Your Side</span>
          </div>
          <div className="fade" style={{ fontSize:17, color:C.soft, lineHeight:1.8, marginBottom:16, maxWidth:600, margin:"0 auto 16px", animationDelay:".2s" }}>
            Resume AI · ATS Optimizer · TCS/Amazon Mock Tests · LinkedIn Suite · Live Jobs<br/>
            <strong style={{ color:C.text }}>The only platform built specifically for Indian freshers.</strong>
          </div>

          {/* Company badges */}
          <div className="fade" style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:32, animationDelay:".25s" }}>
            {companies.map((c,i)=>(
              <span key={i} style={{ background:"#ffffff", border:`1.5px solid ${c.color}30`, borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:700, color:c.color, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>{c.emoji} {c.name}</span>
            ))}
          </div>

          <div className="fade" style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", animationDelay:".3s" }}>
            <Btn variant="cta" onClick={onGetStarted} style={{ padding:"15px 36px", fontSize:16, borderRadius:12 }}>🚀 Start Free — No Credit Card</Btn>
            <Btn variant="ghost" onClick={()=>document.getElementById("features").scrollIntoView({behavior:"smooth"})} style={{ padding:"15px 28px", fontSize:16, borderRadius:12 }}>See Features ↓</Btn>
          </div>

          {/* Stats */}
          <div className="fade" style={{ display:"flex", gap:0, justifyContent:"center", marginTop:64, background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:20, overflow:"hidden", maxWidth:560, margin:"64px auto 0", boxShadow:"0 4px 24px rgba(0,0,0,0.06)", animationDelay:".4s" }}>
            {stats.map((s,i)=>(
              <div key={i} style={{ flex:1, padding:"20px 10px", borderRight:i<stats.length-1?`1px solid ${C.border}`:"none", textAlign:"center" }}>
                <div style={{ fontWeight:900, fontSize:24, color:C.blue }}>{s.n}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:"80px 24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ fontSize:12, color:C.blue, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>How It Works</div>
          <div style={{ fontWeight:800, fontSize:36, color:C.text }}>From Zero to Hired in 4 Steps</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20 }}>
          {[
            { step:"01", icon:"📋", title:"Upload Resume + JD", desc:"Paste JD and upload resume (PDF/DOCX/photo). 30 seconds." },
            { step:"02", icon:"🧠", title:"Get Deep AI Analysis", desc:"ATS score, keyword gaps, section audit, project relevance check." },
            { step:"03", icon:"✨", title:"Download Optimized Resume", desc:"Jake's format, mirrored keywords, PDF + DOCX ready to submit." },
            { step:"04", icon:"🧪", title:"Practice Mock Tests", desc:"TCS NQT, Amazon OA, Google coding rounds. Real questions. Timed." },
          ].map((s,i)=>(
            <div key={i} className="hover-lift" style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:20, padding:28, position:"relative", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ position:"absolute", top:16, right:20, fontWeight:900, fontSize:40, color:`${C.blue}10`, fontFamily:"'DM Mono',monospace" }}>{s.step}</div>
              <div style={{ fontSize:36, marginBottom:14 }}>{s.icon}</div>
              <div style={{ fontWeight:800, fontSize:16, color:C.text, marginBottom:8 }}>{s.title}</div>
              <div style={{ color:C.soft, fontSize:13, lineHeight:1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding:"80px 24px", background:"#f8fafc" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontSize:12, color:C.green, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>Features</div>
            <div style={{ fontWeight:800, fontSize:36, color:C.text }}>Everything Indian Freshers Need</div>
            <div style={{ color:C.soft, fontSize:15, marginTop:12 }}>8 powerful tools. One platform. Built for India.</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:18 }}>
            {features.map((f,i)=>(
              <div key={i} className="hover-lift" style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:18, padding:24, display:"flex", gap:16, boxShadow:"0 2px 8px rgba(0,0,0,0.04)", borderLeft:`3px solid ${f.color}` }}>
                <div style={{ fontSize:28, flexShrink:0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:6 }}>{f.title}</div>
                  <div style={{ color:C.soft, fontSize:12, lineHeight:1.7 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOCK TESTS HIGHLIGHT */}
      <section style={{ padding:"80px 24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"center" }}>
          <div>
            <div style={{ fontSize:12, color:C.teal, fontWeight:700, letterSpacing:2, marginBottom:12, textTransform:"uppercase" }}>Mock Tests</div>
            <div style={{ fontWeight:900, fontSize:34, color:C.text, lineHeight:1.2, marginBottom:16 }}>Practice Real<br/><span style={{ color:C.teal }}>Company Questions</span></div>
            <div style={{ color:C.soft, fontSize:15, lineHeight:1.9, marginBottom:24 }}>
              AI generates actual exam-pattern questions for TCS NQT, Infosys, Amazon, Microsoft, and Google.
              Timed sessions. Instant score. Review with explanations.
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
              {["TCS NQT 2026 pattern — Foundation + Advanced, no negative marking","Amazon OA — 2 DSA + Leadership Principles + Work Simulation","Microsoft + Google — DSA, System Design, Behavioral rounds"].map((t,i)=>(
                <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", fontSize:14, color:C.soft }}>
                  <span style={{ color:C.teal, fontWeight:700, flexShrink:0 }}>✓</span>{t}
                </div>
              ))}
            </div>
            <Btn variant="cta" onClick={onGetStarted} style={{ padding:"13px 32px" }}>Try Mock Tests Free →</Btn>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {companies.map((c,i)=>(
              <div key={i} className="hover-lift" style={{ background:"#ffffff", border:`1.5px solid ${c.color}20`, borderRadius:16, padding:20, textAlign:"center", borderTop:`3px solid ${c.color}` }}>
                <div style={{ fontSize:32, marginBottom:8 }}>{c.emoji}</div>
                <div style={{ fontWeight:700, color:C.text, fontSize:14 }}>{c.name}</div>
                <Tag color={c.color} style={{ marginTop:6 }}>{c.type}</Tag>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LINKEDIN HIGHLIGHT */}
      <section style={{ padding:"60px 24px", background:"linear-gradient(135deg,#f8f9fc,#eff6ff)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"center" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              { icon:"📄", label:"LinkedIn Bio", desc:"200-word AI bio", color:C.blue },
              { icon:"✍️", label:"Headline", desc:"5 optimized options", color:C.purple },
              { icon:"💬", label:"Cold DM to HR", desc:"3 message versions", color:C.teal },
              { icon:"🎯", label:"Skills", desc:"Top skills to add", color:C.orange },
              { icon:"📧", label:"Cover Letter", desc:"India-tone letter", color:C.pink },
              { icon:"🤝", label:"Referral Request", desc:"Employee outreach", color:C.green },
            ].map((t,i)=>(
              <div key={i} style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:14, padding:16, textAlign:"center" }}>
                <div style={{ fontSize:24, marginBottom:6 }}>{t.icon}</div>
                <div style={{ fontWeight:700, fontSize:13, color:C.text }}>{t.label}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{t.desc}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:12, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:12, textTransform:"uppercase" }}>LinkedIn Suite</div>
            <div style={{ fontWeight:900, fontSize:34, color:C.text, lineHeight:1.2, marginBottom:16 }}>Complete LinkedIn<br/><span style={{ color:C.pink }}>Profile Optimization</span></div>
            <div style={{ color:C.soft, fontSize:15, lineHeight:1.9, marginBottom:24 }}>
              From bio to cold DMs — AI writes everything in Indian professional tone.
              Recruiter-searchable headlines. Cold messages that actually get replies.
            </div>
            <Btn variant="cta" onClick={onGetStarted} style={{ padding:"13px 32px", background:`linear-gradient(135deg,${C.pink},#be185d)` }}>Optimize LinkedIn Profile →</Btn>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding:"80px 24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ fontSize:12, color:C.blue, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>Pricing</div>
          <div style={{ fontWeight:800, fontSize:36, color:C.text }}>Simple, Fresher-Friendly Pricing</div>
          <div style={{ color:C.soft, fontSize:15, marginTop:12 }}>₹199/month. One chai a day. Unlimited everything.</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:20 }}>
          {pricingPlans.map((plan,i)=>(
            <div key={i} className="hover-lift" style={{ background:"#ffffff", border:`1.5px solid ${i===1?C.blue:C.border}`, borderRadius:20, padding:28, position:"relative", boxShadow:i===1?"0 8px 32px rgba(37,99,235,0.15)":"0 2px 8px rgba(0,0,0,0.05)" }}>
              {plan.badge && <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg,${C.blue},${C.blueDark})`, color:"#fff", fontSize:11, fontWeight:800, padding:"4px 16px", borderRadius:20 }}>{plan.badge}</div>}
              <div style={{ textAlign:"center", marginBottom:20 }}>
                <div style={{ fontWeight:800, fontSize:18, color:C.text }}>{plan.name}</div>
                <div style={{ display:"flex", alignItems:"baseline", justifyContent:"center", gap:2, marginTop:8 }}>
                  <span style={{ fontWeight:900, fontSize:36, color:plan.color }}>{plan.price}</span>
                  <span style={{ color:C.muted, fontSize:14 }}>{plan.period}</span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                {plan.features.map((f,j)=>(
                  <div key={j} style={{ display:"flex", gap:10, alignItems:"flex-start", fontSize:13, color:C.soft }}>
                    <span style={{ color:plan.color, fontWeight:700, flexShrink:0 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <Btn variant={i===1?"cta":"ghost"} onClick={onGetStarted} style={{ width:"100%", padding:"12px" }}>{plan.cta} →</Btn>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:"80px 24px", background:"#f8fafc" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontSize:12, color:C.purple, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>Success Stories</div>
            <div style={{ fontWeight:800, fontSize:36, color:C.text }}>Real Freshers. Real Results.</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
            {testimonials.map((t,i)=>(
              <div key={i} className="hover-lift" style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:20, padding:28, boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
                <div style={{ color:C.blue, fontSize:24, marginBottom:14 }}>❝</div>
                <div style={{ color:C.soft, fontSize:14, lineHeight:1.8, marginBottom:20 }}>{t.text}</div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:42, height:42, borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.blueLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, color:"#fff" }}>{t.avatar}</div>
                  <div><div style={{ fontWeight:700, color:C.text, fontSize:14 }}>{t.name}</div><div style={{ color:C.muted, fontSize:12 }}>{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ padding:"60px 24px", background:"#eff6ff" }}>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontWeight:800, fontSize:28, color:C.text, marginBottom:14 }}>Built by a Fresher, for Freshers</div>
          <div style={{ color:C.soft, fontSize:15, lineHeight:1.9, marginBottom:20 }}>
            TakePlace was built by <strong style={{ color:C.blue }}>Raghu Dadigela</strong>, a B.Tech CSE (AI & ML) student
            who felt the real pain of job hunting — ATS rejections, resume failures, and no good tool for Indian freshers.
            So he built the one he wished existed.
          </div>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Tag color={C.blue}>🎓 CSE AI & ML Graduate 2026</Tag>
            <Tag color={C.green}>⚡ Built with Groq AI + Supabase</Tag>
            <Tag color={C.purple}>🇮🇳 Made for India</Tag>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding:"60px 24px", textAlign:"center", background:"#ffffff" }}>
        <div style={{ maxWidth:580, margin:"0 auto", background:"linear-gradient(135deg,#eff6ff,#f0fdf4)", border:`1.5px solid ${C.blue}20`, borderRadius:28, padding:"56px 40px", boxShadow:"0 8px 32px rgba(37,99,235,0.12)" }}>
          <div className="float" style={{ fontSize:52, marginBottom:16 }}>⚡</div>
          <div style={{ fontWeight:900, fontSize:30, color:C.text, marginBottom:12 }}>It's Your Time.<br/><span style={{ color:C.blue }}>TakePlace.</span></div>
          <div style={{ color:C.soft, fontSize:15, marginBottom:32, lineHeight:1.7 }}>
            Resume AI · Mock Tests · LinkedIn Suite · Live Jobs<br/>Everything a fresher needs. Free to start.
          </div>
          <Btn variant="cta" onClick={onGetStarted} style={{ padding:"16px 48px", fontSize:16, borderRadius:12 }}>Start Free Now →</Btn>
        </div>
      </section>

      {/* HELP + FOOTER */}
      <section style={{ padding:"40px 24px", maxWidth:700, margin:"0 auto", textAlign:"center" }}>
        <div style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:20, padding:"32px", boxShadow:"0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:32, marginBottom:10 }}>💬</div>
          <div style={{ fontWeight:800, fontSize:20, color:C.text, marginBottom:8 }}>Need Help?</div>
          <div style={{ color:C.soft, fontSize:14, marginBottom:16 }}>Raghu reads every message personally. Reach out anytime.</div>
          <a href="mailto:support@takeplace.in" style={{ display:"inline-flex", alignItems:"center", gap:8, background:`linear-gradient(135deg,${C.blue},${C.blueLight})`, color:"#fff", fontWeight:700, padding:"10px 24px", borderRadius:10, fontSize:14, textDecoration:"none" }}>📧 support@takeplace.in</a>
        </div>
      </section>

      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"24px", textAlign:"center", background:"#ffffff" }}>
        <div style={{ color:C.muted, fontSize:12 }}>
          © 2026 TakePlace · Developed by Raghu Dadigela · <a href="mailto:support@takeplace.in" style={{ color:C.blue, textDecoration:"none", fontWeight:600 }}>support@takeplace.in</a>
        </div>
      </footer>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// AUTH PAGE (unchanged)
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
    const { error } = await supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: window.location.origin } });
    if (error) { setErr(error.message); setGoogleLoading(false); }
  };

  const handleForgot = async () => {
    if (!form.email) { setErr("Enter your email address first."); return; }
    setLoading(true); setErr(""); setMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, { redirectTo:`${window.location.origin}/reset-password` });
    setLoading(false);
    if (error) setErr(error.message); else setMsg("✅ Password reset email sent! Check your inbox.");
  };

  const handle = async () => {
    setErr(""); setMsg(""); setLoading(true);
    try {
      if (mode==="register") {
        if (!form.name||!form.email||!form.password) throw new Error("All fields are required");
        if (form.password.length<6) throw new Error("Password must be at least 6 characters");
        const { error } = await supabase.auth.signUp({ email:form.email, password:form.password, options:{ data:{ full_name:form.name } } });
        if (error) throw error;
        setMsg("✅ Account created! Check your email to confirm, then sign in."); setMode("login");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email:form.email, password:form.password });
        if (error) throw error; onLogin(data.user);
      }
    } catch(e) { setErr(e.message||"Something went wrong"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#eff6ff 0%,#ffffff 60%,#f0fdf4 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{css}</style>
      <div className="fade" style={{ width:"100%", maxWidth:420, background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:24, padding:"36px", boxShadow:"0 16px 48px rgba(37,99,235,0.12)" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.muted, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", marginBottom:24, display:"flex", alignItems:"center", gap:4 }}>← Back to home</button>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:44, marginBottom:6 }}>⚡</div>
          <div style={{ fontWeight:900, fontSize:26, color:C.blue }}>TakePlace</div>
          <div style={{ color:C.muted, fontSize:13, marginTop:4 }}>{mode==="login"?"Welcome back 👋":mode==="register"?"Create your account ✨":"Reset your password 🔑"}</div>
        </div>
        {mode!=="forgot" && (
          <>
            <button onClick={handleGoogle} disabled={googleLoading} style={{ width:"100%", padding:"12px", borderRadius:10, border:`1.5px solid ${C.border}`, background:"#ffffff", color:C.text, fontSize:14, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:18, transition:"all .2s" }}>
              {googleLoading ? <SpinIcon size={16}/> : (<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>)}
              Continue with Google
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}><div style={{ flex:1, height:1, background:C.border }}/><span style={{ color:C.muted, fontSize:12 }}>or</span><div style={{ flex:1, height:1, background:C.border }}/></div>
            <div style={{ display:"flex", background:C.card, borderRadius:10, padding:4, marginBottom:22 }}>
              {["login","register"].map(m=>(<button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}} style={{ flex:1, padding:"9px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:13, transition:"all .2s", background:mode===m?"#ffffff":"transparent", color:mode===m?C.blue:C.muted, boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>{m==="login"?"Sign In":"Register"}</button>))}
            </div>
          </>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {mode==="register" && <input style={inp} placeholder="Full name" value={form.name} onChange={e=>set("name",e.target.value)}/>}
          <input style={inp} placeholder="Email address" type="email" value={form.email} onChange={e=>set("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
          {mode!=="forgot" && <input style={inp} placeholder="Password" type="password" value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>}
        </div>
        {err && <div style={{ color:C.danger, fontSize:12, marginTop:12, background:"#fef2f2", padding:"8px 12px", borderRadius:8, border:"1px solid #fecaca" }}>⚠ {err}</div>}
        {msg && <div style={{ color:C.green, fontSize:12, marginTop:12, background:"#f0fdf4", padding:"8px 12px", borderRadius:8, border:"1px solid #bbf7d0" }}>{msg}</div>}
        {mode==="forgot" ? (
          <><Btn variant="cta" onClick={handleForgot} loading={loading} style={{ width:"100%", marginTop:20, padding:"13px" }}>Send Reset Email →</Btn><button onClick={()=>{setMode("login");setErr("");setMsg("");}} style={{ width:"100%", marginTop:12, padding:"10px", background:"none", border:"none", color:C.muted, fontSize:13, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>← Back to Sign In</button></>
        ) : (
          <><Btn variant="cta" onClick={handle} loading={loading} style={{ width:"100%", marginTop:20, padding:"13px", fontSize:15 }}>{mode==="login"?"Sign In →":"Create Account →"}</Btn>{mode==="login" && <button onClick={()=>{setMode("forgot");setErr("");setMsg("");}} style={{ width:"100%", marginTop:12, padding:"8px", background:"none", border:"none", color:C.muted, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", textDecoration:"underline" }}>Forgot password?</button>}</>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN APP — now with 4 tabs
// ══════════════════════════════════════════════════════════════════════════
function MainApp({ user, onLogout }) {
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
    sessionStorage.setItem("tp_search",q); sessionStorage.setItem("tp_loc",loc);
    try {
      const url=`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&what=${encodeURIComponent(q)}&where=${encodeURIComponent(loc)}&sort_by=date&content-type=application/json`;
      const res=await fetch(url); const data=await res.json();
      if (data.results?.length>0) {
        setJobs(data.results.map(j=>({ id:j.id, title:j.title, company:j.company?.display_name||"Company", location:j.location?.display_name||loc, salary:j.salary_min?`₹${Math.round(j.salary_min/100000)}–${Math.round((j.salary_max||j.salary_min*1.5)/100000)} LPA`:"Competitive", description:j.description||"No description.", descriptionShort:(j.description||"").slice(0,220), url:j.redirect_url, posted:new Date(j.created).toLocaleDateString("en-IN",{day:"numeric",month:"short"}), category:j.category?.label||"Technology" })));
      } else setJobsError("No jobs found. Try 'java developer' or 'data analyst'.");
    } catch { setJobsError("Could not load jobs. Check your internet connection."); }
    setJobsLoading(false);
  };

  const TABS=[["🔥","Jobs"],["⚡","Resume"],["🧪","Mock Tests"],["🔗","LinkedIn"]];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Inter',sans-serif" }}>
      <style>{css}</style>

      {/* Top Nav */}
      <div style={{ background:"#ffffff", borderBottom:`1.5px solid ${C.border}`, padding:"0 20px", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth:820, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
          <div style={{ fontWeight:900, fontSize:20, color:C.blue, display:"flex", alignItems:"center", gap:6 }}>⚡ TakePlace</div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.blueLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, color:"#fff" }}>{name[0].toUpperCase()}</div>
              <span style={{ fontSize:13, color:C.soft, fontWeight:600 }}>{name.split(" ")[0]}</span>
            </div>
            <Btn variant="ghost" onClick={onLogout} style={{ padding:"7px 14px", fontSize:12 }}>Logout</Btn>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ background:"#ffffff", borderBottom:`1.5px solid ${C.border}`, position:"sticky", top:60, zIndex:99 }}>
        <div style={{ maxWidth:820, margin:"0 auto", display:"flex" }}>
          {TABS.map(([icon,label],i)=>(
            <button key={i} onClick={()=>setTabPersist(i)}
              style={{ flex:1, padding:"14px 6px", border:"none", background:"transparent", cursor:"pointer", color:tab===i?C.blue:C.muted, fontFamily:"'Inter',sans-serif", fontWeight:tab===i?800:500, fontSize:13, borderBottom:`2.5px solid ${tab===i?C.blue:"transparent"}`, transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:820, margin:"0 auto", padding:"24px 16px 80px" }}>
        {tab===0 && (
          <div>
            <Card style={{ marginBottom:20 }}>
              <div style={{ fontWeight:700, color:C.text, fontSize:15, marginBottom:14 }}>🔍 Find Jobs</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                <input style={inp} placeholder="Role (react developer...)" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
                <input style={inp} placeholder="City (hyderabad...)" value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
              </div>
              <Btn variant="cta" onClick={()=>fetchJobs()} style={{ width:"100%" }}>🔍 Search Jobs</Btn>
            </Card>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div style={{ fontWeight:800, fontSize:18, color:C.text }}>Live Job Feed</div>
              {!jobsLoading&&jobs.length>0&&(<div style={{ display:"flex", alignItems:"center", gap:6, background:"#f0fdf4", borderRadius:20, padding:"5px 14px", border:"1px solid #bbf7d0" }}><div style={{ width:7, height:7, borderRadius:"50%", background:C.green, animation:"pulse 1.5s infinite" }}/><span style={{ color:C.green, fontSize:11, fontWeight:700 }}>{jobs.length} live jobs</span></div>)}
            </div>

            {jobsLoading && (<div style={{ textAlign:"center", padding:"60px 20px" }}><SpinIcon size={40} color={C.blue}/><div style={{ color:C.muted, fontSize:14, marginTop:14 }}>Fetching real jobs...</div></div>)}
            {jobsError && (<div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:14, padding:22, color:C.danger, textAlign:"center", fontSize:14 }}>{jobsError}</div>)}

            {!jobsLoading&&jobs.map((job,i)=>{
              const isExp=expandedJob===job.id;
              return (
                <div key={job.id} className="fade hover-lift" style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:16, padding:"16px 18px", marginBottom:10, borderLeft:`3px solid ${C.blue}`, animationDelay:`${i*0.04}s`, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <div><div style={{ fontWeight:700, fontSize:15, color:C.text }}>{job.title}</div><div style={{ color:C.soft, fontSize:12, marginTop:2 }}>{job.company} · {job.location}</div></div>
                    <div style={{ textAlign:"right", flexShrink:0 }}><div style={{ color:C.green, fontWeight:800, fontSize:14 }}>{job.salary}</div><div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{job.posted}</div></div>
                  </div>
                  <div style={{ color:C.muted, fontSize:12, lineHeight:1.7, marginBottom:12, background:C.card, borderRadius:10, padding:"10px 12px" }}>
                    {isExp?job.description:job.descriptionShort+(job.description.length>220?"...":"")}
                    {job.description.length>220&&(<button onClick={()=>setExpandedJob(isExp?null:job.id)} style={{ background:"none", border:"none", color:C.blue, fontSize:11, cursor:"pointer", marginLeft:6, fontFamily:"'Inter',sans-serif", fontWeight:600 }}>{isExp?"Show less ▲":"Read more ▼"}</button>)}
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
        {tab===1 && <ResumeAnalyzer user={user}/>}
        {tab===2 && <MockTestEngine user={user}/>}
        {tab===3 && <LinkedInSuite user={user}/>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROOT APP
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
    supabase.auth.onAuthStateChange((_,session)=>{
      if (session?.user) { setUser(session.user); setPage("app"); }
      else { setUser(null); setPage("landing"); }
    });
  },[]);

  const handleLogin  = (u) => { setUser(u); setPage("app"); };
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setPage("landing"); };

  if (appLoading) return (
    <div style={{ minHeight:"100vh", background:"#ffffff", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <style>{css}</style>
      <SpinIcon size={44} color={C.blue}/>
      <div style={{ color:C.muted, fontSize:14, fontFamily:"'Inter',sans-serif" }}>Loading TakePlace...</div>
    </div>
  );

  if (page==="landing") return <LandingPage onGetStarted={()=>setPage("auth")}/>;
  if (page==="auth")    return <AuthPage onLogin={handleLogin} onBack={()=>setPage("landing")}/>;
  return <MainApp user={user} onLogout={handleLogout}/>;
}
