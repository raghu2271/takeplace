import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID  = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const supabase   = createClient(SUPABASE_URL, SUPABASE_KEY);

async function callGroq(prompt, maxTokens = 2000, systemMsg = "") {
  const sys = systemMsg || "You are an expert technical interviewer. Respond with valid JSON only. No markdown, no explanation.";
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "system", content: sys }, { role: "user", content: prompt }], max_tokens: maxTokens })
  });
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error || "AI error " + res.status); }
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ── PDF/DOCX EXTRACT ─────────────────────────────────────────────────────────
async function extractPDF(file) {
  if (!window.pdfjsLib) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const ab = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: ab }).promise;
  let text = "";
  for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
    const page = await pdf.getPage(i);
    const c = await page.getTextContent();
    text += c.items.map(x => x.str).join(" ") + "\n";
  }
  return text.trim();
}

async function extractDOCX(file) {
  if (!window.mammoth) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
      s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }
  const ab = await file.arrayBuffer();
  const r = await window.mammoth.extractRawText({ arrayBuffer: ab });
  return r.value.trim();
}

function safeJSON(raw, fallback = {}) {
  if (!raw) return fallback;
  try { return JSON.parse(raw.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim()); }
  catch { try { const m = raw.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]); } catch {} return fallback; }
}
function fmtTime(s) { return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`; }

// ── DESIGN SYSTEM ─────────────────────────────────────────────────────────────
const C = {
  bg: "#f9fafb", white: "#ffffff",
  ink: "#0d1117", ink2: "#1e2535", ink3: "#374151",
  navy: "#0f1f45", navyL: "#1a3260", navyXL: "#243f7a",
  gold: "#c8922a", goldL: "#e8a83c", goldPale: "#fefbf3",
  teal: "#0d9488", tealL: "#14b8a6", tealPale: "#f0fdfa",
  blue: "#2563eb", blueL: "#3b82f6", bluePale: "#eff6ff",
  green: "#16a34a", greenPale: "#f0fdf4", greenBorder: "#86efac",
  red: "#dc2626", redPale: "#fef2f2",
  yellow: "#d97706", yellowPale: "#fffbeb",
  purple: "#7c3aed", purplePale: "#f5f3ff",
  muted: "#6b7280", soft: "#9ca3af", border: "#e5e7eb", border2: "#d1d5db",
};

const CSS_GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',sans-serif;color:#0d1117;background:#f9fafb;-webkit-font-smoothing:antialiased;}
  ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:4px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  @keyframes slideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
  @keyframes voiceBar{0%,100%{transform:scaleY(.2)}50%{transform:scaleY(1)}}
  @keyframes ringPulse{0%{box-shadow:0 0 0 0 rgba(200,146,42,.45)}70%{box-shadow:0 0 0 20px rgba(200,146,42,0)}100%{box-shadow:0 0 0 0 rgba(200,146,42,0)}}
  .fade{animation:fadeUp .4s ease forwards;}
  .lift{transition:transform .18s,box-shadow .18s;cursor:pointer;}
  .lift:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.08);}
  input:focus,textarea:focus,select:focus{outline:none;border-color:#2563eb!important;box-shadow:0 0 0 3px rgba(37,99,235,.12)!important;}
  button:active{transform:scale(.97);}
  .room-fixed{position:fixed;inset:0;z-index:9999;background:#080c14;display:flex;flex-direction:column;overflow:hidden;}
  .pip{position:absolute;top:84px;right:16px;width:160px;height:112px;border-radius:12px;overflow:hidden;border:2px solid rgba(255,255,255,.2);background:#111;z-index:15;box-shadow:0 8px 24px rgba(0,0,0,.5);}
  .vbar{width:3px;border-radius:2px;background:currentColor;display:inline-block;transform-origin:center bottom;}
  .feedback-in{animation:slideIn .3s ease forwards;}
`;

const inp = {
  width:"100%", background:C.white, border:`1.5px solid ${C.border}`,
  borderRadius:10, padding:"11px 14px", color:C.ink, fontSize:14,
  fontFamily:"'Inter',sans-serif", outline:"none", transition:"border-color .2s",
};

// ── ATOMS ─────────────────────────────────────────────────────────────────────
const Spin = ({size=18,color=C.gold}) => (
  <span style={{width:size,height:size,border:`2px solid ${color}20`,borderTopColor:color,borderRadius:"50%",display:"inline-block",animation:"spin .8s linear infinite",flexShrink:0}}/>
);

function Btn({children,onClick,v="primary",style={},disabled=false,loading=false,small=false}){
  const pad = small?"7px 14px":"12px 22px";
  const fs = small?12:14;
  const vs = {
    primary:{background:C.navy,color:"#fff",fontWeight:700,boxShadow:`0 2px 10px ${C.navy}30`},
    gold:{background:`linear-gradient(135deg,#9a6c18,${C.gold},${C.goldL})`,color:"#fff",fontWeight:800,boxShadow:`0 4px 18px ${C.gold}40`},
    teal:{background:`linear-gradient(135deg,#0f766e,${C.teal},${C.tealL})`,color:"#fff",fontWeight:700,boxShadow:`0 4px 16px ${C.teal}35`},
    green:{background:`linear-gradient(135deg,#14532d,${C.green})`,color:"#fff",fontWeight:700},
    ghost:{background:"transparent",color:C.muted,border:`1.5px solid ${C.border}`},
    outline:{background:"transparent",color:"#fff",border:"1.5px solid rgba(255,255,255,.3)",fontWeight:600},
    danger:{background:C.red,color:"#fff",fontWeight:700},
    white:{background:"#fff",color:C.navy,fontWeight:700,boxShadow:"0 2px 12px rgba(0,0,0,.15)"},
    blue:{background:`linear-gradient(135deg,#1d4ed8,${C.blue})`,color:"#fff",fontWeight:700,boxShadow:`0 4px 16px ${C.blue}30`},
  };
  return (
    <button onClick={disabled||loading?undefined:onClick} disabled={disabled||loading}
      style={{padding:pad,borderRadius:10,border:"none",cursor:disabled||loading?"not-allowed":"pointer",
        fontFamily:"'Inter',sans-serif",fontSize:fs,transition:"all .18s",opacity:disabled?.5:1,
        display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,...vs[v],...style}}>
      {loading?<><Spin size={13} color={v==="ghost"?C.gold:"#fff"}/> Please wait…</>:children}
    </button>
  );
}

const Tag = ({children,color=C.gold,bg,size=11}) => (
  <span style={{background:bg||`${color}12`,color,fontSize:size,padding:"3px 10px",borderRadius:20,fontWeight:700,border:`1px solid ${color}25`,whiteSpace:"nowrap"}}>{children}</span>
);

function Bar({pct,color,h=5}){
  return (
    <div style={{background:C.border,borderRadius:4,height:h,overflow:"hidden",marginTop:5}}>
      <div style={{height:"100%",width:`${Math.min(100,pct||0)}%`,background:color||C.gold,borderRadius:4,transition:"width 1.1s ease"}}/>
    </div>
  );
}

function ScoreRing({score,size=80,color,label}){
  const r=30,circ=2*Math.PI*r;
  const pct=Math.max(0,Math.min(100,score||0));
  const col=color||(pct>=75?C.green:pct>=50?C.gold:C.red);
  return (
    <div style={{textAlign:"center"}}>
      <svg width={size} height={size} viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={r} fill="none" stroke={C.border} strokeWidth="5"/>
        <circle cx="34" cy="34" r={r} fill="none" stroke={col} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
          strokeLinecap="round" transform="rotate(-90 34 34)"
          style={{transition:"stroke-dashoffset 1.2s ease"}}/>
        <text x="34" y="38" textAnchor="middle" fill={col} fontSize="13" fontWeight="800" fontFamily="Inter">{pct}%</text>
      </svg>
      {label&&<div style={{color:C.muted,fontSize:10,fontWeight:600,marginTop:3}}>{label}</div>}
    </div>
  );
}

// ── ROLES ─────────────────────────────────────────────────────────────────────
const ROLES = [
  {id:"sde",title:"Software Engineer",icon:"💻",cat:"Engineering",focus:"DSA, system design, problem solving"},
  {id:"frontend",title:"Frontend Developer",icon:"🎨",cat:"Engineering",focus:"React, JS, CSS, performance"},
  {id:"backend",title:"Backend Developer",icon:"🗄️",cat:"Engineering",focus:"APIs, databases, system design"},
  {id:"fullstack",title:"Full Stack Developer",icon:"🧩",cat:"Engineering",focus:"End-to-end design, REST, deploy"},
  {id:"devops",title:"DevOps Engineer",icon:"⚙️",cat:"Engineering",focus:"CI/CD, containers, monitoring"},
  {id:"cloud",title:"Cloud Engineer",icon:"☁️",cat:"Engineering",focus:"AWS/GCP, networking, security"},
  {id:"qa",title:"QA Engineer",icon:"🧪",cat:"Engineering",focus:"Test design, automation, triage"},
  {id:"security",title:"Cybersecurity Analyst",icon:"🛡️",cat:"Engineering",focus:"Threats, vulnerabilities, SIEM"},
  {id:"ds",title:"Data Scientist",icon:"📊",cat:"Data",focus:"Statistics, ML modeling, experiments"},
  {id:"da",title:"Data Analyst",icon:"📈",cat:"Data",focus:"SQL, dashboards, business metrics"},
  {id:"mle",title:"ML Engineer",icon:"🧠",cat:"Data",focus:"Pipelines, model deploy, evaluation"},
  {id:"pm",title:"Product Manager",icon:"🧭",cat:"Business",focus:"Prioritization, metrics, roadmap"},
  {id:"ba",title:"Business Analyst",icon:"🧾",cat:"Business",focus:"Requirements, process mapping"},
  {id:"uiux",title:"UI/UX Designer",icon:"✏️",cat:"Design",focus:"User research, wireframes, critique"},
];
const CATS = ["All","Engineering","Data","Business","Design"];

const FALLBACK_QUESTIONS = [
  {q:"Tell me about yourself and what drew you to this specific role.",type:"Intro"},
  {q:"Walk me through a technical project you're most proud of. What was the hardest problem you solved?",type:"Technical"},
  {q:"Describe a time you had a disagreement with a team member. What was the outcome?",type:"Behavioral"},
  {q:"How do you approach debugging a production issue at 2am when the CEO is calling?",type:"Situational"},
  {q:"What questions do you have for us, and what would make you choose us over competing offers?",type:"Closing"},
];

// ── AI INTERVIEWER AVATAR (real photo, speaking ring + voice bars) ───────────
function AIFace({speaking, size=200}){
  return (
    <div style={{position:"relative",width:size,height:size,borderRadius:"50%",overflow:"hidden",background:"#1a3260"}}>
      <img
        src="https://randomuser.me/api/portraits/women/65.jpg"
        alt="Priya Sharma, AI interviewer"
        style={{width:"100%",height:"100%",objectFit:"cover",display:"block",
          filter:speaking?"brightness(1.06) saturate(1.05)":"brightness(1)",
          transition:"filter .3s ease"}}
      />
      {speaking && (
        <div style={{position:"absolute",inset:0,borderRadius:"50%",
          boxShadow:`inset 0 0 0 4px ${C.goldL}70`,
          animation:"breathe 1.3s ease-in-out infinite"}}/>
      )}
    </div>
  );
}

// ── FULLSCREEN INTERVIEW ROOM ─────────────────────────────────────────────────
function InterviewRoom({role,company,questions,qIndex,phase,aiSpeaking,listening,liveText,interimText,timeLeft,feedback,loadingFeedback,onFinish,onNext,onEnd,onToggleMic,micMuted}){
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [camReady,setCamReady] = useState(false);
  const [camErr,setCamErr] = useState(false);
  const QTIME = 90;
  const pct = (timeLeft/QTIME)*100;
  const tcol = pct>50?"#22c55e":pct>20?C.goldL:"#ef4444";
  const q = questions[qIndex];
  const isLast = qIndex+1 >= questions.length;

  useEffect(()=>{
    let active=true;
    navigator.mediaDevices?.getUserMedia({video:true,audio:false})
      .then(stream=>{
        if(!active){stream.getTracks().forEach(t=>t.stop());return;}
        streamRef.current=stream;
        if(videoRef.current){videoRef.current.srcObject=stream;videoRef.current.play().catch(()=>{});}
        setCamReady(true);
      }).catch(()=>setCamErr(true));
    return()=>{active=false;streamRef.current?.getTracks().forEach(t=>t.stop());};
  },[]);

  return (
    <div className="room-fixed">
      <style>{`
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
        @keyframes voiceBar{0%,100%{transform:scaleY(.2)}50%{transform:scaleY(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes ringPulse{0%{box-shadow:0 0 0 0 rgba(200,146,42,.5)}70%{box-shadow:0 0 0 22px rgba(200,146,42,0)}100%{box-shadow:0 0 0 0 rgba(200,146,42,0)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .vbar{width:3px;border-radius:2px;background:currentColor;display:inline-block;transform-origin:center bottom;}
      `}</style>

      {/* Interviewer panel */}
      <div style={{flex:1,background:"linear-gradient(180deg,#0d1630 0%,#0a1020 100%)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        {/* Subtle grid bg */}
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px)",backgroundSize:"32px 32px",pointerEvents:"none"}}/>
        
        {/* Top HUD */}
        <div style={{position:"absolute",top:0,left:0,right:0,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"linear-gradient(to bottom,rgba(0,0,0,.6),transparent)",zIndex:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#ef4444",animation:"pulse 1s infinite"}}/>
            <span style={{color:"#fff",fontWeight:700,fontSize:12,letterSpacing:1}}>LIVE</span>
            {company&&<div style={{background:"rgba(255,255,255,.1)",backdropFilter:"blur(8px)",borderRadius:20,padding:"3px 12px",color:"rgba(255,255,255,.8)",fontSize:12,fontWeight:700,border:"1px solid rgba(255,255,255,.1)"}}>{company}</div>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",gap:4}}>
              {questions.map((_,i)=>(
                <div key={i} style={{width:22,height:3,borderRadius:2,background:i<qIndex?"#22c55e":i===qIndex?C.goldL:"rgba(255,255,255,.18)"}}/>
              ))}
            </div>
            <div style={{background:"rgba(255,255,255,.1)",borderRadius:20,padding:"3px 12px",color:"rgba(255,255,255,.7)",fontSize:12,fontWeight:700}}>Q{qIndex+1}/{questions.length}</div>
          </div>
        </div>

        {/* AI Face + Name */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,zIndex:5}}>
          <div style={{
            borderRadius:"50%", padding:8,
            border:`3px solid ${aiSpeaking?C.goldL:"rgba(255,255,255,.12)"}`,
            boxShadow:aiSpeaking?`0 0 0 0 ${C.gold},0 0 40px ${C.gold}25`:"none",
            animation:aiSpeaking?"ringPulse 1.8s infinite":"none",
            transition:"border-color .4s"
          }}>
            <AIFace speaking={aiSpeaking} size={170}/>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{color:"#fff",fontWeight:800,fontSize:17}}>Priya Sharma</div>
            <div style={{color:"rgba(255,255,255,.5)",fontSize:12,marginTop:2}}>
              Senior Hiring Manager{company?` · ${company}`:role?` · ${role}`:""}
            </div>
            {aiSpeaking&&(
              <div style={{display:"flex",justifyContent:"center",gap:3,alignItems:"flex-end",marginTop:8,height:18}}>
                {[.4,.6,.85,.6,.4].map((d,i)=>(
                  <span key={i} className="vbar" style={{height:18,color:C.goldL,animation:`voiceBar ${d}s ease-in-out ${i*.08}s infinite`}}/>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom question overlay */}
        <div style={{position:"absolute",bottom:70,left:0,right:0,padding:"0 16px",zIndex:20}}>
          {/* Question card */}
          <div style={{background:"rgba(0,0,0,.72)",backdropFilter:"blur(16px)",borderRadius:14,padding:"14px 18px",marginBottom:10,border:"1px solid rgba(255,255,255,.1)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{background:`${C.gold}25`,color:C.goldL,fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700}}>{q?.type}</span>
              {phase==="answering"&&(
                <span style={{color:tcol,fontWeight:900,fontSize:15,fontVariantNumeric:"tabular-nums"}}>⏱ {fmtTime(timeLeft)}</span>
              )}
            </div>
            <div style={{color:"#fff",fontSize:15,lineHeight:1.65,fontWeight:500}}>{q?.q}</div>
            {phase==="answering"&&(
              <div style={{height:2,background:"rgba(255,255,255,.1)",borderRadius:2,marginTop:11,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:tcol,borderRadius:2,transition:"width 1s linear"}}/>
              </div>
            )}
          </div>

          {/* Live transcript */}
          {phase==="answering"&&(
            <div style={{background:"rgba(0,0,0,.6)",backdropFilter:"blur(8px)",borderRadius:11,padding:"10px 14px",border:`1px solid ${listening?`${C.tealL}35`:"rgba(255,255,255,.08)"}`,minHeight:52,marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
                {listening&&<div style={{width:5,height:5,borderRadius:"50%",background:C.tealL,animation:"pulse 1s infinite"}}/>}
                <span style={{color:listening?C.tealL:"rgba(255,255,255,.3)",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>
                  {listening?"Your answer — mic live":"Stand by"}
                </span>
              </div>
              <div style={{color:"#fff",fontSize:13,lineHeight:1.7}}>
                {liveText&&<span>{liveText}</span>}
                {interimText&&!liveText.endsWith(interimText)&&<span style={{color:"rgba(255,255,255,.4)",fontStyle:"italic"}}> {interimText}</span>}
                {!liveText&&!interimText&&<span style={{color:"rgba(255,255,255,.25)",fontStyle:"italic"}}>Start speaking — your words appear here…</span>}
              </div>
            </div>
          )}

          {/* Instant feedback overlay */}
          {phase==="done-q"&&loadingFeedback&&(
            <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(0,0,0,.55)",borderRadius:11,padding:"11px 14
