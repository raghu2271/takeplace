

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID  = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const GROQ_KEY   = "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";
const supabase   = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── TOKENS ─────────────────────────────────────────────────────────────────
const C = {
  bg:"#ffffff", bg2:"#f8fafc", bg3:"#f1f5f9",
  blue:"#2563eb", blueL:"#3b82f6", blueD:"#1d4ed8", bluePale:"#eff6ff",
  green:"#16a34a", greenD:"#14532d", greenPale:"#f0fdf4",
  purple:"#7c3aed", purpleD:"#5b21b6", purplePale:"#f5f3ff",
  red:"#dc2626", redPale:"#fef2f2",
  yellow:"#d97706", yellowPale:"#fffbeb",
  text:"#0f172a", muted:"#64748b", soft:"#94a3b8", border:"#e2e8f0",
  gold:"#f59e0b",
};

// ── GLOBAL CSS ──────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',sans-serif;color:#0f172a;background:#fff;-webkit-font-smoothing:antialiased;}
  ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes gradMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  .fade{animation:fadeUp .45s ease forwards;}
  .fadeIn{animation:fadeIn .3s ease forwards;}
  .float{animation:float 3.5s ease-in-out infinite;}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  .lift{transition:all .2s;cursor:pointer;}
  .lift:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.10);}
  input:focus,textarea:focus{outline:none;border-color:#2563eb!important;box-shadow:0 0 0 3px #2563eb15!important;}
  button:active{transform:scale(.97);}
  a{text-decoration:none;color:inherit;}
`;

// ── HELPERS ─────────────────────────────────────────────────────────────────
const inp = {
  width:"100%", background:"#fff", border:`1.5px solid ${C.border}`,
  borderRadius:10, padding:"11px 14px", color:C.text, fontSize:14,
  fontFamily:"'Inter',sans-serif", outline:"none", transition:"all .2s",
};

const Spin = ({size=18,color=C.blue}) => (
  <span className="spin" style={{width:size,height:size,border:`2.5px solid ${color}25`,borderTopColor:color,borderRadius:"50%",display:"inline-block",flexShrink:0}}/>
);

function Btn({children,onClick,v="primary",style={},disabled=false,loading=false}){
  const vs={
    primary:{background:`linear-gradient(135deg,${C.blue},${C.blueL})`,color:"#fff",fontWeight:700,boxShadow:`0 2px 12px ${C.blue}40`},
    ghost:{background:"transparent",color:C.muted,border:`1.5px solid ${C.border}`},
    green:{background:`linear-gradient(135deg,${C.greenD},${C.green})`,color:"#fff",fontWeight:700,boxShadow:`0 2px 12px ${C.green}40`},
    purple:{background:`linear-gradient(135deg,${C.purpleD},${C.purple})`,color:"#fff",fontWeight:700},
    gold:{background:"linear-gradient(135deg,#b45309,#d97706,#f59e0b)",color:"#fff",fontWeight:800,boxShadow:"0 4px 20px #d9770640"},
    cta:{background:`linear-gradient(135deg,${C.blueD},${C.blue},${C.blueL})`,backgroundSize:"200%",color:"#fff",fontWeight:800,fontSize:15,boxShadow:`0 4px 24px ${C.blue}50`},
    danger:{background:"linear-gradient(135deg,#991b1b,#dc2626)",color:"#fff",fontWeight:700},
  };
  return (
    <button onClick={disabled||loading?undefined:onClick} disabled={disabled||loading}
      style={{padding:"11px 22px",borderRadius:10,border:"none",cursor:disabled||loading?"not-allowed":"pointer",
        fontFamily:"'Inter',sans-serif",fontSize:14,transition:"all .2s",opacity:disabled?0.5:1,
        display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,...vs[v],...style}}>
      {loading?<><Spin size={14} color={v==="ghost"?C.blue:"#fff"}/> Loading...</>:children}
    </button>
  );
}

const Tag = ({children,color=C.blue,bg}) => (
  <span style={{background:bg||`${color}12`,color,fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700,border:`1px solid ${color}25`,whiteSpace:"nowrap"}}>{children}</span>
);

function ScoreRing({score,size=88,color,label}){
  const r=34,circ=2*Math.PI*r;
  const pct=Math.max(0,Math.min(100,score||0));
  const col=color||(pct>=75?C.green:pct>=50?C.yellow:C.red);
  return(
    <div style={{textAlign:"center"}}>
      <svg width={size} height={size} viewBox="0 0 76 76">
        <circle cx="38" cy="38" r={r} fill="none" stroke={C.border} strokeWidth="5"/>
        <circle cx="38" cy="38" r={r} fill="none" stroke={col} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
          strokeLinecap="round" transform="rotate(-90 38 38)"
          style={{transition:"stroke-dashoffset 1.4s ease"}}/>
        <text x="38" y="42" textAnchor="middle" fill={col} fontSize="15" fontWeight="800" fontFamily="Inter">{pct}%</text>
      </svg>
      {label&&<div style={{color:C.muted,fontSize:11,fontWeight:600,marginTop:4}}>{label}</div>}
    </div>
  );
}

function Bar({score,color}){
  return(
    <div style={{background:C.border,borderRadius:4,height:5,overflow:"hidden",marginTop:4}}>
      <div style={{height:"100%",width:`${score}%`,background:color||C.blue,borderRadius:4,transition:"width 1.2s ease"}}/>
    </div>
  );
}

// ── GROQ AI ─────────────────────────────────────────────────────────────────
async function callGroq(prompt,maxTokens=2000,systemMsg=""){
  const sys = systemMsg||"You are an expert ATS analyst and resume reviewer. Respond with valid JSON only. No markdown, no explanation.";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Bearer ${GROQ_KEY}`},
    body:JSON.stringify({model:"llama-3.3-70b-versatile",max_tokens:maxTokens,temperature:0.15,
      messages:[{role:"system",content:sys},{role:"user",content:prompt}]})
  });
  if(!res.ok) throw new Error("Groq error "+res.status);
  const d = await res.json();
  return d.choices?.[0]?.message?.content||"";
}

async function callGroqText(prompt,maxTokens=2000){
  return callGroq(prompt,maxTokens,"You are an expert resume writer. Write clear, professional, ATS-optimized content. Return plain text only.");
}

function safeJSON(raw,fallback={}){
  if(!raw) return fallback;
  try{ return JSON.parse(raw.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim()); }
  catch{
    try{ const m=raw.match(/\{[\s\S]*\}/); if(m) return JSON.parse(m[0]); }catch{}
    return fallback;
  }
}

// ── PDF EXTRACTION ──────────────────────────────────────────────────────────
async function extractPDF(file){
  if(!window.pdfjsLib){
    await new Promise((res,rej)=>{
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload=res;s.onerror=rej;document.head.appendChild(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const ab=await file.arrayBuffer();
  const pdf=await window.pdfjsLib.getDocument({data:ab}).promise;
  let text="";
  for(let i=1;i<=Math.min(pdf.numPages,5);i++){
    const page=await pdf.getPage(i);
    const c=await page.getTextContent();
    text+=c.items.map(x=>x.str).join(" ")+"\n";
  }
  return text.trim();
}

async function extractDOCX(file){
  if(!window.mammoth){
    await new Promise((res,rej)=>{
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
      s.onload=res;s.onerror=rej;document.head.appendChild(s);
    });
  }
  const ab=await file.arrayBuffer();
  const r=await window.mammoth.extractRawText({arrayBuffer:ab});
  return r.value.trim();
}

// ── JAKE'S RESUME PDF DOWNLOAD ───────────────────────────────────────────────
async function downloadJakesPDF(parsed, filename="TakePlace_Resume.pdf"){
  if(!window.jspdf){
    await new Promise((res,rej)=>{
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload=res;s.onerror=rej;document.head.appendChild(s);
    });
  }
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=210, marginL=15, marginR=15, usable=W-marginL-marginR;
  let y=18;

  // Name
  doc.setFont("helvetica","bold");
  doc.setFontSize(18);
  doc.setTextColor(15,23,42);
  doc.text(parsed.name||"Your Name", W/2, y, {align:"center"});
  y+=7;

  // Contact line
  doc.setFont("helvetica","normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100,116,139);
  const contact=[parsed.phone,parsed.email,parsed.linkedin,parsed.github,parsed.location].filter(Boolean).join(" | ");
  doc.text(contact, W/2, y, {align:"center"});
  y+=4;

  // Divider
  doc.setDrawColor(37,99,235);
  doc.setLineWidth(0.5);
  doc.line(marginL, y, W-marginR, y);
  y+=5;

  const sectionHeader=(title)=>{
    if(y>270){doc.addPage();y=18;}
    doc.setFont("helvetica","bold");
    doc.setFontSize(10);
    doc.setTextColor(15,23,42);
    doc.text(title.toUpperCase(), marginL, y);
    y+=1.5;
    doc.setDrawColor(200,210,220);
    doc.setLineWidth(0.3);
    doc.line(marginL, y, W-marginR, y);
    y+=4;
  };

  const bodyText=(text,bold=false,size=9)=>{
    if(y>272){doc.addPage();y=18;}
    doc.setFont("helvetica",bold?"bold":"normal");
    doc.setFontSize(size);
    doc.setTextColor(bold?15:71, bold?23:85, bold?42:99);
    const lines=doc.splitTextToSize(text,usable);
    lines.forEach(l=>{
      if(y>272){doc.addPage();y=18;}
      doc.text(l,marginL,y);
      y+=4.2;
    });
  };

  const bulletLine=(text)=>{
    if(y>272){doc.addPage();y=18;}
    doc.setFont("helvetica","normal");
    doc.setFontSize(8.8);
    doc.setTextColor(71,85,99);
    const lines=doc.splitTextToSize("• "+text,usable-4);
    lines.forEach((l,i)=>{
      if(y>272){doc.addPage();y=18;}
      doc.text(l,marginL+(i>0?4:0),y);
      y+=4;
    });
  };

  const rowLine=(left,right,leftBold=false)=>{
    if(y>272){doc.addPage();y=18;}
    doc.setFont("helvetica",leftBold?"bold":"normal");
    doc.setFontSize(9);
    doc.setTextColor(15,23,42);
    doc.text(left,marginL,y);
    doc.setFont("helvetica","normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100,116,139);
    doc.text(right,W-marginR,y,{align:"right"});
    y+=4.5;
  };

  // EDUCATION
  if(parsed.education?.length){
    sectionHeader("Education");
    parsed.education.forEach(e=>{
      rowLine(e.institution||"",e.years||"",true);
      if(e.degree) bodyText(e.degree+" "+(e.gpa||""),false,8.8);
      y+=1;
    });
  }

  // EXPERIENCE
  if(parsed.experience?.length){
    sectionHeader("Experience");
    parsed.experience.forEach(exp=>{
      rowLine(exp.title||"",exp.dates||"",true);
      if(exp.company) bodyText(exp.company+" — "+exp.location,false,8.5);
      exp.bullets?.forEach(b=>bulletLine(b));
      y+=2;
    });
  }

  // PROJECTS
  if(parsed.projects?.length){
    sectionHeader("Projects");
    parsed.projects.forEach(p=>{
      rowLine((p.name||"")+(p.tech?" | "+p.tech:""),p.year||"",true);
      p.bullets?.forEach(b=>bulletLine(b));
      y+=2;
    });
  }

  // SKILLS
  if(parsed.skills){
    sectionHeader("Technical Skills");
    Object.entries(parsed.skills).forEach(([cat,val])=>{
      if(y>272){doc.addPage();y=18;}
      doc.setFont("helvetica","bold");
      doc.setFontSize(8.8);
      doc.setTextColor(15,23,42);
      doc.text(cat+": ",marginL,y);
      doc.setFont("helvetica","normal");
      doc.setTextColor(71,85,99);
      const lw=doc.getTextWidth(cat+": ");
      const lines=doc.splitTextToSize(val,usable-lw);
      doc.text(lines[0],marginL+lw,y);
      if(lines.length>1) lines.slice(1).forEach(l=>{y+=4;doc.text(l,marginL,y);});
      y+=4.5;
    });
  }

  // CERTIFICATIONS
  if(parsed.certifications?.length){
    sectionHeader("Certifications & Achievements");
    parsed.certifications.forEach(c=>bulletLine(c));
  }

  doc.save(filename);
}

async function downloadJakesDOCX(parsed, filename="TakePlace_Resume.docx"){
  if(!window.docx){
    await new Promise((res,rej)=>{
      const s=document.createElement("script");
      s.src="https://unpkg.com/docx@8.2.2/build/index.umd.js";
      s.onload=res;s.onerror=rej;document.head.appendChild(s);
    });
  }
  const {Document,Packer,Paragraph,TextRun,AlignmentType,BorderStyle,TabStopType,TabStopPosition}=window.docx;

  const children=[];

  const HR=()=>new Paragraph({
    border:{bottom:{style:BorderStyle.SINGLE,size:4,color:"2563EB",space:1}},
    spacing:{after:60},children:[]
  });

  const SH=(title)=>[
    new Paragraph({
      spacing:{before:120,after:20},
      children:[new TextRun({text:title.toUpperCase(),bold:true,size:20,font:"Calibri",color:"0F172A"})]
    }),
    HR()
  ];

  // Name
  children.push(new Paragraph({
    alignment:AlignmentType.CENTER,
    spacing:{after:40},
    children:[new TextRun({text:parsed.name||"Your Name",bold:true,size:30,font:"Calibri",color:"0F172A"})]
  }));

  // Contact
  const contact=[parsed.phone,parsed.email,parsed.linkedin,parsed.github,parsed.location].filter(Boolean).join(" | ");
  children.push(new Paragraph({
    alignment:AlignmentType.CENTER,
    spacing:{after:80},
    children:[new TextRun({text:contact,size:16,font:"Calibri",color:"64748B"})]
  }));

  // Education
  if(parsed.education?.length){
    SH("Education").forEach(p=>children.push(p));
    parsed.education.forEach(e=>{
      children.push(new Paragraph({
        tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}],
        spacing:{after:20},
        children:[
          new TextRun({text:e.institution||"",bold:true,size:18,font:"Calibri"}),
          new TextRun({text:"\t"+(e.years||""),size:16,font:"Calibri",color:"64748B"})
        ]
      }));
      if(e.degree) children.push(new Paragraph({spacing:{after:60},children:[new TextRun({text:e.degree+" "+(e.gpa||""),size:16,font:"Calibri",color:"475569"})]}));
    });
  }

  // Experience
  if(parsed.experience?.length){
    SH("Experience").forEach(p=>children.push(p));
    parsed.experience.forEach(exp=>{
      children.push(new Paragraph({
        tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}],
        spacing:{after:20},
        children:[
          new TextRun({text:exp.title||"",bold:true,size:18,font:"Calibri"}),
          new TextRun({text:"\t"+(exp.dates||""),size:16,font:"Calibri",color:"64748B"})
        ]
      }));
      if(exp.company) children.push(new Paragraph({spacing:{after:20},children:[new TextRun({text:exp.company+(exp.location?" — "+exp.location:""),size:16,font:"Calibri",italics:true,color:"475569"})]}));
      exp.bullets?.forEach(b=>children.push(new Paragraph({
        bullet:{level:0},
        spacing:{after:20},
        children:[new TextRun({text:b,size:17,font:"Calibri",color:"1E293B"})]
      })));
      children.push(new Paragraph({spacing:{after:60},children:[]}));
    });
  }

  // Projects
  if(parsed.projects?.length){
    SH("Projects").forEach(p=>children.push(p));
    parsed.projects.forEach(p=>{
      children.push(new Paragraph({
        tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}],
        spacing:{after:20},
        children:[
          new TextRun({text:(p.name||"")+(p.tech?" | "+p.tech:""),bold:true,size:18,font:"Calibri"}),
          new TextRun({text:"\t"+(p.year||""),size:16,font:"Calibri",color:"64748B"})
        ]
      }));
      p.bullets?.forEach(b=>children.push(new Paragraph({
        bullet:{level:0},
        spacing:{after:20},
        children:[new TextRun({text:b,size:17,font:"Calibri",color:"1E293B"})]
      })));
      children.push(new Paragraph({spacing:{after:60},children:[]}));
    });
  }

  // Skills
  if(parsed.skills){
    SH("Technical Skills").forEach(p=>children.push(p));
    Object.entries(parsed.skills).forEach(([cat,val])=>{
      children.push(new Paragraph({
        spacing:{after:30},
        children:[
          new TextRun({text:cat+": ",bold:true,size:17,font:"Calibri"}),
          new TextRun({text:val,size:17,font:"Calibri",color:"475569"})
        ]
      }));
    });
  }

  // Certifications
  if(parsed.certifications?.length){
    SH("Certifications & Achievements").forEach(p=>children.push(p));
    parsed.certifications.forEach(c=>children.push(new Paragraph({
      bullet:{level:0},
      spacing:{after:20},
      children:[new TextRun({text:c,size:17,font:"Calibri",color:"1E293B"})]
    })));
  }

  const doc=new Document({
    sections:[{
      properties:{page:{size:{width:12240,height:15840},margin:{top:720,right:900,bottom:720,left:900}}},
      children
    }]
  });
  const blob=await Packer.toBlob(doc);
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=filename;
  a.click();
}

// ═══════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════
function LandingPage({onStart}){
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",h);
    return()=>window.removeEventListener("scroll",h);
  },[]);

  const stats=[
    {n:"50K+",l:"Active Users"},{n:"94%",l:"ATS Pass Rate"},{n:"3.2×",l:"More Interviews"},{n:"Free",l:"To Get Started"},
  ];
  const features=[
    {icon:"⚡",title:"Live Job Feed",desc:"Real jobs from top Indian companies updated daily. Filter by role, city, salary in seconds."},
    {icon:"🧠",title:"Deep ATS Analysis",desc:"Section-by-section resume audit. Keyword gap finder. ATS score + JD match % + shortlist rate."},
    {icon:"🎯",title:"Project Relevance AI",desc:"AI judges every project you have against the JD. Keep, remove, or reframe — with reasons."},
    {icon:"✨",title:"Jake's Resume Rewriter",desc:"One click converts your resume into a clean Jake's template with action verbs and JD keywords."},
    {icon:"📥",title:"Download PDF & DOCX",desc:"Download your optimized resume as a real formatted PDF or Word doc — not plain text."},
    {icon:"🏢",title:"Company Mock Tests",desc:"30+ company-specific aptitude and coding mock tests. TCS, Infosys, Amazon, Google and more."},
  ];
  const plans=[
    {name:"Free",price:"₹0",period:"/month",color:C.blue,features:["5 resume analyses/month","Live job feed","Basic ATS score","3 company mock tests"],cta:"Get Started Free",v:"primary"},
    {name:"Pro",price:"₹299",period:"/month",color:C.purple,popular:true,features:["Unlimited resume analyses","Deep section-by-section audit","Jake's resume rewriter","PDF & DOCX download","All 30+ company tests","Priority AI processing"],cta:"Start Pro — ₹299/mo",v:"purple"},
    {name:"Premium",price:"₹599",period:"/month",color:C.gold,features:["Everything in Pro","1-on-1 resume review","Mock interview prep","LinkedIn optimization","Dedicated support","Career roadmap"],cta:"Go Premium",v:"gold"},
  ];
  const reviews=[
    {name:"Priya M.",role:"SDE at Wipro",text:"Score jumped from 42% to 91% after optimization. Got 4 interview calls in 2 weeks.",avatar:"PM",stars:5},
    {name:"Arun K.",role:"Data Analyst at TCS",text:"The section-by-section audit showed exactly why I was getting rejected. Life changing.",avatar:"AK",stars:5},
    {name:"Sneha R.",role:"Full Stack Dev at Infosys",text:"Jake's resume template is chef's kiss. Recruiter called within 3 days of submitting.",avatar:"SR",stars:5},
  ];

  return(
    <div style={{background:"#fff",color:C.text,fontFamily:"'Inter',sans-serif",overflowX:"hidden"}}>
      <style>{CSS}</style>

      {/* NAVBAR */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,
        background:scrolled?"rgba(255,255,255,.96)":"transparent",
        backdropFilter:scrolled?"blur(20px)":"none",
        borderBottom:scrolled?`1px solid ${C.border}`:"none",
        transition:"all .3s",padding:"0 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div style={{fontWeight:900,fontSize:22,color:C.blue,display:"flex",alignItems:"center",gap:6}}>
            ⚡ <span>TakePlace</span>
          </div>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            <a href="#features" style={{color:C.muted,fontSize:14,fontWeight:500}}>Features</a>
            <a href="#pricing" style={{color:C.muted,fontSize:14,fontWeight:500}}>Pricing</a>
            <Btn v="ghost" onClick={onStart} style={{padding:"8px 18px",fontSize:13}}>Sign In</Btn>
            <Btn v="cta" onClick={onStart} style={{padding:"8px 20px",fontSize:13}}>Start Free →</Btn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
        padding:"120px 24px 80px",position:"relative",overflow:"hidden",
        background:"linear-gradient(160deg,#eff6ff 0%,#fff 45%,#f0fdf4 100%)"}}>
        <div style={{position:"absolute",top:"8%",right:"4%",width:420,height:420,borderRadius:"50%",
          background:"radial-gradient(circle,#dbeafe80,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"8%",left:"4%",width:320,height:320,borderRadius:"50%",
          background:"radial-gradient(circle,#dcfce780,transparent 70%)",pointerEvents:"none"}}/>

        <div style={{textAlign:"center",maxWidth:840,position:"relative",zIndex:1}}>
          <div className="fade" style={{display:"inline-flex",alignItems:"center",gap:8,
            background:`${C.blue}10`,border:`1px solid ${C.blue}30`,borderRadius:20,
            padding:"6px 16px",marginBottom:28,fontSize:12,color:C.blue,fontWeight:700}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:C.blue,display:"inline-block",animation:"pulse 1.5s infinite"}}/>
            India's #1 AI Job Platform for Freshers
          </div>

          <h1 className="fade" style={{fontWeight:900,fontSize:"clamp(38px,6.5vw,72px)",lineHeight:1.08,
            marginBottom:24,color:C.text,animationDelay:".1s"}}>
            Land Your Dream Job<br/>
            <span style={{background:`linear-gradient(135deg,${C.blue},${C.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              10× Faster with AI
            </span>
          </h1>

          <p className="fade" style={{fontSize:18,color:C.muted,lineHeight:1.8,marginBottom:44,
            maxWidth:600,margin:"0 auto 44px",animationDelay:".2s"}}>
            Deep ATS analysis · Jake's resume rewriter · Live job feed · 30+ company mock tests.<br/>
            <strong style={{color:C.text}}>Built by a fresher who felt the pain. Zero fluff.</strong>
          </p>

          <div className="fade" style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",animationDelay:".3s"}}>
            <Btn v="cta" onClick={onStart} style={{padding:"15px 40px",fontSize:16,borderRadius:12}}>
              🚀 Start Free — No Credit Card
            </Btn>
            <Btn v="ghost" onClick={()=>document.getElementById("features")?.scrollIntoView({behavior:"smooth"})}
              style={{padding:"15px 28px",fontSize:16,borderRadius:12}}>
              See Features ↓
            </Btn>
          </div>

          {/* Stats bar */}
          <div className="fade" style={{display:"flex",justifyContent:"center",marginTop:64,
            background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:20,overflow:"hidden",
            maxWidth:560,margin:"64px auto 0",boxShadow:"0 4px 28px rgba(0,0,0,.07)",animationDelay:".4s"}}>
            {stats.map((s,i)=>(
              <div key={i} style={{flex:1,padding:"22px 10px",borderRight:i<stats.length-1?`1px solid ${C.border}`:"none",textAlign:"center"}}>
                <div style={{fontWeight:900,fontSize:26,color:C.blue}}>{s.n}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:2,fontWeight:600}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:"90px 24px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:60}}>
          <div style={{fontSize:11,color:C.blue,fontWeight:800,letterSpacing:3,marginBottom:12,textTransform:"uppercase"}}>How It Works</div>
          <h2 style={{fontWeight:900,fontSize:40,color:C.text}}>Three Steps to More Interviews</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
          {[
            {n:"01",icon:"📋",t:"Paste JD + Upload Resume",d:"Drop the job description and upload your resume (PDF, DOCX). Takes 30 seconds."},
            {n:"02",icon:"🧠",t:"AI Audits Every Section",d:"Groq AI reads each section, scores ATS readiness, finds every keyword gap and weak area."},
            {n:"03",icon:"✨",t:"Download Jake's Resume",d:"Get a fully rewritten Jake-format resume. Download as PDF or DOCX and apply with confidence."},
          ].map((s,i)=>(
            <div key={i} className="lift" style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:20,padding:36,position:"relative",overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}>
              <div style={{position:"absolute",top:16,right:20,fontWeight:900,fontSize:44,color:`${C.blue}08`,fontFamily:"monospace"}}>{s.n}</div>
              <div style={{fontSize:42,marginBottom:18}}>{s.icon}</div>
              <div style={{fontWeight:800,fontSize:18,color:C.text,marginBottom:10}}>{s.t}</div>
              <div style={{color:C.muted,fontSize:14,lineHeight:1.75}}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{padding:"90px 24px",background:"#f8fafc"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <div style={{fontSize:11,color:C.green,fontWeight:800,letterSpacing:3,marginBottom:12,textTransform:"uppercase"}}>Features</div>
            <h2 style={{fontWeight:900,fontSize:40,color:C.text}}>Everything You Need to Get Hired</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
            {features.map((f,i)=>(
              <div key={i} className="lift" style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:18,padding:28,display:"flex",gap:18,boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
                <div style={{fontSize:34,flexShrink:0}}>{f.icon}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:8}}>{f.title}</div>
                  <div style={{color:C.muted,fontSize:13,lineHeight:1.75}}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{padding:"90px 24px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:60}}>
          <div style={{fontSize:11,color:C.purple,fontWeight:800,letterSpacing:3,marginBottom:12,textTransform:"uppercase"}}>Pricing</div>
          <h2 style={{fontWeight:900,fontSize:40,color:C.text}}>Simple. Transparent. Affordable.</h2>
          <p style={{color:C.muted,fontSize:16,marginTop:12}}>Start free. Upgrade when you're ready.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24,alignItems:"start"}}>
          {plans.map((p,i)=>(
            <div key={i} style={{background:"#fff",border:`2px solid ${p.popular?p.color:C.border}`,borderRadius:24,padding:32,position:"relative",boxShadow:p.popular?`0 12px 40px ${p.color}25`:"0 2px 8px rgba(0,0,0,.05)"}}>
              {p.popular&&<div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${C.purpleD},${C.purple})`,color:"#fff",fontSize:11,fontWeight:800,padding:"5px 18px",borderRadius:20}}>⭐ MOST POPULAR</div>}
              <div style={{fontSize:13,fontWeight:800,color:p.color,marginBottom:8,letterSpacing:1}}>{p.name.toUpperCase()}</div>
              <div style={{fontWeight:900,fontSize:40,color:C.text}}>{p.price}<span style={{fontSize:14,fontWeight:400,color:C.muted}}>{p.period}</span></div>
              <div style={{height:1,background:C.border,margin:"20px 0"}}/>
              {p.features.map((f,j)=>(
                <div key={j} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:14}}>
                  <span style={{color:p.color,fontWeight:800,fontSize:14,flexShrink:0}}>✓</span>
                  <span style={{color:C.soft,fontSize:14}}>{f}</span>
                </div>
              ))}
              <Btn v={p.v} onClick={onStart} style={{width:"100%",padding:"13px",marginTop:12,borderRadius:12,fontSize:14}}>
                {p.cta}
              </Btn>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{padding:"90px 24px",background:"#f8fafc"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <div style={{fontSize:11,color:C.gold,fontWeight:800,letterSpacing:3,marginBottom:12,textTransform:"uppercase"}}>Success Stories</div>
            <h2 style={{fontWeight:900,fontSize:40,color:C.text}}>They Got Hired. You're Next.</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
            {reviews.map((r,i)=>(
              <div key={i} className="lift" style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:20,padding:28,boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}>
                <div style={{color:C.gold,fontSize:16,marginBottom:12}}>{"★".repeat(r.stars)}</div>
                <div style={{color:C.soft,fontSize:14,lineHeight:1.8,marginBottom:20}}>{r.text}</div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.blueL})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#fff"}}>{r.avatar}</div>
                  <div>
                    <div style={{fontWeight:700,color:C.text,fontSize:14}}>{r.name}</div>
                    <div style={{color:C.muted,fontSize:12}}>{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"90px 24px",textAlign:"center"}}>
        <div style={{maxWidth:600,margin:"0 auto",background:`linear-gradient(135deg,${C.blueD},${C.blue})`,borderRadius:28,padding:"60px 40px",boxShadow:`0 20px 60px ${C.blue}35`}}>
          <div className="float" style={{fontSize:56,marginBottom:16}}>⚡</div>
          <h2 style={{fontWeight:900,fontSize:34,color:"#fff",marginBottom:12}}>It's Your Time. TakePlace.</h2>
          <p style={{color:"#bfdbfe",fontSize:16,marginBottom:36,lineHeight:1.7}}>Join 50,000+ freshers who landed interviews faster with AI-powered resume optimization.</p>
          <Btn v="ghost" onClick={onStart} style={{padding:"16px 48px",fontSize:16,borderRadius:12,background:"#fff",color:C.blue,fontWeight:800,border:"none"}}>
            Start Free Now →
          </Btn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:`1px solid ${C.border}`,padding:"28px 24px",textAlign:"center",background:"#fff"}}>
        <div style={{color:C.muted,fontSize:12}}>
          © 2026 TakePlace · Built by Raghu Dadigela ·{" "}
          <a href="mailto:support@takeplace.in" style={{color:C.blue,fontWeight:600}}>support@takeplace.in</a>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTH PAGE
// ═══════════════════════════════════════════════════════════════════════════
function AuthPage({onLogin,onBack}){
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [err,setErr]=useState("");
  const [msg,setMsg]=useState("");
  const [loading,setLoading]=useState(false);
  const [gLoading,setGLoading]=useState(false);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));

  const handleGoogle=async()=>{
    setGLoading(true);setErr("");
    const{error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});
    if(error){setErr(error.message);setGLoading(false);}
  };

  const handle=async()=>{
    setErr("");setMsg("");setLoading(true);
    try{
      if(mode==="register"){
        if(!form.name||!form.email||!form.password) throw new Error("All fields required");
        if(form.password.length<6) throw new Error("Password must be 6+ characters");
        const{error}=await supabase.auth.signUp({email:form.email,password:form.password,options:{data:{full_name:form.name}}});
        if(error) throw error;
        setMsg("✅ Account created! Check email to verify, then sign in.");
        setMode("login");
      }else{
        const{data,error}=await supabase.auth.signInWithPassword({email:form.email,password:form.password});
        if(error) throw error;
        onLogin(data.user);
      }
    }catch(e){setErr(e.message||"Something went wrong");}
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#eff6ff 0%,#fff 60%,#f0fdf4 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{CSS}</style>
      <div className="fade" style={{width:"100%",maxWidth:420,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:24,padding:"36px",boxShadow:"0 20px 60px rgba(37,99,235,.12)"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginBottom:24,fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:4}}>← Back to home</button>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:42,marginBottom:8}}>⚡</div>
          <div style={{fontWeight:900,fontSize:26,color:C.blue}}>TakePlace</div>
          <div style={{color:C.muted,fontSize:13,marginTop:4}}>{mode==="login"?"Welcome back 👋":"Create your account ✨"}</div>
        </div>
        <button onClick={handleGoogle} disabled={gLoading} style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",color:C.text,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:18,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
          {gLoading?<Spin size={16}/>:<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
          Continue with Google
        </button>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <div style={{flex:1,height:1,background:C.border}}/><span style={{color:C.muted,fontSize:12}}>or</span><div style={{flex:1,height:1,background:C.border}}/>
        </div>
        <div style={{display:"flex",background:C.bg2,borderRadius:10,padding:4,marginBottom:20}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}}
              style={{flex:1,padding:"9px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,transition:"all .2s",background:mode===m?"#fff":"transparent",color:mode===m?C.blue:C.muted,boxShadow:mode===m?"0 1px 4px rgba(0,0,0,.08)":"none"}}>
              {m==="login"?"Sign In":"Register"}
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {mode==="register"&&<input style={inp} placeholder="Full name" value={form.name} onChange={e=>set("name",e.target.value)}/>}
          <input style={inp} placeholder="Email address" type="email" value={form.email} onChange={e=>set("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
          <input style={inp} placeholder="Password" type="password" value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        </div>
        {err&&<div style={{color:C.red,fontSize:12,marginTop:12,background:C.redPale,padding:"8px 12px",borderRadius:8,border:"1px solid #fecaca"}}>⚠ {err}</div>}
        {msg&&<div style={{color:C.green,fontSize:12,marginTop:12,background:C.greenPale,padding:"8px 12px",borderRadius:8,border:"1px solid #bbf7d0"}}>{msg}</div>}
        <Btn v="cta" onClick={handle} loading={loading} style={{width:"100%",marginTop:20,padding:"13px",fontSize:15}}>
          {mode==="login"?"Sign In →":"Create Account →"}
        </Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RESUME ANALYZER — FULL PRO VERSION
// ═══════════════════════════════════════════════════════════════════════════
function ResumeAnalyzer(){
  const [jd,setJd]=useState(()=>localStorage.getItem("tp_jd")||"");
  const [resume,setResume]=useState(()=>localStorage.getItem("tp_resume")||"");
  const [fileName,setFileName]=useState(()=>localStorage.getItem("tp_fn")||"");
  const [step,setStep]=useState("input"); // input | analyzing | results | optimizing | preview
  const [analysis,setAnalysis]=useState(null);
  const [parsed,setParsed]=useState(null);
  const [activeTab,setActiveTab]=useState("overview");
  const [err,setErr]=useState("");
  const [dlLoading,setDlLoading]=useState("");
  const fileRef=useRef();

  const handleFile=async(e)=>{
    const f=e.target.files[0];if(!f)return;
    setFileName(f.name);localStorage.setItem("tp_fn",f.name);setErr("");
    try{
      let text="";
      if(f.type==="application/pdf"||f.name.endsWith(".pdf")) text=await extractPDF(f);
      else if(f.name.endsWith(".docx")) text=await extractDOCX(f);
      else{ const r=new FileReader();r.onload=ev=>{setResume(ev.target.result);localStorage.setItem("tp_resume",ev.target.result);};r.readAsText(f);return; }
      setResume(text);localStorage.setItem("tp_resume",text);
    }catch(e2){setErr("Could not read file: "+e2.message);}
  };

  const runAnalysis=async()=>{
    if(!jd.trim()||!resume.trim()){setErr("Please fill both JD and resume.");return;}
    setStep("analyzing");setErr("");setAnalysis(null);setParsed(null);

    try{
      // Deep analysis
      const raw=await callGroq(`You are a senior ATS recruiter and hiring manager. Do a deep, honest analysis.

JD (first 700 chars): ${jd.trim().slice(0,700)}
RESUME (first 900 chars): ${resume.trim().slice(0,900)}

Return ONLY this exact JSON:
{
  "matchScore": <0-100 integer, how well resume matches JD>,
  "atsScore": <0-100 integer, how ATS-friendly is the formatting and keywords>,
  "shortlistRate": <0-35 integer, realistic % chance recruiter shortlists>,
  "verdict": "<Strong Match|Good Match|Partial Match|Weak Match>",
  "recruiterTake": "<what a recruiter thinks in 6 seconds seeing this resume>",
  "summary": "<2 sentence honest assessment>",
  "sectionAudit": {
    "header": {"score":<0-100>,"status":"<good|warning|poor>","note":"<specific feedback>"},
    "summary": {"score":<0-100>,"status":"<good|warning|poor>","note":"<specific feedback>"},
    "education": {"score":<0-100>,"status":"<good|warning|poor>","note":"<specific feedback>"},
    "experience": {"score":<0-100>,"status":"<good|warning|poor>","note":"<specific feedback>"},
    "projects": {"score":<0-100>,"status":"<good|warning|poor>","note":"<specific feedback>"},
    "skills": {"score":<0-100>,"status":"<good|warning|poor>","note":"<specific feedback>"}
  },
  "strongMatches": [{"skill":"<name>","reason":"<why it matches>","strength":<0-100>}],
  "missingKeywords": [{"keyword":"<name>","importance":"High|Medium|Low","tip":"<where to add it>"}],
  "weakAreas": [{"area":"<name>","detail":"<specific problem>","fix":"<exact fix>"}],
  "projectFit": [{"name":"<project name>","relevance":<0-100>,"keep":<true|false>,"reason":"<why>","suggestion":"<how to improve description>"}],
  "skillsToAdd": ["<skill1>","<skill2>","<skill3>"],
  "improvements": ["<action item 1>","<action item 2>","<action item 3>","<action item 4>"]
}`,2000);

      const data=safeJSON(raw,null);
      if(!data?.matchScore) throw new Error("Analysis failed — please try again or shorten your inputs.");
      setAnalysis(data);
      setStep("results");
      setActiveTab("overview");

    }catch(e){
      setErr(e.message);
      setStep("input");
    }
  };

  const runOptimize=async()=>{
    setStep("optimizing");
    try{
      // Get parsed structured resume
      const praw=await callGroq(`Parse this resume into structured JSON for Jake's resume template.

RESUME: ${resume.trim().slice(0,1200)}
JD KEYWORDS: ${jd.trim().slice(0,400)}

Return ONLY this JSON (optimize bullets with action verbs and metrics, mirror JD keywords naturally):
{
  "name": "<full name>",
  "phone": "<phone>",
  "email": "<email>",
  "linkedin": "<linkedin url or 'linkedin.com/in/username'>",
  "github": "<github url or 'github.com/username'>",
  "location": "<city, country>",
  "education": [{"institution":"<name>","years":"<Sep 2022 – May 2026>","degree":"<B.Tech – CSE (AI & ML)>","gpa":"CGPA: 8.49/10"}],
  "experience": [{"title":"<role>","company":"<company>","location":"<city>","dates":"<Dec 2025 – Mar 2026>","bullets":["<action verb + achievement + metric>","<action verb + achievement + metric>","<action verb + achievement + metric>"]}],
  "projects": [{"name":"<project name>","tech":"<React.js, Node.js>","year":"<2026>","bullets":["<what it does + scale or metric>","<technical achievement>","<deployment or testing detail>"]}],
  "skills": {"Frontend":"<list>","Backend":"<list>","Database":"<list>","Tools":"<list>","Certifications":"<if any>"},
  "certifications": ["<cert 1>","<cert 2>","<achievement>"]
}`,2200);

      const p=safeJSON(praw,null);
      if(!p?.name) throw new Error("Could not parse resume structure — try again.");
      setParsed(p);
      setStep("preview");
      setActiveTab("preview");
    }catch(e){
      setErr(e.message);
      setStep("results");
      setActiveTab("overview");
    }
  };

  const handleDownload=async(type)=>{
    if(!parsed)return;
    setDlLoading(type);
    try{
      if(type==="pdf") await downloadJakesPDF(parsed,"TakePlace_Optimized_Resume.pdf");
      else await downloadJakesDOCX(parsed,"TakePlace_Optimized_Resume.docx");
    }catch(e){setErr("Download error: "+e.message);}
    setDlLoading("");
  };

  const sc=s=>s>=75?C.green:s>=50?C.yellow:C.red;
  const statusColor=s=>s==="good"?C.green:s==="warning"?C.yellow:C.red;
  const statusIcon=s=>s==="good"?"✅":s==="warning"?"⚠️":"❌";

  // ── INPUT SCREEN ─────────────────────────────────────────────────────────
  if(step==="input")return(
    <div>
      <div style={{marginBottom:22}}>
        <div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:4}}>⚡ AI Resume Analyzer</div>
        <div style={{color:C.muted,fontSize:13}}>Paste JD + upload resume → Deep section audit · ATS score · Jake's resume rewrite · PDF/DOCX download</div>
      </div>
      {err&&<div style={{background:C.redPale,border:"1px solid #fecaca",borderRadius:10,padding:"12px 16px",marginBottom:14,color:C.red,fontSize:13}}>⚠ {err}</div>}
      <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:14}}>
        <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
          📋 Job Description
          {jd&&<Tag color={jd.split(/\s+/).filter(Boolean).length>150?C.green:C.yellow}>{jd.split(/\s+/).filter(Boolean).length} words</Tag>}
        </div>
        <textarea value={jd} onChange={e=>{setJd(e.target.value);localStorage.setItem("tp_jd",e.target.value);}}
          placeholder="Paste the full job description here — more detail = better analysis..."
          style={{...inp,minHeight:160,resize:"vertical",lineHeight:1.8}}/>
      </div>
      <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{fontWeight:700,color:C.text,fontSize:15}}>📄 Your Resume</div>
          <button onClick={()=>fileRef.current.click()} style={{padding:"7px 14px",borderRadius:8,border:`1.5px solid ${C.blue}40`,background:`${C.blue}08`,color:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>
            📁 Upload PDF/DOCX/TXT
          </button>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFile} style={{display:"none"}}/>
        {fileName&&<div style={{background:C.greenPale,border:"1px solid #bbf7d0",borderRadius:8,padding:"6px 12px",marginBottom:10,fontSize:12,color:C.green}}>✅ {fileName} loaded</div>}
        <textarea value={resume} onChange={e=>{setResume(e.target.value);localStorage.setItem("tp_resume",e.target.value);}}
          placeholder="Paste resume text OR upload a file above..."
          style={{...inp,minHeight:200,resize:"vertical",lineHeight:1.8}}/>
      </div>
      <Btn v="cta" onClick={runAnalysis} disabled={!jd.trim()||!resume.trim()} style={{width:"100%",padding:"15px",fontSize:16,borderRadius:12}}>
        🔍 Analyze & Audit Resume
      </Btn>
    </div>
  );

  // ── ANALYZING ────────────────────────────────────────────────────────────
  if(step==="analyzing")return(
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:72,marginBottom:20,animation:"float 2s ease-in-out infinite"}}>🧠</div>
      <div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:10}}>Deep Analyzing Your Resume</div>
      <div style={{color:C.muted,fontSize:14,marginBottom:30,lineHeight:1.9}}>
        Auditing each section · Scoring ATS readiness · Finding keyword gaps<br/>
        Checking project relevance · Computing shortlist rate...
      </div>
      <Spin size={44} color={C.blue}/>
    </div>
  );

  // ── OPTIMIZING ───────────────────────────────────────────────────────────
  if(step==="optimizing")return(
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:72,marginBottom:20,animation:"float 2s ease-in-out infinite"}}>✨</div>
      <div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:10}}>Building Your Jake's Resume</div>
      <div style={{color:C.muted,fontSize:14,marginBottom:30,lineHeight:1.9}}>
        Rewriting bullets with action verbs · Adding JD keywords naturally<br/>
        Structuring Jake's format · Calculating optimal section order...
      </div>
      <Spin size={44} color={C.purple}/>
    </div>
  );

  // ── RESULTS ──────────────────────────────────────────────────────────────
  const a=analysis;
  const tabs=[
    ["overview","📊 Overview"],
    ["sections","🔍 Section Audit"],
    ["gaps","⚠️ Gaps"],
    ["projects","🏗️ Projects"],
    ...(parsed?[["preview","✨ Resume"]]:[]),
  ];

  return(
    <div className="fade">
      {err&&<div style={{background:C.redPale,border:"1px solid #fecaca",borderRadius:10,padding:"12px 16px",marginBottom:14,color:C.red,fontSize:13}}>⚠ {err}</div>}

      {/* SCORE HERO */}
      <div style={{background:"linear-gradient(135deg,#eff6ff,#f0fdf4)",border:`1.5px solid ${C.blue}20`,borderRadius:20,padding:"28px 24px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:28,marginBottom:20,flexWrap:"wrap"}}>
          <ScoreRing score={a.matchScore} label="JD Match"/>
          <div style={{width:1,height:80,background:C.border}}/>
          <ScoreRing score={a.atsScore} color={C.blue} label="ATS Score"/>
          <div style={{width:1,height:80,background:C.border}}/>
          <div style={{textAlign:"center"}}>
            <div style={{width:88,height:88,borderRadius:"50%",border:`5px solid ${C.purple}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`${C.purple}08`}}>
              <div style={{fontWeight:900,fontSize:20,color:C.purple}}>{a.shortlistRate}%</div>
            </div>
            <div style={{color:C.muted,fontSize:11,fontWeight:600,marginTop:4}}>Shortlist Rate</div>
          </div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{display:"inline-block",padding:"6px 20px",borderRadius:20,
            background:a.matchScore>=75?C.greenPale:a.matchScore>=50?C.yellowPale:C.redPale,
            color:sc(a.matchScore),fontWeight:800,fontSize:14,marginBottom:10,border:`1px solid ${sc(a.matchScore)}30`}}>
            {a.verdict}
          </div>
          <div style={{color:C.soft,fontSize:14,lineHeight:1.8,maxWidth:520,margin:"0 auto 10px"}}>{a.summary}</div>
          {a.recruiterTake&&(
            <div style={{background:"#fff",border:`1px solid ${C.blue}20`,borderRadius:12,padding:"10px 18px",fontSize:13,color:C.soft,fontStyle:"italic",maxWidth:500,margin:"0 auto"}}>
              💼 <strong style={{color:C.blue,fontStyle:"normal"}}>Recruiter's take:</strong> {a.recruiterTake}
            </div>
          )}
        </div>
      </div>

      {/* TAB NAV */}
      <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {tabs.map(([k,l])=>(
          <button key={k} onClick={()=>setActiveTab(k)}
            style={{padding:"9px 16px",borderRadius:20,whiteSpace:"nowrap",border:`1.5px solid ${activeTab===k?C.blue:C.border}`,
              background:activeTab===k?`${C.blue}10`:"#fff",color:activeTab===k?C.blue:C.muted,
              cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:activeTab===k?700:400,fontSize:13,transition:"all .2s"}}>
            {l}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab==="overview"&&(
        <div className="fade">
          {a.strongMatches?.length>0&&(
            <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:14}}>
              <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>✅ Strong Matches <Tag color={C.green}>{a.strongMatches.length}</Tag></div>
              {a.strongMatches.map((m,i)=>(
                <div key={i} style={{marginBottom:12,background:C.greenPale,borderRadius:12,padding:14,border:"1px solid #bbf7d0"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <div style={{fontWeight:700,color:C.text}}>{m.skill}</div>
                    <div style={{fontWeight:800,fontSize:15,color:sc(m.strength)}}>{m.strength}%</div>
                  </div>
                  <div style={{color:C.muted,fontSize:12,marginBottom:6}}>{m.reason}</div>
                  <Bar score={m.strength} color={C.green}/>
                </div>
              ))}
            </div>
          )}
          {a.skillsToAdd?.length>0&&(
            <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:14}}>
              <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:14}}>🎯 Add These Skills to Your Resume</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {a.skillsToAdd.map((s,i)=><Tag key={i} color={C.purple}>+ {s}</Tag>)}
              </div>
            </div>
          )}
          {a.improvements?.length>0&&(
            <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:14}}>
              <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:14}}>📝 What to Improve</div>
              {a.improvements.map((imp,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10,background:C.bg2,borderRadius:10,padding:"10px 14px",border:`1px solid ${C.border}`}}>
                  <span style={{color:C.blue,flexShrink:0,fontWeight:800}}>→</span>
                  <span style={{color:C.soft,fontSize:13}}>{imp}</span>
                </div>
              ))}
            </div>
          )}
          {a.weakAreas?.length>0&&(
            <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20}}>
              <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:14}}>⚡ Weak Areas</div>
              {a.weakAreas.map((w,i)=>(
                <div key={i} style={{background:C.yellowPale,borderRadius:12,padding:14,marginBottom:10,border:"1px solid #fef08a"}}>
                  <div style={{fontWeight:700,color:C.yellow,fontSize:14,marginBottom:4}}>{w.area}</div>
                  <div style={{color:C.soft,fontSize:13,lineHeight:1.7,marginBottom:6}}>{w.detail}</div>
                  {w.fix&&<div style={{color:C.green,fontSize:12,fontWeight:600}}>✅ Fix: {w.fix}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION AUDIT TAB */}
      {activeTab==="sections"&&(
        <div className="fade">
          <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20}}>
            <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:4}}>🔍 Section-by-Section Audit</div>
            <div style={{color:C.muted,fontSize:12,marginBottom:20}}>Every section of your resume scored individually — like a recruiter would read it</div>
            {a.sectionAudit&&Object.entries(a.sectionAudit).map(([key,sec])=>(
              <div key={key} style={{marginBottom:16,background:C.bg2,borderRadius:14,padding:16,border:`1.5px solid ${statusColor(sec.status)}25`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:16}}>{statusIcon(sec.status)}</span>
                    <span style={{fontWeight:700,color:C.text,fontSize:14,textTransform:"capitalize"}}>{key}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <Tag color={statusColor(sec.status)}>{sec.status.toUpperCase()}</Tag>
                    <span style={{fontWeight:800,fontSize:15,color:statusColor(sec.status)}}>{sec.score}%</span>
                  </div>
                </div>
                <div style={{color:C.soft,fontSize:13,lineHeight:1.7,marginBottom:8}}>{sec.note}</div>
                <Bar score={sec.score} color={statusColor(sec.status)}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GAPS TAB */}
      {activeTab==="gaps"&&(
        <div className="fade">
          <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20}}>
            <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:4,display:"flex",alignItems:"center",gap:8}}>
              ⚠️ Missing Keywords <Tag color={C.red}>{a.missingKeywords?.length||0} gaps</Tag>
            </div>
            <div style={{color:C.muted,fontSize:12,marginBottom:16}}>These keywords appear in the JD but are missing or weak in your resume</div>
            {a.missingKeywords?.map((m,i)=>(
              <div key={i} style={{background:C.redPale,borderRadius:12,padding:14,marginBottom:12,border:`1px solid ${m.importance==="High"?C.red:m.importance==="Medium"?C.yellow:C.green}30`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{fontWeight:700,color:C.text}}>🔍 {m.keyword}</div>
                  <Tag color={m.importance==="High"?C.red:m.importance==="Medium"?C.yellow:C.green}>{m.importance}</Tag>
                </div>
                <div style={{color:C.soft,fontSize:13}}>💡 {m.tip}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROJECTS TAB */}
      {activeTab==="projects"&&(
        <div className="fade">
          <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20}}>
            <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:4}}>🏗️ Project Relevance Check</div>
            <div style={{color:C.muted,fontSize:12,marginBottom:16}}>Which projects to keep, remove, or reframe for this specific role</div>
            {a.projectFit?.map((p,i)=>(
              <div key={i} style={{background:p.keep?C.greenPale:C.bg2,borderRadius:14,padding:16,marginBottom:12,border:`1.5px solid ${p.keep?"#bbf7d0":C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{fontWeight:700,color:C.text,fontSize:15}}>{p.name}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <Tag color={sc(p.relevance)}>{p.relevance}%</Tag>
                    <Tag color={p.keep?C.green:C.muted}>{p.keep?"✓ Keep":"Low priority"}</Tag>
                  </div>
                </div>
                <div style={{color:C.soft,fontSize:13,marginBottom:10}}>{p.reason}</div>
                <Bar score={p.relevance} color={sc(p.relevance)}/>
                {p.suggestion&&(
                  <div style={{marginTop:12,background:`${C.purple}08`,border:`1px solid ${C.purple}20`,borderRadius:10,padding:"10px 14px",fontSize:13,color:C.soft}}>
                    💡 <strong style={{color:C.purple}}>Suggestion:</strong> {p.suggestion}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PREVIEW TAB — Jake's Resume */}
      {activeTab==="preview"&&parsed&&(
        <div className="fade">
          <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontWeight:700,color:C.text,fontSize:15}}>✨ Your Jake's Format Resume</div>
                <div style={{color:C.muted,fontSize:12,marginTop:2}}>ATS-optimized · Action verbs · JD keyword-matched · Single page</div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <Btn v="purple" onClick={()=>handleDownload("pdf")} loading={dlLoading==="pdf"} style={{padding:"9px 16px",fontSize:13}}>⬇ PDF</Btn>
                <Btn v="green" onClick={()=>handleDownload("docx")} loading={dlLoading==="docx"} style={{padding:"9px 16px",fontSize:13}}>⬇ DOCX</Btn>
              </div>
            </div>

            {/* Score mini-row */}
            <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
              {[{l:"JD Match",s:a.matchScore,c:sc(a.matchScore)},{l:"ATS Score",s:a.atsScore,c:C.blue},{l:"Shortlist Rate",s:a.shortlistRate,c:C.purple,pct:true}].map((x,i)=>(
                <div key={i} style={{flex:"1 1 100px",background:C.bg2,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:10,border:`1px solid ${C.border}`}}>
                  <ScoreRing score={x.pct?x.s*3:x.s} size={48} color={x.c}/>
                  <div>
                    <div style={{fontWeight:700,color:C.text,fontSize:12}}>{x.l}</div>
                    <div style={{color:C.muted,fontSize:11}}>After optimize</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual resume preview */}
            <div style={{background:"#fff",border:`2px solid ${C.border}`,borderRadius:12,padding:"32px 36px",fontFamily:"'Times New Roman', serif",lineHeight:1.4,boxShadow:"0 4px 20px rgba(0,0,0,.08)"}}>
              {/* Header */}
              <div style={{textAlign:"center",marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:22,color:"#0f172a",marginBottom:4}}>{parsed.name}</div>
                <div style={{fontSize:11,color:"#64748b"}}>{[parsed.phone,parsed.email,parsed.linkedin,parsed.github,parsed.location].filter(Boolean).join(" | ")}</div>
              </div>
              <div style={{borderTop:"2px solid #2563eb",marginBottom:10}}/>

              {/* Education */}
              {parsed.education?.length>0&&(
                <>
                  <div style={{fontWeight:700,fontSize:11,color:"#0f172a",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Education</div>
                  <div style={{borderTop:"1px solid #e2e8f0",marginBottom:8}}/>
                  {parsed.education.map((e,i)=>(
                    <div key={i} style={{marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontWeight:700,fontSize:12}}>{e.institution}</span>
                        <span style={{fontSize:11,color:"#64748b"}}>{e.years}</span>
                      </div>
                      <div style={{fontSize:11,color:"#475569",fontStyle:"italic"}}>{e.degree} {e.gpa}</div>
                    </div>
                  ))}
                </>
              )}

              {/* Experience */}
              {parsed.experience?.length>0&&(
                <>
                  <div style={{fontWeight:700,fontSize:11,color:"#0f172a",textTransform:"uppercase",letterSpacing:1,marginBottom:4,marginTop:10}}>Experience</div>
                  <div style={{borderTop:"1px solid #e2e8f0",marginBottom:8}}/>
                  {parsed.experience.map((e,i)=>(
                    <div key={i} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontWeight:700,fontSize:12}}>{e.title}</span>
                        <span style={{fontSize:11,color:"#64748b"}}>{e.dates}</span>
                      </div>
                      <div style={{fontSize:11,color:"#64748b",fontStyle:"italic",marginBottom:4}}>{e.company}{e.location?" — "+e.location:""}</div>
                      {e.bullets?.map((b,j)=><div key={j} style={{fontSize:11,color:"#475569",paddingLeft:12,marginBottom:2}}>• {b}</div>)}
                    </div>
                  ))}
                </>
              )}

              {/* Projects */}
              {parsed.projects?.length>0&&(
                <>
                  <div style={{fontWeight:700,fontSize:11,color:"#0f172a",textTransform:"uppercase",letterSpacing:1,marginBottom:4,marginTop:10}}>Projects</div>
                  <div style={{borderTop:"1px solid #e2e8f0",marginBottom:8}}/>
                  {parsed.projects.map((p,i)=>(
                    <div key={i} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontWeight:700,fontSize:12}}>{p.name}{p.tech?" | "+p.tech:""}</span>
                        <span style={{fontSize:11,color:"#64748b"}}>{p.year}</span>
                      </div>
                      {p.bullets?.map((b,j)=><div key={j} style={{fontSize:11,color:"#475569",paddingLeft:12,marginBottom:2}}>• {b}</div>)}
                    </div>
                  ))}
                </>
              )}

              {/* Skills */}
              {parsed.skills&&(
                <>
                  <div style={{fontWeight:700,fontSize:11,color:"#0f172a",textTransform:"uppercase",letterSpacing:1,marginBottom:4,marginTop:10}}>Technical Skills</div>
                  <div style={{borderTop:"1px solid #e2e8f0",marginBottom:8}}/>
                  {Object.entries(parsed.skills).map(([k,v])=>(
                    <div key={k} style={{fontSize:11,color:"#475569",marginBottom:3}}>
                      <strong style={{color:"#0f172a"}}>{k}:</strong> {v}
                    </div>
                  ))}
                </>
              )}

              {/* Certifications */}
              {parsed.certifications?.length>0&&(
                <>
                  <div style={{fontWeight:700,fontSize:11,color:"#0f172a",textTransform:"uppercase",letterSpacing:1,marginBottom:4,marginTop:10}}>Certifications & Achievements</div>
                  <div style={{borderTop:"1px solid #e2e8f0",marginBottom:8}}/>
                  {parsed.certifications.map((c,i)=><div key={i} style={{fontSize:11,color:"#475569",paddingLeft:12,marginBottom:2}}>• {c}</div>)}
                </>
              )}
            </div>

            <div style={{marginTop:14,background:C.greenPale,border:"1px solid #bbf7d0",borderRadius:12,padding:"12px 16px",fontSize:13,color:C.soft,lineHeight:1.7}}>
              💡 <strong style={{color:C.green}}>Pro tip:</strong> Download PDF for job portals. Download DOCX to edit in Google Docs. This is Jake's resume template — the most ATS-friendly format used by top candidates at FAANG.
            </div>
          </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div style={{marginTop:16,display:"flex",gap:10,flexWrap:"wrap"}}>
        {step==="results"&&!parsed&&(
          <Btn v="cta" onClick={runOptimize} style={{flex:1,padding:"14px",fontSize:15,minWidth:200}}>
            ✨ Optimize → Jake's Resume + Download
          </Btn>
        )}
        <Btn v="ghost" onClick={()=>{
          setStep("input");setAnalysis(null);setParsed(null);setErr("");
          setJd("");setResume("");setFileName("");
          localStorage.removeItem("tp_jd");localStorage.removeItem("tp_resume");localStorage.removeItem("tp_fn");
        }} style={{padding:"12px 20px",fontSize:13}}>
          🔄 Analyze Another
        </Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// JOBS TAB
// ═══════════════════════════════════════════════════════════════════════════
function JobsTab(){
  const [jobs,setJobs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState(()=>sessionStorage.getItem("tp_s")||"software engineer fresher");
  const [location,setLocation]=useState(()=>sessionStorage.getItem("tp_l")||"hyderabad");
  const [expanded,setExpanded]=useState(null);
  const [saved,setSaved]=useState([]);

  useEffect(()=>{fetchJobs();},[]);

  const fetchJobs=async(q=search,loc=location)=>{
    setLoading(true);
    sessionStorage.setItem("tp_s",q);sessionStorage.setItem("tp_l",loc);
    try{
      const url=`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&what=${encodeURIComponent(q)}&where=${encodeURIComponent(loc)}&sort_by=date&content-type=application/json`;
      const res=await fetch(url);
      const data=await res.json();
      setJobs(data.results?.length?data.results.map(j=>({
        id:j.id,title:j.title,company:j.company?.display_name||"Company",
        location:j.location?.display_name||loc,
        salary:j.salary_min?`₹${Math.round(j.salary_min/100000)}–${Math.round((j.salary_max||j.salary_min*1.4)/100000)} LPA`:"Competitive",
        description:j.description||"",desc200:(j.description||"").slice(0,200),
        url:j.redirect_url,
        posted:new Date(j.created).toLocaleDateString("en-IN",{day:"numeric",month:"short"}),
        category:j.category?.label||"Technology",
      })):[]);
    }catch{}
    setLoading(false);
  };

  const quickRoles=["React Developer","Node.js","Data Analyst","Python Developer","Java Developer","Full Stack","DevOps","AI ML"];

  return(
    <div>
      <div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:4}}>🔥 Live Job Feed</div>
      <div style={{color:C.muted,fontSize:13,marginBottom:16}}>Real jobs from top Indian companies · Updated daily</div>

      <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:18,marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <input style={inp} placeholder="Role..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
          <input style={inp} placeholder="City..." value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
          {quickRoles.map(r=>(
            <button key={r} onClick={()=>{setSearch(r);fetchJobs(r,location);}}
              style={{padding:"4px 12px",borderRadius:20,border:`1px solid ${C.border}`,background:search===r?`${C.blue}10`:"#f8fafc",color:search===r?C.blue:C.muted,fontSize:11,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>
              {r}
            </button>
          ))}
        </div>
        <Btn v="cta" onClick={()=>fetchJobs()} style={{width:"100%"}}>🔍 Search Jobs</Btn>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontWeight:800,fontSize:16,color:C.text}}>Results</div>
        {!loading&&jobs.length>0&&(
          <div style={{display:"flex",alignItems:"center",gap:6,background:C.greenPale,borderRadius:20,padding:"4px 12px",border:"1px solid #bbf7d0"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/>
            <span style={{color:C.green,fontSize:11,fontWeight:700}}>{jobs.length} live jobs</span>
          </div>
        )}
      </div>

      {loading&&<div style={{textAlign:"center",padding:"60px 0"}}><Spin size={40} color={C.blue}/></div>}

      {!loading&&jobs.map((job,i)=>{
        const isExp=expanded===job.id;
        const isSaved=saved.includes(job.id);
        return(
          <div key={job.id} className="fade lift" style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:"18px",marginBottom:10,borderLeft:`3px solid ${C.blue}`,animationDelay:`${i*.04}s`,boxShadow:"0 1px 6px rgba(0,0,0,.04)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:15,color:C.text}}>{job.title}</div>
                <div style={{color:C.muted,fontSize:12,marginTop:2}}>{job.company} · {job.location}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{color:C.green,fontWeight:800,fontSize:14}}>{job.salary}</div>
                <div style={{color:C.muted,fontSize:11,marginTop:2}}>{job.posted}</div>
              </div>
            </div>
            <div style={{color:C.muted,fontSize:12,lineHeight:1.7,marginBottom:12,background:C.bg2,borderRadius:10,padding:"10px 12px"}}>
              {isExp?job.description.replace(/<[^>]+>/g,""):job.desc200.replace(/<[^>]+>/g,"")+(job.description.length>200?"...":"")}
              {job.description.length>200&&(
                <button onClick={()=>setExpanded(isExp?null:job.id)} style={{background:"none",border:"none",color:C.blue,fontSize:11,cursor:"pointer",marginLeft:6,fontFamily:"'Inter',sans-serif",fontWeight:600}}>
                  {isExp?"Show less ▲":"Read more ▼"}
                </button>
              )}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <Tag color={C.blue}>{job.category}</Tag>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setSaved(s=>s.includes(job.id)?s.filter(x=>x!==job.id):[...s,job.id])}
                  style={{padding:"7px 12px",borderRadius:8,border:`1.5px solid ${isSaved?C.gold:C.border}`,background:isSaved?C.yellowPale:"transparent",cursor:"pointer",fontSize:12,fontWeight:600,color:isSaved?C.gold:C.muted,fontFamily:"'Inter',sans-serif"}}>
                  {isSaved?"★ Saved":"☆ Save"}
                </button>
                <Btn v="cta" onClick={()=>window.open(job.url,"_blank")} style={{fontSize:12,padding:"8px 18px"}}>Apply →</Btn>
              </div>
            </div>
          </div>
        );
      })}
      {!loading&&jobs.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>No jobs found. Try a different role or city.</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
function MainApp({user,onLogout}){
  const [tab,setTab]=useState(()=>parseInt(sessionStorage.getItem("tp_tab")||"0"));
  const name=user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";

  const setTabP=(t)=>{setTab(t);sessionStorage.setItem("tp_tab",t);};

  const TABS=[
    {icon:"🔥",label:"Jobs"},
    {icon:"⚡",label:"Resume AI"},
  ];

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Inter',sans-serif"}}>
      <style>{CSS}</style>
      {/* Header */}
      <div style={{background:"#fff",borderBottom:`1.5px solid ${C.border}`,padding:"0 20px",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
        <div style={{maxWidth:860,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:62}}>
          <div style={{fontWeight:900,fontSize:20,color:C.blue,display:"flex",alignItems:"center",gap:6}}>⚡ TakePlace</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.blueL})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#fff"}}>
              {name[0].toUpperCase()}
            </div>
            <span style={{fontSize:13,color:C.soft,fontWeight:600}}>{name.split(" ")[0]}</span>
            <Btn v="ghost" onClick={onLogout} style={{padding:"6px 14px",fontSize:12}}>Logout</Btn>
          </div>
        </div>
      </div>
      {/* Tab bar */}
      <div style={{background:"#fff",borderBottom:`1.5px solid ${C.border}`,position:"sticky",top:62,zIndex:99}}>
        <div style={{maxWidth:860,margin:"0 auto",display:"flex"}}>
          {TABS.map((t,i)=>(
            <button key={i} onClick={()=>setTabP(i)}
              style={{flex:1,padding:"14px 6px",border:"none",background:"transparent",cursor:"pointer",
                color:tab===i?C.blue:C.muted,fontFamily:"'Inter',sans-serif",fontWeight:tab===i?800:500,fontSize:14,
                borderBottom:`2.5px solid ${tab===i?C.blue:"transparent"}`,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{maxWidth:860,margin:"0 auto",padding:"24px 16px 60px"}}>
        {tab===0&&<JobsTab/>}
        {tab===1&&<ResumeAnalyzer/>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════
export default function App(){
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const [page,setPage]=useState("landing");

  useEffect(()=>{
    const s=document.createElement("style");
    s.textContent=CSS;document.head.appendChild(s);
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){setUser(session.user);setPage("app");}
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user){setUser(session.user);setPage("app");}
      else{setUser(null);setPage("landing");}
    });
  },[]);

  if(loading)return(
    <div style={{minHeight:"100vh",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{CSS}</style>
      <span style={{fontSize:40}}>⚡</span>
      <Spin size={40} color={C.blue}/>
      <div style={{color:C.muted,fontSize:14,fontFamily:"'Inter',sans-serif"}}>Loading TakePlace...</div>
    </div>
  );

  if(page==="landing")return<LandingPage onStart={()=>setPage("auth")}/>;
  if(page==="auth")return<AuthPage onLogin={u=>{setUser(u);setPage("app");}} onBack={()=>setPage("landing")}/>;
  return<MainApp user={user} onLogout={()=>supabase.auth.signOut()}/>;
}

