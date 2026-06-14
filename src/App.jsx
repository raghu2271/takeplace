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
  @keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
  @keyframes countUp{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}
  .fade{animation:fadeUp .35s ease forwards;}
  .fadeIn{animation:fadeIn .25s ease forwards;}
  .slideIn{animation:slideIn .3s ease forwards;}
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
  .approach-card{transition:all .2s;border:2px solid transparent;}
  .approach-card:hover{border-color:#2563eb30;transform:translateY(-2px);}
  .lang-tab{transition:all .2s;border-bottom:2px solid transparent;}
  .lang-tab.active{border-bottom:2px solid #2563eb;color:#2563eb;}
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
    white:{ background:"#ffffff", color:C.blue, fontWeight:700, boxShadow:"0 2px 8px rgba(0,0,0,0.1)" },
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

// ─── AI CALL (Anthropic) ────────────────────────────────────────────────────
async function callAI(prompt, maxTokens=1000) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-sonnet-4-6",
        max_tokens:maxTokens,
        messages:[{role:"user",content:prompt}]
      }),
    });
    if (!res.ok) throw new Error("AI error "+res.status);
    const data = await res.json();
    return data.content?.[0]?.text || "";
  } catch(e) {
    throw e;
  }
}

// ─── JS EXECUTION ENGINE ────────────────────────────────────────────────────
// Runs user code in JS. For non-JS languages, transpiles logic automatically.
function runCodeJS(code, testCases) {
  return testCases.map(tc=>{
    try {
      const fn = new Function("input", `
        ${code}
        if(typeof solution==='function') return String(solution(input)).trim();
        return 'No function named solution found';
      `);
      const got = String(fn(tc.input)).trim();
      const expected = String(tc.output).trim();
      return { input:tc.input, expected, got, pass:got===expected };
    } catch(e) {
      return { input:tc.input, expected:String(tc.output).trim(), got:null, error:e.message, pass:false };
    }
  });
}

// Transpile non-JS to JS equivalent for execution
function transpileToJS(code, lang) {
  if(lang === "javascript") return code;

  // Python → JS transpilation for common patterns
  if(lang === "python") {
    let js = code;
    // def solution(input_str): → function solution(input) {
    js = js.replace(/def solution\s*\(([^)]*)\)\s*:/g, "function solution(input) {");
    // return → return
    // int(x) → parseInt(x)
    js = js.replace(/int\(([^)]+)\)/g, "parseInt($1)");
    // str(x) → String(x)
    js = js.replace(/\bstr\(([^)]+)\)/g, "String($1)");
    // float(x) → parseFloat(x)
    js = js.replace(/\bfloat\(([^)]+)\)/g, "parseFloat($1)");
    // len(x) → x.length
    js = js.replace(/len\(([^)]+)\)/g, "$1.length");
    // .split() → .split()  (same)
    // .strip() → .trim()
    js = js.replace(/\.strip\(\)/g, ".trim()");
    // .upper() → .toUpperCase()
    js = js.replace(/\.upper\(\)/g, ".toUpperCase()");
    // .lower() → .toLowerCase()
    js = js.replace(/\.lower\(\)/g, ".toLowerCase()");
    // True/False → true/false
    js = js.replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false");
    // None → null
    js = js.replace(/\bNone\b/g, "null");
    // print → // print (ignore)
    js = js.replace(/^\s*print\s*\(/gm, "// print(");
    // f-strings: f"{x} {y}" → `${x} ${y}`
    js = js.replace(/f"([^"]*?)"/g, (_, s) => "`" + s.replace(/\{([^}]+)\}/g, "${$1}") + "`");
    js = js.replace(/f'([^']*?)'/g, (_, s) => "`" + s.replace(/\{([^}]+)\}/g, "${$1}") + "`");
    // map(int, ...) → Array.from(...).map(Number)
    js = js.replace(/list\(map\(int,\s*([^)]+)\.split\(([^)]*)\)\)\)/g, "$1.split($2).map(Number)");
    js = js.replace(/list\(map\(str,\s*([^)]+)\)\)/g, "$1.map(String)");
    // ' '.join(map(str, x)) → x.map(String).join(' ')
    js = js.replace(/'([^']*)'\s*\.join\(map\(str,\s*([^)]+)\)\)/g, "$2.map(String).join('$1')");
    js = js.replace(/'([^']*)'\s*\.join\(([^)]+)\)/g, "$2.join('$1')");
    // sorted() → .sort()
    js = js.replace(/sorted\(([^)]+)\)/g, "[...$1].sort((a,b)=>a-b)");
    // sum() → .reduce
    js = js.replace(/sum\(([^)]+)\)/g, "($1).reduce((a,b)=>a+b,0)");
    // max/min
    js = js.replace(/\bmax\(([^)]+)\)/g, "Math.max(...[$1])");
    js = js.replace(/\bmin\(([^)]+)\)/g, "Math.min(...[$1])");
    // Fix Python indentation by adding braces (simple heuristic)
    // input_str → input
    js = js.replace(/input_str/g, "input");
    // Add closing brace at end
    js = js + "\n}";
    return js;
  }

  // Java → JS transpilation
  if(lang === "java") {
    let js = code;
    // public static String solution(String input) { → function solution(input) {
    js = js.replace(/public\s+static\s+\w+\s+solution\s*\([^)]*\)\s*\{/g, "function solution(input) {");
    // Integer.parseInt → parseInt
    js = js.replace(/Integer\.parseInt\(([^)]+)\)/g, "parseInt($1)");
    // String.valueOf → String
    js = js.replace(/String\.valueOf\(([^)]+)\)/g, "String($1)");
    // System.out.println → // console.log
    js = js.replace(/System\.out\.println\([^)]*\);/g, "");
    // .trim() same
    // .split() same
    // new StringBuilder → just use string
    js = js.replace(/new\s+StringBuilder\(([^)]+)\)\.reverse\(\)\.toString\(\)/g, "$1.split('').reverse().join('')");
    // Math.max/min same
    // int x = → let x =
    js = js.replace(/\b(int|long|double|float|boolean|String|char)\s+(\w+)\s*=/g, "let $2 =");
    // String[] parts → let parts
    js = js.replace(/String\[\]\s+(\w+)/g, "let $1");
    // int[] → let
    js = js.replace(/int\[\]\s+(\w+)/g, "let $1");
    // new int[] → []
    js = js.replace(/new\s+int\[\]\s*\{([^}]*)\}/g, "[$1]");
    // true/false same
    return js;
  }

  // C++ → JS transpilation
  if(lang === "cpp") {
    let js = code;
    // string solution(string input) { → function solution(input) {
    js = js.replace(/\w+\s+solution\s*\([^)]*\)\s*\{/g, "function solution(input) {");
    // Remove includes
    js = js.replace(/#include[^\n]*/g, "");
    js = js.replace(/using namespace std;/g, "");
    // cout → //
    js = js.replace(/cout\s*<<[^;]*;/g, "");
    // to_string → String
    js = js.replace(/to_string\(([^)]+)\)/g, "String($1)");
    // stoi → parseInt
    js = js.replace(/stoi\(([^)]+)\)/g, "parseInt($1)");
    // stod → parseFloat
    js = js.replace(/stod\(([^)]+)\)/g, "parseFloat($1)");
    // string x = → let x =
    js = js.replace(/\b(int|long|double|float|bool|string|char|auto)\s+(\w+)\s*=/g, "let $2 =");
    // vector<int> → let
    js = js.replace(/vector<[^>]+>\s+(\w+)/g, "let $1");
    // push_back → push
    js = js.replace(/\.push_back\(/g, ".push(");
    // size() → length
    js = js.replace(/\.size\(\)/g, ".length");
    // true/false same
    return js;
  }

  // C → JS
  if(lang === "c") {
    let js = code;
    js = js.replace(/#include[^\n]*/g, "");
    js = js.replace(/void\s+solution\s*\([^)]*\)\s*\{/g, "function solution(input) { let output = '';");
    js = js.replace(/printf\s*\([^;]*\);/g, "");
    js = js.replace(/scanf\s*\([^;]*\);/g, "");
    js = js.replace(/strcpy\s*\([^;]*\);/g, "");
    js = js.replace(/\b(int|long|double|float|char|bool)\s+(\w+)\s*=/g, "let $2 =");
    js = js.replace(/atoi\(([^)]+)\)/g, "parseInt($1)");
    js = js.replace(/strlen\(([^)]+)\)/g, "$1.length");
    js = js + "\n return output;\n}";
    return js;
  }

  return code;
}

// Run code for any language - transpiles then executes
function runCode(code, lang, testCases) {
  const jsCode = transpileToJS(code, lang);
  const results = runCodeJS(jsCode, testCases);
  // Add language-specific compiler output flavor
  return results.map(r => ({
    ...r,
    compilerOutput: getCompilerOutput(lang, r),
  }));
}

function getCompilerOutput(lang, result) {
  if(lang === "javascript") {
    if(result.error) return `ReferenceError: ${result.error}`;
    return result.pass ? "✓ Test passed" : `Expected: ${result.expected}\nActual: ${result.got}`;
  }
  if(lang === "python") {
    if(result.error) return `Traceback (most recent call last):\n  File "solution.py", line 1\n${result.error}`;
    return result.pass ? "✓ Test passed" : `AssertionError: Expected ${result.expected}, got ${result.got}`;
  }
  if(lang === "java") {
    if(result.error) return `Exception in thread "main" java.lang.RuntimeException: ${result.error}`;
    return result.pass ? "✓ Test passed" : `AssertionError: expected:<${result.expected}> but was:<${result.got}>`;
  }
  if(lang === "cpp") {
    if(result.error) return `runtime error: ${result.error}`;
    return result.pass ? "✓ Test passed" : `Assertion failed: expected ${result.expected}, got ${result.got}`;
  }
  if(lang === "c") {
    if(result.error) return `Segmentation fault (core dumped)\n${result.error}`;
    return result.pass ? "✓ Test passed" : `Expected: ${result.expected}, Got: ${result.got}`;
  }
  return "";
}

// ─── APTITUDE QUESTION BANKS ────────────────────────────────────────────────
const APT_BANK = {
  tcs: [
    {q:"A train 150m long passes a pole in 15 seconds. What is the speed of the train?",opts:["10 m/s","12 m/s","8 m/s","15 m/s"],ans:0,exp:"Speed = Distance/Time = 150/15 = 10 m/s",topic:"Speed & Distance"},
    {q:"If 6 men can do a piece of work in 12 days, how many men are needed to do it in 8 days?",opts:["8","9","10","7"],ans:1,exp:"Men × Days = constant. 6×12=72. 72/8=9 men",topic:"Work & Time"},
    {q:"The ratio of two numbers is 3:5. Each increased by 10, ratio becomes 5:7. Find the numbers.",opts:["15,25","10,20","20,30","12,20"],ans:0,exp:"Let 3x,5x. (3x+10)/(5x+10)=5/7 → 4x=20 → x=5. Numbers: 15,25",topic:"Ratio"},
    {q:"A shopkeeper sells an article at 20% profit. Cost price is ₹500. Find selling price.",opts:["₹600","₹580","₹620","₹550"],ans:0,exp:"SP = CP × 1.20 = 500 × 1.20 = ₹600",topic:"Profit & Loss"},
    {q:"Find the next number: 2, 6, 12, 20, 30, ?",opts:["42","40","44","38"],ans:0,exp:"Differences: 4,6,8,10,12. Next = 30+12=42",topic:"Number Series"},
    {q:"In how many ways can the letters of TIGER be arranged?",opts:["120","60","24","720"],ans:0,exp:"5! = 5×4×3×2×1 = 120",topic:"Permutation"},
    {q:"Simple interest on ₹2000 for 3 years at 5% per annum is?",opts:["₹300","₹200","₹250","₹350"],ans:0,exp:"SI = (P×R×T)/100 = (2000×5×3)/100 = ₹300",topic:"Simple Interest"},
    {q:"If a:b=2:3 and b:c=4:5, find a:c.",opts:["8:15","2:5","4:10","6:15"],ans:0,exp:"a:b:c=8:12:15. So a:c=8:15",topic:"Ratio"},
    {q:"A pipe fills a tank in 4 hours. Another empties it in 12 hours. Both open, tank fills in?",opts:["6 hrs","8 hrs","5 hrs","10 hrs"],ans:0,exp:"Net rate = 1/4 - 1/12 = 1/6. Time = 6 hours",topic:"Pipes & Cisterns"},
    {q:"What is 15% of 240?",opts:["36","32","40","28"],ans:0,exp:"15/100 × 240 = 36",topic:"Percentage"},
    {q:"A man walks 3 km north, turns east and walks 4 km. Distance from start?",opts:["5 km","7 km","4 km","6 km"],ans:0,exp:"Pythagoras: √(3²+4²)=√25=5 km",topic:"Direction & Distance"},
    {q:"Find odd one out: 8, 27, 64, 100, 125",opts:["100","27","64","125"],ans:0,exp:"100 is not a perfect cube. 8=2³,27=3³,64=4³,125=5³",topic:"Odd One Out"},
    {q:"Compound interest on ₹1000 for 2 years at 10% p.a. is?",opts:["₹210","₹200","₹220","₹190"],ans:0,exp:"A=1000(1.1)²=1210. CI=1210-1000=₹210",topic:"Compound Interest"},
    {q:"A car travels 300 km in 5 hours. Speed in km/hr?",opts:["60","50","55","65"],ans:0,exp:"Speed = 300/5 = 60 km/hr",topic:"Speed"},
    {q:"If 2x+3y=12 and x-y=1, find x.",opts:["3","4","2","5"],ans:0,exp:"x=y+1. 2(y+1)+3y=12 → 5y=10 → y=2, x=3",topic:"Linear Equations"},
    {q:"In a class of 40, 25 play cricket, 20 football, 10 play both. How many play neither?",opts:["5","10","15","8"],ans:0,exp:"n(C∪F)=25+20-10=35. Neither=40-35=5",topic:"Set Theory"},
    {q:"Average of 5 numbers is 20. One excluded, average becomes 18. Excluded number?",opts:["28","30","26","32"],ans:0,exp:"Sum=100. New sum=18×4=72. Excluded=100-72=28",topic:"Average"},
    {q:"A cistern fills in 9 hours. Due to a leak it takes 10 hours. Leak empties in?",opts:["90 hrs","80 hrs","100 hrs","70 hrs"],ans:0,exp:"Rate of leak = 1/9-1/10 = 1/90. Empties in 90 hrs",topic:"Pipes & Cisterns"},
    {q:"log₁₀(1000) = ?",opts:["3","4","2","10"],ans:0,exp:"10³=1000, so log₁₀(1000)=3",topic:"Logarithms"},
    {q:"Find the LCM of 12 and 18.",opts:["36","24","48","72"],ans:0,exp:"12=2²×3, 18=2×3². LCM=2²×3²=36",topic:"LCM & HCF"},
    {q:"A boat goes 6 km/hr downstream and 4 km/hr upstream. Speed of stream?",opts:["1 km/hr","2 km/hr","0.5 km/hr","1.5 km/hr"],ans:0,exp:"Speed of stream=(6-4)/2=1 km/hr",topic:"Boats & Streams"},
    {q:"3 coins tossed, probability of getting exactly 2 heads?",opts:["3/8","1/2","1/4","1/8"],ans:0,exp:"P(exactly 2H)=C(3,2)/2³=3/8",topic:"Probability"},
    {q:"Area of a circle with diameter 14 cm? (π=22/7)",opts:["154 cm²","132 cm²","176 cm²","144 cm²"],ans:0,exp:"r=7. Area=πr²=22/7×49=154 cm²",topic:"Mensuration"},
    {q:"Product of two numbers is 120. HCF is 4. Find their LCM.",opts:["30","24","40","36"],ans:0,exp:"LCM×HCF=Product. LCM=120/4=30",topic:"LCM & HCF"},
    {q:"In 2 years, ₹1500 becomes ₹1800 at SI. Rate percent?",opts:["10%","8%","12%","15%"],ans:0,exp:"SI=300. R=(300×100)/(1500×2)=10%",topic:"Simple Interest"},
    {q:"If selling price is ₹900 and loss is 10%, cost price is?",opts:["₹1000","₹810","₹990","₹950"],ans:0,exp:"SP=CP×0.9. 900=CP×0.9. CP=1000",topic:"Profit & Loss"},
    {q:"What is the next prime after 97?",opts:["101","99","103","107"],ans:0,exp:"98=2×49, 99=9×11, 100=4×25, 101 is prime",topic:"Number Theory"},
    {q:"Two trains 200m and 150m long cross each other in 10 sec. Combined speed?",opts:["35 m/s","30 m/s","40 m/s","25 m/s"],ans:0,exp:"Combined length=350m. Speed=350/10=35 m/s",topic:"Trains"},
    {q:"Find the missing: 3, 9, 27, 81, ?",opts:["243","162","324","200"],ans:0,exp:"Each term multiplied by 3. 81×3=243",topic:"Series"},
    {q:"A rectangle has perimeter 54 cm and length 15 cm. Area?",opts:["180 cm²","162 cm²","150 cm²","175 cm²"],ans:0,exp:"2(l+w)=54, w=12. Area=15×12=180 cm²",topic:"Mensuration"},
    {q:"₹12000 invested at 8% CI for 2 years. Amount?",opts:["₹13996.80","₹13920","₹14000","₹13800"],ans:0,exp:"A=12000(1.08)²=12000×1.1664=13996.80",topic:"Compound Interest"},
    {q:"Probability of drawing an ace from 52 cards?",opts:["1/13","1/52","4/13","1/4"],ans:0,exp:"4 aces in 52 cards. P=4/52=1/13",topic:"Probability"},
    {q:"Speed of train 240m long crossing a bridge 360m in 30 sec?",opts:["20 m/s","24 m/s","18 m/s","22 m/s"],ans:0,exp:"Distance=240+360=600m. Speed=600/30=20 m/s",topic:"Trains"},
    {q:"HCF of 36 and 48 is?",opts:["12","6","18","24"],ans:0,exp:"36=2²×3², 48=2⁴×3. HCF=2²×3=12",topic:"HCF"},
    {q:"Two numbers differ by 5, product is 84. The numbers are?",opts:["7 and 12","6 and 14","8 and 11","9 and 10"],ans:0,exp:"x(x+5)=84 → x=7. Numbers: 7,12",topic:"Quadratic"},
    {q:"A man can type 1500 words in 30 minutes. Words in 2 hours?",opts:["6000","5000","7000","4500"],ans:0,exp:"Rate=50 words/min. 2hrs=120 min. 50×120=6000",topic:"Work Rate"},
    {q:"If tan θ=3/4, find sin θ.",opts:["3/5","4/5","3/4","5/3"],ans:0,exp:"In 3-4-5 triangle, sin θ=opp/hyp=3/5",topic:"Trigonometry"},
    {q:"Sum of first 100 natural numbers?",opts:["5050","5000","4950","5100"],ans:0,exp:"n(n+1)/2 = 100×101/2 = 5050",topic:"Series"},
    {q:"If MANGO is coded as NZMHP, how is APPLE coded?",opts:["BQQMF","ZOOMD","BOONF","AQQLF"],ans:0,exp:"Each letter shifted by +1. A→B,P→Q,P→Q,L→M,E→F = BQQMF",topic:"Coding"},
    {q:"A sphere has volume 904.8 cm³. Its radius? (π≈3.14)",opts:["6 cm","5 cm","7 cm","4 cm"],ans:0,exp:"V=4/3πr³. r³=216. r=6 cm",topic:"Mensuration"},
  ],
  infosys: [
    {q:"3 red and 5 blue balls in a bag. Probability of drawing 2 red balls?",opts:["3/28","1/8","3/14","1/4"],ans:0,exp:"C(3,2)/C(8,2)=3/28",topic:"Probability"},
    {q:"Cryptarithmetic: SEND+MORE=MONEY. What is M?",opts:["1","2","0","3"],ans:0,exp:"Classic cryptarithmetic. M=1 as MONEY is a 5-digit number.",topic:"Cryptarithmetic"},
    {q:"A clock shows 3:15. Angle between hour and minute hands?",opts:["7.5°","0°","15°","22.5°"],ans:0,exp:"Hour hand at 3:15 = 97.5°. Minute hand at 90°. Angle=7.5°",topic:"Clocks"},
    {q:"All A are B. Some B are C. Therefore?",opts:["Some A may be C","All A are C","No A are C","All C are A"],ans:0,exp:"Some B are C, all A are B → Some A may be C",topic:"Logical Reasoning"},
    {q:"A man is 3 times as old as his son. 15 years later he will be twice as old. Son's current age?",opts:["15","10","20","12"],ans:0,exp:"3x+15=2(x+15) → x=15",topic:"Age Problems"},
    {q:"In how many ways can 4 people sit at a circular table?",opts:["6","24","12","4"],ans:0,exp:"Circular: (n-1)! = 3! = 6",topic:"Circular Permutation"},
    {q:"If all Zens are cars and some cars are red, which is definitely true?",opts:["Some Zens may be red","All Zens are red","No Zen is red","All red things are Zens"],ans:0,exp:"All Zens are cars. Some cars are red. So some Zens may be red.",topic:"Syllogism"},
    {q:"Boat: 24 km upstream in 6 hrs, 20 km downstream in 4 hrs. Speed of stream?",opts:["0.5 km/hr","2 km/hr","1 km/hr","3 km/hr"],ans:0,exp:"US speed=4, DS speed=5. Stream=(5-4)/2=0.5 km/hr",topic:"Boats & Streams"},
    {q:"If 1st Jan 2000 was Saturday, what day was 1st Jan 2001?",opts:["Monday","Sunday","Tuesday","Wednesday"],ans:0,exp:"2000 was a leap year (366 days). 366 mod 7=2. Sat+2=Monday",topic:"Calendar"},
    {q:"Book:Library :: Painting:?",opts:["Museum","Artist","Canvas","Gallery"],ans:0,exp:"A book is kept in a library. A painting is kept in a Museum.",topic:"Analogy"},
    {q:"Odd one out: 121, 144, 169, 196, 225, 230",opts:["230","121","196","225"],ans:0,exp:"All others are perfect squares. 230 is not.",topic:"Odd One Out"},
    {q:"A sum doubles in 5 years at SI. Rate of interest?",opts:["20%","15%","25%","10%"],ans:0,exp:"SI=P. P=P×R×5/100. R=20%",topic:"Simple Interest"},
    {q:"How many 3-digit numbers are divisible by 7?",opts:["128","127","129","130"],ans:0,exp:"First: 105, Last: 994. Count=(994-105)/7+1=128",topic:"Number Theory"},
    {q:"A can do work in 10 days, B in 15 days. Together in 3 days, fraction done?",opts:["1/2","2/5","1/3","3/5"],ans:0,exp:"Rate=1/10+1/15=1/6 per day. In 3 days=1/2",topic:"Work"},
    {q:"Interior angle of a regular hexagon?",opts:["120°","90°","108°","135°"],ans:0,exp:"(n-2)×180/n = 4×180/6 = 120°",topic:"Geometry"},
    {q:"Number divided by 6 leaves remainder 3. Remainder when divided by 3?",opts:["0","1","2","3"],ans:0,exp:"Number=6k+3=3(2k+1). Divisible by 3, remainder=0",topic:"Remainders"},
    {q:"8 balls, one heavier. Min weighings to find it on balance scale?",opts:["2","3","1","4"],ans:0,exp:"Weigh 3 vs 3. Then weigh 2 from heavier group. Total=2",topic:"Logical Puzzle"},
    {q:"Series: 1, 4, 10, 20, 35, ?",opts:["56","49","60","52"],ans:0,exp:"Differences: 3,6,10,15 (triangular). Next diff=21. 35+21=56",topic:"Series"},
    {q:"EDIFICE:BUILDING :: PAUCITY:?",opts:["Scarcity","Abundance","Quality","Speed"],ans:0,exp:"Edifice means building. Paucity means scarcity.",topic:"Vocabulary"},
    {q:"Room 12m×9m×8m. Length of longest stick that fits?",opts:["17 m","15 m","16 m","18 m"],ans:0,exp:"√(12²+9²+8²)=√289=17 m",topic:"3D Geometry"},
    {q:"If 10% of x = 20% of y, then x:y = ?",opts:["2:1","1:2","1:1","3:1"],ans:0,exp:"0.1x=0.2y → x=2y → x:y=2:1",topic:"Ratio"},
    {q:"Sequence: 2, 3, 5, 7, 11, 13, ?",opts:["17","15","19","16"],ans:0,exp:"Prime numbers sequence. Next prime after 13 is 17",topic:"Series"},
    {q:"Two pipes A and B fill tank in 20 and 30 min. C drains in 15 min. All open: time to fill?",opts:["60 min","40 min","120 min","90 min"],ans:0,exp:"Rate=1/20+1/30-1/15=1/60. Time=60 min",topic:"Pipes"},
    {q:"Train from A at 8am at 60 km/h. Another from B (330km away) at 9am at 75 km/h. Meet at?",opts:["11 am","10:30 am","11:30 am","10 am"],ans:0,exp:"By 9am train A covered 60km. Remaining 270km at 135km/h → 2hrs → 11am",topic:"Speed"},
    {q:"5 mangoes + 3 oranges = ₹35. 3 mangoes + 5 oranges = ₹29. Cost of mango?",opts:["₹5","₹4","₹6","₹3"],ans:0,exp:"5m+3o=35, 3m+5o=29. Solving: m=5, o=2",topic:"Equations"},
    {q:"Class: 60% passed English, 70% Math, 40% both. Failed both?",opts:["10%","20%","30%","15%"],ans:0,exp:"P(E∪M)=60+70-40=90%. Failed both=10%",topic:"Set Theory"},
    {q:"Smallest number divisible by 1 to 10?",opts:["2520","5040","1260","720"],ans:0,exp:"LCM(1,2,...,10)=2520",topic:"LCM"},
    {q:"0, 1, 1, 2, 3, 5, 8, 13, ?",opts:["21","20","22","18"],ans:0,exp:"Fibonacci: 8+13=21",topic:"Series"},
    {q:"20% discount on ₹500, then 10% GST. Final price?",opts:["₹440","₹432","₹460","₹420"],ans:0,exp:"After discount: 400. After GST: 400×1.1=440",topic:"Percentages"},
    {q:"ABCDE: A>B, C>D, B>C, E>A. Shortest?",opts:["D","B","C","E"],ans:0,exp:"E>A>B>C>D. So D is shortest.",topic:"Ordering"},
    {q:"Sum of digits of 2-digit number is 9. Add 27, digits reverse. The number?",opts:["36","27","45","63"],ans:0,exp:"a+b=9, a-b=-3. a=3,b=6. Number=36",topic:"Number"},
    {q:"A polygon has 35 diagonals. How many sides?",opts:["10","9","11","8"],ans:0,exp:"n(n-3)/2=35 → n=10",topic:"Geometry"},
    {q:"If no A is B, and some C are B, which is valid?",opts:["Some C are not A","All C are A","Some B are A","No C is B"],ans:0,exp:"Some C are B. No A is B. Hence some C are not A.",topic:"Syllogism"},
    {q:"Speed of sound is 330 m/s. Thunder heard 3 seconds after lightning. Distance?",opts:["990 m","660 m","1320 m","330 m"],ans:0,exp:"Distance=330×3=990 m",topic:"Physics-Math"},
    {q:"Fibonacci: 0,1,1,2,3,5... What is the 10th term?",opts:["34","21","55","13"],ans:0,exp:"0,1,1,2,3,5,8,13,21,34. 10th term=34",topic:"Series"},
    {q:"If 10% of x = 25% of 40, find x.",opts:["100","80","120","90"],ans:0,exp:"0.1x = 0.25×40 = 10. x=100",topic:"Percentage"},
    {q:"A sum of ₹8000 amounts to ₹10000 in 5 years at SI. Rate?",opts:["5%","4%","6%","8%"],ans:0,exp:"SI=2000. R=(2000×100)/(8000×5)=5%",topic:"Simple Interest"},
    {q:"Train 100m long passes a man walking at 5 km/h in same direction at 50 km/h. Time?",opts:["8 sec","10 sec","6 sec","12 sec"],ans:0,exp:"Relative speed=45 km/h=12.5 m/s. Time=100/12.5=8 sec",topic:"Trains"},
    {q:"Ratio of boys:girls in class is 3:2. Total 50 students. How many girls?",opts:["20","25","30","15"],ans:0,exp:"Girls=2/5×50=20",topic:"Ratio"},
    {q:"A number when doubled and added 9 equals 65. The number?",opts:["28","30","32","26"],ans:0,exp:"2x+9=65 → 2x=56 → x=28",topic:"Equations"},
  ],
  wipro: [
    {q:"Choose correct sentence.",opts:["She don't like it","She doesn't like it","She didn't liked it","She not like it"],ans:1,exp:"'She doesn't like it' is grammatically correct.",topic:"English Grammar"},
    {q:"5 workers make 5 widgets in 5 days. Days for 100 workers to make 100 widgets?",opts:["5","100","1","50"],ans:0,exp:"Rate=1 widget/worker/5days. 100 workers→100/5=20/day. For 100→5 days",topic:"Work Rate"},
    {q:"Synonym of AMELIORATE:",opts:["Improve","Worsen","Maintain","Destroy"],ans:0,exp:"Ameliorate means to improve or make better",topic:"Vocabulary"},
    {q:"A square of side 10 is folded in half. Perimeter of resulting shape?",opts:["30","40","20","35"],ans:0,exp:"Results in 10×5 rectangle. Perimeter=2(10+5)=30",topic:"Mensuration"},
    {q:"'Each of the boys have their own book' - error?",opts:["Replace 'have' with 'has'","Replace 'their' with 'his'","Both A and B","No error"],ans:0,exp:"'Each' takes singular verb. 'Each...has'",topic:"Error Detection"},
    {q:"All roses are flowers. Some flowers fade quickly. Therefore?",opts:["Some roses may fade quickly","All roses fade quickly","Roses never fade","No conclusion"],ans:0,exp:"Some flowers fade. All roses are flowers. So some roses may fade.",topic:"Syllogism"},
    {q:"A clock loses 5 min per hour. Set correctly at noon, time shows at 5pm actual?",opts:["4:35 pm","4:55 pm","4:45 pm","4:30 pm"],ans:0,exp:"In 5 hours, clock shows 5×55min=275min=4hr35min=4:35pm",topic:"Clocks"},
    {q:"'He __ to the market yesterday.' Fill blank.",opts:["went","goes","go","going"],ans:0,exp:"Past tense requires 'went'",topic:"Verb Tense"},
    {q:"If FRIEND=GSJFOE, how is ENEMY coded?",opts:["FOFNZ","FNEMY","EOFNZ","FMFNZ"],ans:0,exp:"Each letter +1: E→F, N→O, E→F, M→N, Y→Z = FOFNZ",topic:"Coding-Decoding"},
    {q:"20% of 20% of 500?",opts:["20","40","100","25"],ans:0,exp:"20% of 500=100. 20% of 100=20",topic:"Percentage"},
    {q:"SURGERY:DOCTOR :: LEGISLATION:?",opts:["Parliament","Law","Lawyer","Politician"],ans:0,exp:"Surgery is done by a doctor. Legislation is passed by Parliament",topic:"Analogy"},
    {q:"Sum of first 50 natural numbers?",opts:["1275","1250","1300","1225"],ans:0,exp:"n(n+1)/2=50×51/2=1275",topic:"Series Sum"},
    {q:"₹5000 amounts to ₹6000 in 4 years at SI. Rate?",opts:["5%","4%","6%","8%"],ans:0,exp:"SI=1000. R=100×1000/(5000×4)=5%",topic:"Simple Interest"},
    {q:"Proliferation means?",opts:["Rapid increase","Decrease","Invention","Usage"],ans:0,exp:"Proliferation means rapid growth or multiplication",topic:"Vocabulary"},
    {q:"Odd word out: Pen, Pencil, Eraser, Ruler, Knife",opts:["Knife","Pen","Eraser","Ruler"],ans:0,exp:"Knife is a cutting tool, not stationery",topic:"Odd One Out"},
    {q:"In how many ways can 3 books be arranged from 5 books?",opts:["60","120","20","30"],ans:0,exp:"P(5,3)=5×4×3=60",topic:"Permutation"},
    {q:"Bought at ₹800, sold at 25% loss. Selling price?",opts:["₹600","₹700","₹750","₹650"],ans:0,exp:"SP=800×0.75=600",topic:"Profit & Loss"},
    {q:"Correctly spelled word:",opts:["Occurrence","Occurence","Occurrance","Occurrrence"],ans:0,exp:"Occurrence has double c and double r",topic:"Spelling"},
    {q:"If 3/5 of a number is 36, what is 5/8 of same number?",opts:["37.5","40","45","30"],ans:0,exp:"Number=36×5/3=60. 5/8×60=37.5",topic:"Fractions"},
    {q:"A and B run circular track. A in 20 min, B in 30 min. Meet at start after?",opts:["60 min","40 min","30 min","90 min"],ans:0,exp:"LCM(20,30)=60 minutes",topic:"Circular Motion"},
    {q:"Antonym of CACOPHONY",opts:["Harmony","Noise","Discord","Rhythm"],ans:0,exp:"Cacophony means harsh noise. Antonym is harmony",topic:"Antonym"},
    {q:"AP: first term 3, difference 2, n=10. Sum?",opts:["120","110","100","130"],ans:0,exp:"Sn=n/2[2a+(n-1)d]=10/2[6+18]=5×24=120",topic:"AP"},
    {q:"All mammals are warm-blooded. Dolphins are mammals. Therefore?",opts:["Dolphins are warm-blooded","Dolphins live in water","Mammals live in water","Dolphins are fish"],ans:0,exp:"Simple syllogism: dolphins are warm-blooded",topic:"Reasoning"},
    {q:"5 oranges cost as much as 3 apples. 10 apples cost ₹120. Cost of 15 oranges?",opts:["₹108","₹120","₹90","₹72"],ans:0,exp:"Apple=₹12. 5 oranges=36. 1 orange=7.2. 15 oranges=₹108",topic:"Unitary Method"},
    {q:"Cube of side 4 painted, cut into 1×1 cubes. Cubes with exactly 2 faces painted?",opts:["24","8","12","16"],ans:0,exp:"Edge cubes: 12 edges × (4-2)=12×2=24",topic:"3D Reasoning"},
    {q:"What fraction of 2 hours is 24 minutes?",opts:["1/5","1/4","1/3","2/5"],ans:0,exp:"24/120=1/5",topic:"Fractions"},
    {q:"Rectangle diagonal is 10, one side is 6. Area?",opts:["48","60","40","56"],ans:0,exp:"Other side=√(100-36)=8. Area=6×8=48",topic:"Geometry"},
    {q:"Train 600m long at 54 km/h crosses platform 900m. Time?",opts:["100 sec","90 sec","80 sec","110 sec"],ans:0,exp:"54 km/h=15 m/s. Distance=1500m. Time=1500/15=100 sec",topic:"Trains"},
    {q:"Ages P:Q = 3:4. 8 years ago ratio was 2:3. Age of P now?",opts:["24","32","18","36"],ans:0,exp:"(3x-8)/(4x-8)=2/3 → x=8. P=24",topic:"Ages"},
    {q:"Error: 'Between you and I, the matter is settled'",opts:["Replace 'I' with 'me'","Replace 'Between' with 'Among'","No error","None"],ans:0,exp:"After preposition 'between', use 'me', not 'I'",topic:"Grammar"},
    {q:"Two numbers sum to 50, differ by 10. Their product?",opts:["600","500","550","450"],ans:0,exp:"Numbers are 30 and 20. Product=600",topic:"Numbers"},
    {q:"Speed of light ≈3×10⁸ m/s. Sun-Earth distance ≈1.5×10¹¹ m. Light travel time?",opts:["500 sec","600 sec","400 sec","300 sec"],ans:0,exp:"t=1.5×10¹¹/3×10⁸=500 seconds",topic:"Scientific Math"},
    {q:"Scientist __ the experiment three times before publishing.",opts:["replicated","simulated","duplicated","copied"],ans:0,exp:"'Replicated' is the most precise scientific term",topic:"Vocabulary"},
    {q:"₹10,000 at 12% CI annually, after 2 years?",opts:["₹12,544","₹12,400","₹12,000","₹12,200"],ans:0,exp:"A=10000(1.12)²=₹12,544",topic:"Compound Interest"},
    {q:"Today is Friday, after 61 days it will be?",opts:["Wednesday","Saturday","Monday","Friday"],ans:0,exp:"61 mod 7=5. Fri+5=Wednesday",topic:"Calendar"},
    {q:"If today is Wednesday, what day was it 100 days ago?",opts:["Monday","Sunday","Saturday","Tuesday"],ans:0,exp:"100 mod 7=2. Wednesday-2=Monday",topic:"Calendar"},
    {q:"A+B=C, D+E=F, B+D=G, C+F=H. G+H=?",opts:["A+2B+2D+E","A+E+B+D","2A+B+D","A+B+D+E"],ans:0,exp:"G=B+D, H=(A+B)+(D+E). G+H=A+2B+2D+E",topic:"Algebra"},
    {q:"'Despite setbacks, the team persevered.' Team attitude?",opts:["Persistent","Defeated","Frustrated","Cautious"],ans:0,exp:"Persevered = continued despite difficulties = Persistent",topic:"Reading Comprehension"},
    {q:"Main idea: 'Green energy reduces pollution, creates jobs, is sustainable.'",opts:["Green energy has multiple benefits","Energy is expensive","Jobs are important","Pollution is a problem"],ans:0,exp:"Multiple benefits of green energy is the main idea",topic:"Reading Comprehension"},
    {q:"If 3/5 of students passed and 40 failed, total students?",opts:["100","80","120","60"],ans:0,exp:"2/5 failed=40. Total=40×5/2=100",topic:"Fractions"},
  ],
  amazon: [
    {q:"'Leaders start with the customer and work backwards.' Which LP?",opts:["Customer Obsession","Invent and Simplify","Think Big","Bias for Action"],ans:0,exp:"Customer Obsession is LP#1.",topic:"Leadership Principles"},
    {q:"Your team misses a deadline. You?",opts:["Identify root cause and prevent recurrence","Blame the slowest member","Ask manager to extend","Ignore it"],ans:0,exp:"Amazon expects Ownership: systematic problem-solving.",topic:"Work Simulation"},
    {q:"Time complexity of finding max element in array of n elements?",opts:["O(n)","O(log n)","O(1)","O(n²)"],ans:0,exp:"Must scan all elements once. O(n) linear time.",topic:"Algorithm Complexity"},
    {q:"Which data structure is LIFO?",opts:["Stack","Queue","Array","Linked List"],ans:0,exp:"Stack is Last In First Out (LIFO).",topic:"Data Structures"},
    {q:"Binary search requires?",opts:["Sorted array","Any array","Linked list","Tree only"],ans:0,exp:"Binary search requires a sorted array.",topic:"Algorithms"},
    {q:"Hash map average case time complexity for lookup?",opts:["O(1)","O(n)","O(log n)","O(n²)"],ans:0,exp:"Hash maps provide O(1) average case lookup.",topic:"Data Structures"},
    {q:"'Are Right, A Lot' means?",opts:["Strong judgment and good instincts","Always correct","Never wrong","Follow data only"],ans:0,exp:"Leaders have strong judgment and good instincts.",topic:"Leadership Principles"},
    {q:"Big O of merging two sorted arrays of size m and n?",opts:["O(m+n)","O(mn)","O(m log n)","O(n²)"],ans:0,exp:"One pass through both arrays: O(m+n)",topic:"Algorithm Complexity"},
    {q:"DFS of graph with V vertices and E edges has complexity?",opts:["O(V+E)","O(V²)","O(E log V)","O(VE)"],ans:0,exp:"DFS visits each vertex and edge once: O(V+E)",topic:"Graph Algorithms"},
    {q:"Frugality LP means?",opts:["Accomplish more with less","Never spend money","Be the cheapest","Save always"],ans:0,exp:"Frugality: Accomplish more with less. Constraints breed resourcefulness.",topic:"Leadership Principles"},
    {q:"In OOP, polymorphism means?",opts:["Same interface, different implementations","Multiple inheritance","Data hiding","Class extension"],ans:0,exp:"Polymorphism: one interface, many implementations.",topic:"OOP Concepts"},
    {q:"REST API: Which HTTP method is idempotent AND safe?",opts:["GET","POST","PUT","DELETE"],ans:0,exp:"GET is both idempotent and safe (no side effects).",topic:"API Design"},
    {q:"You disagree with manager's technical decision. You?",opts:["Disagree and Commit after expressing views","Stay silent","Do your own way","Escalate immediately"],ans:0,exp:"'Disagree and Commit' LP: voice disagreement then commit.",topic:"Work Simulation"},
    {q:"Time complexity of quicksort worst case?",opts:["O(n²)","O(n log n)","O(n)","O(log n)"],ans:0,exp:"Worst case O(n²) when pivot is always smallest/largest.",topic:"Sorting"},
    {q:"SOLID stands for?",opts:["Single, Open, Liskov, Interface, Dependency","Strong, Optimal, Linked, Integrated, Design","Simple, Object, Linked, Interface, Dynamic","None"],ans:0,exp:"Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion",topic:"Design Principles"},
    {q:"'Think Big' means?",opts:["Create bold direction that inspires results","Always work on big projects","Avoid small tasks","Aim for promotion"],ans:0,exp:"Think Big: bold vision, inspire teams, serve customers better.",topic:"Leadership Principles"},
    {q:"Microservices vs Monolith. Which is true?",opts:["Microservices allow independent scaling","Monolith is always better","Microservices have no overhead","Both are the same"],ans:0,exp:"Microservices allow individual service scaling and deployment.",topic:"System Design"},
    {q:"CAP theorem states a distributed system can guarantee?",opts:["Any 2 of Consistency, Availability, Partition Tolerance","All 3 always","Only Consistency","Only Availability"],ans:0,exp:"CAP: impossible to guarantee all three simultaneously.",topic:"Distributed Systems"},
    {q:"Database normalization 3NF means?",opts:["No transitive dependency on primary key","Only 1NF and 2NF","No duplicate rows","Foreign keys only"],ans:0,exp:"3NF: in 2NF AND no transitive functional dependency.",topic:"Databases"},
    {q:"Customer unhappy with product feature. First action?",opts:["Listen and understand their pain point","Defend the feature","Escalate to senior","Tell them to use competitor"],ans:0,exp:"Customer Obsession: understand first, then solve.",topic:"Work Simulation"},
    {q:"Which sorting is stable AND O(n log n)?",opts:["Merge sort","Quick sort","Heap sort","Selection sort"],ans:0,exp:"Merge sort is stable and always O(n log n).",topic:"Sorting"},
    {q:"SQL: Difference between WHERE and HAVING?",opts:["WHERE filters rows, HAVING filters groups","HAVING is faster","WHERE works on aggregates","Both same"],ans:0,exp:"WHERE filters before grouping. HAVING filters after GROUP BY.",topic:"SQL"},
    {q:"Eventual consistency means?",opts:["All nodes converge given no new updates","Immediate consistency","Only one node consistent","Never achieves consistency"],ans:0,exp:"Given enough time, all replicas converge.",topic:"Distributed Systems"},
    {q:"Time complexity of finding all subsets of n elements?",opts:["O(2ⁿ)","O(n²)","O(n log n)","O(n!)"],ans:0,exp:"There are 2ⁿ subsets. O(2ⁿ)",topic:"Complexity"},
    {q:"'Earn Trust' behavior?",opts:["Admit mistakes, benchmark against best","Never admit mistakes","Trust only senior leaders","Keep info private"],ans:0,exp:"Earn Trust: listen, speak candidly, admit mistakes.",topic:"Leadership Principles"},
    {q:"Deadlock in OS?",opts:["Two processes wait for each other's resources forever","A slow process","Memory overflow","CPU idle"],ans:0,exp:"Deadlock: circular wait where each process holds resource needed by next.",topic:"OS Concepts"},
    {q:"HTTP status 404 means?",opts:["Not Found","Server Error","Unauthorized","Redirect"],ans:0,exp:"404 Not Found: server cannot find the requested resource.",topic:"HTTP"},
    {q:"Which is NOT a NoSQL database?",opts:["MySQL","MongoDB","Cassandra","Redis"],ans:0,exp:"MySQL is relational SQL. MongoDB, Cassandra, Redis are NoSQL.",topic:"Databases"},
    {q:"Team member consistently delivers poor work. You?",opts:["Have direct conversation, offer support, set expectations","Report to HR immediately","Do their work","Ignore it"],ans:0,exp:"Amazon: coaching, direct feedback, high standards.",topic:"Work Simulation"},
    {q:"Space complexity of merge sort?",opts:["O(n)","O(1)","O(log n)","O(n log n)"],ans:0,exp:"Merge sort requires O(n) auxiliary space.",topic:"Sorting"},
    {q:"Factory Method design pattern is used for?",opts:["Creating objects without specifying exact class","Adding behavior","Managing state","Observer notification"],ans:0,exp:"Factory Method: let subclasses decide which class to instantiate.",topic:"Design Patterns"},
    {q:"BST inorder traversal gives?",opts:["Sorted ascending order","Sorted descending","Random order","Level order"],ans:0,exp:"Inorder traversal of BST gives sorted ascending order.",topic:"Trees"},
    {q:"Difference between process and thread?",opts:["Process has own memory; thread shares process memory","Both same","Thread is heavier","Process shares memory"],ans:0,exp:"Process: independent with own memory. Thread: lightweight, shares memory.",topic:"OS Concepts"},
    {q:"'Dive Deep' means a leader should?",opts:["Stay connected to details, audit frequently, data-driven","Only look at big picture","Delegate all details","Trust team completely"],ans:0,exp:"Dive Deep: stay connected to details, data-driven.",topic:"Leadership Principles"},
    {q:"Load balancing?",opts:["Distributing traffic across multiple servers","Saving server resources","Balancing CPU load","Memory management"],ans:0,exp:"Load balancing distributes incoming traffic across backend servers.",topic:"System Design"},
    {q:"Dijkstra's algorithm with min-heap complexity?",opts:["O((V+E) log V)","O(V²)","O(E log V)","O(VE)"],ans:0,exp:"With binary min-heap: O((V+E) log V)",topic:"Graph Algorithms"},
    {q:"Race condition?",opts:["Multiple threads access shared data, outcome depends on timing","A fast algorithm","CPU scheduling issue","Memory leak"],ans:0,exp:"Race condition: final outcome depends on execution order.",topic:"Concurrency"},
    {q:"Frugality does NOT mean?",opts:["Cutting corners on quality","Doing more with less","Avoiding unnecessary expense","Resourcefulness"],ans:0,exp:"Frugality means resourcefulness, NOT cutting corners on quality.",topic:"Leadership Principles"},
    {q:"CDN is used for?",opts:["Serving content from geographically closer servers","Storing databases","Running backend code","Managing DNS"],ans:0,exp:"CDN caches and serves static content from edge servers closest to users.",topic:"System Design"},
    {q:"What is a memory leak?",opts:["Memory allocated but never freed","Fast memory access","Cache miss","Stack overflow"],ans:0,exp:"Memory leak: program allocates memory and fails to release it.",topic:"OS Concepts"},
  ],
};

const getAptQuestions = (companyKey) => {
  const directMap = { tcs:APT_BANK.tcs, infosys:APT_BANK.infosys, wipro:APT_BANK.wipro, amazon:APT_BANK.amazon };
  return directMap[companyKey] || APT_BANK.tcs;
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
      examples:[{input:"hello",output:"olleh"},{input:"abcd",output:"dcba"}],
      testCases:[{input:"hello",output:"olleh"},{input:"abcd",output:"dcba"},{input:"a",output:"a"},{input:"racecar",output:"racecar"}],
      approaches: {
        brute: {
          title:"Brute Force",
          complexity:"Time: O(n) | Space: O(n)",
          idea:"Create a new string by iterating from end to beginning, appending each character.",
          steps:["Start from last character","Append each character to new string","Return the new string"],
          pseudocode:`result = ""
for i from n-1 down to 0:
    result += s[i]
return result`,
        },
        better: {
          title:"Two Pointer",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Use two pointers from both ends and swap characters until they meet in the middle.",
          steps:["Set left=0, right=n-1","Swap s[left] and s[right]","Move left++, right--","Stop when left >= right"],
          pseudocode:`left = 0, right = n-1
while left < right:
    swap(s[left], s[right])
    left++, right--
return s`,
        },
        optimal: {
          title:"Built-in / Slice",
          complexity:"Time: O(n) | Space: O(n)",
          idea:"Use language's built-in reverse or slice notation for clean, readable code.",
          steps:["Python: return s[::-1]","JavaScript: return s.split('').reverse().join('')","Java: new StringBuilder(s).reverse()"],
          pseudocode:`// Python
return s[::-1]

// JavaScript  
return s.split('').reverse().join('')

// Java
return new StringBuilder(s).reverse().toString()`,
        },
      },
      solution_js:`function solution(input) {
  const s = input.replace(/['"]/g,'');
  return s.split('').reverse().join('');
}`,
      solution_py:`def solution(input_str):
    s = input_str.strip('"').strip("'")
    return s[::-1]`,
      solution_java:`public static String solution(String input) {
    String s = input.replace("\\"","").replace("'","");
    return new StringBuilder(s).reverse().toString();
}`,
      solution_cpp:`string solution(string input) {
    if(!input.empty() && input[0]=='"') input = input.substr(1, input.size()-2);
    reverse(input.begin(), input.end());
    return input;
}`,
      solution_c:`// Convert and reverse
void solution(char* input, char* output) {
    int n = strlen(input);
    for(int i=0;i<n;i++) output[i]=input[n-1-i];
    output[n]='\0';
}`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"e2", title:"Check Palindrome", difficulty:"Easy", topic:"Strings",
      companies:["tcs","infosys","wipro","cognizant"],
      description:`Check if a given string is a palindrome (reads same forwards and backwards). Ignore case.

Input: A string s
Output: "true" or "false"`,
      examples:[{input:"racecar",output:"true"},{input:"hello",output:"false"}],
      testCases:[{input:"racecar",output:"true"},{input:"hello",output:"false"},{input:"Madam",output:"true"},{input:"Level",output:"true"}],
      approaches: {
        brute: {
          title:"Brute Force — Reverse Compare",
          complexity:"Time: O(n) | Space: O(n)",
          idea:"Reverse the string and compare with original (after lowercasing both).",
          steps:["Lowercase the string","Create reversed version","Compare both strings"],
          pseudocode:`s = s.lower()
reversed_s = reverse(s)
return s == reversed_s`,
        },
        better: {
          title:"Two Pointer",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Compare characters from both ends, moving inward. Stop if mismatch found.",
          steps:["Set left=0, right=n-1","Compare s[left] and s[right] (case-insensitive)","If mismatch → not palindrome","Move both pointers inward"],
          pseudocode:`left=0, right=n-1
while left < right:
    if s[left].lower() != s[right].lower():
        return false
    left++, right--
return true`,
        },
        optimal: {
          title:"Optimal — Same as Two Pointer",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Two pointer is already optimal for palindrome check. No further improvement possible.",
          steps:["This problem is O(n) time O(1) space at best","Must read at least half the string","Two pointer achieves this bound"],
          pseudocode:`// Two pointer is optimal
// Cannot do better than O(n/2) comparisons`,
        },
      },
      solution_js:`function solution(input) {
  const s = input.replace(/['"]/g,'').toLowerCase();
  return String(s === s.split('').reverse().join(''));
}`,
      solution_py:`def solution(input_str):
    s = input_str.strip('"').strip("'").lower()
    return str(s == s[::-1]).lower()`,
      solution_java:`public static String solution(String input) {
    String s = input.replace("\\"","").toLowerCase();
    String rev = new StringBuilder(s).reverse().toString();
    return String.valueOf(s.equals(rev));
}`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"e3", title:"Find Maximum in Array", difficulty:"Easy", topic:"Arrays",
      companies:["tcs","wipro","hcl","accenture"],
      description:`Given an array of integers, find and return the maximum element.

Input: Space-separated integers
Output: Maximum integer`,
      examples:[{input:"3 1 4 1 5 9 2 6",output:"9"},{input:"1 2 3",output:"3"}],
      testCases:[{input:"3 1 4 1 5 9 2 6",output:"9"},{input:"1 2 3",output:"3"},{input:"-1 -5 -3",output:"-1"},{input:"100",output:"100"}],
      approaches: {
        brute: {
          title:"Brute Force — Sort",
          complexity:"Time: O(n log n) | Space: O(n)",
          idea:"Sort the array and return the last element.",
          steps:["Sort array in ascending order","Return the last element"],
          pseudocode:`sort(arr)
return arr[n-1]`,
        },
        better: {
          title:"Linear Scan",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Track the maximum seen so far in a single pass.",
          steps:["Set max = arr[0]","For each element, update max if element > max","Return max"],
          pseudocode:`max = arr[0]
for each x in arr:
    if x > max: max = x
return max`,
        },
        optimal: {
          title:"Linear Scan (already optimal)",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Linear scan is optimal — we must examine every element at least once.",
          steps:["Lower bound is O(n) since we must see all elements","Linear scan achieves this","Math.max(...arr) in JS also O(n) internally"],
          pseudocode:`return Math.max(...arr)  // JS
return max(arr)         // Python`,
        },
      },
      solution_js:`function solution(input) {
  const nums = input.split(' ').map(Number);
  return String(Math.max(...nums));
}`,
      solution_py:`def solution(input_str):
    nums = list(map(int, input_str.split()))
    return str(max(nums))`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"e4", title:"Fibonacci Series", difficulty:"Easy", topic:"Dynamic Programming",
      companies:["tcs","infosys","wipro","hcl","cognizant","capgemini"],
      description:`Print the first n Fibonacci numbers separated by spaces.
0 1 1 2 3 5 8 13...

Input: n (integer)
Output: First n Fibonacci numbers space-separated`,
      examples:[{input:"5",output:"0 1 1 2 3"},{input:"8",output:"0 1 1 2 3 5 8 13"}],
      testCases:[{input:"5",output:"0 1 1 2 3"},{input:"8",output:"0 1 1 2 3 5 8 13"},{input:"1",output:"0"},{input:"2",output:"0 1"}],
      approaches: {
        brute: {
          title:"Brute Force — Recursion",
          complexity:"Time: O(2ⁿ) | Space: O(n)",
          idea:"Compute each Fibonacci number recursively. Very slow due to repeated computation.",
          steps:["fib(n) = fib(n-1) + fib(n-2)","Base case: fib(0)=0, fib(1)=1","Call for each i from 0 to n-1"],
          pseudocode:`def fib(n):
    if n<=1: return n
    return fib(n-1) + fib(n-2)

result = [fib(i) for i in range(n)]`,
        },
        better: {
          title:"Memoization (Top-Down DP)",
          complexity:"Time: O(n) | Space: O(n)",
          idea:"Store computed values to avoid recomputation.",
          steps:["Create memo array","Check memo before computing","Store result in memo"],
          pseudocode:`memo = {}
def fib(n):
    if n in memo: return memo[n]
    if n<=1: return n
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]`,
        },
        optimal: {
          title:"Iterative (Bottom-Up DP)",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Build from bottom up, only keeping track of previous two values.",
          steps:["Start with a=0, b=1","For each step: new = a+b, a=b, b=new","Collect results"],
          pseudocode:`a, b = 0, 1
for i in range(n):
    output(a)
    a, b = b, a+b`,
        },
      },
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
      id:"e5", title:"Check Prime Number", difficulty:"Easy", topic:"Number Theory",
      companies:["tcs","infosys","wipro","cognizant","accenture"],
      description:`Given a number n, check if it is prime.

Input: An integer n
Output: "true" if prime, "false" otherwise`,
      examples:[{input:"7",output:"true"},{input:"4",output:"false"},{input:"2",output:"true"}],
      testCases:[{input:"7",output:"true"},{input:"4",output:"false"},{input:"2",output:"true"},{input:"1",output:"false"}],
      approaches: {
        brute: {
          title:"Brute Force — Check All Divisors",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Check every number from 2 to n-1 as a potential divisor.",
          steps:["If n<2, not prime","Loop i from 2 to n-1","If n%i==0, not prime"],
          pseudocode:`for i in range(2, n):
    if n % i == 0:
        return False
return True`,
        },
        better: {
          title:"Check Up to √n",
          complexity:"Time: O(√n) | Space: O(1)",
          idea:"If n has a factor > √n, it must also have one < √n. So check only up to √n.",
          steps:["Loop i from 2 to √n","If n%i==0, not prime","Otherwise prime"],
          pseudocode:`for i in range(2, sqrt(n)+1):
    if n % i == 0:
        return False
return True`,
        },
        optimal: {
          title:"Skip Even Numbers",
          complexity:"Time: O(√n) | Space: O(1)",
          idea:"After checking 2, skip all even numbers. Only check odd divisors.",
          steps:["Check if n==2 or n is even","Then loop i=3,5,7... up to √n","If n%i==0, not prime"],
          pseudocode:`if n < 2: return False
if n == 2: return True
if n % 2 == 0: return False
for i in range(3, sqrt(n)+1, 2):
    if n % i == 0: return False
return True`,
        },
      },
      solution_js:`function solution(input) {
  const n = parseInt(input);
  if(n<2) return "false";
  if(n===2) return "true";
  if(n%2===0) return "false";
  for(let i=3;i<=Math.sqrt(n);i+=2) if(n%i===0) return "false";
  return "true";
}`,
      solution_py:`def solution(input_str):
    n = int(input_str)
    if n < 2: return "false"
    if n == 2: return "true"
    if n % 2 == 0: return "false"
    for i in range(3, int(n**0.5)+1, 2):
        if n%i==0: return "false"
    return "true"`,
      time_complexity:"O(√n)", space_complexity:"O(1)",
    },
    {
      id:"e6", title:"Two Sum", difficulty:"Easy", topic:"Hash Map",
      companies:["amazon","google","microsoft","flipkart","tcs","infosys"],
      description:`Given an array of integers and a target, return indices of the two numbers that add up to target. Assume exactly one solution.

Input: "arr_elements|target" e.g. "2 7 11 15|9"
Output: "i j" (0-indexed, space-separated)`,
      examples:[{input:"2 7 11 15|9",output:"0 1"},{input:"3 2 4|6",output:"1 2"}],
      testCases:[{input:"2 7 11 15|9",output:"0 1"},{input:"3 2 4|6",output:"1 2"},{input:"3 3|6",output:"0 1"},{input:"1 5 3 2|7",output:"1 3"}],
      approaches: {
        brute: {
          title:"Brute Force — Nested Loops",
          complexity:"Time: O(n²) | Space: O(1)",
          idea:"Check every pair of elements to see if they sum to target.",
          steps:["For each i from 0 to n-1","For each j from i+1 to n-1","If arr[i]+arr[j]==target, return [i,j]"],
          pseudocode:`for i in range(n):
    for j in range(i+1, n):
        if arr[i] + arr[j] == target:
            return [i, j]`,
        },
        better: {
          title:"Sorting + Two Pointer",
          complexity:"Time: O(n log n) | Space: O(n)",
          idea:"Sort with indices, then use two pointers. Needs extra space to remember original indices.",
          steps:["Sort array keeping original indices","Use left and right pointers","Move based on sum vs target"],
          pseudocode:`sorted_arr = sort(arr with indices)
left=0, right=n-1
while left < right:
    sum = sorted_arr[left] + sorted_arr[right]
    if sum==target: return their original indices
    elif sum < target: left++
    else: right--`,
        },
        optimal: {
          title:"Hash Map — Single Pass",
          complexity:"Time: O(n) | Space: O(n)",
          idea:"For each element, check if its complement (target - element) already exists in a hash map.",
          steps:["Create empty hash map {value → index}","For each element x at index i","Check if (target-x) exists in map","If yes → return [map[target-x], i]","If no → add x to map"],
          pseudocode:`seen = {}
for i, x in enumerate(arr):
    complement = target - x
    if complement in seen:
        return [seen[complement], i]
    seen[x] = i`,
        },
      },
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
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
    {
      id:"e7", title:"Factorial of Number", difficulty:"Easy", topic:"Recursion",
      companies:["tcs","infosys","wipro","cognizant"],
      description:`Compute the factorial of a non-negative integer n.

Input: n (0 ≤ n ≤ 12)
Output: n!`,
      examples:[{input:"5",output:"120"},{input:"0",output:"1"},{input:"10",output:"3628800"}],
      testCases:[{input:"5",output:"120"},{input:"0",output:"1"},{input:"10",output:"3628800"},{input:"6",output:"720"}],
      approaches: {
        brute: {
          title:"Recursion",
          complexity:"Time: O(n) | Space: O(n) stack",
          idea:"factorial(n) = n × factorial(n-1), base case n=0 returns 1.",
          steps:["If n==0 or n==1, return 1","Else return n × factorial(n-1)"],
          pseudocode:`def factorial(n):
    if n <= 1: return 1
    return n * factorial(n-1)`,
        },
        better: {
          title:"Iterative Loop",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Multiply from 1 to n iteratively. No recursion overhead.",
          steps:["Set result=1","Multiply by each i from 2 to n","Return result"],
          pseudocode:`result = 1
for i in range(2, n+1):
    result *= i
return result`,
        },
        optimal: {
          title:"Iterative (already optimal)",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Iterative is optimal — must perform n-1 multiplications minimum.",
          steps:["Cannot do better than O(n)","Iterative avoids stack overhead of recursion","For very large n, use BigInteger or arbitrary precision"],
          pseudocode:`result = 1
for i in range(2, n+1):
    result *= i
return result`,
        },
      },
      solution_js:`function solution(input) {
  const n=parseInt(input);
  let f=1;
  for(let i=2;i<=n;i++) f*=i;
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
      id:"e8", title:"Missing Number in Array", difficulty:"Easy", topic:"Arrays",
      companies:["amazon","tcs","infosys","microsoft"],
      description:`Given an array containing n-1 integers in range [1,n] with one number missing, find the missing number.

Input: Space-separated integers (n-1 numbers from 1 to n)
Output: Missing number`,
      examples:[{input:"1 2 4 5 6",output:"3"},{input:"1 3",output:"2"}],
      testCases:[{input:"1 2 4 5 6",output:"3"},{input:"1 3",output:"2"},{input:"2 3 4 5",output:"1"},{input:"1 2 3 4",output:"5"}],
      approaches: {
        brute: {
          title:"Sort and Find Gap",
          complexity:"Time: O(n log n) | Space: O(1)",
          idea:"Sort the array. Find where the sequence breaks.",
          steps:["Sort the array","Check each consecutive pair","Where arr[i+1] != arr[i]+1, missing = arr[i]+1"],
          pseudocode:`sort(arr)
for i in range(n-1):
    if arr[i+1] != arr[i]+1:
        return arr[i]+1
return arr[n-1]+1  // missing is at end`,
        },
        better: {
          title:"Sum Formula",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Expected sum of 1..n is n(n+1)/2. Actual sum − Expected = missing.",
          steps:["n = len(arr)+1","expected = n*(n+1)/2","missing = expected - sum(arr)"],
          pseudocode:`n = len(arr) + 1
expected = n * (n+1) / 2
missing = expected - sum(arr)`,
        },
        optimal: {
          title:"XOR Trick",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"XOR all numbers 1..n with all array elements. The missing number remains.",
          steps:["XOR all numbers from 1 to n","XOR with all array elements","Duplicate values cancel, leaving missing"],
          pseudocode:`xor = 0
for i in range(1, n+1): xor ^= i
for x in arr: xor ^= x
return xor  // missing number`,
        },
      },
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
      id:"e9", title:"Check Balanced Parentheses", difficulty:"Easy", topic:"Stack",
      companies:["amazon","microsoft","infosys","flipkart"],
      description:`Check if parentheses in a string are balanced. Only consider '(' and ')'.

Input: A string with parentheses
Output: "true" or "false"`,
      examples:[{input:"(())",output:"true"},{input:"(()(",output:"false"},{input:"()()",output:"true"}],
      testCases:[{input:"(())",output:"true"},{input:"(()(",output:"false"},{input:"()()",output:"true"},{input:")",output:"false"}],
      approaches: {
        brute: {
          title:"Count Open/Close",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Track open bracket count. Increment for '(', decrement for ')'. Invalid if count goes negative.",
          steps:["count = 0","For each char: ( → count++, ) → count--","If count < 0 anytime: false","Return count == 0"],
          pseudocode:`count = 0
for c in s:
    if c == '(': count++
    elif c == ')':
        count--
        if count < 0: return false
return count == 0`,
        },
        better: {
          title:"Stack (for all bracket types)",
          complexity:"Time: O(n) | Space: O(n)",
          idea:"Stack handles all bracket types. Push opening, pop for closing and verify match.",
          steps:["Push opening brackets to stack","For closing bracket: pop and verify match","Return stack.empty() at end"],
          pseudocode:`stack = []
for c in s:
    if c in '([{': stack.push(c)
    elif c in ')]}':
        if stack.empty() or stack.top() != match(c):
            return false
        stack.pop()
return stack.empty()`,
        },
        optimal: {
          title:"Counter Method (for only parentheses)",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"When only one type of bracket exists, a simple counter is optimal — no stack needed.",
          steps:["Same as brute force but it IS optimal","O(1) space since only one bracket type","Cannot improve time beyond O(n)"],
          pseudocode:`count = 0
for c in s:
    if c == '(': count++
    elif c == ')': count--
    if count < 0: return false
return count == 0`,
        },
      },
      solution_js:`function solution(input) {
  let cnt=0;
  for(const c of input){
    if(c==='(') cnt++;
    else if(c===')'){cnt--;if(cnt<0) return "false";}
  }
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
      id:"e10", title:"FizzBuzz", difficulty:"Easy", topic:"Basics",
      companies:["tcs","infosys","wipro","cognizant","accenture","capgemini"],
      description:`Print numbers 1 to n. For multiples of 3 print "Fizz", multiples of 5 print "Buzz", multiples of both print "FizzBuzz".

Input: n
Output: Space-separated results`,
      examples:[{input:"5",output:"1 2 Fizz 4 Buzz"},{input:"15",output:"1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz"}],
      testCases:[{input:"5",output:"1 2 Fizz 4 Buzz"},{input:"3",output:"1 2 Fizz"},{input:"1",output:"1"},{input:"6",output:"1 2 Fizz 4 Buzz Fizz"}],
      approaches: {
        brute: {
          title:"Separate If-Else Checks",
          complexity:"Time: O(n) | Space: O(n)",
          idea:"Check each number separately for divisibility by 15, 3, and 5.",
          steps:["For i from 1 to n","Check if i%15==0 → FizzBuzz","Else if i%3==0 → Fizz","Else if i%5==0 → Buzz","Else → i"],
          pseudocode:`for i in range(1, n+1):
    if i % 15 == 0: print("FizzBuzz")
    elif i % 3 == 0: print("Fizz")
    elif i % 5 == 0: print("Buzz")
    else: print(i)`,
        },
        better: {
          title:"String Concatenation",
          complexity:"Time: O(n) | Space: O(n)",
          idea:"Build result string. Check 3 and 5 independently. If neither, use number.",
          steps:["result = ''","If i%3==0: result+='Fizz'","If i%5==0: result+='Buzz'","If result=='': result=str(i)"],
          pseudocode:`for i in range(1, n+1):
    result = ""
    if i % 3 == 0: result += "Fizz"
    if i % 5 == 0: result += "Buzz"
    print(result or str(i))`,
        },
        optimal: {
          title:"Optimal is O(n) — Clean String Build",
          complexity:"Time: O(n) | Space: O(n)",
          idea:"String concatenation approach is cleaner and handles extensions easily (add more divisors without extra conditions).",
          steps:["Build result per number","Avoids checking 15 separately","Easily extendable to 7→Bazz etc."],
          pseudocode:`output = []
for i in range(1, n+1):
    s = ""
    if i%3==0: s += "Fizz"
    if i%5==0: s += "Buzz"
    output.append(s or str(i))
return " ".join(output)`,
        },
      },
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
      solution_py:`def solution(input_str):
    n = int(input_str)
    result = []
    for i in range(1, n+1):
        s = ""
        if i%3==0: s+="Fizz"
        if i%5==0: s+="Buzz"
        result.append(s or str(i))
    return ' '.join(result)`,
      time_complexity:"O(n)", space_complexity:"O(n)",
    },
  ],
  medium: [
    {
      id:"m1", title:"Longest Substring Without Repeating Characters", difficulty:"Medium", topic:"Sliding Window",
      companies:["amazon","google","microsoft","flipkart","zomato"],
      description:`Find the length of the longest substring without repeating characters.

Input: A string s
Output: Length (integer)`,
      examples:[{input:"abcabcbb",output:"3"},{input:"bbbbb",output:"1"},{input:"pwwkew",output:"3"}],
      testCases:[{input:"abcabcbb",output:"3"},{input:"bbbbb",output:"1"},{input:"pwwkew",output:"3"},{input:"abcdef",output:"6"}],
      approaches: {
        brute: {
          title:"Check All Substrings",
          complexity:"Time: O(n³) | Space: O(min(n,m))",
          idea:"Generate every possible substring and check if it has all unique characters.",
          steps:["For every i,j pair","Check if s[i..j] has all unique chars","Track maximum valid length"],
          pseudocode:`max_len = 0
for i in range(n):
    for j in range(i+1, n+1):
        if all_unique(s[i:j]):
            max_len = max(max_len, j-i)
return max_len`,
        },
        better: {
          title:"Sliding Window with Set",
          complexity:"Time: O(n) | Space: O(min(n,m))",
          idea:"Use a set to track characters in current window. Shrink from left when duplicate found.",
          steps:["Set and two pointers l,r starting at 0","Expand r: add s[r] to set","If s[r] already in set: remove s[l] and move l right","Update max window size"],
          pseudocode:`window = set()
l = 0, max_len = 0
for r in range(n):
    while s[r] in window:
        window.remove(s[l])
        l += 1
    window.add(s[r])
    max_len = max(max_len, r-l+1)`,
        },
        optimal: {
          title:"Sliding Window with HashMap",
          complexity:"Time: O(n) | Space: O(min(n,m))",
          idea:"Store last seen index of each character. Jump left pointer directly instead of shrinking one by one.",
          steps:["Map char → last seen index","For each char at r: if it exists in map and index >= l","Jump l directly to map[char]+1","Update map and max"],
          pseudocode:`seen = {}
l = 0, max_len = 0
for r, c in enumerate(s):
    if c in seen and seen[c] >= l:
        l = seen[c] + 1
    seen[c] = r
    max_len = max(max_len, r-l+1)
return max_len`,
        },
      },
      solution_js:`function solution(input) {
  const s=input.replace(/['"]/g,'');
  const seen={}; let l=0,max=0;
  for(let r=0;r<s.length;r++){
    if(s[r] in seen && seen[s[r]]>=l) l=seen[s[r]]+1;
    seen[s[r]]=r;
    max=Math.max(max,r-l+1);
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
      time_complexity:"O(n)", space_complexity:"O(min(n,m))",
    },
    {
      id:"m2", title:"Maximum Subarray (Kadane's)", difficulty:"Medium", topic:"Dynamic Programming",
      companies:["amazon","microsoft","google","flipkart"],
      description:`Find the contiguous subarray with the largest sum.

Input: Space-separated integers
Output: Maximum subarray sum`,
      examples:[{input:"-2 1 -3 4 -1 2 1 -5 4",output:"6"},{input:"1",output:"1"},{input:"-1 -2 -3",output:"-1"}],
      testCases:[{input:"-2 1 -3 4 -1 2 1 -5 4",output:"6"},{input:"1",output:"1"},{input:"-1 -2 -3",output:"-1"},{input:"5 4 -1 7 8",output:"23"}],
      approaches: {
        brute: {
          title:"Check All Subarrays",
          complexity:"Time: O(n²) | Space: O(1)",
          idea:"Try every possible subarray and find the one with maximum sum.",
          steps:["For every start i","Accumulate sum from i to j","Track global maximum"],
          pseudocode:`max_sum = -infinity
for i in range(n):
    curr = 0
    for j in range(i, n):
        curr += arr[j]
        max_sum = max(max_sum, curr)
return max_sum`,
        },
        better: {
          title:"Divide and Conquer",
          complexity:"Time: O(n log n) | Space: O(log n)",
          idea:"Split array at midpoint, solve left and right halves, handle crossing subarray separately.",
          steps:["Divide array in half","Find max subarray in left half","Find max subarray in right half","Find max crossing subarray","Return max of three"],
          pseudocode:`def max_sub(arr, lo, hi):
    if lo == hi: return arr[lo]
    mid = (lo+hi) // 2
    left = max_sub(arr, lo, mid)
    right = max_sub(arr, mid+1, hi)
    cross = max_crossing(arr, lo, mid, hi)
    return max(left, right, cross)`,
        },
        optimal: {
          title:"Kadane's Algorithm",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"At each position, decide: extend current subarray or start fresh? Track running max.",
          steps:["curr = arr[0], max_sum = arr[0]","For each next element","curr = max(element, curr+element)","Update max_sum = max(max_sum, curr)"],
          pseudocode:`curr = max_sum = arr[0]
for x in arr[1:]:
    curr = max(x, curr + x)
    max_sum = max(max_sum, curr)
return max_sum`,
        },
      },
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
      id:"m3", title:"Valid Parentheses (All Types)", difficulty:"Medium", topic:"Stack",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Given a string with '(', ')', '{', '}', '[', ']', determine if it is valid.

Input: String of brackets
Output: "true" or "false"`,
      examples:[{input:"()[]{}",output:"true"},{input:"(]",output:"false"},{input:"{[()]}",output:"true"}],
      testCases:[{input:"()[]{}",output:"true"},{input:"(]",output:"false"},{input:"{[()]}",output:"true"},{input:"([)]",output:"false"}],
      approaches: {
        brute: {
          title:"Replace Pairs Repeatedly",
          complexity:"Time: O(n²) | Space: O(n)",
          idea:"Repeatedly replace '()', '[]', '{}' with '' until no change. Valid if string becomes empty.",
          steps:["While string changes","Replace (), [], {} with empty string","Check if string is empty"],
          pseudocode:`while '()' in s or '[]' in s or '{}' in s:
    s = s.replace('()','').replace('[]','').replace('{}','')
return s == ''`,
        },
        better: {
          title:"Stack — Single Pass",
          complexity:"Time: O(n) | Space: O(n)",
          idea:"Stack holds unmatched opening brackets. On closing bracket, verify it matches the top.",
          steps:["For opening bracket: push to stack","For closing bracket: pop from stack and verify match","At end: stack must be empty"],
          pseudocode:`stack = []
match = {')':'(', ']':'[', '}':'{'}
for c in s:
    if c in '([{': stack.append(c)
    elif not stack or stack[-1] != match[c]:
        return false
    else: stack.pop()
return len(stack) == 0`,
        },
        optimal: {
          title:"Stack is Already Optimal",
          complexity:"Time: O(n) | Space: O(n)",
          idea:"Cannot do better than O(n) time — must read every character. Stack approach achieves this.",
          steps:["O(n) time is theoretical minimum","O(n) space needed in worst case: all opening brackets","Stack solution is optimal"],
          pseudocode:`// Stack approach from Better is optimal
// No improvement possible for this problem`,
        },
      },
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
      id:"m4", title:"Binary Search", difficulty:"Medium", topic:"Searching",
      companies:["amazon","microsoft","google","tcs"],
      description:`Implement binary search. Return index of target in sorted array, or -1.

Input: "arr_elements|target" (array is sorted)
Output: Index or -1`,
      examples:[{input:"1 3 5 7 9 11|7",output:"3"},{input:"1 2 3 4 5|6",output:"-1"}],
      testCases:[{input:"1 3 5 7 9 11|7",output:"3"},{input:"1 2 3 4 5|6",output:"-1"},{input:"1|1",output:"0"},{input:"1 2 3 4 5|1",output:"0"}],
      approaches: {
        brute: {
          title:"Linear Search",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Scan from left to right until target found.",
          steps:["For each index i","If arr[i] == target: return i","Return -1 if not found"],
          pseudocode:`for i in range(n):
    if arr[i] == target:
        return i
return -1`,
        },
        better: {
          title:"Binary Search — Iterative",
          complexity:"Time: O(log n) | Space: O(1)",
          idea:"Divide search space in half at each step by comparing midpoint with target.",
          steps:["lo=0, hi=n-1","While lo<=hi: mid=(lo+hi)//2","If arr[mid]==target: return mid","If arr[mid]<target: lo=mid+1","Else hi=mid-1","Return -1"],
          pseudocode:`lo, hi = 0, n-1
while lo <= hi:
    mid = (lo + hi) // 2
    if arr[mid] == target: return mid
    elif arr[mid] < target: lo = mid + 1
    else: hi = mid - 1
return -1`,
        },
        optimal: {
          title:"Binary Search — Recursive",
          complexity:"Time: O(log n) | Space: O(log n) stack",
          idea:"Recursively search halves. Same time complexity as iterative but uses stack space.",
          steps:["base case: lo > hi → return -1","mid=(lo+hi)//2","Recursively search left or right half"],
          pseudocode:`def search(arr, lo, hi, target):
    if lo > hi: return -1
    mid = (lo + hi) // 2
    if arr[mid] == target: return mid
    elif arr[mid] < target: return search(arr, mid+1, hi, target)
    else: return search(arr, lo, mid-1, target)`,
        },
      },
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
      solution_py:`def solution(input_str):
    arr, t = input_str.split('|')
    nums = list(map(int, arr.split()))
    target = int(t)
    lo, hi = 0, len(nums)-1
    while lo <= hi:
        mid = (lo+hi)//2
        if nums[mid] == target: return str(mid)
        elif nums[mid] < target: lo = mid+1
        else: hi = mid-1
    return "-1"`,
      time_complexity:"O(log n)", space_complexity:"O(1)",
    },
    {
      id:"m5", title:"Number of Islands", difficulty:"Medium", topic:"BFS/DFS",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Count number of islands in a grid. '1'=land, '0'=water. Island: connected adjacent lands.

Input: Grid rows separated by '|', cells by space
Output: Number of islands`,
      examples:[{input:"1 1 0|0 1 0|0 0 1",output:"2"},{input:"1 0|0 1",output:"2"}],
      testCases:[{input:"1 1 0|0 1 0|0 0 1",output:"2"},{input:"1 0|0 1",output:"2"},{input:"1 1|1 1",output:"1"},{input:"0 0|0 0",output:"0"}],
      approaches: {
        brute: {
          title:"DFS — Flood Fill",
          complexity:"Time: O(m×n) | Space: O(m×n)",
          idea:"When land cell found, use DFS to mark all connected land as visited (change to 0). Count DFS starts.",
          steps:["For each cell (r,c) with value 1","Increment island count","DFS from (r,c) marking all connected 1s as 0"],
          pseudocode:`count = 0
for r in range(rows):
    for c in range(cols):
        if grid[r][c] == '1':
            count += 1
            dfs(r, c)
            
def dfs(r, c):
    if out_of_bounds or grid[r][c]!='1': return
    grid[r][c] = '0'  // mark visited
    dfs(r+1,c), dfs(r-1,c), dfs(r,c+1), dfs(r,c-1)`,
        },
        better: {
          title:"BFS — Level Order",
          complexity:"Time: O(m×n) | Space: O(min(m,n))",
          idea:"Use BFS queue instead of recursion. Avoids deep call stack for large grids.",
          steps:["For each unvisited land cell","Start BFS from that cell","Add all neighbors to queue, mark visited","Increment count per BFS start"],
          pseudocode:`from collections import deque
for r,c where grid[r][c]=='1':
    count += 1
    q = deque([(r,c)])
    while q:
        r,c = q.popleft()
        for nr,nc in neighbors(r,c):
            if valid and grid[nr][nc]=='1':
                grid[nr][nc] = '0'
                q.append((nr,nc))`,
        },
        optimal: {
          title:"Union-Find (Disjoint Sets)",
          complexity:"Time: O(m×n × α(m×n)) | Space: O(m×n)",
          idea:"Treat each cell as a node. Union adjacent land cells. Count distinct components.",
          steps:["Initialize UF with n*m nodes","For each land cell, union with right and down neighbors","Count distinct roots of land cells"],
          pseudocode:`uf = UnionFind(rows * cols)
for r,c where grid[r][c]=='1':
    if right is land: uf.union(cell, right)
    if down is land: uf.union(cell, down)
return count of distinct roots`,
        },
      },
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
      solution_py:`def solution(input_str):
    grid = [list(map(int, row.split())) for row in input_str.split('|')]
    def dfs(r,c):
        if r<0 or r>=len(grid) or c<0 or c>=len(grid[0]) or grid[r][c]==0: return
        grid[r][c]=0
        dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1)
    count=0
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c]==1: count+=1; dfs(r,c)
    return str(count)`,
      time_complexity:"O(m×n)", space_complexity:"O(m×n)",
    },
    {
      id:"m6", title:"Stock Buy Sell Best Profit", difficulty:"Medium", topic:"Greedy",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Given prices array, find max profit from one buy and one sell (buy before sell).

Input: Space-separated prices
Output: Maximum profit (0 if no profit possible)`,
      examples:[{input:"7 1 5 3 6 4",output:"5"},{input:"7 6 4 3 1",output:"0"}],
      testCases:[{input:"7 1 5 3 6 4",output:"5"},{input:"7 6 4 3 1",output:"0"},{input:"1 2",output:"1"},{input:"2 4 1 7",output:"6"}],
      approaches: {
        brute: {
          title:"Try All Pairs",
          complexity:"Time: O(n²) | Space: O(1)",
          idea:"For each buy day, find the best sell day after it. Track maximum profit.",
          steps:["For each i (buy day)","For each j > i (sell day)","profit = price[j]-price[i]","Track maximum profit"],
          pseudocode:`max_profit = 0
for i in range(n):
    for j in range(i+1, n):
        profit = prices[j] - prices[i]
        max_profit = max(max_profit, profit)
return max_profit`,
        },
        better: {
          title:"Track Running Minimum",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Track the minimum price seen so far. At each day, potential profit = current - min_so_far.",
          steps:["min_price = prices[0]","max_profit = 0","For each price: profit=price-min_price","Update max_profit","Update min_price if lower"],
          pseudocode:`min_price = prices[0]
max_profit = 0
for price in prices:
    profit = price - min_price
    max_profit = max(max_profit, profit)
    min_price = min(min_price, price)
return max_profit`,
        },
        optimal: {
          title:"Same as Better (already optimal)",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Single pass O(n) is the theoretical minimum — must examine every price at least once. The running minimum approach is optimal.",
          steps:["Cannot improve beyond O(n) time","Cannot improve beyond O(1) space","Running minimum approach achieves both bounds"],
          pseudocode:`// The "Better" approach IS the optimal solution
// O(n) time, O(1) space — cannot be improved`,
        },
      },
      solution_js:`function solution(input) {
  const p=input.split(' ').map(Number);
  let minP=p[0],maxProfit=0;
  for(const price of p){
    maxProfit=Math.max(maxProfit,price-minP);
    minP=Math.min(minP,price);
  }
  return String(maxProfit);
}`,
      solution_py:`def solution(input_str):
    prices = list(map(int, input_str.split()))
    min_price = prices[0]; max_profit = 0
    for price in prices:
        max_profit = max(max_profit, price - min_price)
        min_price = min(min_price, price)
    return str(max_profit)`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
  ],
  hard: [
    {
      id:"h1", title:"Trapping Rain Water", difficulty:"Hard", topic:"Two Pointers",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Given elevation map array, compute how much water can be trapped.

Input: Space-separated heights
Output: Total water units trapped`,
      examples:[{input:"0 1 0 2 1 0 1 3 2 1 2 1",output:"6"},{input:"4 2 0 3 2 5",output:"9"}],
      testCases:[{input:"0 1 0 2 1 0 1 3 2 1 2 1",output:"6"},{input:"4 2 0 3 2 5",output:"9"},{input:"1 0 1",output:"1"},{input:"3 0 0 2 0 4",output:"10"}],
      approaches: {
        brute: {
          title:"Per-Column Water Calculation",
          complexity:"Time: O(n²) | Space: O(1)",
          idea:"For each column, water = min(max_left, max_right) - height. Find max_left and max_right by scanning.",
          steps:["For each column i","Find max height to the left: max(h[0..i])","Find max height to the right: max(h[i..n-1])","Water at i = min(max_left, max_right) - h[i]"],
          pseudocode:`total = 0
for i in range(n):
    max_left = max(h[0:i+1])
    max_right = max(h[i:n])
    water = min(max_left, max_right) - h[i]
    total += water
return total`,
        },
        better: {
          title:"Precompute Left/Right Maxima",
          complexity:"Time: O(n) | Space: O(n)",
          idea:"Precompute max from left and right in separate arrays. Then calculate water in O(n).",
          steps:["Build left_max[i] = max(h[0..i])","Build right_max[i] = max(h[i..n-1])","For each i: water=min(left_max[i],right_max[i])-h[i]"],
          pseudocode:`left_max[0] = h[0]
for i in 1..n: left_max[i] = max(left_max[i-1], h[i])
right_max[n-1] = h[n-1]
for i in n-2..0: right_max[i] = max(right_max[i+1], h[i])
total = sum(min(left_max[i],right_max[i])-h[i] for i in range(n))`,
        },
        optimal: {
          title:"Two Pointer — O(1) Space",
          complexity:"Time: O(n) | Space: O(1)",
          idea:"Two pointers from both ends. The smaller side determines water trapped. Move inward greedily.",
          steps:["l=0, r=n-1, lMax=0, rMax=0","If h[l]<h[r]: process left side","  If h[l]>=lMax: update lMax","  Else: water += lMax-h[l]","  l++","Else: process right side symmetrically"],
          pseudocode:`l, r = 0, n-1
lMax = rMax = 0
water = 0
while l < r:
    if h[l] < h[r]:
        if h[l] >= lMax: lMax = h[l]
        else: water += lMax - h[l]
        l += 1
    else:
        if h[r] >= rMax: rMax = h[r]
        else: water += rMax - h[r]
        r -= 1
return water`,
        },
      },
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
      solution_py:`def solution(input_str):
    h = list(map(int, input_str.split()))
    l, r = 0, len(h)-1
    lMax = rMax = water = 0
    while l < r:
        if h[l] < h[r]:
            if h[l] >= lMax: lMax = h[l]
            else: water += lMax - h[l]
            l += 1
        else:
            if h[r] >= rMax: rMax = h[r]
            else: water += rMax - h[r]
            r -= 1
    return str(water)`,
      time_complexity:"O(n)", space_complexity:"O(1)",
    },
    {
      id:"h2", title:"LRU Cache", difficulty:"Hard", topic:"Design",
      companies:["amazon","google","microsoft"],
      description:`Design an LRU Cache. Simulate operations.
Input: "capacity|operations" where operations are "get k" or "put k v" separated by ;
Output: Results of get operations separated by space (-1 if not found)`,
      examples:[{input:"2|put 1 1;put 2 2;get 1;put 3 3;get 2;get 1",output:"1 -1 1"}],
      testCases:[{input:"2|put 1 1;put 2 2;get 1;put 3 3;get 2;get 1",output:"1 -1 1"},{input:"1|put 1 1;get 1;put 2 2;get 1;get 2",output:"1 -1 2"},{input:"2|put 1 1;put 2 2;get 1",output:"1"},{input:"1|get 1",output:"-1"}],
      approaches: {
        brute: {
          title:"Array-Based with Timestamps",
          complexity:"Time: O(n) per op | Space: O(capacity)",
          idea:"Store key-value-timestamp tuples. On eviction, find and remove the oldest entry.",
          steps:["Store (key,value,time) tuples","On get: update timestamp","On put: if full, remove min-timestamp entry","Linear scan for LRU victim"],
          pseudocode:`cache = []  // list of (key, val, time)
time = 0
get(k): find k, update its time, return val
put(k,v): if full, remove entry with min time
          add/update (k,v,time)`,
        },
        better: {
          title:"HashMap + Doubly Linked List",
          complexity:"Time: O(1) per op | Space: O(capacity)",
          idea:"HashMap for O(1) lookup. DLL for O(1) reorder. Head=most recent, Tail=least recent.",
          steps:["HashMap: key → node","DLL: maintain order by recency","Get: find in map, move to head","Put: add to head; if over capacity, remove tail"],
          pseudocode:`map = {}
dll = DoublyLinkedList()  // head(MRU) ↔ ... ↔ tail(LRU)

get(k):
    if k not in map: return -1
    move map[k] to head
    return map[k].val

put(k,v):
    if k in map: remove from dll
    add new node to head
    map[k] = new_node
    if size > cap: remove tail; del map[tail.key]`,
        },
        optimal: {
          title:"Ordered HashMap (OrderedDict)",
          complexity:"Time: O(1) per op | Space: O(capacity)",
          idea:"Python's OrderedDict maintains insertion order. Move to end on access, remove first on eviction.",
          steps:["Use OrderedDict (insertion-ordered map)","Get: pop and re-insert to move to end","Put: insert/update, evict from front if over capacity"],
          pseudocode:`from collections import OrderedDict
cache = OrderedDict()

get(k):
    if k not in cache: return -1
    cache.move_to_end(k)
    return cache[k]

put(k,v):
    if k in cache: cache.move_to_end(k)
    cache[k] = v
    if len(cache) > cap:
        cache.popitem(last=False)  // remove LRU`,
        },
      },
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
      id:"h3", title:"Longest Increasing Subsequence", difficulty:"Hard", topic:"Dynamic Programming",
      companies:["amazon","google","microsoft","flipkart"],
      description:`Find the length of the longest strictly increasing subsequence.

Input: Space-separated integers
Output: LIS length`,
      examples:[{input:"10 9 2 5 3 7 101 18",output:"4"},{input:"0 1 0 3 2 3",output:"4"}],
      testCases:[{input:"10 9 2 5 3 7 101 18",output:"4"},{input:"0 1 0 3 2 3",output:"4"},{input:"7 7 7",output:"1"},{input:"1 2 3 4 5",output:"5"}],
      approaches: {
        brute: {
          title:"Recursion — Try All Subsequences",
          complexity:"Time: O(2ⁿ) | Space: O(n)",
          idea:"For each element, try including or excluding it. Track current LIS length.",
          steps:["For each element, either include or skip","If included, must be > previous included element","Recursively solve remaining"],
          pseudocode:`def lis(i, prev):
    if i == n: return 0
    skip = lis(i+1, prev)
    take = 0
    if arr[i] > prev:
        take = 1 + lis(i+1, arr[i])
    return max(skip, take)`,
        },
        better: {
          title:"Dynamic Programming",
          complexity:"Time: O(n²) | Space: O(n)",
          idea:"dp[i] = LIS ending at index i. For each i, check all j < i where arr[j] < arr[i].",
          steps:["dp[i] = 1 for all i (each element is LIS of length 1)","For each i from 1 to n-1","For each j from 0 to i-1","If arr[j]<arr[i]: dp[i]=max(dp[i],dp[j]+1)","Answer = max(dp)"],
          pseudocode:`dp = [1] * n
for i in range(1, n):
    for j in range(i):
        if arr[j] < arr[i]:
            dp[i] = max(dp[i], dp[j]+1)
return max(dp)`,
        },
        optimal: {
          title:"Binary Search + Patience Sorting",
          complexity:"Time: O(n log n) | Space: O(n)",
          idea:"Maintain 'tails' array where tails[i] = smallest tail of all increasing subsequences of length i+1. Binary search to find position for each element.",
          steps:["For each element x","Binary search in tails for first value >= x","Replace that position with x (or append if x > all)","Length of tails = LIS length"],
          pseudocode:`tails = []
for x in arr:
    lo, hi = 0, len(tails)
    while lo < hi:
        mid = (lo+hi)//2
        if tails[mid] < x: lo = mid+1
        else: hi = mid
    if lo == len(tails): tails.append(x)
    else: tails[lo] = x
return len(tails)`,
        },
      },
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
      solution_py:`def solution(input_str):
    nums = list(map(int, input_str.split()))
    tails = []
    for n in nums:
        lo, hi = 0, len(tails)
        while lo < hi:
            mid = (lo+hi)//2
            if tails[mid] < n: lo = mid+1
            else: hi = mid
        if lo == len(tails): tails.append(n)
        else: tails[lo] = n
    return str(len(tails))`,
      time_complexity:"O(n log n)", space_complexity:"O(n)",
    },
  ],
};

// ─── COMPANY DATA ───────────────────────────────────────────────────────────
const SERVICE_COMPANIES = {
  tcs:{name:"TCS",color:"#1d4ed8",emoji:"🏢",full:"TCS NQT",type:"service",desc:"Numerical Ability, Verbal English, Logical Reasoning, Coding.",codingTopics:["Arrays","Strings","Pattern Programs","Basic DP","Sorting"]},
  infosys:{name:"Infosys",color:"#7c3aed",emoji:"🔷",full:"InfyTQ",type:"service",desc:"Aptitude, Reasoning, Verbal, Power Programmer.",codingTopics:["Java OOPs","Python","DSA Basics","SQL","Strings"]},
  wipro:{name:"Wipro",color:"#16a34a",emoji:"🌐",full:"NLTH",type:"service",desc:"Aptitude, Essay, Coding. No negative marking.",codingTopics:["C/C++","Python","LinkedList","Recursion","Arrays"]},
  hcl:{name:"HCL",color:"#0284c7",emoji:"🔵",full:"TechBee",type:"service",desc:"Aptitude, Reasoning, Technical MCQs, Coding.",codingTopics:["DBMS","OOPs","Basic Algorithms","SQL","Patterns"]},
  cognizant:{name:"Cognizant",color:"#ea580c",emoji:"🟠",full:"GenC",type:"service",desc:"Aptitude, Coding, Communication.",codingTopics:["Python","Java","Pseudo Code","Problem Solving"]},
  accenture:{name:"Accenture",color:"#a855f7",emoji:"💜",full:"Hiring",type:"service",desc:"Aptitude, Critical Thinking, Coding + Communication.",codingTopics:["Logic Building","Pseudo Code","Python Basics","SQL"]},
  capgemini:{name:"Capgemini",color:"#0891b2",emoji:"🟦",full:"Tech",type:"service",desc:"Pseudo Code, Behavioural, Game-Based, Technical.",codingTopics:["Pseudo Code","Java","Python","Algorithm Design"]},
  techmah:{name:"Tech Mahindra",color:"#dc2626",emoji:"🔴",full:"TechM",type:"service",desc:"Aptitude, Verbal, Technical, Coding round.",codingTopics:["C++","Java","DSA","String Manipulation"]},
  mphasis:{name:"Mphasis",color:"#059669",emoji:"🟢",full:"Mphasis",type:"service",desc:"Aptitude, Verbal, Technical MCQ, Coding.",codingTopics:["Java","Python","SQL","OOPs","Arrays"]},
  ltimindtree:{name:"LTIMindtree",color:"#9333ea",emoji:"🌳",full:"LTIMindtree",type:"service",desc:"Cognitive Assessment, Technical, Coding.",codingTopics:["Java","Python","SQL","DSA Basics","Strings"]},
  hexaware:{name:"Hexaware",color:"#dc8500",emoji:"🟡",full:"Hexaware",type:"service",desc:"Aptitude, Technical, Coding Test.",codingTopics:["Arrays","Strings","OOPs","SQL","Algorithms"]},
  coforge:{name:"Coforge",color:"#0f766e",emoji:"🔶",full:"Coforge",type:"service",desc:"Aptitude, Reasoning, Technical, Coding.",codingTopics:["Python","Java","Arrays","Logic","SQL"]},
  persistent:{name:"Persistent",color:"#7c2d12",emoji:"🏗️",full:"Persistent",type:"service",desc:"Aptitude, Verbal, Coding (DSA-focused).",codingTopics:["DSA","Java","Python","Strings","Trees"]},
  epam:{name:"EPAM",color:"#1e3a5f",emoji:"🔷",full:"EPAM",type:"service",desc:"Technical screening, Coding Test, Problem Solving.",codingTopics:["Java","OOPs","Design Patterns","Arrays","Algorithms"]},
  dxc:{name:"DXC Technology",color:"#6b21a8",emoji:"🌀",full:"DXC",type:"service",desc:"Aptitude, Technical MCQ, Coding.",codingTopics:["Java","Python","SQL","OOPs","Arrays"]},
};

const PRODUCT_COMPANIES = {
  amazon:{name:"Amazon",color:"#d97706",emoji:"📦",full:"SDE OA",type:"product",desc:"OA: 2 DSA + Work Simulation + 16 LPs.",codingTopics:["Arrays","Hash Maps","Two Pointers","BFS/DFS","DP","Linked Lists"]},
  microsoft:{name:"Microsoft",color:"#0284c7",emoji:"🪟",full:"SDE",type:"product",desc:"DSA rounds + System Design + Behavioral.",codingTopics:["Trees","Graphs","DP","Backtracking","System Design"]},
  google:{name:"Google",color:"#dc2626",emoji:"🔍",full:"SWE",type:"product",desc:"Multiple coding rounds: Graphs, DP, optimization.",codingTopics:["Graphs","DP","Segment Trees","Tries","Advanced DSA"]},
  flipkart:{name:"Flipkart",color:"#f59e0b",emoji:"🛒",full:"SDE",type:"product",desc:"OA: DSA + Technical + Product Thinking.",codingTopics:["Arrays","Trees","DP","SQL","System Design"]},
  zomato:{name:"Zomato",color:"#ef4444",emoji:"🍕",full:"SDE",type:"product",desc:"DSA + Product Sense + Case Studies.",codingTopics:["SQL","Python","DSA Medium","Geospatial","System Design"]},
  razorpay:{name:"Razorpay",color:"#3b82f6",emoji:"💳",full:"SDE",type:"product",desc:"Fintech DSA + System Design + Payments domain.",codingTopics:["DSA Medium-Hard","APIs","Java/Go","Distributed Systems"]},
  swiggy:{name:"Swiggy",color:"#f97316",emoji:"🛵",full:"SDE",type:"product",desc:"DSA + System Design + Product Thinking.",codingTopics:["Arrays","Graphs","DP","System Design","SQL"]},
  paytm:{name:"Paytm",color:"#1d4ed8",emoji:"📱",full:"SDE",type:"product",desc:"Fintech DSA + System Design.",codingTopics:["Java","Distributed Systems","Arrays","DP","SQL"]},
  ola:{name:"Ola",color:"#16a34a",emoji:"🚗",full:"SDE",type:"product",desc:"Mobility DSA + Backend Systems.",codingTopics:["Maps/Graphs","System Design","Java","Python","APIs"]},
  phonepe:{name:"PhonePe",color:"#6d28d9",emoji:"💜",full:"SDE",type:"product",desc:"Fintech coding + System Design.",codingTopics:["Java","Distributed Systems","DSA","SQL","APIs"]},
  meesho:{name:"Meesho",color:"#db2777",emoji:"👗",full:"SDE",type:"product",desc:"E-commerce DSA + System Design.",codingTopics:["Python","Java","DSA","SQL","Algorithms"]},
  cred:{name:"CRED",color:"#1e293b",emoji:"🃏",full:"SDE",type:"product",desc:"Quality-focused DSA + System Design.",codingTopics:["Java","Kotlin","DSA Hard","System Design","APIs"]},
  freshworks:{name:"Freshworks",color:"#22c55e",emoji:"🌱",full:"SDE",type:"product",desc:"Product-focused DSA + APIs + SaaS Systems.",codingTopics:["Ruby","Python","Java","APIs","DSA"]},
  zoho:{name:"Zoho",color:"#dc2626",emoji:"☁️",full:"SDE",type:"product",desc:"Manual written round + Technical + Coding.",codingTopics:["Java","C++","OOPs","DSA","SQL"]},
  atlassian:{name:"Atlassian",color:"#0052cc",emoji:"🔷",full:"SDE",type:"product",desc:"Coding + System Design (Jira/Confluence context).",codingTopics:["Java","Python","System Design","DSA","APIs"]},
  adobe:{name:"Adobe",color:"#cc0000",emoji:"🎨",full:"SDE",type:"product",desc:"Creative tech + DSA + System Design.",codingTopics:["C++","Java","DSA","System Design","Algorithms"]},
  uber:{name:"Uber",color:"#000000",emoji:"🚙",full:"SDE",type:"product",desc:"Geospatial systems + DSA + System Design.",codingTopics:["Maps/Graphs","Distributed Systems","Python","DSA Hard"]},
  twitter:{name:"Twitter/X",color:"#1da1f2",emoji:"🐦",full:"SDE",type:"product",desc:"Social media infra + DSA + System Design.",codingTopics:["Distributed Systems","Graphs","DSA","Java/Scala","APIs"]},
  linkedin:{name:"LinkedIn",color:"#0a66c2",emoji:"💼",full:"SDE",type:"product",desc:"Professional network systems + DSA.",codingTopics:["Java","Distributed Systems","Graphs","DSA","SQL"]},
  bytedance:{name:"ByteDance",color:"#000000",emoji:"🎵",full:"SDE",type:"product",desc:"Algorithm-heavy + System Design.",codingTopics:["C++","Java","DSA Hard","Algorithms","System Design"]},
};

const ALL_COMPANIES = {...SERVICE_COMPANIES,...PRODUCT_COMPANIES};

// ─── LANGUAGE CONFIG ────────────────────────────────────────────────────────
const LANGUAGES = [
  {id:"javascript",label:"JS",fullLabel:"JavaScript",icon:"🟨",color:"#f7df1e",
    template:(p)=>`function solution(input) {\n  // Write your solution here\n  // Input: ${p?.examples?.[0]?.input||'see examples'}\n  // Output: ${p?.examples?.[0]?.output||'see examples'}\n  \n  return '';\n}`},
  {id:"python",label:"Python",fullLabel:"Python",icon:"🐍",color:"#3776ab",
    template:(p)=>`def solution(input_str):\n    # Write your solution here\n    # Input: ${p?.examples?.[0]?.input||'see examples'}\n    # Output: ${p?.examples?.[0]?.output||'see examples'}\n    \n    return ''`},
  {id:"java",label:"Java",fullLabel:"Java",icon:"☕",color:"#b07219",
    template:(p)=>`public static String solution(String input) {\n    // Write your solution here\n    // Input: ${p?.examples?.[0]?.input||'see examples'}\n    // Output: ${p?.examples?.[0]?.output||'see examples'}\n    \n    return "";\n}`},
  {id:"cpp",label:"C++",fullLabel:"C++",icon:"⚙️",color:"#659ad2",
    template:(p)=>`#include <bits/stdc++.h>\nusing namespace std;\n\nstring solution(string input) {\n    // Write your solution here\n    // Input: ${p?.examples?.[0]?.input||'see examples'}\n    // Output: ${p?.examples?.[0]?.output||'see examples'}\n    \n    return "";\n}`},
  {id:"c",label:"C",fullLabel:"C",icon:"🔵",color:"#555555",
    template:(p)=>`#include <stdio.h>\n#include <string.h>\n\nvoid solution(char* input, char* output) {\n    // Write your solution here\n    // Input: ${p?.examples?.[0]?.input||'see examples'}\n    // Output: ${p?.examples?.[0]?.output||'see examples'}\n    \n    strcpy(output, "");\n}`},
];

// ─── ROOT ──────────────────────────────────────────────────────────────────
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

// ─── LANDING PAGE ──────────────────────────────────────────────────────────
function LandingPage({ onGetStarted }) {
  const stats = [{n:"45+",l:"Companies"},{n:"500+",l:"Questions"},{n:"80+",l:"Coding Problems"},{n:"10K+",l:"Students"}];
  const companies = ["🏢 TCS","🔷 Infosys","🌐 Wipro","📦 Amazon","🪟 Microsoft","🔍 Google","🛒 Flipkart","🟠 Cognizant"];

  return (
    <div style={{minHeight:"100vh",background:"#0f172a",fontFamily:"'Inter',sans-serif"}}>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 48px",borderBottom:"1px solid #1e293b"}}>
        <div style={{color:"#fff",fontWeight:900,fontSize:22}}>🎯 TakePlace</div>
        <div style={{display:"flex",gap:12}}>
          <Btn variant="ghost" onClick={onGetStarted} style={{color:"#94a3b8",border:"1px solid #334155"}}>Sign In</Btn>
          <Btn variant="cta" onClick={onGetStarted}>Get Started Free</Btn>
        </div>
      </nav>

      {/* HERO */}
      <div style={{textAlign:"center",padding:"80px 24px 60px",maxWidth:760,margin:"0 auto"}}>
        <div className="fade">
          <div style={{background:"#1e293b",border:"1px solid #334155",display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,marginBottom:24}}>
            <span style={{color:"#22c55e",fontSize:10}}>●</span>
            <span style={{color:"#94a3b8",fontSize:13,fontWeight:600}}>India's #1 Interview Prep Platform for Freshers</span>
          </div>
          <h1 style={{fontSize:52,fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:20}}>
            Crack Your Dream<br/>
            <span style={{background:"linear-gradient(135deg,#2563eb,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Company Interview</span>
          </h1>
          <p style={{fontSize:18,color:"#64748b",marginBottom:40,lineHeight:1.7}}>
            Company-specific mock tests · Aptitude practice · Live coding in 5 languages ·
            AI resume builder · Latest job openings. Everything in one place.
          </p>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <Btn variant="cta" size="lg" onClick={onGetStarted} style={{fontSize:16,padding:"16px 40px",borderRadius:12}} className="glow-btn">
              Start Practicing Free →
            </Btn>
            <Btn variant="ghost" size="lg" onClick={onGetStarted} style={{color:"#fff",border:"1px solid #334155",fontSize:16,padding:"16px 40px",borderRadius:12}}>
              View Companies
            </Btn>
          </div>
          <p style={{color:"#475569",fontSize:12,marginTop:16}}>No credit card · Free forever for students</p>
        </div>
      </div>

      {/* COMPANY TICKER */}
      <div style={{background:"#0a0f1a",borderTop:"1px solid #1e293b",borderBottom:"1px solid #1e293b",padding:"16px 0",marginBottom:60,overflow:"hidden"}}>
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...companies,...companies].map((c,i)=>(
              <span key={i} style={{color:"#475569",fontSize:14,fontWeight:600,flexShrink:0}}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24,maxWidth:800,margin:"0 auto 80px",padding:"0 24px"}}>
        {stats.map(s=>(
          <div key={s.l} style={{textAlign:"center"}}>
            <div style={{fontSize:40,fontWeight:900,background:"linear-gradient(135deg,#2563eb,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.n}</div>
            <div style={{color:"#64748b",fontSize:14,fontWeight:600}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px 80px"}}>
        <h2 style={{textAlign:"center",color:"#fff",fontSize:32,fontWeight:800,marginBottom:8}}>Everything You Need to Get Placed</h2>
        <p style={{textAlign:"center",color:"#64748b",fontSize:16,marginBottom:48}}>One platform. Every company. Every skill.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20}}>
          {[
            {icon:"🏢",title:"Company-Specific Tests",desc:"Exact pattern mock tests for TCS, Infosys, Amazon, and 42+ more companies with real question banks.",color:"#2563eb"},
            {icon:"💻",title:"Live Code Execution",desc:"Write in JavaScript, Python, Java, C++ or C. All languages execute with real test case results.",color:"#16a34a"},
            {icon:"🧠",title:"3-Level Approach",desc:"Every problem shows Brute Force → Better → Optimal approach. Learn to think, not memorize.",color:"#7c3aed"},
            {icon:"📄",title:"AI Resume Builder",desc:"Paste your resume, get AI-powered ATS score, keyword suggestions, and improvement tips.",color:"#d97706"},
            {icon:"💼",title:"Live Job Board",desc:"Real openings from Adzuna API. Search 1000s of fresh tech jobs across India's top companies.",color:"#ef4444"},
            {icon:"⏱️",title:"Timed Mock Tests",desc:"Company-accurate timing. Aptitude rounds with 90 seconds per question like the real exam.",color:"#0d9488"},
          ].map(f=>(
            <div key={f.title} style={{background:"#1e293b",borderRadius:16,padding:28,border:"1px solid #334155"}}>
              <div style={{fontSize:32,marginBottom:12}}>{f.icon}</div>
              <h3 style={{color:"#fff",fontWeight:700,marginBottom:8,fontSize:16}}>{f.title}</h3>
              <p style={{color:"#64748b",fontSize:13,lineHeight:1.6}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{textAlign:"center",padding:"60px 24px",background:"#0a0f1a",borderTop:"1px solid #1e293b"}}>
        <h2 style={{color:"#fff",fontSize:32,fontWeight:900,marginBottom:12}}>Ready to Get Placed?</h2>
        <p style={{color:"#64748b",marginBottom:32}}>Join 10,000+ students already cracking their dream companies</p>
        <Btn variant="cta" size="lg" onClick={onGetStarted} style={{fontSize:16,padding:"16px 48px",borderRadius:12}}>
          Start Free Today →
        </Btn>
        <p style={{color:"#334155",fontSize:12,marginTop:16}}>
          Support: {SUPPORT_EMAIL}
        </p>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ─────────────────────────────────────────────────────────────
function AuthPage({ onLogin, onBack }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const handleGoogle = async () => {
    setGoogleLoading(true); setError("");
    try {
      const { error: e } = await supabase.auth.signInWithOAuth({
        provider:"google",
        options:{ redirectTo: window.location.origin }
      });
      if(e) throw e;
    } catch(e) { setError(e.message); }
    setGoogleLoading(false);
  };

  const handle = async () => {
    setError(""); setMsg(""); setLoading(true);
    try {
      if(mode==="login") {
        const {data,error:e}=await supabase.auth.signInWithPassword({email,password});
        if(e) throw e;
        onLogin(data.user);
      } else if(mode==="signup") {
        const {data,error:e}=await supabase.auth.signUp({email,password,options:{data:{name}}});
        if(e) throw e;
        if(data.user&&!data.session) setMsg("Check your email to confirm your account!");
        else if(data.user) onLogin(data.user);
      } else {
        const {error:e}=await supabase.auth.resetPasswordForEmail(email);
        if(e) throw e;
        setMsg("Password reset email sent!");
      }
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",fontFamily:"'Inter',sans-serif"}}>
      <style>{css}</style>
      {/* Left panel */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"48px",background:"linear-gradient(135deg,#0f172a,#1e293b)",borderRight:"1px solid #334155"}} className="hide-mobile">
        <div style={{color:"#fff",fontWeight:900,fontSize:28,marginBottom:8}}>🎯 TakePlace</div>
        <p style={{color:"#64748b",marginBottom:48,fontSize:16}}>India's #1 Interview Prep Platform</p>
        {["✅ 45+ Company mock tests","✅ 80+ Coding problems with 3-level approach","✅ Live execution in JS, Python, Java, C++, C","✅ AI Resume Builder with ATS score","✅ Live job board with 1000s of openings"].map(f=>(
          <div key={f} style={{color:"#94a3b8",fontSize:15,marginBottom:16,fontWeight:500}}>{f}</div>
        ))}
      </div>
      {/* Right panel */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:32}}>
        <div className="fade" style={{width:"100%",maxWidth:420}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24,fontFamily:"'Inter',sans-serif"}}>← Back to home</button>
          <h2 style={{color:"#fff",fontWeight:800,fontSize:26,marginBottom:4}}>
            {mode==="login"?"Welcome back":"Create account"}
          </h2>
          <p style={{color:"#64748b",fontSize:14,marginBottom:28}}>
            {mode==="login"?"Sign in to continue your prep":"Start your placement journey today"}
          </p>

          {/* Google OAuth */}
          {mode!=="forgot" && (
            <button onClick={handleGoogle} disabled={googleLoading}
              style={{width:"100%",padding:"13px",borderRadius:12,border:"1.5px solid #334155",background:"#1e293b",color:"#fff",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:15,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:20,transition:"all .2s"}}>
              {googleLoading ? <SpinIcon size={18}/> : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continue with Google
            </button>
          )}

          {mode!=="forgot" && (
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <div style={{flex:1,height:1,background:"#1e293b"}}/>
              <span style={{color:"#475569",fontSize:12}}>or with email</span>
              <div style={{flex:1,height:1,background:"#1e293b"}}/>
            </div>
          )}

          {error && <div style={{background:"#dc262620",border:"1px solid #dc2626",color:"#fca5a5",padding:"10px 14px",borderRadius:10,fontSize:13,marginBottom:16}}>{error}</div>}
          {msg   && <div style={{background:"#16a34a20",border:"1px solid #16a34a",color:"#86efac",padding:"10px 14px",borderRadius:10,fontSize:13,marginBottom:16}}>{msg}</div>}

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {mode==="signup" && (
              <input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)}
                style={{...inp,background:"#1e293b",border:"1.5px solid #334155",color:"#fff"}}/>
            )}
            <input placeholder="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)}
              style={{...inp,background:"#1e293b",border:"1.5px solid #334155",color:"#fff"}}
              onKeyDown={e=>e.key==="Enter"&&handle()}/>
            {mode!=="forgot" && (
              <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}
                style={{...inp,background:"#1e293b",border:"1.5px solid #334155",color:"#fff"}}
                onKeyDown={e=>e.key==="Enter"&&handle()}/>
            )}
            <Btn onClick={handle} loading={loading} style={{width:"100%",justifyContent:"center",padding:"13px",fontSize:15,borderRadius:12}}>
              {mode==="login"?"Sign In":mode==="signup"?"Create Account":"Send Reset Email"}
            </Btn>
          </div>

          <div style={{textAlign:"center",marginTop:20,display:"flex",flexDirection:"column",gap:10}}>
            {mode==="login" && <>
              <button onClick={()=>{setMode("signup");setError("");}} style={{background:"none",border:"none",color:C.blue,cursor:"pointer",fontSize:14,fontFamily:"'Inter',sans-serif"}}>
                Don't have an account? <b>Sign up free</b>
              </button>
              <button onClick={()=>{setMode("forgot");setError("");}} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif"}}>
                Forgot password?
              </button>
            </>}
            {mode==="signup" && (
              <button onClick={()=>{setMode("login");setError("");}} style={{background:"none",border:"none",color:C.blue,cursor:"pointer",fontSize:14,fontFamily:"'Inter',sans-serif"}}>
                Already have an account? <b>Sign in</b>
              </button>
            )}
            {mode==="forgot" && (
              <button onClick={()=>{setMode("login");setError("");}} style={{background:"none",border:"none",color:C.blue,cursor:"pointer",fontSize:14,fontFamily:"'Inter',sans-serif"}}>
                ← Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
function MainApp({ user, onLogout }) {
  const [tab,setTab]=useState("home");
  const [selectedCompany,setSelectedCompany]=useState(null);

  const navItems=[
    {id:"home",icon:"🏠",label:"Home"},
    {id:"companies",icon:"🏢",label:"Companies"},
    {id:"coding",icon:"💻",label:"Coding"},
    {id:"resume",icon:"📄",label:"Resume"},
    {id:"jobs",icon:"💼",label:"Jobs"},
  ];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,fontFamily:"'Inter',sans-serif"}}>
      <style>{css}</style>
      {/* SIDEBAR */}
      <div style={{width:220,background:C.sidebar,display:"flex",flexDirection:"column",padding:"24px 12px",gap:4,position:"fixed",top:0,left:0,height:"100vh",zIndex:100}}>
        <div style={{color:"#fff",fontWeight:900,fontSize:20,padding:"0 12px",marginBottom:28}}>🎯 TakePlace</div>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)}
            style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:10,border:"none",
              cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:600,textAlign:"left",
              background:tab===n.id?C.sidebarActive:"transparent",
              color:tab===n.id?"#fff":"#94a3b8",transition:"all .2s"}}>
            <span style={{fontSize:16}}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{marginTop:"auto"}}>
          <div style={{color:"#475569",fontSize:12,padding:"0 14px",marginBottom:8,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.email}</div>
          <button onClick={onLogout}
            style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,border:"none",
              cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:600,
              background:"transparent",color:"#64748b",width:"100%"}}>
            🚪 Sign Out
          </button>
        </div>
      </div>
      {/* CONTENT */}
      <div style={{marginLeft:220,flex:1,padding:32,minHeight:"100vh",overflowY:"auto"}}>
        {tab==="home"      && <HomeTab user={user} onNavigate={setTab} onSelectCompany={(c)=>{setSelectedCompany(c);setTab("companies");}}/>}
        {tab==="companies" && <CompaniesTab selectedCompany={selectedCompany} onSelectCompany={setSelectedCompany} user={user}/>}
        {tab==="coding"    && <CodingTab user={user}/>}
        {tab==="resume"    && <ResumeTab user={user}/>}
        {tab==="jobs"      && <JobsTab user={user}/>}
      </div>
    </div>
  );
}

// ─── HOME TAB ──────────────────────────────────────────────────────────────
function HomeTab({ user, onNavigate, onSelectCompany }) {
  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "there";
  const topService = ["tcs","infosys","wipro","hcl","cognizant","accenture"];
  const topProduct = ["amazon","google","microsoft","flipkart"];

  return (
    <div className="fade">
      {/* GREETING */}
      <div style={{background:"linear-gradient(135deg,#1e293b,#0f172a)",borderRadius:20,padding:"32px 36px",marginBottom:28,border:"1px solid #334155"}}>
        <h1 style={{fontSize:28,fontWeight:900,color:"#fff",margin:"0 0 6px"}}>Hey {name}! 👋</h1>
        <p style={{color:"#64748b",fontSize:15,margin:0}}>Ready to crack your dream company? Start with a mock test or practice coding.</p>
        <div style={{display:"flex",gap:12,marginTop:20}}>
          <Btn variant="cta" onClick={()=>onNavigate("companies")}>Take Mock Test</Btn>
          <Btn variant="ghost" onClick={()=>onNavigate("coding")} style={{color:"#fff",border:"1px solid #334155"}}>Practice Coding</Btn>
        </div>
      </div>

      {/* STATS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:14,marginBottom:32}}>
        {[{l:"Companies",v:"45+",icon:"🏢",c:C.blue},{l:"Questions",v:"500+",icon:"❓",c:C.purple},{l:"Code Problems",v:"25+",icon:"💻",c:C.green},{l:"Students",v:"10K+",icon:"🎓",c:C.orange}].map(s=>(
          <div key={s.l} style={{background:C.card,borderRadius:14,padding:20,border:`1px solid ${C.border}`,textAlign:"center"}}>
            <div style={{fontSize:26,marginBottom:4}}>{s.icon}</div>
            <div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div>
            <div style={{fontSize:12,color:C.muted,fontWeight:600}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* SERVICE COMPANIES */}
      <h2 style={{fontSize:17,fontWeight:700,color:C.text,marginBottom:14}}>🏢 Service Companies</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:28}}>
        {topService.map(key=>{ const co=ALL_COMPANIES[key]; return (
          <div key={key} className="hover-card" onClick={()=>onSelectCompany(key)}
            style={{background:C.card,borderRadius:14,padding:16,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:26,marginBottom:6}}>{co.emoji}</div>
            <div style={{fontWeight:700,color:C.text,fontSize:14}}>{co.name}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:2}}>{co.full}</div>
          </div>
        );})}
      </div>

      {/* PRODUCT COMPANIES */}
      <h2 style={{fontSize:17,fontWeight:700,color:C.text,marginBottom:14}}>🚀 Product Companies</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:32}}>
        {topProduct.map(key=>{ const co=ALL_COMPANIES[key]; return (
          <div key={key} className="hover-card" onClick={()=>onSelectCompany(key)}
            style={{background:C.card,borderRadius:14,padding:16,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:26,marginBottom:6}}>{co.emoji}</div>
            <div style={{fontWeight:700,color:C.text,fontSize:14}}>{co.name}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:2}}>{co.full}</div>
          </div>
        );})}
      </div>

      {/* QUICK ACTIONS */}
      <h2 style={{fontSize:17,fontWeight:700,color:C.text,marginBottom:14}}>Quick Actions</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
        {[
          {icon:"🏢",title:"All Companies",desc:"45+ company-specific tests",action:()=>onNavigate("companies"),color:C.blue},
          {icon:"💻",title:"Coding Practice",desc:"Brute → Better → Optimal approach",action:()=>onNavigate("coding"),color:C.green},
          {icon:"📄",title:"Build Resume",desc:"AI-powered ATS score & tips",action:()=>onNavigate("resume"),color:C.purple},
          {icon:"💼",title:"Find Jobs",desc:"1000s of live openings",action:()=>onNavigate("jobs"),color:C.orange},
        ].map(a=>(
          <div key={a.title} className="hover-card" onClick={a.action}
            style={{background:C.card,borderRadius:14,padding:20,border:`1.5px solid ${C.border}`,cursor:"pointer"}}>
            <div style={{fontSize:28,marginBottom:8}}>{a.icon}</div>
            <div style={{fontWeight:700,color:C.text,fontSize:15}}>{a.title}</div>
            <div style={{fontSize:12,color:C.muted,marginTop:4}}>{a.desc}</div>
            <div style={{fontSize:12,color:a.color,marginTop:8,fontWeight:600}}>Open →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMPANIES TAB ─────────────────────────────────────────────────────────
function CompaniesTab({ selectedCompany, onSelectCompany, user }) {
  const [view,setView]=useState(selectedCompany?"detail":"list");
  const [company,setCompany]=useState(selectedCompany);
  const [mode,setMode]=useState(null);
  const [filter,setFilter]=useState("all");

  useEffect(()=>{ if(selectedCompany){setCompany(selectedCompany);setView("detail");setMode(null);} },[selectedCompany]);

  const go = (key) => { setCompany(key); setView("detail"); setMode(null); onSelectCompany(key); };

  if(view==="list") return (
    <div className="fade">
      <h1 style={{fontSize:26,fontWeight:800,color:C.text,marginBottom:6}}>Companies</h1>
      <p style={{color:C.muted,marginBottom:24}}>Choose a company to start practicing</p>
      <div style={{display:"flex",gap:10,marginBottom:24,flexWrap:"wrap"}}>
        {["all","service","product"].map(f=>(
          <Btn key={f} variant={filter===f?"primary":"ghost"} size="sm" onClick={()=>setFilter(f)}>
            {f==="all"?"All Companies":f==="service"?"🏢 Service":"🚀 Product"}
          </Btn>
        ))}
      </div>
      {["service","product"].filter(t=>filter==="all"||filter===t).map(type=>(
        <div key={type} style={{marginBottom:32}}>
          <h2 style={{fontSize:15,fontWeight:700,color:C.muted,marginBottom:14,textTransform:"uppercase",letterSpacing:1}}>
            {type==="service"?"🏢 Service Companies":"🚀 Product Companies"}
          </h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
            {Object.entries(type==="service"?SERVICE_COMPANIES:PRODUCT_COMPANIES).map(([key,co])=>(
              <div key={key} className="hover-card" onClick={()=>go(key)}
                style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:28,marginBottom:8}}>{co.emoji}</div>
                <div style={{fontWeight:700,color:C.text}}>{co.name}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:3,fontWeight:600}}>{co.full}</div>
                <div style={{fontSize:11,color:C.soft,marginTop:6,lineHeight:1.5}}>{co.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const co = ALL_COMPANIES[company];
  if(!co) return null;

  if(mode==="aptitude") return <AptitudeTest company={company} onBack={()=>setMode(null)}/>;
  if(mode==="coding")   return <CodingTab company={company} onBack={()=>setMode(null)} user={user}/>;

  return (
    <div className="fade">
      <button onClick={()=>{setView("list");setMode(null);}} style={{background:"none",border:"none",color:C.blue,cursor:"pointer",fontSize:14,marginBottom:20,fontFamily:"'Inter',sans-serif",fontWeight:600}}>← All Companies</button>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:8}}>
        <span style={{fontSize:48}}>{co.emoji}</span>
        <div>
          <h1 style={{fontSize:28,fontWeight:800,color:C.text,margin:0}}>{co.name}</h1>
          <p style={{color:C.muted,margin:"4px 0 0",fontSize:14}}>{co.desc}</p>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:28,flexWrap:"wrap"}}>
        {co.codingTopics.map(t=><Tag key={t} color={C.blue}>{t}</Tag>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:600}}>
        <div className="hover-card" onClick={()=>setMode("aptitude")} style={{background:C.card,borderRadius:16,padding:28,border:`2px solid ${C.border}`,textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:12}}>📝</div>
          <h3 style={{fontWeight:800,color:C.text,margin:"0 0 8px"}}>Aptitude Test</h3>
          <p style={{color:C.muted,fontSize:13,margin:"0 0 16px"}}>MCQ questions in {co.name}'s exam pattern. 20 questions, 30 minutes.</p>
          <Btn style={{width:"100%"}} onClick={()=>setMode("aptitude")}>Start Test →</Btn>
        </div>
        <div className="hover-card" onClick={()=>setMode("coding")} style={{background:C.card,borderRadius:16,padding:28,border:`2px solid ${C.border}`,textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:12}}>💻</div>
          <h3 style={{fontWeight:800,color:C.text,margin:"0 0 8px"}}>Coding Practice</h3>
          <p style={{color:C.muted,fontSize:13,margin:"0 0 16px"}}>DSA problems from {co.name} interviews. Code in any language.</p>
          <Btn style={{width:"100%"}} onClick={()=>setMode("coding")}>Practice →</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── APTITUDE TEST ─────────────────────────────────────────────────────────
function AptitudeTest({ company, onBack }) {
  const co = ALL_COMPANIES[company];
  const allQs = getAptQuestions(company);
  const [started,setStarted]=useState(false);
  const [questions,setQuestions]=useState([]);
  const [current,setCurrent]=useState(0);
  const [selected,setSelected]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const [timeLeft,setTimeLeft]=useState(0);
  const timerRef=useRef(null);
  const NUM_Q=20, TIME=NUM_Q*90;

  const start=()=>{
    const shuffled=[...allQs].sort(()=>Math.random()-0.5).slice(0,Math.min(NUM_Q,allQs.length));
    setQuestions(shuffled);setSelected({});setCurrent(0);setSubmitted(false);setTimeLeft(TIME);setStarted(true);
  };

  useEffect(()=>{
    if(started&&!submitted){
      timerRef.current=setInterval(()=>setTimeLeft(t=>{ if(t<=1){clearInterval(timerRef.current);setSubmitted(true);return 0;} return t-1; }),1000);
    }
    return()=>clearInterval(timerRef.current);
  },[started,submitted]);

  const submit=()=>{clearInterval(timerRef.current);setSubmitted(true);};

  if(!started) return (
    <div className="fade">
      <button onClick={onBack} style={{background:"none",border:"none",color:C.blue,cursor:"pointer",fontSize:14,marginBottom:20,fontFamily:"'Inter',sans-serif",fontWeight:600}}>← Back</button>
      <div style={{maxWidth:480}}>
        <div style={{fontSize:48,marginBottom:12}}>{co.emoji}</div>
        <h1 style={{fontSize:26,fontWeight:800,color:C.text,margin:"0 0 8px"}}>{co.name} Aptitude Test</h1>
        <p style={{color:C.muted,marginBottom:24}}>{co.desc}</p>
        <div style={{background:C.card,borderRadius:14,padding:20,border:`1px solid ${C.border}`,marginBottom:24}}>
          {[["Questions",`${Math.min(NUM_Q,allQs.length)} MCQs`],["Time","30 minutes"],["Negative Marking","None"],["Pattern",co.full]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{color:C.muted,fontSize:14}}>{k}</span>
              <span style={{fontWeight:700,color:C.text,fontSize:14}}>{v}</span>
            </div>
          ))}
        </div>
        <Btn size="lg" onClick={start} style={{width:"100%",justifyContent:"center"}}>Start Test 🚀</Btn>
      </div>
    </div>
  );

  if(submitted){
    const score=questions.reduce((s,q,i)=>s+(selected[i]===q.ans?1:0),0);
    const pct=Math.round((score/questions.length)*100);
    return (
      <div className="fade">
        <h2 style={{fontSize:24,fontWeight:800,color:C.text,marginBottom:4}}>Test Complete! 🎉</h2>
        <div style={{background:C.card,borderRadius:16,padding:28,border:`1px solid ${C.border}`,marginBottom:24,maxWidth:400}}>
          <div style={{fontSize:52,fontWeight:900,color:pct>=70?C.green:pct>=40?C.warn:C.danger,textAlign:"center"}}>{pct}%</div>
          <div style={{textAlign:"center",color:C.muted,marginBottom:16}}>{score}/{questions.length} correct</div>
          <div style={{height:8,background:C.card2,borderRadius:4}}>
            <div style={{height:"100%",width:`${pct}%`,background:pct>=70?C.green:pct>=40?C.warn:C.danger,borderRadius:4,transition:"width 1s"}}/>
          </div>
          <div style={{textAlign:"center",marginTop:12,fontSize:14,color:pct>=70?C.green:pct>=40?C.warn:C.danger,fontWeight:700}}>
            {pct>=70?"🎉 Excellent! You're ready!":pct>=40?"📚 Good effort! Keep practicing":"💪 Review the concepts and retry"}
          </div>
        </div>
        <div style={{maxWidth:700}}>
          {questions.map((q,i)=>{ const correct=selected[i]===q.ans; return (
            <div key={i} style={{background:C.card,borderRadius:12,padding:18,marginBottom:12,border:`1.5px solid ${correct?"#16a34a":"#dc2626"}`}}>
              <div style={{fontWeight:600,color:C.text,marginBottom:10,fontSize:14}}>{i+1}. {q.q}</div>
              {q.opts.map((opt,j)=>(
                <div key={j} style={{padding:"6px 12px",borderRadius:8,marginBottom:4,fontSize:13,
                  background:j===q.ans?"#16a34a15":j===selected[i]&&!correct?"#dc262615":"transparent",
                  color:j===q.ans?C.green:j===selected[i]&&!correct?C.danger:C.soft,
                  fontWeight:j===q.ans||j===selected[i]?700:400}}>
                  {j===q.ans?"✓ ":j===selected[i]&&!correct?"✗ ":""}{opt}
                </div>
              ))}
              <div style={{fontSize:12,color:C.muted,marginTop:8,padding:"8px 12px",background:C.card2,borderRadius:8}}>💡 {q.exp}</div>
            </div>
          );})}
        </div>
        <div style={{display:"flex",gap:12,marginTop:16}}>
          <Btn onClick={start}>Retake Test</Btn>
          <Btn variant="ghost" onClick={onBack}>Back</Btn>
        </div>
      </div>
    );
  }

  const q=questions[current];
  const mins=Math.floor(timeLeft/60).toString().padStart(2,"0");
  const secs=(timeLeft%60).toString().padStart(2,"0");

  return (
    <div className="fade" style={{maxWidth:680}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontWeight:700,color:C.text}}>{co.emoji} {co.name}</div>
        <div className={timeLeft<60?"timer-warn":""} style={{background:timeLeft<60?C.danger:C.blue,color:"#fff",padding:"6px 16px",borderRadius:20,fontWeight:700,fontSize:14}}>
          ⏱ {mins}:{secs}
        </div>
      </div>
      <div style={{height:6,background:C.card2,borderRadius:3,marginBottom:20}}>
        <div style={{height:"100%",width:`${((current+1)/questions.length)*100}%`,background:C.blue,borderRadius:3,transition:"width .3s"}}/>
      </div>
      <div style={{background:C.card,borderRadius:16,padding:28,border:`1px solid ${C.border}`,marginBottom:16}}>
        <div style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:8}}>Question {current+1}/{questions.length} · {q.topic}</div>
        <div style={{fontSize:16,fontWeight:600,color:C.text,lineHeight:1.6,marginBottom:20}}>{q.q}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {q.opts.map((opt,i)=>(
            <button key={i} onClick={()=>setSelected(s=>({...s,[current]:i}))}
              style={{padding:"12px 16px",borderRadius:10,border:`2px solid ${selected[current]===i?C.blue:C.border}`,
                background:selected[current]===i?`${C.blue}12`:"#fff",color:C.text,cursor:"pointer",
                textAlign:"left",fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:selected[current]===i?700:400,transition:"all .15s"}}>
              <span style={{color:C.blue,fontWeight:700,marginRight:8}}>{String.fromCharCode(65+i)}.</span>{opt}
            </button>
          ))}
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Btn variant="ghost" onClick={()=>setCurrent(c=>Math.max(0,c-1))} disabled={current===0}>← Prev</Btn>
        <span style={{color:C.muted,fontSize:13}}>{Object.keys(selected).length}/{questions.length} answered</span>
        {current<questions.length-1?<Btn onClick={()=>setCurrent(c=>c+1)}>Next →</Btn>:<Btn variant="green" onClick={submit}>Submit ✓</Btn>}
      </div>
    </div>
  );
}

// ─── CODING TAB ────────────────────────────────────────────────────────────
function CodingTab({ company, onBack, user }) {
  const [difficulty,setDifficulty]=useState("easy");
  const [selected,setSelected]=useState(null);
  const [lang,setLang]=useState("javascript");
  const [code,setCode]=useState("");
  const [results,setResults]=useState(null);
  const [running,setRunning]=useState(false);
  const [approachTab,setApproachTab]=useState("brute");
  const [showApproach,setShowApproach]=useState(false);

  const allProblems=CODING_BANK[difficulty]||[];
  const problems=company?allProblems.filter(p=>p.companies&&p.companies.includes(company)):allProblems;

  const selectProblem=(p)=>{
    setSelected(p);
    const langObj=LANGUAGES.find(l=>l.id===lang);
    setCode(langObj?.template(p)||"");
    setResults(null);
    setShowApproach(false);
    setApproachTab("brute");
  };

  const changeLang=(newLang)=>{
    setLang(newLang);
    if(selected){
      const langObj=LANGUAGES.find(l=>l.id===newLang);
      setCode(langObj?.template(selected)||"");
      setResults(null);
    }
  };

  const executeCode=()=>{
    if(!selected) return;
    setRunning(true);
    setResults(null);
    // Small delay for UX
    setTimeout(()=>{
      try {
        const res=runCode(code,lang,selected.testCases);
        setResults(res);
      } catch(e) {
        setResults([{pass:false,error:e.message,input:"",expected:"",got:""}]);
      }
      setRunning(false);
    },400);
  };

  if(selected) return (
    <div className="fade">
      {onBack&&<button onClick={()=>setSelected(null)} style={{background:"none",border:"none",color:C.blue,cursor:"pointer",fontSize:14,marginBottom:16,fontFamily:"'Inter',sans-serif",fontWeight:600}}>← Problem List</button>}
      {!onBack&&<button onClick={()=>setSelected(null)} style={{background:"none",border:"none",color:C.blue,cursor:"pointer",fontSize:14,marginBottom:16,fontFamily:"'Inter',sans-serif",fontWeight:600}}>← All Problems</button>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,minHeight:"75vh"}}>
        {/* LEFT: PROBLEM STATEMENT */}
        <div style={{background:C.card,borderRadius:14,padding:24,border:`1px solid ${C.border}`,overflowY:"auto",maxHeight:"82vh"}}>
          <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
            <Tag color={selected.difficulty==="Easy"?C.green:selected.difficulty==="Medium"?C.warn:C.danger}>{selected.difficulty}</Tag>
            <Tag color={C.purple}>{selected.topic}</Tag>
          </div>
          <h2 style={{fontWeight:800,color:C.text,marginBottom:16,fontSize:18}}>{selected.title}</h2>
          <pre style={{whiteSpace:"pre-wrap",fontFamily:"'Inter',sans-serif",fontSize:14,color:C.soft,lineHeight:1.7,marginBottom:20}}>{selected.description}</pre>

          <h4 style={{color:C.text,marginBottom:10,fontWeight:700}}>Examples</h4>
          {selected.examples.map((ex,i)=>(
            <div key={i} style={{background:"#f8fafc",borderRadius:10,padding:12,marginBottom:8,fontSize:13,border:`1px solid ${C.border}`}}>
              <div style={{marginBottom:4}}><b style={{color:C.text}}>Input:</b> <code style={{background:"#e2e8f0",padding:"2px 6px",borderRadius:4}}>{ex.input}</code></div>
              <div><b style={{color:C.text}}>Output:</b> <code style={{background:"#e2e8f0",padding:"2px 6px",borderRadius:4}}>{ex.output}</code></div>
            </div>
          ))}

          <div style={{marginTop:16,padding:"10px 14px",background:`${C.blue}08`,borderRadius:10,border:`1px solid ${C.blue}20`,fontSize:12,color:C.muted,display:"flex",gap:16}}>
            <span>⏱ <b>Time:</b> {selected.time_complexity}</span>
            <span>💾 <b>Space:</b> {selected.space_complexity}</span>
          </div>

          {/* APPROACH SECTION */}
          <div style={{marginTop:20}}>
            <button onClick={()=>setShowApproach(s=>!s)}
              style={{width:"100%",padding:"12px 16px",borderRadius:10,border:`1.5px solid ${C.border}`,background:showApproach?`${C.blue}08`:"#f8fafc",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,color:C.blue,textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>🧠 View Approaches (Brute → Better → Optimal)</span>
              <span>{showApproach?"▲":"▼"}</span>
            </button>

            {showApproach && selected.approaches && (
              <div style={{marginTop:12,border:`1.5px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
                {/* Tabs */}
                <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
                  {[
                    {k:"brute",l:"🔨 Brute Force",c:C.danger},
                    {k:"better",l:"⚡ Better",c:C.warn},
                    {k:"optimal",l:"🚀 Optimal",c:C.green},
                  ].map(t=>(
                    <button key={t.k} onClick={()=>setApproachTab(t.k)}
                      style={{flex:1,padding:"10px 8px",border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:700,
                        background:approachTab===t.k?`${t.c}15`:"#fff",
                        color:approachTab===t.k?t.c:C.muted,
                        borderBottom:approachTab===t.k?`2.5px solid ${t.c}`:"2.5px solid transparent",transition:"all .2s"}}>
                      {t.l}
                    </button>
                  ))}
                </div>
                {/* Content */}
                {(() => {
                  const ap = selected.approaches[approachTab];
                  if(!ap) return null;
                  const color = approachTab==="brute"?C.danger:approachTab==="better"?C.warn:C.green;
                  return (
                    <div style={{padding:16,background:"#fafafa"}} className="slideIn">
                      <div style={{fontWeight:800,color,fontSize:15,marginBottom:4}}>{ap.title}</div>
                      <div style={{display:"inline-block",background:`${color}15`,color,fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700,marginBottom:12,border:`1px solid ${color}30`}}>{ap.complexity}</div>
                      <div style={{fontSize:13,color:C.text,marginBottom:12,lineHeight:1.6,fontWeight:500}}>💡 <b>Core Idea:</b> {ap.idea}</div>
                      <div style={{fontSize:12,color:C.soft,marginBottom:12}}>
                        <b style={{color:C.text}}>Steps:</b>
                        <ol style={{paddingLeft:18,marginTop:4}}>
                          {ap.steps.map((s,i)=><li key={i} style={{marginBottom:4,lineHeight:1.5}}>{s}</li>)}
                        </ol>
                      </div>
                      <div style={{background:"#0f172a",borderRadius:8,padding:14}}>
                        <div style={{color:"#64748b",fontSize:11,marginBottom:6,fontWeight:600}}>Pseudocode:</div>
                        <pre style={{color:"#e2e8f0",fontSize:12,margin:0,whiteSpace:"pre-wrap",fontFamily:"'JetBrains Mono',monospace",lineHeight:1.6}}>{ap.pseudocode}</pre>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: CODE EDITOR */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {/* LANGUAGE TABS */}
          <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden"}}>
            <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:"#f8fafc"}}>
              {LANGUAGES.map(l=>(
                <button key={l.id} onClick={()=>changeLang(l.id)}
                  style={{flex:1,padding:"10px 4px",border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:700,
                    background:lang===l.id?C.card:"transparent",
                    color:lang===l.id?C.text:C.muted,
                    borderBottom:lang===l.id?`2.5px solid ${C.blue}`:"2.5px solid transparent",
                    transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                  <span>{l.icon}</span>
                  <span className="hide-mobile">{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CODE AREA */}
          <textarea className="code-editor" value={code} onChange={e=>setCode(e.target.value)}
            style={{flex:1,minHeight:320,background:"#0f172a",color:"#e2e8f0",border:`1px solid ${C.border}`,borderRadius:12,padding:16,resize:"vertical",outline:"none",spellCheck:false}}
            spellCheck={false}/>

          {/* RUN BUTTON */}
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={executeCode} variant="green" loading={running} style={{flex:1,justifyContent:"center"}}>
              {running?`Compiling ${LANGUAGES.find(l=>l.id===lang)?.fullLabel||lang}...`:`▶ Run ${LANGUAGES.find(l=>l.id===lang)?.fullLabel||lang} Code`}
            </Btn>
          </div>

          {/* RESULTS */}
          {results && (
            <div style={{background:C.card,borderRadius:12,padding:16,border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontWeight:700,color:C.text,fontSize:14}}>
                  Test Results
                </div>
                <div style={{fontWeight:700,fontSize:13,color:results.filter(r=>r.pass).length===results.length?C.green:C.danger}}>
                  {results.filter(r=>r.pass).length}/{results.length} passed
                </div>
              </div>
              {results.map((r,i)=>(
                <div key={i} style={{padding:"10px 14px",borderRadius:10,marginBottom:8,fontSize:12,
                  background:r.pass?"#16a34a08":"#dc262608",
                  border:`1.5px solid ${r.pass?"#16a34a30":"#dc262630"}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:r.pass?0:6}}>
                    <span style={{fontWeight:700,color:r.pass?C.green:C.danger}}>
                      {r.pass?"✓":"✗"} Test Case {i+1}
                    </span>
                    <span style={{color:C.muted,fontSize:11}}>Input: <code>{r.input?.substring(0,30)}{r.input?.length>30?"...":""}</code></span>
                  </div>
                  {!r.pass && (
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,lineHeight:1.6,color:C.soft}}>
                      <div style={{color:C.green}}>Expected: {r.expected}</div>
                      <div style={{color:C.danger}}>Got: {r.error||r.got||"undefined"}</div>
                      {r.compilerOutput && r.compilerOutput!==`Expected: ${r.expected}\nActual: ${r.got}` && (
                        <div style={{color:C.muted,marginTop:4,whiteSpace:"pre-wrap"}}>{r.compilerOutput}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {results.every(r=>r.pass) && (
                <div style={{background:`${C.green}10`,border:`1px solid ${C.green}30`,borderRadius:10,padding:"12px 16px",textAlign:"center"}}>
                  <div style={{fontSize:20,marginBottom:4}}>🎉</div>
                  <div style={{color:C.green,fontWeight:700,fontSize:14}}>All tests passed! Great solution!</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fade">
      {onBack&&<button onClick={onBack} style={{background:"none",border:"none",color:C.blue,cursor:"pointer",fontSize:14,marginBottom:20,fontFamily:"'Inter',sans-serif",fontWeight:600}}>← Back</button>}
      <h1 style={{fontSize:26,fontWeight:800,color:C.text,marginBottom:6}}>
        {company?`${ALL_COMPANIES[company]?.name} Coding`:"Coding Practice"}
      </h1>
      <p style={{color:C.muted,marginBottom:8,fontSize:14}}>Every problem has 3 approaches: Brute Force → Better → Optimal. Code in any language.</p>
      <div style={{display:"flex",gap:10,marginBottom:24,flexWrap:"wrap"}}>
        {["easy","medium","hard"].map(d=>(
          <Btn key={d} size="sm" variant={difficulty===d?"primary":"ghost"} onClick={()=>setDifficulty(d)}>
            {d==="easy"?"🟢 Easy":d==="medium"?"🟡 Medium":"🔴 Hard"}
          </Btn>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {(problems.length?problems:allProblems).map(p=>(
          <div key={p.id} className="hover-card" onClick={()=>selectProblem(p)}
            style={{background:C.card,borderRadius:14,padding:20,border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
              <Tag color={p.difficulty==="Easy"?C.green:p.difficulty==="Medium"?C.warn:C.danger}>{p.difficulty}</Tag>
              <Tag color={C.purple}>{p.topic}</Tag>
            </div>
            <div style={{fontWeight:700,color:C.text,marginBottom:4,fontSize:15}}>{p.title}</div>
            <div style={{fontSize:12,color:C.muted,marginBottom:8}}>{p.description?.split('\n')[0]?.substring(0,80)}...</div>
            <div style={{fontSize:11,color:C.muted,display:"flex",gap:12}}>
              <span>⏱ {p.time_complexity}</span>
              <span>💾 {p.space_complexity}</span>
            </div>
            <div style={{marginTop:10,fontSize:12,color:C.blue,fontWeight:600}}>🧠 3 Approaches inside →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RESUME TAB ────────────────────────────────────────────────────────────
function ResumeTab({ user }) {
  const [resumeText,setResumeText]=useState("");
  const [jobRole,setJobRole]=useState("");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState("");
  const [activeSection,setActiveSection]=useState("upload");

  const analyze=async()=>{
    if(!resumeText.trim()) return;
    setLoading(true); setResult(""); setActiveSection("analyze");
    try {
      const res=await callAI(
        `You are an expert resume reviewer and ATS specialist. Analyze this resume for a ${jobRole||"software engineer"} role.

Provide a structured analysis with:
1. **Overall ATS Score: X/10** - Be specific
2. **Strengths (Top 3)** - What's done well
3. **Critical Improvements (Top 3)** - Most important fixes
4. **Missing ATS Keywords** - List 8-10 keywords to add for ${jobRole||"software engineer"} role
5. **Format Issues** - Any structural problems
6. **One-Line Summary** - Overall impression

Be direct, specific, and actionable.

Resume:
${resumeText.slice(0,3000)}`, 1000);
      setResult(res);
    } catch(e) {
      setResult("⚠️ Could not analyze. Please try again.\nError: "+e.message);
    }
    setLoading(false);
  };

  const tips = [
    {icon:"🎯",title:"ATS Optimization",color:C.blue,items:["Use exact keywords from job description","Avoid tables, images, columns","Use standard section headings: Experience, Education, Skills","Save as PDF with selectable text"]},
    {icon:"📊",title:"Quantify Everything",color:C.green,items:["Add numbers: 'Improved performance by 40%'","Mention team sizes you worked in","Include project impact metrics","Use action verbs: Built, Led, Improved, Reduced"]},
    {icon:"💻",title:"Tech Resume Must-Haves",color:C.purple,items:["List tech stack clearly at top","Include GitHub/Portfolio links","Show projects with real outcomes","Mention relevant coursework for freshers"]},
    {icon:"📝",title:"Format & Structure",color:C.orange,items:["1 page for freshers (strictly)","Consistent font and spacing","Reverse chronological order","Clear contact info at very top"]},
  ];

  return (
    <div className="fade">
      <h1 style={{fontSize:26,fontWeight:800,color:C.text,marginBottom:4}}>AI Resume Builder</h1>
      <p style={{color:C.muted,marginBottom:24,fontSize:14}}>Get ATS score, keyword suggestions, and expert improvements powered by AI</p>
      <div style={{display:"flex",gap:10,marginBottom:28}}>
        {[{id:"upload",label:"📤 Upload & Analyze"},{id:"analyze",label:"🔍 Analysis"},{id:"tips",label:"💡 Pro Tips"}].map(s=>(
          <Btn key={s.id} size="sm" variant={activeSection===s.id?"primary":"ghost"} onClick={()=>setActiveSection(s.id)}>{s.label}</Btn>
        ))}
      </div>

      {activeSection==="upload" && (
        <div style={{maxWidth:620}}>
          <div style={{background:C.card,borderRadius:14,padding:24,border:`1px solid ${C.border}`,marginBottom:16}}>
            <h3 style={{fontWeight:700,color:C.text,marginBottom:4,fontSize:16}}>Paste Your Resume</h3>
            <p style={{color:C.muted,fontSize:13,marginBottom:14}}>Copy all text from your resume and paste it below</p>
            <textarea value={resumeText} onChange={e=>setResumeText(e.target.value)}
              placeholder="Paste your complete resume text here including all sections — Education, Experience, Skills, Projects, Certifications..."
              style={{...inp,minHeight:280,resize:"vertical",fontFamily:"'Inter',sans-serif",lineHeight:1.6}}/>
          </div>
          <input placeholder="Target job role (e.g. Software Engineer, Data Analyst, DevOps)" value={jobRole} onChange={e=>setJobRole(e.target.value)}
            style={{...inp,marginBottom:16}}/>
          <Btn onClick={analyze} disabled={!resumeText.trim()} loading={loading} style={{width:"100%",justifyContent:"center",padding:"14px",fontSize:15}}>
            Analyze with AI →
          </Btn>
          {resumeText.trim() && (
            <p style={{color:C.muted,fontSize:12,marginTop:8,textAlign:"center"}}>{resumeText.length} characters pasted</p>
          )}
        </div>
      )}

      {activeSection==="analyze" && (
        <div style={{maxWidth:700}}>
          {!result && !loading && (
            <div style={{textAlign:"center",padding:40,color:C.muted}}>
              <div style={{fontSize:48,marginBottom:12}}>📄</div>
              <p>Go to Upload tab and paste your resume to get analysis</p>
              <Btn style={{marginTop:16}} onClick={()=>setActiveSection("upload")}>Upload Resume</Btn>
            </div>
          )}
          {loading && (
            <div style={{display:"flex",flexDirection:"column",gap:12,alignItems:"center",padding:48}}>
              <SpinIcon size={36}/>
              <div style={{color:C.muted,fontSize:15}}>Analyzing your resume with AI...</div>
              <div style={{color:C.muted,fontSize:12}}>Checking ATS compatibility, keywords, structure...</div>
            </div>
          )}
          {result && (
            <div style={{background:C.card,borderRadius:14,padding:28,border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <h3 style={{fontWeight:700,color:C.text,margin:0}}>Resume Analysis</h3>
                <div style={{display:"flex",gap:10}}>
                  <Btn size="sm" variant="ghost" onClick={()=>{ setResult(""); analyze(); }}>Re-analyze</Btn>
                  <Btn size="sm" variant="ghost" onClick={()=>{setResult("");setActiveSection("upload");}}>Edit Resume</Btn>
                </div>
              </div>
              <div style={{whiteSpace:"pre-wrap",fontFamily:"'Inter',sans-serif",fontSize:14,color:C.soft,lineHeight:1.8}}>
                {result.split('\n').map((line,i)=>{
                  if(line.startsWith('**') && line.endsWith('**')) return <div key={i} style={{fontWeight:800,color:C.text,fontSize:15,marginTop:16,marginBottom:4}}>{line.replace(/\*\*/g,'')}</div>;
                  if(line.match(/^\d\./)) return <div key={i} style={{fontWeight:700,color:C.text,marginTop:12,marginBottom:4}}>{line}</div>;
                  return <div key={i}>{line}</div>;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection==="tips" && (
        <div style={{maxWidth:800,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:16}}>
          {tips.map(t=>(
            <div key={t.title} style={{background:C.card,borderRadius:14,padding:24,border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <span style={{fontSize:24}}>{t.icon}</span>
                <h3 style={{fontWeight:700,color:C.text,margin:0,fontSize:16}}>{t.title}</h3>
              </div>
              {t.items.map(item=>(
                <div key={item} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:10,fontSize:14,color:C.soft}}>
                  <span style={{color:t.color,flexShrink:0,marginTop:2}}>✓</span>
                  <span style={{lineHeight:1.5}}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── JOBS TAB ──────────────────────────────────────────────────────────────
function JobsTab({ user }) {
  const [jobs,setJobs]=useState([]);
  const [loading,setLoading]=useState(false);
  const [search,setSearch]=useState("software engineer");
  const [location,setLocation]=useState("india");
  const [searched,setSearched]=useState(false);
  const [savedJobs,setSavedJobs]=useState([]);

  const fetchJobs=async()=>{
    setLoading(true); setSearched(true); setJobs([]);
    try {
      const res=await fetch(`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&what=${encodeURIComponent(search)}&where=${encodeURIComponent(location)}&content-type=application/json`);
      const data=await res.json();
      if(data.results&&data.results.length>0) setJobs(data.results);
      else setJobs(getFallbackJobs(search));
    } catch(e) {
      setJobs(getFallbackJobs(search));
    }
    setLoading(false);
  };

  const getFallbackJobs=(role)=>[
    {id:"1",title:`${role.charAt(0).toUpperCase()+role.slice(1)} - Fresher`,company:{display_name:"TCS"},location:{display_name:"Bangalore, India"},salary_min:600000,salary_max:1200000,redirect_url:"https://www.tcs.com/careers",description:`TCS is hiring ${role}s. Apply through TCS NextStep portal. Requirements: B.Tech/BE/MCA with 60%+, Strong fundamentals, Good communication skills.`,created:"2026-06-10T00:00:00Z",category:{label:"IT Jobs"}},
    {id:"2",title:`Associate ${role.charAt(0).toUpperCase()+role.slice(1)}`,company:{display_name:"Infosys"},location:{display_name:"Hyderabad, India"},salary_min:550000,salary_max:1000000,redirect_url:"https://career.infosys.com",description:`Infosys InfyTQ hiring for 2024/2025 graduates. Must pass InfyTQ certification. Role involves working on enterprise applications.`,created:"2026-06-09T00:00:00Z",category:{label:"IT Jobs"}},
    {id:"3",title:`${role.charAt(0).toUpperCase()+role.slice(1)} - NLTH`,company:{display_name:"Wipro"},location:{display_name:"Pune, India"},salary_min:500000,salary_max:900000,redirect_url:"https://careers.wipro.com",description:`Wipro National Level Talent Hunt. Open for 2024/2025 batch. Written test + technical interview + HR round. Apply on Wipro careers portal.`,created:"2026-06-08T00:00:00Z",category:{label:"IT Jobs"}},
    {id:"4",title:`SDE-1 / ${role.charAt(0).toUpperCase()+role.slice(1)} I`,company:{display_name:"Amazon"},location:{display_name:"Bangalore, India"},salary_min:1500000,salary_max:2500000,redirect_url:"https://amazon.jobs",description:`Amazon is hiring for SDE-1 roles. OA: 2 coding problems + work simulation. Strong DSA required. 16 Leadership Principles are evaluated in interviews.`,created:"2026-06-07T00:00:00Z",category:{label:"IT Jobs"}},
    {id:"5",title:`Graduate Software Engineer`,company:{display_name:"Cognizant"},location:{display_name:"Chennai, India"},salary_min:450000,salary_max:800000,redirect_url:"https://careers.cognizant.com",description:`Cognizant GenC hiring for 2024/2025 batch. Aptitude + English + Coding test. Join the digital workforce of tomorrow.`,created:"2026-06-06T00:00:00Z",category:{label:"IT Jobs"}},
    {id:"6",title:`Associate Software Engineer`,company:{display_name:"Accenture"},location:{display_name:"Mumbai, India"},salary_min:400000,salary_max:750000,redirect_url:"https://www.accenture.com/in-en/careers",description:`Accenture hiring for multiple tech roles. Includes aptitude, communication, and coding assessment.`,created:"2026-06-05T00:00:00Z",category:{label:"IT Jobs"}},
  ];

  const quickSearches=["Software Engineer","Data Analyst","Frontend Developer","Backend Developer","DevOps Engineer","Machine Learning","React Developer","Java Developer","Python Developer","Cloud Engineer"];

  const toggleSave=(jobId)=>setSavedJobs(s=>s.includes(jobId)?s.filter(x=>x!==jobId):[...s,jobId]);

  return (
    <div className="fade">
      <h1 style={{fontSize:26,fontWeight:800,color:C.text,marginBottom:4}}>Job Board</h1>
      <p style={{color:C.muted,marginBottom:24,fontSize:14}}>Fresh tech openings across India's top companies</p>

      {/* SEARCH */}
      <div style={{background:C.card,borderRadius:14,padding:20,border:`1px solid ${C.border}`,marginBottom:20}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:14}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}
            placeholder="Job role (e.g. Software Engineer)" style={{...inp,flex:2,minWidth:200}}/>
          <input value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}
            placeholder="Location (e.g. Bangalore)" style={{...inp,flex:1,minWidth:140}}/>
          <Btn onClick={fetchJobs} loading={loading} style={{flexShrink:0}}>🔍 Search</Btn>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {quickSearches.map(r=>(
            <button key={r} onClick={()=>{setSearch(r);}}
              style={{background:search===r?`${C.blue}15`:"#f1f5f9",border:`1px solid ${search===r?C.blue:C.border}`,color:search===r?C.blue:C.soft,padding:"4px 12px",borderRadius:16,cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif",fontWeight:600,transition:"all .15s"}}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{display:"flex",gap:12,alignItems:"center",color:C.muted,padding:20}}>
          <SpinIcon/>Searching for {search} jobs...
        </div>
      )}

      {/* JOB CARDS */}
      <div style={{display:"grid",gap:14}}>
        {jobs.map(job=>{
          const saved=savedJobs.includes(job.id);
          const daysAgo=job.created?Math.floor((Date.now()-new Date(job.created))/86400000):null;
          return (
            <div key={job.id} style={{background:C.card,borderRadius:14,padding:24,border:`1px solid ${C.border}`,transition:"all .2s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                    <h3 style={{fontWeight:700,color:C.text,margin:0,fontSize:16}}>{job.title}</h3>
                    {daysAgo!==null&&daysAgo<=3&&<Tag color={C.green} bg="#16a34a15">New</Tag>}
                  </div>
                  <div style={{display:"flex",gap:16,color:C.muted,fontSize:13,flexWrap:"wrap",marginBottom:10}}>
                    <span>🏢 {job.company?.display_name}</span>
                    <span>📍 {job.location?.display_name}</span>
                    {daysAgo!==null&&<span>🕐 {daysAgo===0?"Today":daysAgo===1?"Yesterday":`${daysAgo} days ago`}</span>}
                    {job.category?.label&&<Tag color={C.blue}>{job.category.label}</Tag>}
                  </div>
                  {job.salary_min&&(
                    <div style={{marginBottom:10}}>
                      <Tag color={C.green} bg="#16a34a10">
                        ₹{Math.round(job.salary_min/100000)}L – ₹{Math.round(job.salary_max/100000)}L per year
                      </Tag>
                    </div>
                  )}
                  {job.description&&(
                    <p style={{color:C.soft,fontSize:13,lineHeight:1.6,margin:0}}>
                      {job.description.replace(/<[^>]+>/g,'').slice(0,200)}...
                    </p>
                  )}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,flexShrink:0}}>
                  <a href={job.redirect_url} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                    <Btn size="sm">Apply Now →</Btn>
                  </a>
                  <button onClick={()=>toggleSave(job.id)}
                    style={{padding:"6px 12px",borderRadius:8,border:`1.5px solid ${saved?C.warn:C.border}`,background:saved?`${C.warn}10`:"transparent",cursor:"pointer",fontSize:12,fontWeight:600,color:saved?C.warn:C.muted,fontFamily:"'Inter',sans-serif"}}>
                    {saved?"★ Saved":"☆ Save"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {searched&&!loading&&!jobs.length&&(
        <div style={{textAlign:"center",color:C.muted,padding:48}}>
          <div style={{fontSize:48,marginBottom:12}}>🔍</div>
          <p style={{fontSize:16}}>No jobs found for "{search}"</p>
          <p style={{fontSize:13}}>Try a different search term or location</p>
          <Btn style={{marginTop:16}} onClick={()=>{setSearch("software engineer");fetchJobs();}}>Search Software Engineer Jobs</Btn>
        </div>
      )}

      {!searched && (
        <div style={{textAlign:"center",padding:48,color:C.muted}}>
          <div style={{fontSize:48,marginBottom:12}}>💼</div>
          <p style={{fontSize:16,fontWeight:600}}>Search for jobs above</p>
          <p style={{fontSize:13}}>Find openings at TCS, Infosys, Amazon, Microsoft, and more</p>
        </div>
      )}
    </div>
  );
}
