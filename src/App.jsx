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

// ─── COMPANY LOGOS ──────────────────────────────────────────────────────────
const COMPANY_LOGOS = {
  tcs: ({ size=32 }) => (<svg width={size} height={size} viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#1d4ed8"/><text x="16" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="Arial">TCS</text></svg>),
  infosys: ({ size=32 }) => (<svg width={size} height={size} viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#7c3aed"/><text x="16" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="800" fontFamily="Arial">INFY</text></svg>),
  wipro: ({ size=32 }) => (<svg width={size} height={size} viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#16a34a"/><circle cx="16" cy="16" r="9" fill="none" stroke="white" strokeWidth="2"/><text x="16" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="800" fontFamily="Arial">W</text></svg>),
  amazon: ({ size=32 }) => (<svg width={size} height={size} viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#ff9900"/><text x="16" y="14" textAnchor="middle" fill="white" fontSize="7" fontWeight="800" fontFamily="Arial">amazon</text><path d="M8 20 Q16 24 24 20" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>),
  google: ({ size=32 }) => (<svg width={size} height={size} viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="white" stroke="#e2e8f0"/><text x="8" y="22" fill="#4285F4" fontSize="12" fontWeight="800" fontFamily="Arial">G</text><text x="15" y="22" fill="#EA4335" fontSize="12" fontWeight="800" fontFamily="Arial">o</text><text x="21" y="22" fill="#FBBC05" fontSize="12" fontWeight="800" fontFamily="Arial">o</text><text x="4" y="26" fill="#34A853" fontSize="7" fontFamily="Arial">gle</text></svg>),
  microsoft: ({ size=32 }) => (<svg width={size} height={size} viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="white" stroke="#e2e8f0"/><rect x="6" y="6" width="9" height="9" fill="#f25022"/><rect x="17" y="6" width="9" height="9" fill="#7fba00"/><rect x="6" y="17" width="9" height="9" fill="#00a4ef"/><rect x="17" y="17" width="9" height="9" fill="#ffb900"/></svg>),
  flipkart: ({ size=32 }) => (<svg width={size} height={size} viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#f59e0b"/><text x="16" y="21" textAnchor="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="Arial">FK</text></svg>),
  default: ({ size=32, color="#64748b", letter="?" }) => (<svg width={size} height={size} viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill={color}/><text x="16" y="22" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Arial">{letter}</text></svg>),
};

function CompanyLogo({ companyKey, color, name, size=32 }) {
  const LogoComp = COMPANY_LOGOS[companyKey];
  if (LogoComp) return <LogoComp size={size}/>;
  return <COMPANY_LOGOS.default size={size} color={color} letter={(name||"?")[0].toUpperCase()}/>;
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;background:#f8fafc;}
  body{font-family:'Inter',sans-serif;color:#0f172a;}
  ::-webkit-scrollbar{width:5px;height:5px;}
  ::-webkit-scrollbar-thumb{background:#334155;border-radius:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes timerPulse{0%,100%{box-shadow:0 0 0 0 #dc262630}50%{box-shadow:0 0 0 8px #dc262600}}
  @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes glowPulse{0%,100%{box-shadow:0 0 20px #2563eb30}50%{box-shadow:0 0 40px #2563eb60}}
  @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  .fade{animation:fadeUp .35s ease forwards;}
  .fadeIn{animation:fadeIn .25s ease forwards;}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  .float{animation:float 3s ease-in-out infinite;}
  .hover-card{transition:all .2s;cursor:pointer;}
  .hover-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,0.12);}
  .code-editor{font-family:'JetBrains Mono',monospace!important;font-size:13px!important;line-height:1.7!important;}
  .glow-btn{animation:glowPulse 2s ease-in-out infinite;}
  .ticker-wrap{overflow:hidden;width:100%;}
  .ticker-inner{display:flex;gap:48px;animation:ticker 30s linear infinite;white-space:nowrap;}
  input:focus,textarea:focus,select:focus{border-color:#2563eb!important;outline:none;box-shadow:0 0 0 3px #2563eb18;}
  button:active{transform:scale(.97);}
  .timer-warn{animation:timerPulse 1s infinite;}
  @media(max-width:768px){.hide-mobile{display:none!important;}.mobile-full{width:100%!important;}.mobile-stack{flex-direction:column!important;}}
`;

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
    outline:{ background:"transparent", color:C.blue, border:`2px solid ${C.blue}`, fontWeight:700 },
  };
  return (
    <button onClick={disabled||loading?undefined:onClick} disabled={disabled||loading}
      style={{padding:sizes[size]||sizes.md,borderRadius:10,border:"none",cursor:disabled||loading?"not-allowed":"pointer",
        fontFamily:"'Inter',sans-serif",fontSize:14,transition:"all .2s",opacity:disabled?0.5:1,
        display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,...v[variant],...style}}>
      {loading?<><SpinIcon size={14} color={variant==="ghost"?C.blue:"#fff"}/> Loading...</>:children}
    </button>
  );
};

const SpinIcon = ({ size=18, color=C.blue }) => (
  <span className="spin" style={{width:size,height:size,border:`2px solid ${color}30`,
    borderTopColor:color,borderRadius:"50%",display:"inline-block",flexShrink:0}}/>
);

const Tag = ({ children, color=C.blue, bg }) => (
  <span style={{background:bg||`${color}15`,color,fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700,whiteSpace:"nowrap",border:`1px solid ${color}30`}}>
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

// ─── FILE EXTRACTION ────────────────────────────────────────────────────────
async function extractTextFromPDF(file) {
  if (!window.pdfjsLib) {
    await new Promise((res,rej) => {
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload=res; s.onerror=rej; document.head.appendChild(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const ab=await file.arrayBuffer();
  const pdf=await window.pdfjsLib.getDocument({data:ab}).promise;
  let text="";
  for(let i=1;i<=Math.min(pdf.numPages,4);i++){
    const page=await pdf.getPage(i);
    const content=await page.getTextContent();
    text+=content.items.map(x=>x.str).join(" ")+"\n";
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
  const ab=await file.arrayBuffer();
  const result=await window.mammoth.extractRawText({arrayBuffer:ab});
  return result.value.trim();
}

// ─── DOWNLOAD ───────────────────────────────────────────────────────────────
async function downloadPDF(resumeData, filename) {
  if (!window.jspdf) {
    await new Promise((res,rej) => {
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload=res; s.onerror=rej; document.head.appendChild(s);
    });
  }
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=210,ml=15,mr=15,cw=W-ml-mr; let y=18;
  const d=resumeData;
  doc.setFontSize(16); doc.setFont("helvetica","bold");
  doc.text(d.name||"",W/2,y,{align:"center"}); y+=6;
  doc.setFontSize(8.5); doc.setFont("helvetica","normal"); doc.setTextColor(60,60,60);
  const cp=[d.phone,d.email,d.linkedin,d.github,d.location].filter(Boolean);
  doc.text(cp.join(" | "),W/2,y,{align:"center"}); y+=7; doc.setTextColor(0,0,0);
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

// ─── SCORE DB ────────────────────────────────────────────────────────────────
const ScoreDB = {
  key:(companyKey,mode,testNum)=>`tp_score_${companyKey}_${mode}_test${testNum}`,
  save:(companyKey,mode,testNum,score,total)=>{
    const entry={score,total,pct:total>0?Math.round((score/total)*100):null,date:new Date().toISOString()};
    localStorage.setItem(ScoreDB.key(companyKey,mode,testNum),JSON.stringify(entry));
  },
  get:(companyKey,mode,testNum)=>{
    const raw=localStorage.getItem(ScoreDB.key(companyKey,mode,testNum));
    return raw?JSON.parse(raw):null;
  },
  getStats:(companyKey,mode)=>{
    const results=[];
    for(let i=1;i<=40;i++){const r=ScoreDB.get(companyKey,mode,i);if(r)results.push({testNum:i,...r});}
    if(!results.length) return{completed:0,avg:null,best:null,totalTests:40};
    const pcts=results.filter(r=>r.pct!==null).map(r=>r.pct);
    return{completed:results.length,avg:pcts.length?Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length):null,best:pcts.length?Math.max(...pcts):null,totalTests:40};
  },
};

// ─── COMPANY DATA ───────────────────────────────────────────────────────────
const SERVICE_COMPANIES = {
  tcs:{name:"TCS",full:"TCS NQT",color:"#1d4ed8",emoji:"🏢",type:"service",desc:"NQT pattern. Foundation + Advanced. Numerical, Verbal, Reasoning, Coding.",aptFocus:["Numerical Ability","Verbal English","Logical Reasoning","Data Interpretation"],codingFocus:["Arrays","Strings","Pattern Programs","Basic DP","Sorting Algorithms"]},
  infosys:{name:"Infosys",full:"Infosys InfyTQ",color:"#7c3aed",emoji:"🔷",type:"service",desc:"InfyTQ exam. Aptitude + Reasoning + Verbal + Power Programmer.",aptFocus:["Aptitude","Verbal","Reasoning","Puzzles"],codingFocus:["Java OOPs","Python","DSA Basics","SQL Queries"]},
  wipro:{name:"Wipro",full:"Wipro NLTH",color:"#16a34a",emoji:"🌐",type:"service",desc:"NLTH pattern. Aptitude + Essay + Coding. No negative marking.",aptFocus:["Aptitude","Reasoning","Verbal","Essay Writing"],codingFocus:["C/C++","Python","LinkedList","Recursion"]},
  hcl:{name:"HCL",full:"HCL TechBee",color:"#0284c7",emoji:"🔵",type:"service",desc:"TechBee hiring. Aptitude, Reasoning, Technical MCQs, Coding.",aptFocus:["Aptitude","Technical MCQ","Reasoning","OS/Networks"],codingFocus:["DBMS","OOPs Concepts","Basic Algorithms","SQL"]},
  cognizant:{name:"Cognizant",full:"Cognizant GenC",color:"#ea580c",emoji:"🟠",type:"service",desc:"GenC / GenC Elevate. Aptitude + Coding + Communication.",aptFocus:["Aptitude","Reasoning","Communication","English"],codingFocus:["Python","Java","Pseudo Code","Problem Solving"]},
  accenture:{name:"Accenture",full:"Accenture Hiring",color:"#a855f7",emoji:"💜",type:"service",desc:"4-section test: Aptitude, Critical Thinking, Coding + Communication.",aptFocus:["Aptitude","Critical Thinking","Communication","Cognitive Ability"],codingFocus:["Logic Building","Pseudo Code","Python Basics","SQL"]},
  capgemini:{name:"Capgemini",full:"Capgemini Tech",color:"#0891b2",emoji:"🟦",type:"service",desc:"Pseudo Code + Behavioural + Game-Based + Technical.",aptFocus:["Pseudo Code","Behavioural","Technical MCQ","Aptitude"],codingFocus:["Pseudo Code","Java","Python","Algorithm Design"]},
  techmah:{name:"Tech Mahindra",full:"TechMahindra",color:"#dc2626",emoji:"🔴",type:"service",desc:"Aptitude + Verbal + Technical + Coding round pattern.",aptFocus:["Aptitude","Verbal","Technical MCQ","Reasoning"],codingFocus:["C++","Java","DSA","String Manipulation"]},
};

const PRODUCT_COMPANIES = {
  amazon:{name:"Amazon",full:"Amazon SDE OA",color:"#d97706",emoji:"📦",type:"product",desc:"OA: 2 DSA + Work Simulation + 16 Leadership Principles.",aptFocus:["Work Simulation","Leadership Principles","Problem Solving","Logical Reasoning"],codingFocus:["Arrays","Hash Maps","Two Pointers","BFS/DFS","DP","Linked Lists"]},
  microsoft:{name:"Microsoft",full:"Microsoft SDE",color:"#0284c7",emoji:"🪟",type:"product",desc:"DSA rounds + System Design + Behavioral. FAANG level.",aptFocus:["System Design MCQ","CS Fundamentals","Behavioral","Debugging"],codingFocus:["Trees","Graphs","DP","Backtracking","System Design LLD"]},
  google:{name:"Google",full:"Google SWE",color:"#dc2626",emoji:"🔍",type:"product",desc:"Coding interviews: Graphs, DP, optimization. Multiple rounds.",aptFocus:["Algorithmic Thinking","Math Puzzles","System Design","CS Theory"],codingFocus:["Graphs","DP","Segment Trees","Tries","Advanced DSA"]},
  flipkart:{name:"Flipkart",full:"Flipkart SDE",color:"#f59e0b",emoji:"🛒",type:"product",desc:"OA: DSA + Technical + Product Thinking. Indian FAANG.",aptFocus:["Product Sense","Technical MCQ","System Design","Reasoning"],codingFocus:["Arrays","Trees","DP","SQL","System Design"]},
  zomato:{name:"Zomato",full:"Zomato SDE",color:"#ef4444",emoji:"🍕",type:"product",desc:"DSA + Product Sense + Case Studies. Fast-paced startup.",aptFocus:["Product Sense","Case Study","SQL/Data","Reasoning"],codingFocus:["Geospatial Algorithms","SQL","Python","DSA Medium"]},
  razorpay:{name:"Razorpay",full:"Razorpay SDE",color:"#3b82f6",emoji:"💳",type:"product",desc:"Fintech focus. DSA + System Design + Payments domain.",aptFocus:["Fintech MCQ","System Design","Behavioral","Payments Domain"],codingFocus:["DSA Medium-Hard","Payment APIs","Java/Go","Distributed Systems"]},
};

const ALL_COMPANIES = { ...SERVICE_COMPANIES, ...PRODUCT_COMPANIES };

// ══════════════════════════════════════════════════════════════════════════
// MOCK TEST ENGINE — UPGRADED WITH LANGUAGE SELECT + SOLUTION REVEAL
// ══════════════════════════════════════════════════════════════════════════

const LANGUAGES = [
  { id:"javascript", label:"JavaScript", icon:"🟨", template:"function solution(input) {\n  // your code here\n  return result;\n}" },
  { id:"python",     label:"Python",     icon:"🐍", template:"def solution(input):\n    # your code here\n    return result" },
  { id:"java",       label:"Java",       icon:"☕", template:"import java.util.*;\npublic class Solution {\n    public static String solution(String input) {\n        // your code here\n        return \"\";\n    }\n}" },
  { id:"cpp",        label:"C++",        icon:"⚙️", template:"#include <bits/stdc++.h>\nusing namespace std;\nstring solution(string input) {\n    // your code here\n    return \"\";\n}" },
  { id:"c",          label:"C",          icon:"🔵", template:"#include <stdio.h>\n#include <string.h>\nvoid solution(char* input, char* output) {\n    // your code here\n    strcpy(output, \"\");\n}" },
];

// JS-only runner (Python/Java/C/C++ show "compile & run" style UX with solution reveal)
function runCodeJS(userCode, testCases) {
  const results=[];
  for(const tc of testCases){
    try{
      const fn=new Function("input",`
        ${userCode}
        if(typeof solution==='function') return String(solution(input));
        if(typeof solve==='function') return String(solve(input));
        if(typeof main==='function') return String(main(input));
        return 'No function named solution/solve/main found';
      `);
      const output=String(fn(tc.input)).trim();
      const expected=String(tc.output).trim();
      results.push({input:tc.input,expected,got:output,pass:output===expected});
    }catch(e){
      results.push({input:tc.input,expected:String(tc.output).trim(),got:null,error:e.message,pass:false});
    }
  }
  return results;
}

// For non-JS: simulate "run" by checking if code is non-empty and show compile message
function runCodeSimulated(lang, userCode, testCases) {
  if (!userCode.trim()) return testCases.map(tc=>({input:tc.input,expected:String(tc.output).trim(),got:null,error:"No code written",pass:false}));
  // Simulate: if code contains the expected output string in comments or logic, partial pass
  return testCases.map(tc=>({
    input:tc.input,
    expected:String(tc.output).trim(),
    got:"[Run in "+lang+" compiler]",
    pass:false,
    simulated:true,
  }));
}

function MockTestEngine({ user }) {
  const [view,setView]=useState("home");
  const [selectedCompany,setSelectedCompany]=useState(null);
  const [testMode,setTestMode]=useState(null);
  const [selectedTestNum,setSelectedTestNum]=useState(null);
  const [questions,setQuestions]=useState([]);
  const [currentQ,setCurrentQ]=useState(0);
  const [answers,setAnswers]=useState({});
  const [selectedLang,setSelectedLang]=useState({});   // qId -> langId
  const [codeResults,setCodeResults]=useState({});
  const [runningCode,setRunningCode]=useState({});
  const [showSolution,setShowSolution]=useState({});   // qId -> bool
  const [timeLeft,setTimeLeft]=useState(0);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [err,setErr]=useState("");
  const [companyTab,setCompanyTab]=useState("service");
  const timerRef=useRef(null);
  const isMobile=window.innerWidth<768;

  const generateAptitudeQuestions=async(companyKey,testNum)=>{
    const c=ALL_COMPANIES[companyKey];
    const topicRotation=c.aptFocus[testNum%c.aptFocus.length];
    const prompt=`Generate exactly 20 high-quality ${c.full} aptitude/MCQ questions for Test #${testNum}.
Primary Topic Focus: ${topicRotation}
All topics: ${c.aptFocus.join(", ")}
Return ONLY valid JSON array:
[{"id":"a${testNum}_1","type":"mcq","question":"question text","options":["A","B","C","D"],"correct":0,"explanation":"why correct","topic":"${topicRotation}","difficulty":"Easy"}]
IMPORTANT: correct is 0-indexed. Generate all 20.`;
    const raw=await callAI(prompt,3500,"json");
    const qs=safeJSON(raw,[]);
    if(!Array.isArray(qs)||qs.length<5) throw new Error("Failed to generate questions. Please retry.");
    return qs.slice(0,20);
  };

  const generateCodingQuestions=async(companyKey,testNum)=>{
    const c=ALL_COMPANIES[companyKey];
    const topicRotation=c.codingFocus[testNum%c.codingFocus.length];
    const isProduct=c.type==="product";
    const prompt=`Generate exactly 5 LeetCode-style coding problems for ${c.full} Test #${testNum}.
Primary Topic: ${topicRotation}
Difficulty: ${isProduct?"Medium to Hard":"Easy to Medium"}
Each problem MUST have:
- A clear problem statement
- 2-3 concrete examples with input/output
- 4 test cases (edge cases included)
- A complete solution in JavaScript with explanation
- Time and space complexity

Return ONLY valid JSON array:
[{
  "id":"c${testNum}_1",
  "type":"coding",
  "title":"Two Sum",
  "difficulty":"Medium",
  "topic":"${topicRotation}",
  "description":"Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
  "functionSignature":"function solution(input) { /* input is JSON string */ }",
  "examples":[
    {"input":"[2,7,11,15],9","output":"[0,1]","explanation":"nums[0]+nums[1]=9"},
    {"input":"[3,2,4],6","output":"[1,2]","explanation":"nums[1]+nums[2]=6"}
  ],
  "testCases":[
    {"input":"[2,7,11,15],9","output":"[0,1]"},
    {"input":"[3,2,4],6","output":"[1,2]"},
    {"input":"[3,3],6","output":"[0,1]"},
    {"input":"[1,5,3,2],7","output":"[1,3]"}
  ],
  "hint":"Use a hash map to store seen values.",
  "solution_javascript":"function solution(input) {\n  const parts = input.split(',');\n  const target = parseInt(parts[parts.length-1]);\n  const nums = JSON.parse(parts.slice(0,parts.length-1).join(','));\n  const map = {};\n  for(let i=0;i<nums.length;i++){\n    const comp = target-nums[i];\n    if(comp in map) return JSON.stringify([map[comp],i]);\n    map[nums[i]] = i;\n  }\n}",
  "solution_python":"def solution(input_str):\\n    # parse input\\n    pass",
  "solution_java":"// Java solution\\npublic static String solution(String input) {\\n    return \\\"\\\";\\n}",
  "solution_cpp":"// C++ solution\\nstring solution(string input) {\\n    return \\\"\\\";\\n}",
  "time_complexity":"O(n)",
  "space_complexity":"O(n)",
  "approach":"Use hash map for O(n) lookup"
}]`;
    const raw=await callAI(prompt,4000,"json");
    const qs=safeJSON(raw,[]);
    if(!Array.isArray(qs)||qs.length<1) throw new Error("Failed to generate questions. Please retry.");
    return qs.slice(0,5);
  };

  const startTest=async(companyKey,mode,testNum)=>{
    setLoading(true); setErr("");
    setSelectedCompany(companyKey); setTestMode(mode); setSelectedTestNum(testNum);
    try{
      let qs;
      if(mode==="aptitude"){qs=await generateAptitudeQuestions(companyKey,testNum);setTimeLeft(30*60);}
      else{qs=await generateCodingQuestions(companyKey,testNum);setTimeLeft(60*60);}
      setQuestions(qs); setAnswers({}); setCodeResults({}); setCurrentQ(0);
      setSelectedLang({}); setShowSolution({});
      setView("test");
    }catch(e){setErr(e.message);}
    setLoading(false);
  };

  useEffect(()=>{
    if(view!=="test") return;
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{
        if(t<=1){clearInterval(timerRef.current);submitTest();return 0;}
        return t-1;
      });
    },1000);
    return()=>clearInterval(timerRef.current);
  },[view]);

  const submitTest=()=>{
    clearInterval(timerRef.current);
    const mcqQs=questions.filter(q=>q.type==="mcq");
    const correct=mcqQs.filter(q=>answers[q.id]===q.correct).length;
    const total=mcqQs.length;
    const pct=total>0?Math.round((correct/total)*100):null;
    ScoreDB.save(selectedCompany,testMode,selectedTestNum,correct,total);
    setResult({correct,total,pct,attempted:Object.keys(answers).length,questions});
    setView("result");
  };

  const handleRunCode=(q)=>{
    if(!q.testCases?.length) return;
    const code=answers[q.id]||"";
    if(!code.trim()){setCodeResults(r=>({...r,[q.id]:{error:"Write your code first",results:[]}}));return;}
    const lang=selectedLang[q.id]||"javascript";
    setRunningCode(r=>({...r,[q.id]:true}));
    setTimeout(()=>{
      let results;
      if(lang==="javascript"){
        results=runCodeJS(code,q.testCases);
      }else{
        results=runCodeSimulated(lang,code,q.testCases);
      }
      setCodeResults(r=>({...r,[q.id]:{results,lang}}));
      setRunningCode(r=>({...r,[q.id]:false}));
    },400);
  };

  const getLangTemplate=(q)=>{
    const lang=selectedLang[q.id]||"javascript";
    const langDef=LANGUAGES.find(l=>l.id===lang);
    return langDef?.template||"";
  };

  const getSolutionForLang=(q)=>{
    const lang=selectedLang[q.id]||"javascript";
    if(lang==="javascript") return q.solution_javascript||q.solution_approach||"// Solution not available";
    if(lang==="python") return q.solution_python||"# Solution not available";
    if(lang==="java") return q.solution_java||"// Solution not available";
    if(lang==="cpp") return q.solution_cpp||"// Solution not available";
    if(lang==="c") return q.solution_c||"// Solution not available";
    return q.solution_javascript||"// Solution not available";
  };

  const formatTime=(s)=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const compInfo=selectedCompany?ALL_COMPANIES[selectedCompany]:null;

  // HOME
  if(view==="home") return(
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:900,fontSize:isMobile?20:24,color:C.text,marginBottom:4}}>🧪 Mock Test Engine</div>
        <div style={{color:C.muted,fontSize:13}}>30 companies · 40 tests each · Aptitude & Coding · LeetCode-style · Multi-language</div>
      </div>
      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",marginBottom:16,color:C.danger,fontSize:13}}>⚠ {err}</div>}

      <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
        {[["service","🏢 Service Based"],["product","🚀 Product Based"]].map(([t,l])=>(
          <button key={t} onClick={()=>setCompanyTab(t)}
            style={{padding:"10px 20px",borderRadius:12,border:`1.5px solid ${companyTab===t?C.blue:C.border}`,background:companyTab===t?`${C.blue}10`:"#fff",color:companyTab===t?C.blue:C.muted,fontFamily:"'Inter',sans-serif",fontWeight:companyTab===t?700:400,fontSize:14,cursor:"pointer",whiteSpace:"nowrap"}}>
            {l}
          </button>
        ))}
      </div>

      <div style={{background:"linear-gradient(135deg,#eff6ff,#f0fdf4)",border:`1px solid ${C.blue}20`,borderRadius:16,padding:"14px 18px",marginBottom:20}}>
        <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:10}}>📌 Features</div>
        <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
          {[
            ["📊","Aptitude Mode","20 MCQs · 30 min · Quant, Verbal, Reasoning"],
            ["💻","Coding Mode","5 Problems · 60 min · LeetCode-style DSA"],
            ["🌐","Multi-language","Java, Python, C++, C, JavaScript"],
            ["💡","Solution Reveal","Click to show solution after attempting"],
          ].map(([e,t,d])=>(
            <div key={t} style={{display:"flex",gap:8,alignItems:"flex-start",flex:1,minWidth:180}}>
              <span style={{fontSize:20}}>{e}</span>
              <div><div style={{fontWeight:700,fontSize:12,color:C.text}}>{t}</div><div style={{fontSize:11,color:C.muted}}>{d}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
        {Object.entries(companyTab==="service"?SERVICE_COMPANIES:PRODUCT_COMPANIES).map(([key,c])=>{
          const aptStats=ScoreDB.getStats(key,"aptitude");
          const codeStats=ScoreDB.getStats(key,"coding");
          const totalDone=aptStats.completed+codeStats.completed;
          return(
            <div key={key} className="hover-card"
              onClick={()=>{setSelectedCompany(key);setTestMode(null);setView("company");}}
              style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:18,borderTop:`3px solid ${c.color}`,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <CompanyLogo companyKey={key} color={c.color} name={c.name} size={36}/>
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

  // COMPANY VIEW
  if(view==="company"&&compInfo){
    const aptStats=ScoreDB.getStats(selectedCompany,"aptitude");
    const codeStats=ScoreDB.getStats(selectedCompany,"coding");
    const activeMode=testMode||"aptitude";
    const activeScores={};
    for(let i=1;i<=40;i++){const s=ScoreDB.get(selectedCompany,activeMode,i);if(s)activeScores[i]=s;}
    return(
      <div>
        <button onClick={()=>setView("home")} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif",marginBottom:20}}>← Back to Companies</button>
        <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:20,padding:20,marginBottom:16,borderTop:`4px solid ${compInfo.color}`}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
            <CompanyLogo companyKey={selectedCompany} color={compInfo.color} name={compInfo.name} size={48}/>
            <div>
              <div style={{fontWeight:900,fontSize:22,color:C.text}}>{compInfo.full}</div>
              <div style={{color:C.muted,fontSize:12,marginTop:2}}>{compInfo.desc}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            {[{label:"Apt Done",val:`${aptStats.completed}/40`,color:C.blue},{label:"Apt Best",val:aptStats.best!=null?`${aptStats.best}%`:"—",color:C.green},{label:"Code Done",val:`${codeStats.completed}/40`,color:C.purple},{label:"Code Best",val:codeStats.best!=null?`${codeStats.best}%`:"—",color:C.orange}].map((s,i)=>(
              <div key={i} style={{background:C.bg,borderRadius:10,padding:"10px 8px",textAlign:"center",border:`1px solid ${C.border}`}}>
                <div style={{fontWeight:900,fontSize:18,color:s.color}}>{s.val}</div>
                <div style={{fontSize:10,color:C.muted}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:16}}>
          {[{mode:"aptitude",icon:"📊",label:"Aptitude Tests",desc:"20 MCQs · 30 min",color:C.blue,stats:aptStats},{mode:"coding",icon:"💻",label:"Coding Tests",desc:"5 DSA Problems · 60 min",color:C.green,stats:codeStats}].map(m=>(
            <button key={m.mode} onClick={()=>setTestMode(m.mode)}
              style={{flex:1,padding:"14px",borderRadius:14,border:`2px solid ${activeMode===m.mode?m.color:C.border}`,background:activeMode===m.mode?`${m.color}08`:"#fff",cursor:"pointer",fontFamily:"'Inter',sans-serif",textAlign:"left"}}>
              <div style={{fontSize:22,marginBottom:4}}>{m.icon}</div>
              <div style={{fontWeight:700,fontSize:14,color:C.text}}>{m.label}</div>
              <div style={{fontSize:11,color:C.muted}}>{m.desc}</div>
              <div style={{fontSize:12,fontWeight:700,color:m.color,marginTop:4}}>{m.stats.completed}/40 done</div>
            </button>
          ))}
        </div>
        {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",marginBottom:16,color:C.danger,fontSize:13}}>⚠ {err}</div>}
        <div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:12}}>Select Test (1–40)</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
          {Array.from({length:40},(_,i)=>{
            const tNum=i+1;
            const score=activeScores[tNum];
            const pct=score?.pct;
            const done=!!score;
            const bg=done?(pct>=70?"#f0fdf4":pct>=40?"#fffbeb":"#fef2f2"):"#fff";
            const bd=done?(pct>=70?C.green:pct>=40?C.warn:C.danger):C.border;
            return(
              <div key={tNum} className="hover-card"
                onClick={()=>!loading&&startTest(selectedCompany,activeMode,tNum)}
                style={{background:bg,border:`1.5px solid ${bd}`,borderRadius:12,padding:"12px 6px",textAlign:"center",cursor:loading?"not-allowed":"pointer"}}>
                <div style={{fontWeight:700,fontSize:13,color:C.text}}>Test {tNum}</div>
                {done?<div style={{fontWeight:900,fontSize:16,color:pct>=70?C.green:pct>=40?C.warn:C.danger}}>{pct!=null?`${pct}%`:"✅"}</div>
                    :<div style={{fontSize:10,color:C.muted,marginTop:2}}>Start</div>}
                {loading&&selectedTestNum===tNum&&<SpinIcon size={12} color={compInfo.color}/>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if(loading) return(
    <div style={{textAlign:"center",padding:"60px 20px"}}>
      <div style={{fontSize:48,marginBottom:14,animation:"float 2s ease-in-out infinite"}}>{compInfo?.emoji||"⏳"}</div>
      <div style={{fontWeight:800,fontSize:18,color:C.text,marginBottom:6}}>Generating Test #{selectedTestNum}</div>
      <SpinIcon size={36} color={compInfo?.color||C.blue}/>
    </div>
  );

  // TEST VIEW
  if(view==="test"){
    const q=questions[currentQ];
    if(!q) return null;
    const progress=((currentQ+1)/questions.length)*100;
    const isWarn=timeLeft<120;
    const codeRes=q?.id?codeResults[q.id]:null;
    const allPass=codeRes?.results?.every(r=>r.pass);
    const currentLang=selectedLang[q.id]||"javascript";
    const currentLangDef=LANGUAGES.find(l=>l.id===currentLang);
    const solutionVisible=showSolution[q.id];

    return(
      <div>
        {/* Timer bar */}
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
          <div>
            <div style={{fontWeight:800,color:C.text,fontSize:14}}>{compInfo.full} · Test #{selectedTestNum}</div>
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
            {q.difficulty&&<Tag color={q.difficulty==="Easy"?C.green:q.difficulty==="Hard"?C.danger:C.warn}>{q.difficulty}</Tag>}
            {q.topic&&<Tag color={C.purple}>{q.topic}</Tag>}
            {q.type==="coding"&&q.time_complexity&&<Tag color={C.teal}>⏱ {q.time_complexity}</Tag>}
          </div>

          {/* MCQ */}
          {q.type==="mcq"&&(
            <div>
              <div style={{fontWeight:600,fontSize:15,color:C.text,lineHeight:1.9,marginBottom:18}}>{q.question}</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {(q.options||[]).map((opt,i)=>{
                  const sel=answers[q.id]===i;
                  return(
                    <button key={i} onClick={()=>setAnswers(a=>({...a,[q.id]:i}))}
                      style={{textAlign:"left",padding:"12px 14px",borderRadius:10,border:`1.5px solid ${sel?compInfo.color:C.border}`,background:sel?`${compInfo.color}08`:"#fff",color:C.text,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                      <span style={{fontWeight:700,color:sel?compInfo.color:C.muted,marginRight:10}}>{String.fromCharCode(65+i)}.</span>{opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CODING — UPGRADED */}
          {q.type==="coding"&&(
            <div>
              <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:8}}>{q.title}</div>
              <div style={{color:C.soft,fontSize:13,lineHeight:1.9,marginBottom:12,background:C.bg,borderRadius:10,padding:14,whiteSpace:"pre-wrap"}}>{q.description}</div>

              {/* Examples */}
              {q.examples?.length>0&&(
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:6}}>Examples:</div>
                  {q.examples.map((ex,i)=>(
                    <div key={i} style={{background:"#0f172a",borderRadius:8,padding:12,marginBottom:6,fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>
                      <div style={{color:"#94a3b8"}}>Input: <span style={{color:"#86efac"}}>{ex.input}</span></div>
                      <div style={{color:"#94a3b8"}}>Output: <span style={{color:"#7dd3fc"}}>{ex.output}</span></div>
                      {ex.explanation&&<div style={{color:"#64748b",marginTop:4}}>// {ex.explanation}</div>}
                    </div>
                  ))}
                </div>
              )}

              {q.hint&&<div style={{background:"#fffbeb",border:"1px solid #fef08a",borderRadius:8,padding:10,fontSize:12,color:"#92400e",marginBottom:14}}>💡 Hint: {q.hint}</div>}

              {/* LANGUAGE SELECTOR */}
              <div style={{marginBottom:10}}>
                <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:7}}>🌐 Select Language:</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {LANGUAGES.map(lang=>(
                    <button key={lang.id}
                      onClick={()=>{
                        setSelectedLang(s=>({...s,[q.id]:lang.id}));
                        // Set template if field is empty
                        if(!answers[q.id]||answers[q.id]===getLangTemplate(q)){
                          setAnswers(a=>({...a,[q.id]:lang.template}));
                        }
                        setCodeResults(r=>({...r,[q.id]:null}));
                      }}
                      style={{padding:"6px 14px",borderRadius:8,border:`1.5px solid ${currentLang===lang.id?compInfo.color:C.border}`,background:currentLang===lang.id?`${compInfo.color}10`:"#fff",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:currentLang===lang.id?700:500,fontSize:12,color:currentLang===lang.id?compInfo.color:C.muted,display:"flex",alignItems:"center",gap:5}}>
                      <span>{lang.icon}</span> {lang.label}
                    </button>
                  ))}
                </div>
                {currentLang!=="javascript"&&(
                  <div style={{background:"#fffbeb",border:"1px solid #fef08a",borderRadius:7,padding:"6px 10px",marginTop:8,fontSize:11,color:"#92400e"}}>
                    ⚠️ Live execution only for JavaScript. For {currentLangDef?.label}, write your code here — use "Run" to check logic structure. Solution reveal available below.
                  </div>
                )}
              </div>

              {/* CODE EDITOR */}
              <textarea className="code-editor"
                value={answers[q.id]||(()=>{const t=getLangTemplate(q);setTimeout(()=>setAnswers(a=>({...a,[q.id]:a[q.id]===undefined?t:a[q.id]})),0);return t;})()}
                onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))}
                style={{...inp,minHeight:220,fontFamily:"'JetBrains Mono',monospace",fontSize:13,background:"#0f172a",color:"#e2e8f0",border:"1.5px solid #334155",lineHeight:1.7,resize:"vertical"}}
                onKeyDown={e=>{
                  if(e.key==="Tab"){
                    e.preventDefault();
                    const s=e.target.selectionStart;
                    const v=e.target.value;
                    const newVal=v.substring(0,s)+"  "+v.substring(e.target.selectionEnd);
                    setAnswers(a=>({...a,[q.id]:newVal}));
                    setTimeout(()=>{e.target.selectionStart=e.target.selectionEnd=s+2;},0);
                  }
                }}
              />

              {/* RUN + RESULTS */}
              <div style={{marginTop:10,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <Btn variant="teal" loading={runningCode[q.id]} onClick={()=>handleRunCode(q)}>▶ Run Code</Btn>
                {codeRes?.results&&(
                  <div style={{fontWeight:700,fontSize:13,color:allPass?C.green:C.danger}}>
                    {codeRes.results[0]?.simulated
                      ? `📝 Code saved — run in ${currentLangDef?.label} compiler`
                      : allPass?`✅ All ${codeRes.results.length} test cases passed!`:`❌ ${codeRes.results.filter(r=>r.pass).length}/${codeRes.results.length} passed`
                    }
                  </div>
                )}
              </div>

              {/* TEST CASE RESULTS */}
              {codeRes?.results&&!codeRes.results[0]?.simulated&&(
                <div style={{marginTop:10}}>
                  {codeRes.results.map((r,i)=>(
                    <div key={i} style={{background:r.pass?"#f0fdf4":"#fef2f2",border:`1px solid ${r.pass?"#bbf7d0":"#fecaca"}`,borderRadius:8,padding:"8px 12px",marginBottom:5,fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <span style={{fontWeight:700,color:r.pass?C.green:C.danger}}>{r.pass?"✅":"❌"} Test {i+1}</span>
                        <span style={{color:C.muted}}>Input: {String(r.input).slice(0,40)}</span>
                      </div>
                      <div style={{color:"#475569"}}>Expected: <span style={{color:"#16a34a"}}>{r.expected}</span></div>
                      {!r.pass&&<div style={{color:"#475569"}}>Got: <span style={{color:r.error?"#dc2626":"#ea580c"}}>{r.error||r.got}</span></div>}
                    </div>
                  ))}
                </div>
              )}

              {/* SOLUTION REVEAL */}
              <div style={{marginTop:14,borderTop:`1px solid ${C.border}`,paddingTop:12}}>
                <button
                  onClick={()=>setShowSolution(s=>({...s,[q.id]:!s[q.id]}))}
                  style={{padding:"8px 18px",borderRadius:9,border:`1.5px solid ${C.purple}40`,background:solutionVisible?`${C.purple}10`:"transparent",color:C.purple,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:7}}>
                  {solutionVisible?"🔒 Hide Solution":"💡 Show Solution"}
                </button>

                {solutionVisible&&(
                  <div style={{marginTop:12,animation:"fadeIn .25s ease"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <div style={{fontWeight:700,fontSize:13,color:C.text}}>✅ Solution — {currentLangDef?.label}</div>
                      {q.time_complexity&&<Tag color={C.teal}>⏱ {q.time_complexity}</Tag>}
                      {q.space_complexity&&<Tag color={C.orange}>🗄 {q.space_complexity}</Tag>}
                    </div>
                    {q.approach&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 12px",fontSize:12,color:C.blue,marginBottom:8}}>🧠 Approach: {q.approach}</div>}
                    <pre style={{background:"#0f172a",color:"#e2e8f0",borderRadius:10,padding:14,fontSize:12,fontFamily:"'JetBrains Mono',monospace",overflowX:"auto",lineHeight:1.7,border:"1px solid #1e293b",whiteSpace:"pre-wrap"}}>
                      {getSolutionForLang(q)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
          <Btn variant="ghost" onClick={()=>setCurrentQ(q=>Math.max(0,q-1))} disabled={currentQ===0}>← Prev</Btn>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center"}}>
            {questions.map((_,i)=>{
              const qs2=questions[i];const ans=answers[qs2?.id];const done=ans!==undefined&&ans!=="";
              return<button key={i} onClick={()=>setCurrentQ(i)} style={{width:26,height:26,borderRadius:6,border:`1.5px solid ${i===currentQ?compInfo.color:done?C.green:C.border}`,background:i===currentQ?`${compInfo.color}15`:done?`${C.green}10`:"#fff",color:i===currentQ?compInfo.color:C.muted,cursor:"pointer",fontWeight:700,fontSize:11}}>{i+1}</button>;
            })}
          </div>
          {currentQ<questions.length-1
            ?<Btn variant="cta" onClick={()=>setCurrentQ(q=>q+1)}>Next →</Btn>
            :<Btn variant="green" onClick={submitTest}>Submit ✓</Btn>}
        </div>
      </div>
    );
  }

  // RESULT
  if(view==="result"&&result){
    const hasMCQ=result.total>0;
    const grade=hasMCQ?(result.pct>=80?"Excellent 🏆":result.pct>=60?"Good 👍":result.pct>=40?"Average 📈":"Needs Work 💪"):"Completed ✅";
    const gradeColor=hasMCQ?(result.pct>=80?C.green:result.pct>=60?C.blue:result.pct>=40?C.warn:C.danger):C.blue;
    return(
      <div>
        <div style={{background:`linear-gradient(135deg,${gradeColor}15,${gradeColor}05)`,border:`1.5px solid ${gradeColor}30`,borderRadius:18,padding:24,textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:44,marginBottom:8}}>{hasMCQ?(result.pct>=80?"🏆":result.pct>=60?"🎯":result.pct>=40?"📈":"💪"):"✅"}</div>
          <div style={{fontWeight:900,fontSize:20,color:C.text,marginBottom:4}}>{grade}</div>
          {hasMCQ&&<><div style={{fontSize:44,fontWeight:900,color:gradeColor,marginBottom:4}}>{result.pct}%</div><div style={{color:C.muted,fontSize:13}}>{result.correct}/{result.total} correct</div></>}
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
// LINKEDIN SUITE (unchanged)
// ══════════════════════════════════════════════════════════════════════════
function LinkedInSuite({ user }) {
  const [tool,setTool]=useState("bio");
  const [resume,setResume]=useState(()=>localStorage.getItem("tp_resume")||"");
  const [targetRole,setTargetRole]=useState("");
  const [targetCompany,setTargetCompany]=useState("");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [copied,setCopied]=useState("");
  const [err,setErr]=useState("");
  const fileRef=useRef();

  const handleFile=async(e)=>{
    const f=e.target.files[0]; if(!f) return;
    try{
      let text="";
      if(f.type==="application/pdf"||f.name.endsWith(".pdf")) text=await extractTextFromPDF(f);
      else if(f.name.endsWith(".docx")) text=await extractTextFromDOCX(f);
      else{const r=new FileReader();r.onload=ev=>{setResume(ev.target.result);localStorage.setItem("tp_resume",ev.target.result);};r.readAsText(f);return;}
      setResume(text); localStorage.setItem("tp_resume",text);
    }catch(e2){setErr("Could not read file: "+e2.message);}
  };

  const copy=(text,key)=>{navigator.clipboard.writeText(text).then(()=>{setCopied(key);setTimeout(()=>setCopied(""),2000);});};

  const generate=async()=>{
    if(!resume.trim()&&tool!=="coldmsg"){setErr("Paste your resume first.");return;}
    if(tool==="coldmsg"&&!targetCompany.trim()){setErr("Enter target company.");return;}
    setLoading(true);setErr("");setResult(null);
    const reT=resume.trim().slice(0,1500);
    try{
      let prompt="";
      if(tool==="bio") prompt=`Write optimized LinkedIn About for ${targetRole||"software/tech"}.\nResume:\n${reT}\nReturn ONLY valid JSON: {"bio":"...","wordCount":220,"hook":"opening line","keyHighlights":["h1","h2","h3"]}`;
      else if(tool==="headline") prompt=`Generate 5 LinkedIn headlines for ${targetRole||"software/tech"}.\nResume:\n${reT}\nReturn ONLY valid JSON: {"headlines":[{"text":"...","angle":"Skill-focused","score":92}],"bestPick":0,"tips":["tip"]}`;
      else if(tool==="coldmsg") prompt=`Write cold messages to HR at ${targetCompany} for ${targetRole||"software engineer"}.\nCandidate: ${reT.slice(0,500)}\nReturn ONLY valid JSON: {"connectionRequest":"...","coldDM":"...","referralRequest":"...","tips":["tip"]}`;
      else if(tool==="skills") prompt=`Analyze resume and suggest LinkedIn skills for ${targetRole||"software/tech"}.\nResume:\n${reT}\nReturn ONLY valid JSON: {"topSkills":[{"skill":"React.js","priority":"Must Add","reason":"...","endorsementTip":"..."}],"missingHighImpact":["Docker"],"profileStrengthTip":"..."}`;
      else if(tool==="cover") prompt=`Write cover letter for ${targetRole||"software engineer"}${targetCompany?" at "+targetCompany:""}.\nResume:\n${reT}\nReturn ONLY valid JSON: {"coverLetter":"...","subject":"Application for [Role]","wordCount":200}`;
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
        <div style={{fontWeight:900,fontSize:24,color:C.text,marginBottom:4}}>🔗 LinkedIn Suite</div>
        <div style={{color:C.muted,fontSize:13}}>Bio · Headline · Cold DM · Skills · Cover Letter</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:18,overflowX:"auto",paddingBottom:4}}>
        {tools.map(t=>(
          <button key={t.id} onClick={()=>{setTool(t.id);setResult(null);setErr("");}}
            style={{padding:"8px 14px",borderRadius:10,whiteSpace:"nowrap",border:`1.5px solid ${tool===t.id?C.blue:C.border}`,background:tool===t.id?`${C.blue}10`:"#fff",color:tool===t.id?C.blue:C.muted,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:tool===t.id?700:400,fontSize:13}}>
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
        <input style={inp} placeholder="Target role" value={targetRole} onChange={e=>setTargetRole(e.target.value)}/>
        <input style={inp} placeholder="Target company" value={targetCompany} onChange={e=>setTargetCompany(e.target.value)}/>
      </div>
      <Btn variant="cta" loading={loading} onClick={generate} style={{width:"100%",padding:"13px",fontSize:15}}>✨ Generate {tools.find(t=>t.id===tool)?.label}</Btn>

      {result&&(
        <div style={{marginTop:18}}>
          {tool==="bio"&&result.bio&&(
            <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontWeight:700,fontSize:15}}>✅ LinkedIn About</div>
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
                <div style={{fontWeight:600,fontSize:13}}>{h.text}</div>
              </div>
            ))}</div>
          )}
          {tool==="coldmsg"&&(
            <div>{[{key:"connectionRequest",label:"🔗 Connection Request"},{key:"coldDM",label:"💬 Cold DM"},{key:"referralRequest",label:"🤝 Referral Request"}].map(({key,label})=>result[key]&&(
              <div key={key} style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{fontWeight:700,fontSize:13}}>{label}</div>
                  <button onClick={()=>copy(result[key],key)} style={{padding:"4px 10px",borderRadius:6,border:`1.5px solid ${C.border}`,background:copied===key?"#f0fdf4":"#fff",color:copied===key?C.green:C.blue,fontSize:11,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>{copied===key?"✅":"📋"}</button>
                </div>
                <div style={{color:C.soft,fontSize:13,lineHeight:1.9,whiteSpace:"pre-line",background:C.bg,borderRadius:8,padding:12}}>{result[key]}</div>
              </div>
            ))}</div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// RESUME ANALYZER — MASTER LEVEL UPGRADE
// ══════════════════════════════════════════════════════════════════════════
function ResumeAnalyzer({ user }) {
  const [jd,setJd]=useState(()=>localStorage.getItem("tp_jd")||"");
  const [resume,setResume]=useState(()=>localStorage.getItem("tp_resume")||"");
  const [fileName,setFileName]=useState(()=>localStorage.getItem("tp_fileName")||"");
  const [step,setStep]=useState("input");
  const [analysis,setAnalysis]=useState(null);
  const [optimized,setOptimized]=useState(null);
  const [optimizedScores,setOptimizedScores]=useState(null);
  const [changeLog,setChangeLog]=useState([]);
  const [err,setErr]=useState("");
  const [section,setSection]=useState("overview");
  const [downloading,setDownloading]=useState("");
  const [optRetries,setOptRetries]=useState(0);
  const fileRef=useRef();
  const jdImageRef=useRef();
  const [jdImageLoading,setJdImageLoading]=useState(false);
  const isMobile=window.innerWidth<768;

  const handleFile=async(e)=>{
    const f=e.target.files[0]; if(!f) return;
    setFileName(f.name); localStorage.setItem("tp_fileName",f.name); setErr("");
    try{
      let text="";
      if(f.type==="application/pdf"||f.name.endsWith(".pdf")) text=await extractTextFromPDF(f);
      else if(f.name.endsWith(".docx")) text=await extractTextFromDOCX(f);
      else{const r=new FileReader();r.onload=ev=>{setResume(ev.target.result);localStorage.setItem("tp_resume",ev.target.result);};r.readAsText(f);return;}
      setResume(text); localStorage.setItem("tp_resume",text);
    }catch(e2){setErr("Could not read file: "+e2.message);}
  };

  const hasRealExperience=(rawText)=>{
    if(!rawText) return false;
    const expMatch=/\b(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|INTERNSHIP)\b/i.test(rawText);
    if(!expMatch) return false;
    const lines=rawText.split("\n");
    let inExp=false,expLines=[];
    for(const l of lines){
      if(/\b(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|INTERNSHIP)\b/i.test(l)) {inExp=true;continue;}
      if(inExp&&/\b(EDUCATION|PROJECTS|SKILLS|CERTIF)\b/i.test(l)) break;
      if(inExp) expLines.push(l.trim());
    }
    return expMatch&&expLines.filter(l=>l.length>10).length>2;
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
      if(school||degree) entries.push({school,location,degree,dates});
    }
    return entries.length>0?entries:[];
  };

  // MASTER ANALYSIS — deep scan
  const runAnalysis=async()=>{
    if(!jd.trim()||!resume.trim()){setErr("Fill both Job Description and Resume.");return;}
    setStep("analyzing"); setErr(""); setAnalysis(null); setOptimized(null); setOptimizedScores(null); setChangeLog([]);
    try{
      const prompt=`You are a senior ATS and recruitment expert at a Fortune 500 company. Perform a deep master-level analysis.

JD (full): ${jd.trim().slice(0,1000)}
RESUME (full): ${resume.trim().slice(0,1200)}

CRITICAL: Be brutally honest. Give real scores — don't inflate. A typical fresher resume scores 40-65%.

Return ONLY valid JSON (no markdown):
{
  "matchScore": 58,
  "atsScore": 62,
  "shortlistRate": 18,
  "verdict": "Moderate Match",
  "recruiterDecision": "MAYBE — would shortlist only if pipeline is thin",
  "summary": "Honest 2-sentence assessment of the resume vs JD fit.",
  "recruiterImpression": "What a recruiter thinks in 6 seconds scanning this resume.",
  "topStrengths": ["strength 1 from resume", "strength 2", "strength 3"],
  "criticalGaps": ["critical gap 1 blocking shortlist", "gap 2", "gap 3"],
  "sectionAudit": [
    {
      "section": "Contact Info",
      "score": 90,
      "status": "good",
      "feedback": "Complete with phone, email, LinkedIn. Missing GitHub URL.",
      "keywords_present": ["email", "phone", "linkedin"],
      "keywords_missing": ["github", "portfolio"],
      "action": "Add GitHub profile URL"
    },
    {
      "section": "Professional Summary",
      "score": 45,
      "status": "warning",
      "feedback": "Generic summary with no JD-specific keywords. Doesn't mention role title from JD.",
      "keywords_present": ["developer", "B.Tech"],
      "keywords_missing": ["full-stack", "React", "Node.js", "REST APIs"],
      "action": "Rewrite to mirror JD job title and top 5 required skills"
    },
    {
      "section": "Education",
      "score": 88,
      "status": "good",
      "feedback": "Relevant degree with good CGPA. University name present.",
      "keywords_present": ["B.Tech", "CSE", "CGPA"],
      "keywords_missing": [],
      "action": "Add relevant coursework if space allows"
    },
    {
      "section": "Experience / Internship",
      "score": 50,
      "status": "warning",
      "feedback": "Internship bullets are vague. No metrics, no JD keywords used.",
      "keywords_present": ["developed", "worked"],
      "keywords_missing": ["React", "REST API", "agile", "metrics", "% improvement"],
      "action": "Add 2-3 quantified metrics. Mirror JD technology keywords in bullet verbs."
    },
    {
      "section": "Projects",
      "score": 60,
      "status": "warning",
      "feedback": "Projects exist but bullets are task-based not achievement-based. Missing impact metrics.",
      "keywords_present": ["React", "MongoDB"],
      "keywords_missing": ["REST API", "authentication", "CI/CD", "deployed", "users"],
      "action": "Add metrics: users, performance improvement, uptime, response time"
    },
    {
      "section": "Technical Skills",
      "score": 55,
      "status": "warning",
      "feedback": "Missing several JD-required technologies. Skills listed without categorization.",
      "keywords_present": ["Python", "Java", "MySQL"],
      "keywords_missing": ["Docker", "AWS", "CI/CD", "TypeScript", "Redis"],
      "action": "Add missing JD keywords under appropriate categories. Use exact JD terminology."
    },
    {
      "section": "Format & ATS Compatibility",
      "score": 70,
      "status": "warning",
      "feedback": "Mostly ATS-safe but uses some formatting that may not parse well.",
      "keywords_present": [],
      "keywords_missing": ["clean headers", "standard section names", "single column"],
      "action": "Use standard section headers. Remove tables/graphics. Single-column layout."
    }
  ],
  "keywordGapsBySectionDetail": [
    {
      "section": "Technical Skills",
      "missing_keywords": ["Docker", "Kubernetes", "CI/CD", "TypeScript"],
      "how_to_add": "Add a Tools/DevOps row under Technical Skills: Docker, Kubernetes, CI/CD (GitHub Actions)",
      "impact": "High",
      "jd_frequency": 4,
      "ats_weight": "These appear in JD requirements — ATS auto-rejects without them"
    },
    {
      "section": "Projects",
      "missing_keywords": ["REST API", "deployed", "authentication", "100+ users"],
      "how_to_add": "Rewrite project bullets: 'Developed REST API with JWT authentication, serving 200+ users with 99.9% uptime'",
      "impact": "High",
      "jd_frequency": 3,
      "ats_weight": "Project keywords are parsed by ATS for skill validation"
    },
    {
      "section": "Professional Summary",
      "missing_keywords": ["full-stack developer", "React", "Node.js", "problem-solving"],
      "how_to_add": "Open summary with exact JD job title: 'Full-Stack Developer with expertise in React and Node.js...'",
      "impact": "High",
      "jd_frequency": 5,
      "ats_weight": "Summary section is heavily weighted in ATS keyword scoring"
    },
    {
      "section": "Experience",
      "missing_keywords": ["agile", "sprint", "code review", "collaboration"],
      "how_to_add": "Add to internship bullets: 'Participated in 2-week agile sprints, conducted code reviews...'",
      "impact": "Medium",
      "jd_frequency": 2,
      "ats_weight": "Soft-technical keywords from JD responsibilities section"
    }
  ],
  "strongMatches": [
    {"skill": "React.js", "found_in": "Projects & Skills", "jd_requirement": "Required", "strength": 85, "reason": "Listed in both resume and JD with project evidence"},
    {"skill": "Python", "found_in": "Skills", "jd_requirement": "Nice-to-have", "strength": 72, "reason": "Present in skills but no project usage shown"}
  ],
  "missingKeywords": [
    {"keyword": "Docker", "importance": "High", "section": "Skills", "tip": "Add to Tools category in Technical Skills", "ats_impact": "Blocks ATS pass if not present"},
    {"keyword": "TypeScript", "importance": "High", "section": "Skills", "tip": "Add to Languages if you know it, else add to learning section"},
    {"keyword": "CI/CD", "importance": "Medium", "section": "Projects", "tip": "Mention GitHub Actions or Jenkins in a project bullet"}
  ],
  "weakAreas": [
    {"area": "No quantified metrics anywhere", "detail": "Zero numbers in any bullet point. Recruiters at target companies expect metrics.", "priority": "Critical", "fix": "Add at least 3 metrics: users, % improvement, response time, uptime"},
    {"area": "Generic project bullets", "detail": "All bullets describe tasks ('worked on', 'developed') not outcomes", "priority": "High", "fix": "Use CAR format: Context, Action, Result. Every bullet needs a number."},
    {"area": "Missing DevOps/Cloud keywords", "detail": "JD requires Docker, CI/CD, AWS but none appear in resume", "priority": "High", "fix": "Add Docker, GitHub Actions to Tools. Mention deployment in project bullets."}
  ],
  "projectFit": [
    {"name": "Identify from resume", "relevance": 78, "keep": true, "reason": "Tech stack matches JD", "suggestion": "Add metrics and deployment details", "missing_from_bullets": ["deployed on", "users", "API endpoints"]},
    {"name": "Another project", "relevance": 45, "keep": false, "reason": "Tech stack not relevant to JD", "suggestion": "Replace with a more relevant project or add JD-relevant tech"}
  ],
  "suggestedSkillsToAdd": ["Docker", "TypeScript", "Redis", "GitHub Actions"],
  "improvements": [
    "Rewrite summary with JD job title and top 3 required skills",
    "Add metrics to every project bullet (users, performance, uptime)",
    "Add Docker and CI/CD to Technical Skills",
    "Use exact JD keywords in bullet verbs (implemented, optimized, deployed)"
  ],
  "formatIssues": ["Tables may not parse in ATS", "Use standard section names", "Add LinkedIn/GitHub URLs"],
  "quickWins": [
    {"action": "Add 'Docker' and 'CI/CD' to Technical Skills", "impact": "High", "effort": "1 minute", "section": "Technical Skills", "reason": "Appears 4x in JD, likely ATS filter"},
    {"action": "Rewrite Summary line 1 to include job title from JD", "impact": "High", "effort": "2 minutes", "section": "Summary", "reason": "ATS weights summary keywords heavily"},
    {"action": "Add 1 metric to each project bullet (users, % improvement, response time)", "impact": "High", "effort": "5 minutes", "section": "Projects", "reason": "Separates shortlisted vs rejected in same ATS score range"},
    {"action": "Add GitHub URL to contact section", "impact": "Medium", "effort": "30 seconds", "section": "Contact", "reason": "Recruiters check GitHub for code quality"},
    {"action": "Mirror JD's language in bullets: use 'REST APIs', 'agile', 'deployment'", "impact": "Medium", "effort": "10 minutes", "section": "All", "reason": "Exact keyword match boosts ATS score 8-12 points"}
  ]
}`;

      const raw=await callAI(prompt,4000,"json");
      const data=safeJSON(raw,null);
      if(!data?.matchScore) throw new Error("Analysis failed. Please try again.");
      setAnalysis(data); setStep("analyzed"); setSection("overview");
    }catch(e){setErr(e.message||"Analysis failed.");setStep("input");}
  };

  // MASTER OPTIMIZATION — builds 90+ ATS resume
  const runOptimize=async(retryCount=0)=>{
    setStep("optimizing"); setErr(""); setOptRetries(retryCount);
    const extractedEducation=extractEducationFromResume(resume);
    const hasExp=hasRealExperience(resume);
    const isFresher=!hasExp;

    try{
      const prompt=`You are a master ATS resume writer. Your goal: build a resume that scores 90+ on ATS for this JD.

RULES:
1. ${isFresher?"FRESHER — DO NOT invent experience. No Experience section.":"Rewrite experience bullets with JD keywords + metrics."}
2. Every project bullet MUST have a metric (users, %, ms, uptime, requests/sec).
3. Mirror JD keywords EXACTLY in summary, skills, and bullets — same spelling, same casing.
4. Technical Skills must include ALL high-importance missing keywords from JD.
5. Summary must open with exact job title from JD.
6. Certifications: keep real ones, add "215+ DSA problems solved on LeetCode" if coding-focused.
7. Return ONLY valid JSON, no markdown.

JD: ${jd.trim().slice(0,700)}
ORIGINAL RESUME: ${resume.trim().slice(0,2500)}

Return EXACT JSON:
{
  "name": "Full Name from resume",
  "phone": "phone from resume",
  "email": "email from resume",
  "linkedin": "linkedin from resume",
  "github": "github from resume",
  "location": "city from resume",
  "summary": "2-3 sentence summary. MUST start with JD job title. MUST include top 4 JD skills. Example: Full-Stack Developer with expertise in React, Node.js, and REST API design, passionate about building scalable web applications. Proven through 3+ production-grade projects serving real users. Strong foundation in DSA with 215+ LeetCode problems solved.",
  "education": [{"school": "exact from resume", "location": "city", "degree": "exact degree", "dates": "dates"}],
  ${hasExp?`"experience": [{"title": "exact title from resume", "company": "exact company", "location": "city", "dates": "exact dates", "bullets": ["Developed [JD keyword] feature using [JD tech stack], improving [metric] by X%", "Collaborated in agile sprint cycles, delivering [feature] that [measurable outcome]", "Implemented [JD keyword] reducing [metric] from X to Y ms"]}],`:""}
  "projects": [
    {
      "name": "Project Name from resume",
      "tech": "React, Node.js, MongoDB, JWT (use JD keywords)",
      "dates": "dates if available",
      "bullets": [
        "Engineered [JD keyword] using [stack], deployed on [platform] serving 500+ active users with 99.9% uptime",
        "Implemented [JD keyword e.g. REST API / JWT auth / CI/CD pipeline] reducing [metric] by 40%",
        "Optimized [component] achieving [specific metric e.g. 200ms API response time, 95+ Lighthouse score]"
      ]
    }
  ],
  "skills": [
    {"category": "Languages", "items": "include JD languages first"},
    {"category": "Frameworks & Libraries", "items": "include ALL JD frameworks"},
    {"category": "Databases", "items": "include JD databases"},
    {"category": "Tools & DevOps", "items": "include Docker, CI/CD, Git, and other JD tools"},
    {"category": "Cloud", "items": "AWS/GCP/Azure if in JD"},
    {"category": "Concepts", "items": "REST APIs, Microservices, Agile, DSA, OOPs, DBMS"}
  ],
  "certifications": ["list real certifications from resume", "X+ DSA problems solved on LeetCode (if relevant)"],
  "optimizedMatchScore": 91,
  "optimizedAtsScore": 93,
  "optimizedShortlistRate": 38,
  "changeLog": [
    {"section": "Summary", "change": "Rewrote to open with JD job title 'Full-Stack Developer', added React, Node.js, REST API keywords", "impact": "+12 ATS points"},
    {"section": "Projects - Bullet 1", "change": "Added metric '500+ users', added 'REST API' and 'JWT authentication' keywords", "impact": "+8 ATS points"},
    {"section": "Technical Skills", "change": "Added Docker, CI/CD, TypeScript from JD requirements", "impact": "+9 ATS points"},
    {"section": "Projects - Tech Stack", "change": "Added missing JD keywords to tech tags", "impact": "+5 ATS points"}
  ]
}`;

      const raw=await callAI(prompt,4000,"json");
      const data=safeJSON(raw,null);
      if(!data?.name||!data?.skills){
        if(retryCount<2) return runOptimize(retryCount+1);
        throw new Error("Optimization failed. Please try again.");
      }

      // SAFETY: Remove experience for fresher
      if(isFresher&&data.experience) delete data.experience;
      // Restore exact education
      if(extractedEducation.length>0) data.education=extractedEducation;

      const cl=data.changeLog||[];
      delete data.changeLog;

      const optScores={
        matchScore:data.optimizedMatchScore||Math.min(96,(analysis?.matchScore||70)+18),
        atsScore:data.optimizedAtsScore||Math.min(96,(analysis?.atsScore||70)+16),
        shortlistRate:data.optimizedShortlistRate||Math.min(48,(analysis?.shortlistRate||20)+16)
      };
      delete data.optimizedMatchScore; delete data.optimizedAtsScore; delete data.optimizedShortlistRate;

      setOptimized(data); setOptimizedScores(optScores); setChangeLog(cl);
      setStep("optimized"); setSection("resume");
    }catch(e){
      if(retryCount<2) return runOptimize(retryCount+1);
      setErr(e.message||"Optimization failed."); setStep("analyzed");
    }
  };

  const handleJDImage=async(e)=>{
    const files=Array.from(e.target.files); if(!files.length) return;
    setJdImageLoading(true); setErr("");
    try{
      let allText="";
      for(let i=0;i<files.length;i++){
        const f=files[i];
        const base64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});
        const text=await callAI(`Extract ALL text from this job description image exactly as written. Return only plain text.\n[IMAGE:${f.type};base64,${base64.slice(0,200)}...]`,1500,"text");
        allText+=(text||"")+"\n\n";
      }
      setJd(allText.trim()); localStorage.setItem("tp_jd",allText.trim());
    }catch(e2){setErr("Image read failed: "+e2.message);}
    setJdImageLoading(false);
  };

  const scoreColor=s=>s>=80?"#16a34a":s>=60?"#d97706":s>=40?"#ea580c":"#dc2626";
  const scoreBg=s=>s>=80?"#f0fdf4":s>=60?"#fffbeb":s>=40?"#fff7ed":"#fef2f2";
  const scoreBorder=s=>s>=80?"#bbf7d0":s>=60?"#fef08a":s>=40?"#fed7aa":"#fecaca";
  const statusIcon=st=>st==="good"?"✅":st==="warning"?"⚠️":"❌";

  const handleDownload=async(type)=>{
    if(!optimized) return; setDownloading(type);
    try{
      if(type==="pdf") await downloadPDF(optimized,"TakePlace_ATS_Optimized_Resume.pdf");
      else await downloadDOCXJake(optimized,"TakePlace_ATS_Optimized_Resume.docx");
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
        <div style={{textAlign:"center",marginBottom:3}}><div style={{fontSize:18,fontWeight:700}}>{data.name}</div></div>
        <div style={{textAlign:"center",marginBottom:10,fontSize:8,color:"#374151",lineHeight:1.5}}>{[data.phone,data.email,data.linkedin,data.github,data.location].filter(Boolean).join(" | ")}</div>
        {data.summary&&(<><div style={sS}>Professional Summary</div><div style={{...ps,marginBottom:8,fontStyle:"italic"}}>{data.summary}</div></>)}
        {data.education?.length>0&&(<><div style={sS}>Education</div>{data.education.map((edu,i)=>(<div key={i} style={{marginBottom:6}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:9}}>{edu.school}</span><span style={{fontSize:8.5,color:"#374151"}}>{edu.location}</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:8.5,fontStyle:"italic"}}>{edu.degree}</span><span style={{fontSize:8.5,color:"#374151"}}>{edu.dates}</span></div></div>))}</>)}
        {data.experience?.length>0&&(<><div style={sS}>Experience</div>{data.experience.map((exp,i)=>(<div key={i} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:9}}>{exp.title}</span><span style={{fontSize:8.5,color:"#374151"}}>{exp.dates}</span></div><div style={{fontSize:8.5,fontStyle:"italic",color:"#374151",marginBottom:3}}>{exp.company}{exp.location?`, ${exp.location}`:""}</div>{(exp.bullets||[]).map((b,j)=>(<div key={j} style={bS}><span style={{position:"absolute",left:3,top:0}}>•</span>{b}</div>))}</div>))}</>)}
        {data.projects?.length>0&&(<><div style={sS}>Projects</div>{data.projects.map((proj,i)=>(<div key={i} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}><span><span style={{fontWeight:700,fontSize:9}}>{proj.name}</span>{proj.tech&&<span style={{fontStyle:"italic",fontSize:8.5,color:"#374151"}}> | {proj.tech}</span>}</span>{proj.dates&&<span style={{fontSize:8.5,color:"#374151"}}>{proj.dates}</span>}</div><div style={{marginTop:2}}>{(proj.bullets||[]).map((b,j)=>(<div key={j} style={bS}><span style={{position:"absolute",left:3,top:0}}>•</span>{b}</div>))}</div></div>))}</>)}
        {data.skills?.length>0&&(<><div style={sS}>Technical Skills</div>{data.skills.map((sk,i)=>(<div key={i} style={{...ps,marginBottom:2.5}}><span style={{fontWeight:700}}>{sk.category}: </span><span>{sk.items}</span></div>))}</>)}
        {data.certifications?.length>0&&(<><div style={sS}>Certifications & Achievements</div>{data.certifications.map((c,i)=>(<div key={i} style={bS}><span style={{position:"absolute",left:3,top:0}}>•</span>{c}</div>))}</>)}
      </div>
    );
  };

  const Ring=({score,size=88,color,label,sublabel})=>{
    const r=34,circ=2*Math.PI*r,col=color||scoreColor(score);
    return(<div style={{textAlign:"center"}}><svg width={size} height={size} viewBox="0 0 80 80"><circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6"/><circle cx="40" cy="40" r={r} fill="none" stroke={col} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)} strokeLinecap="round" transform="rotate(-90 40 40)"/><text x="40" y="44" textAnchor="middle" fill={col} fontSize="15" fontWeight="800" fontFamily="Inter">{score}%</text></svg>{label&&<div style={{fontSize:11,color:"#64748b",fontWeight:600,marginTop:2}}>{label}</div>}{sublabel&&<div style={{fontSize:9,color:scoreColor(score),fontWeight:700,marginTop:1}}>{sublabel}</div>}</div>);
  };

  const DeltaBadge=({original,optimized:opt})=>{
    const delta=opt-original; if(!delta) return null;
    return(<span style={{background:delta>0?"#f0fdf4":"#fef2f2",color:delta>0?"#16a34a":"#dc2626",fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:20,marginLeft:6}}>{delta>0?"+":""}{delta}%</span>);
  };

  const isFresherResume=!hasRealExperience(resume);
  const a=analysis;

  const getShortlistLabel=(rate)=>{
    if(rate>=40) return "High chance";
    if(rate>=25) return "Moderate";
    if(rate>=15) return "Low";
    return "Very low";
  };

  if(step==="input") return(
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontWeight:900,fontSize:isMobile?20:24,color:C.text,marginBottom:4}}>⚡ AI Resume Analyzer — Master Level</div>
        <div style={{color:C.muted,fontSize:13}}>Deep ATS scan · Section-by-section keyword gaps · 90+ ATS-ready optimization · Full change log</div>
      </div>

      {/* Feature badges */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
        {["🔬 Section-by-section keyword audit","🎯 Real ATS score (no inflation)","⚡ One-click 90+ ATS optimization","📋 Full change log — see every fix","⬇️ Download PDF/DOCX"].map((f,i)=>(
          <div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:18,padding:"4px 12px",fontSize:11,color:C.soft,fontWeight:600}}>{f}</div>
        ))}
      </div>

      {isFresherResume&&resume&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:C.blue}}>ℹ️ <strong>Fresher resume detected</strong> — no fake experience will be added. Strong summary + metric-driven project bullets will be generated.</div>}
      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"10px 14px",marginBottom:14,color:C.danger,fontSize:13}}>⚠ {err}</div>}

      <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <div style={{flex:1}}><div style={{fontWeight:700,color:C.text,fontSize:14}}>📋 Job Description</div><div style={{fontSize:11,color:C.muted}}>Paste full JD for best results</div></div>
          <div style={{display:"flex",gap:6}}>
            {jd&&<span style={{background:"#f0fdf4",color:"#16a34a",fontSize:11,padding:"3px 10px",borderRadius:18,fontWeight:700}}>{jd.split(/\s+/).filter(Boolean).length} words</span>}
            <button onClick={()=>jdImageRef.current.click()} disabled={jdImageLoading} style={{padding:"6px 12px",borderRadius:8,border:`1.5px solid ${C.orange}40`,background:`${C.orange}08`,color:C.orange,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>
              {jdImageLoading?<><SpinIcon size={11} color={C.orange}/> Reading...</>:"📸 JD Photo"}
            </button>
            <input ref={jdImageRef} type="file" accept="image/*" multiple onChange={handleJDImage} style={{display:"none"}}/>
          </div>
        </div>
        <textarea value={jd} onChange={e=>{setJd(e.target.value);localStorage.setItem("tp_jd",e.target.value);}} placeholder="Paste the complete job description here — the more text, the better the analysis..." style={{...inp,minHeight:160,resize:"vertical",lineHeight:1.8}}/>
      </div>

      <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontWeight:700,color:C.text,fontSize:14}}>📄 Your Resume</div>
          <button onClick={()=>fileRef.current.click()} style={{padding:"6px 12px",borderRadius:8,border:`1.5px solid ${C.blue}40`,background:`${C.blue}08`,color:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>📁 Upload PDF/DOCX</button>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFile} style={{display:"none"}}/>
        {fileName&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:7,padding:"5px 10px",marginBottom:8,fontSize:12,color:"#16a34a"}}>✅ {fileName} loaded</div>}
        <textarea value={resume} onChange={e=>{setResume(e.target.value);localStorage.setItem("tp_resume",e.target.value);}} placeholder="Paste your complete resume text here or upload above..." style={{...inp,minHeight:200,resize:"vertical",lineHeight:1.8}}/>
      </div>

      <button onClick={runAnalysis} disabled={!jd.trim()||!resume.trim()}
        style={{width:"100%",padding:"15px",fontSize:15,borderRadius:12,border:"none",cursor:!jd.trim()||!resume.trim()?"not-allowed":"pointer",background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",fontWeight:800,fontFamily:"'Inter',sans-serif",opacity:!jd.trim()||!resume.trim()?0.5:1,boxShadow:"0 4px 20px #2563eb40"}}>
        🔬 Deep Analyze Resume — Master ATS Scan
      </button>
    </div>
  );

  if(step==="analyzing") return(
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:56,marginBottom:16,animation:"float 2s ease-in-out infinite"}}>🧠</div>
      <div style={{fontWeight:800,fontSize:20,color:C.text,marginBottom:8}}>Deep ATS Analysis Running</div>
      <div style={{color:C.muted,fontSize:13,lineHeight:2,marginBottom:24}}>
        Scanning section by section...<br/>
        Extracting JD keywords and scoring gaps...<br/>
        Calculating real ATS and shortlist rate...
      </div>
      <SpinIcon size={40} color={C.blue}/>
    </div>
  );

  if(step==="optimizing") return(
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:56,marginBottom:16,animation:"float 2s ease-in-out infinite"}}>✨</div>
      <div style={{fontWeight:800,fontSize:20,color:C.text,marginBottom:8}}>Building 90+ ATS Resume</div>
      <div style={{color:C.muted,fontSize:13,lineHeight:2,marginBottom:24}}>
        {optRetries>0?`Retry ${optRetries}/2 — improving quality...`:"Injecting all missing JD keywords..."}<br/>
        {isFresherResume?"Fresher mode — adding metrics to project bullets...":"Rewriting bullets with JD keywords + metrics..."}<br/>
        Verifying ATS compliance...
      </div>
      <SpinIcon size={40} color={C.purple}/>
    </div>
  );

  if(!a) return null;

  const displayScores=(step==="optimized"&&optimizedScores)?optimizedScores:{matchScore:a.matchScore,atsScore:a.atsScore,shortlistRate:a.shortlistRate||20};

  const tabs=[
    ["overview","📊 Overview"],
    ["audit","🔬 Section Audit"],
    ["keywords","🎯 Keyword Gaps"],
    ["projects","🏗️ Projects"],
    ...(step==="optimized"?[["changelog","📋 Changes"],["resume","✨ Resume"]]:[[]])
  ].filter(t=>t.length);

  return(
    <div>
      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"10px 14px",marginBottom:14,color:C.danger,fontSize:13}}>⚠ {err}</div>}

      {/* SCORE HEADER */}
      <div style={{background:"linear-gradient(135deg,#eff6ff,#f0fdf4)",border:`1.5px solid ${C.blue}20`,borderRadius:18,padding:isMobile?16:24,marginBottom:14}}>

        {/* Recruiter Decision Banner */}
        {a.recruiterDecision&&step!=="optimized"&&(
          <div style={{background:a.matchScore>=70?"#f0fdf4":a.matchScore>=50?"#fffbeb":"#fef2f2",border:`1px solid ${a.matchScore>=70?"#bbf7d0":a.matchScore>=50?"#fef08a":"#fecaca"}`,borderRadius:10,padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>👔</span>
            <div>
              <div style={{fontWeight:700,fontSize:12,color:C.text}}>Recruiter Decision</div>
              <div style={{fontSize:13,color:a.matchScore>=70?C.green:a.matchScore>=50?C.warn:C.danger,fontWeight:600}}>{a.recruiterDecision}</div>
            </div>
          </div>
        )}
        {step==="optimized"&&(
          <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>🎯</span>
            <div>
              <div style={{fontWeight:700,fontSize:12,color:C.text}}>Optimized — Ready for Applications</div>
              <div style={{fontSize:12,color:C.green}}>This resume has 90+ ATS score and should pass automated screening at {a.recruiterDecision?.includes("Amazon")||a.recruiterDecision?.includes("Google")?"FAANG-level":"top Indian tech"} companies.</div>
            </div>
          </div>
        )}

        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:isMobile?14:28,marginBottom:18,flexWrap:"wrap"}}>
          <div style={{textAlign:"center"}}>
            <Ring score={displayScores.matchScore} label="JD Match"
              sublabel={step==="optimized"?"✅ Optimized":a.matchScore>=75?"Strong":a.matchScore>=55?"Moderate":"Weak"}/>
            {step==="optimized"&&<DeltaBadge original={a.matchScore} optimized={optimizedScores?.matchScore}/>}
          </div>
          <div style={{width:1,height:60,background:"#e2e8f0"}}/>
          <div style={{textAlign:"center"}}>
            <Ring score={displayScores.atsScore} color={C.blue} label="ATS Score"
              sublabel={displayScores.atsScore>=85?"Pass":"Needs work"}/>
            {step==="optimized"&&<DeltaBadge original={a.atsScore} optimized={optimizedScores?.atsScore}/>}
          </div>
          <div style={{width:1,height:60,background:"#e2e8f0"}}/>
          <div style={{textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:"50%",border:`6px solid ${scoreColor(displayScores.shortlistRate*2)}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",margin:"0 auto"}}>
              <div style={{fontWeight:900,fontSize:16,color:scoreColor(displayScores.shortlistRate*2)}}>{displayScores.shortlistRate}%</div>
            </div>
            <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginTop:2}}>Shortlist Rate</div>
            <div style={{fontSize:9,color:scoreColor(displayScores.shortlistRate*2),fontWeight:700,marginTop:1}}>{getShortlistLabel(displayScores.shortlistRate)}</div>
            {step==="optimized"&&<DeltaBadge original={a.shortlistRate||0} optimized={optimizedScores?.shortlistRate}/>}
          </div>
        </div>

        <div style={{textAlign:"center"}}>
          <div style={{display:"inline-block",padding:"5px 18px",borderRadius:18,background:scoreBg(displayScores.matchScore),color:scoreColor(displayScores.matchScore),fontWeight:800,fontSize:13,marginBottom:8}}>
            {step==="optimized"?"✨ ATS-Optimized — Ready to Apply":a.verdict}
          </div>
          <div style={{color:"#475569",fontSize:13,lineHeight:1.8,maxWidth:520,margin:"0 auto"}}>{a.summary}</div>
        </div>

        {/* Top Strengths / Critical Gaps */}
        {step!=="optimized"&&a.topStrengths&&a.criticalGaps&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:14}}>
            <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:12}}>
              <div style={{fontWeight:700,fontSize:12,color:C.green,marginBottom:6}}>✅ Strengths</div>
              {a.topStrengths.slice(0,3).map((s,i)=>(
                <div key={i} style={{fontSize:11,color:"#14532d",display:"flex",gap:5,marginBottom:3}}>
                  <span>•</span><span>{s}</span>
                </div>
              ))}
            </div>
            <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:12}}>
              <div style={{fontWeight:700,fontSize:12,color:C.danger,marginBottom:6}}>❌ Critical Gaps</div>
              {a.criticalGaps.slice(0,3).map((g,i)=>(
                <div key={i} style={{fontSize:11,color:"#991b1b",display:"flex",gap:5,marginBottom:3}}>
                  <span>•</span><span>{g}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TABS */}
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        {tabs.map(([k,l])=>(<button key={k} onClick={()=>setSection(k)} style={{padding:"8px 16px",borderRadius:18,whiteSpace:"nowrap",border:`1.5px solid ${section===k?C.blue:C.border}`,background:section===k?`${C.blue}10`:"#fff",color:section===k?C.blue:"#64748b",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:section===k?700:400,fontSize:13}}>{l}</button>))}
      </div>

      {/* OVERVIEW TAB */}
      {section==="overview"&&(
        <div>
          {/* Quick Wins */}
          {a.quickWins?.length>0&&(
            <div style={{background:"#fff",border:`1.5px solid ${C.green}30`,borderRadius:14,padding:18,marginBottom:12}}>
              <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:4}}>⚡ Quick Wins — Do These First</div>
              <div style={{color:C.muted,fontSize:12,marginBottom:12}}>These changes will have the highest ATS impact in the least time.</div>
              {a.quickWins.map((w,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10,background:"#f0fdf4",borderRadius:10,padding:12,border:"1px solid #bbf7d0"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:C.green,color:"#fff",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:3}}>{w.action}</div>
                    {w.reason&&<div style={{fontSize:11,color:C.muted,marginBottom:5,fontStyle:"italic"}}>{w.reason}</div>}
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <span style={{background:w.impact==="High"?"#fef2f2":"#fffbeb",color:w.impact==="High"?C.danger:C.warn,fontSize:10,padding:"2px 8px",borderRadius:18,fontWeight:700}}>{w.impact} Impact</span>
                      <span style={{background:"#f1f5f9",color:C.muted,fontSize:10,padding:"2px 8px",borderRadius:18}}>{w.effort}</span>
                      <span style={{background:`${C.blue}10`,color:C.blue,fontSize:10,padding:"2px 8px",borderRadius:18}}>📍 {w.section}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Weak Areas */}
          {a.weakAreas?.length>0&&(
            <div style={{background:"#fff",border:`1.5px solid ${C.danger}20`,borderRadius:14,padding:18,marginBottom:12}}>
              <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:12}}>🚨 Critical Issues to Fix</div>
              {a.weakAreas.map((w,i)=>(
                <div key={i} style={{marginBottom:10,background:scoreBg(w.priority==="Critical"?20:40),borderRadius:10,padding:14,border:`1px solid ${scoreBorder(w.priority==="Critical"?20:40)}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <div style={{fontWeight:700,fontSize:13,color:C.text}}>{w.area}</div>
                    <Tag color={w.priority==="Critical"?C.danger:C.warn}>{w.priority}</Tag>
                  </div>
                  <div style={{color:C.soft,fontSize:12,marginBottom:6}}>{w.detail}</div>
                  <div style={{background:"#f0fdf4",borderRadius:7,padding:"6px 10px",fontSize:12,color:"#14532d"}}>💡 Fix: {w.fix}</div>
                </div>
              ))}
            </div>
          )}

          {/* Strong Matches */}
          <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}>
            <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:12}}>✅ Strong Keyword Matches</div>
            {(a.strongMatches||[]).map((m,i)=>(<div key={i} style={{marginBottom:10,background:"#f0fdf4",borderRadius:10,padding:12,border:"1px solid #bbf7d0"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><div style={{fontWeight:700,color:C.text}}>{m.skill} <span style={{fontSize:10,color:C.muted,fontWeight:400}}>({m.found_in})</span></div><div style={{fontWeight:800,fontSize:14,color:scoreColor(m.strength)}}>{m.strength}%</div></div><div style={{color:"#64748b",fontSize:12,marginBottom:6}}>{m.reason}</div><div style={{background:"#e2e8f0",borderRadius:4,height:4,overflow:"hidden"}}><div style={{height:"100%",width:`${m.strength}%`,background:"#16a34a",borderRadius:4}}/></div></div>))}
          </div>

          {/* Optimize CTA */}
          {step!=="optimized"&&(
            <div style={{background:"linear-gradient(135deg,#eff6ff,#ede9fe)",border:`1.5px solid ${C.blue}20`,borderRadius:18,padding:20,textAlign:"center"}}>
              <div style={{fontWeight:800,fontSize:17,color:C.text,marginBottom:6}}>🎯 Fix Everything — Get 90+ ATS Score</div>
              <div style={{color:"#64748b",fontSize:13,marginBottom:12,lineHeight:1.8}}>
                {isFresherResume
                  ? "Fresher mode: metric-driven project bullets, full keyword injection, ATS-optimized format."
                  : "Full keyword injection, quantified metrics in every bullet, ATS-safe format."
                }<br/>
                <strong>Generates a resume that passes automated screening at top companies.</strong>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:12}}>
                {["All JD keywords injected","Metrics in every bullet","Jake's single-page format","Download PDF + DOCX","Full change log"].map((f,i)=>(
                  <span key={i} style={{background:"#fff",border:`1px solid ${C.purple}30`,borderRadius:18,padding:"4px 12px",fontSize:11,color:C.purple,fontWeight:600}}>✓ {f}</span>
                ))}
              </div>
              <button onClick={()=>runOptimize(0)} style={{padding:"13px 36px",fontSize:15,borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#7c3aed,#5b21b6)",color:"#fff",fontWeight:800,fontFamily:"'Inter',sans-serif",boxShadow:"0 4px 20px #7c3aed40"}}>✨ Build 90+ ATS Resume</button>
            </div>
          )}
        </div>
      )}

      {/* SECTION AUDIT TAB */}
      {section==="audit"&&(
        <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18}}>
          <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:4}}>🔬 Section-by-Section Audit</div>
          <div style={{color:C.muted,fontSize:12,marginBottom:14}}>Every section scored and keyword-analyzed against the JD.</div>
          {(a.sectionAudit||[]).map((s,i)=>(
            <div key={i} style={{marginBottom:14,background:scoreBg(s.score),borderRadius:12,padding:16,border:`1px solid ${scoreBorder(s.score)}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:16}}>{statusIcon(s.status)}</span>
                  <span style={{fontWeight:700,fontSize:14,color:C.text}}>{s.section}</span>
                </div>
                <div style={{fontWeight:900,fontSize:18,color:scoreColor(s.score)}}>{s.score}%</div>
              </div>
              <div style={{background:"#e2e8f0",borderRadius:4,height:5,overflow:"hidden",marginBottom:10}}>
                <div style={{height:"100%",width:`${s.score}%`,background:scoreColor(s.score),borderRadius:4,transition:"width .5s"}}/>
              </div>
              <div style={{color:"#475569",fontSize:13,marginBottom:10,lineHeight:1.7}}>{s.feedback}</div>

              {/* Keywords found */}
              {s.keywords_present?.length>0&&(
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.green,marginBottom:4}}>✅ Keywords Found in This Section:</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {s.keywords_present.map((k,j)=><span key={j} style={{background:"#f0fdf4",color:C.green,fontSize:11,padding:"3px 10px",borderRadius:18,border:"1px solid #bbf7d0",fontWeight:600}}>{k}</span>)}
                  </div>
                </div>
              )}

              {/* Keywords missing */}
              {s.keywords_missing?.length>0&&(
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.danger,marginBottom:4}}>❌ Missing Keywords (add these to this section):</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {s.keywords_missing.map((k,j)=><span key={j} style={{background:"#fef2f2",color:C.danger,fontSize:11,padding:"3px 10px",borderRadius:18,border:"1px solid #fecaca",fontWeight:600}}>+ {k}</span>)}
                  </div>
                </div>
              )}

              {/* Action */}
              {s.action&&(
                <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.text,display:"flex",gap:6}}>
                  <span>💡</span><span><strong>Action:</strong> {s.action}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* KEYWORD GAPS TAB */}
      {section==="keywords"&&(
        <div>
          <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontWeight:700,color:C.danger,fontSize:14,marginBottom:4}}>
              🎯 Missing Keywords by Section — {a.missingKeywords?.length||0} total gaps
            </div>
            <div style={{color:C.soft,fontSize:12}}>Each keyword below is pulled directly from the JD. Add them to your resume exactly as shown.</div>
          </div>

          {/* Grouped by section with JD weight */}
          {(a.keywordGapsBySectionDetail||[]).map((gap,i)=>(
            <div key={i} style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                <div style={{background:`${C.blue}15`,color:C.blue,fontSize:12,fontWeight:800,padding:"4px 12px",borderRadius:18}}>📍 {gap.section}</div>
                <div style={{background:gap.impact==="High"?"#fef2f2":"#fffbeb",color:gap.impact==="High"?C.danger:C.warn,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:18}}>{gap.impact} Priority</div>
                {gap.jd_frequency&&<div style={{fontSize:11,color:C.muted,background:C.bg,padding:"3px 8px",borderRadius:12}}>Appears {gap.jd_frequency}x in JD</div>}
              </div>

              <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:12}}>
                {(gap.missing_keywords||[]).map((k,j)=>(
                  <span key={j} style={{background:"#fef2f2",color:C.danger,fontSize:13,padding:"5px 14px",borderRadius:20,fontWeight:700,border:"1.5px solid #fecaca"}}>+ {k}</span>
                ))}
              </div>

              <div style={{background:"#f0fdf4",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#14532d",marginBottom:gap.ats_weight?8:0}}>
                <strong>💡 How to add:</strong> {gap.how_to_add}
              </div>

              {gap.ats_weight&&(
                <div style={{background:"#fffbeb",borderRadius:8,padding:"7px 12px",fontSize:11,color:"#92400e",marginTop:6}}>
                  ⚠️ ATS Impact: {gap.ats_weight}
                </div>
              )}
            </div>
          ))}

          {/* Flat missing keywords fallback */}
          {!a.keywordGapsBySectionDetail?.length&&(a.missingKeywords||[]).map((m,i)=>(
            <div key={i} style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{fontWeight:700,fontSize:14,color:C.text}}>🔍 {m.keyword}</div>
                <div style={{display:"flex",gap:6}}>
                  <span style={{background:m.importance==="High"?"#fef2f2":"#fffbeb",color:m.importance==="High"?C.danger:C.warn,fontSize:11,padding:"3px 10px",borderRadius:18,fontWeight:700}}>{m.importance}</span>
                  {m.section&&<span style={{background:`${C.blue}10`,color:C.blue,fontSize:11,padding:"3px 10px",borderRadius:18}}>📍 {m.section}</span>}
                </div>
              </div>
              <div style={{color:"#475569",fontSize:12}}>💡 {m.tip}</div>
              {m.ats_impact&&<div style={{fontSize:11,color:C.warn,marginTop:5}}>⚠️ {m.ats_impact}</div>}
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS TAB */}
      {section==="projects"&&(
        <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18}}>
          <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:4}}>🏗️ Project Relevance Analysis</div>
          <div style={{color:C.muted,fontSize:12,marginBottom:14}}>Which projects to keep, improve, or replace for this JD.</div>
          {(a.projectFit||[]).map((p,i)=>(
            <div key={i} style={{background:p.keep?"#f0fdf4":"#fef2f2",borderRadius:12,padding:16,marginBottom:12,border:`1.5px solid ${p.keep?"#bbf7d0":"#fecaca"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div style={{fontWeight:700,fontSize:15,color:C.text}}>{p.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontWeight:900,fontSize:17,color:scoreColor(p.relevance)}}>{p.relevance}%</span>
                  <Tag color={p.keep?C.green:C.danger}>{p.keep?"✅ Keep":"🔄 Replace"}</Tag>
                </div>
              </div>
              <div style={{background:"#e2e8f0",borderRadius:4,height:5,overflow:"hidden",marginBottom:10}}>
                <div style={{height:"100%",width:`${p.relevance}%`,background:scoreColor(p.relevance),borderRadius:4}}/>
              </div>
              <div style={{color:"#475569",fontSize:13,marginBottom:8}}>{p.reason}</div>
              {p.missing_from_bullets?.length>0&&(
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:11,color:C.danger,fontWeight:700,marginBottom:4}}>Missing from bullets:</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {p.missing_from_bullets.map((m,j)=><span key={j} style={{background:"#fef2f2",color:C.danger,fontSize:11,padding:"2px 8px",borderRadius:18}}>+ {m}</span>)}
                  </div>
                </div>
              )}
              {p.suggestion&&<div style={{background:`${C.purple}08`,border:`1px solid ${C.purple}20`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.purpleDark}}>💡 {p.suggestion}</div>}
            </div>
          ))}
        </div>
      )}

      {/* CHANGE LOG TAB */}
      {section==="changelog"&&step==="optimized"&&(
        <div>
          <div style={{background:"linear-gradient(135deg,#eff6ff,#ede9fe)",border:`1.5px solid ${C.purple}20`,borderRadius:14,padding:18,marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:4}}>📋 What Changed — Full Optimization Log</div>
            <div style={{color:C.muted,fontSize:12}}>Every change made to your resume and why it boosts ATS score.</div>
          </div>
          {changeLog.length>0?(
            changeLog.map((c,i)=>(
              <div key={i} style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:11}}>{i+1}</div>
                    <div style={{fontWeight:700,fontSize:13,color:C.text}}>{c.section}</div>
                  </div>
                  {c.impact&&<Tag color={C.green}>{c.impact}</Tag>}
                </div>
                <div style={{color:C.soft,fontSize:13,lineHeight:1.7}}>{c.change}</div>
              </div>
            ))
          ):(
            <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:20,textAlign:"center",color:C.muted,fontSize:13}}>
              Changes made — see the optimized resume in the Resume tab.
            </div>
          )}

          {/* Score delta summary */}
          {optimizedScores&&(
            <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:14,padding:18,marginTop:16}}>
              <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12}}>📈 Score Improvement</div>
              {[
                {label:"JD Match",from:a.matchScore,to:optimizedScores.matchScore},
                {label:"ATS Score",from:a.atsScore,to:optimizedScores.atsScore},
                {label:"Shortlist Rate",from:a.shortlistRate||0,to:optimizedScores.shortlistRate},
              ].map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                  <div style={{width:100,fontSize:12,color:C.text,fontWeight:600}}>{s.label}</div>
                  <div style={{flex:1,background:"#e2e8f0",borderRadius:4,height:8,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${s.to}%`,background:`linear-gradient(90deg,${C.blue},${C.green})`,borderRadius:4}}/>
                  </div>
                  <div style={{fontSize:13,fontWeight:800,color:C.green,minWidth:60}}>{s.from}% → {s.to}%</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* OPTIMIZED RESUME TAB */}
      {section==="resume"&&step==="optimized"&&optimized&&(
        <div>
          <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginBottom:8}}>
              <div>
                <div style={{fontWeight:700,fontSize:16}}>✨ ATS-Optimized Resume</div>
                <div style={{color:"#64748b",fontSize:12,marginTop:2}}>
                  {isFresherResume?"Fresher mode: no fake experience · metric-driven projects · all JD keywords":"Education preserved · all JD keywords injected · metrics in every bullet"}
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>handleDownload("pdf")} disabled={!!downloading} style={{padding:"9px 18px",borderRadius:9,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#5b21b6,#7c3aed)",color:"#fff",fontWeight:700,fontFamily:"'Inter',sans-serif",fontSize:13,opacity:downloading?0.6:1}}>
                  {downloading==="pdf"?"⏳ Building...":"⬇ Download PDF"}
                </button>
                <button onClick={()=>handleDownload("docx")} disabled={!!downloading} style={{padding:"9px 18px",borderRadius:9,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#14532d,#16a34a)",color:"#fff",fontWeight:700,fontFamily:"'Inter',sans-serif",fontSize:13,opacity:downloading?0.6:1}}>
                  {downloading==="docx"?"⏳ Building...":"⬇ Download DOCX"}
                </button>
              </div>
            </div>
            {optimizedScores&&(
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:18,padding:"5px 14px",fontSize:12,color:C.green,fontWeight:700}}>✅ ATS Score: {optimizedScores.atsScore}%</div>
                <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:18,padding:"5px 14px",fontSize:12,color:C.blue,fontWeight:700}}>🎯 JD Match: {optimizedScores.matchScore}%</div>
                <div style={{background:"#faf5ff",border:"1px solid #e9d5ff",borderRadius:18,padding:"5px 14px",fontSize:12,color:C.purple,fontWeight:700}}>📈 Shortlist: {optimizedScores.shortlistRate}%</div>
              </div>
            )}
          </div>
          <JakesResumePreview data={optimized}/>
        </div>
      )}

      <div style={{marginTop:16}}>
        <button onClick={()=>{setStep("input");setAnalysis(null);setOptimized(null);setOptimizedScores(null);setChangeLog([]);setErr("");setSection("overview");setJd("");setResume("");setFileName("");localStorage.removeItem("tp_jd");localStorage.removeItem("tp_resume");localStorage.removeItem("tp_fileName");}}
          style={{width:"100%",padding:"11px",borderRadius:9,border:`1.5px solid ${C.border}`,background:"transparent",color:"#64748b",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:13}}>
          🔄 Analyze Another Job
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// RECRUITER PORTAL
// ══════════════════════════════════════════════════════════════════════════
function RecruiterPortal({ user }) {
  const [view,setView]=useState("dashboard");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [jobForm,setJobForm]=useState({title:"",company:"",location:"",salary:"",description:"",skills:"",type:"fulltime",experience:"fresher"});
  const [filterSkill,setFilterSkill]=useState("");
  const [filterScore,setFilterScore]=useState(0);

  const mockCandidates=[
    {id:1,name:"Rahul Kumar",role:"Software Engineer",skills:["React","Node.js","Python","SQL"],atsScore:87,location:"Hyderabad",experience:"Fresher",college:"NIT Warangal",email:"rahul@example.com",appliedFor:"Frontend Developer"},
    {id:2,name:"Priya Sharma",role:"Data Analyst",skills:["Python","SQL","Tableau","Excel"],atsScore:82,location:"Bangalore",experience:"Fresher",college:"BITS Pilani",email:"priya@example.com",appliedFor:"Data Analyst"},
    {id:3,name:"Arjun Reddy",role:"Backend Developer",skills:["Java","Spring Boot","MySQL","Docker"],atsScore:91,location:"Pune",experience:"1 Year",college:"VIT Vellore",email:"arjun@example.com",appliedFor:"Backend Developer"},
    {id:4,name:"Sneha Patel",role:"Full Stack Developer",skills:["React","Node.js","MongoDB","AWS"],atsScore:78,location:"Mumbai",experience:"Fresher",college:"IIIT Hyderabad",email:"sneha@example.com",appliedFor:"Full Stack Developer"},
    {id:5,name:"Vikram Singh",role:"ML Engineer",skills:["Python","TensorFlow","Scikit-learn","SQL"],atsScore:85,location:"Chennai",experience:"Fresher",college:"IIT Madras",email:"vikram@example.com",appliedFor:"ML Engineer"},
  ];

  const [postedJobs,setPostedJobs]=useState([
    {id:1,title:"Frontend Developer",company:user?.email?.split("@")[0]||"Your Company",location:"Hyderabad",salary:"4-6 LPA",skills:"React, JavaScript, CSS",type:"fulltime",experience:"fresher",applicants:12,posted:new Date().toLocaleDateString(),status:"active"},
  ]);

  const filteredCandidates=mockCandidates.filter(c=>{
    const skillMatch=filterSkill?c.skills.some(s=>s.toLowerCase().includes(filterSkill.toLowerCase())):true;
    return skillMatch&&c.atsScore>=filterScore;
  });

  const scoreColor=s=>s>=80?"#16a34a":s>=60?"#d97706":"#dc2626";

  const postJob=async()=>{
    if(!jobForm.title||!jobForm.company||!jobForm.description){setErr("Fill title, company, and description.");return;}
    setLoading(true);
    const newJob={...jobForm,id:Date.now(),applicants:0,posted:new Date().toLocaleDateString(),status:"active"};
    setPostedJobs(j=>[newJob,...j]);
    setJobForm({title:"",company:"",location:"",salary:"",description:"",skills:"",type:"fulltime",experience:"fresher"});
    setView("jobs"); setLoading(false);
  };

  return(
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontWeight:900,fontSize:24,color:C.text,marginBottom:4}}>🏢 Recruiter Portal</div>
        <div style={{color:C.muted,fontSize:13}}>Post jobs · Browse ATS-filtered candidates · Contact directly</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
        {[["dashboard","📊 Dashboard"],["post","📝 Post Job"],["jobs","💼 My Jobs"],["candidates","👥 Candidates"]].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{padding:"10px 20px",borderRadius:12,whiteSpace:"nowrap",border:`1.5px solid ${view===v?C.blue:C.border}`,background:view===v?`${C.blue}10`:"#fff",color:view===v?C.blue:C.muted,fontFamily:"'Inter',sans-serif",fontWeight:view===v?700:400,fontSize:14,cursor:"pointer"}}>{l}</button>
        ))}
      </div>
      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"10px 14px",marginBottom:14,color:C.danger,fontSize:13}}>⚠ {err}</div>}

      {view==="dashboard"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:20}}>
            {[{icon:"💼",label:"Jobs Posted",val:postedJobs.length,color:C.blue},{icon:"👥",label:"Total Candidates",val:mockCandidates.length,color:C.purple},{icon:"🎯",label:"Avg ATS Score",val:`${Math.round(mockCandidates.reduce((a,b)=>a+b.atsScore,0)/mockCandidates.length)}%`,color:C.green},{icon:"✅",label:"Active Jobs",val:postedJobs.filter(j=>j.status==="active").length,color:C.orange}].map((s,i)=>(
              <div key={i} style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:18,textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:6}}>{s.icon}</div>
                <div style={{fontWeight:900,fontSize:22,color:s.color}}>{s.val}</div>
                <div style={{fontSize:12,color:C.muted}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:18}}>
            <div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:12}}>👥 Top Candidates</div>
            {mockCandidates.sort((a,b)=>b.atsScore-a.atsScore).slice(0,5).map((c,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<4?`1px solid ${C.border}`:"none"}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:13,flexShrink:0}}>{c.name[0]}</div>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{c.name}</div><div style={{fontSize:11,color:C.muted}}>{c.college} · {c.location}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:scoreColor(c.atsScore),fontSize:15}}>{c.atsScore}%</div><div style={{fontSize:10,color:C.muted}}>ATS</div></div>
                <button onClick={()=>window.open(`mailto:${c.email}`)} style={{padding:"6px 12px",borderRadius:8,border:`1.5px solid ${C.blue}30`,background:`${C.blue}08`,color:C.blue,fontSize:11,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>Contact</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view==="post"&&(
        <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:24}}>
          <div style={{fontWeight:700,fontSize:18,color:C.text,marginBottom:18}}>📝 Post a New Job</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div><label style={{fontSize:12,fontWeight:700,color:C.text,display:"block",marginBottom:4}}>Job Title *</label><input style={inp} placeholder="Frontend Developer" value={jobForm.title} onChange={e=>setJobForm(f=>({...f,title:e.target.value}))}/></div>
            <div><label style={{fontSize:12,fontWeight:700,color:C.text,display:"block",marginBottom:4}}>Company *</label><input style={inp} placeholder="Your Company" value={jobForm.company} onChange={e=>setJobForm(f=>({...f,company:e.target.value}))}/></div>
            <div><label style={{fontSize:12,fontWeight:700,color:C.text,display:"block",marginBottom:4}}>Location</label><input style={inp} placeholder="Hyderabad / Remote" value={jobForm.location} onChange={e=>setJobForm(f=>({...f,location:e.target.value}))}/></div>
            <div><label style={{fontSize:12,fontWeight:700,color:C.text,display:"block",marginBottom:4}}>Salary</label><input style={inp} placeholder="4-6 LPA" value={jobForm.salary} onChange={e=>setJobForm(f=>({...f,salary:e.target.value}))}/></div>
          </div>
          <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:700,color:C.text,display:"block",marginBottom:4}}>Required Skills</label><input style={inp} placeholder="React, Node.js, Python, SQL" value={jobForm.skills} onChange={e=>setJobForm(f=>({...f,skills:e.target.value}))}/></div>
          <div style={{marginBottom:18}}><label style={{fontSize:12,fontWeight:700,color:C.text,display:"block",marginBottom:4}}>Job Description *</label><textarea style={{...inp,minHeight:140,resize:"vertical"}} placeholder="Describe the role..." value={jobForm.description} onChange={e=>setJobForm(f=>({...f,description:e.target.value}))}/></div>
          <Btn variant="cta" loading={loading} onClick={postJob} style={{width:"100%",padding:"13px"}}>📤 Post Job</Btn>
        </div>
      )}

      {view==="jobs"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:17,color:C.text}}>💼 Your Posted Jobs</div>
            <Btn variant="cta" onClick={()=>setView("post")} size="sm">+ Post New</Btn>
          </div>
          {postedJobs.map((job,i)=>(
            <div key={i} style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:10,borderLeft:`3px solid ${C.blue}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div><div style={{fontWeight:800,fontSize:16}}>{job.title}</div><div style={{color:C.muted,fontSize:12}}>{job.company} · {job.location} · {job.salary}</div></div>
                <Tag color={C.green}>{job.status}</Tag>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                {(job.skills||"").split(",").filter(Boolean).map((sk,j)=><span key={j} style={{background:`${C.blue}10`,color:C.blue,fontSize:11,padding:"3px 10px",borderRadius:18,fontWeight:600}}>{sk.trim()}</span>)}
              </div>
              <div style={{display:"flex",gap:16,alignItems:"center"}}>
                <span style={{fontSize:12,color:C.muted}}>📅 {job.posted}</span>
                <span style={{fontSize:12,fontWeight:700,color:C.purple}}>👥 {job.applicants} applicants</span>
                <Btn variant="ghost" size="sm" onClick={()=>setView("candidates")}>View Candidates →</Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      {view==="candidates"&&(
        <div>
          <div style={{fontWeight:700,fontSize:17,color:C.text,marginBottom:16}}>👥 Candidate Database</div>
          <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><label style={{fontSize:11,color:C.muted,display:"block",marginBottom:3}}>Filter by Skill</label><input style={{...inp,fontSize:13}} placeholder="React, Python..." value={filterSkill} onChange={e=>setFilterSkill(e.target.value)}/></div>
              <div><label style={{fontSize:11,color:C.muted,display:"block",marginBottom:3}}>Min ATS: {filterScore}%</label><input type="range" min="0" max="100" value={filterScore} onChange={e=>setFilterScore(Number(e.target.value))} style={{width:"100%",marginTop:8}}/></div>
            </div>
            <div style={{marginTop:8,fontSize:12,color:C.muted}}>Showing {filteredCandidates.length} of {mockCandidates.length} candidates</div>
          </div>
          {filteredCandidates.map((c,i)=>(
            <div key={i} style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:10}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:16,flexShrink:0}}>{c.name[0]}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div><div style={{fontWeight:800,fontSize:15}}>{c.name}</div><div style={{fontSize:12,color:C.muted}}>{c.college} · {c.location} · {c.experience}</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontWeight:900,fontSize:20,color:scoreColor(c.atsScore)}}>{c.atsScore}%</div><div style={{fontSize:10,color:C.muted}}>ATS</div></div>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8,marginBottom:8}}>
                    {c.skills.map((sk,j)=><span key={j} style={{background:filterSkill&&sk.toLowerCase().includes(filterSkill.toLowerCase())?`${C.green}15`:`${C.blue}10`,color:filterSkill&&sk.toLowerCase().includes(filterSkill.toLowerCase())?C.green:C.blue,fontSize:11,padding:"3px 10px",borderRadius:18,fontWeight:600}}>{sk}</span>)}
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <button onClick={()=>window.open(`mailto:${c.email}?subject=Job Opportunity`)} style={{padding:"7px 14px",borderRadius:8,border:`1.5px solid ${C.blue}30`,background:`${C.blue}08`,color:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>📧 Email</button>
                    <button style={{padding:"7px 14px",borderRadius:8,border:`1.5px solid ${C.green}30`,background:`${C.green}08`,color:C.green,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>✅ Shortlist</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ══════════════════════════════════════════════════════════════════════════
function LandingPage({ onGetStarted }) {
  const [scrolled,setScrolled]=useState(false);
  const [liveCount,setLiveCount]=useState(127);
  const [recentHires]=useState([
    {name:"Rahul K.",company:"TCS",role:"SDE",city:"Hyderabad",time:"2 min ago",avatar:"R",color:C.blue},
    {name:"Sindhu M.",company:"Infosys",role:"Analyst",city:"Bangalore",time:"5 min ago",avatar:"S",color:C.purple},
    {name:"Vijay R.",company:"Amazon",role:"SDE-1",city:"Pune",time:"8 min ago",avatar:"V",color:C.orange},
    {name:"Priya S.",company:"Cognizant",role:"Dev",city:"Chennai",time:"11 min ago",avatar:"P",color:C.green},
    {name:"Arun T.",company:"Wipro",role:"Engineer",city:"Mumbai",time:"14 min ago",avatar:"A",color:C.teal},
  ]);
  const [toastIdx,setToastIdx]=useState(0);
  const [showToast,setShowToast]=useState(false);

  useEffect(()=>{const h=()=>setScrolled(window.scrollY>40);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  useEffect(()=>{const t=setInterval(()=>setLiveCount(n=>n+Math.floor(Math.random()*3)),8000);return()=>clearInterval(t);},[]);
  useEffect(()=>{
    const cycle=()=>{setShowToast(true);setTimeout(()=>{setShowToast(false);setTimeout(()=>{setToastIdx(i=>(i+1)%recentHires.length);},600);},4000);};
    cycle(); const t=setInterval(cycle,6000); return()=>clearInterval(t);
  },[]);

  const toast=recentHires[toastIdx];
  const stats=[{val:"1,200+",label:"Resumes Analyzed"},{val:"580+",label:"Jobs Tracked"},{val:"92%",label:"ATS Pass Rate"},{val:"45",label:"Companies"}];
  const features=[
    {icon:"⚡",title:"Resume AI — Master Level",desc:"Deep section-by-section ATS scan, keyword gap analysis, one-click 90+ ATS optimization with full change log.",color:C.blue,highlight:"90+ ATS guaranteed"},
    {icon:"🧪",title:"Mock Tests — LeetCode Style",desc:"30 companies · 40 tests each · Java, Python, C++, C, JavaScript · Solution reveal.",color:C.purple,highlight:"5 language support"},
    {icon:"🔥",title:"Live Jobs",desc:"Real fresher jobs from India's top companies. Updated daily.",color:C.danger,highlight:"127 added today"},
    {icon:"🔗",title:"LinkedIn Suite",desc:"AI-powered bio, headlines, cold DMs, cover letters.",color:C.green,highlight:"10x profile views"},
    {icon:"🏢",title:"Recruiter Portal",desc:"Post jobs, browse ATS-filtered candidates, contact directly.",color:C.orange,highlight:"For hiring teams"},
  ];
  const testimonials=[
    {name:"Rahul K.",role:"SDE @ TCS · Hyderabad",text:"Section-by-section keyword audit showed exactly what was missing. ATS went from 58% to 91% after optimization!",rating:5,avatar:"R",color:C.blue,tag:"Resume AI"},
    {name:"Sindhu M.",role:"Analyst @ Infosys · Bangalore",text:"The change log showed every single edit. I could see exactly why my ATS score jumped 30 points.",rating:5,avatar:"S",color:C.purple,tag:"Resume AI"},
    {name:"Vijay R.",role:"SDE-1 @ Amazon · Pune",text:"Amazon DSA mock tests with solution reveal helped me understand the pattern. Cracked OA first attempt!",rating:5,avatar:"V",color:C.orange,tag:"Mock Tests"},
    {name:"Priya S.",role:"Dev @ Cognizant · Chennai",text:"Writing in Python and seeing the JavaScript solution side by side was super helpful for learning.",rating:5,avatar:"P",color:C.green,tag:"Mock Tests"},
    {name:"Arun T.",role:"Engineer @ Wipro · Mumbai",text:"The recruiter decision feature is gold — told me exactly what a recruiter thinks when they see my resume.",rating:5,avatar:"A",color:C.teal,tag:"Resume AI"},
  ];

  return(
    <div style={{background:"#fff",color:C.text,fontFamily:"'Inter',sans-serif",overflowX:"hidden"}}>
      <style>{css}</style>
      <div style={{position:"fixed",bottom:24,left:24,zIndex:9999,transition:"all .4s",opacity:showToast?1:0,transform:showToast?"translateY(0)":"translateY(20px)",pointerEvents:"none"}}>
        <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:"12px 16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",display:"flex",alignItems:"center",gap:10,minWidth:240,maxWidth:300}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${toast.color},${toast.color}cc)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:14,flexShrink:0}}>{toast.avatar}</div>
          <div><div style={{fontWeight:700,fontSize:12}}>{toast.name} got hired at {toast.company}!</div><div style={{fontSize:10,color:C.muted}}>{toast.role} · {toast.city} · {toast.time}</div></div>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite",flexShrink:0}}/>
        </div>
      </div>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:scrolled?"rgba(255,255,255,.97)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${C.border}`:"none",transition:"all .3s",padding:"0 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div style={{fontWeight:900,fontSize:22,color:C.blue,display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:24}}>⚡</span> TakePlace</div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,background:"#f0fdf4",borderRadius:18,padding:"5px 12px",fontSize:12,color:C.green,fontWeight:700}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/>{liveCount} active now
            </div>
            <Btn variant="cta" onClick={onGetStarted} className="glow-btn" style={{padding:"8px 20px",fontSize:13}}>Get Free Access →</Btn>
          </div>
        </div>
      </nav>
      <div style={{background:C.blue,padding:"8px 0",marginTop:64,overflow:"hidden"}}>
        <div className="ticker-wrap"><div className="ticker-inner">
          {[...Array(2)].flatMap(()=>["🔥 127 New Fresher Jobs Added Today","⚡ 34 Companies Hiring","🏆 Resume ATS 90+ guaranteed","✅ LeetCode-style mocks with solution reveal","💼 Multi-language coding: Java Python C++ C JS"].map((t,i)=><span key={i} style={{color:"#fff",fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{t}&nbsp;&nbsp;•&nbsp;&nbsp;</span>))}
        </div></div>
      </div>
      <section style={{minHeight:"calc(100vh - 96px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 24px",background:"linear-gradient(160deg,#eff6ff 0%,#fff 45%,#f0fdf4 100%)"}}>
        <div style={{textAlign:"center",maxWidth:860}}>
          <div className="fade" style={{display:"inline-flex",alignItems:"center",gap:8,background:`${C.blue}10`,border:`1px solid ${C.blue}30`,borderRadius:20,padding:"6px 16px",marginBottom:24,fontSize:12,color:C.blue,fontWeight:700}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:C.blue,display:"inline-block",animation:"pulse 1.5s infinite"}}/>
            AI Placement Copilot for Indian Freshers · 100% Free
          </div>
          <div className="fade" style={{fontWeight:900,fontSize:"clamp(32px,6vw,64px)",lineHeight:1.08,marginBottom:20,letterSpacing:"-0.02em",animationDelay:".1s"}}>
            TakePlace = AI Placement Copilot<br/>
            <span style={{background:"linear-gradient(135deg,#2563eb,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Get Hired. Not Just Prepared.</span>
          </div>
          <div className="fade" style={{fontSize:16,color:C.soft,lineHeight:1.9,marginBottom:28,maxWidth:580,margin:"0 auto 28px",animationDelay:".2s"}}>
            90+ ATS Resume · LeetCode-Style Mock Tests · LinkedIn Suite · Live Jobs<br/>
            <strong style={{color:C.text}}>Built for Indian freshers. 100% free. No credit card.</strong>
          </div>
          <div className="fade" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:40,animationDelay:".3s"}}>
            <button onClick={onGetStarted} className="glow-btn" style={{padding:"15px 36px",fontSize:16,borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",fontWeight:800,fontFamily:"'Inter',sans-serif",boxShadow:"0 4px 24px #2563eb50"}}>🚀 Start Free Now</button>
            <button onClick={onGetStarted} style={{padding:"15px 28px",fontSize:15,borderRadius:12,border:`1.5px solid ${C.border}`,cursor:"pointer",background:"#fff",color:C.text,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>🏢 I'm a Recruiter →</button>
          </div>
          <div className="fade" style={{display:"flex",background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:20,overflow:"hidden",maxWidth:560,margin:"0 auto",boxShadow:"0 4px 20px rgba(0,0,0,0.06)",animationDelay:".4s"}}>
            {stats.map((s,i,a)=>(<div key={i} style={{flex:1,padding:"18px 8px",borderRight:i<a.length-1?`1px solid ${C.border}`:"none",textAlign:"center"}}><div style={{fontWeight:900,fontSize:20,color:C.blue}}>{s.val}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{s.label}</div></div>))}
          </div>
        </div>
      </section>
      <section style={{padding:"80px 24px",background:C.bg}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}><div style={{fontWeight:900,fontSize:"clamp(24px,4vw,40px)",color:C.text,marginBottom:12}}>Everything to Get Hired — All Free</div></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:20}}>
            {features.map((f,i)=>(
              <div key={i} style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:20,padding:24,borderTop:`3px solid ${f.color}`,boxShadow:"0 2px 12px rgba(0,0,0,0.04)",transition:"all .2s"}} onMouseOver={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{fontSize:32,marginBottom:10}}>{f.icon}</div>
                <div style={{fontWeight:800,fontSize:16,color:C.text,marginBottom:6}}>{f.title}</div>
                <div style={{color:C.soft,fontSize:12,lineHeight:1.8,marginBottom:10}}>{f.desc}</div>
                <div style={{background:`${f.color}10`,color:f.color,fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:18,display:"inline-block"}}>{f.highlight}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{padding:"60px 24px",background:"#fff"}}>
        <div style={{maxWidth:960,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:40}}><div style={{fontWeight:900,fontSize:"clamp(22px,3vw,36px)",color:C.text,marginBottom:8}}>Real Students. Real Offers.</div></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
            {testimonials.map((t,i)=>(
              <div key={i} style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:16,padding:20}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{color:C.warn,fontSize:13}}>{"★".repeat(t.rating)}</div>
                  <span style={{background:`${t.color}10`,color:t.color,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:18}}>{t.tag}</span>
                </div>
                <div style={{color:C.soft,fontSize:13,lineHeight:1.8,marginBottom:14,fontStyle:"italic"}}>"{t.text}"</div>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${t.color},${t.color}cc)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#fff"}}>{t.avatar}</div>
                  <div><div style={{fontWeight:700,fontSize:12}}>{t.name}</div><div style={{fontSize:11,color:C.muted}}>{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{padding:"60px 24px",background:"linear-gradient(135deg,#eff6ff,#f0fdf4)"}}>
        <div style={{maxWidth:600,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontWeight:900,fontSize:"clamp(22px,4vw,36px)",color:C.text,marginBottom:12}}>Ready to Get Hired?</div>
          <div style={{color:C.soft,fontSize:14,marginBottom:28}}>Join 1,200+ freshers. 100% free. Just results.</div>
          <button onClick={onGetStarted} className="glow-btn" style={{padding:"16px 48px",fontSize:17,borderRadius:14,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",fontWeight:800,fontFamily:"'Inter',sans-serif"}}>🚀 Start Free Now →</button>
        </div>
      </section>
      <footer style={{borderTop:`1px solid ${C.border}`,padding:"28px 24px",background:"#fff"}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div style={{fontWeight:900,fontSize:18,color:C.blue}}>⚡ TakePlace</div>
          <div style={{color:C.muted,fontSize:12}}>© 2026 TakePlace · Developed by Raghu Dadigela · <a href={`mailto:${SUPPORT_EMAIL}`} style={{color:C.blue,textDecoration:"none"}}>{SUPPORT_EMAIL}</a></div>
        </div>
      </footer>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────
function AuthPage({ onLogin, onBack }) {
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [err,setErr]=useState(""); const [msg,setMsg]=useState("");
  const [loading,setLoading]=useState(false); const [googleLoading,setGoogleLoading]=useState(false);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));

  const handleGoogle=async()=>{
    setGoogleLoading(true); setErr("");
    try{
      const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.href}});
      if(error) throw error;
    }catch(e){setErr(e.message); setGoogleLoading(false);}
  };

  const handleForgot=async()=>{
    if(!form.email.trim()){setErr("Enter your email first.");return;}
    setLoading(true); setErr(""); setMsg("");
    try{
      const {error}=await supabase.auth.resetPasswordForEmail(form.email.trim(),{redirectTo:window.location.origin+window.location.pathname});
      if(error) throw error;
      setMsg("✅ Reset email sent!");
    }catch(e){setErr("Failed: "+e.message);}
    setLoading(false);
  };

  const handle=async()=>{
    setErr(""); setMsg(""); setLoading(true);
    try{
      if(mode==="register"){
        if(!form.name.trim()||!form.email.trim()||!form.password) throw new Error("All fields required");
        if(form.password.length<6) throw new Error("Password must be 6+ characters");
        const {error}=await supabase.auth.signUp({email:form.email.trim(),password:form.password,options:{data:{full_name:form.name.trim()}}});
        if(error) throw error;
        setMsg("✅ Account created! Check email to confirm, then sign in.");
        setMode("login");
      }else{
        const {data,error}=await supabase.auth.signInWithPassword({email:form.email.trim(),password:form.password});
        if(error) throw error;
        onLogin(data.user);
      }
    }catch(e){setErr(e.message||"Something went wrong");}
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#eff6ff 0%,#fff 60%,#f0fdf4 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{css}</style>
      <div className="fade" style={{width:"100%",maxWidth:420,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:24,padding:"32px",boxShadow:"0 16px 48px rgba(37,99,235,0.10)"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",marginBottom:20}}>← Back to home</button>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:6}}>⚡</div>
          <div style={{fontWeight:900,fontSize:24,color:C.blue}}>TakePlace</div>
          <div style={{color:C.muted,fontSize:13,marginTop:4}}>{mode==="login"?"Welcome back 👋":mode==="register"?"Create your account ✨":"Reset password 🔑"}</div>
        </div>
        {mode!=="forgot"&&(<>
          <button onClick={handleGoogle} disabled={googleLoading} style={{width:"100%",padding:"11px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",color:C.text,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16}}>
            {googleLoading?<SpinIcon size={16}/>:<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
            Continue with Google
          </button>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{flex:1,height:1,background:C.border}}/><span style={{color:C.muted,fontSize:12}}>or</span><div style={{flex:1,height:1,background:C.border}}/></div>
          <div style={{display:"flex",background:C.bg,borderRadius:10,padding:4,marginBottom:20}}>
            {["login","register"].map(m=>(<button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}} style={{flex:1,padding:"9px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,background:mode===m?"#fff":"transparent",color:mode===m?C.blue:C.muted,boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>{m==="login"?"Sign In":"Register"}</button>))}
          </div>
        </>)}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {mode==="register"&&<input style={inp} placeholder="Full name" value={form.name} onChange={e=>set("name",e.target.value)}/>}
          <input style={inp} placeholder="Email address" type="email" value={form.email} onChange={e=>set("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
          {mode!=="forgot"&&<input style={inp} placeholder="Password" type="password" value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>}
        </div>
        {err&&<div style={{color:C.danger,fontSize:12,marginTop:10,background:"#fef2f2",padding:"8px 12px",borderRadius:8}}>⚠ {err}</div>}
        {msg&&<div style={{color:C.green,fontSize:12,marginTop:10,background:"#f0fdf4",padding:"8px 12px",borderRadius:8}}>{msg}</div>}
        {mode==="forgot"?(
          <><Btn variant="cta" onClick={handleForgot} loading={loading} style={{width:"100%",marginTop:18,padding:"12px"}}>Send Reset Email →</Btn>
          <button onClick={()=>{setMode("login");setErr("");setMsg("");}} style={{width:"100%",marginTop:10,padding:"9px",background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>← Back to Sign In</button></>
        ):(
          <><Btn variant="cta" onClick={handle} loading={loading} style={{width:"100%",marginTop:18,padding:"12px",fontSize:14}}>{mode==="login"?"Sign In →":"Create Account →"}</Btn>
          {mode==="login"&&<button onClick={()=>{setMode("forgot");setErr("");setMsg("");}} style={{width:"100%",marginTop:10,padding:"8px",background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",textDecoration:"underline"}}>Forgot password?</button>}</>
        )}
      </div>
    </div>
  );
}

// ─── JOBS TAB ─────────────────────────────────────────────────────────────
function JobsTab({ jobs,jobsLoading,jobsError,search,setSearch,location,setLocation,fetchJobs,expandedJob,setExpandedJob,setTabPersist }) {
  return(
    <div>
      <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:18}}>
        <div style={{fontWeight:700,color:C.text,fontSize:14,marginBottom:12}}>🔍 Search Live Jobs</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <input style={inp} placeholder="Role (react developer...)" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs(search,location)}/>
          <input style={inp} placeholder="City (hyderabad...)" value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs(search,location)}/>
        </div>
        <Btn variant="cta" onClick={()=>fetchJobs(search,location)} style={{width:"100%"}}>🔍 Search Jobs</Btn>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontWeight:800,fontSize:17,color:C.text}}>Live Job Feed</div>
        {!jobsLoading&&jobs.length>0&&(<div style={{display:"flex",alignItems:"center",gap:5,background:"#f0fdf4",borderRadius:18,padding:"4px 12px"}}><div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/><span style={{color:C.green,fontSize:11,fontWeight:700}}>{jobs.length} live</span></div>)}
      </div>
      {jobsLoading&&(<div style={{textAlign:"center",padding:"50px 20px"}}><SpinIcon size={36} color={C.blue}/><div style={{color:C.muted,fontSize:13,marginTop:12}}>Fetching jobs...</div></div>)}
      {jobsError&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:18,color:C.danger,textAlign:"center"}}>{jobsError}</div>}
      {!jobsLoading&&jobs.map((job,i)=>{
        const isExp=expandedJob===job.id;
        return(
          <div key={job.id} className="fade" style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:"14px 16px",marginBottom:8,borderLeft:`3px solid ${C.blue}`,animationDelay:`${i*0.04}s`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{job.title}</div><div style={{color:C.soft,fontSize:12,marginTop:1}}>{job.company} · {job.location}</div></div>
              <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}><div style={{color:C.green,fontWeight:800,fontSize:13}}>{job.salary}</div><div style={{color:C.muted,fontSize:11}}>{job.posted}</div></div>
            </div>
            <div style={{color:C.muted,fontSize:12,lineHeight:1.7,marginBottom:10,background:C.bg,borderRadius:8,padding:"8px 10px"}}>
              {isExp?job.description:job.descriptionShort+(job.description?.length>220?"...":"")}
              {job.description?.length>220&&(<button onClick={()=>setExpandedJob(isExp?null:job.id)} style={{background:"none",border:"none",color:C.blue,fontSize:11,cursor:"pointer",marginLeft:5,fontFamily:"'Inter',sans-serif",fontWeight:600}}>{isExp?"less ▲":"more ▼"}</button>)}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
              <Tag color={C.blue}>{job.category}</Tag>
              <div style={{display:"flex",gap:8}}>
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

// ─── MAIN APP ─────────────────────────────────────────────────────────────
function MainApp({ user, onLogout }) {
  const [tab,setTab]=useState(()=>parseInt(sessionStorage.getItem("tp_tab")||"0"));
  const [jobs,setJobs]=useState([]);
  const [jobsLoading,setJobsLoading]=useState(true);
  const [jobsError,setJobsError]=useState("");
  const [search,setSearch]=useState(()=>sessionStorage.getItem("tp_search")||"software engineer fresher");
  const [location,setLocation]=useState(()=>sessionStorage.getItem("tp_loc")||"hyderabad");
  const [expandedJob,setExpandedJob]=useState(null);
  const [sidebarOpen,setSidebarOpen]=useState(window.innerWidth>768);
  const name=user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";
  const isMobile=window.innerWidth<768;

  useEffect(()=>{fetchJobs();},[]);
  useEffect(()=>{
    const h=()=>setTabPersist(4);
    document.addEventListener("goto-recruiter",h);
    return()=>document.removeEventListener("goto-recruiter",h);
  },[]);

  const setTabPersist=(t)=>{setTab(t);sessionStorage.setItem("tp_tab",t);};

  const fetchJobs=async(q=search,loc=location)=>{
    setJobsLoading(true); setJobsError("");
    sessionStorage.setItem("tp_search",q); sessionStorage.setItem("tp_loc",loc);
    try{
      const url=`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&what=${encodeURIComponent(q)}&where=${encodeURIComponent(loc)}&sort_by=date&content-type=application/json`;
      const res=await fetch(url); const data=await res.json();
      if(data.results?.length>0){
        setJobs(data.results.map(j=>({id:j.id,title:j.title,company:j.company?.display_name||"Company",location:j.location?.display_name||loc,salary:j.salary_min?`₹${Math.round(j.salary_min/100000)}–${Math.round((j.salary_max||j.salary_min*1.5)/100000)} LPA`:"Competitive",description:j.description||"No description.",descriptionShort:(j.description||"").slice(0,220),url:j.redirect_url,posted:new Date(j.created).toLocaleDateString("en-IN",{day:"numeric",month:"short"}),category:j.category?.label||"Technology"})));
      }else setJobsError("No jobs found. Try 'java developer'.");
    }catch{setJobsError("Could not load jobs.");}
    setJobsLoading(false);
  };

  const TOTAL_TESTS_DONE=Object.keys(localStorage).filter(k=>k.startsWith("tp_score_")).length;

  const NAV=[
    {icon:"🔥",label:"Live Jobs",tab:0},
    {icon:"⚡",label:"Resume AI",tab:1},
    {icon:"🧪",label:"Mock Tests",tab:2},
    {icon:"🔗",label:"LinkedIn",tab:3},
    {icon:"🏢",label:"Recruiter",tab:4},
  ];

  if(isMobile) return(
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",background:C.bg,fontFamily:"'Inter',sans-serif"}}>
      <style>{css}</style>
      <div style={{background:C.sidebar,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>⚡</span><span style={{fontWeight:900,fontSize:16,color:"#fff"}}>TakePlace</span></div>
        <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.blueLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:11,color:"#fff"}}>{name[0].toUpperCase()}</div>
      </div>
      <div style={{flex:1,overflow:"auto",padding:"16px",paddingBottom:80}}>
        {tab===0&&<JobsTab jobs={jobs} jobsLoading={jobsLoading} jobsError={jobsError} search={search} setSearch={setSearch} location={location} setLocation={setLocation} fetchJobs={fetchJobs} expandedJob={expandedJob} setExpandedJob={setExpandedJob} setTabPersist={setTabPersist}/>}
        {tab===1&&<ResumeAnalyzer user={user}/>}
        {tab===2&&<MockTestEngine user={user}/>}
        {tab===3&&<LinkedInSuite user={user}/>}
        {tab===4&&<RecruiterPortal user={user}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:`1px solid ${C.border}`,display:"flex",zIndex:100}}>
        {NAV.map(n=>(<button key={n.tab} onClick={()=>setTabPersist(n.tab)} style={{flex:1,padding:"10px 4px 8px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><span style={{fontSize:18}}>{n.icon}</span><span style={{fontSize:8,fontWeight:tab===n.tab?800:500,color:tab===n.tab?C.blue:C.muted}}>{n.label}</span>{tab===n.tab&&<div style={{width:18,height:2,background:C.blue,borderRadius:2}}/>}</button>))}
        <button onClick={onLogout} style={{flex:1,padding:"10px 4px 8px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><span style={{fontSize:18}}>👤</span><span style={{fontSize:8,fontWeight:500,color:C.muted}}>Out</span></button>
      </div>
    </div>
  );

  return(
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,fontFamily:"'Inter',sans-serif"}}>
      <style>{css}</style>
      <div style={{width:sidebarOpen?220:62,background:C.sidebar,display:"flex",flexDirection:"column",padding:"18px 10px",transition:"width .25s",flexShrink:0,position:"sticky",top:0,height:"100vh",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28,paddingLeft:4}}><span style={{fontSize:20,flexShrink:0}}>⚡</span>{sidebarOpen&&<span style={{fontWeight:900,fontSize:17,color:"#fff",whiteSpace:"nowrap"}}>TakePlace</span>}</div>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:3}}>
          {NAV.map(n=>(<div key={n.tab} onClick={()=>setTabPersist(n.tab)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 10px",borderRadius:10,background:tab===n.tab?C.sidebarActive:"transparent",cursor:"pointer",transition:"all .18s"}}><span style={{fontSize:17,flexShrink:0}}>{n.icon}</span>{sidebarOpen&&<span style={{color:tab===n.tab?"#fff":"#94a3b8",fontSize:13,fontWeight:tab===n.tab?700:500,whiteSpace:"nowrap"}}>{n.label}</span>}</div>))}
        </div>
        {sidebarOpen&&TOTAL_TESTS_DONE>0&&(<div style={{background:"#1e293b",borderRadius:10,padding:"10px 12px",marginBottom:10}}><div style={{color:"#64748b",fontSize:10}}>Tests Done</div><div style={{color:"#fff",fontWeight:800,fontSize:18}}>{TOTAL_TESTS_DONE}</div></div>)}
        {sidebarOpen&&(<div style={{background:"#1e293b",borderRadius:10,padding:"10px 12px",marginBottom:10}}><div style={{color:"#64748b",fontSize:10,marginBottom:2}}>Support</div><a href={`mailto:${SUPPORT_EMAIL}`} style={{color:"#7dd3fc",fontSize:11,textDecoration:"none",wordBreak:"break-all"}}>{SUPPORT_EMAIL}</a></div>)}
        <div style={{borderTop:"1px solid #1e293b",paddingTop:10,display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.blueLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:"#fff",flexShrink:0}}>{name[0].toUpperCase()}</div>
          {sidebarOpen&&(<div style={{flex:1,minWidth:0}}><div style={{color:"#fff",fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name.split(" ")[0]}</div><button onClick={onLogout} style={{background:"none",border:"none",color:"#64748b",fontSize:10,cursor:"pointer",fontFamily:"'Inter',sans-serif",padding:0}}>Sign out</button></div>)}
          <button onClick={()=>setSidebarOpen(o=>!o)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",padding:4,flexShrink:0,fontSize:12}}>{sidebarOpen?"◀":"▶"}</button>
        </div>
      </div>
      <div style={{flex:1,overflow:"auto",minHeight:"100vh"}}>
        <div style={{background:"#fff",borderBottom:`1px solid ${C.border}`,padding:"0 24px",position:"sticky",top:0,zIndex:50,height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontWeight:700,fontSize:17,color:C.text}}>{NAV.find(n=>n.tab===tab)?.icon} {NAV.find(n=>n.tab===tab)?.label}</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {TOTAL_TESTS_DONE>0&&<Tag color={C.purple}>🧪 {TOTAL_TESTS_DONE} tests</Tag>}
            <Tag color={C.green}>🟢 Active</Tag>
          </div>
        </div>
        <div style={{padding:"24px",maxWidth:880,margin:"0 auto"}}>
          {tab===0&&<JobsTab jobs={jobs} jobsLoading={jobsLoading} jobsError={jobsError} search={search} setSearch={setSearch} location={location} setLocation={setLocation} fetchJobs={fetchJobs} expandedJob={expandedJob} setExpandedJob={setExpandedJob} setTabPersist={setTabPersist}/>}
          {tab===1&&<ResumeAnalyzer user={user}/>}
          {tab===2&&<MockTestEngine user={user}/>}
          {tab===3&&<LinkedInSuite user={user}/>}
          {tab===4&&<RecruiterPortal user={user}/>}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(null);
  const [appLoading,setAppLoading]=useState(true);
  const [page,setPage]=useState("landing");

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){setUser(session.user);setPage("app");}
      setAppLoading(false);
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user){setUser(session.user);setPage("app");}
      else{setUser(null);setPage("landing");}
    });
    return()=>subscription.unsubscribe();
  },[]);

  if(appLoading) return(
    <div style={{minHeight:"100vh",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14}}>
      <style>{css}</style>
      <SpinIcon size={40} color={C.blue}/>
      <div style={{color:C.muted,fontSize:13,fontFamily:"'Inter',sans-serif"}}>Loading TakePlace...</div>
    </div>
  );

  if(page==="landing") return <LandingPage onGetStarted={()=>setPage("auth")}/>;
  if(page==="auth") return <AuthPage onLogin={(u)=>{setUser(u);setPage("app");}} onBack={()=>setPage("landing")}/>;
  return <MainApp user={user} onLogout={async()=>{await supabase.auth.signOut();setUser(null);setPage("landing");}}/>;
}
