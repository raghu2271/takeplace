import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const GROQ_KEY = "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";
const ADZUNA_ID = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Inter',sans-serif;color:#0f172a;background:#fff;-webkit-font-smoothing:antialiased;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  .fade{animation:fadeUp .4s ease forwards;}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  input:focus,textarea:focus,select:focus{outline:none;border-color:#2563eb!important;box-shadow:0 0 0 3px #2563eb15!important;}
  button:active{transform:scale(.97);}
  a{color:inherit;text-decoration:none;}
  @media(max-width:768px){.hide-mobile{display:none!important;}}
`;

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────
const C = {
  bg:"#ffffff", bg2:"#f8fafc", bg3:"#f1f5f9",
  blue:"#2563eb", blueLight:"#3b82f6", blueDark:"#1d4ed8", bluePale:"#eff6ff",
  text:"#0f172a", muted:"#64748b", soft:"#94a3b8", border:"#e2e8f0",
  green:"#16a34a", greenPale:"#f0fdf4", red:"#dc2626", redPale:"#fef2f2",
  yellow:"#d97706", yellowPale:"#fffbeb", purple:"#7c3aed",
  card:"#ffffff", shadow:"0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.04)",
};

// ─── COMPANY DATA ─────────────────────────────────────────────────────────
const COMPANIES = {
  tcs:        { name:"TCS",           logo:"🔵", color:"#1d4ed8", type:"service", pattern:"NQT — Aptitude + Verbal + Reasoning + Coding", topics:["Arrays","Strings","Basic DP","Sorting","Patterns"] },
  infosys:    { name:"Infosys",       logo:"🟣", color:"#7c3aed", type:"service", pattern:"InfyTQ — Aptitude + Power Programmer", topics:["Java OOPs","Python","DSA Basics","SQL","Strings"] },
  wipro:      { name:"Wipro",         logo:"🟢", color:"#16a34a", type:"service", pattern:"NLTH — Aptitude + Essay + Coding", topics:["Python","C++","LinkedList","Recursion","Arrays"] },
  cognizant:  { name:"Cognizant",     logo:"🟠", color:"#ea580c", type:"service", pattern:"GenC — Aptitude + Coding + Communication", topics:["Python","Java","Logic","Problem Solving"] },
  hcl:        { name:"HCL",           logo:"🔷", color:"#0284c7", type:"service", pattern:"TechBee — Aptitude + Technical MCQs + Coding", topics:["DBMS","OOPs","Algorithms","SQL"] },
  accenture:  { name:"Accenture",     logo:"💜", color:"#a855f7", type:"service", pattern:"Aptitude + Critical Thinking + Coding", topics:["Logic","Pseudo Code","Python","SQL"] },
  capgemini:  { name:"Capgemini",     logo:"🟦", color:"#0891b2", type:"service", pattern:"Pseudo Code + Behavioural + Technical", topics:["Pseudo Code","Java","Python","Algo Design"] },
  techmah:    { name:"Tech Mahindra", logo:"🔴", color:"#dc2626", type:"service", pattern:"Aptitude + Verbal + Technical + Coding", topics:["C++","Java","DSA","Strings"] },
  mphasis:    { name:"Mphasis",       logo:"🟩", color:"#059669", type:"service", pattern:"Aptitude + Verbal + Technical + Coding", topics:["Java","Python","SQL","OOPs"] },
  ltimindtree:{ name:"LTIMindtree",   logo:"🌳", color:"#9333ea", type:"service", pattern:"Cognitive + Technical + Coding", topics:["Java","Python","SQL","DSA"] },
  hexaware:   { name:"Hexaware",      logo:"🟡", color:"#ca8a04", type:"service", pattern:"Aptitude + Technical + Coding", topics:["Arrays","Strings","OOPs","SQL"] },
  coforge:    { name:"Coforge",       logo:"🔶", color:"#0f766e", type:"service", pattern:"Aptitude + Reasoning + Technical + Coding", topics:["Python","Java","Arrays","SQL"] },
  persistent: { name:"Persistent",    logo:"🏗️", color:"#7c2d12", type:"service", pattern:"Aptitude + Verbal + Coding (DSA-focused)", topics:["DSA","Java","Python","Trees"] },
  epam:       { name:"EPAM",          logo:"🔹", color:"#1e3a5f", type:"service", pattern:"Technical Screening + Coding + Problem Solving", topics:["Java","OOPs","Design Patterns","Algorithms"] },
  dxc:        { name:"DXC Technology",logo:"🌀", color:"#6b21a8", type:"service", pattern:"Aptitude + Technical MCQ + Coding", topics:["Java","Python","SQL","OOPs"] },
  amazon:     { name:"Amazon",        logo:"📦", color:"#d97706", type:"product", pattern:"SDE OA — 2 DSA + Work Simulation + 16 LPs", topics:["Arrays","Hash Maps","Two Pointers","BFS/DFS","DP"] },
  microsoft:  { name:"Microsoft",     logo:"🪟", color:"#0284c7", type:"product", pattern:"DSA Rounds + System Design + Behavioral", topics:["Trees","Graphs","DP","Backtracking"] },
  google:     { name:"Google",        logo:"🔍", color:"#dc2626", type:"product", pattern:"Multiple Coding Rounds + System Design", topics:["Graphs","DP","Segment Trees","Tries"] },
  flipkart:   { name:"Flipkart",      logo:"🛒", color:"#f59e0b", type:"product", pattern:"OA — DSA + Technical + Product Thinking", topics:["Arrays","Trees","DP","SQL"] },
  zomato:     { name:"Zomato",        logo:"🍕", color:"#ef4444", type:"product", pattern:"DSA + Product Sense + Case Studies", topics:["SQL","Python","DSA Medium","System Design"] },
  razorpay:   { name:"Razorpay",      logo:"💳", color:"#3b82f6", type:"product", pattern:"Fintech DSA + System Design + Payments", topics:["DSA Medium-Hard","APIs","Java/Go"] },
  swiggy:     { name:"Swiggy",        logo:"🛵", color:"#f97316", type:"product", pattern:"DSA + System Design + Product Thinking", topics:["Arrays","Graphs","DP","System Design"] },
  paytm:      { name:"Paytm",         logo:"📱", color:"#1d4ed8", type:"product", pattern:"Fintech DSA + System Design", topics:["Java","Distributed Systems","Arrays","DP"] },
  phonepe:    { name:"PhonePe",       logo:"💜", color:"#6d28d9", type:"product", pattern:"Fintech Coding + System Design", topics:["Java","DSA","SQL","APIs"] },
  meesho:     { name:"Meesho",        logo:"👗", color:"#db2777", type:"product", pattern:"E-commerce DSA + System Design", topics:["Python","Java","DSA","SQL"] },
  zoho:       { name:"Zoho",          logo:"☁️", color:"#dc2626", type:"product", pattern:"Manual Written Round + Technical + Coding", topics:["Java","C++","OOPs","DSA","SQL"] },
  freshworks: { name:"Freshworks",    logo:"🌱", color:"#22c55e", type:"product", pattern:"Product DSA + APIs + SaaS Systems", topics:["Ruby","Python","Java","APIs","DSA"] },
  adobe:      { name:"Adobe",         logo:"🎨", color:"#cc0000", type:"product", pattern:"Creative Tech + DSA + System Design", topics:["C++","Java","DSA","System Design"] },
  uber:       { name:"Uber",          logo:"🚙", color:"#0f172a", type:"product", pattern:"Geospatial Systems + DSA + System Design", topics:["Maps/Graphs","Distributed Systems","Python"] },
  linkedin_c: { name:"LinkedIn",      logo:"💼", color:"#0a66c2", type:"product", pattern:"Professional Network DSA + System Design", topics:["Java","Distributed Systems","Graphs","DSA"] },
};

// ─── APTITUDE QUESTION BANKS ─────────────────────────────────────────────
const APT = {
  tcs: [
    {q:"A train 150m long passes a pole in 15s. Speed?",opts:["10 m/s","12 m/s","8 m/s","15 m/s"],ans:0,exp:"Speed=150/15=10 m/s",topic:"Speed"},
    {q:"6 men do work in 12 days. Men needed in 8 days?",opts:["8","9","10","7"],ans:1,exp:"6×12=72. 72/8=9",topic:"Work"},
    {q:"20% profit on ₹500 CP. SP?",opts:["₹600","₹580","₹620","₹550"],ans:0,exp:"SP=500×1.2=600",topic:"Profit"},
    {q:"2,6,12,20,30,?",opts:["42","40","44","38"],ans:0,exp:"Diffs:4,6,8,10,12. Next=42",topic:"Series"},
    {q:"SI on ₹2000 for 3yr at 5%?",opts:["₹300","₹200","₹250","₹350"],ans:0,exp:"SI=2000×5×3/100=300",topic:"SI"},
    {q:"Pipe fills in 4hrs, empties in 12hrs. Net fill time?",opts:["6 hrs","8 hrs","5 hrs","10 hrs"],ans:0,exp:"1/4-1/12=1/6. Time=6",topic:"Pipes"},
    {q:"15% of 240?",opts:["36","32","40","28"],ans:0,exp:"15/100×240=36",topic:"%"},
    {q:"3km N, 4km E. Distance from start?",opts:["5 km","7 km","4 km","6 km"],ans:0,exp:"√(9+16)=5",topic:"Direction"},
    {q:"CI on ₹1000 for 2yr at 10%?",opts:["₹210","₹200","₹220","₹190"],ans:0,exp:"1000×1.1²=1210. CI=210",topic:"CI"},
    {q:"LCM of 12 and 18?",opts:["36","24","48","72"],ans:0,exp:"LCM=36",topic:"LCM"},
    {q:"3 coins tossed. P(exactly 2H)?",opts:["3/8","1/2","1/4","1/8"],ans:0,exp:"C(3,2)/8=3/8",topic:"Probability"},
    {q:"₹1500→₹1800 in 2yr SI. Rate?",opts:["10%","8%","12%","15%"],ans:0,exp:"SI=300. R=300×100/3000=10%",topic:"SI"},
    {q:"HCF of 36 and 48?",opts:["12","6","18","24"],ans:0,exp:"HCF=12",topic:"HCF"},
    {q:"Sum of first 100 natural numbers?",opts:["5050","5000","4950","5100"],ans:0,exp:"100×101/2=5050",topic:"Series"},
    {q:"Sphere volume 904.8cm³. Radius (π≈3.14)?",opts:["6 cm","5 cm","7 cm","4 cm"],ans:0,exp:"r³=216, r=6",topic:"Geometry"},
  ],
  infosys: [
    {q:"3 red, 5 blue balls. P(2 red drawn)?",opts:["3/28","1/8","3/14","1/4"],ans:0,exp:"C(3,2)/C(8,2)=3/28",topic:"Probability"},
    {q:"Clock at 3:15. Angle between hands?",opts:["7.5°","0°","15°","22.5°"],ans:0,exp:"97.5°-90°=7.5°",topic:"Clocks"},
    {q:"Man is 3× son's age. In 15yr, twice. Son's age?",opts:["15","10","20","12"],ans:0,exp:"3x+15=2(x+15) → x=15",topic:"Ages"},
    {q:"Series: 1,4,10,20,35,?",opts:["56","49","60","52"],ans:0,exp:"Diff:3,6,10,15,21. 35+21=56",topic:"Series"},
    {q:"Room 12×9×8m. Longest stick?",opts:["17 m","15 m","16 m","18 m"],ans:0,exp:"√(144+81+64)=√289=17",topic:"3D Geometry"},
    {q:"A fills in 20min, B in 30min, C drains in 15min. Fill time?",opts:["60 min","40 min","120 min","90 min"],ans:0,exp:"1/20+1/30-1/15=1/60",topic:"Pipes"},
    {q:"0,1,1,2,3,5,8,13,?",opts:["21","20","22","18"],ans:0,exp:"Fibonacci: 8+13=21",topic:"Series"},
    {q:"60% passed English, 70% Math, 40% both. Failed both?",opts:["10%","20%","30%","15%"],ans:0,exp:"100-90=10%",topic:"Sets"},
    {q:"Smallest number divisible by 1 to 10?",opts:["2520","5040","1260","720"],ans:0,exp:"LCM(1..10)=2520",topic:"LCM"},
    {q:"₹8000→₹10000 in 5yr SI. Rate?",opts:["5%","4%","6%","8%"],ans:0,exp:"R=2000×100/40000=5%",topic:"SI"},
    {q:"Boys:Girls=3:2. Total 50. Girls?",opts:["20","25","30","15"],ans:0,exp:"2/5×50=20",topic:"Ratio"},
    {q:"2x+9=65. x?",opts:["28","30","32","26"],ans:0,exp:"2x=56 → x=28",topic:"Equations"},
    {q:"10th Fibonacci (starting 0,1)?",opts:["34","21","55","13"],ans:0,exp:"0,1,1,2,3,5,8,13,21,34",topic:"Fibonacci"},
    {q:"Sound 330m/s. Thunder 3s after lightning. Distance?",opts:["990 m","660 m","1320 m","330 m"],ans:0,exp:"330×3=990",topic:"Physics"},
    {q:"Polygon has 35 diagonals. Sides?",opts:["10","9","11","8"],ans:0,exp:"n(n-3)/2=35 → n=10",topic:"Geometry"},
  ],
  amazon: [
    {q:"LP: 'Start with customer and work backwards'",opts:["Customer Obsession","Invent & Simplify","Think Big","Bias for Action"],ans:0,exp:"LP#1: Customer Obsession",topic:"LP"},
    {q:"Max element in array of n. Time?",opts:["O(n)","O(log n)","O(1)","O(n²)"],ans:0,exp:"Must scan all elements",topic:"Complexity"},
    {q:"LIFO data structure?",opts:["Stack","Queue","Array","Linked List"],ans:0,exp:"Stack = Last In First Out",topic:"DSA"},
    {q:"Hash map average lookup?",opts:["O(1)","O(n)","O(log n)","O(n²)"],ans:0,exp:"O(1) average case",topic:"DSA"},
    {q:"Merge sorted arrays m+n. Big O?",opts:["O(m+n)","O(mn)","O(m log n)","O(n²)"],ans:0,exp:"One pass",topic:"Complexity"},
    {q:"DFS complexity for V vertices, E edges?",opts:["O(V+E)","O(V²)","O(E log V)","O(VE)"],ans:0,exp:"Each vertex and edge once",topic:"Graphs"},
    {q:"Quicksort worst case?",opts:["O(n²)","O(n log n)","O(n)","O(log n)"],ans:0,exp:"When pivot always smallest/largest",topic:"Sorting"},
    {q:"HTTP method idempotent AND safe?",opts:["GET","POST","PUT","DELETE"],ans:0,exp:"GET has no side effects",topic:"API"},
    {q:"CAP theorem: distributed system guarantees?",opts:["Any 2 of C,A,P","All 3","Only C","Only A"],ans:0,exp:"Cannot guarantee all 3",topic:"Distributed"},
    {q:"Stable AND O(n log n) sort?",opts:["Merge sort","Quick sort","Heap sort","Selection sort"],ans:0,exp:"Merge sort always O(n log n) and stable",topic:"Sorting"},
    {q:"WHERE vs HAVING in SQL?",opts:["WHERE filters rows, HAVING groups","HAVING is faster","WHERE on aggregates","Both same"],ans:0,exp:"WHERE before grouping, HAVING after",topic:"SQL"},
    {q:"Deadlock in OS?",opts:["Circular wait on resources","Slow process","Memory overflow","CPU idle"],ans:0,exp:"Circular wait",topic:"OS"},
    {q:"HTTP 404 means?",opts:["Not Found","Server Error","Unauthorized","Redirect"],ans:0,exp:"Resource not found",topic:"HTTP"},
    {q:"Merge sort space complexity?",opts:["O(n)","O(1)","O(log n)","O(n log n)"],ans:0,exp:"Needs O(n) auxiliary space",topic:"Sorting"},
    {q:"SOLID — S stands for?",opts:["Single Responsibility","Strong","Simple","Sequential"],ans:0,exp:"Single Responsibility Principle",topic:"Design"},
  ],
  wipro: [
    {q:"Correct sentence:",opts:["She doesn't like it","She don't like it","She didn't liked it","She not like it"],ans:0,exp:"Doesn't for 3rd person singular",topic:"Grammar"},
    {q:"5 workers, 5 widgets, 5 days. 100 workers, 100 widgets: days?",opts:["5","100","1","50"],ans:0,exp:"Same rate: 5 days",topic:"Work"},
    {q:"Synonym of AMELIORATE:",opts:["Improve","Worsen","Maintain","Destroy"],ans:0,exp:"Ameliorate = improve",topic:"Vocab"},
    {q:"Clock loses 5min/hr. Set at noon. Shows at 5pm?",opts:["4:35 pm","4:55 pm","4:45 pm","4:30 pm"],ans:0,exp:"5×55min=275min=4:35pm",topic:"Clocks"},
    {q:"20% of 20% of 500?",opts:["20","40","100","25"],ans:0,exp:"20% of 100=20",topic:"%"},
    {q:"Sum of first 50 natural numbers?",opts:["1275","1250","1300","1225"],ans:0,exp:"50×51/2=1275",topic:"Series"},
    {q:"₹5000→₹6000 in 4yr SI. Rate?",opts:["5%","4%","6%","8%"],ans:0,exp:"R=1000×100/20000=5%",topic:"SI"},
    {q:"3 books from 5. Ways?",opts:["60","120","20","30"],ans:0,exp:"P(5,3)=60",topic:"Permutation"},
    {q:"Bought ₹800, 25% loss. SP?",opts:["₹600","₹700","₹750","₹650"],ans:0,exp:"800×0.75=600",topic:"Profit"},
    {q:"AP: a=3,d=2,n=10. Sum?",opts:["120","110","100","130"],ans:0,exp:"10/2×(6+18)=120",topic:"AP"},
    {q:"600m train at 54km/h crosses 900m platform. Time?",opts:["100 sec","90 sec","80 sec","110 sec"],ans:0,exp:"1500/15=100",topic:"Trains"},
    {q:"P:Q ages=3:4. 8yr ago=2:3. P's age?",opts:["24","32","18","36"],ans:0,exp:"x=8. P=24",topic:"Ages"},
    {q:"Sum=50, diff=10. Product?",opts:["600","500","550","450"],ans:0,exp:"30×20=600",topic:"Numbers"},
    {q:"₹10,000 at 12% CI for 2yr?",opts:["₹12,544","₹12,400","₹12,000","₹12,200"],ans:0,exp:"10000×1.12²=12544",topic:"CI"},
    {q:"Today Friday. After 61 days?",opts:["Wednesday","Saturday","Monday","Friday"],ans:0,exp:"61 mod 7=5. Fri+5=Wed",topic:"Calendar"},
  ],
};

const getAptQ = (co) => APT[co] || APT.tcs;

// ─── LANGUAGES ────────────────────────────────────────────────────────────
const LANGUAGES = [
  {id:"javascript",label:"JS",icon:"🟨"},
  {id:"python",label:"PY",icon:"🐍"},
  {id:"java",label:"Java",icon:"☕"},
  {id:"cpp",label:"C++",icon:"⚙️"},
  {id:"c",label:"C",icon:"🔵"},
];

// ─── CODING PROBLEMS (sample - easy ones) ─────────────────────────────────
const PROBLEMS = {
  easy: [
    { id:"e1", title:"Reverse a String", topic:"Strings", companies:["tcs","infosys","wipro"],
      description:"Given a string, return it reversed.\n\nExamples:\n  Input: \"hello\"  →  Output: \"olleh\"",
      templates:{
        javascript:"const readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on('line', line => {\n  console.log(line.split('').reverse().join(''));\n  rl.close();\n});",
        python:"s = input()\nprint(s[::-1])",
        java:"import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        System.out.println(new StringBuilder(s).reverse().toString());\n    }\n}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    string s;\n    getline(cin, s);\n    reverse(s.begin(), s.end());\n    cout << s << endl;\n}",
        c:"#include<stdio.h>\n#include<string.h>\nint main(){\n    char s[1001];\n    fgets(s, 1001, stdin);\n    int n = strlen(s);\n    if(s[n-1]=='\\n') n--;\n    for(int i=n-1;i>=0;i--) printf(\"%c\",s[i]);\n    printf(\"\\n\");\n}"
      }
    },
    { id:"e2", title:"Check Palindrome", topic:"Strings", companies:["tcs","infosys"],
      description:"Print 'true' if palindrome, else 'false'. Ignore case.\n\nExamples:\n  Input: \"racecar\" → Output: \"true\"\n  Input: \"hello\" → Output: \"false\"",
      templates:{
        javascript:"const readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on('line', line => {\n  const s = line.toLowerCase();\n  console.log(String(s === s.split('').reverse().join('')));\n  rl.close();\n});",
        python:"s = input().lower()\nprint(str(s == s[::-1]).lower())",
        java:"import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().toLowerCase();\n        String r = new StringBuilder(s).reverse().toString();\n        System.out.println(s.equals(r));\n    }\n}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    string s; getline(cin,s);\n    transform(s.begin(),s.end(),s.begin(),::tolower);\n    string r(s.rbegin(),s.rend());\n    cout<<(s==r?\"true\":\"false\")<<endl;\n}",
        c:"#include<stdio.h>\n#include<string.h>\n#include<ctype.h>\nint main(){\n    char s[1001]; fgets(s,1001,stdin);\n    int n=strlen(s);\n    if(s[n-1]=='\\n')n--;\n    for(int i=0;i<n;i++)s[i]=tolower(s[i]);\n    int ok=1;\n    for(int i=0;i<n/2;i++)if(s[i]!=s[n-1-i]){ok=0;break;}\n    printf(\"%s\\n\",ok?\"true\":\"false\");\n}"
      }
    },
    { id:"e3", title:"Sum of Array", topic:"Arrays", companies:["tcs","wipro","hcl"],
      description:"Given N integers (space-separated), print their sum.\n\nExamples:\n  Input: \"1 2 3 4 5\" → Output: \"15\"",
      templates:{
        javascript:"const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\nconsole.log(nums.reduce((a,b)=>a+b,0));",
        python:"nums = list(map(int, input().split()))\nprint(sum(nums))",
        java:"import java.util.*;\npublic class Main{\n    public static void main(String[] a){\n        Scanner sc=new Scanner(System.in);\n        long sum=0;\n        while(sc.hasNextLong())sum+=sc.nextLong();\n        System.out.println(sum);\n    }\n}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    long long n,s=0;\n    while(cin>>n)s+=n;\n    cout<<s<<endl;\n}",
        c:"#include<stdio.h>\nint main(){\n    long long n,s=0;\n    while(scanf(\"%lld\",&n)==1)s+=n;\n    printf(\"%lld\\n\",s);\n}"
      }
    },
    { id:"e4", title:"Fibonacci Series", topic:"Dynamic Programming", companies:["tcs","infosys","wipro"],
      description:"Print first N Fibonacci numbers space-separated.\n\nExamples:\n  Input: \"5\" → Output: \"0 1 1 2 3\"",
      templates:{
        javascript:"const n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());\nconst f=[0,1];\nfor(let i=2;i<n;i++)f.push(f[i-1]+f[i-2]);\nconsole.log(f.slice(0,n).join(' '));",
        python:"n=int(input())\nif n==1:print(0)\nelse:\n    f=[0,1]\n    for i in range(2,n):f.append(f[-1]+f[-2])\n    print(' '.join(map(str,f[:n])))",
        java:"import java.util.*;\npublic class Main{\n    public static void main(String[] a){\n        int n=new Scanner(System.in).nextInt();\n        long[]f=new long[Math.max(n,2)];\n        f[0]=0; if(n>1)f[1]=1;\n        for(int i=2;i<n;i++)f[i]=f[i-1]+f[i-2];\n        StringBuilder sb=new StringBuilder();\n        for(int i=0;i<n;i++){if(i>0)sb.append(' ');sb.append(f[i]);}\n        System.out.println(sb);\n    }\n}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n;cin>>n;\n    vector<long long>f(max(n,2));\n    f[0]=0; if(n>1)f[1]=1;\n    for(int i=2;i<n;i++)f[i]=f[i-1]+f[i-2];\n    for(int i=0;i<n;i++){if(i)cout<<' ';cout<<f[i];}\n    cout<<endl;\n}",
        c:"#include<stdio.h>\nint main(){\n    int n;scanf(\"%d\",&n);\n    long long f[200]={0,1};\n    for(int i=2;i<n;i++)f[i]=f[i-1]+f[i-2];\n    for(int i=0;i<n;i++){if(i)printf(\" \");printf(\"%lld\",f[i]);}\n    printf(\"\\n\");\n}"
      }
    },
    { id:"e5", title:"Prime Check", topic:"Number Theory", companies:["tcs","infosys","wipro"],
      description:"Print 'true' if N is prime, 'false' otherwise.\n\nExamples:\n  Input: \"7\" → Output: \"true\"\n  Input: \"4\" → Output: \"false\"",
      templates:{
        javascript:"const n=parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());\nif(n<2){console.log('false');process.exit();}\nlet prime=true;\nfor(let i=2;i*i<=n;i++)if(n%i===0){prime=false;break;}\nconsole.log(String(prime));",
        python:"n=int(input())\nif n<2:print('false')\nelse:\n    ok=all(n%i!=0 for i in range(2,int(n**.5)+1))\n    print('true' if ok else 'false')",
        java:"import java.util.*;\npublic class Main{\n    public static void main(String[] a){\n        int n=new Scanner(System.in).nextInt();\n        if(n<2){System.out.println(false);return;}\n        for(int i=2;(long)i*i<=n;i++)if(n%i==0){System.out.println(false);return;}\n        System.out.println(true);\n    }\n}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    long long n;cin>>n;\n    if(n<2){cout<<\"false\";return 0;}\n    for(long long i=2;i*i<=n;i++)if(n%i==0){cout<<\"false\";return 0;}\n    cout<<\"true\";\n}",
        c:"#include<stdio.h>\nint main(){\n    long long n;scanf(\"%lld\",&n);\n    if(n<2){printf(\"false\");return 0;}\n    for(long long i=2;i*i<=n;i++)if(n%i==0){printf(\"false\");return 0;}\n    printf(\"true\");\n}"
      }
    },
    { id:"e6", title:"FizzBuzz", topic:"Basics", companies:["tcs","infosys","wipro","cognizant"],
      description:"For 1 to N: Fizz if div by 3, Buzz if by 5, FizzBuzz if both, else number.\n\nExample N=5:\n  1\n  2\n  Fizz\n  4\n  Buzz",
      templates:{
        javascript:"const n=parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());\nfor(let i=1;i<=n;i++){\n  if(i%15===0)console.log('FizzBuzz');\n  else if(i%3===0)console.log('Fizz');\n  else if(i%5===0)console.log('Buzz');\n  else console.log(i);\n}",
        python:"n=int(input())\nfor i in range(1,n+1):\n    if i%15==0:print('FizzBuzz')\n    elif i%3==0:print('Fizz')\n    elif i%5==0:print('Buzz')\n    else:print(i)",
        java:"import java.util.*;\npublic class Main{\n    public static void main(String[] a){\n        int n=new Scanner(System.in).nextInt();\n        for(int i=1;i<=n;i++){\n            if(i%15==0)System.out.println(\"FizzBuzz\");\n            else if(i%3==0)System.out.println(\"Fizz\");\n            else if(i%5==0)System.out.println(\"Buzz\");\n            else System.out.println(i);\n        }\n    }\n}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n;cin>>n;\n    for(int i=1;i<=n;i++){\n        if(i%15==0)cout<<\"FizzBuzz\\n\";\n        else if(i%3==0)cout<<\"Fizz\\n\";\n        else if(i%5==0)cout<<\"Buzz\\n\";\n        else cout<<i<<\"\\n\";\n    }\n}",
        c:"#include<stdio.h>\nint main(){\n    int n;scanf(\"%d\",&n);\n    for(int i=1;i<=n;i++){\n        if(i%15==0)printf(\"FizzBuzz\\n\");\n        else if(i%3==0)printf(\"Fizz\\n\");\n        else if(i%5==0)printf(\"Buzz\\n\");\n        else printf(\"%d\\n\",i);\n    }\n}"
      }
    },
    { id:"e7", title:"Count Vowels", topic:"Strings", companies:["tcs","wipro","hcl"],
      description:"Count vowels (a,e,i,o,u) in a string (case-insensitive).\n\nExamples:\n  Input: \"Hello World\" → Output: \"3\"",
      templates:{
        javascript:"const s=require('fs').readFileSync('/dev/stdin','utf8').trim().toLowerCase();\nconsole.log([...s].filter(c=>'aeiou'.includes(c)).length);",
        python:"s=input().lower()\nprint(sum(1 for c in s if c in 'aeiou'))",
        java:"import java.util.*;\npublic class Main{\n    public static void main(String[] a){\n        String s=new Scanner(System.in).nextLine().toLowerCase();\n        int c=0;\n        for(char ch:s.toCharArray())if(\"aeiou\".indexOf(ch)>=0)c++;\n        System.out.println(c);\n    }\n}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    string s;getline(cin,s);\n    int c=0;\n    for(char ch:s){\n        char l=tolower(ch);\n        if(l=='a'||l=='e'||l=='i'||l=='o'||l=='u')c++;\n    }\n    cout<<c<<endl;\n}",
        c:"#include<stdio.h>\n#include<ctype.h>\nint main(){\n    char s[1001];fgets(s,1001,stdin);\n    int c=0;\n    for(int i=0;s[i];i++){\n        char ch=tolower(s[i]);\n        if(ch=='a'||ch=='e'||ch=='i'||ch=='o'||ch=='u')c++;\n    }\n    printf(\"%d\\n\",c);\n}"
      }
    },
    { id:"e8", title:"Factorial", topic:"Recursion", companies:["tcs","infosys","wipro"],
      description:"Print factorial of N (0 ≤ N ≤ 20).\n\nExamples:\n  Input: \"5\" → Output: \"120\"",
      templates:{
        javascript:"const n=parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());\nlet f=BigInt(1);\nfor(let i=2;i<=n;i++)f*=BigInt(i);\nconsole.log(f.toString());",
        python:"n=int(input())\nf=1\nfor i in range(2,n+1):f*=i\nprint(f)",
        java:"import java.util.*;\nimport java.math.*;\npublic class Main{\n    public static void main(String[] a){\n        int n=new Scanner(System.in).nextInt();\n        BigInteger f=BigInteger.ONE;\n        for(int i=2;i<=n;i++)f=f.multiply(BigInteger.valueOf(i));\n        System.out.println(f);\n    }\n}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n;cin>>n;\n    unsigned long long f=1;\n    for(int i=2;i<=n;i++)f*=i;\n    cout<<f<<endl;\n}",
        c:"#include<stdio.h>\nint main(){\n    int n;scanf(\"%d\",&n);\n    unsigned long long f=1;\n    for(int i=2;i<=n;i++)f*=i;\n    printf(\"%llu\\n\",f);\n}"
      }
    },
    { id:"e9", title:"Second Largest Element", topic:"Arrays", companies:["tcs","wipro","infosys"],
      description:"Find the second largest unique element. Print -1 if none.\n\nExamples:\n  Input: \"3 1 4 1 5 9 2 6\" → Output: \"6\"",
      templates:{
        javascript:"const nums=require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\nconst uniq=[...new Set(nums)].sort((a,b)=>b-a);\nconsole.log(uniq.length>=2?uniq[1]:-1);",
        python:"nums=list(map(int,input().split()))\nuniq=sorted(set(nums),reverse=True)\nprint(uniq[1] if len(uniq)>=2 else -1)",
        java:"import java.util.*;\npublic class Main{\n    public static void main(String[] a){\n        Scanner sc=new Scanner(System.in);\n        TreeSet<Integer> s=new TreeSet<>();\n        while(sc.hasNextInt())s.add(sc.nextInt());\n        if(s.size()<2){System.out.println(-1);return;}\n        s.pollLast();\n        System.out.println(s.last());\n    }\n}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    set<int>s; int x;\n    while(cin>>x)s.insert(x);\n    if(s.size()<2){cout<<-1;return 0;}\n    auto it=s.end();--it;--it;\n    cout<<*it<<endl;\n}",
        c:"#include<stdio.h>\n#include<limits.h>\nint main(){\n    int a[10000],n=0,x;\n    while(scanf(\"%d\",&x)==1)a[n++]=x;\n    int m1=INT_MIN,m2=INT_MIN;\n    for(int i=0;i<n;i++)if(a[i]>m1){m2=m1;m1=a[i];}else if(a[i]>m2&&a[i]<m1)m2=a[i];\n    printf(\"%d\\n\",m2==INT_MIN?-1:m2);\n}"
      }
    },
    { id:"e10", title:"Missing Number", topic:"Arrays", companies:["amazon","tcs","microsoft"],
      description:"Array has n-1 numbers from [1,n] with one missing. Find it.\n\nExamples:\n  Input: \"1 2 4 5 6\" → Output: \"3\"",
      templates:{
        javascript:"const nums=require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\nconst n=nums.length+1;\nconsole.log(n*(n+1)/2-nums.reduce((a,b)=>a+b,0));",
        python:"nums=list(map(int,input().split()))\nn=len(nums)+1\nprint(n*(n+1)//2-sum(nums))",
        java:"import java.util.*;\npublic class Main{\n    public static void main(String[] a){\n        Scanner sc=new Scanner(System.in);\n        List<Integer>lst=new ArrayList<>();\n        while(sc.hasNextInt())lst.add(sc.nextInt());\n        int n=lst.size()+1;\n        long exp=(long)n*(n+1)/2,act=lst.stream().mapToLong(x->x).sum();\n        System.out.println(exp-act);\n    }\n}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    vector<long long>v; long long x;\n    while(cin>>x)v.push_back(x);\n    long long n=v.size()+1;\n    cout<<n*(n+1)/2-accumulate(v.begin(),v.end(),0LL)<<endl;\n}",
        c:"#include<stdio.h>\nint main(){\n    long long a[100001],n=0,s=0,x;\n    while(scanf(\"%lld\",&x)==1){a[n++]=x;s+=x;}\n    long long total=(n+1)*(n+2)/2;\n    printf(\"%lld\\n\",total-s);\n}"
      }
    },
  ],
  medium: [
    { id:"m1", title:"Two Sum", topic:"Hash Map", companies:["amazon","google","microsoft","flipkart"],
      description:"Given array and target, print indices of two numbers that add up to target.\nFirst line: array. Second line: target.\n\nExamples:\n  Input:\n    2 7 11 15\n    9\n  Output: 0 1",
      templates:{
        javascript:"const lines=require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\nconst nums=lines[0].split(' ').map(Number),target=parseInt(lines[1]);\nconst m={};\nfor(let i=0;i<nums.length;i++){\n  const c=target-nums[i];\n  if(c in m){console.log(m[c]+' '+i);process.exit();}\n  m[nums[i]]=i;\n}",
        python:"nums=list(map(int,input().split()))\ntarget=int(input())\nseen={}\nfor i,n in enumerate(nums):\n    c=target-n\n    if c in seen:print(seen[c],i);exit()\n    seen[n]=i",
        java:"import java.util.*;\npublic class Main{public static void main(String[]a){Scanner sc=new Scanner(System.in);String[]p=sc.nextLine().split(\" \");int t=sc.nextInt();Map<Integer,Integer>m=new HashMap<>();for(int i=0;i<p.length;i++){int n=Integer.parseInt(p[i]),c=t-n;if(m.containsKey(c)){System.out.println(m.get(c)+\" \"+i);return;}m.put(n,i);}}}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){string line;getline(cin,line);int t;cin>>t;istringstream iss(line);vector<int>v;int x;while(iss>>x)v.push_back(x);unordered_map<int,int>m;for(int i=0;i<(int)v.size();i++){int c=t-v[i];if(m.count(c)){cout<<m[c]<<' '<<i<<endl;return 0;}m[v[i]]=i;}}",
        c:"#include<stdio.h>\nint main(){int a[10001],n=0,t;char line[100001];fgets(line,100001,stdin);char*tok=strtok(line,\" \\n\");while(tok){a[n++]=atoi(tok);tok=strtok(NULL,\" \\n\");}scanf(\"%d\",&t);for(int i=0;i<n;i++)for(int j=i+1;j<n;j++)if(a[i]+a[j]==t){printf(\"%d %d\\n\",i,j);return 0;}}"
      }
    },
    { id:"m2", title:"Maximum Subarray (Kadane's)", topic:"Dynamic Programming", companies:["amazon","microsoft","google","flipkart"],
      description:"Find contiguous subarray with largest sum.\n\nExamples:\n  Input: \"-2 1 -3 4 -1 2 1 -5 4\" → Output: \"6\"",
      templates:{
        javascript:"const nums=require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\nlet max=nums[0],cur=nums[0];\nfor(let i=1;i<nums.length;i++){cur=Math.max(nums[i],cur+nums[i]);max=Math.max(max,cur);}\nconsole.log(max);",
        python:"nums=list(map(int,input().split()))\nmax_s=cur=nums[0]\nfor n in nums[1:]:\n    cur=max(n,cur+n)\n    max_s=max(max_s,cur)\nprint(max_s)",
        java:"import java.util.*;\npublic class Main{public static void main(String[]a){Scanner sc=new Scanner(System.in);List<Integer>l=new ArrayList<>();while(sc.hasNextInt())l.add(sc.nextInt());int max=l.get(0),cur=l.get(0);for(int i=1;i<l.size();i++){cur=Math.max(l.get(i),cur+l.get(i));max=Math.max(max,cur);}System.out.println(max);}}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){vector<int>v;int x;while(cin>>x)v.push_back(x);int mx=v[0],cur=v[0];for(int i=1;i<(int)v.size();i++){cur=max(v[i],cur+v[i]);mx=max(mx,cur);}cout<<mx<<endl;}",
        c:"#include<stdio.h>\nint main(){int a[100001],n=0;while(scanf(\"%d\",&a[n])==1)n++;int mx=a[0],cur=a[0];for(int i=1;i<n;i++){cur=cur+a[i]>a[i]?cur+a[i]:a[i];mx=cur>mx?cur:mx;}printf(\"%d\\n\",mx);}"
      }
    },
    { id:"m3", title:"Stock Buy Sell Max Profit", topic:"Greedy", companies:["amazon","google","microsoft"],
      description:"Find max profit from one buy+sell (buy before sell). Print 0 if no profit.\n\nExamples:\n  Input: \"7 1 5 3 6 4\" → Output: \"5\"",
      templates:{
        javascript:"const p=require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\nlet min=p[0],max=0;\nfor(const x of p){max=Math.max(max,x-min);min=Math.min(min,x);}\nconsole.log(max);",
        python:"p=list(map(int,input().split()))\nmin_p=p[0];max_p=0\nfor x in p:\n    max_p=max(max_p,x-min_p)\n    min_p=min(min_p,x)\nprint(max_p)",
        java:"import java.util.*;\npublic class Main{public static void main(String[]a){Scanner sc=new Scanner(System.in);List<Integer>p=new ArrayList<>();while(sc.hasNextInt())p.add(sc.nextInt());int min=p.get(0),max=0;for(int x:p){max=Math.max(max,x-min);min=Math.min(min,x);}System.out.println(max);}}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){vector<int>p;int x;while(cin>>x)p.push_back(x);int mn=p[0],mx=0;for(int v:p){mx=max(mx,v-mn);mn=min(mn,v);}cout<<mx<<endl;}",
        c:"#include<stdio.h>\nint main(){int a[100001],n=0;while(scanf(\"%d\",&a[n])==1)n++;int mn=a[0],mx=0;for(int i=0;i<n;i++){if(a[i]-mn>mx)mx=a[i]-mn;if(a[i]<mn)mn=a[i];}printf(\"%d\\n\",mx);}"
      }
    },
    { id:"m4", title:"Number of Islands", topic:"BFS/DFS", companies:["amazon","google","microsoft"],
      description:"Count islands in grid. First line: rows cols. Then grid.\n\nExample:\n  Input:\n    3 3\n    1 1 0\n    0 1 0\n    0 0 1\n  Output: 2",
      templates:{
        javascript:"const lines=require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\nconst[R,C]=lines[0].split(' ').map(Number);\nconst g=lines.slice(1).map(r=>r.split(' ').map(Number));\nlet cnt=0;\nfunction dfs(r,c){if(r<0||r>=R||c<0||c>=C||g[r][c]===0)return;g[r][c]=0;dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);}\nfor(let r=0;r<R;r++)for(let c=0;c<C;c++)if(g[r][c]===1){cnt++;dfs(r,c);}\nconsole.log(cnt);",
        python:"R,C=map(int,input().split())\ng=[list(map(int,input().split()))for _ in range(R)]\ncnt=0\ndef dfs(r,c):\n    if r<0 or r>=R or c<0 or c>=C or g[r][c]==0:return\n    g[r][c]=0\n    dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1)\nfor r in range(R):\n    for c in range(C):\n        if g[r][c]==1:cnt+=1;dfs(r,c)\nprint(cnt)",
        java:"import java.util.*;\npublic class Main{static int R,C;static int[][]g;static void dfs(int r,int c){if(r<0||r>=R||c<0||c>=C||g[r][c]==0)return;g[r][c]=0;dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);}public static void main(String[]a){Scanner sc=new Scanner(System.in);R=sc.nextInt();C=sc.nextInt();g=new int[R][C];for(int i=0;i<R;i++)for(int j=0;j<C;j++)g[i][j]=sc.nextInt();int cnt=0;for(int i=0;i<R;i++)for(int j=0;j<C;j++)if(g[i][j]==1){cnt++;dfs(i,j);}System.out.println(cnt);}}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint R,C,g[101][101];\nvoid dfs(int r,int c){if(r<0||r>=R||c<0||c>=C||!g[r][c])return;g[r][c]=0;dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);}\nint main(){cin>>R>>C;for(int i=0;i<R;i++)for(int j=0;j<C;j++)cin>>g[i][j];int cnt=0;for(int i=0;i<R;i++)for(int j=0;j<C;j++)if(g[i][j]){cnt++;dfs(i,j);}cout<<cnt<<endl;}",
        c:"#include<stdio.h>\nint R,C,g[101][101];\nvoid dfs(int r,int c){if(r<0||r>=R||c<0||c>=C||!g[r][c])return;g[r][c]=0;dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);}\nint main(){scanf(\"%d %d\",&R,&C);for(int i=0;i<R;i++)for(int j=0;j<C;j++)scanf(\"%d\",&g[i][j]);int cnt=0;for(int i=0;i<R;i++)for(int j=0;j<C;j++)if(g[i][j]){cnt++;dfs(i,j);}printf(\"%d\\n\",cnt);}"
      }
    },
    { id:"m5", title:"Longest Substring Without Repeating", topic:"Sliding Window", companies:["amazon","google","microsoft"],
      description:"Find length of longest substring without repeating characters.\n\nExamples:\n  Input: \"abcabcbb\" → Output: \"3\"",
      templates:{
        javascript:"const s=require('fs').readFileSync('/dev/stdin','utf8').trim();\nconst m={};let l=0,best=0;\nfor(let r=0;r<s.length;r++){\n  if(s[r] in m&&m[s[r]]>=l)l=m[s[r]]+1;\n  m[s[r]]=r;\n  best=Math.max(best,r-l+1);\n}\nconsole.log(best);",
        python:"s=input()\nm={};l=0;best=0\nfor r,c in enumerate(s):\n    if c in m and m[c]>=l:l=m[c]+1\n    m[c]=r\n    best=max(best,r-l+1)\nprint(best)",
        java:"import java.util.*;\npublic class Main{public static void main(String[]a){String s=new Scanner(System.in).next();Map<Character,Integer>m=new HashMap<>();int l=0,best=0;for(int r=0;r<s.length();r++){char c=s.charAt(r);if(m.containsKey(c)&&m.get(c)>=l)l=m.get(c)+1;m.put(c,r);best=Math.max(best,r-l+1);}System.out.println(best);}}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){string s;cin>>s;unordered_map<char,int>m;int l=0,best=0;for(int r=0;r<(int)s.size();r++){if(m.count(s[r])&&m[s[r]]>=l)l=m[s[r]]+1;m[s[r]]=r;best=max(best,r-l+1);}cout<<best<<endl;}",
        c:"#include<stdio.h>\n#include<string.h>\nint main(){char s[10001];scanf(\"%s\",s);int m[256];memset(m,-1,sizeof(m));int l=0,best=0,n=strlen(s);for(int r=0;r<n;r++){if(m[(unsigned char)s[r]]>=l)l=m[(unsigned char)s[r]]+1;m[(unsigned char)s[r]]=r;if(r-l+1>best)best=r-l+1;}printf(\"%d\\n\",best);}"
      }
    },
  ],
  hard: [
    { id:"h1", title:"Trapping Rain Water", topic:"Two Pointers", companies:["amazon","google","microsoft"],
      description:"Compute total water trapped between bars.\n\nExamples:\n  Input: \"0 1 0 2 1 0 1 3 2 1 2 1\" → Output: \"6\"",
      templates:{
        javascript:"const h=require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\nlet l=0,r=h.length-1,lm=0,rm=0,w=0;\nwhile(l<r){if(h[l]<h[r]){h[l]>=lm?lm=h[l]:w+=lm-h[l];l++;}else{h[r]>=rm?rm=h[r]:w+=rm-h[r];r--;}}\nconsole.log(w);",
        python:"h=list(map(int,input().split()))\nl,r=0,len(h)-1;lm=rm=w=0\nwhile l<r:\n    if h[l]<h[r]:\n        if h[l]>=lm:lm=h[l]\n        else:w+=lm-h[l]\n        l+=1\n    else:\n        if h[r]>=rm:rm=h[r]\n        else:w+=rm-h[r]\n        r-=1\nprint(w)",
        java:"import java.util.*;\npublic class Main{public static void main(String[]a){Scanner sc=new Scanner(System.in);List<Integer>h=new ArrayList<>();while(sc.hasNextInt())h.add(sc.nextInt());int l=0,r=h.size()-1,lm=0,rm=0,w=0;while(l<r){if(h.get(l)<h.get(r)){if(h.get(l)>=lm)lm=h.get(l);else w+=lm-h.get(l);l++;}else{if(h.get(r)>=rm)rm=h.get(r);else w+=rm-h.get(r);r--;}}System.out.println(w);}}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){vector<int>h;int x;while(cin>>x)h.push_back(x);int l=0,r=h.size()-1,lm=0,rm=0,w=0;while(l<r){if(h[l]<h[r]){if(h[l]>=lm)lm=h[l];else w+=lm-h[l];l++;}else{if(h[r]>=rm)rm=h[r];else w+=rm-h[r];r--;}}cout<<w<<endl;}",
        c:"#include<stdio.h>\nint main(){int h[100001],n=0;while(scanf(\"%d\",&h[n])==1)n++;int l=0,r=n-1,lm=0,rm=0,w=0;while(l<r){if(h[l]<h[r]){if(h[l]>=lm)lm=h[l];else w+=lm-h[l];l++;}else{if(h[r]>=rm)rm=h[r];else w+=rm-h[r];r--;}}printf(\"%d\\n\",w);}"
      }
    },
    { id:"h2", title:"Longest Increasing Subsequence", topic:"Dynamic Programming", companies:["amazon","google","microsoft"],
      description:"Find length of longest strictly increasing subsequence.\n\nExamples:\n  Input: \"10 9 2 5 3 7 101 18\" → Output: \"4\"",
      templates:{
        javascript:"const a=require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\nconst tails=[];\nfor(const n of a){let lo=0,hi=tails.length;while(lo<hi){const m=Math.floor((lo+hi)/2);tails[m]<n?lo=m+1:hi=m;}tails[lo]=n;}\nconsole.log(tails.length);",
        python:"import bisect\na=list(map(int,input().split()))\ntails=[]\nfor n in a:\n    i=bisect.bisect_left(tails,n)\n    if i==len(tails):tails.append(n)\n    else:tails[i]=n\nprint(len(tails))",
        java:"import java.util.*;\npublic class Main{public static void main(String[]a){Scanner sc=new Scanner(System.in);List<Integer>tails=new ArrayList<>();while(sc.hasNextInt()){int n=sc.nextInt();int lo=0,hi=tails.size();while(lo<hi){int m=(lo+hi)/2;if(tails.get(m)<n)lo=m+1;else hi=m;}if(lo==tails.size())tails.add(n);else tails.set(lo,n);}System.out.println(tails.size());}}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint main(){vector<int>tails;int x;while(cin>>x){int pos=lower_bound(tails.begin(),tails.end(),x)-tails.begin();if(pos==(int)tails.size())tails.push_back(x);else tails[pos]=x;}cout<<tails.size()<<endl;}",
        c:"#include<stdio.h>\nint tails[100001],sz=0;\nint lb(int n){int lo=0,hi=sz;while(lo<hi){int m=(lo+hi)/2;if(tails[m]<n)lo=m+1;else hi=m;}return lo;}\nint main(){int x;while(scanf(\"%d\",&x)==1){int i=lb(x);tails[i]=x;if(i==sz)sz++;}printf(\"%d\\n\",sz);}"
      }
    },
    { id:"h3", title:"N-Queens", topic:"Backtracking", companies:["amazon","google","microsoft"],
      description:"Count solutions to place N queens so none attack each other.\n\nExamples:\n  Input: \"4\" → Output: \"2\"\n  Input: \"8\" → Output: \"92\"",
      templates:{
        javascript:"const n=parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());\nlet cnt=0;\nconst cols=new Set(),d1=new Set(),d2=new Set();\nfunction bt(row){if(row===n){cnt++;return;}\nfor(let col=0;col<n;col++){if(cols.has(col)||d1.has(row-col)||d2.has(row+col))continue;cols.add(col);d1.add(row-col);d2.add(row+col);bt(row+1);cols.delete(col);d1.delete(row-col);d2.delete(row+col);}}\nbt(0);\nconsole.log(cnt);",
        python:"n=int(input())\ncnt=0\ncols=set();d1=set();d2=set()\ndef bt(row):\n    global cnt\n    if row==n:cnt+=1;return\n    for col in range(n):\n        if col in cols or row-col in d1 or row+col in d2:continue\n        cols.add(col);d1.add(row-col);d2.add(row+col)\n        bt(row+1)\n        cols.remove(col);d1.remove(row-col);d2.remove(row+col)\nbt(0)\nprint(cnt)",
        java:"import java.util.*;\npublic class Main{static int n,cnt;static Set<Integer>cols=new HashSet<>(),d1=new HashSet<>(),d2=new HashSet<>();\nstatic void bt(int row){if(row==n){cnt++;return;}for(int col=0;col<n;col++){if(cols.contains(col)||d1.contains(row-col)||d2.contains(row+col))continue;cols.add(col);d1.add(row-col);d2.add(row+col);bt(row+1);cols.remove(col);d1.remove(row-col);d2.remove(row+col);}}\npublic static void main(String[]a){n=new Scanner(System.in).nextInt();bt(0);System.out.println(cnt);}}",
        cpp:"#include<bits/stdc++.h>\nusing namespace std;\nint n,cnt;\nset<int>cols,d1,d2;\nvoid bt(int row){if(row==n){cnt++;return;}for(int col=0;col<n;col++){if(cols.count(col)||d1.count(row-col)||d2.count(row+col))continue;cols.insert(col);d1.insert(row-col);d2.insert(row+col);bt(row+1);cols.erase(col);d1.erase(row-col);d2.erase(row+col);}}\nint main(){cin>>n;bt(0);cout<<cnt<<endl;}",
        c:"#include<stdio.h>\nint n,cnt,cols[20],d1[40],d2[40];\nvoid bt(int row){if(row==n){cnt++;return;}for(int col=0;col<n;col++){if(cols[col]||d1[row-col+n]||d2[row+col])continue;cols[col]=d1[row-col+n]=d2[row+col]=1;bt(row+1);cols[col]=d1[row-col+n]=d2[row+col]=0;}}\nint main(){scanf(\"%d\",&n);bt(0);printf(\"%d\\n\",cnt);}"
      }
    },
  ],
};

// ─── APTITUDE TEST COMPONENT ──────────────────────────────────────────────
function AptitudeTest({ company, onBack }) {
  const co = company || "tcs";
  const info = COMPANIES[co] || COMPANIES.tcs;
  const questions = getAptQ(co);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showExp, setShowExp] = useState(false);

  const q = questions[current];
  const score = answers.filter((a, i) => a === questions[i].ans).length;

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExp(false);
  };

  const next = () => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    if (current + 1 >= questions.length) {
      setShowResult(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExp(false);
    }
  };

  if (showResult) {
    const pct = Math.round(score / questions.length * 100);
    return (
      <div className="fade" style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 40, border: `1px solid ${C.border}`, textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>{pct >= 70 ? "🎉" : pct >= 40 ? "👍" : "📚"}</div>
          <h2 style={{ fontWeight: 900, fontSize: 28, color: C.text, marginBottom: 8 }}>
            {score}/{questions.length} Correct
          </h2>
          <div style={{ fontSize: 48, fontWeight: 900, color: pct >= 70 ? C.green : pct >= 40 ? C.yellow : C.red, marginBottom: 16 }}>
            {pct}%
          </div>
          <p style={{ color: C.muted, marginBottom: 24 }}>
            {pct >= 70 ? "Excellent! You're well-prepared." : pct >= 40 ? "Good effort! Keep practicing." : "Keep studying — you'll get there!"}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => { setCurrent(0); setAnswers([]); setSelected(null); setShowResult(false); }}
              style={{ padding: "12px 28px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.blue},${C.blueLight})`, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "'Inter',sans-serif" }}>
              Retry Test
            </button>
            <button onClick={onBack}
              style={{ padding: "12px 28px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "'Inter',sans-serif" }}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade" style={{ maxWidth: 680, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.blue, cursor: "pointer", fontSize: 14, marginBottom: 20, fontWeight: 700 }}>← Back</button>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, border: `1px solid ${C.border}` }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>{info.logo}</span>
            <span style={{ fontWeight: 800, color: C.text }}>{info.name} Mock Test</span>
          </div>
          <span style={{ background: C.bluePale, color: C.blue, padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            {current + 1}/{questions.length}
          </span>
        </div>

        {/* Progress */}
        <div style={{ height: 6, background: C.bg3, borderRadius: 3, marginBottom: 24 }}>
          <div style={{ height: "100%", width: `${(current / questions.length) * 100}%`, background: `linear-gradient(90deg,${C.blue},${C.blueLight})`, borderRadius: 3, transition: "width .3s" }} />
        </div>

        {/* Topic */}
        <span style={{ background: `${info.color}15`, color: info.color, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700, marginBottom: 16, display: "inline-block" }}>{q.topic}</span>

        {/* Question */}
        <h3 style={{ fontWeight: 700, color: C.text, marginBottom: 20, fontSize: 17, lineHeight: 1.6 }}>{q.q}</h3>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {q.opts.map((opt, i) => {
            let bg = "#f8fafc", border = C.border, color = C.text;
            if (selected !== null) {
              if (i === q.ans) { bg = C.greenPale; border = C.green; color = C.green; }
              else if (i === selected && i !== q.ans) { bg = C.redPale; border = C.red; color = C.red; }
            } else if (selected === i) { bg = C.bluePale; border = C.blue; }
            return (
              <button key={i} onClick={() => handleAnswer(i)}
                style={{ padding: "13px 18px", borderRadius: 10, border: `2px solid ${border}`, background: bg, color, cursor: selected !== null ? "default" : "pointer", textAlign: "left", fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, transition: "all .2s" }}>
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {selected !== null && (
          <div>
            <button onClick={() => setShowExp(s => !s)}
              style={{ background: "none", border: "none", color: C.blue, cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 8, fontFamily: "'Inter',sans-serif" }}>
              {showExp ? "▲ Hide" : "▼ Show"} Explanation
            </button>
            {showExp && (
              <div style={{ background: C.bluePale, borderRadius: 10, padding: 14, fontSize: 13, color: C.text, marginBottom: 12 }}>
                💡 {q.exp}
              </div>
            )}
            <button onClick={next}
              style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.blue},${C.blueLight})`, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 15, fontFamily: "'Inter',sans-serif" }}>
              {current + 1 === questions.length ? "See Results" : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMPANIES TAB ────────────────────────────────────────────────────────
function CompaniesTab({ selectedCompany, onSelectCompany, user }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [testCompany, setTestCompany] = useState(selectedCompany || null);

  useEffect(() => { if (selectedCompany) setTestCompany(selectedCompany); }, [selectedCompany]);

  if (testCompany) {
    return <AptitudeTest company={testCompany} onBack={() => { setTestCompany(null); onSelectCompany(null); }} />;
  }

  const filtered = Object.entries(COMPANIES).filter(([key, co]) => {
    const matchFilter = filter === "all" || co.type === filter;
    const matchSearch = !search || co.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="fade">
      <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 4 }}>Company Mock Tests</h1>
      <p style={{ color: C.muted, marginBottom: 20, fontSize: 14 }}>30+ companies · Aptitude questions modeled after real patterns</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company..."
          style={{ flex: 1, minWidth: 200, background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 14, fontFamily: "'Inter',sans-serif", outline: "none" }} />
        {["all","service","product"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, background: filter === f ? C.blue : C.bg3, color: filter === f ? "#fff" : C.muted }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
        {filtered.map(([key, co]) => (
          <div key={key} onClick={() => setTestCompany(key)}
            style={{ background: "#fff", borderRadius: 14, padding: 20, border: `1px solid ${C.border}`, cursor: "pointer", transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = co.color; e.currentTarget.style.boxShadow = `0 8px 24px ${co.color}20`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = ""; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 32 }}>{co.logo}</span>
              <div>
                <div style={{ fontWeight: 800, color: C.text, fontSize: 15 }}>{co.name}</div>
                <span style={{ background: co.type === "product" ? `${C.purple}15` : `${C.blue}15`, color: co.type === "product" ? C.purple : C.blue, fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>
                  {co.type.toUpperCase()}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>{co.pattern}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {co.topics.slice(0, 3).map(t => (
                <span key={t} style={{ background: C.bg3, color: C.muted, fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: "8px 16px", borderRadius: 8, background: `${co.color}12`, color: co.color, fontSize: 13, fontWeight: 700, textAlign: "center" }}>
              Start Mock Test →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CODING TAB ───────────────────────────────────────────────────────────
function CodingTab({ user }) {
  const [difficulty, setDifficulty] = useState("easy");
  const [selected, setSelected] = useState(null);
  const [lang, setLang] = useState("python");
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [showApproach, setShowApproach] = useState(false);

  const problems = PROBLEMS[difficulty] || PROBLEMS.easy;

  const selectProblem = (p) => {
    setSelected(p);
    setCode(p.templates[lang] || "# Write solution here");
    setOutput(""); setStdin(""); setShowApproach(false);
  };

  const changeLang = (l) => {
    setLang(l);
    if (selected) setCode(selected.templates[l] || "// Write solution here");
  };

  const runCode = async () => {
    if (!code.trim()) return;
    setRunning(true); setOutput("⏳ Compiling...");
    try {
      const langMap = { javascript:{language:"javascript",version:"18.15.0"}, python:{language:"python",version:"3.10.0"}, java:{language:"java",version:"15.0.2"}, cpp:{language:"c++",version:"10.2.0"}, c:{language:"c",version:"10.2.0"} };
      const cfg = langMap[lang];
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ language:cfg.language, version:cfg.version, files:[{name:"main",content:code}], stdin, run_timeout:10000 })
      });
      const d = await res.json();
      const run = d.run || d.compile || {};
      setOutput((run.stdout||"") + (run.stderr ? "\n⚠️ stderr:\n"+run.stderr : "") || "(no output)");
    } catch(e) { setOutput("❌ Error: " + e.message); }
    setRunning(false);
  };

  if (selected) return (
    <div className="fade">
      <button onClick={() => setSelected(null)} style={{ background:"none",border:"none",color:C.blue,cursor:"pointer",fontSize:14,marginBottom:16,fontWeight:700 }}>← Back to Problems</button>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,height:"calc(100vh - 140px)" }}>
        <div style={{ background:"#fff",borderRadius:14,border:`1px solid ${C.border}`,padding:24,overflowY:"auto" }}>
          <div style={{ display:"flex",gap:8,marginBottom:12 }}>
            <span style={{ background:C.bluePale,color:C.blue,fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700 }}>{difficulty.charAt(0).toUpperCase()+difficulty.slice(1)}</span>
            <span style={{ background:C.bluePale,color:C.blue,fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700 }}>{selected.topic}</span>
          </div>
          <h2 style={{ fontWeight:800,color:C.text,marginBottom:16,fontSize:18 }}>{selected.title}</h2>
          <pre style={{ whiteSpace:"pre-wrap",fontFamily:"'Inter',sans-serif",fontSize:14,color:"#475569",lineHeight:1.8,marginBottom:20 }}>{selected.description}</pre>
          <button onClick={() => setShowApproach(s=>!s)}
            style={{ width:"100%",padding:"12px 16px",borderRadius:10,border:`1.5px solid ${C.border}`,background:showApproach?C.bluePale:"#f8fafc",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,color:C.blue,textAlign:"left",display:"flex",justifyContent:"space-between" }}>
            <span>🧠 Approach Hints</span><span>{showApproach?"▲":"▼"}</span>
          </button>
          {showApproach && (
            <div style={{ marginTop:12,background:"#0f172a",borderRadius:10,padding:16 }}>
              <div style={{ color:"#e2e8f0",fontSize:13,lineHeight:1.7 }}>
                Think about time complexity first. Can you do O(n) or O(n log n)?<br/>
                Consider: Hash Maps, Two Pointers, Sliding Window, Stack, DP.<br/>
                Start with brute force, then optimize.
              </div>
            </div>
          )}
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          <div style={{ display:"flex",gap:6,background:"#fff",borderRadius:10,padding:8,border:`1px solid ${C.border}` }}>
            {LANGUAGES.map(l => (
              <button key={l.id} onClick={() => changeLang(l.id)}
                style={{ flex:1,padding:"7px 4px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:700,background:lang===l.id?"#2563eb":"transparent",color:lang===l.id?"#fff":"#64748b" }}>
                {l.icon} {l.label}
              </button>
            ))}
          </div>
          <textarea value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}
            style={{ flex:1,minHeight:280,background:"#0f172a",color:"#e2e8f0",border:"1px solid #334155",borderRadius:12,padding:16,fontFamily:"'JetBrains Mono',monospace",fontSize:13,lineHeight:1.7,resize:"vertical",outline:"none" }} />
          <div>
            <div style={{ fontSize:12,fontWeight:600,color:C.muted,marginBottom:4 }}>Custom Input (stdin):</div>
            <textarea value={stdin} onChange={e=>setStdin(e.target.value)} placeholder="Enter input here..." rows={3}
              style={{ width:"100%",background:"#f8fafc",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:C.text,resize:"vertical",outline:"none" }} />
          </div>
          <button onClick={runCode} disabled={running}
            style={{ padding:"12px",borderRadius:10,border:"none",cursor:running?"not-allowed":"pointer",background:running?"#94a3b8":"linear-gradient(135deg,#15803d,#16a34a)",color:"#fff",fontFamily:"'Inter',sans-serif",fontSize:15,fontWeight:700 }}>
            {running ? "⏳ Running..." : "▶  Run Code"}
          </button>
          {output && (
            <div style={{ background:"#0f172a",borderRadius:10,padding:16,border:"1px solid #334155" }}>
              <div style={{ color:"#64748b",fontSize:11,fontWeight:600,marginBottom:6 }}>OUTPUT:</div>
              <pre style={{ color:output.includes("❌")?"#f87171":"#86efac",fontFamily:"'JetBrains Mono',monospace",fontSize:13,whiteSpace:"pre-wrap",margin:0,lineHeight:1.6 }}>{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fade">
      <h1 style={{ fontSize:26,fontWeight:800,color:C.text,marginBottom:6 }}>Coding Practice</h1>
      <p style={{ color:C.muted,marginBottom:20,fontSize:14 }}>Real compiler · Write any logic · See actual stdout output</p>
      <div style={{ display:"flex",gap:10,marginBottom:24 }}>
        {[["easy","🟢 Easy"],["medium","🟡 Medium"],["hard","🔴 Hard"]].map(([d,label]) => (
          <button key={d} onClick={() => setDifficulty(d)}
            style={{ padding:"8px 20px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,background:difficulty===d?C.blue:"#f1f5f9",color:difficulty===d?"#fff":C.muted }}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14 }}>
        {problems.map(p => (
          <div key={p.id} onClick={() => selectProblem(p)}
            style={{ background:"#fff",borderRadius:14,padding:20,border:`1px solid ${C.border}`,cursor:"pointer",transition:"all .2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(37,99,235,.12)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
            <div style={{ display:"flex",gap:8,marginBottom:10 }}>
              <span style={{ background:C.bluePale,color:C.blue,fontSize:11,padding:"2px 8px",borderRadius:20,fontWeight:700 }}>{p.topic}</span>
            </div>
            <div style={{ fontWeight:700,color:C.text,fontSize:15,marginBottom:6 }}>{p.title}</div>
            <div style={{ fontSize:12,color:"#94a3b8" }}>JS / Python / Java / C++ / C</div>
            <div style={{ marginTop:10,fontSize:12,color:C.blue,fontWeight:600 }}>Solve → Real Compiler Output</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RESUME TAB ───────────────────────────────────────────────────────────
function ResumeTab({ user }) {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [optimized, setOptimized] = useState("");
  const [tab, setTab] = useState("analyze");

  const callGroqLocal = async (prompt, maxTokens=2000) => {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${GROQ_KEY}`},
      body:JSON.stringify({ model:"llama-3.3-70b-versatile", max_tokens:maxTokens, messages:[{role:"user",content:prompt}] })
    });
    if(!res.ok) throw new Error("Groq error "+res.status);
    const d = await res.json();
    return d.choices?.[0]?.message?.content || "";
  };

  const analyze = async () => {
    if(!resumeText.trim()) return;
    setLoading(true); setResult(null); setOptimized("");
    try {
      const raw = await callGroqLocal(`Analyze resume vs job description. Respond ONLY with valid JSON no markdown:
{"ats_score":<0-100>,"match_percent":<0-100>,"strengths":["s1","s2","s3"],"weaknesses":["w1","w2","w3"],"missing_keywords":["k1","k2","k3","k4","k5"],"present_keywords":["k1","k2","k3"],"ats_issues":["i1","i2"],"verdict":"<1 sentence>","will_pass_screening":<true|false>}

RESUME: ${resumeText.slice(0,3000)}
JD: ${jdText.slice(0,2000)||"General software engineer role"}`, 1500);
      const data = JSON.parse(raw.replace(/```json|```/g,"").trim());
      setResult(data);
    } catch(e) { setResult({error:"Analysis failed: "+e.message}); }
    setLoading(false);
  };

  const optimize = async () => {
    if(!resumeText.trim()) return;
    setOptimizing(true); setOptimized(""); setTab("optimized");
    try {
      const text = await callGroqLocal(`Rewrite this resume to be ATS-optimized for: ${jdText.slice(0,500)||"software engineer roles"}. Use action verbs, quantify achievements, add keywords naturally.\n\nRESUME:\n${resumeText.slice(0,3000)}`, 2000);
      setOptimized(text);
    } catch(e) { setOptimized("Optimization failed: "+e.message); }
    setOptimizing(false);
  };

  return (
    <div className="fade" style={{ maxWidth:900 }}>
      <h1 style={{ fontSize:26,fontWeight:800,color:C.text,marginBottom:4 }}>AI Resume Analyzer</h1>
      <p style={{ color:C.muted,marginBottom:24,fontSize:14 }}>JobScan-style ATS analysis · Keyword gap · AI optimization</p>
      <div style={{ display:"flex",gap:8,marginBottom:24 }}>
        {[["analyze","📊 Analyze"],["optimized","✨ Optimized"],["tips","💡 Tips"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ padding:"8px 18px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,background:tab===id?C.blue:"#f1f5f9",color:tab===id?"#fff":C.muted }}>
            {label}
          </button>
        ))}
      </div>

      {tab==="analyze" && (
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <div>
              <div style={{ fontSize:13,fontWeight:700,color:C.text,marginBottom:6 }}>Your Resume *</div>
              <textarea value={resumeText} onChange={e=>setResumeText(e.target.value)} placeholder="Paste your resume text here..."
                style={{ width:"100%",minHeight:260,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"12px 14px",fontFamily:"'Inter',sans-serif",fontSize:13,color:C.text,resize:"vertical",outline:"none" }} />
            </div>
            <div>
              <div style={{ fontSize:13,fontWeight:700,color:C.text,marginBottom:6 }}>Job Description (optional)</div>
              <textarea value={jdText} onChange={e=>setJdText(e.target.value)} placeholder="Paste job description for accurate matching..."
                style={{ width:"100%",minHeight:120,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"12px 14px",fontFamily:"'Inter',sans-serif",fontSize:13,color:C.text,resize:"vertical",outline:"none" }} />
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={analyze} disabled={!resumeText.trim()||loading}
                style={{ flex:1,padding:"13px",borderRadius:10,border:"none",cursor:!resumeText.trim()||loading?"not-allowed":"pointer",background:!resumeText.trim()?"#94a3b8":"linear-gradient(135deg,#1d4ed8,#2563eb)",color:"#fff",fontFamily:"'Inter',sans-serif",fontSize:15,fontWeight:700 }}>
                {loading ? "⏳ Analyzing..." : "🔍 Analyze Resume"}
              </button>
              {result && !result.error && (
                <button onClick={optimize} disabled={optimizing}
                  style={{ flex:1,padding:"13px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#15803d,#16a34a)",color:"#fff",fontFamily:"'Inter',sans-serif",fontSize:15,fontWeight:700 }}>
                  {optimizing ? "⏳ Optimizing..." : "✨ Optimize"}
                </button>
              )}
            </div>
          </div>
          <div>
            {!result && !loading && (
              <div style={{ background:"#fff",borderRadius:14,border:`1px solid ${C.border}`,padding:40,textAlign:"center",color:C.muted }}>
                <div style={{ fontSize:48,marginBottom:12 }}>📄</div>
                <p style={{ fontWeight:600 }}>Paste resume and click Analyze</p>
              </div>
            )}
            {loading && (
              <div style={{ background:"#fff",borderRadius:14,border:`1px solid ${C.border}`,padding:40,textAlign:"center" }}>
                <div style={{ width:40,height:40,border:`3px solid ${C.blue}20`,borderTopColor:C.blue,borderRadius:"50%",margin:"0 auto 16px",animation:"spin 1s linear infinite" }} />
                <p style={{ color:C.muted }}>Analyzing with AI...</p>
              </div>
            )}
            {result && result.error && <div style={{ background:"#fef2f2",border:"1px solid #dc2626",borderRadius:14,padding:20,color:"#dc2626" }}>{result.error}</div>}
            {result && !result.error && (
              <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                  {[{label:"ATS Score",value:result.ats_score,unit:"/100"},{label:"JD Match",value:result.match_percent,unit:"%"}].map(s => (
                    <div key={s.label} style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:16,textAlign:"center" }}>
                      <div style={{ fontSize:32,fontWeight:900,color:s.value>=70?C.green:s.value>=40?C.yellow:C.red }}>{s.value}{s.unit}</div>
                      <div style={{ fontSize:12,color:C.muted,fontWeight:600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:result.will_pass_screening?"#f0fdf4":"#fef2f2",borderRadius:12,padding:14 }}>
                  <div style={{ fontWeight:700,color:result.will_pass_screening?C.green:C.red,fontSize:13,marginBottom:4 }}>
                    {result.will_pass_screening ? "✅ Will Pass Screening" : "❌ May Not Pass Screening"}
                  </div>
                  <div style={{ fontSize:13,color:C.text }}>{result.verdict}</div>
                </div>
                <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:16 }}>
                  <div style={{ fontWeight:700,color:C.text,marginBottom:10,fontSize:14 }}>🔑 Missing Keywords</div>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                    {result.missing_keywords?.map(k => (
                      <span key={k} style={{ background:"#fef2f2",color:C.red,fontSize:11,padding:"3px 8px",borderRadius:20,fontWeight:600 }}>{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab==="optimized" && (
        <div>
          {!optimized && !optimizing && (
            <div style={{ textAlign:"center",padding:60,color:C.muted }}>
              <div style={{ fontSize:48,marginBottom:12 }}>✨</div>
              <p style={{ fontWeight:600,marginBottom:16 }}>No optimized resume yet</p>
              <button onClick={() => setTab("analyze")} style={{ padding:"10px 24px",borderRadius:10,border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700 }}>Analyze First →</button>
            </div>
          )}
          {optimizing && <div style={{ textAlign:"center",padding:60 }}><p style={{ color:C.muted }}>AI is rewriting your resume...</p></div>}
          {optimized && (
            <div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
                <div style={{ fontWeight:700,color:C.green }}>✅ Optimized Resume Ready</div>
                <button onClick={() => { const b=new Blob([optimized],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="optimized_resume.txt";a.click(); }}
                  style={{ padding:"8px 20px",borderRadius:10,border:"none",background:C.green,color:"#fff",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13 }}>
                  ⬇️ Download
                </button>
              </div>
              <div style={{ background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:24 }}>
                <pre style={{ whiteSpace:"pre-wrap",fontFamily:"'Inter',sans-serif",fontSize:14,color:C.text,lineHeight:1.8 }}>{optimized}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {tab==="tips" && (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16 }}>
          {[
            { icon:"🎯",title:"ATS Optimization",color:C.blue,tips:["Use exact keywords from JD","Avoid tables and images","Standard headings: Experience, Education, Skills","Save as clean PDF","No headers/footers"] },
            { icon:"📊",title:"Quantify Everything",color:C.green,tips:["'Improved by 40%' > 'Improved'","Mention team sizes","Include project scale","Use action verbs: Built, Led, Reduced","Add timeframes"] },
            { icon:"📝",title:"Format Essentials",color:C.yellow,tips:["1 page for freshers","Consistent font 10-12pt","Reverse chronological order","Clear contact info at top","White background, black text"] },
          ].map(t => (
            <div key={t.title} style={{ background:"#fff",borderRadius:14,border:`1px solid ${C.border}`,padding:24 }}>
              <div style={{ fontSize:28,marginBottom:10 }}>{t.icon}</div>
              <h3 style={{ fontWeight:700,color:C.text,marginBottom:14,fontSize:15 }}>{t.title}</h3>
              {t.tips.map(tip => (
                <div key={tip} style={{ display:"flex",gap:8,marginBottom:10,alignItems:"flex-start" }}>
                  <span style={{ color:t.color,flexShrink:0,fontWeight:700 }}>✓</span>
                  <span style={{ fontSize:13,color:"#475569",lineHeight:1.5 }}>{tip}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── JOBS TAB ─────────────────────────────────────────────────────────────
function JobsTab({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("freshers");
  const [location, setLocation] = useState("india");
  const [searched, setSearched] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);

  const getFallback = (role) => [
    { id:"f1",title:`${role} - Fresher 2025`,company:{display_name:"TCS"},location:{display_name:"Bangalore, India"},salary_min:400000,salary_max:700000,redirect_url:"https://nextstep.tcs.com",description:"TCS is hiring freshers for 2025 batch. Apply through NextStep portal.",created:new Date().toISOString() },
    { id:"f2",title:"Associate Engineer - Fresher",company:{display_name:"Infosys"},location:{display_name:"Hyderabad, India"},salary_min:350000,salary_max:650000,redirect_url:"https://career.infosys.com",description:"Infosys InfyTQ hiring for 2025 graduates.",created:new Date().toISOString() },
    { id:"f3",title:"Software Engineer - Fresh Graduate",company:{display_name:"Wipro"},location:{display_name:"Pune, India"},salary_min:350000,salary_max:600000,redirect_url:"https://careers.wipro.com",description:"Wipro NLTH open for 2025 batch.",created:new Date().toISOString() },
    { id:"f4",title:"SDE-1",company:{display_name:"Amazon"},location:{display_name:"Bangalore, India"},salary_min:1800000,salary_max:2800000,redirect_url:"https://amazon.jobs",description:"Amazon SDE-1 openings. Strong DSA required.",created:new Date().toISOString() },
    { id:"f5",title:"SDE - New Grad",company:{display_name:"Microsoft"},location:{display_name:"Hyderabad, India"},salary_min:2000000,salary_max:3500000,redirect_url:"https://careers.microsoft.com",description:"Microsoft hiring new grad SDEs.",created:new Date().toISOString() },
  ];

  const fetchJobs = async () => {
    setLoading(true); setSearched(true); setJobs([]);
    try {
      const res = await fetch(`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&what=${encodeURIComponent(search)}&where=${encodeURIComponent(location)}&max_days_old=10&content-type=application/json`);
      const data = await res.json();
      setJobs(data.results?.length ? data.results : getFallback(search));
    } catch(e) { setJobs(getFallback(search)); }
    setLoading(false);
  };

  const quickSearches = ["Freshers","Frontend Developer","Backend Developer","Data Analyst","React Developer","Python Developer","Java Developer","DevOps","Machine Learning"];
  const toggleSave = (id) => setSavedJobs(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);

  return (
    <div className="fade">
      <h1 style={{ fontSize:26,fontWeight:800,color:C.text,marginBottom:4 }}>Job Board</h1>
      <p style={{ color:C.muted,marginBottom:24,fontSize:14 }}>Latest openings — Last 10 days only · Real-time from Adzuna</p>
      <div style={{ background:"#fff",borderRadius:14,padding:20,border:`1px solid ${C.border}`,marginBottom:20 }}>
        <div style={{ display:"flex",gap:12,marginBottom:14,flexWrap:"wrap" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()} placeholder="Job role..."
            style={{ flex:2,minWidth:200,background:"#f8fafc",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:14,fontFamily:"'Inter',sans-serif",outline:"none" }} />
          <input value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()} placeholder="Location..."
            style={{ flex:1,minWidth:140,background:"#f8fafc",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:14,fontFamily:"'Inter',sans-serif",outline:"none" }} />
          <button onClick={fetchJobs} disabled={loading}
            style={{ padding:"11px 24px",borderRadius:10,border:"none",cursor:"pointer",background:`linear-gradient(135deg,#1d4ed8,${C.blue})`,color:"#fff",fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700 }}>
            {loading ? "⏳" : "🔍 Search"}
          </button>
        </div>
        <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
          {quickSearches.map(r => (
            <button key={r} onClick={() => setSearch(r.toLowerCase())}
              style={{ background:search.toLowerCase()===r.toLowerCase()?`${C.blue}12`:"#f1f5f9",border:`1px solid ${search.toLowerCase()===r.toLowerCase()?C.blue:C.border}`,color:search.toLowerCase()===r.toLowerCase()?C.blue:C.muted,padding:"4px 12px",borderRadius:20,cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif",fontWeight:600 }}>
              {r}
            </button>
          ))}
        </div>
      </div>
      {loading && <div style={{ color:C.muted,padding:24 }}>Fetching jobs...</div>}
      <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
        {jobs.map(job => {
          const saved = savedJobs.includes(job.id);
          const daysAgo = job.created ? Math.floor((Date.now()-new Date(job.created))/86400000) : null;
          return (
            <div key={job.id} style={{ background:"#fff",borderRadius:14,padding:24,border:`1px solid ${C.border}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16 }}>
                <div style={{ flex:1 }}>
                  <h3 style={{ fontWeight:700,color:C.text,margin:"0 0 8px",fontSize:16 }}>{job.title}</h3>
                  <div style={{ display:"flex",gap:16,color:C.muted,fontSize:13,marginBottom:10 }}>
                    <span>🏢 {job.company?.display_name}</span>
                    <span>📍 {job.location?.display_name}</span>
                    {daysAgo!==null && <span>🕐 {daysAgo===0?"Today":daysAgo===1?"Yesterday":`${daysAgo}d ago`}</span>}
                  </div>
                  {job.salary_min && (
                    <span style={{ background:"#f0fdf4",color:C.green,fontSize:12,padding:"3px 10px",borderRadius:20,fontWeight:700 }}>
                      ₹{Math.round(job.salary_min/100000)}L – ₹{Math.round(job.salary_max/100000)}L / year
                    </span>
                  )}
                  <p style={{ color:"#475569",fontSize:13,lineHeight:1.6,margin:"10px 0 0" }}>
                    {job.description?.replace(/<[^>]+>/g,"").slice(0,200)}...
                  </p>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:8,flexShrink:0 }}>
                  <a href={job.redirect_url} target="_blank" rel="noreferrer">
                    <button style={{ padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",background:`linear-gradient(135deg,#1d4ed8,${C.blue})`,color:"#fff",fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:700,width:"100%" }}>Apply →</button>
                  </a>
                  <button onClick={() => toggleSave(job.id)}
                    style={{ padding:"7px 14px",borderRadius:10,border:`1.5px solid ${saved?"#d97706":C.border}`,background:saved?"#fffbeb":"transparent",cursor:"pointer",fontSize:12,fontWeight:600,color:saved?"#d97706":C.muted,fontFamily:"'Inter',sans-serif" }}>
                    {saved ? "★ Saved" : "☆ Save"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {!searched && (
        <div style={{ textAlign:"center",padding:60,color:C.muted }}>
          <div style={{ fontSize:48,marginBottom:12 }}>💼</div>
          <p style={{ fontWeight:600,fontSize:16,marginBottom:24 }}>Find your dream job</p>
          <button onClick={fetchJobs} style={{ padding:"12px 32px",borderRadius:10,border:"none",background:`linear-gradient(135deg,#1d4ed8,${C.blue})`,color:"#fff",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:15 }}>
            🔍 Search Fresher Jobs in India
          </button>
        </div>
      )}
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────
function BottomNav({ tab, setTab }) {
  const items = [
    { id:"home", icon:"🏠", label:"Home" },
    { id:"companies", icon:"🏢", label:"Companies" },
    { id:"coding", icon:"💻", label:"Code" },
    { id:"resume", icon:"📄", label:"Resume" },
    { id:"jobs", icon:"💼", label:"Jobs" },
  ];
  return (
    <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:`1px solid ${C.border}`,display:"flex",zIndex:1000,paddingBottom:"env(safe-area-inset-bottom)" }}>
      {items.map(n => (
        <button key={n.id} onClick={() => setTab(n.id)}
          style={{ flex:1,padding:"10px 4px 8px",border:"none",cursor:"pointer",background:"transparent",display:"flex",flexDirection:"column",alignItems:"center",gap:3,fontFamily:"'Inter',sans-serif" }}>
          <span style={{ fontSize:20 }}>{n.icon}</span>
          <span style={{ fontSize:10,fontWeight:700,color:tab===n.id?C.blue:"#94a3b8" }}>{n.label}</span>
          {tab===n.id && <div style={{ width:20,height:3,background:C.blue,borderRadius:2 }} />}
        </button>
      ))}
    </div>
  );
}

// ─── HOME TAB ─────────────────────────────────────────────────────────────
function HomeTab({ user, onNavigate, onSelectCompany }) {
  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "there";
  const topCompanies = [
    { key:"tcs",name:"TCS",logo:"🔵",color:"#1d4ed8" },
    { key:"infosys",name:"Infosys",logo:"🟣",color:"#7c3aed" },
    { key:"wipro",name:"Wipro",logo:"🟢",color:"#16a34a" },
    { key:"amazon",name:"Amazon",logo:"📦",color:"#d97706" },
    { key:"microsoft",name:"Microsoft",logo:"🪟",color:"#0284c7" },
    { key:"google",name:"Google",logo:"🔍",color:"#dc2626" },
    { key:"flipkart",name:"Flipkart",logo:"🛒",color:"#f59e0b" },
    { key:"cognizant",name:"Cognizant",logo:"🟠",color:"#ea580c" },
  ];

  return (
    <div className="fade">
      <div style={{ background:"linear-gradient(135deg,#0f172a,#1e293b)",borderRadius:20,padding:"28px 32px",marginBottom:24,border:"1px solid #334155" }}>
        <h1 style={{ fontSize:24,fontWeight:900,color:"#fff",margin:"0 0 6px" }}>Hey {name}! 👋</h1>
        <p style={{ color:"#64748b",fontSize:14,margin:"0 0 20px" }}>Ready to crack your dream company? Pick a company and start practicing.</p>
        <div style={{ display:"flex",gap:10 }}>
          <button onClick={() => onNavigate("companies")}
            style={{ padding:"10px 22px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#2563eb,#3b82f6)",color:"#fff",fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700 }}>
            Take Mock Test
          </button>
          <button onClick={() => onNavigate("coding")}
            style={{ padding:"10px 22px",borderRadius:10,border:"1px solid #334155",cursor:"pointer",background:"transparent",color:"#94a3b8",fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:600 }}>
            Practice Coding
          </button>
        </div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:28 }}>
        {[{l:"Companies",v:"30+",icon:"🏢",c:C.blue},{l:"Questions",v:"500+",icon:"❓",c:C.purple},{l:"Coding Problems",v:"18",icon:"💻",c:C.green},{l:"Languages",v:"5",icon:"⚡",c:C.yellow}].map(s => (
          <div key={s.l} style={{ background:"#fff",borderRadius:14,padding:16,border:`1px solid ${C.border}`,textAlign:"center" }}>
            <div style={{ fontSize:22,marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontSize:20,fontWeight:900,color:s.c }}>{s.v}</div>
            <div style={{ fontSize:11,color:C.muted,fontWeight:600 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize:16,fontWeight:700,color:C.text,marginBottom:14 }}>🏢 Quick Practice</h2>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:28 }}>
        {topCompanies.map(co => (
          <div key={co.key} onClick={() => onSelectCompany(co.key)}
            style={{ background:"#fff",borderRadius:12,padding:16,border:`1px solid ${C.border}`,cursor:"pointer",textAlign:"center",transition:"all .2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.borderColor=co.color; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.borderColor=C.border; }}>
            <div style={{ fontSize:28,marginBottom:6 }}>{co.logo}</div>
            <div style={{ fontWeight:700,color:C.text,fontSize:13 }}>{co.name}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize:16,fontWeight:700,color:C.text,marginBottom:14 }}>Quick Actions</h2>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12 }}>
        {[
          { icon:"🏢",title:"All Companies",desc:"30+ company mock tests",action:()=>onNavigate("companies"),color:C.blue },
          { icon:"💻",title:"Coding",desc:"Problems with real compiler",action:()=>onNavigate("coding"),color:C.green },
          { icon:"📄",title:"Resume AI",desc:"ATS analysis & optimization",action:()=>onNavigate("resume"),color:C.purple },
          { icon:"💼",title:"Jobs",desc:"Latest 10-day openings",action:()=>onNavigate("jobs"),color:C.yellow },
        ].map(a => (
          <div key={a.title} onClick={a.action}
            style={{ background:"#fff",borderRadius:14,padding:20,border:`1px solid ${C.border}`,cursor:"pointer",transition:"all .2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.08)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
            <div style={{ fontSize:28,marginBottom:10 }}>{a.icon}</div>
            <div style={{ fontWeight:700,color:C.text,fontSize:14 }}>{a.title}</div>
            <div style={{ fontSize:12,color:C.muted,marginTop:4 }}>{a.desc}</div>
            <div style={{ fontSize:12,color:a.color,marginTop:10,fontWeight:600 }}>Open →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────
function MainApp({ user, onLogout }) {
  const [tab, setTab] = useState("home");
  const [selectedCompany, setSelectedCompany] = useState(null);

  return (
    <div style={{ display:"flex",flexDirection:"column",minHeight:"100vh",background:C.bg2,fontFamily:"'Inter',sans-serif" }}>
      <div style={{ background:"#fff",borderBottom:`1px solid ${C.border}`,padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100 }}>
        <div style={{ fontWeight:900,fontSize:18,color:C.text }}>🎯 TakePlace</div>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <span style={{ fontSize:13,color:C.muted }} className="hide-mobile">{user?.email}</span>
          <button onClick={onLogout} style={{ padding:"6px 14px",borderRadius:8,border:`1.5px solid ${C.border}`,background:"transparent",cursor:"pointer",fontSize:13,fontWeight:600,color:C.muted,fontFamily:"'Inter',sans-serif" }}>Sign Out</button>
        </div>
      </div>
      <div style={{ flex:1,padding:"24px 20px",paddingBottom:80,maxWidth:1200,margin:"0 auto",width:"100%" }}>
        {tab==="home" && <HomeTab user={user} onNavigate={setTab} onSelectCompany={(c)=>{ setSelectedCompany(c); setTab("companies"); }} />}
        {tab==="companies" && <CompaniesTab selectedCompany={selectedCompany} onSelectCompany={setSelectedCompany} user={user} />}
        {tab==="coding" && <CodingTab user={user} />}
        {tab==="resume" && <ResumeTab user={user} />}
        {tab==="jobs" && <JobsTab user={user} />}
      </div>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────
function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handle = async () => {
    if (!email || !password) { setError("Fill in both fields"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      if (isSignUp) {
        const { error: e } = await supabase.auth.signUp({ email, password });
        if (e) throw e;
        setSuccess("Account created! Check email to verify, then sign in.");
      } else {
        const { error: e } = await supabase.auth.signInWithPassword({ email, password });
        if (e) throw e;
      }
    } catch (e) { setError(e.message || "Authentication failed"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0f172a,#1e293b)",fontFamily:"'Inter',sans-serif",padding:20 }}>
      <div style={{ background:"#fff",borderRadius:20,padding:"40px 36px",width:"100%",maxWidth:420,boxShadow:"0 20px 60px rgba(0,0,0,.3)" }}>
        <div style={{ textAlign:"center",marginBottom:32 }}>
          <div style={{ fontSize:40,marginBottom:12 }}>🎯</div>
          <h1 style={{ fontSize:24,fontWeight:900,color:C.text,margin:"0 0 6px" }}>TakePlace</h1>
          <p style={{ color:C.muted,fontSize:14 }}>Crack your dream company</p>
        </div>
        {error && <div style={{ background:C.redPale,border:`1px solid ${C.red}`,borderRadius:10,padding:"12px 16px",fontSize:13,color:C.red,marginBottom:16 }}>{error}</div>}
        {success && <div style={{ background:C.greenPale,border:`1px solid ${C.green}`,borderRadius:10,padding:"12px 16px",fontSize:13,color:C.green,marginBottom:16 }}>{success}</div>}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:13,fontWeight:600,color:C.text,display:"block",marginBottom:6 }}>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com"
            style={{ width:"100%",background:C.bg2,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:14,fontFamily:"'Inter',sans-serif",outline:"none",boxSizing:"border-box" }} />
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={{ fontSize:13,fontWeight:600,color:C.text,display:"block",marginBottom:6 }}>Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••"
            onKeyDown={e=>e.key==="Enter"&&handle()}
            style={{ width:"100%",background:C.bg2,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:14,fontFamily:"'Inter',sans-serif",outline:"none",boxSizing:"border-box" }} />
        </div>
        <button onClick={handle} disabled={loading}
          style={{ width:"100%",padding:"13px",borderRadius:10,border:"none",cursor:loading?"not-allowed":"pointer",background:`linear-gradient(135deg,${C.blue},${C.blueLight})`,color:"#fff",fontFamily:"'Inter',sans-serif",fontSize:15,fontWeight:700,opacity:loading?0.7:1 }}>
          {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
        </button>
        <p style={{ textAlign:"center",marginTop:20,fontSize:14,color:C.muted }}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(""); }}
            style={{ color:C.blue,fontWeight:700,cursor:"pointer" }}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ─── DEFAULT EXPORT (ROOT APP) ────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inject global styles
    const style = document.createElement("style");
    style.textContent = G;
    document.head.appendChild(style);

    // Check auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0f172a" }}>
        <div style={{ textAlign:"center",color:"#fff" }}>
          <div style={{ fontSize:48,marginBottom:16 }}>🎯</div>
          <div style={{ width:40,height:40,border:"3px solid #2563eb30",borderTopColor:"#2563eb",borderRadius:"50%",margin:"0 auto",animation:"spin 1s linear infinite" }} />
        </div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  return <MainApp user={user} onLogout={() => supabase.auth.signOut()} />;
}
