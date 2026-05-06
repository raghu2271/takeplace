import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const C = {
  bg:"#07080f",card:"#0d1117",border:"#1a2030",
  orange:"#FF5C1A",orangeLight:"#FF8A5B",
  green:"#1DDB8B",text:"#e2e8f0",muted:"#4b5563",soft:"#94a3b8",
  danger:"#f87171",warn:"#fbbf24",purple:"#a78bfa",
};

const css=`
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@600;700&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.bg};}
  ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#1e293b;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  .fade{animation:fadeUp 0.5s ease forwards;}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  .float{animation:float 3s ease-in-out infinite;}
  .card-hover{transition:all 0.2s;}.card-hover:hover{transform:translateY(-3px);border-color:#2a2a4a!important;}
  .pulse-dot{animation:pulse 1.5s infinite;}
  textarea:focus,input:focus{border-color:${C.orange}55!important;box-shadow:0 0 0 3px ${C.orange}11!important;}
  .timer-urgent{animation:pulse 0.8s infinite;}
`;

const inp={width:"100%",background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:13,fontFamily:"'Outfit',sans-serif",outline:"none",transition:"all 0.2s"};
const btn=(v="primary",e={})=>({padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,transition:"all 0.2s",...(v==="primary"?{background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,color:"#07080f"}:v==="purple"?{background:`linear-gradient(135deg,#7c3aed,${C.purple})`,color:"#fff"}:v==="ghost"?{background:"transparent",color:C.soft,border:`1px solid ${C.border}`}:{background:C.card,color:C.soft,border:`1px solid ${C.border}`}),...e});

const ROLES=[
  {id:"swe",label:"Software Engineer",icon:"💻"},{id:"frontend",label:"Frontend Developer",icon:"🎨"},
  {id:"backend",label:"Backend Developer",icon:"⚙️"},{id:"fullstack",label:"Full Stack Developer",icon:"🔥"},
  {id:"java",label:"Java Developer",icon:"☕"},{id:"python",label:"Python Developer",icon:"🐍"},
  {id:"devops",label:"DevOps / Cloud Engineer",icon:"☁️"},{id:"data",label:"Data Engineer",icon:"📊"},
  {id:"mobile",label:"Mobile Developer",icon:"📱"},{id:"ml",label:"ML / AI Engineer",icon:"🧠"},
];
const DURATIONS=[{mins:10,label:"Quick (10 min)",qs:6},{mins:20,label:"Standard (20 min)",qs:12},{mins:30,label:"Deep Dive (30 min)",qs:18}];
const STATUS_C={"Applied":["#1e3a5f","#60a5fa"],"Shortlisted":["#14532d","#4ade80"],"Rejected":["#450a0a","#f87171"],"No Response":["#1c1917","#a8a29e"],"Interview":["#3b0764","#c084fc"]};

// ─── INTERVIEW PREP ───────────────────────────────────────────────────────
function InterviewPrep({resume,analysis}){
  const [phase,setPhase]=useState("setup");
  const [role,setRole]=useState(null);
  const [dur,setDur]=useState(DURATIONS[1]);
  const [resumeText,setResumeText]=useState(resume||"");
  const [questions,setQuestions]=useState([]);
  const [curQ,setCurQ]=useState(0);
  const [answers,setAnswers]=useState({});
  const [timeLeft,setTimeLeft]=useState(0);
  const [totalTime,setTotalTime]=useState(0);
  const [result,setResult]=useState(null);
  const [resultLoading,setResultLoading]=useState(false);
  const [followUp,setFollowUp]=useState("");
  const [followUpAns,setFollowUpAns]=useState("");
  const [followUpLoading,setFollowUpLoading]=useState(false);
  const [followUpResult,setFollowUpResult]=useState("");
  const timerRef=useRef(null);
  const textRef=useRef(null);

  const fmt=s=>`${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;

  const generate=async()=>{
    if(!role||!resumeText.trim())return;
    setPhase("loading");
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1600,messages:[{role:"user",content:`You are a senior technical interviewer. Generate exactly ${dur.qs} interview questions for "${role.label}".

Analyze this resume and tailor questions to their SPECIFIC projects, skills, experience:
${resumeText.slice(0,3000)}

Rules:
- 40% technical, 30% behavioral, 20% project-specific (reference their actual projects), 10% system design
- Reference ACTUAL projects and skills from resume by name
- Last question MUST be exactly: "Do you have any questions for us?"
- Vary difficulty: medium → hard → medium
- Be specific, not generic

Return ONLY valid JSON array (no markdown, no extra text):
[{"id":0,"type":"technical","question":"...","hint":"key points to cover","difficulty":"medium"}]`}]})});
      const data=await res.json();
      const raw=data.content?.map(c=>c.text||"").join("")||"[]";
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      setQuestions(parsed);
      const secs=dur.mins*60;
      setTimeLeft(secs);setTotalTime(secs);setCurQ(0);setAnswers({});
      setPhase("active");
      if(timerRef.current)clearInterval(timerRef.current);
      let rem=secs;
      timerRef.current=setInterval(()=>{rem--;setTimeLeft(rem);if(rem<=0){clearInterval(timerRef.current);doFinish({});}},1000);
    }catch(e){setPhase("setup");alert("Failed to generate questions. Please try again.");}
  };

  const doFinish=useCallback((ans)=>{
    if(timerRef.current)clearInterval(timerRef.current);
    setPhase("result");setResultLoading(true);
    setAnswers(prev=>{
      const finalAns=Object.keys(ans).length>0?ans:prev;
      evaluate(finalAns);
      return finalAns;
    });
  },[questions,role,resumeText]);

  const finishNow=()=>{
    if(timerRef.current)clearInterval(timerRef.current);
    setPhase("result");setResultLoading(true);
    evaluate(answers);
  };

  const evaluate=async(ans)=>{
    const qa=questions.map((q,i)=>({q:q.question,a:ans[i]||"(no answer)",type:q.type,diff:q.difficulty}));
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2500,messages:[{role:"user",content:`You are a senior interviewer evaluating a "${role?.label}" candidate.

Resume:
${resumeText.slice(0,1500)}

Interview Q&A:
${qa.map((x,i)=>`Q${i+1} [${x.type}/${x.diff}]: ${x.q}\nAnswer: ${x.a}`).join("\n\n")}

Evaluate all answers thoroughly. Return ONLY valid JSON (no markdown):
{"overallScore":72,"verdict":"Strong Candidate","hireProbability":65,"summary":"2-3 sentence overall impression","questionResults":[{"id":0,"score":75,"feedback":"specific feedback on their answer","modelAnswer":"what a great answer includes","missed":"key points they skipped"}],"strengths":["specific strength from their answers"],"improvements":["specific improvement area"],"resumeOptimizations":["change to make to resume based on answers"],"nextSteps":"actionable advice"}`}]})});
      const data=await res.json();
      const raw=data.content?.map(c=>c.text||"").join("")||"{}";
      setResult(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    }catch{setResult({overallScore:70,verdict:"Evaluation Complete",hireProbability:60,summary:"Interview completed. Review your answers below.",questionResults:[],strengths:[],improvements:[],resumeOptimizations:[],nextSteps:"Keep practicing!"});}
    setResultLoading(false);
  };

  const askFollowUp=async()=>{
    if(!followUp.trim())return;
    setFollowUpLoading(true);setFollowUpResult("");
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,messages:[{role:"user",content:`You are a friendly senior interviewer. The candidate just finished a "${role?.label}" interview and asks: "${followUp}"\nTheir specific answer (if any): "${followUpAns}"\nResume context: ${resumeText.slice(0,400)}\nAnswer helpfully, directly, constructively. Max 4 sentences.`}]})});
      const data=await res.json();
      setFollowUpResult(data.content?.map(c=>c.text||"").join("")||"");
    }catch{setFollowUpResult("Could not get response. Try again.");}
    setFollowUpLoading(false);
  };

  const saveAns=val=>setAnswers(p=>({...p,[curQ]:val}));
  const timerPct=totalTime>0?(timeLeft/totalTime)*100:100;
  const isUrgent=timeLeft<60&&phase==="active";
  const DIFF_C={easy:C.green,medium:C.warn,hard:C.danger};
  const TYPE_C={technical:"#60a5fa",behavioral:C.purple,"project-deep-dive":C.orange,"system-design":C.green};

  if(phase==="setup")return(
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:22,color:C.text,marginBottom:4}}>🎯 AI Interview Simulator</div>
        <div style={{color:C.muted,fontSize:13}}>Real interview experience. AI tailors every question from your resume. Get scored like a pro recruiter would.</div>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{color:C.text,fontWeight:600,fontSize:14}}>📄 Your Resume</div>
          {resumeText&&<span style={{background:"#052e16",color:C.green,fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700}}>✓ Loaded</span>}
        </div>
        <textarea value={resumeText} onChange={e=>setResumeText(e.target.value)}
          placeholder="Paste your resume here — AI will generate questions specific to YOUR projects and skills..."
          style={{...inp,minHeight:110,resize:"vertical",lineHeight:1.6}}/>
        {!resumeText&&<div style={{color:C.warn,fontSize:11,marginTop:6}}>⚠ Add your resume for personalized project-specific questions</div>}
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:16}}>
        <div style={{color:C.text,fontWeight:600,fontSize:14,marginBottom:14}}>🎭 Select Your Target Role</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {ROLES.map(r=>(
            <button key={r.id} onClick={()=>setRole(r)} style={{padding:"12px 14px",borderRadius:10,border:`1px solid ${role?.id===r.id?C.purple:C.border}`,background:role?.id===r.id?`${C.purple}15`:"#0a0e18",color:role?.id===r.id?C.purple:C.soft,cursor:"pointer",textAlign:"left",fontFamily:"'Outfit',sans-serif",fontWeight:role?.id===r.id?700:400,fontSize:12,transition:"all 0.2s"}}>
              <span style={{marginRight:8,fontSize:15}}>{r.icon}</span>{r.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:20}}>
        <div style={{color:C.text,fontWeight:600,fontSize:14,marginBottom:14}}>⏱ Interview Duration</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {DURATIONS.map(d=>(
            <button key={d.mins} onClick={()=>setDur(d)} style={{padding:"14px 10px",borderRadius:10,border:`1px solid ${dur.mins===d.mins?C.orange:C.border}`,background:dur.mins===d.mins?`${C.orange}15`:"#0a0e18",color:dur.mins===d.mins?C.orange:C.soft,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:dur.mins===d.mins?700:400,fontSize:12,transition:"all 0.2s",textAlign:"center"}}>
              <div style={{fontSize:20,marginBottom:4}}>{d.mins===10?"⚡":d.mins===20?"🎯":"🔥"}</div>
              <div>{d.label}</div>
              <div style={{fontSize:10,color:C.muted,marginTop:2}}>{d.qs} questions</div>
            </button>
          ))}
        </div>
      </div>

      <button onClick={generate} disabled={!role||!resumeText.trim()} style={{...btn("purple",{width:"100%",padding:"15px",fontSize:15,opacity:(!role||!resumeText.trim())?0.5:1})}}>
        🚀 Start Interview — {role?role.label:"Select a role first"}
      </button>
      {(!role||!resumeText.trim())&&<div style={{color:C.muted,fontSize:12,textAlign:"center",marginTop:8}}>{!resumeText.trim()?"Paste your resume above":"Select a role to begin"}</div>}
    </div>
  );

  if(phase==="loading")return(
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:64,marginBottom:20,animation:"float 2s ease-in-out infinite"}}>🤖</div>
      <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:22,color:C.text,marginBottom:12}}>Preparing Your Interview</div>
      <div style={{color:C.muted,fontSize:14,marginBottom:24}}>AI is reading your resume and crafting tailored questions for <span style={{color:C.purple}}>{role?.label}</span></div>
      {["Analyzing your projects...","Identifying your skills...","Crafting technical questions...","Preparing behavioral scenarios..."].map((s,i)=>(
        <div key={i} className="fade" style={{display:"flex",alignItems:"center",gap:10,background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",marginBottom:8,maxWidth:320,margin:"0 auto 8px",animationDelay:`${i*0.3}s`,opacity:0}}>
          <span className="spin" style={{color:C.purple,fontSize:14}}>◌</span>
          <span style={{color:C.soft,fontSize:12}}>{s}</span>
        </div>
      ))}
    </div>
  );

  if(phase==="active"&&questions.length>0){
    const q=questions[curQ];
    const isLast=curQ===questions.length-1;
    return(
      <div>
        {/* Header */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 18px",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{background:`${C.purple}20`,color:C.purple,borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700}}>{role?.icon} {role?.label}</span>
              <span style={{color:C.muted,fontSize:12}}>Q {curQ+1}/{questions.length}</span>
            </div>
            <div className={isUrgent?"timer-urgent":""} style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:22,color:isUrgent?C.danger:timeLeft<180?C.warn:C.green}}>
              {fmt(timeLeft)}
            </div>
          </div>
          <div style={{background:"#0a0e18",borderRadius:4,height:5,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${timerPct}%`,background:timerPct>50?C.green:timerPct>20?C.warn:C.danger,transition:"width 1s linear, background 1s"}}/>
          </div>
          <div style={{display:"flex",gap:5,marginTop:10,flexWrap:"wrap"}}>
            {questions.map((_,i)=>(
              <button key={i} onClick={()=>setCurQ(i)} style={{width:24,height:24,borderRadius:"50%",border:`2px solid ${i===curQ?C.purple:answers[i]?C.green:C.border}`,background:i===curQ?`${C.purple}30`:answers[i]?`${C.green}20`:"#0a0e18",cursor:"pointer",fontSize:9,color:i===curQ?C.purple:answers[i]?C.green:C.muted,fontWeight:700,transition:"all 0.2s"}}>
                {i+1}
              </button>
            ))}
          </div>
        </div>

        {/* Question */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.purple}`,borderRadius:14,padding:24,marginBottom:16}}>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            <span style={{background:`${TYPE_C[q?.type]||"#60a5fa"}20`,color:TYPE_C[q?.type]||"#60a5fa",fontSize:10,padding:"4px 10px",borderRadius:20,fontFamily:"'DM Mono',monospace",fontWeight:700}}>
              {q?.type?.toUpperCase().replace(/-/g," ")}
            </span>
            <span style={{background:`${DIFF_C[q?.difficulty]||C.warn}20`,color:DIFF_C[q?.difficulty]||C.warn,fontSize:10,padding:"4px 10px",borderRadius:20,fontFamily:"'DM Mono',monospace",fontWeight:700}}>
              {q?.difficulty?.toUpperCase()}
            </span>
            {isLast&&<span style={{background:`${C.orange}20`,color:C.orange,fontSize:10,padding:"4px 10px",borderRadius:20,fontWeight:700}}>FINAL QUESTION</span>}
          </div>

          <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:18,color:C.text,lineHeight:1.5,marginBottom:16}}>{q?.question}</div>

          {q?.hint&&(
            <div style={{background:"#0a0e18",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",marginBottom:16}}>
              <div style={{color:C.muted,fontSize:10,fontFamily:"'DM Mono',monospace",marginBottom:4}}>💡 HINT — COVER THESE POINTS</div>
              <div style={{color:C.soft,fontSize:12,lineHeight:1.6}}>{q?.hint}</div>
            </div>
          )}

          <textarea
            ref={textRef}
            key={curQ}
            defaultValue={answers[curQ]||""}
            onChange={e=>saveAns(e.target.value)}
            placeholder={isLast?"Type your question(s) for the interviewer here...":"Type your answer — be specific, mention your real experience, projects, and metrics..."}
            style={{...inp,minHeight:140,resize:"vertical",lineHeight:1.7}}
          />

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14}}>
            <button onClick={()=>setCurQ(c=>c-1)} disabled={curQ===0} style={{...btn("ghost",{opacity:curQ===0?0.3:1,padding:"9px 16px",fontSize:12})}}>← Prev</button>
            <div style={{color:C.muted,fontSize:11}}>{Object.keys(answers).length} of {questions.length} answered</div>
            <button onClick={()=>{if(isLast)finishNow();else setCurQ(c=>c+1);}} style={{...btn(isLast?"primary":"purple",{padding:"9px 20px",fontSize:12})}}>
              {isLast?"Submit Interview 🎯":"Next →"}
            </button>
          </div>
        </div>

        <button onClick={finishNow} style={{...btn("ghost",{width:"100%",fontSize:12,color:C.danger,borderColor:"#450a0a"})}}>End Interview Early</button>
      </div>
    );
  }

  if(phase==="result")return(
    <div className="fade">
      {resultLoading?(
        <div style={{textAlign:"center",padding:"80px 20px"}}>
          <div style={{fontSize:64,marginBottom:20,animation:"float 2s ease-in-out infinite"}}>📊</div>
          <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:22,color:C.text,marginBottom:8}}>Evaluating Your Interview</div>
          <div style={{color:C.muted,fontSize:14}}>AI is scoring every answer and preparing detailed feedback...</div>
          <span className="spin" style={{fontSize:36,color:C.purple,display:"block",marginTop:20}}>◌</span>
        </div>
      ):result?(
        <div>
          {/* Score Header */}
          <div style={{background:`linear-gradient(135deg,${C.purple}20,${C.orange}10)`,border:`1px solid ${C.purple}40`,borderRadius:14,padding:24,marginBottom:16,textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:10}}>🎉</div>
            <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:24,color:C.text,marginBottom:6}}>Interview Complete!</div>
            <div style={{color:C.soft,fontSize:14,marginBottom:20}}>Thank you for your time. Here's your full performance report.</div>
            <div style={{display:"flex",justifyContent:"center",gap:24,marginBottom:16}}>
              <div>
                <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:52,fontWeight:700,color:result.overallScore>=75?C.green:result.overallScore>=55?C.warn:C.danger}}>{result.overallScore}</div>
                <div style={{color:C.muted,fontSize:11}}>Overall Score</div>
              </div>
              <div style={{width:1,background:C.border}}/>
              <div>
                <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:52,fontWeight:700,color:C.purple}}>{result.hireProbability}%</div>
                <div style={{color:C.muted,fontSize:11}}>Hire Probability</div>
              </div>
            </div>
            <div style={{display:"inline-block",padding:"8px 20px",borderRadius:20,background:result.overallScore>=75?"#052e16":result.overallScore>=55?"#451a03":"#450a0a",color:result.overallScore>=75?C.green:result.overallScore>=55?C.warn:C.danger,fontWeight:800,fontSize:14}}>{result.verdict}</div>
          </div>

          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
            <div style={{color:C.soft,fontSize:13,lineHeight:1.8}}>💬 {result.summary}</div>
          </div>

          {/* Strengths + Improvements */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
              <div style={{color:C.green,fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:10}}>✦ WHAT YOU DID WELL</div>
              {result.strengths?.map((s,i)=><div key={i} style={{color:C.soft,fontSize:12,marginBottom:7,display:"flex",gap:6}}><span style={{color:C.green,flexShrink:0}}>✓</span>{s}</div>)}
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
              <div style={{color:C.danger,fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:10}}>⚡ IMPROVE</div>
              {result.improvements?.map((s,i)=><div key={i} style={{color:C.soft,fontSize:12,marginBottom:7,display:"flex",gap:6}}><span style={{color:C.warn,flexShrink:0}}>→</span>{s}</div>)}
            </div>
          </div>

          {/* Q&A Breakdown */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:14}}>
            <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,color:C.text,fontSize:16,marginBottom:16}}>📋 Answer-by-Answer Breakdown</div>
            {result.questionResults?.map((qr,i)=>{
              const q=questions[qr.id]||questions[i];
              const score=qr.score||70;
              return(
                <div key={i} style={{marginBottom:14,background:"#0a0e18",borderRadius:10,padding:14,border:`1px solid ${score>=75?"#14532d":score>=55?"#451a03":"#450a0a"}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{color:C.text,fontSize:12,fontWeight:600,flex:1,marginRight:10}}>Q{i+1}: {q?.question}</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:18,color:score>=75?C.green:score>=55?C.warn:C.danger,flexShrink:0}}>{score}</div>
                  </div>
                  {answers[i]&&(
                    <div style={{marginBottom:8}}>
                      <div style={{color:C.muted,fontSize:10,fontFamily:"'DM Mono',monospace",marginBottom:4}}>YOUR ANSWER</div>
                      <div style={{color:C.soft,fontSize:12,lineHeight:1.6,background:"#07080f",borderRadius:6,padding:"8px 10px"}}>{answers[i]}</div>
                    </div>
                  )}
                  <div style={{color:C.soft,fontSize:12,lineHeight:1.6,marginBottom:6}}>
                    <span style={{color:C.warn,fontWeight:700}}>Feedback: </span>{qr.feedback}
                  </div>
                  {qr.missed&&<div style={{color:C.muted,fontSize:11,marginBottom:8}}><span style={{color:C.danger}}>Missed: </span>{qr.missed}</div>}
                  <details style={{marginTop:4}}>
                    <summary style={{color:C.purple,fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:700}}>▸ SEE IDEAL ANSWER</summary>
                    <div style={{color:C.soft,fontSize:12,lineHeight:1.7,marginTop:8,background:`${C.purple}10`,border:`1px solid ${C.purple}30`,borderRadius:6,padding:"10px 12px"}}>{qr.modelAnswer}</div>
                  </details>
                </div>
              );
            })}
          </div>

          {/* Resume Optimizations */}
          {result.resumeOptimizations?.length>0&&(
            <div style={{background:C.card,border:`1px solid ${C.orange}40`,borderRadius:12,padding:18,marginBottom:14}}>
              <div style={{color:C.orange,fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:10}}>⚡ RESUME CHANGES BASED ON YOUR ANSWERS</div>
              {result.resumeOptimizations.map((s,i)=><div key={i} style={{color:C.soft,fontSize:12,marginBottom:7,display:"flex",gap:6}}><span style={{color:C.orange,flexShrink:0}}>→</span>{s}</div>)}
            </div>
          )}

          {/* Next Steps */}
          <div style={{background:`${C.green}10`,border:`1px solid ${C.green}30`,borderRadius:12,padding:18,marginBottom:20}}>
            <div style={{color:C.green,fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:8}}>🚀 NEXT STEPS</div>
            <div style={{color:C.soft,fontSize:13,lineHeight:1.7}}>{result.nextSteps}</div>
          </div>

          {/* Ask Follow-up */}
          <div style={{background:C.card,border:`1px solid ${C.purple}40`,borderRadius:14,padding:20,marginBottom:20}}>
            <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,color:C.text,fontSize:15,marginBottom:4}}>💬 Ask the Interviewer Anything</div>
            <div style={{color:C.muted,fontSize:12,marginBottom:14}}>Still curious? Ask your interviewer a follow-up question about any answer or topic.</div>
            <input value={followUp} onChange={e=>setFollowUp(e.target.value)} placeholder="e.g. How could I have answered Q3 better? What should I learn next?" style={{...inp,marginBottom:8}}/>
            <textarea value={followUpAns} onChange={e=>setFollowUpAns(e.target.value)} placeholder="(Optional) Paste the specific answer you gave that you want feedback on..." style={{...inp,minHeight:60,resize:"vertical",marginBottom:10}}/>
            <button onClick={askFollowUp} disabled={!followUp.trim()||followUpLoading} style={{...btn("purple",{width:"100%",opacity:!followUp.trim()?0.5:1})}}>
              {followUpLoading?<><span className="spin">◌</span> Getting response...</>:"Ask Interviewer →"}
            </button>
            {followUpResult&&(
              <div className="fade" style={{marginTop:14,background:`${C.purple}10`,border:`1px solid ${C.purple}30`,borderRadius:10,padding:16}}>
                <div style={{color:C.purple,fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:8}}>INTERVIEWER SAYS</div>
                <div style={{color:C.soft,fontSize:13,lineHeight:1.8}}>{followUpResult}</div>
              </div>
            )}
          </div>

          <button onClick={()=>{setPhase("setup");setResult(null);setQuestions([]);setAnswers({});setFollowUp("");setFollowUpResult("");}} style={{...btn("primary",{width:"100%",padding:"13px",fontSize:14})}}>
            🔄 Practice Again
          </button>
        </div>
      ):null}
    </div>
  );

  return null;
}

// ─── AUTH PAGE ─────────────────────────────────────────────────────────────
function AuthPage({onLogin}){
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState("");

  const handle=async()=>{
    setErr("");setLoading(true);setMsg("");
    try{
      if(mode==="register"){
        if(!form.name||!form.email||!form.password){setErr("All fields required");setLoading(false);return;}
        const{data,error}=await supabase.auth.signUp({email:form.email,password:form.password,options:{data:{full_name:form.name}}});
        if(error)throw error;
        setMsg("✅ Account created! Please check your email to confirm, then sign in.");
        setMode("login");
      }else{
        const{data,error}=await supabase.auth.signInWithPassword({email:form.email,password:form.password});
        if(error)throw error;
        onLogin(data.user);
      }
    }catch(e){setErr(e.message||"Something went wrong");}
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <style>{css}</style>
      {[["10%","20%","#FF5C1A"],["80%","70%","#1DDB8B"]].map(([l,t,c],i)=>(
        <div key={i} style={{position:"absolute",left:l,top:t,width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${c}12,transparent 70%)`,pointerEvents:"none"}}/>
      ))}
      <div className="fade" style={{width:"100%",maxWidth:420,background:C.card,border:`1px solid ${C.border}`,borderRadius:24,padding:40,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div className="float" style={{fontSize:44,marginBottom:8}}>⚡</div>
          <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:30,background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,backgroundSize:"200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradShift 3s ease infinite"}}>TakePlace</div>
          <div style={{color:C.muted,fontSize:12,marginTop:4,fontFamily:"'Outfit',sans-serif"}}>It's your time. TakePlace.</div>
        </div>
        <div style={{display:"flex",background:"#0a0e18",borderRadius:12,padding:4,marginBottom:24}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}} style={{flex:1,padding:"10px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:13,transition:"all 0.2s",background:mode===m?C.border:"transparent",color:mode===m?C.text:C.muted}}>
              {m==="login"?"Sign In":"Register"}
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {mode==="register"&&<input style={inp} placeholder="Your full name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>}
          <input style={inp} placeholder="Email address" type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
          <input style={inp} placeholder="Password" type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        </div>
        {err&&<div style={{color:C.danger,fontSize:12,marginTop:10}}>{err}</div>}
        {msg&&<div style={{color:C.green,fontSize:12,marginTop:10}}>{msg}</div>}
        <button onClick={handle} disabled={loading} style={{...btn("primary",{width:"100%",marginTop:20,padding:"13px",fontSize:14})}}>
          {loading?<span className="spin">⟳</span>:mode==="login"?"Sign In →":"Create Account →"}
        </button>
      </div>
    </div>
  );
}

// ─── ONBOARD PAGE ──────────────────────────────────────────────────────────
function OnboardPage({user,onDone}){
  const [step,setStep]=useState(1);
  const [resume,setResume]=useState("");
  const [analyzing,setAnalyzing]=useState(false);
  const [analysis,setAnalysis]=useState(null);
  const [saving,setSaving]=useState(false);
  const fileRef=useRef();
  const name=user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";

  const analyzeResume=async(text)=>{
    setAnalyzing(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Analyze this resume. Return ONLY valid JSON (no markdown):\n{"projects":[{"name":"...","score":85,"reason":"...","keep":true}],"skills":["Java","Spring Boot"],"strengths":["..."],"weaknesses":["..."],"overallScore":72}\nScore each project 0-100 for recruiter impression. keep:true for top 2 only.\nResume: ${text.slice(0,2000)}`}]})});
      const data=await res.json();
      const raw=data.content?.map(c=>c.text||"").join("")||"{}";
      setAnalysis(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    }catch(e){setAnalysis({projects:[],skills:[],strengths:[],weaknesses:[],overallScore:70});}
    setAnalyzing(false);
  };

  const proceed=async()=>{
    setSaving(true);
    try{await supabase.from("profiles").upsert({id:user.id,full_name:name,email:user.email,resume_text:resume,analysis:analysis,updated_at:new Date().toISOString()});}catch(e){}
    setSaving(false);
    onDone(resume,analysis);
  };

  const handleFile=(e)=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{const t=ev.target.result;setResume(t);analyzeResume(t);};
    reader.readAsText(file);
  };

  if(step===1)return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{css}</style>
      <div className="fade" style={{textAlign:"center",maxWidth:520}}>
        <div style={{fontSize:72,marginBottom:16}}>👋</div>
        <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:28,color:C.text,marginBottom:8}}>
          Hey, <span style={{background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{name.split(" ")[0]}!</span>
        </div>
        <div style={{color:C.soft,fontSize:15,fontFamily:"'Outfit',sans-serif",lineHeight:1.8,marginBottom:36}}>
          Welcome to TakePlace. Let's get you shortlisted.<br/>
          <strong style={{color:C.text}}>Real jobs. AI resume. Zero guesswork.</strong>
        </div>
        {[
          {icon:"🔥",text:"Real jobs from real companies — updated live via Adzuna"},
          {icon:"⚡",text:"AI rewrites your resume role-by-role in Jake's format"},
          {icon:"🎯",text:"AI Interview Simulator — practice with questions tailored to your resume"},
          {icon:"📊",text:"Track every application + get weekly feedback"},
          {icon:"🛡️",text:"Fake job detector — never get scammed again"},
        ].map((f,i)=>(
          <div key={i} className="fade" style={{display:"flex",alignItems:"center",gap:14,background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px",marginBottom:10,textAlign:"left",animationDelay:`${i*0.08}s`}}>
            <span style={{fontSize:22}}>{f.icon}</span>
            <span style={{color:C.soft,fontSize:13,fontFamily:"'Outfit',sans-serif"}}>{f.text}</span>
          </div>
        ))}
        <button onClick={()=>setStep(2)} style={{...btn("primary",{marginTop:24,padding:"13px 40px",fontSize:15})}}>Let's Go →</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{css}</style>
      <div className="fade" style={{width:"100%",maxWidth:580}}>
        <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:24,color:C.text,marginBottom:6}}>Upload Your Resume</div>
        <div style={{color:C.muted,fontSize:13,marginBottom:20}}>Paste your resume text below. AI will analyze and score every project.</div>
        <textarea placeholder="Paste your full resume here — name, education, experience, projects, skills..." value={resume} onChange={e=>{setResume(e.target.value);if(e.target.value.length>200)analyzeResume(e.target.value);}} style={{...inp,minHeight:200,resize:"vertical",lineHeight:1.6,marginBottom:12}}/>
        <button onClick={()=>fileRef.current.click()} style={{...btn("ghost",{width:"100%",marginBottom:20})}}>📁 Or upload .txt file</button>
        <input ref={fileRef} type="file" accept=".txt" onChange={handleFile} style={{display:"none"}}/>
        {analyzing&&<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,marginBottom:16,textAlign:"center"}}><span className="spin" style={{fontSize:28}}>⚡</span><div style={{color:C.soft,fontSize:13,marginTop:8}}>AI analyzing your resume...</div></div>}
        {analysis&&!analyzing&&(
          <div className="fade" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,color:C.text,fontSize:16}}>AI Analysis Complete</div>
              <div style={{background:analysis.overallScore>=75?"#052e16":"#450a0a",color:analysis.overallScore>=75?C.green:C.danger,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:700}}>Score: {analysis.overallScore}/100</div>
            </div>
            {analysis.projects?.map((p,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:"#0a0e18",borderRadius:8,marginBottom:8,border:`1px solid ${p.keep?"#14532d":C.border}`}}>
                <div><div style={{fontSize:13,color:C.text,fontWeight:600}}>{p.name}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{p.reason}</div></div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{color:p.score>=80?C.green:p.score>=60?C.warn:C.danger,fontWeight:800,fontSize:15}}>{p.score}</span>
                  <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:p.keep?"#052e16":"#1c1917",color:p.keep?C.green:C.muted}}>{p.keep?"✓ Keep":"Remove"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={proceed} disabled={!resume||analyzing||saving} style={{...btn("primary",{width:"100%",padding:"13px",fontSize:14,opacity:(!resume||analyzing)?0.5:1})}}>
          {saving?"Saving...":resume?"Enter TakePlace →":"Paste your resume first"}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
function MainApp({user,resume,analysis,onLogout}){
  const [tab,setTab]=useState(0);
  const [jobs,setJobs]=useState([]);
  const [jobsLoading,setJobsLoading]=useState(true);
  const [jobsError,setJobsError]=useState("");
  const [search,setSearch]=useState("software engineer");
  const [location,setLocation]=useState("india");
  const [apps,setApps]=useState([]);
  const [tailorJob,setTailorJob]=useState(null);
  const [tailorLoading,setTailorLoading]=useState(false);
  const [tailorResult,setTailorResult]=useState(null);
  const [tailorView,setTailorView]=useState("ats");
  const [feedback,setFeedback]=useState({id:null,text:""});
  const [addingApp,setAddingApp]=useState(false);
  const [newApp,setNewApp]=useState({company:"",role:"",status:"Applied",feedback:""});
  const [fakeJob,setFakeJob]=useState({url:"",result:"",loading:false});
  const name=user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";

  useEffect(()=>{loadApps();fetchJobs();},[]);

  const loadApps=async()=>{
    const{data}=await supabase.from("applications").select("*").eq("user_id",user.id).order("created_at",{ascending:false});
    if(data)setApps(data);
  };

  const fetchJobs=async(q=search,loc=location)=>{
    setJobsLoading(true);setJobsError("");
    try{
      const url=`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=15&what=${encodeURIComponent(q)}&where=${encodeURIComponent(loc)}&sort_by=date&full_time=1&content-type=application/json`;
      const res=await fetch(url);
      const data=await res.json();
      if(data.results&&data.results.length>0){
        setJobs(data.results.map(j=>({id:j.id,title:j.title,company:j.company?.display_name||"Company",location:j.location?.display_name||loc,salary:j.salary_min?`₹${Math.round(j.salary_min/100000)}–${Math.round(j.salary_max/100000)} LPA`:"Salary not listed",description:j.description?.slice(0,300)||"",url:j.redirect_url,posted:new Date(j.created).toLocaleDateString("en-IN",{day:"numeric",month:"short"}),category:j.category?.label||"Technology"})));
      }else{setJobsError("No jobs found for this search. Try different keywords.");}
    }catch(e){setJobsError("Could not load jobs. Check internet connection.");}
    setJobsLoading(false);
  };

  const runTailor=async(job)=>{
    setTailorJob(job);setTailorResult(null);setTailorView("ats");setTailorLoading(true);
    const keepProjects=analysis?.projects?.filter(p=>p.keep).map(p=>p.name).join(", ")||"best projects";
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2500,messages:[{role:"user",content:`Expert resume coach. Analyze resume for job. Return 2 versions + analysis.

JOB: ${job.title} at ${job.company}
DESCRIPTION: ${job.description}

RESUME:
${resume?.slice(0,2500)}

BEST PROJECTS: ${keepProjects}

Return ONLY valid JSON (no markdown):
{"missing":["missing keyword 1"],"strong":["strong match 1"],"changes":["specific bullet change 1"],"matchScore":72,"atsResume":"FULL ATS resume Jake format plain text with injected keywords strong verbs metrics","rewrittenResume":"FULL rewritten resume same content stronger framing Jake format plain text"}`}]})});
      const data=await res.json();
      const raw=data.content?.map(c=>c.text||"").join("")||"{}";
      setTailorResult(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    }catch(e){setTailorResult({missing:[],strong:[],changes:["Error — try again"],matchScore:0,atsResume:"Error. Please try again.",rewrittenResume:"Error. Please try again."});}
    setTailorLoading(false);
  };

  const checkFakeJob=async()=>{
    if(!fakeJob.url)return;
    setFakeJob(p=>({...p,loading:true,result:""}));
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,messages:[{role:"user",content:`Analyze this job posting for fraud. Trust Score 0-100.\nReturn ONLY JSON: {"trustScore":85,"verdict":"SAFE","redFlags":["..."],"greenFlags":["..."],"advice":"..."}\nJob: ${fakeJob.url}`}]})});
      const data=await res.json();
      const raw=data.content?.map(c=>c.text||"").join("")||"{}";
      setFakeJob(p=>({...p,result:JSON.parse(raw.replace(/```json|```/g,"").trim()),loading:false}));
    }catch{setFakeJob(p=>({...p,result:{trustScore:0,verdict:"ERROR",redFlags:["Could not analyze"],greenFlags:[],advice:"Try again"},loading:false}));}
  };

  const markApply=async(job)=>{
    const newA={user_id:user.id,company:job.company,role:job.title,status:"Applied",job_url:job.url,feedback:"",created_at:new Date().toISOString()};
    const{data}=await supabase.from("applications").insert([newA]).select();
    if(data)setApps(prev=>[data[0],...prev]);
    window.open(job.url,"_blank");
  };

  const updateStatus=async(id,status)=>{
    await supabase.from("applications").update({status}).eq("id",id);
    setApps(prev=>prev.map(a=>a.id===id?{...a,status}:a));
  };

  const saveFeedback=async()=>{
    await supabase.from("applications").update({feedback:feedback.text}).eq("id",feedback.id);
    setApps(prev=>prev.map(a=>a.id===feedback.id?{...a,feedback:feedback.text}:a));
    setFeedback({id:null,text:""});
  };

  const addManualApp=async()=>{
    if(!newApp.company||!newApp.role)return;
    const a={user_id:user.id,...newApp,created_at:new Date().toISOString()};
    const{data}=await supabase.from("applications").insert([a]).select();
    if(data)setApps(prev=>[data[0],...prev]);
    setNewApp({company:"",role:"",status:"Applied",feedback:""});
    setAddingApp(false);
  };

  const TABS=["🔥 Live Jobs","📊 Tracker","🛡️ Fake Check","⚙️ Resume","🎯 Interview"];

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Outfit',sans-serif"}}>
      <style>{css}</style>

      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"14px 20px",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:780,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:20,background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>⚡ TakePlace</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:12,color:C.muted}}>Hey {name.split(" ")[0]} 👋</div>
            <button onClick={onLogout} style={{...btn("ghost",{padding:"6px 12px",fontSize:11})}}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,position:"sticky",top:53,zIndex:99}}>
        <div style={{maxWidth:780,margin:"0 auto",display:"flex",overflowX:"auto"}}>
          {TABS.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)} style={{flex:1,minWidth:70,padding:"12px 6px",border:"none",background:"transparent",cursor:"pointer",color:tab===i?(i===4?C.purple:C.orange):C.muted,fontFamily:"'Outfit',sans-serif",fontWeight:tab===i?700:400,fontSize:11,borderBottom:`2px solid ${tab===i?(i===4?C.purple:C.orange):"transparent"}`,transition:"all 0.2s",whiteSpace:"nowrap"}}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:780,margin:"0 auto",padding:"20px 16px 60px"}}>

        {/* ── TAB 0: LIVE JOBS ── */}
        {tab===0&&(
          <div>
            {/* Tailor Modal */}
            {tailorJob&&(
              <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:200,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px 16px",overflowY:"auto"}}>
                <div className="fade" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:24,width:"100%",maxWidth:680,marginTop:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                    <div>
                      <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:18,color:C.text}}>🧠 Resume Tailoring</div>
                      <div style={{color:C.muted,fontSize:12,marginTop:3}}>{tailorJob.title} at {tailorJob.company}</div>
                    </div>
                    <button onClick={()=>{setTailorJob(null);setTailorResult(null);}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:20,padding:4}}>✕</button>
                  </div>

                  {/* Locked JD */}
                  <div style={{background:"#0a0e18",border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div style={{color:C.soft,fontSize:11,fontFamily:"'DM Mono',monospace"}}>📋 JOB DESCRIPTION (LOCKED)</div>
                      <span style={{background:"#1a2030",color:C.muted,fontSize:10,padding:"2px 8px",borderRadius:10}}>🔒</span>
                    </div>
                    <div style={{color:C.soft,fontSize:12,lineHeight:1.7}}>{tailorJob.description}</div>
                  </div>

                  {/* Resume preview */}
                  <div style={{background:"#0a0e18",border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:14,maxHeight:100,overflow:"hidden",position:"relative"}}>
                    <div style={{color:C.soft,fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:6}}>👤 YOUR RESUME</div>
                    <div style={{color:C.muted,fontSize:11,lineHeight:1.5}}>{resume?resume.slice(0,200)+"...":"No resume loaded"}</div>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,height:30,background:"linear-gradient(transparent,#0a0e18)"}}/>
                  </div>

                  {!tailorResult&&!tailorLoading&&(
                    <button onClick={()=>runTailor(tailorJob)} disabled={!resume} style={{...btn("primary",{width:"100%",padding:"13px",fontSize:14,opacity:!resume?0.5:1})}}>⚡ Optimize Resume for This Job</button>
                  )}

                  {tailorLoading&&(
                    <div style={{textAlign:"center",padding:"30px 0"}}>
                      <span className="spin" style={{fontSize:36,color:C.orange}}>⚡</span>
                      <div style={{color:C.muted,fontSize:13,marginTop:10}}>AI analyzing match & rewriting resume...</div>
                    </div>
                  )}

                  {tailorResult&&!tailorLoading&&(
                    <div className="fade">
                      {/* Match score */}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0a0e18",borderRadius:10,padding:"12px 16px",marginBottom:12}}>
                        <div style={{color:C.text,fontWeight:700,fontSize:14}}>Resume Match Score</div>
                        <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:28,fontWeight:700,color:tailorResult.matchScore>=70?C.green:tailorResult.matchScore>=50?C.warn:C.danger}}>{tailorResult.matchScore}%</div>
                      </div>

                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                        <div style={{background:"#0a0e18",borderRadius:10,padding:14}}>
                          <div style={{color:C.danger,fontSize:10,fontFamily:"'DM Mono',monospace",marginBottom:8}}>MISSING FROM RESUME</div>
                          {tailorResult.missing?.map((m,i)=><div key={i} style={{color:C.soft,fontSize:12,marginBottom:5}}>⚠ {m}</div>)}
                        </div>
                        <div style={{background:"#0a0e18",borderRadius:10,padding:14}}>
                          <div style={{color:C.green,fontSize:10,fontFamily:"'DM Mono',monospace",marginBottom:8}}>STRONG MATCHES</div>
                          {tailorResult.strong?.map((s,i)=><div key={i} style={{color:C.soft,fontSize:12,marginBottom:5}}>✓ {s}</div>)}
                        </div>
                      </div>

                      <div style={{background:"#0a0e18",borderRadius:10,padding:14,marginBottom:12}}>
                        <div style={{color:C.warn,fontSize:10,fontFamily:"'DM Mono',monospace",marginBottom:8}}>CHANGES TO MAKE</div>
                        {tailorResult.changes?.map((c,i)=><div key={i} style={{color:C.soft,fontSize:12,marginBottom:5}}>→ {c}</div>)}
                      </div>

                      <div style={{display:"flex",background:"#0a0e18",borderRadius:10,padding:4,marginBottom:10}}>
                        {[["ats","⚡ ATS Optimized"],["rewrite","✏️ Rewritten"]].map(([v,label])=>(
                          <button key={v} onClick={()=>setTailorView(v)} style={{flex:1,padding:"9px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:tailorView===v?700:400,fontSize:12,transition:"all 0.2s",background:tailorView===v?C.border:"transparent",color:tailorView===v?C.text:C.muted}}>{label}</button>
                        ))}
                      </div>

                      <div style={{background:"#0a0e18",borderRadius:10,padding:16,position:"relative"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                          <div style={{color:tailorView==="ats"?C.green:C.purple,fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                            {tailorView==="ats"?"⚡ ATS-OPTIMIZED":"✏️ REWRITTEN"}
                          </div>
                          <button onClick={()=>navigator.clipboard.writeText(tailorView==="ats"?tailorResult.atsResume:tailorResult.rewrittenResume)} style={{...btn("ghost",{padding:"4px 10px",fontSize:10})}}>Copy</button>
                        </div>
                        <pre style={{whiteSpace:"pre-wrap",fontSize:11,color:C.soft,lineHeight:1.8,fontFamily:"'DM Mono',monospace",maxHeight:300,overflowY:"auto"}}>
                          {tailorView==="ats"?tailorResult.atsResume:tailorResult.rewrittenResume}
                        </pre>
                      </div>
                      <button onClick={()=>{setTailorResult(null);}} style={{...btn("ghost",{width:"100%",marginTop:10,fontSize:12})}}>🔄 Re-optimize</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <input style={inp} placeholder="Job title (java developer...)" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
                <input style={inp} placeholder="Location (hyderabad...)" value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
              </div>
              <button onClick={()=>fetchJobs()} style={{...btn("primary",{width:"100%"})}}>🔍 Search Real Jobs</button>
            </div>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:18,color:C.text}}>Live Job Feed</div>
              {!jobsLoading&&jobs.length>0&&(
                <div style={{display:"flex",alignItems:"center",gap:6,background:"#052e16",borderRadius:20,padding:"5px 12px"}}>
                  <div className="pulse-dot" style={{width:6,height:6,borderRadius:"50%",background:C.green}}/>
                  <span style={{color:C.green,fontSize:11,fontWeight:700}}>{jobs.length} real jobs</span>
                </div>
              )}
            </div>

            {jobsLoading&&<div style={{textAlign:"center",padding:"60px 20px"}}><span className="spin" style={{fontSize:36,color:C.orange}}>⚡</span><div style={{color:C.muted,fontSize:14,marginTop:12}}>Fetching real jobs from Adzuna...</div></div>}
            {jobsError&&<div style={{background:"#450a0a",border:"1px solid #7f1d1d",borderRadius:12,padding:20,color:C.danger,textAlign:"center"}}>{jobsError}</div>}

            {!jobsLoading&&jobs.map((job,i)=>(
              <div key={job.id} className="fade card-hover" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px",marginBottom:12,borderLeft:`3px solid ${C.orange}`,animationDelay:`${i*0.04}s`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <div>
                    <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:15,color:C.text}}>{job.title}</div>
                    <div style={{color:C.soft,fontSize:12,marginTop:2}}>{job.company} · {job.location}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{color:C.green,fontWeight:700,fontSize:13}}>{job.salary}</div>
                    <div style={{color:C.muted,fontSize:10,marginTop:2}}>{job.posted}</div>
                  </div>
                </div>
                {job.description&&<div style={{color:C.muted,fontSize:12,lineHeight:1.6,marginBottom:10,background:"#0a0e18",borderRadius:8,padding:"8px 10px"}}>{job.description}...</div>}
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  <span style={{background:"#0c1a3a",color:"#60a5fa",fontSize:10,padding:"3px 8px",borderRadius:6}}>{job.category}</span>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>markApply(job)} style={{...btn("primary",{flex:1,fontSize:12})}}>Apply Now → (Opens real job)</button>
                  <button onClick={()=>runTailor(job)} style={{...btn("ghost",{fontSize:12})}}>🧠 Tailor Resume</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 1: TRACKER ── */}
        {tab===1&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:16}}>
              <div>
                <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:800,fontSize:40,color:"#60a5fa"}}>{apps.length}</div>
                <div style={{color:C.muted,fontSize:12,marginTop:2}}>Total Applications</div>
              </div>
              <div style={{flex:1,background:"#0a0e18",borderRadius:10,padding:"12px 16px"}}>
                <div style={{color:C.soft,fontSize:12}}>Consistency wins. Most roles require 50–100 applications before getting interviews. Keep going! 🔥</div>
              </div>
            </div>

            {!addingApp?(
              <button onClick={()=>setAddingApp(true)} style={{width:"100%",padding:"11px",borderRadius:10,border:`1px dashed ${C.border}`,background:"transparent",color:C.muted,fontSize:13,cursor:"pointer",marginBottom:14}}>
                + Add Application Manually
              </button>
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
                  <button onClick={addManualApp} style={{...btn("primary",{flex:1})}}>Add</button>
                  <button onClick={()=>setAddingApp(false)} style={{...btn("ghost",{padding:"10px 16px"})}}>Cancel</button>
                </div>
              </div>
            )}

            {apps.length===0?(
              <div style={{textAlign:"center",padding:"60px 20px",color:C.muted}}>
                <div style={{fontSize:40,marginBottom:12}}>📭</div>
                <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:18}}>No applications yet</div>
                <div style={{fontSize:13,marginTop:6}}>Apply to jobs — they'll track here automatically</div>
              </div>
            ):apps.map(app=>(
              <div key={app.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,color:C.text,fontSize:15}}>{app.company}</div>
                    <div style={{color:C.muted,fontSize:12,marginTop:2}}>{app.role} · {new Date(app.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
                  </div>
                  <select value={app.status} onChange={e=>updateStatus(app.id,e.target.value)}
                    style={{background:STATUS_C[app.status]?.[0]||C.card,color:STATUS_C[app.status]?.[1]||C.soft,border:"none",borderRadius:20,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",outline:"none",fontFamily:"'Outfit',sans-serif"}}>
                    {Object.keys(STATUS_C).map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                {app.feedback&&<div style={{background:"#0a0e18",borderRadius:8,padding:"8px 10px",fontSize:12,color:C.soft,marginBottom:8}}>💬 {app.feedback}</div>}
                {app.job_url&&<a href={app.job_url} target="_blank" rel="noreferrer" style={{fontSize:11,color:"#60a5fa",display:"block",marginBottom:8}}>🔗 View original job posting</a>}
                {feedback.id===app.id?(
                  <div style={{display:"flex",gap:8}}>
                    <input placeholder="Add notes or feedback..." value={feedback.text} onChange={e=>setFeedback(p=>({...p,text:e.target.value}))} style={{...inp,flex:1}}/>
                    <button onClick={saveFeedback} style={{...btn("primary",{padding:"8px 14px",fontSize:12})}}>Save</button>
                  </div>
                ):(
                  <button onClick={()=>setFeedback({id:app.id,text:app.feedback||""})} style={{...btn("ghost",{padding:"6px 12px",fontSize:11})}}>
                    {app.feedback?"✏️ Edit notes":"+ Add feedback"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 2: FAKE CHECK ── */}
        {tab===2&&(
          <div>
            <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:22,color:C.text,marginBottom:4}}>🛡️ Fake Job Detector</div>
            <div style={{color:C.muted,fontSize:13,marginBottom:20}}>Paste any job URL or description. AI checks if it's real or a scam.</div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <textarea placeholder="Paste job URL or full job description here..." value={fakeJob.url} onChange={e=>setFakeJob(p=>({...p,url:e.target.value}))} style={{...inp,minHeight:120,resize:"vertical",marginBottom:12}}/>
              <button onClick={checkFakeJob} disabled={!fakeJob.url||fakeJob.loading} style={{...btn("primary",{width:"100%"})}}>
                {fakeJob.loading?<><span className="spin">⚡</span> Analyzing...</>:"🛡️ Check This Job"}
              </button>
            </div>
            {fakeJob.result&&!fakeJob.loading&&(
              <div className="fade" style={{background:C.card,border:`2px solid ${fakeJob.result.trustScore>=70?"#14532d":fakeJob.result.trustScore>=40?"#451a03":"#450a0a"}`,borderRadius:14,padding:24}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:20,color:C.text}}>Trust Analysis</div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:48,fontWeight:700,color:fakeJob.result.trustScore>=70?C.green:fakeJob.result.trustScore>=40?C.warn:C.danger}}>{fakeJob.result.trustScore}</div>
                    <div style={{fontSize:10,color:C.muted}}>Trust Score</div>
                  </div>
                </div>
                <div style={{display:"inline-block",padding:"8px 20px",borderRadius:20,background:fakeJob.result.verdict==="SAFE"?"#052e16":fakeJob.result.verdict==="RISKY"?"#451a03":"#450a0a",color:fakeJob.result.verdict==="SAFE"?C.green:fakeJob.result.verdict==="RISKY"?C.warn:C.danger,fontWeight:800,fontSize:14,marginBottom:16}}>
                  {fakeJob.result.verdict==="SAFE"?"✅ LIKELY SAFE":fakeJob.result.verdict==="RISKY"?"⚠️ PROCEED WITH CAUTION":"🚨 LIKELY FAKE"}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
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

        {/* ── TAB 3: RESUME ── */}
        {tab===3&&(
          <div>
            <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:22,color:C.text,marginBottom:4}}>Your Resume Intelligence</div>
            <div style={{color:C.muted,fontSize:13,marginBottom:20}}>AI analysis of your uploaded resume</div>

            {resume&&(
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,color:C.text,fontSize:15}}>📄 Your Uploaded Resume</div>
                  <button onClick={()=>navigator.clipboard.writeText(resume)} style={{...btn("ghost",{padding:"5px 12px",fontSize:11})}}>Copy</button>
                </div>
                <pre style={{whiteSpace:"pre-wrap",fontSize:11,color:C.soft,lineHeight:1.8,fontFamily:"'DM Mono',monospace",maxHeight:280,overflowY:"auto",background:"#0a0e18",borderRadius:8,padding:"12px 14px"}}>{resume}</pre>
              </div>
            )}

            {analysis?.projects?.length>0&&(
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:16}}>
                <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,color:C.text,marginBottom:14,fontSize:16}}>Project Rankings</div>
                {analysis.projects.map((p,i)=>(
                  <div key={i} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:13,color:C.text,fontWeight:600}}>{p.name}</span>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <span style={{fontSize:14,fontWeight:800,color:p.score>=80?C.green:p.score>=60?C.warn:C.danger}}>{p.score}/100</span>
                        <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:p.keep?"#052e16":"#1c1917",color:p.keep?C.green:C.muted}}>{p.keep?"✓ AI Recommends":"Skip"}</span>
                      </div>
                    </div>
                    <div style={{background:"#0a0e18",borderRadius:4,height:6,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${p.score}%`,background:p.score>=80?`linear-gradient(90deg,${C.green},#22c55e)`:p.score>=60?`linear-gradient(90deg,${C.warn},#f59e0b)`:C.danger,borderRadius:4,transition:"width 1s ease"}}/>
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
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:16}}>
                <div style={{color:"#60a5fa",fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:10}}>DETECTED SKILLS</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {analysis.skills.map((s,i)=><span key={i} style={{background:"#0a0e18",color:C.soft,fontSize:11,padding:"4px 10px",borderRadius:8,fontFamily:"'DM Mono',monospace"}}>{s}</span>)}
                </div>
              </div>
            )}

            {/* About & Support */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginTop:4}}>
              <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,color:C.text,fontSize:16,marginBottom:12}}>ℹ️ About TakePlace</div>
              <div style={{color:C.soft,fontSize:13,lineHeight:1.9,marginBottom:16}}>
                TakePlace is built for job seekers who are tired of applying into the void. Real-time job feeds, AI resume tailoring, interview simulation, and application tracking — all in one place. No fluff. Just results.
              </div>
              <div style={{background:"#0a0e18",borderRadius:10,padding:14,marginBottom:10}}>
                <div style={{color:C.muted,fontSize:10,fontFamily:"'DM Mono',monospace",marginBottom:6}}>FOUNDER</div>
                <div style={{color:C.text,fontSize:14,fontWeight:700}}>Raghureddy</div>
                <div style={{color:C.soft,fontSize:12,marginTop:4,lineHeight:1.7}}>Built TakePlace to help every job seeker in India land their dream role — faster, smarter, and without getting scammed.</div>
              </div>
              <div style={{background:"#0a0e18",borderRadius:10,padding:14}}>
                <div style={{color:C.muted,fontSize:10,fontFamily:"'DM Mono',monospace",marginBottom:6}}>SUPPORT</div>
                <div style={{color:"#60a5fa",fontSize:13,fontWeight:600}}>📧 takeplace.in@gmail.com</div>
                <div style={{color:C.muted,fontSize:11,marginTop:4}}>We reply within 24 hours. Any bug, feedback, or question — reach out.</div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: INTERVIEW ── */}
        {tab===4&&<InterviewPrep resume={resume} analysis={analysis}/>}

      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const [resume,setResume]=useState(null);
  const [analysis,setAnalysis]=useState(null);
  const [onboarded,setOnboarded]=useState(false);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user||null);
      if(session?.user)loadProfile(session.user);
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_,session)=>{
      setUser(session?.user||null);
      if(session?.user)loadProfile(session.user);
    });
  },[]);

  const loadProfile=async(u)=>{
    const{data}=await supabase.from("profiles").select("*").eq("id",u.id).single();
    if(data?.resume_text){setResume(data.resume_text);setAnalysis(data.analysis);setOnboarded(true);}
  };

  const logout=async()=>{await supabase.auth.signOut();setUser(null);setOnboarded(false);setResume(null);setAnalysis(null);};

  if(loading)return(
    <div style={{minHeight:"100vh",background:"#07080f",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{css}</style>
      <div style={{textAlign:"center"}}>
        <span className="spin" style={{fontSize:48,color:"#FF5C1A"}}>⚡</span>
        <div style={{color:"#4b5563",fontSize:14,marginTop:16,fontFamily:"'Outfit',sans-serif"}}>Loading TakePlace...</div>
      </div>
    </div>
  );

  if(!user)return <AuthPage onLogin={setUser}/>;
  if(!onboarded)return <OnboardPage user={user} onDone={(r,a)=>{setResume(r);setAnalysis(a);setOnboarded(true);}}/>;
  return <MainApp user={user} resume={resume} analysis={analysis} onLogout={logout}/>;
}
