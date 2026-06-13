import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID  = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const supabase   = createClient(SUPABASE_URL, SUPABASE_KEY);
const SUPPORT_EMAIL = "takeplace.in@gmail.com";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  bg:"#f8fafc", sidebar:"#0f172a", sidebarHover:"#1e293b", sidebarActive:"#2563eb",
  card:"#ffffff", card2:"#f1f5f9", border:"#e2e8f0",
  blue:"#2563eb", blueLight:"#3b82f6", blueDark:"#1d4ed8",
  green:"#16a34a", greenDark:"#14532d",
  text:"#0f172a", muted:"#64748b", soft:"#475569",
  danger:"#dc2626", warn:"#d97706", purple:"#7c3aed", purpleDark:"#5b21b6",
  orange:"#ea580c", teal:"#0d9488", pink:"#db2777",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;background:#f8fafc;}
  body{font-family:'Inter',sans-serif;color:#0f172a;}
  ::-webkit-scrollbar{width:5px;height:5px;}
  ::-webkit-scrollbar-thumb{background:#334155;border-radius:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::selection{background:#2563eb30;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
  @keyframes countUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes timerPulse{0%,100%{box-shadow:0 0 0 0 #dc262630}50%{box-shadow:0 0 0 8px #dc262600}}
  @keyframes testPass{0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)}}
  @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes glowPulse{0%,100%{box-shadow:0 0 20px #2563eb30}50%{box-shadow:0 0 40px #2563eb60}}
  .fade{animation:fadeUp .35s ease forwards;}
  .fadeIn{animation:fadeIn .25s ease forwards;}
  .slideIn{animation:slideIn .3s ease forwards;}
  .slideUp{animation:slideUp .5s ease forwards;}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  .float{animation:float 3s ease-in-out infinite;}
  .pass-anim{animation:testPass .4s ease;}
  input:focus,textarea:focus,select:focus{border-color:#2563eb!important;outline:none;box-shadow:0 0 0 3px #2563eb18;}
  button:active{transform:scale(.97);}
  .timer-warn{animation:timerPulse 1s infinite;}
  .sidebar-item{transition:all .18s;border-radius:10px;cursor:pointer;}
  .sidebar-item:hover{background:#1e293b;}
  .hover-card{transition:all .2s;cursor:pointer;}
  .hover-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,0.12);}
  .code-editor{font-family:'JetBrains Mono',monospace!important;font-size:13px!important;line-height:1.7!important;tab-size:2;}
  .test-case-row{transition:all .3s;}
  .glow-btn{animation:glowPulse 2s ease-in-out infinite;}
  @media(max-width:768px){
    .hide-mobile{display:none!important;}
    .mobile-full{width:100%!important;}
    .mobile-stack{flex-direction:column!important;}
    .mobile-pad{padding:16px!important;}
    .mobile-grid-1{grid-template-columns:1fr!important;}
    .mobile-grid-2{grid-template-columns:1fr 1fr!important;}
    .mobile-text-sm{font-size:13px!important;}
    .mobile-sidebar{width:56px!important;}
  }
`;

// ─── SHARED UI ──────────────────────────────────────────────────────────────
const inp = {
  width:"100%", background:"#ffffff", border:`1.5px solid ${C.border}`,
  borderRadius:10, padding:"11px 14px", color:C.text, fontSize:14,
  fontFamily:"'Inter',sans-serif", outline:"none", transition:"all .2s",
};

const inpDark = {
  width:"100%", background:"#1e293b", border:`1.5px solid #334155`,
  borderRadius:10, padding:"11px 14px", color:"#e2e8f0", fontSize:14,
  fontFamily:"'Inter',sans-serif", outline:"none", transition:"all .2s",
};

const Btn = ({ children, onClick, variant="primary", style={}, disabled=false, loading=false, size="md" }) => {
  const sizes = { sm:"8px 16px", md:"11px 22px", lg:"14px 32px" };
  const v = {
    primary:{ background:`linear-gradient(135deg,${C.blue},${C.blueLight})`, color:"#fff", fontWeight:700, boxShadow:"0 2px 8px "+C.blue+"40" },
    ghost:{ background:"transparent", color:C.soft, border:`1.5px solid ${C.border}` },
    green:{ background:`linear-gradient(135deg,${C.greenDark},${C.green})`, color:"#fff", fontWeight:700 },
    purple:{ background:`linear-gradient(135deg,${C.purpleDark},${C.purple})`, color:"#fff", fontWeight:700 },
    danger:{ background:`linear-gradient(135deg,#991b1b,${C.danger})`, color:"#fff", fontWeight:700 },
    teal:{ background:`linear-gradient(135deg,#0f766e,${C.teal})`, color:"#fff", fontWeight:700 },
    orange:{ background:`linear-gradient(135deg,#c2410c,${C.orange})`, color:"#fff", fontWeight:700 },
    cta:{ background:`linear-gradient(135deg,${C.blue},${C.blueDark})`, color:"#fff", fontWeight:800, boxShadow:"0 4px 20px "+C.blue+"50", fontSize:15 },
    dark:{ background:"#1e293b", color:"#fff", fontWeight:700 },
    outline:{ background:"transparent", color:C.blue, border:`2px solid ${C.blue}`, fontWeight:700 },
  };
  return (
    <button onClick={disabled||loading ? undefined : onClick} disabled={disabled||loading}
      style={{ padding:sizes[size]||sizes.md, borderRadius:10, border:"none", cursor:disabled||loading?"not-allowed":"pointer",
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

// ─── AI API ─────────────────────────────────────────────────────────────────
async function callAI(prompt, maxTokens=1500, mode="json", retries=3) {
  for (let attempt=0; attempt<=retries; attempt++) {
    try {
     const res = await fetch("/api/ai", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"llama-3.3-70b-versatile",
          max_tokens:maxTokens,
          messages:[{role:"user",content:prompt}]
        }),
      });
      if (!res.ok) throw new Error("AI error "+res.status);
      const data = await res.json();
      return data.content?.[0]?.text || "";
    } catch(e) {
      if (attempt<retries) { await new Promise(r=>setTimeout(r,1500*(attempt+1))); continue; }
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
      s.onload = res; s.onerror = rej; document.head.appendChild(s);
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
      s.onload=res; s.onerror=rej; document.head.appendChild(s);
    });
  }
  const ab = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({arrayBuffer:ab});
  return result.value.trim();
}

// ─── PDF/DOCX DOWNLOAD ───────────────────────────────────────────────────────
async function downloadPDF(resumeData, filename) {
  if (!window.jspdf) {
    await new Promise((res,rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W=210, ml=15, mr=15, cw=W-ml-mr; let y=18;
  const d=resumeData;
  doc.setFontSize(16); doc.setFont("helvetica","bold");
  doc.text(d.name||"", W/2, y, {align:"center"}); y+=6;
  doc.setFontSize(8.5); doc.setFont("helvetica","normal"); doc.setTextColor(60,60,60);
  const cp=[d.phone,d.email,d.linkedin,d.github,d.location].filter(Boolean);
  doc.text(cp.join(" | "), W/2, y, {align:"center"}); y+=7; doc.setTextColor(0,0,0);
  const sH=(t)=>{if(y>262){doc.addPage();y=15;}y+=1;doc.setFontSize(9.5);doc.setFont("helvetica","bold");doc.text(t.toUpperCase(),ml,y);y+=1.2;doc.setDrawColor(0,0,0);doc.setLineWidth(0.4);doc.line(ml,y,W-mr,y);y+=4;doc.setFont("helvetica","normal");doc.setFontSize(9);};
  const bul=(text,indent=4)=>{if(y>268){doc.addPage();y=15;}doc.text("•",ml+indent-2,y);const wr=doc.splitTextToSize(text,cw-indent-2);wr.forEach((wl,i)=>{if(y>268){doc.addPage();y=15;}doc.text(wl,ml+indent+1,y);if(i<wr.length-1)y+=4.3;});y+=4.6;};
  if(d.summary){sH("Professional Summary");const sw=doc.splitTextToSize(d.summary,cw);sw.forEach(sl=>{if(y>268){doc.addPage();y=15;}doc.text(sl,ml,y);y+=4.3;});y+=2;}
  if(d.education?.length){sH("Education");d.education.forEach(e=>{doc.setFont("helvetica","bold");doc.setFontSize(9);doc.text(e.school||"",ml,y);doc.setFont("helvetica","normal");doc.text(e.location||"",W-mr,y,{align:"right"});y+=4.3;doc.setFont("helvetica","italic");doc.text(e.degree||"",ml,y);doc.setFont("helvetica","normal");doc.text(e.dates||"",W-mr,y,{align:"right"});y+=5;});}
  if(d.experience?.length){sH("Experience");d.experience.forEach(ex=>{doc.setFont("helvetica","bold");doc.setFontSize(9);doc.text(ex.title||"",ml,y);doc.setFont("helvetica","normal");doc.text(ex.dates||"",W-mr,y,{align:"right"});y+=4.3;doc.setFont("helvetica","italic");doc.text(`${ex.company||""}${ex.location?", "+ex.location:""}`,ml,y);y+=4.3;doc.setFont("helvetica","normal");(ex.bullets||[]).forEach(b=>bul(b));y+=1;});}
  if(d.projects?.length){sH("Projects");d.projects.forEach(p=>{doc.setFont("helvetica","bold");doc.setFontSize(9);doc.text(p.name||"",ml,y);if(p.tech){const bW=doc.getTextWidth(p.name||"");doc.setFont("helvetica","italic");doc.text(` | ${p.tech}`,ml+bW,y);}if(p.dates){doc.setFont("helvetica","normal");doc.text(p.dates,W-mr,y,{align:"right"});}y+=4.3;doc.setFont("helvetica","normal");(p.bullets||[]).forEach(b=>bul(b));y+=1;});}
  if(d.skills?.length){sH("Technical Skills");d.skills.forEach(sk=>{doc.setFontSize(9);doc.setFont("helvetica","bold");doc.text(`${sk.category}: `,ml,y);const cW=doc.getTextWidth(`${sk.category}: `);doc.setFont("helvetica","normal");doc.text(doc.splitTextToSize(sk.items||"",cw-cW)[0]||"",ml+cW,y);y+=4.5;});}
  if(d.certifications?.length){sH("Certifications & Achievements");d.certifications.forEach(c=>bul(c));}
  doc.save(filename);
}

async function downloadDOCXJake(resumeData, filename) {
  if (!window.docx) {
    await new Promise((res,rej) => {
      const s=document.createElement("script");
      s.src="https://unpkg.com/docx@8.2.2/build/index.umd.js";
      s.onload=res; s.onerror=rej; document.head.appendChild(s);
    });
  }
  const {Document,Packer,Paragraph,TextRun,AlignmentType,BorderStyle}=window.docx;
  const d=resumeData; const ch=[];
  ch.push(new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:d.name||"",bold:true,size:28,font:"Calibri"})]}));
  const cp=[d.phone,d.email,d.linkedin,d.github,d.location].filter(Boolean);
  ch.push(new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:cp.join(" | "),size:18,font:"Calibri"})]}));
  ch.push(new Paragraph({children:[new TextRun({text:""})]}));
  const sP=(t)=>new Paragraph({children:[new TextRun({text:t.toUpperCase(),bold:true,size:20,font:"Calibri"})],border:{bottom:{color:"000000",space:1,style:BorderStyle.SINGLE,size:6}},spacing:{after:80}});
  const bP=(t)=>new Paragraph({bullet:{level:0},children:[new TextRun({text:t,size:18,font:"Calibri"})]});
  if(d.summary){ch.push(sP("Professional Summary"));ch.push(new Paragraph({children:[new TextRun({text:d.summary,size:18,font:"Calibri"})],spacing:{after:80}}));}
  if(d.education?.length){ch.push(sP("Education"));d.education.forEach(e=>{ch.push(new Paragraph({children:[new TextRun({text:e.school||"",bold:true,size:19,font:"Calibri"}),new TextRun({text:`\t${e.location||""}`,size:19,font:"Calibri"})]}));ch.push(new Paragraph({children:[new TextRun({text:e.degree||"",italics:true,size:18,font:"Calibri"}),new TextRun({text:`\t${e.dates||""}`,size:18,font:"Calibri"})],spacing:{after:80}}));}); }
  if(d.experience?.length){ch.push(sP("Experience"));d.experience.forEach(ex=>{ch.push(new Paragraph({children:[new TextRun({text:ex.title||"",bold:true,size:19,font:"Calibri"}),new TextRun({text:`\t${ex.dates||""}`,size:19,font:"Calibri"})]}));ch.push(new Paragraph({children:[new TextRun({text:`${ex.company||""}${ex.location?", "+ex.location:""}`,italics:true,size:18,font:"Calibri"})]})),(ex.bullets||[]).forEach(b=>ch.push(bP(b)));ch.push(new Paragraph({children:[new TextRun({text:""})]}));}); }
  if(d.projects?.length){ch.push(sP("Projects"));d.projects.forEach(p=>{ch.push(new Paragraph({children:[new TextRun({text:p.name||"",bold:true,size:19,font:"Calibri"}),p.tech?new TextRun({text:` | ${p.tech}`,italics:true,size:19,font:"Calibri"}):null,p.dates?new TextRun({text:`\t${p.dates}`,size:19,font:"Calibri"}):null].filter(Boolean)}));(p.bullets||[]).forEach(b=>ch.push(bP(b)));ch.push(new Paragraph({children:[new TextRun({text:""})]}));}); }
  if(d.skills?.length){ch.push(sP("Technical Skills"));d.skills.forEach(sk=>{ch.push(new Paragraph({children:[new TextRun({text:`${sk.category}: `,bold:true,size:18,font:"Calibri"}),new TextRun({text:sk.items||"",size:18,font:"Calibri"})]}));}); }
  if(d.certifications?.length){ch.push(sP("Certifications & Achievements"));d.certifications.forEach(c=>ch.push(bP(c)));}
  const doc=new Document({sections:[{properties:{page:{margin:{top:720,bottom:720,left:864,right:864}}},children:ch}]});
  const blob=await Packer.toBlob(doc);
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=filename; a.click();
}

// ══════════════════════════════════════════════════════════════════════════
// SCORE STORAGE (localStorage)
// ══════════════════════════════════════════════════════════════════════════
const ScoreDB = {
  key: (companyKey, mode, testNum) => `tp_score_${companyKey}_${mode}_test${testNum}`,
  save: (companyKey, mode, testNum, score, total) => {
    const entry = { score, total, pct: total>0?Math.round((score/total)*100):null, date: new Date().toISOString() };
    localStorage.setItem(ScoreDB.key(companyKey,mode,testNum), JSON.stringify(entry));
  },
  get: (companyKey, mode, testNum) => {
    const raw = localStorage.getItem(ScoreDB.key(companyKey,mode,testNum));
    return raw ? JSON.parse(raw) : null;
  },
  getStats: (companyKey, mode) => {
    const results = [];
    for (let i=1;i<=40;i++) {
      const r = ScoreDB.get(companyKey, mode, i);
      if (r) results.push({ testNum:i, ...r });
    }
    if (!results.length) return { completed:0, avg:null, best:null, totalTests:40 };
    const pcts = results.filter(r=>r.pct!==null).map(r=>r.pct);
    return {
      completed: results.length,
      avg: pcts.length ? Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length) : null,
      best: pcts.length ? Math.max(...pcts) : null,
      totalTests: 40,
    };
  },
};

// ══════════════════════════════════════════════════════════════════════════
// COMPANY DATA — 25 SERVICE + 20 PRODUCT
// ══════════════════════════════════════════════════════════════════════════
const SERVICE_COMPANIES = {
  tcs:        { name:"TCS", full:"TCS NQT", color:"#1d4ed8", emoji:"🏢", type:"service", desc:"NQT pattern. Foundation + Advanced. Numerical, Verbal, Reasoning, Coding.", aptFocus:["Numerical Ability","Verbal English","Logical Reasoning","Data Interpretation"], codingFocus:["Arrays","Strings","Pattern Programs","Basic DP","Sorting Algorithms"] },
  infosys:    { name:"Infosys", full:"Infosys InfyTQ", color:"#7c3aed", emoji:"🔷", type:"service", desc:"InfyTQ exam. Aptitude + Reasoning + Verbal + Power Programmer.", aptFocus:["Aptitude","Verbal","Reasoning","Puzzles"], codingFocus:["Java OOPs","Python","DSA Basics","SQL Queries"] },
  wipro:      { name:"Wipro", full:"Wipro NLTH", color:"#16a34a", emoji:"🌐", type:"service", desc:"NLTH pattern. Aptitude + Essay + Coding. No negative marking.", aptFocus:["Aptitude","Reasoning","Verbal","Essay Writing"], codingFocus:["C/C++","Python","LinkedList","Recursion"] },
  hcl:        { name:"HCL", full:"HCL TechBee", color:"#0284c7", emoji:"🔵", type:"service", desc:"TechBee hiring. Aptitude, Reasoning, Technical MCQs, Coding.", aptFocus:["Aptitude","Technical MCQ","Reasoning","OS/Networks"], codingFocus:["DBMS","OOPs Concepts","Basic Algorithms","SQL"] },
  cognizant:  { name:"Cognizant", full:"Cognizant GenC", color:"#ea580c", emoji:"🟠", type:"service", desc:"GenC / GenC Elevate. Aptitude + Coding + Communication.", aptFocus:["Aptitude","Reasoning","Communication","English"], codingFocus:["Python","Java","Pseudo Code","Problem Solving"] },
  accenture:  { name:"Accenture", full:"Accenture Hiring", color:"#a855f7", emoji:"💜", type:"service", desc:"4-section test: Aptitude, Critical Thinking, Coding + Communication.", aptFocus:["Aptitude","Critical Thinking","Communication","Cognitive Ability"], codingFocus:["Logic Building","Pseudo Code","Python Basics","SQL"] },
  capgemini:  { name:"Capgemini", full:"Capgemini Tech", color:"#0891b2", emoji:"🟦", type:"service", desc:"Pseudo Code + Behavioural + Game-Based + Technical.", aptFocus:["Pseudo Code","Behavioural","Technical MCQ","Aptitude"], codingFocus:["Pseudo Code","Java","Python","Algorithm Design"] },
  techmah:    { name:"Tech Mahindra", full:"TechMahindra", color:"#dc2626", emoji:"🔴", type:"service", desc:"Aptitude + Verbal + Technical + Coding round pattern.", aptFocus:["Aptitude","Verbal","Technical MCQ","Reasoning"], codingFocus:["C++","Java","DSA","String Manipulation"] },
  lti:        { name:"LTIMindtree", full:"LTIMindtree", color:"#059669", emoji:"🟩", type:"service", desc:"Aptitude, Reasoning, Verbal + Technical + Coding sections.", aptFocus:["Aptitude","Reasoning","Technical MCQ","Verbal"], codingFocus:["Java","Python","Arrays","Trees"] },
  mphasis:    { name:"Mphasis", full:"Mphasis Fresher", color:"#7c2d12", emoji:"🟤", type:"service", desc:"Quantitative + Reasoning + Verbal + Technical + Coding.", aptFocus:["Quantitative","Verbal","Technical","Logical"], codingFocus:["Java","DBMS","OOPs","REST APIs"] },
  hexaware:   { name:"Hexaware", full:"Hexaware PACE", color:"#0f766e", emoji:"🌊", type:"service", desc:"PACE program. Aptitude, Verbal, Reasoning, Technical, Coding.", aptFocus:["Aptitude","Verbal","Technical","Reasoning"], codingFocus:["Python","Java","DSA","SQL"] },
  persistent: { name:"Persistent", full:"Persistent Systems", color:"#1e40af", emoji:"💙", type:"service", desc:"Aptitude + Verbal + Coding. Java/Python/C++ preferred.", aptFocus:["Aptitude","Verbal","Problem Solving","Coding Logic"], codingFocus:["Java","Python","C++","Data Structures"] },
  birlasoft:  { name:"Birlasoft", full:"Birlasoft Fresher", color:"#92400e", emoji:"🟫", type:"service", desc:"Aptitude + Reasoning + Technical + Coding.", aptFocus:["Aptitude","Reasoning","Technical","General Knowledge"], codingFocus:["C","Java","OOPs","Algorithms"] },
  kpit:       { name:"KPIT", full:"KPIT Technologies", color:"#4338ca", emoji:"🚗", type:"service", desc:"Automotive tech. Aptitude + Technical + Embedded + Coding.", aptFocus:["Aptitude","Technical MCQ","Embedded Systems","Automotive"], codingFocus:["C Embedded","Python","CAN Protocols","Algorithms"] },
  zensar:     { name:"Zensar", full:"Zensar Technologies", color:"#0e7490", emoji:"⚡", type:"service", desc:"Aptitude + Reasoning + Technical + Coding round.", aptFocus:["Aptitude","Reasoning","Technical","Verbal"], codingFocus:["Java","Python","SQL","DSA Basics"] },
  cyient:     { name:"Cyient", full:"Cyient Technologies", color:"#6d28d9", emoji:"🛩️", type:"service", desc:"Engineering + IT. Aptitude + Technical + Coding.", aptFocus:["Aptitude","Technical","Engineering MCQ","Reasoning"], codingFocus:["Python","MATLAB","Algorithm Design","DSA"] },
  mindtree:   { name:"Mindtree", full:"Mindtree Hiring", color:"#065f46", emoji:"🌿", type:"service", desc:"Aptitude + Technical + Coding. Java/Python focused.", aptFocus:["Aptitude","Technical MCQ","Coding Logic","Verbal"], codingFocus:["Java","Python","OOPs","Data Structures"] },
  syntel:     { name:"Syntel", full:"Syntel Fresher", color:"#7f1d1d", emoji:"🔺", type:"service", desc:"Aptitude + Verbal + Coding + Communication round.", aptFocus:["Aptitude","Verbal","Communication","Reasoning"], codingFocus:["Java","Python","String Problems","Basic DSA"] },
  mastech:    { name:"Mastech Digital", full:"Mastech Hiring", color:"#134e4a", emoji:"🔶", type:"service", desc:"Aptitude + Reasoning + Technical + Coding.", aptFocus:["Aptitude","Reasoning","Technical","Verbal"], codingFocus:["Java","Python","SQL","Algorithms"] },
  niit:       { name:"NIIT Technologies", full:"NIIT Tech Hiring", color:"#1d4ed8", emoji:"📚", type:"service", desc:"Aptitude + Verbal + Reasoning + Technical + Coding.", aptFocus:["Aptitude","Verbal","Reasoning","Technical"], codingFocus:["Python","Java","DSA","Problem Solving"] },
  coforge:    { name:"Coforge", full:"Coforge Hiring", color:"#b45309", emoji:"🔸", type:"service", desc:"Aptitude + Technical + Coding. NIIT Technologies rebranded.", aptFocus:["Aptitude","Technical MCQ","Reasoning","Verbal"], codingFocus:["Java","Python","DSA","SQL"] },
  ltts:       { name:"L&T Technology", full:"LTTS Hiring", color:"#1e3a5f", emoji:"⚙️", type:"service", desc:"Engineering services. Aptitude + Technical + Coding.", aptFocus:["Aptitude","Engineering MCQ","Technical","Reasoning"], codingFocus:["C++","Python","Embedded C","Algorithms"] },
  minda:      { name:"Minda Industries", full:"Minda Tech", color:"#713f12", emoji:"🏭", type:"service", desc:"Automotive/Manufacturing IT. Aptitude + Technical + Coding.", aptFocus:["Aptitude","Technical MCQ","Reasoning","Manufacturing"], codingFocus:["C","Python","OOPs","Basic Algorithms"] },
  oracle_fs:  { name:"Oracle FS", full:"Oracle Financial", color:"#cc0000", emoji:"💹", type:"service", desc:"Banking tech. Aptitude + BFSI Domain + Coding.", aptFocus:["Aptitude","BFSI Domain","Reasoning","Verbal"], codingFocus:["Java","PL/SQL","Oracle DB","Algorithms"] },
  dxc:        { name:"DXC Technology", full:"DXC Technology", color:"#6b21a8", emoji:"🔮", type:"service", desc:"IT services. Aptitude + Technical + Coding.", aptFocus:["Aptitude","Technical MCQ","Reasoning","Communication"], codingFocus:["Java","Python","DSA","Cloud Basics"] },
};

const PRODUCT_COMPANIES = {
  amazon:     { name:"Amazon", full:"Amazon SDE OA", color:"#d97706", emoji:"📦", type:"product", desc:"OA: 2 DSA + Work Simulation + 16 Leadership Principles.", aptFocus:["Work Simulation","Leadership Principles","Problem Solving","Logical Reasoning"], codingFocus:["Arrays","Hash Maps","Two Pointers","BFS/DFS","DP","Linked Lists"] },
  microsoft:  { name:"Microsoft", full:"Microsoft SDE", color:"#0284c7", emoji:"🪟", type:"product", desc:"DSA rounds + System Design + Behavioral. FAANG level.", aptFocus:["System Design MCQ","CS Fundamentals","Behavioral","Debugging"], codingFocus:["Trees","Graphs","DP","Backtracking","System Design LLD"] },
  google:     { name:"Google", full:"Google SWE", color:"#dc2626", emoji:"🔍", type:"product", desc:"Coding interviews: Graphs, DP, optimization. Multiple rounds.", aptFocus:["Algorithmic Thinking","Math Puzzles","System Design","CS Theory"], codingFocus:["Graphs","DP","Segment Trees","Tries","Advanced DSA"] },
  flipkart:   { name:"Flipkart", full:"Flipkart SDE", color:"#f59e0b", emoji:"🛒", type:"product", desc:"OA: DSA + Technical + Product Thinking. Indian FAANG.", aptFocus:["Product Sense","Technical MCQ","System Design","Reasoning"], codingFocus:["Arrays","Trees","DP","SQL","System Design"] },
  zomato:     { name:"Zomato", full:"Zomato SDE", color:"#ef4444", emoji:"🍕", type:"product", desc:"DSA + Product Sense + Case Studies. Fast-paced startup.", aptFocus:["Product Sense","Case Study","SQL/Data","Reasoning"], codingFocus:["Geospatial Algorithms","SQL","Python","DSA Medium"] },
  razorpay:   { name:"Razorpay", full:"Razorpay SDE", color:"#3b82f6", emoji:"💳", type:"product", desc:"Fintech focus. DSA + System Design + Payments domain.", aptFocus:["Fintech MCQ","System Design","Behavioral","Payments Domain"], codingFocus:["DSA Medium-Hard","Payment APIs","Java/Go","Distributed Systems"] },
  phonepe:    { name:"PhonePe", full:"PhonePe SDE", color:"#7c3aed", emoji:"📱", type:"product", desc:"DSA + Backend Design + Payments/UPI domain.", aptFocus:["Payments Domain","Backend Design","Behavioral","System Design"], codingFocus:["Java Spring","DSA","UPI Flows","Microservices"] },
  paytm:      { name:"Paytm", full:"Paytm Tech", color:"#1d4ed8", emoji:"💰", type:"product", desc:"DSA + Technical MCQ + Fintech domain + System Design.", aptFocus:["Technical MCQ","Fintech","System Design","Reasoning"], codingFocus:["Java","Python","DSA","Payment Systems"] },
  swiggy:     { name:"Swiggy", full:"Swiggy SDE", color:"#f97316", emoji:"🛵", type:"product", desc:"DSA + System Design (delivery systems) + Behavioral.", aptFocus:["System Design","Behavioral","Product Thinking","Logistics"], codingFocus:["Graph Algorithms","Routing","DSA","Optimization"] },
  meesho:     { name:"Meesho", full:"Meesho SDE", color:"#ec4899", emoji:"🛍️", type:"product", desc:"DSA + Product Sense + E-commerce domain + Behavioral.", aptFocus:["Product Sense","E-commerce Domain","Behavioral","Reasoning"], codingFocus:["Python","DSA","SQL","Recommendation Systems"] },
  cred:       { name:"CRED", full:"CRED Tech", color:"#1e293b", emoji:"💎", type:"product", desc:"DSA + Product Thinking + Design + Fintech/Lending.", aptFocus:["Product Design","Fintech","System Design","Behavioral"], codingFocus:["DSA Hard","Android/iOS","System Design","Data Pipelines"] },
  atlassian:  { name:"Atlassian", full:"Atlassian SDE", color:"#0052cc", emoji:"🔧", type:"product", desc:"Coding + System Design + Values (Open Company, No Bullshit).", aptFocus:["System Design","Values/Behavioral","Technical MCQ","CS Fundamentals"], codingFocus:["Java","Python","DSA","Distributed Systems"] },
  adobe:      { name:"Adobe", full:"Adobe SDE", color:"#ff0000", emoji:"🎨", type:"product", desc:"DSA + Creative tech + Machine Learning basics + System Design.", aptFocus:["ML/AI MCQ","System Design","Behavioral","Creative Tech"], codingFocus:["DSA","Computer Vision basics","Python/C++","System Design"] },
  salesforce: { name:"Salesforce", full:"Salesforce SDE", color:"#00a1e0", emoji:"☁️", type:"product", desc:"DSA + Salesforce Platform + Apex/SOQL + Behavioral.", aptFocus:["Salesforce Platform","Technical MCQ","Behavioral","Cloud Computing"], codingFocus:["Apex","SOQL","Java","DSA Medium"] },
  uber:       { name:"Uber", full:"Uber SDE", color:"#000000", emoji:"🚘", type:"product", desc:"DSA + Maps/Routing algorithms + System Design + Behavioral.", aptFocus:["Maps/Graph Algorithms","System Design","Behavioral","Optimization"], codingFocus:["Graph Algorithms","Geo Algorithms","DSA Hard","Distributed Systems"] },
  walmart:    { name:"Walmart", full:"Walmart Labs SDE", color:"#0071ce", emoji:"🛒", type:"product", desc:"DSA + System Design + Retail domain + Behavioral.", aptFocus:["System Design","Retail Domain","Behavioral","Technical MCQ"], codingFocus:["Java","Python","DSA","Large Scale Systems"] },
  ola:        { name:"Ola", full:"Ola Cabs SDE", color:"#00b140", emoji:"🚕", type:"product", desc:"DSA + Maps/GPS algorithms + System Design.", aptFocus:["Maps Domain","System Design","Behavioral","Product Thinking"], codingFocus:["Graph/Geo Algorithms","DSA","Python","Microservices"] },
  byju:       { name:"BYJU'S", full:"BYJU'S Tech", color:"#6d28d9", emoji:"📖", type:"product", desc:"DSA + EdTech domain + System Design + Product Thinking.", aptFocus:["EdTech Domain","Product Thinking","System Design","Behavioral"], codingFocus:["Python","Java","DSA Medium","Recommendation Engines"] },
  freshworks:  { name:"Freshworks", full:"Freshworks SDE", color:"#00b98e", emoji:"🌱", type:"product", desc:"DSA + SaaS platform + System Design + Behavioral.", aptFocus:["SaaS Domain","System Design","Behavioral","Technical MCQ"], codingFocus:["Ruby/Java/Python","DSA","REST APIs","Microservices"] },
  browserstack:{ name:"BrowserStack", full:"BrowserStack SDE", color:"#e8501e", emoji:"🌐", type:"product", desc:"DSA + Cloud testing + System Design + Behavioral.", aptFocus:["Cloud Testing","System Design","Behavioral","Technical MCQ"], codingFocus:["Java","Python","DSA","Selenium/Testing"] },
};

const ALL_COMPANIES = { ...SERVICE_COMPANIES, ...PRODUCT_COMPANIES };

// ══════════════════════════════════════════════════════════════════════════
// CODE RUNNER
// ══════════════════════════════════════════════════════════════════════════
function runCode(userCode, testCases) {
  const results = [];
  for (const tc of testCases) {
    try {
      const fn = new Function("input", `
        ${userCode}
        const fns = typeof solution!=='undefined'?solution:typeof solve!=='undefined'?solve:typeof main!=='undefined'?main:null;
        if(typeof solution==='function') return String(solution(input));
        if(typeof solve==='function') return String(solve(input));
        if(typeof main==='function') return String(main(input));
        return 'No function found';
      `);
      const output = String(fn(tc.input)).trim();
      const expected = String(tc.output).trim();
      results.push({ input:tc.input, expected, got:output, pass: output===expected });
    } catch (e) {
      results.push({ input:tc.input, expected:String(tc.output).trim(), got:null, error:e.message, pass:false });
    }
  }
  return results;
}

// ══════════════════════════════════════════════════════════════════════════
// MOCK TEST ENGINE — APTITUDE & CODING SEPARATE
// ══════════════════════════════════════════════════════════════════════════
function MockTestEngine({ user }) {
  const [view, setView] = useState("home");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [testMode, setTestMode] = useState(null); // "aptitude" | "coding"
  const [selectedTestNum, setSelectedTestNum] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [codeResults, setCodeResults] = useState({});
  const [runningCode, setRunningCode] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [companyTab, setCompanyTab] = useState("service");
  const [testScores, setTestScores] = useState({});
  const timerRef = useRef(null);

  const trackActivity = async (action, details="") => {
    try { if(!user?.id) return; await supabase.from("user_activity").insert({user_id:user.id,email:user.email,action,details}); } catch(_) {}
  };

  const loadCompanyScores = useCallback((companyKey, mode) => {
    const scores = {};
    for (let i=1;i<=40;i++) {
      const s = ScoreDB.get(companyKey, mode, i);
      if (s) scores[i] = s;
    }
    setTestScores(scores);
  }, []);

  const generateAptitudeQuestions = async (companyKey, testNum) => {
    const c = ALL_COMPANIES[companyKey];
    const topicRotation = c.aptFocus[testNum % c.aptFocus.length];
    const prompt = `Generate exactly 20 high-quality ${c.full} aptitude/MCQ questions for Test #${testNum}.
Primary Topic Focus: ${topicRotation}
Company Type: ${c.type}
All topics to cover: ${c.aptFocus.join(", ")}

Generate a mix: 6 quantitative, 5 verbal/reasoning, 5 logical, 4 technical MCQ questions.
Vary difficulty: 40% easy, 40% medium, 20% hard.

Return ONLY valid JSON array (no extra text):
[{"id":"a${testNum}_1","type":"mcq","question":"Full question text here","options":["A option","B option","C option","D option"],"correct":0,"explanation":"Why A is correct","topic":"${topicRotation}","difficulty":"Easy"}]

IMPORTANT: correct field is 0-indexed (0=A,1=B,2=C,3=D). Generate all 20 questions.`;
    const raw = await callAI(prompt, 3500, "json");
    const qs = safeJSON(raw, []);
    if (!Array.isArray(qs) || qs.length < 5) throw new Error("Failed to generate aptitude questions. Please retry.");
    return qs.slice(0,20);
  };

  const generateCodingQuestions = async (companyKey, testNum) => {
    const c = ALL_COMPANIES[companyKey];
    const topicRotation = c.codingFocus[testNum % c.codingFocus.length];
    const isProduct = c.type === "product";
    const prompt = `Generate exactly 5 coding problems for ${c.full} Test #${testNum}.
Primary Topic: ${topicRotation}
Difficulty: ${isProduct?"Medium to Hard (LeetCode Medium-Hard)":"Easy to Medium (campus hiring level)"}
Topics pool: ${c.codingFocus.join(", ")}

CRITICAL RULES:
1. Each problem needs exactly 4 test cases with simple inputs/outputs
2. Function signature: function solution(input) - input is a number, string, or JSON string
3. Test cases must be verifiable programmatically (exact string match)
4. Include working solution approach

Return ONLY valid JSON array:
[{
  "id":"c${testNum}_1",
  "type":"coding",
  "title":"Problem Title",
  "difficulty":"Medium",
  "topic":"${topicRotation}",
  "description":"Clear problem statement. If input is array/object, it will be passed as JSON string - use JSON.parse(input).",
  "functionSignature":"function solution(input) { // Parse: const n = typeof input==='string' ? JSON.parse(input) : input; }",
  "examples":[{"input":"5","output":"25","explanation":"5 squared is 25"}],
  "testCases":[{"input":"5","output":"25"},{"input":"3","output":"9"},{"input":"10","output":"100"},{"input":"0","output":"0"}],
  "hint":"Key insight to solve this",
  "solution_approach":"Step by step approach description",
  "time_complexity":"O(n)"
}]`;
    const raw = await callAI(prompt, 3000, "json");
    const qs = safeJSON(raw, []);
    if (!Array.isArray(qs) || qs.length < 1) throw new Error("Failed to generate coding questions. Please retry.");
    return qs.slice(0,5);
  };

  const startTest = async (companyKey, mode, testNum) => {
    setLoading(true); setErr("");
    setSelectedCompany(companyKey);
    setTestMode(mode);
    setSelectedTestNum(testNum);
    try {
      let qs;
      if (mode === "aptitude") {
        qs = await generateAptitudeQuestions(companyKey, testNum);
        setTimeLeft(30 * 60); // 30 min for aptitude
      } else {
        qs = await generateCodingQuestions(companyKey, testNum);
        setTimeLeft(60 * 60); // 60 min for coding
      }
      setQuestions(qs);
      setAnswers({});
      setCodeResults({});
      setCurrentQ(0);
      setView("test");
      trackActivity("mock_test_started", `${companyKey}_${mode}_test${testNum}`);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  useEffect(() => {
    if (view !== "test") return;
    clearInterval(timerRef.current);
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
    const pct = total > 0 ? Math.round((correct/total)*100) : null;
    ScoreDB.save(selectedCompany, testMode, selectedTestNum, correct, total);
    setResult({ correct, total, pct, attempted:Object.keys(answers).length, questions });
    setView("result");
    loadCompanyScores(selectedCompany, testMode);
    trackActivity("mock_test_done", `${selectedCompany}_${testMode}_test${selectedTestNum}_score:${pct}%`);
  };

  const handleRunCode = (q) => {
    if (!q.testCases?.length) return;
    const code = answers[q.id] || "";
    if (!code.trim()) { setCodeResults(r=>({...r,[q.id]:{error:"Write your code first",results:[]}})); return; }
    setRunningCode(r=>({...r,[q.id]:true}));
    setTimeout(() => {
      const results = runCode(code, q.testCases);
      setCodeResults(r=>({...r,[q.id]:{results}}));
      setRunningCode(r=>({...r,[q.id]:false}));
    }, 300);
  };

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const compInfo = selectedCompany ? ALL_COMPANIES[selectedCompany] : null;
  const isMobile = window.innerWidth < 768;

  // ── HOME ────────────────────────────────────────────────────────────────
  if (view === "home") return (
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:900,fontSize:isMobile?20:24,color:C.text,marginBottom:4}}>🧪 Mock Test Engine</div>
        <div style={{color:C.muted,fontSize:13}}>45 companies · 40 tests each · Aptitude & Coding separate · Score tracking</div>
      </div>
      {err && <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",marginBottom:16,color:C.danger,fontSize:13}}>⚠ {err} <button onClick={()=>setErr("")} style={{marginLeft:8,background:"none",border:"none",cursor:"pointer",color:C.muted}}>✕</button></div>}

      <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
        {[["service","🏢 Service Based (25)"],["product","🚀 Product Based (20)"]].map(([t,l])=>(
          <button key={t} onClick={()=>setCompanyTab(t)}
            style={{padding:"10px 20px",borderRadius:12,border:`1.5px solid ${companyTab===t?C.blue:C.border}`,background:companyTab===t?`${C.blue}10`:"#fff",color:companyTab===t?C.blue:C.muted,fontFamily:"'Inter',sans-serif",fontWeight:companyTab===t?700:400,fontSize:14,cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}}>
            {l}
          </button>
        ))}
      </div>

      <div style={{background:"linear-gradient(135deg,#eff6ff,#f0fdf4)",border:`1px solid ${C.blue}20`,borderRadius:16,padding:"14px 18px",marginBottom:20}}>
        <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:8}}>📌 How it works</div>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          {[["📊","Aptitude Mode","20 MCQs · 30 min · Quant, Verbal, Reasoning, Technical"],["💻","Coding Mode","5 Problems · 60 min · DSA with live code runner"]].map(([e,t,d])=>(
            <div key={t} style={{display:"flex",gap:8,alignItems:"flex-start",flex:1,minWidth:200}}>
              <span style={{fontSize:20}}>{e}</span>
              <div><div style={{fontWeight:700,fontSize:13,color:C.text}}>{t}</div><div style={{fontSize:11,color:C.muted}}>{d}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
        {Object.entries(companyTab==="service"?SERVICE_COMPANIES:PRODUCT_COMPANIES).map(([key,c])=>{
          const aptStats = ScoreDB.getStats(key, "aptitude");
          const codeStats = ScoreDB.getStats(key, "coding");
          const totalDone = aptStats.completed + codeStats.completed;
          return (
            <div key={key} className="hover-card"
              onClick={()=>{ setSelectedCompany(key); setTestMode(null); loadCompanyScores(key,"aptitude"); setView("company"); }}
              style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:18,borderTop:`3px solid ${c.color}`,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:24}}>{c.emoji}</span>
                <div>
                  <div style={{fontWeight:800,fontSize:14,color:C.text}}>{c.full}</div>
                  <div style={{fontSize:10,color:C.muted}}>{c.type==="service"?"Service":"Product"} Based</div>
                </div>
              </div>
              <div style={{color:C.soft,fontSize:11,lineHeight:1.6,marginBottom:10}}>{c.desc}</div>
              <div style={{display:"flex",gap:6,marginBottom:8}}>
                <div style={{flex:1,background:aptStats.completed>0?"#eff6ff":"#f8fafc",borderRadius:8,padding:"6px 8px",border:`1px solid ${aptStats.completed>0?C.blue+"30":C.border}`}}>
                  <div style={{fontSize:10,color:C.muted,marginBottom:2}}>📊 Aptitude</div>
                  <div style={{fontWeight:700,fontSize:12,color:C.blue}}>{aptStats.completed}/40</div>
                  {aptStats.best!=null&&<div style={{fontSize:10,color:C.green}}>Best: {aptStats.best}%</div>}
                </div>
                <div style={{flex:1,background:codeStats.completed>0?"#f0fdf4":"#f8fafc",borderRadius:8,padding:"6px 8px",border:`1px solid ${codeStats.completed>0?C.green+"30":C.border}`}}>
                  <div style={{fontSize:10,color:C.muted,marginBottom:2}}>💻 Coding</div>
                  <div style={{fontWeight:700,fontSize:12,color:C.green}}>{codeStats.completed}/40</div>
                  {codeStats.best!=null&&<div style={{fontSize:10,color:C.green}}>Best: {codeStats.best}%</div>}
                </div>
              </div>
              <div style={{background:"#e2e8f0",borderRadius:4,height:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(totalDone/80)*100}%`,background:c.color,borderRadius:4,transition:"width .5s"}}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── COMPANY VIEW ─────────────────────────────────────────────────────────
  if (view === "company" && compInfo) {
    const aptStats = ScoreDB.getStats(selectedCompany, "aptitude");
    const codeStats = ScoreDB.getStats(selectedCompany, "coding");
    const activeMode = testMode || "aptitude";
    const activeStats = activeMode==="aptitude"?aptStats:codeStats;
    const activeScores = {};
    for(let i=1;i<=40;i++){const s=ScoreDB.get(selectedCompany,activeMode,i);if(s)activeScores[i]=s;}

    return (
      <div>
        <button onClick={()=>setView("home")} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif",marginBottom:20,display:"flex",alignItems:"center",gap:6}}>← Back to Companies</button>

        <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:20,padding:20,marginBottom:16,borderTop:`4px solid ${compInfo.color}`}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
            <span style={{fontSize:36}}>{compInfo.emoji}</span>
            <div>
              <div style={{fontWeight:900,fontSize:isMobile?18:22,color:C.text}}>{compInfo.full}</div>
              <div style={{color:C.muted,fontSize:12,marginTop:2}}>{compInfo.desc}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
            {[
              {label:"Apt Done",val:`${aptStats.completed}/40`,color:C.blue},
              {label:"Apt Best",val:aptStats.best!=null?`${aptStats.best}%`:"—",color:C.green},
              {label:"Code Done",val:`${codeStats.completed}/40`,color:C.purple},
              {label:"Code Best",val:codeStats.best!=null?`${codeStats.best}%`:"—",color:C.orange},
            ].map((s,i)=>(
              <div key={i} style={{background:C.bg,borderRadius:10,padding:"10px 8px",textAlign:"center",border:`1px solid ${C.border}`}}>
                <div style={{fontWeight:900,fontSize:isMobile?14:18,color:s.color}}>{s.val}</div>
                <div style={{fontSize:10,color:C.muted}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mode Selector */}
        <div style={{display:"flex",gap:10,marginBottom:16}}>
          {[
            {mode:"aptitude",icon:"📊",label:"Aptitude Tests",desc:"20 MCQs · 30 min",color:C.blue,stats:aptStats},
            {mode:"coding",icon:"💻",label:"Coding Tests",desc:"5 Problems · 60 min",color:C.green,stats:codeStats},
          ].map(m=>(
            <button key={m.mode} onClick={()=>{setTestMode(m.mode);loadCompanyScores(selectedCompany,m.mode);}}
              style={{flex:1,padding:"14px",borderRadius:14,border:`2px solid ${activeMode===m.mode?m.color:C.border}`,background:activeMode===m.mode?`${m.color}08`:"#fff",cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .2s",textAlign:"left"}}>
              <div style={{fontSize:22,marginBottom:4}}>{m.icon}</div>
              <div style={{fontWeight:700,fontSize:14,color:C.text}}>{m.label}</div>
              <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{m.desc}</div>
              <div style={{fontSize:12,fontWeight:700,color:m.color}}>{m.stats.completed}/40 done {m.stats.best!=null?`· Best: ${m.stats.best}%`:""}</div>
            </button>
          ))}
        </div>

        {err && <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",marginBottom:16,color:C.danger,fontSize:13}}>⚠ {err}</div>}

        <div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:12}}>
          {activeMode==="aptitude"?"📊":"💻"} Select Test (1–40) — {activeMode==="aptitude"?"Aptitude":"Coding"} Mode
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
          {Array.from({length:40},(_,i)=>{
            const tNum=i+1;
            const score=activeScores[tNum];
            const pct=score?.pct;
            const done=!!score;
            const bg=done?(pct>=70?"#f0fdf4":pct>=40?"#fffbeb":"#fef2f2"):"#fff";
            const bd=done?(pct>=70?C.green:pct>=40?C.warn:C.danger):C.border;
            const tc=done?(pct>=70?C.green:pct>=40?C.warn:C.danger):C.text;
            return (
              <div key={tNum} className="hover-card"
                onClick={()=>!loading&&startTest(selectedCompany,activeMode,tNum)}
                style={{background:bg,border:`1.5px solid ${bd}`,borderRadius:12,padding:"12px 6px",textAlign:"center",cursor:loading?"not-allowed":"pointer",opacity:loading&&selectedTestNum===tNum?0.6:1}}>
                <div style={{fontWeight:700,fontSize:13,color:C.text}}>Test {tNum}</div>
                {done ? <div style={{fontWeight:900,fontSize:16,color:tc}}>{pct!=null?`${pct}%`:"✅"}</div>
                      : <div style={{fontSize:10,color:C.muted,marginTop:2}}>Start</div>}
                {loading && selectedTestNum===tNum && <SpinIcon size={12} color={compInfo.color}/>}
              </div>
            );
          })}
        </div>

        <div style={{marginTop:16,background:"#f8f9fc",border:`1px solid ${C.border}`,borderRadius:12,padding:14}}>
          <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:8}}>
            💡 {compInfo.full} — {activeMode==="aptitude"?"Aptitude":"Coding"} Focus Topics
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {(activeMode==="aptitude"?compInfo.aptFocus:compInfo.codingFocus).map((f,i)=>(
              <Tag key={i} color={compInfo.color}>{f}</Tag>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING ─────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{textAlign:"center",padding:"60px 20px"}}>
      <div style={{fontSize:48,marginBottom:14,animation:"float 2s ease-in-out infinite"}}>{compInfo?.emoji||"⏳"}</div>
      <div style={{fontWeight:800,fontSize:18,color:C.text,marginBottom:6}}>Generating {testMode==="aptitude"?"Aptitude":"Coding"} Test #{selectedTestNum}</div>
      <div style={{color:C.muted,fontSize:13,marginBottom:20,lineHeight:1.8}}>Creating {ALL_COMPANIES[selectedCompany]?.full} questions...<br/>AI generating {testMode==="aptitude"?"20 MCQ":"5 coding"} questions...</div>
      <SpinIcon size={36} color={compInfo?.color||C.blue}/>
    </div>
  );

  // ── TEST VIEW ────────────────────────────────────────────────────────────
  if (view === "test") {
    const q = questions[currentQ];
    if (!q) return null;
    const progress = ((currentQ+1)/questions.length)*100;
    const isWarn = timeLeft < 120;
    const codeRes = q?.id ? codeResults[q.id] : null;
    const allPass = codeRes?.results?.every(r=>r.pass);

    return (
      <div>
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontWeight:800,color:C.text,fontSize:14}}>{compInfo.full} — {testMode==="aptitude"?"📊 Aptitude":"💻 Coding"} Test #{selectedTestNum}</div>
            <div style={{fontSize:11,color:C.muted}}>Q{currentQ+1}/{questions.length}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div className={isWarn?"timer-warn":""} style={{background:isWarn?"#fef2f2":"#f0fdf4",border:`1.5px solid ${isWarn?"#fecaca":"#bbf7d0"}`,borderRadius:10,padding:"7px 14px",fontWeight:800,fontSize:16,color:isWarn?C.danger:C.green,fontFamily:"'JetBrains Mono',monospace"}}>
              ⏱ {formatTime(timeLeft)}
            </div>
            <Btn variant="danger" size="sm" onClick={submitTest}>Submit</Btn>
          </div>
        </div>

        <div style={{background:"#e2e8f0",borderRadius:4,height:4,marginBottom:16,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${compInfo.color},${C.purple})`,borderRadius:4,transition:"width .3s"}}/>
        </div>

        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:isMobile?16:22,marginBottom:14}}>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
            <Tag color={compInfo.color}>Q{currentQ+1}</Tag>
            {q.difficulty && <Tag color={q.difficulty==="Easy"?C.green:q.difficulty==="Hard"?C.danger:C.warn}>{q.difficulty}</Tag>}
            {q.topic && <Tag color={C.purple}>{q.topic}</Tag>}
          </div>

          {q.type==="mcq" && (
            <div>
              <div style={{fontWeight:600,fontSize:15,color:C.text,lineHeight:1.9,marginBottom:18}}>{q.question}</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {(q.options||[]).map((opt,i)=>{
                  const sel = answers[q.id]===i;
                  return (
                    <button key={i} onClick={()=>setAnswers(a=>({...a,[q.id]:i}))}
                      style={{textAlign:"left",padding:"12px 14px",borderRadius:10,border:`1.5px solid ${sel?compInfo.color:C.border}`,background:sel?`${compInfo.color}08`:"#fff",color:C.text,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>
                      <span style={{fontWeight:700,color:sel?compInfo.color:C.muted,marginRight:10}}>{String.fromCharCode(65+i)}.</span>{opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {q.type==="coding" && (
            <div>
              <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:8}}>{q.title}</div>
              <div style={{color:C.soft,fontSize:13,lineHeight:1.9,marginBottom:12,background:C.bg,borderRadius:10,padding:14}}>{q.description}</div>
              {q.examples?.length>0 && (
                <div style={{marginBottom:14}}>
                  <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:6}}>Examples:</div>
                  {q.examples.map((ex,i)=>(
                    <div key={i} style={{background:"#0f172a",borderRadius:8,padding:12,marginBottom:6,fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>
                      <div style={{color:"#94a3b8"}}>Input: <span style={{color:"#86efac"}}>{ex.input}</span></div>
                      <div style={{color:"#94a3b8"}}>Output: <span style={{color:"#7dd3fc"}}>{ex.output}</span></div>
                      {ex.explanation&&<div style={{color:"#64748b"}}>// {ex.explanation}</div>}
                    </div>
                  ))}
                </div>
              )}
              {q.hint && <div style={{background:"#fffbeb",border:"1px solid #fef08a",borderRadius:8,padding:10,fontSize:12,color:"#92400e",marginBottom:12}}>💡 {q.hint}</div>}
              {q.functionSignature && (
                <div style={{background:"#0f172a",borderRadius:8,padding:10,marginBottom:8,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#64748b"}}>
                  // Starter: <span style={{color:"#7dd3fc"}}>{q.functionSignature}</span>
                </div>
              )}
              <textarea className="code-editor" value={answers[q.id]||""} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))}
                placeholder={"function solution(input) {\n  // your code here\n  return result;\n}"}
                style={{...inp,minHeight:200,fontFamily:"'JetBrains Mono',monospace",fontSize:13,background:"#0f172a",color:"#e2e8f0",border:"1.5px solid #334155",lineHeight:1.7,resize:"vertical"}}
                onKeyDown={e=>{ if(e.key==="Tab"){e.preventDefault();const s=e.target.selectionStart;const v=e.target.value;setAnswers(a=>({...a,[q.id]:v.substring(0,s)+"  "+v.substring(e.target.selectionEnd)}));setTimeout(()=>{e.target.selectionStart=e.target.selectionEnd=s+2;},0);}}}
              />
              <div style={{marginTop:10,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <Btn variant="teal" loading={runningCode[q.id]} onClick={()=>handleRunCode(q)}>▶ Run Code</Btn>
                {codeRes?.results && <div style={{fontWeight:700,fontSize:13,color:allPass?C.green:C.danger}}>{allPass?`✅ All ${codeRes.results.length} passed!`:`❌ ${codeRes.results.filter(r=>r.pass).length}/${codeRes.results.length} passed`}</div>}
                {codeRes?.error && <div style={{color:C.danger,fontSize:12}}>⚠ {codeRes.error}</div>}
              </div>
              {q.testCases?.length>0 && (
                <div style={{marginTop:12}}>
                  {q.testCases.map((tc,i)=>{
                    const res=codeRes?.results?.[i];
                    const hasRun=!!codeRes;
                    const pass=res?.pass;
                    return (
                      <div key={i} style={{background:!hasRun?"#f8f9fc":pass?"#f0fdf4":"#fef2f2",border:`1.5px solid ${!hasRun?C.border:pass?C.green:C.danger}`,borderRadius:10,padding:"10px 12px",marginBottom:6}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                          <span style={{fontWeight:700,fontSize:12,color:C.text}}>Test {i+1}</span>
                          {hasRun&&<span style={{fontWeight:800,fontSize:12,color:pass?C.green:C.danger}}>{pass?"✅ PASS":"❌ FAIL"}</span>}
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                          <div>
                            <div style={{fontSize:10,color:C.muted,marginBottom:3}}>INPUT</div>
                            <div style={{background:"#0f172a",borderRadius:6,padding:"6px 10px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#86efac"}}>{String(tc.input)}</div>
                          </div>
                          <div>
                            <div style={{fontSize:10,color:C.muted,marginBottom:3}}>EXPECTED</div>
                            <div style={{background:"#0f172a",borderRadius:6,padding:"6px 10px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#7dd3fc"}}>{String(tc.output)}</div>
                          </div>
                        </div>
                        {hasRun&&!pass&&res&&<div style={{marginTop:6}}><div style={{fontSize:10,color:C.muted,marginBottom:3}}>YOUR OUTPUT</div><div style={{background:"#0f172a",borderRadius:6,padding:"6px 10px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:res.error?"#f87171":"#fbbf24"}}>{res.error?`Error: ${res.error}`:String(res.got)}</div></div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <Btn variant="ghost" onClick={()=>setCurrentQ(q=>Math.max(0,q-1))} disabled={currentQ===0}>← Prev</Btn>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center"}}>
            {questions.map((_,i)=>{
              const qs2=questions[i];const ans=answers[qs2?.id];const done=ans!==undefined||(qs2?.type==="coding"&&codeResults[qs2?.id]);
              return <button key={i} onClick={()=>setCurrentQ(i)} style={{width:26,height:26,borderRadius:6,border:`1.5px solid ${i===currentQ?compInfo.color:done?C.green:C.border}`,background:i===currentQ?`${compInfo.color}15`:done?`${C.green}10`:"#fff",color:i===currentQ?compInfo.color:C.muted,cursor:"pointer",fontWeight:700,fontSize:11}}>{i+1}</button>;
            })}
          </div>
          {currentQ<questions.length-1
            ? <Btn variant="cta" onClick={()=>setCurrentQ(q=>q+1)} style={{background:`linear-gradient(135deg,${compInfo.color},${compInfo.color}cc)`}}>Next →</Btn>
            : <Btn variant="green" onClick={submitTest}>Submit ✓</Btn>
          }
        </div>
      </div>
    );
  }

  // ── RESULT VIEW ─────────────────────────────────────────────────────────
  if (view==="result" && result) {
    const hasMCQ=result.total>0;
    const grade=hasMCQ?(result.pct>=80?"Excellent 🏆":result.pct>=60?"Good 👍":result.pct>=40?"Average 📈":"Needs Work 💪"):"Completed ✅";
    const gradeColor=hasMCQ?(result.pct>=80?C.green:result.pct>=60?C.blue:result.pct>=40?C.warn:C.danger):C.blue;

    return (
      <div>
        <div style={{background:`linear-gradient(135deg,${gradeColor}15,${gradeColor}05)`,border:`1.5px solid ${gradeColor}30`,borderRadius:18,padding:24,textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:44,marginBottom:8}}>{hasMCQ?(result.pct>=80?"🏆":result.pct>=60?"🎯":result.pct>=40?"📈":"💪"):"✅"}</div>
          <div style={{fontWeight:900,fontSize:20,color:C.text,marginBottom:4}}>{grade}</div>
          {hasMCQ&&<><div style={{fontSize:44,fontWeight:900,color:gradeColor,marginBottom:4}}>{result.pct}%</div><div style={{color:C.muted,fontSize:13}}>{result.correct}/{result.total} correct · {result.attempted} attempted</div></>}
          <div style={{marginTop:10,display:"inline-flex",gap:6,alignItems:"center",background:"#fff",border:`1px solid ${C.border}`,borderRadius:10,padding:"5px 14px",fontSize:12,color:C.soft}}>
            {compInfo?.emoji} {compInfo?.full} · {testMode==="aptitude"?"📊 Aptitude":"💻 Coding"} · Test #{selectedTestNum}
          </div>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:12}}>📋 Answer Review</div>
          {result.questions.map((q,i)=>{
            const userAns=answers[q.id];
            const isCorrect=q.type==="mcq"?userAns===q.correct:null;
            const cr=codeResults[q.id];
            const allP=cr?.results?.every(r=>r.pass);
            return (
              <div key={q.id||i} style={{background:"#fff",border:`1.5px solid ${isCorrect===true?C.green:isCorrect===false?C.danger:q.type==="coding"&&cr?(allP?C.green:C.warn):C.border}`,borderRadius:12,padding:16,marginBottom:8}}>
                <div style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                  <span style={{fontSize:14,flexShrink:0}}>{isCorrect===true?"✅":isCorrect===false?"❌":q.type==="coding"&&cr?(allP?"✅":"⚠️"):"📝"}</span>
                  <div style={{fontWeight:600,fontSize:13,color:C.text,lineHeight:1.7}}>{q.question||q.title||"Question"}</div>
                </div>
                {q.type==="mcq"&&(
                  <div style={{paddingLeft:22}}>
                    {userAns!==undefined&&<div style={{fontSize:12,color:C.muted,marginBottom:3}}>Your answer: <strong style={{color:isCorrect?C.green:C.danger}}>{q.options?.[userAns]}</strong></div>}
                    {isCorrect===false&&<div style={{fontSize:12,color:C.green,marginBottom:4}}>Correct: <strong>{q.options?.[q.correct]}</strong></div>}
                    {q.explanation&&<div style={{background:C.bg,borderRadius:6,padding:"7px 10px",fontSize:12,color:C.soft}}>💡 {q.explanation}</div>}
                  </div>
                )}
                {q.type==="coding"&&(
                  <div style={{paddingLeft:22}}>
                    {cr&&<div style={{fontSize:12,color:allP?C.green:C.warn,fontWeight:700,marginBottom:6}}>{allP?`✅ All ${cr.results.length} test cases passed`:`${cr.results.filter(r=>r.pass).length}/${cr.results.length} passed`}</div>}
                    {q.solution_approach&&<div style={{background:"#f0fdf4",borderRadius:6,padding:"7px 10px",fontSize:12,color:"#14532d"}}>✅ Approach: {q.solution_approach}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <Btn variant="cta" onClick={()=>{setView("company");setResult(null);}} style={{flex:1}}>🔄 More Tests</Btn>
          <Btn variant="ghost" onClick={()=>{setView("home");setResult(null);setSelectedCompany(null);setTestMode(null);}} style={{flex:1}}>← All Companies</Btn>
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
  const [tool, setTool] = useState("bio");
  const [resume, setResume] = useState(() => localStorage.getItem("tp_resume")||"");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState("");
  const [err, setErr] = useState("");
  const fileRef = useRef();
  const isMobile = window.innerWidth < 768;

  const handleFile = async (e) => {
    const f=e.target.files[0]; if(!f) return;
    try {
      let text="";
      if(f.type==="application/pdf"||f.name.endsWith(".pdf")) text=await extractTextFromPDF(f);
      else if(f.name.endsWith(".docx")) text=await extractTextFromDOCX(f);
      else { const r=new FileReader(); r.onload=ev=>{setResume(ev.target.result);localStorage.setItem("tp_resume",ev.target.result);}; r.readAsText(f); return; }
      setResume(text); localStorage.setItem("tp_resume",text);
    } catch(e2){setErr("Could not read file: "+e2.message);}
  };

  const copy=(text,key)=>{ navigator.clipboard.writeText(text).then(()=>{setCopied(key);setTimeout(()=>setCopied(""),2000);}); };

  const generate=async()=>{
    if(!resume.trim()&&tool!=="coldmsg"){setErr("Paste your resume first.");return;}
    if(tool==="coldmsg"&&!targetCompany.trim()){setErr("Enter target company.");return;}
    setLoading(true);setErr("");setResult(null);
    const reT=resume.trim().slice(0,1500);
    try{
      let prompt="";
      if(tool==="bio") prompt=`Write an optimized LinkedIn About section for ${targetRole||"software/tech roles"}.\nResume:\n${reT}\nRules: First person, India professional tone, 200-280 words, strong hook (NOT "I am a..."), end with CTA.\nReturn ONLY valid JSON: {"bio":"...","wordCount":220,"hook":"opening line","keyHighlights":["h1","h2","h3"]}`;
      else if(tool==="headline") prompt=`Generate 5 optimized LinkedIn headlines for ${targetRole||"software/tech"}.\nResume:\n${reT}\nMax 220 chars each.\nReturn ONLY valid JSON: {"headlines":[{"text":"...","angle":"Skill-focused","score":92}],"bestPick":0,"tips":["tip"]}`;
      else if(tool==="coldmsg") prompt=`Write cold messages to HR at ${targetCompany} for ${targetRole||"software engineer"} role.\nCandidate: ${reT.slice(0,500)}\nReturn ONLY valid JSON: {"connectionRequest":"...","coldDM":"...","referralRequest":"...","tips":["tip"]}`;
      else if(tool==="skills") prompt=`Analyze resume and suggest LinkedIn skills for ${targetRole||"software/tech"}.\nResume:\n${reT}\nReturn ONLY valid JSON: {"topSkills":[{"skill":"React.js","priority":"Must Add","reason":"...","endorsementTip":"..."}],"missingHighImpact":["Docker"],"profileStrengthTip":"..."}`;
      else if(tool==="cover") prompt=`Write a cover letter for ${targetRole||"software engineer"}${targetCompany?" at "+targetCompany:""}.\nResume:\n${reT}\nIndia professional tone, 180-220 words, 3 paragraphs.\nReturn ONLY valid JSON: {"coverLetter":"...","subject":"Application for [Role]...","wordCount":200}`;
      const raw=await callAI(prompt,2000,"json");
      const data=safeJSON(raw,null);
      if(!data) throw new Error("Generation failed. Try again.");
      setResult(data);
    }catch(e){setErr(e.message);}
    setLoading(false);
  };

  const tools=[{id:"bio",icon:"📄",label:"LinkedIn Bio"},{id:"headline",icon:"✍️",label:"Headline"},{id:"coldmsg",icon:"💬",label:"Cold Message"},{id:"skills",icon:"🎯",label:"Skills"},{id:"cover",icon:"📧",label:"Cover Letter"}];

  return(
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontWeight:900,fontSize:isMobile?20:24,color:C.text,marginBottom:4}}>🔗 LinkedIn Suite</div>
        <div style={{color:C.muted,fontSize:13}}>Bio · Headline · Cold DM · Skills · Cover Letter</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:18,overflowX:"auto",paddingBottom:4}}>
        {tools.map(t=>(
          <button key={t.id} onClick={()=>{setTool(t.id);setResult(null);setErr("");}}
            style={{padding:"8px 14px",borderRadius:10,whiteSpace:"nowrap",border:`1.5px solid ${tool===t.id?C.blue:C.border}`,background:tool===t.id?`${C.blue}10`:"#fff",color:tool===t.id?C.blue:C.muted,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:tool===t.id?700:400,fontSize:13,transition:"all .2s"}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"10px 14px",marginBottom:14,color:C.danger,fontSize:13}}>⚠ {err}</div>}
      <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontWeight:700,color:C.text,fontSize:14}}>📄 Your Resume</div>
          <button onClick={()=>fileRef.current.click()} style={{padding:"6px 12px",borderRadius:8,border:`1.5px solid ${C.blue}40`,background:`${C.blue}08`,color:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>📁 Upload</button>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFile} style={{display:"none"}}/>
        <textarea value={resume} onChange={e=>{setResume(e.target.value);localStorage.setItem("tp_resume",e.target.value);}} placeholder="Paste your resume here..." style={{...inp,minHeight:90,resize:"vertical",lineHeight:1.8}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <input style={inp} placeholder="Target role (e.g. Full Stack Developer)" value={targetRole} onChange={e=>setTargetRole(e.target.value)}/>
        <input style={inp} placeholder={tool==="coldmsg"?"Target company*":"Target company (optional)"} value={targetCompany} onChange={e=>setTargetCompany(e.target.value)}/>
      </div>
      <Btn variant="cta" loading={loading} onClick={generate} style={{width:"100%",padding:"13px",fontSize:15}}>✨ Generate {tools.find(t=>t.id===tool)?.label}</Btn>

      {result&&(
        <div style={{marginTop:18}}>
          {tool==="bio"&&result.bio&&(
            <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontWeight:700,color:C.text,fontSize:15}}>✅ LinkedIn About Section</div>
                <button onClick={()=>copy(result.bio,"bio")} style={{padding:"6px 12px",borderRadius:7,border:`1.5px solid ${C.border}`,background:copied==="bio"?"#f0fdf4":"#fff",color:copied==="bio"?C.green:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>{copied==="bio"?"✅ Copied!":"📋 Copy"}</button>
              </div>
              <div style={{color:C.soft,fontSize:13,lineHeight:2,whiteSpace:"pre-line",background:C.bg,borderRadius:10,padding:14}}>{result.bio}</div>
            </div>
          )}
          {tool==="headline"&&result.headlines&&(
            <div>{result.headlines.map((h,i)=>(
              <div key={i} style={{background:i===result.bestPick?"#f0fdf4":"#fff",border:`1.5px solid ${i===result.bestPick?C.green:C.border}`,borderRadius:12,padding:16,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <div style={{display:"flex",gap:6}}>{i===result.bestPick&&<Tag color={C.green}>⭐ Best</Tag>}<Tag color={C.blue}>{h.angle}</Tag></div>
                  <button onClick={()=>copy(h.text,"h"+i)} style={{padding:"4px 10px",borderRadius:6,border:`1.5px solid ${C.border}`,background:copied==="h"+i?"#f0fdf4":"#fff",color:copied==="h"+i?C.green:C.blue,fontSize:11,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>{copied==="h"+i?"✅":"📋"}</button>
                </div>
                <div style={{fontWeight:600,fontSize:13,color:C.text}}>{h.text}</div>
              </div>
            ))}</div>
          )}
          {tool==="coldmsg"&&(
            <div>{[{key:"connectionRequest",label:"🔗 Connection Request"},{key:"coldDM",label:"💬 Cold DM to HR"},{key:"referralRequest",label:"🤝 Referral Request"}].map(({key,label})=>result[key]&&(
              <div key={key} style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{fontWeight:700,color:C.text,fontSize:13}}>{label}</div>
                  <button onClick={()=>copy(result[key],key)} style={{padding:"4px 10px",borderRadius:6,border:`1.5px solid ${C.border}`,background:copied===key?"#f0fdf4":"#fff",color:copied===key?C.green:C.blue,fontSize:11,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>{copied===key?"✅ Copied!":"📋 Copy"}</button>
                </div>
                <div style={{color:C.soft,fontSize:13,lineHeight:1.9,whiteSpace:"pre-line",background:C.bg,borderRadius:8,padding:12}}>{result[key]}</div>
              </div>
            ))}</div>
          )}
          {tool==="skills"&&result.topSkills&&(
            <div>
              {result.missingHighImpact?.length>0&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:14,marginBottom:12}}><div style={{fontWeight:700,color:C.danger,marginBottom:6}}>🚨 Missing Skills:</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{result.missingHighImpact.map((s,i)=><span key={i} style={{background:"#fef2f2",color:C.danger,fontSize:12,padding:"3px 10px",borderRadius:18,fontWeight:700,border:"1px solid #fecaca"}}>+ {s}</span>)}</div></div>}
              {result.topSkills.map((sk,i)=>(
                <div key={i} style={{background:"#fff",border:`1.5px solid ${sk.priority==="Must Add"?C.blue:C.border}`,borderRadius:10,padding:14,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontWeight:700,color:C.text}}>{sk.skill}</div><Tag color={sk.priority==="Must Add"?C.blue:C.green}>{sk.priority}</Tag></div>
                  <div style={{color:C.soft,fontSize:12,marginBottom:4}}>{sk.reason}</div>
                  <div style={{background:"#eff6ff",borderRadius:6,padding:"5px 10px",fontSize:12,color:C.blue}}>💡 {sk.endorsementTip}</div>
                </div>
              ))}
            </div>
          )}
          {tool==="cover"&&result.coverLetter&&(
            <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontWeight:700,color:C.text,fontSize:15}}>📧 Cover Letter</div>
                <button onClick={()=>copy(result.coverLetter,"cover")} style={{padding:"6px 12px",borderRadius:7,border:`1.5px solid ${C.border}`,background:copied==="cover"?"#f0fdf4":"#fff",color:copied==="cover"?C.green:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>{copied==="cover"?"✅ Copied!":"📋 Copy"}</button>
              </div>
              {result.subject&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:7,padding:"7px 12px",fontSize:13,color:C.blue,marginBottom:12}}><strong>Subject:</strong> {result.subject}</div>}
              <div style={{color:C.soft,fontSize:13,lineHeight:2,whiteSpace:"pre-line",background:C.bg,borderRadius:10,padding:14}}>{result.coverLetter}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// RESUME ANALYZER — FIXED OPTIMIZATION
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
  const [optRetries, setOptRetries] = useState(0);
  const fileRef = useRef();
  const jdImageRef = useRef();
  const [jdImageLoading, setJdImageLoading] = useState(false);
  const isMobile = window.innerWidth < 768;

  const trackActivity = async (action, details="") => {
    try { if (!user?.id) return; await supabase.from("user_activity").insert({ user_id:user.id, email:user.email, action, details }); } catch(_) {}
  };

  const handleFile = async (e) => {
    const f=e.target.files[0]; if(!f) return;
    setFileName(f.name); localStorage.setItem("tp_fileName",f.name); setErr("");
    try {
      let text="";
      if(f.type==="application/pdf"||f.name.endsWith(".pdf")) text=await extractTextFromPDF(f);
      else if(f.name.endsWith(".docx")) text=await extractTextFromDOCX(f);
      else { const r=new FileReader(); r.onload=ev=>{setResume(ev.target.result);localStorage.setItem("tp_resume",ev.target.result);trackActivity("resume_uploaded",f.name);}; r.readAsText(f); return; }
      setResume(text); localStorage.setItem("tp_resume",text); trackActivity("resume_uploaded",f.name);
    } catch(e2){setErr("Could not read file: "+e2.message);}
  };

  const runAnalysis = async () => {
    if (!jd.trim()||!resume.trim()) { setErr("Fill both Job Description and Resume."); return; }
    setStep("analyzing"); setErr(""); setAnalysis(null); setOptimized(null); setOptimizedScores(null);
    try {
      const prompt=`You are a senior ATS analyst. Provide honest analysis.
JD: ${jd.trim().slice(0,800)}
RESUME: ${resume.trim().slice(0,900)}

Return ONLY valid JSON (no markdown, no extra text):
{"matchScore":72,"atsScore":78,"shortlistRate":24,"verdict":"Strong Match","summary":"2-sentence summary.","recruiterImpression":"Recruiter 5-second thought.","sectionAudit":[{"section":"Contact Info","score":85,"status":"good","feedback":"specific feedback"},{"section":"Education","score":90,"status":"good","feedback":"specific"},{"section":"Experience","score":65,"status":"warning","feedback":"specific"},{"section":"Projects","score":80,"status":"good","feedback":"specific"},{"section":"Skills","score":70,"status":"warning","feedback":"specific"},{"section":"Resume Format","score":60,"status":"warning","feedback":"specific"},{"section":"Metrics & Numbers","score":40,"status":"weak","feedback":"specific"}],"strongMatches":[{"skill":"React.js","reason":"Listed in both JD and resume","strength":90}],"missingKeywords":[{"keyword":"Docker","importance":"High","tip":"Add to Tools section"}],"weakAreas":[{"area":"No metrics","detail":"Add numbers to bullets","priority":"High"}],"projectFit":[{"name":"Project Name","relevance":92,"keep":true,"reason":"Relevant","suggestion":"Add metric"}],"suggestedSkillsToAdd":["Docker"],"improvements":["Add metrics to experience bullets"],"formatIssues":["Not ATS-friendly format"]}`;
      const raw=await callAI(prompt,2500,"json");
      const data=safeJSON(raw,null);
      if(!data?.matchScore) throw new Error("Analysis failed. Please try again.");
      setAnalysis(data); setStep("analyzed"); setSection("overview");
      trackActivity("analysis_run",`match:${data.matchScore}%`);
    } catch(e){setErr(e.message||"Analysis failed.");setStep("input");}
  };

  const handleJDImage = async (e) => {
    const files=Array.from(e.target.files); if(!files.length) return;
    setJdImageLoading(true); setErr("");
    try {
      let allText="";
      for(let i=0;i<files.length;i++){
        const f=files[i];
        const base64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});
        const prompt=`Extract ALL text from this job description image. Return only plain text, no formatting.\n\n[IMAGE: data:${f.type||"image/jpeg"};base64,${base64}]`;
        const text=await callAI(prompt,1500,"text");
        allText+=(text||"")+"\n\n";
      }
      if(!allText.trim()) throw new Error("Could not extract text from images.");
      setJd(allText.trim()); localStorage.setItem("tp_jd",allText.trim());
    } catch(e2){setErr("Image read failed: "+e2.message);}
    setJdImageLoading(false); e.target.value="";
  };

  const extractEducationFromResume=(rawText)=>{
    if(!rawText) return [];
    const lines=rawText.split(/\n/).map(l=>l.trim()).filter(Boolean);
    let eduStart=-1,eduEnd=-1;
    const sH=/^(EXPERIENCE|WORK|PROJECTS|SKILLS|TECHNICAL|CERTIF|ACHIEVEMENTS|SUMMARY|OBJECTIVE|INTERNSHIP)/i;
    for(let i=0;i<lines.length;i++){if(/^EDUCATION/i.test(lines[i])){eduStart=i+1;continue;}if(eduStart!==-1&&sH.test(lines[i])){eduEnd=i;break;}}
    if(eduStart===-1) return [];
    if(eduEnd===-1) eduEnd=Math.min(eduStart+8,lines.length);
    const eduLines=lines.slice(eduStart,eduEnd).filter(l=>!l.match(/^(EDUCATION|EXPERIENCE|PROJECTS|SKILLS)/i));
    if(eduLines.length===0) return [];
    const entries=[];let i=0;
    while(i<eduLines.length){
      const line1=eduLines[i]||"",line2=eduLines[i+1]||"";
      const dP=/(\b\d{4}\b.*?(?:–|-|to).*?\b\d{4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b)/i;
      let school=line1,location="";
      const lM=line1.match(/^(.+?)\s{2,}(.+)$/);
      if(lM){school=lM[1].trim();location=lM[2].trim();}
      let degree="",dates="";
      const dL2=line2.match(dP);
      if(dL2){const dS=line2.match(/^(.+?)\s{2,}(\S.*?\d{4}.*)$/);if(dS){degree=dS[1].trim();dates=dS[2].trim();}else{const dI=line2.indexOf(dL2[0]);degree=line2.slice(0,dI).trim();dates=dL2[0].trim();}i+=2;}
      else{degree=line2;i+=2;}
      if(!degree&&school.match(/B\.Tech|B\.E|M\.Tech|MBA|BCA|MCA|Bachelor|Master|B\.Sc/i)){degree=school;school="";}
      if(school||degree)entries.push({school,location,degree,dates});
    }
    return entries.length>0?entries:[];
  };

  // Check if original resume has experience section
  const hasExperienceInResume=(rawText)=>{
    if(!rawText) return false;
    return /\b(EXPERIENCE|WORK EXPERIENCE|INTERNSHIP|EMPLOYMENT)\b/i.test(rawText);
  };

  const runOptimize=async(retryCount=0)=>{
    setStep("optimizing"); setErr(""); setOptRetries(retryCount);
    const extractedEducation=extractEducationFromResume(resume);
    const hasExp=hasExperienceInResume(resume);
    try {
      const prompt=`You are an expert ATS resume writer. Rewrite this resume in Jake's format optimized for the job.
JD: ${jd.trim().slice(0,600)}
ORIGINAL RESUME: ${resume.trim().slice(0,2500)}

CRITICAL RULES:
1. Copy education EXACTLY as in original
2. ${hasExp?"Keep same company/title/dates from original resume. Rewrite bullets with JD keywords and metrics.":"This is a fresher resume with NO work experience. DO NOT add experience section. Instead add a strong Professional Summary section highlighting skills, projects and potential."}
3. 4 bullet points per section with quantified metrics
4. 6+ skill categories
5. Add exactly 3 certifications/achievements
6. Return ONLY valid JSON, no markdown, no extra text

Return this exact JSON structure:
{"name":"Full Name","phone":"phone","email":"email","linkedin":"linkedin url","github":"github url","location":"city","summary":"${hasExp?"2-3 sentence professional summary highlighting key experience and value proposition":"2-3 sentence professional summary for fresher highlighting skills, academic background and eagerness to contribute"}","education":[{"school":"university name","location":"city","degree":"degree name","dates":"year range"}]${hasExp?',"experience":[{"title":"job title","company":"company name","location":"city","dates":"date range","bullets":["bullet 1 with metric","bullet 2 with metric","bullet 3 with metric","bullet 4 with metric"]}]':""},"projects":[{"name":"project name","tech":"tech stack","dates":"date range","bullets":["bullet 1","bullet 2","bullet 3"]}],"skills":[{"category":"Languages","items":"Python, Java, JavaScript"},{"category":"Frameworks","items":"React, Node.js"},{"category":"Databases","items":"MySQL, MongoDB"},{"category":"Tools","items":"Git, Docker"},{"category":"Cloud","items":"AWS, GCP"},{"category":"Concepts","items":"DSA, OOPs, DBMS"}],"certifications":["certification 1","certification 2","certification 3"],"optimizedMatchScore":88,"optimizedAtsScore":91,"optimizedShortlistRate":34}`;

      const raw=await callAI(prompt,3000,"json");
      const data=safeJSON(raw,null);
      if(!data?.name||!data?.skills||!Array.isArray(data.skills)) {
        if(retryCount<2) { return runOptimize(retryCount+1); }
        throw new Error("Optimization failed after multiple attempts. Please try again later.");
      }
      if(extractedEducation.length>0) data.education=extractedEducation;
      const optScores={
        matchScore:data.optimizedMatchScore||Math.min(96,(analysis?.matchScore||70)+15),
        atsScore:data.optimizedAtsScore||Math.min(96,(analysis?.atsScore||70)+14),
        shortlistRate:data.optimizedShortlistRate||Math.min(45,(analysis?.shortlistRate||20)+12)
      };
      delete data.optimizedMatchScore; delete data.optimizedAtsScore; delete data.optimizedShortlistRate;
      if(data.certifications&&data.certifications.length>3) data.certifications=data.certifications.slice(0,3);
      while(data.certifications&&data.certifications.length<3) data.certifications.push("Actively solving 100+ DSA problems on LeetCode and competitive coding platforms");
      setOptimized(data); setOptimizedScores(optScores); setStep("optimized"); setSection("resume");
      trackActivity("resume_optimized",`match:${optScores.matchScore}%`);
    }catch(e){
      if(retryCount<2){return runOptimize(retryCount+1);}
      setErr(e.message||"Optimization failed. Try again."); setStep("analyzed");
    }
  };

  const scoreColor=s=>s>=75?"#16a34a":s>=55?"#d97706":"#dc2626";
  const scoreBg=s=>s>=75?"#f0fdf4":s>=55?"#fffbeb":"#fef2f2";
  const scoreBorder=s=>s>=75?"#bbf7d0":s>=55?"#fef08a":"#fecaca";
  const statusIcon=st=>st==="good"?"✅":st==="warning"?"⚠️":"❌";

  const handleDownload=async(type)=>{
    if(!optimized) return; setDownloading(type);
    try{
      if(type==="pdf") await downloadPDF(optimized,"TakePlace_Optimized_Resume.pdf");
      else await downloadDOCXJake(optimized,"TakePlace_Optimized_Resume.docx");
      trackActivity("downloaded_"+type,optimized.name||"");
    }catch(e){setErr("Download failed: "+e.message);}
    setDownloading("");
  };

  const JakesResumePreview=({data})=>{
    if(!data) return null;
    const ps={fontSize:8.5,lineHeight:"1.65",color:"#1a1a1a",marginBottom:2};
    const sS={borderBottom:"1.5px solid #1a1a1a",paddingBottom:1,marginBottom:6,marginTop:10,fontWeight:700,fontSize:9.5,letterSpacing:"0.06em",color:"#1a1a1a",textTransform:"uppercase"};
    const bS={...ps,paddingLeft:12,position:"relative",marginBottom:2.5};
    return(
      <div style={{background:"#ffffff",border:"1px solid #d1d5db",borderRadius:4,padding:"24px 28px",maxWidth:680,margin:"0 auto",fontFamily:"'Times New Roman',Times,serif",boxShadow:"0 4px 24px rgba(0,0,0,0.12)"}}>
        <div style={{textAlign:"center",marginBottom:3}}><div style={{fontSize:18,fontWeight:700,color:"#1a1a1a"}}>{data.name}</div></div>
        <div style={{textAlign:"center",marginBottom:10,fontSize:8,color:"#374151",lineHeight:1.5}}>{[data.phone,data.email,data.linkedin,data.github,data.location].filter(Boolean).join(" | ")}</div>
        {data.summary&&(<><div style={sS}>Professional Summary</div><div style={{...ps,marginBottom:8,fontStyle:"italic"}}>{data.summary}</div></>)}
        {data.education?.length>0&&(<><div style={sS}>Education</div>{data.education.map((edu,i)=>(<div key={i} style={{marginBottom:6}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:9}}>{edu.school}</span><span style={{fontSize:8.5,color:"#374151"}}>{edu.location}</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:8.5,fontStyle:"italic"}}>{edu.degree}</span><span style={{fontSize:8.5,color:"#374151"}}>{edu.dates}</span></div></div>))}</>)}
        {data.experience?.length>0&&(<><div style={sS}>Experience</div>{data.experience.map((exp,i)=>(<div key={i} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:9}}>{exp.title}</span><span style={{fontSize:8.5,color:"#374151"}}>{exp.dates}</span></div><div style={{fontSize:8.5,fontStyle:"italic",color:"#374151",marginBottom:3}}>{exp.company}{exp.location?`, ${exp.location}`:""}</div>{(exp.bullets||[]).map((b,j)=>(<div key={j} style={bS}><span style={{position:"absolute",left:3,top:0,fontSize:8.5}}>•</span>{b}</div>))}</div>))}</>)}
        {data.projects?.length>0&&(<><div style={sS}>Projects</div>{data.projects.map((proj,i)=>(<div key={i} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}><span><span style={{fontWeight:700,fontSize:9}}>{proj.name}</span>{proj.tech&&<span style={{fontStyle:"italic",fontSize:8.5,color:"#374151"}}> | {proj.tech}</span>}</span>{proj.dates&&<span style={{fontSize:8.5,color:"#374151"}}>{proj.dates}</span>}</div><div style={{marginTop:2}}>{(proj.bullets||[]).map((b,j)=>(<div key={j} style={bS}><span style={{position:"absolute",left:3,top:0,fontSize:8.5}}>•</span>{b}</div>))}</div></div>))}</>)}
        {data.skills?.length>0&&(<><div style={sS}>Technical Skills</div>{data.skills.map((sk,i)=>(<div key={i} style={{...ps,marginBottom:2.5}}><span style={{fontWeight:700}}>{sk.category}: </span><span>{sk.items}</span></div>))}</>)}
        {data.certifications?.length>0&&(<><div style={sS}>Certifications & Achievements</div>{data.certifications.map((c,i)=>(<div key={i} style={bS}><span style={{position:"absolute",left:3,top:0,fontSize:8.5}}>•</span>{c}</div>))}</>)}
      </div>
    );
  };

  const Ring=({score,size=88,color,label})=>{
    const r=34,circ=2*Math.PI*r,col=color||scoreColor(score);
    return(<div style={{textAlign:"center"}}><svg width={size} height={size} viewBox="0 0 80 80"><circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6"/><circle cx="40" cy="40" r={r} fill="none" stroke={col} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)} strokeLinecap="round" transform="rotate(-90 40 40)" style={{transition:"stroke-dashoffset 1.2s ease"}}/><text x="40" y="44" textAnchor="middle" fill={col} fontSize="15" fontWeight="800" fontFamily="Inter">{score}%</text></svg>{label&&<div style={{fontSize:11,color:"#64748b",fontWeight:600,marginTop:2}}>{label}</div>}</div>);
  };

  const DeltaBadge=({original,optimized:opt})=>{
    const delta=opt-original; if(!delta) return null;
    return(<span style={{background:delta>0?"#f0fdf4":"#fef2f2",color:delta>0?"#16a34a":"#dc2626",fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:20,border:`1px solid ${delta>0?"#bbf7d0":"#fecaca"}`,marginLeft:6}}>{delta>0?"+":""}{delta}%</span>);
  };

  if(step==="input") return(
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontWeight:900,fontSize:isMobile?20:24,color:C.text,marginBottom:4}}>⚡ AI Resume Analyzer</div>
        <div style={{color:C.muted,fontSize:13}}>Paste JD + resume → Deep ATS analysis → Optimized PDF/DOCX</div>
      </div>
      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"10px 14px",marginBottom:14,color:C.danger,fontSize:13}}>⚠ {err}</div>}
      <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <div style={{flex:1}}><div style={{fontWeight:700,color:C.text,fontSize:14}}>📋 Job Description</div></div>
          <div style={{display:"flex",gap:6}}>
            {jd&&<span style={{background:jd.split(/\s+/).filter(Boolean).length>150?"#f0fdf4":"#fffbeb",color:jd.split(/\s+/).filter(Boolean).length>150?"#16a34a":"#d97706",fontSize:11,padding:"3px 10px",borderRadius:18,fontWeight:700}}>{jd.split(/\s+/).filter(Boolean).length} words</span>}
            <button onClick={()=>jdImageRef.current.click()} disabled={jdImageLoading} style={{padding:"6px 12px",borderRadius:8,border:`1.5px solid ${C.orange}40`,background:`${C.orange}08`,color:C.orange,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
              {jdImageLoading?<><SpinIcon size={11} color={C.orange}/> Reading...</>:"📸 Photo"}
            </button>
            <input ref={jdImageRef} type="file" accept="image/*" multiple onChange={handleJDImage} style={{display:"none"}}/>
          </div>
        </div>
        {jd&&!jdImageLoading&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:7,padding:"5px 10px",marginBottom:8,fontSize:12,color:"#16a34a"}}>✅ JD loaded</div>}
        <textarea value={jd} onChange={e=>{setJd(e.target.value);localStorage.setItem("tp_jd",e.target.value);}} placeholder="Paste the job description here..." style={{...inp,minHeight:140,resize:"vertical",lineHeight:1.8}}/>
      </div>
      <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontWeight:700,color:C.text,fontSize:14}}>📄 Your Resume</div>
          <button onClick={()=>fileRef.current.click()} style={{padding:"6px 12px",borderRadius:8,border:`1.5px solid ${C.blue}40`,background:`${C.blue}08`,color:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>📁 Upload PDF/DOCX</button>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.doc" onChange={handleFile} style={{display:"none"}}/>
        {fileName&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:7,padding:"5px 10px",marginBottom:8,fontSize:12,color:"#16a34a"}}>✅ {fileName} loaded</div>}
        <textarea value={resume} onChange={e=>{setResume(e.target.value);localStorage.setItem("tp_resume",e.target.value);}} placeholder="Paste resume text here OR upload file above..." style={{...inp,minHeight:180,resize:"vertical",lineHeight:1.8}}/>
      </div>
      <button onClick={runAnalysis} disabled={!jd.trim()||!resume.trim()} style={{width:"100%",padding:"14px",fontSize:15,borderRadius:12,border:"none",cursor:!jd.trim()||!resume.trim()?"not-allowed":"pointer",background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",fontWeight:800,fontFamily:"'Inter',sans-serif",opacity:!jd.trim()||!resume.trim()?0.5:1}}>
        🔍 Analyze Resume — Deep ATS Score
      </button>
    </div>
  );

  if(step==="analyzing") return(<div style={{textAlign:"center",padding:"80px 20px"}}><div style={{fontSize:56,marginBottom:16,animation:"float 2s ease-in-out infinite"}}>🧠</div><div style={{fontWeight:800,fontSize:20,color:C.text,marginBottom:8}}>Analyzing Your Resume</div><div style={{color:C.muted,fontSize:13,lineHeight:1.9,marginBottom:24}}>Running section audit...<br/>Scoring JD match and ATS readability...</div><SpinIcon size={40} color={C.blue}/></div>);
  if(step==="optimizing") return(<div style={{textAlign:"center",padding:"80px 20px"}}><div style={{fontSize:56,marginBottom:16,animation:"float 2s ease-in-out infinite"}}>✨</div><div style={{fontWeight:800,fontSize:20,color:C.text,marginBottom:8}}>Building Optimized Resume</div><div style={{color:C.muted,fontSize:13,lineHeight:1.9,marginBottom:24}}>{optRetries>0?`Retry attempt ${optRetries}/2...`:"Preserving your education exactly..."}<br/>Mirroring JD keywords into bullets...<br/>{hasExperienceInResume(resume)?"Keeping original experience with strong metrics...":"Adding Professional Summary for fresher profile..."}</div><SpinIcon size={40} color={C.purple}/></div>);

  const a=analysis;
  const displayScores=(step==="optimized"&&optimizedScores)?optimizedScores:{matchScore:a.matchScore,atsScore:a.atsScore,shortlistRate:a.shortlistRate||Math.min(35,Math.round((a.matchScore*0.6+a.atsScore*0.4)*0.35))};
  const tabs=[["overview","📊 Overview"],["audit","🔬 Audit"],["gaps","⚠️ Gaps"],["projects","🏗️ Projects"],...(step==="optimized"?[["resume","✨ Resume"]]:[])];;

  return(
    <div>
      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"10px 14px",marginBottom:14,color:C.danger,fontSize:13}}>⚠ {err} <button onClick={()=>{setErr("");if(step!=="analyzed")setStep("analyzed");}} style={{marginLeft:8,background:"none",border:"none",cursor:"pointer",color:C.blue,fontSize:12}}>Retry optimization →</button></div>}
      <div style={{background:"linear-gradient(135deg,#eff6ff,#f0fdf4)",border:`1.5px solid ${C.blue}20`,borderRadius:18,padding:isMobile?16:22,marginBottom:14}}>
        {step==="optimized"&&optimizedScores&&(<div style={{textAlign:"center",marginBottom:12}}><div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:18,padding:"5px 16px",fontSize:12,color:"#16a34a",fontWeight:700}}>✨ Scores updated after optimization</div></div>)}
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:isMobile?16:28,marginBottom:18,flexWrap:"wrap"}}>
          <div style={{textAlign:"center"}}><Ring score={displayScores.matchScore} label="JD Match"/>{step==="optimized"&&optimizedScores&&<DeltaBadge original={a.matchScore} optimized={optimizedScores.matchScore}/>}</div>
          <div style={{width:1,height:60,background:"#e2e8f0"}}/>
          <div style={{textAlign:"center"}}><Ring score={displayScores.atsScore} color="#2563eb" label="ATS Score"/>{step==="optimized"&&optimizedScores&&<DeltaBadge original={a.atsScore} optimized={optimizedScores.atsScore}/>}</div>
          <div style={{width:1,height:60,background:"#e2e8f0"}}/>
          <div style={{textAlign:"center"}}><div style={{width:80,height:80,borderRadius:"50%",border:`6px solid ${C.purple}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",margin:"0 auto"}}><div style={{fontWeight:900,fontSize:16,color:C.purple}}>{displayScores.shortlistRate}%</div></div><div style={{fontSize:11,color:"#64748b",fontWeight:600,marginTop:2}}>Shortlist Rate</div>{step==="optimized"&&optimizedScores&&<DeltaBadge original={a.shortlistRate||0} optimized={optimizedScores.shortlistRate}/>}</div>
        </div>
        <div style={{textAlign:"center"}}><div style={{display:"inline-block",padding:"5px 18px",borderRadius:18,background:scoreBg(displayScores.matchScore),color:scoreColor(displayScores.matchScore),fontWeight:800,fontSize:13,border:`1px solid ${scoreBorder(displayScores.matchScore)}`,marginBottom:8}}>{step==="optimized"?"✨ Optimized":a.verdict}</div><div style={{color:"#475569",fontSize:13,lineHeight:1.8,maxWidth:480,margin:"0 auto 8px"}}>{a.summary}</div>{a.recruiterImpression&&(<div style={{background:"#fff",border:`1px solid ${C.blue}20`,borderRadius:10,padding:"8px 16px",fontSize:12,color:"#64748b",fontStyle:"italic",maxWidth:440,margin:"0 auto"}}>💼 <strong style={{color:C.blue,fontStyle:"normal"}}>Recruiter 5-sec:</strong> {a.recruiterImpression}</div>)}</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        {tabs.map(([k,l])=>(<button key={k} onClick={()=>setSection(k)} style={{padding:"8px 16px",borderRadius:18,whiteSpace:"nowrap",border:`1.5px solid ${section===k?C.blue:C.border}`,background:section===k?`${C.blue}10`:"#fff",color:section===k?C.blue:"#64748b",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:section===k?700:400,fontSize:13,transition:"all .2s"}}>{l}</button>))}
      </div>
      {section==="overview"&&(<div>
        <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}>
          <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:12}}>✅ Strong Matches</div>
          {(a.strongMatches||[]).map((m,i)=>(<div key={i} style={{marginBottom:10,background:"#f0fdf4",borderRadius:10,padding:12,border:"1px solid #bbf7d0"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><div style={{fontWeight:700,color:C.text}}>{m.skill}</div><div style={{fontWeight:800,fontSize:14,color:scoreColor(m.strength)}}>{m.strength}%</div></div><div style={{color:"#64748b",fontSize:12,marginBottom:6}}>{m.reason}</div><div style={{background:"#e2e8f0",borderRadius:4,height:4,overflow:"hidden"}}><div style={{height:"100%",width:`${m.strength}%`,background:"#16a34a",borderRadius:4,transition:"width 1.2s ease"}}/></div></div>))}
        </div>
        {a.weakAreas?.length>0&&(<div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}><div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:12}}>⚡ Weak Areas</div>{a.weakAreas.map((w,i)=>(<div key={i} style={{background:"#fffbeb",borderRadius:10,padding:12,marginBottom:8,border:"1px solid #fef08a"}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><div style={{fontWeight:700,color:"#d97706",fontSize:13}}>{w.area}</div>{w.priority&&<span style={{background:w.priority==="High"?"#fef2f2":"#fffbeb",color:w.priority==="High"?"#dc2626":"#d97706",fontSize:10,padding:"2px 8px",borderRadius:18,fontWeight:700}}>{w.priority}</span>}</div><div style={{color:"#475569",fontSize:12}}>{w.detail}</div></div>))}</div>)}
        {a.improvements?.length>0&&(<div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}><div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:12}}>📝 Quick Wins</div>{a.improvements.map((imp,i)=>(<div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8,background:"#f1f4f9",borderRadius:8,padding:"9px 12px"}}><span style={{color:C.blue,flexShrink:0,fontWeight:700}}>→</span><span style={{color:"#475569",fontSize:13}}>{imp}</span></div>))}</div>)}
        {step!=="optimized"&&(<div style={{background:"linear-gradient(135deg,#eff6ff,#ede9fe)",border:`1.5px solid ${C.blue}20`,borderRadius:18,padding:20,textAlign:"center"}}><div style={{fontWeight:800,fontSize:17,color:C.text,marginBottom:6}}>Ready to Fix All of This?</div><div style={{color:"#64748b",fontSize:13,marginBottom:16,lineHeight:1.7}}>One click — AI rewrites with JD keywords, adds metrics.{!hasExperienceInResume(resume)?" Fresher? We'll add a strong Professional Summary instead of experience.":""}</div><button onClick={()=>runOptimize(0)} style={{padding:"12px 36px",fontSize:14,borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#7c3aed,#5b21b6)",color:"#fff",fontWeight:800,fontFamily:"'Inter',sans-serif"}}>✨ Optimize Resume → Jake's Format</button></div>)}
      </div>)}
      {section==="audit"&&(<div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18}}><div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:12}}>🔬 Section-by-Section Audit</div>{(a.sectionAudit||[]).map((s,i)=>(<div key={i} style={{marginBottom:12,background:scoreBg(s.score),borderRadius:10,padding:12,border:`1px solid ${scoreBorder(s.score)}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{display:"flex",alignItems:"center",gap:6}}><span>{statusIcon(s.status)}</span><span style={{fontWeight:700,color:C.text,fontSize:13}}>{s.section}</span></div><span style={{fontWeight:800,fontSize:15,color:scoreColor(s.score)}}>{s.score}%</span></div><div style={{background:"#e2e8f0",borderRadius:4,height:5,overflow:"hidden",marginBottom:6}}><div style={{height:"100%",width:`${s.score}%`,background:scoreColor(s.score),borderRadius:4,transition:"width 1.2s ease"}}/></div><div style={{color:"#475569",fontSize:12}}>{s.feedback}</div></div>))}</div>)}
      {section==="gaps"&&(<div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18}}><div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:12}}>⚠️ Missing Keywords <span style={{background:"#fef2f2",color:"#dc2626",fontSize:11,padding:"3px 10px",borderRadius:18,fontWeight:700}}>{a.missingKeywords?.length||0} gaps</span></div>{(a.missingKeywords||[]).map((m,i)=>(<div key={i} style={{background:"#fef2f2",borderRadius:10,padding:12,marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontWeight:700,color:C.text}}>🔍 {m.keyword}</div><span style={{background:m.importance==="High"?"#fef2f2":"#fffbeb",color:m.importance==="High"?"#dc2626":"#d97706",fontSize:11,padding:"3px 10px",borderRadius:18,fontWeight:700}}>{m.importance}</span></div><div style={{color:"#475569",fontSize:12}}>💡 {m.tip}</div></div>))}</div>)}
      {section==="projects"&&(<div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18}}><div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:12}}>🏗️ Project Relevance</div>{(a.projectFit||[]).map((p,i)=>(<div key={i} style={{background:p.keep?"#f0fdf4":"#f8fafc",borderRadius:12,padding:14,marginBottom:10,border:`1.5px solid ${p.keep?"#bbf7d0":C.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontWeight:700,color:C.text,fontSize:14}}>{p.name}</div><div style={{display:"flex",gap:6}}><span style={{background:scoreBg(p.relevance),color:scoreColor(p.relevance),fontSize:11,padding:"3px 10px",borderRadius:18,fontWeight:700}}>{p.relevance}%</span></div></div><div style={{color:"#475569",fontSize:12,marginBottom:6}}>{p.reason}</div>{p.suggestion&&<div style={{background:`${C.purple}08`,border:`1px solid ${C.purple}20`,borderRadius:8,padding:"7px 10px",fontSize:12,color:"#475569"}}>💡 {p.suggestion}</div>}</div>))}</div>)}
      {section==="resume"&&step==="optimized"&&optimized&&(<div>
        <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:10}}>
            <div><div style={{fontWeight:700,color:C.text,fontSize:15}}>✨ ATS-Optimized Resume</div><div style={{color:"#64748b",fontSize:12,marginTop:2}}>Education preserved · JD keywords mirrored · {hasExperienceInResume(resume)?"Experience rewritten with metrics":"Professional Summary added (fresher)"}</div></div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>handleDownload("pdf")} disabled={downloading==="pdf"} style={{padding:"9px 16px",borderRadius:9,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#5b21b6,#7c3aed)",color:"#fff",fontWeight:700,fontFamily:"'Inter',sans-serif",fontSize:13}}>{downloading==="pdf"?"⏳...":"⬇ PDF"}</button>
              <button onClick={()=>handleDownload("docx")} disabled={downloading==="docx"} style={{padding:"9px 16px",borderRadius:9,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#14532d,#16a34a)",color:"#fff",fontWeight:700,fontFamily:"'Inter',sans-serif",fontSize:13}}>{downloading==="docx"?"⏳...":"⬇ DOCX"}</button>
            </div>
          </div>
        </div>
        <JakesResumePreview data={optimized}/>
      </div>)}
      <div style={{marginTop:16}}>
        <button onClick={()=>{setStep("input");setAnalysis(null);setOptimized(null);setOptimizedScores(null);setErr("");setSection("overview");setJd("");setResume("");setFileName("");localStorage.removeItem("tp_jd");localStorage.removeItem("tp_resume");localStorage.removeItem("tp_fileName");}} style={{width:"100%",padding:"11px",borderRadius:9,border:`1.5px solid ${C.border}`,background:"transparent",color:"#64748b",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:13}}>🔄 Analyze Another Job</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// LANDING PAGE — STARTUP STYLE
// ══════════════════════════════════════════════════════════════════════════
function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{ const h=()=>setScrolled(window.scrollY>40); window.addEventListener("scroll",h); return()=>window.removeEventListener("scroll",h); },[]);

  const features = [
    { icon:"⚡", title:"Resume AI", desc:"Deep ATS analysis. Get exact match scores, keyword gaps, and one-click optimization in Jake's format.", color:"#2563eb" },
    { icon:"🧪", title:"Mock Tests", desc:"45 companies. 40 tests each. Aptitude MCQs + Coding rounds. Separate practice modes for smarter prep.", color:"#7c3aed" },
    { icon:"🔥", title:"Live Jobs", desc:"Real job listings from India's top companies. Powered by live API. Search by role and city.", color:"#dc2626" },
    { icon:"🔗", title:"LinkedIn Suite", desc:"AI-powered LinkedIn bio, headlines, cold messages, and cover letters. Get noticed by recruiters.", color:"#16a34a" },
  ];

  const stats = [
    ["45","Companies"],["40","Tests Each"],["94%","ATS Pass Rate"],["AI","Powered"],
  ];

  const companies = ["TCS 🏢","Infosys 🔷","Wipro 🌐","Amazon 📦","Google 🔍","Microsoft 🪟","Flipkart 🛒","Zomato 🍕","Razorpay 💳","PhonePe 📱"];

  return (
    <div style={{ background:"#fff", color:C.text, fontFamily:"'Inter',sans-serif", overflowX:"hidden" }}>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, background:scrolled?"rgba(255,255,255,.97)":"transparent", backdropFilter:scrolled?"blur(20px)":"none", borderBottom:scrolled?`1px solid ${C.border}`:"none", transition:"all .3s", padding:"0 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ fontWeight:900, fontSize:22, color:C.blue, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{fontSize:24}}>⚡</span> TakePlace
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="ghost" onClick={onGetStarted} style={{ padding:"8px 18px", fontSize:13 }}>Sign In</Btn>
            <Btn variant="cta" onClick={onGetStarted} className="glow-btn" style={{ padding:"8px 20px", fontSize:13 }}>Get Free Access →</Btn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"100px 24px 60px", background:"linear-gradient(160deg,#eff6ff 0%,#fff 45%,#f0fdf4 100%)", position:"relative", overflow:"hidden" }}>
        {/* BG decorations */}
        <div style={{position:"absolute",top:"10%",right:"5%",width:300,height:300,borderRadius:"50%",background:"linear-gradient(135deg,#2563eb08,#7c3aed08)",filter:"blur(60px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"5%",width:250,height:250,borderRadius:"50%",background:"linear-gradient(135deg,#16a34a08,#2563eb08)",filter:"blur(60px)",pointerEvents:"none"}}/>

        <div style={{ textAlign:"center", maxWidth:860, position:"relative" }}>
          <div className="fade" style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${C.blue}10`, border:`1px solid ${C.blue}30`, borderRadius:20, padding:"6px 16px", marginBottom:24, fontSize:12, color:C.blue, fontWeight:700 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:C.blue, display:"inline-block", animation:"pulse 1.5s infinite" }}/> 45 Companies · 40 Tests Each · Aptitude + Coding Modes
          </div>

          <div className="fade" style={{ fontWeight:900, fontSize:"clamp(32px,6vw,64px)", lineHeight:1.08, marginBottom:20, animationDelay:".1s", letterSpacing:"-0.02em" }}>
            Get Hired Faster<br/>
            <span style={{ background:"linear-gradient(135deg,#2563eb,#7c3aed)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>With AI on Your Side</span>
          </div>

          <div className="fade" style={{ fontSize:16, color:C.soft, lineHeight:1.9, marginBottom:28, maxWidth:560, margin:"0 auto 28px", animationDelay:".2s" }}>
            Resume ATS Analyzer · Mock Tests (TCS/Amazon/Google) · LinkedIn Suite · Live Jobs<br/>
            <strong style={{ color:C.text }}>Built specifically for Indian freshers. 100% free.</strong>
          </div>

          <div className="fade" style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:40, animationDelay:".3s" }}>
            <button onClick={onGetStarted} className="glow-btn"
              style={{ padding:"15px 36px", fontSize:16, borderRadius:12, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#2563eb,#1d4ed8)", color:"#fff", fontWeight:800, fontFamily:"'Inter',sans-serif", boxShadow:"0 4px 24px #2563eb50" }}>
              🚀 Start Free — No Credit Card
            </button>
            <button onClick={onGetStarted}
              style={{ padding:"15px 28px", fontSize:15, borderRadius:12, border:`1.5px solid ${C.border}`, cursor:"pointer", background:"#fff", color:C.text, fontWeight:700, fontFamily:"'Inter',sans-serif" }}>
              Watch Demo →
            </button>
          </div>

          {/* Stats bar */}
          <div className="fade" style={{ display:"flex", background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:20, overflow:"hidden", maxWidth:520, margin:"0 auto 40px", boxShadow:"0 4px 20px rgba(0,0,0,0.06)", animationDelay:".4s" }}>
            {stats.map((s,i,a)=>(
              <div key={i} style={{ flex:1, padding:"18px 8px", borderRight:i<a.length-1?`1px solid ${C.border}`:"none", textAlign:"center" }}>
                <div style={{ fontWeight:900, fontSize:22, color:C.blue }}>{s[0]}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{s[1]}</div>
              </div>
            ))}
          </div>

          {/* Company pills */}
          <div className="fade" style={{animationDelay:".5s"}}>
            <div style={{fontSize:12,color:C.muted,marginBottom:12,fontWeight:600}}>Prepare for top companies:</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
              {companies.map((c,i)=>(
                <span key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:600,color:C.soft}}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:"80px 24px", background:C.bg }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ fontWeight:900, fontSize:"clamp(24px,4vw,40px)", color:C.text, marginBottom:12 }}>Everything You Need to Get Hired</div>
            <div style={{ color:C.muted, fontSize:15, maxWidth:500, margin:"0 auto" }}>Four powerful tools working together. Resume, practice, LinkedIn, jobs — all in one place.</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:20 }}>
            {features.map((f,i)=>(
              <div key={i} style={{ background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:20, padding:24, borderTop:`3px solid ${f.color}`, boxShadow:"0 2px 12px rgba(0,0,0,0.04)", transition:"all .2s", cursor:"default" }}
                onMouseOver={e=>e.currentTarget.style.transform="translateY(-4px)"}
                onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{ fontSize:36, marginBottom:14 }}>{f.icon}</div>
                <div style={{ fontWeight:800, fontSize:17, color:C.text, marginBottom:8 }}>{f.title}</div>
                <div style={{ color:C.soft, fontSize:13, lineHeight:1.8 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOCK TEST HIGHLIGHT */}
      <section style={{ padding:"60px 24px", background:"#fff" }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"center" }}>
            <div>
              <div style={{ fontWeight:900, fontSize:"clamp(22px,3vw,36px)", color:C.text, marginBottom:16, lineHeight:1.2 }}>
                🧪 Mock Tests That Actually<br/><span style={{ color:C.blue }}>Match Real Exams</span>
              </div>
              <div style={{ color:C.soft, fontSize:14, lineHeight:1.9, marginBottom:24 }}>
                Two separate practice modes — Aptitude (MCQs) and Coding (DSA) — so you focus on what matters. 40 tests per company, each with unique AI-generated questions.
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                {[
                  ["📊","Aptitude Mode","20 MCQs · 30 min · Quant, Verbal, Reasoning"],
                  ["💻","Coding Mode","5 DSA Problems · 60 min · Live Code Runner"],
                  ["🏆","Score Tracking","Track progress across all 45 companies"],
                ].map(([e,t,d])=>(
                  <div key={t} style={{ display:"flex", gap:12, alignItems:"flex-start", background:C.bg, borderRadius:12, padding:"12px 16px" }}>
                    <span style={{ fontSize:20, flexShrink:0 }}>{e}</span>
                    <div><div style={{ fontWeight:700, color:C.text, fontSize:13 }}>{t}</div><div style={{ fontSize:12, color:C.muted }}>{d}</div></div>
                  </div>
                ))}
              </div>
              <Btn variant="cta" onClick={onGetStarted} style={{ padding:"12px 28px" }}>Start Practicing Free →</Btn>
            </div>
            <div style={{ background:"linear-gradient(135deg,#0f172a,#1e293b)", borderRadius:20, padding:24, boxShadow:"0 8px 32px rgba(0,0,0,0.2)" }}>
              <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                {["📊 Aptitude","💻 Coding"].map((t,i)=>(
                  <div key={i} style={{ flex:1, background:i===0?"#2563eb":"#1e293b", borderRadius:10, padding:"10px", textAlign:"center", fontSize:12, fontWeight:700, color:"#fff", border:i===1?"1px solid #334155":"none" }}>{t}</div>
                ))}
              </div>
              {[
                { q:"A train 150m long passes a pole in 15 sec. Speed in km/h?", opts:["30","36 ✓","40","45"], color:"#7c3aed" },
                { q:"Time complexity of Binary Search?", opts:["O(n)","O(n²)","O(log n) ✓","O(1)"], color:"#2563eb" },
                { q:"Find two numbers that sum to target — Two Sum", opts:null, code:true, color:"#16a34a" },
              ].map((item,i)=>(
                <div key={i} style={{ background:i===2?"#0f172a":"#1e293b", borderRadius:12, padding:12, marginBottom:10, border:`1px solid ${item.color}30` }}>
                  <div style={{ fontSize:11, color:"#94a3b8", marginBottom:6 }}>{item.q}</div>
                  {item.opts ? (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {item.opts.map((o,j)=>(
                        <span key={j} style={{ background:o.includes("✓")?"#16a34a20":"#334155", color:o.includes("✓")?"#86efac":"#94a3b8", fontSize:10, padding:"3px 8px", borderRadius:6, border:o.includes("✓")?"1px solid #16a34a40":"none" }}>{o}</span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#86efac" }}>{"function solution(input) {\n  const {nums, target} = JSON.parse(input);\n  // your code here\n}"}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL / SOCIAL PROOF */}
      <section style={{ padding:"60px 24px", background:C.bg }}>
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontWeight:900, fontSize:"clamp(20px,3vw,32px)", color:C.text, marginBottom:12 }}>Join Thousands of Freshers Getting Hired</div>
          <div style={{ color:C.muted, fontSize:14, marginBottom:36 }}>From tier-2 colleges to FAANG offers — TakePlace helps you bridge the gap.</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
            {[
              { name:"Rahul K.", role:"SDE @ Infosys", text:"The ATS analyzer showed exactly what keywords I was missing. Got shortlisted in 2 weeks!", avatar:"R" },
              { name:"Priya S.", role:"Dev @ Cognizant", text:"Mock tests were spot on for TCS NQT pattern. Cleared in first attempt!", avatar:"P" },
              { name:"Arjun M.", role:"SWE @ Amazon", text:"LinkedIn Suite helped me craft a bio that got 10x profile views. Amazing tool!", avatar:"A" },
            ].map((t,i)=>(
              <div key={i} style={{ background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:16, padding:20, textAlign:"left" }}>
                <div style={{ color:C.warn, fontSize:13, marginBottom:8 }}>★★★★★</div>
                <div style={{ color:C.soft, fontSize:12, lineHeight:1.8, marginBottom:12 }}>"{t.text}"</div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, color:"#fff" }}>{t.avatar}</div>
                  <div><div style={{ fontWeight:700, fontSize:12, color:C.text }}>{t.name}</div><div style={{ fontSize:11, color:C.muted }}>{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"60px 24px", background:"linear-gradient(135deg,#eff6ff,#f0fdf4)" }}>
        <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontWeight:900, fontSize:"clamp(22px,4vw,36px)", color:C.text, marginBottom:12 }}>Ready to Get Hired?</div>
          <div style={{ color:C.soft, fontSize:14, marginBottom:28, lineHeight:1.8 }}>Start free, no credit card needed. Join thousands of freshers using TakePlace to land their dream jobs.</div>
          <button onClick={onGetStarted} className="glow-btn"
            style={{ padding:"16px 48px", fontSize:17, borderRadius:14, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#2563eb,#1d4ed8)", color:"#fff", fontWeight:800, fontFamily:"'Inter',sans-serif", boxShadow:"0 4px 24px #2563eb50" }}>
            🚀 Start Free Now →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"28px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1000, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <div style={{ fontWeight:900, fontSize:18, color:C.blue }}>⚡ TakePlace</div>
          <div style={{ color:C.muted, fontSize:12 }}>
            © 2026 TakePlace · Developed by Raghu Dadigela ·{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color:C.blue, textDecoration:"none", fontWeight:600 }}>{SUPPORT_EMAIL}</a>
          </div>
          <div style={{ display:"flex", gap:16, fontSize:12 }}>
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color:C.muted, textDecoration:"none" }}>Support</a>
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color:C.muted, textDecoration:"none" }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// AUTH PAGE — FIXED PASSWORD RESET
// ══════════════════════════════════════════════════════════════════════════
function AuthPage({ onLogin, onBack }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [err, setErr] = useState(""); const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false); const [googleLoading, setGoogleLoading] = useState(false);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleGoogle = async () => {
    setGoogleLoading(true); setErr("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider:"google",
        options:{ redirectTo: window.location.href }
      });
      if (error) throw error;
    } catch(e) { setErr(e.message); setGoogleLoading(false); }
  };

  const handleForgot = async () => {
    if (!form.email.trim()) { setErr("Enter your email address first."); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setErr("Enter a valid email address."); return; }
    setLoading(true); setErr(""); setMsg("");
    try {
      // Use the current app URL for redirect — no external URL dependency
      const redirectUrl = window.location.origin + window.location.pathname;
      const { error } = await supabase.auth.resetPasswordForEmail(form.email.trim(), {
        redirectTo: redirectUrl
      });
      if (error) throw error;
      setMsg("✅ Reset email sent! Check your inbox. Click the link in the email to reset your password.");
    } catch(e) {
      setErr("Failed to send reset email: " + e.message);
    }
    setLoading(false);
  };

  const handle = async () => {
    setErr(""); setMsg(""); setLoading(true);
    try {
      if (mode==="register") {
        if (!form.name.trim()||!form.email.trim()||!form.password) throw new Error("All fields required");
        if (form.password.length<6) throw new Error("Password must be at least 6 characters");
        const { error } = await supabase.auth.signUp({
          email:form.email.trim(),
          password:form.password,
          options:{ data:{ full_name:form.name.trim() } }
        });
        if (error) throw error;
        setMsg("✅ Account created! Check your email to confirm, then sign in.");
        setMode("login");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email:form.email.trim(),
          password:form.password
        });
        if (error) throw error;
        onLogin(data.user);
      }
    } catch(e) { setErr(e.message||"Something went wrong"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#eff6ff 0%,#fff 60%,#f0fdf4 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{css}</style>
      <div className="fade" style={{ width:"100%", maxWidth:420, background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:24, padding:"32px", boxShadow:"0 16px 48px rgba(37,99,235,0.10)" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.muted, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", marginBottom:20 }}>← Back to home</button>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:40, marginBottom:6 }}>⚡</div>
          <div style={{ fontWeight:900, fontSize:24, color:C.blue }}>TakePlace</div>
          <div style={{ color:C.muted, fontSize:13, marginTop:4 }}>{mode==="login"?"Welcome back 👋":mode==="register"?"Create your account ✨":"Reset your password 🔑"}</div>
        </div>

        {mode!=="forgot"&&(<>
          <button onClick={handleGoogle} disabled={googleLoading}
            style={{ width:"100%", padding:"11px", borderRadius:10, border:`1.5px solid ${C.border}`, background:"#fff", color:C.text, fontSize:14, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:16 }}>
            {googleLoading?<SpinIcon size={16}/>:<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
            Continue with Google
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ flex:1, height:1, background:C.border }}/><span style={{ color:C.muted, fontSize:12 }}>or</span><div style={{ flex:1, height:1, background:C.border }}/>
          </div>
          <div style={{ display:"flex", background:C.bg, borderRadius:10, padding:4, marginBottom:20 }}>
            {["login","register"].map(m=>(<button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}} style={{ flex:1, padding:"9px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:13, background:mode===m?"#fff":"transparent", color:mode===m?C.blue:C.muted, boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>{m==="login"?"Sign In":"Register"}</button>))}
          </div>
        </>)}

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {mode==="register"&&<input style={inp} placeholder="Full name" value={form.name} onChange={e=>set("name",e.target.value)}/>}
          <input style={inp} placeholder="Email address" type="email" value={form.email} onChange={e=>set("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
          {mode!=="forgot"&&<input style={inp} placeholder="Password" type="password" value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>}
        </div>

        {err&&<div style={{ color:C.danger, fontSize:12, marginTop:10, background:"#fef2f2", padding:"8px 12px", borderRadius:8 }}>⚠ {err}</div>}
        {msg&&<div style={{ color:C.green, fontSize:12, marginTop:10, background:"#f0fdf4", padding:"8px 12px", borderRadius:8 }}>{msg}</div>}

        {mode==="forgot"?(
          <>
            <Btn variant="cta" onClick={handleForgot} loading={loading} style={{ width:"100%", marginTop:18, padding:"12px" }}>Send Reset Email →</Btn>
            <button onClick={()=>{setMode("login");setErr("");setMsg("");}} style={{ width:"100%", marginTop:10, padding:"9px", background:"none", border:"none", color:C.muted, fontSize:13, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>← Back to Sign In</button>
          </>
        ):(
          <>
            <Btn variant="cta" onClick={handle} loading={loading} style={{ width:"100%", marginTop:18, padding:"12px", fontSize:14 }}>{mode==="login"?"Sign In →":"Create Account →"}</Btn>
            {mode==="login"&&<button onClick={()=>{setMode("forgot");setErr("");setMsg("");}} style={{ width:"100%", marginTop:10, padding:"8px", background:"none", border:"none", color:C.muted, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", textDecoration:"underline" }}>Forgot password?</button>}
          </>
        )}

        <div style={{ marginTop:16, textAlign:"center", fontSize:11, color:C.muted }}>
          Need help? <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color:C.blue, textDecoration:"none" }}>{SUPPORT_EMAIL}</a>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN APP — MOBILE-RESPONSIVE SIDEBAR
// ══════════════════════════════════════════════════════════════════════════
function MainApp({ user, onLogout }) {
  const [tab, setTab] = useState(() => parseInt(sessionStorage.getItem("tp_tab")||"0"));
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");
  const [search, setSearch] = useState(() => sessionStorage.getItem("tp_search")||"software engineer fresher");
  const [location, setLocation] = useState(() => sessionStorage.getItem("tp_loc")||"hyderabad");
  const [expandedJob, setExpandedJob] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const name = user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";
  const isMobile = window.innerWidth < 768;

  useEffect(()=>{ fetchJobs(); },[]);

  const setTabPersist = (t) => { setTab(t); sessionStorage.setItem("tp_tab",t); setMobileMenuOpen(false); };

  const fetchJobs = async (q=search, loc=location) => {
    setJobsLoading(true); setJobsError("");
    sessionStorage.setItem("tp_search",q); sessionStorage.setItem("tp_loc",loc);
    try {
      const url=`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&what=${encodeURIComponent(q)}&where=${encodeURIComponent(loc)}&sort_by=date&content-type=application/json`;
      const res=await fetch(url); const data=await res.json();
      if(data.results?.length>0){
        setJobs(data.results.map(j=>({id:j.id,title:j.title,company:j.company?.display_name||"Company",location:j.location?.display_name||loc,salary:j.salary_min?`₹${Math.round(j.salary_min/100000)}–${Math.round((j.salary_max||j.salary_min*1.5)/100000)} LPA`:"Competitive",description:j.description||"No description.",descriptionShort:(j.description||"").slice(0,220),url:j.redirect_url,posted:new Date(j.created).toLocaleDateString("en-IN",{day:"numeric",month:"short"}),category:j.category?.label||"Technology"})));
      } else setJobsError("No jobs found. Try 'java developer' or 'data analyst'.");
    } catch { setJobsError("Could not load jobs. Check connection."); }
    setJobsLoading(false);
  };

  const NAV = [
    { icon:"🔥", label:"Live Jobs", tab:0 },
    { icon:"⚡", label:"Resume AI", tab:1 },
    { icon:"🧪", label:"Mock Tests", tab:2 },
    { icon:"🔗", label:"LinkedIn", tab:3 },
  ];

  const TOTAL_TESTS_DONE = Object.keys(localStorage).filter(k=>k.startsWith("tp_score_")).length;

  // Mobile bottom nav
  if (isMobile) return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", background:C.bg, fontFamily:"'Inter',sans-serif" }}>
      <style>{css}</style>

      {/* Mobile Top Bar */}
      <div style={{ background:C.sidebar, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:18 }}>⚡</span>
          <span style={{ fontWeight:900, fontSize:16, color:"#fff" }}>TakePlace</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {TOTAL_TESTS_DONE>0&&<Tag color={C.purple} bg="#7c3aed20">🧪 {TOTAL_TESTS_DONE}</Tag>}
          <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.blueLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:11, color:"#fff" }}>{name[0].toUpperCase()}</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflow:"auto", padding:"16px", paddingBottom:80 }}>
        {tab===0&&<JobsTab jobs={jobs} jobsLoading={jobsLoading} jobsError={jobsError} search={search} setSearch={setSearch} location={location} setLocation={setLocation} fetchJobs={fetchJobs} expandedJob={expandedJob} setExpandedJob={setExpandedJob} setTabPersist={setTabPersist}/>}
        {tab===1&&<ResumeAnalyzer user={user}/>}
        {tab===2&&<MockTestEngine user={user}/>}
        {tab===3&&<LinkedInSuite user={user}/>}
      </div>

      {/* Mobile Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#fff", borderTop:`1px solid ${C.border}`, display:"flex", zIndex:100 }}>
        {NAV.map(n=>(
          <button key={n.tab} onClick={()=>setTabPersist(n.tab)}
            style={{ flex:1, padding:"10px 4px 8px", border:"none", background:"transparent", cursor:"pointer", fontFamily:"'Inter',sans-serif", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <span style={{ fontSize:20 }}>{n.icon}</span>
            <span style={{ fontSize:9, fontWeight:tab===n.tab?800:500, color:tab===n.tab?C.blue:C.muted }}>{n.label}</span>
            {tab===n.tab&&<div style={{ width:18, height:2, background:C.blue, borderRadius:2 }}/>}
          </button>
        ))}
        <button onClick={onLogout} style={{ flex:1, padding:"10px 4px 8px", border:"none", background:"transparent", cursor:"pointer", fontFamily:"'Inter',sans-serif", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
          <span style={{ fontSize:20 }}>👤</span>
          <span style={{ fontSize:9, fontWeight:500, color:C.muted }}>Sign Out</span>
        </button>
      </div>
    </div>
  );

  // Desktop layout
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'Inter',sans-serif" }}>
      <style>{css}</style>

      {/* SIDEBAR */}
      <div style={{ width:sidebarOpen?220:62, background:C.sidebar, display:"flex", flexDirection:"column", padding:"18px 10px", transition:"width .25s", flexShrink:0, position:"sticky", top:0, height:"100vh", overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28, paddingLeft:4 }}>
          <span style={{ fontSize:20, flexShrink:0 }}>⚡</span>
          {sidebarOpen&&<span style={{ fontWeight:900, fontSize:17, color:"#fff", whiteSpace:"nowrap" }}>TakePlace</span>}
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:3 }}>
          {NAV.map(n=>(
            <div key={n.tab} className="sidebar-item" onClick={()=>setTabPersist(n.tab)}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 10px", borderRadius:10, background:tab===n.tab?C.sidebarActive:"transparent" }}>
              <span style={{ fontSize:17, flexShrink:0 }}>{n.icon}</span>
              {sidebarOpen&&<span style={{ color:tab===n.tab?"#fff":"#94a3b8", fontSize:13, fontWeight:tab===n.tab?700:500, whiteSpace:"nowrap" }}>{n.label}</span>}
            </div>
          ))}
        </div>
        {sidebarOpen&&TOTAL_TESTS_DONE>0&&(
          <div style={{ background:"#1e293b", borderRadius:10, padding:"10px 12px", marginBottom:10 }}>
            <div style={{ color:"#64748b", fontSize:10, marginBottom:2 }}>Tests Completed</div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{TOTAL_TESTS_DONE}</div>
          </div>
        )}
        {sidebarOpen&&(
          <div style={{ background:"#1e293b", borderRadius:10, padding:"10px 12px", marginBottom:10 }}>
            <div style={{ color:"#64748b", fontSize:10, marginBottom:2 }}>Support</div>
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color:"#7dd3fc", fontSize:11, textDecoration:"none", wordBreak:"break-all" }}>{SUPPORT_EMAIL}</a>
          </div>
        )}
        <div style={{ borderTop:"1px solid #1e293b", paddingTop:10, display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.blueLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, color:"#fff", flexShrink:0 }}>{name[0].toUpperCase()}</div>
          {sidebarOpen&&(
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:"#fff", fontSize:11, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{name.split(" ")[0]}</div>
              <button onClick={onLogout} style={{ background:"none", border:"none", color:"#64748b", fontSize:10, cursor:"pointer", fontFamily:"'Inter',sans-serif", padding:0, marginTop:1 }}>Sign out</button>
            </div>
          )}
          <button onClick={()=>setSidebarOpen(o=>!o)} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer", padding:4, flexShrink:0, fontSize:12 }}>
            {sidebarOpen?"◀":"▶"}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, overflow:"auto", minHeight:"100vh" }}>
        <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, padding:"0 24px", position:"sticky", top:0, zIndex:50, height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontWeight:700, fontSize:17, color:C.text }}>
            {NAV.find(n=>n.tab===tab)?.icon} {NAV.find(n=>n.tab===tab)?.label}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {TOTAL_TESTS_DONE>0&&<Tag color={C.purple}>🧪 {TOTAL_TESTS_DONE} tests</Tag>}
            <Tag color={C.green}>🟢 Active</Tag>
          </div>
        </div>
        <div style={{ padding:"24px", maxWidth:880, margin:"0 auto" }}>
          {tab===0&&<JobsTab jobs={jobs} jobsLoading={jobsLoading} jobsError={jobsError} search={search} setSearch={setSearch} location={location} setLocation={setLocation} fetchJobs={fetchJobs} expandedJob={expandedJob} setExpandedJob={setExpandedJob} setTabPersist={setTabPersist}/>}
          {tab===1&&<ResumeAnalyzer user={user}/>}
          {tab===2&&<MockTestEngine user={user}/>}
          {tab===3&&<LinkedInSuite user={user}/>}
        </div>
      </div>
    </div>
  );
}

// ── JOBS TAB ─────────────────────────────────────────────────────────────
function JobsTab({ jobs, jobsLoading, jobsError, search, setSearch, location, setLocation, fetchJobs, expandedJob, setExpandedJob, setTabPersist }) {
  const isMobile = window.innerWidth < 768;
  return (
    <div>
      <div style={{ background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:14, padding:18, marginBottom:18 }}>
        <div style={{ fontWeight:700, color:C.text, fontSize:14, marginBottom:12 }}>🔍 Search Live Jobs</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
          <input style={inp} placeholder="Role (react developer...)" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs(search,location)}/>
          <input style={inp} placeholder="City (hyderabad...)" value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs(search,location)}/>
        </div>
        <Btn variant="cta" onClick={()=>fetchJobs(search,location)} style={{ width:"100%" }}>🔍 Search Jobs</Btn>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div style={{ fontWeight:800, fontSize:17, color:C.text }}>Live Job Feed</div>
        {!jobsLoading&&jobs.length>0&&(<div style={{ display:"flex", alignItems:"center", gap:5, background:"#f0fdf4", borderRadius:18, padding:"4px 12px", border:"1px solid #bbf7d0" }}><div style={{ width:6, height:6, borderRadius:"50%", background:C.green, animation:"pulse 1.5s infinite" }}/><span style={{ color:C.green, fontSize:11, fontWeight:700 }}>{jobs.length} live</span></div>)}
      </div>
      {jobsLoading&&(<div style={{ textAlign:"center", padding:"50px 20px" }}><SpinIcon size={36} color={C.blue}/><div style={{ color:C.muted, fontSize:13, marginTop:12 }}>Fetching real jobs...</div></div>)}
      {jobsError&&<div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:18, color:C.danger, textAlign:"center", fontSize:13 }}>{jobsError}</div>}
      {!jobsLoading&&jobs.map((job,i)=>{
        const isExp=expandedJob===job.id;
        return(
          <div key={job.id} className="fade" style={{ background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:14, padding:"14px 16px", marginBottom:8, borderLeft:`3px solid ${C.blue}`, animationDelay:`${i*0.04}s`, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{job.title}</div>
                <div style={{ color:C.soft, fontSize:12, marginTop:1 }}>{job.company} · {job.location}</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0, marginLeft:12 }}>
                <div style={{ color:C.green, fontWeight:800, fontSize:13 }}>{job.salary}</div>
                <div style={{ color:C.muted, fontSize:11, marginTop:1 }}>{job.posted}</div>
              </div>
            </div>
            <div style={{ color:C.muted, fontSize:12, lineHeight:1.7, marginBottom:10, background:C.bg, borderRadius:8, padding:"8px 10px" }}>
              {isExp?job.description:job.descriptionShort+(job.description.length>220?"...":"")}
              {job.description.length>220&&(<button onClick={()=>setExpandedJob(isExp?null:job.id)} style={{ background:"none", border:"none", color:C.blue, fontSize:11, cursor:"pointer", marginLeft:5, fontFamily:"'Inter',sans-serif", fontWeight:600 }}>{isExp?"less ▲":"more ▼"}</button>)}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
              <Tag color={C.blue}>{job.category}</Tag>
              <div style={{ display:"flex", gap:8 }}>
                <Btn variant="ghost" onClick={()=>setTabPersist(1)} size="sm">⚡ Analyze</Btn>
                <Btn variant="cta" onClick={()=>window.open(job.url,"_blank")} size="sm">Apply →</Btn>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [appLoading, setAppLoading] = useState(true);
  const [page, setPage] = useState("landing");

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){setUser(session.user);setPage("app");}
      setAppLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user){setUser(session.user);setPage("app");}
      else{setUser(null);setPage("landing");}
    });
    return () => subscription.unsubscribe();
  },[]);

  const handleLogin=(u)=>{ setUser(u); setPage("app"); };
  const handleLogout=async()=>{ await supabase.auth.signOut(); setUser(null); setPage("landing"); };

  if(appLoading) return(
    <div style={{minHeight:"100vh",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14}}>
      <style>{css}</style>
      <SpinIcon size={40} color={C.blue}/>
      <div style={{color:C.muted,fontSize:13,fontFamily:"'Inter',sans-serif"}}>Loading TakePlace...</div>
    </div>
  );

  if(page==="landing") return <LandingPage onGetStarted={()=>setPage("auth")}/>;
  if(page==="auth") return <AuthPage onLogin={handleLogin} onBack={()=>setPage("landing")}/>;
  return <MainApp user={user} onLogout={handleLogout}/>;
}
