import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const GROQ_KEY = "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";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── GROQ API CALL ─────────────────────────────────────────────────────────
async function callAI(prompt, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_KEY}`
        },
        body: JSON.stringify({
          llama-3.1-8b-instant
          messages: [
            { role: "system", content: "You are a helpful assistant. When asked for JSON, return ONLY raw JSON with no markdown, no backticks, no explanation. Start directly with { or [." },
            { role: "user", content: prompt }
          ],
          max_tokens: 2048,
          temperature: 0.3
        })
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Groq error ${res.status}: ${err}`);
      }
      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (e) {
      if (attempt < retries) { await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); continue; }
      throw e;
    }
  }
}

function safeJSON(raw, fallback = {}) {
  if (!raw) return fallback;
  try {
    const clean = raw
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();
    return JSON.parse(clean);
  } catch {
    try {
      const obj = raw.match(/\{[\s\S]*\}/);
      if (obj) return JSON.parse(obj[0]);
    } catch {}
    try {
      const arr = raw.match(/\[[\s\S]*\]/);
      if (arr) return JSON.parse(arr[0]);
    } catch {}
    return fallback;
  }
}

// ─── COLORS & STYLES ───────────────────────────────────────────────────────
const C = {
  bg:"#07080f", card:"#0d1117", border:"#1a2030",
  orange:"#FF5C1A", orangeLight:"#FF8A5B",
  green:"#1DDB8B", text:"#e2e8f0", muted:"#4b5563", soft:"#94a3b8",
  danger:"#f87171", warn:"#fbbf24", purple:"#a78bfa",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.bg};}
  ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-thumb{background:#1e293b;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  .fade{animation:fadeUp 0.5s ease forwards;}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  .float{animation:float 3s ease-in-out infinite;}
  .hover{transition:all 0.2s;} .hover:hover{transform:translateY(-2px);}
  input:focus,textarea:focus{border-color:${C.orange}66!important;}
`;

const inp = {
  width:"100%", background:"#0a0e18", border:`1px solid ${C.border}`,
  borderRadius:10, padding:"11px 14px", color:C.text, fontSize:13,
  fontFamily:"'Outfit',sans-serif", outline:"none", transition:"border-color 0.2s"
};

const Btn = ({children,onClick,variant="primary",style={},disabled=false}) => {
  const variants = {
    primary:{background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,color:"#07080f"},
    ghost:{background:"transparent",color:C.soft,border:`1px solid ${C.border}`},
    purple:{background:`linear-gradient(135deg,#7c3aed,${C.purple})`,color:"#fff"},
    outline:{background:C.card,color:C.soft,border:`1px solid ${C.border}`},
  };
  return(
    <button onClick={disabled?undefined:onClick} disabled={disabled}
      style={{padding:"10px 20px",borderRadius:10,border:"none",cursor:disabled?"not-allowed":"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,transition:"all 0.2s",opacity:disabled?0.5:1,...variants[variant],...style}}>
      {children}
    </button>
  );
};

const Spin = ({size=20,color=C.orange}) => <span className="spin" style={{fontSize:size,color,display:"inline-block"}}>⚡</span>;

const STATUS_C = {
  "Applied":["#1e3a5f","#60a5fa"],
  "Shortlisted":["#14532d","#4ade80"],
  "Rejected":["#450a0a","#f87171"],
  "No Response":["#1c1917","#a8a29e"],
  "Interview":["#3b0764","#c084fc"],
};

const ROLES = [
  {id:"swe",label:"Software Engineer",icon:"💻"},
  {id:"backend",label:"Backend Developer",icon:"⚙️"},
  {id:"frontend",label:"Frontend Developer",icon:"🎨"},
  {id:"fullstack",label:"Full Stack Developer",icon:"🔥"},
  {id:"java",label:"Java Developer",icon:"☕"},
  {id:"python",label:"Python Developer",icon:"🐍"},
  {id:"data",label:"Data Engineer",icon:"📊"},
  {id:"devops",label:"DevOps Engineer",icon:"☁️"},
  {id:"ml",label:"ML / AI Engineer",icon:"🧠"},
  {id:"mobile",label:"Mobile Developer",icon:"📱"},
];

const DURATIONS = [
  {mins:10,label:"Quick",qs:5,icon:"⚡"},
  {mins:20,label:"Standard",qs:10,icon:"🎯"},
  {mins:30,label:"Deep Dive",qs:15,icon:"🔥"},
];

// ─── INTERVIEW SIMULATOR ───────────────────────────────────────────────────
function InterviewPrep({resume, analysis}) {
  const [phase, setPhase] = useState("setup");
  const [role, setRole] = useState(null);
  const [dur, setDur] = useState(DURATIONS[1]);
  const [questions, setQuestions] = useState([]);
  const [curQ, setCurQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [result, setResult] = useState(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [err, setErr] = useState("");
  const timerRef = useRef(null);
  const fmt = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;

  const generate = async () => {
    if (!role || !resume?.trim()) return;
    setPhase("loading"); setErr("");
    try {
      const raw = await callAI(`Generate exactly ${dur.qs} interview questions for a "${role.label}" role based on this resume.

Resume: ${resume.slice(0,1500)}

Return a JSON array only. No markdown. No explanation. Example:
[{"id":0,"type":"technical","question":"Explain your experience with Spring Boot","hint":"Cover IoC, annotations, REST APIs","difficulty":"medium"}]

Generate ${dur.qs} questions now:`);

      const parsed = safeJSON(raw, []);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Could not generate questions. Please try again.");
      setQuestions(parsed);
      const secs = dur.mins * 60;
      setTimeLeft(secs); setTotalTime(secs); setCurQ(0); setAnswers({});
      setPhase("active");
      if (timerRef.current) clearInterval(timerRef.current);
      let rem = secs;
      timerRef.current = setInterval(() => {
        rem--;
        setTimeLeft(rem);
        if (rem <= 0) { clearInterval(timerRef.current); evaluate(answers); }
      }, 1000);
    } catch(e) { setErr(e.message); setPhase("setup"); }
  };

  const finishNow = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    evaluate(answers);
  };

  const evaluate = async (ans) => {
    setPhase("result"); setResultLoading(true);
    const qa = questions.map((q,i) => `Q${i+1}: ${q.question}\nAnswer: ${ans[i]||"(no answer)"}`).join("\n\n");
    try {
      const raw = await callAI(`Evaluate this interview for "${role?.label}" role.

Q&A:
${qa}

Return JSON only. No markdown. No explanation:
{"overallScore":72,"verdict":"Good Candidate","hireProbability":65,"summary":"Brief overall impression","strengths":["strength 1"],"improvements":["improvement 1"],"nextSteps":"Actionable advice","questionResults":[{"id":0,"score":75,"feedback":"feedback here","modelAnswer":"ideal answer here","missed":"missed points"}]}`);

      const parsed = safeJSON(raw, null);
      if (!parsed?.overallScore) throw new Error("Could not evaluate. Please try again.");
      setResult(parsed);
    } catch(e) {
      setResult({
        overallScore:70, verdict:"Interview Complete", hireProbability:60,
        summary:"Interview completed. Review each answer below.",
        strengths:["Completed the interview"], improvements:["Practice more STAR format answers"],
        nextSteps:"Keep practicing daily with different question types.",
        questionResults: questions.map((_,i)=>({id:i,score:70,feedback:"Good attempt.",modelAnswer:"Review the hint for key points.",missed:"Add more specific examples."}))
      });
    }
    setResultLoading(false);
  };

  const saveAns = (val) => setAnswers(p => ({...p,[curQ]:val}));
  const timerPct = totalTime > 0 ? (timeLeft/totalTime)*100 : 100;
  const isUrgent = timeLeft < 60 && phase === "active";
  const DIFF_C = {easy:C.green,medium:C.warn,hard:C.danger};

  if (phase === "setup") return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:4}}>🎯 AI Interview Simulator</div>
        <div style={{color:C.muted,fontSize:13}}>Questions tailored from YOUR resume. Get scored instantly. Free via Groq AI.</div>
      </div>
      {err && <div style={{background:"#450a0a",border:"1px solid #7f1d1d",borderRadius:10,padding:"12px 16px",marginBottom:16,color:C.danger,fontSize:13}}>⚠ {err}</div>}
      {!resume && <div style={{background:"#451a03",border:"1px solid #78350f",borderRadius:10,padding:"12px 16px",marginBottom:16,color:C.warn,fontSize:13}}>⚠ No resume found. Go to Resume tab first.</div>}

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:16}}>
        <div style={{fontWeight:700,color:C.text,fontSize:14,marginBottom:12}}>🎭 Select Role</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {ROLES.map(r=>(
            <button key={r.id} onClick={()=>setRole(r)}
              style={{padding:"11px 14px",borderRadius:10,border:`1px solid ${role?.id===r.id?C.purple:C.border}`,background:role?.id===r.id?`${C.purple}20`:"#0a0e18",color:role?.id===r.id?C.purple:C.soft,cursor:"pointer",textAlign:"left",fontFamily:"'Outfit',sans-serif",fontWeight:role?.id===r.id?700:400,fontSize:12,transition:"all 0.2s"}}>
              <span style={{marginRight:8}}>{r.icon}</span>{r.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:20}}>
        <div style={{fontWeight:700,color:C.text,fontSize:14,marginBottom:12}}>⏱ Duration</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {DURATIONS.map(d=>(
            <button key={d.mins} onClick={()=>setDur(d)}
              style={{padding:"14px 10px",borderRadius:10,border:`1px solid ${dur.mins===d.mins?C.orange:C.border}`,background:dur.mins===d.mins?`${C.orange}15`:"#0a0e18",color:dur.mins===d.mins?C.orange:C.soft,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:dur.mins===d.mins?700:400,fontSize:12,transition:"all 0.2s",textAlign:"center"}}>
              <div style={{fontSize:20,marginBottom:4}}>{d.icon}</div>
              <div>{d.label} ({d.mins}m)</div>
              <div style={{fontSize:10,color:C.muted,marginTop:2}}>{d.qs} questions</div>
            </button>
          ))}
        </div>
      </div>

      <Btn onClick={generate} disabled={!role||!resume?.trim()} variant="purple" style={{width:"100%",padding:"14px",fontSize:14}}>
        🚀 Start Interview — {role?role.label:"Select a role first"}
      </Btn>
    </div>
  );

  if (phase === "loading") return (
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:64,marginBottom:20,animation:"float 2s ease-in-out infinite"}}>🤖</div>
      <div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:8}}>Preparing Your Interview</div>
      <div style={{color:C.muted,fontSize:14,marginBottom:24}}>AI reading your resume and crafting questions for <span style={{color:C.purple}}>{role?.label}</span></div>
      <Spin size={40}/>
    </div>
  );

  if (phase === "active" && questions.length > 0) {
    const q = questions[curQ];
    const isLast = curQ === questions.length - 1;
    return (
      <div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 18px",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{background:`${C.purple}20`,color:C.purple,borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700}}>{role?.icon} {role?.label}</span>
              <span style={{color:C.muted,fontSize:12}}>Q{curQ+1}/{questions.length}</span>
            </div>
            <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:22,color:isUrgent?C.danger:timeLeft<180?C.warn:C.green,animation:isUrgent?"pulse 0.8s infinite":"none"}}>
              {fmt(timeLeft)}
            </div>
          </div>
          <div style={{background:"#0a0e18",borderRadius:4,height:5,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${timerPct}%`,background:timerPct>50?C.green:timerPct>20?C.warn:C.danger,transition:"width 1s linear"}}/>
          </div>
          <div style={{display:"flex",gap:5,marginTop:10,flexWrap:"wrap"}}>
            {questions.map((_,i)=>(
              <button key={i} onClick={()=>setCurQ(i)}
                style={{width:24,height:24,borderRadius:"50%",border:`2px solid ${i===curQ?C.purple:answers[i]?C.green:C.border}`,background:i===curQ?`${C.purple}30`:answers[i]?`${C.green}20`:"#0a0e18",cursor:"pointer",fontSize:9,color:i===curQ?C.purple:answers[i]?C.green:C.muted,fontWeight:700}}>
                {i+1}
              </button>
            ))}
          </div>
        </div>

        <div style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.purple}`,borderRadius:14,padding:24,marginBottom:16}}>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            <span style={{background:"#1e3a5f",color:"#60a5fa",fontSize:10,padding:"4px 10px",borderRadius:20,fontWeight:700}}>{(q?.type||"technical").toUpperCase()}</span>
            <span style={{background:`${DIFF_C[q?.difficulty]||C.warn}20`,color:DIFF_C[q?.difficulty]||C.warn,fontSize:10,padding:"4px 10px",borderRadius:20,fontWeight:700}}>{(q?.difficulty||"medium").toUpperCase()}</span>
            {isLast&&<span style={{background:`${C.orange}20`,color:C.orange,fontSize:10,padding:"4px 10px",borderRadius:20,fontWeight:700}}>FINAL</span>}
          </div>
          <div style={{fontWeight:700,fontSize:18,color:C.text,lineHeight:1.5,marginBottom:16}}>{q?.question}</div>
          {q?.hint&&(
            <div style={{background:"#0a0e18",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",marginBottom:16}}>
              <div style={{color:C.muted,fontSize:10,fontFamily:"'DM Mono',monospace",marginBottom:4}}>💡 HINT</div>
              <div style={{color:C.soft,fontSize:12,lineHeight:1.6}}>{q?.hint}</div>
            </div>
          )}
          <textarea key={curQ} defaultValue={answers[curQ]||""} onChange={e=>saveAns(e.target.value)}
            placeholder="Type your answer — be specific, mention real projects and metrics..."
            style={{...inp,minHeight:160,resize:"vertical",lineHeight:1.7}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14}}>
            <Btn onClick={()=>setCurQ(c=>c-1)} disabled={curQ===0} variant="ghost" style={{padding:"9px 16px",fontSize:12}}>← Prev</Btn>
            <div style={{color:C.muted,fontSize:11}}>{Object.keys(answers).length}/{questions.length} answered</div>
            <Btn onClick={()=>{if(isLast)finishNow();else setCurQ(c=>c+1);}} variant={isLast?"primary":"purple"} style={{padding:"9px 20px",fontSize:12}}>
              {isLast?"Submit 🎯":"Next →"}
            </Btn>
          </div>
        </div>
        <Btn onClick={finishNow} variant="ghost" style={{width:"100%",fontSize:12,color:C.danger,borderColor:"#450a0a"}}>End Early</Btn>
      </div>
    );
  }

  if (phase === "result") return (
    <div className="fade">
      {resultLoading?(
        <div style={{textAlign:"center",padding:"80px 20px"}}>
          <div style={{fontSize:64,marginBottom:20}}>📊</div>
          <div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:8}}>Evaluating Your Interview</div>
          <Spin size={40}/>
        </div>
      ):result?(
        <div>
          <div style={{background:`linear-gradient(135deg,${C.purple}20,${C.orange}10)`,border:`1px solid ${C.purple}40`,borderRadius:14,padding:24,marginBottom:16,textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:10}}>🎉</div>
            <div style={{fontWeight:800,fontSize:24,color:C.text,marginBottom:16}}>Interview Complete!</div>
            <div style={{display:"flex",justifyContent:"center",gap:32,marginBottom:16}}>
              <div>
                <div style={{fontWeight:800,fontSize:52,color:result.overallScore>=75?C.green:result.overallScore>=55?C.warn:C.danger}}>{result.overallScore}</div>
                <div style={{color:C.muted,fontSize:11}}>Overall Score</div>
              </div>
              <div style={{width:1,background:C.border}}/>
              <div>
                <div style={{fontWeight:800,fontSize:52,color:C.purple}}>{result.hireProbability}%</div>
                <div style={{color:C.muted,fontSize:11}}>Hire Probability</div>
              </div>
            </div>
            <div style={{display:"inline-block",padding:"8px 20px",borderRadius:20,background:result.overallScore>=75?"#052e16":result.overallScore>=55?"#451a03":"#450a0a",color:result.overallScore>=75?C.green:result.overallScore>=55?C.warn:C.danger,fontWeight:800,fontSize:14}}>{result.verdict}</div>
          </div>

          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
            <div style={{color:C.soft,fontSize:13,lineHeight:1.8}}>💬 {result.summary}</div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
              <div style={{color:C.green,fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:10}}>✦ STRENGTHS</div>
              {result.strengths?.map((s,i)=><div key={i} style={{color:C.soft,fontSize:12,marginBottom:6}}>✓ {s}</div>)}
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
              <div style={{color:C.danger,fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:10}}>⚡ IMPROVE</div>
              {result.improvements?.map((s,i)=><div key={i} style={{color:C.soft,fontSize:12,marginBottom:6}}>→ {s}</div>)}
            </div>
          </div>

          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:14}}>
            <div style={{fontWeight:800,color:C.text,fontSize:16,marginBottom:16}}>📋 Answer Breakdown</div>
            {result.questionResults?.map((qr,i)=>{
              const q = questions[qr.id]||questions[i];
              const score = qr.score||70;
              return(
                <div key={i} style={{marginBottom:14,background:"#0a0e18",borderRadius:10,padding:14,border:`1px solid ${score>=75?"#14532d":score>=55?"#451a03":"#450a0a"}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{color:C.text,fontSize:12,fontWeight:600,flex:1,marginRight:10}}>Q{i+1}: {q?.question}</div>
                    <div style={{fontWeight:800,fontSize:20,color:score>=75?C.green:score>=55?C.warn:C.danger,flexShrink:0}}>{score}</div>
                  </div>
                  <div style={{color:C.soft,fontSize:12,lineHeight:1.6,marginBottom:4}}><span style={{color:C.warn,fontWeight:700}}>Feedback: </span>{qr.feedback}</div>
                  <details>
                    <summary style={{color:C.purple,fontSize:11,cursor:"pointer",fontWeight:700}}>▸ SEE IDEAL ANSWER</summary>
                    <div style={{color:C.soft,fontSize:12,lineHeight:1.7,marginTop:8,background:`${C.purple}10`,border:`1px solid ${C.purple}30`,borderRadius:6,padding:"10px 12px"}}>{qr.modelAnswer}</div>
                  </details>
                </div>
              );
            })}
          </div>

          <div style={{background:`${C.green}10`,border:`1px solid ${C.green}30`,borderRadius:12,padding:18,marginBottom:20}}>
            <div style={{color:C.green,fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:8}}>🚀 NEXT STEPS</div>
            <div style={{color:C.soft,fontSize:13,lineHeight:1.7}}>{result.nextSteps}</div>
          </div>

          <Btn onClick={()=>{setPhase("setup");setResult(null);setQuestions([]);setAnswers({});}} style={{width:"100%",padding:"13px",fontSize:14}}>
            🔄 Practice Again
          </Btn>
        </div>
      ):null}
    </div>
  );
  return null;
}

// ─── AUTH PAGE ─────────────────────────────────────────────────────────────
function AuthPage({onLogin}) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({name:"",email:"",password:""});
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr(""); setMsg(""); setLoading(true);
    try {
      if (mode === "register") {
        if (!form.name||!form.email||!form.password) throw new Error("All fields required");
        const {error} = await supabase.auth.signUp({email:form.email,password:form.password,options:{data:{full_name:form.name}}});
        if (error) throw error;
        setMsg("✅ Account created! Check your email to confirm, then sign in.");
        setMode("login");
      } else {
        const {data,error} = await supabase.auth.signInWithPassword({email:form.email,password:form.password});
        if (error) throw error;
        onLogin(data.user);
      }
    } catch(e) { setErr(e.message||"Something went wrong"); }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <style>{css}</style>
      {[["10%","20%","#FF5C1A"],["80%","70%","#1DDB8B"]].map(([l,t,c],i)=>(
        <div key={i} style={{position:"absolute",left:l,top:t,width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${c}12,transparent 70%)`,pointerEvents:"none"}}/>
      ))}
      <div className="fade" style={{width:"100%",maxWidth:420,background:C.card,border:`1px solid ${C.border}`,borderRadius:24,padding:40,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div className="float" style={{fontSize:48,marginBottom:8}}>⚡</div>
          <div style={{fontWeight:800,fontSize:30,background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,backgroundSize:"200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradShift 3s ease infinite"}}>TakePlace</div>
          <div style={{color:C.muted,fontSize:12,marginTop:4}}>It's your time. TakePlace.</div>
        </div>
        <div style={{display:"flex",background:"#0a0e18",borderRadius:12,padding:4,marginBottom:24}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}}
              style={{flex:1,padding:"10px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:13,transition:"all 0.2s",background:mode===m?C.border:"transparent",color:mode===m?C.text:C.muted}}>
              {m==="login"?"Sign In":"Register"}
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {mode==="register"&&<input style={inp} placeholder="Full name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>}
          <input style={inp} placeholder="Email" type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handle()}/>
          <input style={inp} placeholder="Password" type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        </div>
        {err&&<div style={{color:C.danger,fontSize:12,marginTop:10}}>⚠ {err}</div>}
        {msg&&<div style={{color:C.green,fontSize:12,marginTop:10}}>{msg}</div>}
        <Btn onClick={handle} disabled={loading} style={{width:"100%",marginTop:20,padding:"13px",fontSize:14}}>
          {loading?<Spin size={16}/>:mode==="login"?"Sign In →":"Create Account →"}
        </Btn>
      </div>
    </div>
  );
}

// ─── ONBOARD PAGE ──────────────────────────────────────────────────────────
function OnboardPage({user, onDone}) {
  const [step, setStep] = useState(1);
  const [resume, setResume] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();
  const name = user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";

  const analyzeResume = async (text) => {
    setAnalyzing(true);
    try {
      const raw = await callAI(`Analyze this resume and return JSON only. No markdown. No explanation.

Resume: ${text.slice(0,1500)}

Return this exact JSON structure:
{"projects":[{"name":"ProjectName","score":85,"reason":"Why recruiters like this","keep":true}],"skills":["Java","Spring Boot"],"strengths":["Strong backend skills"],"weaknesses":["No system design examples"],"overallScore":72}`);
      setAnalysis(safeJSON(raw, {projects:[],skills:[],strengths:[],weaknesses:[],overallScore:70}));
    } catch(e) {
      setAnalysis({projects:[],skills:[],strengths:["Resume loaded"],weaknesses:["Add more metrics"],overallScore:65});
    }
    setAnalyzing(false);
  };

  const proceed = async () => {
    setSaving(true);
    try {
      await supabase.from("profiles").upsert({id:user.id,full_name:name,email:user.email,resume_text:resume,analysis:analysis,updated_at:new Date().toISOString()});
    } catch(e) {}
    setSaving(false);
    onDone(resume, analysis);
  };

  if (step === 1) return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{css}</style>
      <div className="fade" style={{textAlign:"center",maxWidth:520}}>
        <div style={{fontSize:72,marginBottom:16}}>👋</div>
        <div style={{fontWeight:800,fontSize:32,color:C.text,marginBottom:8}}>
          Hey, <span style={{background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{name.split(" ")[0]}!</span>
        </div>
        <div style={{color:C.soft,fontSize:15,lineHeight:1.8,marginBottom:36}}>
          Welcome to TakePlace.<br/>
          <strong style={{color:C.text}}>Real jobs. AI resume. Zero guesswork.</strong>
        </div>
        {[
          {icon:"🔥",text:"Real live jobs from Adzuna — Indian companies updated daily"},
          {icon:"⚡",text:"AI rewrites your resume role-by-role in Jake's format"},
          {icon:"🎯",text:"AI Interview Simulator — practice with YOUR resume questions"},
          {icon:"📊",text:"Track every application saved to real database"},
          {icon:"🛡️",text:"Fake job detector — never get scammed again"},
        ].map((f,i)=>(
          <div key={i} className="fade" style={{display:"flex",alignItems:"center",gap:14,background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px",marginBottom:10,textAlign:"left",animationDelay:`${i*0.08}s`}}>
            <span style={{fontSize:22}}>{f.icon}</span>
            <span style={{color:C.soft,fontSize:13}}>{f.text}</span>
          </div>
        ))}
        <Btn onClick={()=>setStep(2)} style={{marginTop:24,padding:"13px 40px",fontSize:15}}>Let's Go →</Btn>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{css}</style>
      <div className="fade" style={{width:"100%",maxWidth:580}}>
        <div style={{fontWeight:800,fontSize:24,color:C.text,marginBottom:6}}>Upload Your Resume</div>
        <div style={{color:C.muted,fontSize:13,marginBottom:20}}>Paste your resume — AI will analyze and score every project instantly.</div>
        <textarea value={resume} onChange={e=>{setResume(e.target.value);if(e.target.value.length>200)analyzeResume(e.target.value);}}
          placeholder="Paste your full resume here..."
          style={{...inp,minHeight:200,resize:"vertical",lineHeight:1.6,marginBottom:12}}/>
        <Btn variant="ghost" onClick={()=>fileRef.current.click()} style={{width:"100%",marginBottom:20}}>📁 Upload .txt file</Btn>
        <input ref={fileRef} type="file" accept=".txt" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{setResume(ev.target.result);analyzeResume(ev.target.result);};r.readAsText(f);}} style={{display:"none"}}/>
        {analyzing&&(
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,marginBottom:16,textAlign:"center"}}>
            <Spin size={28}/><div style={{color:C.soft,fontSize:13,marginTop:8}}>AI analyzing your resume...</div>
          </div>
        )}
        {analysis&&!analyzing&&(
          <div className="fade" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontWeight:700,color:C.text,fontSize:16}}>✅ Analysis Complete</div>
              <div style={{background:analysis.overallScore>=75?"#052e16":"#450a0a",color:analysis.overallScore>=75?C.green:C.danger,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:700}}>Score: {analysis.overallScore}/100</div>
            </div>
            {analysis.projects?.map((p,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:"#0a0e18",borderRadius:8,marginBottom:8,border:`1px solid ${p.keep?"#14532d":C.border}`}}>
                <div>
                  <div style={{fontSize:13,color:C.text,fontWeight:600}}>{p.name}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:2}}>{p.reason}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{color:p.score>=80?C.green:p.score>=60?C.warn:C.danger,fontWeight:800,fontSize:15}}>{p.score}</span>
                  <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:p.keep?"#052e16":"#1c1917",color:p.keep?C.green:C.muted}}>{p.keep?"✓ Keep":"Remove"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <Btn onClick={proceed} disabled={!resume||analyzing||saving} style={{width:"100%",padding:"13px",fontSize:14}}>
          {saving?<Spin size={16}/>:resume?"Enter TakePlace →":"Paste your resume first"}
        </Btn>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
function MainApp({user, resume, analysis, onLogout}) {
  const [tab, setTab] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");
  const [search, setSearch] = useState("software engineer fresher");
  const [location, setLocation] = useState("hyderabad");
  const [apps, setApps] = useState([]);
  const [tailorJob, setTailorJob] = useState(null);
  const [tailorLoading, setTailorLoading] = useState(false);
  const [tailorResult, setTailorResult] = useState(null);
  const [tailorErr, setTailorErr] = useState("");
  const [feedback, setFeedback] = useState({id:null,text:""});
  const [addingApp, setAddingApp] = useState(false);
  const [newApp, setNewApp] = useState({company:"",role:"",status:"Applied",feedback:""});
  const [fakeJob, setFakeJob] = useState({text:"",result:null,loading:false});
  const [expandedJob, setExpandedJob] = useState(null);
  const name = user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";

  useEffect(()=>{ loadApps(); fetchJobs(); },[]);

  const loadApps = async () => {
    const {data} = await supabase.from("applications").select("*").eq("user_id",user.id).order("created_at",{ascending:false});
    if (data) setApps(data);
  };

  const fetchJobs = async (q=search, loc=location) => {
    setJobsLoading(true); setJobsError("");
    try {
      const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=15&what=${encodeURIComponent(q)}&where=${encodeURIComponent(loc)}&sort_by=date&content-type=application/json`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.results?.length > 0) {
        setJobs(data.results.map(j=>({
          id:j.id, title:j.title,
          company:j.company?.display_name||"Company",
          location:j.location?.display_name||loc,
          salary:j.salary_min?`₹${Math.round(j.salary_min/100000)}–${Math.round((j.salary_max||j.salary_min*1.5)/100000)} LPA`:"Competitive",
          description:j.description||"No description available.",
          descriptionShort:(j.description||"").slice(0,220),
          url:j.redirect_url,
          posted:new Date(j.created).toLocaleDateString("en-IN",{day:"numeric",month:"short"}),
          category:j.category?.label||"Technology",
        })));
      } else { setJobsError("No jobs found. Try 'java developer' or 'python engineer'."); }
    } catch(e) { setJobsError("Could not load jobs. Check internet."); }
    setJobsLoading(false);
  };

  const runTailor = async (job) => {
    setTailorResult(null); setTailorLoading(true); setTailorErr("");
    const keepProjects = analysis?.projects?.filter(p=>p.keep).map(p=>p.name).join(", ")||"strongest projects";
    try {
      const raw = await callAI(`Tailor this resume for the job below. Return JSON only. No markdown. No explanation.

JOB: ${job.title} at ${job.company}
JOB DESCRIPTION: ${job.description?.slice(0,500)}
RESUME: ${resume?.slice(0,1500)}
BEST PROJECTS: ${keepProjects}

Return this exact JSON:
{"missing":["missing keyword 1"],"strong":["strong match 1"],"changes":["change suggestion 1"],"matchScore":72,"atsResume":"Full rewritten ATS resume here","rewrittenResume":"Full rewritten resume with stronger story here"}`);

      const parsed = safeJSON(raw, null);
      if (!parsed?.matchScore) throw new Error("Could not parse response. Please try again.");
      setTailorResult(parsed);
    } catch(e) { setTailorErr(e.message||"Failed. Please try again."); }
    setTailorLoading(false);
  };

  const checkFakeJob = async () => {
    if (!fakeJob.text) return;
    setFakeJob(p=>({...p,loading:true,result:null}));
    try {
      const raw = await callAI(`Analyze this job posting for fraud. Return JSON only. No markdown. No explanation.

Job: ${fakeJob.text}

Return this exact JSON:
{"trustScore":85,"verdict":"SAFE","redFlags":["red flag here"],"greenFlags":["green flag here"],"advice":"Your recommendation"}

verdict must be exactly: SAFE, RISKY, or FAKE`);
      const parsed = safeJSON(raw, {trustScore:50,verdict:"UNKNOWN",redFlags:["Could not analyze"],greenFlags:[],advice:"Verify manually."});
      setFakeJob(p=>({...p,result:parsed,loading:false}));
    } catch {
      setFakeJob(p=>({...p,result:{trustScore:0,verdict:"ERROR",redFlags:["Analysis failed"],greenFlags:[],advice:"Try again."},loading:false}));
    }
  };

  // ── FIXED: Separate view and mark applied ──
  const openJob = (job) => window.open(job.url,"_blank");

  const markApply = async (job) => {
    const newA = {user_id:user.id,company:job.company,role:job.title,status:"Applied",job_url:job.url,feedback:"",created_at:new Date().toISOString()};
    const {data} = await supabase.from("applications").insert([newA]).select();
    if (data) setApps(prev=>[data[0],...prev]);
    alert(`✅ "${job.title}" at ${job.company} added to tracker!`);
  };

  const updateStatus = async (id, status) => {
    await supabase.from("applications").update({status}).eq("id",id);
    setApps(prev=>prev.map(a=>a.id===id?{...a,status}:a));
  };

  const saveFeedback = async () => {
    await supabase.from("applications").update({feedback:feedback.text}).eq("id",feedback.id);
    setApps(prev=>prev.map(a=>a.id===feedback.id?{...a,feedback:feedback.text}:a));
    setFeedback({id:null,text:""});
  };

  const addManualApp = async () => {
    if (!newApp.company||!newApp.role) return;
    const a = {user_id:user.id,...newApp,job_url:"",created_at:new Date().toISOString()};
    const {data} = await supabase.from("applications").insert([a]).select();
    if (data) setApps(prev=>[data[0],...prev]);
    setNewApp({company:"",role:"",status:"Applied",feedback:""}); setAddingApp(false);
  };

  const stats = {
    total:apps.length,
    shortlisted:apps.filter(a=>["Shortlisted","Interview"].includes(a.status)).length,
    rejected:apps.filter(a=>a.status==="Rejected").length,
    rate:apps.length?Math.round(apps.filter(a=>["Shortlisted","Interview"].includes(a.status)).length/apps.length*100):0,
  };

  const TABS = ["🔥 Jobs","📊 Tracker","🛡️ Fake Check","⚙️ Resume","🎯 Interview"];

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Outfit',sans-serif"}}>
      <style>{css}</style>
      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"14px 20px",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:780,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontWeight:800,fontSize:20,background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>⚡ TakePlace</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:12,color:C.muted}}>Hey {name.split(" ")[0]} 👋</div>
            <Btn variant="ghost" onClick={onLogout} style={{padding:"6px 12px",fontSize:11}}>Logout</Btn>
          </div>
        </div>
      </div>

      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,position:"sticky",top:53,zIndex:99}}>
        <div style={{maxWidth:780,margin:"0 auto",display:"flex",overflowX:"auto"}}>
          {TABS.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)}
              style={{flex:1,minWidth:70,padding:"12px 6px",border:"none",background:"transparent",cursor:"pointer",color:tab===i?(i===4?C.purple:C.orange):C.muted,fontFamily:"'Outfit',sans-serif",fontWeight:tab===i?700:400,fontSize:11,borderBottom:`2px solid ${tab===i?(i===4?C.purple:C.orange):"transparent"}`,transition:"all 0.2s",whiteSpace:"nowrap"}}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:780,margin:"0 auto",padding:"20px 16px 60px"}}>

        {tab===0&&(
          <div>
            {/* Tailor Modal */}
            {tailorJob&&(
              <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:200,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px 16px",overflowY:"auto"}}>
                <div className="fade" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:24,width:"100%",maxWidth:700,marginTop:20,marginBottom:40}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:18,color:C.text}}>🧠 Resume Tailoring</div>
                      <div style={{color:C.muted,fontSize:12,marginTop:3}}>{tailorJob.title} at {tailorJob.company}</div>
                    </div>
                    <button onClick={()=>{setTailorJob(null);setTailorResult(null);setTailorErr("");}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:20,padding:4}}>✕</button>
                  </div>

                  {tailorErr&&<div style={{background:"#450a0a",border:"1px solid #7f1d1d",borderRadius:10,padding:"12px 16px",marginBottom:14,color:C.danger,fontSize:12}}>⚠ {tailorErr}</div>}

                  {!tailorResult&&!tailorLoading&&(
                    <Btn onClick={()=>runTailor(tailorJob)} disabled={!resume} style={{width:"100%",padding:"13px",fontSize:14}}>
                      {resume?"⚡ Tailor Resume for This Job":"⚠ No resume — go to Resume tab first"}
                    </Btn>
                  )}

                  {tailorLoading&&(
                    <div style={{textAlign:"center",padding:"30px 0"}}>
                      <Spin size={36}/><div style={{color:C.muted,fontSize:13,marginTop:10}}>AI optimizing your resume...</div>
                    </div>
                  )}

                  {tailorResult&&!tailorLoading&&(
                    <div className="fade">
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0a0e18",borderRadius:10,padding:"12px 16px",marginBottom:12}}>
                        <div style={{fontWeight:700,color:C.text,fontSize:14}}>Match Score</div>
                        <div style={{fontWeight:800,fontSize:28,color:tailorResult.matchScore>=70?C.green:tailorResult.matchScore>=50?C.warn:C.danger}}>{tailorResult.matchScore}%</div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                        <div style={{background:"#0a0e18",borderRadius:10,padding:14}}>
                          <div style={{color:C.danger,fontSize:10,fontFamily:"'DM Mono',monospace",marginBottom:8}}>MISSING</div>
                          {tailorResult.missing?.map((m,i)=><div key={i} style={{color:C.soft,fontSize:12,marginBottom:5}}>⚠ {m}</div>)}
                        </div>
                        <div style={{background:"#0a0e18",borderRadius:10,padding:14}}>
                          <div style={{color:C.green,fontSize:10,fontFamily:"'DM Mono',monospace",marginBottom:8}}>MATCHES</div>
                          {tailorResult.strong?.map((s,i)=><div key={i} style={{color:C.soft,fontSize:12,marginBottom:5}}>✓ {s}</div>)}
                        </div>
                      </div>
                      <div style={{background:"#0a0e18",borderRadius:10,padding:16,marginBottom:10}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                          <div style={{color:C.green,fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:700}}>⚡ TAILORED RESUME</div>
                          <Btn variant="ghost" onClick={()=>navigator.clipboard.writeText(tailorResult.atsResume||tailorResult.rewrittenResume||"")} style={{padding:"4px 10px",fontSize:10}}>📋 Copy</Btn>
                        </div>
                        <pre style={{whiteSpace:"pre-wrap",fontSize:11,color:C.soft,lineHeight:1.8,fontFamily:"'DM Mono',monospace",maxHeight:350,overflowY:"auto"}}>
                          {tailorResult.atsResume||tailorResult.rewrittenResume}
                        </pre>
                      </div>
                      <Btn variant="ghost" onClick={()=>{setTailorResult(null);setTailorErr("");}} style={{width:"100%",fontSize:12}}>🔄 Re-tailor</Btn>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <input style={inp} placeholder="Role (java developer...)" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
                <input style={inp} placeholder="City (hyderabad...)" value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
              </div>
              <Btn onClick={()=>fetchJobs()} style={{width:"100%"}}>🔍 Search Real Jobs</Btn>
            </div>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontWeight:800,fontSize:18,color:C.text}}>Live Job Feed</div>
              {!jobsLoading&&jobs.length>0&&(
                <div style={{display:"flex",alignItems:"center",gap:6,background:"#052e16",borderRadius:20,padding:"5px 12px"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/>
                  <span style={{color:C.green,fontSize:11,fontWeight:700}}>{jobs.length} real jobs</span>
                </div>
              )}
            </div>

            {jobsLoading&&<div style={{textAlign:"center",padding:"60px 20px"}}><Spin size={40}/><div style={{color:C.muted,fontSize:14,marginTop:12}}>Fetching real jobs...</div></div>}
            {jobsError&&<div style={{background:"#450a0a",border:"1px solid #7f1d1d",borderRadius:12,padding:20,color:C.danger,textAlign:"center",fontSize:13}}>{jobsError}</div>}

            {!jobsLoading&&jobs.map((job,i)=>{
              const isExpanded = expandedJob === job.id;
              return(
                <div key={job.id} className="fade hover" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px",marginBottom:12,borderLeft:`3px solid ${C.orange}`,animationDelay:`${i*0.04}s`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:15,color:C.text}}>{job.title}</div>
                      <div style={{color:C.soft,fontSize:12,marginTop:2}}>{job.company} · {job.location}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{color:C.green,fontWeight:700,fontSize:13}}>{job.salary}</div>
                      <div style={{color:C.muted,fontSize:10,marginTop:2}}>{job.posted}</div>
                    </div>
                  </div>
                  <div style={{color:C.muted,fontSize:12,lineHeight:1.6,marginBottom:10,background:"#0a0e18",borderRadius:8,padding:"8px 10px"}}>
                    {isExpanded?job.description:job.descriptionShort+(job.description.length>220?"...":"")}
                    {job.description.length>220&&(
                      <button onClick={()=>setExpandedJob(isExpanded?null:job.id)} style={{background:"none",border:"none",color:"#60a5fa",fontSize:11,cursor:"pointer",marginLeft:6}}>
                        {isExpanded?"Show less ▲":"Read more ▼"}
                      </button>
                    )}
                  </div>
                  <span style={{background:"#0c1a3a",color:"#60a5fa",fontSize:10,padding:"3px 8px",borderRadius:6,display:"inline-block",marginBottom:12}}>{job.category}</span>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <Btn onClick={()=>openJob(job)} style={{flex:1,fontSize:12}}>🔗 View Job</Btn>
                    <Btn variant="ghost" onClick={()=>markApply(job)} style={{fontSize:12}}>✅ Mark Applied</Btn>
                    <Btn variant="ghost" onClick={()=>{setTailorJob(job);setTailorResult(null);setTailorErr("");}} style={{fontSize:12}}>🧠 Tailor</Btn>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab===1&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
              {[["Applied",stats.total,"#60a5fa"],["Shortlisted",stats.shortlisted,C.green],["Rejected",stats.rejected,C.danger],["Rate",stats.rate+"%","#c084fc"]].map(([l,v,c])=>(
                <div key={l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 10px",textAlign:"center"}}>
                  <div style={{fontWeight:800,fontSize:24,color:c}}>{v}</div>
                  <div style={{color:C.muted,fontSize:11,marginTop:3}}>{l}</div>
                </div>
              ))}
            </div>
            {!addingApp?(
              <button onClick={()=>setAddingApp(true)} style={{width:"100%",padding:"11px",borderRadius:10,border:`1px dashed ${C.border}`,background:"transparent",color:C.muted,fontSize:13,cursor:"pointer",marginBottom:14}}>+ Add Application Manually</button>
            ):(
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:14}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <input placeholder="Company" value={newApp.company} onChange={e=>setNewApp(p=>({...p,company:e.target.value}))} style={inp}/>
                  <input placeholder="Role" value={newApp.role} onChange={e=>setNewApp(p=>({...p,role:e.target.value}))} style={inp}/>
                </div>
                <select value={newApp.status} onChange={e=>setNewApp(p=>({...p,status:e.target.value}))} style={{...inp,marginBottom:8}}>
                  {Object.keys(STATUS_C).map(s=><option key={s}>{s}</option>)}
                </select>
                <div style={{display:"flex",gap:8}}>
                  <Btn onClick={addManualApp} style={{flex:1}}>Add</Btn>
                  <Btn variant="ghost" onClick={()=>setAddingApp(false)} style={{padding:"10px 16px"}}>Cancel</Btn>
                </div>
              </div>
            )}
            {apps.length===0?(
              <div style={{textAlign:"center",padding:"60px 20px",color:C.muted}}>
                <div style={{fontSize:40,marginBottom:12}}>📭</div>
                <div style={{fontWeight:700,fontSize:18,color:C.soft}}>No applications yet</div>
                <div style={{fontSize:13,marginTop:6}}>Click "✅ Mark Applied" on any job to track it here</div>
              </div>
            ):apps.map(app=>(
              <div key={app.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <div style={{fontWeight:700,color:C.text,fontSize:15}}>{app.company}</div>
                    <div style={{color:C.muted,fontSize:12,marginTop:2}}>{app.role} · {new Date(app.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
                  </div>
                  <select value={app.status} onChange={e=>updateStatus(app.id,e.target.value)}
                    style={{background:STATUS_C[app.status]?.[0]||C.card,color:STATUS_C[app.status]?.[1]||C.soft,border:"none",borderRadius:20,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",outline:"none",fontFamily:"'Outfit',sans-serif"}}>
                    {Object.keys(STATUS_C).map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                {app.feedback&&<div style={{background:"#0a0e18",borderRadius:8,padding:"8px 10px",fontSize:12,color:C.soft,marginBottom:8}}>💬 {app.feedback}</div>}
                {app.job_url&&<a href={app.job_url} target="_blank" rel="noreferrer" style={{fontSize:11,color:"#60a5fa",display:"block",marginBottom:8,textDecoration:"none"}}>🔗 View original job</a>}
                {feedback.id===app.id?(
                  <div style={{display:"flex",gap:8}}>
                    <input placeholder="Add notes..." value={feedback.text} onChange={e=>setFeedback(p=>({...p,text:e.target.value}))} style={{...inp,flex:1}}/>
                    <Btn onClick={saveFeedback} style={{padding:"8px 14px",fontSize:12}}>Save</Btn>
                  </div>
                ):(
                  <Btn variant="ghost" onClick={()=>setFeedback({id:app.id,text:app.feedback||""})} style={{padding:"6px 12px",fontSize:11}}>
                    {app.feedback?"✏️ Edit notes":"+ Add feedback"}
                  </Btn>
                )}
              </div>
            ))}
          </div>
        )}

        {tab===2&&(
          <div>
            <div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:4}}>🛡️ Fake Job Detector</div>
            <div style={{color:C.muted,fontSize:13,marginBottom:20}}>Paste any job URL or description. AI checks if it's real or a scam.</div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <textarea placeholder="Paste job URL or full description here..." value={fakeJob.text} onChange={e=>setFakeJob(p=>({...p,text:e.target.value}))}
                style={{...inp,minHeight:130,resize:"vertical",marginBottom:12}}/>
              <Btn onClick={checkFakeJob} disabled={!fakeJob.text||fakeJob.loading} style={{width:"100%"}}>
                {fakeJob.loading?<><Spin size={14}/> Analyzing...</>:"🛡️ Check This Job"}
              </Btn>
            </div>
            {fakeJob.result&&!fakeJob.loading&&(
              <div className="fade" style={{background:C.card,border:`2px solid ${fakeJob.result.trustScore>=70?"#14532d":fakeJob.result.trustScore>=40?"#451a03":"#450a0a"}`,borderRadius:14,padding:24}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div style={{fontWeight:800,fontSize:18,color:C.text}}>Trust Analysis</div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontWeight:800,fontSize:48,color:fakeJob.result.trustScore>=70?C.green:fakeJob.result.trustScore>=40?C.warn:C.danger,lineHeight:1}}>{fakeJob.result.trustScore}</div>
                    <div style={{fontSize:10,color:C.muted}}>Trust Score</div>
                  </div>
                </div>
                <div style={{display:"inline-block",padding:"8px 20px",borderRadius:20,marginBottom:16,fontWeight:800,fontSize:14,background:fakeJob.result.verdict==="SAFE"?"#052e16":fakeJob.result.verdict==="RISKY"?"#451a03":"#450a0a",color:fakeJob.result.verdict==="SAFE"?C.green:fakeJob.result.verdict==="RISKY"?C.warn:C.danger}}>
                  {fakeJob.result.verdict==="SAFE"?"✅ LIKELY SAFE":fakeJob.result.verdict==="RISKY"?"⚠️ RISKY":"🚨 LIKELY FAKE"}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                  <div style={{background:"#0a0e18",borderRadius:10,padding:14}}>
                    <div style={{color:C.danger,fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:8}}>RED FLAGS</div>
                    {fakeJob.result.redFlags?.map((f,i)=><div key={i} style={{color:C.soft,fontSize:12,marginBottom:5}}>🚩 {f}</div>)}
                  </div>
                  <div style={{background:"#0a0e18",borderRadius:10,padding:14}}>
                    <div style={{color:C.green,fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:8}}>GREEN FLAGS</div>
                    {fakeJob.result.greenFlags?.map((f,i)=><div key={i} style={{color:C.soft,fontSize:12,marginBottom:5}}>✅ {f}</div>)}
                  </div>
                </div>
                <div style={{background:"#0a0e18",borderRadius:10,padding:14,color:C.soft,fontSize:13,lineHeight:1.7}}>💡 {fakeJob.result.advice}</div>
              </div>
            )}
          </div>
        )}

        {tab===3&&(
          <div>
            <div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:4}}>Your Resume Intelligence</div>
            <div style={{color:C.muted,fontSize:13,marginBottom:20}}>AI analysis of your resume</div>
            {resume&&(
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontWeight:700,color:C.text,fontSize:15}}>📄 Your Resume</div>
                  <Btn variant="ghost" onClick={()=>navigator.clipboard.writeText(resume)} style={{padding:"5px 12px",fontSize:11}}>📋 Copy</Btn>
                </div>
                <pre style={{whiteSpace:"pre-wrap",fontSize:11,color:C.soft,lineHeight:1.8,fontFamily:"'DM Mono',monospace",maxHeight:280,overflowY:"auto",background:"#0a0e18",borderRadius:8,padding:"12px 14px"}}>{resume}</pre>
              </div>
            )}
            {analysis?.projects?.length>0&&(
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:16}}>
                <div style={{fontWeight:700,color:C.text,marginBottom:14,fontSize:16}}>Project Rankings</div>
                {analysis.projects.map((p,i)=>(
                  <div key={i} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:13,color:C.text,fontWeight:600}}>{p.name}</span>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <span style={{fontSize:14,fontWeight:800,color:p.score>=80?C.green:p.score>=60?C.warn:C.danger}}>{p.score}/100</span>
                        <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:p.keep?"#052e16":"#1c1917",color:p.keep?C.green:C.muted}}>{p.keep?"✓ Keep":"Remove"}</span>
                      </div>
                    </div>
                    <div style={{background:"#0a0e18",borderRadius:4,height:6,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${p.score}%`,background:p.score>=80?`linear-gradient(90deg,${C.green},#22c55e)`:p.score>=60?`linear-gradient(90deg,${C.warn},#f59e0b)`:C.danger,borderRadius:4}}/>
                    </div>
                    <div style={{color:C.muted,fontSize:11,marginTop:4}}>{p.reason}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
                <div style={{color:C.green,fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:8}}>STRENGTHS</div>
                {analysis?.strengths?.map((s,i)=><div key={i} style={{color:C.soft,fontSize:12,marginBottom:5}}>✓ {s}</div>)}
              </div>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
                <div style={{color:C.danger,fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:8}}>IMPROVE</div>
                {analysis?.weaknesses?.map((s,i)=><div key={i} style={{color:C.soft,fontSize:12,marginBottom:5}}>→ {s}</div>)}
              </div>
            </div>
            {analysis?.skills?.length>0&&(
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
                <div style={{color:"#60a5fa",fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:10}}>DETECTED SKILLS</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {analysis.skills.map((s,i)=><span key={i} style={{background:"#0a0e18",color:C.soft,fontSize:11,padding:"4px 10px",borderRadius:8,fontFamily:"'DM Mono',monospace"}}>{s}</span>)}
                </div>
              </div>
            )}
          </div>
        )}

        {tab===4&&<InterviewPrep resume={resume} analysis={analysis}/>}

      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user||null);
      if (session?.user) loadProfile(session.user);
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_,session)=>{
      setUser(session?.user||null);
      if (session?.user) loadProfile(session.user);
    });
  },[]);

  const loadProfile = async (u) => {
    const {data} = await supabase.from("profiles").select("*").eq("id",u.id).single();
    if (data?.resume_text) { setResume(data.resume_text); setAnalysis(data.analysis); setOnboarded(true); }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null); setOnboarded(false); setResume(null); setAnalysis(null);
  };

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#07080f",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{css}</style>
      <div style={{textAlign:"center"}}>
        <span className="spin" style={{fontSize:48,color:"#FF5C1A",display:"inline-block"}}>⚡</span>
        <div style={{color:"#4b5563",fontSize:14,marginTop:16,fontFamily:"'Outfit',sans-serif"}}>Loading TakePlace...</div>
      </div>
    </div>
  );

  if (!user) return <AuthPage onLogin={setUser}/>;
  if (!onboarded) return <OnboardPage user={user} onDone={(r,a)=>{setResume(r);setAnalysis(a);setOnboarded(true);}}/>;
  return <MainApp user={user} resume={resume} analysis={analysis} onLogout={logout}/>;
}
