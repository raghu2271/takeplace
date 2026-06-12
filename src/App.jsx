import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID  = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const supabase   = createClient(SUPABASE_URL, SUPABASE_KEY);

const C = {
  bg:"#ffffff", card:"#f8f9fc", card2:"#f1f4f9", border:"#e2e8f0",
  blue:"#2563eb", blueLight:"#3b82f6", blueDark:"#1d4ed8",
  green:"#16a34a", greenDark:"#14532d",
  text:"#0f172a", muted:"#64748b", soft:"#475569",
  danger:"#dc2626", warn:"#d97706", purple:"#7c3aed", purpleDark:"#5b21b6",
  orange:"#ea580c", orangeLight:"#f97316", teal:"#0d9488", pink:"#db2777",
  sidebar:"#0f172a",
};

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
  .sidebar-item{transition:all .15s;border-radius:10px;cursor:pointer;}
  .sidebar-item:hover{background:rgba(255,255,255,0.08);}
  .sidebar-item.active{background:rgba(37,99,235,0.9);}
`;

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

const Tag = ({ children, color=C.blue }) => (
  <span style={{ background:`${color}15`, color, fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:700, whiteSpace:"nowrap", border:`1px solid ${color}30` }}>
    {children}
  </span>
);

const Card = ({ children, style={} }) => (
  <div style={{ background:C.card, border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, ...style }}>
    {children}
  </div>
);

async function callAI(prompt, maxTokens=1500, retries=2) {
  for (let attempt=0; attempt<=retries; attempt++) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:maxTokens, messages:[{role:"user",content:prompt}] }),
      });
      if (!res.ok) { const e=await res.text().catch(()=>""); throw new Error("AI error "+res.status+": "+e.slice(0,120)); }
      const data = await res.json();
      return data.content?.[0]?.text || "";
    } catch(e) {
      if (attempt<retries) { await new Promise(r=>setTimeout(r,1200*(attempt+1))); continue; }
      throw e;
    }
  }
}

function safeJSON(raw, fallback={}) {
  if (!raw) return fallback;
  try { const clean=raw.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim(); return JSON.parse(clean); } catch {}
  try { const obj=raw.match(/\{[\s\S]*\}/); if(obj) return JSON.parse(obj[0]); } catch {}
  try { const arr=raw.match(/\[[\s\S]*\]/); if(arr) return JSON.parse(arr[0]); } catch {}
  return fallback;
}

async function extractTextFromPDF(file) {
  if (!window.pdfjsLib) {
    await new Promise((res,rej)=>{ const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const ab=await file.arrayBuffer(); const pdf=await window.pdfjsLib.getDocument({data:ab}).promise;
  let text="";
  for (let i=1;i<=Math.min(pdf.numPages,4);i++) { const page=await pdf.getPage(i); const content=await page.getTextContent(); text+=content.items.map(x=>x.str).join(" ")+"\n"; }
  return text.trim();
}

async function extractTextFromDOCX(file) {
  if (!window.mammoth) { await new Promise((res,rej)=>{ const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }
  const ab=await file.arrayBuffer(); const result=await window.mammoth.extractRawText({arrayBuffer:ab}); return result.value.trim();
}

async function downloadPDF(resumeData, filename) {
  if (!window.jspdf) { await new Promise((res,rej)=>{ const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }
  const { jsPDF }=window.jspdf; const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=210,ml=15,mr=15,cw=W-ml-mr; let y=18; const d=resumeData;
  doc.setFontSize(16); doc.setFont("helvetica","bold"); doc.text(d.name||"",W/2,y,{align:"center"}); y+=6;
  doc.setFontSize(8.5); doc.setFont("helvetica","normal"); doc.setTextColor(60,60,60);
  doc.text([d.phone,d.email,d.linkedin,d.github,d.location].filter(Boolean).join("  |  "),W/2,y,{align:"center"}); y+=7; doc.setTextColor(0,0,0);
  const sH=(t)=>{ if(y>262){doc.addPage();y=15;} y+=1; doc.setFontSize(9.5); doc.setFont("helvetica","bold"); doc.text(t.toUpperCase(),ml,y); y+=1.2; doc.setDrawColor(0,0,0); doc.setLineWidth(0.4); doc.line(ml,y,W-mr,y); y+=4; doc.setFont("helvetica","normal"); doc.setFontSize(9); };
  const bul=(t,ind=4)=>{ if(y>268){doc.addPage();y=15;} doc.text("•",ml+ind-2,y); const wr=doc.splitTextToSize(t,cw-ind-2); wr.forEach((wl,i)=>{ if(y>268){doc.addPage();y=15;} doc.text(wl,ml+ind+1,y); if(i<wr.length-1)y+=4.3; }); y+=4.6; };
  if(d.education?.length){sH("Education");d.education.forEach(e=>{doc.setFont("helvetica","bold");doc.setFontSize(9);doc.text(e.school||"",ml,y);doc.setFont("helvetica","normal");doc.text(e.location||"",W-mr,y,{align:"right"});y+=4.3;doc.setFont("helvetica","italic");doc.text(e.degree||"",ml,y);doc.setFont("helvetica","normal");doc.text(e.dates||"",W-mr,y,{align:"right"});y+=5;});}
  if(d.experience?.length){sH("Experience");d.experience.forEach(e=>{doc.setFont("helvetica","bold");doc.setFontSize(9);doc.text(e.title||"",ml,y);doc.setFont("helvetica","normal");doc.text(e.dates||"",W-mr,y,{align:"right"});y+=4.3;doc.setFont("helvetica","italic");doc.text(`${e.company||""}${e.location?", "+e.location:""}`,ml,y);y+=4.3;doc.setFont("helvetica","normal");(e.bullets||[]).forEach(b=>bul(b));y+=1;});}
  if(d.projects?.length){sH("Projects");d.projects.forEach(p=>{doc.setFont("helvetica","bold");doc.setFontSize(9);doc.text(p.name||"",ml,y);if(p.tech){const bw=doc.getTextWidth(p.name||"");doc.setFont("helvetica","italic");doc.text(` | ${p.tech}`,ml+bw,y);}if(p.dates){doc.setFont("helvetica","normal");doc.text(p.dates,W-mr,y,{align:"right"});}y+=4.3;doc.setFont("helvetica","normal");(p.bullets||[]).forEach(b=>bul(b));y+=1;});}
  if(d.skills?.length){sH("Technical Skills");d.skills.forEach(sk=>{doc.setFontSize(9);doc.setFont("helvetica","bold");doc.text(`${sk.category}: `,ml,y);const cW=doc.getTextWidth(`${sk.category}: `);doc.setFont("helvetica","normal");doc.text(doc.splitTextToSize(sk.items||"",cw-cW)[0]||"",ml+cW,y);y+=4.5;});}
  if(d.certifications?.length){sH("Certifications & Achievements");d.certifications.forEach(c=>bul(c));}
  doc.save(filename);
}

async function downloadDOCXJake(resumeData, filename) {
  if (!window.docx) { await new Promise((res,rej)=>{ const s=document.createElement("script"); s.src="https://unpkg.com/docx@8.2.2/build/index.umd.js"; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }
  const { Document,Packer,Paragraph,TextRun,AlignmentType,BorderStyle }=window.docx; const d=resumeData; const children=[];
  children.push(new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:d.name||"",bold:true,size:28,font:"Calibri"})]}));
  children.push(new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:[d.phone,d.email,d.linkedin,d.github,d.location].filter(Boolean).join(" | "),size:18,font:"Calibri"})]}));
  children.push(new Paragraph({children:[new TextRun({text:""})]}));
  const sP=(t)=>new Paragraph({children:[new TextRun({text:t.toUpperCase(),bold:true,size:20,font:"Calibri"})],border:{bottom:{color:"000000",space:1,style:BorderStyle.SINGLE,size:6}},spacing:{after:80}});
  const bP=(t)=>new Paragraph({bullet:{level:0},children:[new TextRun({text:t,size:18,font:"Calibri"})]});
  if(d.education?.length){children.push(sP("Education"));d.education.forEach(e=>{children.push(new Paragraph({children:[new TextRun({text:e.school||"",bold:true,size:19,font:"Calibri"}),new TextRun({text:`\t${e.location||""}`,size:19,font:"Calibri"})]}));children.push(new Paragraph({children:[new TextRun({text:e.degree||"",italics:true,size:18,font:"Calibri"}),new TextRun({text:`\t${e.dates||""}`,size:18,font:"Calibri"})],spacing:{after:80}}));});}
  if(d.experience?.length){children.push(sP("Experience"));d.experience.forEach(e=>{children.push(new Paragraph({children:[new TextRun({text:e.title||"",bold:true,size:19,font:"Calibri"}),new TextRun({text:`\t${e.dates||""}`,size:19,font:"Calibri"})]}));children.push(new Paragraph({children:[new TextRun({text:`${e.company||""}${e.location?", "+e.location:""}`,italics:true,size:18,font:"Calibri"})]})),(e.bullets||[]).forEach(b=>children.push(bP(b)));children.push(new Paragraph({children:[new TextRun({text:""})]}));});}
  if(d.projects?.length){children.push(sP("Projects"));d.projects.forEach(p=>{children.push(new Paragraph({children:[new TextRun({text:p.name||"",bold:true,size:19,font:"Calibri"}),p.tech?new TextRun({text:` | ${p.tech}`,italics:true,size:19,font:"Calibri"}):null,p.dates?new TextRun({text:`\t${p.dates}`,size:19,font:"Calibri"}):null].filter(Boolean)}));(p.bullets||[]).forEach(b=>children.push(bP(b)));children.push(new Paragraph({children:[new TextRun({text:""})]}));});}
  if(d.skills?.length){children.push(sP("Technical Skills"));d.skills.forEach(sk=>{children.push(new Paragraph({children:[new TextRun({text:`${sk.category}: `,bold:true,size:18,font:"Calibri"}),new TextRun({text:sk.items||"",size:18,font:"Calibri"})]})});});}
  if(d.certifications?.length){children.push(sP("Certifications & Achievements"));d.certifications.forEach(c=>children.push(bP(c)));}
  const doc2=new Document({sections:[{properties:{page:{margin:{top:720,bottom:720,left:864,right:864}}},children}]});
  const blob=await Packer.toBlob(doc2); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=filename; a.click();
}

// ══════════════════════════════════════════════════════════════════════════
// COMPANY DATA — 20 Service + 15 Product
// ══════════════════════════════════════════════════════════════════════════
const SERVICE_COMPANIES = {
  tcs:        { name:"TCS NQT",          color:"#1d4ed8", emoji:"🏢", type:"service", desc:"Numerical · Verbal · Reasoning · Coding (NQT Pattern 2026)", questions:["Numerical Ability","Verbal Ability","Logical Reasoning","Coding"], tips:["No negative marking — attempt all","Section timer locks — cannot revisit","Focus on Time-Speed-Distance, Percentages","Python officially supported in coding round"] },
  infosys:    { name:"Infosys InfyTQ",   color:"#7c3aed", emoji:"🔷", type:"service", desc:"Aptitude · Reasoning · Verbal · Power Programmer Coding",     questions:["Quantitative Aptitude","Logical Reasoning","Verbal English","Coding (Power Programmer)"], tips:["InfyTQ platform — register early","Coding: focus on arrays and strings","Verbal: RC passages are long, practice speed reading"] },
  wipro:      { name:"Wipro NLTH",        color:"#16a34a", emoji:"🌐", type:"service", desc:"Aptitude · Essay Writing · Coding (No Negative Marking)",       questions:["Aptitude & Reasoning","Essay Writing","Coding"], tips:["No negative marking","Essay: pick familiar topic, 3 structured paragraphs","Coding: 2 problems, at least solve 1 fully"] },
  hcl:        { name:"HCL TechBee",       color:"#dc2626", emoji:"⚡", type:"service", desc:"Aptitude · Technical · Coding · HR Interview",                  questions:["Quantitative Aptitude","Technical MCQ","Coding","Verbal Ability"], tips:["Focus on C/C++ basics for technical MCQ","Coding: mainly easy-level problems","HR: prepare for 'why HCL' question"] },
  cognizant:  { name:"Cognizant GenC",    color:"#0d9488", emoji:"🧩", type:"service", desc:"Aptitude · Reasoning · Verbal · Coding (GenC & GenC Next)",      questions:["Quantitative Aptitude","Logical Reasoning","Verbal Ability","Coding"], tips:["GenC Next for top performers — aim for coding","Logical: blood relations + seating arrangement heavy","Verbal: grammar + fill-in-the-blanks"] },
  accenture:  { name:"Accenture",         color:"#7c3aed", emoji:"♦️", type:"service", desc:"Cognitive Assessment · Technical Assessment · Coding",           questions:["Cognitive & Analytical","Technical Assessment","Coding Round","Communication Test"], tips:["Cognitive test is adaptive — answer fast","Technical: focus on DBMS, OS, networking basics","Communication: write clearly, no shortcuts"] },
  capgemini:  { name:"Capgemini",         color:"#ea580c", emoji:"🔶", type:"service", desc:"Pseudo Code · Behavioural · Game-Based Assessment · Coding",     questions:["Pseudo Code Test","Behavioural Test","Game-Based Assessment","Technical + Coding"], tips:["Pseudo code: logic > syntax","Games test attention and pattern recognition","Behavioural: answer honestly, not what you think they want"] },
  techmahindra:{ name:"Tech Mahindra",    color:"#0284c7", emoji:"🔵", type:"service", desc:"Aptitude · Technical · Coding · Communication Test",             questions:["Numerical Ability","Verbal & Reasoning","Technical MCQ","Coding"], tips:["Focus on basic DS: arrays, strings, sorting","Technical: OOP concepts heavily tested","Communication: email writing task included"] },
  ltimindtree:{ name:"LTIMindtree",       color:"#16a34a", emoji:"🌿", type:"service", desc:"Aptitude · Verbal · Reasoning · Coding (3 Problems)",            questions:["Quantitative Aptitude","Verbal Ability","Logical Reasoning","Coding (3 problems)"], tips:["3 coding problems — solve at least 2","Logical: number series + data sufficiency","Company recently merged — expect 2024-pattern questions"] },
  mphasis:    { name:"Mphasis",           color:"#db2777", emoji:"💜", type:"service", desc:"Aptitude · Verbal · Coding · Technical Interview",                questions:["Numerical Aptitude","Verbal Ability","Coding","Technical MCQ"], tips:["Mphasis loves JAVA — brush up OOP","Aptitude: percentages and profit-loss frequently asked","Coding: mostly easy to medium level"] },
  hexaware:   { name:"Hexaware",          color:"#d97706", emoji:"🧡", type:"service", desc:"Aptitude · Reasoning · English · Coding Round",                  questions:["Quantitative Aptitude","Logical Reasoning","English Proficiency","Coding"], tips:["English: focus on paragraph completion","Aptitude: time management is key","Coding: basic Python/Java problems"] },
  persistent:  { name:"Persistent Systems",color:"#0d9488",emoji:"⚙️",type:"service", desc:"Aptitude · Technical MCQ · Coding (2–3 problems)",               questions:["Aptitude Test","Technical MCQ (CS)","Coding Round","Communication Skills"], tips:["CS fundamentals: OS, DBMS, Networks","Coding: data structures problems are standard","Prepare for technical interview after written test"] },
  birlasoft:  { name:"Birlasoft",          color:"#7c3aed", emoji:"🔮", type:"service", desc:"Aptitude · Technical · Coding · HR Round",                      questions:["Aptitude & Reasoning","Technical Concepts","Coding Problem","Verbal Ability"], tips:["Mid-level difficulty across all sections","Technical: focus on OOPS, SQL","Coding: 1 easy + 1 medium problem typical"] },
  kpit:       { name:"KPIT Technologies", color:"#dc2626", emoji:"🔴", type:"service", desc:"Technical MCQ · Aptitude · Coding (Automotive Domain Focus)",    questions:["Technical MCQ","Quantitative Aptitude","Coding","Domain Knowledge (Automotive)"], tips:["KPIT focuses on automotive/embedded","Technical: C, embedded C, CAN bus basics help","Good for ECE + CSE students both"] },
  zensar:     { name:"Zensar Technologies",color:"#16a34a",emoji:"🟢", type:"service", desc:"Aptitude · Verbal · Reasoning · Coding",                         questions:["Quantitative Aptitude","Verbal Ability","Logical Reasoning","Coding"], tips:["Straightforward aptitude pattern","Coding: 2 problems, mainly arrays and strings","Verbal: reading comprehension is important"] },
  cyient:     { name:"Cyient",             color:"#0284c7", emoji:"🔷", type:"service", desc:"Technical MCQ · Aptitude · Coding (Engineering domain)",         questions:["Technical MCQ (Engineering)","Aptitude","Coding","Verbal Ability"], tips:["Good for ECE and mechanical background","Technical: embedded, VLSI, or IT depending on stream","Company culture focuses on engineering excellence"] },
  niit:       { name:"NIIT Technologies",  color:"#ea580c", emoji:"🟠", type:"service", desc:"Aptitude · Verbal · Coding · Group Discussion",                  questions:["Quantitative Aptitude","Verbal Ability","Coding","Group Discussion"], tips:["Group discussion: speak clearly, don't dominate","Aptitude: LCM/HCF, probability important","Coding: mostly easy level problems"] },
  mastech:    { name:"Mastech Digital",    color:"#db2777", emoji:"💗", type:"service", desc:"Aptitude · Technical · Coding · HR Round",                      questions:["Aptitude & Reasoning","Technical MCQ","Coding","HR Round (Behavioral)"], tips:["Focus on clear communication in HR round","Technical: Java and SQL basics","Aptitude: speed > accuracy matters here"] },
  syntel:     { name:"Syntel (Atos)",      color:"#7c3aed", emoji:"💫", type:"service", desc:"Aptitude · Verbal · Coding · Technical HR",                     questions:["Quantitative Aptitude","Verbal Ability","Coding","Technical + HR Interview"], tips:["Syntel merged with Atos — new questions pool","Coding: focus on pattern printing + basic DS","Interview: project questions are common"] },
  infotech:   { name:"Mphasis Infosys BPM",color:"#0d9488",emoji:"🏦", type:"service", desc:"Aptitude · Process Knowledge · Verbal · Situational Judgement",  questions:["Numerical Aptitude","Process/Domain MCQ","Verbal & Communication","Situational Judgement Test"], tips:["BPM focus — process thinking matters","SJT: pick customer-first answers","Communication: clear and concise writing tested"] },
};

const PRODUCT_COMPANIES = {
  amazon:    { name:"Amazon SDE",      color:"#d97706", emoji:"📦", type:"product", desc:"DSA OA · Leadership Principles · Work Simulation",                  questions:["DSA Coding (2 Problems)","Leadership Principles (16 LPs)","Work Simulation","Behavioral Round"], tips:["Know all 16 Leadership Principles by heart","DSA: LRU Cache, Two Pointers, BFS/DFS frequently asked","Work Sim: always pick 'customer obsession' answers","OA timing: 90 min for 2 coding problems"] },
  microsoft: { name:"Microsoft SDE",   color:"#0284c7", emoji:"🪟", type:"product", desc:"DSA Coding · System Design · Behavioral (Think Aloud)",             questions:["DSA & Algorithms","System Design","Behavioral Round","Technical Deep Dive"], tips:["Think aloud — interviewers follow your reasoning","Start brute force, then optimize","System design: start with requirements + scale","Practice Graphs, DP, Trees on LeetCode"] },
  google:    { name:"Google SWE",      color:"#dc2626", emoji:"🔍", type:"product", desc:"Coding Interviews · System Design · Googliness Round",              questions:["Coding Round 1","Coding Round 2","System Design","Googliness (Culture Fit)"], tips:["Google expects clean, optimized code","Communication during coding is mandatory","System design: design for millions of users","Practice 20 LeetCode per topic — don't random grind"] },
  flipkart:  { name:"Flipkart SDE",    color:"#ea580c", emoji:"🛒", type:"product", desc:"DSA OA · System Design · Technical Interviews",                     questions:["DSA Coding Round","System Design","Technical Interview 1","Technical Interview 2"], tips:["Flipkart loves graph and tree problems","System design: design for Indian scale (festival sales)","OA: 3 coding problems in 3 hours","LeetCode Hard DSA expected in later rounds"] },
  zomato:    { name:"Zomato SDE",      color:"#dc2626", emoji:"🍕", type:"product", desc:"DSA · Product Sense · System Design · Culture Fit",                  questions:["DSA Coding","System Design","Product Sense","Culture Fit Round"], tips:["Product sense: how would you improve Zomato app?","System design: food delivery at scale","DSA: priority queues, graphs, real-time systems","Zomato culture: move fast, own your decisions"] },
  razorpay:  { name:"Razorpay SDE",    color:"#3b82f6", emoji:"💳", type:"product", desc:"DSA · System Design (Payments) · Culture Interview",                questions:["DSA Problem Solving","System Design (Payments Focus)","Technical Deep Dive","Culture & Values Interview"], tips:["Payments domain: understand transactions, idempotency","System design: payment gateway, retry logic, consistency","DSA: medium-hard level, focus on optimization","Culture: strong ownership and bias for action"] },
  phonepe:   { name:"PhonePe SDE",     color:"#5b21b6", emoji:"📱", type:"product", desc:"DSA OA · Technical Interviews · System Design",                     questions:["DSA Online Assessment","Technical Interview Round 1","System Design","Managerial Round"], tips:["PhonePe: UPI/payment system knowledge helps","System design: scalability of payment infrastructure","DSA: LeetCode medium expected in OA","Focus on clean, production-ready code"] },
  paytm:     { name:"Paytm SDE",       color:"#0d9488", emoji:"💰", type:"product", desc:"DSA · Technical Interview · System Design · HR",                    questions:["DSA Coding Round","Technical Interview","System Design","HR & Culture Fit"], tips:["Paytm loves DP and graph problems","Fintech domain knowledge is a plus","System design: wallet, KYC, transaction history at scale","HR: prepare for growth mindset questions"] },
  swiggy:    { name:"Swiggy SDE",      color:"#ea580c", emoji:"🏍️", type:"product", desc:"DSA OA · System Design · Technical + Product Round",               questions:["DSA Online Assessment","System Design","Technical Interview","Product Discussion"], tips:["System design: real-time order tracking, surge pricing","DSA: queues, graphs, shortest path problems","Product: how to reduce delivery time?","Culture: fast execution, high ownership"] },
  meesho:    { name:"Meesho SDE",      color:"#db2777", emoji:"👗", type:"product", desc:"DSA · System Design · Tech Round · Culture Fit",                    questions:["DSA Coding","System Design","Technical Deep Dive","Culture Fit & Values"], tips:["Meesho: social commerce context in system design","DSA: medium difficulty, arrays + graphs","Culture: frugal innovation, first-principles thinking","Good stepping stone — IIT-heavy team culture"] },
  cred:      { name:"CRED SDE",        color:"#7c3aed", emoji:"💜", type:"product", desc:"DSA · System Design · Culture Interview (High Bar)",                questions:["DSA Problem Solving","System Design","Technical Interview","Culture & Philosophy Round"], tips:["CRED has very high hiring bar — expect LeetCode Hard","Credit domain: CIBIL, credit scoring systems","Culture: trust-first philosophy, design-first thinking","System design: loyalty platform, reward distribution"] },
  atlassian: { name:"Atlassian SDE",   color:"#0284c7", emoji:"🔵", type:"product", desc:"DSA · System Design · Values-Based Interview",                     questions:["Coding Round (Karat)","System Design","Values Interview","Technical Deep Dive"], tips:["Karat screen: often done by third-party","Atlassian values: open company, no bullshit","System design: Jira/Confluence scale — collaborative tools","Australia HQ — IST + AEDT scheduling be careful"] },
  adobe:     { name:"Adobe SDE",       color:"#dc2626", emoji:"🎨", type:"product", desc:"DSA · System Design · Creative Problem Solving",                    questions:["DSA & Algorithms","System Design","Creative Problem Solving","Behavioral Round"], tips:["Adobe loves creative thinking in system design","DSA: LeetCode medium, focus on strings and trees","Design tools context: latency, rendering pipelines","Culture: creativity + analytics combined"] },
  uber:      { name:"Uber SDE India",  color:"#0f172a", emoji:"🚗", type:"product", desc:"DSA · System Design (Ride Hailing) · Bar Raiser Round",             questions:["DSA Coding Round","System Design (Geo/Maps)","Technical Interview","Bar Raiser Round"], tips:["Geo-spatial systems: geohash, map matching","System design: surge pricing, driver matching at scale","Bar Raiser: cross-team interviewer — extra scrutiny","DSA: graphs, shortest paths, priority queues essential"] },
  salesforce: { name:"Salesforce SDE", color:"#0284c7", emoji:"☁️", type:"product", desc:"DSA · Apex/CRM Knowledge · System Design · Culture",               questions:["DSA Problem Solving","Salesforce Platform (Apex/SOQL)","System Design","Culture & Values Round"], tips:["CRM domain knowledge helps significantly","Ohana culture: equality, inclusion, trust, innovation","Apex = Salesforce's Java — learn basics","System design: multi-tenant SaaS architecture"] },
};

const ALL_COMPANIES = { ...SERVICE_COMPANIES, ...PRODUCT_COMPANIES };

// Build 40 mock test slots per company
function getMockTests(companyKey) {
  return Array.from({length:40},(_,i)=>({ id:i+1, label:`Mock Test ${i+1}`, difficulty: i<10?"Easy":i<25?"Medium":"Hard" }));
}

// Score storage in localStorage
function getCompanyScores(companyKey) {
  try { return JSON.parse(localStorage.getItem(`tp_scores_${companyKey}`)||"{}"); } catch { return {}; }
}
function saveTestScore(companyKey, testId, score, total, correct) {
  const scores = getCompanyScores(companyKey);
  scores[testId] = { score, total, correct, date: new Date().toISOString() };
  localStorage.setItem(`tp_scores_${companyKey}`, JSON.stringify(scores));
}

// ══════════════════════════════════════════════════════════════════════════
// MOCK TEST ENGINE — FULL OVERHAUL
// ══════════════════════════════════════════════════════════════════════════
function MockTestEngine({ user }) {
  const [view, setView] = useState("home"); // home | company | tests | test | result
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("all"); // all | service | product
  const [scores, setScores] = useState({});
  const timerRef = useRef(null);

  useEffect(()=>{
    const allScores={};
    Object.keys(ALL_COMPANIES).forEach(k=>{ allScores[k]=getCompanyScores(k); });
    setScores(allScores);
  },[]);

  const trackActivity = async (action, details="") => {
    try { if(!user?.id) return; await supabase.from("user_activity").insert({user_id:user.id,email:user.email,action,details}); } catch(_) {}
  };

  const getCompanyStats = (key) => {
    const s = scores[key]||{};
    const done = Object.values(s);
    if (!done.length) return { completed:0, avg:0, best:0 };
    const avg = Math.round(done.reduce((a,b)=>a+b.score,0)/done.length);
    const best = Math.max(...done.map(d=>d.score));
    return { completed:done.length, avg, best };
  };

  const startTest = async (company, test) => {
    setLoading(true); setErr(""); setSelectedTest(test);
    const co = ALL_COMPANIES[company];
    try {
      const qTypes = co.questions;
      const isProduct = co.type === "product";
      const difficulty = test.difficulty;
      const testNum = test.id;

      let prompt = "";
      if (isProduct) {
        prompt = `You are an expert ${co.name} interview question generator. Generate exactly 15 interview questions for Mock Test #${testNum} (${difficulty} difficulty).

Mix of question types based on ${co.name} pattern:
- 8 DSA/Technical MCQ questions (algorithmic concepts, code output, complexity analysis)
- 4 Behavioral/situational questions  
- 3 System Design conceptual MCQ questions

IMPORTANT: Each coding/DSA question MUST include test cases.

Return ONLY valid JSON array of exactly 15 questions:
[
  {
    "id": 1,
    "type": "mcq",
    "category": "DSA",
    "question": "What is the time complexity of inserting into a hash map (average case)?",
    "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    "correct": 0,
    "explanation": "Hash map average case insert is O(1) due to direct key hashing.",
    "difficulty": "${difficulty}",
    "topic": "Hash Maps"
  },
  {
    "id": 2,
    "type": "coding",
    "category": "Coding Problem",
    "title": "Two Sum",
    "difficulty": "${difficulty}",
    "topic": "Arrays",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "examples": [{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "nums[0] + nums[1] = 2 + 7 = 9"}],
    "testCases": [
      {"input": "nums = [2,7,11,15], target = 9", "expected": "[0,1]", "visible": true},
      {"input": "nums = [3,2,4], target = 6", "expected": "[1,2]", "visible": true},
      {"input": "nums = [3,3], target = 6", "expected": "[0,1]", "visible": false}
    ],
    "constraints": ["2 <= nums.length <= 10^4", "Each input has exactly one solution"],
    "hint": "Use a hash map to store seen values",
    "solution_approach": "Use hash map: for each element, check if complement exists. O(n) time.",
    "time_complexity": "O(n)"
  }
]

Make all ${testNum <= 10 ? "easy warm-up" : testNum <= 25 ? "medium difficulty" : "hard challenging"} questions. Each test must have DIFFERENT questions from other tests.`;
      } else {
        prompt = `You are an expert ${co.name} aptitude test generator. Generate exactly 20 MCQ questions for Mock Test #${testNum} (${difficulty} difficulty).

Mix based on ${co.name} pattern (${qTypes.join(", ")}):
- 7 Quantitative Aptitude questions (numbers, algebra, time-work, percentages, probability)  
- 5 Logical Reasoning questions (series, analogies, blood relations, seating, syllogism)
- 5 Verbal Ability questions (grammar, vocabulary, reading comprehension, fill-in-blanks)
- 3 Technical/Coding MCQ questions (output-based, time complexity, data structures)

Return ONLY valid JSON array of exactly 20 MCQ questions:
[
  {
    "id": 1,
    "type": "mcq",
    "category": "Quantitative Aptitude",
    "question": "A train 150m long passes a pole in 15 seconds. What is its speed in km/h?",
    "options": ["36 km/h", "42 km/h", "54 km/h", "60 km/h"],
    "correct": 0,
    "explanation": "Speed = 150/15 = 10 m/s = 10 × 18/5 = 36 km/h",
    "difficulty": "${difficulty}",
    "topic": "Speed & Distance"
  }
]

Test #${testNum}: use UNIQUE questions not repeated across tests. Vary topics within each category.`;
      }

      const raw = await callAI(prompt, 2500);
      const qs = safeJSON(raw, []);
      if (!Array.isArray(qs) || qs.length===0) throw new Error("Failed to generate questions. Please try again.");
      setQuestions(qs);
      setAnswers({});
      setCurrentQ(0);
      setTimeLeft(isProduct ? 60*60 : 45*60); // 60min product, 45min service
      setView("test");
      trackActivity("mock_test_started", `${company} test#${test.id}`);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  // Timer
  useEffect(()=>{
    if (view!=="test") return;
    timerRef.current = setInterval(()=>{
      setTimeLeft(t=>{ if(t<=1){clearInterval(timerRef.current);submitTest();return 0;} return t-1; });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[view]);

  const submitTest = () => {
    clearInterval(timerRef.current);
    const mcqQs = questions.filter(q=>q.type==="mcq");
    const correct = mcqQs.filter(q=>answers[q.id]===q.correct).length;
    const total = mcqQs.length;
    const score = total>0 ? Math.round((correct/total)*100) : 0;
    setResult({ correct, total, score, attempted:Object.keys(answers).length, questions });
    if (selectedCompany && selectedTest) {
      saveTestScore(selectedCompany, selectedTest.id, score, total, correct);
      const updated = {...scores, [selectedCompany]:{...getCompanyScores(selectedCompany)} };
      updated[selectedCompany][selectedTest.id] = {score,total,correct,date:new Date().toISOString()};
      setScores(updated);
    }
    setView("result");
    trackActivity("mock_test_done", `${selectedCompany} test#${selectedTest?.id} score:${score}%`);
  };

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const co = selectedCompany ? ALL_COMPANIES[selectedCompany] : null;

  const filtered = Object.entries(ALL_COMPANIES).filter(([,p])=>filter==="all"||p.type===filter);

  // ── HOME VIEW ──────────────────────────────────────────────────────────
  if (view==="home") return (
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:4}}>🧪 Mock Test Engine</div>
        <div style={{color:C.muted,fontSize:13}}>35 companies · 40 mock tests each · Real exam patterns · AI-generated questions · Test cases for coding</div>
      </div>

      {/* Filter */}
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[["all","All Companies (35)"],["service","Service Based (20)"],["product","Product Based (15)"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)}
            style={{padding:"8px 16px",borderRadius:10,border:`1.5px solid ${filter===v?C.blue:C.border}`,background:filter===v?`${C.blue}10`:"#ffffff",color:filter===v?C.blue:C.muted,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:filter===v?700:400,fontSize:12,transition:"all .2s",whiteSpace:"nowrap"}}>
            {l}
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div style={{background:"linear-gradient(135deg,#eff6ff,#f0fdf4)",border:`1.5px solid ${C.blue}20`,borderRadius:16,padding:16,marginBottom:20,display:"flex",gap:0,flexWrap:"wrap"}}>
        {[["35","Companies"],["1400+","Mock Tests"],["40","Tests/Company"],["AI","Test Cases"]].map(([n,l],i,a)=>(
          <div key={i} style={{flex:1,minWidth:80,padding:"8px",borderRight:i<a.length-1?`1px solid ${C.border}`:"none",textAlign:"center"}}>
            <div style={{fontWeight:900,fontSize:20,color:C.blue}}>{n}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:1}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Section: Service */}
      {(filter==="all"||filter==="service") && (
        <div style={{marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{fontWeight:800,fontSize:16,color:C.text}}>🏢 Service Based Companies</div>
            <Tag color={C.blue}>20 Companies</Tag>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
            {Object.entries(SERVICE_COMPANIES).map(([key,co])=>{
              const stats=getCompanyStats(key);
              return (
                <div key={key} className="hover-lift" onClick={()=>{setSelectedCompany(key);setView("company");}}
                  style={{background:"#ffffff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:18,borderTop:`3px solid ${co.color}`,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:24}}>{co.emoji}</span>
                      <div>
                        <div style={{fontWeight:800,fontSize:14,color:C.text}}>{co.name}</div>
                        <div style={{fontSize:10,color:C.muted}}>40 mock tests</div>
                      </div>
                    </div>
                    {stats.completed>0 && <div style={{textAlign:"right"}}><div style={{fontWeight:800,fontSize:14,color:co.color}}>{stats.avg}%</div><div style={{fontSize:9,color:C.muted}}>avg score</div></div>}
                  </div>
                  <div style={{color:C.soft,fontSize:11,lineHeight:1.6,marginBottom:10}}>{co.desc}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{background:`${co.color}10`,borderRadius:8,padding:"3px 10px",fontSize:10,color:co.color,fontWeight:700}}>{stats.completed}/40 done</div>
                    {stats.completed>0 && <div style={{background:"#f0fdf4",borderRadius:8,padding:"3px 10px",fontSize:10,color:C.green,fontWeight:700}}>Best: {stats.best}%</div>}
                  </div>
                  {stats.completed>0 && (
                    <div style={{marginTop:10,background:"#e2e8f0",borderRadius:4,height:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${(stats.completed/40)*100}%`,background:co.color,borderRadius:4,transition:"width .5s"}}/>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section: Product */}
      {(filter==="all"||filter==="product") && (
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{fontWeight:800,fontSize:16,color:C.text}}>🚀 Product Based Companies</div>
            <Tag color={C.orange}>15 Companies</Tag>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
            {Object.entries(PRODUCT_COMPANIES).map(([key,co])=>{
              const stats=getCompanyStats(key);
              return (
                <div key={key} className="hover-lift" onClick={()=>{setSelectedCompany(key);setView("company");}}
                  style={{background:"#ffffff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:18,borderTop:`3px solid ${co.color}`,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:24}}>{co.emoji}</span>
                      <div>
                        <div style={{fontWeight:800,fontSize:14,color:C.text}}>{co.name}</div>
                        <div style={{fontSize:10,color:C.muted}}>40 mock tests</div>
                      </div>
                    </div>
                    {stats.completed>0 && <div style={{textAlign:"right"}}><div style={{fontWeight:800,fontSize:14,color:co.color}}>{stats.avg}%</div><div style={{fontSize:9,color:C.muted}}>avg score</div></div>}
                  </div>
                  <div style={{color:C.soft,fontSize:11,lineHeight:1.6,marginBottom:10}}>{co.desc}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{background:`${co.color}10`,borderRadius:8,padding:"3px 10px",fontSize:10,color:co.color,fontWeight:700}}>{stats.completed}/40 done</div>
                    {stats.completed>0 && <div style={{background:"#f0fdf4",borderRadius:8,padding:"3px 10px",fontSize:10,color:C.green,fontWeight:700}}>Best: {stats.best}%</div>}
                  </div>
                  {stats.completed>0 && (
                    <div style={{marginTop:10,background:"#e2e8f0",borderRadius:4,height:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${(stats.completed/40)*100}%`,background:co.color,borderRadius:4,transition:"width .5s"}}/>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // ── COMPANY VIEW (40 tests grid) ────────────────────────────────────────
  if (view==="company" && co) {
    const tests = getMockTests(selectedCompany);
    const coScores = scores[selectedCompany]||{};
    const stats = getCompanyStats(selectedCompany);
    const completedTests = Object.keys(coScores).map(Number);

    return (
      <div>
        <button onClick={()=>setView("home")} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif",marginBottom:20,display:"flex",alignItems:"center",gap:6}}>← Back to Companies</button>

        {/* Company Header */}
        <div style={{background:"#ffffff",border:`1.5px solid ${C.border}`,borderRadius:20,padding:24,marginBottom:20,borderTop:`4px solid ${co.color}`}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
            <span style={{fontSize:48}}>{co.emoji}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:900,fontSize:22,color:C.text}}>{co.name}</div>
              <div style={{color:C.muted,fontSize:13,marginTop:2}}>{co.desc}</div>
            </div>
          </div>

          {/* Performance Dashboard */}
          {stats.completed>0 ? (
            <div>
              <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12}}>📊 Your Performance</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
                {[
                  {label:"Tests Done",val:stats.completed,unit:"/40",color:co.color},
                  {label:"Avg Score",val:stats.avg,unit:"%",color:stats.avg>=70?C.green:stats.avg>=50?C.warn:C.danger},
                  {label:"Best Score",val:stats.best,unit:"%",color:C.green},
                  {label:"Completion",val:Math.round((stats.completed/40)*100),unit:"%",color:co.color},
                ].map((s,i)=>(
                  <div key={i} style={{background:C.card,borderRadius:12,padding:"12px",textAlign:"center",border:`1px solid ${C.border}`}}>
                    <div style={{fontWeight:900,fontSize:20,color:s.color}}>{s.val}<span style={{fontSize:12,fontWeight:500}}>{s.unit}</span></div>
                    <div style={{fontSize:10,color:C.muted,marginTop:2}}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"#e2e8f0",borderRadius:6,height:8,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(stats.completed/40)*100}%`,background:`linear-gradient(90deg,${co.color},${co.color}aa)`,borderRadius:6,transition:"width .5s"}}/>
              </div>
              <div style={{fontSize:11,color:C.muted,marginTop:4}}>{stats.completed} of 40 tests completed</div>
            </div>
          ) : (
            <div style={{background:C.card,borderRadius:12,padding:16,textAlign:"center"}}>
              <div style={{fontSize:13,color:C.muted}}>No tests taken yet. Start with Mock Test 1!</div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:18,marginBottom:20}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:10}}>💡 {co.name} Tips</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {co.tips.map((t,i)=>(
              <div key={i} style={{display:"flex",gap:8,fontSize:12,color:C.soft}}><span style={{color:co.color,fontWeight:700,flexShrink:0}}>→</span>{t}</div>
            ))}
          </div>
        </div>

        {/* 40 Tests Grid */}
        <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:14}}>📋 40 Mock Tests — Choose One</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>
          {tests.map(test=>{
            const s = coScores[test.id];
            const done = !!s;
            const scoreColor = done ? (s.score>=70?C.green:s.score>=50?C.warn:C.danger) : co.color;
            return (
              <div key={test.id} className="hover-lift" onClick={()=>!loading&&startTest(selectedCompany,test)}
                style={{background:"#ffffff",border:`1.5px solid ${done?scoreColor:C.border}`,borderRadius:12,padding:14,cursor:"pointer",
                  boxShadow:done?`0 2px 8px ${scoreColor}20`:"0 1px 4px rgba(0,0,0,0.04)",
                  background:done?`${scoreColor}06`:"#ffffff"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{fontWeight:800,fontSize:13,color:C.text}}>#{test.id}</div>
                  <div style={{background:test.difficulty==="Easy"?`${C.green}15`:test.difficulty==="Medium"?`${C.warn}15`:`${C.danger}15`,color:test.difficulty==="Easy"?C.green:test.difficulty==="Medium"?C.warn:C.danger,fontSize:9,padding:"2px 7px",borderRadius:10,fontWeight:700}}>{test.difficulty}</div>
                </div>
                {done ? (
                  <div>
                    <div style={{fontWeight:900,fontSize:20,color:scoreColor}}>{s.score}%</div>
                    <div style={{fontSize:9,color:C.muted}}>{s.correct}/{s.total} correct</div>
                    <div style={{marginTop:6,background:"#e2e8f0",borderRadius:3,height:3}}>
                      <div style={{height:"100%",width:`${s.score}%`,background:scoreColor,borderRadius:3}}/>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{fontSize:11,color:C.muted,marginBottom:6}}>Not taken</div>
                    <div style={{background:`${co.color}15`,color:co.color,fontSize:10,padding:"4px 8px",borderRadius:8,fontWeight:700,textAlign:"center"}}>{loading?"...":"▶ Start"}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {loading && (
          <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(15,23,42,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
            <div style={{background:"#ffffff",borderRadius:20,padding:40,textAlign:"center",maxWidth:320}}>
              <SpinIcon size={48} color={co.color}/>
              <div style={{fontWeight:800,fontSize:18,color:C.text,marginTop:16,marginBottom:8}}>Generating Questions...</div>
              <div style={{color:C.muted,fontSize:13,lineHeight:1.7}}>AI is creating unique {co.name} pattern questions with test cases. This takes ~15 seconds.</div>
            </div>
          </div>
        )}

        {err && <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",marginTop:16,color:C.danger,fontSize:13}}>⚠ {err} <button onClick={()=>setErr("")} style={{background:"none",border:"none",color:C.danger,cursor:"pointer",marginLeft:8,fontWeight:700}}>✕</button></div>}
      </div>
    );
  }

  // ── TEST VIEW ────────────────────────────────────────────────────────────
  if (view==="test") {
    const q = questions[currentQ];
    if (!q) return null;
    const progress = ((currentQ+1)/questions.length)*100;
    const isWarn = timeLeft < 300;

    return (
      <div>
        {/* Header */}
        <div style={{background:"#ffffff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:"14px 20px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontWeight:700,color:C.text,fontSize:14}}>{co?.name} — Mock Test #{selectedTest?.id}</div>
            <div style={{fontSize:11,color:C.muted}}>Q{currentQ+1} of {questions.length} · {selectedTest?.difficulty}</div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div className={isWarn?"timer-warn":""} style={{background:isWarn?"#fef2f2":"#f0fdf4",border:`1.5px solid ${isWarn?"#fecaca":"#bbf7d0"}`,borderRadius:10,padding:"7px 16px",fontWeight:800,fontSize:16,color:isWarn?C.danger:C.green,fontFamily:"'DM Mono',monospace"}}>
              ⏱ {formatTime(timeLeft)}
            </div>
            <Btn variant="danger" onClick={submitTest} style={{padding:"7px 14px",fontSize:12}}>Submit</Btn>
          </div>
        </div>

        {/* Progress */}
        <div style={{background:"#e2e8f0",borderRadius:4,height:5,marginBottom:20,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${co?.color||C.blue},${C.purple})`,borderRadius:4,transition:"width .3s"}}/>
        </div>

        {/* Question Card */}
        <div style={{background:"#ffffff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:16}}>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            <Tag color={co?.color||C.blue}>Q{currentQ+1}</Tag>
            {q.category && <Tag color={C.purple}>{q.category}</Tag>}
            {q.difficulty && <Tag color={q.difficulty==="Easy"?C.green:q.difficulty==="Hard"?C.danger:C.warn}>{q.difficulty}</Tag>}
            {q.topic && <Tag color={C.teal}>{q.topic}</Tag>}
          </div>

          {/* MCQ */}
          {q.type==="mcq" && (
            <div>
              <div style={{fontWeight:600,fontSize:15,color:C.text,lineHeight:1.8,marginBottom:18}}>{q.question}</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {(q.options||[]).map((opt,i)=>{
                  const sel=answers[q.id]===i;
                  return (
                    <button key={i} onClick={()=>setAnswers(a=>({...a,[q.id]:i}))}
                      style={{textAlign:"left",padding:"12px 16px",borderRadius:12,border:`1.5px solid ${sel?co?.color||C.blue:C.border}`,background:sel?`${co?.color||C.blue}08`:"#ffffff",color:C.text,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>
                      <span style={{fontWeight:700,color:sel?co?.color||C.blue:C.muted,marginRight:10}}>{String.fromCharCode(65+i)}.</span>{opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Coding */}
          {q.type==="coding" && (
            <div>
              <div style={{fontWeight:700,fontSize:17,color:C.text,marginBottom:10}}>{q.title}</div>
              <div style={{color:C.soft,fontSize:13,lineHeight:1.9,marginBottom:14,background:C.card,borderRadius:12,padding:14}}>{q.description}</div>

              {/* Examples */}
              {q.examples?.length>0 && (
                <div style={{marginBottom:14}}>
                  <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:8}}>Examples:</div>
                  {q.examples.map((ex,i)=>(
                    <div key={i} style={{background:"#0f172a",borderRadius:10,padding:12,marginBottom:6,fontFamily:"'DM Mono',monospace",fontSize:12}}>
                      <div style={{color:"#94a3b8",marginBottom:3}}>Input: <span style={{color:"#86efac"}}>{ex.input}</span></div>
                      <div style={{color:"#94a3b8",marginBottom:3}}>Output: <span style={{color:"#7dd3fc"}}>{ex.output}</span></div>
                      {ex.explanation && <div style={{color:"#94a3b8"}}>Explanation: <span style={{color:"#e2e8f0"}}>{ex.explanation}</span></div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Test Cases */}
              {q.testCases?.length>0 && (
                <div style={{marginBottom:14}}>
                  <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:8}}>🧪 Test Cases:</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {q.testCases.filter(tc=>tc.visible).map((tc,i)=>(
                      <div key={i} style={{background:"#f8f9fc",border:`1px solid ${C.border}`,borderRadius:8,padding:10,fontFamily:"'DM Mono',monospace",fontSize:12}}>
                        <div style={{display:"flex",gap:20}}>
                          <div><span style={{color:C.muted,fontSize:11}}>Input: </span><span style={{color:C.text,fontWeight:600}}>{tc.input}</span></div>
                          <div><span style={{color:C.muted,fontSize:11}}>Expected: </span><span style={{color:C.green,fontWeight:600}}>{tc.expected}</span></div>
                        </div>
                      </div>
                    ))}
                    {q.testCases.filter(tc=>!tc.visible).length>0 && (
                      <div style={{background:"#fffbeb",border:"1px solid #fef08a",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#92400e"}}>
                        🔒 {q.testCases.filter(tc=>!tc.visible).length} hidden test case(s) — solution must pass all cases
                      </div>
                    )}
                  </div>
                </div>
              )}

              {q.constraints?.length>0 && (
                <div style={{marginBottom:12,background:"#f8f9fc",borderRadius:8,padding:10}}>
                  <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:4}}>Constraints:</div>
                  {q.constraints.map((c,i)=><div key={i} style={{fontSize:12,color:C.soft,fontFamily:"'DM Mono',monospace"}}>• {c}</div>)}
                </div>
              )}

              {q.hint && <div style={{background:"#fffbeb",border:"1px solid #fef08a",borderRadius:10,padding:10,fontSize:12,color:"#92400e",marginBottom:12}}>💡 <strong>Hint:</strong> {q.hint}</div>}

              <div style={{marginTop:12}}>
                <div style={{fontWeight:600,fontSize:13,color:C.text,marginBottom:6}}>Your Solution:</div>
                <textarea value={answers[q.id]||""} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))}
                  placeholder={"// Write your solution here\nfunction solution(input) {\n  // Your code\n  return result;\n}"}
                  style={{...inp,minHeight:220,fontFamily:"'DM Mono',monospace",fontSize:13,background:"#0f172a",color:"#e2e8f0",border:"1.5px solid #334155",lineHeight:1.8}}/>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <Btn variant="ghost" onClick={()=>setCurrentQ(q=>Math.max(0,q-1))} disabled={currentQ===0}>← Prev</Btn>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center"}}>
            {questions.map((_,i)=>(
              <button key={i} onClick={()=>setCurrentQ(i)}
                style={{width:28,height:28,borderRadius:7,border:`1.5px solid ${i===currentQ?co?.color||C.blue:answers[questions[i]?.id]!==undefined?C.green:C.border}`,background:i===currentQ?`${co?.color||C.blue}15`:answers[questions[i]?.id]!==undefined?`${C.green}10`:"#ffffff",color:i===currentQ?co?.color||C.blue:C.muted,cursor:"pointer",fontWeight:700,fontSize:11}}>{i+1}</button>
            ))}
          </div>
          {currentQ<questions.length-1
            ? <Btn variant="cta" onClick={()=>setCurrentQ(q=>q+1)} style={{background:`linear-gradient(135deg,${co?.color||C.blue},${co?.color||C.blueDark})`}}>Next →</Btn>
            : <Btn variant="green" onClick={submitTest}>Submit ✓</Btn>
          }
        </div>
      </div>
    );
  }

  // ── RESULT VIEW ──────────────────────────────────────────────────────────
  if (view==="result" && result) {
    const grade = result.score>=80?"Excellent 🏆":result.score>=60?"Good 👍":result.score>=40?"Average 📈":"Needs Work 💪";
    const gradeColor = result.score>=80?C.green:result.score>=60?C.blue:result.score>=40?C.warn:C.danger;
    const stats = getCompanyStats(selectedCompany);

    return (
      <div>
        <div style={{background:`linear-gradient(135deg,${gradeColor}15,${gradeColor}05)`,border:`1.5px solid ${gradeColor}30`,borderRadius:20,padding:28,textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:52,marginBottom:10}}>{result.score>=80?"🏆":result.score>=60?"🎯":result.score>=40?"📈":"💪"}</div>
          <div style={{fontWeight:900,fontSize:22,color:C.text,marginBottom:4}}>{grade}</div>
          <div style={{fontSize:52,fontWeight:900,color:gradeColor,marginBottom:8}}>{result.score}%</div>
          <div style={{color:C.muted,fontSize:14,marginBottom:10}}>{result.correct} correct / {result.total} questions · {result.attempted} attempted</div>
          <div style={{display:"inline-flex",gap:16,background:"#ffffff",borderRadius:12,padding:"10px 20px",border:`1px solid ${C.border}`}}>
            <div style={{textAlign:"center"}}><div style={{fontWeight:800,fontSize:15,color:co?.color}}>{stats.completed}</div><div style={{fontSize:10,color:C.muted}}>Tests Done</div></div>
            <div style={{width:1,background:C.border}}/>
            <div style={{textAlign:"center"}}><div style={{fontWeight:800,fontSize:15,color:C.green}}>{stats.avg}%</div><div style={{fontSize:10,color:C.muted}}>Avg Score</div></div>
            <div style={{width:1,background:C.border}}/>
            <div style={{textAlign:"center"}}><div style={{fontWeight:800,fontSize:15,color:C.green}}>{stats.best}%</div><div style={{fontSize:10,color:C.muted}}>Best Score</div></div>
          </div>
        </div>

        {/* Answer Review */}
        <div style={{marginBottom:20}}>
          <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:14}}>📋 Answer Review</div>
          {result.questions.map((q,i)=>{
            const userAns = answers[q.id];
            const isCorrect = q.type==="mcq" ? userAns===q.correct : null;
            return (
              <div key={q.id||i} style={{background:"#ffffff",border:`1.5px solid ${isCorrect===true?C.green:isCorrect===false?C.danger:C.border}`,borderRadius:14,padding:16,marginBottom:10}}>
                <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"flex-start"}}>
                  <span style={{fontSize:15,flexShrink:0}}>{isCorrect===true?"✅":isCorrect===false?"❌":"📝"}</span>
                  <div style={{fontWeight:600,fontSize:13,color:C.text,lineHeight:1.7}}>{q.question||q.title}</div>
                </div>
                {q.type==="mcq" && (
                  <div style={{paddingLeft:24}}>
                    {userAns!==undefined && <div style={{fontSize:12,color:C.muted,marginBottom:3}}>Your answer: <strong style={{color:isCorrect?C.green:C.danger}}>{q.options?.[userAns]}</strong></div>}
                    {isCorrect===false && <div style={{fontSize:12,color:C.green,marginBottom:6}}>Correct: <strong>{q.options?.[q.correct]}</strong></div>}
                    {q.explanation && <div style={{background:"#f8f9fc",borderRadius:8,padding:"8px 12px",fontSize:12,color:C.soft,lineHeight:1.7}}>💡 {q.explanation}</div>}
                  </div>
                )}
                {q.type==="coding" && (
                  <div style={{paddingLeft:24}}>
                    {q.solution_approach && <div style={{background:"#f0fdf4",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#14532d",lineHeight:1.7,marginBottom:6}}>✅ <strong>Approach:</strong> {q.solution_approach}</div>}
                    {q.time_complexity && <Tag color={C.purple}>Time: {q.time_complexity}</Tag>}
                    {q.testCases?.length>0 && (
                      <div style={{marginTop:8}}>
                        <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:6}}>Test Cases:</div>
                        {q.testCases.map((tc,ti)=>(
                          <div key={ti} style={{background:"#f8f9fc",borderRadius:6,padding:"6px 10px",fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:4}}>
                            <span style={{color:C.muted}}>In: </span><span>{tc.input}</span>
                            <span style={{color:C.muted,marginLeft:12}}>Expected: </span><span style={{color:C.green}}>{tc.expected}</span>
                            {!tc.visible && <span style={{marginLeft:8,background:"#fffbeb",color:"#92400e",fontSize:9,padding:"1px 6px",borderRadius:10}}>hidden</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <Btn variant="cta" onClick={()=>{setView("company");setResult(null);}} style={{flex:1,background:`linear-gradient(135deg,${co?.color||C.blue},${co?.color||C.blueDark})`}}>📋 More Tests</Btn>
          <Btn variant="ghost" onClick={()=>{setView("home");setResult(null);setSelectedCompany(null);setSelectedTest(null);}} style={{flex:1}}>← All Companies</Btn>
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
  const [resume, setResume] = useState(()=>localStorage.getItem("tp_resume")||"");
  const [jd, setJd] = useState(()=>localStorage.getItem("tp_jd")||"");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState("");
  const [err, setErr] = useState("");
  const fileRef = useRef();

  const handleFile = async (e) => {
    const f=e.target.files[0]; if(!f) return;
    try {
      let text="";
      if(f.type==="application/pdf"||f.name.endsWith(".pdf")) text=await extractTextFromPDF(f);
      else if(f.name.endsWith(".docx")) text=await extractTextFromDOCX(f);
      else { const r=new FileReader(); r.onload=ev=>{setResume(ev.target.result);localStorage.setItem("tp_resume",ev.target.result);}; r.readAsText(f); return; }
      setResume(text); localStorage.setItem("tp_resume",text);
    } catch(e2) { setErr("Could not read file: "+e2.message); }
  };

  const copy=(text,key)=>{ navigator.clipboard.writeText(text).then(()=>{setCopied(key);setTimeout(()=>setCopied(""),2000);}); };

  const generate = async () => {
    if(!resume.trim()&&tool!=="coldmsg"){setErr("Please paste your resume or upload it first.");return;}
    if(tool==="coldmsg"&&!targetCompany.trim()){setErr("Enter the target company name.");return;}
    setLoading(true); setErr(""); setResult(null);
    const reT=resume.trim().slice(0,1500);
    try {
      let prompt="";
      if(tool==="bio") {
        prompt=`LinkedIn profile expert. Write optimized LinkedIn About section for Indian tech professional targeting ${targetRole||"software/tech roles"}.\nResume:\n${reT}\nRules: First person, conversational Indian tone. Start with strong hook (NOT "I am a..."). 200-280 words. Include skills, achievements, CTA. Sound human.\nReturn ONLY JSON: {"bio":"...","wordCount":220,"hook":"opening line","keyHighlights":["h1","h2","h3"]}`;
      } else if(tool==="headline") {
        prompt=`Generate 5 optimized LinkedIn headlines for Indian tech professional targeting ${targetRole||"software/tech"}.\nResume:\n${reT}\nRules: Max 220 chars each. Role|skill|value. Keywords Indian recruiters search. NO "Seeking opportunities" or "Fresher".\nReturn ONLY JSON: {"headlines":[{"text":"...","angle":"Skill-focused","score":92}],"bestPick":0,"tips":["tip1"]}`;
      } else if(tool==="coldmsg") {
        prompt=`Write cold message/connection request for Indian fresher to send to HR at ${targetCompany} for ${targetRole||"software engineer"} role.\nBackground:\n${reT.slice(0,500)}\nWrite 3 versions: 1) Connection request (300 chars) 2) Cold DM (150 words) 3) Referral request (120 words). India professional tone.\nReturn ONLY JSON: {"connectionRequest":"...","coldDM":"...","referralRequest":"...","tips":["tip1","tip2"]}`;
      } else if(tool==="skills") {
        prompt=`Analyze resume and suggest top LinkedIn skills for ${targetRole||"software/tech"} roles in India.\nResume:\n${reT}\nReturn ONLY JSON: {"topSkills":[{"skill":"React.js","priority":"Must Add","reason":"...","endorsementTip":"..."}],"skillsAlreadyOnProfile":["Python"],"missingHighImpact":["Docker","TypeScript"],"profileStrengthTip":"..."}`;
      } else if(tool==="cover") {
        prompt=`Write cover letter for Indian fresher applying to ${targetRole||"software engineer"}${targetCompany?" at "+targetCompany:""}.\nResume:\n${reT}\nJD:\n${jd.slice(0,400)||"General software role"}\nRules: Indian professional tone. 3 paragraphs. 180-220 words. NO generic openers. Mention specific skills.\nReturn ONLY JSON: {"coverLetter":"...","subject":"Application for [Role] — [Name] | B.Tech CSE","wordCount":200}`;
      }
      const raw=await callAI(prompt,2000);
      const data=safeJSON(raw,null);
      if(!data) throw new Error("Generation failed. Please try again.");
      setResult(data);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  const tools=[
    {id:"bio",icon:"📄",label:"LinkedIn Bio",desc:"AI-written About section"},
    {id:"headline",icon:"✍️",label:"Headline",desc:"5 options + best pick"},
    {id:"coldmsg",icon:"💬",label:"Cold Message",desc:"HR DM + referral request"},
    {id:"skills",icon:"🎯",label:"Skills",desc:"Top skills to add"},
    {id:"cover",icon:"📧",label:"Cover Letter",desc:"India-tone cover letter"},
  ];

  return (
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:4}}>🔗 LinkedIn Suite</div>
        <div style={{color:C.muted,fontSize:13}}>Bio · Headline · Cold DM to HR · Skills · Cover Letter — all in one place</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
        {tools.map(t=>(
          <button key={t.id} onClick={()=>{setTool(t.id);setResult(null);setErr("");}}
            style={{padding:"9px 14px",borderRadius:12,whiteSpace:"nowrap",border:`1.5px solid ${tool===t.id?C.blue:C.border}`,background:tool===t.id?`${C.blue}10`:"#ffffff",color:tool===t.id?C.blue:C.muted,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:tool===t.id?700:400,fontSize:13,transition:"all .2s",display:"flex",alignItems:"center",gap:6}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",marginBottom:16,color:C.danger,fontSize:13}}>⚠ {err}</div>}
      <div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontWeight:700,color:C.text,fontSize:14}}>📄 Your Resume</div>
          <button onClick={()=>fileRef.current.click()} style={{padding:"6px 12px",borderRadius:8,border:`1.5px solid ${C.blue}40`,background:`${C.blue}08`,color:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>📁 Upload PDF/DOCX</button>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFile} style={{display:"none"}}/>
        <textarea value={resume} onChange={e=>{setResume(e.target.value);localStorage.setItem("tp_resume",e.target.value);}} placeholder="Paste your resume here or upload file above..." style={{...inp,minHeight:100,resize:"vertical",lineHeight:1.8}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <input style={inp} placeholder="Target role (e.g. Full Stack Developer)" value={targetRole} onChange={e=>setTargetRole(e.target.value)}/>
        {(tool==="coldmsg"||tool==="cover")
          ? <input style={inp} placeholder={tool==="coldmsg"?"Target company (required)*":"Target company (optional)"} value={targetCompany} onChange={e=>setTargetCompany(e.target.value)}/>
          : <div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 14px",fontSize:12,color:C.muted}}>{tools.find(t=>t.id===tool)?.desc}</div>
        }
      </div>
      <Btn variant="cta" loading={loading} onClick={generate} style={{width:"100%",padding:"13px",fontSize:15}}>✨ Generate {tools.find(t=>t.id===tool)?.label}</Btn>

      {result&&(
        <div style={{marginTop:20}}>
          {tool==="bio"&&result.bio&&(
            <div>
              <div style={{background:"#ffffff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontWeight:700,color:C.text,fontSize:15}}>✅ LinkedIn About Section</div>
                  <div style={{display:"flex",gap:8}}>
                    <Tag color={C.muted}>{result.wordCount} words</Tag>
                    <button onClick={()=>copy(result.bio,"bio")} style={{padding:"5px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,background:copied==="bio"?"#f0fdf4":"#ffffff",color:copied==="bio"?C.green:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>{copied==="bio"?"✅ Copied!":"📋 Copy"}</button>
                  </div>
                </div>
                <div style={{color:C.soft,fontSize:13,lineHeight:2,whiteSpace:"pre-line",background:"#f8f9fc",borderRadius:10,padding:14}}>{result.bio}</div>
              </div>
              {result.keyHighlights?.length>0&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:14}}><div style={{fontWeight:700,color:C.green,marginBottom:6}}>✨ Key highlights:</div>{result.keyHighlights.map((h,i)=><div key={i} style={{fontSize:12,color:C.soft,marginBottom:3}}>→ {h}</div>)}</div>}
            </div>
          )}
          {tool==="headline"&&result.headlines&&(
            <div>
              {result.headlines.map((h,i)=>(
                <div key={i} style={{background:i===result.bestPick?"#f0fdf4":"#ffffff",border:`1.5px solid ${i===result.bestPick?C.green:C.border}`,borderRadius:14,padding:16,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>{i===result.bestPick&&<Tag color={C.green}>⭐ Best</Tag>}<Tag color={C.blue}>{h.angle}</Tag><Tag color={C.purple}>{h.score}%</Tag></div>
                    <button onClick={()=>copy(h.text,"h"+i)} style={{padding:"5px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,background:copied==="h"+i?"#f0fdf4":"#ffffff",color:copied==="h"+i?C.green:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>{copied==="h"+i?"✅":"📋"}</button>
                  </div>
                  <div style={{fontWeight:600,fontSize:13,color:C.text,lineHeight:1.7}}>{h.text}</div>
                  <div style={{fontSize:10,color:C.muted,marginTop:4}}>{h.text.length}/220 chars</div>
                </div>
              ))}
              {result.tips?.map((t,i)=><div key={i} style={{background:"#fffbeb",border:"1px solid #fef08a",borderRadius:10,padding:"9px 12px",fontSize:12,color:"#92400e",marginBottom:6}}>💡 {t}</div>)}
            </div>
          )}
          {tool==="coldmsg"&&(
            <div>
              {[{key:"connectionRequest",label:"🔗 Connection Request",charLimit:300},{key:"coldDM",label:"💬 Cold DM to HR"},{key:"referralRequest",label:"🤝 Referral Request"}].map(({key,label,charLimit})=>result[key]&&(
                <div key={key} style={{background:"#ffffff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{fontWeight:700,color:C.text,fontSize:13}}>{label}</div>
                    <button onClick={()=>copy(result[key],key)} style={{padding:"5px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,background:copied===key?"#f0fdf4":"#ffffff",color:copied===key?C.green:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>{copied===key?"✅ Copied!":"📋 Copy"}</button>
                  </div>
                  <div style={{color:C.soft,fontSize:12,lineHeight:1.9,whiteSpace:"pre-line",background:"#f8f9fc",borderRadius:8,padding:12}}>{result[key]}</div>
                  {charLimit&&<div style={{marginTop:4,fontSize:10,color:result[key].length>charLimit?C.danger:C.green}}>{result[key].length}/{charLimit} chars</div>}
                </div>
              ))}
              {result.tips?.map((t,i)=><div key={i} style={{background:"#fffbeb",border:"1px solid #fef08a",borderRadius:10,padding:"9px 12px",fontSize:12,color:"#92400e",marginBottom:6}}>💡 {t}</div>)}
            </div>
          )}
          {tool==="skills"&&result.topSkills&&(
            <div>
              {result.missingHighImpact?.length>0&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:14,marginBottom:12}}><div style={{fontWeight:700,color:C.danger,marginBottom:6}}>🚨 High-Impact Skills Missing:</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{result.missingHighImpact.map((s,i)=><span key={i} style={{background:"#fef2f2",color:C.danger,fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700,border:"1px solid #fecaca"}}>+ {s}</span>)}</div></div>}
              {result.topSkills.map((sk,i)=>(
                <div key={i} style={{background:"#ffffff",border:`1.5px solid ${sk.priority==="Must Add"?C.blue:C.border}`,borderRadius:12,padding:14,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{fontWeight:700,color:C.text,fontSize:14}}>{sk.skill}</div><Tag color={sk.priority==="Must Add"?C.blue:C.green}>{sk.priority}</Tag></div>
                  <div style={{color:C.soft,fontSize:12,marginBottom:6}}>{sk.reason}</div>
                  <div style={{background:"#eff6ff",borderRadius:8,padding:"5px 10px",fontSize:11,color:C.blue}}>💡 {sk.endorsementTip}</div>
                </div>
              ))}
              {result.profileStrengthTip&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:12,fontSize:12,color:"#14532d"}}>🎯 {result.profileStrengthTip}</div>}
            </div>
          )}
          {tool==="cover"&&result.coverLetter&&(
            <div style={{background:"#ffffff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:22}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontWeight:700,color:C.text,fontSize:15}}>📧 Cover Letter</div>
                <button onClick={()=>copy(result.coverLetter,"cover")} style={{padding:"5px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,background:copied==="cover"?"#f0fdf4":"#ffffff",color:copied==="cover"?C.green:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>{copied==="cover"?"✅ Copied!":"📋 Copy"}</button>
              </div>
              {result.subject&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"7px 12px",fontSize:12,color:C.blue,marginBottom:12}}><strong>Subject:</strong> {result.subject}</div>}
              <div style={{color:C.soft,fontSize:13,lineHeight:2,whiteSpace:"pre-line",background:"#f8f9fc",borderRadius:10,padding:14}}>{result.coverLetter}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// RESUME ANALYZER
// ══════════════════════════════════════════════════════════════════════════
function ResumeAnalyzer({ user }) {
  const [jd,setJd]=useState(()=>localStorage.getItem("tp_jd")||"");
  const [resume,setResume]=useState(()=>localStorage.getItem("tp_resume")||"");
  const [fileName,setFileName]=useState(()=>localStorage.getItem("tp_fileName")||"");
  const [step,setStep]=useState("input");
  const [analysis,setAnalysis]=useState(null);
  const [optimized,setOptimized]=useState(null);
  const [optimizedScores,setOptimizedScores]=useState(null);
  const [err,setErr]=useState("");
  const [section,setSection]=useState("overview");
  const [downloading,setDownloading]=useState("");
  const fileRef=useRef(); const jdImageRef=useRef(); const [jdImageLoading,setJdImageLoading]=useState(false);

  const handleFile=async(e)=>{
    const f=e.target.files[0];if(!f)return;setFileName(f.name);localStorage.setItem("tp_fileName",f.name);setErr("");
    try{let t="";if(f.type==="application/pdf"||f.name.endsWith(".pdf"))t=await extractTextFromPDF(f);else if(f.name.endsWith(".docx"))t=await extractTextFromDOCX(f);else{const r=new FileReader();r.onload=ev=>{setResume(ev.target.result);localStorage.setItem("tp_resume",ev.target.result);};r.readAsText(f);return;}setResume(t);localStorage.setItem("tp_resume",t);}catch(e2){setErr("Could not read file: "+e2.message);}
  };

  const runAnalysis=async()=>{
    if(!jd.trim()||!resume.trim()){setErr("Fill in both Job Description and Resume.");return;}
    setStep("analyzing");setErr("");setAnalysis(null);setOptimized(null);setOptimizedScores(null);
    try{
      const prompt=`Senior ATS analyst. Deep analysis. Be honest and specific.\nJD: ${jd.trim().slice(0,800)}\nRESUME: ${resume.trim().slice(0,900)}\nReturn ONLY valid JSON:\n{"matchScore":72,"atsScore":78,"shortlistRate":24,"verdict":"Strong Match","summary":"2-sentence specific summary.","recruiterImpression":"5-sec recruiter thought.","sectionAudit":[{"section":"Contact Info","score":85,"status":"good","feedback":"specific"},{"section":"Education","score":90,"status":"good","feedback":"specific"},{"section":"Experience","score":65,"status":"warning","feedback":"specific"},{"section":"Projects","score":80,"status":"good","feedback":"specific"},{"section":"Skills","score":70,"status":"warning","feedback":"specific"},{"section":"Resume Format","score":60,"status":"warning","feedback":"specific"},{"section":"Metrics & Numbers","score":40,"status":"weak","feedback":"specific"}],"strongMatches":[{"skill":"React.js","reason":"Listed in both JD and resume","strength":90}],"missingKeywords":[{"keyword":"Docker","importance":"High","tip":"Add to Tools section"}],"weakAreas":[{"area":"No metrics","detail":"Add numbers","priority":"High"}],"projectFit":[{"name":"Project1","relevance":92,"keep":true,"reason":"Relevant","suggestion":"Add metric"}],"suggestedSkillsToAdd":["Docker","TypeScript"],"improvements":["Add metrics"],"formatIssues":["Not Jake format"]}`;
      const raw=await callAI(prompt,2000);const data=safeJSON(raw,null);
      if(!data?.matchScore)throw new Error("Analysis failed. Try again.");
      setAnalysis(data);setStep("analyzed");setSection("overview");
    }catch(e){setErr(e.message||"Analysis failed.");setStep("input");}
  };

  const handleJDImage=async(e)=>{
    const files=Array.from(e.target.files);if(!files.length)return;setJdImageLoading(true);setErr("");
    try{
      let allText="";
      for(let i=0;i<files.length;i++){const f=files[i];const base64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});const res2=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1500,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:f.type||"image/jpeg",data:base64}},{type:"text",text:`Extract ALL text from this JD image page ${i+1}. Return only plain text.`}]}]})});if(!res2.ok)throw new Error(`Page ${i+1} failed`);const d=await res2.json();allText+=(d.content?.[0]?.text||"")+"\n\n";}
      if(!allText.trim())throw new Error("Could not read images.");setJd(allText.trim());localStorage.setItem("tp_jd",allText.trim());
    }catch(e2){setErr("Image upload failed: "+e2.message);}
    setJdImageLoading(false);e.target.value="";
  };

  const extractEducationFromResume=(rawText)=>{
    if(!rawText)return[];const lines=rawText.split(/\n/).map(l=>l.trim()).filter(Boolean);let eduStart=-1,eduEnd=-1;const sH=/^(EXPERIENCE|WORK|PROJECTS|SKILLS|TECHNICAL|CERTIF|ACHIEVEMENTS|SUMMARY|OBJECTIVE|INTERNSHIP)/i;for(let i=0;i<lines.length;i++){if(/^EDUCATION/i.test(lines[i])){eduStart=i+1;continue;}if(eduStart!==-1&&sH.test(lines[i])){eduEnd=i;break;}}if(eduStart===-1)return[];if(eduEnd===-1)eduEnd=Math.min(eduStart+8,lines.length);const eduLines=lines.slice(eduStart,eduEnd).filter(l=>!l.match(/^(EDUCATION|EXPERIENCE|PROJECTS|SKILLS)/i));if(eduLines.length===0)return[];const entries=[];let i=0;while(i<eduLines.length){const line1=eduLines[i]||"",line2=eduLines[i+1]||"";const dP=/(\b\d{4}\b.*?(?:–|-|to).*?\b\d{4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b)/i;let school=line1,location="";const lM=line1.match(/^(.+?)\s{2,}(.+)$/);if(lM){school=lM[1].trim();location=lM[2].trim();}let degree="",dates="";const dL2=line2.match(dP);if(dL2){const dS=line2.match(/^(.+?)\s{2,}(\S.*?\d{4}.*)$/);if(dS){degree=dS[1].trim();dates=dS[2].trim();}else{const dI=line2.indexOf(dL2[0]);degree=line2.slice(0,dI).trim();dates=dL2[0].trim();}i+=2;}else{degree=line2;i+=2;}if(!degree&&school.match(/B\.Tech|B\.E|M\.Tech|MBA|BCA|MCA|Bachelor|Master|B\.Sc/i)){degree=school;school="";}if(school||degree)entries.push({school,location,degree,dates});}return entries.length>0?entries:[];
  };

  const runOptimize=async()=>{
    setStep("optimizing");setErr("");const extractedEducation=extractEducationFromResume(resume);
    try{
      const prompt=`Expert ATS resume writer. Jake's format resume.\nJD: ${jd.trim().slice(0,600)}\nRESUME: ${resume.trim().slice(0,2500)}\nRULES: Copy education EXACTLY. Keep same company/title/dates. Rewrite bullets with JD keywords. 4 bullets per section with metrics. 6+ skill categories. Exactly 3 certifications.\nReturn ONLY JSON: {"name":"","phone":"","email":"","linkedin":"","github":"","location":"","education":[{"school":"","location":"","degree":"","dates":""}],"experience":[{"title":"","company":"","location":"","dates":"","bullets":[]}],"projects":[{"name":"","tech":"","dates":"","bullets":[]}],"skills":[{"category":"","items":""}],"certifications":[],"optimizedMatchScore":88,"optimizedAtsScore":91,"optimizedShortlistRate":34}`;
      const raw=await callAI(prompt,2500);const data=safeJSON(raw,null);
      if(!data?.name)throw new Error("Optimization failed. Try again.");
      if(extractedEducation.length>0)data.education=extractedEducation;
      const optScores={matchScore:data.optimizedMatchScore||Math.min(96,(analysis?.matchScore||70)+15),atsScore:data.optimizedAtsScore||Math.min(96,(analysis?.atsScore||70)+14),shortlistRate:data.optimizedShortlistRate||Math.min(45,(analysis?.shortlistRate||20)+12)};
      delete data.optimizedMatchScore;delete data.optimizedAtsScore;delete data.optimizedShortlistRate;
      if(data.certifications&&data.certifications.length>3)data.certifications=data.certifications.slice(0,3);
      while(data.certifications&&data.certifications.length<3)data.certifications.push("Actively solving DSA problems on competitive coding platforms");
      setOptimized(data);setOptimizedScores(optScores);setStep("optimized");setSection("resume");
    }catch(e){setErr(e.message||"Optimization failed.");setStep("analyzed");}
  };

  const scoreColor=s=>s>=75?"#16a34a":s>=55?"#d97706":"#dc2626";
  const scoreBg=s=>s>=75?"#f0fdf4":s>=55?"#fffbeb":"#fef2f2";
  const scoreBorder=s=>s>=75?"#bbf7d0":s>=55?"#fef08a":"#fecaca";
  const statusIcon=st=>st==="good"?"✅":st==="warning"?"⚠️":"❌";

  const handleDownload=async(type)=>{
    if(!optimized)return;setDownloading(type);
    try{if(type==="pdf")await downloadPDF(optimized,"TakePlace_Optimized_Resume.pdf");else await downloadDOCXJake(optimized,"TakePlace_Optimized_Resume.docx");}catch(e){alert("Download failed: "+e.message);}
    setDownloading("");
  };

  const JakesResumePreview=({data})=>{
    if(!data)return null;const ps={fontSize:8.5,lineHeight:"1.65",color:"#1a1a1a",marginBottom:2};const sS={borderBottom:"1.5px solid #1a1a1a",paddingBottom:1,marginBottom:6,marginTop:10,fontWeight:700,fontSize:9.5,letterSpacing:"0.06em",color:"#1a1a1a",textTransform:"uppercase"};const bS={...ps,paddingLeft:12,position:"relative",marginBottom:2.5};
    return(<div style={{background:"#ffffff",border:"1px solid #d1d5db",borderRadius:4,padding:"24px 28px",maxWidth:680,margin:"0 auto",fontFamily:"'Times New Roman',Times,serif",boxShadow:"0 4px 24px rgba(0,0,0,0.12)"}}><div style={{textAlign:"center",marginBottom:3}}><div style={{fontSize:18,fontWeight:700,color:"#1a1a1a"}}>{data.name}</div></div><div style={{textAlign:"center",marginBottom:10,fontSize:8,color:"#374151",lineHeight:1.5}}>{[data.phone,data.email,data.linkedin,data.github,data.location].filter(Boolean).join(" | ")}</div>{data.education?.length>0&&(<><div style={sS}>Education</div>{data.education.map((edu,i)=>(<div key={i} style={{marginBottom:6}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:9}}>{edu.school}</span><span style={{fontSize:8.5,color:"#374151"}}>{edu.location}</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:8.5,fontStyle:"italic"}}>{edu.degree}</span><span style={{fontSize:8.5,color:"#374151"}}>{edu.dates}</span></div></div>))}</>)}{data.experience?.length>0&&(<><div style={sS}>Experience</div>{data.experience.map((exp,i)=>(<div key={i} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:9}}>{exp.title}</span><span style={{fontSize:8.5,color:"#374151"}}>{exp.dates}</span></div><div style={{fontSize:8.5,fontStyle:"italic",color:"#374151",marginBottom:3}}>{exp.company}{exp.location?`, ${exp.location}`:""}</div>{(exp.bullets||[]).map((b,j)=>(<div key={j} style={bS}><span style={{position:"absolute",left:3,top:0,fontSize:8.5}}>•</span>{b}</div>))}</div>))}</>)}{data.projects?.length>0&&(<><div style={sS}>Projects</div>{data.projects.map((proj,i)=>(<div key={i} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}><span><span style={{fontWeight:700,fontSize:9}}>{proj.name}</span>{proj.tech&&<span style={{fontStyle:"italic",fontSize:8.5,color:"#374151"}}> | {proj.tech}</span>}</span>{proj.dates&&<span style={{fontSize:8.5,color:"#374151"}}>{proj.dates}</span>}</div><div style={{marginTop:2}}>{(proj.bullets||[]).map((b,j)=>(<div key={j} style={bS}><span style={{position:"absolute",left:3,top:0,fontSize:8.5}}>•</span>{b}</div>))}</div></div>))}</>)}{data.skills?.length>0&&(<><div style={sS}>Technical Skills</div>{data.skills.map((sk,i)=>(<div key={i} style={{...ps,marginBottom:2.5}}><span style={{fontWeight:700}}>{sk.category}: </span><span>{sk.items}</span></div>))}</>)}{data.certifications?.length>0&&(<><div style={sS}>Certifications & Achievements</div>{data.certifications.map((c,i)=>(<div key={i} style={bS}><span style={{position:"absolute",left:3,top:0,fontSize:8.5}}>•</span>{c}</div>))}</>)}</div>);
  };

  const Ring=({score,size=88,color,label})=>{const r=34,circ=2*Math.PI*r,col=color||scoreColor(score);return(<div style={{textAlign:"center"}}><svg width={size} height={size} viewBox="0 0 80 80"><circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6"/><circle cx="40" cy="40" r={r} fill="none" stroke={col} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)} strokeLinecap="round" transform="rotate(-90 40 40)" style={{transition:"stroke-dashoffset 1.2s ease"}}/><text x="40" y="44" textAnchor="middle" fill={col} fontSize="15" fontWeight="800" fontFamily="Inter">{score}%</text></svg>{label&&<div style={{fontSize:11,color:"#64748b",fontWeight:600,marginTop:2}}>{label}</div>}</div>);};
  const DeltaBadge=({original,optimized:opt})=>{const delta=opt-original;if(!delta)return null;return(<span style={{background:delta>0?"#f0fdf4":"#fef2f2",color:delta>0?"#16a34a":"#dc2626",fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:20,border:`1px solid ${delta>0?"#bbf7d0":"#fecaca"}`,marginLeft:6}}>{delta>0?"+":""}{delta}%</span>);};

  if(step==="input")return(
    <div>
      <div style={{marginBottom:22}}><div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:4}}>⚡ AI Resume Analyzer</div><div style={{color:C.muted,fontSize:13}}>Paste JD + resume → Deep section analysis → ATS scores → Jake's resume PDF</div></div>
      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",marginBottom:14,color:C.danger,fontSize:13}}>⚠ {err}</div>}
      <div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{flex:1}}><div style={{fontWeight:700,color:C.text,fontSize:14}}>📋 Job Description</div></div>
          <div style={{display:"flex",gap:8}}>
            {jd&&<span style={{background:jd.split(/\s+/).filter(Boolean).length>150?"#f0fdf4":"#fffbeb",color:jd.split(/\s+/).filter(Boolean).length>150?"#16a34a":"#d97706",fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700}}>{jd.split(/\s+/).filter(Boolean).length} words</span>}
            <button onClick={()=>jdImageRef.current.click()} disabled={jdImageLoading} style={{padding:"6px 12px",borderRadius:8,border:`1.5px solid ${C.orange}40`,background:`${C.orange}08`,color:C.orange,fontSize:11,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>{jdImageLoading?<><SpinIcon size={11} color={C.orange}/>Reading...</>:<>📸 Photo</>}</button>
            <input ref={jdImageRef} type="file" accept="image/*" multiple onChange={handleJDImage} style={{display:"none"}}/>
          </div>
        </div>
        {jd&&!jdImageLoading&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:6,padding:"5px 10px",marginBottom:6,fontSize:11,color:"#16a34a"}}>✅ JD loaded</div>}
        <textarea value={jd} onChange={e=>{setJd(e.target.value);localStorage.setItem("tp_jd",e.target.value);}} placeholder="Paste the job description here..." style={{...inp,minHeight:150,resize:"vertical",lineHeight:1.8}}/>
      </div>
      <div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontWeight:700,color:C.text,fontSize:14}}>📄 Your Resume</div>
          <button onClick={()=>fileRef.current.click()} style={{padding:"6px 12px",borderRadius:8,border:`1.5px solid ${C.blue}40`,background:`${C.blue}08`,color:C.blue,fontSize:11,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>📁 Upload PDF/DOCX</button>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.doc" onChange={handleFile} style={{display:"none"}}/>
        {fileName&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:6,padding:"5px 10px",marginBottom:8,fontSize:11,color:"#16a34a"}}>✅ {fileName}</div>}
        <textarea value={resume} onChange={e=>{setResume(e.target.value);localStorage.setItem("tp_resume",e.target.value);}} placeholder="Paste resume text here OR upload file above..." style={{...inp,minHeight:200,resize:"vertical",lineHeight:1.8}}/>
        {resume&&<div style={{marginTop:6,fontSize:11,color:resume.length>400?"#16a34a":"#d97706"}}>{resume.length>400?"✓ Resume looks complete":"⚠ Add more content for better analysis"}</div>}
      </div>
      <button onClick={runAnalysis} disabled={!jd.trim()||!resume.trim()} style={{width:"100%",padding:"14px",fontSize:15,borderRadius:12,border:"none",cursor:!jd.trim()||!resume.trim()?"not-allowed":"pointer",background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",fontWeight:800,fontFamily:"'Inter',sans-serif",opacity:!jd.trim()||!resume.trim()?0.5:1}}>🔍 Analyze Resume — Get Deep Score Breakdown</button>
    </div>
  );

  if(step==="analyzing")return(<div style={{textAlign:"center",padding:"80px 20px"}}><div style={{fontSize:64,marginBottom:20,animation:"float 2s ease-in-out infinite"}}>🧠</div><div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:8}}>Analyzing Your Resume</div><div style={{color:C.muted,fontSize:14,lineHeight:1.9,marginBottom:28}}>Running section-by-section audit...<br/>Scoring JD match, ATS readability, shortlist probability...</div><SpinIcon size={44} color={C.blue}/></div>);
  if(step==="optimizing")return(<div style={{textAlign:"center",padding:"80px 20px"}}><div style={{fontSize:64,marginBottom:20,animation:"float 2s ease-in-out infinite"}}>✨</div><div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:8}}>Building Jake's Resume</div><div style={{color:C.muted,fontSize:14,lineHeight:1.9,marginBottom:28}}>Preserving education & experience...<br/>Mirroring JD keywords into bullet points...</div><SpinIcon size={44} color={C.purple}/></div>);

  const a=analysis;
  const displayScores=(step==="optimized"&&optimizedScores)?optimizedScores:{matchScore:a.matchScore,atsScore:a.atsScore,shortlistRate:a.shortlistRate||Math.min(35,Math.round((a.matchScore*0.6+a.atsScore*0.4)*0.35))};
  const tabs=[["overview","📊 Overview"],["audit","🔬 Audit"],["gaps","⚠️ Gaps"],["projects","🏗️ Projects"],...(step==="optimized"?[["resume","✨ Optimized"]]:[])];;

  return(
    <div>
      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",marginBottom:14,color:C.danger,fontSize:13}}>⚠ {err}</div>}
      <div style={{background:"linear-gradient(135deg,#eff6ff,#f0fdf4)",border:`1.5px solid ${C.blue}20`,borderRadius:20,padding:22,marginBottom:14}}>
        {step==="optimized"&&optimizedScores&&<div style={{textAlign:"center",marginBottom:12}}><div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:20,padding:"5px 16px",fontSize:11,color:"#16a34a",fontWeight:700}}>✨ Scores updated after AI optimization</div></div>}
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:24,marginBottom:16,flexWrap:"wrap"}}>
          <div style={{textAlign:"center"}}><Ring score={displayScores.matchScore} label="JD Match"/>{step==="optimized"&&optimizedScores&&<DeltaBadge original={a.matchScore} optimized={optimizedScores.matchScore}/>}</div>
          <div style={{width:1,height:60,background:"#e2e8f0"}}/>
          <div style={{textAlign:"center"}}><Ring score={displayScores.atsScore} color="#2563eb" label="ATS Score"/>{step==="optimized"&&optimizedScores&&<DeltaBadge original={a.atsScore} optimized={optimizedScores.atsScore}/>}</div>
          <div style={{width:1,height:60,background:"#e2e8f0"}}/>
          <div style={{textAlign:"center"}}><div style={{width:88,height:88,borderRadius:"50%",border:`6px solid ${C.purple}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",margin:"0 auto"}}><div style={{fontWeight:900,fontSize:18,color:C.purple}}>{displayScores.shortlistRate}%</div></div><div style={{fontSize:11,color:"#64748b",fontWeight:600,marginTop:2}}>Shortlist Rate</div>{step==="optimized"&&optimizedScores&&<DeltaBadge original={a.shortlistRate||Math.min(35,Math.round((a.matchScore*0.6+a.atsScore*0.4)*0.35))} optimized={optimizedScores.shortlistRate}/>}</div>
        </div>
        <div style={{textAlign:"center"}}><div style={{display:"inline-block",padding:"5px 18px",borderRadius:20,background:scoreBg(displayScores.matchScore),color:scoreColor(displayScores.matchScore),fontWeight:800,fontSize:13,border:`1px solid ${scoreBorder(displayScores.matchScore)}`,marginBottom:8}}>{step==="optimized"?"✨ Optimized":a.verdict}</div><div style={{color:"#475569",fontSize:13,lineHeight:1.8,maxWidth:500,margin:"0 auto 8px"}}>{a.summary}</div>{a.recruiterImpression&&<div style={{background:"#fff",border:`1px solid ${C.blue}20`,borderRadius:10,padding:"8px 16px",fontSize:12,color:"#64748b",fontStyle:"italic",maxWidth:480,margin:"0 auto"}}>💼 <strong style={{color:C.blue,fontStyle:"normal"}}>Recruiter's take:</strong> {a.recruiterImpression}</div>}</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        {tabs.map(([k,l])=><button key={k} onClick={()=>setSection(k)} style={{padding:"8px 16px",borderRadius:20,whiteSpace:"nowrap",border:`1.5px solid ${section===k?C.blue:C.border}`,background:section===k?`${C.blue}10`:"#ffffff",color:section===k?C.blue:"#64748b",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:section===k?700:400,fontSize:12,transition:"all .2s"}}>{l}</button>)}
      </div>
      {section==="overview"&&<div>
        <div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:12}}><div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:12}}>✅ Strong Matches <span style={{background:"#f0fdf4",color:"#16a34a",fontSize:11,padding:"2px 8px",borderRadius:20,fontWeight:700}}>{a.strongMatches?.length||0}</span></div>{(a.strongMatches||[]).map((m,i)=>(<div key={i} style={{marginBottom:10,background:"#f0fdf4",borderRadius:10,padding:12,border:"1px solid #bbf7d0"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{fontWeight:700,color:C.text}}>{m.skill}</div><div style={{fontWeight:800,fontSize:14,color:scoreColor(m.strength)}}>{m.strength}%</div></div><div style={{color:"#64748b",fontSize:12,marginBottom:6}}>{m.reason}</div><div style={{background:"#e2e8f0",borderRadius:4,height:4}}><div style={{height:"100%",width:`${m.strength}%`,background:"#16a34a",borderRadius:4}}/></div></div>))}</div>
        {a.weakAreas?.length>0&&<div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:12}}><div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:10}}>⚡ Weak Areas</div>{a.weakAreas.map((w,i)=>(<div key={i} style={{background:"#fffbeb",borderRadius:10,padding:12,marginBottom:8,border:"1px solid #fef08a"}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><div style={{fontWeight:700,color:"#d97706",fontSize:13}}>{w.area}</div>{w.priority&&<span style={{background:w.priority==="High"?"#fef2f2":"#fffbeb",color:w.priority==="High"?"#dc2626":"#d97706",fontSize:10,padding:"1px 6px",borderRadius:20,fontWeight:700}}>{w.priority}</span>}</div><div style={{color:"#475569",fontSize:12,lineHeight:1.6}}>{w.detail}</div></div>))}</div>}
        {a.improvements?.length>0&&<div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:12}}><div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:10}}>📝 Quick Wins</div>{a.improvements.map((imp,i)=>(<div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8,background:"#f1f4f9",borderRadius:8,padding:"9px 12px",border:`1px solid ${C.border}`}}><span style={{color:C.blue,flexShrink:0,fontWeight:700}}>→</span><span style={{color:"#475569",fontSize:12}}>{imp}</span></div>))}</div>}
        {a.suggestedSkillsToAdd?.length>0&&<div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:12}}><div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:10}}>🎯 Skills to Add</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{a.suggestedSkillsToAdd.map((s,i)=>(<span key={i} style={{background:"#ede9fe",color:C.purple,fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700,border:"1px solid #c4b5fd"}}>+ {s}</span>))}</div></div>}
        {step!=="optimized"&&<div style={{background:"linear-gradient(135deg,#eff6ff,#ede9fe)",border:`1.5px solid ${C.blue}20`,borderRadius:18,padding:22,textAlign:"center",marginTop:8}}><div style={{fontWeight:800,fontSize:17,color:C.text,marginBottom:6}}>Ready to Fix All of This?</div><div style={{color:"#64748b",fontSize:13,marginBottom:16,lineHeight:1.7}}>AI rewrites your resume in Jake's format, mirrors JD keywords, adds metrics.</div><button onClick={runOptimize} style={{padding:"13px 36px",fontSize:14,borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#7c3aed,#5b21b6)",color:"#fff",fontWeight:800,fontFamily:"'Inter',sans-serif"}}>✨ Optimize Resume → Jake's Format</button></div>}
      </div>}
      {section==="audit"&&<div><div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:12}}><div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:12}}>🔬 Section-by-Section Audit</div>{(a.sectionAudit||[]).map((s,i)=>(<div key={i} style={{marginBottom:12,background:scoreBg(s.score),borderRadius:10,padding:12,border:`1px solid ${scoreBorder(s.score)}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{display:"flex",alignItems:"center",gap:6}}><span>{statusIcon(s.status)}</span><span style={{fontWeight:700,color:C.text,fontSize:13}}>{s.section}</span></div><span style={{fontWeight:800,fontSize:15,color:scoreColor(s.score)}}>{s.score}%</span></div><div style={{background:"#e2e8f0",borderRadius:4,height:5,overflow:"hidden",marginBottom:6}}><div style={{height:"100%",width:`${s.score}%`,background:scoreColor(s.score),borderRadius:4}}/></div><div style={{color:"#475569",fontSize:12,lineHeight:1.6}}>{s.feedback}</div></div>))}</div>{step!=="optimized"&&<div style={{textAlign:"center",marginTop:8}}><button onClick={runOptimize} style={{padding:"13px 36px",fontSize:14,borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#7c3aed,#5b21b6)",color:"#fff",fontWeight:800,fontFamily:"'Inter',sans-serif"}}>✨ Fix All Issues → Optimize</button></div>}</div>}
      {section==="gaps"&&<div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><span style={{fontSize:16}}>⚠️</span><div style={{fontWeight:700,color:C.text,fontSize:15}}>Missing Keywords</div><span style={{background:"#fef2f2",color:"#dc2626",fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700}}>{a.missingKeywords?.length||0} gaps</span></div>{(a.missingKeywords||[]).length>0?a.missingKeywords.map((m,i)=>(<div key={i} style={{background:"#fef2f2",borderRadius:10,padding:12,marginBottom:10,border:"1px solid #fecaca30"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontWeight:700,color:C.text}}>🔍 {m.keyword}</div><span style={{background:m.importance==="High"?"#fef2f2":m.importance==="Medium"?"#fffbeb":"#f0fdf4",color:m.importance==="High"?"#dc2626":m.importance==="Medium"?"#d97706":"#16a34a",fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700}}>{m.importance}</span></div><div style={{color:"#475569",fontSize:12,lineHeight:1.6}}>💡 {m.tip}</div></div>)):<div style={{textAlign:"center",padding:"24px 0",color:"#16a34a",fontSize:14}}>🎉 No critical missing keywords!</div>}</div>}
      {section==="projects"&&<div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20}}><div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:4}}>🏗️ Project Relevance Audit</div><div style={{color:"#64748b",fontSize:12,marginBottom:12}}>Which projects to keep, remove, or reframe</div>{(a.projectFit||[]).map((p,i)=>(<div key={i} style={{background:p.keep?"#f0fdf4":"#f8fafc",borderRadius:12,padding:14,marginBottom:10,border:`1.5px solid ${p.keep?"#bbf7d0":C.border}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontWeight:700,color:C.text,fontSize:14}}>{p.name}</div><div style={{display:"flex",gap:6}}><span style={{background:scoreBg(p.relevance),color:scoreColor(p.relevance),fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700}}>{p.relevance}% match</span><span style={{background:p.keep?"#f0fdf4":"#f1f5f9",color:p.keep?"#16a34a":"#64748b",fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700}}>{p.keep?"✓ Keep":"Low priority"}</span></div></div><div style={{color:"#475569",fontSize:12,marginBottom:8}}>{p.reason}</div>{p.suggestion&&<div style={{background:`${C.purple}08`,border:`1px solid ${C.purple}20`,borderRadius:8,padding:"8px 12px",color:"#475569",fontSize:12}}>💡 <strong style={{color:C.purple}}>Suggestion:</strong> {p.suggestion}</div>}</div>))}</div>}
      {section==="resume"&&step==="optimized"&&optimized&&<div>
        <div style={{background:"#f8f9fc",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:10}}>
            <div><div style={{fontWeight:700,color:C.text,fontSize:15}}>✨ ATS-Optimized Resume — Jake's Format</div><div style={{color:"#64748b",fontSize:11,marginTop:2}}>Education preserved · JD keywords mirrored · Metrics added</div></div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <button onClick={()=>handleDownload("pdf")} disabled={downloading==="pdf"} style={{padding:"9px 16px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#5b21b6,#7c3aed)",color:"#fff",fontWeight:700,fontFamily:"'Inter',sans-serif",fontSize:12}}>{downloading==="pdf"?"⏳...":"⬇ PDF"}</button>
              <button onClick={()=>handleDownload("docx")} disabled={downloading==="docx"} style={{padding:"9px 16px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#14532d,#16a34a)",color:"#fff",fontWeight:700,fontFamily:"'Inter',sans-serif",fontSize:12}}>{downloading==="docx"?"⏳...":"⬇ DOCX"}</button>
            </div>
          </div>
        </div>
        <JakesResumePreview data={optimized}/>
        <div style={{marginTop:12,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#475569"}}>💡 <strong style={{color:"#16a34a"}}>Pro tip:</strong> Download PDF for Naukri/LinkedIn. Download DOCX to edit in Google Docs.</div>
      </div>}
      <div style={{marginTop:16}}>
        <button onClick={()=>{setStep("input");setAnalysis(null);setOptimized(null);setOptimizedScores(null);setErr("");setSection("overview");setJd("");setResume("");setFileName("");localStorage.removeItem("tp_jd");localStorage.removeItem("tp_resume");localStorage.removeItem("tp_fileName");}} style={{width:"100%",padding:"11px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"transparent",color:"#64748b",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:13}}>🔄 Analyze Another Job</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ══════════════════════════════════════════════════════════════════════════
function LandingPage({ onGetStarted }) {
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>40);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);

  const stats=[{n:"50K+",label:"Jobs Listed"},{n:"35",label:"Companies"},{n:"94%",label:"ATS Pass Rate"},{n:"1400+",label:"Mock Tests"}];
  const features=[
    {icon:"🔥",title:"Live Job Feed",desc:"Real jobs from Indian companies via Adzuna. Filter by role and city.",color:C.orange},
    {icon:"⚡",title:"AI Resume Analyzer",desc:"Deep ATS score + JD match % + section audit. Exactly what's missing.",color:C.blue},
    {icon:"✨",title:"ATS Resume Rewriter",desc:"One click → Jake's format resume with mirrored JD keywords + PDF/DOCX.",color:C.purple},
    {icon:"🧪",title:"Mock Test Engine",desc:"35 companies. 40 tests each. Real patterns. Test cases. Score tracking.",color:C.teal},
    {icon:"🔗",title:"LinkedIn Suite",desc:"Bio, Headline, Cold DM to HR, Skills, Cover Letter — all AI-written.",color:C.pink},
    {icon:"📊",title:"Performance Dashboard",desc:"Track scores across all 40 tests per company. See improvement over time.",color:C.green},
  ];

  return(
    <div style={{background:C.bg,color:C.text,fontFamily:"'Inter',sans-serif",overflowX:"hidden"}}>
      <style>{css}</style>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:scrolled?"rgba(255,255,255,.95)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${C.border}`:"none",transition:"all .3s",padding:"0 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div style={{fontWeight:900,fontSize:22,color:C.blue}}>⚡ TakePlace</div>
          <div style={{display:"flex",gap:10}}>
            <Btn variant="ghost" onClick={onGetStarted} style={{padding:"8px 18px",fontSize:13}}>Sign In</Btn>
            <Btn variant="cta" onClick={onGetStarted} style={{padding:"8px 20px",fontSize:13}}>Get Free Access →</Btn>
          </div>
        </div>
      </nav>

      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 24px 80px",background:"linear-gradient(160deg,#eff6ff 0%,#ffffff 50%,#f0fdf4 100%)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"10%",right:"5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,#dbeafe,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"5%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,#dcfce7,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{textAlign:"center",maxWidth:860,position:"relative",zIndex:1}}>
          <div className="fade" style={{display:"inline-flex",alignItems:"center",gap:8,background:`${C.blue}10`,border:`1px solid ${C.blue}30`,borderRadius:20,padding:"6px 16px",marginBottom:28,fontSize:12,color:C.blue,fontWeight:700}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:C.blue,display:"inline-block",animation:"pulse 1.5s infinite"}}/>
            AI Job Platform · 35 Company Mock Tests · LinkedIn Suite
          </div>
          <div className="fade" style={{fontWeight:900,fontSize:"clamp(36px,6vw,68px)",lineHeight:1.1,marginBottom:24,color:C.text,animationDelay:".1s"}}>
            Get Hired Faster<br/><span style={{color:C.blue}}>With AI on Your Side</span>
          </div>
          <div className="fade" style={{fontSize:16,color:C.soft,lineHeight:1.8,marginBottom:32,maxWidth:600,margin:"0 auto 32px",animationDelay:".2s"}}>
            Resume AI · 35 Company Mock Tests (40 each) · LinkedIn Suite · Live Jobs<br/>
            <strong style={{color:C.text}}>Built specifically for Indian freshers.</strong>
          </div>
          <div className="fade" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",animationDelay:".3s"}}>
            <Btn variant="cta" onClick={onGetStarted} style={{padding:"15px 36px",fontSize:16,borderRadius:12}}>🚀 Start Free — No Credit Card</Btn>
          </div>
          <div className="fade" style={{display:"flex",gap:0,justifyContent:"center",marginTop:64,background:"#ffffff",border:`1.5px solid ${C.border}`,borderRadius:20,overflow:"hidden",maxWidth:500,margin:"64px auto 0",boxShadow:"0 4px 24px rgba(0,0,0,0.06)",animationDelay:".4s"}}>
            {stats.map((s,i)=>(<div key={i} style={{flex:1,padding:"20px 10px",borderRight:i<stats.length-1?`1px solid ${C.border}`:"none",textAlign:"center"}}><div style={{fontWeight:900,fontSize:24,color:C.blue}}>{s.n}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{s.label}</div></div>))}
          </div>
        </div>
      </section>

      <section id="features" style={{padding:"80px 24px",background:"#f8fafc"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}><div style={{fontSize:12,color:C.green,fontWeight:700,letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>Features</div><div style={{fontWeight:800,fontSize:34,color:C.text}}>Everything Indian Freshers Need</div></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18}}>
            {features.map((f,i)=>(<div key={i} className="hover-lift" style={{background:"#ffffff",border:`1.5px solid ${C.border}`,borderRadius:18,padding:22,display:"flex",gap:14,borderLeft:`3px solid ${f.color}`}}><div style={{fontSize:28,flexShrink:0}}>{f.icon}</div><div><div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:5}}>{f.title}</div><div style={{color:C.soft,fontSize:12,lineHeight:1.7}}>{f.desc}</div></div></div>))}
          </div>
        </div>
      </section>

      <section style={{padding:"60px 24px",textAlign:"center",background:"#ffffff"}}>
        <div style={{maxWidth:560,margin:"0 auto",background:"linear-gradient(135deg,#eff6ff,#f0fdf4)",border:`1.5px solid ${C.blue}20`,borderRadius:28,padding:"48px 40px",boxShadow:"0 8px 32px rgba(37,99,235,0.12)"}}>
          <div className="float" style={{fontSize:52,marginBottom:16}}>⚡</div>
          <div style={{fontWeight:900,fontSize:28,color:C.text,marginBottom:10}}>It's Your Time.<br/><span style={{color:C.blue}}>TakePlace.</span></div>
          <div style={{color:C.soft,fontSize:14,marginBottom:28,lineHeight:1.7}}>Resume AI · 35 Company Mock Tests · LinkedIn Suite · Live Jobs</div>
          <Btn variant="cta" onClick={onGetStarted} style={{padding:"14px 44px",fontSize:15,borderRadius:12}}>Start Free Now →</Btn>
        </div>
      </section>

      <section style={{padding:"40px 24px",maxWidth:700,margin:"0 auto",textAlign:"center"}}>
        <div style={{background:"#ffffff",border:`1.5px solid ${C.border}`,borderRadius:20,padding:"28px",boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:32,marginBottom:8}}>💬</div>
          <div style={{fontWeight:800,fontSize:18,color:C.text,marginBottom:6}}>Need Help?</div>
          <div style={{color:C.soft,fontSize:13,marginBottom:14}}>Raghu reads every message personally.</div>
          <a href="mailto:support@takeplace.in" style={{display:"inline-flex",alignItems:"center",gap:8,background:`linear-gradient(135deg,${C.blue},${C.blueLight})`,color:"#fff",fontWeight:700,padding:"9px 22px",borderRadius:10,fontSize:13,textDecoration:"none"}}>📧 support@takeplace.in</a>
        </div>
      </section>

      <footer style={{borderTop:`1px solid ${C.border}`,padding:"20px",textAlign:"center",background:"#ffffff"}}>
        <div style={{color:C.muted,fontSize:12}}>© 2026 TakePlace · Developed by Raghu Dadigela · <a href="mailto:support@takeplace.in" style={{color:C.blue,textDecoration:"none",fontWeight:600}}>support@takeplace.in</a></div>
      </footer>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// AUTH PAGE
// ══════════════════════════════════════════════════════════════════════════
function AuthPage({ onLogin, onBack }) {
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [err,setErr]=useState(""); const [msg,setMsg]=useState(""); const [loading,setLoading]=useState(false); const [googleLoading,setGoogleLoading]=useState(false);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));

  const handleGoogle=async()=>{setGoogleLoading(true);setErr("");const{error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});if(error){setErr(error.message);setGoogleLoading(false);}};
  const handleForgot=async()=>{if(!form.email){setErr("Enter your email first.");return;}setLoading(true);setErr("");setMsg("");const{error}=await supabase.auth.resetPasswordForEmail(form.email,{redirectTo:`${window.location.origin}/reset-password`});setLoading(false);if(error)setErr(error.message);else setMsg("✅ Password reset email sent!");};

  const handle=async()=>{
    setErr("");setMsg("");setLoading(true);
    try{
      if(mode==="register"){if(!form.name||!form.email||!form.password)throw new Error("All fields are required");if(form.password.length<6)throw new Error("Password must be at least 6 characters");const{error}=await supabase.auth.signUp({email:form.email,password:form.password,options:{data:{full_name:form.name}}});if(error)throw error;setMsg("✅ Account created! Check email to confirm.");setMode("login");}
      else{const{data,error}=await supabase.auth.signInWithPassword({email:form.email,password:form.password});if(error)throw error;onLogin(data.user);}
    }catch(e){setErr(e.message||"Something went wrong");}
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#eff6ff 0%,#ffffff 60%,#f0fdf4 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{css}</style>
      <div className="fade" style={{width:"100%",maxWidth:420,background:"#ffffff",border:`1.5px solid ${C.border}`,borderRadius:24,padding:"36px",boxShadow:"0 16px 48px rgba(37,99,235,0.12)"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",marginBottom:24,display:"flex",alignItems:"center",gap:4}}>← Back to home</button>
        <div style={{textAlign:"center",marginBottom:28}}><div style={{fontSize:44,marginBottom:6}}>⚡</div><div style={{fontWeight:900,fontSize:26,color:C.blue}}>TakePlace</div><div style={{color:C.muted,fontSize:13,marginTop:4}}>{mode==="login"?"Welcome back 👋":mode==="register"?"Create account ✨":"Reset password 🔑"}</div></div>
        {mode!=="forgot"&&(<>
          <button onClick={handleGoogle} disabled={googleLoading} style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"#ffffff",color:C.text,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:18,transition:"all .2s"}}>
            {googleLoading?<SpinIcon size={16}/>:(<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>)}
            Continue with Google
          </button>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}><div style={{flex:1,height:1,background:C.border}}/><span style={{color:C.muted,fontSize:12}}>or</span><div style={{flex:1,height:1,background:C.border}}/></div>
          <div style={{display:"flex",background:C.card,borderRadius:10,padding:4,marginBottom:22}}>
            {["login","register"].map(m=>(<button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}} style={{flex:1,padding:"9px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,transition:"all .2s",background:mode===m?"#ffffff":"transparent",color:mode===m?C.blue:C.muted,boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>{m==="login"?"Sign In":"Register"}</button>))}
          </div>
        </>)}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {mode==="register"&&<input style={inp} placeholder="Full name" value={form.name} onChange={e=>set("name",e.target.value)}/>}
          <input style={inp} placeholder="Email address" type="email" value={form.email} onChange={e=>set("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
          {mode!=="forgot"&&<input style={inp} placeholder="Password" type="password" value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>}
        </div>
        {err&&<div style={{color:C.danger,fontSize:12,marginTop:10,background:"#fef2f2",padding:"8px 12px",borderRadius:8,border:"1px solid #fecaca"}}>⚠ {err}</div>}
        {msg&&<div style={{color:C.green,fontSize:12,marginTop:10,background:"#f0fdf4",padding:"8px 12px",borderRadius:8,border:"1px solid #bbf7d0"}}>{msg}</div>}
        {mode==="forgot"?(<><Btn variant="cta" onClick={handleForgot} loading={loading} style={{width:"100%",marginTop:18,padding:"12px"}}>Send Reset Email →</Btn><button onClick={()=>{setMode("login");setErr("");setMsg("");}} style={{width:"100%",marginTop:10,padding:"9px",background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>← Back to Sign In</button></>):
        (<><Btn variant="cta" onClick={handle} loading={loading} style={{width:"100%",marginTop:18,padding:"12px",fontSize:15}}>{mode==="login"?"Sign In →":"Create Account →"}</Btn>{mode==="login"&&<button onClick={()=>{setMode("forgot");setErr("");setMsg("");}} style={{width:"100%",marginTop:10,padding:"7px",background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",textDecoration:"underline"}}>Forgot password?</button>}</>)}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN APP — Sidebar Layout
// ══════════════════════════════════════════════════════════════════════════
function MainApp({ user, onLogout }) {
  const [tab,setTab]=useState(()=>parseInt(sessionStorage.getItem("tp_tab")||"0"));
  const [jobs,setJobs]=useState([]); const [jobsLoading,setJobsLoading]=useState(true); const [jobsError,setJobsError]=useState("");
  const [search,setSearch]=useState(()=>sessionStorage.getItem("tp_search")||"software engineer fresher");
  const [location,setLocation]=useState(()=>sessionStorage.getItem("tp_loc")||"hyderabad");
  const [expandedJob,setExpandedJob]=useState(null);
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const name=user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";

  useEffect(()=>{fetchJobs();},[]);
  const setTabPersist=(t)=>{setTab(t);sessionStorage.setItem("tp_tab",t);};

  const fetchJobs=async(q=search,loc=location)=>{
    setJobsLoading(true);setJobsError("");sessionStorage.setItem("tp_search",q);sessionStorage.setItem("tp_loc",loc);
    try{
      const url=`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&what=${encodeURIComponent(q)}&where=${encodeURIComponent(loc)}&sort_by=date&content-type=application/json`;
      const res=await fetch(url);const data=await res.json();
      if(data.results?.length>0){setJobs(data.results.map(j=>({id:j.id,title:j.title,company:j.company?.display_name||"Company",location:j.location?.display_name||loc,salary:j.salary_min?`₹${Math.round(j.salary_min/100000)}–${Math.round((j.salary_max||j.salary_min*1.5)/100000)} LPA`:"Competitive",description:j.description||"No description.",descriptionShort:(j.description||"").slice(0,220),url:j.redirect_url,posted:new Date(j.created).toLocaleDateString("en-IN",{day:"numeric",month:"short"}),category:j.category?.label||"Technology"})));}
      else setJobsError("No jobs found. Try 'java developer' or 'data analyst'.");
    }catch{setJobsError("Could not load jobs.");}
    setJobsLoading(false);
  };

  const NAV_ITEMS=[
    {icon:"🔥",label:"Jobs",tab:0},
    {icon:"⚡",label:"Resume AI",tab:1},
    {icon:"🧪",label:"Mock Tests",tab:2},
    {icon:"🔗",label:"LinkedIn",tab:3},
  ];

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"'Inter',sans-serif",display:"flex"}}>
      <style>{css}</style>

      {/* Sidebar */}
      <div style={{width:sidebarOpen?220:64,minHeight:"100vh",background:C.sidebar,flexShrink:0,display:"flex",flexDirection:"column",transition:"width .2s",position:"sticky",top:0,height:"100vh",overflowY:"auto"}}>
        {/* Logo */}
        <div style={{padding:"20px 16px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#2563eb,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,color:"#fff",flexShrink:0}}>⚡</div>
            {sidebarOpen&&<div><div style={{fontWeight:900,fontSize:16,color:"#ffffff"}}>TakePlace</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>For Indian Freshers</div></div>}
          </div>
        </div>

        {/* Nav Items */}
        <div style={{padding:"12px 10px",flex:1}}>
          {NAV_ITEMS.map((item)=>(
            <div key={item.tab} className={`sidebar-item ${tab===item.tab?"active":""}`} onClick={()=>setTabPersist(item.tab)}
              style={{display:"flex",alignItems:"center",gap:12,padding:"11px 12px",marginBottom:4,borderRadius:10,cursor:"pointer",transition:"all .15s",background:tab===item.tab?"rgba(37,99,235,0.9)":"transparent"}}>
              <span style={{fontSize:18,flexShrink:0}}>{item.icon}</span>
              {sidebarOpen&&<span style={{fontSize:13,fontWeight:tab===item.tab?700:500,color:tab===item.tab?"#ffffff":"rgba(255,255,255,0.65)",whiteSpace:"nowrap"}}>{item.label}</span>}
            </div>
          ))}
        </div>

        {/* User + Collapse */}
        <div style={{padding:"12px 10px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          {sidebarOpen&&(
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",marginBottom:8,borderRadius:10,background:"rgba(255,255,255,0.06)"}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#2563eb,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:"#fff",flexShrink:0}}>{name[0].toUpperCase()}</div>
              <div style={{overflow:"hidden"}}><div style={{fontSize:12,fontWeight:600,color:"#ffffff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name.split(" ")[0]}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.email?.slice(0,22)}...</div></div>
            </div>
          )}
          <button onClick={()=>setSidebarOpen(s=>!s)} style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"none",background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.6)",cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",justifyContent:sidebarOpen?"space-between":"center",marginBottom:6}}>
            {sidebarOpen&&<span>Collapse</span>}<span style={{fontSize:14}}>{sidebarOpen?"◀":"▶"}</span>
          </button>
          <button onClick={onLogout} style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"none",background:"rgba(220,38,38,0.15)",color:"#fca5a5",cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",justifyContent:sidebarOpen?"flex-start":"center",gap:6}}>
            <span>🚪</span>{sidebarOpen&&<span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{flex:1,overflow:"auto"}}>
        {/* Top Bar */}
        <div style={{background:"#ffffff",borderBottom:`1px solid ${C.border}`,padding:"0 24px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
          <div style={{fontWeight:700,fontSize:16,color:C.text}}>
            {tab===0?"🔥 Live Jobs":tab===1?"⚡ Resume AI":tab===2?"🧪 Mock Tests":"🔗 LinkedIn Suite"}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{background:`${C.green}15`,color:C.green,fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700,border:`1px solid ${C.green}30`}}>● Live</div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{maxWidth:860,margin:"0 auto",padding:"24px 20px 80px"}}>
          {tab===0&&(
            <div>
              <Card style={{marginBottom:18}}>
                <div style={{fontWeight:700,color:C.text,fontSize:14,marginBottom:12}}>🔍 Find Jobs</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <input style={inp} placeholder="Role (react developer...)" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
                  <input style={inp} placeholder="City (hyderabad...)" value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
                </div>
                <Btn variant="cta" onClick={()=>fetchJobs()} style={{width:"100%"}}>🔍 Search Jobs</Btn>
              </Card>

              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontWeight:800,fontSize:17,color:C.text}}>Live Job Feed</div>
                {!jobsLoading&&jobs.length>0&&<div style={{display:"flex",alignItems:"center",gap:5,background:"#f0fdf4",borderRadius:20,padding:"4px 12px",border:"1px solid #bbf7d0"}}><div style={{width:7,height:7,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/><span style={{color:C.green,fontSize:11,fontWeight:700}}>{jobs.length} live jobs</span></div>}
              </div>

              {jobsLoading&&<div style={{textAlign:"center",padding:"60px 20px"}}><SpinIcon size={40} color={C.blue}/><div style={{color:C.muted,fontSize:13,marginTop:12}}>Fetching real jobs...</div></div>}
              {jobsError&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:20,color:C.danger,textAlign:"center",fontSize:13}}>{jobsError}</div>}

              {!jobsLoading&&jobs.map((job,i)=>{
                const isExp=expandedJob===job.id;
                return(
                  <div key={job.id} className="fade hover-lift" style={{background:"#ffffff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:"15px 16px",marginBottom:10,borderLeft:`3px solid ${C.blue}`,animationDelay:`${i*0.04}s`,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <div><div style={{fontWeight:700,fontSize:14,color:C.text}}>{job.title}</div><div style={{color:C.soft,fontSize:12,marginTop:1}}>{job.company} · {job.location}</div></div>
                      <div style={{textAlign:"right",flexShrink:0}}><div style={{color:C.green,fontWeight:800,fontSize:13}}>{job.salary}</div><div style={{color:C.muted,fontSize:10,marginTop:1}}>{job.posted}</div></div>
                    </div>
                    <div style={{color:C.muted,fontSize:12,lineHeight:1.7,marginBottom:10,background:C.card,borderRadius:8,padding:"8px 10px"}}>
                      {isExp?job.description:job.descriptionShort+(job.description.length>220?"...":"")}
                      {job.description.length>220&&<button onClick={()=>setExpandedJob(isExp?null:job.id)} style={{background:"none",border:"none",color:C.blue,fontSize:11,cursor:"pointer",marginLeft:5,fontFamily:"'Inter',sans-serif",fontWeight:600}}>{isExp?"Show less ▲":"Read more ▼"}</button>}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <Tag color={C.blue}>{job.category}</Tag>
                      <div style={{display:"flex",gap:8}}>
                        <Btn variant="ghost" onClick={()=>setTabPersist(1)} style={{fontSize:11,padding:"6px 10px"}}>⚡ Analyze</Btn>
                        <Btn variant="cta" onClick={()=>window.open(job.url,"_blank")} style={{fontSize:11,padding:"7px 16px"}}>Apply →</Btn>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {tab===1&&<ResumeAnalyzer user={user}/>}
          {tab===2&&<MockTestEngine user={user}/>}
          {tab===3&&<LinkedInSuite user={user}/>}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user,setUser]=useState(null); const [appLoading,setAppLoading]=useState(true); const [page,setPage]=useState("landing");

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{if(session?.user){setUser(session.user);setPage("app");}setAppLoading(false);});
    supabase.auth.onAuthStateChange((_,session)=>{if(session?.user){setUser(session.user);setPage("app");}else{setUser(null);setPage("landing");}});
  },[]);

  const handleLogin=(u)=>{setUser(u);setPage("app");};
  const handleLogout=async()=>{await supabase.auth.signOut();setUser(null);setPage("landing");};

  if(appLoading)return(<div style={{minHeight:"100vh",background:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}><style>{css}</style><SpinIcon size={44} color={C.blue}/><div style={{color:C.muted,fontSize:14,fontFamily:"'Inter',sans-serif"}}>Loading TakePlace...</div></div>);
  if(page==="landing")return <LandingPage onGetStarted={()=>setPage("auth")}/>;
  if(page==="auth")return <AuthPage onLogin={handleLogin} onBack={()=>setPage("landing")}/>;
  return <MainApp user={user} onLogout={handleLogout}/>;
}
