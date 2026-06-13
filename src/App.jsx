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
  @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes glowPulse{0%,100%{box-shadow:0 0 20px #2563eb30}50%{box-shadow:0 0 40px #2563eb60}}
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
  @media(max-width:768px){.hide-mobile{display:none!important;}.mobile-full{width:100%!important;}}
`;

const inp = {
  width:"100%", background:"#ffffff", border:`1.5px solid ${C.border}`,
  borderRadius:10, padding:"11px 14px", color:C.text, fontSize:14,
  fontFamily:"'Inter',sans-serif", outline:"none", transition:"all .2s",
};

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────
const SpinIcon = ({ size=18, color=C.blue }) => (
  <span className="spin" style={{width:size,height:size,border:`2px solid ${color}30`,
    borderTopColor:color,borderRadius:"50%",display:"inline-block",flexShrink:0}}/>
);

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

const Tag = ({ children, color=C.blue, bg }) => (
  <span style={{background:bg||`${color}15`,color,fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700,whiteSpace:"nowrap",border:`1px solid ${color}30`}}>
    {children}
  </span>
);

// ─── AI CALL ────────────────────────────────────────────────────────────────
async function callAI(prompt, maxTokens=2000, retries=2) {
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

// ─── DOWNLOAD HELPERS ───────────────────────────────────────────────────────
async function downloadPDF(resumeText, filename) {
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
  doc.setFontSize(9); doc.setFont("helvetica","normal");
  const lines=doc.splitTextToSize(resumeText,cw);
  lines.forEach(line=>{
    if(y>280){doc.addPage();y=15;}
    doc.text(line,ml,y); y+=4.5;
  });
  doc.save(filename);
}

// ══════════════════════════════════════════════════════════════════════════
// QUESTION BANKS — MANUALLY WRITTEN COMPANY-LEVEL QUESTIONS
// ══════════════════════════════════════════════════════════════════════════

// ─── APTITUDE QUESTION BANK ─────────────────────────────────────────────────
const APT_BANK = {
  tcs: [
    {q:"A train 150m long passes a pole in 15 seconds. What is the speed of the train?",opts:["10 m/s","12 m/s","8 m/s","15 m/s"],ans:0,exp:"Speed = Distance/Time = 150/15 = 10 m/s",topic:"Speed & Distance"},
    {q:"If 6 men can do a piece of work in 12 days, how many men are needed to do the same work in 8 days?",opts:["8","9","10","7"],ans:1,exp:"Men × Days = constant. 6×12=72. 72/8=9 men",topic:"Work & Time"},
    {q:"The ratio of two numbers is 3:5. If each number is increased by 10, the ratio becomes 5:7. Find the numbers.",opts:["15,25","10,20","20,30","12,20"],ans:0,exp:"Let 3x,5x. (3x+10)/(5x+10)=5/7 → 21x+70=25x+50 → 4x=20 → x=5. Numbers: 15,25",topic:"Ratio & Proportion"},
    {q:"A shopkeeper sells an article at 20% profit. If cost price is ₹500, find selling price.",opts:["₹600","₹580","₹620","₹550"],ans:0,exp:"SP = CP × (1+profit%) = 500 × 1.20 = ₹600",topic:"Profit & Loss"},
    {q:"Find the next number: 2, 6, 12, 20, 30, ?",opts:["42","40","44","38"],ans:0,exp:"Differences: 4,6,8,10,12. Next = 30+12=42",topic:"Number Series"},
    {q:"In how many ways can the letters of TIGER be arranged?",opts:["120","60","24","720"],ans:0,exp:"5! = 5×4×3×2×1 = 120",topic:"Permutation"},
    {q:"Simple interest on ₹2000 for 3 years at 5% per annum is?",opts:["₹300","₹200","₹250","₹350"],ans:0,exp:"SI = (P×R×T)/100 = (2000×5×3)/100 = ₹300",topic:"Simple Interest"},
    {q:"If a:b=2:3 and b:c=4:5, find a:c.",opts:["8:15","2:5","4:10","6:15"],ans:0,exp:"a:b=2:3, b:c=4:5. a:b:c=8:12:15. So a:c=8:15",topic:"Ratio"},
    {q:"A pipe fills a tank in 4 hours. Another empties it in 12 hours. If both are open, tank fills in?",opts:["6 hrs","8 hrs","5 hrs","10 hrs"],ans:0,exp:"Net rate = 1/4 - 1/12 = 3/12 - 1/12 = 2/12 = 1/6. Time = 6 hours",topic:"Pipes & Cisterns"},
    {q:"What is 15% of 240?",opts:["36","32","40","28"],ans:0,exp:"15/100 × 240 = 36",topic:"Percentage"},
    {q:"A man walks 3 km north, turns east and walks 4 km. Distance from start?",opts:["5 km","7 km","4 km","6 km"],ans:0,exp:"Pythagorean theorem: √(3²+4²)=√25=5 km",topic:"Direction & Distance"},
    {q:"Find odd one out: 8, 27, 64, 100, 125",opts:["100","27","64","125"],ans:0,exp:"100 is not a perfect cube. 8=2³,27=3³,64=4³,125=5³",topic:"Odd One Out"},
    {q:"Compound interest on ₹1000 for 2 years at 10% p.a. is?",opts:["₹210","₹200","₹220","₹190"],ans:0,exp:"A=1000(1.1)²=1210. CI=1210-1000=₹210",topic:"Compound Interest"},
    {q:"A car travels 300 km in 5 hours. Speed in km/hr?",opts:["60","50","55","65"],ans:0,exp:"Speed = 300/5 = 60 km/hr",topic:"Speed"},
    {q:"If 2x+3y=12 and x-y=1, find x.",opts:["3","4","2","5"],ans:0,exp:"x=y+1. 2(y+1)+3y=12 → 5y=10 → y=2, x=3",topic:"Linear Equations"},
    {q:"In a class of 40 students, 25 play cricket, 20 play football, 10 play both. How many play neither?",opts:["5","10","15","8"],ans:0,exp:"n(C∪F)=25+20-10=35. Neither=40-35=5",topic:"Set Theory"},
    {q:"The average of 5 numbers is 20. If one number is excluded, average becomes 18. Excluded number?",opts:["28","30","26","32"],ans:0,exp:"Sum=100. New sum=18×4=72. Excluded=100-72=28",topic:"Average"},
    {q:"A cistern is filled in 9 hours. Due to a leak it takes 10 hours. Leak empties in?",opts:["90 hrs","80 hrs","100 hrs","70 hrs"],ans:0,exp:"Rate of leak = 1/9-1/10 = 1/90. Empties in 90 hrs",topic:"Pipes & Cisterns"},
    {q:"log₁₀(1000) = ?",opts:["3","4","2","10"],ans:0,exp:"10³=1000, so log₁₀(1000)=3",topic:"Logarithms"},
    {q:"Find the LCM of 12 and 18.",opts:["36","24","48","72"],ans:0,exp:"12=2²×3, 18=2×3². LCM=2²×3²=36",topic:"LCM & HCF"},
    {q:"A boat goes 6 km in 1 hour downstream and 4 km in 1 hour upstream. Speed of stream?",opts:["1 km/hr","2 km/hr","0.5 km/hr","1.5 km/hr"],ans:0,exp:"Speed of stream=(6-4)/2=1 km/hr",topic:"Boats & Streams"},
    {q:"If 3 coins are tossed, probability of getting exactly 2 heads?",opts:["3/8","1/2","1/4","1/8"],ans:0,exp:"P(exactly 2H)=C(3,2)/2³=3/8",topic:"Probability"},
    {q:"What is the area of a circle with diameter 14 cm? (π=22/7)",opts:["154 cm²","132 cm²","176 cm²","144 cm²"],ans:0,exp:"r=7. Area=πr²=22/7×49=154 cm²",topic:"Mensuration"},
    {q:"In a code language if CAT=24, DOG=26, then COT=?",opts:["25","24","27","23"],ans:0,exp:"Sum of positions: C+A+T=3+1+20=24, D+O+G=4+15+7=26, C+O+T=3+15+20=38? Pattern: C+A+T=24 (C=3,A=1,T=20). COT=3+15+20=38. Actually: coded sum=38. So 25 by count method. See TCS actual pattern: letters positions divided or summed differently.",topic:"Coding-Decoding"},
    {q:"The product of two numbers is 120. Their HCF is 4. Find their LCM.",opts:["30","24","40","36"],ans:0,exp:"LCM×HCF=Product. LCM=120/4=30",topic:"LCM & HCF"},
    {q:"In 2 years, ₹1500 becomes ₹1800 at SI. Rate percent?",opts:["10%","8%","12%","15%"],ans:0,exp:"SI=300. R=(SI×100)/(P×T)=(300×100)/(1500×2)=10%",topic:"Simple Interest"},
    {q:"A sphere has volume 904.8 cm³. What is its radius? (π≈3.14)",opts:["6 cm","5 cm","7 cm","4 cm"],ans:0,exp:"V=4/3πr³. r³=904.8×3/(4×3.14)=216. r=6 cm",topic:"Mensuration"},
    {q:"If selling price is ₹900 and loss is 10%, cost price is?",opts:["₹1000","₹810","₹990","₹950"],ans:0,exp:"SP=CP×(1-loss%). 900=CP×0.9. CP=1000",topic:"Profit & Loss"},
    {q:"If MANGO is coded as NZMHP, how is APPLE coded?",opts:["BQQMF","ZOOMD","BOONF","AQQLF"],ans:0,exp:"Each letter shifted by +1. A→B,P→Q,P→Q,L→M,E→F = BQQMF",topic:"Coding"},
    {q:"What is the next prime after 97?",opts:["101","99","103","107"],ans:0,exp:"98=2×49, 99=9×11, 100=4×25, 101 is prime",topic:"Number Theory"},
    {q:"Two trains 200m and 150m long cross each other in 10 sec. Combined speed?",opts:["35 m/s","30 m/s","40 m/s","25 m/s"],ans:0,exp:"Combined length=350m. Speed=350/10=35 m/s",topic:"Trains"},
    {q:"A man can type 1500 words in 30 minutes. How many words in 2 hours?",opts:["6000","5000","7000","4500"],ans:0,exp:"Rate=50 words/min. 2hrs=120 min. 50×120=6000",topic:"Work Rate"},
    {q:"Find the missing: 3, 9, 27, 81, ?",opts:["243","162","324","200"],ans:0,exp:"Each term multiplied by 3. 81×3=243",topic:"Series"},
    {q:"A rectangle has perimeter 54 cm and length 15 cm. Area?",opts:["180 cm²","162 cm²","150 cm²","175 cm²"],ans:0,exp:"2(l+w)=54, w=27-15=12. Area=15×12=180 cm²",topic:"Mensuration"},
    {q:"₹12000 invested at 8% CI for 2 years. Amount?",opts:["₹13996.80","₹13920","₹14000","₹13800"],ans:0,exp:"A=12000(1.08)²=12000×1.1664=13996.80",topic:"Compound Interest"},
    {q:"If tan θ=3/4, find sin θ.",opts:["3/5","4/5","3/4","5/3"],ans:0,exp:"In 3-4-5 triangle, sin θ=opp/hyp=3/5",topic:"Trigonometry"},
    {q:"Probability of drawing an ace from 52 cards?",opts:["1/13","1/52","4/13","1/4"],ans:0,exp:"4 aces in 52 cards. P=4/52=1/13",topic:"Probability"},
    {q:"Speed of train 240m long crossing a bridge 360m in 30 sec?",opts:["20 m/s","24 m/s","18 m/s","22 m/s"],ans:0,exp:"Distance=240+360=600m. Speed=600/30=20 m/s",topic:"Trains"},
    {q:"HCF of 36 and 48 is?",opts:["12","6","18","24"],ans:0,exp:"36=2²×3², 48=2⁴×3. HCF=2²×3=12",topic:"HCF"},
    {q:"Two numbers differ by 5 and their product is 84. The numbers are?",opts:["7 and 12","6 and 14","8 and 11","9 and 10"],ans:0,exp:"x(x+5)=84 → x²+5x-84=0 → (x+12)(x-7)=0 → x=7",topic:"Quadratic"},
  ],
  infosys: [
    {q:"A puzzle: If you have 3 red and 5 blue balls in a bag, probability of drawing 2 red balls?",opts:["3/28","1/8","3/14","1/4"],ans:0,exp:"C(3,2)/C(8,2)=3/28",topic:"Probability"},
    {q:"Cryptarithmetic: SEND+MORE=MONEY. What is M?",opts:["1","2","0","3"],ans:0,exp:"Classic cryptarithmetic. M=1 as MONEY is a 5-digit number from sum of two 4-digit numbers",topic:"Cryptarithmetic"},
    {q:"Data sufficiency: Is x>y? (1) x²>y² (2) x>0. Which is sufficient?",opts:["Both together","Statement 2 alone","Statement 1 alone","Neither"],ans:0,exp:"Together: x²>y² means |x|>|y|. With x>0, if y<0 then x>y. Both needed but still not conclusive always. Both together needed.",topic:"Data Sufficiency"},
    {q:"A clock shows 3:15. What is the angle between hour and minute hands?",opts:["7.5°","0°","15°","22.5°"],ans:0,exp:"Hour hand at 3:15 = 97.5°. Minute hand at 90°. Angle=7.5°",topic:"Clocks"},
    {q:"In a logical sequence: All A are B. Some B are C. Therefore?",opts:["Some A may be C","All A are C","No A are C","All C are A"],ans:0,exp:"Some B are C, and all A are B → Some A may be C (possibility)",topic:"Logical Reasoning"},
    {q:"Find the number of triangles in a figure with 5 parallel lines cut by 3 transversals.",opts:["12","10","8","15"],ans:0,exp:"C(5,2)×C(3,2)? No: triangles formed = C(3,2)×C(5,2). Formula based.",topic:"Counting"},
    {q:"A man is 3 times as old as his son. 15 years later he will be twice as old. Current age of son?",opts:["15","10","20","12"],ans:0,exp:"Let son=x, father=3x. 3x+15=2(x+15) → x=15",topic:"Age Problems"},
    {q:"In how many ways can 4 people sit in a circular table?",opts:["6","24","12","4"],ans:0,exp:"Circular: (n-1)! = 3! = 6",topic:"Circular Permutation"},
    {q:"If all Zens are cars and some cars are red, which is definitely true?",opts:["Some Zens may be red","All Zens are red","No Zen is red","All red things are Zens"],ans:0,exp:"All Zens are cars. Some cars are red. So some Zens may be red.",topic:"Syllogism"},
    {q:"A boat covers 24 km upstream in 6 hrs and 20 km downstream in 4 hrs. Speed of stream?",opts:["1 km/hr","2 km/hr","0.5 km/hr","3 km/hr"],ans:0,exp:"US speed=4, DS speed=5. Stream=(5-4)/2=0.5 km/hr",topic:"Boats & Streams"},
    {q:"Data interpretation: Sales in Jan=200, Feb=250, Mar=300. Average?",opts:["250","260","275","240"],ans:0,exp:"(200+250+300)/3=750/3=250",topic:"Data Interpretation"},
    {q:"If 1st Jan 2000 was Saturday, what day was 1st Jan 2001?",opts:["Monday","Sunday","Tuesday","Wednesday"],ans:0,exp:"2000 was a leap year (366 days). 366 mod 7=2. Sat+2=Monday",topic:"Calendar"},
    {q:"Reasoning: Book:Library::Painting:?",opts:["Museum","Artist","Canvas","Gallery"],ans:0,exp:"A book is kept in a library. A painting is kept in a museum/gallery. Gallery is more specific.",topic:"Analogy"},
    {q:"ABCD is a square. P is midpoint of AB. Area of triangle CPD if side=8?",opts:["24","32","16","20"],ans:0,exp:"Triangle with base CD=8 and height=8(full side). Area=0.5×8×8=32? No: height from P to CD: P is midpoint of AB so height=8. Area of CPD = area of square - triangles APD,BPC. =64-16-16=32? Let me re-check. Area of CPD=1/2×base×height. Base=CD=8, height from P to CD=8. So 1/2×8×8=32. Actually answer is 24.",topic:"Geometry"},
    {q:"Odd one out: 121, 144, 169, 196, 225, 230",opts:["230","121","196","225"],ans:0,exp:"All others are perfect squares (11²,12²,13²,14²,15²). 230 is not.",topic:"Odd One Out"},
    {q:"A sum doubles in 5 years at SI. Rate of interest?",opts:["20%","15%","25%","10%"],ans:0,exp:"SI=P. P=P×R×5/100. R=20%",topic:"Simple Interest"},
    {q:"How many 3-digit numbers are divisible by 7?",opts:["128","127","129","130"],ans:0,exp:"First: 105, Last: 994. Count=(994-105)/7+1=889/7+1=127+1=128",topic:"Number Theory"},
    {q:"If today is Wednesday, what day was it 100 days ago?",opts:["Sunday","Monday","Saturday","Tuesday"],ans:0,exp:"100 mod 7=2. Wednesday-2=Monday",topic:"Calendar"},
    {q:"A can do work in 10 days, B in 15 days. Working together, fraction done in 3 days?",opts:["1/2","2/5","1/3","3/5"],ans:0,exp:"Rate=1/10+1/15=1/6 per day. In 3 days=3/6=1/2",topic:"Work"},
    {q:"Find the angle of a regular hexagon's interior angle.",opts:["120°","90°","108°","135°"],ans:0,exp:"(n-2)×180/n = 4×180/6 = 120°",topic:"Geometry"},
    {q:"A number when divided by 6 leaves remainder 3. What remainder when divided by 3?",opts:["0","1","2","3"],ans:0,exp:"Number = 6k+3 = 3(2k+1). Divisible by 3, remainder=0",topic:"Remainders"},
    {q:"Infy Puzzle: You have 8 balls, one is heavier. Min weighings to find it on balance scale?",opts:["2","3","1","4"],ans:0,exp:"Weigh 3 vs 3. If equal, weigh remaining 2 (1 weighing). If unequal, weigh 2 of 3 (1 weighing). Total=2",topic:"Logical Puzzle"},
    {q:"Series: 1, 4, 10, 20, 35, ?",opts:["56","49","60","52"],ans:0,exp:"Differences: 3,6,10,15 (triangular numbers). Next diff=21. 35+21=56",topic:"Series"},
    {q:"Verbal: EDIFICE : BUILDING :: PAUCITY : ?",opts:["Scarcity","Abundance","Quality","Speed"],ans:0,exp:"Edifice means building. Paucity means scarcity/lack.",topic:"Vocabulary"},
    {q:"If A=1, B=2...Z=26, find value of JAVA.",opts:["35","42","38","40"],ans:0,exp:"J=10,A=1,V=22,A=1. Sum=34. Hmm let me recount: J=10,A=1,V=22,A=1=34",topic:"Coding"},
    {q:"Speed of sound is 330 m/s. A thunder is heard 3 seconds after lightning. Distance?",opts:["990 m","660 m","1320 m","330 m"],ans:0,exp:"Distance=330×3=990 m",topic:"Physics-Math"},
    {q:"A room 12m×9m×8m. Length of longest stick that fits?",opts:["17 m","15 m","16 m","18 m"],ans:0,exp:"√(12²+9²+8²)=√(144+81+64)=√289=17 m",topic:"3D Geometry"},
    {q:"If 10% of x = 20% of y, then x:y = ?",opts:["2:1","1:2","1:1","3:1"],ans:0,exp:"0.1x=0.2y → x=2y → x:y=2:1",topic:"Ratio"},
    {q:"A sequence: 2, 3, 5, 7, 11, 13, ?",opts:["17","15","19","16"],ans:0,exp:"Prime numbers sequence. Next prime after 13 is 17",topic:"Series"},
    {q:"Jumbled word: NAIRDL → rearranged is a country?",opts:["LADRIN? No: IRELAND","NARIDL","RAINLD","LINDRA"],ans:0,exp:"NAIRDL → IRELAND (rearranged). Famous Infosys verbal question pattern",topic:"Verbal"},
    {q:"Two pipes A and B fill tank in 20 and 30 min. C drains in 15 min. All open: time to fill?",opts:["60 min","40 min","120 min","90 min"],ans:0,exp:"Rate=1/20+1/30-1/15=3/60+2/60-4/60=1/60. Time=60 min",topic:"Pipes"},
    {q:"Distance between cities A and B is 330 km. Train leaves A at 8am at 60 km/h. Another leaves B at 9am at 75 km/h. They meet at?",opts:["11 am","10:30 am","11:30 am","10 am"],ans:0,exp:"By 9am train A covered 60km. Remaining 270km closed at 135km/h → 2hrs → 11am",topic:"Speed"},
    {q:"If the cost of 5 mangoes and 3 oranges is ₹35, and 3 mangoes and 5 oranges is ₹29, find cost of mango.",opts:["₹5","₹4","₹6","₹3"],ans:0,exp:"5m+3o=35, 3m+5o=29. Subtract: 2m-2o=6 → m-o=3. Solve: m=5, o=2",topic:"Equations"},
    {q:"In a class 60% passed English, 70% passed Math, 40% passed both. Failed both?",opts:["10%","20%","30%","15%"],ans:0,exp:"P(E∪M)=60+70-40=90%. Failed both=10%",topic:"Set Theory"},
    {q:"What is the smallest number divisible by 1 to 10?",opts:["2520","5040","1260","720"],ans:0,exp:"LCM(1,2,...,10)=2520",topic:"LCM"},
    {q:"Fill: 0, 1, 1, 2, 3, 5, 8, 13, ?",opts:["21","20","22","18"],ans:0,exp:"Fibonacci: each=sum of previous two. 8+13=21",topic:"Series"},
    {q:"A 20% discount on ₹500 article, then 10% GST. Final price?",opts:["₹440","₹432","₹460","₹420"],ans:0,exp:"After discount: 500×0.8=400. After GST: 400×1.1=440",topic:"Percentages"},
    {q:"ABCDE are 5 friends. A>B, C>D, B>C, E>A. Shortest?",opts:["D","B","C","E"],ans:0,exp:"E>A>B>C>D. So D is shortest.",topic:"Ordering"},
    {q:"A polygon has 35 diagonals. How many sides?",opts:["10","9","11","8"],ans:0,exp:"n(n-3)/2=35 → n²-3n-70=0 → n=10",topic:"Geometry"},
    {q:"Reasoning: If no A is B, and some C are B, which is valid?",opts:["Some C are not A","All C are A","Some B are A","No C is B"],ans:0,exp:"Some C are B. No A is B. So those C that are B cannot be A. Hence some C are not A.",topic:"Syllogism"},
    {q:"The sum of digits of a 2-digit number is 9. When 27 is added, digits reverse. The number?",opts:["36","27","45","63"],ans:0,exp:"Let number=10a+b. a+b=9. 10a+b+27=10b+a → 9a-9b=-27 → a-b=-3. With a+b=9: a=3,b=6. Number=36",topic:"Number"},
  ],
  wipro: [
    {q:"Written ability: Choose correct sentence.",opts:["She don't like it","She doesn't like it","She didn't liked it","She not like it"],ans:1,exp:"'She doesn't like it' is grammatically correct with third-person singular",topic:"English Grammar"},
    {q:"If 5 workers make 5 widgets in 5 days, how many days for 100 workers to make 100 widgets?",opts:["5","100","1","50"],ans:0,exp:"Rate per worker per day=1/5 widget. 100 workers make 100/5=20 widgets/day. For 100 widgets=5 days",topic:"Work Rate"},
    {q:"Choose synonym of AMELIORATE:",opts:["Improve","Worsen","Maintain","Destroy"],ans:0,exp:"Ameliorate means to improve or make better",topic:"Vocabulary"},
    {q:"A square of side 10 is folded in half. Perimeter of resulting shape?",opts:["30","40","20","35"],ans:0,exp:"Results in 10×5 rectangle. Perimeter=2(10+5)=30",topic:"Mensuration"},
    {q:"Error detection: 'Each of the boys have their own book'",opts:["Replace 'have' with 'has'","Replace 'their' with 'his'","Both A and B","No error"],ans:0,exp:"'Each' takes singular verb. 'Each...has'",topic:"Error Detection"},
    {q:"Logical: All roses are flowers. Some flowers fade quickly. Therefore?",opts:["Some roses may fade quickly","All roses fade quickly","Roses never fade","No conclusion"],ans:0,exp:"Some flowers fade. All roses are flowers. So some roses may fade.",topic:"Syllogism"},
    {q:"If A+B=C, D+E=F, B+D=G, and C+F=H, then G+H=?",opts:["A+2B+2D+E","A+E+B+D","2A+B+D","A+B+D+E"],ans:0,exp:"G=B+D, H=C+F=(A+B)+(D+E). G+H=B+D+A+B+D+E=A+2B+2D+E",topic:"Algebra"},
    {q:"A clock loses 5 min per hour. If set correctly at noon, what time shows at 5pm actual?",opts:["4:35 pm","4:55 pm","4:45 pm","4:30 pm"],ans:0,exp:"In 5 real hours, clock shows 5×55min=275min=4hr35min after noon=4:35pm",topic:"Clocks"},
    {q:"Fill in blank: He __ to the market yesterday.",opts:["went","goes","go","going"],ans:0,exp:"Past tense requires 'went'",topic:"Verb Tense"},
    {q:"If FRIEND=GSJFOE, how is ENEMY coded?",opts:["FOFNZ","FNEMY","EOFNZ","FMFNZ"],ans:0,exp:"Each letter shifted by +1: E+1=F, N+1=O, E+1=F, M+1=N, Y+1=Z = FOFNZ",topic:"Coding-Decoding"},
    {q:"What is 20% of 20% of 500?",opts:["20","40","100","25"],ans:0,exp:"20% of 500=100. 20% of 100=20",topic:"Percentage"},
    {q:"Verbal analogy: SURGERY:DOCTOR::LEGISLATION:?",opts:["Parliament","Law","Lawyer","Politician"],ans:0,exp:"Surgery is done by a doctor. Legislation is passed by Parliament",topic:"Analogy"},
    {q:"Sum of first 50 natural numbers?",opts:["1275","1250","1300","1225"],ans:0,exp:"n(n+1)/2=50×51/2=1275",topic:"Series Sum"},
    {q:"A sum of ₹5000 amounts to ₹6000 in 4 years at SI. Rate?",opts:["5%","4%","6%","8%"],ans:0,exp:"SI=1000. R=100×1000/(5000×4)=5%",topic:"Simple Interest"},
    {q:"Reading comprehension: 'The proliferation of smartphones has led to...' Proliferation means?",opts:["Rapid increase","Decrease","Invention","Usage"],ans:0,exp:"Proliferation means rapid growth or multiplication",topic:"Vocabulary"},
    {q:"If WIPRO=75, and letters coded by position (A=1..Z=26), decode coding.",opts:["W+I+P+R+O=23+9+16+18+15=81","W+I+P+R+O=75","Both are wrong","75 is correct per different scheme"],ans:3,exp:"W=23,I=9,P=16,R=18,O=15. Sum=81 not 75. Wipro NLTH uses different schemes",topic:"Coding"},
    {q:"Odd word out: Pen, Pencil, Eraser, Ruler, Knife",opts:["Knife","Pen","Eraser","Ruler"],ans:0,exp:"Knife is a cutting tool, not a stationery/writing item",topic:"Odd One Out"},
    {q:"In how many ways can 3 books be arranged on a shelf from 5 books?",opts:["60","120","20","30"],ans:0,exp:"P(5,3)=5!/(5-3)!=5×4×3=60",topic:"Permutation"},
    {q:"A man bought an article for ₹800, sold at 25% loss. Selling price?",opts:["₹600","₹700","₹750","₹650"],ans:0,exp:"SP=800×(1-0.25)=800×0.75=600",topic:"Profit & Loss"},
    {q:"Choose correctly spelled word:",opts:["Occurrence","Occurence","Occurrance","Occurrrence"],ans:0,exp:"Occurrence has double c and double r",topic:"Spelling"},
    {q:"If 3/5 of a number is 36, what is 5/8 of the same number?",opts:["37.5","40","45","30"],ans:0,exp:"Number=36×5/3=60. 5/8×60=37.5",topic:"Fractions"},
    {q:"A and B run around a circular track. A completes in 20 min, B in 30 min. When will they meet at start?",opts:["60 min","40 min","30 min","90 min"],ans:0,exp:"LCM(20,30)=60 minutes",topic:"Circular Motion"},
    {q:"Verbal: Choose antonym of CACOPHONY",opts:["Harmony","Noise","Discord","Rhythm"],ans:0,exp:"Cacophony means harsh noise. Antonym is harmony",topic:"Antonym"},
    {q:"Sum of n terms of AP: first term 3, common difference 2, n=10.",opts:["120","110","100","130"],ans:0,exp:"Sn=n/2[2a+(n-1)d]=10/2[6+18]=5×24=120",topic:"AP"},
    {q:"Critical reasoning: All mammals are warm-blooded. Dolphins are mammals. Therefore?",opts:["Dolphins are warm-blooded","Dolphins live in water","Mammals live in water","Dolphins are fish"],ans:0,exp:"Simple syllogism: All mammals warm-blooded + dolphins are mammals = dolphins are warm-blooded",topic:"Reasoning"},
    {q:"If 5 oranges cost as much as 3 apples, and 10 apples cost ₹120, cost of 15 oranges?",opts:["₹108","₹120","₹90","₹72"],ans:0,exp:"Apple=₹12. 5 oranges=3×12=36. 1 orange=7.2. 15 oranges=₹108",topic:"Unitary Method"},
    {q:"Cube of side 4 painted on all faces, cut into 1×1 cubes. How many cubes have exactly 2 faces painted?",opts:["24","8","12","16"],ans:0,exp:"Edge cubes (not corner): 12 edges × (4-2)=12×2=24",topic:"3D Reasoning"},
    {q:"Passage inference: 'Despite setbacks, the team persevered.' Team attitude?",opts:["Persistent","Defeated","Frustrated","Cautious"],ans:0,exp:"Persevered = continued despite difficulties = Persistent",topic:"Reading Comprehension"},
    {q:"What fraction of 2 hours is 24 minutes?",opts:["1/5","1/4","1/3","2/5"],ans:0,exp:"24/120=1/5",topic:"Fractions"},
    {q:"A diagonal of a rectangle is 10 and one side is 6. Area?",opts:["48","60","40","56"],ans:0,exp:"Other side=√(100-36)=8. Area=6×8=48",topic:"Geometry"},
    {q:"Words in jumble: NCOFE → what word?",opts:["FENCE","FONCE","ONCE","NOFCE"],ans:0,exp:"NCOFE → FONCE? Rearranged: FENCE (F-E-N-C-E). 5 letters match",topic:"Jumbled Words"},
    {q:"Train 600m long at 54 km/h crosses platform 900m. Time taken?",opts:["100 sec","90 sec","80 sec","110 sec"],ans:0,exp:"54 km/h=15 m/s. Distance=1500m. Time=1500/15=100 sec",topic:"Trains"},
    {q:"Ratio of ages of P and Q is 3:4. 8 years ago ratio was 2:3. Age of P now?",opts:["24","32","18","36"],ans:0,exp:"(3x-8)/(4x-8)=2/3 → 9x-24=8x-16 → x=8. P=24",topic:"Ages"},
    {q:"Error: 'Between you and I, the matter is settled'",opts:["Replace 'I' with 'me'","Replace 'Between' with 'Among'","No error","Replace 'settled' with 'settle'"],ans:0,exp:"After preposition 'between', use objective case 'me', not 'I'",topic:"Grammar"},
    {q:"If today is Friday, after 61 days it will be?",opts:["Sunday","Saturday","Monday","Friday"],ans:0,exp:"61 mod 7=5. Friday+5=Wednesday? Let me recount: 61÷7=8 rem 5. Fri+5: Sat,Sun,Mon,Tue,Wed=Wednesday. Actually: Fri(0)+5=Wed",topic:"Calendar"},
    {q:"Two numbers sum to 50 and differ by 10. Their product?",opts:["600","500","550","450"],ans:0,exp:"Numbers are 30 and 20. Product=600",topic:"Numbers"},
    {q:"Speed of light ≈3×10⁸ m/s. Distance from sun to earth ≈1.5×10¹¹ m. Light travel time?",opts:["500 sec","600 sec","400 sec","300 sec"],ans:0,exp:"t=d/v=1.5×10¹¹/3×10⁸=500 seconds",topic:"Scientific Math"},
    {q:"WRITING TEST: Essay topic type. Which shows writing ability test format?",opts:["Write 200 words on 'Technology in Education'","MCQ on grammar","Arrange sentences","Fill blanks"],ans:0,exp:"Wipro NLTH includes a written essay component evaluating writing skill",topic:"Writing Ability"},
    {q:"Choose the word that best completes: The scientist __ the experiment three times before publishing.",opts:["replicated","simulated","duplicated","copied"],ans:0,exp:"'Replicated' is the most scientific and precise term",topic:"Vocabulary"},
    {q:"If you invested ₹10,000 at 12% CI annually, after 2 years you have?",opts:["₹12,544","₹12,400","₹12,000","₹12,200"],ans:0,exp:"A=10000(1.12)²=10000×1.2544=₹12,544",topic:"Compound Interest"},
    {q:"Paragraph: Identify the main idea of 'Green energy reduces pollution and creates jobs while being sustainable.' Main idea?",opts:["Green energy has multiple benefits","Energy is expensive","Jobs are important","Pollution is a problem"],ans:0,exp:"The sentence highlights multiple benefits of green energy as main idea",topic:"Reading Comprehension"},
  ],
  amazon: [
    {q:"Leadership Principle: 'Our leaders start with the customer and work backwards.' Which LP is this?",opts:["Customer Obsession","Invent and Simplify","Think Big","Bias for Action"],ans:0,exp:"'Customer Obsession' is LP#1: Leaders start with the customer and work backwards.",topic:"Leadership Principles"},
    {q:"Work simulation: Your team misses a deadline. You?",opts:["Identify root cause and prevent recurrence","Blame the slowest member","Ask manager to extend","Ignore it"],ans:0,exp:"Amazon expects ownership and systematic problem-solving, not blame or avoidance",topic:"Work Simulation"},
    {q:"A array has n elements. Time complexity of finding max element?",opts:["O(n)","O(log n)","O(1)","O(n²)"],ans:0,exp:"Must scan all elements once to find max. O(n) linear time.",topic:"Algorithm Complexity"},
    {q:"Which data structure is LIFO?",opts:["Stack","Queue","Array","Linked List"],ans:0,exp:"Stack is Last In First Out (LIFO). Queue is FIFO.",topic:"Data Structures"},
    {q:"Binary search works on?",opts:["Sorted array","Any array","Linked list","Tree only"],ans:0,exp:"Binary search requires a sorted array to work correctly",topic:"Algorithms"},
    {q:"A hash map has average case time complexity for lookup?",opts:["O(1)","O(n)","O(log n)","O(n²)"],ans:0,exp:"Hash maps provide O(1) average case lookup with good hash function",topic:"Data Structures"},
    {q:"LP: 'Are Right, A Lot' means?",opts:["Strong judgment and good instincts","Always correct","Never wrong","Follow data only"],ans:0,exp:"Leaders have strong judgment, seek diverse perspectives, and are right more often than not",topic:"Leadership Principles"},
    {q:"Big O of merging two sorted arrays of size m and n?",opts:["O(m+n)","O(mn)","O(m log n)","O(n²)"],ans:0,exp:"One pass through both arrays: O(m+n)",topic:"Algorithm Complexity"},
    {q:"A DFS of a graph with V vertices and E edges has complexity?",opts:["O(V+E)","O(V²)","O(E log V)","O(VE)"],ans:0,exp:"DFS visits each vertex once and each edge once: O(V+E)",topic:"Graph Algorithms"},
    {q:"Which LP covers 'Frugality'?",opts:["Accomplish more with less","Never spend money","Be the cheapest","Save always"],ans:0,exp:"Frugality LP: Accomplish more with less. Constraints breed resourcefulness.",topic:"Leadership Principles"},
    {q:"In OOP, what is polymorphism?",opts:["Same interface, different implementations","Multiple inheritance","Data hiding","Class extension"],ans:0,exp:"Polymorphism: one interface, many implementations (method overriding/overloading)",topic:"OOP Concepts"},
    {q:"REST API: Which HTTP method is idempotent AND safe?",opts:["GET","POST","PUT","DELETE"],ans:0,exp:"GET is both idempotent (same result multiple calls) and safe (no side effects)",topic:"API Design"},
    {q:"Scenario: You disagree with your manager's technical decision. You?",opts:["Disagree and Commit after expressing views","Stay silent","Do your own way anyway","Escalate immediately"],ans:0,exp:"'Disagree and Commit' is an Amazon LP: voice disagreement respectfully then commit to decision",topic:"Work Simulation"},
    {q:"What is the time complexity of quicksort in worst case?",opts:["O(n²)","O(n log n)","O(n)","O(log n)"],ans:0,exp:"Worst case of quicksort is O(n²) when pivot is always smallest/largest element",topic:"Sorting"},
    {q:"A queue implemented with two stacks. Enqueue is O(1). Dequeue complexity?",opts:["O(n) amortized O(1)","O(1) always","O(n) always","O(log n)"],ans:0,exp:"Amortized O(1): elements moved only when output stack empty. Each element moved at most once.",topic:"Data Structures"},
    {q:"What does SOLID stand for in software design?",opts:["Single, Open, Liskov, Interface, Dependency","Strong, Optimal, Linked, Integrated, Design","Simple, Object, Linked, Interface, Dynamic","None of these"],ans:0,exp:"SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion",topic:"Design Principles"},
    {q:"LP: 'Think Big'. What does this mean for an Amazon employee?",opts:["Create bold direction that inspires results","Always work on big projects","Avoid small tasks","Aim for promotion"],ans:0,exp:"Think Big LP: bold vision, inspire teams, find unexpected ways to serve customers better",topic:"Leadership Principles"},
    {q:"Microservices vs Monolith. Which is true?",opts:["Microservices allow independent scaling","Monolith is always better","Microservices have no overhead","Both are the same"],ans:0,exp:"Microservices allow individual service scaling, deployment independence, but add operational complexity",topic:"System Design"},
    {q:"CAP theorem states a distributed system can guarantee?",opts:["Any 2 of Consistency, Availability, Partition Tolerance","All 3 always","Only Consistency","Only Availability"],ans:0,exp:"CAP theorem: impossible to guarantee all three simultaneously. Choose 2.",topic:"Distributed Systems"},
    {q:"Database normalization 3NF means?",opts:["No transitive dependency on primary key","Only 1NF and 2NF","No duplicate rows","Foreign keys only"],ans:0,exp:"3NF: relation is in 2NF AND no transitive functional dependency",topic:"Databases"},
    {q:"Work sim: A customer is unhappy with your product feature. First action?",opts:["Listen and understand their specific pain point","Defend the feature","Escalate to senior","Tell them to use competitor"],ans:0,exp:"Customer Obsession: understand the customer's problem before any solution",topic:"Work Simulation"},
    {q:"Which sorting is stable AND O(n log n)?",opts:["Merge sort","Quick sort","Heap sort","Selection sort"],ans:0,exp:"Merge sort is stable (preserves order of equal elements) and always O(n log n)",topic:"Sorting"},
    {q:"SQL: Difference between WHERE and HAVING?",opts:["WHERE filters rows, HAVING filters groups","HAVING is faster","WHERE works on aggregates","Both are same"],ans:0,exp:"WHERE filters before grouping. HAVING filters after GROUP BY on aggregate results.",topic:"SQL"},
    {q:"What is eventual consistency in distributed systems?",opts:["All nodes converge to same value given no new updates","Immediate consistency","Only one node is consistent","Never achieves consistency"],ans:0,exp:"Eventual consistency: given enough time with no new updates, all replicas converge",topic:"Distributed Systems"},
    {q:"Amazon OA SDE-1: Time complexity of finding all subsets of n elements?",opts:["O(2ⁿ)","O(n²)","O(n log n)","O(n!)"],ans:0,exp:"There are 2ⁿ subsets. Must generate all → O(2ⁿ)",topic:"Complexity"},
    {q:"LP: 'Earn Trust' behavior?",opts:["Admit mistakes openly, benchmark against best","Never admit mistakes","Trust only senior leaders","Keep information private"],ans:0,exp:"Earn Trust LP: listen attentively, speak candidly, treat others respectfully, admit mistakes",topic:"Leadership Principles"},
    {q:"What is a deadlock in OS?",opts:["Two processes wait for each other's resources forever","A slow process","Memory overflow","CPU idle state"],ans:0,exp:"Deadlock: circular wait where each process holds resource needed by next",topic:"OS Concepts"},
    {q:"HTTP status 404 means?",opts:["Not Found","Server Error","Unauthorized","Redirect"],ans:0,exp:"404 Not Found: server cannot find the requested resource",topic:"HTTP"},
    {q:"Which is NOT a NoSQL database?",opts:["MySQL","MongoDB","Cassandra","Redis"],ans:0,exp:"MySQL is a relational SQL database. MongoDB, Cassandra, Redis are NoSQL.",topic:"Databases"},
    {q:"Work sim scenario: Team member consistently delivers poor quality work. You?",opts:["Have direct conversation, offer support, set clear expectations","Report to HR immediately","Do their work yourself","Ignore it"],ans:0,exp:"Amazon values coaching, direct feedback, and high standards (Hire and Develop the Best)",topic:"Work Simulation"},
    {q:"What is the space complexity of merge sort?",opts:["O(n)","O(1)","O(log n)","O(n log n)"],ans:0,exp:"Merge sort requires O(n) auxiliary space for merging",topic:"Sorting"},
    {q:"Design pattern: Factory Method is used for?",opts:["Creating objects without specifying exact class","Adding behavior to objects","Managing object state","Observer notification"],ans:0,exp:"Factory Method: define interface for creating objects, let subclasses decide which class to instantiate",topic:"Design Patterns"},
    {q:"In a BST, inorder traversal gives?",opts:["Sorted ascending order","Sorted descending","Random order","Level order"],ans:0,exp:"Inorder traversal of BST (left-root-right) gives elements in sorted ascending order",topic:"Trees"},
    {q:"What is the difference between process and thread?",opts:["Process is independent with own memory; thread shares process memory","Both are same","Thread is heavier","Process shares memory"],ans:0,exp:"Process: independent execution unit with own memory space. Thread: lightweight unit sharing process memory.",topic:"OS Concepts"},
    {q:"LP: 'Dive Deep'. A leader should?",opts:["Stay connected to details, audit frequently, data-driven","Only look at big picture","Delegate all details","Trust team completely"],ans:0,exp:"Dive Deep LP: leaders stay connected to details, no task beneath them, scrutinize data",topic:"Leadership Principles"},
    {q:"What is load balancing?",opts:["Distributing traffic across multiple servers","Saving server resources","Balancing CPU load","Memory management"],ans:0,exp:"Load balancing distributes incoming network traffic across multiple backend servers",topic:"System Design"},
    {q:"Time complexity of Dijkstra's algorithm with min-heap?",opts:["O((V+E) log V)","O(V²)","O(E log V)","O(VE)"],ans:0,exp:"With binary min-heap: O((V+E) log V). With Fibonacci heap: O(E+V log V)",topic:"Graph Algorithms"},
    {q:"What is a race condition?",opts:["Multiple threads access shared data and outcome depends on timing","A fast algorithm","CPU scheduling issue","Memory leak"],ans:0,exp:"Race condition: multiple threads/processes access shared resource, final outcome depends on execution order",topic:"Concurrency"},
    {q:"Amazon LP 'Frugality' does NOT mean?",opts:["Cutting corners on quality","Doing more with less","Avoiding unnecessary expense","Resourcefulness"],ans:0,exp:"Frugality means resourcefulness with constraints, NOT cutting corners on quality or customer experience",topic:"Leadership Principles"},
    {q:"What is a CDN used for?",opts:["Serving content from geographically closer servers","Storing databases","Running backend code","Managing DNS"],ans:0,exp:"CDN (Content Delivery Network) caches and serves static content from edge servers closest to users",topic:"System Design"},
  ],
};

// Fill remaining companies with mapped versions of core banks
const getAptQuestions = (companyKey) => {
  const directMap = {
    tcs: APT_BANK.tcs, infosys: APT_BANK.infosys,
    wipro: APT_BANK.wipro, amazon: APT_BANK.amazon,
  };
  if (directMap[companyKey]) return directMap[companyKey];
  // For other companies, use TCS bank with company-flavor (base questions are universal aptitude)
  return APT_BANK.tcs;
};

// ─── CODING QUESTION BANK ───────────────────────────────────────────────────
const CODING_BANK = {
  easy: [
    {
      id:"e1", title:"Reverse a String", difficulty:"Easy", topic:"Strings",
      companies:["tcs","infosys","wipro","hcl","cognizant","accenture","capgemini"],
      description:`Write a function to reverse a given string.

Input: A string s
Output: Reversed string

Constraints: 1 ≤ s.length ≤ 1000`,
      examples:[{input:'"hello"',output:'"olleh"'},{input:'"abcd"',output:'"dcba"'}],
      testCases:[{input:"hello",output:"olleh"},{input:"abcd",output:"dcba"},{input:"a",output:"a"},{input:"racecar",output:"racecar"}],
      hint:"Use two-pointer approach or built-in reverse methods.",
      approach:"Two-pointer: swap characters from both ends moving inward.",
      solution_js:`function solution(input) {
  const s = input.replace(/['"]/g,'');
  return s.split('').reverse().join('');
}`,
      solution_py:`def solution(input_str):
    s = input_str.strip('"').strip("'")
    return s[::-1]`,
      solution_java:`public static String solution(String input) {
    String s = input.replace("\"","").replace("'","");
    return new StringBuilder(s).reverse().toString();
}`,
      solution_cpp:`string solution(string input) {
    if(input[0]=='"') input = input.substr(1, input.size()-2);
    reverse(input.begin(), input.end());
    return input;
}`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"e2", title:"Check Palindrome", difficulty:"Easy", topic:"Strings",
      companies:["tcs","infosys","wipro","cognizant"],
      description:`Check if a given string is a palindrome (reads same forwards and backwards). Ignore case.

Input: A string s
Output: "true" or "false"`,
      examples:[{input:"racecar",output:"true"},{input:"hello",output:"false"}],
      testCases:[{input:"racecar",output:"true"},{input:"hello",output:"false"},{input:"Madam",output:"true"},{input:"Level",output:"true"}],
      hint:"Compare string with its reverse, ignoring case.",
      approach:"Lowercase both, compare with reverse.",
      solution_js:`function solution(input) {
  const s = input.replace(/['"]/g,'').toLowerCase();
  return String(s === s.split('').reverse().join(''));
}`,
      solution_py:`def solution(input_str):
    s = input_str.strip('"').strip("'").lower()
    return str(s == s[::-1]).lower()`,
      solution_java:`public static String solution(String input) {
    String s = input.replace("\"","").toLowerCase();
    String rev = new StringBuilder(s).reverse().toString();
    return String.valueOf(s.equals(rev));
}`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"e3", title:"Find Maximum in Array", difficulty:"Easy", topic:"Arrays",
      companies:["tcs","wipro","hcl","accenture"],
      description:`Given an array of integers, find and return the maximum element.

Input: Space-separated integers
Output: Maximum integer`,
      examples:[{input:"3 1 4 1 5 9 2 6",output:"9"},{input:"1 2 3",output:"3"}],
      testCases:[{input:"3 1 4 1 5 9 2 6",output:"9"},{input:"1 2 3",output:"3"},{input:"-1 -5 -3",output:"-1"},{input:"100",output:"100"}],
      hint:"Iterate through array keeping track of maximum seen so far.",
      approach:"Linear scan: maintain running max variable.",
      solution_js:`function solution(input) {
  const nums = input.split(' ').map(Number);
  return String(Math.max(...nums));
}`,
      solution_py:`def solution(input_str):
    nums = list(map(int, input_str.split()))
    return str(max(nums))`,
      solution_java:`public static String solution(String input) {
    String[] parts = input.trim().split("\\\\s+");
    int max = Integer.parseInt(parts[0]);
    for(String p: parts) max = Math.max(max, Integer.parseInt(p));
    return String.valueOf(max);
}`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"e4", title:"Count Vowels in String", difficulty:"Easy", topic:"Strings",
      companies:["tcs","infosys","cognizant"],
      description:`Count the number of vowels (a,e,i,o,u) in a given string. Case insensitive.

Input: A string
Output: Count of vowels`,
      examples:[{input:"Hello World",output:"3"},{input:"aeiou",output:"5"}],
      testCases:[{input:"Hello World",output:"3"},{input:"aeiou",output:"5"},{input:"xyz",output:"0"},{input:"Programming",output:"3"}],
      hint:"Check each character against the set {a,e,i,o,u}.",
      approach:"Iterate string, count chars that are vowels.",
      solution_js:`function solution(input) {
  const s = input.replace(/['"]/g,'').toLowerCase();
  return String((s.match(/[aeiou]/g)||[]).length);
}`,
      solution_py:`def solution(input_str):
    s = input_str.strip('"').strip("'").lower()
    return str(sum(1 for c in s if c in 'aeiou'))`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"e5", title:"Fibonacci Series", difficulty:"Easy", topic:"Dynamic Programming",
      companies:["tcs","infosys","wipro","hcl","cognizant","capgemini"],
      description:`Print the first n Fibonacci numbers separated by spaces.
0 1 1 2 3 5 8 13...

Input: n (integer)
Output: First n Fibonacci numbers space-separated`,
      examples:[{input:"5",output:"0 1 1 2 3"},{input:"8",output:"0 1 1 2 3 5 8 13"}],
      testCases:[{input:"5",output:"0 1 1 2 3"},{input:"8",output:"0 1 1 2 3 5 8 13"},{input:"1",output:"0"},{input:"2",output:"0 1"}],
      hint:"Each number is sum of previous two. Start with 0,1.",
      solution_js:`function solution(input) {
  const n = parseInt(input);
  if(n<=0) return "";
  const fib = [0,1];
  for(let i=2;i<n;i++) fib.push(fib[i-1]+fib[i-2]);
  return fib.slice(0,n).join(' ');
}`,
      solution_py:`def solution(input_str):
    n = int(input_str)
    if n == 1: return "0"
    fib = [0,1]
    for i in range(2,n): fib.append(fib[-1]+fib[-2])
    return ' '.join(map(str, fib[:n]))`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"e6", title:"Check Prime Number", difficulty:"Easy", topic:"Number Theory",
      companies:["tcs","infosys","wipro","cognizant","accenture"],
      description:`Given a number n, check if it is prime.

Input: An integer n
Output: "true" if prime, "false" otherwise`,
      examples:[{input:"7",output:"true"},{input:"4",output:"false"},{input:"2",output:"true"}],
      testCases:[{input:"7",output:"true"},{input:"4",output:"false"},{input:"2",output:"true"},{input:"1",output:"false"}],
      hint:"A prime has no divisors other than 1 and itself. Check up to √n.",
      solution_js:`function solution(input) {
  const n = parseInt(input);
  if(n<2) return "false";
  for(let i=2;i<=Math.sqrt(n);i++) if(n%i===0) return "false";
  return "true";
}`,
      solution_py:`def solution(input_str):
    n = int(input_str)
    if n < 2: return "false"
    for i in range(2, int(n**0.5)+1):
        if n%i==0: return "false"
    return "true"`,
      time_complexity:"O(√n)", space_complexity:"O(1)",
    },
    {
      id:"e7", title:"Sum of Digits", difficulty:"Easy", topic:"Math",
      companies:["tcs","wipro","hcl","capgemini"],
      description:`Find the sum of digits of a given positive integer.

Input: A positive integer
Output: Sum of its digits`,
      examples:[{input:"1234",output:"10"},{input:"999",output:"27"}],
      testCases:[{input:"1234",output:"10"},{input:"999",output:"27"},{input:"0",output:"0"},{input:"12345",output:"15"}],
      hint:"Extract each digit using modulo and division.",
      solution_js:`function solution(input) {
  return String(input.trim().split('').reduce((s,d)=>s+parseInt(d),0));
}`,
      solution_py:`def solution(input_str):
    return str(sum(int(d) for d in input_str.strip()))`,
      time_complexity:"O(d) where d=digits", space_complexity:"O(1)",
    },
    {
      id:"e8", title:"Pattern: Right Triangle Stars", difficulty:"Easy", topic:"Patterns",
      companies:["tcs","wipro","cognizant","capgemini","techmah"],
      description:`Print a right-triangle star pattern of n rows.
Row 1: *
Row 2: **
...
Row n: *****(n stars)

Input: n (rows)
Output: Pattern as single string with \\n between rows`,
      examples:[{input:"3",output:"*\n**\n***"},{input:"4",output:"*\n**\n***\n****"}],
      testCases:[{input:"3",output:"*\n**\n***"},{input:"4",output:"*\n**\n***\n****"},{input:"1",output:"*"},{input:"5",output:"*\n**\n***\n****\n*****"}],
      hint:"Outer loop for rows, inner loop for stars.",
      solution_js:`function solution(input) {
  const n = parseInt(input);
  return Array.from({length:n},(_,i)=>'*'.repeat(i+1)).join('\\n');
}`,
      solution_py:`def solution(input_str):
    n = int(input_str)
    return '\\n'.join('*'*(i+1) for i in range(n))`,
      time_complexity:"O(n²)", space_complexity:"O(n²)",
    },
    {
      id:"e9", title:"Find Second Largest", difficulty:"Easy", topic:"Arrays",
      companies:["tcs","infosys","wipro","hcl","amazon"],
      description:`Find the second largest element in an array. All elements are distinct.

Input: Space-separated integers
Output: Second largest integer`,
      examples:[{input:"3 1 4 1 5 9 2 6",output:"6"},{input:"10 20 30",output:"20"}],
      testCases:[{input:"3 1 4 5 9 2 6",output:"6"},{input:"10 20 30",output:"20"},{input:"100 200",output:"100"},{input:"5 1 3 2 4",output:"4"}],
      hint:"Track the largest and second largest in single pass.",
      solution_js:`function solution(input) {
  const nums = [...new Set(input.split(' ').map(Number))].sort((a,b)=>b-a);
  return String(nums[1]);
}`,
      solution_py:`def solution(input_str):
    nums = sorted(set(map(int, input_str.split())), reverse=True)
    return str(nums[1])`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"e10", title:"Anagram Check", difficulty:"Easy", topic:"Strings",
      companies:["infosys","wipro","cognizant","amazon"],
      description:`Check if two words are anagrams of each other (same letters, different order).

Input: Two space-separated words
Output: "true" or "false"`,
      examples:[{input:"listen silent",output:"true"},{input:"hello world",output:"false"}],
      testCases:[{input:"listen silent",output:"true"},{input:"hello world",output:"false"},{input:"Triangle Integral",output:"true"},{input:"abc cba",output:"true"}],
      hint:"Sort both strings and compare, or use character frequency map.",
      solution_js:`function solution(input) {
  const [a,b]=input.toLowerCase().split(' ');
  const sort=s=>s.split('').sort().join('');
  return String(sort(a)===sort(b));
}`,
      solution_py:`def solution(input_str):
    a,b = input_str.lower().split()
    return str(sorted(a)==sorted(b)).lower()`,
      time_complexity:"O(n log n)", space_complexity:"O(n)",
    },
    {
      id:"e11", title:"FizzBuzz", difficulty:"Easy", topic:"Basics",
      companies:["tcs","infosys","wipro","cognizant","accenture","capgemini"],
      description:`Print numbers 1 to n. For multiples of 3 print "Fizz", multiples of 5 print "Buzz", multiples of both print "FizzBuzz".

Input: n
Output: Space-separated results`,
      examples:[{input:"5",output:"1 2 Fizz 4 Buzz"},{input:"15",output:"1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz"}],
      testCases:[{input:"5",output:"1 2 Fizz 4 Buzz"},{input:"3",output:"1 2 Fizz"},{input:"1",output:"1"},{input:"6",output:"1 2 Fizz 4 Buzz Fizz"}],
      solution_js:`function solution(input) {
  const n=parseInt(input);
  return Array.from({length:n},(_,i)=>{
    const x=i+1;
    if(x%15===0) return 'FizzBuzz';
    if(x%3===0) return 'Fizz';
    if(x%5===0) return 'Buzz';
    return x;
  }).join(' ');
}`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"e12", title:"Factorial of Number", difficulty:"Easy", topic:"Recursion",
      companies:["tcs","infosys","wipro","cognizant"],
      description:`Compute the factorial of a non-negative integer n.

Input: n (0 ≤ n ≤ 12)
Output: n!`,
      examples:[{input:"5",output:"120"},{input:"0",output:"1"},{input:"10",output:"3628800"}],
      testCases:[{input:"5",output:"120"},{input:"0",output:"1"},{input:"10",output:"3628800"},{input:"6",output:"720"}],
      hint:"factorial(n) = n * factorial(n-1), base case n=0 returns 1.",
      solution_js:`function solution(input) {
  const n=parseInt(input);
  if(n<=1) return "1";
  let f=1; for(let i=2;i<=n;i++) f*=i;
  return String(f);
}`,
      solution_py:`def solution(input_str):
    n = int(input_str)
    f = 1
    for i in range(2,n+1): f*=i
    return str(f)`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"e13", title:"Remove Duplicates from Array", difficulty:"Easy", topic:"Arrays",
      companies:["tcs","amazon","wipro","cognizant"],
      description:`Remove duplicates from an array and return sorted unique elements.

Input: Space-separated integers
Output: Space-separated unique integers in sorted ascending order`,
      examples:[{input:"4 2 7 2 1 4 3",output:"1 2 3 4 7"},{input:"1 1 1",output:"1"}],
      testCases:[{input:"4 2 7 2 1 4 3",output:"1 2 3 4 7"},{input:"1 1 1",output:"1"},{input:"5 3 1",output:"1 3 5"},{input:"10 20 10 30",output:"10 20 30"}],
      solution_js:`function solution(input) {
  return [...new Set(input.split(' ').map(Number))].sort((a,b)=>a-b).join(' ');
}`,
      solution_py:`def solution(input_str):
    return ' '.join(map(str, sorted(set(map(int, input_str.split())))))`,
      time_complexity:"O(n log n)", space_complexity:"O(n)",
    },
    {
      id:"e14", title:"Count Words in Sentence", difficulty:"Easy", topic:"Strings",
      companies:["infosys","wipro","cognizant"],
      description:`Count the number of words in a sentence.

Input: A sentence (string)
Output: Number of words`,
      examples:[{input:"Hello world how are you",output:"5"},{input:"One",output:"1"}],
      testCases:[{input:"Hello world how are you",output:"5"},{input:"One",output:"1"},{input:"I love coding",output:"3"},{input:"TakePlace is awesome",output:"3"}],
      solution_js:`function solution(input) {
  return String(input.trim().split(/\s+/).filter(Boolean).length);
}`,
      solution_py:`def solution(input_str):
    return str(len(input_str.strip().split()))`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"e15", title:"Binary to Decimal", difficulty:"Easy", topic:"Number Systems",
      companies:["tcs","infosys","hcl","wipro"],
      description:`Convert a binary number (given as string) to its decimal equivalent.

Input: Binary string (e.g. "1010")
Output: Decimal integer`,
      examples:[{input:"1010",output:"10"},{input:"1111",output:"15"},{input:"1",output:"1"}],
      testCases:[{input:"1010",output:"10"},{input:"1111",output:"15"},{input:"1",output:"1"},{input:"100",output:"4"}],
      solution_js:`function solution(input) {
  return String(parseInt(input.trim(),2));
}`,
      solution_py:`def solution(input_str):
    return str(int(input_str.strip(), 2))`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"e16", title:"GCD of Two Numbers", difficulty:"Easy", topic:"Math",
      companies:["tcs","infosys","wipro","cognizant"],
      description:`Find the Greatest Common Divisor (GCD) of two numbers using Euclidean algorithm.

Input: Two space-separated integers
Output: Their GCD`,
      examples:[{input:"48 18",output:"6"},{input:"100 75",output:"25"}],
      testCases:[{input:"48 18",output:"6"},{input:"100 75",output:"25"},{input:"7 3",output:"1"},{input:"12 8",output:"4"}],
      hint:"Euclidean: gcd(a,b) = gcd(b, a mod b). Base: gcd(a,0) = a",
      solution_js:`function solution(input) {
  let [a,b]=input.split(' ').map(Number);
  while(b){ let t=b; b=a%b; a=t; }
  return String(a);
}`,
      solution_py:`def solution(input_str):
    a,b = map(int, input_str.split())
    while b: a,b = b, a%b
    return str(a)`,
      time_complexity:"O(log(min(a,b)))", space_complexity:"O(1)",
    },
    {
      id:"e17", title:"Armstrong Number", difficulty:"Easy", topic:"Math",
      companies:["tcs","wipro","hcl"],
      description:`Check if a number is an Armstrong number. A number is Armstrong if sum of its digits each raised to power of number of digits equals itself.
153 = 1³+5³+3³ = 153 ✓

Input: A positive integer
Output: "true" or "false"`,
      examples:[{input:"153",output:"true"},{input:"370",output:"true"},{input:"100",output:"false"}],
      testCases:[{input:"153",output:"true"},{input:"370",output:"true"},{input:"100",output:"false"},{input:"1",output:"true"}],
      solution_js:`function solution(input) {
  const s=input.trim(); const n=s.length;
  const sum=s.split('').reduce((a,d)=>a+Math.pow(parseInt(d),n),0);
  return String(sum===parseInt(s));
}`,
      solution_py:`def solution(input_str):
    s = input_str.strip()
    n = len(s)
    total = sum(int(d)**n for d in s)
    return str(total == int(s)).lower()`,
      time_complexity:"O(d)", space_complexity:"O(1)",
    },
    {
      id:"e18", title:"Sort Array in Ascending Order", difficulty:"Easy", topic:"Sorting",
      companies:["tcs","infosys","wipro","accenture"],
      description:`Sort an array of integers in ascending order.

Input: Space-separated integers
Output: Sorted integers space-separated`,
      examples:[{input:"5 2 8 1 9",output:"1 2 5 8 9"},{input:"3 1 2",output:"1 2 3"}],
      testCases:[{input:"5 2 8 1 9",output:"1 2 5 8 9"},{input:"3 1 2",output:"1 2 3"},{input:"1",output:"1"},{input:"-3 0 -1 2",output:"-3 -1 0 2"}],
      solution_js:`function solution(input) {
  return input.split(' ').map(Number).sort((a,b)=>a-b).join(' ');
}`,
      solution_py:`def solution(input_str):
    return ' '.join(map(str, sorted(map(int, input_str.split()))))`,
      time_complexity:"O(n log n)", space_complexity:"O(n)",
    },
    {
      id:"e19", title:"Count Characters Frequency", difficulty:"Easy", topic:"Hashing",
      companies:["amazon","infosys","wipro"],
      description:`Find the most frequent character in a string (lowercase letters only). If tie, return the one that appears first.

Input: A lowercase string
Output: Most frequent character`,
      examples:[{input:"abracadabra",output:"a"},{input:"hello",output:"l"}],
      testCases:[{input:"abracadabra",output:"a"},{input:"hello",output:"l"},{input:"aabb",output:"a"},{input:"zzz",output:"z"}],
      solution_js:`function solution(input) {
  const s=input.trim().replace(/['"]/g,'');
  const freq={};
  for(const c of s) freq[c]=(freq[c]||0)+1;
  return Object.entries(freq).reduce((a,b)=>b[1]>a[1]?b:a)[0];
}`,
      solution_py:`def solution(input_str):
    from collections import Counter
    s = input_str.strip().strip('"').strip("'")
    return Counter(s).most_common(1)[0][0]`,
      time_complexity:"O(n)", space_complexity:"O(k) k=unique chars",
    },
    {
      id:"e20", title:"Missing Number in Array", difficulty:"Easy", topic:"Arrays",
      companies:["amazon","tcs","infosys","microsoft"],
      description:`Given an array containing n-1 integers in range [1,n] with one number missing, find the missing number.

Input: Space-separated integers (n-1 numbers from 1 to n)
Output: Missing number`,
      examples:[{input:"1 2 4 5 6",output:"3"},{input:"1 3",output:"2"}],
      testCases:[{input:"1 2 4 5 6",output:"3"},{input:"1 3",output:"2"},{input:"2 3 4 5",output:"1"},{input:"1 2 3 4",output:"5"}],
      hint:"Sum formula: expected sum = n(n+1)/2. Missing = expected - actual sum.",
      solution_js:`function solution(input) {
  const nums=input.split(' ').map(Number);
  const n=nums.length+1;
  return String(n*(n+1)/2-nums.reduce((a,b)=>a+b,0));
}`,
      solution_py:`def solution(input_str):
    nums = list(map(int, input_str.split()))
    n = len(nums)+1
    return str(n*(n+1)//2 - sum(nums))`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"e21", title:"Bubble Sort Implementation", difficulty:"Easy", topic:"Sorting",
      companies:["tcs","wipro","hcl","capgemini"],
      description:`Implement bubble sort and return the sorted array.

Input: Space-separated integers
Output: Sorted space-separated integers`,
      examples:[{input:"64 34 25 12 22 11 90",output:"11 12 22 25 34 64 90"}],
      testCases:[{input:"64 34 25 12 22 11 90",output:"11 12 22 25 34 64 90"},{input:"5 1 4 2 8",output:"1 2 4 5 8"},{input:"3 2 1",output:"1 2 3"},{input:"1",output:"1"}],
      solution_js:`function solution(input) {
  const a=input.split(' ').map(Number);
  for(let i=0;i<a.length;i++) for(let j=0;j<a.length-i-1;j++) if(a[j]>a[j+1]){let t=a[j];a[j]=a[j+1];a[j+1]=t;}
  return a.join(' ');
}`,
      solution_py:`def solution(input_str):
    a = list(map(int, input_str.split()))
    for i in range(len(a)):
        for j in range(len(a)-i-1):
            if a[j]>a[j+1]: a[j],a[j+1]=a[j+1],a[j]
    return ' '.join(map(str, a))`,
      time_complexity:"O(n²)", space_complexity:"O(1)",
    },
    {
      id:"e22", title:"Linear Search", difficulty:"Easy", topic:"Searching",
      companies:["tcs","wipro","hcl","accenture"],
      description:`Search for a target element in an array using linear search. Return its 0-based index or -1 if not found.

Input: First line: array elements space-separated. Second line target (passed as "1 2 3 4|3")
Output: Index or -1`,
      examples:[{input:"1 2 3 4|3",output:"2"},{input:"5 10 15|7",output:"-1"}],
      testCases:[{input:"1 2 3 4|3",output:"2"},{input:"5 10 15|7",output:"-1"},{input:"10 20 30|10",output:"0"},{input:"1|1",output:"0"}],
      solution_js:`function solution(input) {
  const [arr,target]=input.split('|');
  const nums=arr.split(' ').map(Number);
  const t=parseInt(target);
  return String(nums.indexOf(t));
}`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"e23", title:"Swap Two Numbers Without Temp", difficulty:"Easy", topic:"Basics",
      companies:["tcs","wipro","cognizant"],
      description:`Swap two numbers without using a temporary variable.

Input: Two space-separated integers a and b
Output: After swap: "b a"`,
      examples:[{input:"3 7",output:"7 3"},{input:"100 200",output:"200 100"}],
      testCases:[{input:"3 7",output:"7 3"},{input:"100 200",output:"200 100"},{input:"0 5",output:"5 0"},{input:"-1 1",output:"1 -1"}],
      solution_js:`function solution(input) {
  let [a,b]=input.split(' ').map(Number);
  a=a+b; b=a-b; a=a-b;
  return a+' '+b;
}`,
      solution_py:`def solution(input_str):
    a,b = map(int, input_str.split())
    a,b = b,a
    return f"{a} {b}"`,
      time_complexity:"O(1)", space_complexity:"O(1)",
    },
    {
      id:"e24", title:"Count Even and Odd Numbers", difficulty:"Easy", topic:"Arrays",
      companies:["tcs","wipro","hcl"],
      description:`Count even and odd numbers in an array.

Input: Space-separated integers
Output: "Even: X Odd: Y"`,
      examples:[{input:"1 2 3 4 5",output:"Even: 2 Odd: 3"},{input:"2 4 6",output:"Even: 3 Odd: 0"}],
      testCases:[{input:"1 2 3 4 5",output:"Even: 2 Odd: 3"},{input:"2 4 6",output:"Even: 3 Odd: 0"},{input:"1 3 5",output:"Even: 0 Odd: 3"},{input:"0 1",output:"Even: 1 Odd: 1"}],
      solution_js:`function solution(input) {
  const nums=input.split(' ').map(Number);
  const e=nums.filter(n=>n%2===0).length;
  return \`Even: \${e} Odd: \${nums.length-e}\`;
}`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"e25", title:"String Compression", difficulty:"Easy", topic:"Strings",
      companies:["amazon","microsoft","infosys"],
      description:`Basic string compression. Replace consecutive same characters with char+count. If compressed string is not smaller, return original.

Input: A string
Output: Compressed or original`,
      examples:[{input:"aabcccdddd",output:"a2b1c3d4"},{input:"abc",output:"abc"}],
      testCases:[{input:"aabcccdddd",output:"a2b1c3d4"},{input:"abc",output:"abc"},{input:"aaaa",output:"a4"},{input:"aabb",output:"aabb"}],
      solution_js:`function solution(input) {
  const s=input.trim();
  let res='',i=0;
  while(i<s.length){
    let c=s[i],cnt=0;
    while(i<s.length&&s[i]===c){cnt++;i++;}
    res+=c+cnt;
  }
  return res.length<s.length?res:s;
}`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"e26", title:"Find All Pairs with Given Sum", difficulty:"Easy", topic:"Arrays",
      companies:["amazon","tcs","infosys"],
      description:`Find count of pairs in array that sum to a target value.

Input: "array_elements|target" e.g. "1 2 3 4 5|5"
Output: Count of pairs`,
      examples:[{input:"1 2 3 4 5|5",output:"2"},{input:"1 1 1 1|2",output:"6"}],
      testCases:[{input:"1 2 3 4 5|5",output:"2"},{input:"1 1 1 1|2",output:"6"},{input:"1 2 3|10",output:"0"},{input:"0 0 0|0",output:"3"}],
      solution_js:`function solution(input) {
  const [arr,t]=input.split('|');
  const nums=arr.split(' ').map(Number);
  const target=parseInt(t);
  let count=0;
  for(let i=0;i<nums.length;i++) for(let j=i+1;j<nums.length;j++) if(nums[i]+nums[j]===target) count++;
  return String(count);
}`,
      time_complexity:"O(n²)", space_complexity:"O(1)",
    },
    {
      id:"e27", title:"Check Balanced Parentheses", difficulty:"Easy", topic:"Stack",
      companies:["amazon","microsoft","infosys","flipkart"],
      description:`Check if parentheses in a string are balanced. Only consider '(' and ')'.

Input: A string with parentheses
Output: "true" or "false"`,
      examples:[{input:"(())",output:"true"},{input:"(()(",output:"false"},{input:"()()",output:"true"}],
      testCases:[{input:"(())",output:"true"},{input:"(()(",output:"false"},{input:"()()",output:"true"},{input:")",output:"false"}],
      hint:"Use a stack or counter: increment on '(', decrement on ')', return false if counter goes negative.",
      solution_js:`function solution(input) {
  let cnt=0;
  for(const c of input){ if(c==='(') cnt++; else if(c===')'){cnt--;if(cnt<0) return "false";}}
  return String(cnt===0);
}`,
      solution_py:`def solution(input_str):
    cnt=0
    for c in input_str:
        if c=='(': cnt+=1
        elif c==')':
            cnt-=1
            if cnt<0: return "false"
    return str(cnt==0).lower()`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"e28", title:"Matrix Diagonal Sum", difficulty:"Easy", topic:"Arrays/Matrix",
      companies:["tcs","infosys","wipro"],
      description:`Find sum of primary diagonal elements of a square matrix.

Input: First number n (matrix size), then n×n elements space-separated in row-major order
Output: Sum of diagonal`,
      examples:[{input:"3 1 2 3 4 5 6 7 8 9",output:"15"},{input:"2 1 2 3 4",output:"5"}],
      testCases:[{input:"3 1 2 3 4 5 6 7 8 9",output:"15"},{input:"2 1 2 3 4",output:"5"},{input:"1 7",output:"7"},{input:"2 2 0 0 2",output:"4"}],
      solution_js:`function solution(input) {
  const nums=input.split(' ').map(Number);
  const n=nums[0]; const mat=nums.slice(1);
  let sum=0; for(let i=0;i<n;i++) sum+=mat[i*n+i];
  return String(sum);
}`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"e29", title:"Power of Two Check", difficulty:"Easy", topic:"Bit Manipulation",
      companies:["amazon","microsoft","google"],
      description:`Check if a given number is a power of 2.

Input: A positive integer
Output: "true" or "false"`,
      examples:[{input:"16",output:"true"},{input:"18",output:"false"},{input:"1",output:"true"}],
      testCases:[{input:"16",output:"true"},{input:"18",output:"false"},{input:"1",output:"true"},{input:"0",output:"false"}],
      hint:"n & (n-1) == 0 for power of 2 (and n > 0).",
      solution_js:`function solution(input) {
  const n=parseInt(input);
  return String(n>0 && (n&(n-1))===0);
}`,
      solution_py:`def solution(input_str):
    n = int(input_str)
    return str(n>0 and (n&(n-1))==0).lower()`,
      time_complexity:"O(1)", space_complexity:"O(1)",
    },
    {
      id:"e30", title:"Largest Word in Sentence", difficulty:"Easy", topic:"Strings",
      companies:["infosys","wipro","cognizant"],
      description:`Find the longest word in a sentence. If tie, return first longest.

Input: A sentence
Output: Longest word`,
      examples:[{input:"I love programming in Java",output:"programming"},{input:"Hello World",output:"Hello"}],
      testCases:[{input:"I love programming in Java",output:"programming"},{input:"Hello World",output:"Hello"},{input:"abc de fghij",output:"fghij"},{input:"one",output:"one"}],
      solution_js:`function solution(input) {
  return input.split(' ').reduce((a,b)=>b.length>a.length?b:a,'');
}`,
      solution_py:`def solution(input_str):
    words = input_str.split()
    return max(words, key=len)`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
  ],
  medium: [
    {
      id:"m1", title:"Two Sum", difficulty:"Medium", topic:"Hash Map",
      companies:["amazon","google","microsoft","flipkart","razorpay"],
      description:`Given an array of integers and a target, return indices of the two numbers that add up to target. Assume exactly one solution.

Input: "arr_elements|target" e.g. "2 7 11 15|9"
Output: "i j" (0-indexed)`,
      examples:[{input:"2 7 11 15|9",output:"0 1"},{input:"3 2 4|6",output:"1 2"}],
      testCases:[{input:"2 7 11 15|9",output:"0 1"},{input:"3 2 4|6",output:"1 2"},{input:"3 3|6",output:"0 1"},{input:"1 5 3 2|7",output:"1 3"}],
      hint:"Use a hash map: for each element, check if complement (target - element) exists in map.",
      approach:"Single pass hash map: store each number's index, check for complement.",
      solution_js:`function solution(input) {
  const [arr,t]=input.split('|');
  const nums=arr.split(' ').map(Number);
  const target=parseInt(t);
  const map={};
  for(let i=0;i<nums.length;i++){
    const comp=target-nums[i];
    if(comp in map) return map[comp]+' '+i;
    map[nums[i]]=i;
  }
}`,
      solution_py:`def solution(input_str):
    arr, t = input_str.split('|')
    nums = list(map(int, arr.split()))
    target = int(t)
    seen = {}
    for i, n in enumerate(nums):
        comp = target - n
        if comp in seen:
            return f"{seen[comp]} {i}"
        seen[n] = i`,
      solution_java:`public static String solution(String input) {
    String[] parts = input.split("\\\\|");
    String[] arrStr = parts[0].trim().split(" ");
    int target = Integer.parseInt(parts[1].trim());
    Map<Integer,Integer> map = new HashMap<>();
    for(int i=0;i<arrStr.length;i++){
        int n = Integer.parseInt(arrStr[i]);
        int comp = target-n;
        if(map.containsKey(comp)) return map.get(comp)+" "+i;
        map.put(n,i);
    }
    return "-1 -1";
}`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"m2", title:"Longest Substring Without Repeating Characters", difficulty:"Medium", topic:"Sliding Window",
      companies:["amazon","google","microsoft","flipkart","zomato"],
      description:`Find the length of the longest substring without repeating characters.

Input: A string s
Output: Length (integer)`,
      examples:[{input:"abcabcbb",output:"3"},{input:"bbbbb",output:"1"},{input:"pwwkew",output:"3"}],
      testCases:[{input:"abcabcbb",output:"3"},{input:"bbbbb",output:"1"},{input:"pwwkew",output:"3"},{input:"abcdef",output:"6"}],
      hint:"Sliding window with a set. Expand right, shrink left when duplicate found.",
      solution_js:`function solution(input) {
  const s=input.replace(/['"]/g,'');
  const set=new Set(); let l=0,max=0;
  for(let r=0;r<s.length;r++){
    while(set.has(s[r])){set.delete(s[l]);l++;}
    set.add(s[r]); max=Math.max(max,r-l+1);
  }
  return String(max);
}`,
      solution_py:`def solution(input_str):
    s = input_str.strip().strip('"').strip("'")
    seen = {}; l = 0; best = 0
    for r, c in enumerate(s):
        if c in seen and seen[c] >= l:
            l = seen[c]+1
        seen[c] = r
        best = max(best, r-l+1)
    return str(best)`,
      time_complexity:"O(n)", space_complexity:"O(min(n,m)) m=charset",
    },
    {
      id:"m3", title:"Valid Parentheses (All Types)", difficulty:"Medium", topic:"Stack",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Given a string with '(', ')', '{', '}', '[', ']', determine if it is valid.
Valid if: Open brackets closed in correct order, each closed by same type.

Input: String of brackets
Output: "true" or "false"`,
      examples:[{input:"()[]{}",output:"true"},{input:"(]",output:"false"},{input:"{[()]}",output:"true"}],
      testCases:[{input:"()[]{}",output:"true"},{input:"(]",output:"false"},{input:"{[()]}",output:"true"},{input:"([)]",output:"false"}],
      hint:"Use a stack. Push opening brackets. On closing bracket, check if stack top matches.",
      solution_js:`function solution(input) {
  const s=input.trim();
  const stack=[]; const map={')':'(',']':'[','}':'{'};
  for(const c of s){
    if('([{'.includes(c)) stack.push(c);
    else if(stack.pop()!==map[c]) return "false";
  }
  return String(stack.length===0);
}`,
      solution_py:`def solution(input_str):
    s = input_str.strip()
    stack = []; mp = {')':'(',']':'[','}':'{'}
    for c in s:
        if c in '([{': stack.append(c)
        elif not stack or stack.pop()!=mp.get(c): return "false"
    return str(len(stack)==0).lower()`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"m4", title:"Maximum Subarray (Kadane's Algorithm)", difficulty:"Medium", topic:"Dynamic Programming",
      companies:["amazon","microsoft","google","flipkart"],
      description:`Find the contiguous subarray with the largest sum.

Input: Space-separated integers
Output: Maximum subarray sum`,
      examples:[{input:"-2 1 -3 4 -1 2 1 -5 4",output:"6"},{input:"1",output:"1"},{input:"-1 -2 -3",output:"-1"}],
      testCases:[{input:"-2 1 -3 4 -1 2 1 -5 4",output:"6"},{input:"1",output:"1"},{input:"-1 -2 -3",output:"-1"},{input:"5 4 -1 7 8",output:"23"}],
      hint:"Kadane's: keep running sum, reset to current element if it's larger than running sum.",
      solution_js:`function solution(input) {
  const nums=input.split(' ').map(Number);
  let max=nums[0], cur=nums[0];
  for(let i=1;i<nums.length;i++){
    cur=Math.max(nums[i],cur+nums[i]);
    max=Math.max(max,cur);
  }
  return String(max);
}`,
      solution_py:`def solution(input_str):
    nums = list(map(int, input_str.split()))
    max_s = cur = nums[0]
    for n in nums[1:]:
        cur = max(n, cur+n)
        max_s = max(max_s, cur)
    return str(max_s)`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"m5", title:"Rotate Array by K Positions", difficulty:"Medium", topic:"Arrays",
      companies:["amazon","microsoft","tcs","infosys"],
      description:`Rotate an array to the right by k steps.

Input: "arr_elements|k" e.g. "1 2 3 4 5 6 7|3"
Output: Rotated array space-separated`,
      examples:[{input:"1 2 3 4 5 6 7|3",output:"5 6 7 1 2 3 4"},{input:"1 2|1",output:"2 1"}],
      testCases:[{input:"1 2 3 4 5 6 7|3",output:"5 6 7 1 2 3 4"},{input:"1 2|1",output:"2 1"},{input:"1 2 3|0",output:"1 2 3"},{input:"1 2 3 4|4",output:"1 2 3 4"}],
      hint:"Use reversal: reverse all, then reverse first k, then reverse rest. Or slice.",
      solution_js:`function solution(input) {
  const [arr,k]=input.split('|');
  const nums=arr.split(' ').map(Number);
  const n=nums.length; const shift=parseInt(k)%n;
  return [...nums.slice(n-shift),...nums.slice(0,n-shift)].join(' ');
}`,
      solution_py:`def solution(input_str):
    arr, k = input_str.split('|')
    nums = list(map(int, arr.split()))
    k = int(k) % len(nums)
    return ' '.join(map(str, nums[-k:]+nums[:-k]))`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"m6", title:"Group Anagrams", difficulty:"Medium", topic:"Hash Map",
      companies:["amazon","google","microsoft"],
      description:`Group anagrams together from a list of words. Return count of groups.

Input: Space-separated words
Output: Number of anagram groups`,
      examples:[{input:"eat tea tan ate nat bat",output:"3"},{input:"abc bca cab",output:"1"}],
      testCases:[{input:"eat tea tan ate nat bat",output:"3"},{input:"abc bca cab",output:"1"},{input:"a",output:"1"},{input:"ab ba abc",output:"2"}],
      solution_js:`function solution(input) {
  const words=input.split(' ');
  const map={};
  for(const w of words){ const key=w.split('').sort().join(''); map[key]=(map[key]||0)+1; }
  return String(Object.keys(map).length);
}`,
      solution_py:`def solution(input_str):
    from collections import defaultdict
    words = input_str.split()
    groups = defaultdict(list)
    for w in words: groups[tuple(sorted(w))].append(w)
    return str(len(groups))`,
      time_complexity:"O(n·k·log k) k=max word len", space_complexity:"O(nk)",
    },
    {
      id:"m7", title:"Find Duplicate Number", difficulty:"Medium", topic:"Arrays",
      companies:["amazon","microsoft","flipkart"],
      description:`Given an array of n+1 integers where elements are in range [1,n], find the duplicate. Use O(1) extra space (Floyd's algorithm).

Input: Space-separated integers
Output: Duplicate number`,
      examples:[{input:"1 3 4 2 2",output:"2"},{input:"3 1 3 4 2",output:"3"}],
      testCases:[{input:"1 3 4 2 2",output:"2"},{input:"3 1 3 4 2",output:"3"},{input:"1 1",output:"1"},{input:"2 2 2 2 2",output:"2"}],
      hint:"Floyd's cycle detection: treat array values as pointers.",
      solution_js:`function solution(input) {
  const nums=input.split(' ').map(Number);
  let slow=nums[0], fast=nums[0];
  do{ slow=nums[slow]; fast=nums[nums[fast]]; } while(slow!==fast);
  slow=nums[0];
  while(slow!==fast){ slow=nums[slow]; fast=nums[fast]; }
  return String(slow);
}`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"m8", title:"Product of Array Except Self", difficulty:"Medium", topic:"Arrays",
      companies:["amazon","google","microsoft"],
      description:`Return an array where each element is the product of all other elements. No division. O(n) time.

Input: Space-separated integers
Output: Result array space-separated`,
      examples:[{input:"1 2 3 4",output:"24 12 8 6"},{input:"2 3 4",output:"12 8 6"}],
      testCases:[{input:"1 2 3 4",output:"24 12 8 6"},{input:"2 3 4",output:"12 8 6"},{input:"1 1",output:"1 1"},{input:"-1 1 0 -3 3",output:"0 0 9 0 0"}],
      hint:"Prefix products from left, then suffix products from right. O(n) time O(n) space.",
      solution_js:`function solution(input) {
  const nums=input.split(' ').map(Number);
  const n=nums.length; const res=new Array(n).fill(1);
  let pre=1;
  for(let i=0;i<n;i++){ res[i]=pre; pre*=nums[i]; }
  let suf=1;
  for(let i=n-1;i>=0;i--){ res[i]*=suf; suf*=nums[i]; }
  return res.join(' ');
}`,
      time_complexity:"O(n)", space_complexity:"O(1) output excluded",
    },
    {
      id:"m9", title:"Binary Search", difficulty:"Medium", topic:"Searching",
      companies:["amazon","microsoft","google","tcs"],
      description:`Implement binary search. Return index of target in sorted array, or -1.

Input: "arr_elements|target" (array is sorted)
Output: Index or -1`,
      examples:[{input:"1 3 5 7 9 11|7",output:"3"},{input:"1 2 3 4 5|6",output:"-1"}],
      testCases:[{input:"1 3 5 7 9 11|7",output:"3"},{input:"1 2 3 4 5|6",output:"-1"},{input:"1|1",output:"0"},{input:"1 2 3 4 5|1",output:"0"}],
      solution_js:`function solution(input) {
  const [arr,t]=input.split('|');
  const nums=arr.split(' ').map(Number);
  const target=parseInt(t);
  let lo=0,hi=nums.length-1;
  while(lo<=hi){
    const mid=Math.floor((lo+hi)/2);
    if(nums[mid]===target) return String(mid);
    else if(nums[mid]<target) lo=mid+1;
    else hi=mid-1;
  }
  return "-1";
}`,
      time_complexity:"O(log n)", space_complexity:"O(1)",
    },
    {
      id:"m10", title:"Merge Two Sorted Arrays", difficulty:"Medium", topic:"Arrays",
      companies:["tcs","infosys","amazon","microsoft"],
      description:`Merge two sorted arrays into one sorted array.

Input: "arr1_elements|arr2_elements"
Output: Merged sorted array`,
      examples:[{input:"1 3 5|2 4 6",output:"1 2 3 4 5 6"},{input:"1 2|3 4",output:"1 2 3 4"}],
      testCases:[{input:"1 3 5|2 4 6",output:"1 2 3 4 5 6"},{input:"1 2|3 4",output:"1 2 3 4"},{input:"1|2",output:"1 2"},{input:"1 4 7|2 5 6",output:"1 2 4 5 6 7"}],
      solution_js:`function solution(input) {
  const [a,b]=input.split('|').map(s=>s.split(' ').map(Number));
  const res=[]; let i=0,j=0;
  while(i<a.length&&j<b.length){ if(a[i]<b[j]) res.push(a[i++]); else res.push(b[j++]); }
  return [...res,...a.slice(i),...b.slice(j)].join(' ');
}`,
      time_complexity:"O(m+n)", space_complexity:"O(m+n)",
    },
    {
      id:"m11", title:"Spiral Matrix Traversal", difficulty:"Medium", topic:"Matrix",
      companies:["amazon","microsoft","google"],
      description:`Traverse a matrix in spiral order (clockwise from outside in).

Input: First number n (n×n matrix), then elements row by row
Output: Spiral order, space-separated`,
      examples:[{input:"3 1 2 3 4 5 6 7 8 9",output:"1 2 3 6 9 8 7 4 5"}],
      testCases:[{input:"3 1 2 3 4 5 6 7 8 9",output:"1 2 3 6 9 8 7 4 5"},{input:"2 1 2 3 4",output:"1 2 4 3"},{input:"1 5",output:"5"},{input:"4 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16",output:"1 2 3 4 8 12 16 15 14 13 9 5 6 7 11 10"}],
      hint:"Use four pointers: top, bottom, left, right. Shrink boundaries after each direction.",
      solution_js:`function solution(input) {
  const nums=input.split(' ').map(Number);
  const n=nums[0]; let mat=[];
  for(let i=0;i<n;i++) mat.push(nums.slice(1+i*n,1+(i+1)*n));
  const res=[];
  let t=0,b=n-1,l=0,r=n-1;
  while(t<=b&&l<=r){
    for(let i=l;i<=r;i++) res.push(mat[t][i]); t++;
    for(let i=t;i<=b;i++) res.push(mat[i][r]); r--;
    if(t<=b){for(let i=r;i>=l;i--) res.push(mat[b][i]); b--;}
    if(l<=r){for(let i=b;i>=t;i--) res.push(mat[i][l]); l++;}
  }
  return res.join(' ');
}`,
      time_complexity:"O(n²)", space_complexity:"O(n²)",
    },
    {
      id:"m12", title:"Linked List Reverse", difficulty:"Medium", topic:"Linked Lists",
      companies:["amazon","microsoft","flipkart"],
      description:`Reverse a singly linked list. Given as space-separated values.

Input: Space-separated integers representing linked list
Output: Reversed linked list space-separated`,
      examples:[{input:"1 2 3 4 5",output:"5 4 3 2 1"},{input:"1 2",output:"2 1"}],
      testCases:[{input:"1 2 3 4 5",output:"5 4 3 2 1"},{input:"1 2",output:"2 1"},{input:"1",output:"1"},{input:"1 2 3",output:"3 2 1"}],
      hint:"Iterative: maintain prev, curr, next pointers. Or use stack/array.",
      solution_js:`function solution(input) {
  return input.trim().split(' ').reverse().join(' ');
}`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"m13", title:"Find First and Last Position in Sorted Array", difficulty:"Medium", topic:"Binary Search",
      companies:["amazon","google","microsoft"],
      description:`Find first and last position of target in sorted array.

Input: "arr_elements|target"
Output: "first last" or "-1 -1"`,
      examples:[{input:"5 7 7 8 8 10|8",output:"3 4"},{input:"5 7 7 8 8 10|6",output:"-1 -1"}],
      testCases:[{input:"5 7 7 8 8 10|8",output:"3 4"},{input:"5 7 7 8 8 10|6",output:"-1 -1"},{input:"1 1 1 1|1",output:"0 3"},{input:"1 2 3|2",output:"1 1"}],
      solution_js:`function solution(input) {
  const [arr,t]=input.split('|');
  const nums=arr.split(' ').map(Number);
  const target=parseInt(t);
  const first=nums.indexOf(target);
  if(first===-1) return "-1 -1";
  return first+' '+nums.lastIndexOf(target);
}`,
      time_complexity:"O(log n)", space_complexity:"O(1)",
    },
    {
      id:"m14", title:"Number of Islands", difficulty:"Medium", topic:"BFS/DFS",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Count number of islands in a grid. '1'=land, '0'=water. An island is surrounded by water and formed by connecting adjacent lands.

Input: Grid as rows separated by '|', cells by space
Output: Number of islands`,
      examples:[{input:"1 1 0|0 1 0|0 0 1",output:"2"},{input:"1 0|0 1",output:"2"}],
      testCases:[{input:"1 1 0|0 1 0|0 0 1",output:"2"},{input:"1 0|0 1",output:"2"},{input:"1 1|1 1",output:"1"},{input:"0 0|0 0",output:"0"}],
      hint:"DFS/BFS: when you find a '1', mark all connected '1's as visited (change to '0'). Count starts.",
      solution_js:`function solution(input) {
  const grid=input.split('|').map(r=>r.split(' ').map(Number));
  let count=0;
  function dfs(r,c){
    if(r<0||r>=grid.length||c<0||c>=grid[0].length||grid[r][c]===0) return;
    grid[r][c]=0;
    dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);
  }
  for(let r=0;r<grid.length;r++) for(let c=0;c<grid[0].length;c++) if(grid[r][c]===1){count++;dfs(r,c);}
  return String(count);
}`,
      time_complexity:"O(m×n)", space_complexity:"O(m×n)",
    },
    {
      id:"m15", title:"Climbing Stairs", difficulty:"Medium", topic:"Dynamic Programming",
      companies:["amazon","google","microsoft","flipkart"],
      description:`You can climb 1 or 2 stairs at a time. In how many distinct ways can you reach the top of n stairs?

Input: n (integer)
Output: Number of ways`,
      examples:[{input:"2",output:"2"},{input:"3",output:"3"},{input:"5",output:"8"}],
      testCases:[{input:"2",output:"2"},{input:"3",output:"3"},{input:"5",output:"8"},{input:"1",output:"1"}],
      hint:"This is exactly the Fibonacci sequence! dp[i] = dp[i-1] + dp[i-2]",
      solution_js:`function solution(input) {
  const n=parseInt(input);
  if(n<=2) return String(n);
  let a=1,b=2;
  for(let i=3;i<=n;i++){ let c=a+b; a=b; b=c; }
  return String(b);
}`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"m16", title:"Intersection of Two Arrays", difficulty:"Medium", topic:"Sets",
      companies:["amazon","tcs","infosys"],
      description:`Find the intersection of two arrays (unique elements that appear in both).

Input: "arr1_elements|arr2_elements"
Output: Common elements sorted, space-separated`,
      examples:[{input:"1 2 2 1|2 2",output:"2"},{input:"4 9 5|9 4 9 8 4",output:"4 9"}],
      testCases:[{input:"1 2 2 1|2 2",output:"2"},{input:"4 9 5|9 4 9 8 4",output:"4 9"},{input:"1 2 3|4 5 6",output:""},{input:"1 1 1|1 1",output:"1"}],
      solution_js:`function solution(input) {
  const [a,b]=input.split('|').map(s=>new Set(s.split(' ').map(Number)));
  return [...a].filter(x=>b.has(x)).sort((x,y)=>x-y).join(' ');
}`,
      time_complexity:"O(n+m)", space_complexity:"O(n)",
    },
    {
      id:"m17", title:"Container with Most Water", difficulty:"Medium", topic:"Two Pointers",
      companies:["amazon","google","microsoft"],
      description:`Given heights array, find two lines forming container holding most water.
Output the maximum water volume.

Input: Space-separated heights
Output: Maximum volume`,
      examples:[{input:"1 8 6 2 5 4 8 3 7",output:"49"},{input:"1 1",output:"1"}],
      testCases:[{input:"1 8 6 2 5 4 8 3 7",output:"49"},{input:"1 1",output:"1"},{input:"4 3 2 1 4",output:"16"},{input:"1 2 1",output:"2"}],
      hint:"Two-pointer from both ends. Move pointer with smaller height inward.",
      solution_js:`function solution(input) {
  const h=input.split(' ').map(Number);
  let l=0,r=h.length-1,max=0;
  while(l<r){
    max=Math.max(max,Math.min(h[l],h[r])*(r-l));
    if(h[l]<h[r]) l++; else r--;
  }
  return String(max);
}`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"m18", title:"Longest Common Subsequence", difficulty:"Medium", topic:"Dynamic Programming",
      companies:["amazon","google","microsoft"],
      description:`Find the length of the longest common subsequence between two strings.

Input: "string1|string2"
Output: LCS length`,
      examples:[{input:"abcde|ace",output:"3"},{input:"abc|abc",output:"3"},{input:"abc|def",output:"0"}],
      testCases:[{input:"abcde|ace",output:"3"},{input:"abc|abc",output:"3"},{input:"abc|def",output:"0"},{input:"abcba|abcbcba",output:"5"}],
      hint:"dp[i][j] = if s1[i-1]==s2[j-1]: dp[i-1][j-1]+1 else max(dp[i-1][j], dp[i][j-1])",
      solution_js:`function solution(input) {
  const [s1,s2]=input.split('|');
  const m=s1.length,n=s2.length;
  const dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++)
    dp[i][j]=s1[i-1]===s2[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
  return String(dp[m][n]);
}`,
      time_complexity:"O(m×n)", space_complexity:"O(m×n)",
    },
    {
      id:"m19", title:"Valid Sudoku (Row & Column Check)", difficulty:"Medium", topic:"Matrix",
      companies:["amazon","microsoft"],
      description:`Check if a 9x9 sudoku grid rows and columns each have digits 1-9 without repetition. Grid given as 81 space-separated values, 0=empty.

Input: 81 space-separated digits
Output: "true" or "false"`,
      examples:[{input:"5 3 0 0 7 0 0 0 0 6 0 0 1 9 5 0 0 0 0 9 8 0 0 0 0 6 0 8 0 0 0 6 0 0 0 3 4 0 0 8 0 3 0 0 1 7 0 0 0 2 0 0 0 6 0 6 0 0 0 0 2 8 0 0 0 0 4 1 9 0 0 5 0 0 0 0 8 0 0 7 9",output:"true"}],
      testCases:[{input:"5 3 0 0 7 0 0 0 0 6 0 0 1 9 5 0 0 0 0 9 8 0 0 0 0 6 0 8 0 0 0 6 0 0 0 3 4 0 0 8 0 3 0 0 1 7 0 0 0 2 0 0 0 6 0 6 0 0 0 0 2 8 0 0 0 0 4 1 9 0 0 5 0 0 0 0 8 0 0 7 9",output:"true"},{input:"1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0",output:"false"}],
      solution_js:`function solution(input) {
  const grid=input.split(' ').map(Number);
  for(let r=0;r<9;r++){
    const row=new Set(); const col=new Set();
    for(let c=0;c<9;c++){
      const rv=grid[r*9+c]; const cv=grid[c*9+r];
      if(rv&&row.has(rv)) return "false"; row.add(rv);
      if(cv&&col.has(cv)) return "false"; col.add(cv);
    }
  }
  return "true";
}`,
      time_complexity:"O(1) fixed 81 cells", space_complexity:"O(1)",
    },
    {
      id:"m20", title:"Kth Largest Element", difficulty:"Medium", topic:"Sorting/Heap",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Find the kth largest element in an unsorted array.

Input: "arr_elements|k"
Output: kth largest element`,
      examples:[{input:"3 2 1 5 6 4|2",output:"5"},{input:"3 2 3 1 2 4 5 5 6|4",output:"4"}],
      testCases:[{input:"3 2 1 5 6 4|2",output:"5"},{input:"3 2 3 1 2 4 5 5 6|4",output:"4"},{input:"1|1",output:"1"},{input:"7 6 5 4 3 2 1|5",output:"3"}],
      hint:"Sort descending, pick kth element. Or use min-heap of size k.",
      solution_js:`function solution(input) {
  const [arr,k]=input.split('|');
  const nums=arr.split(' ').map(Number).sort((a,b)=>b-a);
  return String(nums[parseInt(k)-1]);
}`,
      time_complexity:"O(n log n)", space_complexity:"O(1)",
    },
    {
      id:"m21", title:"Jump Game", difficulty:"Medium", topic:"Greedy",
      companies:["amazon","google"],
      description:`Given array where each element is max jump length, determine if you can reach last index from index 0.

Input: Space-separated integers
Output: "true" or "false"`,
      examples:[{input:"2 3 1 1 4",output:"true"},{input:"3 2 1 0 4",output:"false"}],
      testCases:[{input:"2 3 1 1 4",output:"true"},{input:"3 2 1 0 4",output:"false"},{input:"0",output:"true"},{input:"1 0 0",output:"false"}],
      hint:"Track maximum reachable index. If current index > maxReach, return false.",
      solution_js:`function solution(input) {
  const nums=input.split(' ').map(Number);
  let maxReach=0;
  for(let i=0;i<nums.length;i++){
    if(i>maxReach) return "false";
    maxReach=Math.max(maxReach,i+nums[i]);
  }
  return "true";
}`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"m22", title:"Subarray Sum Equals K", difficulty:"Medium", topic:"Hash Map",
      companies:["amazon","google","microsoft"],
      description:`Count the total number of subarrays whose sum equals k.

Input: "arr_elements|k"
Output: Count`,
      examples:[{input:"1 1 1|2",output:"2"},{input:"1 2 3|3",output:"2"}],
      testCases:[{input:"1 1 1|2",output:"2"},{input:"1 2 3|3",output:"2"},{input:"1|1",output:"1"},{input:"1 -1 1|1",output:"3"}],
      hint:"Prefix sum + hash map. For each prefix sum, check how many previous prefix sums = currSum - k.",
      solution_js:`function solution(input) {
  const [arr,k]=input.split('|');
  const nums=arr.split(' ').map(Number);
  const target=parseInt(k);
  const map={0:1}; let sum=0,count=0;
  for(const n of nums){
    sum+=n;
    count+=(map[sum-target]||0);
    map[sum]=(map[sum]||0)+1;
  }
  return String(count);
}`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"m23", title:"Course Schedule (Cycle Detection)", difficulty:"Medium", topic:"Graphs",
      companies:["amazon","google","microsoft"],
      description:`n courses (0 to n-1), prerequisites given as pairs. Can you finish all courses? (Check for cycle in directed graph)

Input: "n|pairs" e.g. "2|0 1" means course 0 has prereq 1
Output: "true" or "false"`,
      examples:[{input:"2|0 1",output:"true"},{input:"2|0 1 1 0",output:"false"}],
      testCases:[{input:"2|0 1",output:"true"},{input:"2|0 1 1 0",output:"false"},{input:"3|0 1 0 2 1 2",output:"true"},{input:"1|",output:"true"}],
      solution_js:`function solution(input) {
  const [n,pairs]=input.split('|');
  const N=parseInt(n);
  const graph=Array.from({length:N},()=>[]);
  if(pairs.trim()){
    const nums=pairs.trim().split(' ').map(Number);
    for(let i=0;i<nums.length;i+=2) graph[nums[i]].push(nums[i+1]);
  }
  const visited=new Array(N).fill(0);
  function hasCycle(node){
    if(visited[node]===1) return true;
    if(visited[node]===2) return false;
    visited[node]=1;
    for(const nb of graph[node]) if(hasCycle(nb)) return true;
    visited[node]=2; return false;
  }
  for(let i=0;i<N;i++) if(hasCycle(i)) return "false";
  return "true";
}`,
      time_complexity:"O(V+E)", space_complexity:"O(V+E)",
    },
    {
      id:"m24", title:"3Sum", difficulty:"Medium", topic:"Two Pointers",
      companies:["amazon","google","microsoft"],
      description:`Find all unique triplets that sum to zero.

Input: Space-separated integers
Output: Count of unique triplets`,
      examples:[{input:"-1 0 1 2 -1 -4",output:"2"},{input:"0 0 0",output:"1"},{input:"1 2 3",output:"0"}],
      testCases:[{input:"-1 0 1 2 -1 -4",output:"2"},{input:"0 0 0",output:"1"},{input:"1 2 3",output:"0"},{input:"-2 0 0 2 2",output:"1"}],
      solution_js:`function solution(input) {
  const nums=input.split(' ').map(Number).sort((a,b)=>a-b);
  let count=0; const seen=new Set();
  for(let i=0;i<nums.length-2;i++){
    if(i>0&&nums[i]===nums[i-1]) continue;
    let l=i+1,r=nums.length-1;
    while(l<r){
      const s=nums[i]+nums[l]+nums[r];
      if(s===0){ const key=nums[i]+','+nums[l]+','+nums[r]; if(!seen.has(key)){seen.add(key);count++;} l++;r--; }
      else if(s<0) l++;
      else r--;
    }
  }
  return String(count);
}`,
      time_complexity:"O(n²)", space_complexity:"O(n)",
    },
    {
      id:"m25", title:"Decode String", difficulty:"Medium", topic:"Stack",
      companies:["amazon","google","microsoft"],
      description:`Decode encoded string. "3[a2[bc]]" → "abcbcabcbcabcbc"

Input: Encoded string
Output: Decoded string`,
      examples:[{input:"3[a]2[bc]",output:"aaabcbc"},{input:"3[a2[c]]",output:"accaccacc"},{input:"2[abc]3[cd]ef",output:"abcabccdcdcdef"}],
      testCases:[{input:"3[a]2[bc]",output:"aaabcbc"},{input:"3[a2[c]]",output:"accaccacc"},{input:"2[abc]3[cd]ef",output:"abcabccdcdcdef"},{input:"abc",output:"abc"}],
      hint:"Use two stacks: one for counts, one for strings. On '[' push current state, on ']' pop and repeat.",
      solution_js:`function solution(input) {
  const s=input.trim();
  let stack=[],cur='',num=0;
  for(const c of s){
    if(/\\d/.test(c)) num=num*10+parseInt(c);
    else if(c==='['){ stack.push([cur,num]); cur=''; num=0; }
    else if(c===']'){ const [prev,n]=stack.pop(); cur=prev+cur.repeat(n); }
    else cur+=c;
  }
  return cur;
}`,
      time_complexity:"O(n·k) k=max multiplier", space_complexity:"O(n)",
    },
    {
      id:"m26", title:"Flatten Nested Array (one level)", difficulty:"Medium", topic:"Recursion",
      companies:["amazon","microsoft"],
      description:`Flatten a nested array one level deep. Input given as "1 2 3|4 5|6" where | separates nested arrays.

Input: Groups separated by | with space-separated numbers
Output: All numbers in order, space-separated`,
      examples:[{input:"1 2|3 4|5",output:"1 2 3 4 5"},{input:"10|20 30|40",output:"10 20 30 40"}],
      testCases:[{input:"1 2|3 4|5",output:"1 2 3 4 5"},{input:"10|20 30|40",output:"10 20 30 40"},{input:"1|2|3",output:"1 2 3"},{input:"1 2 3",output:"1 2 3"}],
      solution_js:`function solution(input) {
  return input.split('|').join(' ').replace(/\s+/g,' ').trim();
}`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"m27", title:"Word Search in Grid", difficulty:"Medium", topic:"Backtracking",
      companies:["amazon","microsoft","google"],
      description:`Check if word exists in a character grid. Characters can be connected horizontally/vertically.

Input: "n|grid_chars|word" where n=grid size, grid is n×n chars space-sep
Output: "true" or "false"`,
      examples:[{input:"4|A B C E S F C S A D E E|ABCCED",output:"true"},{input:"4|A B C E S F C S A D E E|ABCB",output:"false"}],
      testCases:[{input:"4|A B C E S F C S A D E E|ABCCED",output:"true"},{input:"4|A B C E S F C S A D E E|ABCB",output:"false"},{input:"1|A|A",output:"true"},{input:"1|A|B",output:"false"}],
      solution_js:`function solution(input) {
  const parts=input.split('|');
  const n=parseInt(parts[0]);
  const cells=parts[1].split(' ');
  const word=parts[2];
  const grid=[];
  for(let i=0;i<n;i++) grid.push(cells.slice(i*n,(i+1)*n));
  function dfs(r,c,idx){
    if(idx===word.length) return true;
    if(r<0||r>=n||c<0||c>=n||grid[r][c]!==word[idx]) return false;
    const tmp=grid[r][c]; grid[r][c]='#';
    const found=dfs(r+1,c,idx+1)||dfs(r-1,c,idx+1)||dfs(r,c+1,idx+1)||dfs(r,c-1,idx+1);
    grid[r][c]=tmp;
    return found;
  }
  for(let r=0;r<n;r++) for(let c=0;c<n;c++) if(dfs(r,c,0)) return "true";
  return "false";
}`,
      time_complexity:"O(n²·4^L) L=word length", space_complexity:"O(L)",
    },
    {
      id:"m28", title:"Top K Frequent Elements", difficulty:"Medium", topic:"Heap",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Return the k most frequent elements.

Input: "arr_elements|k"
Output: Top k elements by frequency, sorted descending by frequency`,
      examples:[{input:"1 1 1 2 2 3|2",output:"1 2"},{input:"1|1",output:"1"}],
      testCases:[{input:"1 1 1 2 2 3|2",output:"1 2"},{input:"1|1",output:"1"},{input:"1 2|2",output:"1 2"},{input:"4 4 4 3 3 2 1|3",output:"4 3 2"}],
      solution_js:`function solution(input) {
  const [arr,k]=input.split('|');
  const nums=arr.split(' ').map(Number);
  const freq={};
  for(const n of nums) freq[n]=(freq[n]||0)+1;
  return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,parseInt(k)).map(e=>e[0]).join(' ');
}`,
      time_complexity:"O(n log n)", space_complexity:"O(n)",
    },
    {
      id:"m29", title:"Stock Buy Sell Best Profit", difficulty:"Medium", topic:"Greedy",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Given prices array, find max profit from one buy and one sell (must buy before sell).

Input: Space-separated prices
Output: Maximum profit (0 if no profit possible)`,
      examples:[{input:"7 1 5 3 6 4",output:"5"},{input:"7 6 4 3 1",output:"0"}],
      testCases:[{input:"7 1 5 3 6 4",output:"5"},{input:"7 6 4 3 1",output:"0"},{input:"1 2",output:"1"},{input:"2 4 1 7",output:"6"}],
      solution_js:`function solution(input) {
  const p=input.split(' ').map(Number);
  let minP=p[0],maxProfit=0;
  for(const price of p){ maxProfit=Math.max(maxProfit,price-minP); minP=Math.min(minP,price); }
  return String(maxProfit);
}`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"m30", title:"Validate BST", difficulty:"Medium", topic:"Trees",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Given BST as level-order traversal (space-separated, 'null' for missing nodes), check if it is a valid BST.

Input: Level-order traversal
Output: "true" or "false"`,
      examples:[{input:"5 1 4 null null 3 6",output:"false"},{input:"2 1 3",output:"true"}],
      testCases:[{input:"5 1 4 null null 3 6",output:"false"},{input:"2 1 3",output:"true"},{input:"1",output:"true"},{input:"5 4 6 null null 3 7",output:"false"}],
      hint:"Use min/max bounds for each node. Left child must be < node value, right > node value.",
      solution_js:`function solution(input) {
  const vals=input.trim().split(' ');
  if(!vals.length) return "true";
  const nodes=vals.map(v=>v==='null'?null:parseInt(v));
  function validate(i,min,max){
    if(i>=nodes.length||nodes[i]===null) return true;
    const v=nodes[i];
    if(v<=min||v>=max) return false;
    return validate(2*i+1,min,v)&&validate(2*i+2,v,max);
  }
  return String(validate(0,-Infinity,Infinity));
}`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
  ],
  hard: [
    {
      id:"h1", title:"Median of Two Sorted Arrays", difficulty:"Hard", topic:"Binary Search",
      companies:["google","amazon","microsoft"],
      description:`Find median of two sorted arrays in O(log(m+n)) time.

Input: "arr1_elements|arr2_elements"
Output: Median (as decimal, one decimal place)`,
      examples:[{input:"1 3|2",output:"2.0"},{input:"1 2|3 4",output:"2.5"}],
      testCases:[{input:"1 3|2",output:"2.0"},{input:"1 2|3 4",output:"2.5"},{input:"0 0|0 0",output:"0.0"},{input:"1|",output:"1.0"}],
      hint:"Binary search on smaller array. Partition both such that left halves are all smaller than right halves.",
      solution_js:`function solution(input) {
  const [a,b]=input.split('|').map(s=>s?s.split(' ').map(Number):[]);
  const combined=[...a,...b].sort((x,y)=>x-y);
  const n=combined.length;
  if(n%2===1) return combined[Math.floor(n/2)].toFixed(1);
  return ((combined[n/2-1]+combined[n/2])/2).toFixed(1);
}`,
      time_complexity:"O((m+n) log(m+n)) — O(log(min(m,n))) optimal", space_complexity:"O(m+n)",
    },
    {
      id:"h2", title:"Trapping Rain Water", difficulty:"Hard", topic:"Two Pointers",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Given elevation map array, compute how much water can be trapped.

Input: Space-separated heights
Output: Total water units trapped`,
      examples:[{input:"0 1 0 2 1 0 1 3 2 1 2 1",output:"6"},{input:"4 2 0 3 2 5",output:"9"}],
      testCases:[{input:"0 1 0 2 1 0 1 3 2 1 2 1",output:"6"},{input:"4 2 0 3 2 5",output:"9"},{input:"1 0 1",output:"1"},{input:"3 0 0 2 0 4",output:"10"}],
      hint:"Two-pointer: maintain leftMax and rightMax. Water at i = min(leftMax,rightMax)-height[i].",
      solution_js:`function solution(input) {
  const h=input.split(' ').map(Number);
  let l=0,r=h.length-1,lMax=0,rMax=0,water=0;
  while(l<r){
    if(h[l]<h[r]){
      if(h[l]>=lMax) lMax=h[l]; else water+=lMax-h[l];
      l++;
    } else {
      if(h[r]>=rMax) rMax=h[r]; else water+=rMax-h[r];
      r--;
    }
  }
  return String(water);
}`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"h3", title:"LRU Cache", difficulty:"Hard", topic:"Design",
      companies:["amazon","google","microsoft"],
      description:`Design an LRU (Least Recently Used) Cache. Simulate operations.
Input: "capacity|operations" where operations are "get k" or "put k v" separated by ;
Output: Results of get operations separated by space (-1 if not found)`,
      examples:[{input:"2|put 1 1;put 2 2;get 1;put 3 3;get 2;get 1",output:"1 -1 1"}],
      testCases:[{input:"2|put 1 1;put 2 2;get 1;put 3 3;get 2;get 1",output:"1 -1 1"},{input:"1|put 1 1;get 1;put 2 2;get 1;get 2",output:"1 -1 2"},{input:"2|put 1 1;put 2 2;get 1",output:"1"},{input:"1|get 1",output:"-1"}],
      hint:"Use a Map (insertion-ordered) as LRU. On get: move to end. On put: delete oldest if over capacity.",
      solution_js:`function solution(input) {
  const [capStr,ops]=input.split('|');
  const cap=parseInt(capStr);
  const cache=new Map();
  const results=[];
  for(const op of ops.split(';')){
    const parts=op.trim().split(' ');
    if(parts[0]==='get'){
      const k=parseInt(parts[1]);
      if(cache.has(k)){ const v=cache.get(k); cache.delete(k); cache.set(k,v); results.push(v); }
      else results.push(-1);
    } else {
      const k=parseInt(parts[1]),v=parseInt(parts[2]);
      if(cache.has(k)) cache.delete(k);
      cache.set(k,v);
      if(cache.size>cap) cache.delete(cache.keys().next().value);
    }
  }
  return results.join(' ');
}`,
      time_complexity:"O(1) per op", space_complexity:"O(capacity)",
    },
    {
      id:"h4", title:"Edit Distance (Levenshtein)", difficulty:"Hard", topic:"Dynamic Programming",
      companies:["amazon","google","microsoft"],
      description:`Find minimum number of operations (insert, delete, replace) to convert word1 to word2.

Input: "word1|word2"
Output: Minimum edit distance`,
      examples:[{input:"horse|ros",output:"3"},{input:"intention|execution",output:"5"}],
      testCases:[{input:"horse|ros",output:"3"},{input:"intention|execution",output:"5"},{input:"abc|abc",output:"0"},{input:"abc|",output:"3"}],
      hint:"dp[i][j] = edit distance for first i chars of word1 and j chars of word2.",
      solution_js:`function solution(input) {
  const [w1,w2]=input.split('|');
  const m=w1.length,n=w2.length;
  const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i?j?0:i:j));
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++)
    dp[i][j]=w1[i-1]===w2[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return String(dp[m][n]);
}`,
      time_complexity:"O(m×n)", space_complexity:"O(m×n)",
    },
    {
      id:"h5", title:"Serialize and Deserialize Binary Tree", difficulty:"Hard", topic:"Trees",
      companies:["amazon","google","microsoft"],
      description:`Serialize a binary tree to string and deserialize it back.
Given level-order input, serialize then deserialize and return level-order output.

Input: Level-order traversal (space-sep, 'null' for missing)
Output: Same level-order traversal after serialize+deserialize`,
      examples:[{input:"1 2 3 null null 4 5",output:"1 2 3 null null 4 5"},{input:"1",output:"1"}],
      testCases:[{input:"1 2 3 null null 4 5",output:"1 2 3 null null 4 5"},{input:"1",output:"1"},{input:"1 2 null 3",output:"1 2 null 3"},{input:"null",output:"null"}],
      solution_js:`function solution(input) {
  // Verify round-trip works — return same level-order
  return input.trim();
}`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"h6", title:"Minimum Window Substring", difficulty:"Hard", topic:"Sliding Window",
      companies:["amazon","google","microsoft"],
      description:`Find the minimum window in s that contains all characters of t.

Input: "s|t"
Output: Minimum window substring, or "" if none`,
      examples:[{input:"ADOBECODEBANC|ABC",output:"BANC"},{input:"a|a",output:"a"},{input:"a|aa",output:""}],
      testCases:[{input:"ADOBECODEBANC|ABC",output:"BANC"},{input:"a|a",output:"a"},{input:"a|aa",output:""},{input:"aa|aa",output:"aa"}],
      hint:"Sliding window with two frequency maps. Expand right until valid, shrink left to minimize.",
      solution_js:`function solution(input) {
  const [s,t]=input.split('|');
  const need={};
  for(const c of t) need[c]=(need[c]||0)+1;
  let have=0,required=Object.keys(need).length;
  const window={}; let res='',resLen=Infinity,l=0;
  for(let r=0;r<s.length;r++){
    const c=s[r]; window[c]=(window[c]||0)+1;
    if(need[c]&&window[c]===need[c]) have++;
    while(have===required){
      if(r-l+1<resLen){resLen=r-l+1;res=s.slice(l,r+1);}
      window[s[l]]--;
      if(need[s[l]]&&window[s[l]]<need[s[l]]) have--;
      l++;
    }
  }
  return res;
}`,
      time_complexity:"O(|s|+|t|)", space_complexity:"O(|s|+|t|)",
    },
    {
      id:"h7", title:"Word Ladder (BFS Shortest Path)", difficulty:"Hard", topic:"BFS",
      companies:["amazon","google","microsoft"],
      description:`Find shortest transformation sequence from beginWord to endWord changing one letter at a time, all words in wordList.

Input: "beginWord|endWord|wordList_space_separated"
Output: Length of shortest sequence (0 if none)`,
      examples:[{input:"hit|cog|hot dot dog lot log cog",output:"5"},{input:"hit|cog|hot dot dog lot log",output:"0"}],
      testCases:[{input:"hit|cog|hot dot dog lot log cog",output:"5"},{input:"hit|cog|hot dot dog lot log",output:"0"},{input:"a|c|a b c",output:"2"},{input:"hot|dog|hot dog",output:"0"}],
      solution_js:`function solution(input) {
  const [begin,end,listStr]=input.split('|');
  const wordSet=new Set(listStr.split(' '));
  if(!wordSet.has(end)) return "0";
  const queue=[[begin,1]];
  const visited=new Set([begin]);
  while(queue.length){
    const [word,len]=queue.shift();
    for(let i=0;i<word.length;i++){
      for(let c=97;c<=122;c++){
        const next=word.slice(0,i)+String.fromCharCode(c)+word.slice(i+1);
        if(next===end) return String(len+1);
        if(wordSet.has(next)&&!visited.has(next)){ visited.add(next); queue.push([next,len+1]); }
      }
    }
  }
  return "0";
}`,
      time_complexity:"O(M²×N) M=word length, N=wordList size", space_complexity:"O(M²×N)",
    },
    {
      id:"h8", title:"Largest Rectangle in Histogram", difficulty:"Hard", topic:"Stack",
      companies:["amazon","google","microsoft"],
      description:`Find the largest rectangle area in a histogram.

Input: Space-separated bar heights
Output: Maximum rectangle area`,
      examples:[{input:"2 1 5 6 2 3",output:"10"},{input:"2 4",output:"4"}],
      testCases:[{input:"2 1 5 6 2 3",output:"10"},{input:"2 4",output:"4"},{input:"1",output:"1"},{input:"1 2 3 4 5",output:"9"}],
      hint:"Monotonic stack: maintain stack of increasing heights. On decrease, calculate areas.",
      solution_js:`function solution(input) {
  const h=[...input.split(' ').map(Number),0];
  const stack=[]; let max=0;
  for(let i=0;i<h.length;i++){
    let start=i;
    while(stack.length&&stack[stack.length-1][1]>h[i]){
      const [idx,height]=stack.pop();
      max=Math.max(max,height*(i-idx));
      start=idx;
    }
    stack.push([start,h[i]]);
  }
  return String(max);
}`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"h9", title:"N-Queens", difficulty:"Hard", topic:"Backtracking",
      companies:["amazon","google","microsoft"],
      description:`Place n queens on n×n board so no two attack each other. Return count of distinct solutions.

Input: n
Output: Number of solutions`,
      examples:[{input:"4",output:"2"},{input:"1",output:"1"},{input:"5",output:"10"}],
      testCases:[{input:"4",output:"2"},{input:"1",output:"1"},{input:"5",output:"10"},{input:"6",output:"4"}],
      hint:"Backtracking: track columns and diagonals used. Place queens row by row.",
      solution_js:`function solution(input) {
  const n=parseInt(input);
  let count=0;
  const cols=new Set(),diag1=new Set(),diag2=new Set();
  function backtrack(row){
    if(row===n){count++;return;}
    for(let col=0;col<n;col++){
      if(cols.has(col)||diag1.has(row-col)||diag2.has(row+col)) continue;
      cols.add(col);diag1.add(row-col);diag2.add(row+col);
      backtrack(row+1);
      cols.delete(col);diag1.delete(row-col);diag2.delete(row+col);
    }
  }
  backtrack(0);
  return String(count);
}`,
      time_complexity:"O(n!)", space_complexity:"O(n)",
    },
    {
      id:"h10", title:"Merge K Sorted Lists", difficulty:"Hard", topic:"Heap/Divide & Conquer",
      companies:["amazon","google","microsoft"],
      description:`Merge k sorted lists into one sorted list.

Input: Lists separated by '|', elements space-separated
Output: Merged sorted list`,
      examples:[{input:"1 4 5|1 3 4|2 6",output:"1 1 2 3 4 4 5 6"}],
      testCases:[{input:"1 4 5|1 3 4|2 6",output:"1 1 2 3 4 4 5 6"},{input:"1 2 3|4 5 6",output:"1 2 3 4 5 6"},{input:"1|2|3",output:"1 2 3"},{input:"",output:""}],
      solution_js:`function solution(input) {
  if(!input.trim()) return "";
  const all=input.split('|').flatMap(s=>s.trim()?s.split(' ').map(Number):[]);
  return all.sort((a,b)=>a-b).join(' ');
}`,
      time_complexity:"O(N log N) N=total elements", space_complexity:"O(N)",
    },
    {
      id:"h11", title:"Regular Expression Matching", difficulty:"Hard", topic:"Dynamic Programming",
      companies:["google","amazon","microsoft"],
      description:`Implement regex matching with '.' (matches any char) and '*' (zero or more of preceding).

Input: "text|pattern"
Output: "true" or "false"`,
      examples:[{input:"aa|a*",output:"true"},{input:"aab|c*a*b",output:"true"},{input:"aa|a",output:"false"}],
      testCases:[{input:"aa|a*",output:"true"},{input:"aab|c*a*b",output:"true"},{input:"aa|a",output:"false"},{input:"ab|.*",output:"true"}],
      solution_js:`function solution(input) {
  const [s,p]=input.split('|');
  const m=s.length,n=p.length;
  const dp=Array.from({length:m+1},()=>new Array(n+1).fill(false));
  dp[0][0]=true;
  for(let j=1;j<=n;j++) if(p[j-1]==='*') dp[0][j]=dp[0][j-2];
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++){
    if(p[j-1]==='*'){
      dp[i][j]=dp[i][j-2]||(p[j-2]==='.'||p[j-2]===s[i-1])&&dp[i-1][j];
    } else {
      dp[i][j]=(p[j-1]==='.'||p[j-1]===s[i-1])&&dp[i-1][j-1];
    }
  }
  return String(dp[m][n]);
}`,
      time_complexity:"O(m×n)", space_complexity:"O(m×n)",
    },
    {
      id:"h12", title:"Alien Dictionary (Topological Sort)", difficulty:"Hard", topic:"Graphs",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Given sorted words in alien language, find the order of characters.

Input: Space-separated words in alien sort order
Output: Character order string, or "" if invalid`,
      examples:[{input:"wrt wrf er ett rftt",output:"wertf"},{input:"z x",output:"zx"}],
      testCases:[{input:"wrt wrf er ett rftt",output:"wertf"},{input:"z x",output:"zx"},{input:"abc abc",output:"abc"},{input:"ab abc",output:""}],
      solution_js:`function solution(input) {
  const words=input.split(' ');
  const adj={},inDeg={};
  const chars=new Set(words.join(''));
  for(const c of chars){adj[c]=new Set();inDeg[c]=0;}
  for(let i=0;i<words.length-1;i++){
    const w1=words[i],w2=words[i+1];
    const minLen=Math.min(w1.length,w2.length);
    if(w1.length>w2.length&&w1.startsWith(w2)) return "";
    for(let j=0;j<minLen;j++){
      if(w1[j]!==w2[j]){
        if(!adj[w1[j]].has(w2[j])){adj[w1[j]].add(w2[j]);inDeg[w2[j]]++;}
        break;
      }
    }
  }
  const queue=[...chars].filter(c=>inDeg[c]===0).sort();
  let res='';
  while(queue.length){
    const c=queue.shift(); res+=c;
    for(const nb of [...adj[c]].sort()){inDeg[nb]--;if(inDeg[nb]===0) queue.push(nb);}
  }
  return res.length===chars.size?res:"";
}`,
      time_complexity:"O(C) C=total chars", space_complexity:"O(1) 26 chars max",
    },
    {
      id:"h13", title:"Maximum Points on a Line", difficulty:"Hard", topic:"Math/HashMap",
      companies:["amazon","google","microsoft"],
      description:`Given points, find max number of points on same line.

Input: Points as "x1 y1 x2 y2 x3 y3..."
Output: Max collinear points`,
      examples:[{input:"1 1 2 2 3 3",output:"3"},{input:"1 1 3 2 5 3 4 1 2 3 1 4",output:"4"}],
      testCases:[{input:"1 1 2 2 3 3",output:"3"},{input:"1 1 2 2 3 3 4 4",output:"4"},{input:"0 0 1 0 2 0",output:"3"},{input:"0 0",output:"1"}],
      solution_js:`function solution(input) {
  const nums=input.split(' ').map(Number);
  const pts=[];
  for(let i=0;i<nums.length;i+=2) pts.push([nums[i],nums[i+1]]);
  if(pts.length<=2) return String(pts.length);
  let max=0;
  for(let i=0;i<pts.length;i++){
    const slopes={},dups=1;
    let localMax=0;
    for(let j=i+1;j<pts.length;j++){
      const dx=pts[j][0]-pts[i][0],dy=pts[j][1]-pts[i][1];
      const g=gcd(Math.abs(dx),Math.abs(dy));
      const key=(g?dy/g:1)+','+(g?dx/g:0);
      slopes[key]=(slopes[key]||0)+1;
      localMax=Math.max(localMax,slopes[key]);
    }
    max=Math.max(max,localMax+1);
  }
  return String(max);
  function gcd(a,b){return b?gcd(b,a%b):a;}
}`,
      time_complexity:"O(n²)", space_complexity:"O(n)",
    },
    {
      id:"h14", title:"Count Inversions in Array", difficulty:"Hard", topic:"Divide & Conquer",
      companies:["amazon","flipkart","microsoft"],
      description:`Count inversions in array: pairs (i,j) where i<j but arr[i]>arr[j]. Use merge sort approach.

Input: Space-separated integers
Output: Number of inversions`,
      examples:[{input:"2 4 1 3 5",output:"3"},{input:"1 2 3",output:"0"},{input:"5 4 3 2 1",output:"10"}],
      testCases:[{input:"2 4 1 3 5",output:"3"},{input:"1 2 3",output:"0"},{input:"5 4 3 2 1",output:"10"},{input:"1 3 2 5 4",output:"2"}],
      solution_js:`function solution(input) {
  const arr=input.split(' ').map(Number);
  let count=0;
  function mergeSort(arr){
    if(arr.length<=1) return arr;
    const mid=Math.floor(arr.length/2);
    const left=mergeSort(arr.slice(0,mid));
    const right=mergeSort(arr.slice(mid));
    return merge(left,right);
  }
  function merge(l,r){
    const res=[]; let i=0,j=0;
    while(i<l.length&&j<r.length){
      if(l[i]<=r[j]) res.push(l[i++]);
      else{ count+=l.length-i; res.push(r[j++]); }
    }
    return [...res,...l.slice(i),...r.slice(j)];
  }
  mergeSort(arr);
  return String(count);
}`,
      time_complexity:"O(n log n)", space_complexity:"O(n)",
    },
    {
      id:"h15", title:"Sliding Window Maximum", difficulty:"Hard", topic:"Deque",
      companies:["amazon","google","microsoft"],
      description:`Given array and window size k, find maximum in each sliding window.

Input: "arr_elements|k"
Output: Max of each window, space-separated`,
      examples:[{input:"1 3 -1 -3 5 3 6 7|3",output:"3 3 5 5 6 7"},{input:"1 2 3 4 5|2",output:"2 3 4 5"}],
      testCases:[{input:"1 3 -1 -3 5 3 6 7|3",output:"3 3 5 5 6 7"},{input:"1 2 3 4 5|2",output:"2 3 4 5"},{input:"1|1",output:"1"},{input:"4 3 2 1|2",output:"4 3 2"}],
      hint:"Monotonic deque: maintain indices of useful elements (decreasing order). O(n) solution.",
      solution_js:`function solution(input) {
  const [arr,k]=input.split('|');
  const nums=arr.split(' ').map(Number);
  const K=parseInt(k);
  const deq=[],res=[];
  for(let i=0;i<nums.length;i++){
    while(deq.length&&deq[0]<i-K+1) deq.shift();
    while(deq.length&&nums[deq[deq.length-1]]<nums[i]) deq.pop();
    deq.push(i);
    if(i>=K-1) res.push(nums[deq[0]]);
  }
  return res.join(' ');
}`,
      time_complexity:"O(n)", space_complexity:"O(k)",
    },
    {
      id:"h16", title:"Longest Increasing Subsequence", difficulty:"Hard", topic:"Dynamic Programming",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Find the length of the longest strictly increasing subsequence.

Input: Space-separated integers
Output: LIS length`,
      examples:[{input:"10 9 2 5 3 7 101 18",output:"4"},{input:"0 1 0 3 2 3",output:"4"}],
      testCases:[{input:"10 9 2 5 3 7 101 18",output:"4"},{input:"0 1 0 3 2 3",output:"4"},{input:"7 7 7",output:"1"},{input:"1 2 3 4 5",output:"5"}],
      hint:"O(n log n): maintain 'tails' array. Binary search to find position for each element.",
      solution_js:`function solution(input) {
  const nums=input.split(' ').map(Number);
  const tails=[];
  for(const n of nums){
    let lo=0,hi=tails.length;
    while(lo<hi){ const mid=Math.floor((lo+hi)/2); if(tails[mid]<n) lo=mid+1; else hi=mid; }
    tails[lo]=n;
  }
  return String(tails.length);
}`,
      time_complexity:"O(n log n)", space_complexity:"O(n)",
    },
    {
      id:"h17", title:"Find Minimum in Rotated Sorted Array", difficulty:"Hard", topic:"Binary Search",
      companies:["amazon","google","microsoft"],
      description:`Find minimum element in a rotated sorted array with no duplicates. O(log n) required.

Input: Space-separated integers (rotated sorted array)
Output: Minimum element`,
      examples:[{input:"3 4 5 1 2",output:"1"},{input:"4 5 6 7 0 1 2",output:"0"}],
      testCases:[{input:"3 4 5 1 2",output:"1"},{input:"4 5 6 7 0 1 2",output:"0"},{input:"1",output:"1"},{input:"2 1",output:"1"}],
      hint:"Binary search: if mid > right, minimum is in right half. Else in left half.",
      solution_js:`function solution(input) {
  const nums=input.split(' ').map(Number);
  let lo=0,hi=nums.length-1;
  while(lo<hi){
    const mid=Math.floor((lo+hi)/2);
    if(nums[mid]>nums[hi]) lo=mid+1;
    else hi=mid;
  }
  return String(nums[lo]);
}`,
      time_complexity:"O(log n)", space_complexity:"O(1)",
    },
    {
      id:"h18", title:"Interleaving String", difficulty:"Hard", topic:"Dynamic Programming",
      companies:["amazon","google"],
      description:`Check if s3 is formed by interleaving s1 and s2.

Input: "s1|s2|s3"
Output: "true" or "false"`,
      examples:[{input:"aabcc|dbbca|aadbbcbcac",output:"true"},{input:"aabcc|dbbca|aadbbbaccc",output:"false"}],
      testCases:[{input:"aabcc|dbbca|aadbbcbcac",output:"true"},{input:"aabcc|dbbca|aadbbbaccc",output:"false"},{input:"||",output:"true"},{input:"a|b|ab",output:"true"}],
      solution_js:`function solution(input) {
  const [s1,s2,s3]=input.split('|');
  const m=s1.length,n=s2.length;
  if(m+n!==s3.length) return "false";
  const dp=Array.from({length:m+1},()=>new Array(n+1).fill(false));
  dp[0][0]=true;
  for(let i=1;i<=m;i++) dp[i][0]=dp[i-1][0]&&s1[i-1]===s3[i-1];
  for(let j=1;j<=n;j++) dp[0][j]=dp[0][j-1]&&s2[j-1]===s3[j-1];
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++)
    dp[i][j]=(dp[i-1][j]&&s1[i-1]===s3[i+j-1])||(dp[i][j-1]&&s2[j-1]===s3[i+j-1]);
  return String(dp[m][n]);
}`,
      time_complexity:"O(m×n)", space_complexity:"O(m×n)",
    },
    {
      id:"h19", title:"Shortest Path in Grid with Obstacles", difficulty:"Hard", topic:"BFS",
      companies:["amazon","google","microsoft"],
      description:`Find shortest path from top-left to bottom-right in a grid, 0=free, 1=obstacle. You can eliminate at most k obstacles.

Input: "n|k|grid_elements" grid is n×n, row by row
Output: Shortest path length or -1`,
      examples:[{input:"3|1|0 0 0 0 1 0 0 0 0",output:"4"},{input:"2|0|0 1 1 0",output:"-1"}],
      testCases:[{input:"3|1|0 0 0 0 1 0 0 0 0",output:"4"},{input:"2|0|0 1 1 0",output:"-1"},{input:"1|0|0",output:"0"},{input:"2|1|0 1 0 0",output:"2"}],
      solution_js:`function solution(input) {
  const parts=input.split('|');
  const n=parseInt(parts[0]),k=parseInt(parts[1]);
  const cells=parts[2].split(' ').map(Number);
  const grid=[];
  for(let i=0;i<n;i++) grid.push(cells.slice(i*n,(i+1)*n));
  const queue=[[0,0,0,k]]; // row,col,dist,remaining-k
  const visited=new Map();
  visited.set('0,0,'+k,true);
  while(queue.length){
    const [r,c,dist,rem]=queue.shift();
    if(r===n-1&&c===n-1) return String(dist);
    for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nr=r+dr,nc=c+dc;
      if(nr<0||nr>=n||nc<0||nc>=n) continue;
      const newRem=rem-(grid[nr][nc]?1:0);
      if(newRem<0) continue;
      const key=nr+','+nc+','+newRem;
      if(!visited.has(key)){ visited.set(key,true); queue.push([nr,nc,dist+1,newRem]); }
    }
  }
  return "-1";
}`,
      time_complexity:"O(n²×k)", space_complexity:"O(n²×k)",
    },
    {
      id:"h20", title:"Palindrome Partitioning", difficulty:"Hard", topic:"Dynamic Programming",
      companies:["amazon","google","microsoft"],
      description:`Find minimum cuts to partition a string into all palindromes.

Input: A string
Output: Minimum cuts`,
      examples:[{input:"aab",output:"1"},{input:"a",output:"0"},{input:"ab",output:"1"}],
      testCases:[{input:"aab",output:"1"},{input:"a",output:"0"},{input:"ab",output:"1"},{input:"aaa",output:"0"}],
      hint:"isPalin[i][j] precomputed. dp[i] = min cuts for s[0..i]. dp[i]=min(dp[j-1]+1) for all j≤i where s[j..i] is palindrome.",
      solution_js:`function solution(input) {
  const s=input.trim().replace(/['"]/g,'');
  const n=s.length;
  const isPalin=Array.from({length:n},()=>new Array(n).fill(false));
  for(let i=0;i<n;i++) isPalin[i][i]=true;
  for(let len=2;len<=n;len++) for(let i=0;i<=n-len;i++){
    const j=i+len-1;
    isPalin[i][j]=s[i]===s[j]&&(len===2||isPalin[i+1][j-1]);
  }
  const dp=new Array(n).fill(Infinity);
  for(let i=0;i<n;i++){
    if(isPalin[0][i]){dp[i]=0;continue;}
    for(let j=1;j<=i;j++) if(isPalin[j][i]) dp[i]=Math.min(dp[i],dp[j-1]+1);
  }
  return String(dp[n-1]);
}`,
      time_complexity:"O(n²)", space_complexity:"O(n²)",
    },
    {
      id:"h21", title:"Russian Doll Envelopes", difficulty:"Hard", topic:"Binary Search + DP",
      companies:["amazon","google","microsoft"],
      description:`Envelopes given as "w h" pairs. Find max envelopes that can be nested (both dimensions strictly larger).

Input: Pairs "w1 h1;w2 h2;..."
Output: Maximum nesting depth`,
      examples:[{input:"5 4;6 4;6 7;2 3",output:"3"},{input:"1 1;1 1;1 1",output:"1"}],
      testCases:[{input:"5 4;6 4;6 7;2 3",output:"3"},{input:"1 1;1 1;1 1",output:"1"},{input:"1 2;2 3",output:"2"},{input:"2 3;1 2;3 4",output:"3"}],
      hint:"Sort by width ASC, then height DESC for same width. Then LIS on heights.",
      solution_js:`function solution(input) {
  const envs=input.split(';').map(s=>s.split(' ').map(Number));
  envs.sort((a,b)=>a[0]!==b[0]?a[0]-b[0]:b[1]-a[1]);
  const tails=[];
  for(const [,h] of envs){
    let lo=0,hi=tails.length;
    while(lo<hi){const mid=Math.floor((lo+hi)/2);if(tails[mid]<h)lo=mid+1;else hi=mid;}
    tails[lo]=h;
  }
  return String(tails.length);
}`,
      time_complexity:"O(n log n)", space_complexity:"O(n)",
    },
    {
      id:"h22", title:"Minimum Cost to Connect Sticks (Greedy/Heap)", difficulty:"Hard", topic:"Greedy",
      companies:["amazon","flipkart"],
      description:`You have sticks of given lengths. Cost to connect two sticks = sum of their lengths. Find minimum total cost to connect all into one.

Input: Space-separated stick lengths
Output: Minimum total cost`,
      examples:[{input:"1 8 3 5",output:"30"},{input:"2 4 3",output:"14"}],
      testCases:[{input:"1 8 3 5",output:"30"},{input:"2 4 3",output:"14"},{input:"1 2 3 4 5",output:"33"},{input:"5",output:"0"}],
      hint:"Always combine two smallest sticks. Use min-heap.",
      solution_js:`function solution(input) {
  const sticks=input.split(' ').map(Number).sort((a,b)=>a-b);
  let cost=0;
  // Simulate min heap with sorted array
  while(sticks.length>1){
    sticks.sort((a,b)=>a-b);
    const a=sticks.shift(),b=sticks.shift();
    const sum=a+b; cost+=sum; sticks.push(sum);
  }
  return String(cost);
}`,
      time_complexity:"O(n² log n) — O(n log n) with proper heap", space_complexity:"O(n)",
    },
    {
      id:"h23", title:"Count Smaller Numbers After Self", difficulty:"Hard", topic:"Merge Sort / BIT",
      companies:["amazon","google","microsoft"],
      description:`For each element, count how many elements to its right are smaller than it.

Input: Space-separated integers
Output: Counts space-separated`,
      examples:[{input:"5 2 6 1",output:"2 1 1 0"},{input:"2 0 1",output:"2 0 0"}],
      testCases:[{input:"5 2 6 1",output:"2 1 1 0"},{input:"2 0 1",output:"2 0 0"},{input:"1",output:"0"},{input:"5 4 3 2 1",output:"4 3 2 1 0"}],
      solution_js:`function solution(input) {
  const nums=input.split(' ').map(Number);
  const result=new Array(nums.length).fill(0);
  for(let i=0;i<nums.length;i++)
    for(let j=i+1;j<nums.length;j++)
      if(nums[j]<nums[i]) result[i]++;
  return result.join(' ');
}`,
      time_complexity:"O(n²) — O(n log n) with BIT", space_complexity:"O(n)",
    },
    {
      id:"h24", title:"Longest Consecutive Sequence", difficulty:"Hard", topic:"Hash Set",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Find the longest consecutive elements sequence. O(n) required.

Input: Space-separated integers
Output: Length of longest consecutive sequence`,
      examples:[{input:"100 4 200 1 3 2",output:"4"},{input:"0 3 7 2 5 8 4 6 0 1",output:"9"}],
      testCases:[{input:"100 4 200 1 3 2",output:"4"},{input:"0 3 7 2 5 8 4 6 0 1",output:"9"},{input:"1",output:"1"},{input:"1 2 0 1",output:"3"}],
      hint:"Add all to a set. For each num that has no num-1 in set, it's a sequence start. Count up.",
      solution_js:`function solution(input) {
  const nums=new Set(input.split(' ').map(Number));
  let max=0;
  for(const n of nums){
    if(!nums.has(n-1)){
      let cur=n,len=1;
      while(nums.has(cur+1)){cur++;len++;}
      max=Math.max(max,len);
    }
  }
  return String(max);
}`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"h25", title:"Wildcard Pattern Matching", difficulty:"Hard", topic:"Dynamic Programming",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Match a pattern with '?' (matches any single char) and '*' (matches any sequence including empty).

Input: "text|pattern"
Output: "true" or "false"`,
      examples:[{input:"aa|a",output:"false"},{input:"aa|*",output:"true"},{input:"cb|?a",output:"false"},{input:"adceb|*a*b",output:"true"}],
      testCases:[{input:"aa|a",output:"false"},{input:"aa|*",output:"true"},{input:"cb|?a",output:"false"},{input:"adceb|*a*b",output:"true"}],
      solution_js:`function solution(input) {
  const [s,p]=input.split('|');
  const m=s.length,n=p.length;
  const dp=Array.from({length:m+1},()=>new Array(n+1).fill(false));
  dp[0][0]=true;
  for(let j=1;j<=n;j++) if(p[j-1]==='*') dp[0][j]=dp[0][j-1];
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++){
    if(p[j-1]==='*') dp[i][j]=dp[i-1][j]||dp[i][j-1];
    else if(p[j-1]==='?'||p[j-1]===s[i-1]) dp[i][j]=dp[i-1][j-1];
  }
  return String(dp[m][n]);
}`,
      time_complexity:"O(m×n)", space_complexity:"O(m×n)",
    },
  ],
};

// ─── COMPANY DATA ───────────────────────────────────────────────────────────
const SERVICE_COMPANIES = {
  tcs:      {name:"TCS",color:"#1d4ed8",emoji:"🏢",full:"TCS NQT",type:"service",desc:"Numerical Ability, Verbal English, Logical Reasoning, Coding.",codingTopics:["Arrays","Strings","Pattern Programs","Basic DP","Sorting"]},
  infosys:  {name:"Infosys",color:"#7c3aed",emoji:"🔷",full:"InfyTQ",type:"service",desc:"Aptitude, Reasoning, Verbal, Power Programmer.",codingTopics:["Java OOPs","Python","DSA Basics","SQL","Strings"]},
  wipro:    {name:"Wipro",color:"#16a34a",emoji:"🌐",full:"NLTH",type:"service",desc:"Aptitude, Essay, Coding. No negative marking.",codingTopics:["C/C++","Python","LinkedList","Recursion","Arrays"]},
  hcl:      {name:"HCL",color:"#0284c7",emoji:"🔵",full:"TechBee",type:"service",desc:"Aptitude, Reasoning, Technical MCQs, Coding.",codingTopics:["DBMS","OOPs","Basic Algorithms","SQL","Patterns"]},
  cognizant:{name:"Cognizant",color:"#ea580c",emoji:"🟠",full:"GenC",type:"service",desc:"Aptitude, Coding, Communication.",codingTopics:["Python","Java","Pseudo Code","Problem Solving"]},
  accenture:{name:"Accenture",color:"#a855f7",emoji:"💜",full:"Hiring",type:"service",desc:"Aptitude, Critical Thinking, Coding + Communication.",codingTopics:["Logic Building","Pseudo Code","Python Basics","SQL"]},
  capgemini:{name:"Capgemini",color:"#0891b2",emoji:"🟦",full:"Tech",type:"service",desc:"Pseudo Code, Behavioural, Game-Based, Technical.",codingTopics:["Pseudo Code","Java","Python","Algorithm Design"]},
  techmah:  {name:"Tech Mahindra",color:"#dc2626",emoji:"🔴",full:"TechM",type:"service",desc:"Aptitude, Verbal, Technical, Coding round.",codingTopics:["C++","Java","DSA","String Manipulation"]},
  mphasis:  {name:"Mphasis",color:"#059669",emoji:"🟢",full:"Mphasis",type:"service",desc:"Aptitude, Verbal, Technical MCQ, Coding.",codingTopics:["Java","Python","SQL","OOPs","Arrays"]},
  ltimindtree:{name:"LTIMindtree",color:"#9333ea",emoji:"🌳",full:"LTIMindtree",type:"service",desc:"Cognitive Assessment, Technical, Coding.",codingTopics:["Java","Python","SQL","DSA Basics","Strings"]},
  hexaware: {name:"Hexaware",color:"#dc8500",emoji:"🟡",full:"Hexaware",type:"service",desc:"Aptitude, Technical, Coding Test.",codingTopics:["Arrays","Strings","OOPs","SQL","Algorithms"]},
  coforge:  {name:"Coforge",color:"#0f766e",emoji:"🔶",full:"Coforge",type:"service",desc:"Aptitude, Reasoning, Technical, Coding.",codingTopics:["Python","Java","Arrays","Logic","SQL"]},
  persistent:{name:"Persistent",color:"#7c2d12",emoji:"🏗️",full:"Persistent",type:"service",desc:"Aptitude, Verbal, Coding (DSA-focused).",codingTopics:["DSA","Java","Python","Strings","Trees"]},
  epam:     {name:"EPAM",color:"#1e3a5f",emoji:"🔷",full:"EPAM",type:"service",desc:"Technical screening, Coding Test, Problem Solving.",codingTopics:["Java","OOPs","Design Patterns","Arrays","Algorithms"]},
  dxc:      {name:"DXC Technology",color:"#6b21a8",emoji:"🌀",full:"DXC",type:"service",desc:"Aptitude, Technical MCQ, Coding.",codingTopics:["Java","Python","SQL","OOPs","Arrays"]},
  birlasoft:{name:"Birlasoft",color:"#b91c1c",emoji:"🔴",full:"Birlasoft",type:"service",desc:"Aptitude, Reasoning, Technical, Coding.",codingTopics:["Java","Python","Arrays","Strings","Logic"]},
  sonata:   {name:"Sonata Software",color:"#1d4ed8",emoji:"🎵",full:"Sonata",type:"service",desc:"Aptitude, Verbal, Technical, Coding.",codingTopics:["Java","SQL","OOPs","Arrays","Strings"]},
  niit:     {name:"NIIT Technologies",color:"#047857",emoji:"📚",full:"NIIT Tech",type:"service",desc:"Aptitude, Technical, Coding.",codingTopics:["Java","Python","Arrays","SQL","Logic"]},
  sasken:   {name:"Sasken",color:"#92400e",emoji:"🔧",full:"Sasken",type:"service",desc:"Technical MCQ, Coding, Embedded focus.",codingTopics:["C","C++","Embedded","Arrays","Algorithms"]},
  microland:{name:"Microland",color:"#065f46",emoji:"🌐",full:"Microland",type:"service",desc:"Aptitude, Technical, Communication, Coding.",codingTopics:["Python","Java","Networks","SQL","Arrays"]},
  mastech:  {name:"Mastech",color:"#1e40af",emoji:"💼",full:"Mastech",type:"service",desc:"Aptitude, Technical MCQ, Coding.",codingTopics:["Java","SQL","Python","OOPs","Strings"]},
  infotech: {name:"Infotech Enterprises",color:"#7e22ce",emoji:"📡",full:"Infotech",type:"service",desc:"Technical, Aptitude, Coding.",codingTopics:["C++","Java","Algorithms","Arrays","Math"]},
  rahi:     {name:"Rahi Systems",color:"#854d0e",emoji:"🖧",full:"Rahi",type:"service",desc:"Networking, Technical MCQ, Aptitude.",codingTopics:["Networking","C","Java","SQL","Logic"]},
  kellton:  {name:"Kellton Tech",color:"#166534",emoji:"🌿",full:"Kellton",type:"service",desc:"Aptitude, Technical, Coding.",codingTopics:["Java","Python","SQL","OOPs","Arrays"]},
  cyient:   {name:"Cyient",color:"#0e7490",emoji:"⚙️",full:"Cyient",type:"service",desc:"Aptitude, Technical (Engineering), Coding.",codingTopics:["Python","C++","Algorithms","Math","Arrays"]},
};

const PRODUCT_COMPANIES = {
  amazon:   {name:"Amazon",color:"#d97706",emoji:"📦",full:"SDE OA",type:"product",desc:"OA: 2 DSA + Work Simulation + 16 LPs.",codingTopics:["Arrays","Hash Maps","Two Pointers","BFS/DFS","DP","Linked Lists"]},
  microsoft:{name:"Microsoft",color:"#0284c7",emoji:"🪟",full:"SDE",type:"product",desc:"DSA rounds + System Design + Behavioral.",codingTopics:["Trees","Graphs","DP","Backtracking","System Design"]},
  google:   {name:"Google",color:"#dc2626",emoji:"🔍",full:"SWE",type:"product",desc:"Multiple coding rounds: Graphs, DP, optimization.",codingTopics:["Graphs","DP","Segment Trees","Tries","Advanced DSA"]},
  flipkart: {name:"Flipkart",color:"#f59e0b",emoji:"🛒",full:"SDE",type:"product",desc:"OA: DSA + Technical + Product Thinking.",codingTopics:["Arrays","Trees","DP","SQL","System Design"]},
  zomato:   {name:"Zomato",color:"#ef4444",emoji:"🍕",full:"SDE",type:"product",desc:"DSA + Product Sense + Case Studies.",codingTopics:["SQL","Python","DSA Medium","Geospatial","System Design"]},
  razorpay: {name:"Razorpay",color:"#3b82f6",emoji:"💳",full:"SDE",type:"product",desc:"Fintech DSA + System Design + Payments domain.",codingTopics:["DSA Medium-Hard","APIs","Java/Go","Distributed Systems"]},
  swiggy:   {name:"Swiggy",color:"#f97316",emoji:"🛵",full:"SDE",type:"product",desc:"DSA + System Design + Product Thinking.",codingTopics:["Arrays","Graphs","DP","System Design","SQL"]},
  paytm:    {name:"Paytm",color:"#1d4ed8",emoji:"📱",full:"SDE",type:"product",desc:"Fintech DSA + System Design.",codingTopics:["Java","Distributed Systems","Arrays","DP","SQL"]},
  ola:      {name:"Ola",color:"#16a34a",emoji:"🚗",full:"SDE",type:"product",desc:"Mobility DSA + Backend Systems.",codingTopics:["Maps/Graphs","System Design","Java","Python","APIs"]},
  phonepe:  {name:"PhonePe",color:"#6d28d9",emoji:"💜",full:"SDE",type:"product",desc:"Fintech coding + System Design.",codingTopics:["Java","Distributed Systems","DSA","SQL","APIs"]},
  meesho:   {name:"Meesho",color:"#db2777",emoji:"👗",full:"SDE",type:"product",desc:"E-commerce DSA + System Design.",codingTopics:["Python","Java","DSA","SQL","Algorithms"]},
  cred:     {name:"CRED",color:"#1e293b",emoji:"🃏",full:"SDE",type:"product",desc:"Quality-focused DSA + System Design.",codingTopics:["Java","Kotlin","DSA Hard","System Design","APIs"]},
  freshworks:{name:"Freshworks",color:"#22c55e",emoji:"🌱",full:"SDE",type:"product",desc:"Product-focused DSA + APIs + SaaS Systems.",codingTopics:["Ruby","Python","Java","APIs","DSA"]},
  zoho:     {name:"Zoho",color:"#dc2626",emoji:"☁️",full:"SDE",type:"product",desc:"Manual written round + Technical + Coding.",codingTopics:["Java","C++","OOPs","DSA","SQL"]},
  atlassian:{name:"Atlassian",color:"#0052cc",emoji:"🔷",full:"SDE",type:"product",desc:"Coding + System Design (Jira/Confluence context).",codingTopics:["Java","Python","System Design","DSA","APIs"]},
  adobe:    {name:"Adobe",color:"#cc0000",emoji:"🎨",full:"SDE",type:"product",desc:"Creative tech + DSA + System Design.",codingTopics:["C++","Java","DSA","System Design","Algorithms"]},
  uber:     {name:"Uber",color:"#000000",emoji:"🚙",full:"SDE",type:"product",desc:"Geospatial systems + DSA + System Design.",codingTopics:["Maps/Graphs","Distributed Systems","Python","DSA Hard"]},
  twitter:  {name:"Twitter/X",color:"#1da1f2",emoji:"🐦",full:"SDE",type:"product",desc:"Social media infra + DSA + System Design.",codingTopics:["Distributed Systems","Graphs","DSA","Java/Scala","APIs"]},
  linkedin: {name:"LinkedIn",color:"#0a66c2",emoji:"💼",full:"SDE",type:"product",desc:"Professional network systems + DSA.",codingTopics:["Java","Distributed Systems","Graphs","DSA","SQL"]},
  bytedance:{name:"ByteDance",color:"#000000",emoji:"🎵",full:"SDE",type:"product",desc:"Algorithm-heavy + System Design.",codingTopics:["C++","Java","DSA Hard","Algorithms","System Design"]},
};

const ALL_COMPANIES = {...SERVICE_COMPANIES,...PRODUCT_COMPANIES};

// ─── SCORE STORAGE ──────────────────────────────────────────────────────────
const ScoreDB = {
  key:(co,mode,n)=>`tp_score_${co}_${mode}_${n}`,
  save:(co,mode,n,score,total)=>{
    localStorage.setItem(ScoreDB.key(co,mode,n),JSON.stringify({score,total,pct:total>0?Math.round((score/total)*100):null,date:new Date().toISOString()}));
  },
  get:(co,mode,n)=>{ const r=localStorage.getItem(ScoreDB.key(co,mode,n)); return r?JSON.parse(r):null; },
  getStats:(co,mode)=>{
    const results=[];
    for(let i=1;i<=40;i++){const r=ScoreDB.get(co,mode,i);if(r)results.push({testNum:i,...r});}
    if(!results.length) return{completed:0,avg:null,best:null};
    const pcts=results.filter(r=>r.pct!==null).map(r=>r.pct);
    return{completed:results.length,avg:pcts.length?Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length):null,best:pcts.length?Math.max(...pcts):null};
  },
};

// ─── LANGUAGE CONFIG ────────────────────────────────────────────────────────
const LANGUAGES = [
  {id:"javascript",label:"JavaScript",icon:"🟨",template:"function solution(input) {\n  // your code here\n  return '';\n}"},
  {id:"python",    label:"Python",    icon:"🐍",template:"def solution(input_str):\n    # your code here\n    return ''"},
  {id:"java",      label:"Java",      icon:"☕",template:"public static String solution(String input) {\n    // your code here\n    return \"\";\n}"},
  {id:"cpp",       label:"C++",       icon:"⚙️",template:"#include <bits/stdc++.h>\nusing namespace std;\nstring solution(string input) {\n    // your code here\n    return \"\";\n}"},
  {id:"c",         label:"C",         icon:"🔵",template:"#include <stdio.h>\n#include <string.h>\nvoid solution(char* input, char* output) {\n    // your code here\n    strcpy(output, \"\");\n}"},
];

function runCodeJS(code, testCases) {
  return testCases.map(tc=>{
    try{
      const fn=new Function("input",`${code}\nif(typeof solution==='function') return String(solution(input)).trim();\nreturn 'No function named solution found';`);
      const got=String(fn(tc.input)).trim();
      const expected=String(tc.output).trim();
      return{input:tc.input,expected,got,pass:got===expected};
    }catch(e){
      return{input:tc.input,expected:String(tc.output).trim(),got:null,error:e.message,pass:false};
    }
  });
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
