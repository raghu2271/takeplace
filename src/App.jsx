import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID  = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const supabase   = createClient(SUPABASE_URL, SUPABASE_KEY);

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
  @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
  @keyframes countUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes timerPulse{0%,100%{box-shadow:0 0 0 0 #dc262630}50%{box-shadow:0 0 0 8px #dc262600}}
  @keyframes testPass{0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)}}
  .fade{animation:fadeUp .35s ease forwards;}
  .fadeIn{animation:fadeIn .25s ease forwards;}
  .slideIn{animation:slideIn .3s ease forwards;}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  .float{animation:float 3s ease-in-out infinite;}
  .pass-anim{animation:testPass .4s ease;}
  input:focus,textarea:focus,select:focus{border-color:#2563eb!important;outline:none;box-shadow:0 0 0 3px #2563eb18;}
  button:active{transform:scale(.97);}
  .timer-warn{animation:timerPulse 1s infinite;}
  .sidebar-item{transition:all .18s;border-radius:10px;cursor:pointer;}
  .sidebar-item:hover{background:#1e293b;}
  .hover-card{transition:all .2s;cursor:pointer;}
  .hover-card:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,0.10);}
  .code-editor{font-family:'JetBrains Mono',monospace!important;font-size:13px!important;line-height:1.7!important;tab-size:2;}
  .test-case-row{transition:all .3s;}
`;

// ─── SHARED UI ──────────────────────────────────────────────────────────────
const inp = {
  width:"100%", background:"#ffffff", border:`1.5px solid ${C.border}`,
  borderRadius:10, padding:"11px 14px", color:C.text, fontSize:14,
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
async function callAI(prompt, maxTokens=1500, mode="json", retries=2) {
  for (let attempt=0; attempt<=retries; attempt++) {
    try {
      const res = await fetch("/api/ai", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ prompt, maxTokens, mode }),
      });
      if (!res.ok) throw new Error("AI error "+res.status);
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
  key: (companyKey, testNum) => `tp_score_${companyKey}_test${testNum}`,
  save: (companyKey, testNum, score, total, timeTaken) => {
    const entry = { score, total, pct: total>0?Math.round((score/total)*100):null, timeTaken, date: new Date().toISOString() };
    localStorage.setItem(ScoreDB.key(companyKey,testNum), JSON.stringify(entry));
  },
  get: (companyKey, testNum) => {
    const raw = localStorage.getItem(ScoreDB.key(companyKey,testNum));
    return raw ? JSON.parse(raw) : null;
  },
  getAll: (companyKey) => {
    const results = [];
    for (let i=1;i<=40;i++) {
      const r = ScoreDB.get(companyKey, i);
      if (r) results.push({ testNum:i, ...r });
    }
    return results;
  },
  getStats: (companyKey) => {
    const all = ScoreDB.getAll(companyKey);
    if (!all.length) return { completed:0, avg:0, best:0, totalTests:40 };
    const pcts = all.filter(r=>r.pct!==null).map(r=>r.pct);
    return {
      completed: all.length,
      avg: pcts.length ? Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length) : null,
      best: pcts.length ? Math.max(...pcts) : null,
      totalTests: 40,
    };
  },
};

// ══════════════════════════════════════════════════════════════════════════
// COMPANY DATA — 35 COMPANIES
// ══════════════════════════════════════════════════════════════════════════
const SERVICE_COMPANIES = {
  tcs:        { name:"TCS", full:"TCS NQT", color:"#1d4ed8", emoji:"🏢", type:"service", desc:"NQT pattern. Foundation + Advanced. Numerical, Verbal, Reasoning, Coding.", focus:["Numerical Ability","Verbal English","Logical Reasoning","Coding (Java/Python)"] },
  infosys:    { name:"Infosys", full:"Infosys InfyTQ", color:"#7c3aed", emoji:"🔷", type:"service", desc:"InfyTQ exam. Aptitude + Reasoning + Verbal + Power Programmer coding.", focus:["Aptitude","Verbal","Reasoning","Coding"] },
  wipro:      { name:"Wipro", full:"Wipro NLTH", color:"#16a34a", emoji:"🌐", type:"service", desc:"NLTH pattern. Aptitude + Essay + Coding. No negative marking.", focus:["Aptitude","Reasoning","Essay","Coding"] },
  hcl:        { name:"HCL", full:"HCL TechBee", color:"#0284c7", emoji:"🔵", type:"service", desc:"TechBee hiring. Aptitude, Reasoning, Technical MCQs, Coding.", focus:["Aptitude","Technical MCQ","Reasoning","Coding"] },
  cognizant:  { name:"Cognizant", full:"Cognizant GenC", color:"#ea580c", emoji:"🟠", type:"service", desc:"GenC / GenC Elevate. Aptitude + Coding + Communication.", focus:["Aptitude","Reasoning","Communication","Coding"] },
  accenture:  { name:"Accenture", full:"Accenture Hiring", color:"#a855f7", emoji:"💜", type:"service", desc:"4-section test: Aptitude, Critical Thinking, Coding + Communication Assessment.", focus:["Aptitude","Critical Thinking","Coding","Communication"] },
  capgemini:  { name:"Capgemini", full:"Capgemini Tech", color:"#0891b2", emoji:"🟦", type:"service", desc:"Pseudo Code + Behavioural + Game-Based + Technical round questions.", focus:["Pseudo Code","Behavioural","Technical","Aptitude"] },
  techmah:    { name:"Tech Mahindra", full:"TechMahindra Hiring", color:"#dc2626", emoji:"🔴", type:"service", desc:"Aptitude + Verbal + Technical + Coding round pattern.", focus:["Aptitude","Verbal","Technical","Coding"] },
  lti:        { name:"LTIMindtree", full:"LTIMindtree Hiring", color:"#059669", emoji:"🟩", type:"service", desc:"Aptitude, Reasoning, Verbal + Technical + Coding sections.", focus:["Aptitude","Reasoning","Technical MCQ","Coding"] },
  mphasis:    { name:"Mphasis", full:"Mphasis Fresher", color:"#7c2d12", emoji:"🟤", type:"service", desc:"Quantitative + Reasoning + Verbal + Technical + Coding.", focus:["Quantitative","Verbal","Technical","Coding"] },
  hexaware:   { name:"Hexaware", full:"Hexaware PACE", color:"#0f766e", emoji:"🌊", type:"service", desc:"PACE program. Aptitude, Verbal, Reasoning, Technical, Coding sections.", focus:["Aptitude","Verbal","Technical","Coding"] },
  persistent: { name:"Persistent", full:"Persistent Hiring", color:"#1e40af", emoji:"💙", type:"service", desc:"Aptitude + Verbal + Coding. Java/Python/C++ preferred.", focus:["Aptitude","Verbal","Coding","Problem Solving"] },
  birlasoft:  { name:"Birlasoft", full:"Birlasoft Fresher", color:"#92400e", emoji:"🟫", type:"service", desc:"Aptitude + Reasoning + Technical + Coding.", focus:["Aptitude","Reasoning","Technical","Coding"] },
  kpit:       { name:"KPIT", full:"KPIT Technologies", color:"#4338ca", emoji:"🚗", type:"service", desc:"Automotive tech focus. Aptitude + Technical + Embedded Systems + Coding.", focus:["Aptitude","Technical MCQ","Embedded/Automotive","Coding"] },
  zensar:     { name:"Zensar", full:"Zensar Technologies", color:"#0e7490", emoji:"⚡", type:"service", desc:"Aptitude + Reasoning + Technical + Coding round.", focus:["Aptitude","Reasoning","Technical","Coding"] },
  cyient:     { name:"Cyient", full:"Cyient Technologies", color:"#6d28d9", emoji:"🛩️", type:"service", desc:"Engineering + IT. Aptitude + Technical + Coding pattern.", focus:["Aptitude","Technical","Engineering MCQ","Coding"] },
  mindtree:   { name:"Mindtree", full:"Mindtree Hiring", color:"#065f46", emoji:"🌿", type:"service", desc:"Aptitude + Technical + Coding. Java/Python focused.", focus:["Aptitude","Technical MCQ","Coding","Verbal"] },
  syntel:     { name:"Syntel", full:"Syntel Fresher", color:"#7f1d1d", emoji:"🔺", type:"service", desc:"Aptitude + Verbal + Coding + Communication round.", focus:["Aptitude","Verbal","Coding","Communication"] },
  mastech:    { name:"Mastech Digital", full:"Mastech Hiring", color:"#134e4a", emoji:"🔶", type:"service", desc:"Aptitude + Reasoning + Technical + Coding questions.", focus:["Aptitude","Reasoning","Technical","Coding"] },
  niit:       { name:"NIIT Technologies", full:"NIIT Tech Hiring", color:"#1d4ed8", emoji:"📚", type:"service", desc:"Aptitude + Verbal + Reasoning + Technical + Coding.", focus:["Aptitude","Verbal","Reasoning","Coding"] },
};

const PRODUCT_COMPANIES = {
  amazon:     { name:"Amazon", full:"Amazon SDE OA", color:"#d97706", emoji:"📦", type:"product", desc:"OA: 2 DSA + Work Simulation + 16 Leadership Principles.", focus:["DSA Coding","Leadership Principles","Work Simulation","System Design"] },
  microsoft:  { name:"Microsoft", full:"Microsoft SDE", color:"#0284c7", emoji:"🪟", type:"product", desc:"DSA rounds + System Design + Behavioral. FAANG level.", focus:["DSA/Algorithms","System Design","Behavioral","Debugging"] },
  google:     { name:"Google", full:"Google SWE", color:"#dc2626", emoji:"🔍", type:"product", desc:"Coding interviews: Graphs, DP, optimization. Multiple rounds.", focus:["Coding/DSA","System Design","Behavioral","LLD"] },
  flipkart:   { name:"Flipkart", full:"Flipkart SDE", color:"#f59e0b", emoji:"🛒", type:"product", desc:"OA: DSA + Technical + Product Thinking. Indian FAANG.", focus:["DSA","Product Sense","Technical MCQ","System Design"] },
  zomato:     { name:"Zomato", full:"Zomato SDE", color:"#ef4444", emoji:"🍕", type:"product", desc:"DSA + Product Sense + Case Studies. Fast-paced startup culture.", focus:["DSA","Product Sense","Case Study","SQL/Data"] },
  razorpay:   { name:"Razorpay", full:"Razorpay SDE", color:"#3b82f6", emoji:"💳", type:"product", desc:"Fintech focus. DSA + System Design + Payments domain knowledge.", focus:["DSA","System Design","Fintech MCQ","Behavioral"] },
  phonepe:    { name:"PhonePe", full:"PhonePe SDE", color:"#7c3aed", emoji:"📱", type:"product", desc:"DSA + Backend Design + Payments/UPI domain questions.", focus:["DSA","Backend Design","Payments Domain","Behavioral"] },
  paytm:      { name:"Paytm", full:"Paytm Tech", color:"#1d4ed8", emoji:"💰", type:"product", desc:"DSA + Technical MCQ + Fintech domain + System Design.", focus:["DSA","Technical MCQ","Fintech","System Design"] },
  swiggy:     { name:"Swiggy", full:"Swiggy SDE", color:"#f97316", emoji:"🛵", type:"product", desc:"DSA + System Design (delivery systems) + Behavioral.", focus:["DSA","System Design","Behavioral","Product Thinking"] },
  meesho:     { name:"Meesho", full:"Meesho SDE", color:"#ec4899", emoji:"🛍️", type:"product", desc:"DSA + Product Sense + E-commerce domain + Behavioral.", focus:["DSA","Product Sense","E-commerce Domain","Behavioral"] },
  cred:       { name:"CRED", full:"CRED Tech", color:"#1e293b", emoji:"💎", type:"product", desc:"DSA + Product Thinking + Design + Fintech/Lending domain.", focus:["DSA","Product Design","Fintech","System Design"] },
  atlassian:  { name:"Atlassian", full:"Atlassian SDE", color:"#0052cc", emoji:"🔧", type:"product", desc:"Coding + System Design + Values (Open Company, No Bullshit).", focus:["DSA","System Design","Values/Behavioral","Technical MCQ"] },
  adobe:      { name:"Adobe", full:"Adobe SDE", color:"#ff0000", emoji:"🎨", type:"product", desc:"DSA + Creative tech + Machine Learning basics + System Design.", focus:["DSA","ML/AI MCQ","System Design","Behavioral"] },
  salesforce: { name:"Salesforce", full:"Salesforce SDE", color:"#00a1e0", emoji:"☁️", type:"product", desc:"DSA + Salesforce Platform + Apex/SOQL + Behavioral.", focus:["DSA","Salesforce Platform","Technical MCQ","Behavioral"] },
  uber:       { name:"Uber", full:"Uber SDE", color:"#000000", emoji:"🚘", type:"product", desc:"DSA + Maps/Routing algorithms + System Design + Behavioral.", focus:["DSA","Maps/Graph Algorithms","System Design","Behavioral"] },
};

const ALL_COMPANIES = { ...SERVICE_COMPANIES, ...PRODUCT_COMPANIES };

// Generate section mix for a given company + test number
function getTestSections(companyKey, testNum) {
  const c = ALL_COMPANIES[companyKey];
  if (!c) return [];
  if (c.type === "service") {
    // Rotate section focus based on test number
    const servicePatterns = [
      [{ id:"mcq_numerical", label:"Numerical Ability", icon:"🔢", count:8, time:15 },{ id:"mcq_verbal", label:"Verbal Ability", icon:"📝", count:8, time:15 },{ id:"mcq_reasoning", label:"Logical Reasoning", icon:"🧩", count:8, time:15 },{ id:"coding", label:"Coding", icon:"💻", count:2, time:30 }],
      [{ id:"mcq_numerical", label:"Quantitative", icon:"🔢", count:10, time:18 },{ id:"mcq_reasoning", label:"Reasoning", icon:"🧩", count:10, time:18 },{ id:"coding", label:"Coding", icon:"💻", count:2, time:30 }],
      [{ id:"mcq_verbal", label:"Verbal English", icon:"📝", count:10, time:15 },{ id:"mcq_technical", label:"Technical MCQ", icon:"💡", count:10, time:18 },{ id:"coding", label:"Coding", icon:"💻", count:2, time:30 }],
      [{ id:"mcq_numerical", label:"Aptitude", icon:"🔢", count:12, time:20 },{ id:"mcq_reasoning", label:"Critical Thinking", icon:"🧩", count:8, time:15 },{ id:"coding", label:"Coding", icon:"💻", count:2, time:30 }],
    ];
    return servicePatterns[testNum % servicePatterns.length];
  } else {
    // Product companies
    const productPatterns = [
      [{ id:"coding_dsa", label:"DSA Coding (2 problems)", icon:"💻", count:2, time:60 },{ id:"mcq_technical", label:"Technical MCQ", icon:"💡", count:10, time:20 },{ id:"behavioral", label:"Behavioral Round", icon:"🧠", count:5, time:20 }],
      [{ id:"coding_dsa", label:"DSA Coding (2 problems)", icon:"💻", count:2, time:60 },{ id:"system_design", label:"System Design", icon:"🏗️", count:2, time:30 },{ id:"behavioral", label:"Behavioral", icon:"🧠", count:5, time:15 }],
      [{ id:"coding_dsa", label:"Coding Round", icon:"💻", count:3, time:75 },{ id:"mcq_technical", label:"CS Fundamentals", icon:"💡", count:12, time:20 }],
      [{ id:"coding_dsa", label:"DSA Problems", icon:"💻", count:2, time:60 },{ id:"mcq_technical", label:"System Design MCQ", icon:"🏗️", count:8, time:15 },{ id:"behavioral", label:"HR Round", icon:"🧠", count:6, time:20 }],
    ];
    return productPatterns[testNum % productPatterns.length];
  }
}

// ══════════════════════════════════════════════════════════════════════════
// CODE RUNNER
// ══════════════════════════════════════════════════════════════════════════
function runCode(userCode, testCases) {
  const results = [];
  for (const tc of testCases) {
    try {
      // Wrap the user's code in a function that accepts input and returns output
      const fn = new Function(
        "input",
        `
        ${userCode}
        // Try common function names
        const fns = [solution, solve, main, answer];
        for (const f of fns) {
          try { if (typeof f === 'function') return String(f(input)); } catch(_) {}
        }
        // Try evaluating with input as variable
        return String(eval(userCode.replace(/solution|solve|main|answer/, 'result')));
        `
      );
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
// MOCK TEST ENGINE — FULL OVERHAUL
// ══════════════════════════════════════════════════════════════════════════
function MockTestEngine({ user }) {
  const [view, setView] = useState("home"); // home | company | testlist | test | result
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedTestNum, setSelectedTestNum] = useState(null);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [sections, setSections] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [codeResults, setCodeResults] = useState({}); // qId -> [{pass,input,got,expected,error}]
  const [runningCode, setRunningCode] = useState({}); // qId -> bool
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [companyTab, setCompanyTab] = useState("service");
  const timerRef = useRef(null);
  const [testScores, setTestScores] = useState({});

  const trackActivity = async (action, details="") => {
    try { if(!user?.id) return; await supabase.from("user_activity").insert({user_id:user.id,email:user.email,action,details}); } catch(_) {}
  };

  const loadCompanyScores = useCallback((companyKey) => {
    const scores = {};
    for (let i=1;i<=40;i++) {
      const s = ScoreDB.get(companyKey, i);
      if (s) scores[i] = s;
    }
    setTestScores(scores);
  }, []);

  // Generate questions for a section
  const generateSection = async (companyKey, sec, testNum) => {
    const compInfo = ALL_COMPANIES[companyKey];
    let prompt = "";

    if (sec.id === "coding" || sec.id === "coding_dsa") {
      const isProduct = compInfo.type === "product";
      prompt = `You are an expert ${compInfo.full} interview question generator. Generate exactly ${sec.count} realistic coding/DSA problems for ${compInfo.full} Test #${testNum}.

${isProduct ? "Difficulty: Medium to Hard (LeetCode Medium-Hard level)" : "Difficulty: Easy to Medium (suitable for campus hiring)"}
Topics rotation for test ${testNum}: Use topics from [Arrays, Strings, LinkedList, Trees, DP, Graphs, Sorting, Hashing, Two Pointers, Recursion, Stack, Queue]

CRITICAL: Each problem MUST have exactly 3-4 test cases with clean integer/string inputs and outputs that can be verified programmatically.
The function signature must be simple: function solution(input) where input is a single value (number, string, or JSON string for arrays).

Return ONLY valid JSON array:
[
  {
    "id": "c${testNum}_1",
    "type": "coding",
    "title": "Two Sum",
    "difficulty": "Medium",
    "topic": "Hashing",
    "description": "Given an array of integers nums and target, return indices of two numbers that add up to target. Input will be JSON string like '{nums:[2,7,11],target:9}'. Parse with JSON.parse(input).",
    "functionSignature": "function solution(input) { const {nums, target} = JSON.parse(input); // your code }",
    "examples": [{"input": "{\"nums\":[2,7,11,15],\"target\":9}", "output": "[0,1]", "explanation": "nums[0]+nums[1]=9"}],
    "testCases": [
      {"input": "{\"nums\":[2,7,11,15],\"target\":9}", "output": "[0,1]"},
      {"input": "{\"nums\":[3,2,4],\"target\":6}", "output": "[1,2]"},
      {"input": "{\"nums\":[3,3],\"target\":6}", "output": "[0,1]"},
      {"input": "{\"nums\":[1,2,3,4],\"target\":7}", "output": "[2,3]"}
    ],
    "hint": "Use a HashMap to store complement",
    "solution_approach": "For each number, check if target-num exists in HashMap. Store num:index pairs.",
    "time_complexity": "O(n)"
  }
]`;
    } else if (sec.id === "behavioral") {
      prompt = `Generate ${sec.count} realistic ${compInfo.full} behavioral interview questions for Test #${testNum}.

Return ONLY valid JSON array:
[
  {
    "id": "b${testNum}_1",
    "type": "behavioral",
    "question": "Describe a situation where you had to meet a very tight deadline...",
    "category": "${compInfo.type === "product" && companyKey === "amazon" ? "Customer Obsession" : "Teamwork"}",
    "tip": "Use STAR method: Situation, Task, Action, Result",
    "sample_answer_structure": "Start with context (1-2 sentences), describe your specific actions, share measurable outcome"
  }
]`;
    } else if (sec.id === "system_design") {
      prompt = `Generate ${sec.count} system design questions for ${compInfo.full} Test #${testNum}.

Return ONLY valid JSON array:
[
  {
    "id": "sd${testNum}_1",
    "type": "design",
    "question": "Design a rate limiter for an API with 1M requests/day",
    "difficulty": "Medium",
    "key_components": ["Token Bucket", "Redis", "API Gateway", "Monitoring"],
    "approach": "Start with requirements → capacity estimation → high-level design → deep dive",
    "concepts_tested": ["Distributed Systems", "Caching", "Load Balancing"]
  }
]`;
    } else {
      // MCQ types
      const topicMap = {
        mcq_numerical: `quantitative aptitude — time-speed-distance, percentages, ratios, profit-loss, number series, data interpretation`,
        mcq_verbal: `verbal ability — reading comprehension, error correction, synonyms/antonyms, sentence completion, para jumbles`,
        mcq_reasoning: `logical reasoning — blood relations, direction sense, syllogisms, coding-decoding, series completion, puzzles`,
        mcq_technical: `technical MCQ — ${compInfo.focus.join(", ")} — OOPs, DBMS, OS, CN, Data Structures`,
      };
      const topic = topicMap[sec.id] || "general aptitude";
      prompt = `Generate exactly ${sec.count} high-quality ${compInfo.full} ${sec.label} MCQ questions for Test #${testNum}.
Topic: ${topic}

Vary difficulty. Make questions realistic exam-level. Each must have exactly 4 options.

Return ONLY valid JSON array:
[
  {
    "id": "m${testNum}_1",
    "type": "mcq",
    "question": "A train 150m long passes a pole in 15 seconds. What is its speed in km/h?",
    "options": ["30 km/h", "36 km/h", "40 km/h", "45 km/h"],
    "correct": 1,
    "explanation": "Speed = 150/15 = 10 m/s = 10×18/5 = 36 km/h",
    "topic": "Speed & Distance",
    "difficulty": "Easy"
  }
]`;
    }

    const raw = await callAI(prompt, 2800, "json");
    const qs = safeJSON(raw, []);
    if (!Array.isArray(qs) || qs.length === 0) throw new Error("Failed to generate questions for "+sec.label);
    return qs;
  };

  const startTest = async (companyKey, testNum) => {
    setLoading(true); setErr("");
    setSelectedCompany(companyKey);
    setSelectedTestNum(testNum);
    const secs = getTestSections(companyKey, testNum);
    setSections(secs);
    setCurrentSectionIdx(0);

    try {
      // Generate first section's questions
      const firstSec = secs[0];
      const qs = await generateSection(companyKey, firstSec, testNum);
      setQuestions(qs);
      setAnswers({});
      setCodeResults({});
      setCurrentQ(0);
      setTimeLeft(firstSec.time * 60);
      setView("test");
      trackActivity("mock_test_started", `${companyKey}_test${testNum}`);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  const loadNextSection = async () => {
    const nextIdx = currentSectionIdx + 1;
    if (nextIdx >= sections.length) {
      submitFullTest();
      return;
    }
    setLoading(true); setErr("");
    try {
      const sec = sections[nextIdx];
      const qs = await generateSection(selectedCompany, sec, selectedTestNum);
      setQuestions(qs);
      setCurrentQ(0);
      setTimeLeft(sec.time * 60);
      setCurrentSectionIdx(nextIdx);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  // Timer per section
  useEffect(() => {
    if (view !== "test") return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSectionDone(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [view, currentSectionIdx]);

  const handleSectionDone = () => {
    clearInterval(timerRef.current);
    if (currentSectionIdx < sections.length - 1) loadNextSection();
    else submitFullTest();
  };

  const submitFullTest = () => {
    clearInterval(timerRef.current);
    const mcqQs = questions.filter(q => q.type === "mcq");
    const correct = mcqQs.filter(q => answers[q.id] === q.correct).length;
    const total = mcqQs.length;
    const pct = total > 0 ? Math.round((correct/total)*100) : null;
    ScoreDB.save(selectedCompany, selectedTestNum, correct, total, null);
    setResult({ correct, total, pct, attempted:Object.keys(answers).length, questions });
    setView("result");
    loadCompanyScores(selectedCompany);
    trackActivity("mock_test_done", `${selectedCompany}_test${selectedTestNum}_score:${pct}%`);
  };

  // Run code for a coding question
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
  const currentSec = sections[currentSectionIdx];

  // ── HOME ────────────────────────────────────────────────────────────────
  if (view === "home") return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontWeight:900,fontSize:24,color:C.text,marginBottom:4}}>🧪 Mock Test Engine</div>
        <div style={{color:C.muted,fontSize:13}}>35 companies · 40 tests each · AI questions · Code runner · Score tracking</div>
      </div>
      {err && <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",marginBottom:16,color:C.danger,fontSize:13}}>⚠ {err}</div>}

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[["service","🏢 Service Based (20)"],["product","🚀 Product Based (15)"]].map(([t,l])=>(
          <button key={t} onClick={()=>setCompanyTab(t)}
            style={{padding:"10px 20px",borderRadius:12,border:`1.5px solid ${companyTab===t?C.blue:C.border}`,background:companyTab===t?`${C.blue}10`:"#fff",color:companyTab===t?C.blue:C.muted,fontFamily:"'Inter',sans-serif",fontWeight:companyTab===t?700:400,fontSize:14,cursor:"pointer",transition:"all .2s"}}>
            {l}
          </button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
        {Object.entries(companyTab==="service"?SERVICE_COMPANIES:PRODUCT_COMPANIES).map(([key,c])=>{
          const stats = ScoreDB.getStats(key);
          return (
            <div key={key} className="hover-card"
              onClick={()=>{ setSelectedCompany(key); loadCompanyScores(key); setView("company"); }}
              style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,borderTop:`3px solid ${c.color}`,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:28}}>{c.emoji}</span>
                <div>
                  <div style={{fontWeight:800,fontSize:15,color:C.text}}>{c.full}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:1}}>{c.focus.slice(0,2).join(" · ")}</div>
                </div>
              </div>
              <div style={{color:C.soft,fontSize:12,lineHeight:1.7,marginBottom:12}}>{c.desc}</div>
              {/* Progress bar */}
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:11,color:C.muted,fontWeight:600}}>{stats.completed}/40 completed</span>
                  {stats.best!=null && <span style={{fontSize:11,color:c.color,fontWeight:700}}>Best: {stats.best}%</span>}
                </div>
                <div style={{background:"#e2e8f0",borderRadius:4,height:5,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(stats.completed/40)*100}%`,background:c.color,borderRadius:4,transition:"width .5s"}}/>
                </div>
              </div>
              {stats.avg!=null && <div style={{display:"flex",gap:8}}>
                <Tag color={c.color}>Avg: {stats.avg}%</Tag>
                {stats.completed>0 && <Tag color={C.muted}>{stats.completed} done</Tag>}
              </div>}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── COMPANY / TEST LIST ─────────────────────────────────────────────────
  if (view === "company" && compInfo) {
    const stats = ScoreDB.getStats(selectedCompany);
    const rows = Math.ceil(40/5);
    return (
      <div>
        <button onClick={()=>setView("home")} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif",marginBottom:20,display:"flex",alignItems:"center",gap:6}}>← Back to Companies</button>
        
        {/* Company Header */}
        <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:20,padding:24,marginBottom:20,borderTop:`4px solid ${compInfo.color}`}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
            <span style={{fontSize:44}}>{compInfo.emoji}</span>
            <div>
              <div style={{fontWeight:900,fontSize:22,color:C.text}}>{compInfo.full}</div>
              <div style={{color:C.muted,fontSize:13,marginTop:2}}>{compInfo.desc}</div>
            </div>
          </div>
          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
            {[
              { label:"Tests Done", val:`${stats.completed}/40`, color:compInfo.color },
              { label:"Avg Score", val:stats.avg!=null?`${stats.avg}%`:"—", color:C.blue },
              { label:"Best Score", val:stats.best!=null?`${stats.best}%`:"—", color:C.green },
              { label:"Progress", val:`${Math.round((stats.completed/40)*100)}%`, color:C.purple },
            ].map((s,i)=>(
              <div key={i} style={{background:C.bg,borderRadius:12,padding:"12px 14px",textAlign:"center",border:`1.5px solid ${C.border}`}}>
                <div style={{fontWeight:900,fontSize:20,color:s.color}}>{s.val}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:2}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#e2e8f0",borderRadius:6,height:8,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(stats.completed/40)*100}%`,background:`linear-gradient(90deg,${compInfo.color},${compInfo.color}aa)`,borderRadius:6,transition:"width .5s"}}/>
          </div>
        </div>

        {/* 40 Tests Grid */}
        <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:16}}>📋 Select a Test (1–40)</div>
        {err && <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",marginBottom:16,color:C.danger,fontSize:13}}>⚠ {err}</div>}

        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
          {Array.from({length:40},(_,i)=>{
            const tNum = i+1;
            const score = testScores[tNum];
            const pct = score?.pct;
            const done = !!score;
            const bgColor = done ? (pct>=70?"#f0fdf4":pct>=40?"#fffbeb":"#fef2f2") : "#fff";
            const bdColor = done ? (pct>=70?C.green:pct>=40?C.warn:C.danger) : C.border;
            const textC = done ? (pct>=70?C.green:pct>=40?C.warn:C.danger) : C.text;
            return (
              <div key={tNum} className="hover-card"
                onClick={()=>!loading&&startTest(selectedCompany,tNum)}
                style={{background:bgColor,border:`1.5px solid ${bdColor}`,borderRadius:14,padding:"16px 10px",textAlign:"center",cursor:loading?"not-allowed":"pointer",opacity:loading?0.6:1}}>
                <div style={{fontWeight:800,fontSize:15,color:C.text,marginBottom:4}}>Test {tNum}</div>
                {done ? (
                  <>
                    <div style={{fontWeight:900,fontSize:18,color:textC}}>{pct!=null?`${pct}%`:"✅"}</div>
                    <div style={{fontSize:10,color:C.muted,marginTop:2}}>{pct!=null?`${score.score}/${score.total}`:"Done"}</div>
                  </>
                ) : (
                  <div style={{fontSize:11,color:C.muted,marginTop:4}}>Not taken</div>
                )}
                {loading && selectedTestNum===tNum && <SpinIcon size={14} color={compInfo.color}/>}
              </div>
            );
          })}
        </div>

        <div style={{marginTop:20,background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:14,padding:18}}>
          <div style={{fontWeight:700,color:C.text,marginBottom:10}}>💡 {compInfo.full} Tips</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {compInfo.focus.map((f,i)=>(
              <div key={i} style={{display:"flex",gap:8,fontSize:13,color:C.soft}}>
                <span style={{color:compInfo.color,fontWeight:700,flexShrink:0}}>→</span>{f}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── TEST VIEW ────────────────────────────────────────────────────────────
  if (view === "test" && !loading) {
    const q = questions[currentQ];
    if (!q) return null;
    const progress = ((currentQ+1)/questions.length)*100;
    const isWarn = timeLeft < 120;
    const allSectionsCount = sections.length;
    const codeRes = q?.id ? codeResults[q.id] : null;
    const allPass = codeRes?.results?.every(r=>r.pass);

    return (
      <div>
        {/* Header */}
        <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:"14px 20px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontWeight:800,color:C.text,fontSize:15}}>{compInfo.full} — Test #{selectedTestNum}</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>
              Section {currentSectionIdx+1}/{allSectionsCount}: {currentSec?.label} · Q{currentQ+1}/{questions.length}
            </div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {/* Section pills */}
            <div style={{display:"flex",gap:4}}>
              {sections.map((s,i)=>(
                <div key={i} style={{width:24,height:24,borderRadius:6,background:i<currentSectionIdx?C.green:i===currentSectionIdx?compInfo.color:C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>{i+1}</div>
              ))}
            </div>
            <div className={isWarn?"timer-warn":""} style={{background:isWarn?"#fef2f2":"#f0fdf4",border:`1.5px solid ${isWarn?"#fecaca":"#bbf7d0"}`,borderRadius:12,padding:"8px 16px",fontWeight:800,fontSize:18,color:isWarn?C.danger:C.green,fontFamily:"'JetBrains Mono',monospace"}}>
              ⏱ {formatTime(timeLeft)}
            </div>
            <Btn variant="danger" size="sm" onClick={submitFullTest}>Submit</Btn>
          </div>
        </div>

        {/* Progress */}
        <div style={{background:"#e2e8f0",borderRadius:4,height:4,marginBottom:18,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${compInfo.color},${C.purple})`,borderRadius:4,transition:"width .3s"}}/>
        </div>

        {/* Question */}
        <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:24,marginBottom:16}}>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            <Tag color={compInfo.color}>Q{currentQ+1}</Tag>
            {q.difficulty && <Tag color={q.difficulty==="Easy"?C.green:q.difficulty==="Hard"?C.danger:C.warn}>{q.difficulty}</Tag>}
            {q.topic && <Tag color={C.purple}>{q.topic}</Tag>}
            {q.category && <Tag color={C.teal}>{q.category}</Tag>}
          </div>

          {/* MCQ */}
          {q.type==="mcq" && (
            <div>
              <div style={{fontWeight:600,fontSize:15,color:C.text,lineHeight:1.9,marginBottom:20}}>{q.question}</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {(q.options||[]).map((opt,i)=>{
                  const sel = answers[q.id]===i;
                  return (
                    <button key={i} onClick={()=>setAnswers(a=>({...a,[q.id]:i}))}
                      style={{textAlign:"left",padding:"13px 16px",borderRadius:12,border:`1.5px solid ${sel?compInfo.color:C.border}`,background:sel?`${compInfo.color}08`:"#fff",color:C.text,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>
                      <span style={{fontWeight:700,color:sel?compInfo.color:C.muted,marginRight:10}}>{String.fromCharCode(65+i)}.</span>{opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CODING */}
          {q.type==="coding" && (
            <div>
              <div style={{fontWeight:700,fontSize:17,color:C.text,marginBottom:8}}>{q.title}</div>
              <div style={{color:C.soft,fontSize:13,lineHeight:1.9,marginBottom:14,background:C.bg,borderRadius:12,padding:16}}>{q.description}</div>

              {/* Examples */}
              {q.examples?.length>0 && (
                <div style={{marginBottom:16}}>
                  <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:8}}>Examples:</div>
                  {q.examples.map((ex,i)=>(
                    <div key={i} style={{background:"#0f172a",borderRadius:10,padding:14,marginBottom:8,fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>
                      <div style={{color:"#94a3b8",marginBottom:4}}>Input: <span style={{color:"#86efac"}}>{ex.input}</span></div>
                      <div style={{color:"#94a3b8",marginBottom:4}}>Output: <span style={{color:"#7dd3fc"}}>{ex.output}</span></div>
                      {ex.explanation&&<div style={{color:"#94a3b8"}}>Note: <span style={{color:"#e2e8f0"}}>{ex.explanation}</span></div>}
                    </div>
                  ))}
                </div>
              )}

              {q.hint && <div style={{background:"#fffbeb",border:"1px solid #fef08a",borderRadius:10,padding:12,fontSize:13,color:"#92400e",marginBottom:14}}>💡 <strong>Hint:</strong> {q.hint}</div>}

              {/* Function signature starter */}
              {q.functionSignature && (
                <div style={{background:"#0f172a",borderRadius:10,padding:12,marginBottom:10,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#94a3b8"}}>
                  <div style={{color:"#64748b",fontSize:11,marginBottom:4}}>// Starter template:</div>
                  <div style={{color:"#7dd3fc"}}>{q.functionSignature}</div>
                </div>
              )}

              {/* Code editor */}
              <textarea
                className="code-editor"
                value={answers[q.id]||""}
                onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))}
                placeholder={"// Write your solution here\nfunction solution(input) {\n  // your code\n  return result;\n}"}
                style={{...inp, minHeight:220, fontFamily:"'JetBrains Mono',monospace", fontSize:13, background:"#0f172a", color:"#e2e8f0", border:"1.5px solid #334155", lineHeight:1.7, resize:"vertical", tabSize:2}}
                onKeyDown={e=>{ if(e.key==="Tab"){e.preventDefault();const s=e.target.selectionStart,en=e.target.selectionEnd;const v=e.target.value;setAnswers(a=>({...a,[q.id]:v.substring(0,s)+"  "+v.substring(en)}));setTimeout(()=>{e.target.selectionStart=e.target.selectionEnd=s+2;},0); } }}
              />

              {/* Run Button */}
              <div style={{marginTop:12,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                <Btn variant="teal" loading={runningCode[q.id]} onClick={()=>handleRunCode(q)} style={{padding:"10px 24px",fontSize:14}}>
                  ▶ Run Code
                </Btn>
                {codeRes?.results && (
                  <div style={{display:"flex",alignItems:"center",gap:6,fontWeight:700,fontSize:14,color:allPass?C.green:C.danger}}>
                    {allPass ? "✅ All test cases passed!" : `❌ ${codeRes.results.filter(r=>r.pass).length}/${codeRes.results.length} passed`}
                  </div>
                )}
                {codeRes?.error && <div style={{color:C.danger,fontSize:13}}>⚠ {codeRes.error}</div>}
              </div>

              {/* Test Cases */}
              {q.testCases?.length>0 && (
                <div style={{marginTop:16}}>
                  <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:10}}>Test Cases:</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {q.testCases.map((tc,i)=>{
                      const res = codeRes?.results?.[i];
                      const hasRun = !!codeRes;
                      const pass = res?.pass;
                      const bgC = !hasRun?"#f8f9fc":pass?"#f0fdf4":"#fef2f2";
                      const bdC = !hasRun?C.border:pass?C.green:C.danger;
                      return (
                        <div key={i} className="test-case-row" style={{background:bgC,border:`1.5px solid ${bdC}`,borderRadius:12,padding:"12px 16px"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                            <div style={{fontWeight:700,color:C.text,fontSize:13}}>Test Case {i+1}</div>
                            {hasRun && (
                              <span style={{fontWeight:800,fontSize:14,color:pass?C.green:C.danger}}>
                                {pass?"✅ PASS":"❌ FAIL"}
                              </span>
                            )}
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                            <div>
                              <div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:4}}>INPUT</div>
                              <div style={{background:"#0f172a",borderRadius:8,padding:"8px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#86efac"}}>{String(tc.input)}</div>
                            </div>
                            <div>
                              <div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:4}}>EXPECTED</div>
                              <div style={{background:"#0f172a",borderRadius:8,padding:"8px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#7dd3fc"}}>{String(tc.output)}</div>
                            </div>
                          </div>
                          {hasRun && !pass && res && (
                            <div style={{marginTop:8}}>
                              <div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:4}}>YOUR OUTPUT</div>
                              <div style={{background:"#0f172a",borderRadius:8,padding:"8px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:res.error?"#f87171":"#fbbf24"}}>
                                {res.error ? `Error: ${res.error}` : String(res.got)}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BEHAVIORAL */}
          {q.type==="behavioral" && (
            <div>
              <div style={{fontWeight:600,fontSize:16,color:C.text,lineHeight:1.8,marginBottom:14}}>{q.question}</div>
              <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:14,marginBottom:14,fontSize:13,color:"#1e40af"}}>💡 <strong>Tip:</strong> {q.tip}</div>
              {q.sample_answer_structure && <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:14,marginBottom:14,fontSize:13,color:"#14532d"}}>📋 <strong>Structure:</strong> {q.sample_answer_structure}</div>}
              <textarea value={answers[q.id]||""} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))} placeholder="Write your answer using STAR method..." style={{...inp,minHeight:160,lineHeight:1.8}}/>
            </div>
          )}

          {/* SYSTEM DESIGN */}
          {q.type==="design" && (
            <div>
              <div style={{fontWeight:600,fontSize:16,color:C.text,lineHeight:1.8,marginBottom:14}}>{q.question}</div>
              {q.key_components && <div style={{marginBottom:14}}><div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:8}}>Key Components:</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{q.key_components.map((c,i)=><Tag key={i} color={C.purple}>{c}</Tag>)}</div></div>}
              {q.approach && <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:14,marginBottom:14,fontSize:13,color:"#1e40af"}}>💡 <strong>Approach:</strong> {q.approach}</div>}
              <textarea value={answers[q.id]||""} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))} placeholder="requirements → scale → components → database → APIs → tradeoffs..." style={{...inp,minHeight:180,lineHeight:1.8}}/>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <Btn variant="ghost" onClick={()=>setCurrentQ(q=>Math.max(0,q-1))} disabled={currentQ===0}>← Prev</Btn>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center",maxWidth:340}}>
            {questions.map((_,i)=>{
              const qs2=questions[i];
              const ans=answers[qs2?.id];
              const codeDone=qs2?.type==="coding"&&codeResults[qs2?.id];
              const done=ans!==undefined||codeDone;
              return (
                <button key={i} onClick={()=>setCurrentQ(i)}
                  style={{width:28,height:28,borderRadius:7,border:`1.5px solid ${i===currentQ?compInfo.color:done?C.green:C.border}`,background:i===currentQ?`${compInfo.color}15`:done?`${C.green}10`:"#fff",color:i===currentQ?compInfo.color:C.muted,cursor:"pointer",fontWeight:700,fontSize:11}}>{i+1}</button>
              );
            })}
          </div>
          {currentQ<questions.length-1
            ? <Btn variant="cta" onClick={()=>setCurrentQ(q=>q+1)} style={{background:`linear-gradient(135deg,${compInfo.color},${compInfo.color}cc)`}}>Next →</Btn>
            : currentSectionIdx<sections.length-1
              ? <Btn variant="purple" loading={loading} onClick={handleSectionDone}>Next Section →</Btn>
              : <Btn variant="green" onClick={submitFullTest}>Submit Test ✓</Btn>
          }
        </div>
      </div>
    );
  }

  // ── LOADING OVERLAY ─────────────────────────────────────────────────────
  if (loading && view==="company") return (
    <div style={{textAlign:"center",padding:"60px 20px"}}>
      <div style={{fontSize:56,marginBottom:16,animation:"float 2s ease-in-out infinite"}}>{compInfo?.emoji||"⏳"}</div>
      <div style={{fontWeight:800,fontSize:20,color:C.text,marginBottom:8}}>Generating Test #{selectedTestNum}</div>
      <div style={{color:C.muted,fontSize:13,marginBottom:24,lineHeight:1.9}}>Creating {ALL_COMPANIES[selectedCompany]?.full} exam questions...<br/>AI is generating company-specific patterns...</div>
      <SpinIcon size={40} color={compInfo?.color||C.blue}/>
    </div>
  );

  // ── RESULT VIEW ─────────────────────────────────────────────────────────
  if (view==="result" && result) {
    const hasMCQ = result.total>0;
    const grade = hasMCQ ? (result.pct>=80?"Excellent 🏆":result.pct>=60?"Good 👍":result.pct>=40?"Average 📈":"Needs Work 💪") : "Completed ✅";
    const gradeColor = hasMCQ ? (result.pct>=80?C.green:result.pct>=60?C.blue:result.pct>=40?C.warn:C.danger) : C.blue;

    return (
      <div>
        <div style={{background:`linear-gradient(135deg,${gradeColor}15,${gradeColor}05)`,border:`1.5px solid ${gradeColor}30`,borderRadius:20,padding:28,textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:52,marginBottom:10}}>{hasMCQ?(result.pct>=80?"🏆":result.pct>=60?"🎯":result.pct>=40?"📈":"💪"):"✅"}</div>
          <div style={{fontWeight:900,fontSize:22,color:C.text,marginBottom:4}}>{grade}</div>
          {hasMCQ && <>
            <div style={{fontSize:48,fontWeight:900,color:gradeColor,marginBottom:6}}>{result.pct}%</div>
            <div style={{color:C.muted,fontSize:14}}>{result.correct}/{result.total} correct · {result.attempted} attempted</div>
          </>}
          {!hasMCQ && <div style={{color:C.muted,fontSize:14}}>Session complete · {result.attempted} questions answered</div>}
          <div style={{marginTop:12,display:"inline-flex",gap:8,alignItems:"center",background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:"6px 16px",fontSize:13,color:C.soft}}>
            {compInfo?.emoji} {compInfo?.full} · Test #{selectedTestNum}
          </div>
        </div>

        {/* Answer Review */}
        <div style={{marginBottom:20}}>
          <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:14}}>📋 Answer Review</div>
          {result.questions.map((q,i)=>{
            const userAns=answers[q.id];
            const isCorrect=q.type==="mcq"?userAns===q.correct:null;
            const cr=codeResults[q.id];
            const allP=cr?.results?.every(r=>r.pass);
            return (
              <div key={q.id||i} style={{background:"#fff",border:`1.5px solid ${isCorrect===true?C.green:isCorrect===false?C.danger:q.type==="coding"&&cr?(allP?C.green:C.warn):C.border}`,borderRadius:14,padding:18,marginBottom:10}}>
                <div style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                  <span style={{fontSize:16,flexShrink:0}}>{isCorrect===true?"✅":isCorrect===false?"❌":q.type==="coding"&&cr?(allP?"✅":"⚠️"):"📝"}</span>
                  <div style={{fontWeight:600,fontSize:14,color:C.text,lineHeight:1.7}}>{q.question||q.title||q.question||"Question"}</div>
                </div>
                {q.type==="mcq" && (
                  <div style={{paddingLeft:26}}>
                    {userAns!==undefined&&<div style={{fontSize:12,color:C.muted,marginBottom:4}}>Your answer: <strong style={{color:isCorrect?C.green:C.danger}}>{q.options?.[userAns]}</strong></div>}
                    {isCorrect===false&&<div style={{fontSize:12,color:C.green,marginBottom:6}}>Correct: <strong>{q.options?.[q.correct]}</strong></div>}
                    {q.explanation&&<div style={{background:C.bg,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.soft,lineHeight:1.7}}>💡 {q.explanation}</div>}
                  </div>
                )}
                {q.type==="coding" && (
                  <div style={{paddingLeft:26}}>
                    {cr && <div style={{fontSize:13,color:allP?C.green:C.warn,fontWeight:700,marginBottom:8}}>{allP?`✅ All ${cr.results.length} test cases passed`:`${cr.results.filter(r=>r.pass).length}/${cr.results.length} test cases passed`}</div>}
                    {q.solution_approach && <div style={{background:"#f0fdf4",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#14532d",marginBottom:6}}>✅ <strong>Approach:</strong> {q.solution_approach}</div>}
                    {q.time_complexity && <Tag color={C.purple}>Time: {q.time_complexity}</Tag>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <Btn variant="cta" onClick={()=>{setView("company");setResult(null);}} style={{flex:1}}>🔄 More Tests</Btn>
          <Btn variant="ghost" onClick={()=>{setView("home");setResult(null);setSelectedCompany(null);}} style={{flex:1}}>← All Companies</Btn>
        </div>
      </div>
    );
  }

  return null;
}

// ══════════════════════════════════════════════════════════════════════════
// LINKEDIN SUITE (preserved from original)
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

  const copy = (text, key) => { navigator.clipboard.writeText(text).then(()=>{ setCopied(key); setTimeout(()=>setCopied(""),2000); }); };

  const generate = async () => {
    if (!resume.trim() && tool!=="coldmsg") { setErr("Paste your resume first."); return; }
    if (tool==="coldmsg"&&!targetCompany.trim()) { setErr("Enter target company."); return; }
    setLoading(true); setErr(""); setResult(null);
    const reT = resume.trim().slice(0,1500);
    try {
      let prompt = "";
      if (tool==="bio") {
        prompt=`Write an optimized LinkedIn About section (bio) for this candidate targeting ${targetRole||"software/tech roles"}.\nResume:\n${reT}\nRules: First person, India professional tone, 200-280 words, strong hook (NOT "I am a..."), end with CTA. NO bullet points.\nReturn ONLY valid JSON: {"bio":"...","wordCount":220,"hook":"opening line","keyHighlights":["h1","h2","h3"]}`;
      } else if (tool==="headline") {
        prompt=`Generate 5 optimized LinkedIn headlines for ${targetRole||"software/tech"}.\nResume:\n${reT}\nMax 220 chars each. Include skill+value. No "Seeking opportunities".\nReturn ONLY valid JSON: {"headlines":[{"text":"...","angle":"Skill-focused","score":92}],"bestPick":0,"tips":["tip"]}`;
      } else if (tool==="coldmsg") {
        prompt=`Write cold messages to HR at ${targetCompany} for ${targetRole||"software engineer"} role.\nCandidate: ${reT.slice(0,500)}\n3 versions: connection request (300 chars), cold DM (150 words), referral request (120 words).\nReturn ONLY valid JSON: {"connectionRequest":"...","coldDM":"...","referralRequest":"...","tips":["tip"]}`;
      } else if (tool==="skills") {
        prompt=`Analyze resume and suggest top LinkedIn skills for ${targetRole||"software/tech"}.\nResume:\n${reT}\nReturn ONLY valid JSON: {"topSkills":[{"skill":"React.js","priority":"Must Add","reason":"...","endorsementTip":"..."}],"missingHighImpact":["Docker"],"profileStrengthTip":"..."}`;
      } else if (tool==="cover") {
        prompt=`Write a cover letter for ${targetRole||"software engineer"}${targetCompany?" at "+targetCompany:""}.\nResume:\n${reT}\nIndia professional tone, 180-220 words, 3 paragraphs.\nReturn ONLY valid JSON: {"coverLetter":"...","subject":"Application for [Role]...","wordCount":200}`;
      }
      const raw = await callAI(prompt, 2000, "json");
      const data = safeJSON(raw, null);
      if (!data) throw new Error("Generation failed. Try again.");
      setResult(data);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  const tools = [
    { id:"bio", icon:"📄", label:"LinkedIn Bio" },
    { id:"headline", icon:"✍️", label:"Headline" },
    { id:"coldmsg", icon:"💬", label:"Cold Message" },
    { id:"skills", icon:"🎯", label:"Skills" },
    { id:"cover", icon:"📧", label:"Cover Letter" },
  ];

  return (
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:900,fontSize:24,color:C.text,marginBottom:4}}>🔗 LinkedIn Suite</div>
        <div style={{color:C.muted,fontSize:13}}>Bio · Headline · Cold DM · Skills Optimizer · Cover Letter</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
        {tools.map(t=>(
          <button key={t.id} onClick={()=>{setTool(t.id);setResult(null);setErr("");}}
            style={{padding:"9px 16px",borderRadius:12,whiteSpace:"nowrap",border:`1.5px solid ${tool===t.id?C.blue:C.border}`,background:tool===t.id?`${C.blue}10`:"#fff",color:tool===t.id?C.blue:C.muted,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:tool===t.id?700:400,fontSize:13,transition:"all .2s",display:"flex",alignItems:"center",gap:6}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      {err && <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",marginBottom:16,color:C.danger,fontSize:13}}>⚠ {err}</div>}
      <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontWeight:700,color:C.text,fontSize:14}}>📄 Your Resume</div>
          <button onClick={()=>fileRef.current.click()} style={{padding:"7px 14px",borderRadius:10,border:`1.5px solid ${C.blue}40`,background:`${C.blue}08`,color:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>📁 Upload</button>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFile} style={{display:"none"}}/>
        <textarea value={resume} onChange={e=>{setResume(e.target.value);localStorage.setItem("tp_resume",e.target.value);}} placeholder="Paste your resume here..." style={{...inp,minHeight:100,resize:"vertical",lineHeight:1.8}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <input style={inp} placeholder="Target role (e.g. Full Stack Developer)" value={targetRole} onChange={e=>setTargetRole(e.target.value)}/>
        <input style={inp} placeholder={tool==="coldmsg"?"Target company*":"Target company (optional)"} value={targetCompany} onChange={e=>setTargetCompany(e.target.value)}/>
      </div>
      <Btn variant="cta" loading={loading} onClick={generate} style={{width:"100%",padding:"14px",fontSize:15}}>✨ Generate {tools.find(t=>t.id===tool)?.label}</Btn>

      {result && (
        <div style={{marginTop:20}}>
          {tool==="bio"&&result.bio&&(
            <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontWeight:700,color:C.text,fontSize:16}}>✅ LinkedIn About Section</div>
                <button onClick={()=>copy(result.bio,"bio")} style={{padding:"6px 14px",borderRadius:8,border:`1.5px solid ${C.border}`,background:copied==="bio"?"#f0fdf4":"#fff",color:copied==="bio"?C.green:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>{copied==="bio"?"✅ Copied!":"📋 Copy"}</button>
              </div>
              <div style={{color:C.soft,fontSize:13,lineHeight:2,whiteSpace:"pre-line",background:C.bg,borderRadius:12,padding:16}}>{result.bio}</div>
            </div>
          )}
          {tool==="headline"&&result.headlines&&(
            <div>{result.headlines.map((h,i)=>(
              <div key={i} style={{background:i===result.bestPick?"#f0fdf4":"#fff",border:`1.5px solid ${i===result.bestPick?C.green:C.border}`,borderRadius:14,padding:18,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{display:"flex",gap:8}}>{i===result.bestPick&&<Tag color={C.green}>⭐ Best</Tag>}<Tag color={C.blue}>{h.angle}</Tag><Tag color={C.purple}>{h.score}%</Tag></div>
                  <button onClick={()=>copy(h.text,"h"+i)} style={{padding:"5px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,background:copied==="h"+i?"#f0fdf4":"#fff",color:copied==="h"+i?C.green:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>{copied==="h"+i?"✅":"📋"}</button>
                </div>
                <div style={{fontWeight:600,fontSize:14,color:C.text}}>{h.text}</div>
              </div>
            ))}</div>
          )}
          {tool==="coldmsg"&&(
            <div>{[{key:"connectionRequest",label:"🔗 Connection Request"},{key:"coldDM",label:"💬 Cold DM to HR"},{key:"referralRequest",label:"🤝 Referral Request"}].map(({key,label})=>result[key]&&(
              <div key={key} style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{fontWeight:700,color:C.text,fontSize:14}}>{label}</div>
                  <button onClick={()=>copy(result[key],key)} style={{padding:"5px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,background:copied===key?"#f0fdf4":"#fff",color:copied===key?C.green:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>{copied===key?"✅ Copied!":"📋 Copy"}</button>
                </div>
                <div style={{color:C.soft,fontSize:13,lineHeight:1.9,whiteSpace:"pre-line",background:C.bg,borderRadius:10,padding:14}}>{result[key]}</div>
              </div>
            ))}</div>
          )}
          {tool==="skills"&&result.topSkills&&(
            <div>
              {result.missingHighImpact?.length>0&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:16,marginBottom:14}}><div style={{fontWeight:700,color:C.danger,marginBottom:8}}>🚨 Missing Skills:</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{result.missingHighImpact.map((s,i)=><span key={i} style={{background:"#fef2f2",color:C.danger,fontSize:12,padding:"4px 12px",borderRadius:20,fontWeight:700,border:"1px solid #fecaca"}}>+ {s}</span>)}</div></div>}
              {result.topSkills.map((sk,i)=>(
                <div key={i} style={{background:"#fff",border:`1.5px solid ${sk.priority==="Must Add"?C.blue:C.border}`,borderRadius:12,padding:16,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontWeight:700,color:C.text}}>{sk.skill}</div><Tag color={sk.priority==="Must Add"?C.blue:C.green}>{sk.priority}</Tag></div>
                  <div style={{color:C.soft,fontSize:13,marginBottom:6}}>{sk.reason}</div>
                  <div style={{background:"#eff6ff",borderRadius:8,padding:"6px 12px",fontSize:12,color:C.blue}}>💡 {sk.endorsementTip}</div>
                </div>
              ))}
            </div>
          )}
          {tool==="cover"&&result.coverLetter&&(
            <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:24}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                <div style={{fontWeight:700,color:C.text,fontSize:16}}>📧 Cover Letter</div>
                <button onClick={()=>copy(result.coverLetter,"cover")} style={{padding:"6px 14px",borderRadius:8,border:`1.5px solid ${C.border}`,background:copied==="cover"?"#f0fdf4":"#fff",color:copied==="cover"?C.green:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>{copied==="cover"?"✅ Copied!":"📋 Copy"}</button>
              </div>
              {result.subject&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 14px",fontSize:13,color:C.blue,marginBottom:14}}><strong>Subject:</strong> {result.subject}</div>}
              <div style={{color:C.soft,fontSize:13,lineHeight:2,whiteSpace:"pre-line",background:C.bg,borderRadius:12,padding:16}}>{result.coverLetter}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// RESUME ANALYZER (preserved from original, unchanged)
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

  const trackActivity = async (action, details="") => {
    try { if (!user?.id) return; await supabase.from("user_activity").insert({ user_id:user.id, email:user.email, action, details }); } catch(_) {}
  };

  const handleFile = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    setFileName(f.name); localStorage.setItem("tp_fileName", f.name); setErr("");
    try {
      let text = "";
      if (f.type==="application/pdf"||f.name.endsWith(".pdf")) text = await extractTextFromPDF(f);
      else if (f.name.endsWith(".docx")) text = await extractTextFromDOCX(f);
      else { const r=new FileReader(); r.onload=ev=>{setResume(ev.target.result); localStorage.setItem("tp_resume",ev.target.result); trackActivity("resume_uploaded",f.name);}; r.readAsText(f); return; }
      setResume(text); localStorage.setItem("tp_resume",text); trackActivity("resume_uploaded",f.name);
    } catch(e2) { setErr("Could not read file: "+e2.message); }
  };

  const runAnalysis = async () => {
    if (!jd.trim()||!resume.trim()) { setErr("Fill both Job Description and Resume."); return; }
    setStep("analyzing"); setErr(""); setAnalysis(null); setOptimized(null); setOptimizedScores(null);
    try {
      const prompt=`You are a senior ATS analyst. Deep honest analysis.\nJD: ${jd.trim().slice(0,800)}\nRESUME: ${resume.trim().slice(0,900)}\nReturn ONLY valid JSON:\n{"matchScore":72,"atsScore":78,"shortlistRate":24,"verdict":"Strong Match","summary":"2-sentence summary.","recruiterImpression":"5-second thought.","sectionAudit":[{"section":"Contact Info","score":85,"status":"good","feedback":"specific"},{"section":"Education","score":90,"status":"good","feedback":"specific"},{"section":"Experience","score":65,"status":"warning","feedback":"specific"},{"section":"Projects","score":80,"status":"good","feedback":"specific"},{"section":"Skills","score":70,"status":"warning","feedback":"specific"},{"section":"Resume Format","score":60,"status":"warning","feedback":"specific"},{"section":"Metrics & Numbers","score":40,"status":"weak","feedback":"specific"}],"strongMatches":[{"skill":"React.js","reason":"Listed in both JD and resume","strength":90}],"missingKeywords":[{"keyword":"Docker","importance":"High","tip":"Add to Tools section"}],"weakAreas":[{"area":"No metrics","detail":"Add numbers to bullets","priority":"High"}],"projectFit":[{"name":"Project","relevance":92,"keep":true,"reason":"Relevant","suggestion":"Add metric"}],"suggestedSkillsToAdd":["Docker"],"improvements":["Add metrics"],"formatIssues":["Not Jake format"]}`;
      const raw=await callAI(prompt,2000,"json");
      const data=safeJSON(raw,null);
      if (!data?.matchScore) throw new Error("Analysis failed. Try again.");
      setAnalysis(data); setStep("analyzed"); setSection("overview");
      trackActivity("analysis_run",`match:${data.matchScore}%`);
    } catch(e) { setErr(e.message||"Analysis failed."); setStep("input"); }
  };

  const handleJDImage = async (e) => {
    const files=Array.from(e.target.files); if(!files.length) return;
    setJdImageLoading(true); setErr("");
    try {
      let allText="";
      for(let i=0;i<files.length;i++){
        const f=files[i];
        const base64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});
        const res=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:`Extract ALL text from this JD image. Return only plain text.`,maxTokens:1500,mode:"text",image:{base64,mediaType:f.type||"image/jpeg"}})});
        if(!res.ok) throw new Error(`Page ${i+1} failed`);
        const data=await res.json(); allText+=(data.text||"")+"\n\n";
      }
      if(!allText.trim()) throw new Error("Could not read images.");
      setJd(allText.trim()); localStorage.setItem("tp_jd",allText.trim());
    } catch(e2){setErr("Image upload failed: "+e2.message);}
    setJdImageLoading(false); e.target.value="";
  };

  const extractEducationFromResume=(rawText)=>{
    if(!rawText)return[];
    const lines=rawText.split(/\n/).map(l=>l.trim()).filter(Boolean);
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

  const runOptimize=async()=>{
    setStep("optimizing"); setErr("");
    const extractedEducation=extractEducationFromResume(resume);
    try {
      const prompt=`Expert ATS resume writer. Jake's format.\nJD: ${jd.trim().slice(0,600)}\nORIGINAL RESUME: ${resume.trim().slice(0,2500)}\nRULES: Copy education EXACTLY. Keep same company/title/dates. Rewrite bullets with JD keywords. 4 bullets per section with metrics. 6+ skill categories. 3 certifications.\nReturn ONLY valid JSON: {"name":"","phone":"","email":"","linkedin":"","github":"","location":"","education":[{"school":"","location":"","degree":"","dates":""}],"experience":[{"title":"","company":"","location":"","dates":"","bullets":[]}],"projects":[{"name":"","tech":"","dates":"","bullets":[]}],"skills":[{"category":"","items":""}],"certifications":[],"optimizedMatchScore":88,"optimizedAtsScore":91,"optimizedShortlistRate":34}`;
      const raw=await callAI(prompt,2500,"json");
      const data=safeJSON(raw,null);
      if(!data?.name) throw new Error("Optimization failed. Try again.");
      if(extractedEducation.length>0)data.education=extractedEducation;
      const optScores={matchScore:data.optimizedMatchScore||Math.min(96,(analysis?.matchScore||70)+15),atsScore:data.optimizedAtsScore||Math.min(96,(analysis?.atsScore||70)+14),shortlistRate:data.optimizedShortlistRate||Math.min(45,(analysis?.shortlistRate||20)+12)};
      delete data.optimizedMatchScore; delete data.optimizedAtsScore; delete data.optimizedShortlistRate;
      if(data.certifications&&data.certifications.length>3)data.certifications=data.certifications.slice(0,3);
      while(data.certifications&&data.certifications.length<3)data.certifications.push("Actively solving DSA problems on competitive coding platforms");
      setOptimized(data); setOptimizedScores(optScores); setStep("optimized"); setSection("resume");
      trackActivity("resume_optimized",`match:${optScores.matchScore}%`);
    } catch(e){setErr(e.message||"Optimization failed."); setStep("analyzed");}
  };

  const scoreColor=s=>s>=75?"#16a34a":s>=55?"#d97706":"#dc2626";
  const scoreBg=s=>s>=75?"#f0fdf4":s>=55?"#fffbeb":"#fef2f2";
  const scoreBorder=s=>s>=75?"#bbf7d0":s>=55?"#fef08a":"#fecaca";
  const statusIcon=st=>st==="good"?"✅":st==="warning"?"⚠️":"❌";
  const impColor=imp=>imp==="High"?"#dc2626":imp==="Medium"?"#d97706":"#16a34a";

  const handleDownload=async(type)=>{
    if(!optimized)return; setDownloading(type);
    try{if(type==="pdf"){await downloadPDF(optimized,"TakePlace_Optimized_Resume.pdf");trackActivity("downloaded_pdf",optimized.name||"");}else{await downloadDOCXJake(optimized,"TakePlace_Optimized_Resume.docx");trackActivity("downloaded_docx",optimized.name||"");}}catch(e){alert("Download failed: "+e.message);}
    setDownloading("");
  };

  const JakesResumePreview=({data})=>{
    if(!data)return null;
    const ps={fontSize:8.5,lineHeight:"1.65",color:"#1a1a1a",marginBottom:2};
    const sS={borderBottom:"1.5px solid #1a1a1a",paddingBottom:1,marginBottom:6,marginTop:10,fontWeight:700,fontSize:9.5,letterSpacing:"0.06em",color:"#1a1a1a",textTransform:"uppercase"};
    const bS={...ps,paddingLeft:12,position:"relative",marginBottom:2.5};
    return(
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

  const Ring=({score,size=88,color,label})=>{
    const r=34,circ=2*Math.PI*r,col=color||scoreColor(score);
    return(<div style={{textAlign:"center"}}><svg width={size} height={size} viewBox="0 0 80 80"><circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6"/><circle cx="40" cy="40" r={r} fill="none" stroke={col} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)} strokeLinecap="round" transform="rotate(-90 40 40)" style={{transition:"stroke-dashoffset 1.2s ease"}}/><text x="40" y="44" textAnchor="middle" fill={col} fontSize="15" fontWeight="800" fontFamily="Inter">{score}%</text></svg>{label&&<div style={{fontSize:11,color:"#64748b",fontWeight:600,marginTop:2}}>{label}</div>}</div>);
  };

  const DeltaBadge=({original,optimized:opt})=>{
    const delta=opt-original; if(!delta)return null;
    return(<span style={{background:delta>0?"#f0fdf4":"#fef2f2",color:delta>0?"#16a34a":"#dc2626",fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:20,border:`1px solid ${delta>0?"#bbf7d0":"#fecaca"}`,marginLeft:6}}>{delta>0?"+":""}{delta}%</span>);
  };

  if(step==="input") return(
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:900,fontSize:24,color:C.text,marginBottom:4}}>⚡ AI Resume Analyzer</div>
        <div style={{color:C.muted,fontSize:13}}>Paste JD + resume → Deep ATS analysis → Jake's resume PDF/DOCX</div>
      </div>
      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",marginBottom:16,color:C.danger,fontSize:13}}>⚠ {err}</div>}
      <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{flex:1}}><div style={{fontWeight:700,color:C.text,fontSize:15}}>📋 Job Description</div></div>
          <div style={{display:"flex",gap:8}}>
            {jd&&<span style={{background:jd.split(/\s+/).filter(Boolean).length>150?"#f0fdf4":"#fffbeb",color:jd.split(/\s+/).filter(Boolean).length>150?"#16a34a":"#d97706",fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700}}>{jd.split(/\s+/).filter(Boolean).length} words</span>}
            <button onClick={()=>jdImageRef.current.click()} disabled={jdImageLoading} style={{padding:"7px 14px",borderRadius:10,border:`1.5px solid ${C.orange}40`,background:`${C.orange}08`,color:C.orange,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
              {jdImageLoading?<><SpinIcon size={12} color={C.orange}/> Reading...</>:"📸 Upload Photo"}
            </button>
            <input ref={jdImageRef} type="file" accept="image/*" multiple onChange={handleJDImage} style={{display:"none"}}/>
          </div>
        </div>
        {jd&&!jdImageLoading&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"6px 12px",marginBottom:8,fontSize:12,color:"#16a34a"}}>✅ JD loaded</div>}
        <textarea value={jd} onChange={e=>{setJd(e.target.value);localStorage.setItem("tp_jd",e.target.value);}} placeholder="Paste the job description here..." style={{...inp,minHeight:160,resize:"vertical",lineHeight:1.8}}/>
      </div>
      <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontWeight:700,color:C.text,fontSize:15}}>📄 Your Resume</div>
          <button onClick={()=>fileRef.current.click()} style={{padding:"7px 14px",borderRadius:10,border:`1.5px solid ${C.blue}40`,background:`${C.blue}08`,color:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>📁 Upload PDF/DOCX</button>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.doc" onChange={handleFile} style={{display:"none"}}/>
        {fileName&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"6px 12px",marginBottom:10,fontSize:12,color:"#16a34a"}}>✅ {fileName} loaded</div>}
        <textarea value={resume} onChange={e=>{setResume(e.target.value);localStorage.setItem("tp_resume",e.target.value);}} placeholder="Paste resume text here OR upload file above..." style={{...inp,minHeight:200,resize:"vertical",lineHeight:1.8}}/>
      </div>
      <button onClick={runAnalysis} disabled={!jd.trim()||!resume.trim()} style={{width:"100%",padding:"15px",fontSize:16,borderRadius:12,border:"none",cursor:!jd.trim()||!resume.trim()?"not-allowed":"pointer",background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",fontWeight:800,fontFamily:"'Inter',sans-serif",opacity:!jd.trim()||!resume.trim()?0.5:1}}>
        🔍 Analyze Resume — Get Deep Score Breakdown
      </button>
    </div>
  );

  if(step==="analyzing") return(<div style={{textAlign:"center",padding:"80px 20px"}}><div style={{fontSize:64,marginBottom:20,animation:"float 2s ease-in-out infinite"}}>🧠</div><div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:8}}>Analyzing Your Resume</div><div style={{color:C.muted,fontSize:14,lineHeight:1.9,marginBottom:28}}>Running section audit...<br/>Scoring JD match and ATS readability...<br/>Checking keyword gaps...</div><SpinIcon size={44} color={C.blue}/></div>);
  if(step==="optimizing") return(<div style={{textAlign:"center",padding:"80px 20px"}}><div style={{fontSize:64,marginBottom:20,animation:"float 2s ease-in-out infinite"}}>✨</div><div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:8}}>Building Jake's Resume</div><div style={{color:C.muted,fontSize:14,lineHeight:1.9,marginBottom:28}}>Preserving your education exactly...<br/>Mirroring JD keywords into bullets...<br/>Filling single-page Jake format...</div><SpinIcon size={44} color={C.purple}/></div>);

  const a=analysis;
  const displayScores=(step==="optimized"&&optimizedScores)?optimizedScores:{matchScore:a.matchScore,atsScore:a.atsScore,shortlistRate:a.shortlistRate||Math.min(35,Math.round((a.matchScore*0.6+a.atsScore*0.4)*0.35))};
  const tabs=[["overview","📊 Overview"],["audit","🔬 Audit"],["gaps","⚠️ Gaps"],["projects","🏗️ Projects"],...(step==="optimized"?[["resume","✨ Resume"]]:[])];;

  return(
    <div>
      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",marginBottom:16,color:C.danger,fontSize:13}}>⚠ {err}</div>}
      <div style={{background:"linear-gradient(135deg,#eff6ff,#f0fdf4)",border:`1.5px solid ${C.blue}20`,borderRadius:20,padding:24,marginBottom:16}}>
        {step==="optimized"&&optimizedScores&&(<div style={{textAlign:"center",marginBottom:14}}><div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:20,padding:"6px 18px",fontSize:12,color:"#16a34a",fontWeight:700}}>✨ Scores updated after optimization</div></div>)}
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:28,marginBottom:20,flexWrap:"wrap"}}>
          <div style={{textAlign:"center"}}><Ring score={displayScores.matchScore} label="JD Match"/>{step==="optimized"&&optimizedScores&&<DeltaBadge original={a.matchScore} optimized={optimizedScores.matchScore}/>}</div>
          <div style={{width:1,height:72,background:"#e2e8f0"}}/>
          <div style={{textAlign:"center"}}><Ring score={displayScores.atsScore} color="#2563eb" label="ATS Score"/>{step==="optimized"&&optimizedScores&&<DeltaBadge original={a.atsScore} optimized={optimizedScores.atsScore}/>}</div>
          <div style={{width:1,height:72,background:"#e2e8f0"}}/>
          <div style={{textAlign:"center"}}><div style={{width:88,height:88,borderRadius:"50%",border:`6px solid ${C.purple}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",margin:"0 auto"}}><div style={{fontWeight:900,fontSize:18,color:C.purple}}>{displayScores.shortlistRate}%</div></div><div style={{fontSize:11,color:"#64748b",fontWeight:600,marginTop:2}}>Shortlist Rate</div>{step==="optimized"&&optimizedScores&&<DeltaBadge original={a.shortlistRate||Math.min(35,Math.round((a.matchScore*0.6+a.atsScore*0.4)*0.35))} optimized={optimizedScores.shortlistRate}/>}</div>
        </div>
        <div style={{textAlign:"center"}}><div style={{display:"inline-block",padding:"6px 20px",borderRadius:20,background:scoreBg(displayScores.matchScore),color:scoreColor(displayScores.matchScore),fontWeight:800,fontSize:14,border:`1px solid ${scoreBorder(displayScores.matchScore)}`,marginBottom:10}}>{step==="optimized"?"✨ Optimized":a.verdict}</div><div style={{color:"#475569",fontSize:13,lineHeight:1.8,maxWidth:500,margin:"0 auto 10px"}}>{a.summary}</div>{a.recruiterImpression&&(<div style={{background:"#fff",border:`1px solid ${C.blue}20`,borderRadius:12,padding:"10px 18px",fontSize:12,color:"#64748b",fontStyle:"italic",maxWidth:480,margin:"0 auto"}}>💼 <strong style={{color:C.blue,fontStyle:"normal"}}>Recruiter 5-sec:</strong> {a.recruiterImpression}</div>)}</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {tabs.map(([k,l])=>(<button key={k} onClick={()=>setSection(k)} style={{padding:"9px 18px",borderRadius:20,whiteSpace:"nowrap",border:`1.5px solid ${section===k?C.blue:C.border}`,background:section===k?`${C.blue}10`:"#fff",color:section===k?C.blue:"#64748b",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:section===k?700:400,fontSize:13,transition:"all .2s"}}>{l}</button>))}
      </div>
      {section==="overview"&&(<div>
        <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:14}}>
          <div style={{fontWeight:700,color:C.text,fontSize:16,marginBottom:14}}>✅ Strong Matches</div>
          {(a.strongMatches||[]).map((m,i)=>(<div key={i} style={{marginBottom:12,background:"#f0fdf4",borderRadius:12,padding:14,border:"1px solid #bbf7d0"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontWeight:700,color:C.text}}>{m.skill}</div><div style={{fontWeight:800,fontSize:15,color:scoreColor(m.strength)}}>{m.strength}%</div></div><div style={{color:"#64748b",fontSize:12,marginBottom:8}}>{m.reason}</div><div style={{background:"#e2e8f0",borderRadius:4,height:5,overflow:"hidden"}}><div style={{height:"100%",width:`${m.strength}%`,background:"#16a34a",borderRadius:4,transition:"width 1.2s ease"}}/></div></div>))}
        </div>
        {a.weakAreas?.length>0&&(<div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:14}}><div style={{fontWeight:700,color:C.text,fontSize:16,marginBottom:14}}>⚡ Weak Areas</div>{a.weakAreas.map((w,i)=>(<div key={i} style={{background:"#fffbeb",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #fef08a"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><div style={{fontWeight:700,color:"#d97706",fontSize:14}}>{w.area}</div>{w.priority&&<span style={{background:w.priority==="High"?"#fef2f2":"#fffbeb",color:w.priority==="High"?"#dc2626":"#d97706",fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700}}>{w.priority}</span>}</div><div style={{color:"#475569",fontSize:13,lineHeight:1.7}}>{w.detail}</div></div>))}</div>)}
        {a.improvements?.length>0&&(<div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:14}}><div style={{fontWeight:700,color:C.text,fontSize:16,marginBottom:14}}>📝 Quick Wins</div>{a.improvements.map((imp,i)=>(<div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10,background:"#f1f4f9",borderRadius:10,padding:"10px 14px"}}><span style={{color:C.blue,flexShrink:0,fontWeight:700}}>→</span><span style={{color:"#475569",fontSize:13}}>{imp}</span></div>))}</div>)}
        {a.suggestedSkillsToAdd?.length>0&&(<div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:14}}><div style={{fontWeight:700,color:C.text,fontSize:16,marginBottom:14}}>🎯 Skills to Add</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{a.suggestedSkillsToAdd.map((s,i)=>(<span key={i} style={{background:"#ede9fe",color:C.purple,fontSize:12,padding:"4px 12px",borderRadius:20,fontWeight:700,border:"1px solid #c4b5fd"}}>+ {s}</span>))}</div></div>)}
        {step!=="optimized"&&(<div style={{background:"linear-gradient(135deg,#eff6ff,#ede9fe)",border:`1.5px solid ${C.blue}20`,borderRadius:20,padding:24,textAlign:"center"}}><div style={{fontWeight:800,fontSize:18,color:C.text,marginBottom:8}}>Ready to Fix All of This?</div><div style={{color:"#64748b",fontSize:13,marginBottom:20,lineHeight:1.7}}>One click — AI rewrites in Jake's format, mirrors JD keywords, adds metrics.</div><button onClick={runOptimize} style={{padding:"14px 40px",fontSize:15,borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#7c3aed,#5b21b6)",color:"#fff",fontWeight:800,fontFamily:"'Inter',sans-serif"}}>✨ Optimize Resume → Jake's Format</button></div>)}
      </div>)}
      {section==="audit"&&(<div><div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:16,padding:22}}><div style={{fontWeight:700,color:C.text,fontSize:16,marginBottom:14}}>🔬 Section-by-Section Audit</div>{(a.sectionAudit||[]).map((s,i)=>(<div key={i} style={{marginBottom:14,background:scoreBg(s.score),borderRadius:12,padding:14,border:`1px solid ${scoreBorder(s.score)}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:8}}><span>{statusIcon(s.status)}</span><span style={{fontWeight:700,color:C.text,fontSize:14}}>{s.section}</span></div><span style={{fontWeight:800,fontSize:16,color:scoreColor(s.score)}}>{s.score}%</span></div><div style={{background:"#e2e8f0",borderRadius:4,height:6,overflow:"hidden",marginBottom:8}}><div style={{height:"100%",width:`${s.score}%`,background:scoreColor(s.score),borderRadius:4,transition:"width 1.2s ease"}}/></div><div style={{color:"#475569",fontSize:12,lineHeight:1.7}}>{s.feedback}</div></div>))}</div></div>)}
      {section==="gaps"&&(<div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:16,padding:22}}><div style={{fontWeight:700,color:C.text,fontSize:16,marginBottom:14}}>⚠️ Missing Keywords <span style={{background:"#fef2f2",color:"#dc2626",fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700}}>{a.missingKeywords?.length||0} gaps</span></div>{(a.missingKeywords||[]).map((m,i)=>(<div key={i} style={{background:"#fef2f2",borderRadius:12,padding:14,marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div style={{fontWeight:700,color:C.text}}>🔍 {m.keyword}</div><span style={{background:m.importance==="High"?"#fef2f2":"#fffbeb",color:impColor(m.importance),fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700}}>{m.importance}</span></div><div style={{color:"#475569",fontSize:13}}>💡 {m.tip}</div></div>))}</div>)}
      {section==="projects"&&(<div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:16,padding:22}}><div style={{fontWeight:700,color:C.text,fontSize:16,marginBottom:14}}>🏗️ Project Relevance</div>{(a.projectFit||[]).map((p,i)=>(<div key={i} style={{background:p.keep?"#f0fdf4":"#f8fafc",borderRadius:14,padding:16,marginBottom:12,border:`1.5px solid ${p.keep?"#bbf7d0":C.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div style={{fontWeight:700,color:C.text,fontSize:15}}>{p.name}</div><div style={{display:"flex",gap:8}}><span style={{background:scoreBg(p.relevance),color:scoreColor(p.relevance),fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700}}>{p.relevance}%</span><span style={{background:p.keep?"#f0fdf4":"#f1f5f9",color:p.keep?"#16a34a":"#64748b",fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700}}>{p.keep?"✓ Keep":"Low priority"}</span></div></div><div style={{color:"#475569",fontSize:13,marginBottom:8}}>{p.reason}</div>{p.suggestion&&<div style={{background:`${C.purple}08`,border:`1px solid ${C.purple}20`,borderRadius:10,padding:"8px 12px",fontSize:12,color:"#475569"}}>💡 {p.suggestion}</div>}</div>))}</div>)}
      {section==="resume"&&step==="optimized"&&optimized&&(<div>
        <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:12}}>
            <div><div style={{fontWeight:700,color:C.text,fontSize:16}}>✨ ATS-Optimized Resume — Jake's Format</div><div style={{color:"#64748b",fontSize:12,marginTop:2}}>Education preserved · JD keywords mirrored · PDF + DOCX download</div></div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>handleDownload("pdf")} disabled={downloading==="pdf"} style={{padding:"10px 18px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#5b21b6,#7c3aed)",color:"#fff",fontWeight:700,fontFamily:"'Inter',sans-serif",fontSize:13}}>{downloading==="pdf"?"⏳...":"⬇ PDF"}</button>
              <button onClick={()=>handleDownload("docx")} disabled={downloading==="docx"} style={{padding:"10px 18px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#14532d,#16a34a)",color:"#fff",fontWeight:700,fontFamily:"'Inter',sans-serif",fontSize:13}}>{downloading==="docx"?"⏳...":"⬇ DOCX"}</button>
            </div>
          </div>
        </div>
        <JakesResumePreview data={optimized}/>
      </div>)}
      <div style={{marginTop:18}}>
        <button onClick={()=>{setStep("input");setAnalysis(null);setOptimized(null);setOptimizedScores(null);setErr("");setSection("overview");setJd("");setResume("");setFileName("");localStorage.removeItem("tp_jd");localStorage.removeItem("tp_resume");localStorage.removeItem("tp_fileName");}} style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"transparent",color:"#64748b",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:13}}>🔄 Analyze Another Job</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ══════════════════════════════════════════════════════════════════════════
function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{ const h=()=>setScrolled(window.scrollY>40); window.addEventListener("scroll",h); return()=>window.removeEventListener("scroll",h); },[]);

  return (
    <div style={{ background:"#fff", color:C.text, fontFamily:"'Inter',sans-serif", overflowX:"hidden" }}>
      <style>{css}</style>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, background:scrolled?"rgba(255,255,255,.96)":"transparent", backdropFilter:scrolled?"blur(20px)":"none", borderBottom:scrolled?`1px solid ${C.border}`:"none", transition:"all .3s", padding:"0 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ fontWeight:900, fontSize:22, color:C.blue }}>⚡ TakePlace</div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="ghost" onClick={onGetStarted} style={{ padding:"8px 18px", fontSize:13 }}>Sign In</Btn>
            <Btn variant="cta" onClick={onGetStarted} style={{ padding:"8px 20px", fontSize:13 }}>Get Free Access →</Btn>
          </div>
        </div>
      </nav>

      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"120px 24px 80px", background:"linear-gradient(160deg,#eff6ff 0%,#fff 50%,#f0fdf4 100%)" }}>
        <div style={{ textAlign:"center", maxWidth:860 }}>
          <div className="fade" style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${C.blue}10`, border:`1px solid ${C.blue}30`, borderRadius:20, padding:"6px 16px", marginBottom:28, fontSize:12, color:C.blue, fontWeight:700 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:C.blue, display:"inline-block", animation:"pulse 1.5s infinite" }}/> 35 Companies · 40 Tests Each · Code Runner · Score Tracking
          </div>
          <div className="fade" style={{ fontWeight:900, fontSize:"clamp(36px,6vw,66px)", lineHeight:1.1, marginBottom:24, animationDelay:".1s" }}>
            Get Hired Faster<br/><span style={{ color:C.blue }}>With AI on Your Side</span>
          </div>
          <div className="fade" style={{ fontSize:16, color:C.soft, lineHeight:1.8, marginBottom:32, maxWidth:580, margin:"0 auto 32px", animationDelay:".2s" }}>
            Resume AI · ATS Optimizer · Mock Tests (TCS/Amazon/Google) · LinkedIn Suite · Live Jobs<br/>
            <strong style={{ color:C.text }}>Built specifically for Indian freshers.</strong>
          </div>
          <div className="fade" style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", animationDelay:".3s" }}>
            <Btn variant="cta" onClick={onGetStarted} style={{ padding:"15px 36px", fontSize:16, borderRadius:12 }}>🚀 Start Free — No Credit Card</Btn>
          </div>

          <div className="fade" style={{ display:"flex", gap:0, justifyContent:"center", marginTop:60, background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:20, overflow:"hidden", maxWidth:560, margin:"60px auto 0", boxShadow:"0 4px 24px rgba(0,0,0,0.06)", animationDelay:".4s" }}>
            {[["35","Companies"],["40","Tests Each"],["94%","ATS Pass Rate"],["AI","Code Runner"]].map((s,i,a)=>(
              <div key={i} style={{ flex:1, padding:"20px 10px", borderRight:i<a.length-1?`1px solid ${C.border}`:"none", textAlign:"center" }}>
                <div style={{ fontWeight:900, fontSize:24, color:C.blue }}>{s[0]}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{s[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"24px", textAlign:"center" }}>
        <div style={{ color:C.muted, fontSize:12 }}>© 2026 TakePlace · Developed by Raghu Dadigela · <a href="mailto:support@takeplace.in" style={{ color:C.blue, textDecoration:"none" }}>support@takeplace.in</a></div>
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
  const [err, setErr] = useState(""); const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false); const [googleLoading, setGoogleLoading] = useState(false);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleGoogle = async () => {
    setGoogleLoading(true); setErr("");
    const { error } = await supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo:window.location.origin } });
    if (error) { setErr(error.message); setGoogleLoading(false); }
  };

  const handleForgot = async () => {
    if (!form.email) { setErr("Enter your email first."); return; }
    setLoading(true); setErr(""); setMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, { redirectTo:`${window.location.origin}/reset-password` });
    setLoading(false);
    if (error) setErr(error.message); else setMsg("✅ Reset email sent! Check your inbox.");
  };

  const handle = async () => {
    setErr(""); setMsg(""); setLoading(true);
    try {
      if (mode==="register") {
        if (!form.name||!form.email||!form.password) throw new Error("All fields required");
        if (form.password.length<6) throw new Error("Password must be at least 6 characters");
        const { error } = await supabase.auth.signUp({ email:form.email, password:form.password, options:{ data:{ full_name:form.name } } });
        if (error) throw error;
        setMsg("✅ Account created! Check email to confirm, then sign in."); setMode("login");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email:form.email, password:form.password });
        if (error) throw error; onLogin(data.user);
      }
    } catch(e) { setErr(e.message||"Something went wrong"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#eff6ff 0%,#fff 60%,#f0fdf4 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{css}</style>
      <div className="fade" style={{ width:"100%", maxWidth:420, background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:24, padding:"36px", boxShadow:"0 16px 48px rgba(37,99,235,0.12)" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.muted, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", marginBottom:24 }}>← Back to home</button>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:44, marginBottom:6 }}>⚡</div>
          <div style={{ fontWeight:900, fontSize:26, color:C.blue }}>TakePlace</div>
          <div style={{ color:C.muted, fontSize:13, marginTop:4 }}>{mode==="login"?"Welcome back 👋":"Create your account ✨"}</div>
        </div>
        {mode!=="forgot"&&(<>
          <button onClick={handleGoogle} disabled={googleLoading} style={{ width:"100%", padding:"12px", borderRadius:10, border:`1.5px solid ${C.border}`, background:"#fff", color:C.text, fontSize:14, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:18 }}>
            {googleLoading?<SpinIcon size={16}/>:<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
            Continue with Google
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}><div style={{ flex:1, height:1, background:C.border }}/><span style={{ color:C.muted, fontSize:12 }}>or</span><div style={{ flex:1, height:1, background:C.border }}/></div>
          <div style={{ display:"flex", background:C.bg, borderRadius:10, padding:4, marginBottom:22 }}>
            {["login","register"].map(m=>(<button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}} style={{ flex:1, padding:"9px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:13, background:mode===m?"#fff":"transparent", color:mode===m?C.blue:C.muted, boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>{m==="login"?"Sign In":"Register"}</button>))}
          </div>
        </>)}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {mode==="register"&&<input style={inp} placeholder="Full name" value={form.name} onChange={e=>set("name",e.target.value)}/>}
          <input style={inp} placeholder="Email address" type="email" value={form.email} onChange={e=>set("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
          {mode!=="forgot"&&<input style={inp} placeholder="Password" type="password" value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>}
        </div>
        {err&&<div style={{ color:C.danger, fontSize:12, marginTop:12, background:"#fef2f2", padding:"8px 12px", borderRadius:8 }}>⚠ {err}</div>}
        {msg&&<div style={{ color:C.green, fontSize:12, marginTop:12, background:"#f0fdf4", padding:"8px 12px", borderRadius:8 }}>{msg}</div>}
        {mode==="forgot"?(
          <><Btn variant="cta" onClick={handleForgot} loading={loading} style={{ width:"100%", marginTop:20, padding:"13px" }}>Send Reset Email →</Btn><button onClick={()=>{setMode("login");setErr("");setMsg("");}} style={{ width:"100%", marginTop:12, padding:"10px", background:"none", border:"none", color:C.muted, fontSize:13, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>← Back</button></>
        ):(
          <><Btn variant="cta" onClick={handle} loading={loading} style={{ width:"100%", marginTop:20, padding:"13px", fontSize:15 }}>{mode==="login"?"Sign In →":"Create Account →"}</Btn>{mode==="login"&&<button onClick={()=>{setMode("forgot");setErr("");setMsg("");}} style={{ width:"100%", marginTop:12, padding:"8px", background:"none", border:"none", color:C.muted, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", textDecoration:"underline" }}>Forgot password?</button>}</>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN APP — SIDEBAR LAYOUT
// ══════════════════════════════════════════════════════════════════════════
function MainApp({ user, onLogout }) {
  const [tab, setTab] = useState(() => parseInt(sessionStorage.getItem("tp_tab")||"0"));
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");
  const [search, setSearch] = useState(() => sessionStorage.getItem("tp_search")||"software engineer fresher");
  const [location, setLocation] = useState(() => sessionStorage.getItem("tp_loc")||"hyderabad");
  const [expandedJob, setExpandedJob] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const name = user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";

  useEffect(()=>{ fetchJobs(); },[]);
  const setTabPersist = (t) => { setTab(t); sessionStorage.setItem("tp_tab", t); };

  const fetchJobs = async (q=search, loc=location) => {
    setJobsLoading(true); setJobsError("");
    sessionStorage.setItem("tp_search",q); sessionStorage.setItem("tp_loc",loc);
    try {
      const url=`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&what=${encodeURIComponent(q)}&where=${encodeURIComponent(loc)}&sort_by=date&content-type=application/json`;
      const res=await fetch(url); const data=await res.json();
      if(data.results?.length>0){
        setJobs(data.results.map(j=>({id:j.id,title:j.title,company:j.company?.display_name||"Company",location:j.location?.display_name||loc,salary:j.salary_min?`₹${Math.round(j.salary_min/100000)}–${Math.round((j.salary_max||j.salary_min*1.5)/100000)} LPA`:"Competitive",description:j.description||"No description.",descriptionShort:(j.description||"").slice(0,220),url:j.redirect_url,posted:new Date(j.created).toLocaleDateString("en-IN",{day:"numeric",month:"short"}),category:j.category?.label||"Technology"})));
      } else setJobsError("No jobs found. Try 'java developer' or 'data analyst'.");
    } catch { setJobsError("Could not load jobs."); }
    setJobsLoading(false);
  };

  const NAV = [
    { icon:"🔥", label:"Live Jobs", tab:0 },
    { icon:"⚡", label:"Resume AI", tab:1 },
    { icon:"🧪", label:"Mock Tests", tab:2 },
    { icon:"🔗", label:"LinkedIn", tab:3 },
  ];

  const TOTAL_TESTS_DONE = Object.keys(localStorage).filter(k=>k.startsWith("tp_score_")).length;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'Inter',sans-serif" }}>
      <style>{css}</style>

      {/* SIDEBAR */}
      <div style={{ width:sidebarOpen?220:64, background:C.sidebar, display:"flex", flexDirection:"column", padding:"20px 12px", transition:"width .25s", flexShrink:0, position:"sticky", top:0, height:"100vh", overflow:"hidden" }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32, paddingLeft:4 }}>
          <span style={{ fontSize:22, flexShrink:0 }}>⚡</span>
          {sidebarOpen && <span style={{ fontWeight:900, fontSize:18, color:"#fff", whiteSpace:"nowrap" }}>TakePlace</span>}
        </div>

        {/* Nav Items */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:4 }}>
          {NAV.map(n=>(
            <div key={n.tab} className="sidebar-item"
              onClick={()=>setTabPersist(n.tab)}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 10px", borderRadius:10, background:tab===n.tab?C.sidebarActive:"transparent", cursor:"pointer" }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{n.icon}</span>
              {sidebarOpen && <span style={{ color:tab===n.tab?"#fff":"#94a3b8", fontSize:13, fontWeight:tab===n.tab?700:500, whiteSpace:"nowrap" }}>{n.label}</span>}
            </div>
          ))}
        </div>

        {/* Stats pill */}
        {sidebarOpen && TOTAL_TESTS_DONE>0 && (
          <div style={{ background:"#1e293b", borderRadius:12, padding:"12px 14px", marginBottom:12 }}>
            <div style={{ color:"#94a3b8", fontSize:11, marginBottom:4 }}>Tests Completed</div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{TOTAL_TESTS_DONE}</div>
          </div>
        )}

        {/* User + logout */}
        <div style={{ borderTop:"1px solid #1e293b", paddingTop:12, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.blueLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, color:"#fff", flexShrink:0 }}>{name[0].toUpperCase()}</div>
          {sidebarOpen && (
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:"#fff", fontSize:12, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{name.split(" ")[0]}</div>
              <button onClick={onLogout} style={{ background:"none", border:"none", color:"#64748b", fontSize:11, cursor:"pointer", fontFamily:"'Inter',sans-serif", padding:0, marginTop:2 }}>Sign out</button>
            </div>
          )}
          <button onClick={()=>setSidebarOpen(o=>!o)} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer", padding:4, flexShrink:0 }}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex:1, overflow:"auto", minHeight:"100vh" }}>
        {/* Top bar */}
        <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, padding:"0 28px", position:"sticky", top:0, zIndex:50, height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontWeight:700, fontSize:18, color:C.text }}>
            {NAV.find(n=>n.tab===tab)?.icon} {NAV.find(n=>n.tab===tab)?.label}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {TOTAL_TESTS_DONE>0 && <Tag color={C.purple}>🧪 {TOTAL_TESTS_DONE} tests done</Tag>}
            <Tag color={C.green}>🟢 Active</Tag>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding:"28px", maxWidth:900, margin:"0 auto" }}>
          {/* JOBS TAB */}
          {tab===0 && (
            <div>
              <div style={{ background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:20 }}>
                <div style={{ fontWeight:700, color:C.text, fontSize:15, marginBottom:14 }}>🔍 Search Jobs</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                  <input style={inp} placeholder="Role (react developer...)" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
                  <input style={inp} placeholder="City (hyderabad...)" value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
                </div>
                <Btn variant="cta" onClick={()=>fetchJobs()} style={{ width:"100%" }}>🔍 Search</Btn>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div style={{ fontWeight:800, fontSize:18, color:C.text }}>Live Job Feed</div>
                {!jobsLoading&&jobs.length>0&&(<div style={{ display:"flex", alignItems:"center", gap:6, background:"#f0fdf4", borderRadius:20, padding:"5px 14px", border:"1px solid #bbf7d0" }}><div style={{ width:7, height:7, borderRadius:"50%", background:C.green, animation:"pulse 1.5s infinite" }}/><span style={{ color:C.green, fontSize:11, fontWeight:700 }}>{jobs.length} live</span></div>)}
              </div>
              {jobsLoading&&(<div style={{ textAlign:"center", padding:"60px 20px" }}><SpinIcon size={40} color={C.blue}/><div style={{ color:C.muted, fontSize:14, marginTop:14 }}>Fetching real jobs...</div></div>)}
              {jobsError&&<div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:14, padding:22, color:C.danger, textAlign:"center" }}>{jobsError}</div>}
              {!jobsLoading&&jobs.map((job,i)=>{
                const isExp=expandedJob===job.id;
                return(
                  <div key={job.id} className="fade" style={{ background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:16, padding:"16px 18px", marginBottom:10, borderLeft:`3px solid ${C.blue}`, animationDelay:`${i*0.04}s`, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <div><div style={{ fontWeight:700, fontSize:15, color:C.text }}>{job.title}</div><div style={{ color:C.soft, fontSize:12, marginTop:2 }}>{job.company} · {job.location}</div></div>
                      <div style={{ textAlign:"right", flexShrink:0 }}><div style={{ color:C.green, fontWeight:800, fontSize:14 }}>{job.salary}</div><div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{job.posted}</div></div>
                    </div>
                    <div style={{ color:C.muted, fontSize:12, lineHeight:1.7, marginBottom:12, background:C.bg, borderRadius:10, padding:"10px 12px" }}>
                      {isExp?job.description:job.descriptionShort+(job.description.length>220?"...":"")}
                      {job.description.length>220&&(<button onClick={()=>setExpandedJob(isExp?null:job.id)} style={{ background:"none", border:"none", color:C.blue, fontSize:11, cursor:"pointer", marginLeft:6, fontFamily:"'Inter',sans-serif", fontWeight:600 }}>{isExp?"less ▲":"more ▼"}</button>)}
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
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
          )}
          {tab===1 && <ResumeAnalyzer user={user}/>}
          {tab===2 && <MockTestEngine user={user}/>}
          {tab===3 && <LinkedInSuite user={user}/>}
        </div>
      </div>
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
    supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user){setUser(session.user);setPage("app");}
      else{setUser(null);setPage("landing");}
    });
  },[]);

  const handleLogin = (u) => { setUser(u); setPage("app"); };
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setPage("landing"); };

  if(appLoading) return(
    <div style={{minHeight:"100vh",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{css}</style>
      <SpinIcon size={44} color={C.blue}/>
      <div style={{color:C.muted,fontSize:14,fontFamily:"'Inter',sans-serif"}}>Loading TakePlace...</div>
    </div>
  );

  if(page==="landing") return <LandingPage onGetStarted={()=>setPage("auth")}/>;
  if(page==="auth") return <AuthPage onLogin={handleLogin} onBack={()=>setPage("landing")}/>;
  return <MainApp user={user} onLogout={handleLogout}/>;
}
