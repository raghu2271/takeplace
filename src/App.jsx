

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID  = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const supabase   = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── CALL AI VIA BACKEND ─────────────────────────────────────────────────────
async function callGroq(prompt, maxTokens = 2000, systemMsg = "") {
  const sys = systemMsg || "You are an expert technical interviewer and hiring panel lead. Respond with valid JSON only. No markdown, no explanation.";
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: sys },
        { role: "user", content: prompt }
      ],
      max_tokens: maxTokens
    })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "AI service error " + res.status);
  }
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  bg:"#ffffff", bg2:"#f8fafc", bg3:"#f1f5f9",
  ink:"#0b1120", inkSoft:"#1e293b",
  navy:"#0f1d3d", navyL:"#16285a",
  amber:"#d97706", amberL:"#f59e0b", amberPale:"#fff7ed",
  teal:"#0d9488", tealL:"#14b8a6", tealPale:"#f0fdfa",
  blue:"#2563eb", blueL:"#3b82f6", bluePale:"#eff6ff",
  green:"#16a34a", greenD:"#14532d", greenPale:"#f0fdf4",
  red:"#dc2626", redPale:"#fef2f2",
  yellow:"#d97706", yellowPale:"#fffbeb",
  purple:"#7c3aed", purpleD:"#5b21b6", purplePale:"#f5f3ff",
  muted:"#64748b", soft:"#94a3b8", border:"#e2e8f0",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',sans-serif;color:#0b1120;background:#fff;-webkit-font-smoothing:antialiased;}
  ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes pulseRing{0%{box-shadow:0 0 0 0 rgba(217,119,6,.45)}70%{box-shadow:0 0 0 14px rgba(217,119,6,0)}100%{box-shadow:0 0 0 0 rgba(217,119,6,0)}}
  @keyframes talkBar{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .fade{animation:fadeUp .4s ease forwards;}
  .fadeIn{animation:fadeIn .3s ease forwards;}
  .float{animation:float 3s ease-in-out infinite;}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  .lift{transition:transform .2s,box-shadow .2s;cursor:pointer;}
  .lift:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.10);}
  input:focus,textarea:focus{outline:none;border-color:#2563eb!important;box-shadow:0 0 0 3px #2563eb18!important;}
  button:active{transform:scale(.97);}
  a{text-decoration:none;color:inherit;}
  .bottom-nav{padding-bottom:env(safe-area-inset-bottom,0px);}
  .bar{width:4px;border-radius:2px;background:#fff;display:inline-block;transform-origin:center;}
`;

const inp = {
  width:"100%", background:"#fff", border:`1.5px solid ${C.border}`,
  borderRadius:10, padding:"12px 14px", color:C.ink, fontSize:14,
  fontFamily:"'Inter',sans-serif", outline:"none", transition:"all .2s",
};

const Spin = ({size=18,color=C.amber}) => (
  <span className="spin" style={{width:size,height:size,border:`2.5px solid ${color}25`,borderTopColor:color,borderRadius:"50%",display:"inline-block",flexShrink:0}}/>
);

function Btn({children,onClick,v="primary",style={},disabled=false,loading=false}){
  const vs={
    primary:{background:`linear-gradient(135deg,${C.navy},${C.navyL})`,color:"#fff",fontWeight:700},
    ghost:{background:"transparent",color:C.muted,border:`1.5px solid ${C.border}`},
    amber:{background:`linear-gradient(135deg,#92400e,${C.amber},${C.amberL})`,color:"#fff",fontWeight:800,boxShadow:`0 4px 20px ${C.amber}40`},
    teal:{background:`linear-gradient(135deg,#065f5b,${C.teal},${C.tealL})`,color:"#fff",fontWeight:700,boxShadow:`0 2px 12px ${C.teal}40`},
    danger:{background:"linear-gradient(135deg,#991b1b,#dc2626)",color:"#fff",fontWeight:700},
    dark:{background:`linear-gradient(135deg,${C.ink},${C.inkSoft})`,color:"#fff",fontWeight:700},
  };
  return (
    <button onClick={disabled||loading?undefined:onClick} disabled={disabled||loading}
      style={{padding:"11px 22px",borderRadius:10,border:"none",cursor:disabled||loading?"not-allowed":"pointer",
        fontFamily:"'Inter',sans-serif",fontSize:14,transition:"all .2s",opacity:disabled?0.5:1,
        display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,...vs[v],...style}}>
      {loading?<><Spin size={14} color={v==="ghost"?C.amber:"#fff"}/> Loading...</>:children}
    </button>
  );
}

const Tag = ({children,color=C.amber,bg}) => (
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
      <div style={{height:"100%",width:`${score}%`,background:color||C.amber,borderRadius:4,transition:"width 1.2s ease"}}/>
    </div>
  );
}

function safeJSON(raw,fallback={}){
  if(!raw) return fallback;
  try{ return JSON.parse(raw.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim()); }
  catch{
    try{ const m=raw.match(/\{[\s\S]*\}/); if(m) return JSON.parse(m[0]); }catch{}
    return fallback;
  }
}

function fmtTime(s){
  const m=Math.floor(s/60), sec=s%60;
  return `${m}:${sec.toString().padStart(2,"0")}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// ROLE LIBRARY — 26 roles across tech, business, and core engineering
// ═══════════════════════════════════════════════════════════════════════════
const ROLES = [
  {id:"sde",      title:"Software Engineer",        icon:"💻", cat:"Engineering", focus:"DSA, problem solving, system design basics"},
  {id:"frontend", title:"Frontend Developer",        icon:"🎨", cat:"Engineering", focus:"React, JS, CSS, performance, accessibility"},
  {id:"backend",  title:"Backend Developer",         icon:"🗄️", cat:"Engineering", focus:"APIs, databases, system design, scaling"},
  {id:"fullstack",title:"Full Stack Developer",      icon:"🧩", cat:"Engineering", focus:"End-to-end app design, REST/GraphQL, deployment"},
  {id:"android",  title:"Android Developer",         icon:"🤖", cat:"Engineering", focus:"Kotlin, lifecycle, architecture, Play Store"},
  {id:"ios",       title:"iOS Developer",            icon:"📱", cat:"Engineering", focus:"Swift, UIKit/SwiftUI, memory, App Store"},
  {id:"devops",   title:"DevOps Engineer",           icon:"⚙️", cat:"Engineering", focus:"CI/CD, containers, IaC, monitoring"},
  {id:"cloud",    title:"Cloud Engineer",            icon:"☁️", cat:"Engineering", focus:"AWS/Azure/GCP, networking, cost, security"},
  {id:"qa",       title:"QA / Test Engineer",        icon:"🧪", cat:"Engineering", focus:"Test design, automation, bug triage"},
  {id:"dba",      title:"Database Administrator",    icon:"🗃️", cat:"Engineering", focus:"SQL tuning, indexing, backups, replication"},
  {id:"sysadmin", title:"System Administrator",      icon:"🖥️", cat:"Engineering", focus:"Linux, networking, uptime, incident response"},
  {id:"security", title:"Cybersecurity Analyst",     icon:"🛡️", cat:"Engineering", focus:"Threats, vulnerabilities, incident handling"},
  {id:"ds",       title:"Data Scientist",            icon:"📊", cat:"Data", focus:"Statistics, modeling, experiment design"},
  {id:"da",       title:"Data Analyst",              icon:"📈", cat:"Data", focus:"SQL, dashboards, business metrics"},
  {id:"mle",      title:"Machine Learning Engineer", icon:"🧠", cat:"Data", focus:"ML pipelines, model deployment, evaluation"},
  {id:"pm",       title:"Product Manager",           icon:"🧭", cat:"Business", focus:"Prioritization, metrics, stakeholder mgmt"},
  {id:"ba",       title:"Business Analyst",          icon:"🧾", cat:"Business", focus:"Requirements gathering, process mapping"},
  {id:"opsmgr",   title:"Operations Manager",        icon:"🏭", cat:"Business", focus:"Process efficiency, KPIs, team coordination"},
  {id:"finance",  title:"Finance Analyst",           icon:"💹", cat:"Business", focus:"Financial modeling, reporting, forecasting"},
  {id:"sales",    title:"Sales Executive",           icon:"🤝", cat:"Business", focus:"Pitching, objection handling, pipeline"},
  {id:"marketing",title:"Digital Marketing Exec.",   icon:"📣", cat:"Business", focus:"Campaigns, SEO/SEM, analytics"},
  {id:"hr",       title:"HR Generalist",             icon:"🧑‍💼", cat:"Business", focus:"Hiring, policy, employee relations"},
  {id:"support",  title:"Customer Success",          icon:"🎧", cat:"Business", focus:"De-escalation, retention, communication"},
  {id:"uiux",     title:"UI/UX Designer",            icon:"✏️", cat:"Design", focus:"User research, wireframes, design critique"},
  {id:"mech",     title:"Mechanical Engineer",       icon:"🔧", cat:"Core", focus:"Design, materials, manufacturing"},
  {id:"civil",    title:"Civil Engineer",            icon:"🏗️", cat:"Core", focus:"Structures, site planning, codes"},
];
const CATS = ["All","Engineering","Data","Business","Design","Core"];

const FALLBACK_QUESTIONS = [
  {q:"Tell me about yourself and why you're a fit for this role.",type:"Intro"},
  {q:"Walk me through a challenging problem you solved recently and how you approached it.",type:"Behavioral"},
  {q:"What are the core technical skills this role requires, and how strong are you in each?",type:"Technical"},
  {q:"Describe a time you disagreed with a teammate or manager. How did you handle it?",type:"Behavioral"},
  {q:"How would you approach your first 30 days in this role?",type:"Situational"},
  {q:"Do you have any questions for us, and is there anything else you'd like us to know?",type:"Closing"},
];

// ═══════════════════════════════════════════════════════════════════════════
// INTERVIEW ROOM — the core new feature
// ═══════════════════════════════════════════════════════════════════════════
function InterviewMock(){
  const [screen,setScreen]=useState("roles");       // roles | brief | live | report
  const [catFilter,setCatFilter]=useState("All");
  const [role,setRole]=useState(null);
  const [difficulty,setDifficulty]=useState("Mid-level");
  const [questions,setQuestions]=useState([]);
  const [qIndex,setQIndex]=useState(0);
  const [answers,setAnswers]=useState([]);          // {question,type,answer,seconds}
  const [genErr,setGenErr]=useState("");
  const [loadingQs,setLoadingQs]=useState(false);

  // live interview state
  const [aiSpeaking,setAiSpeaking]=useState(false);
  const [listening,setListening]=useState(false);
  const [liveText,setLiveText]=useState("");
  const [timeLeft,setTimeLeft]=useState(90);
  const [phase,setPhase]=useState("idle");          // idle | speaking | answering | done-q
  const [genReport,setGenReport]=useState(false);
  const [report,setReport]=useState(null);

  const recogRef=useRef(null);
  const transcriptRef=useRef("");
  const timerRef=useRef(null);
  const QUESTION_TIME=90;

  const speechOK = typeof window!=="undefined" && (window.SpeechRecognition||window.webkitSpeechRecognition);
  const ttsOK = typeof window!=="undefined" && window.speechSynthesis;

  useEffect(()=>()=>{ clearInterval(timerRef.current); stopRecognition(); window.speechSynthesis?.cancel(); },[]);

  const filteredRoles = catFilter==="All" ? ROLES : ROLES.filter(r=>r.cat===catFilter);

  // ── pick a role → generate questions ──
  const pickRole=async(r)=>{
    setRole(r); setScreen("brief"); setGenErr(""); setLoadingQs(true); setQuestions([]);
    try{
      const raw=await callGroq(`You are conducting a real, spoken job interview for the role of "${r.title}" (focus areas: ${r.focus}). Difficulty: ${difficulty}.
Generate exactly 6 interview questions an interviewer would ask out loud, in this order: 1 warm intro question, 3 role-specific technical/practical questions matched to the focus areas, 1 behavioral/situational question, 1 closing question.
Questions must sound natural when spoken aloud (no bullet symbols, no code blocks).
Return ONLY this JSON: {"questions":[{"q":"<question text>","type":"Intro|Technical|Behavioral|Situational|Closing"}]}`,900);
      const data=safeJSON(raw,null);
      const qs = data?.questions?.length===6 ? data.questions : FALLBACK_QUESTIONS;
      setQuestions(qs);
    }catch(e){
      setGenErr("Couldn't generate custom questions, using a standard set instead.");
      setQuestions(FALLBACK_QUESTIONS);
    }
    setLoadingQs(false);
  };

  // ── speech synthesis (AI asks the question) ──
  const speak=(text)=>new Promise((resolve)=>{
    if(!ttsOK){ resolve(); return; }
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.rate=0.98; u.pitch=0.95;
    const voices=window.speechSynthesis.getVoices();
    const v=voices.find(v=>/en-(US|GB|IN)/i.test(v.lang)&&/Male|David|Daniel|Google/i.test(v.name)) || voices.find(v=>/en/i.test(v.lang));
    if(v) u.voice=v;
    setAiSpeaking(true);
    u.onend=()=>{ setAiSpeaking(false); resolve(); };
    u.onerror=()=>{ setAiSpeaking(false); resolve(); };
    window.speechSynthesis.speak(u);
  });

  const stopRecognition=()=>{
    try{ recogRef.current?.stop(); }catch{}
    setListening(false);
  };

  const startRecognition=()=>{
    if(!speechOK){ return; }
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SR();
    rec.continuous=true; rec.interimResults=true; rec.lang="en-US";
    transcriptRef.current="";
    rec.onresult=(e)=>{
      let finalT="", interimT="";
      for(let i=0;i<e.results.length;i++){
        if(e.results[i].isFinal) finalT+=e.results[i][0].transcript+" ";
        else interimT+=e.results[i][0].transcript;
      }
      transcriptRef.current=finalT;
      setLiveText((finalT+interimT).trim());
    };
    rec.onerror=()=>{};
    rec.onend=()=>{ if(phase==="answering") { try{rec.start();}catch{} } }; // keep listening through pauses
    recogRef.current=rec;
    rec.start();
    setListening(true);
  };

  const beginQuestion=async(idx)=>{
    setPhase("speaking"); setLiveText(""); transcriptRef.current="";
    await speak(questions[idx].q);
    setPhase("answering"); setTimeLeft(QUESTION_TIME); setListening(true);
    startRecognition();
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{
        if(t<=1){ clearInterval(timerRef.current); finishAnswer(idx); return 0; }
        return t-1;
      });
    },1000);
  };

  const finishAnswer=(idx)=>{
    clearInterval(timerRef.current);
    stopRecognition();
    setPhase("done-q");
    const finalAnswer=(transcriptRef.current||liveText||"").trim() || "(no answer captured)";
    setAnswers(prev=>{
      const next=[...prev];
      next[idx]={question:questions[idx].q, type:questions[idx].type, answer:finalAnswer, seconds:QUESTION_TIME-timeLeft};
      return next;
    });
    setTimeout(()=>{
      if(idx+1<questions.length){ setQIndex(idx+1); beginQuestion(idx+1); }
      else { wrapInterview(idx,finalAnswer); }
    },900);
  };

  const startInterview=()=>{
    setScreen("live"); setAnswers([]); setQIndex(0);
    setTimeout(()=>beginQuestion(0),400);
  };

  const wrapInterview=async(lastIdx,lastAnswer)=>{
    setPhase("idle");
    setGenReport(true);
    const finalAnswers=answers.slice(); finalAnswers[lastIdx]={question:questions[lastIdx].q,type:questions[lastIdx].type,answer:lastAnswer,seconds:0};
    try{
      const transcript=finalAnswers.map((a,i)=>`Q${i+1} (${a.type}): ${a.question}\nCandidate answer: ${a.answer}`).join("\n\n");
      const raw=await callGroq(`You are a strict but fair senior hiring panelist who just finished interviewing a candidate for "${role.title}" (${difficulty} level, focus: ${role.focus}).
Here is the full interview transcript:
${transcript.slice(0,4000)}

Score honestly based on substance, not effort. Return ONLY this JSON:
{
  "overallScore": <0-100>,
  "verdict": "<Strong Hire|Hire|Borderline|No Hire>",
  "communicationScore": <0-100>,
  "technicalScore": <0-100>,
  "confidenceScore": <0-100>,
  "structureScore": <0-100>,
  "summary": "<3 sentence honest overall assessment, speak directly to the candidate as 'you'>",
  "perQuestion": [{"question":"<short version>","score":<0-100>,"feedback":"<1-2 sentence specific feedback>"}],
  "strengths": ["<strength 1>","<strength 2>"],
  "improvements": ["<specific improvement 1>","<specific improvement 2>","<specific improvement 3>"]
}`,2200);
      const data=safeJSON(raw,null);
      if(!data?.overallScore) throw new Error("bad report");
      setReport(data);
    }catch(e){
      setReport({overallScore:0,verdict:"—",communicationScore:0,technicalScore:0,confidenceScore:0,structureScore:0,
        summary:"We couldn't generate feedback this time — please try the interview again.",perQuestion:[],strengths:[],improvements:[]});
    }
    setGenReport(false);
    setScreen("report");
  };

  const restart=()=>{
    window.speechSynthesis?.cancel(); stopRecognition(); clearInterval(timerRef.current);
    setScreen("roles"); setRole(null); setQuestions([]); setAnswers([]); setQIndex(0); setReport(null);
  };

  const sc=s=>s>=75?C.green:s>=50?C.yellow:C.red;

  // ── SCREEN: ROLE PICKER ──
  if(screen==="roles") return(
    <div>
      <div style={{marginBottom:16}}>
        <div style={{fontWeight:800,fontSize:20,color:C.ink,marginBottom:4}}>🎤 AI Mock Interview</div>
        <div style={{color:C.muted,fontSize:13}}>Pick a role. The AI interviewer will sit across from you, ask real questions out loud, and you answer by speaking — just like the real thing.</div>
      </div>
      {!speechOK&&(
        <div style={{background:C.yellowPale,border:"1px solid #fde68a",borderRadius:10,padding:"10px 14px",marginBottom:12,color:C.yellow,fontSize:12}}>
          ⚠ Voice recognition isn't supported in this browser. For the full spoken experience, use Chrome on desktop or Android.
        </div>
      )}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCatFilter(c)}
            style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${catFilter===c?C.amber:C.border}`,background:catFilter===c?C.amberPale:"#fff",color:catFilter===c?C.amber:C.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
            {c}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {filteredRoles.map(r=>(
          <div key={r.id} className="lift" onClick={()=>pickRole(r)}
            style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:18,boxShadow:"0 1px 6px rgba(0,0,0,.04)"}}>
            <div style={{fontSize:30,marginBottom:8}}>{r.icon}</div>
            <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:4}}>{r.title}</div>
            <div style={{color:C.muted,fontSize:11.5,lineHeight:1.6,marginBottom:8}}>{r.focus}</div>
            <Tag color={C.teal}>{r.cat}</Tag>
          </div>
        ))}
      </div>
    </div>
  );

  // ── SCREEN: BRIEFING ──
  if(screen==="brief") return(
    <div className="fade" style={{maxWidth:520,margin:"0 auto"}}>
      <button onClick={()=>setScreen("roles")} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginBottom:16,fontFamily:"'Inter',sans-serif"}}>← Choose a different role</button>
      <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:20,padding:26,boxShadow:"0 4px 20px rgba(0,0,0,.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <div style={{fontSize:36}}>{role.icon}</div>
          <div>
            <div style={{fontWeight:800,fontSize:18,color:C.ink}}>{role.title}</div>
            <div style={{color:C.muted,fontSize:12}}>{role.focus}</div>
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:13,color:C.ink,marginBottom:8}}>Difficulty</div>
          <div style={{display:"flex",gap:8}}>
            {["Entry-level","Mid-level","Senior"].map(d=>(
              <button key={d} onClick={()=>setDifficulty(d)}
                style={{flex:1,padding:"9px",borderRadius:10,border:`1.5px solid ${difficulty===d?C.amber:C.border}`,background:difficulty===d?C.amberPale:"#fff",color:difficulty===d?C.amber:C.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                {d}
              </button>
            ))}
          </div>
        </div>
        {loadingQs?(
          <div style={{textAlign:"center",padding:"24px 0"}}>
            <Spin size={28}/>
            <div style={{color:C.muted,fontSize:13,marginTop:10}}>Preparing your interviewer's questions...</div>
          </div>
        ):(
          <>
            {genErr&&<div style={{background:C.yellowPale,border:"1px solid #fde68a",borderRadius:8,padding:"8px 12px",fontSize:12,color:C.yellow,marginBottom:12}}>{genErr}</div>}
            <div style={{background:C.bg2,borderRadius:12,padding:14,marginBottom:18,fontSize:12.5,color:C.muted,lineHeight:1.8}}>
              <strong style={{color:C.ink}}>How this works:</strong> The AI interviewer will speak each of {questions.length||6} questions out loud. When it finishes, your mic turns on and you have {QUESTION_TIME} seconds to answer — speak naturally, like you would in a real interview. Your full answers are reviewed afterward for a complete feedback report.
            </div>
            <Btn v="amber" onClick={startInterview} disabled={!questions.length} style={{width:"100%",padding:"14px",fontSize:15}}>
              🎙️ Enter the Interview Room
            </Btn>
          </>
        )}
      </div>
    </div>
  );

  // ── SCREEN: LIVE INTERVIEW ROOM ──
  if(screen==="live"){
    const q=questions[qIndex];
    const pct=(timeLeft/QUESTION_TIME)*100;
    const timeColor = pct>40?C.teal:pct>15?C.yellow:C.red;
    return(
      <div className="fade">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <Tag color={C.navy} bg={`${C.navy}10`}>{role.icon} {role.title}</Tag>
          <Tag color={C.muted}>Question {qIndex+1} / {questions.length}</Tag>
        </div>

        {/* THE INTERVIEW DESK — signature visual: two seats facing each other */}
        <div style={{background:`linear-gradient(180deg,${C.navy},${C.navyL})`,borderRadius:24,padding:"28px 20px",position:"relative",overflow:"hidden",marginBottom:14}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 0%, rgba(255,255,255,.06), transparent 60%)"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,position:"relative",zIndex:1}}>
            {/* AI seat */}
            <div style={{flex:1,textAlign:"center"}}>
              <div style={{
                width:84,height:84,borderRadius:"50%",margin:"0 auto 10px",
                background:"linear-gradient(135deg,#1f2c52,#33406e)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,
                border:`3px solid ${aiSpeaking?C.amber:"rgba(255,255,255,.15)"}`,
                animation:aiSpeaking?"pulseRing 1.4s infinite":"none",
              }}>🧑‍💼</div>
              <div style={{color:"#fff",fontWeight:700,fontSize:13}}>Interviewer</div>
              <div style={{color:aiSpeaking?C.amberL:"rgba(255,255,255,.4)",fontSize:11,fontWeight:600,marginTop:2}}>
                {aiSpeaking?"Speaking...":"Listening to you"}
              </div>
              {aiSpeaking&&(
                <div style={{display:"flex",justifyContent:"center",gap:3,marginTop:8,height:16,alignItems:"center"}}>
                  {[0,1,2,3,4].map(i=>(
                    <span key={i} className="bar" style={{height:16,background:C.amberL,animation:`talkBar ${0.5+i*0.07}s ease-in-out infinite`}}/>
                  ))}
                </div>
              )}
            </div>

            <div style={{color:"rgba(255,255,255,.3)",fontSize:22}}>↔</div>

            {/* User seat */}
            <div style={{flex:1,textAlign:"center"}}>
              <div style={{
                width:84,height:84,borderRadius:"50%",margin:"0 auto 10px",
                background:"linear-gradient(135deg,#0f5249,#127268)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,
                border:`3px solid ${listening?C.tealL:"rgba(255,255,255,.15)"}`,
                animation:listening?"pulseRing 1.4s infinite":"none",
              }}>🧑</div>
              <div style={{color:"#fff",fontWeight:700,fontSize:13}}>You</div>
              <div style={{color:listening?C.tealL:"rgba(255,255,255,.4)",fontSize:11,fontWeight:600,marginTop:2}}>
                {listening?"Mic live — answer now":"Standing by"}
              </div>
              {listening&&(
                <div style={{display:"flex",justifyContent:"center",gap:3,marginTop:8,height:16,alignItems:"center"}}>
                  {[0,1,2,3,4].map(i=>(
                    <span key={i} className="bar" style={{height:16,background:C.tealL,animation:`talkBar ${0.4+i*0.09}s ease-in-out infinite`}}/>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Question + timer */}
          <div style={{marginTop:22,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,padding:"14px 16px",position:"relative",zIndex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <Tag color={C.amberL} bg="rgba(245,158,11,.15)">{q?.type}</Tag>
              {phase==="answering"&&<span style={{color:timeColor,fontWeight:800,fontSize:13}}>⏱ {fmtTime(timeLeft)}</span>}
            </div>
            <div style={{color:"#fff",fontSize:15,lineHeight:1.6,fontWeight:500}}>{q?.q}</div>
            {phase==="answering"&&(
              <div style={{height:4,background:"rgba(255,255,255,.15)",borderRadius:3,marginTop:12,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:timeColor,borderRadius:3,transition:"width 1s linear"}}/>
              </div>
            )}
          </div>
        </div>

        {/* Live transcript */}
        <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:16,minHeight:90,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:12,color:C.muted,marginBottom:6}}>YOUR LIVE ANSWER</div>
          <div style={{color:liveText?C.ink:C.soft,fontSize:13.5,lineHeight:1.8,fontStyle:liveText?"normal":"italic"}}>
            {phase==="speaking"&&"The interviewer is asking the question..."}
            {phase==="answering"&&(liveText||"Start speaking — your words will appear here in real time...")}
            {phase==="done-q"&&"Got it — moving to the next question..."}
          </div>
        </div>

        {phase==="answering"&&(
          <Btn v="dark" onClick={()=>finishAnswer(qIndex)} style={{width:"100%",padding:"13px"}}>✅ I'm done answering</Btn>
        )}
        {!speechOK && phase==="answering" && (
          <textarea
            placeholder="Voice recognition unavailable — type your answer here instead..."
            onChange={e=>{transcriptRef.current=e.target.value;setLiveText(e.target.value);}}
            style={{...inp,minHeight:90,marginTop:10}}
          />
        )}
      </div>
    );
  }

  // ── SCREEN: REPORT ──
  if(genReport) return(
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:60,marginBottom:18,animation:"float 2s ease-in-out infinite"}}>📝</div>
      <div style={{fontWeight:800,fontSize:19,color:C.ink,marginBottom:8}}>Scoring your interview...</div>
      <div style={{color:C.muted,fontSize:13,marginBottom:24}}>Reviewing every answer for substance, structure, and confidence</div>
      <Spin size={36}/>
    </div>
  );

  if(screen==="report"&&report) return(
    <div className="fade">
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyL})`,borderRadius:20,padding:"24px 20px",marginBottom:16,color:"#fff"}}>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:4}}>{role.icon} {role.title} · {difficulty}</div>
          <div style={{fontSize:48,fontWeight:900}}>{report.overallScore}%</div>
          <Tag color={report.overallScore>=75?C.green:report.overallScore>=50?C.amberL:C.red} bg="rgba(255,255,255,.12)">{report.verdict}</Tag>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {[["Communication",report.communicationScore],["Technical",report.technicalScore],["Confidence",report.confidenceScore],["Structure",report.structureScore]].map(([l,v],i)=>(
            <div key={i} style={{textAlign:"center",background:"rgba(255,255,255,.07)",borderRadius:10,padding:"10px 4px"}}>
              <div style={{fontWeight:800,fontSize:16}}>{v}%</div>
              <div style={{fontSize:9.5,color:"rgba(255,255,255,.6)",marginTop:2,fontWeight:600}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:16,color:"rgba(255,255,255,.85)",fontSize:13,lineHeight:1.8,textAlign:"center"}}>{report.summary}</div>
      </div>

      {report.strengths?.length>0&&(
        <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}>
          <div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:10}}>✅ What worked</div>
          {report.strengths.map((s,i)=>(
            <div key={i} style={{background:C.greenPale,borderRadius:8,padding:"9px 12px",marginBottom:6,fontSize:13,color:C.soft,border:"1px solid #bbf7d0"}}>{s}</div>
          ))}
        </div>
      )}
      {report.improvements?.length>0&&(
        <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}>
          <div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:10}}>🎯 What to work on</div>
          {report.improvements.map((s,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",background:C.bg2,borderRadius:8,padding:"9px 12px",marginBottom:6,border:`1px solid ${C.border}`}}>
              <span style={{color:C.amber,fontWeight:800}}>→</span>
              <span style={{color:C.soft,fontSize:13}}>{s}</span>
            </div>
          ))}
        </div>
      )}
      {report.perQuestion?.length>0&&(
        <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}>
          <div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:10}}>🔍 Question-by-question</div>
          {report.perQuestion.map((p,i)=>(
            <div key={i} style={{background:C.bg2,borderRadius:10,padding:12,marginBottom:8,border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,gap:8}}>
                <div style={{fontWeight:600,color:C.ink,fontSize:12.5}}>Q{i+1}. {p.question}</div>
                <div style={{fontWeight:800,fontSize:13,color:sc(p.score),flexShrink:0}}>{p.score}%</div>
              </div>
              <div style={{color:C.soft,fontSize:12.5,lineHeight:1.7}}>{p.feedback}</div>
              <Bar score={p.score} color={sc(p.score)}/>
            </div>
          ))}
        </div>
      )}

      <div style={{display:"flex",gap:10,marginTop:8}}>
        <Btn v="amber" onClick={()=>pickRole(role)} style={{flex:1,padding:"13px"}}>🔁 Retry This Role</Btn>
        <Btn v="ghost" onClick={restart} style={{flex:1,padding:"13px"}}>🎲 Try Another Role</Btn>
      </div>
    </div>
  );

  return null;
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

  const quickRoles=["React Developer","Node.js","Data Analyst","Python","Java","Full Stack","DevOps","AI ML"];

  return(
    <div>
      <div style={{fontWeight:800,fontSize:20,color:C.ink,marginBottom:4}}>🔥 Live Job Feed</div>
      <div style={{color:C.muted,fontSize:13,marginBottom:14}}>Real jobs from top Indian companies · Updated daily. Practiced the role in Interview Mocks? Apply here next.</div>
      <div style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <input style={inp} placeholder="Role..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
          <input style={inp} placeholder="City..." value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
          {quickRoles.map(r=>(
            <button key={r} onClick={()=>{setSearch(r);fetchJobs(r,location);}}
              style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${C.border}`,background:search===r?`${C.amber}10`:"#f8fafc",color:search===r?C.amber:C.muted,fontSize:11,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>
              {r}
            </button>
          ))}
        </div>
        <Btn v="dark" onClick={()=>fetchJobs()} style={{width:"100%"}}>🔍 Search Jobs</Btn>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:15,color:C.ink}}>Results</div>
        {!loading&&jobs.length>0&&(
          <div style={{display:"flex",alignItems:"center",gap:5,background:C.greenPale,borderRadius:20,padding:"4px 10px",border:"1px solid #bbf7d0"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/>
            <span style={{color:C.green,fontSize:11,fontWeight:700}}>{jobs.length} live jobs</span>
          </div>
        )}
      </div>

      {loading&&<div style={{textAlign:"center",padding:"60px 0"}}><Spin size={36}/></div>}
      {!loading&&jobs.map((job,i)=>{
        const isExp=expanded===job.id;
        const isSaved=saved.includes(job.id);
        return(
          <div key={job.id} className="fade lift" style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:8,borderLeft:`3px solid ${C.amber}`,animationDelay:`${i*.04}s`,boxShadow:"0 1px 6px rgba(0,0,0,.04)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:C.ink}}>{job.title}</div>
                <div style={{color:C.muted,fontSize:12,marginTop:1}}>{job.company} · {job.location}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{color:C.green,fontWeight:800,fontSize:13}}>{job.salary}</div>
                <div style={{color:C.muted,fontSize:11,marginTop:1}}>{job.posted}</div>
              </div>
            </div>
            <div style={{color:C.muted,fontSize:12,lineHeight:1.7,marginBottom:10,background:C.bg2,borderRadius:8,padding:"8px 10px"}}>
              {isExp?job.description.replace(/<[^>]+>/g,""):job.desc200.replace(/<[^>]+>/g,"")+(job.description.length>200?"...":"")}
              {job.description.length>200&&(
                <button onClick={()=>setExpanded(isExp?null:job.id)} style={{background:"none",border:"none",color:C.amber,fontSize:11,cursor:"pointer",marginLeft:4,fontFamily:"'Inter',sans-serif",fontWeight:600}}>
                  {isExp?"Less ▲":"More ▼"}
                </button>
              )}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <Tag color={C.teal}>{job.category}</Tag>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>setSaved(s=>s.includes(job.id)?s.filter(x=>x!==job.id):[...s,job.id])}
                  style={{padding:"6px 10px",borderRadius:8,border:`1.5px solid ${isSaved?C.amber:C.border}`,background:isSaved?C.amberPale:"transparent",cursor:"pointer",fontSize:11,fontWeight:600,color:isSaved?C.amber:C.muted,fontFamily:"'Inter',sans-serif"}}>
                  {isSaved?"★":"☆"}
                </button>
                <Btn v="dark" onClick={()=>window.open(job.url,"_blank")} style={{fontSize:12,padding:"7px 16px"}}>Apply →</Btn>
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
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════
function LandingPage({onStart}){
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>50);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);

  const reviews=[
    {name:"Priya M.",role:"SDE @ Wipro",text:"It actually spoke the questions out loud and made me answer in real time — way more nerve-testing than a PDF of questions. I walked into my real interview calm.",avatar:"PM"},
    {name:"Arun K.",role:"Data Analyst @ TCS",text:"The feedback report broke down exactly where I rambled and where I sounded confident. Did three rounds before my actual interview.",avatar:"AK"},
    {name:"Sneha R.",role:"Full Stack Dev @ Infosys",text:"26 roles to pick from — found the exact one I was interviewing for. Felt like a real panel was sitting across from me.",avatar:"SR"},
  ];

  return(
    <div style={{background:"#fff",color:C.ink,fontFamily:"'Inter',sans-serif",overflowX:"hidden"}}>
      <style>{CSS}</style>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:scrolled?"rgba(255,255,255,.96)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${C.border}`:"none",transition:"all .3s",padding:"0 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div style={{fontWeight:900,fontSize:22,color:C.navy,display:"flex",alignItems:"center",gap:6}}>🎤 TakePlace</div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <Btn v="ghost" onClick={onStart} style={{padding:"8px 18px",fontSize:13}}>Sign In</Btn>
            <Btn v="amber" onClick={onStart} style={{padding:"8px 20px",fontSize:13}}>Start Mock Interview →</Btn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 24px 80px",position:"relative",overflow:"hidden",background:`linear-gradient(165deg,${C.navy} 0%,${C.navyL} 55%,#1d2b52 100%)`,color:"#fff"}}>
        <div style={{position:"absolute",top:"10%",right:"6%",width:380,height:380,borderRadius:"50%",background:"radial-gradient(circle,rgba(245,158,11,.18),transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"6%",left:"4%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(20,184,166,.18),transparent 70%)",pointerEvents:"none"}}/>
        <div style={{textAlign:"center",maxWidth:780,position:"relative",zIndex:1}}>
          <div className="fade" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(245,158,11,.12)",border:"1px solid rgba(245,158,11,.35)",borderRadius:20,padding:"6px 16px",marginBottom:28,fontSize:12,color:C.amberL,fontWeight:700}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:C.amberL,display:"inline-block",animation:"pulse 1.5s infinite"}}/>
            A real spoken interview. Not a quiz.
          </div>
          <h1 className="fade" style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:"clamp(36px,6vw,62px)",lineHeight:1.1,marginBottom:22,animationDelay:".1s"}}>
            Sit across from an AI<br/>interviewer who actually<br/>
            <span style={{color:C.amberL}}>asks, listens, and scores you.</span>
          </h1>
          <p className="fade" style={{fontSize:16,color:"rgba(255,255,255,.75)",lineHeight:1.8,marginBottom:40,maxWidth:560,margin:"0 auto 40px",animationDelay:".2s"}}>
            Pick from 26 real roles. The interviewer speaks every question out loud. You answer by talking, on the clock, like the real thing — then get a full feedback report.
          </p>
          <div className="fade" style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",animationDelay:".3s"}}>
            <Btn v="amber" onClick={onStart} style={{padding:"15px 36px",fontSize:16,borderRadius:12}}>🎙️ Start Your Mock Interview</Btn>
            <Btn v="ghost" onClick={onStart} style={{padding:"15px 28px",fontSize:16,borderRadius:12,color:"#fff",border:"1.5px solid rgba(255,255,255,.3)"}}>Browse Live Jobs →</Btn>
          </div>
        </div>
      </section>

      {/* TWO PILLARS */}
      <section style={{padding:"80px 24px",maxWidth:1000,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:50}}>
          <div style={{fontSize:11,color:C.amber,fontWeight:800,letterSpacing:3,marginBottom:12,textTransform:"uppercase"}}>Just two things, done extremely well</div>
          <h2 style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:34,color:C.ink}}>Practice the interview. Then go get it.</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:24}}>
          <div className="lift" style={{background:`linear-gradient(160deg,${C.navy},${C.navyL})`,borderRadius:24,padding:32,color:"#fff"}}>
            <div style={{fontSize:42,marginBottom:14}}>🎤</div>
            <div style={{fontWeight:800,fontSize:20,marginBottom:10}}>AI Mock Interviews</div>
            <div style={{color:"rgba(255,255,255,.75)",fontSize:14,lineHeight:1.85,marginBottom:18}}>
              26+ roles, from Software Engineer to Civil Engineer. The AI sits in the interviewer's seat, asks role-specific questions out loud, listens to your spoken answer in real time on a countdown clock, then scores you on communication, technical depth, confidence, and structure.
            </div>
            <ul style={{color:"rgba(255,255,255,.65)",fontSize:13,lineHeight:2,paddingLeft:18}}>
              <li>Spoken questions, spoken answers — no typing</li>
              <li>Live transcript as you talk</li>
              <li>Per-question + overall feedback report</li>
            </ul>
          </div>
          <div className="lift" style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:24,padding:32,boxShadow:"0 2px 16px rgba(0,0,0,.05)"}}>
            <div style={{fontSize:42,marginBottom:14}}>🔥</div>
            <div style={{fontWeight:800,fontSize:20,marginBottom:10,color:C.ink}}>Live Job Feed</div>
            <div style={{color:C.muted,fontSize:14,lineHeight:1.85,marginBottom:18}}>
              Real, currently-open roles from companies across India, updated daily. Filter by role and city, see salary ranges upfront, and apply directly — no fake listings.
            </div>
            <ul style={{color:C.soft,fontSize:13,lineHeight:2,paddingLeft:18}}>
              <li>Updated daily from live company postings</li>
              <li>Filter by role, city, salary band</li>
              <li>One-tap apply on the original listing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{padding:"80px 24px",background:C.bg2}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:50}}>
            <div style={{fontSize:11,color:C.teal,fontWeight:800,letterSpacing:3,marginBottom:12,textTransform:"uppercase"}}>Before they walked into the real one</div>
            <h2 style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:32,color:C.ink}}>They rehearsed here first.</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:18}}>
            {reviews.map((r,i)=>(
              <div key={i} className="lift" style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:20,padding:26,boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}>
                <div style={{color:C.soft,fontSize:14,lineHeight:1.8,marginBottom:18}}>{r.text}</div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${C.navy},${C.navyL})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:"#fff"}}>{r.avatar}</div>
                  <div>
                    <div style={{fontWeight:700,color:C.ink,fontSize:14}}>{r.name}</div>
                    <div style={{color:C.muted,fontSize:12}}>{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"80px 24px",textAlign:"center"}}>
        <div style={{maxWidth:580,margin:"0 auto",background:`linear-gradient(135deg,${C.navy},${C.navyL})`,borderRadius:28,padding:"56px 36px"}}>
          <div className="float" style={{fontSize:48,marginBottom:14}}>🎤</div>
          <h2 style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:30,color:"#fff",marginBottom:10}}>It's Your Time. TakePlace.</h2>
          <p style={{color:"rgba(255,255,255,.7)",fontSize:15,marginBottom:32,lineHeight:1.7}}>Sit through one real mock interview, get scored, and apply with confidence.</p>
          <Btn v="amber" onClick={onStart} style={{padding:"14px 44px",fontSize:15,borderRadius:12}}>Start Free Now →</Btn>
        </div>
      </section>

      <footer style={{borderTop:`1px solid ${C.border}`,padding:"24px",textAlign:"center",background:"#fff"}}>
        <div style={{color:C.muted,fontSize:12}}>
          © 2026 TakePlace · Built by Raghu Dadigela ·{" "}
          <a href="mailto:support@takeplace.in" style={{color:C.navy,fontWeight:600}}>support@takeplace.in</a>
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
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${C.navy} 0%,${C.navyL} 60%,#1d2b52 100%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{CSS}</style>
      <div className="fade" style={{width:"100%",maxWidth:400,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:24,padding:"32px",boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginBottom:20,fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:4}}>← Back</button>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:6}}>🎤</div>
          <div style={{fontWeight:900,fontSize:24,color:C.navy}}>TakePlace</div>
          <div style={{color:C.muted,fontSize:13,marginTop:4}}>{mode==="login"?"Welcome back 👋":"Create your free account ✨"}</div>
        </div>
        <button onClick={handleGoogle} disabled={gLoading} style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",color:C.ink,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
          {gLoading?<Spin size={16}/>:<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
          Continue with Google
        </button>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <div style={{flex:1,height:1,background:C.border}}/><span style={{color:C.muted,fontSize:12}}>or</span><div style={{flex:1,height:1,background:C.border}}/>
        </div>
        <div style={{display:"flex",background:C.bg2,borderRadius:10,padding:4,marginBottom:18}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}}
              style={{flex:1,padding:"9px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,transition:"all .2s",background:mode===m?"#fff":"transparent",color:mode===m?C.navy:C.muted,boxShadow:mode===m?"0 1px 4px rgba(0,0,0,.08)":"none"}}>
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
        <Btn v="amber" onClick={handle} loading={loading} style={{width:"100%",marginTop:16,padding:"13px",fontSize:15}}>
          {mode==="login"?"Sign In →":"Create Account →"}
        </Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP — just two tabs: Interview Mocks and Jobs
// ═══════════════════════════════════════════════════════════════════════════
function MainApp({user,onLogout}){
  const [tab,setTab]=useState(()=>parseInt(sessionStorage.getItem("tp_tab")||"0"));
  const [menuOpen,setMenuOpen]=useState(false);
  const name=user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";
  const initials=name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();

  const setTabP=(t)=>{setTab(t);sessionStorage.setItem("tp_tab",t);};

  const TABS=[
    {icon:"🎤",label:"Interview Mocks",id:0},
    {icon:"🔥",label:"Jobs",id:1},
  ];

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Inter',sans-serif",paddingBottom:72}}>
      <style>{CSS}
        {`
          @media(min-width:640px){
            .bottom-nav-wrap{display:none!important;}
            .top-tab-bar{display:flex!important;}
          }
          @media(max-width:639px){
            .top-tab-bar{display:none!important;}
            .bottom-nav-wrap{display:flex!important;}
          }
        `}
      </style>

      {/* TOP HEADER */}
      <div style={{background:"#fff",borderBottom:`1.5px solid ${C.border}`,padding:"0 20px",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:58}}>
          <div style={{fontWeight:900,fontSize:20,color:C.navy,display:"flex",alignItems:"center",gap:5}}>🎤 TakePlace</div>
          <div className="top-tab-bar" style={{display:"none",gap:4}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTabP(t.id)}
                style={{padding:"8px 20px",border:"none",background:"transparent",cursor:"pointer",color:tab===t.id?C.amber:C.muted,fontFamily:"'Inter',sans-serif",fontWeight:tab===t.id?700:500,fontSize:14,borderBottom:`2.5px solid ${tab===t.id?C.amber:"transparent"}`,transition:"all .2s",display:"flex",alignItems:"center",gap:5}}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div style={{position:"relative"}}>
            <button onClick={()=>setMenuOpen(m=>!m)} style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${C.navy},${C.navyL})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#fff",border:"none",cursor:"pointer"}}>
              {initials}
            </button>
            {menuOpen&&(
              <div style={{position:"absolute",right:0,top:42,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:12,boxShadow:"0 8px 24px rgba(0,0,0,.12)",padding:8,minWidth:160,zIndex:50}}>
                <div style={{padding:"8px 10px",fontSize:12,color:C.muted,borderBottom:`1px solid ${C.border}`,marginBottom:6}}>{name}</div>
                <button onClick={onLogout} style={{width:"100%",textAlign:"left",padding:"8px 10px",borderRadius:8,border:"none",background:"transparent",color:C.red,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>🚪 Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"20px 16px 20px"}}>
        {tab===0&&<InterviewMock/>}
        {tab===1&&<JobsTab/>}
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="bottom-nav-wrap bottom-nav" style={{
        position:"fixed",bottom:0,left:0,right:0,
        background:"#fff",borderTop:`1.5px solid ${C.border}`,
        display:"flex",zIndex:200,
        boxShadow:"0 -4px 20px rgba(0,0,0,.08)",
      }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTabP(t.id)}
            style={{
              flex:1,padding:"10px 4px 8px",border:"none",background:"transparent",
              cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              color:tab===t.id?C.amber:C.muted,fontFamily:"'Inter',sans-serif",
              transition:"all .15s",
            }}>
            <div style={{width:32,height:3,borderRadius:2,background:tab===t.id?C.amber:"transparent",marginBottom:2,transition:"background .2s"}}/>
            <span style={{fontSize:22,lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:10,fontWeight:tab===t.id?700:500,letterSpacing:.3}}>{t.label}</span>
          </button>
        ))}
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
    if(window.speechSynthesis) window.speechSynthesis.getVoices(); // warm up voice list
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
      <span style={{fontSize:40}}>🎤</span>
      <Spin size={36}/>
      <div style={{color:C.muted,fontSize:14,fontFamily:"'Inter',sans-serif"}}>Loading TakePlace...</div>
    </div>
  );

  if(page==="landing")return<LandingPage onStart={()=>setPage("auth")}/>;
  if(page==="auth")return<AuthPage onLogin={u=>{setUser(u);setPage("app");}} onBack={()=>setPage("landing")}/>;
  return<MainApp user={user} onLogout={()=>supabase.auth.signOut()}/>;
}
