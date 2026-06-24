import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID  = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const APP_URL    = "https://takeplace.vercel.app";
const supabase   = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg:"#080C14", bgCard:"#0D1220", bgSurf:"#111827", bgLight:"#F8FAFC", white:"#FFFFFF",
  ink:"#F1F5F9", ink2:"#CBD5E1", ink3:"#94A3B8", inkDark:"#0D1117",
  violet:"#7C6EFA", violetL:"#A89BFC", violetD:"#5B4EE8", violetPale:"rgba(124,110,250,0.12)",
  teal:"#00D4AA", tealL:"#2EE8BF", tealD:"#00A888", tealPale:"rgba(0,212,170,0.10)",
  gold:"#F59E0B", goldL:"#FBD072", goldPale:"rgba(245,158,11,0.12)",
  green:"#22C55E", greenL:"#4ADE80", greenPale:"rgba(34,197,94,0.10)",
  red:"#EF4444", redPale:"rgba(239,68,68,0.10)",
  blue:"#3B82F6", bluePale:"rgba(59,130,246,0.10)",
  border:"rgba(255,255,255,0.08)", borderHover:"rgba(255,255,255,0.16)",
  muted:"#64748B", soft:"#94A3B8",
  lBg:"#F8FAFC", lCard:"#FFFFFF", lBorder:"#E2E8F0", lText:"#0F172A", lMuted:"#64748B",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',sans-serif;background:${C.bg};color:${C.ink};-webkit-font-smoothing:antialiased;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:4px;}
  ::selection{background:${C.violet}40;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
  @keyframes voiceBar{0%,100%{transform:scaleY(.15)}50%{transform:scaleY(1)}}
  @keyframes ringPulse{0%{box-shadow:0 0 0 0 rgba(124,110,250,.5)}70%{box-shadow:0 0 0 24px rgba(124,110,250,0)}100%{box-shadow:0 0 0 0 rgba(124,110,250,0)}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes streakPop{0%{transform:scale(1)}50%{transform:scale(1.3)}100%{transform:scale(1)}}
  @keyframes gradientShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes popIn{0%{transform:scale(.8);opacity:0}100%{transform:scale(1);opacity:1}}
  @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  .fade{animation:fadeUp .45s cubic-bezier(.22,1,.36,1) forwards;}
  .fadein{animation:fadeIn .3s ease forwards;}
  .lift{transition:transform .18s cubic-bezier(.22,1,.36,1),box-shadow .18s;cursor:pointer;}
  .lift:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,0,0,.4);}
  input:focus,textarea:focus,select:focus{outline:none;}
  button:active{transform:scale(.97);}
  .room-fixed{position:fixed;inset:0;z-index:9999;background:#04060E;display:flex;flex-direction:column;overflow:hidden;}
  .glass{background:rgba(255,255,255,.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.08);}
  .glass-strong{background:rgba(13,18,32,.85);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.1);}
  .vbar{width:3px;border-radius:2px;background:currentColor;display:inline-block;transform-origin:center bottom;}
  .mono{font-family:'JetBrains Mono',monospace;}
  .gradient-text{background:linear-gradient(135deg,${C.violetL},${C.teal});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .share-toast{position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#22C55E;color:#fff;padding:10px 22px;border-radius:24px;font-size:13px;font-weight:700;z-index:9998;animation:popIn .25s ease forwards;box-shadow:0 8px 24px rgba(34,197,94,.4);}
  .marquee-track{display:flex;gap:20px;animation:marquee 25s linear infinite;}
  .marquee-wrap{overflow:hidden;}
  .cta-glow{box-shadow:0 0 40px rgba(124,110,250,.3),0 4px 20px rgba(124,110,250,.25);}
  .cta-glow:hover{box-shadow:0 0 60px rgba(124,110,250,.4),0 8px 30px rgba(124,110,250,.35);}
  .hero-card{animation:heroFloat 4s ease-in-out infinite;}
  @keyframes heroFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
`;

const inp = {
  width:"100%", background:"rgba(255,255,255,.04)", border:`1px solid ${C.border}`,
  borderRadius:10, padding:"11px 14px", color:C.ink, fontSize:14,
  fontFamily:"'Inter',sans-serif", outline:"none", transition:"border-color .2s,box-shadow .2s",
};

// ── ATOMS ─────────────────────────────────────────────────────────────────────
const Spin = ({size=18,color=C.violet}) => (
  <span style={{width:size,height:size,border:`2px solid ${color}20`,borderTopColor:color,borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite",flexShrink:0}}/>
);

function Btn({children,onClick,v="primary",style={},disabled=false,loading=false,small=false}){
  const base={padding:small?"7px 14px":"12px 24px",fontSize:small?12:14,borderRadius:10,border:"none",cursor:disabled||loading?"not-allowed":"pointer",fontFamily:"'Inter',sans-serif",transition:"all .18s cubic-bezier(.22,1,.36,1)",opacity:disabled?.45:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,fontWeight:700,whiteSpace:"nowrap"};
  const vs={
    primary:{background:`linear-gradient(135deg,${C.violetD},${C.violet})`,color:"#fff",boxShadow:`0 4px 20px ${C.violet}35`},
    teal:{background:`linear-gradient(135deg,${C.tealD},${C.teal})`,color:C.bg,boxShadow:`0 4px 20px ${C.teal}30`},
    gold:{background:`linear-gradient(135deg,#D97706,${C.gold},${C.goldL})`,color:C.bg,boxShadow:`0 4px 20px ${C.gold}30`},
    green:{background:`linear-gradient(135deg,#16A34A,${C.green})`,color:"#fff"},
    ghost:{background:"rgba(255,255,255,.06)",color:C.ink2,border:`1px solid ${C.border}`},
    outline:{background:"transparent",color:"#fff",border:"1px solid rgba(255,255,255,.25)"},
    danger:{background:C.red,color:"#fff"},
    light:{background:C.lCard,color:C.lText,fontWeight:700,boxShadow:"0 2px 12px rgba(0,0,0,.12)"},
    violet:{background:`linear-gradient(135deg,${C.violetD},${C.violet},${C.violetL})`,color:"#fff",boxShadow:`0 4px 20px ${C.violet}40`},
    share:{background:"rgba(0,212,170,.12)",color:C.teal,border:`1px solid rgba(0,212,170,.25)`},
  };
  return(
    <button onClick={disabled||loading?undefined:onClick} disabled={disabled||loading} style={{...base,...vs[v],...style}}>
      {loading?<><Spin size={13} color={v==="ghost"?C.violet:"#fff"}/> Please wait…</>:children}
    </button>
  );
}

const Tag = ({children,color=C.violet,bg,size=11}) => (
  <span style={{background:bg||`${color}15`,color,fontSize:size,padding:"3px 10px",borderRadius:20,fontWeight:700,border:`1px solid ${color}20`,whiteSpace:"nowrap"}}>{children}</span>
);

function Bar({pct,color,h=4}){
  return(
    <div style={{background:"rgba(255,255,255,.06)",borderRadius:4,height:h,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${Math.min(100,pct||0)}%`,background:color||C.violet,borderRadius:4,transition:"width 1.2s cubic-bezier(.22,1,.36,1)"}}/>
    </div>
  );
}

// Skill Radar Chart
function SkillRadar({scores={},size=200}){
  const skills=[{key:"technical",label:"Technical"},{key:"communication",label:"Comms"},{key:"confidence",label:"Confidence"},{key:"structure",label:"Structure"},{key:"resumeFit",label:"Resume Fit"}];
  const cx=size/2,cy=size/2,r=(size/2)-30,n=skills.length;
  const angle=(i)=>(Math.PI*2*i/n)-Math.PI/2;
  const pt=(i,val)=>{const a=angle(i),d=(val/100)*r;return[cx+d*Math.cos(a),cy+d*Math.sin(a)];};
  const gridLevels=[20,40,60,80,100];
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map(l=><polygon key={l} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1" points={skills.map((_,i)=>{const[x,y]=pt(i,l);return`${x},${y}`;}).join(" ")}/>)}
      {skills.map((_,i)=>{const[x,y]=pt(i,100);return<line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,.06)" strokeWidth="1"/>;;})}
      <polygon fill={`${C.violet}25`} stroke={C.violet} strokeWidth="1.5" style={{transition:"all .8s cubic-bezier(.22,1,.36,1)"}} points={skills.map((s,i)=>{const[x,y]=pt(i,scores[s.key]||0);return`${x},${y}`;}).join(" ")}/>
      {skills.map((s,i)=>{const[x,y]=pt(i,scores[s.key]||0);return<circle key={i} cx={x} cy={y} r="3" fill={C.violet} style={{filter:`drop-shadow(0 0 4px ${C.violet})`}}/>;;})}
      {skills.map((s,i)=>{const a=angle(i),lx=cx+(r+20)*Math.cos(a),ly=cy+(r+20)*Math.sin(a);return<text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill={C.soft} fontSize="9" fontFamily="Inter,sans-serif" fontWeight="600" style={{textTransform:"uppercase",letterSpacing:.5}}>{s.label}</text>;;})}
    </svg>
  );
}

function Sparkline({data=[],width=120,height=32,color=C.violet}){
  if(data.length<2)return null;
  const max=Math.max(...data),min=Math.min(...data),range=max-min||1;
  const pts=data.map((v,i)=>{const x=(i/(data.length-1))*(width-4)+2,y=height-2-((v-min)/range)*(height-4);return`${x},${y}`;}).join(" ");
  return(
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts}/>
      {data.map((v,i)=>{const x=(i/(data.length-1))*(width-4)+2,y=height-2-((v-min)/range)*(height-4);return i===data.length-1?<circle key={i} cx={x} cy={y} r="3" fill={color} style={{filter:`drop-shadow(0 0 3px ${color})`}}/>:null;})}
    </svg>
  );
}

function fmtTime(s){return`${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;}
function safeJSON(raw,fallback={}){
  if(!raw)return fallback;
  try{return JSON.parse(raw.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim());}
  catch{try{const m=raw.match(/\{[\s\S]*\}/);if(m)return JSON.parse(m[0]);}catch{}return fallback;}
}

// ── SHARE TOAST ───────────────────────────────────────────────────────────────
function ShareToast({msg,onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2500);return()=>clearTimeout(t);},[]);
  return <div className="share-toast">✓ {msg}</div>;
}

// ── SHARE JOB FUNCTION ────────────────────────────────────────────────────────
async function shareJob(job,appUrl){
  const text=`🔥 Job Alert: ${job.title} at ${job.company}\n📍 ${job.location} · ${job.salary}\n\n🎯 Practice for this exact role on TakePlace before applying!\n${appUrl}`;
  const url=`${appUrl}?ref=job&role=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`;

  // Try Web Share API first (mobile)
  if(navigator.share){
    try{
      await navigator.share({title:`${job.title} at ${job.company}`,text,url});
      return "shared";
    }catch(e){if(e.name==="AbortError")return "cancelled";}
  }
  // Fallback: copy to clipboard
  try{
    await navigator.clipboard.writeText(text+"\n\n"+url);
    return "copied";
  }catch{
    // Last resort
    const ta=document.createElement("textarea");
    ta.value=text+"\n\n"+url;
    document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);
    return "copied";
  }
}

// ── AI CALL ───────────────────────────────────────────────────────────────────
async function callGroq(prompt,maxTokens=2000,systemMsg=""){
  const sys=systemMsg||"You are an expert technical interviewer. Respond with valid JSON only. No markdown, no explanation.";
  const res=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:sys},{role:"user",content:prompt}],max_tokens:maxTokens})});
  if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.error||"AI error "+res.status);}
  const data=await res.json();
  return data.content?.[0]?.text||"";
}

// ── FILE EXTRACT ──────────────────────────────────────────────────────────────
async function extractPDF(file){
  if(!window.pdfjsLib){
    await new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";s.onload=res;s.onerror=rej;document.head.appendChild(s);});
    window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const ab=await file.arrayBuffer();
  const pdf=await window.pdfjsLib.getDocument({data:ab}).promise;
  let text="";
  for(let i=1;i<=Math.min(pdf.numPages,5);i++){const page=await pdf.getPage(i);const c=await page.getTextContent();text+=c.items.map(x=>x.str).join(" ")+"\n";}
  return text.trim();
}
async function extractDOCX(file){
  if(!window.mammoth){await new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
  const ab=await file.arrayBuffer();
  const r=await window.mammoth.extractRawText({arrayBuffer:ab});
  return r.value.trim();
}

// ── FILLER WORDS ──────────────────────────────────────────────────────────────
const FILLERS=["um","uh","like","basically","literally","actually","you know","i mean","sort of","kind of","right","okay so","so basically","i think","i guess","perhaps","maybe i"];
function detectFillers(text){
  const lower=text.toLowerCase();const found={};let total=0;
  FILLERS.forEach(f=>{const re=new RegExp("\\b"+f.replace(/ /g,"\\s+")+"\\b","gi");const matches=(lower.match(re)||[]).length;if(matches>0){found[f]=matches;total+=matches;}});
  return{found,total};
}

// ── SUPABASE HELPERS ──────────────────────────────────────────────────────────
async function saveInterviewResult(userId,data){
  if(!userId)return;
  try{
    await supabase.from("interview_results").insert({user_id:userId,company:data.company||"",role:data.role||"",overall_score:data.overallScore||0,verdict:data.verdict||"",technical_score:data.technicalScore||0,communication_score:data.communicationScore||0,confidence_score:data.confidenceScore||0,structure_score:data.structureScore||0,resume_fit_score:data.resumeAlignmentScore||0,created_at:new Date().toISOString()});
    await updateStreak(userId);
  }catch(e){console.log("Supabase save error:",e.message);}
}
async function updateStreak(userId){
  if(!userId)return;
  try{
    const today=new Date().toDateString();
    const{data:existing}=await supabase.from("user_streaks").select("*").eq("user_id",userId).single();
    if(!existing){await supabase.from("user_streaks").insert({user_id:userId,streak:1,last_practice:today,longest:1});}
    else{const last=new Date(existing.last_practice);const diff=Math.floor((new Date()-last)/(1000*60*60*24));if(diff===0)return;const newStreak=diff===1?existing.streak+1:1;await supabase.from("user_streaks").update({streak:newStreak,last_practice:today,longest:Math.max(existing.longest||0,newStreak)}).eq("user_id",userId);}
  }catch(e){console.log("Streak update error:",e.message);}
}
async function fetchUserStats(userId){
  if(!userId)return null;
  try{
    const[{data:results},{data:streak}]=await Promise.all([supabase.from("interview_results").select("*").eq("user_id",userId).order("created_at",{ascending:false}).limit(20),supabase.from("user_streaks").select("*").eq("user_id",userId).single()]);
    return{results:results||[],streak:streak||{streak:0,longest:0}};
  }catch{return{results:[],streak:{streak:0,longest:0}};}
}

// ── SCORECARD ─────────────────────────────────────────────────────────────────
async function generateScorecard(data){
  if(!window.html2canvas){await new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
  const div=document.createElement("div");
  div.style.cssText=`position:fixed;left:-9999px;top:0;width:1200px;height:630px;background:linear-gradient(135deg,#080C14,#0D1220 40%,#11163A);font-family:'Inter',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;`;
  div.innerHTML=`<div style="width:100%;text-align:center;"><div style="font-size:18px;color:rgba(255,255,255,.4);margin-bottom:8px;letter-spacing:3px;font-weight:600;text-transform:uppercase">Mock Interview Result</div><div style="font-size:72px;font-weight:900;font-family:'Plus Jakarta Sans',sans-serif;background:linear-gradient(135deg,#A89BFC,#00D4AA);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1">${data.overallScore}%</div><div style="margin:16px auto;background:${data.overallScore>=75?"rgba(34,197,94,.2)":data.overallScore>=55?"rgba(245,158,11,.2)":"rgba(239,68,68,.2)"};color:${data.overallScore>=75?"#4ADE80":data.overallScore>=55?"#FBD072":"#F87171"};font-size:20px;font-weight:800;padding:10px 28px;border-radius:30px;display:inline-block">${data.verdict}</div><div style="font-size:24px;color:rgba(255,255,255,.7);margin:20px 0;">${data.company||""} ${data.role?`· ${data.role}`:""}</div><div style="display:flex;gap:24px;justify-content:center;margin:24px 0;">${[["Technical",data.technicalScore],["Communication",data.communicationScore],["Confidence",data.confidenceScore]].map(([l,v])=>`<div style="text-align:center;background:rgba(255,255,255,.05);border-radius:12px;padding:16px 24px;min-width:130px"><div style="font-size:28px;font-weight:700;color:#7C6EFA;font-family:'JetBrains Mono',monospace">${v}%</div><div style="font-size:12px;color:rgba(255,255,255,.4);margin-top:4px;font-weight:600;text-transform:uppercase;letter-spacing:1px">${l}</div></div>`).join("")}</div><div style="font-size:14px;color:rgba(255,255,255,.3);margin-top:24px;font-weight:600">🎤 TakePlace · takeplace.vercel.app</div></div>`;
  document.body.appendChild(div);
  try{const canvas=await window.html2canvas(div,{scale:1,backgroundColor:null,logging:false});const url=canvas.toDataURL("image/png");const a=document.createElement("a");a.href=url;a.download=`takeplace-score-${data.overallScore}.png`;a.click();return url;}
  finally{document.body.removeChild(div);}
}

// ── ROLES ─────────────────────────────────────────────────────────────────────
const ROLES=[
  {id:"sde",title:"Software Engineer",icon:"💻",cat:"Engineering",focus:"DSA, system design, problem solving",popular:true},
  {id:"frontend",title:"Frontend Developer",icon:"🎨",cat:"Engineering",focus:"React, JS, CSS, performance"},
  {id:"backend",title:"Backend Developer",icon:"🗄️",cat:"Engineering",focus:"APIs, databases, system design"},
  {id:"fullstack",title:"Full Stack Developer",icon:"🧩",cat:"Engineering",focus:"End-to-end design, REST, deploy",popular:true},
  {id:"devops",title:"DevOps Engineer",icon:"⚙️",cat:"Engineering",focus:"CI/CD, containers, monitoring"},
  {id:"cloud",title:"Cloud Engineer",icon:"☁️",cat:"Engineering",focus:"AWS/GCP, networking, security"},
  {id:"qa",title:"QA Engineer",icon:"🧪",cat:"Engineering",focus:"Test design, automation, triage"},
  {id:"security",title:"Cybersecurity Analyst",icon:"🛡️",cat:"Engineering",focus:"Threats, vulnerabilities, SIEM"},
  {id:"ds",title:"Data Scientist",icon:"📊",cat:"Data",focus:"Statistics, ML modeling, experiments",popular:true},
  {id:"da",title:"Data Analyst",icon:"📈",cat:"Data",focus:"SQL, dashboards, business metrics"},
  {id:"mle",title:"ML Engineer",icon:"🧠",cat:"Data",focus:"Pipelines, model deploy, evaluation"},
  {id:"pm",title:"Product Manager",icon:"🧭",cat:"Business",focus:"Prioritization, metrics, roadmap"},
  {id:"ba",title:"Business Analyst",icon:"🧾",cat:"Business",focus:"Requirements, process mapping"},
  {id:"uiux",title:"UI/UX Designer",icon:"✏️",cat:"Design",focus:"User research, wireframes, critique"},
];
const CATS=["All","Engineering","Data","Business","Design"];

const FALLBACK_QUESTIONS=[
  {q:"Tell me about yourself and what drew you to this role.",type:"Intro"},
  {q:"Walk me through your most complex technical project. What was the hardest problem you solved?",type:"Technical"},
  {q:"Describe a time you had a disagreement with a teammate. How did you handle it?",type:"Behavioral"},
  {q:"How do you debug a critical production issue when the system is down?",type:"Situational"},
  {q:"What questions do you have for us?",type:"Closing"},
];

const TARGET_COMPANIES=[
  {name:"Google",color:"#4285F4"},{name:"Amazon",color:"#FF9900"},{name:"Microsoft",color:"#00a4ef"},
  {name:"TCS",color:"#1e3a6e"},{name:"Infosys",color:"#007cc3"},{name:"Wipro",color:"#341660"},
  {name:"Flipkart",color:"#F74D00"},{name:"Zomato",color:"#E23744"},{name:"Swiggy",color:"#FC8019"},
  {name:"Deloitte",color:"#86BC25"},{name:"IBM",color:"#0043CE"},{name:"Accenture",color:"#A100FF"},
];

// ── AI FACE ───────────────────────────────────────────────────────────────────
function AIFace({speaking,size=200}){
  return(
    <div style={{position:"relative",width:size,height:size,borderRadius:"50%",overflow:"hidden"}}>
      <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Priya Sharma"
        style={{width:"100%",height:"100%",objectFit:"cover",display:"block",filter:speaking?"brightness(1.08) saturate(1.1)":"brightness(1)",transition:"filter .4s"}}/>
      {speaking&&<div style={{position:"absolute",inset:0,borderRadius:"50%",background:"radial-gradient(circle at center,transparent 60%,rgba(124,110,250,.15) 100%)",animation:"breathe 1.4s ease-in-out infinite"}}/>}
    </div>
  );
}

// ── INTERVIEW ROOM — CAMERA FIXED ─────────────────────────────────────────────
function InterviewRoom({role,company,questions,qIndex,phase,aiSpeaking,listening,liveText,interimText,timeLeft,feedback,loadingFeedback,onFinish,onNext,onEnd,onToggleMic,micMuted,fillerCount,liveMetrics}){
  const videoRef=useRef(null);
  const streamRef=useRef(null);
  const [camReady,setCamReady]=useState(false);
  const [camErr,setCamErr]=useState(false);
  const QTIME=90;
  const pct=(timeLeft/QTIME)*100;
  const tcol=pct>50?C.green:pct>20?C.gold:C.red;
  const q=questions[qIndex];
  const isLast=qIndex+1>=questions.length;

  useEffect(()=>{
    let active=true;
    // FIX: request video+audio together so browser grants both; use facingMode for mobile front cam
    const constraints={
      video:{width:{ideal:640},height:{ideal:480},facingMode:"user"},
      audio:false
    };
    navigator.mediaDevices?.getUserMedia(constraints)
      .then(stream=>{
        if(!active){stream.getTracks().forEach(t=>t.stop());return;}
        streamRef.current=stream;
        if(videoRef.current){
          videoRef.current.srcObject=stream;
          // FIX: must call play() after srcObject is set and element is mounted
          videoRef.current.onloadedmetadata=()=>{
            videoRef.current?.play().catch(()=>{});
          };
        }
        setCamReady(true);
      })
      .catch(err=>{console.warn("Camera error:",err);setCamErr(true);});
    return()=>{active=false;streamRef.current?.getTracks().forEach(t=>t.stop());};
  },[]);

  // FIX: re-attach stream when camReady changes (handles race conditions)
  useEffect(()=>{
    if(camReady&&streamRef.current&&videoRef.current){
      if(!videoRef.current.srcObject){
        videoRef.current.srcObject=streamRef.current;
        videoRef.current.play().catch(()=>{});
      }
    }
  },[camReady]);

  return(
    <div className="room-fixed">
      <style>{`
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        @keyframes voiceBar{0%,100%{transform:scaleY(.15)}50%{transform:scaleY(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes ringPulse{0%{box-shadow:0 0 0 0 rgba(124,110,250,.55)}70%{box-shadow:0 0 0 28px rgba(124,110,250,0)}100%{box-shadow:0 0 0 0 rgba(124,110,250,0)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .vbar{width:3px;border-radius:2px;background:currentColor;display:inline-block;transform-origin:center bottom;}
        .metric-bar{height:3px;border-radius:2px;transition:width .8s cubic-bezier(.22,1,.36,1);}
      `}</style>

      <div style={{flex:1,background:"linear-gradient(180deg,#04060E 0%,#080C14 100%)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${C.violet}08,transparent 70%)`,pointerEvents:"none"}}/>

        {/* Top HUD */}
        <div style={{position:"absolute",top:0,left:0,right:0,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"linear-gradient(to bottom,rgba(4,6,14,.9),transparent)",zIndex:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.red,animation:"pulse .9s infinite",boxShadow:`0 0 8px ${C.red}`}}/>
            <span style={{color:"rgba(255,255,255,.7)",fontWeight:700,fontSize:11,letterSpacing:1.5}}>LIVE</span>
            {company&&<div className="glass" style={{borderRadius:20,padding:"4px 14px",color:"rgba(255,255,255,.8)",fontSize:12,fontWeight:700}}>{company}</div>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{display:"flex",gap:5,alignItems:"center"}}>
              {questions.map((_,i)=><div key={i} style={{width:i===qIndex?28:20,height:3,borderRadius:2,background:i<qIndex?C.green:i===qIndex?C.violet:"rgba(255,255,255,.12)",transition:"all .3s"}}/>)}
            </div>
            <div className="glass" style={{borderRadius:20,padding:"4px 14px",color:"rgba(255,255,255,.6)",fontSize:11,fontWeight:700,fontFamily:"JetBrains Mono,monospace"}}>{qIndex+1}/{questions.length}</div>
          </div>
        </div>

        {/* AI Interviewer */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,zIndex:5}}>
          <div style={{borderRadius:"50%",padding:6,border:`2px solid ${aiSpeaking?C.violet:"rgba(255,255,255,.08)"}`,boxShadow:aiSpeaking?`0 0 40px ${C.violet}30`:"none",animation:aiSpeaking?"ringPulse 1.8s infinite":"none",transition:"all .4s"}}>
            <AIFace speaking={aiSpeaking} size={160}/>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{color:"#fff",fontWeight:800,fontSize:16}}>Priya Sharma</div>
            <div style={{color:"rgba(255,255,255,.4)",fontSize:12,marginTop:2}}>Senior Hiring Manager{company?` · ${company}`:role?` · ${role}`:""}</div>
            {aiSpeaking&&(
              <div style={{display:"flex",justifyContent:"center",gap:3,alignItems:"flex-end",marginTop:8,height:16}}>
                {[.35,.55,.8,.55,.35].map((d,i)=><span key={i} className="vbar" style={{height:16,color:C.violet,animation:`voiceBar ${d}s ease-in-out ${i*.07}s infinite`}}/>)}
              </div>
            )}
          </div>
        </div>

        {/* Live metrics sidebar */}
        {phase==="answering"&&(
          <div className="glass-strong" style={{position:"absolute",right:20,top:"50%",transform:"translateY(-50%)",borderRadius:14,padding:"16px",width:130,zIndex:20}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,.35)",fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:12}}>Live analysis</div>
            {[{label:"Pace",val:liveMetrics?.pace||0,color:C.teal},{label:"Clarity",val:liveMetrics?.clarity||0,color:C.violet},{label:"Fillers",val:Math.max(0,100-((fillerCount||0)*8)),color:fillerCount>3?C.red:fillerCount>1?C.gold:C.green}].map(({label,val,color})=>(
              <div key={label} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:10,color:"rgba(255,255,255,.5)",fontWeight:600}}>{label}</span>
                  <span style={{fontSize:10,color,fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>{val}%</span>
                </div>
                <div style={{background:"rgba(255,255,255,.06)",borderRadius:2,height:3}}>
                  <div className="metric-bar" style={{width:`${val}%`,background:color}}/>
                </div>
              </div>
            ))}
            {fillerCount>0&&<div style={{marginTop:8,padding:"6px 8px",background:"rgba(245,158,11,.1)",borderRadius:8,border:"1px solid rgba(245,158,11,.2)"}}><div style={{fontSize:10,color:C.gold,fontWeight:700}}>{fillerCount} filler{fillerCount>1?"s":""}</div><div style={{fontSize:9,color:"rgba(255,255,255,.35)",marginTop:1}}>detected</div></div>}
          </div>
        )}

        {/* Bottom overlay */}
        <div style={{position:"absolute",bottom:72,left:0,right:0,padding:"0 16px",zIndex:20}}>
          <div className="glass-strong" style={{borderRadius:14,padding:"14px 18px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <Tag color={C.violet}>{q?.type}</Tag>
              {phase==="answering"&&<span className="mono" style={{color:tcol,fontWeight:700,fontSize:14,filter:`drop-shadow(0 0 6px ${tcol}80)`}}>⏱ {fmtTime(timeLeft)}</span>}
            </div>
            <div style={{color:"#fff",fontSize:15,lineHeight:1.7,fontWeight:500}}>{q?.q}</div>
            {phase==="answering"&&<div style={{height:2,background:"rgba(255,255,255,.06)",borderRadius:2,marginTop:12,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:tcol,borderRadius:2,transition:"width 1s linear",boxShadow:`0 0 8px ${tcol}80`}}/></div>}
          </div>

          {phase==="answering"&&(
            <div className="glass" style={{borderRadius:12,padding:"12px 16px",border:`1px solid ${listening?`${C.teal}30`:"rgba(255,255,255,.06)"}`,minHeight:54,marginBottom:8,transition:"border-color .3s"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}>
                {listening&&<div style={{width:5,height:5,borderRadius:"50%",background:C.teal,animation:"pulse 1s infinite",boxShadow:`0 0 6px ${C.teal}`}}/>}
                <span style={{color:listening?C.teal:"rgba(255,255,255,.25)",fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase"}}>{listening?"Mic active — keep going":"Standby"}</span>
              </div>
              <div style={{color:"#fff",fontSize:13,lineHeight:1.7}}>
                {liveText&&<span>{liveText}</span>}
                {interimText&&!liveText.endsWith(interimText)&&<span style={{color:"rgba(255,255,255,.35)",fontStyle:"italic"}}> {interimText}</span>}
                {!liveText&&!interimText&&<span style={{color:"rgba(255,255,255,.2)",fontStyle:"italic"}}>Start speaking…</span>}
              </div>
            </div>
          )}

          {phase==="done-q"&&loadingFeedback&&<div className="glass" style={{borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,color:"rgba(255,255,255,.5)",fontSize:13}}><Spin size={14} color={C.violet}/> Scoring your answer…</div>}
          {phase==="done-q"&&!loadingFeedback&&feedback&&(
            <div className="glass-strong" style={{borderRadius:14,padding:"14px 18px",border:`1px solid ${feedback.score>=75?C.green+"40":feedback.score>=50?C.violet+"40":C.red+"40"}`,animation:"slideIn .3s ease forwards"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                <div style={{width:46,height:46,borderRadius:12,background:feedback.score>=75?`${C.green}15`:feedback.score>=50?`${C.violet}15`:`${C.red}15`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,flexShrink:0,color:feedback.score>=75?C.green:feedback.score>=50?C.violetL:C.red,fontFamily:"JetBrains Mono,monospace"}}>{feedback.score}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:"#fff",fontWeight:700,fontSize:13,marginBottom:3}}>{feedback.score>=75?"Strong answer ✓":feedback.score>=50?"Solid attempt":"Needs work"}</div>
                  {feedback.tip&&<div style={{color:"rgba(255,255,255,.6)",fontSize:12,lineHeight:1.65}}>{feedback.tip}</div>}
                  {feedback.what_was_good&&<div style={{color:C.green,fontSize:11.5,marginTop:4}}>✓ {feedback.what_was_good}</div>}
                  {feedback.missing&&<div style={{color:C.gold,fontSize:11.5,marginTop:2}}>Missing: {feedback.missing}</div>}
                </div>
                <button onClick={()=>onNext(qIndex)} style={{padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer",background:isLast?`linear-gradient(135deg,${C.violetD},${C.violet})`:`linear-gradient(135deg,${C.tealD},${C.teal})`,color:isLast?"#fff":C.bg,fontWeight:800,fontSize:12,fontFamily:"'Inter',sans-serif",flexShrink:0}}>
                  {isLast?"Report →":"Next →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── CAMERA PiP — FIXED ──────────────────────────────────────────────
            Key fixes:
            1. playsInline + autoPlay attrs on video element
            2. muted required for autoplay policy
            3. transform: scaleX(-1) for mirror effect
            4. explicit width/height/objectFit
        */}
        <div style={{position:"absolute",top:80,right:20,width:152,height:108,borderRadius:12,overflow:"hidden",border:`2px solid ${camReady?C.violet+"60":"rgba(255,255,255,.12)"}`,background:"#111",zIndex:15,boxShadow:"0 8px 32px rgba(0,0,0,.6)"}}>
          {/* Video element always rendered; srcObject set in useEffect */}
          <video
            ref={videoRef}
            muted
            autoPlay
            playsInline
            style={{width:"100%",height:"100%",objectFit:"cover",transform:"scaleX(-1)",display:"block",background:"#0d1220"}}
          />
          {!camReady&&!camErr&&(
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,background:"#0d1220"}}>
              <Spin size={16}/>
              <span style={{color:"rgba(255,255,255,.3)",fontSize:9}}>Camera…</span>
            </div>
          )}
          {camErr&&(
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,background:"#0d1220"}}>
              <span style={{fontSize:22}}>📷</span>
              <span style={{color:"rgba(255,255,255,.3)",fontSize:9}}>No camera</span>
            </div>
          )}
          {micMuted&&<div style={{position:"absolute",top:6,right:6,background:C.red,borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>🔇</div>}
          <div style={{position:"absolute",bottom:5,left:7,background:"rgba(0,0,0,.6)",borderRadius:5,padding:"2px 6px",fontSize:9,color:camReady?"rgba(255,255,255,.8)":"rgba(255,255,255,.4)",fontWeight:700}}>{camReady?"● You":"…"}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{background:"rgba(4,6,14,.97)",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"center",gap:14,flexShrink:0,borderTop:"1px solid rgba(255,255,255,.05)"}}>
        {phase==="answering"&&(
          <>
            <button onClick={onToggleMic} style={{width:46,height:46,borderRadius:"50%",border:`1px solid ${micMuted?C.red+"60":"rgba(255,255,255,.1)"}`,cursor:"pointer",background:micMuted?`${C.red}20`:"rgba(255,255,255,.06)",color:"#fff",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",fontFamily:"'Inter',sans-serif"}}>
              {micMuted?"🔇":"🎙️"}
            </button>
            <button onClick={()=>onFinish(qIndex)} style={{padding:"12px 36px",borderRadius:24,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.violetD},${C.violet},${C.violetL})`,color:"#fff",fontWeight:800,fontSize:14,fontFamily:"'Inter',sans-serif",boxShadow:`0 4px 24px ${C.violet}50`,letterSpacing:.3}}>
              Done ✓
            </button>
            <button onClick={onEnd} style={{width:46,height:46,borderRadius:"50%",border:`1px solid rgba(239,68,68,.3)`,cursor:"pointer",background:"rgba(239,68,68,.1)",color:C.red,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif"}}>📵</button>
          </>
        )}
        {phase==="speaking"&&<div style={{color:"rgba(255,255,255,.3)",fontSize:13}}>Priya is speaking — your mic activates next…</div>}
        {phase==="done-q"&&!feedback&&!loadingFeedback&&<div style={{color:"rgba(255,255,255,.25)",fontSize:13}}>Analyzing…</div>}
      </div>
    </div>
  );
}

// ── JOBS TAB — WITH SHARE + LINKEDIN/NAUKRI TIPS ─────────────────────────────
function JobsTab({onPracticeForJob}){
  const[jobs,setJobs]=useState([]);
  const[loading,setLoading]=useState(true);
  const[search,setSearch]=useState(()=>sessionStorage.getItem("tp_s")||"fresher");
  const[location,setLocation]=useState(()=>sessionStorage.getItem("tp_l")||"india");
  const[expanded,setExpanded]=useState(null);
  const[saved,setSaved]=useState([]);
  const[toast,setToast]=useState(null); // {msg}
  const[sharing,setSharing]=useState(null); // jobId being shared

  const quickRoles=["Fresher","React","Node.js","Python","Java","Data Analyst","Full Stack","DevOps","AI ML","UI UX"];

  useEffect(()=>{fetchJobs();},[]);

  const fetchJobs=async(q=search,loc=location)=>{
    setLoading(true);sessionStorage.setItem("tp_s",q);sessionStorage.setItem("tp_l",loc);
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
        postedRaw:new Date(j.created),
        category:j.category?.label||"Technology",
      })):[]);
    }catch(e){console.error(e);}
    setLoading(false);
  };

  const getFreshness=(date)=>{
    const hours=Math.floor((new Date()-date)/3600000);
    if(hours<24)return{label:"New",color:C.green};
    if(hours<72)return{label:"Recent",color:C.teal};
    return null;
  };

  const handleShare=async(job)=>{
    setSharing(job.id);
    const result=await shareJob(job,APP_URL);
    setSharing(null);
    if(result==="shared") setToast({msg:"Shared successfully!"});
    else if(result==="copied") setToast({msg:"Link copied to clipboard!"});
  };

  // Quick apply via LinkedIn Jobs or Naukri
  const openLinkedIn=(job)=>{
    const q=encodeURIComponent(`${job.title} ${job.company}`);
    window.open(`https://www.linkedin.com/jobs/search/?keywords=${q}&location=India`,"_blank");
  };
  const openNaukri=(job)=>{
    const q=encodeURIComponent(`${job.title} ${job.company}`);
    window.open(`https://www.naukri.com/${job.title.toLowerCase().replace(/\s+/g,"-")}-jobs?k=${q}&l=india`,"_blank");
  };

  return(
    <div>
      {toast&&<ShareToast msg={toast.msg} onDone={()=>setToast(null)}/>}

      <div style={{fontWeight:900,fontSize:22,color:C.ink,marginBottom:4,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>🔥 Live Job Feed</div>
      <div style={{color:C.soft,fontSize:13.5,marginBottom:16,lineHeight:1.7}}>Real fresher openings across India · Updated daily · Practice + share any role in 1 tap</div>

      {/* Search */}
      <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.soft,marginBottom:5,textTransform:"uppercase",letterSpacing:.6}}>Role / Keyword</div>
            <input style={inp} placeholder="fresher, React, Python…" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()} onFocus={ev=>ev.target.style.borderColor=C.violet} onBlur={ev=>ev.target.style.borderColor=C.border}/>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.soft,marginBottom:5,textTransform:"uppercase",letterSpacing:.6}}>Location</div>
            <input style={inp} placeholder="india, hyderabad…" value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()} onFocus={ev=>ev.target.style.borderColor=C.violet} onBlur={ev=>ev.target.style.borderColor=C.border}/>
          </div>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
          {quickRoles.map(r=>(
            <button key={r} onClick={()=>{setSearch(r.toLowerCase());fetchJobs(r.toLowerCase(),location);}}
              style={{padding:"4px 12px",borderRadius:20,border:`1px solid ${search===r.toLowerCase()?C.violet:C.border}`,background:search===r.toLowerCase()?C.violetPale:"transparent",color:search===r.toLowerCase()?C.violetL:C.soft,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>{r}</button>
          ))}
        </div>
        <Btn v="violet" onClick={()=>fetchJobs()} style={{width:"100%"}}>🔍 Search Jobs</Btn>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:15,color:C.ink}}>Results</div>
        {!loading&&jobs.length>0&&(
          <div style={{display:"flex",alignItems:"center",gap:6,background:C.greenPale,borderRadius:20,padding:"4px 12px",border:`1px solid ${C.green}25`}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/>
            <span style={{color:C.green,fontSize:11,fontWeight:700}}>{jobs.length} live openings</span>
          </div>
        )}
      </div>

      {loading&&<div style={{textAlign:"center",padding:"60px 0"}}><Spin size={34}/></div>}

      {!loading&&jobs.map((job,i)=>{
        const isExp=expanded===job.id;
        const isSaved=saved.includes(job.id);
        const freshness=getFreshness(job.postedRaw);
        const isSharing=sharing===job.id;

        return(
          <div key={job.id} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:16,padding:16,marginBottom:10,borderLeft:`3px solid ${C.violet}40`,transition:"border-color .2s,box-shadow .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.violet+"60";e.currentTarget.style.boxShadow=`0 4px 20px rgba(0,0,0,.3)`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>

            {/* Header row */}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,gap:8}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                  <div style={{fontWeight:700,fontSize:14,color:C.ink}}>{job.title}</div>
                  {freshness&&<Tag color={freshness.color} size={10}>{freshness.label}</Tag>}
                </div>
                <div style={{color:C.soft,fontSize:12}}>{job.company} · {job.location}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{color:C.green,fontWeight:700,fontSize:13,fontFamily:"JetBrains Mono,monospace"}}>{job.salary}</div>
                <div style={{color:C.muted,fontSize:11,marginTop:1}}>{job.posted}</div>
              </div>
            </div>

            {/* Description */}
            <div style={{color:C.soft,fontSize:12.5,lineHeight:1.7,marginBottom:12,background:"rgba(255,255,255,.02)",borderRadius:8,padding:"8px 10px"}}>
              {isExp?job.description.replace(/<[^>]+>/g,""):job.desc200.replace(/<[^>]+>/g,"")+(job.description.length>200?"…":"")}
              {job.description.length>200&&(
                <button onClick={()=>setExpanded(isExp?null:job.id)} style={{background:"none",border:"none",color:C.violet,fontSize:11,cursor:"pointer",marginLeft:5,fontFamily:"'Inter',sans-serif",fontWeight:700}}>
                  {isExp?"Less ▲":"More ▼"}
                </button>
              )}
            </div>

            {/* ── ACTIONS ROW ── */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <Tag color={C.teal} size={11}>{job.category}</Tag>

              <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>

                {/* 🎙 Practice — goes to Resume Interview */}
                <button
                  onClick={()=>onPracticeForJob&&onPracticeForJob(job.company,job.title)}
                  title="Practice for this role on TakePlace"
                  style={{padding:"6px 11px",borderRadius:8,border:`1px solid ${C.violet}35`,background:C.violetPale,color:C.violetL,fontSize:11,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
                  🎙 Practice
                </button>

                {/* 📤 Share — share this job + TakePlace link */}
                <button
                  onClick={()=>handleShare(job)}
                  disabled={isSharing}
                  title="Share this job with friends"
                  style={{padding:"6px 11px",borderRadius:8,border:`1px solid ${C.teal}35`,background:"rgba(0,212,170,.1)",color:C.teal,fontSize:11,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700,display:"flex",alignItems:"center",gap:4,opacity:isSharing?.7:1}}>
                  {isSharing?<Spin size={10} color={C.teal}/>:"📤"} Share
                </button>

                {/* ⭐ Save */}
                <button
                  onClick={()=>setSaved(s=>s.includes(job.id)?s.filter(x=>x!==job.id):[...s,job.id])}
                  title={isSaved?"Unsave":"Save job"}
                  style={{padding:"6px 10px",borderRadius:8,border:`1px solid ${isSaved?C.gold+"50":C.border}`,background:isSaved?C.goldPale:"transparent",cursor:"pointer",fontSize:13,color:isSaved?C.gold:C.soft,fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>
                  {isSaved?"★":"☆"}
                </button>

                {/* LinkedIn quick search */}
                <button
                  onClick={()=>openLinkedIn(job)}
                  title="Search on LinkedIn Jobs"
                  style={{padding:"6px 10px",borderRadius:8,border:"1px solid rgba(10,102,194,.4)",background:"rgba(10,102,194,.12)",color:"#0A66C2",fontSize:10,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:800,display:"flex",alignItems:"center",gap:4}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  in
                </button>

                {/* Naukri quick search */}
                <button
                  onClick={()=>openNaukri(job)}
                  title="Search on Naukri"
                  style={{padding:"6px 10px",borderRadius:8,border:"1px solid rgba(255,82,0,.35)",background:"rgba(255,82,0,.1)",color:"#FF5200",fontSize:10,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:800,display:"flex",alignItems:"center",gap:4}}>
                  🏢 Naukri
                </button>

                {/* Apply → direct link */}
                <Btn v="primary" onClick={()=>window.open(job.url,"_blank")} small>Apply →</Btn>
              </div>
            </div>

            {/* ── SHARE NUDGE (viral hook) ── */}
            <div style={{marginTop:10,padding:"8px 12px",background:`linear-gradient(135deg,${C.violet}08,${C.teal}06)`,borderRadius:8,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{fontSize:11,color:C.soft}}>🚀 Know someone for this role?</span>
              <button
                onClick={()=>handleShare(job)}
                style={{padding:"4px 12px",borderRadius:20,border:`1px solid ${C.violet}30`,background:C.violetPale,color:C.violetL,fontSize:11,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>
                Share + Earn Credits
              </button>
              <span style={{fontSize:10,color:C.muted}}>They'll land on TakePlace to practice first</span>
            </div>
          </div>
        );
      })}

      {!loading&&jobs.length===0&&(
        <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
          <div style={{fontSize:40,marginBottom:12}}>🔍</div>
          <div style={{fontWeight:700,color:C.ink2}}>No jobs found.</div>
          <div style={{fontSize:13,marginTop:4}}>Try a different role or city.</div>
        </div>
      )}
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({user,onStartInterview,onGoToJobs,stats}){
  const name=user?.user_metadata?.full_name?.split(" ")[0]||"there";
  const results=stats?.results||[];
  const streak=stats?.streak||{streak:0,longest:0};
  const scores=results.map(r=>r.overall_score);
  const latestScore=scores[0]||0;
  const prevScore=scores[1]||0;
  const delta=latestScore-prevScore;
  const avgScore=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
  const skillAvg={
    technical:results.length?Math.round(results.reduce((a,r)=>a+(r.technical_score||0),0)/results.length):0,
    communication:results.length?Math.round(results.reduce((a,r)=>a+(r.communication_score||0),0)/results.length):0,
    confidence:results.length?Math.round(results.reduce((a,r)=>a+(r.confidence_score||0),0)/results.length):0,
    structure:results.length?Math.round(results.reduce((a,r)=>a+(r.structure_score||0),0)/results.length):0,
    resumeFit:results.length?Math.round(results.reduce((a,r)=>a+(r.resume_fit_score||0),0)/results.length):0,
  };
  const weakest=Object.entries(skillAvg).sort((a,b)=>a[1]-b[1])[0];
  const skillNames={technical:"Technical",communication:"Communication",confidence:"Confidence",structure:"Structure",resumeFit:"Resume Fit"};
  const hour=new Date().getHours();
  const greeting=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  return(
    <div className="fade" style={{paddingBottom:20}}>
      <div style={{background:`linear-gradient(135deg,${C.bgCard},${C.bgSurf})`,border:`1px solid ${C.border}`,borderRadius:20,padding:"24px",marginBottom:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${C.violet}08,transparent 70%)`,pointerEvents:"none"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{color:C.soft,fontSize:13,marginBottom:6}}>{greeting}, {name} 👋</div>
            {streak.streak>0?(
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:24,animation:"streakPop 2s ease infinite"}}>🔥</span>
                <div>
                  <div style={{fontWeight:900,fontSize:22,fontFamily:"'Plus Jakarta Sans',sans-serif",color:C.ink}}>{streak.streak}-day streak</div>
                  <div style={{color:C.soft,fontSize:12}}>Longest: {streak.longest} days · Keep it going!</div>
                </div>
              </div>
            ):(
              <div style={{fontWeight:800,fontSize:20,color:C.ink,marginBottom:6,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Start your first interview today</div>
            )}
            {weakest&&weakest[1]>0&&(
              <div style={{background:`${C.gold}10`,border:`1px solid ${C.gold}25`,borderRadius:10,padding:"8px 14px",display:"inline-block"}}>
                <span style={{color:C.gold,fontSize:12,fontWeight:700}}>💡 Focus area: {skillNames[weakest[0]]} ({weakest[1]}%)</span>
              </div>
            )}
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <Btn v="violet" onClick={onStartInterview} style={{padding:"11px 22px",fontSize:13}}>🎙️ Practice now</Btn>
            <Btn v="ghost" onClick={onGoToJobs} style={{padding:"11px 18px",fontSize:13}}>Browse jobs →</Btn>
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:16}}>
        {[
          {label:"Interviews",value:results.length,icon:"🎯",color:C.violet,mono:true},
          {label:"Avg score",value:`${avgScore}%`,icon:"📊",color:C.teal,mono:true},
          {label:"Last score",value:`${latestScore}%`,icon:"⚡",color:scores.length?C.green:C.muted,mono:true,delta:scores.length>1?delta:null},
          {label:"Best streak",value:`${streak.longest}d`,icon:"🔥",color:C.gold,mono:true},
        ].map(({label,value,icon,color,mono,delta})=>(
          <div key={label} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:12,right:12,fontSize:20,opacity:.5}}>{icon}</div>
            <div style={{color:C.soft,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.7,marginBottom:8}}>{label}</div>
            <div className={mono?"mono":""} style={{fontWeight:900,fontSize:26,color,lineHeight:1}}>{value}</div>
            {delta!==null&&delta!==undefined&&<div style={{fontSize:11,color:delta>=0?C.green:C.red,marginTop:4,fontWeight:700}}>{delta>=0?`↑ +${delta}`:` ↓ ${delta}`} pts</div>}
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:16,padding:"20px"}}>
          <div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:4}}>Skill profile</div>
          <div style={{color:C.soft,fontSize:12,marginBottom:16}}>{results.length?`Based on ${results.length} interview${results.length>1?"s":""}`:""}</div>
          {results.length>0?(
            <div style={{display:"flex",justifyContent:"center"}}><SkillRadar scores={skillAvg} size={190}/></div>
          ):(
            <div style={{textAlign:"center",padding:"30px 0",color:C.muted,fontSize:13}}>
              <div style={{fontSize:32,marginBottom:8}}>📊</div>Complete your first interview to see your skill radar
            </div>
          )}
        </div>
        <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:16,padding:"20px"}}>
          <div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:4}}>Score trajectory</div>
          <div style={{color:C.soft,fontSize:12,marginBottom:16}}>{scores.length>1?"Improving over time":scores.length===1?"1 interview done — keep practicing":"No data yet"}</div>
          {scores.length>1?(
            <>
              <Sparkline data={[...scores].reverse()} width={230} height={60} color={C.violet}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
                <div style={{textAlign:"center"}}><div className="mono" style={{fontSize:20,fontWeight:700,color:C.soft}}>{scores[scores.length-1]}%</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>First</div></div>
                <div style={{textAlign:"center"}}><div className="mono" style={{fontSize:20,fontWeight:700,color:C.violet}}>{scores[0]}%</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>Latest</div></div>
              </div>
            </>
          ):(
            <div style={{textAlign:"center",padding:"30px 0",color:C.muted,fontSize:13}}>
              <div style={{fontSize:32,marginBottom:8}}>📈</div>{scores.length===1?"Do one more to see your trend":"Practice 2+ interviews to unlock"}
            </div>
          )}
        </div>
      </div>

      {results.length>0&&(
        <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:16,padding:"20px",marginBottom:16}}>
          <div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:14}}>Recent interviews</div>
          {results.slice(0,5).map((r,i)=>{
            const sc=r.overall_score>=75?C.green:r.overall_score>=55?C.gold:C.red;
            const verdict=r.overall_score>=85?"Strong Hire":r.overall_score>=70?"Hire":r.overall_score>=55?"Borderline":"No Hire";
            return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<Math.min(results.length,5)-1?`1px solid ${C.border}`:"none"}}>
                <div style={{width:42,height:42,borderRadius:10,background:`${sc}15`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"JetBrains Mono,monospace",fontWeight:700,fontSize:14,color:sc,flexShrink:0}}>{r.overall_score}</div>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.ink}}>{r.role||"Interview"}{r.company?` · ${r.company}`:""}</div><div style={{color:C.soft,fontSize:12,marginTop:1}}>{new Date(r.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div></div>
                <Tag color={sc} size={11}>{verdict}</Tag>
              </div>
            );
          })}
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div className="lift" onClick={onStartInterview} style={{background:`linear-gradient(135deg,${C.violetD}20,${C.violet}15)`,border:`1px solid ${C.violet}25`,borderRadius:16,padding:"20px",cursor:"pointer"}}>
          <div style={{fontSize:28,marginBottom:10}}>🎯</div>
          <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:4}}>Resume Interview</div>
          <div style={{color:C.soft,fontSize:12,lineHeight:1.6}}>Upload your resume, pick your company — get a fully personalized interview</div>
        </div>
        <div className="lift" onClick={onGoToJobs} style={{background:`linear-gradient(135deg,${C.tealD}15,${C.teal}10)`,border:`1px solid ${C.teal}20`,borderRadius:16,padding:"20px",cursor:"pointer"}}>
          <div style={{fontSize:28,marginBottom:10}}>🔥</div>
          <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:4}}>Live Job Feed</div>
          <div style={{color:C.soft,fontSize:12,lineHeight:1.6}}>Real fresher openings across India · updated daily · with 1-tap practice</div>
        </div>
      </div>
    </div>
  );
}

// ── RESUME INTERVIEW TAB ──────────────────────────────────────────────────────
function ResumeInterviewTab({user,onInterviewComplete,prefillCompany,prefillRole}){
  const[step,setStep]=useState("setup");
  const[resumeText,setResumeText]=useState("");
  const[company,setCompany]=useState(prefillCompany||"");
  const[jobTitle,setJobTitle]=useState(prefillRole||"");
  const[difficulty,setDifficulty]=useState("Fresher");
  const[fileName,setFileName]=useState("");
  const[profile,setProfile]=useState(null);
  const[questions,setQuestions]=useState([]);
  const[genErr,setGenErr]=useState("");
  const[qIndex,setQIndex]=useState(0);
  const[answers,setAnswers]=useState([]);
  const[aiSpeaking,setAiSpeaking]=useState(false);
  const[listening,setListening]=useState(false);
  const[liveText,setLiveText]=useState("");
  const[interimText,setInterimText]=useState("");
  const[timeLeft,setTimeLeft]=useState(90);
  const[phase,setPhase]=useState("idle");
  const[feedback,setFeedback]=useState(null);
  const[loadingFeedback,setLoadingFeedback]=useState(false);
  const[micMuted,setMicMuted]=useState(false);
  const[report,setReport]=useState(null);
  const[fillerCount,setFillerCount]=useState(0);
  const[liveMetrics,setLiveMetrics]=useState({pace:50,clarity:60});
  const[sharingCard,setSharingCard]=useState(false);

  const recogRef=useRef(null);
  const finalRef=useRef("");
  const timerRef=useRef(null);
  const fileRef=useRef();
  const metricsTimerRef=useRef(null);
  const QTIME=90;
  const speechOK=typeof window!=="undefined"&&(window.SpeechRecognition||window.webkitSpeechRecognition);
  const ttsOK=typeof window!=="undefined"&&window.speechSynthesis;

  useEffect(()=>()=>{clearInterval(timerRef.current);clearInterval(metricsTimerRef.current);stopRec();window.speechSynthesis?.cancel();},[]);

  useEffect(()=>{
    if(phase==="answering"){
      metricsTimerRef.current=setInterval(()=>{
        const words=finalRef.current.trim().split(/\s+/).filter(Boolean).length;
        const elapsed=QTIME-timeLeft;
        const wpm=elapsed>0?Math.round((words/(elapsed/60))):0;
        const pace=Math.min(100,Math.max(10,Math.round((wpm/160)*100)));
        const clarity=Math.min(100,Math.max(20,60+Math.random()*20));
        const fd=detectFillers(finalRef.current);
        setFillerCount(fd.total);setLiveMetrics({pace,clarity});
      },3000);
    }else clearInterval(metricsTimerRef.current);
    return()=>clearInterval(metricsTimerRef.current);
  },[phase,timeLeft]);

  const handleFile=async(e)=>{
    const f=e.target.files[0];if(!f)return;setFileName(f.name);
    try{
      let text="";
      if(f.name.endsWith(".pdf"))text=await extractPDF(f);
      else if(f.name.endsWith(".docx"))text=await extractDOCX(f);
      else{const r=new FileReader();r.onload=ev=>setResumeText(ev.target.result);r.readAsText(f);return;}
      setResumeText(text);
    }catch(e2){setGenErr("Could not read file: "+e2.message);}
  };

  const analyze=async()=>{
    if(!resumeText.trim())return;setStep("analyzing");setGenErr("");
    try{
      const raw=await callGroq(`You are a senior ${jobTitle||"tech"} interviewer${company?` at ${company}`:""}.Experience level: ${difficulty}.Read this resume carefully. Generate exactly 8 highly personalized interview questions.Resume:---${resumeText.slice(0,3500)}---Rules:- Reference specific projects, companies, technologies from THIS resume- Mix: 1 intro, 4 technical (dig into actual tech stack/projects), 2 behavioral, 1 closing${company?`- Ask what drew them to ${company} specifically`:""}Return ONLY:{"profile":{"name":"<from resume or Candidate>","topSkills":["s1","s2","s3","s4"],"keyProjects":["p1","p2","p3"],"experienceLevel":"<Fresher|Junior|Mid>","university":"<if found>"},"questions":[{"q":"<personalized spoken question>","type":"Intro|Technical|Behavioral|Closing","whyAsked":"<1 sentence>","keywords":["k1","k2","k3"]}]}`,2200);
      const data=safeJSON(raw,null);
      if(!data?.questions?.length)throw new Error("parse fail");
      setProfile(data.profile);setQuestions(data.questions);setStep("brief");
    }catch(e){
      console.error(e);setGenErr("⚠ AI unavailable — using standard questions.");
      setQuestions(FALLBACK_QUESTIONS.map(q=>({...q,keywords:[]})));
      setProfile({name:"Candidate",topSkills:[],keyProjects:[],experienceLevel:difficulty});setStep("brief");
    }
  };

  const speak=useCallback((text)=>new Promise(resolve=>{
    if(!ttsOK){resolve();return;}
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);u.rate=0.95;u.pitch=1.05;
    const voices=window.speechSynthesis.getVoices();
    const v=voices.find(v=>/en-(US|GB|IN)/i.test(v.lang)&&/Female|Samantha|Karen|Moira|Veena|Raveena|Google UK English Female/i.test(v.name))||voices.find(v=>/en/i.test(v.lang));
    if(v)u.voice=v;setAiSpeaking(true);
    u.onend=()=>{setAiSpeaking(false);resolve();};u.onerror=()=>{setAiSpeaking(false);resolve();};
    window.speechSynthesis.speak(u);
  }),[ttsOK]);

  const stopRec=()=>{try{recogRef.current?.stop();}catch{}setListening(false);setInterimText("");};
  const startRec=()=>{
    if(!speechOK)return;stopRec();
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const rec=new SR();
    rec.continuous=true;rec.interimResults=true;rec.lang="en-US";
    finalRef.current="";setLiveText("");setInterimText("");
    rec.onresult=(e)=>{let fa="",ia="";for(let i=0;i<e.results.length;i++){if(e.results[i].isFinal)fa+=e.results[i][0].transcript;else ia+=e.results[i][0].transcript;}finalRef.current=fa;setLiveText(fa.trim());setInterimText(ia.trim());};
    rec.onerror=()=>{};rec.onend=()=>setListening(false);recogRef.current=rec;
    try{rec.start();setListening(true);}catch{}
  };

  const beginQ=async(idx)=>{
    setPhase("speaking");setLiveText("");setInterimText("");setFeedback(null);setFillerCount(0);finalRef.current="";
    const intro=idx===0?`Hello! I'm Priya Sharma, Senior Hiring Manager${company?` at ${company}`:""}. Thank you for joining today. I've reviewed your resume and I'm impressed by your background. Let's begin. `:"";
    await speak(intro+questions[idx].q);
    setPhase("answering");setTimeLeft(QTIME);startRec();
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{setTimeLeft(t=>{if(t<=1){clearInterval(timerRef.current);finishQ(idx);return 0;}return t-1;});},1000);
  };

  const reactionLine=(score)=>{
    const s=["Nice, that was a strong answer.","Great, that's exactly what I was looking for.","Good, I like that example."];
    const m=["Okay, noted.","Alright, that works.","Got it, thanks."];
    const w=["Hmm, let's move on.","Okay, that one was a bit thin.","Noted — let's continue."];
    return(score>=75?s:score>=50?m:w)[Math.floor(Math.random()*3)];
  };

  const finishQ=async(idx)=>{
    clearInterval(timerRef.current);stopRec();setPhase("done-q");
    const ans=(finalRef.current||liveText||"").trim()||"(no answer captured)";
    const fd=detectFillers(ans);
    setAnswers(prev=>{const n=[...prev];n[idx]={question:questions[idx].q,type:questions[idx].type,answer:ans,fillerCount:fd.total,fillerWords:fd.found};return n;});
    setLoadingFeedback(true);
    let fb;
    try{
      const raw=await callGroq(`You are a strict senior interviewer${company?` at ${company}`:""} for ${jobTitle||"the role"} (${difficulty}).Question (${questions[idx].type}): ${questions[idx].q}\nAnswer: ${ans.slice(0,900)}\nFiller words detected: ${fd.total} (${Object.keys(fd.found).join(", ")||"none"})\n${profile?"Candidate skills: "+profile.topSkills?.join(", "):""}\nReturn ONLY: {"score":<0-100>,"tip":"<2-3 sentence specific actionable feedback>","what_was_good":"<1 sentence or null>","missing":"<what was missing>","fillerNote":"<1 sentence or null>"}`,500);
      fb=safeJSON(raw,{score:55,tip:"Keep practicing with more structured answers.",what_was_good:null,missing:"Specific examples and metrics"});
    }catch{fb={score:55,tip:"AI feedback unavailable. Check /api/ai route.",what_was_good:null};}
    setFeedback(fb);setLoadingFeedback(false);speak(reactionLine(fb.score));
  };

  const nextQ=(idx)=>{
    setFeedback(null);
    if(idx+1<questions.length){setQIndex(idx+1);beginQ(idx+1);}else wrapUp();
  };

  const startInterview=()=>{setStep("room");setAnswers([]);setQIndex(0);setFeedback(null);setTimeout(()=>beginQ(0),600);};

  const wrapUp=async()=>{
    setPhase("idle");window.speechSynthesis?.cancel();setStep("genreport");
    try{
      const transcript=answers.map((a,i)=>`Q${i+1} (${a.type}): ${a.question}\nAnswer: ${a.answer}\nFiller words: ${a.fillerCount||0}`).join("\n\n");
      const raw=await callGroq(`You are a strict senior hiring panel${company?` at ${company}`:""} evaluating ${profile?.name||"the candidate"} for ${jobTitle||"a role"} (${difficulty}).\n${transcript.slice(0,4500)}\nResume skills: ${profile?.topSkills?.join(", ")||"N/A"}\nProjects: ${profile?.keyProjects?.join(", ")||"N/A"}\nReturn ONLY:\n{"overallScore":<0-100>,"verdict":"<Strong Hire|Hire|Borderline|No Hire>","communicationScore":<0-100>,"technicalScore":<0-100>,"confidenceScore":<0-100>,"structureScore":<0-100>,"resumeAlignmentScore":<0-100>,"summary":"<4-5 sentence brutally honest assessment>","companyFitNote":"<2 sentence about ${company||"company"} fit>","perQuestion":[{"question":"<short>","score":<0-100>,"feedback":"<2 sentence specific>","idealAnswer":"<2-3 sentence ideal STAR answer>"}],"strengths":["<s1>","<s2>","<s3>"],"improvements":["<i1>","<i2>","<i3>","<i4>"],"nextSteps":["<step1>","<step2>","<step3>"]}`,2800);
      const data=safeJSON(raw,null);
      if(!data?.overallScore)throw new Error("bad");
      setReport(data);
      await saveInterviewResult(user?.id,{...data,company,role:jobTitle});
      onInterviewComplete&&onInterviewComplete();
    }catch(e){setReport({overallScore:0,verdict:"—",communicationScore:0,technicalScore:0,confidenceScore:0,structureScore:0,resumeAlignmentScore:0,summary:"⚠ Couldn't generate report — check /api/ai.",companyFitNote:"",perQuestion:[],strengths:[],improvements:[],nextSteps:[]});}
    setStep("report");
  };

  const endInterview=()=>{
    window.speechSynthesis?.cancel();stopRec();clearInterval(timerRef.current);
    if(answers.length>0)wrapUp();else{setStep("setup");setPhase("idle");}
  };

  const shareCard=async()=>{
    if(!report)return;setSharingCard(true);
    try{await generateScorecard({...report,company,role:jobTitle});}
    catch(e){alert("Could not generate card: "+e.message);}
    setSharingCard(false);
  };

  const sc=s=>s>=75?C.green:s>=50?C.gold:C.red;

  if(step==="setup")return(
    <div className="fade">
      <div style={{marginBottom:22}}>
        <div style={{fontWeight:900,fontSize:22,color:C.ink,marginBottom:5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>🎯 Resume-Powered Interview</div>
        <div style={{color:C.soft,fontSize:13.5,lineHeight:1.75,maxWidth:580}}>Upload your resume. Tell us the company and role. Our AI reads your <em>actual</em> experience and asks exactly what a real interviewer would ask <strong style={{color:C.ink}}>you specifically</strong> — on camera, on mic, on the clock.</div>
      </div>
      {genErr&&<div style={{background:C.goldPale,border:`1px solid ${C.gold}30`,borderRadius:10,padding:"10px 14px",marginBottom:14,color:C.gold,fontSize:12.5}}>⚠ {genErr}</div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:C.soft,marginBottom:5,textTransform:"uppercase",letterSpacing:.7}}>Target Company</div>
          <input style={inp} placeholder="e.g. Google, Amazon, TCS, Wipro…" value={company} onChange={e=>setCompany(e.target.value)} onFocus={e=>e.target.style.borderColor=C.violet} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.08)"}/>
          <div style={{fontSize:11,color:C.muted,marginTop:4}}>AI mirrors that company's real interview style</div>
        </div>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:C.soft,marginBottom:5,textTransform:"uppercase",letterSpacing:.7}}>Role Applying For</div>
          <input style={inp} placeholder="e.g. Software Engineer, Data Analyst…" value={jobTitle} onChange={e=>setJobTitle(e.target.value)} onFocus={e=>e.target.style.borderColor=C.violet} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.08)"}/>
        </div>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:C.soft,marginBottom:7,textTransform:"uppercase",letterSpacing:.7}}>Experience Level</div>
        <div style={{display:"flex",gap:8}}>
          {["Fresher","1–2 years","3–5 years"].map(d=><button key={d} onClick={()=>setDifficulty(d)} style={{flex:1,padding:"10px",borderRadius:10,border:`1px solid ${difficulty===d?C.violet:C.border}`,background:difficulty===d?C.violetPale:"transparent",color:difficulty===d?C.violetL:C.soft,fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>{d}</button>)}
        </div>
      </div>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
          <div style={{fontSize:11,fontWeight:700,color:C.soft,textTransform:"uppercase",letterSpacing:.7}}>Your Resume</div>
          <button onClick={()=>fileRef.current.click()} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${C.violet}30`,background:C.violetPale,color:C.violetL,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700,display:"flex",alignItems:"center",gap:6}}>📎 Upload PDF / DOCX</button>
          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFile} style={{display:"none"}}/>
        </div>
        {fileName&&<div style={{background:C.greenPale,border:`1px solid ${C.green}30`,borderRadius:8,padding:"6px 12px",marginBottom:8,fontSize:12,color:C.green,display:"flex",alignItems:"center",gap:6}}>✅ {fileName} loaded</div>}
        <textarea style={{...inp,minHeight:160,resize:"vertical",fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.7}} placeholder={`Paste your resume text here, or upload above.\n\nExample:\nRaghu Reddy | B.Tech CSE AI/ML | CGPA: 8.53\nSkills: Python, React, Node.js, MySQL, Java\nInternship: Infotact Solutions — Full Stack Developer\nProjects: TakePlace, AgriPrice ML`} value={resumeText} onChange={e=>setResumeText(e.target.value)} onFocus={e=>e.target.style.borderColor=C.violet} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.08)"}/>
      </div>
      {!speechOK&&<div style={{background:C.goldPale,border:`1px solid ${C.gold}25`,borderRadius:10,padding:"10px 14px",marginBottom:14,color:C.gold,fontSize:12}}>⚠ Voice recognition works best in Chrome on desktop or Android.</div>}
      <Btn v="violet" onClick={analyze} disabled={!resumeText.trim()} style={{width:"100%",padding:"15px",fontSize:15,borderRadius:12}}>🎙️ Analyze Resume & Start Interview →</Btn>
    </div>
  );

  if(step==="analyzing")return(
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:52,marginBottom:16,animation:"float 2s ease-in-out infinite"}}>🔍</div>
      <div style={{fontWeight:800,fontSize:20,color:C.ink,marginBottom:8,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Reading your resume…</div>
      <div style={{color:C.soft,fontSize:14,maxWidth:340,margin:"0 auto 24px",lineHeight:1.7}}>Extracting your projects, skills, and experience.{company?` Researching ${company}'s interview patterns.`:""}</div>
      <Spin size={36}/>
    </div>
  );

  if(step==="brief")return(
    <div className="fade" style={{maxWidth:580,margin:"0 auto"}}>
      <button onClick={()=>setStep("setup")} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginBottom:16,fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:4}}>← Edit resume / company</button>
      {profile&&(
        <div style={{background:`linear-gradient(160deg,${C.bgCard},${C.bgSurf})`,border:`1px solid ${C.border}`,borderRadius:18,padding:"22px 24px",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
            <div style={{width:52,height:52,borderRadius:14,background:C.violetPale,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>📄</div>
            <div style={{flex:1}}><div style={{fontWeight:800,fontSize:18,color:C.ink}}>{profile.name}</div><div style={{color:C.soft,fontSize:12,marginTop:2}}>{jobTitle||"Applied Role"} · {profile.experienceLevel||difficulty}</div></div>
            {company&&<Tag color={C.violet}>{company}</Tag>}
          </div>
          {profile.topSkills?.length>0&&<div style={{marginBottom:10}}><div style={{fontSize:9,color:C.muted,marginBottom:6,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Detected Skills</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{profile.topSkills.map((s,i)=><Tag key={i} color={C.teal} size={12}>{s}</Tag>)}</div></div>}
          {profile.keyProjects?.length>0&&<div><div style={{fontSize:9,color:C.muted,marginBottom:6,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Key Projects</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{profile.keyProjects.map((p,i)=><Tag key={i} color={C.gold} size={12}>{p}</Tag>)}</div></div>}
        </div>
      )}
      <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:18}}>
        <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:14}}>Your personalized questions ({questions.length})</div>
        {questions.map((q,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12,paddingBottom:12,borderBottom:i<questions.length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{width:24,height:24,borderRadius:7,background:C.violetPale,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.violetL,flexShrink:0}}>{i+1}</div>
            <div style={{flex:1}}><div style={{fontSize:13,color:C.ink2,lineHeight:1.65}}>{q.q}</div><div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap",alignItems:"center"}}><Tag color={C.teal} size={10}>{q.type}</Tag>{q.whyAsked&&<span style={{fontSize:10.5,color:C.muted,fontStyle:"italic"}}>{q.whyAsked}</span>}</div></div>
          </div>
        ))}
      </div>
      {genErr&&<div style={{background:C.goldPale,border:`1px solid ${C.gold}25`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.gold,marginBottom:14}}>{genErr}</div>}
      <div style={{background:C.violetPale,border:`1px solid ${C.violet}15`,borderRadius:12,padding:"14px 16px",marginBottom:20,fontSize:13,color:C.soft,lineHeight:1.8}}>
        <strong style={{color:C.ink}}>How it works:</strong> Full-screen camera. Priya speaks each question aloud. 90 seconds to answer on mic. Instant AI feedback + live confidence meter. Full report with shareable scorecard at the end.
      </div>
      <Btn v="violet" onClick={startInterview} style={{width:"100%",padding:"15px",fontSize:15,borderRadius:12}}>🎥 Enter Interview Room →</Btn>
    </div>
  );

  if(step==="room")return(
    <InterviewRoom role={jobTitle||"the role"} company={company} questions={questions} qIndex={qIndex} phase={phase} aiSpeaking={aiSpeaking} listening={listening} liveText={liveText} interimText={interimText} timeLeft={timeLeft} feedback={feedback} loadingFeedback={loadingFeedback} onFinish={finishQ} onNext={nextQ} onEnd={endInterview} onToggleMic={()=>setMicMuted(m=>!m)} micMuted={micMuted} fillerCount={fillerCount} liveMetrics={liveMetrics}/>
  );

  if(step==="genreport")return(
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:52,marginBottom:16,animation:"float 2s ease-in-out infinite"}}>📋</div>
      <div style={{fontWeight:800,fontSize:20,color:C.ink,marginBottom:8,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Building your report…</div>
      <div style={{color:C.soft,fontSize:14,maxWidth:340,margin:"0 auto 24px",lineHeight:1.7}}>Reviewing all {answers.length} answers{company?` against ${company}'s hiring bar`:""}.</div>
      <Spin size={36}/>
    </div>
  );

  if(step==="report"&&report)return(
    <div className="fade">
      <div style={{background:`linear-gradient(160deg,${C.bgCard},${C.bgSurf})`,border:`1px solid ${C.border}`,borderRadius:20,padding:"28px 22px",marginBottom:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-60,width:240,height:240,borderRadius:"50%",background:`radial-gradient(circle,${C.violet}10,transparent 70%)`,pointerEvents:"none"}}/>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:6,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700}}>{jobTitle||"Interview"}{company?` · ${company}`:""} · {difficulty}</div>
          <div className="mono" style={{fontSize:60,fontWeight:700,lineHeight:1,color:sc(report.overallScore),textShadow:`0 0 30px ${sc(report.overallScore)}50`}}>{report.overallScore}</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:10}}>/ 100</div>
          <div><span style={{background:`${sc(report.overallScore)}15`,color:sc(report.overallScore),padding:"6px 20px",borderRadius:20,fontWeight:800,fontSize:13,border:`1px solid ${sc(report.overallScore)}30`}}>{report.verdict}</span></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:18}}>
          {[["Comm.",report.communicationScore],["Technical",report.technicalScore],["Confidence",report.confidenceScore],["Structure",report.structureScore],["Resume",report.resumeAlignmentScore]].map(([l,v],i)=>(
            <div key={i} style={{textAlign:"center",background:"rgba(255,255,255,.04)",borderRadius:10,padding:"10px 4px"}}>
              <div className="mono" style={{fontWeight:700,fontSize:16,color:sc(v)}}>{v}</div>
              <div style={{fontSize:9,color:C.muted,marginTop:3,fontWeight:600,letterSpacing:.4}}>{l}</div>
              <Bar pct={v} color={sc(v)} h={2}/>
            </div>
          ))}
        </div>
        <div style={{fontSize:13.5,lineHeight:1.8,color:C.ink2,marginBottom:report.companyFitNote?12:0}}>{report.summary}</div>
        {report.companyFitNote&&<div style={{background:C.violetPale,border:`1px solid ${C.violet}20`,borderRadius:10,padding:"10px 14px",fontSize:13,color:C.violetL}}>🏢 {report.companyFitNote}</div>}
      </div>

      <div style={{background:`linear-gradient(135deg,${C.violet}12,${C.teal}08)`,border:`1px solid ${C.violet}25`,borderRadius:14,padding:"16px 20px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
        <div><div style={{fontWeight:700,fontSize:13,color:C.ink}}>📤 Share your result</div><div style={{color:C.soft,fontSize:12,marginTop:2}}>Download a LinkedIn-ready scorecard image</div></div>
        <Btn v="violet" onClick={shareCard} loading={sharingCard} small style={{padding:"9px 18px"}}>{sharingCard?"Generating…":"Download Scorecard"}</Btn>
      </div>

      {report.strengths?.length>0&&<div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}><div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:12}}>✅ What worked well</div>{report.strengths.map((s,i)=><div key={i} style={{background:C.greenPale,borderRadius:8,padding:"10px 13px",marginBottom:8,fontSize:13,color:C.ink2,border:`1px solid ${C.green}20`,display:"flex",gap:8}}><span style={{color:C.green,flexShrink:0}}>✓</span><span>{s}</span></div>)}</div>}
      {report.improvements?.length>0&&<div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}><div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:12}}>🎯 Areas to improve</div>{report.improvements.map((s,i)=><div key={i} style={{background:"rgba(255,255,255,.02)",borderRadius:8,padding:"10px 13px",marginBottom:8,border:`1px solid ${C.border}`,display:"flex",gap:9}}><span style={{color:C.gold,fontWeight:800,flexShrink:0}}>→</span><span style={{color:C.ink2,fontSize:13}}>{s}</span></div>)}</div>}
      {report.nextSteps?.length>0&&<div style={{background:C.tealPale,border:`1px solid ${C.teal}20`,borderRadius:14,padding:18,marginBottom:12}}><div style={{fontWeight:700,color:C.teal,fontSize:14,marginBottom:12}}>🚀 Your next steps</div>{report.nextSteps.map((s,i)=><div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:8,fontSize:13,color:C.ink2}}><span style={{color:C.teal,fontWeight:800,flexShrink:0}}>{i+1}.</span>{s}</div>)}</div>}

      {report.perQuestion?.length>0&&(
        <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:16}}>
          <div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:12}}>🔍 Question by question</div>
          {report.perQuestion.map((p,i)=>{
            const[exp,setExp]=useState(false);
            return(
              <div key={i} style={{background:"rgba(255,255,255,.02)",borderRadius:10,padding:"14px",marginBottom:9,border:`1px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,gap:8}}>
                  <div style={{fontWeight:600,color:C.ink,fontSize:12.5}}>Q{i+1}. {p.question}</div>
                  <div className="mono" style={{fontWeight:700,fontSize:13,color:sc(p.score),flexShrink:0}}>{p.score}%</div>
                </div>
                <div style={{color:C.soft,fontSize:12.5,lineHeight:1.7,marginBottom:6}}>{p.feedback}</div>
                <Bar pct={p.score} color={sc(p.score)}/>
                {p.idealAnswer&&<><button onClick={()=>setExp(e=>!e)} style={{background:"none",border:"none",color:C.violet,fontSize:11,cursor:"pointer",marginTop:8,fontFamily:"'Inter',sans-serif",fontWeight:700}}>{exp?"▲ Hide ideal answer":"▼ See ideal answer"}</button>{exp&&<div style={{background:C.violetPale,border:`1px solid ${C.violet}15`,borderRadius:8,padding:"10px 12px",marginTop:8,fontSize:12,color:C.ink2,lineHeight:1.7}}>{p.idealAnswer}</div>}</>}
              </div>
            );
          })}
        </div>
      )}

      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <Btn v="violet" onClick={()=>{setStep("brief");setAnswers([]);setQIndex(0);setReport(null);}} style={{flex:1,padding:"13px"}}>🔁 Retry Same</Btn>
        <Btn v="ghost" onClick={()=>{setStep("setup");setAnswers([]);setQIndex(0);setReport(null);setQuestions([]);setProfile(null);setResumeText("");setFileName("");}} style={{flex:1,padding:"13px"}}>📄 New Resume</Btn>
      </div>
    </div>
  );

  return null;
}

// ── QUICK MOCK TAB ────────────────────────────────────────────────────────────
function QuickMockTab({user,onInterviewComplete}){
  const[screen,setScreen]=useState("roles");
  const[catFilter,setCatFilter]=useState("All");
  const[role,setRole]=useState(null);
  const[difficulty,setDifficulty]=useState("Entry-level");
  const[questions,setQuestions]=useState([]);
  const[qIndex,setQIndex]=useState(0);
  const[answers,setAnswers]=useState([]);
  const[loadingQs,setLoadingQs]=useState(false);
  const[genErr,setGenErr]=useState("");
  const[aiSpeaking,setAiSpeaking]=useState(false);
  const[listening,setListening]=useState(false);
  const[liveText,setLiveText]=useState("");
  const[interimText,setInterimText]=useState("");
  const[timeLeft,setTimeLeft]=useState(90);
  const[phase,setPhase]=useState("idle");
  const[feedback,setFeedback]=useState(null);
  const[loadingFeedback,setLoadingFeedback]=useState(false);
  const[genReport,setGenReport]=useState(false);
  const[report,setReport]=useState(null);
  const[micMuted,setMicMuted]=useState(false);
  const[fillerCount,setFillerCount]=useState(0);
  const[liveMetrics,setLiveMetrics]=useState({pace:50,clarity:60});

  const recogRef=useRef(null);
  const finalRef=useRef("");
  const timerRef=useRef(null);
  const metricsRef=useRef(null);
  const QTIME=90;
  const speechOK=typeof window!=="undefined"&&(window.SpeechRecognition||window.webkitSpeechRecognition);
  const ttsOK=typeof window!=="undefined"&&window.speechSynthesis;

  useEffect(()=>()=>{clearInterval(timerRef.current);clearInterval(metricsRef.current);stopRec();window.speechSynthesis?.cancel();},[]);
  useEffect(()=>{
    if(phase==="answering"){
      metricsRef.current=setInterval(()=>{
        const words=finalRef.current.trim().split(/\s+/).filter(Boolean).length;
        const elapsed=QTIME-timeLeft;const wpm=elapsed>0?Math.round((words/(elapsed/60))):0;
        const pace=Math.min(100,Math.max(10,Math.round((wpm/160)*100)));
        const clarity=Math.min(100,Math.max(20,60+Math.random()*20));
        const fd=detectFillers(finalRef.current);setFillerCount(fd.total);setLiveMetrics({pace,clarity});
      },3000);
    }else clearInterval(metricsRef.current);
    return()=>clearInterval(metricsRef.current);
  },[phase,timeLeft]);

  const filteredRoles=catFilter==="All"?ROLES:ROLES.filter(r=>r.cat===catFilter);

  const pickRole=async(r)=>{
    setRole(r);setScreen("brief");setGenErr("");setLoadingQs(true);setQuestions([]);
    try{
      const raw=await callGroq(`You are a senior ${r.title} interviewer. Difficulty: ${difficulty}. Focus: ${r.focus}.Generate exactly 6 spoken interview questions: 1 intro, 3 technical, 1 behavioral, 1 closing.Return ONLY: {"questions":[{"q":"<question>","type":"Intro|Technical|Behavioral|Closing","keywords":["k1","k2"]}]}`,900);
      const data=safeJSON(raw,null);
      setQuestions(data?.questions?.length>=5?data.questions:FALLBACK_QUESTIONS.map(q=>({...q,keywords:[]})));
    }catch{setGenErr("⚠ AI unavailable — using standard questions.");setQuestions(FALLBACK_QUESTIONS.map(q=>({...q,keywords:[]})));}
    setLoadingQs(false);
  };

  const speak=useCallback((text)=>new Promise(resolve=>{
    if(!ttsOK){resolve();return;}
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);u.rate=0.97;u.pitch=0.93;
    const voices=window.speechSynthesis.getVoices();
    const v=voices.find(v=>/en-(US|GB|IN)/i.test(v.lang)&&/Male|David|Daniel|Google/i.test(v.name))||voices.find(v=>/en/i.test(v.lang));
    if(v)u.voice=v;setAiSpeaking(true);
    u.onend=()=>{setAiSpeaking(false);resolve();};u.onerror=()=>{setAiSpeaking(false);resolve();};
    window.speechSynthesis.speak(u);
  }),[ttsOK]);

  const stopRec=()=>{try{recogRef.current?.stop();}catch{}setListening(false);setInterimText("");};
  const startRec=()=>{
    if(!speechOK)return;stopRec();
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const rec=new SR();
    rec.continuous=true;rec.interimResults=true;rec.lang="en-US";
    finalRef.current="";setLiveText("");setInterimText("");
    rec.onresult=(e)=>{let fa="",ia="";for(let i=0;i<e.results.length;i++){if(e.results[i].isFinal)fa+=e.results[i][0].transcript;else ia+=e.results[i][0].transcript;}finalRef.current=fa;setLiveText(fa.trim());setInterimText(ia.trim());};
    rec.onerror=()=>{};rec.onend=()=>setListening(false);recogRef.current=rec;
    try{rec.start();setListening(true);}catch{}
  };

  const beginQ=async(idx)=>{
    setPhase("speaking");setLiveText("");setInterimText("");setFeedback(null);setFillerCount(0);finalRef.current="";
    const intro=idx===0?`Hello, I'm your interviewer today. We're looking for a ${role.title}. Let's begin. `:"";
    await speak(intro+questions[idx].q);
    setPhase("answering");setTimeLeft(QTIME);startRec();
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{setTimeLeft(t=>{if(t<=1){clearInterval(timerRef.current);finishQ(idx);return 0;}return t-1;});},1000);
  };

  const reactionLine=(score)=>{
    const s=["Nice, strong answer.","Great, that's what I was looking for.","Good example."];
    const m=["Okay, noted.","Alright, got it.","Thanks, moving on."];
    const w=["Hmm, let's move on.","Okay, that needs work.","Noted."];
    return(score>=75?s:score>=50?m:w)[Math.floor(Math.random()*3)];
  };

  const finishQ=async(idx)=>{
    clearInterval(timerRef.current);stopRec();setPhase("done-q");
    const ans=(finalRef.current||liveText||"").trim()||"(no answer captured)";
    const fd=detectFillers(ans);
    setAnswers(prev=>{const n=[...prev];n[idx]={question:questions[idx].q,type:questions[idx].type,answer:ans,fillerCount:fd.total};return n;});
    setLoadingFeedback(true);let fb;
    try{
      const raw=await callGroq(`Strict ${role.title} interviewer (${difficulty}).\nQuestion (${questions[idx].type}): ${questions[idx].q}\nAnswer: ${ans.slice(0,800)}\nFiller words: ${fd.total}\nReturn ONLY: {"score":<0-100>,"tip":"<2-3 sentence specific feedback>","what_was_good":"<1 sentence or null>","missing":"<what was missing>"}`,450);
      fb=safeJSON(raw,{score:55,tip:"Practice with more specific examples.",what_was_good:null});
    }catch{fb={score:55,tip:"AI unavailable.",what_was_good:null};}
    setFeedback(fb);setLoadingFeedback(false);speak(reactionLine(fb.score));
  };

  const nextQ=(idx)=>{setFeedback(null);if(idx+1<questions.length){setQIndex(idx+1);beginQ(idx+1);}else wrapUp();};
  const startInterview=()=>{setScreen("live");setAnswers([]);setQIndex(0);setFeedback(null);setTimeout(()=>beginQ(0),400);};

  const wrapUp=async()=>{
    setPhase("idle");setGenReport(true);
    try{
      const transcript=answers.map((a,i)=>`Q${i+1} (${a.type}): ${a.question}\nAnswer: ${a.answer}`).join("\n\n");
      const raw=await callGroq(`Strict hiring panel for ${role.title} (${difficulty}).\n${transcript.slice(0,4000)}\nReturn ONLY: {"overallScore":<0-100>,"verdict":"<Strong Hire|Hire|Borderline|No Hire>","communicationScore":<0-100>,"technicalScore":<0-100>,"confidenceScore":<0-100>,"structureScore":<0-100>,"summary":"<3-4 sentence honest assessment>","perQuestion":[{"question":"<short>","score":<0-100>,"feedback":"<2 sentence>"}],"strengths":["<s1>","<s2>"],"improvements":["<i1>","<i2>","<i3>"]}`,2200);
      const data=safeJSON(raw,null);if(!data?.overallScore)throw new Error("bad");
      setReport(data);await saveInterviewResult(user?.id,{...data,company:"",role:role.title});onInterviewComplete&&onInterviewComplete();
    }catch{setReport({overallScore:0,verdict:"—",communicationScore:0,technicalScore:0,confidenceScore:0,structureScore:0,summary:"⚠ Report generation failed.",perQuestion:[],strengths:[],improvements:[]});}
    setGenReport(false);setScreen("report");
  };

  const restart=()=>{window.speechSynthesis?.cancel();stopRec();clearInterval(timerRef.current);setScreen("roles");setRole(null);setQuestions([]);setAnswers([]);setQIndex(0);setReport(null);setFeedback(null);};
  const sc=s=>s>=75?C.green:s>=50?C.gold:C.red;

  if(screen==="roles")return(
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontWeight:900,fontSize:22,color:C.ink,marginBottom:5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>🎤 Quick Mock Interview</div>
        <div style={{color:C.soft,fontSize:13.5,lineHeight:1.7}}>Pick a role. No resume needed. For a personalized interview use <strong style={{color:C.ink}}>Resume Interview</strong> tab.</div>
      </div>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:18}}>
        {CATS.map(c=><button key={c} onClick={()=>setCatFilter(c)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${catFilter===c?C.violet:C.border}`,background:catFilter===c?C.violetPale:"transparent",color:catFilter===c?C.violetL:C.soft,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>{c}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
        {filteredRoles.map(r=>(
          <div key={r.id} className="lift" onClick={()=>pickRole(r)} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:16,padding:"18px 16px",position:"relative",overflow:"hidden",transition:"border-color .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.violet+"50"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            {r.popular&&<div style={{position:"absolute",top:12,right:12,background:`${C.violet}20`,color:C.violetL,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:10,letterSpacing:.5}}>POPULAR</div>}
            <div style={{fontSize:28,marginBottom:10}}>{r.icon}</div>
            <div style={{fontWeight:700,fontSize:13.5,color:C.ink,marginBottom:4}}>{r.title}</div>
            <div style={{color:C.soft,fontSize:11.5,lineHeight:1.65,marginBottom:10}}>{r.focus}</div>
            <Tag color={C.teal} size={10}>{r.cat}</Tag>
          </div>
        ))}
      </div>
    </div>
  );

  if(screen==="brief")return(
    <div className="fade" style={{maxWidth:500,margin:"0 auto"}}>
      <button onClick={()=>setScreen("roles")} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginBottom:16,fontFamily:"'Inter',sans-serif"}}>← Choose different role</button>
      <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:20,padding:28}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22}}>
          <div style={{width:52,height:52,background:C.violetPale,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{role.icon}</div>
          <div><div style={{fontWeight:800,fontSize:19,color:C.ink,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{role.title}</div><div style={{color:C.soft,fontSize:12,marginTop:2}}>{role.focus}</div></div>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontWeight:700,fontSize:13,color:C.ink,marginBottom:10}}>Experience level</div>
          <div style={{display:"flex",gap:8}}>
            {["Entry-level","Mid-level","Senior"].map(d=><button key={d} onClick={()=>setDifficulty(d)} style={{flex:1,padding:"10px 4px",borderRadius:10,border:`1px solid ${difficulty===d?C.violet:C.border}`,background:difficulty===d?C.violetPale:"transparent",color:difficulty===d?C.violetL:C.soft,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>{d}</button>)}
          </div>
        </div>
        {loadingQs?<div style={{textAlign:"center",padding:"28px 0"}}><Spin size={28}/><div style={{color:C.soft,fontSize:13,marginTop:12}}>Generating questions…</div></div>:(
          <>{genErr&&<div style={{background:C.goldPale,border:`1px solid ${C.gold}25`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.gold,marginBottom:12}}>{genErr}</div>}
          <Btn v="violet" onClick={startInterview} disabled={!questions.length} style={{width:"100%",padding:"14px",fontSize:15,borderRadius:12}}>🎙️ Start Interview</Btn></>
        )}
      </div>
    </div>
  );

  if(screen==="live")return(
    <InterviewRoom role={role.title} company={null} questions={questions} qIndex={qIndex} phase={phase} aiSpeaking={aiSpeaking} listening={listening} liveText={liveText} interimText={interimText} timeLeft={timeLeft} feedback={feedback} loadingFeedback={loadingFeedback} onFinish={finishQ} onNext={nextQ}
      onEnd={()=>{window.speechSynthesis?.cancel();stopRec();clearInterval(timerRef.current);if(answers.length>0)wrapUp();else setScreen("roles");}}
      onToggleMic={()=>setMicMuted(m=>!m)} micMuted={micMuted} fillerCount={fillerCount} liveMetrics={liveMetrics}/>
  );

  if(genReport)return<div style={{textAlign:"center",padding:"80px 20px"}}><div style={{fontSize:52,marginBottom:16,animation:"float 2s ease-in-out infinite"}}>📋</div><div style={{fontWeight:800,fontSize:20,color:C.ink,marginBottom:24,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Generating report…</div><Spin size={36}/></div>;

  if(screen==="report"&&report)return(
    <div className="fade">
      <div style={{background:`linear-gradient(160deg,${C.bgCard},${C.bgSurf})`,border:`1px solid ${C.border}`,borderRadius:20,padding:"28px 22px",marginBottom:16}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:6,letterSpacing:1.5,fontWeight:700,textTransform:"uppercase"}}>{role.icon} {role.title} · {difficulty}</div>
          <div className="mono" style={{fontSize:56,fontWeight:700,lineHeight:1,color:sc(report.overallScore)}}>{report.overallScore}</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:10}}>/ 100</div>
          <div><span style={{background:`${sc(report.overallScore)}15`,color:sc(report.overallScore),padding:"5px 18px",borderRadius:20,fontWeight:800,fontSize:13,border:`1px solid ${sc(report.overallScore)}30`}}>{report.verdict}</span></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:18}}>
          {[["Comm.",report.communicationScore],["Technical",report.technicalScore],["Confidence",report.confidenceScore],["Structure",report.structureScore]].map(([l,v],i)=>(
            <div key={i} style={{textAlign:"center",background:"rgba(255,255,255,.04)",borderRadius:10,padding:"10px 4px"}}>
              <div className="mono" style={{fontWeight:700,fontSize:16,color:sc(v)}}>{v}</div>
              <div style={{fontSize:9,color:C.muted,marginTop:3,fontWeight:600,letterSpacing:.4}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:13.5,lineHeight:1.8,color:C.ink2,textAlign:"center"}}>{report.summary}</div>
      </div>
      {report.strengths?.length>0&&<div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}><div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:12}}>✅ What worked</div>{report.strengths.map((s,i)=><div key={i} style={{background:C.greenPale,borderRadius:8,padding:"10px 13px",marginBottom:7,fontSize:13,color:C.ink2,border:`1px solid ${C.green}20`,display:"flex",gap:8}}><span style={{color:C.green}}>✓</span><span>{s}</span></div>)}</div>}
      {report.improvements?.length>0&&<div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}><div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:12}}>🎯 Improve on</div>{report.improvements.map((s,i)=><div key={i} style={{background:"rgba(255,255,255,.02)",borderRadius:8,padding:"10px 13px",marginBottom:7,border:`1px solid ${C.border}`,display:"flex",gap:9}}><span style={{color:C.gold,fontWeight:800}}>→</span><span style={{color:C.ink2,fontSize:13}}>{s}</span></div>)}</div>}
      {report.perQuestion?.length>0&&<div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:16}}><div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:12}}>🔍 Q by Q</div>{report.perQuestion.map((p,i)=><div key={i} style={{background:"rgba(255,255,255,.02)",borderRadius:10,padding:"12px 14px",marginBottom:9,border:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5,gap:8}}><div style={{fontWeight:600,color:C.ink,fontSize:12.5}}>Q{i+1}. {p.question}</div><div className="mono" style={{fontWeight:700,fontSize:13,color:sc(p.score),flexShrink:0}}>{p.score}%</div></div><div style={{color:C.soft,fontSize:12.5,lineHeight:1.7}}>{p.feedback}</div><Bar pct={p.score} color={sc(p.score)}/></div>)}</div>}
      <div style={{display:"flex",gap:10}}><Btn v="violet" onClick={()=>pickRole(role)} style={{flex:1,padding:"13px"}}>🔁 Retry</Btn><Btn v="ghost" onClick={restart} style={{flex:1,padding:"13px"}}>🎲 Other Role</Btn></div>
    </div>
  );

  return null;
}

// ── LANDING PAGE ──────────────────────────────────────────────────────────────
function LandingPage({onStart}){
  const[scrolled,setScrolled]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>60);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);

  const features=[
    {icon:"🎯",title:"Resume-personalized questions",desc:"AI reads your actual projects and tech stack — not generic practice."},
    {icon:"🎥",title:"Full-screen camera room",desc:"Full HD camera, self-view PiP, LIVE indicator. Real pressure, real improvement."},
    {icon:"🗣️",title:"AI speaks your questions",desc:"Priya Sharma reads every question in natural voice. Exactly like a real interview."},
    {icon:"⚡",title:"Live confidence analysis",desc:"Real-time pace, clarity, and filler word detection while you speak."},
    {icon:"🏢",title:"Company-style matching",desc:"Google, TCS, Amazon — we mirror each company's real interview culture."},
    {icon:"📤",title:"Shareable scorecard",desc:"Download a LinkedIn-ready PNG of your result and go viral."},
  ];

  const testimonials=[
    {name:"Priya M.",role:"SDE at Wipro",text:"The AI asked specifically about my TakePlace project and how it applies at Wipro's scale. I was so prepared I almost corrected the interviewer.",score:91,company:"Wipro"},
    {name:"Arun K.",role:"Data Analyst at TCS",text:"The live filler word detector wrecked me — turns out I say 'basically' 12 times per answer. Fixed it before the real interview. Got the offer.",score:83,company:"TCS"},
    {name:"Sneha R.",role:"Full Stack at Infosys",text:"Resume interview + Amazon as target = they asked my app's architecture in depth. I'd answered that exact question three times in practice.",score:94,company:"Amazon"},
  ];

  return(
    <div style={{background:C.lBg,color:C.lText,fontFamily:"'Inter',sans-serif",overflowX:"hidden"}}>
      <style>{CSS}</style>

      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:scrolled?"rgba(8,12,20,.97)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?"1px solid rgba(255,255,255,.08)":"none",transition:"all .3s",padding:"0 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div style={{fontWeight:900,fontSize:22,color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",display:"flex",alignItems:"center",gap:8}}><span>🎤</span><span style={{background:"linear-gradient(135deg,#A89BFC,#00D4AA)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>TakePlace</span></div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <button onClick={onStart} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:14,color:"rgba(255,255,255,.6)",padding:"8px 12px"}}>Sign In</button>
            <Btn v="violet" onClick={onStart} style={{padding:"9px 22px",fontSize:14}}>Get started free →</Btn>
          </div>
        </div>
      </nav>

      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"130px 24px 90px",position:"relative",overflow:"hidden",background:`linear-gradient(160deg,#040610 0%,#080C14 40%,#0D1230 100%)`}}>
        <div style={{position:"absolute",top:"5%",right:"5%",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,${C.violet}10,transparent 65%)`,pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"-5%",width:360,height:360,borderRadius:"50%",background:`radial-gradient(circle,${C.teal}08,transparent 65%)`,pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,.025) 1px,transparent 1px)",backgroundSize:"36px 36px",pointerEvents:"none"}}/>
        <div style={{maxWidth:800,width:"100%",textAlign:"center",position:"relative",zIndex:1}}>
          <div className="fade" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(124,110,250,.12)",border:"1px solid rgba(124,110,250,.25)",borderRadius:24,padding:"7px 18px",marginBottom:28,fontSize:12,color:C.violetL,fontWeight:700}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:C.violetL,display:"inline-block",animation:"pulse 1.5s infinite"}}/>
            India's only AI interview with live camera + resume personalization
          </div>
          <h1 className="fade" style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:"clamp(32px,5vw,64px)",lineHeight:1.08,marginBottom:24,letterSpacing:"-1.5px",color:"#fff"}}>
            You already know<br/><span style={{background:"linear-gradient(135deg,#A89BFC,#00D4AA)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>what they'll ask.</span>
          </h1>
          <p className="fade" style={{fontSize:17,color:"rgba(255,255,255,.6)",lineHeight:1.8,maxWidth:520,marginBottom:40,margin:"0 auto 40px"}}>
            Upload your resume, name the company — Priya asks the exact questions a real interviewer would ask <em>you specifically</em>. Camera on. Mic live. 90 seconds to answer.
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:48}}>
            <button onClick={onStart} className="cta-glow" style={{padding:"16px 36px",borderRadius:12,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.violetD},${C.violet},${C.violetL})`,color:"#fff",fontWeight:800,fontSize:16,fontFamily:"'Inter',sans-serif",transition:"all .2s"}}>🎙️ Start free interview →</button>
            <button onClick={onStart} style={{padding:"16px 26px",borderRadius:12,border:"1px solid rgba(255,255,255,.2)",cursor:"pointer",background:"transparent",color:"rgba(255,255,255,.8)",fontWeight:600,fontSize:16,fontFamily:"'Inter',sans-serif"}}>Browse live jobs</button>
          </div>
          <div style={{display:"flex",gap:32,alignItems:"center",justifyContent:"center"}}>
            {[["50K+","Interviews",C.violetL],["87%","Better scores",C.teal],["3.4×","More offers",C.gold]].map(([v,l,c])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div className="mono" style={{fontWeight:700,fontSize:22,color:c}}>{v}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:600,textTransform:"uppercase",letterSpacing:.6}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:"28px 0",background:"#0A0E1A",borderTop:"1px solid rgba(255,255,255,.06)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:10,color:"rgba(255,255,255,.3)",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Practiced for interviews at</div></div>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...TARGET_COMPANIES,...TARGET_COMPANIES].map((c,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:10,padding:"9px 18px",display:"flex",alignItems:"center",gap:8,flexShrink:0,minWidth:120}}>
                <span style={{fontWeight:800,fontSize:13,color:c.color}}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:"90px 24px",background:"#F1F5F9"}}>
        <div style={{maxWidth:1060,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}><div style={{fontSize:10,color:C.violet,fontWeight:800,letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>Features</div><h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:36,color:C.lText,letterSpacing:-.5}}>Built to replicate the real thing</h2></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:18}}>
            {features.map((f,i)=>(
              <div key={i} className="lift" style={{background:C.lCard,border:`1.5px solid ${C.lBorder}`,borderRadius:18,padding:26,display:"flex",gap:16}}>
                <div style={{fontSize:28,flexShrink:0,marginTop:2}}>{f.icon}</div>
                <div><div style={{fontWeight:700,fontSize:15,color:C.lText,marginBottom:7}}>{f.title}</div><div style={{color:C.lMuted,fontSize:13,lineHeight:1.8}}>{f.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:"90px 24px",maxWidth:1060,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:52}}><div style={{fontSize:10,color:C.violet,fontWeight:800,letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>Success stories</div><h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:36,color:C.lText,letterSpacing:-.5}}>They got hired. You're next.</h2></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18}}>
          {testimonials.map((r,i)=>(
            <div key={i} className="lift" style={{background:C.lCard,border:`1.5px solid ${C.lBorder}`,borderRadius:20,padding:28}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                {[...Array(5)].map((_,j)=><span key={j} style={{color:C.gold,fontSize:14}}>★</span>)}
                <span style={{marginLeft:4,background:C.greenPale,color:C.green,fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{r.score}%</span>
                <span style={{marginLeft:2,background:C.violetPale,color:C.violet,fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{r.company}</span>
              </div>
              <div style={{color:C.lText,fontSize:14,lineHeight:1.85,marginBottom:20}}>"{r.text}"</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${C.violet},${C.teal})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:"#fff"}}>{r.name.split(" ").map(n=>n[0]).join("")}</div>
                <div><div style={{fontWeight:700,color:C.lText,fontSize:13.5}}>{r.name}</div><div style={{color:C.lMuted,fontSize:12}}>{r.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:"90px 24px",background:"#F1F5F9"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:52}}><div style={{fontSize:10,color:C.violet,fontWeight:800,letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>Pricing</div><h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:36,color:C.lText,letterSpacing:-.5}}>Start free. Upgrade when you land interviews.</h2></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:22,alignItems:"start"}}>
            {[
              {name:"Free",price:"₹0",period:"/month",color:C.lText,features:["3 resume interviews/month","10 quick mock sessions","Basic per-question feedback","Live job feed","Streak tracking"],cta:"Start Free",v:"ghost"},
              {name:"Pro",price:"₹199",period:"/month",color:C.violet,popular:true,features:["Unlimited resume interviews","All company style modes","Full detailed reports","Shareable scorecards","Score history + trajectory","Filler word detection","AI ideal answer coach"],cta:"Start Pro — ₹199/mo",v:"violet"},
              {name:"Premium",price:"₹499",period:"/month",color:C.teal,features:["Everything in Pro","1 resume review/month","LinkedIn optimization","Salary negotiation script","Priority AI + support"],cta:"Go Premium",v:"teal"},
            ].map((p,i)=>(
              <div key={i} style={{background:C.lCard,border:p.popular?`2px solid ${C.violet}`:`1.5px solid ${C.lBorder}`,borderRadius:22,padding:28,position:"relative",boxShadow:p.popular?`0 12px 40px ${C.violet}15`:"none"}}>
                {p.popular&&<div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${C.violetD},${C.violet})`,color:"#fff",fontSize:11,fontWeight:800,padding:"4px 16px",borderRadius:20,whiteSpace:"nowrap"}}>⭐ MOST POPULAR</div>}
                <div style={{fontSize:12,fontWeight:800,color:p.color,marginBottom:6,letterSpacing:.8}}>{p.name.toUpperCase()}</div>
                <div style={{fontWeight:900,fontSize:36,color:C.lText,fontFamily:"'JetBrains Mono',monospace"}}>{p.price}<span style={{fontSize:12,fontWeight:400,color:C.lMuted}}>{p.period}</span></div>
                <div style={{height:1,background:C.lBorder,margin:"16px 0"}}/>
                {p.features.map((f,j)=><div key={j} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:10}}><span style={{color:p.color,fontWeight:800,fontSize:13,flexShrink:0,marginTop:1}}>✓</span><span style={{color:C.lMuted,fontSize:13}}>{f}</span></div>)}
                <Btn v={p.v} onClick={onStart} style={{width:"100%",padding:"12px",marginTop:10,borderRadius:10,fontSize:14}}>{p.cta}</Btn>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:"90px 24px",textAlign:"center",background:"#080C14"}}>
        <div style={{maxWidth:600,margin:"0 auto",background:`linear-gradient(160deg,#0D1220,#11163A)`,border:"1px solid rgba(124,110,250,.2)",borderRadius:28,padding:"60px 36px",boxShadow:`0 24px 60px rgba(124,110,250,.15)`}}>
          <div style={{fontSize:52,marginBottom:14,animation:"float 3s ease-in-out infinite"}}>🎤</div>
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:34,color:"#fff",marginBottom:12,letterSpacing:-.5}}>Your next interview is real.<br/><span style={{background:"linear-gradient(135deg,#A89BFC,#00D4AA)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>This one can be too.</span></h2>
          <p style={{color:"rgba(255,255,255,.55)",fontSize:15,marginBottom:36,lineHeight:1.75}}>Camera on. Mic live. Resume read. Company style matched. Free to start.</p>
          <button onClick={onStart} className="cta-glow" style={{padding:"16px 48px",borderRadius:12,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.violetD},${C.violet},${C.violetL})`,color:"#fff",fontWeight:800,fontSize:16,fontFamily:"'Inter',sans-serif",transition:"all .2s"}}>Start free now →</button>
        </div>
      </section>

      <footer style={{borderTop:"1px solid rgba(255,255,255,.06)",padding:"28px 24px",background:"#04060E"}}>
        <div style={{maxWidth:1060,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{fontWeight:900,fontSize:18,color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}><span>🎤</span><span style={{background:"linear-gradient(135deg,#A89BFC,#00D4AA)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>TakePlace</span></div>
          <div style={{color:"rgba(255,255,255,.3)",fontSize:12}}>© 2026 TakePlace · Built by Raghu Dadigela</div>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            <a href="mailto:takeplace.in@gmail.com" style={{color:"rgba(255,255,255,.6)",fontWeight:600,fontSize:13}}>✉ takeplace.in@gmail.com</a>
            <a href="https://takeplace.vercel.app" target="_blank" rel="noreferrer" style={{color:"rgba(255,255,255,.3)",fontSize:12}}>takeplace.vercel.app</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────
function OnboardingFlow({user,onComplete}){
  const[step,setStep]=useState(0);
  const[picks,setPicks]=useState({company:"",level:"",resume:false});
  const companies=["Google","Amazon","TCS","Wipro","Infosys","Flipkart","Microsoft","Other"];
  const levels=["Fresher (0 exp)","1–2 years","3–5 years","5+ years"];
  const next=()=>{if(step<2)setStep(s=>s+1);else onComplete(picks);};

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{CSS}</style>
      <div className="fade" style={{width:"100%",maxWidth:500,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:24,padding:"36px 32px"}}>
        <div style={{display:"flex",gap:6,marginBottom:32}}>{[0,1,2].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=step?C.violet:"rgba(255,255,255,.08)",transition:"background .3s"}}/>)}</div>
        {step===0&&<div><div style={{fontWeight:900,fontSize:22,color:C.ink,marginBottom:6,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Which company are you targeting?</div><div style={{color:C.soft,fontSize:13.5,marginBottom:24}}>We'll customize the interview style to match.</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{companies.map(c=><button key={c} onClick={()=>setPicks(p=>({...p,company:c}))} style={{padding:"14px",borderRadius:12,border:`1px solid ${picks.company===c?C.violet:C.border}`,background:picks.company===c?C.violetPale:"transparent",color:picks.company===c?C.violetL:C.ink2,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>{c}</button>)}</div></div>}
        {step===1&&<div><div style={{fontWeight:900,fontSize:22,color:C.ink,marginBottom:6,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>What's your experience level?</div><div style={{color:C.soft,fontSize:13.5,marginBottom:24}}>We'll calibrate question difficulty accordingly.</div><div style={{display:"flex",flexDirection:"column",gap:10}}>{levels.map(l=><button key={l} onClick={()=>setPicks(p=>({...p,level:l}))} style={{padding:"16px 20px",borderRadius:12,border:`1px solid ${picks.level===l?C.violet:C.border}`,background:picks.level===l?C.violetPale:"transparent",color:picks.level===l?C.violetL:C.ink2,fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s",textAlign:"left"}}>{l}</button>)}</div></div>}
        {step===2&&<div><div style={{fontWeight:900,fontSize:22,color:C.ink,marginBottom:6,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Add your resume <span style={{color:C.soft,fontWeight:500,fontSize:18}}>(optional)</span></div><div style={{color:C.soft,fontSize:13.5,marginBottom:24}}>Upload now or skip and use Quick Mock first.</div><div style={{background:C.violetPale,border:`2px dashed ${C.violet}40`,borderRadius:14,padding:"32px",textAlign:"center",marginBottom:16,cursor:"pointer"}} onClick={()=>setPicks(p=>({...p,resume:true}))}><div style={{fontSize:36,marginBottom:10}}>📄</div><div style={{fontWeight:700,color:C.ink,marginBottom:4}}>Drop your resume here</div><div style={{color:C.soft,fontSize:12}}>PDF, DOCX, or TXT — you can always add it later</div></div></div>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:28}}>
          {step>0?<button onClick={()=>setStep(s=>s-1)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:13}}>← Back</button>:<div/>}
          <Btn v="violet" onClick={next} disabled={step===0&&!picks.company||step===1&&!picks.level} style={{padding:"12px 28px"}}>{step<2?"Continue →":"Let's go →"}</Btn>
        </div>
        {step===2&&<button onClick={()=>onComplete(picks)} style={{width:"100%",background:"none",border:"none",color:C.muted,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:12,marginTop:12}}>Skip for now →</button>}
      </div>
    </div>
  );
}

// ── AUTH PAGE ─────────────────────────────────────────────────────────────────
function AuthPage({onLogin,onBack}){
  const[mode,setMode]=useState("login");
  const[form,setForm]=useState({name:"",email:"",password:""});
  const[err,setErr]=useState("");
  const[msg,setMsg]=useState("");
  const[loading,setLoading]=useState(false);
  const[gLoading,setGLoading]=useState(false);
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
        if(!form.name||!form.email||!form.password)throw new Error("All fields required");
        if(form.password.length<6)throw new Error("Password must be 6+ characters");
        const{error}=await supabase.auth.signUp({email:form.email,password:form.password,options:{data:{full_name:form.name}}});
        if(error)throw error;setMsg("✅ Check your email to verify, then sign in.");setMode("login");
      }else{
        const{data,error}=await supabase.auth.signInWithPassword({email:form.email,password:form.password});
        if(error)throw error;onLogin(data.user);
      }
    }catch(e){setErr(e.message||"Something went wrong");}
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,#040610,#080C14 40%,#0D1230)`,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <div style={{position:"absolute",top:"10%",right:"10%",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${C.violet}08,transparent 65%)`,pointerEvents:"none"}}/>
      <div className="fade" style={{width:"100%",maxWidth:420,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:24,padding:36,boxShadow:"0 24px 60px rgba(0,0,0,.5)",position:"relative",zIndex:1}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginBottom:24,fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:4}}>← Back</button>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:36,marginBottom:8}}>🎤</div>
          <div style={{fontWeight:900,fontSize:24,fontFamily:"'Plus Jakarta Sans',sans-serif",background:"linear-gradient(135deg,#A89BFC,#00D4AA)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>TakePlace</div>
          <div style={{color:C.soft,fontSize:13,marginTop:4}}>{mode==="login"?"Welcome back 👋":"Create your free account ✨"}</div>
        </div>
        <button onClick={handleGoogle} disabled={gLoading} style={{width:"100%",padding:"13px",borderRadius:12,border:`1px solid ${C.border}`,background:"rgba(255,255,255,.05)",color:C.ink,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:20,transition:"all .2s"}}>
          {gLoading?<Spin size={16}/>:<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
          Continue with Google
        </button>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}><div style={{flex:1,height:1,background:C.border}}/><span style={{color:C.muted,fontSize:12}}>or</span><div style={{flex:1,height:1,background:C.border}}/></div>
        <div style={{display:"flex",background:"rgba(255,255,255,.04)",borderRadius:10,padding:4,marginBottom:20}}>
          {["login","register"].map(m=><button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}} style={{flex:1,padding:"9px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,transition:"all .2s",background:mode===m?"rgba(124,110,250,.2)":"transparent",color:mode===m?C.violetL:C.muted}}>{m==="login"?"Sign In":"Register"}</button>)}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {mode==="register"&&<input style={inp} placeholder="Full name" value={form.name} onChange={e=>set("name",e.target.value)} onFocus={ev=>ev.target.style.borderColor=C.violet} onBlur={ev=>ev.target.style.borderColor=C.border}/>}
          <input style={inp} placeholder="Email address" type="email" value={form.email} onChange={e=>set("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} onFocus={ev=>ev.target.style.borderColor=C.violet} onBlur={ev=>ev.target.style.borderColor=C.border}/>
          <input style={inp} placeholder="Password" type="password" value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} onFocus={ev=>ev.target.style.borderColor=C.violet} onBlur={ev=>ev.target.style.borderColor=C.border}/>
        </div>
        {err&&<div style={{color:C.red,fontSize:12,marginTop:10,background:C.redPale,padding:"8px 12px",borderRadius:8,border:`1px solid ${C.red}20`}}>⚠ {err}</div>}
        {msg&&<div style={{color:C.green,fontSize:12,marginTop:10,background:C.greenPale,padding:"8px 12px",borderRadius:8,border:`1px solid ${C.green}20`}}>{msg}</div>}
        <Btn v="violet" onClick={handle} loading={loading} style={{width:"100%",marginTop:16,padding:"13px",fontSize:15}}>{mode==="login"?"Sign In →":"Create Account →"}</Btn>
        <div style={{textAlign:"center",marginTop:16,fontSize:12,color:C.muted}}>Questions? <a href="mailto:takeplace.in@gmail.com" style={{color:C.violetL,fontWeight:700}}>takeplace.in@gmail.com</a></div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
function MainApp({user,onLogout}){
  const[tab,setTab]=useState(()=>parseInt(sessionStorage.getItem("tp_tab")||"0"));
  const[menuOpen,setMenuOpen]=useState(false);
  const[stats,setStats]=useState(null);
  const[prefillCompany,setPrefillCompany]=useState("");
  const[prefillRole,setPrefillRole]=useState("");

  const name=user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";
  const firstName=name.split(" ")[0];
  const initials=name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  const streak=stats?.streak?.streak||0;
  const setTabP=(t)=>{setTab(t);sessionStorage.setItem("tp_tab",t);};

  const TABS=[{icon:"🏠",label:"Home",id:0},{icon:"🔥",label:"Jobs",id:1},{icon:"🎯",label:"Interview",id:2},{icon:"🎤",label:"Quick Mock",id:3}];

  useEffect(()=>{fetchUserStats(user?.id).then(s=>setStats(s));},[user]);
  const refreshStats=()=>{fetchUserStats(user?.id).then(s=>setStats(s));};

  const handlePracticeForJob=(company,role)=>{setPrefillCompany(company||"");setPrefillRole(role||"");setTabP(2);};

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Inter',sans-serif",paddingBottom:76}}>
      <style>{CSS}{`@media(min-width:640px){.bn{display:none!important;}.ttb{display:flex!important;}}@media(max-width:639px){.ttb{display:none!important;}.bn{display:flex!important;}}`}</style>

      <div style={{background:"rgba(8,12,20,.95)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`,padding:"0 20px",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:58}}>
          <div style={{fontWeight:900,fontSize:20,fontFamily:"'Plus Jakarta Sans',sans-serif",display:"flex",alignItems:"center",gap:7}}>
            <span>🎤</span><span style={{background:"linear-gradient(135deg,#A89BFC,#00D4AA)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>TakePlace</span>
          </div>
          {streak>0&&<div style={{display:"flex",alignItems:"center",gap:6,background:C.goldPale,borderRadius:20,padding:"4px 12px",border:`1px solid ${C.gold}25`}}><span style={{animation:"streakPop 3s ease infinite"}}>🔥</span><span style={{color:C.gold,fontWeight:700,fontSize:13,fontFamily:"JetBrains Mono,monospace"}}>{streak}</span><span style={{color:"rgba(245,158,11,.6)",fontSize:11,fontWeight:600}}>day streak</span></div>}
          <div className="ttb" style={{display:"none",gap:0}}>
            {TABS.map(t=><button key={t.id} onClick={()=>setTabP(t.id)} style={{padding:"8px 16px",border:"none",background:"transparent",cursor:"pointer",color:tab===t.id?C.violetL:C.soft,fontFamily:"'Inter',sans-serif",fontWeight:tab===t.id?700:500,fontSize:13,borderBottom:`2px solid ${tab===t.id?C.violet:"transparent"}`,transition:"all .2s",display:"flex",alignItems:"center",gap:5}}>{t.icon} {t.label}</button>)}
          </div>
          <div style={{position:"relative"}}>
            <button onClick={()=>setMenuOpen(m=>!m)} style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${C.violet},${C.teal})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:"#fff",border:"none",cursor:"pointer",boxShadow:`0 2px 12px ${C.violet}40`}}>{initials}</button>
            {menuOpen&&<div style={{position:"absolute",right:0,top:42,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,boxShadow:"0 12px 40px rgba(0,0,0,.4)",padding:8,minWidth:180,zIndex:50}}>
              <div style={{padding:"8px 10px",fontSize:12,color:C.muted,borderBottom:`1px solid ${C.border}`,marginBottom:6}}>{firstName}</div>
              <a href="mailto:takeplace.in@gmail.com" style={{display:"flex",alignItems:"center",gap:8,padding:"9px 10px",borderRadius:8,fontSize:13,color:C.ink2,fontWeight:500,fontFamily:"'Inter',sans-serif",textDecoration:"none"}}>✉ Support</a>
              <button onClick={onLogout} style={{width:"100%",textAlign:"left",padding:"9px 10px",borderRadius:8,border:"none",background:"transparent",color:C.red,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>🚪 Sign Out</button>
            </div>}
          </div>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"22px 16px"}}>
        {tab===0&&<Dashboard user={user} onStartInterview={()=>setTabP(2)} onGoToJobs={()=>setTabP(1)} stats={stats}/>}
        {tab===1&&<JobsTab onPracticeForJob={handlePracticeForJob}/>}
        {tab===2&&<ResumeInterviewTab user={user} onInterviewComplete={refreshStats} prefillCompany={prefillCompany} prefillRole={prefillRole}/>}
        {tab===3&&<QuickMockTab user={user} onInterviewComplete={refreshStats}/>}
      </div>

      {/* Mobile bottom nav */}
      <div className="bn" style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(8,12,20,.97)",backdropFilter:"blur(20px)",borderTop:`1px solid ${C.border}`,display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTabP(t.id)} style={{flex:1,padding:"10px 4px 8px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:tab===t.id?C.violetL:C.muted,fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>
            <div style={{width:tab===t.id?24:0,height:2,borderRadius:1,background:C.violet,marginBottom:3,transition:"width .25s cubic-bezier(.22,1,.36,1)"}}/>
            <span style={{fontSize:18,lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:9,fontWeight:tab===t.id?700:500,letterSpacing:.3}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App(){
  const[user,setUser]=useState(null);
  const[loading,setLoading]=useState(true);
  const[page,setPage]=useState("landing");
  const[showOnboarding,setShowOnboarding]=useState(false);

  useEffect(()=>{
    const s=document.createElement("style");s.textContent=CSS;document.head.appendChild(s);
    if(window.speechSynthesis)window.speechSynthesis.getVoices();
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){
        setUser(session.user);
        fetchUserStats(session.user.id).then(stats=>{if(stats&&stats.results.length===0)setShowOnboarding(true);});
        setPage("app");
      }
      setLoading(false);
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user){setUser(session.user);setPage("app");}
      else{setUser(null);setPage("landing");setShowOnboarding(false);}
    });
    return()=>subscription.unsubscribe();
  },[]);

  if(loading)return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{CSS}</style>
      <div style={{fontSize:36,animation:"float 2s ease-in-out infinite"}}>🎤</div>
      <Spin size={32}/>
      <div style={{color:C.muted,fontSize:13,fontFamily:"'Inter',sans-serif"}}>Loading TakePlace…</div>
    </div>
  );

  if(page==="landing")return<LandingPage onStart={()=>setPage("auth")}/>;
  if(page==="auth")return<AuthPage onLogin={u=>{setUser(u);setPage("app");}} onBack={()=>setPage("landing")}/>;
  if(page==="app"&&showOnboarding)return<OnboardingFlow user={user} onComplete={()=>setShowOnboarding(false)}/>;
  return<MainApp user={user} onLogout={()=>supabase.auth.signOut()}/>;
}
