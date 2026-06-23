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
  .pip{position:absolute;bottom:84px;right:16px;width:160px;height:112px;border-radius:12px;overflow:hidden;border:2px solid rgba(255,255,255,.2);background:#111;z-index:15;box-shadow:0 8px 24px rgba(0,0,0,.5);}
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

// ── AI INTERVIEWER AVATAR (Professional woman, photorealistic SVG) ────────────
function AIFace({speaking, size=200}){
  return (
    <div style={{position:"relative",width:size,height:size}}>
      <svg width={size} height={size} viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bgG" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1a3260"/>
            <stop offset="100%" stopColor="#0a1128"/>
          </radialGradient>
          <radialGradient id="skinG" cx="45%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#f9d5b0"/>
            <stop offset="100%" stopColor="#e8a870"/>
          </radialGradient>
          <radialGradient id="cheekG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0a080" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#f0a080" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="lipG" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#d4706a"/>
            <stop offset="100%" stopColor="#b04050"/>
          </radialGradient>
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="0.8"/>
          </filter>
        </defs>
        <circle cx="110" cy="110" r="110" fill="url(#bgG)"/>
        {/* Suit */}
        <path d="M20,220 Q40,170 110,158 Q180,170 200,220 Z" fill="#1a2f5a"/>
        <path d="M75,158 L110,200 L145,158" fill="#0f1f45"/>
        {/* Shirt collar */}
        <polygon points="110,158 93,180 110,172 127,180" fill="#f8fafc"/>
        {/* Neck */}
        <rect x="96" y="144" width="28" height="22" rx="8" fill="url(#skinG)"/>
        {/* Head */}
        <ellipse cx="110" cy="108" rx="50" ry="56" fill="url(#skinG)"/>
        {/* Hair - professional bun/blowout */}
        <ellipse cx="110" cy="70" rx="53" ry="38" fill="#1a0e08"/>
        <path d="M60,82 Q54,120 64,155 Q74,153 78,125 Q76,105 78,82 Z" fill="#1a0e08"/>
        <path d="M160,82 Q166,120 156,155 Q146,153 142,125 Q144,105 142,82 Z" fill="#1a0e08"/>
        <path d="M62,78 Q74,56 110,54 Q146,56 158,78 Q144,68 110,66 Q76,68 62,78 Z" fill="#220f06"/>
        {/* Hair highlight */}
        <path d="M80,60 Q110,52 138,60 Q120,56 110,57 Q98,56 80,60 Z" fill="#3a1a0e" opacity="0.6"/>
        {/* Ears */}
        <ellipse cx="60" cy="112" rx="8" ry="10" fill="#e8a870"/>
        <ellipse cx="160" cy="112" rx="8" ry="10" fill="#e8a870"/>
        <ellipse cx="60" cy="112" rx="5" ry="7" fill="#d4905c" opacity="0.4"/>
        <ellipse cx="160" cy="112" rx="5" ry="7" fill="#d4905c" opacity="0.4"/>
        {/* Gold earrings */}
        <circle cx="60" cy="122" r="4" fill={C.gold}/>
        <circle cx="160" cy="122" r="4" fill={C.gold}/>
        {/* Eyebrows */}
        <path d="M82,90 Q93,84 105,87" stroke="#3d1f0a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M115,87 Q127,84 138,90" stroke="#3d1f0a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Eyes */}
        <ellipse cx="93" cy="103" rx="11" ry="9" fill="white"/>
        <ellipse cx="93" cy="103" rx="7.5" ry="7.5" fill="#3d1f0a"/>
        <ellipse cx="93" cy="103" rx="5" ry="5" fill="#0f0808"/>
        <ellipse cx="95.5" cy="100.5" rx="2.2" ry="2.2" fill="white" opacity="0.85"/>
        <path d="M82,97 Q83,89 93,91" stroke="#1a0a06" strokeWidth="1.5" fill="none"/>
        <path d="M104,97 Q103,89 93,91" stroke="#1a0a06" strokeWidth="1.5" fill="none"/>
        <ellipse cx="127" cy="103" rx="11" ry="9" fill="white"/>
        <ellipse cx="127" cy="103" rx="7.5" ry="7.5" fill="#3d1f0a"/>
        <ellipse cx="127" cy="103" rx="5" ry="5" fill="#0f0808"/>
        <ellipse cx="129.5" cy="100.5" rx="2.2" ry="2.2" fill="white" opacity="0.85"/>
        <path d="M116,97 Q117,89 127,91" stroke="#1a0a06" strokeWidth="1.5" fill="none"/>
        <path d="M138,97 Q137,89 127,91" stroke="#1a0a06" strokeWidth="1.5" fill="none"/>
        {/* Nose */}
        <path d="M106,112 Q105,126 109,130 Q110,132 111,130 Q115,126 114,112" stroke="#c08050" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="105.5" cy="129" rx="4.5" ry="3" fill="#c8855a" opacity="0.35"/>
        <ellipse cx="114.5" cy="129" rx="4.5" ry="3" fill="#c8855a" opacity="0.35"/>
        {/* Blush */}
        <ellipse cx="75" cy="120" rx="12" ry="7" fill="url(#cheekG)"/>
        <ellipse cx="145" cy="120" rx="12" ry="7" fill="url(#cheekG)"/>
        {/* Mouth */}
        {speaking ? (
          <>
            <path d="M90,140 Q110,154 130,140" stroke="#a04040" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <ellipse cx="110" cy="144" rx="16" ry="8" fill="url(#lipG)" opacity="0.9"/>
            <ellipse cx="110" cy="141" rx="12" ry="3.5" fill="white" opacity="0.88"/>
          </>
        ) : (
          <>
            <path d="M94,140 Q110,151 126,140" stroke="#c07060" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M94,140 Q110,145 126,140" stroke="#e8a090" strokeWidth="1" fill="none" opacity="0.5"/>
          </>
        )}
        {/* Subtle speaking ring */}
        {speaking && (
          <circle cx="110" cy="108" r="106" fill="none" stroke={C.goldL} strokeWidth="2" opacity="0.35"
            style={{animation:"breathe 1.2s ease-in-out infinite"}}/>
        )}
      </svg>
      {speaking && (
        <div style={{position:"absolute",bottom:6,left:"50%",transform:"translateX(-50%)",display:"flex",gap:3,alignItems:"flex-end"}}>
          {[0.4,0.6,0.9,0.6,0.4].map((d,i)=>(
            <div key={i} style={{width:4,height:22,borderRadius:3,background:C.goldL,
              animation:`voiceBar ${d}s ease-in-out ${i*.1}s infinite`,transformOrigin:"center bottom"}}/>
          ))}
        </div>
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
            <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(0,0,0,.55)",borderRadius:11,padding:"11px 14px",color:"rgba(255,255,255,.6)",fontSize:13}}>
              <span style={{width:14,height:14,border:"2px solid rgba(255,255,255,.2)",borderTopColor:C.goldL,borderRadius:"50%",display:"inline-block",animation:"spin .8s linear infinite"}}/>
              Scoring your answer…
            </div>
          )}
          {phase==="done-q"&&!loadingFeedback&&feedback&&(
            <div style={{background:"rgba(0,0,0,.65)",backdropFilter:"blur(12px)",borderRadius:12,padding:"13px 16px",border:`1px solid ${feedback.score>=75?"#22c55e40":feedback.score>=50?`${C.gold}40`:"#ef444440"}`,animation:"slideIn .3s ease forwards"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{width:44,height:44,borderRadius:10,background:feedback.score>=75?"#22c55e20":feedback.score>=50?`${C.gold}20`:"#ef444420",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,flexShrink:0,color:feedback.score>=75?"#22c55e":feedback.score>=50?C.goldL:"#ef4444"}}>{feedback.score}%</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:"#fff",fontWeight:700,fontSize:13,marginBottom:3}}>
                    {feedback.score>=75?"Strong answer ✓":feedback.score>=50?"Good attempt":"Needs improvement"}
                  </div>
                  {feedback.tip&&<div style={{color:"rgba(255,255,255,.65)",fontSize:12,lineHeight:1.6}}>{feedback.tip}</div>}
                  {feedback.what_was_good&&<div style={{color:"#22c55e",fontSize:11.5,marginTop:4}}>✓ {feedback.what_was_good}</div>}
                </div>
                <button onClick={()=>onNext(qIndex)} style={{padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",background:isLast?`linear-gradient(135deg,#9a6c18,${C.gold})`:`linear-gradient(135deg,#0f766e,${C.teal})`,color:"#fff",fontWeight:700,fontSize:12,fontFamily:"'Inter',sans-serif",flexShrink:0}}>
                  {isLast?"See Report →":"Next →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Candidate PiP */}
        <div className="pip">
          {camReady?<video ref={videoRef} muted playsInline style={{width:"100%",height:"100%",objectFit:"cover",transform:"scaleX(-1)"}}/>
          :<div style={{width:"100%",height:"100%",background:"#1a1a2e",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
            <span style={{fontSize:26}}>🧑</span>
            <span style={{color:"rgba(255,255,255,.35)",fontSize:10}}>{camErr?"No camera":"Loading…"}</span>
          </div>}
          {micMuted&&<div style={{position:"absolute",top:6,right:6,background:"#ef4444",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>🔇</div>}
          <div style={{position:"absolute",bottom:6,left:6,background:"rgba(0,0,0,.5)",borderRadius:6,padding:"2px 7px",fontSize:10,color:"rgba(255,255,255,.7)",fontWeight:600}}>You</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{background:"rgba(8,12,20,.95)",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"center",gap:14,flexShrink:0,borderTop:"1px solid rgba(255,255,255,.06)"}}>
        {phase==="answering"&&(
          <>
            <button onClick={onToggleMic} style={{width:48,height:48,borderRadius:"50%",border:"none",cursor:"pointer",background:micMuted?"#ef4444":"rgba(255,255,255,.1)",color:"#fff",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",fontFamily:"'Inter',sans-serif"}}>
              {micMuted?"🔇":"🎙️"}
            </button>
            <button onClick={()=>onFinish(qIndex)} style={{padding:"12px 32px",borderRadius:24,border:"none",cursor:"pointer",background:`linear-gradient(135deg,#9a6c18,${C.gold},${C.goldL})`,color:"#fff",fontWeight:800,fontSize:14,fontFamily:"'Inter',sans-serif",boxShadow:`0 4px 20px ${C.gold}50`}}>
              Done ✓
            </button>
            <button onClick={onEnd} style={{width:48,height:48,borderRadius:"50%",border:"none",cursor:"pointer",background:"rgba(239,68,68,.2)",color:"#ef4444",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif"}}>
              📵
            </button>
          </>
        )}
        {phase==="speaking"&&<div style={{color:"rgba(255,255,255,.4)",fontSize:13}}>Priya is speaking — your mic activates when she's done…</div>}
        {phase==="done-q"&&!feedback&&!loadingFeedback&&<div style={{color:"rgba(255,255,255,.35)",fontSize:13}}>Processing…</div>}
      </div>
    </div>
  );
}

// ── RESUME INTERVIEW TAB ─────────────────────────────────────────────────────
function ResumeInterviewTab(){
  const [step,setStep]=useState("setup");
  const [resumeText,setResumeText]=useState("");
  const [company,setCompany]=useState("");
  const [jobTitle,setJobTitle]=useState("");
  const [difficulty,setDifficulty]=useState("Fresher");
  const [fileName,setFileName]=useState("");
  const [profile,setProfile]=useState(null);
  const [questions,setQuestions]=useState([]);
  const [genErr,setGenErr]=useState("");
  const [qIndex,setQIndex]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [aiSpeaking,setAiSpeaking]=useState(false);
  const [listening,setListening]=useState(false);
  const [liveText,setLiveText]=useState("");
  const [interimText,setInterimText]=useState("");
  const [timeLeft,setTimeLeft]=useState(90);
  const [phase,setPhase]=useState("idle");
  const [feedback,setFeedback]=useState(null);
  const [loadingFeedback,setLoadingFeedback]=useState(false);
  const [micMuted,setMicMuted]=useState(false);
  const [report,setReport]=useState(null);

  const recogRef=useRef(null);
  const finalRef=useRef("");
  const timerRef=useRef(null);
  const fileRef=useRef();
  const QTIME=90;

  const speechOK=typeof window!=="undefined"&&(window.SpeechRecognition||window.webkitSpeechRecognition);
  const ttsOK=typeof window!=="undefined"&&window.speechSynthesis;

  useEffect(()=>()=>{clearInterval(timerRef.current);stopRec();window.speechSynthesis?.cancel();},[]);

  const handleFile=async(e)=>{
    const f=e.target.files[0];if(!f)return;
    setFileName(f.name);
    try{
      let text="";
      if(f.name.endsWith(".pdf")) text=await extractPDF(f);
      else if(f.name.endsWith(".docx")) text=await extractDOCX(f);
      else{const r=new FileReader();r.onload=ev=>setResumeText(ev.target.result);r.readAsText(f);return;}
      setResumeText(text);
    }catch(e2){setGenErr("Could not read file: "+e2.message);}
  };

  const analyze=async()=>{
    if(!resumeText.trim())return;
    setStep("analyzing");setGenErr("");
    try{
      const compCtx=company?`Target company: ${company}. Mirror ${company}'s actual interview culture, difficulty, and style.`:"";
      const raw=await callGroq(
        `You are a senior ${jobTitle||"tech"} interviewer${company?` at ${company}`:""}.
${compCtx}
Experience level: ${difficulty}.
Read this resume carefully. Generate exactly 8 highly personalized interview questions.

Resume:
---
${resumeText.slice(0,3500)}
---

Rules:
- Reference specific projects, companies, technologies from THIS resume
- Ask about SPECIFIC experiences mentioned (not generic ones)
- Mix: 1 intro, 4 technical (dig into actual tech stack/projects), 2 behavioral (real scenarios), 1 closing
- ${company?"Ask what drew them to "+company+" specifically":""} 
- Make questions progressively harder

Return ONLY:
{"profile":{"name":"<from resume or Candidate>","topSkills":["s1","s2","s3","s4"],"keyProjects":["p1","p2","p3"],"experienceLevel":"<Fresher|Junior|Mid>","university":"<if found>"},"questions":[{"q":"<personalized spoken question>","type":"Intro|Technical|Behavioral|Closing","whyAsked":"<1 sentence>"}]}`,
        2200
      );
      const data=safeJSON(raw,null);
      if(!data?.questions?.length) throw new Error("parse fail");
      setProfile(data.profile);
      setQuestions(data.questions);
      setStep("brief");
    }catch(e){
      setGenErr("Using smart defaults — personalization partial.");
      setQuestions(FALLBACK_QUESTIONS);
      setProfile({name:"Candidate",topSkills:[],keyProjects:[],experienceLevel:difficulty});
      setStep("brief");
    }
  };

  const speak=useCallback((text)=>new Promise(resolve=>{
    if(!ttsOK){resolve();return;}
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.rate=0.95;u.pitch=1.05;
    const voices=window.speechSynthesis.getVoices();
    const v=voices.find(v=>/en-(US|GB|IN)/i.test(v.lang)&&/Female|Samantha|Karen|Moira|Veena|Raveena|Google UK English Female/i.test(v.name))||voices.find(v=>/en/i.test(v.lang));
    if(v)u.voice=v;
    setAiSpeaking(true);
    u.onend=()=>{setAiSpeaking(false);resolve();};
    u.onerror=()=>{setAiSpeaking(false);resolve();};
    window.speechSynthesis.speak(u);
  }),[ttsOK]);

  const stopRec=()=>{
    try{recogRef.current?.stop();}catch{}
    setListening(false);setInterimText("");
  };

  // FIX: single recognition instance, no duplicate appending
  const startRec=()=>{
    if(!speechOK)return;
    stopRec();
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SR();
    rec.continuous=true;rec.interimResults=true;rec.lang="en-US";
    finalRef.current="";
    setLiveText("");setInterimText("");

    rec.onresult=(e)=>{
      // Rebuild from scratch every time to prevent duplicates
      let finalAccum="",interimAccum="";
      for(let i=0;i<e.results.length;i++){
        if(e.results[i].isFinal) finalAccum+=e.results[i][0].transcript;
        else interimAccum+=e.results[i][0].transcript;
      }
      finalRef.current=finalAccum;
      setLiveText(finalAccum.trim());
      setInterimText(interimAccum.trim());
    };
    rec.onerror=(e)=>{if(e.error!=="no-speech")console.log("rec error",e.error);};
    // Don't restart on end — prevents double recognition
    rec.onend=()=>{setListening(false);};
    recogRef.current=rec;
    try{rec.start();setListening(true);}catch{}
  };

  const beginQ=async(idx)=>{
    setPhase("speaking");setLiveText("");setInterimText("");setFeedback(null);
    finalRef.current="";
    const intro=idx===0?`Hello! I'm Priya Sharma, Senior Hiring Manager${company?` at ${company}`:""}. Thank you for joining today. I've reviewed your resume and I'm impressed by your background. Let's begin. `:"";
    await speak(intro+questions[idx].q);
    setPhase("answering");setTimeLeft(QTIME);
    startRec();
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{if(t<=1){clearInterval(timerRef.current);finishQ(idx);return 0;}return t-1;});
    },1000);
  };

  const finishQ=async(idx)=>{
    clearInterval(timerRef.current);stopRec();setPhase("done-q");
    const ans=(finalRef.current||liveText||"").trim()||"(no answer captured)";
    const newAns={question:questions[idx].q,type:questions[idx].type,answer:ans};
    setAnswers(prev=>{const n=[...prev];n[idx]=newAns;return n;});
    setLoadingFeedback(true);
    try{
      const raw=await callGroq(
        `You are a strict senior interviewer${company?` at ${company}`:""} for ${jobTitle||"the role"} (${difficulty}).
Question (${questions[idx].type}): ${questions[idx].q}
Answer: ${ans.slice(0,900)}
${profile?"Candidate skills: "+profile.topSkills?.join(", "):""}

Be specific and honest. Score harshly if answer is vague or off-topic.
Return ONLY: {"score":<0-100>,"tip":"<2-3 sentence specific actionable feedback>","what_was_good":"<1 sentence about best part, or null if poor>","missing":"<what was missing from ideal answer>"}`,
        500
      );
      const fb=safeJSON(raw,{score:55,tip:"Keep practicing with more structured answers.",what_was_good:null,missing:"Specific examples and metrics"});
      setFeedback(fb);
    }catch{setFeedback({score:55,tip:"Answer recorded. Keep practicing!",what_was_good:null});}
    setLoadingFeedback(false);
  };

  const nextQ=(idx)=>{
    setFeedback(null);
    if(idx+1<questions.length){setQIndex(idx+1);beginQ(idx+1);}
    else wrapUp();
  };

  const startInterview=()=>{
    setStep("room");setAnswers([]);setQIndex(0);setFeedback(null);
    setTimeout(()=>beginQ(0),600);
  };

  const wrapUp=async()=>{
    setPhase("idle");window.speechSynthesis?.cancel();setStep("genreport");
    try{
      const transcript=answers.map((a,i)=>`Q${i+1} (${a.type}): ${a.question}\nAnswer: ${a.answer}`).join("\n\n");
      const raw=await callGroq(
        `You are a strict senior hiring panel${company?` at ${company}`:""} evaluating ${profile?.name||"the candidate"} for ${jobTitle||"a role"} (${difficulty}).
Full interview transcript:
${transcript.slice(0,4500)}
Resume skills: ${profile?.topSkills?.join(", ")||"N/A"}
Projects: ${profile?.keyProjects?.join(", ")||"N/A"}

Score honestly — don't inflate. Verdicts: Strong Hire (85+), Hire (70-84), Borderline (55-69), No Hire (<55).
Return ONLY:
{"overallScore":<0-100>,"verdict":"<Strong Hire|Hire|Borderline|No Hire>","communicationScore":<0-100>,"technicalScore":<0-100>,"confidenceScore":<0-100>,"structureScore":<0-100>,"resumeAlignmentScore":<0-100>,"summary":"<4-5 sentence brutally honest assessment>","companyFitNote":"<2 sentence about ${company||"company"} fit>","perQuestion":[{"question":"<short>","score":<0-100>,"feedback":"<2 sentence specific>"}],"strengths":["<s1>","<s2>","<s3>"],"improvements":["<i1>","<i2>","<i3>","<i4>"],"nextSteps":["<step1>","<step2>","<step3>"]}`,
        2800
      );
      const data=safeJSON(raw,null);
      if(!data?.overallScore) throw new Error("bad");
      setReport(data);
    }catch{
      setReport({overallScore:0,verdict:"—",communicationScore:0,technicalScore:0,confidenceScore:0,structureScore:0,resumeAlignmentScore:0,summary:"Could not generate report. Please retry.",companyFitNote:"",perQuestion:[],strengths:[],improvements:[],nextSteps:[]});
    }
    setStep("report");
  };

  const endInterview=()=>{
    window.speechSynthesis?.cancel();stopRec();clearInterval(timerRef.current);
    if(answers.length>0)wrapUp();
    else{setStep("setup");setPhase("idle");}
  };

  const sc=s=>s>=75?C.green:s>=50?C.gold:C.red;

  if(step==="setup") return (
    <div className="fade">
      <div style={{marginBottom:22}}>
        <div style={{fontWeight:900,fontSize:22,color:C.ink,marginBottom:5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>🎯 Resume-Powered Interview</div>
        <div style={{color:C.muted,fontSize:13.5,lineHeight:1.75,maxWidth:580}}>Upload your resume. Tell us the company and role. Our AI reads your <em>actual</em> experience and asks the exact questions a real interviewer would ask <strong style={{color:C.ink}}>you specifically</strong> — on camera, on mic, on the clock.</div>
      </div>

      {genErr&&<div style={{background:C.yellowPale,border:`1px solid ${C.yellow}40`,borderRadius:10,padding:"10px 14px",marginBottom:14,color:C.yellow,fontSize:12.5}}>⚠ {genErr}</div>}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:.6}}>Target Company</div>
          <input style={inp} placeholder="e.g. Google, Amazon, TCS, Wipro…" value={company} onChange={e=>setCompany(e.target.value)}/>
          <div style={{fontSize:11,color:C.muted,marginTop:4}}>AI mirrors that company's real interview style</div>
        </div>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:.6}}>Role Applying For</div>
          <input style={inp} placeholder="e.g. Software Engineer, Data Analyst…" value={jobTitle} onChange={e=>setJobTitle(e.target.value)}/>
        </div>
      </div>

      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:7,textTransform:"uppercase",letterSpacing:.6}}>Experience Level</div>
        <div style={{display:"flex",gap:8}}>
          {["Fresher","1–2 years","3–5 years"].map(d=>(
            <button key={d} onClick={()=>setDifficulty(d)} style={{flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${difficulty===d?C.gold:C.border}`,background:difficulty===d?C.goldPale:C.white,color:difficulty===d?C.gold:C.muted,fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>{d}</button>
          ))}
        </div>
      </div>

      {/* Resume upload */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.6}}>Your Resume</div>
          <button onClick={()=>fileRef.current.click()} style={{padding:"6px 14px",borderRadius:8,border:`1.5px solid ${C.blue}30`,background:C.bluePale,color:C.blue,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
            📎 Upload PDF / DOCX
          </button>
          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFile} style={{display:"none"}}/>
        </div>
        {fileName&&<div style={{background:C.greenPale,border:`1px solid ${C.greenBorder}`,borderRadius:8,padding:"6px 12px",marginBottom:8,fontSize:12,color:C.green,display:"flex",alignItems:"center",gap:6}}>✅ {fileName} loaded successfully</div>}
        <textarea
          style={{...inp,minHeight:180,resize:"vertical",fontFamily:"monospace",fontSize:12,lineHeight:1.7}}
          placeholder={`Paste your resume text here, or upload above.\n\nExample:\nRaghu Reddy | B.Tech CSE AI/ML | CGPA: 8.53 | Malla Reddy University\nSkills: Python, React, Node.js, MySQL, Java, Spring Boot\nInternship: Infotact Solutions (Dec 2025–Mar 2026) — Full Stack Developer\nProjects:\n  • TakePlace — SaaS job platform (React + Supabase + Groq AI)\n  • AgriPrice — ML price prediction for farmers\nGitHub: github.com/raghu2271`}
          value={resumeText}
          onChange={e=>setResumeText(e.target.value)}
        />
        <div style={{fontSize:11.5,color:C.muted,marginTop:5,lineHeight:1.7}}>The AI reads your actual projects, skills, and internships to ask <strong style={{color:C.ink}}>questions only you can answer</strong>.</div>
      </div>

      {!speechOK&&<div style={{background:C.yellowPale,border:`1px solid ${C.yellow}30`,borderRadius:10,padding:"10px 14px",marginBottom:14,color:C.yellow,fontSize:12}}>⚠ Voice recognition works best in Chrome on desktop or Android. You can still type answers if needed.</div>}

      {/* Feature highlights */}
      <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:20}}>
        <div style={{fontWeight:700,color:C.ink,fontSize:13,marginBottom:12}}>What makes this different from any other mock interview</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[
            ["🎥","Full-screen camera room","Exactly like a real Zoom interview — you see yourself, they see you"],
            ["🧑‍💼","AI speaks your questions","Priya Sharma's voice asks questions out loud, just like a real interviewer"],
            ["📄","Reads YOUR resume","Questions are about your actual TakePlace project, your internship, your tech stack"],
            ["🏢","Company style matched","Google interviews differently than TCS — we mirror that exactly"],
            ["⏱","90 seconds per answer","Real time pressure, real interview conditions, real improvement"],
            ["📋","Detailed report","Per-question scores, strengths, weaknesses, and what to fix before the real one"],
          ].map(([icon,title,desc],i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:20,flexShrink:0}}>{icon}</span>
              <div><div style={{fontWeight:700,fontSize:12.5,color:C.ink}}>{title}</div><div style={{fontSize:11.5,color:C.muted,lineHeight:1.6}}>{desc}</div></div>
            </div>
          ))}
        </div>
      </div>

      <Btn v="gold" onClick={analyze} disabled={!resumeText.trim()} style={{width:"100%",padding:"15px",fontSize:15,borderRadius:12}}>
        🎙️ Analyze Resume & Start My Interview →
      </Btn>
    </div>
  );

  if(step==="analyzing") return (
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:52,marginBottom:16,animation:"float 2s ease-in-out infinite"}}>🔍</div>
      <div style={{fontWeight:800,fontSize:20,color:C.ink,marginBottom:8,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Reading your resume…</div>
      <div style={{color:C.muted,fontSize:14,maxWidth:340,margin:"0 auto 6px",lineHeight:1.7}}>
        Extracting your projects, skills, and experience.{company?` Researching ${company}'s interview patterns.`:""}
      </div>
      <div style={{color:C.muted,fontSize:13,marginBottom:28}}>Generating 8 personalized questions only you can answer.</div>
      <Spin size={38}/>
    </div>
  );

  if(step==="brief") return (
    <div className="fade" style={{maxWidth:580,margin:"0 auto"}}>
      <button onClick={()=>setStep("setup")} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginBottom:16,fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:4}}>← Edit resume / company</button>

      {profile&&(
        <div style={{background:`linear-gradient(160deg,${C.navy},${C.navyL})`,borderRadius:18,padding:"22px 24px",marginBottom:18,color:"#fff"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
            <div style={{width:54,height:54,borderRadius:14,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>📄</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:18}}>{profile.name}</div>
              <div style={{color:"rgba(255,255,255,.55)",fontSize:12,marginTop:2}}>{jobTitle||"Applied Role"} · {profile.experienceLevel||difficulty}</div>
            </div>
            {company&&<div style={{background:`${C.gold}20`,border:`1px solid ${C.gold}35`,borderRadius:20,padding:"6px 14px",color:C.goldL,fontWeight:700,fontSize:12,flexShrink:0}}>{company}</div>}
          </div>
          {profile.topSkills?.length>0&&(
            <div style={{marginBottom:10}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:6,fontWeight:700,letterSpacing:.8}}>DETECTED SKILLS</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {profile.topSkills.map((s,i)=><span key={i} style={{background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.85)",fontSize:12,padding:"4px 12px",borderRadius:20,fontWeight:600}}>{s}</span>)}
              </div>
            </div>
          )}
          {profile.keyProjects?.length>0&&(
            <div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:6,fontWeight:700,letterSpacing:.8}}>KEY PROJECTS</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {profile.keyProjects.map((p,i)=><span key={i} style={{background:`${C.teal}30`,color:C.tealL,fontSize:12,padding:"4px 12px",borderRadius:20,fontWeight:600}}>{p}</span>)}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:16,padding:22,marginBottom:18,boxShadow:"0 4px 20px rgba(0,0,0,.05)"}}>
        <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:14}}>Your personalized questions ({questions.length})</div>
        {questions.map((q,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12,paddingBottom:12,borderBottom:i<questions.length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{width:26,height:26,borderRadius:8,background:`${C.navy}0e`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.navy,flexShrink:0}}>{i+1}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:C.ink2,lineHeight:1.65}}>{q.q}</div>
              <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>
                <Tag color={C.teal} bg={C.tealPale}>{q.type}</Tag>
                {q.whyAsked&&<span style={{fontSize:11,color:C.muted,fontStyle:"italic"}}>{q.whyAsked}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {genErr&&<div style={{background:C.yellowPale,border:`1px solid ${C.yellow}30`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.yellow,marginBottom:14}}>{genErr}</div>}

      <div style={{background:`${C.navy}06`,border:`1px solid ${C.navy}10`,borderRadius:12,padding:"14px 16px",marginBottom:20,fontSize:13,color:C.muted,lineHeight:1.8}}>
        <strong style={{color:C.ink}}>How it works:</strong> Full-screen interview room with your camera on. Priya (AI interviewer) speaks each question aloud. Your mic activates — 90 seconds to answer. Instant AI feedback after each answer. Full detailed report at the end.
      </div>

      <Btn v="gold" onClick={startInterview} style={{width:"100%",padding:"15px",fontSize:15,borderRadius:12}}>
        🎥 Enter Interview Room →
      </Btn>
    </div>
  );

  if(step==="room") return (
    <InterviewRoom
      role={jobTitle||"the role"} company={company} questions={questions} qIndex={qIndex}
      phase={phase} aiSpeaking={aiSpeaking} listening={listening}
      liveText={liveText} interimText={interimText} timeLeft={timeLeft}
      feedback={feedback} loadingFeedback={loadingFeedback}
      onFinish={finishQ} onNext={nextQ} onEnd={endInterview}
      onToggleMic={()=>setMicMuted(m=>!m)} micMuted={micMuted}
    />
  );

  if(step==="genreport") return (
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:52,marginBottom:16,animation:"float 2s ease-in-out infinite"}}>📋</div>
      <div style={{fontWeight:800,fontSize:20,color:C.ink,marginBottom:8,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Building your interview report…</div>
      <div style={{color:C.muted,fontSize:14,maxWidth:340,margin:"0 auto 24px",lineHeight:1.7}}>
        Reviewing all {answers.length} answers against your resume{company?` and ${company}'s hiring bar`:""}.
      </div>
      <Spin size={38}/>
    </div>
  );

  if(step==="report"&&report) return (
    <div className="fade">
      {/* Score hero */}
      <div style={{background:`linear-gradient(160deg,${C.navy},${C.navyL})`,borderRadius:20,padding:"28px 22px",marginBottom:16,color:"#fff"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:6,letterSpacing:1,textTransform:"uppercase"}}>
            {jobTitle||"Interview"}{company?` · ${company}`:""} · {difficulty}
          </div>
          <div style={{fontSize:56,fontWeight:900,lineHeight:1,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{report.overallScore}%</div>
          <div style={{marginTop:10}}>
            <span style={{background:`${report.overallScore>=75?"#22c55e":report.overallScore>=55?C.goldL:C.red}20`,color:report.overallScore>=75?"#22c55e":report.overallScore>=55?C.goldL:"#ef4444",padding:"5px 18px",borderRadius:20,fontWeight:800,fontSize:13,border:`1px solid ${report.overallScore>=75?"#22c55e40":report.overallScore>=55?`${C.gold}40`:"#ef444440"}`}}>{report.verdict}</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:18}}>
          {[["Comm.",report.communicationScore],["Technical",report.technicalScore],["Confidence",report.confidenceScore],["Structure",report.structureScore],["Resume Fit",report.resumeAlignmentScore]].map(([l,v],i)=>(
            <div key={i} style={{textAlign:"center",background:"rgba(255,255,255,.07)",borderRadius:10,padding:"10px 4px"}}>
              <div style={{fontWeight:800,fontSize:15}}>{v}%</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,.45)",marginTop:2,fontWeight:600}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:13.5,lineHeight:1.8,color:"rgba(255,255,255,.75)",marginBottom:report.companyFitNote?12:0}}>{report.summary}</div>
        {report.companyFitNote&&<div style={{background:`${C.gold}15`,border:`1px solid ${C.gold}25`,borderRadius:10,padding:"10px 14px",fontSize:13,color:C.goldL}}>🏢 {report.companyFitNote}</div>}
      </div>

      {report.strengths?.length>0&&(
        <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}>
          <div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:12}}>✅ What worked well</div>
          {report.strengths.map((s,i)=>(
            <div key={i} style={{background:C.greenPale,borderRadius:8,padding:"10px 13px",marginBottom:8,fontSize:13,color:C.ink2,border:`1px solid ${C.greenBorder}`,display:"flex",gap:8}}>
              <span style={{color:C.green,flexShrink:0}}>✓</span><span>{s}</span>
            </div>
          ))}
        </div>
      )}

      {report.improvements?.length>0&&(
        <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}>
          <div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:12}}>🎯 Areas to work on</div>
          {report.improvements.map((s,i)=>(
            <div key={i} style={{background:C.bg,borderRadius:8,padding:"10px 13px",marginBottom:8,border:`1px solid ${C.border}`,display:"flex",gap:9}}>
              <span style={{color:C.gold,fontWeight:800,flexShrink:0}}>→</span><span style={{color:C.ink2,fontSize:13}}>{s}</span>
            </div>
          ))}
        </div>
      )}

      {report.nextSteps?.length>0&&(
        <div style={{background:C.bluePale,border:`1px solid ${C.blueL}30`,borderRadius:14,padding:18,marginBottom:12}}>
          <div style={{fontWeight:700,color:C.blue,fontSize:14,marginBottom:12}}>🚀 Your next steps</div>
          {report.nextSteps.map((s,i)=>(
            <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:8,fontSize:13,color:C.ink2}}>
              <span style={{color:C.blue,fontWeight:800,flexShrink:0}}>{i+1}.</span>{s}
            </div>
          ))}
        </div>
      )}

      {report.perQuestion?.length>0&&(
        <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:16}}>
          <div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:12}}>🔍 Question by question</div>
          {report.perQuestion.map((p,i)=>(
            <div key={i} style={{background:C.bg,borderRadius:10,padding:"12px 14px",marginBottom:9,border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,gap:8}}>
                <div style={{fontWeight:600,color:C.ink,fontSize:12.5}}>Q{i+1}. {p.question}</div>
                <div style={{fontWeight:800,fontSize:13,color:sc(p.score),flexShrink:0}}>{p.score}%</div>
              </div>
              <div style={{color:C.muted,fontSize:12.5,lineHeight:1.7}}>{p.feedback}</div>
              <Bar pct={p.score} color={sc(p.score)}/>
            </div>
          ))}
        </div>
      )}

      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <Btn v="gold" onClick={()=>{setStep("brief");setAnswers([]);setQIndex(0);setReport(null);}} style={{flex:1,padding:"13px"}}>🔁 Retry Same Interview</Btn>
        <Btn v="ghost" onClick={()=>{setStep("setup");setAnswers([]);setQIndex(0);setReport(null);setQuestions([]);setProfile(null);setResumeText("");setFileName("");}} style={{flex:1,padding:"13px"}}>📄 New Resume</Btn>
      </div>
    </div>
  );

  return null;
}

// ── QUICK MOCK TAB ────────────────────────────────────────────────────────────
function QuickMockTab(){
  const [screen,setScreen]=useState("roles");
  const [catFilter,setCatFilter]=useState("All");
  const [role,setRole]=useState(null);
  const [difficulty,setDifficulty]=useState("Mid-level");
  const [questions,setQuestions]=useState([]);
  const [qIndex,setQIndex]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [loadingQs,setLoadingQs]=useState(false);
  const [genErr,setGenErr]=useState("");
  const [aiSpeaking,setAiSpeaking]=useState(false);
  const [listening,setListening]=useState(false);
  const [liveText,setLiveText]=useState("");
  const [interimText,setInterimText]=useState("");
  const [timeLeft,setTimeLeft]=useState(90);
  const [phase,setPhase]=useState("idle");
  const [feedback,setFeedback]=useState(null);
  const [loadingFeedback,setLoadingFeedback]=useState(false);
  const [genReport,setGenReport]=useState(false);
  const [report,setReport]=useState(null);
  const [micMuted,setMicMuted]=useState(false);

  const recogRef=useRef(null);
  const finalRef=useRef("");
  const timerRef=useRef(null);
  const QTIME=90;

  const speechOK=typeof window!=="undefined"&&(window.SpeechRecognition||window.webkitSpeechRecognition);
  const ttsOK=typeof window!=="undefined"&&window.speechSynthesis;

  useEffect(()=>()=>{clearInterval(timerRef.current);stopRec();window.speechSynthesis?.cancel();},[]);

  const filteredRoles=catFilter==="All"?ROLES:ROLES.filter(r=>r.cat===catFilter);

  const pickRole=async(r)=>{
    setRole(r);setScreen("brief");setGenErr("");setLoadingQs(true);setQuestions([]);
    try{
      const raw=await callGroq(`You are a senior ${r.title} interviewer. Difficulty: ${difficulty}. Focus: ${r.focus}.
Generate exactly 6 spoken interview questions: 1 intro, 3 technical (specific to ${r.focus}), 1 behavioral, 1 closing.
Natural spoken language, progressive difficulty.
Return ONLY: {"questions":[{"q":"<question>","type":"Intro|Technical|Behavioral|Closing"}]}`,900);
      const data=safeJSON(raw,null);
      const qs=data?.questions?.length===6?data.questions:FALLBACK_QUESTIONS;
      setQuestions(qs);
    }catch{setGenErr("Using standard questions.");setQuestions(FALLBACK_QUESTIONS);}
    setLoadingQs(false);
  };

  const speak=useCallback((text)=>new Promise(resolve=>{
    if(!ttsOK){resolve();return;}
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.rate=0.97;u.pitch=0.93;
    const voices=window.speechSynthesis.getVoices();
    const v=voices.find(v=>/en-(US|GB|IN)/i.test(v.lang)&&/Male|David|Daniel|Google/i.test(v.name))||voices.find(v=>/en/i.test(v.lang));
    if(v)u.voice=v;
    setAiSpeaking(true);
    u.onend=()=>{setAiSpeaking(false);resolve();};
    u.onerror=()=>{setAiSpeaking(false);resolve();};
    window.speechSynthesis.speak(u);
  }),[ttsOK]);

  const stopRec=()=>{try{recogRef.current?.stop();}catch{}setListening(false);setInterimText("");};

  // FIX: rebuild from scratch, no duplicate text
  const startRec=()=>{
    if(!speechOK)return;
    stopRec();
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SR();
    rec.continuous=true;rec.interimResults=true;rec.lang="en-US";
    finalRef.current="";
    setLiveText("");setInterimText("");
    rec.onresult=(e)=>{
      let finalAccum="",interimAccum="";
      for(let i=0;i<e.results.length;i++){
        if(e.results[i].isFinal)finalAccum+=e.results[i][0].transcript;
        else interimAccum+=e.results[i][0].transcript;
      }
      finalRef.current=finalAccum;
      setLiveText(finalAccum.trim());
      setInterimText(interimAccum.trim());
    };
    rec.onerror=(e)=>{if(e.error!=="no-speech"){}};
    rec.onend=()=>setListening(false);
    recogRef.current=rec;
    try{rec.start();setListening(true);}catch{}
  };

  const beginQ=async(idx)=>{
    setPhase("speaking");setLiveText("");setInterimText("");setFeedback(null);
    finalRef.current="";
    const intro=idx===0?`Hello, I'm your interviewer today. We're looking for a ${role.title}. Let's begin. `:"";
    await speak(intro+questions[idx].q);
    setPhase("answering");setTimeLeft(QTIME);
    startRec();
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{if(t<=1){clearInterval(timerRef.current);finishQ(idx);return 0;}return t-1;});
    },1000);
  };

  const finishQ=async(idx)=>{
    clearInterval(timerRef.current);stopRec();setPhase("done-q");
    const ans=(finalRef.current||liveText||"").trim()||"(no answer captured)";
    setAnswers(prev=>{const n=[...prev];n[idx]={question:questions[idx].q,type:questions[idx].type,answer:ans};return n;});
    setLoadingFeedback(true);
    try{
      const raw=await callGroq(`You are a strict ${role.title} interviewer (${difficulty}).
Question (${questions[idx].type}): ${questions[idx].q}
Answer: ${ans.slice(0,800)}
Score strictly. Return ONLY: {"score":<0-100>,"tip":"<2-3 sentence specific feedback>","what_was_good":"<1 sentence or null>"}`,450);
      const fb=safeJSON(raw,{score:55,tip:"Practice with more specific examples.",what_was_good:null});
      setFeedback(fb);
    }catch{setFeedback({score:55,tip:"Answer recorded.",what_was_good:null});}
    setLoadingFeedback(false);
  };

  const nextQ=(idx)=>{
    setFeedback(null);
    if(idx+1<questions.length){setQIndex(idx+1);beginQ(idx+1);}
    else wrapUp();
  };

  const startInterview=()=>{setScreen("live");setAnswers([]);setQIndex(0);setFeedback(null);setTimeout(()=>beginQ(0),400);};

  const wrapUp=async()=>{
    setPhase("idle");setGenReport(true);
    try{
      const transcript=answers.map((a,i)=>`Q${i+1} (${a.type}): ${a.question}\nAnswer: ${a.answer}`).join("\n\n");
      const raw=await callGroq(`Strict hiring panel for ${role.title} (${difficulty}).
${transcript.slice(0,4000)}
Return ONLY: {"overallScore":<0-100>,"verdict":"<Strong Hire|Hire|Borderline|No Hire>","communicationScore":<0-100>,"technicalScore":<0-100>,"confidenceScore":<0-100>,"structureScore":<0-100>,"summary":"<3-4 sentence honest assessment>","perQuestion":[{"question":"<short>","score":<0-100>,"feedback":"<2 sentence>"}],"strengths":["<s1>","<s2>"],"improvements":["<i1>","<i2>","<i3>"]}`,2200);
      const data=safeJSON(raw,null);
      if(!data?.overallScore)throw new Error("bad");
      setReport(data);
    }catch{setReport({overallScore:0,verdict:"—",communicationScore:0,technicalScore:0,confidenceScore:0,structureScore:0,summary:"Could not generate. Please retry.",perQuestion:[],strengths:[],improvements:[]});}
    setGenReport(false);setScreen("report");
  };

  const restart=()=>{window.speechSynthesis?.cancel();stopRec();clearInterval(timerRef.current);setScreen("roles");setRole(null);setQuestions([]);setAnswers([]);setQIndex(0);setReport(null);setFeedback(null);};
  const sc=s=>s>=75?C.green:s>=50?C.gold:C.red;

  if(screen==="roles") return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontWeight:900,fontSize:22,color:C.ink,marginBottom:5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>🎤 Quick Mock Interview</div>
        <div style={{color:C.muted,fontSize:13.5,lineHeight:1.7}}>Pick a role. No resume needed. For a personalized interview based on your actual resume, use <strong style={{color:C.ink}}>Resume Interview</strong> instead.</div>
      </div>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:18}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCatFilter(c)} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${catFilter===c?C.gold:C.border}`,background:catFilter===c?C.goldPale:C.white,color:catFilter===c?C.gold:C.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>{c}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12}}>
        {filteredRoles.map(r=>(
          <div key={r.id} className="lift" onClick={()=>pickRole(r)}
            style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:16,padding:"18px 16px",borderTop:`3px solid ${C.navy}20`,boxShadow:"0 1px 6px rgba(0,0,0,.04)"}}>
            <div style={{fontSize:28,marginBottom:10}}>{r.icon}</div>
            <div style={{fontWeight:700,fontSize:13.5,color:C.ink,marginBottom:4}}>{r.title}</div>
            <div style={{color:C.muted,fontSize:11.5,lineHeight:1.65,marginBottom:10}}>{r.focus}</div>
            <Tag color={C.teal} bg={C.tealPale}>{r.cat}</Tag>
          </div>
        ))}
      </div>
    </div>
  );

  if(screen==="brief") return (
    <div className="fade" style={{maxWidth:500,margin:"0 auto"}}>
      <button onClick={()=>setScreen("roles")} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginBottom:16,fontFamily:"'Inter',sans-serif"}}>← Choose different role</button>
      <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:20,padding:28,boxShadow:"0 4px 24px rgba(0,0,0,.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22}}>
          <div style={{width:56,height:56,background:`${C.navy}08`,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>{role.icon}</div>
          <div>
            <div style={{fontWeight:800,fontSize:19,color:C.ink,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{role.title}</div>
            <div style={{color:C.muted,fontSize:12,marginTop:2}}>{role.focus}</div>
          </div>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontWeight:700,fontSize:13,color:C.ink,marginBottom:10}}>Experience level</div>
          <div style={{display:"flex",gap:8}}>
            {["Entry-level","Mid-level","Senior"].map(d=>(
              <button key={d} onClick={()=>setDifficulty(d)} style={{flex:1,padding:"10px 4px",borderRadius:10,border:`1.5px solid ${difficulty===d?C.gold:C.border}`,background:difficulty===d?C.goldPale:C.white,color:difficulty===d?C.gold:C.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>{d}</button>
            ))}
          </div>
        </div>
        {loadingQs?<div style={{textAlign:"center",padding:"28px 0"}}><Spin size={30}/><div style={{color:C.muted,fontSize:13,marginTop:12}}>Preparing questions…</div></div>:(
          <>
            {genErr&&<div style={{background:C.yellowPale,border:`1px solid ${C.yellow}30`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.yellow,marginBottom:12}}>{genErr}</div>}
            <Btn v="gold" onClick={startInterview} disabled={!questions.length} style={{width:"100%",padding:"14px",fontSize:15,borderRadius:12}}>🎙️ Start Interview</Btn>
          </>
        )}
      </div>
    </div>
  );

  if(screen==="live") return (
    <InterviewRoom
      role={role.title} company={null} questions={questions} qIndex={qIndex}
      phase={phase} aiSpeaking={aiSpeaking} listening={listening}
      liveText={liveText} interimText={interimText} timeLeft={timeLeft}
      feedback={feedback} loadingFeedback={loadingFeedback}
      onFinish={finishQ} onNext={nextQ} onEnd={()=>{window.speechSynthesis?.cancel();stopRec();clearInterval(timerRef.current);if(answers.length>0)wrapUp();else setScreen("roles");}}
      onToggleMic={()=>setMicMuted(m=>!m)} micMuted={micMuted}
    />
  );

  if(genReport) return <div style={{textAlign:"center",padding:"80px 20px"}}><div style={{fontSize:52,marginBottom:16,animation:"float 2s ease-in-out infinite"}}>📋</div><div style={{fontWeight:800,fontSize:20,color:C.ink,marginBottom:24,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Generating your report…</div><Spin size={36}/></div>;

  if(screen==="report"&&report) return (
    <div className="fade">
      <div style={{background:`linear-gradient(160deg,${C.navy},${C.navyL})`,borderRadius:20,padding:"28px 22px",marginBottom:16,color:"#fff"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,.45)",marginBottom:6,letterSpacing:1}}>{role.icon} {role.title} · {difficulty}</div>
          <div style={{fontSize:52,fontWeight:900,lineHeight:1,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{report.overallScore}%</div>
          <div style={{marginTop:10}}><span style={{background:"rgba(255,255,255,.1)",color:report.overallScore>=75?"#22c55e":report.overallScore>=55?C.goldL:"#ef4444",padding:"5px 18px",borderRadius:20,fontWeight:800,fontSize:13}}>{report.verdict}</span></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:18}}>
          {[["Comm.",report.communicationScore],["Technical",report.technicalScore],["Confidence",report.confidenceScore],["Structure",report.structureScore]].map(([l,v],i)=>(
            <div key={i} style={{textAlign:"center",background:"rgba(255,255,255,.07)",borderRadius:10,padding:"10px 4px"}}>
              <div style={{fontWeight:800,fontSize:15}}>{v}%</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,.45)",marginTop:2,fontWeight:600}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:13.5,lineHeight:1.8,color:"rgba(255,255,255,.75)",textAlign:"center"}}>{report.summary}</div>
      </div>
      {report.strengths?.length>0&&<div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}><div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:12}}>✅ What worked</div>{report.strengths.map((s,i)=><div key={i} style={{background:C.greenPale,borderRadius:8,padding:"10px 13px",marginBottom:7,fontSize:13,color:C.ink2,border:`1px solid ${C.greenBorder}`,display:"flex",gap:8}}><span style={{color:C.green}}>✓</span><span>{s}</span></div>)}</div>}
      {report.improvements?.length>0&&<div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}><div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:12}}>🎯 Improve</div>{report.improvements.map((s,i)=><div key={i} style={{background:C.bg,borderRadius:8,padding:"10px 13px",marginBottom:7,border:`1px solid ${C.border}`,display:"flex",gap:9}}><span style={{color:C.gold,fontWeight:800}}>→</span><span style={{color:C.ink2,fontSize:13}}>{s}</span></div>)}</div>}
      {report.perQuestion?.length>0&&<div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:16}}><div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:12}}>🔍 Q by Q</div>{report.perQuestion.map((p,i)=><div key={i} style={{background:C.bg,borderRadius:10,padding:"12px 14px",marginBottom:9,border:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5,gap:8}}><div style={{fontWeight:600,color:C.ink,fontSize:12.5}}>Q{i+1}. {p.question}</div><div style={{fontWeight:800,fontSize:13,color:sc(p.score),flexShrink:0}}>{p.score}%</div></div><div style={{color:C.muted,fontSize:12.5,lineHeight:1.7}}>{p.feedback}</div><Bar pct={p.score} color={sc(p.score)}/></div>)}</div>}
      <div style={{display:"flex",gap:10}}><Btn v="gold" onClick={()=>pickRole(role)} style={{flex:1,padding:"13px"}}>🔁 Retry</Btn><Btn v="ghost" onClick={restart} style={{flex:1,padding:"13px"}}>🎲 Other Role</Btn></div>
    </div>
  );

  return null;
}

// ── JOBS TAB ──────────────────────────────────────────────────────────────────
function JobsTab(){
  const [jobs,setJobs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState(()=>sessionStorage.getItem("tp_s")||"fresher");
  const [location,setLocation]=useState(()=>sessionStorage.getItem("tp_l")||"india");
  const [expanded,setExpanded]=useState(null);
  const [saved,setSaved]=useState([]);
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
        category:j.category?.label||"Technology",
      })):[]);
    }catch{}
    setLoading(false);
  };

  return (
    <div>
      <div style={{fontWeight:900,fontSize:22,color:C.ink,marginBottom:4,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>🔥 Live Job Feed</div>
      <div style={{color:C.muted,fontSize:13.5,marginBottom:16,lineHeight:1.7}}>Real fresher openings from companies across India · Updated daily via Adzuna</div>
      <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:16,boxShadow:"0 1px 6px rgba(0,0,0,.04)"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Role / Keyword</div>
            <input style={inp} placeholder="e.g. fresher, React, Python…" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Location</div>
            <input style={inp} placeholder="e.g. india, hyderabad…" value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
          </div>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
          {quickRoles.map(r=>(
            <button key={r} onClick={()=>{setSearch(r.toLowerCase());fetchJobs(r.toLowerCase(),location);}}
              style={{padding:"4px 12px",borderRadius:20,border:`1.5px solid ${search===r.toLowerCase()?C.gold:C.border}`,background:search===r.toLowerCase()?C.goldPale:C.white,color:search===r.toLowerCase()?C.gold:C.muted,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>{r}</button>
          ))}
        </div>
        <Btn v="primary" onClick={()=>fetchJobs()} style={{width:"100%"}}>🔍 Search Jobs</Btn>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:15,color:C.ink}}>Results</div>
        {!loading&&jobs.length>0&&<div style={{display:"flex",alignItems:"center",gap:6,background:C.greenPale,borderRadius:20,padding:"4px 12px",border:`1px solid ${C.greenBorder}`}}><div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/><span style={{color:C.green,fontSize:11,fontWeight:700}}>{jobs.length} live jobs</span></div>}
      </div>

      {loading&&<div style={{textAlign:"center",padding:"60px 0"}}><Spin size={36}/></div>}
      {!loading&&jobs.map((job,i)=>{
        const isExp=expanded===job.id,isSaved=saved.includes(job.id);
        return (
          <div key={job.id} className="lift" style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:8,borderLeft:`4px solid ${C.navy}`,boxShadow:"0 1px 5px rgba(0,0,0,.03)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,gap:8}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:C.ink}}>{job.title}</div>
                <div style={{color:C.muted,fontSize:12,marginTop:2}}>{job.company} · {job.location}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{color:C.green,fontWeight:800,fontSize:13}}>{job.salary}</div>
                <div style={{color:C.muted,fontSize:11,marginTop:1}}>{job.posted}</div>
              </div>
            </div>
            <div style={{color:C.muted,fontSize:12.5,lineHeight:1.7,marginBottom:12,background:C.bg,borderRadius:8,padding:"8px 10px"}}>
              {isExp?job.description.replace(/<[^>]+>/g,""):job.desc200.replace(/<[^>]+>/g,"")+(job.description.length>200?"…":"")}
              {job.description.length>200&&<button onClick={()=>setExpanded(isExp?null:job.id)} style={{background:"none",border:"none",color:C.gold,fontSize:11,cursor:"pointer",marginLeft:5,fontFamily:"'Inter',sans-serif",fontWeight:700}}>{isExp?"Less ▲":"Read more ▼"}</button>}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <Tag color={C.teal} bg={C.tealPale}>{job.category}</Tag>
              <div style={{display:"flex",gap:7}}>
                <button onClick={()=>setSaved(s=>s.includes(job.id)?s.filter(x=>x!==job.id):[...s,job.id])} style={{padding:"6px 11px",borderRadius:8,border:`1.5px solid ${isSaved?C.gold:C.border}`,background:isSaved?C.goldPale:"transparent",cursor:"pointer",fontSize:13,color:isSaved?C.gold:C.muted,fontFamily:"'Inter',sans-serif"}}>{isSaved?"★":"☆"}</button>
                <Btn v="primary" onClick={()=>window.open(job.url,"_blank")} small>Apply →</Btn>
              </div>
            </div>
          </div>
        );
      })}
      {!loading&&jobs.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:C.muted}}><div style={{fontSize:40,marginBottom:12}}>🔍</div><div style={{fontWeight:700}}>No jobs found.</div><div style={{fontSize:13,marginTop:4}}>Try a different role or city.</div></div>}
    </div>
  );
}

// ── LANDING PAGE ──────────────────────────────────────────────────────────────
function LandingPage({onStart}){
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>60);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);

  const companies=[
    {name:"Google",color:"#4285F4",bg:"#e8f0fe"},
    {name:"Amazon",color:"#FF9900",bg:"#fff3e0"},
    {name:"Microsoft",color:"#00a4ef",bg:"#e1f5fe"},
    {name:"TCS",color:"#1e3a6e",bg:"#e8edf5"},
    {name:"Infosys",color:"#007cc3",bg:"#e1f2fb"},
    {name:"Wipro",color:"#341660",bg:"#ede7f6"},
  ];

  const features=[
    {icon:"🎯",title:"Resume-personalized questions",desc:"AI reads YOUR actual projects, internships, and tech stack. Then asks exactly what a real interviewer would ask you specifically — not generic questions."},
    {icon:"🎥",title:"Full-screen camera room",desc:"Full HD camera view, picture-in-picture of yourself, LIVE indicator. Indistinguishable from a real Zoom interview. Build composure under real conditions."},
    {icon:"🗣️",title:"AI interviewer speaks to you",desc:"Priya Sharma, our AI hiring manager, reads every question aloud in natural voice. Your mic activates when she's done. Exactly like a real interview."},
    {icon:"⚡",title:"Instant per-answer feedback",desc:"Score, what you did well, what was missing, and how to improve — delivered immediately after each answer, before you move to the next question."},
    {icon:"🏢",title:"Company-style matching",desc:"Google interviews differently than TCS. Amazon's bar is different from Wipro's. We mirror each company's real interview culture and difficulty calibration."},
    {icon:"📊",title:"Detailed debrief report",desc:"Overall score, 5 dimension analysis, per-question feedback, your strengths, your weak areas, and specific next steps. The report your coach would write."},
  ];

  const stats=[{n:"50K+",l:"Interviews Completed"},{n:"87%",l:"Better Performance"},{n:"3.4×",l:"More Offer Rates"},{n:"Free",l:"To Get Started"}];

  return (
    <div style={{background:"#fff",color:C.ink,fontFamily:"'Inter',sans-serif",overflowX:"hidden"}}>
      <style>{CSS_GLOBAL}
        {`
          @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
          .marquee-track{display:flex;gap:24px;animation:marquee 22s linear infinite;}
          .marquee-wrap{overflow:hidden;}
        `}
      </style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:scrolled?"rgba(255,255,255,.97)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${C.border}`:"none",transition:"all .3s",padding:"0 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:66}}>
          <div style={{fontWeight:900,fontSize:22,color:scrolled?C.navy:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",letterSpacing:-.5,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:20}}>🎤</span> TakePlace
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <button onClick={onStart} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:14,color:scrolled?C.muted:"rgba(255,255,255,.75)",padding:"8px 12px"}}>Sign In</button>
            <Btn v={scrolled?"gold":"white"} onClick={onStart} style={{padding:"9px 22px",fontSize:14}}>Get Started Free →</Btn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"130px 24px 90px",position:"relative",overflow:"hidden",background:`linear-gradient(160deg,${C.navy} 0%,${C.navyL} 45%,#1e3a6e 100%)`,color:"#fff"}}>
        {/* Decorative orbs */}
        <div style={{position:"absolute",top:"5%",right:"3%",width:460,height:460,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}12,transparent 65%)`,pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"-5%",width:340,height:340,borderRadius:"50%",background:`radial-gradient(circle,${C.teal}10,transparent 65%)`,pointerEvents:"none"}}/>
        {/* Grid pattern */}
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none"}}/>

        <div style={{textAlign:"center",maxWidth:820,position:"relative",zIndex:1}}>
          <div className="fade" style={{display:"inline-flex",alignItems:"center",gap:8,background:`${C.gold}18`,border:`1px solid ${C.gold}35`,borderRadius:24,padding:"7px 18px",marginBottom:32,fontSize:12.5,color:C.goldL,fontWeight:700}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:C.goldL,display:"inline-block",animation:"pulse 1.5s infinite"}}/>
            India's only AI interview with live camera + resume personalization
          </div>

          <h1 className="fade" style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:"clamp(36px,5.5vw,64px)",lineHeight:1.07,marginBottom:26,animationDelay:".1s",letterSpacing:"-1px"}}>
            Practice the exact interview<br/>
            <span style={{color:C.goldL}}>Google and Amazon</span> will give you.
          </h1>

          <p className="fade" style={{fontSize:17,color:"rgba(255,255,255,.7)",lineHeight:1.85,maxWidth:580,margin:"0 auto 48px",animationDelay:".2s"}}>
            Paste your resume. Enter the company. Our AI reads your actual experience and runs a full-screen camera interview — speaking your questions, timing your answers, scoring every response.
          </p>

          <div className="fade" style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:56,animationDelay:".3s"}}>
            <Btn v="gold" onClick={onStart} style={{padding:"16px 40px",fontSize:16,borderRadius:12}}>🎙️ Start Interview — Free</Btn>
            <Btn v="outline" onClick={onStart} style={{padding:"16px 28px",fontSize:16,borderRadius:12}}>Browse Live Jobs →</Btn>
          </div>

          {/* Stats */}
          <div className="fade" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",maxWidth:520,margin:"0 auto",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:18,overflow:"hidden",animationDelay:".4s"}}>
            {stats.map((s,i)=>(
              <div key={i} style={{padding:"18px 8px",textAlign:"center",borderRight:i<stats.length-1?"1px solid rgba(255,255,255,.1)":"none"}}>
                <div style={{fontWeight:900,fontSize:22,color:C.goldL,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{s.n}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.45)",marginTop:3,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPANIES MARQUEE */}
      <section style={{padding:"32px 0",background:C.bg,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Practiced for interviews at</div>
        </div>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...companies,...companies].map((c,i)=>(
              <div key={i} style={{background:c.bg,border:`1px solid ${c.color}20`,borderRadius:10,padding:"10px 20px",display:"flex",alignItems:"center",gap:8,flexShrink:0,minWidth:130}}>
                <span style={{fontWeight:800,fontSize:14,color:c.color}}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:"90px 24px",maxWidth:1060,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <div style={{fontSize:11,color:C.teal,fontWeight:800,letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>How it works</div>
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:36,color:C.ink,letterSpacing:-.5}}>From resume to offer letter in 3 steps</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:22}}>
          {[
            {n:"01",title:"Upload your resume",desc:"Paste or upload your resume (PDF, DOCX). Enter the company and role you're targeting. Takes 60 seconds."},
            {n:"02",title:"Interview on camera",desc:"Priya (AI interviewer) speaks your personalized questions out loud. Answer on mic, on camera, on a 90-second clock. Instant feedback after each answer."},
            {n:"03",title:"Get your debrief",desc:"Full score across 5 dimensions. Per-question breakdown. Specific improvements. The exact report your coach would write after watching your interview."},
          ].map((s,i)=>(
            <div key={i} className="lift" style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:20,padding:30,boxShadow:"0 2px 12px rgba(0,0,0,.04)"}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:36,color:C.border,marginBottom:16,lineHeight:1}}>{s.n}</div>
              <div style={{fontWeight:700,fontSize:17,color:C.ink,marginBottom:10}}>{s.title}</div>
              <div style={{color:C.muted,fontSize:14,lineHeight:1.8}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:"90px 24px",background:C.bg}}>
        <div style={{maxWidth:1060,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <div style={{fontSize:11,color:C.gold,fontWeight:800,letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>Features</div>
            <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:36,color:C.ink,letterSpacing:-.5}}>Built to replicate the real thing</h2>
            <p style={{color:C.muted,fontSize:15,marginTop:10,maxWidth:500,margin:"10px auto 0",lineHeight:1.7}}>Every feature exists because real interview preparation was missing it.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:18}}>
            {features.map((f,i)=>(
              <div key={i} className="lift" style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:18,padding:26,display:"flex",gap:16,boxShadow:"0 2px 8px rgba(0,0,0,.03)"}}>
                <div style={{fontSize:30,flexShrink:0,marginTop:2}}>{f.icon}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:C.ink,marginBottom:7}}>{f.title}</div>
                  <div style={{color:C.muted,fontSize:13,lineHeight:1.8}}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{padding:"90px 24px",maxWidth:1060,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <div style={{fontSize:11,color:C.purple,fontWeight:800,letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>Success stories</div>
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:36,color:C.ink,letterSpacing:-.5}}>They got hired. You're next.</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18}}>
          {[
            {name:"Priya M.",role:"SDE at Wipro",text:"I entered 'Wipro' and pasted my resume. The AI asked specifically about my TCS project and how it applies to Wipro's scale. That's exactly what happened in my real interview. I was so prepared I almost corrected the interviewer.",avatar:"PM",score:91},
            {name:"Arun K.",role:"Data Analyst at TCS",text:"The camera room made it feel real. Seeing yourself on screen while an AI interviewer speaks your questions — you genuinely can't fake composure. Fixed my eye contact and filler word issues before the actual interview.",avatar:"AK",score:83},
            {name:"Sneha R.",role:"Full Stack Dev at Infosys",text:"Resume interview + Amazon as target = they asked about my TakePlace app architecture in depth. I'd answered that exact question three times in practice. Got the offer in round 2.",avatar:"SR",score:94},
          ].map((r,i)=>(
            <div key={i} className="lift" style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:20,padding:28,boxShadow:"0 2px 14px rgba(0,0,0,.05)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                {[...Array(5)].map((_,j)=><span key={j} style={{color:C.gold,fontSize:14}}>★</span>)}
                <span style={{marginLeft:4,background:C.greenPale,color:C.green,fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:20,border:`1px solid ${C.greenBorder}`}}>{r.score}%</span>
              </div>
              <div style={{color:C.ink2,fontSize:14,lineHeight:1.8,marginBottom:20}}>"{r.text}"</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${C.navy},${C.navyL})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:"#fff"}}>{r.avatar}</div>
                <div><div style={{fontWeight:700,color:C.ink,fontSize:13.5}}>{r.name}</div><div style={{color:C.muted,fontSize:12}}>{r.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{padding:"90px 24px",background:C.bg}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <div style={{fontSize:11,color:C.blue,fontWeight:800,letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>Pricing</div>
            <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:36,color:C.ink,letterSpacing:-.5}}>Start free. Upgrade when you're ready.</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:22,alignItems:"start"}}>
            {[
              {name:"Free",price:"₹0",period:"/month",color:C.navy,features:["5 resume interviews/month","Live job feed","Basic feedback","3 company mock tests"],cta:"Start Free",v:"primary"},
              {name:"Pro",price:"₹299",period:"/month",color:C.gold,popular:true,features:["Unlimited resume interviews","All company styles","Detailed reports","PDF download","All 30+ mock tests","Priority AI"],cta:"Start Pro → ₹299/mo",v:"gold"},
              {name:"Premium",price:"₹599",period:"/month",color:C.teal,features:["Everything in Pro","1-on-1 resume review","LinkedIn optimization","Career roadmap","Dedicated support"],cta:"Go Premium",v:"teal"},
            ].map((p,i)=>(
              <div key={i} style={{background:C.white,border:`2px solid ${p.popular?p.color:C.border}`,borderRadius:22,padding:28,position:"relative",boxShadow:p.popular?`0 12px 40px ${p.color}22`:"0 2px 8px rgba(0,0,0,.04)"}}>
                {p.popular&&<div style={{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,#9a6c18,${C.gold})`,color:"#fff",fontSize:11,fontWeight:800,padding:"4px 16px",borderRadius:20,whiteSpace:"nowrap"}}>⭐ MOST POPULAR</div>}
                <div style={{fontSize:12,fontWeight:800,color:p.color,marginBottom:6,letterSpacing:.8}}>{p.name.toUpperCase()}</div>
                <div style={{fontWeight:900,fontSize:36,color:C.ink,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{p.price}<span style={{fontSize:12,fontWeight:400,color:C.muted}}>{p.period}</span></div>
                <div style={{height:1,background:C.border,margin:"16px 0"}}/>
                {p.features.map((f,j)=><div key={j} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:11}}><span style={{color:p.color,fontWeight:800,fontSize:12,flexShrink:0,marginTop:1}}>✓</span><span style={{color:C.muted,fontSize:13}}>{f}</span></div>)}
                <Btn v={p.v} onClick={onStart} style={{width:"100%",padding:"12px",marginTop:8,borderRadius:10,fontSize:14}}>{p.cta}</Btn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"90px 24px",textAlign:"center"}}>
        <div style={{maxWidth:600,margin:"0 auto",background:`linear-gradient(160deg,${C.navy},${C.navyL})`,borderRadius:28,padding:"60px 36px",boxShadow:`0 24px 60px ${C.navy}30`}}>
          <div style={{fontSize:52,marginBottom:14,animation:"float 3s ease-in-out infinite"}}>🎤</div>
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:34,color:"#fff",marginBottom:12,letterSpacing:-.5}}>Your next interview is real.<br/><span style={{color:C.goldL}}>This one can be too.</span></h2>
          <p style={{color:"rgba(255,255,255,.65)",fontSize:15,marginBottom:36,lineHeight:1.75}}>Camera on. Mic live. Your resume read. Company style matched. Full debrief at the end. Free to start.</p>
          <Btn v="gold" onClick={onStart} style={{padding:"16px 48px",fontSize:16,borderRadius:12}}>Start Free Now →</Btn>
        </div>
      </section>

      <footer style={{borderTop:`1px solid ${C.border}`,padding:"32px 24px",background:C.white}}>
        <div style={{maxWidth:1060,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{fontWeight:900,fontSize:18,color:C.navy,fontFamily:"'Plus Jakarta Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}><span>🎤</span> TakePlace</div>
          <div style={{color:C.muted,fontSize:12}}>© 2026 TakePlace · Built by Raghu Dadigela</div>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            <a href="mailto:takeplace.in@gmail.com" style={{color:C.navy,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:5}}>✉ takeplace.in@gmail.com</a>
            <a href="https://takeplace.vercel.app" target="_blank" rel="noreferrer" style={{color:C.muted,fontSize:12}}>takeplace.vercel.app</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
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
        if(error)throw error;
        setMsg("✅ Account created! Check your email to verify, then sign in.");
        setMode("login");
      }else{
        const{data,error}=await supabase.auth.signInWithPassword({email:form.email,password:form.password});
        if(error)throw error;
        onLogin(data.user);
      }
    }catch(e){setErr(e.message||"Something went wrong");}
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${C.navy},${C.navyL})`,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{CSS_GLOBAL}</style>
      <div className="fade" style={{width:"100%",maxWidth:400,background:C.white,border:`1.5px solid ${C.border}`,borderRadius:24,padding:32,boxShadow:"0 24px 60px rgba(0,0,0,.25)"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginBottom:22,fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:4}}>← Back</button>
        <div style={{textAlign:"center",marginBottom:26}}>
          <div style={{fontSize:38,marginBottom:8}}>🎤</div>
          <div style={{fontWeight:900,fontSize:24,color:C.navy,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>TakePlace</div>
          <div style={{color:C.muted,fontSize:13,marginTop:4}}>{mode==="login"?"Welcome back 👋":"Create your free account ✨"}</div>
        </div>
        <button onClick={handleGoogle} disabled={gLoading} style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,background:C.white,color:C.ink,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:18,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
          {gLoading?<Spin size={16}/>:<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
          Continue with Google
        </button>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <div style={{flex:1,height:1,background:C.border}}/><span style={{color:C.muted,fontSize:12}}>or</span><div style={{flex:1,height:1,background:C.border}}/>
        </div>
        <div style={{display:"flex",background:C.bg,borderRadius:10,padding:4,marginBottom:18}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}} style={{flex:1,padding:"9px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,transition:"all .2s",background:mode===m?C.white:"transparent",color:mode===m?C.navy:C.muted,boxShadow:mode===m?"0 1px 4px rgba(0,0,0,.08)":"none"}}>
              {m==="login"?"Sign In":"Register"}
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {mode==="register"&&<input style={inp} placeholder="Full name" value={form.name} onChange={e=>set("name",e.target.value)}/>}
          <input style={inp} placeholder="Email address" type="email" value={form.email} onChange={e=>set("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
          <input style={inp} placeholder="Password" type="password" value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        </div>
        {err&&<div style={{color:C.red,fontSize:12,marginTop:10,background:C.redPale,padding:"8px 12px",borderRadius:8}}>⚠ {err}</div>}
        {msg&&<div style={{color:C.green,fontSize:12,marginTop:10,background:C.greenPale,padding:"8px 12px",borderRadius:8}}>{msg}</div>}
        <Btn v="gold" onClick={handle} loading={loading} style={{width:"100%",marginTop:16,padding:"13px",fontSize:15}}>
          {mode==="login"?"Sign In →":"Create Account →"}
        </Btn>
        <div style={{textAlign:"center",marginTop:16,fontSize:12,color:C.muted}}>
          Questions? <a href="mailto:takeplace.in@gmail.com" style={{color:C.navy,fontWeight:700}}>takeplace.in@gmail.com</a>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
function MainApp({user,onLogout}){
  const [tab,setTab]=useState(()=>parseInt(sessionStorage.getItem("tp_tab")||"0"));
  const [menuOpen,setMenuOpen]=useState(false);
  const name=user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";
  const initials=name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  const setTabP=(t)=>{setTab(t);sessionStorage.setItem("tp_tab",t);};

  const TABS=[
    {icon:"🔥",label:"Jobs",id:0},
    {icon:"🎯",label:"Resume Interview",id:1},
    {icon:"🎤",label:"Quick Mock",id:2},
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Inter',sans-serif",paddingBottom:76}}>
      <style>{CSS_GLOBAL}
        {`@media(min-width:640px){.bn{display:none!important;}.ttb{display:flex!important;}}@media(max-width:639px){.ttb{display:none!important;}.bn{display:flex!important;}}`}
      </style>

      {/* Header */}
      <div style={{background:C.white,borderBottom:`1.5px solid ${C.border}`,padding:"0 20px",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 10px rgba(0,0,0,.04)"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
          <div style={{fontWeight:900,fontSize:20,color:C.navy,fontFamily:"'Plus Jakarta Sans',sans-serif",display:"flex",alignItems:"center",gap:7}}>
            <span>🎤</span> TakePlace
          </div>
          <div className="ttb" style={{display:"none",gap:2}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTabP(t.id)} style={{padding:"8px 18px",border:"none",background:"transparent",cursor:"pointer",color:tab===t.id?C.gold:C.muted,fontFamily:"'Inter',sans-serif",fontWeight:tab===t.id?700:500,fontSize:13.5,borderBottom:`2.5px solid ${tab===t.id?C.gold:"transparent"}`,transition:"all .2s",display:"flex",alignItems:"center",gap:5}}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div style={{position:"relative"}}>
            <button onClick={()=>setMenuOpen(m=>!m)} style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.navy},${C.navyL})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#fff",border:"none",cursor:"pointer"}}>{initials}</button>
            {menuOpen&&(
              <div style={{position:"absolute",right:0,top:44,background:C.white,border:`1.5px solid ${C.border}`,borderRadius:12,boxShadow:"0 8px 28px rgba(0,0,0,.12)",padding:8,minWidth:180,zIndex:50}}>
                <div style={{padding:"8px 10px",fontSize:12,color:C.muted,borderBottom:`1px solid ${C.border}`,marginBottom:6}}>{name}</div>
                <a href="mailto:takeplace.in@gmail.com" style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,fontSize:13,color:C.ink,fontWeight:500,fontFamily:"'Inter',sans-serif",textDecoration:"none"}}>✉ Support</a>
                <button onClick={onLogout} style={{width:"100%",textAlign:"left",padding:"8px 10px",borderRadius:8,border:"none",background:"transparent",color:C.red,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>🚪 Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"22px 16px"}}>
        {tab===0&&<JobsTab/>}
        {tab===1&&<ResumeInterviewTab/>}
        {tab===2&&<QuickMockTab/>}
      </div>

      {/* Mobile bottom nav */}
      <div className="bn" style={{position:"fixed",bottom:0,left:0,right:0,background:C.white,borderTop:`1.5px solid ${C.border}`,display:"flex",zIndex:200,boxShadow:"0 -4px 18px rgba(0,0,0,.06)",paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTabP(t.id)} style={{flex:1,padding:"10px 4px 8px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:tab===t.id?C.gold:C.muted,fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>
            <div style={{width:28,height:3,borderRadius:2,background:tab===t.id?C.gold:"transparent",marginBottom:2,transition:"all .2s"}}/>
            <span style={{fontSize:20,lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:9.5,fontWeight:tab===t.id?700:500,letterSpacing:.3}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const [page,setPage]=useState("landing");

  useEffect(()=>{
    const s=document.createElement("style");s.textContent=CSS_GLOBAL;document.head.appendChild(s);
    if(window.speechSynthesis)window.speechSynthesis.getVoices();
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){setUser(session.user);setPage("app");}
      setLoading(false);
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user){setUser(session.user);setPage("app");}
      else{setUser(null);setPage("landing");}
    });
    return()=>subscription.unsubscribe();
  },[]);

  if(loading) return (
    <div style={{minHeight:"100vh",background:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{CSS_GLOBAL}</style>
      <span style={{fontSize:40}}>🎤</span>
      <Spin size={36}/>
      <div style={{color:C.muted,fontSize:14,fontFamily:"'Inter',sans-serif"}}>Loading TakePlace…</div>
    </div>
  );

  if(page==="landing") return <LandingPage onStart={()=>setPage("auth")}/>;
  if(page==="auth") return <AuthPage onLogin={u=>{setUser(u);setPage("app");}} onBack={()=>setPage("landing")}/>;
  return <MainApp user={user} onLogout={()=>supabase.auth.signOut()}/>;
}
