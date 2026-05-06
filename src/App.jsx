import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── STYLES ────────────────────────────────────────────────────────────────
const C = {
  bg: "#07080f", card: "#0d1117", border: "#1a2030",
  orange: "#FF5C1A", orangeLight: "#FF8A5B",
  green: "#1DDB8B", text: "#e2e8f0", muted: "#4b5563", soft: "#94a3b8",
  danger: "#f87171", warn: "#fbbf24",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@600;700&family=Outfit:wght@300;400;500;600;700&family=DM+Mono&display=swap');
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
  .card-hover{transition:all 0.2s;} .card-hover:hover{transform:translateY(-3px);border-color:#2a2a4a !important;}
`;

const inp = {
  width:"100%", background:"#0d1117", border:`1px solid ${C.border}`,
  borderRadius:10, padding:"11px 14px", color:C.text, fontSize:13,
  fontFamily:"'Outfit',sans-serif", outline:"none"
};

const btn = (variant="primary", extra={}) => ({
  padding:"10px 20px", borderRadius:10, border:"none", cursor:"pointer",
  fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13, transition:"all 0.2s",
  ...(variant==="primary"?{background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,color:"#07080f"}:
     variant==="ghost"?{background:"transparent",color:C.soft,border:`1px solid ${C.border}`}:
     {background:C.card,color:C.soft,border:`1px solid ${C.border}`}),
  ...extra
});

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
        const{data,error}=await supabase.auth.signUp({
          email:form.email, password:form.password,
          options:{data:{full_name:form.name}}
        });
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
          <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:30,background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,backgroundSize:"200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradShift 3s ease infinite"}}>
            TakePlace
          </div>
          <div style={{color:C.muted,fontSize:12,marginTop:4,fontFamily:"'Outfit',sans-serif"}}>
            It's your time. TakePlace.
          </div>
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
          <input style={inp} placeholder="Password" type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}/>
        </div>

        {err&&<div style={{color:C.danger,fontSize:12,marginTop:10,fontFamily:"'Outfit',sans-serif"}}>⚠ {err}</div>}
        {msg&&<div style={{color:C.green,fontSize:12,marginTop:10,fontFamily:"'Outfit',sans-serif"}}>{msg}</div>}

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
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          messages:[{role:"user",content:`Analyze this resume. Return ONLY valid JSON (no markdown):
{"projects":[{"name":"...","score":85,"reason":"...","keep":true}],"skills":["Java","Spring Boot"],"strengths":["..."],"weaknesses":["..."],"overallScore":72}
Score each project 0-100 for recruiter impression. keep:true for top 2 only.
Resume: ${text.slice(0,2000)}`}]
        })
      });
      const data=await res.json();
      const raw=data.content?.map(c=>c.text||"").join("")||"{}";
      setAnalysis(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    }catch(e){setAnalysis({projects:[],skills:[],strengths:[],weaknesses:[],overallScore:70});}
    setAnalyzing(false);
  };

  const proceed=async()=>{
    setSaving(true);
    try{
      await supabase.from("profiles").upsert({
        id:user.id, full_name:name, email:user.email,
        resume_text:resume, analysis:analysis, updated_at:new Date().toISOString()
      });
    }catch(e){}
    setSaving(false);
    onDone(resume,analysis);
  };

  const handleFile=(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{const t=ev.target.result;setResume(t);analyzeResume(t);};
    reader.readAsText(file);
  };

  if(step===1) return(
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
          {icon:"🧠",text:"AI scores your projects — keeps strongest, removes weak"},
          {icon:"📊",text:"Track every application + get weekly feedback"},
          {icon:"🛡️",text:"Fake job detector — never get scammed again"},
        ].map((f,i)=>(
          <div key={i} className="fade" style={{display:"flex",alignItems:"center",gap:14,background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px",marginBottom:10,textAlign:"left",animationDelay:`${i*0.08}s`}}>
            <span style={{fontSize:22}}>{f.icon}</span>
            <span style={{color:C.soft,fontSize:13,fontFamily:"'Outfit',sans-serif"}}>{f.text}</span>
          </div>
        ))}
        <button onClick={()=>setStep(2)} style={{...btn("primary",{marginTop:24,padding:"13px 40px",fontSize:15})}}>
          Let's Go →
        </button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{css}</style>
      <div className="fade" style={{width:"100%",maxWidth:580}}>
        <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:24,color:C.text,marginBottom:6}}>Upload Your Resume</div>
        <div style={{color:C.muted,fontSize:13,marginBottom:20,fontFamily:"'Outfit',sans-serif"}}>Paste your resume text below. AI will analyze and score every project.</div>

        <textarea placeholder="Paste your full resume here — name, education, experience, projects, skills..." value={resume} onChange={e=>{setResume(e.target.value);if(e.target.value.length>200)analyzeResume(e.target.value);}}
          style={{...inp,minHeight:200,resize:"vertical",lineHeight:1.6,marginBottom:12}}/>

        <button onClick={()=>fileRef.current.click()} style={{...btn("ghost",{width:"100%",marginBottom:20})}}>📁 Or upload .txt file</button>
        <input ref={fileRef} type="file" accept=".txt" onChange={handleFile} style={{display:"none"}}/>

        {analyzing&&(
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,marginBottom:16,textAlign:"center"}}>
            <span className="spin" style={{fontSize:28}}>⚡</span>
            <div style={{color:C.soft,fontSize:13,fontFamily:"'Outfit',sans-serif",marginTop:8}}>AI analyzing your resume and scoring projects...</div>
          </div>
        )}

        {analysis&&!analyzing&&(
          <div className="fade" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,color:C.text,fontSize:16}}>AI Analysis Complete</div>
              <div style={{background:analysis.overallScore>=75?"#052e16":"#450a0a",color:analysis.overallScore>=75?C.green:C.danger,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:700}}>
                Score: {analysis.overallScore}/100
              </div>
            </div>
            {analysis.projects?.map((p,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:"#0a0e18",borderRadius:8,marginBottom:8,border:`1px solid ${p.keep?"#14532d":C.border}`}}>
                <div>
                  <div style={{fontSize:13,color:C.text,fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>{p.name}</div>
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
  const [tailoring,setTailoring]=useState(null);
  const [tailored,setTailored]=useState({});
  const [tailorLoading,setTailorLoading]=useState(false);
  const [feedback,setFeedback]=useState({id:null,text:""});
  const [addingApp,setAddingApp]=useState(false);
  const [newApp,setNewApp]=useState({company:"",role:"",status:"Applied",feedback:""});
  const [fakeJob,setFakeJob]=useState({url:"",result:"",loading:false});
  const name=user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";

  useEffect(()=>{
    loadApps();
    fetchJobs();
  },[]);

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
        setJobs(data.results.map(j=>({
          id:j.id,
          title:j.title,
          company:j.company?.display_name||"Company",
          location:j.location?.display_name||loc,
          salary:j.salary_min?`₹${Math.round(j.salary_min/100000)}–${Math.round(j.salary_max/100000)} LPA`:"Salary not listed",
          description:j.description?.slice(0,200)||"",
          url:j.redirect_url,
          posted:new Date(j.created).toLocaleDateString("en-IN",{day:"numeric",month:"short"}),
          category:j.category?.label||"Technology",
        })));
      }else{
        setJobsError("No jobs found for this search. Try different keywords.");
      }
    }catch(e){
      setJobsError("Could not load jobs. Check internet connection.");
    }
    setJobsLoading(false);
  };

  const tailorResume=async(job)=>{
    setTailoring(job.id);setTailorLoading(true);
    const keepProjects=analysis?.projects?.filter(p=>p.keep).map(p=>p.name).join(", ")||"best projects";
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          messages:[{role:"user",content:`Rewrite this resume for "${job.title}" at ${job.company}.
RULES:
1. Jake's Resume format — clean, ATS optimized
2. Only include these projects (AI selected strongest): ${keepProjects}
3. Add keywords from job: ${job.description}
4. Every bullet starts with strong action verb + has metric
5. Max 1 page content
Format: SUMMARY → EXPERIENCE → PROJECTS → SKILLS → ACHIEVEMENTS
Resume: ${resume?.slice(0,2000)}
Return only the rewritten resume.`}]
        })
      });
      const data=await res.json();
      const text=data.content?.map(c=>c.text||"").join("")||"Error. Try again.";
      setTailored(prev=>({...prev,[job.id]:text}));
    }catch{setTailored(prev=>({...prev,[job.id]:"Network error. Try again."}));}
    setTailorLoading(false);
  };

  const checkFakeJob=async()=>{
    if(!fakeJob.url)return;
    setFakeJob(p=>({...p,loading:true,result:""}));
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:500,
          messages:[{role:"user",content:`Analyze this job posting URL or description for fraud indicators. Give a Trust Score 0-100 and list red flags.
Return ONLY JSON: {"trustScore":85,"verdict":"SAFE","redFlags":["..."],"greenFlags":["..."],"advice":"..."}
Job: ${fakeJob.url}`}]
        })
      });
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

  const stats={
    total:apps.length,
    shortlisted:apps.filter(a=>["Shortlisted","Interview"].includes(a.status)).length,
    rejected:apps.filter(a=>a.status==="Rejected").length,
    rate:apps.length?Math.round(apps.filter(a=>["Shortlisted","Interview"].includes(a.status)).length/apps.length*100):0,
  };

  const STATUS_C={"Applied":["#1e3a5f","#60a5fa"],"Shortlisted":["#14532d","#4ade80"],"Rejected":["#450a0a","#f87171"],"No Response":["#1c1917","#a8a29e"],"Interview":["#3b0764","#c084fc"]};
  const TABS=["🔥 Live Jobs","📊 Tracker","🛡️ Fake Check","⚙️ Resume"];

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Outfit',sans-serif"}}>
      <style>{css}</style>

      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"14px 20px",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:750,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:20,background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            ⚡ TakePlace
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:12,color:C.muted}}>Hey {name.split(" ")[0]} 👋</div>
            <button onClick={onLogout} style={{...btn("ghost",{padding:"6px 12px",fontSize:11})}}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,position:"sticky",top:53,zIndex:99}}>
        <div style={{maxWidth:750,margin:"0 auto",display:"flex"}}>
          {TABS.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)} style={{flex:1,padding:"12px 6px",border:"none",background:"transparent",cursor:"pointer",color:tab===i?C.orange:C.muted,fontFamily:"'Outfit',sans-serif",fontWeight:tab===i?700:400,fontSize:12,borderBottom:`2px solid ${tab===i?C.orange:"transparent"}`,transition:"all 0.2s"}}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:750,margin:"0 auto",padding:"20px 16px 60px"}}>

        {tab===0&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <input style={inp} placeholder="Job title (java developer...)" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
                <input style={inp} placeholder="Location (hyderabad...)" value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
              </div>
              <button onClick={()=>fetchJobs()} style={{...btn("primary",{width:"100%"})}}>
                🔍 Search Real Jobs
              </button>
            </div>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:18,color:C.text}}>Live Job Feed</div>
              {!jobsLoading&&jobs.length>0&&(
                <div style={{display:"flex",alignItems:"center",gap:6,background:"#052e16",borderRadius:20,padding:"5px 12px"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/>
                  <span style={{color:C.green,fontSize:11,fontWeight:700}}>{jobs.length} real jobs</span>
                </div>
              )}
            </div>

            {jobsLoading&&(
              <div style={{textAlign:"center",padding:"60px 20px"}}>
                <span className="spin" style={{fontSize:36,color:C.orange}}>⚡</span>
                <div style={{color:C.muted,fontSize:14,marginTop:12}}>Fetching real jobs from Adzuna...</div>
              </div>
            )}

            {jobsError&&(
              <div style={{background:"#450a0a",border:"1px solid #7f1d1d",borderRadius:12,padding:20,color:C.danger,textAlign:"center"}}>
                {jobsError}
              </div>
            )}

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

                {job.description&&(
                  <div style={{color:C.muted,fontSize:12,lineHeight:1.6,marginBottom:10,background:"#0a0e18",borderRadius:8,padding:"8px 10px"}}>
                    {job.description}...
                  </div>
                )}

                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  <span style={{background:"#0c1a3a",color:"#60a5fa",fontSize:10,padding:"3px 8px",borderRadius:6}}>{job.category}</span>
                </div>

                {tailoring===job.id&&tailored[job.id]&&(
                  <div className="fade" style={{background:"#0a0e18",borderRadius:10,padding:16,marginBottom:12,border:"1px solid #1a3a1a"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{color:C.green,fontSize:12,fontWeight:700}}>⚡ Tailored Resume — Jake's Format</div>
                      <button onClick={()=>navigator.clipboard.writeText(tailored[job.id])} style={{...btn("ghost",{padding:"4px 10px",fontSize:10})}}>Copy</button>
                    </div>
                    <pre style={{whiteSpace:"pre-wrap",fontSize:11,color:C.soft,lineHeight:1.7,fontFamily:"'DM Mono',monospace",maxHeight:300,overflowY:"auto"}}>{tailored[job.id]}</pre>
                  </div>
                )}

                {tailorLoading&&tailoring===job.id&&!tailored[job.id]&&(
                  <div style={{textAlign:"center",padding:14,color:C.muted,fontSize:12,marginBottom:12}}>
                    <span className="spin">⚡</span> AI rewriting resume for this role...
                  </div>
                )}

                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>markApply(job)} style={{...btn("primary",{flex:1,fontSize:12})}}>
                    Apply Now → (Opens real job)
                  </button>
                  <button onClick={()=>{setTailoring(job.id);if(!tailored[job.id])tailorResume(job);}} style={{...btn("ghost",{fontSize:12})}}>
                    🧠 Tailor Resume
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab===1&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
              {[["Applied",stats.total,"#60a5fa"],["Shortlisted",stats.shortlisted,C.green],["Rejected",stats.rejected,C.danger],["Rate",stats.rate+"%","#c084fc"]].map(([l,v,c])=>(
                <div key={l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 10px",textAlign:"center"}}>
                  <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:800,fontSize:24,color:c}}>{v}</div>
                  <div style={{color:C.muted,fontSize:11,marginTop:3}}>{l}</div>
                </div>
              ))}
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

        {tab===2&&(
          <div>
            <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:22,color:C.text,marginBottom:4}}>🛡️ Fake Job Detector</div>
            <div style={{color:C.muted,fontSize:13,marginBottom:20}}>Paste any job URL or description. AI checks if it's real or a scam.</div>

            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <textarea placeholder="Paste job URL or full job description here..." value={fakeJob.url} onChange={e=>setFakeJob(p=>({...p,url:e.target.value}))}
                style={{...inp,minHeight:120,resize:"vertical",marginBottom:12}}/>
              <button onClick={checkFakeJob} disabled={!fakeJob.url||fakeJob.loading} style={{...btn("primary",{width:"100%"})}}>
                {fakeJob.loading?<><span className="spin">⚡</span> Analyzing...</>:"🛡️ Check This Job"}
              </button>
            </div>

            {fakeJob.result&&!fakeJob.loading&&(
              <div className="fade" style={{background:C.card,border:`2px solid ${fakeJob.result.trustScore>=70?"#14532d":fakeJob.result.trustScore>=40?"#451a03":"#450a0a"}`,borderRadius:14,padding:24}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div>
                    <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:20,color:C.text}}>Trust Analysis</div>
                    <div style={{color:C.muted,fontSize:13,marginTop:2}}>AI verdict on this job posting</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:48,fontWeight:700,color:fakeJob.result.trustScore>=70?C.green:fakeJob.result.trustScore>=40?C.warn:C.danger}}>
                      {fakeJob.result.trustScore}
                    </div>
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
                <div style={{background:"#0a0e18",borderRadius:10,padding:14,color:C.soft,fontSize:13,lineHeight:1.7}}>
                  💡 {fakeJob.result.advice}
                </div>
              </div>
            )}
          </div>
        )}

        {tab===3&&(
          <div>
            <div style={{fontFamily:"'Clash Display',sans-serif",fontWeight:700,fontSize:22,color:C.text,marginBottom:4}}>Your Resume Intelligence</div>
            <div style={{color:C.muted,fontSize:13,marginBottom:20}}>AI analysis of your uploaded resume</div>

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
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
                <div style={{color:"#60a5fa",fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:10}}>DETECTED SKILLS</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {analysis.skills.map((s,i)=><span key={i} style={{background:"#0a0e18",color:C.soft,fontSize:11,padding:"4px 10px",borderRadius:8,fontFamily:"'DM Mono',monospace"}}>{s}</span>)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
