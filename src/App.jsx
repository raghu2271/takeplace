import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID  = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";
const supabase   = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  bg:"#ffffff", card:"#f8f9fc", card2:"#f1f4f9", border:"#e2e8f0",
  blue:"#2563eb", blueLight:"#3b82f6", blueDark:"#1d4ed8",
  green:"#16a34a", greenDark:"#14532d",
  text:"#0f172a", muted:"#64748b", soft:"#475569",
  danger:"#dc2626", warn:"#d97706", purple:"#7c3aed", purpleDark:"#5b21b6",
  orange:"#ea580c", orangeLight:"#f97316",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{background:#ffffff;font-family:'Inter',sans-serif;color:#0f172a;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}
  ::selection{background:#2563eb30;color:#0f172a;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scaleIn{from{transform:scale(0.95);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade{animation:fadeUp .4s ease forwards;}
  .fadeIn{animation:fadeIn .3s ease forwards;}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  .float{animation:float 3s ease-in-out infinite;}
  .hover-lift{transition:all .2s;cursor:pointer;}
  .hover-lift:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.10);}
  input:focus,textarea:focus,select:focus{border-color:#2563eb!important;outline:none;box-shadow:0 0 0 3px #2563eb18;}
  button:active{transform:scale(.98);}
`;

const inp = {
  width:"100%", background:"#ffffff", border:`1.5px solid ${C.border}`,
  borderRadius:10, padding:"11px 14px", color:C.text, fontSize:14,
  fontFamily:"'Inter',sans-serif", outline:"none", transition:"all .2s",
};

const Btn = ({ children, onClick, variant="primary", style={}, disabled=false, loading=false }) => {
  const v = {
    primary:{ background:`linear-gradient(135deg,${C.blue},${C.blueLight})`, color:"#fff", fontWeight:700, boxShadow:"0 2px 8px "+C.blue+"40" },
    ghost:{ background:"transparent", color:C.soft, border:`1.5px solid ${C.border}` },
    green:{ background:`linear-gradient(135deg,${C.greenDark},${C.green})`, color:"#fff", fontWeight:700 },
    purple:{ background:`linear-gradient(135deg,${C.purpleDark},${C.purple})`, color:"#fff", fontWeight:700 },
    danger:{ background:`linear-gradient(135deg,#991b1b,${C.danger})`, color:"#fff", fontWeight:700 },
    glass:{ background:"rgba(255,255,255,.8)", color:C.text, border:`1.5px solid ${C.border}`, backdropFilter:"blur(12px)" },
    cta:{ background:`linear-gradient(135deg,${C.blue},${C.blueDark})`, color:"#fff", fontWeight:800, boxShadow:"0 4px 20px "+C.blue+"50", fontSize:15 },
  };
  return (
    <button onClick={disabled||loading ? undefined : onClick} disabled={disabled||loading}
      style={{ padding:"11px 22px", borderRadius:10, border:"none", cursor:disabled||loading?"not-allowed":"pointer",
        fontFamily:"'Inter',sans-serif", fontSize:14, transition:"all .2s",
        opacity:disabled?0.5:1, display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8,
        ...v[variant], ...style }}>
      {loading ? <><SpinIcon size={14} color={variant==="ghost"?C.blue:"#fff"}/> Loading...</> : children}
    </button>
  );
};

const SpinIcon = ({ size=18, color=C.blue }) => (
  <span className="spin" style={{ width:size, height:size, border:`2px solid ${color}30`,
    borderTopColor:color, borderRadius:"50%", display:"inline-block", flexShrink:0 }} />
);

const Tag = ({ children, color=C.blue, bg }) => (
  <span style={{ background:bg||`${color}15`, color, fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:700, whiteSpace:"nowrap", border:`1px solid ${color}30` }}>
    {children}
  </span>
);

const Card = ({ children, style={} }) => (
  <div style={{ background:C.card, border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, ...style }}>
    {children}
  </div>
);

// ─── AI API ─────────────────────────────────────────────────────────────────
async function callAI(prompt, maxTokens=1500, mode="json", retries=2) {
  for (let attempt=0; attempt<=retries; attempt++) {
    try {
      const res = await fetch("/api/ai", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ prompt, maxTokens, mode }),
      });
      if (!res.ok) {
        const errBody = await res.text().catch(()=>"");
        throw new Error("AI error "+res.status+": "+errBody.slice(0,120));
      }
      const data = await res.json();
      return data.text || "";
    } catch(e) {
      if (attempt<retries) { await new Promise(r=>setTimeout(r,1200*(attempt+1))); continue; }
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

// ─── PDF TEXT EXTRACTION ───────────────────────────────────────────────────
async function extractTextFromPDF(file) {
  if (!window.pdfjsLib) {
    await new Promise((res,rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const ab = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({data:ab}).promise;
  let text = "";
  for (let i=1;i<=Math.min(pdf.numPages,4);i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(x=>x.str).join(" ")+"\n";
  }
  return text.trim();
}

async function extractTextFromDOCX(file) {
  if (!window.mammoth) {
    await new Promise((res,rej) => {
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
      s.onload=res; s.onerror=rej;
      document.head.appendChild(s);
    });
  }
  const ab = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({arrayBuffer:ab});
  return result.value.trim();
}

// ══════════════════════════════════════════════════════════════════════════
// ─── RESUME SECTION EXTRACTOR (the real fix — parse before AI) ───────────
// ══════════════════════════════════════════════════════════════════════════
function parseResumeStructure(rawText) {
  if (!rawText) return { name:"", contact:"", education:[], experience:[], projects:[], skills:[], certifications:[], raw:rawText };

  const lines = rawText.split(/\n/).map(l => l.trim()).filter(Boolean);

  // Detect section boundaries
  const SECTION_RE = /^(PROFESSIONAL SUMMARY|TECHNICAL SKILLS|EXPERIENCE|PROJECTS|EDUCATION|CERTIFICATIONS|CERTIFICATIONS & ACHIEVEMENTS|ACHIEVEMENTS|SKILLS|SUMMARY|OBJECTIVE|WORK EXPERIENCE|INTERNSHIP)\s*$/i;
  const sections = {};
  let currentSection = "header";
  sections["header"] = [];
  for (const line of lines) {
    if (SECTION_RE.test(line)) {
      currentSection = line.toUpperCase().replace(/\s+/g," ").replace("CERTIFICATIONS & ACHIEVEMENTS","CERTIFICATIONS").replace("WORK EXPERIENCE","EXPERIENCE");
      sections[currentSection] = [];
    } else {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(line);
    }
  }

  // ── HEADER: name + contact ──
  const headerLines = sections["header"] || [];
  const name = headerLines[0] || "";
  const contact = headerLines.slice(1).join(" | ");

  // ── EDUCATION ──
  const eduLines = sections["EDUCATION"] || [];
  const education = [];
  let i = 0;
  while (i < eduLines.length) {
    const line = eduLines[i];
    // Lines with degree keywords
    if (/B\.Tech|B\.E|M\.Tech|MBA|BCA|MCA|Bachelor|Master|B\.Sc|Intermediate|10th|12th|SSC|HSC/i.test(line)) {
      // Extract CGPA/percentage
      const cgpaMatch = line.match(/CGPA[\s:]+[\d.]+\s*\/\s*10/i) || line.match(/[\d.]+\s*\/\s*10/) || line.match(/[\d.]+%/);
      // Extract dates
      const dateMatch = line.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}|\d{4}/g);
      const lastDate = dateMatch ? dateMatch[dateMatch.length - 1] : "";
      // School from next line or same line
      let school = "", location = "", degree = line, dates = lastDate;
      // Check if school/location is on this line or next
      if (eduLines[i+1] && /University|College|Institute|School/i.test(eduLines[i+1])) {
        school = eduLines[i+1];
        i += 2;
      } else {
        // Try to split "Degree | School, City  dates" pattern
        const pipeSplit = line.split("|");
        if (pipeSplit.length >= 2) {
          degree = pipeSplit[0].trim();
          const rest = pipeSplit.slice(1).join("|");
          const dateInRest = rest.match(/(May \d{4}|Jun \d{4}|\d{4})/);
          if (dateInRest) {
            dates = rest.slice(dateInRest.index).trim();
            school = rest.slice(0, dateInRest.index).trim();
          } else {
            school = rest.trim();
          }
        }
        i++;
      }
      // Clean up degree — remove trailing dates
      degree = degree.replace(/\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}.*$/, "").replace(/\s+\d{4}.*$/, "").trim();
      education.push({ degree, school, location, dates });
    } else {
      i++;
    }
  }

  // ── EXPERIENCE ──
  const expLines = sections["EXPERIENCE"] || [];
  const experience = [];
  let currentExp = null;
  for (const line of expLines) {
    // Line with em dash or — usually means "Title — Company, City  dates"
    const titleLine = line.match(/^(.+?)\s+[—–-]{1,2}\s+(.+?),\s*(.+?)\s+((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\s*[–-]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\s*[–-]\s*Present|\d{4}\s*[–-]\s*\d{4})/i);
    if (titleLine) {
      if (currentExp) experience.push(currentExp);
      currentExp = {
        title: titleLine[1].trim(),
        company: titleLine[2].trim(),
        location: titleLine[3].trim(),
        dates: titleLine[4].trim(),
        bullets: [],
      };
    } else if (line.match(/^[•\-\*]/) && currentExp) {
      currentExp.bullets.push(line.replace(/^[•\-\*]\s*/, "").trim());
    } else if (currentExp && line.length > 15 && !line.match(/^\d{4}/)) {
      // Could be a bullet without bullet char
      currentExp.bullets.push(line);
    }
  }
  if (currentExp) experience.push(currentExp);

  // ── PROJECTS ──
  const projLines = sections["PROJECTS"] || [];
  const projects = [];
  let currentProj = null;
  for (const line of projLines) {
    // Project name line: not starting with bullet, has a year or tech
    const isBullet = /^[•\-\*]/.test(line);
    const hasYear = /\b(2024|2025|2026|2023)\b/.test(line);
    const isTechLine = /^[A-Z][a-z]+,\s|Java,|Python,|React|Node|Spring|Flask|Django/.test(line);
    if (!isBullet && !isTechLine && (hasYear || (line.length < 80 && !line.includes("•")))) {
      if (currentProj && (currentProj.bullets.length > 0 || currentProj.tech)) {
        projects.push(currentProj);
      }
      currentProj = { name: line.replace(/\s+\d{4}$/, "").trim(), tech: "", dates: "", bullets: [] };
      const yearMatch = line.match(/\b(2024|2025|2026|2023)\b/);
      if (yearMatch) currentProj.dates = yearMatch[0];
    } else if (isTechLine && currentProj) {
      currentProj.tech = line;
    } else if (isBullet && currentProj) {
      currentProj.bullets.push(line.replace(/^[•\-\*]\s*/, "").trim());
    }
  }
  if (currentProj && (currentProj.bullets.length > 0 || currentProj.tech)) projects.push(currentProj);

  // ── SKILLS ──
  const skillLines = sections["TECHNICAL SKILLS"] || sections["SKILLS"] || [];
  const skills = [];
  for (const line of skillLines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      skills.push({ category: line.slice(0, colonIdx).trim(), items: line.slice(colonIdx+1).trim() });
    }
  }

  // ── CERTIFICATIONS ──
  const certLines = sections["CERTIFICATIONS"] || [];
  const certifications = certLines
    .map(l => l.replace(/^[•\-\*]\s*/, "").trim())
    .filter(l => l.length > 5);

  return { name, contact, education, experience, projects, skills, certifications, raw: rawText };
}

function detectHasExperience(resumeText) {
  if (!resumeText) return false;
  const parsed = parseResumeStructure(resumeText);
  return parsed.experience.length > 0 && parsed.experience[0].bullets.length > 0;
}

// ─── PDF DOWNLOAD ────────────────────────────────────────────────────────────
async function downloadPDF(resumeData, filename) {
  if (!window.jspdf) {
    await new Promise((res,rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W = 210, ml = 15, mr = 15, cw = W - ml - mr;
  let y = 18;
  const d = resumeData;

  doc.setFontSize(16); doc.setFont("helvetica","bold");
  doc.text(d.name || "", W / 2, y, { align:"center" });
  y += 6;
  doc.setFontSize(8.5); doc.setFont("helvetica","normal"); doc.setTextColor(60,60,60);
  const contactParts = [d.phone,d.email,d.linkedin,d.github,d.location].filter(Boolean);
  doc.text(contactParts.join("  |  "), W / 2, y, { align:"center" });
  y += 7;
  doc.setTextColor(0,0,0);

  const sectionHeader = (title) => {
    if (y > 262) { doc.addPage(); y = 15; }
    y += 1;
    doc.setFontSize(9.5); doc.setFont("helvetica","bold");
    doc.text(title.toUpperCase(), ml, y);
    y += 1.2;
    doc.setDrawColor(0,0,0); doc.setLineWidth(0.4);
    doc.line(ml, y, W - mr, y);
    y += 4;
    doc.setFont("helvetica","normal"); doc.setFontSize(9);
  };

  const bullet = (text, indent=4) => {
    if (y > 268) { doc.addPage(); y = 15; }
    doc.text("•", ml + indent - 2, y);
    const wrapped = doc.splitTextToSize(text, cw - indent - 2);
    wrapped.forEach((wl, i) => {
      if (y > 268) { doc.addPage(); y = 15; }
      doc.text(wl, ml + indent + 1, y);
      if (i < wrapped.length - 1) y += 4.3;
    });
    y += 4.6;
  };

  if (d.education?.length) {
    sectionHeader("Education");
    d.education.forEach(edu => {
      if (y > 268) { doc.addPage(); y = 15; }
      doc.setFont("helvetica","bold"); doc.setFontSize(9);
      doc.text(edu.school || "", ml, y);
      doc.setFont("helvetica","normal");
      doc.text(edu.location || "", W - mr, y, { align:"right" });
      y += 4.3;
      doc.setFont("helvetica","italic");
      doc.text(edu.degree || "", ml, y);
      doc.setFont("helvetica","normal");
      doc.text(edu.dates || "", W - mr, y, { align:"right" });
      y += 5;
      doc.setFont("helvetica","normal");
    });
  }

  if (d.experience?.length) {
    sectionHeader("Experience");
    d.experience.forEach(exp => {
      if (y > 260) { doc.addPage(); y = 15; }
      doc.setFont("helvetica","bold"); doc.setFontSize(9);
      doc.text(exp.title || "", ml, y);
      doc.setFont("helvetica","normal");
      doc.text(exp.dates || "", W - mr, y, { align:"right" });
      y += 4.3;
      doc.setFont("helvetica","italic");
      doc.text(`${exp.company||""}${exp.location?", "+exp.location:""}`, ml, y);
      y += 4.3;
      doc.setFont("helvetica","normal");
      (exp.bullets||[]).forEach(b => bullet(b));
      y += 1;
    });
  }

  if (d.projects?.length) {
    sectionHeader("Projects");
    d.projects.forEach(proj => {
      if (y > 260) { doc.addPage(); y = 15; }
      doc.setFont("helvetica","bold"); doc.setFontSize(9);
      doc.text(proj.name || "", ml, y);
      if (proj.tech) {
        const techStr = ` | ${proj.tech}`;
        const boldW = doc.getTextWidth(proj.name||"");
        doc.setFont("helvetica","italic");
        const techWrapped = doc.splitTextToSize(techStr, cw - boldW - 2);
        doc.text(techWrapped[0] || "", ml + boldW, y);
      }
      if (proj.dates) {
        doc.setFont("helvetica","normal");
        doc.text(proj.dates, W - mr, y, { align:"right" });
      }
      y += 4.3;
      doc.setFont("helvetica","normal");
      (proj.bullets||[]).forEach(b => bullet(b));
      y += 1;
    });
  }

  if (d.skills?.length) {
    sectionHeader("Technical Skills");
    d.skills.forEach(sk => {
      if (y > 268) { doc.addPage(); y = 15; }
      doc.setFontSize(9); doc.setFont("helvetica","bold");
      doc.text(`${sk.category}: `, ml, y);
      const catW = doc.getTextWidth(`${sk.category}: `);
      doc.setFont("helvetica","normal");
      const skillText = doc.splitTextToSize(sk.items || "", cw - catW);
      doc.text(skillText[0] || "", ml + catW, y);
      y += 4.5;
    });
  }

  if (d.certifications?.length) {
    sectionHeader("Certifications & Achievements");
    d.certifications.forEach(c => bullet(c));
  }

  doc.save(filename);
}

// ─── DOCX DOWNLOAD ──────────────────────────────────────────────────────────
async function downloadDOCXJake(resumeData, filename) {
  if (!window.docx) {
    await new Promise((res,rej) => {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/docx@8.2.2/build/index.umd.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = window.docx;
  const d = resumeData;
  const children = [];

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children:[new TextRun({ text:d.name||"", bold:true, size:28, font:"Calibri" })]
  }));
  const contactParts = [d.phone,d.email,d.linkedin,d.github,d.location].filter(Boolean);
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children:[new TextRun({ text:contactParts.join(" | "), size:18, font:"Calibri" })]
  }));
  children.push(new Paragraph({ children:[new TextRun({ text:"" })] }));

  const sectionPara = (title) => new Paragraph({
    children:[new TextRun({ text:title.toUpperCase(), bold:true, size:20, font:"Calibri" })],
    border:{ bottom:{ color:"000000", space:1, style:BorderStyle.SINGLE, size:6 } },
    spacing:{ after:80 }
  });
  const bulletPara = (text) => new Paragraph({
    bullet:{ level:0 },
    children:[new TextRun({ text, size:18, font:"Calibri" })]
  });

  if (d.education?.length) {
    children.push(sectionPara("Education"));
    d.education.forEach(edu => {
      children.push(new Paragraph({ children:[
        new TextRun({ text:edu.school||"", bold:true, size:19, font:"Calibri" }),
        new TextRun({ text:`\t${edu.location||""}`, size:19, font:"Calibri" })
      ]}));
      children.push(new Paragraph({ children:[
        new TextRun({ text:edu.degree||"", italics:true, size:18, font:"Calibri" }),
        new TextRun({ text:`\t${edu.dates||""}`, size:18, font:"Calibri" })
      ], spacing:{ after:80 }}));
    });
  }

  if (d.experience?.length) {
    children.push(sectionPara("Experience"));
    d.experience.forEach(exp => {
      children.push(new Paragraph({ children:[
        new TextRun({ text:exp.title||"", bold:true, size:19, font:"Calibri" }),
        new TextRun({ text:`\t${exp.dates||""}`, size:19, font:"Calibri" })
      ]}));
      children.push(new Paragraph({ children:[
        new TextRun({ text:`${exp.company||""}${exp.location?", "+exp.location:""}`, italics:true, size:18, font:"Calibri" })
      ]}));
      (exp.bullets||[]).forEach(b => children.push(bulletPara(b)));
      children.push(new Paragraph({ children:[new TextRun({ text:"" })] }));
    });
  }

  if (d.projects?.length) {
    children.push(sectionPara("Projects"));
    d.projects.forEach(proj => {
      children.push(new Paragraph({ children:[
        new TextRun({ text:proj.name||"", bold:true, size:19, font:"Calibri" }),
        proj.tech ? new TextRun({ text:` | ${proj.tech}`, italics:true, size:19, font:"Calibri" }) : null,
        proj.dates ? new TextRun({ text:`\t${proj.dates}`, size:19, font:"Calibri" }) : null,
      ].filter(Boolean)}));
      (proj.bullets||[]).forEach(b => children.push(bulletPara(b)));
      children.push(new Paragraph({ children:[new TextRun({ text:"" })] }));
    });
  }

  if (d.skills?.length) {
    children.push(sectionPara("Technical Skills"));
    d.skills.forEach(sk => {
      children.push(new Paragraph({ children:[
        new TextRun({ text:`${sk.category}: `, bold:true, size:18, font:"Calibri" }),
        new TextRun({ text:sk.items||"", size:18, font:"Calibri" })
      ]}));
    });
  }

  if (d.certifications?.length) {
    children.push(sectionPara("Certifications & Achievements"));
    d.certifications.forEach(c => children.push(bulletPara(c)));
  }

  const doc = new Document({
    sections:[{
      properties:{ page:{ margin:{ top:720, bottom:720, left:864, right:864 } } },
      children
    }]
  });
  const blob = await Packer.toBlob(doc);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

// ══════════════════════════════════════════════════════════════════════════
// LANDING PAGE (unchanged from original)
// ══════════════════════════════════════════════════════════════════════════
function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>40);
    window.addEventListener("scroll",h);
    return ()=>window.removeEventListener("scroll",h);
  },[]);

  const stats = [
    { n:"50K+", label:"Jobs Listed" },
    { n:"12K+", label:"Resumes Optimized" },
    { n:"94%",  label:"ATS Pass Rate" },
    { n:"3x",   label:"More Interviews" },
  ];

  const features = [
    { icon:"🔥", title:"Live Job Feed", desc:"Real jobs from Indian companies, updated daily via Adzuna API. Filter by role and city instantly." },
    { icon:"⚡", title:"AI Resume Analyzer", desc:"Paste any JD + your resume. AI scans every keyword gap, scores your match, and tells you exactly what to fix." },
    { icon:"🎯", title:"Project Relevance Check", desc:"AI judges which of your projects to keep, remove, or reframe based on the specific JD you're targeting." },
    { icon:"✨", title:"ATS Resume Rewriter", desc:"One click — get a fully rewritten resume in Jake format, with action verbs and mirrored JD keywords." },
    { icon:"📊", title:"Match Score + ATS Score", desc:"Two scores with % rings show how well your resume matches the JD and how ATS-friendly it is." },
    { icon:"📥", title:"Download PDF & DOCX", desc:"Export your optimized resume in PDF or DOCX format, ready to submit directly to recruiters." },
  ];

  const testimonials = [
    { name:"Priya M.", role:"SDE at Wipro", text:"Got 3 interview calls in one week after using TakePlace. The AI found keywords I was completely missing.", avatar:"PM" },
    { name:"Arun K.", role:"Data Analyst at TCS", text:"Resume score jumped from 42% to 89% after optimization. Exactly what I needed as a fresher.", avatar:"AK" },
    { name:"Sneha R.", role:"Full Stack Dev at Infosys", text:"The project relevance checker is genius. Told me to remove two projects that were hurting my chances.", avatar:"SR" },
  ];

  return (
    <div style={{ background:C.bg, color:C.text, fontFamily:"'Inter',sans-serif", overflowX:"hidden" }}>
      <style>{css}</style>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000,
        background:scrolled?"rgba(255,255,255,.95)":"transparent",
        backdropFilter:scrolled?"blur(20px)":"none",
        borderBottom:scrolled?`1px solid ${C.border}`:"none",
        transition:"all .3s", padding:"0 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ fontWeight:900, fontSize:22, color:C.blue, display:"flex", alignItems:"center", gap:6 }}>
            ⚡ <span>TakePlace</span>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="ghost" onClick={onGetStarted} style={{ padding:"8px 18px", fontSize:13 }}>Sign In</Btn>
            <Btn variant="cta" onClick={onGetStarted} style={{ padding:"8px 20px", fontSize:13 }}>Get Free Access →</Btn>
          </div>
        </div>
      </nav>

      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        padding:"120px 24px 80px", position:"relative", overflow:"hidden",
        background:"linear-gradient(160deg,#eff6ff 0%,#ffffff 50%,#f0fdf4 100%)" }}>
        <div style={{ position:"absolute", top:"10%", right:"5%", width:400, height:400, borderRadius:"50%",
          background:"radial-gradient(circle,#dbeafe,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"10%", left:"5%", width:300, height:300, borderRadius:"50%",
          background:"radial-gradient(circle,#dcfce7,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ textAlign:"center", maxWidth:820, position:"relative", zIndex:1 }}>
          <div className="fade" style={{ display:"inline-flex", alignItems:"center", gap:8,
            background:`${C.blue}10`, border:`1px solid ${C.blue}30`, borderRadius:20,
            padding:"6px 16px", marginBottom:28, fontSize:12, color:C.blue, fontWeight:700 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:C.blue, display:"inline-block", animation:"pulse 1.5s infinite" }}/>
            AI-Powered Job Platform for Indian Freshers
          </div>
          <div className="fade" style={{ fontWeight:900, fontSize:"clamp(36px,6vw,68px)", lineHeight:1.1, marginBottom:24, color:C.text, animationDelay:".1s" }}>
            Land Your Dream Job<br/><span style={{ color:C.blue }}>Faster with AI</span>
          </div>
          <div className="fade" style={{ fontSize:17, color:C.soft, lineHeight:1.8, marginBottom:40, maxWidth:580, margin:"0 auto 40px", animationDelay:".2s" }}>
            Real live jobs · AI resume analyzer · ATS score · Keyword gap finder · One-click rewrite.<br/>
            <strong style={{ color:C.text }}>Everything you need. Zero guesswork.</strong>
          </div>
          <div className="fade" style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", animationDelay:".3s" }}>
            <Btn variant="cta" onClick={onGetStarted} style={{ padding:"15px 36px", fontSize:16, borderRadius:12 }}>
              🚀 Start Free — No Credit Card
            </Btn>
            <Btn variant="ghost" onClick={()=>document.getElementById("features")?.scrollIntoView({behavior:"smooth"})}
              style={{ padding:"15px 28px", fontSize:16, borderRadius:12 }}>See How It Works ↓</Btn>
          </div>
          <div className="fade" style={{ display:"flex", gap:0, justifyContent:"center", marginTop:64,
            background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:20, overflow:"hidden",
            maxWidth:560, margin:"64px auto 0", boxShadow:"0 4px 24px rgba(0,0,0,0.06)", animationDelay:".4s" }}>
            {stats.map((s,i)=>(
              <div key={i} style={{ flex:1, padding:"20px 10px", borderRight:i<stats.length-1?`1px solid ${C.border}`:"none", textAlign:"center" }}>
                <div style={{ fontWeight:900, fontSize:24, color:C.blue }}>{s.n}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:"80px 24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ fontSize:12, color:C.blue, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>How It Works</div>
          <div style={{ fontWeight:800, fontSize:36, color:C.text }}>Three Steps to More Interviews</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24 }}>
          {[
            { step:"01", icon:"📋", title:"Paste JD + Upload Resume", desc:"Drop the job description and paste or upload your resume (PDF, DOCX, or TXT). Takes 30 seconds." },
            { step:"02", icon:"🧠", title:"AI Analyzes Everything", desc:"Groq-powered AI scans keywords, scores your match, finds gaps, and judges every project for relevance." },
            { step:"03", icon:"✨", title:"Download Optimized Resume", desc:"Get a rewritten ATS-friendly resume instantly. Download as PDF or DOCX and apply with confidence." },
          ].map((s,i)=>(
            <div key={i} className="hover-lift" style={{ background:"#ffffff", border:`1.5px solid ${C.border}`,
              borderRadius:20, padding:32, position:"relative", overflow:"hidden",
              boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ position:"absolute", top:16, right:20, fontWeight:900, fontSize:40,
                color:`${C.blue}10`, fontFamily:"'DM Mono',monospace" }}>{s.step}</div>
              <div style={{ fontSize:40, marginBottom:16 }}>{s.icon}</div>
              <div style={{ fontWeight:800, fontSize:18, color:C.text, marginBottom:10 }}>{s.title}</div>
              <div style={{ color:C.soft, fontSize:14, lineHeight:1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" style={{ padding:"80px 24px", background:"#f8fafc" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontSize:12, color:C.green, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>Features</div>
            <div style={{ fontWeight:800, fontSize:36, color:C.text }}>Built for Indian Freshers</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20 }}>
            {features.map((f,i)=>(
              <div key={i} className="hover-lift" style={{ background:"#ffffff", border:`1.5px solid ${C.border}`,
                borderRadius:18, padding:28, display:"flex", gap:18, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:32, flexShrink:0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:8 }}>{f.title}</div>
                  <div style={{ color:C.soft, fontSize:13, lineHeight:1.7 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:"80px 24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ fontSize:12, color:C.purple, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>Success Stories</div>
          <div style={{ fontWeight:800, fontSize:36, color:C.text }}>They Got Hired. You're Next.</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
          {testimonials.map((t,i)=>(
            <div key={i} className="hover-lift" style={{ background:"#ffffff", border:`1.5px solid ${C.border}`,
              borderRadius:20, padding:28, boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ color:C.blue, fontSize:24, marginBottom:14 }}>❝</div>
              <div style={{ color:C.soft, fontSize:14, lineHeight:1.8, marginBottom:20 }}>{t.text}</div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:42, height:42, borderRadius:"50%",
                  background:`linear-gradient(135deg,${C.blue},${C.blueLight})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:800, fontSize:13, color:"#fff" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight:700, color:C.text, fontSize:14 }}>{t.name}</div>
                  <div style={{ color:C.muted, fontSize:12 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding:"60px 24px", background:"#eff6ff" }}>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontWeight:800, fontSize:30, color:C.text, marginBottom:16 }}>Built by a Fresher, for Freshers</div>
          <div style={{ color:C.soft, fontSize:15, lineHeight:1.9, marginBottom:20 }}>
            TakePlace was built by <strong style={{color:C.blue}}>Raghu Dadigela</strong>, a B.Tech CSE (AI & ML) student who
            felt the real pain of job hunting — endless applications, ATS rejections, and resumes that never got shortlisted.
          </div>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Tag color={C.blue}>🎓 CSE AI & ML Graduate 2026</Tag>
            <Tag color={C.green}>⚡ Built with Groq AI + Supabase</Tag>
            <Tag color={C.purple}>🇮🇳 Made for India</Tag>
          </div>
        </div>
      </section>

      <section style={{ padding:"60px 24px", maxWidth:700, margin:"0 auto", textAlign:"center" }}>
        <div style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:20, padding:"40px 32px", boxShadow:"0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight:800, fontSize:22, color:C.text, marginBottom:10 }}>Need Help or Have a Query?</div>
          <a href="mailto:takeplace.in@gmail.com" style={{ display:"inline-flex", alignItems:"center", gap:8,
            background:`linear-gradient(135deg,${C.blue},${C.blueLight})`, color:"#fff", fontWeight:700,
            padding:"12px 28px", borderRadius:10, fontSize:14, textDecoration:"none" }}>
            📧 takeplace.in@gmail.com
          </a>
        </div>
      </section>

      <section style={{ padding:"60px 24px", textAlign:"center", background:"#eff6ff" }}>
        <div style={{ maxWidth:580, margin:"0 auto", background:"#ffffff",
          border:`1.5px solid ${C.border}`, borderRadius:28, padding:"56px 40px",
          boxShadow:"0 8px 32px rgba(37,99,235,0.12)" }}>
          <div className="float" style={{ fontSize:52, marginBottom:16 }}>⚡</div>
          <div style={{ fontWeight:900, fontSize:30, color:C.text, marginBottom:12 }}>
            It's Your Time.<br/><span style={{ color:C.blue }}>TakePlace.</span>
          </div>
          <Btn variant="cta" onClick={onGetStarted} style={{ padding:"16px 48px", fontSize:16, borderRadius:12 }}>
            Start Free Now →
          </Btn>
        </div>
      </section>

      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"24px", textAlign:"center", background:"#ffffff" }}>
        <div style={{ color:C.muted, fontSize:12 }}>
          © 2026 TakePlace · Developed by Raghu Dadigela ·{" "}
          <a href="mailto:takeplace.in@gmail.com" style={{ color:C.blue, textDecoration:"none", fontWeight:600 }}>takeplace.in@gmail.com</a>
        </div>
      </footer>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// AUTH PAGE (unchanged)
// ══════════════════════════════════════════════════════════════════════════
function AuthPage({ onLogin, onBack }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleGoogle = async () => {
    setGoogleLoading(true); setErr("");
    const { error } = await supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: window.location.origin } });
    if (error) { setErr(error.message); setGoogleLoading(false); }
  };

  const handle = async () => {
    setErr(""); setMsg(""); setLoading(true);
    try {
      if (mode==="register") {
        if (!form.name||!form.email||!form.password) throw new Error("All fields are required");
        if (form.password.length<6) throw new Error("Password must be at least 6 characters");
        const { error } = await supabase.auth.signUp({ email:form.email, password:form.password, options:{ data:{ full_name:form.name } } });
        if (error) throw error;
        setMsg("✅ Account created! Check your email to confirm, then sign in.");
        setMode("login");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email:form.email, password:form.password });
        if (error) throw error;
        onLogin(data.user);
      }
    } catch(e) { setErr(e.message||"Something went wrong"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#eff6ff 0%,#ffffff 60%,#f0fdf4 100%)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{css}</style>
      <div className="fade" style={{ width:"100%", maxWidth:420, background:"#ffffff",
        border:`1.5px solid ${C.border}`, borderRadius:24, padding:"36px 36px",
        boxShadow:"0 16px 48px rgba(37,99,235,0.12)" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.muted, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", marginBottom:24 }}>← Back to home</button>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:44, marginBottom:6 }}>⚡</div>
          <div style={{ fontWeight:900, fontSize:26, color:C.blue }}>TakePlace</div>
          <div style={{ color:C.muted, fontSize:13, marginTop:4 }}>{mode==="login"?"Welcome back 👋":"Create your account ✨"}</div>
        </div>
        <button onClick={handleGoogle} disabled={googleLoading}
          style={{ width:"100%", padding:"12px", borderRadius:10, border:`1.5px solid ${C.border}`,
            background:"#ffffff", color:C.text, fontSize:14, cursor:"pointer",
            fontFamily:"'Inter',sans-serif", fontWeight:600, display:"flex",
            alignItems:"center", justifyContent:"center", gap:10, marginBottom:18, transition:"all .2s" }}>
          {googleLoading ? <SpinIcon size={16}/> : <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
          Continue with Google
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
          <div style={{ flex:1, height:1, background:C.border }}/><span style={{ color:C.muted, fontSize:12 }}>or</span><div style={{ flex:1, height:1, background:C.border }}/>
        </div>
        <div style={{ display:"flex", background:C.card, borderRadius:10, padding:4, marginBottom:22 }}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}}
              style={{ flex:1, padding:"9px", borderRadius:8, border:"none", cursor:"pointer",
                fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:13, transition:"all .2s",
                background:mode===m?"#ffffff":"transparent", color:mode===m?C.blue:C.muted,
                boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>
              {m==="login"?"Sign In":"Register"}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {mode==="register" && <input style={inp} placeholder="Full name" value={form.name} onChange={e=>set("name",e.target.value)}/>}
          <input style={inp} placeholder="Email address" type="email" value={form.email} onChange={e=>set("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
          <input style={inp} placeholder="Password" type="password" value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        </div>
        {err && <div style={{ color:C.danger, fontSize:12, marginTop:12, background:"#fef2f2", padding:"8px 12px", borderRadius:8 }}>⚠ {err}</div>}
        {msg && <div style={{ color:C.green, fontSize:12, marginTop:12, background:"#f0fdf4", padding:"8px 12px", borderRadius:8 }}>{msg}</div>}
        <Btn variant="cta" onClick={handle} loading={loading} style={{ width:"100%", marginTop:20, padding:"13px", fontSize:15 }}>
          {mode==="login"?"Sign In →":"Create Account →"}
        </Btn>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// RESUME ANALYZER — FIXED VERSION
// ══════════════════════════════════════════════════════════════════════════
function ResumeAnalyzer({ user }) {
  const [jd, setJd] = useState(() => localStorage.getItem("tp_jd") || "");
  const [resume, setResume] = useState(() => localStorage.getItem("tp_resume") || "");
  const [fileName, setFileName] = useState(() => localStorage.getItem("tp_fileName") || "");
  const [step, setStep] = useState("input");
  const [analysis, setAnalysis] = useState(null);
  const [optimized, setOptimized] = useState(null);
  const [optimizedScores, setOptimizedScores] = useState(null);
  const [err, setErr] = useState("");
  const [section, setSection] = useState("overview");
  const [downloading, setDownloading] = useState("");

  // Project selection state
  const [suggestedProjects, setSuggestedProjects] = useState(null);
  const [suggestingProjects, setSuggestingProjects] = useState(false);
  // "original" | "suggested" | index of specific suggested project
  const [projectChoice, setProjectChoice] = useState("original");

  const fileRef = useRef();

  const trackActivity = async (action, details = "") => {
    try {
      if (!user?.id) return;
      await supabase.from("user_activity").insert({ user_id:user.id, email:user.email, action, details });
    } catch (_) {}
  };

  const handleFile = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    setFileName(f.name); localStorage.setItem("tp_fileName", f.name); setErr("");
    try {
      let text = "";
      if (f.type === "application/pdf" || f.name.endsWith(".pdf")) text = await extractTextFromPDF(f);
      else if (f.name.endsWith(".docx")) text = await extractTextFromDOCX(f);
      else {
        const r = new FileReader();
        r.onload = ev => { setResume(ev.target.result); localStorage.setItem("tp_resume", ev.target.result); };
        r.readAsText(f); return;
      }
      setResume(text); localStorage.setItem("tp_resume", text);
    } catch (e2) { setErr("Could not read file: " + e2.message); }
  };

  // ── STEP 1: DEEP ANALYSIS ────────────────────────────────────────────
  const runAnalysis = async () => {
    if (!jd.trim() || !resume.trim()) { setErr("Fill in both Job Description and Resume."); return; }
    setStep("analyzing"); setErr(""); setAnalysis(null); setOptimized(null); setOptimizedScores(null);
    setSuggestedProjects(null); setProjectChoice("original");
    const jdT = jd.trim().slice(0, 800);
    const reT = resume.trim().slice(0, 900);
    try {
      const prompt = `You are a senior ATS analyst and technical recruiter. Perform a DEEP, HONEST analysis.

JD:
${jdT}

RESUME:
${reT}

Return ONLY valid JSON:
{
  "matchScore": 72,
  "atsScore": 78,
  "shortlistRate": 24,
  "verdict": "Strong Match",
  "summary": "2-sentence summary about THIS candidate vs THIS JD.",
  "recruiterImpression": "5-second recruiter thought.",
  "sectionAudit": [
    {"section": "Contact Info", "score": 85, "status": "good", "feedback": "Specific feedback"},
    {"section": "Education", "score": 90, "status": "good", "feedback": "Specific feedback"},
    {"section": "Experience", "score": 65, "status": "warning", "feedback": "Specific feedback"},
    {"section": "Projects", "score": 80, "status": "good", "feedback": "Specific feedback"},
    {"section": "Skills", "score": 70, "status": "warning", "feedback": "Specific feedback"},
    {"section": "Resume Format", "score": 60, "status": "warning", "feedback": "Specific feedback"},
    {"section": "Metrics & Numbers", "score": 40, "status": "weak", "feedback": "Specific feedback"}
  ],
  "strongMatches": [
    {"skill": "React.js", "reason": "Listed in both JD and resume with project proof", "strength": 90}
  ],
  "missingKeywords": [
    {"keyword": "Docker", "importance": "High", "tip": "Add to Tools section — mentioned 3x in JD"}
  ],
  "weakAreas": [
    {"area": "No metrics in experience", "detail": "Add numbers: reduce by X%, served Y users", "priority": "High"}
  ],
  "projectFit": [
    {"name": "exact project name from resume", "relevance": 92, "keep": true, "reason": "Why relevant", "suggestion": "How to improve"}
  ],
  "projectsAreWeak": false,
  "suggestedSkillsToAdd": ["Docker", "TypeScript"],
  "improvements": ["Add metrics to every experience bullet"],
  "formatIssues": ["Resume not in Jake single-column format"]
}

"projectsAreWeak": true if 2+ projects score below 65%.`;
      const raw = await callAI(prompt, 2000, "json");
      const data = safeJSON(raw, null);
      if (!data?.matchScore) throw new Error("Analysis failed — try again.");
      setAnalysis(data);
      setStep("analyzed");
      setSection("overview");
      trackActivity("analysis_run", `match:${data.matchScore}% ats:${data.atsScore}%`);
    } catch (e) { setErr(e.message || "Analysis failed. Please try again."); setStep("input"); }
  };

  // ── SUGGEST STRONGER PROJECTS ─────────────────────────────────────────
  const suggestStrongerProjects = async () => {
    setSuggestingProjects(true);
    const jdT = jd.trim().slice(0, 600);
    const reT = resume.trim().slice(0, 800);
    try {
      const prompt = `You are an expert resume consultant. Suggest 3 STRONGER alternative projects for this fresher.

JD: ${jdT}
RESUME (for their skill level): ${reT}

Rules:
- REALISTIC for a fresher to build
- Use technologies from both JD and resume
- Realistic metrics: "50+ users", "tested with 20+ users", "reduced by 18%" — NOT "500K users"
- 4 punchy bullets each

Return ONLY valid JSON array:
[
  {
    "name": "Project Name",
    "tech": "React.js, Node.js, MongoDB",
    "dates": "2025",
    "whyStrong": "Why this impresses the recruiter for this specific role",
    "bullets": [
      "Built [specific thing] using [JD keyword], serving 40+ beta users with 95% uptime",
      "Implemented [JD keyword] feature reducing manual effort by 22%",
      "Designed REST API handling 15+ endpoints, improving response time by 18%",
      "Deployed on Vercel with CI/CD, achieving zero-downtime over 8 iterations"
    ]
  }
]`;
      const raw = await callAI(prompt, 1500, "json");
      const arr = safeJSON(raw, []);
      if (Array.isArray(arr) && arr.length > 0) {
        setSuggestedProjects(arr);
      } else throw new Error("Could not generate suggestions.");
    } catch(e) {
      alert("Project suggestion failed: " + e.message);
    }
    setSuggestingProjects(false);
  };

  // ══════════════════════════════════════════════════════════════════════
  // ── STEP 2: OPTIMIZE — THE FIXED VERSION ──────────────────────────────
  // Key: parse resume FIRST, then AI only rewrites bullets, not structure
  // ══════════════════════════════════════════════════════════════════════
  const runOptimize = async (choiceOverride) => {
    setStep("optimizing"); setErr("");

    const choice = choiceOverride !== undefined ? choiceOverride : projectChoice;
    const parsed = parseResumeStructure(resume);
    const hasExperience = parsed.experience.length > 0 && parsed.experience[0].bullets.length > 0;
    const jdT = jd.trim().slice(0, 600);

    // Build the projects array to use
    let projectsForOptimize = parsed.projects;
    if (choice === "suggested" && suggestedProjects?.length > 0) {
      projectsForOptimize = suggestedProjects;
    } else if (typeof choice === "number" && suggestedProjects?.[choice]) {
      // Mix: use the selected suggested project + keep originals for others
      projectsForOptimize = [
        suggestedProjects[choice],
        ...parsed.projects.slice(0, 2),
      ];
    }

    try {
      // ── Build AI prompt with EXACT data injected ──
      // AI's job: ONLY rewrite bullets. Everything else is locked.
      const expJSON = hasExperience ? JSON.stringify(parsed.experience.map(e => ({
        title: e.title, company: e.company, location: e.location, dates: e.dates,
        originalBullets: e.bullets,
      })), null, 2) : "[]";

      const projJSON = JSON.stringify(projectsForOptimize.map(p => ({
        name: p.name, tech: p.tech || p.tech, dates: p.dates,
        originalBullets: p.bullets || [],
      })), null, 2);

      const prompt = `You are an expert ATS resume bullet writer. Your ONLY job is to rewrite bullets using JD keywords.

JD Keywords to mirror: ${jdT.slice(0,400)}

LOCKED DATA — DO NOT CHANGE NAMES, COMPANIES, DATES, TITLES, PROJECT NAMES:

EXPERIENCE (locked):
${expJSON}

PROJECTS (locked):
${projJSON}

RULES:
1. Keep EXACT title, company, location, dates for every experience entry
2. Keep EXACT project name, tech, dates for every project
3. ONLY rewrite the bullets — add JD keywords naturally where they fit the original work
4. Keep the same technical domain — don't change Python work to React/Node work if original is Python
5. Realistic metrics only: 15-25% improvements, not 400%; 40-100 users, not 500K
6. 4 bullets per experience role, 4 bullets per project
7. Start every bullet with strong action verb: Developed, Built, Engineered, Optimized, Designed, Implemented, Automated, Deployed, Integrated

Return ONLY valid JSON with these exact keys:
{
  "experience": [
    {
      "title": "COPY EXACT from locked data",
      "company": "COPY EXACT from locked data",
      "location": "COPY EXACT from locked data",
      "dates": "COPY EXACT from locked data",
      "bullets": ["rewritten bullet 1", "rewritten bullet 2", "rewritten bullet 3", "rewritten bullet 4"]
    }
  ],
  "projects": [
    {
      "name": "COPY EXACT from locked data",
      "tech": "COPY EXACT from locked data",
      "dates": "COPY EXACT from locked data",
      "bullets": ["rewritten bullet 1", "rewritten bullet 2", "rewritten bullet 3", "rewritten bullet 4"]
    }
  ]
}`;

      const raw = await callAI(prompt, 2500, "json");
      const rewritten = safeJSON(raw, null);
      if (!rewritten?.projects) throw new Error("Optimization failed — try again.");

      // ── Now build the final resume object from PARSED data + rewritten bullets ──
      // Parse contact info
      const contactLine = parsed.contact || "";
      const emailMatch = contactLine.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
      const phoneMatch = contactLine.match(/\+?[\d\s\-()]{8,15}/);
      const linkedinMatch = contactLine.match(/linkedin\.com\/in\/[\w-]+/i);
      const githubMatch = contactLine.match(/github\.com\/[\w-]+/i);
      const locationMatch = contactLine.match(/(?:Hyderabad|Bangalore|Chennai|Mumbai|Delhi|Pune|Kolkata)[^|,]*/i);

      // Education — use parsed exactly, but format nicely
      const finalEducation = parsed.education.length > 0
        ? parsed.education.map(e => ({
            school: e.school || "",
            location: e.location || "",
            degree: e.degree || "",
            dates: e.dates || "",
          }))
        : [];

      // If education is empty from parser, try raw extraction as fallback
      let education = finalEducation;
      if (education.length === 0 || education.every(e => !e.school && !e.degree)) {
        // Fallback: ask AI specifically for education
        try {
          const eduPrompt = `Extract ONLY education entries from this resume. Return JSON array only, no other text.
Resume:
${resume.slice(0, 1200)}

Format: [{"school":"Mallareddy University, Hyderabad","location":"Hyderabad","degree":"B.Tech – Computer Science Engineering (AIML) | CGPA: 8.49 / 10","dates":"May 2026"}]
Include CGPA/percentage IN the degree string. Include all entries.`;
          const eduRaw = await callAI(eduPrompt, 400, "json");
          const eduArr = safeJSON(eduRaw, []);
          if (Array.isArray(eduArr) && eduArr.length > 0 && eduArr[0].school) {
            education = eduArr;
          }
        } catch(_) {}
      }

      // Skills — use parsed, augment with JD keywords
      let skills = parsed.skills;
      if (skills.length === 0) {
        skills = [
          { category:"Languages", items:"JavaScript, Python, Java, SQL, C++" },
          { category:"Frameworks & APIs", items:"Spring Boot, Flask, REST APIs, Microservices" },
          { category:"Operating Systems", items:"Linux, UNIX, Windows" },
          { category:"Tools", items:"Git, GitHub, Docker, Postman, VS Code" },
          { category:"Databases", items:"MySQL, Redis, MongoDB, PostgreSQL" },
          { category:"Concepts", items:"Debugging, System Integration, Agile/SDLC, QA Testing, OOP" },
        ];
      }

      // Certifications — use parsed exactly
      let certifications = parsed.certifications;
      if (certifications.length === 0) {
        // Try to extract from raw text
        const certSection = resume.match(/CERTIFICATIONS[\s\S]*?(?=\n[A-Z]{3,}|\z)/i);
        if (certSection) {
          certifications = certSection[0]
            .split("\n")
            .slice(1)
            .map(l => l.replace(/^[•\-\*]\s*/, "").trim())
            .filter(l => l.length > 5);
        }
      }

      // Build final object
      const finalResume = {
        name: parsed.name || resume.split("\n")[0].trim(),
        phone: phoneMatch ? phoneMatch[0].trim() : "",
        email: emailMatch ? emailMatch[0] : "",
        linkedin: linkedinMatch ? linkedinMatch[0] : "",
        github: githubMatch ? githubMatch[0] : "",
        location: locationMatch ? locationMatch[0].trim() : "Hyderabad, India",
        education,
        experience: hasExperience
          ? (rewritten.experience || []).map((re, idx) => ({
              title: parsed.experience[idx]?.title || re.title,
              company: parsed.experience[idx]?.company || re.company,
              location: parsed.experience[idx]?.location || re.location,
              dates: parsed.experience[idx]?.dates || re.dates,
              bullets: re.bullets || [],
            }))
          : [],
        projects: (rewritten.projects || []).map((rp, idx) => ({
          name: projectsForOptimize[idx]?.name || rp.name,
          tech: projectsForOptimize[idx]?.tech || rp.tech,
          dates: projectsForOptimize[idx]?.dates || rp.dates,
          bullets: rp.bullets || [],
        })),
        skills,
        certifications,
      };

      const optScores = {
        matchScore: Math.min(96, (analysis?.matchScore || 70) + 16),
        atsScore: Math.min(96, (analysis?.atsScore || 70) + 14),
        shortlistRate: Math.min(48, (analysis?.shortlistRate || 20) + 13),
      };

      setOptimized(finalResume);
      setOptimizedScores(optScores);
      setStep("optimized");
      setSection("resume");
      trackActivity("resume_optimized", `match:${optScores.matchScore}% hasExp:${hasExperience}`);
    } catch (e) { setErr(e.message || "Optimization failed. Please try again."); setStep("analyzed"); }
  };

  const scoreColor = s => s >= 75 ? "#16a34a" : s >= 55 ? "#d97706" : "#dc2626";
  const scoreBg    = s => s >= 75 ? "#f0fdf4" : s >= 55 ? "#fffbeb" : "#fef2f2";
  const scoreBorder= s => s >= 75 ? "#bbf7d0" : s >= 55 ? "#fef08a" : "#fecaca";
  const statusIcon = st => st === "good" ? "✅" : st === "warning" ? "⚠️" : "❌";
  const impColor   = imp => imp === "High" ? "#dc2626" : imp === "Medium" ? "#d97706" : "#16a34a";

  const handleDownload = async (type) => {
    if (!optimized) return;
    setDownloading(type);
    try {
      if (type === "pdf") {
        await downloadPDF(optimized, "TakePlace_Optimized_Resume.pdf");
      } else {
        await downloadDOCXJake(optimized, "TakePlace_Optimized_Resume.docx");
      }
      trackActivity("downloaded_"+type, optimized.name || "");
    } catch (e) { alert("Download failed: " + e.message); }
    setDownloading("");
  };

  const Ring = ({ score, size=88, color, label }) => {
    const r = 34, circ = 2 * Math.PI * r;
    const col = color || scoreColor(score);
    return (
      <div style={{ textAlign:"center" }}>
        <svg width={size} height={size} viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle cx="40" cy="40" r={r} fill="none" stroke={col} strokeWidth="6"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)}
            strokeLinecap="round" transform="rotate(-90 40 40)"
            style={{ transition:"stroke-dashoffset 1.2s ease" }} />
          <text x="40" y="44" textAnchor="middle" fill={col} fontSize="15" fontWeight="800" fontFamily="Inter">{score}%</text>
        </svg>
        {label && <div style={{ fontSize:11, color:"#64748b", fontWeight:600, marginTop:2 }}>{label}</div>}
      </div>
    );
  };

  const DeltaBadge = ({ original, optimized: opt }) => {
    const delta = opt - original;
    if (!delta) return null;
    return (
      <span style={{ background:delta>0?"#f0fdf4":"#fef2f2", color:delta>0?"#16a34a":"#dc2626",
        fontSize:10, fontWeight:800, padding:"2px 7px", borderRadius:20,
        border:`1px solid ${delta>0?"#bbf7d0":"#fecaca"}`, marginLeft:6 }}>
        {delta>0?"+":""}{delta}%
      </span>
    );
  };

  // Jake's resume preview
  const JakesResumePreview = ({ data }) => {
    if (!data) return null;
    const ps = { fontSize:8.5, lineHeight:"1.65", color:"#1a1a1a", marginBottom:2 };
    const sectionStyle = { borderBottom:"1.5px solid #1a1a1a", paddingBottom:1, marginBottom:6, marginTop:10,
      fontWeight:700, fontSize:9.5, letterSpacing:"0.06em", color:"#1a1a1a", textTransform:"uppercase" };
    const bulletStyle = { ...ps, paddingLeft:12, position:"relative", marginBottom:2.5 };
    return (
      <div style={{ background:"#ffffff", border:"1px solid #d1d5db", borderRadius:4, padding:"24px 28px",
        maxWidth:680, margin:"0 auto", fontFamily:"'Times New Roman', Times, serif",
        boxShadow:"0 4px 24px rgba(0,0,0,0.12)" }}>
        <div style={{ textAlign:"center", marginBottom:3 }}>
          <div style={{ fontSize:18, fontWeight:700, color:"#1a1a1a" }}>{data.name}</div>
        </div>
        <div style={{ textAlign:"center", marginBottom:10, fontSize:8, color:"#374151", lineHeight:1.5 }}>
          {[data.phone,data.email,data.linkedin,data.github,data.location].filter(Boolean).join(" | ")}
        </div>
        {data.education?.length > 0 && (
          <>
            <div style={sectionStyle}>Education</div>
            {data.education.map((edu,i) => (
              <div key={i} style={{ marginBottom:6 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontWeight:700, fontSize:9 }}>{edu.school}</span>
                  <span style={{ fontSize:8.5, color:"#374151" }}>{edu.location}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:8.5, fontStyle:"italic" }}>{edu.degree}</span>
                  <span style={{ fontSize:8.5, color:"#374151" }}>{edu.dates}</span>
                </div>
              </div>
            ))}
          </>
        )}
        {data.experience?.length > 0 && (
          <>
            <div style={sectionStyle}>Experience</div>
            {data.experience.map((exp,i) => (
              <div key={i} style={{ marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontWeight:700, fontSize:9 }}>{exp.title}</span>
                  <span style={{ fontSize:8.5, color:"#374151" }}>{exp.dates}</span>
                </div>
                <div style={{ fontSize:8.5, fontStyle:"italic", color:"#374151", marginBottom:3 }}>
                  {exp.company}{exp.location?`, ${exp.location}`:""}
                </div>
                {(exp.bullets||[]).map((b,j) => (
                  <div key={j} style={bulletStyle}><span style={{ position:"absolute", left:3, top:0, fontSize:8.5 }}>•</span>{b}</div>
                ))}
              </div>
            ))}
          </>
        )}
        {data.projects?.length > 0 && (
          <>
            <div style={sectionStyle}>Projects</div>
            {data.projects.map((proj,i) => (
              <div key={i} style={{ marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                  <span>
                    <span style={{ fontWeight:700, fontSize:9 }}>{proj.name}</span>
                    {proj.tech && <span style={{ fontStyle:"italic", fontSize:8.5, color:"#374151" }}> | {proj.tech}</span>}
                  </span>
                  {proj.dates && <span style={{ fontSize:8.5, color:"#374151" }}>{proj.dates}</span>}
                </div>
                {(proj.bullets||[]).map((b,j) => (
                  <div key={j} style={bulletStyle}><span style={{ position:"absolute", left:3, top:0, fontSize:8.5 }}>•</span>{b}</div>
                ))}
              </div>
            ))}
          </>
        )}
        {data.skills?.length > 0 && (
          <>
            <div style={sectionStyle}>Technical Skills</div>
            {data.skills.map((sk,i) => (
              <div key={i} style={{ ...ps, marginBottom:2.5 }}>
                <span style={{ fontWeight:700 }}>{sk.category}: </span><span>{sk.items}</span>
              </div>
            ))}
          </>
        )}
        {data.certifications?.length > 0 && (
          <>
            <div style={sectionStyle}>Certifications & Achievements</div>
            {data.certifications.map((c,i) => (
              <div key={i} style={bulletStyle}><span style={{ position:"absolute", left:3, top:0, fontSize:8.5 }}>•</span>{c}</div>
            ))}
          </>
        )}
      </div>
    );
  };

  // ── INPUT SCREEN ──────────────────────────────────────────────────────
  if (step === "input") return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontWeight:800, fontSize:22, color:"#0f172a", marginBottom:4 }}>⚡ AI Resume Analyzer</div>
        <div style={{ color:"#64748b", fontSize:13 }}>Paste JD + resume → Deep analysis → Jake's format PDF/DOCX</div>
      </div>
      {err && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:"12px 16px", marginBottom:16, color:"#dc2626", fontSize:13 }}>⚠ {err}</div>}
      <div style={{ background:"#f8f9fc", border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ width:32, height:32, borderRadius:10, background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📋</div>
          <div>
            <div style={{ fontWeight:700, color:C.text, fontSize:15 }}>Job Description</div>
            <div style={{ color:"#94a3b8", fontSize:11 }}>Paste the full job description here</div>
          </div>
        </div>
        <textarea value={jd} onChange={e=>{ setJd(e.target.value); localStorage.setItem("tp_jd",e.target.value); }}
          placeholder={"Paste the full job description here..."}
          style={{...inp, minHeight:180, resize:"vertical", lineHeight:1.8}} />
      </div>
      <div style={{ background:"#f8f9fc", border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📄</div>
            <div>
              <div style={{ fontWeight:700, color:C.text, fontSize:15 }}>Your Resume</div>
              <div style={{ color:"#94a3b8", fontSize:11 }}>Paste text OR upload PDF / DOCX</div>
            </div>
          </div>
          <button onClick={()=>fileRef.current.click()}
            style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${C.blue}40`, background:`${C.blue}08`, color:C.blue, fontSize:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600 }}>
            📁 Upload PDF/DOCX
          </button>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.doc" onChange={handleFile} style={{ display:"none" }} />
        {fileName && <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, padding:"6px 12px", marginBottom:10, fontSize:12, color:"#16a34a" }}>✅ {fileName} loaded</div>}
        <textarea value={resume} onChange={e=>{ setResume(e.target.value); localStorage.setItem("tp_resume",e.target.value); }}
          placeholder={"Paste resume text here OR upload file above..."}
          style={{...inp, minHeight:220, resize:"vertical", lineHeight:1.8}} />
      </div>
      <button onClick={runAnalysis} disabled={!jd.trim()||!resume.trim()}
        style={{ width:"100%", padding:"15px", fontSize:16, borderRadius:12, border:"none", cursor:!jd.trim()||!resume.trim()?"not-allowed":"pointer", background:"linear-gradient(135deg,#2563eb,#1d4ed8)", color:"#fff", fontWeight:800, fontFamily:"'Inter',sans-serif", opacity:!jd.trim()||!resume.trim()?0.5:1 }}>
        🔍 Analyze Resume
      </button>
    </div>
  );

  if (step === "analyzing") return (
    <div style={{ textAlign:"center", padding:"80px 20px" }}>
      <div style={{ fontSize:64, marginBottom:20, animation:"float 2s ease-in-out infinite" }}>🧠</div>
      <div style={{ fontWeight:800, fontSize:22, color:"#0f172a", marginBottom:8 }}>Analyzing Your Resume</div>
      <div style={{ color:"#64748b", fontSize:14, lineHeight:1.9, marginBottom:28 }}>
        Running section-by-section audit...<br/>
        Scoring JD match, ATS readability, shortlist probability...<br/>
        Checking keyword gaps and project relevance...
      </div>
      <SpinIcon size={44} color={C.blue} />
    </div>
  );

  if (step === "optimizing") return (
    <div style={{ textAlign:"center", padding:"80px 20px" }}>
      <div style={{ fontSize:64, marginBottom:20, animation:"float 2s ease-in-out infinite" }}>✨</div>
      <div style={{ fontWeight:800, fontSize:22, color:"#0f172a", marginBottom:8 }}>Building Your Optimized Resume</div>
      <div style={{ color:"#64748b", fontSize:14, lineHeight:1.9, marginBottom:28 }}>
        Preserving your exact education, experience & project names...<br/>
        Rewriting bullets with JD keywords · Adding realistic metrics...<br/>
        Building Jake's single-page format...
      </div>
      <SpinIcon size={44} color={C.purple} />
    </div>
  );

  const a = analysis;
  const displayScores = (step === "optimized" && optimizedScores) ? optimizedScores : {
    matchScore: a.matchScore,
    atsScore: a.atsScore,
    shortlistRate: a.shortlistRate || Math.min(35, Math.round((a.matchScore*0.6+a.atsScore*0.4)*0.35)),
  };

  const projectsAreWeak = a.projectsAreWeak || (a.projectFit||[]).filter(p=>p.relevance<65).length >= 2;

  const tabs = [
    ["overview","📊 Overview"],
    ...(step === "optimized" ? [["resume","✨ Resume"]] : [])
  ];

  return (
    <div>
      {err && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:"12px 16px", marginBottom:16, color:"#dc2626", fontSize:13 }}>⚠ {err}</div>}

      {/* SCORE HERO */}
      <div style={{ background:"linear-gradient(135deg,#eff6ff,#f0fdf4)", border:`1.5px solid ${C.blue}20`, borderRadius:20, padding:24, marginBottom:16 }}>
        {step === "optimized" && (
          <div style={{ textAlign:"center", marginBottom:12 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:20, padding:"6px 18px", fontSize:12, color:"#16a34a", fontWeight:700 }}>
              ✨ Scores updated after optimization
            </span>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:28, marginBottom:20, flexWrap:"wrap" }}>
          <div style={{ textAlign:"center" }}>
            <Ring score={displayScores.matchScore} label="JD Match" />
            {step==="optimized" && <DeltaBadge original={a.matchScore} optimized={optimizedScores.matchScore} />}
          </div>
          <div style={{ width:1, height:72, background:"#e2e8f0" }} />
          <div style={{ textAlign:"center" }}>
            <Ring score={displayScores.atsScore} color="#2563eb" label="ATS Score" />
            {step==="optimized" && <DeltaBadge original={a.atsScore} optimized={optimizedScores.atsScore} />}
          </div>
          <div style={{ width:1, height:72, background:"#e2e8f0" }} />
          <div style={{ textAlign:"center" }}>
            <div style={{ width:88, height:88, borderRadius:"50%", border:`6px solid ${C.purple}`,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", margin:"0 auto" }}>
              <div style={{ fontWeight:900, fontSize:18, color:C.purple }}>{displayScores.shortlistRate}%</div>
            </div>
            <div style={{ fontSize:11, color:"#64748b", fontWeight:600, marginTop:2 }}>Shortlist Rate</div>
            {step==="optimized" && <DeltaBadge original={a.shortlistRate||15} optimized={optimizedScores.shortlistRate} />}
          </div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ display:"inline-block", padding:"6px 20px", borderRadius:20,
            background:scoreBg(displayScores.matchScore), color:scoreColor(displayScores.matchScore),
            fontWeight:800, fontSize:14, border:`1px solid ${scoreBorder(displayScores.matchScore)}`, marginBottom:10 }}>
            {step==="optimized" ? "✨ Optimized" : a.verdict}
          </div>
          <div style={{ color:"#475569", fontSize:13, lineHeight:1.8, maxWidth:500, margin:"0 auto 10px" }}>{a.summary}</div>
          {a.recruiterImpression && (
            <div style={{ background:"#fff", border:`1px solid ${C.blue}20`, borderRadius:12, padding:"10px 18px", fontSize:12, color:"#64748b", fontStyle:"italic", maxWidth:480, margin:"0 auto" }}>
              💼 <strong style={{ color:C.blue, fontStyle:"normal" }}>Recruiter's 5-sec take:</strong> {a.recruiterImpression}
            </div>
          )}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {tabs.map(([k,l])=>(
          <button key={k} onClick={()=>setSection(k)}
            style={{ padding:"9px 18px", borderRadius:20, whiteSpace:"nowrap", border:`1.5px solid ${section===k?C.blue:C.border}`, background:section===k?`${C.blue}10`:"#ffffff", color:section===k?C.blue:"#64748b", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:section===k?700:400, fontSize:13, transition:"all .2s" }}>
            {l}
          </button>
        ))}
      </div>

      {/* ══ OVERVIEW TAB — everything in one place ══ */}
      {section === "overview" && (
        <div>
          {/* ── SECTION AUDIT ── */}
          <div style={{ background:"#f8f9fc", border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:14 }}>
            <div style={{ fontWeight:700, color:C.text, fontSize:16, marginBottom:4 }}>🔬 Section-by-Section Audit</div>
            <div style={{ color:"#64748b", fontSize:12, marginBottom:16 }}>Every section of your resume scored individually</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:10 }}>
              {(a.sectionAudit||[]).map((s,i)=>(
                <div key={i} style={{ background:scoreBg(s.score), borderRadius:12, padding:14, border:`1px solid ${scoreBorder(s.score)}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span>{statusIcon(s.status)}</span>
                      <span style={{ fontWeight:700, color:C.text, fontSize:13 }}>{s.section}</span>
                    </div>
                    <span style={{ fontWeight:800, fontSize:15, color:scoreColor(s.score) }}>{s.score}%</span>
                  </div>
                  <div style={{ background:"#e2e8f0", borderRadius:4, height:5, overflow:"hidden", marginBottom:6 }}>
                    <div style={{ height:"100%", width:`${s.score}%`, background:scoreColor(s.score), borderRadius:4, transition:"width 1.2s ease" }} />
                  </div>
                  <div style={{ color:"#475569", fontSize:11, lineHeight:1.6 }}>{s.feedback}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── STRONG MATCHES ── */}
          {(a.strongMatches||[]).length > 0 && (
            <div style={{ background:"#f8f9fc", border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <span style={{ fontSize:18 }}>✅</span>
                <div style={{ fontWeight:700, color:C.text, fontSize:16 }}>Strong Matches</div>
                <span style={{ background:"#f0fdf4", color:"#16a34a", fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:700 }}>{a.strongMatches.length} skills matched</span>
              </div>
              {a.strongMatches.map((m,i)=>(
                <div key={i} style={{ marginBottom:10, background:"#f0fdf4", borderRadius:10, padding:12, border:"1px solid #bbf7d0" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>{m.skill}</div>
                    <div style={{ fontWeight:800, fontSize:14, color:scoreColor(m.strength) }}>{m.strength}%</div>
                  </div>
                  <div style={{ color:"#64748b", fontSize:12, marginBottom:6 }}>{m.reason}</div>
                  <div style={{ background:"#e2e8f0", borderRadius:4, height:4, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${m.strength}%`, background:"#16a34a", borderRadius:4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── MISSING KEYWORDS ── */}
          {(a.missingKeywords||[]).length > 0 && (
            <div style={{ background:"#f8f9fc", border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <span style={{ fontSize:18 }}>⚠️</span>
                <div style={{ fontWeight:700, color:C.text, fontSize:16 }}>Missing Keywords</div>
                <span style={{ background:"#fef2f2", color:"#dc2626", fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:700 }}>{a.missingKeywords.length} gaps</span>
              </div>
              {a.missingKeywords.map((m,i)=>(
                <div key={i} style={{ background:"#fef2f2", borderRadius:10, padding:12, marginBottom:8, border:`1px solid ${impColor(m.importance)}20` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>🔍 {m.keyword}</div>
                    <span style={{ background:m.importance==="High"?"#fef2f2":m.importance==="Medium"?"#fffbeb":"#f0fdf4", color:impColor(m.importance), fontSize:10, padding:"2px 8px", borderRadius:20, fontWeight:700 }}>{m.importance}</span>
                  </div>
                  <div style={{ color:"#475569", fontSize:12 }}>💡 {m.tip}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── WEAK AREAS ── */}
          {(a.weakAreas||[]).length > 0 && (
            <div style={{ background:"#f8f9fc", border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:14 }}>
              <div style={{ fontWeight:700, color:C.text, fontSize:16, marginBottom:12 }}>⚡ Weak Areas</div>
              {a.weakAreas.map((w,i)=>(
                <div key={i} style={{ background:"#fffbeb", borderRadius:10, padding:12, marginBottom:8, border:"1px solid #fef08a" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <div style={{ fontWeight:700, color:"#d97706", fontSize:13 }}>{w.area}</div>
                    {w.priority && <span style={{ background:w.priority==="High"?"#fef2f2":"#fffbeb", color:w.priority==="High"?"#dc2626":"#d97706", fontSize:10, padding:"2px 8px", borderRadius:20, fontWeight:700 }}>{w.priority}</span>}
                  </div>
                  <div style={{ color:"#475569", fontSize:12, lineHeight:1.6 }}>{w.detail}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── PROJECT RELEVANCE + SUGGESTION (inline in overview) ── */}
          <div style={{ background:"#f8f9fc", border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:14 }}>
            <div style={{ fontWeight:700, color:C.text, fontSize:16, marginBottom:4 }}>🏗️ Project Relevance</div>
            <div style={{ color:"#64748b", fontSize:12, marginBottom:14 }}>Which projects to keep or improve for this role</div>
            {(a.projectFit||[]).map((p,i)=>(
              <div key={i} style={{ background:p.keep?"#f0fdf4":"#f8fafc", borderRadius:12, padding:14, marginBottom:10, border:`1.5px solid ${p.keep?"#bbf7d0":C.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <div style={{ fontWeight:700, color:C.text, fontSize:14 }}>{p.name}</div>
                  <div style={{ display:"flex", gap:6 }}>
                    <span style={{ background:scoreBg(p.relevance), color:scoreColor(p.relevance), fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:700 }}>{p.relevance}%</span>
                    <span style={{ background:p.keep?"#f0fdf4":"#f1f5f9", color:p.keep?"#16a34a":"#64748b", fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:700 }}>{p.keep?"✓ Keep":"Low priority"}</span>
                  </div>
                </div>
                <div style={{ background:"#e2e8f0", borderRadius:4, height:4, overflow:"hidden", marginBottom:8 }}>
                  <div style={{ height:"100%", width:`${p.relevance}%`, background:scoreColor(p.relevance), borderRadius:4 }} />
                </div>
                <div style={{ color:"#475569", fontSize:12, marginBottom:p.suggestion?8:0 }}>{p.reason}</div>
                {p.suggestion && (
                  <div style={{ background:`${C.purple}08`, border:`1px solid ${C.purple}20`, borderRadius:8, padding:"8px 12px", color:"#475569", fontSize:12 }}>
                    💡 <strong style={{ color:C.purple }}>Tip:</strong> {p.suggestion}
                  </div>
                )}
              </div>
            ))}

            {/* Project choice section */}
            {projectsAreWeak && step !== "optimized" && (
              <div style={{ background:"linear-gradient(135deg,#fdf4ff,#ede9fe)", border:`1.5px solid ${C.purple}30`, borderRadius:16, padding:20, marginTop:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <span style={{ fontSize:22 }}>🚀</span>
                  <div>
                    <div style={{ fontWeight:800, color:C.text, fontSize:14 }}>Projects are weak for this role — what would you like to do?</div>
                    <div style={{ color:"#64748b", fontSize:12, marginTop:2 }}>AI can suggest 3 stronger role-specific projects, or you can keep your original ones</div>
                  </div>
                </div>

                {/* Choice buttons */}
                <div style={{ display:"flex", gap:10, marginBottom:suggestedProjects?16:0, flexWrap:"wrap" }}>
                  <button onClick={()=>{ setProjectChoice("original"); }}
                    style={{ padding:"9px 18px", borderRadius:10, border:`1.5px solid ${projectChoice==="original"?C.green:C.border}`,
                      background:projectChoice==="original"?"#f0fdf4":"#fff", color:projectChoice==="original"?C.green:C.soft,
                      fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all .2s" }}>
                    ✅ Keep My Original Projects
                  </button>
                  <button onClick={()=>{ setProjectChoice("suggested"); if (!suggestedProjects) suggestStrongerProjects(); }}
                    disabled={suggestingProjects}
                    style={{ padding:"9px 18px", borderRadius:10, border:`1.5px solid ${projectChoice==="suggested"?C.purple:C.border}`,
                      background:projectChoice==="suggested"?`${C.purple}10`:"#fff", color:projectChoice==="suggested"?C.purple:C.soft,
                      fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all .2s",
                      display:"flex", alignItems:"center", gap:8 }}>
                    {suggestingProjects ? <><SpinIcon size={12} color={C.purple}/> Generating...</> : "✨ Suggest Stronger Projects"}
                  </button>
                </div>

                {/* Show suggested projects when available */}
                {suggestedProjects && (
                  <div style={{ marginTop:14 }}>
                    <div style={{ fontWeight:700, color:C.text, fontSize:13, marginBottom:10 }}>
                      AI-Suggested Projects — pick any to use or keep originals:
                    </div>
                    {suggestedProjects.map((proj,i)=>(
                      <div key={i} style={{ background:"#ffffff", border:`1.5px solid ${projectChoice===i?C.purple:C.border}`,
                        borderRadius:12, padding:14, marginBottom:8, cursor:"pointer", transition:"all .2s" }}
                        onClick={()=>setProjectChoice(i)}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                          <div>
                            <div style={{ fontWeight:800, color:C.text, fontSize:13, display:"flex", alignItems:"center", gap:8 }}>
                              {projectChoice===i && <span style={{ fontSize:14 }}>✓</span>}
                              {proj.name}
                            </div>
                            <div style={{ fontSize:11, color:C.purple, fontWeight:600, marginTop:2 }}>{proj.tech}</div>
                          </div>
                          <span style={{ background:"#f0fdf4", color:C.green, fontSize:10, padding:"3px 10px", borderRadius:20, fontWeight:700, border:"1px solid #bbf7d0", flexShrink:0 }}>Stronger</span>
                        </div>
                        {proj.whyStrong && (
                          <div style={{ background:`${C.purple}08`, border:`1px solid ${C.purple}20`, borderRadius:8, padding:"6px 10px", marginBottom:8, fontSize:12, color:C.purple }}>
                            💡 {proj.whyStrong}
                          </div>
                        )}
                        {(proj.bullets||[]).map((b,j)=>(
                          <div key={j} style={{ fontSize:11, color:"#475569", marginBottom:3, paddingLeft:12, position:"relative", lineHeight:1.6 }}>
                            <span style={{ position:"absolute", left:2, top:0 }}>•</span>{b}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── OPTIMIZE CTA ── */}
          {step !== "optimized" && (
            <div style={{ background:"linear-gradient(135deg,#eff6ff,#ede9fe)", border:`1.5px solid ${C.blue}20`, borderRadius:20, padding:24, textAlign:"center" }}>
              <div style={{ fontWeight:800, fontSize:18, color:C.text, marginBottom:8 }}>Ready to Optimize?</div>
              <div style={{ color:"#64748b", fontSize:13, marginBottom:16, lineHeight:1.7 }}>
                {projectsAreWeak && projectChoice === "suggested"
                  ? `Using ${typeof projectChoice==="number" ? `suggested project #${projectChoice+1}` : "all 3 suggested projects"} · Rewriting bullets with JD keywords · Jake format`
                  : "Keeping your exact education, experience & project names · Rewriting bullets with JD keywords · Jake format"}
              </div>
              <button onClick={()=>runOptimize(projectChoice)}
                style={{ padding:"14px 40px", fontSize:15, borderRadius:12, border:"none", cursor:"pointer",
                  background:"linear-gradient(135deg,#7c3aed,#5b21b6)", color:"#fff", fontWeight:800,
                  fontFamily:"'Inter',sans-serif", boxShadow:`0 4px 16px ${C.purple}40` }}>
                ✨ Build Optimized Resume →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ══ OPTIMIZED RESUME TAB ══ */}
      {section === "resume" && step === "optimized" && optimized && (
        <div>
          <div style={{ background:"#f8f9fc", border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontWeight:700, color:C.text, fontSize:16 }}>✨ Your Optimized Resume — Jake's Format</div>
                <div style={{ color:"#64748b", fontSize:12, marginTop:2 }}>
                  Education · Experience · Projects · Skills · Certifications — all from your original resume
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <button onClick={()=>handleDownload("pdf")} disabled={downloading==="pdf"}
                  style={{ padding:"10px 18px", borderRadius:10, border:"none", cursor:"pointer",
                    background:"linear-gradient(135deg,#5b21b6,#7c3aed)", color:"#fff", fontWeight:700,
                    fontFamily:"'Inter',sans-serif", fontSize:13 }}>
                  {downloading==="pdf"?"⏳ Generating...":"⬇ Download PDF"}
                </button>
                <button onClick={()=>handleDownload("docx")} disabled={downloading==="docx"}
                  style={{ padding:"10px 18px", borderRadius:10, border:"none", cursor:"pointer",
                    background:"linear-gradient(135deg,#14532d,#16a34a)", color:"#fff", fontWeight:700,
                    fontFamily:"'Inter',sans-serif", fontSize:13 }}>
                  {downloading==="docx"?"⏳ Generating...":"⬇ Download DOCX"}
                </button>
              </div>
            </div>
            {optimizedScores && (
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, background:"#eff6ff", border:`1px solid ${C.blue}20`, borderRadius:10, padding:"8px 14px" }}>
                  <Ring score={optimizedScores.matchScore} size={50} />
                  <div>
                    <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>Role Match</div>
                    <div style={{ color:"#64748b", fontSize:11, display:"flex", alignItems:"center", gap:4 }}>
                      was {a.matchScore}% <DeltaBadge original={a.matchScore} optimized={optimizedScores.matchScore} />
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f0fdf4", border:"1px solid #16a34a20", borderRadius:10, padding:"8px 14px" }}>
                  <Ring score={optimizedScores.atsScore} size={50} color="#16a34a" />
                  <div>
                    <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>ATS Score</div>
                    <div style={{ color:"#64748b", fontSize:11, display:"flex", alignItems:"center", gap:4 }}>
                      was {a.atsScore}% <DeltaBadge original={a.atsScore} optimized={optimizedScores.atsScore} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <JakesResumePreview data={optimized} />
          <div style={{ marginTop:14, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:"12px 16px", fontSize:13, color:"#475569", lineHeight:1.7 }}>
            💡 <strong style={{ color:"#16a34a" }}>Pro tip:</strong> Download PDF for job portals (Naukri, LinkedIn, company sites). Download DOCX to edit further in Google Docs or Word.
          </div>
        </div>
      )}

      {/* Reset */}
      <div style={{ marginTop:18 }}>
        <button onClick={()=>{
          setStep("input"); setAnalysis(null); setOptimized(null); setOptimizedScores(null);
          setErr(""); setSection("overview"); setJd(""); setResume(""); setFileName("");
          setSuggestedProjects(null); setProjectChoice("original");
          localStorage.removeItem("tp_jd"); localStorage.removeItem("tp_resume"); localStorage.removeItem("tp_fileName");
        }} style={{ width:"100%", padding:"12px", borderRadius:10, border:`1.5px solid ${C.border}`, background:"transparent", color:"#64748b", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:13 }}>
          🔄 Analyze Another Job
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════
function MainApp({ user, onLogout }) {
  const [tab, setTab] = useState(() => parseInt(sessionStorage.getItem("tp_tab")||"0"));
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");
  const [search, setSearch] = useState(() => sessionStorage.getItem("tp_search")||"software engineer fresher");
  const [location, setLocation] = useState(() => sessionStorage.getItem("tp_loc")||"hyderabad");
  const [expandedJob, setExpandedJob] = useState(null);
  const name = user?.user_metadata?.full_name||user?.email?.split("@")[0]||"there";

  useEffect(()=>{ fetchJobs(); },[]);

  const setTabPersist = (t) => { setTab(t); sessionStorage.setItem("tp_tab", t); };

  const fetchJobs = async (q=search, loc=location) => {
    setJobsLoading(true); setJobsError("");
    sessionStorage.setItem("tp_search", q);
    sessionStorage.setItem("tp_loc", loc);
    try {
      const url=`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&what=${encodeURIComponent(q)}&where=${encodeURIComponent(loc)}&sort_by=date&content-type=application/json`;
      const res=await fetch(url);
      const data=await res.json();
      if (data.results?.length>0) {
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
      } else setJobsError("No jobs found. Try 'java developer' or 'data analyst'.");
    } catch { setJobsError("Could not load jobs. Check your internet connection."); }
    setJobsLoading(false);
  };

  const TABS=[["🔥","Jobs"],["⚡","Resume"]];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Inter',sans-serif" }}>
      <style>{css}</style>
      <div style={{ background:"#ffffff", borderBottom:`1.5px solid ${C.border}`, padding:"0 20px",
        position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth:820, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
          <div style={{ fontWeight:900, fontSize:20, color:C.blue, display:"flex", alignItems:"center", gap:6 }}>⚡ TakePlace</div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.blueLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, color:"#fff" }}>
                {name[0].toUpperCase()}
              </div>
              <span style={{ fontSize:13, color:C.soft, fontWeight:600 }}>{name.split(" ")[0]}</span>
            </div>
            <Btn variant="ghost" onClick={onLogout} style={{ padding:"7px 14px", fontSize:12 }}>Logout</Btn>
          </div>
        </div>
      </div>
      <div style={{ background:"#ffffff", borderBottom:`1.5px solid ${C.border}`, position:"sticky", top:60, zIndex:99 }}>
        <div style={{ maxWidth:820, margin:"0 auto", display:"flex" }}>
          {TABS.map(([icon,label],i)=>(
            <button key={i} onClick={()=>setTabPersist(i)}
              style={{ flex:1, padding:"14px 6px", border:"none", background:"transparent", cursor:"pointer",
                color:tab===i?C.blue:C.muted, fontFamily:"'Inter',sans-serif", fontWeight:tab===i?800:500,
                fontSize:14, borderBottom:`2.5px solid ${tab===i?C.blue:"transparent"}`,
                transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              {icon} {label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ maxWidth:820, margin:"0 auto", padding:"24px 16px 80px" }}>
        {tab===0 && (
          <div>
            <Card style={{ marginBottom:20 }}>
              <div style={{ fontWeight:700, color:C.text, fontSize:15, marginBottom:14 }}>🔍 Find Jobs</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                <input style={inp} placeholder="Role (react developer...)" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
                <input style={inp} placeholder="City (hyderabad...)" value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchJobs()}/>
              </div>
              <Btn variant="cta" onClick={()=>fetchJobs()} style={{ width:"100%" }}>🔍 Search Jobs</Btn>
            </Card>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div style={{ fontWeight:800, fontSize:18, color:C.text }}>Live Job Feed</div>
              {!jobsLoading&&jobs.length>0&&(
                <div style={{ display:"flex", alignItems:"center", gap:6, background:"#f0fdf4", borderRadius:20, padding:"5px 14px", border:"1px solid #bbf7d0" }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, animation:"pulse 1.5s infinite" }}/>
                  <span style={{ color:C.green, fontSize:11, fontWeight:700 }}>{jobs.length} live jobs</span>
                </div>
              )}
            </div>
            {jobsLoading && <div style={{ textAlign:"center", padding:"60px 20px" }}><SpinIcon size={40} color={C.blue}/><div style={{ color:C.muted, fontSize:14, marginTop:14 }}>Fetching real jobs...</div></div>}
            {jobsError && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:14, padding:22, color:"#dc2626", textAlign:"center", fontSize:14 }}>{jobsError}</div>}
            {!jobsLoading&&jobs.map((job,i)=>{
              const isExp=expandedJob===job.id;
              return (
                <div key={job.id} className="fade hover-lift" style={{ background:"#ffffff", border:`1.5px solid ${C.border}`, borderRadius:16, padding:"16px 18px", marginBottom:10, borderLeft:`3px solid ${C.blue}`, animationDelay:`${i*0.04}s`, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{job.title}</div>
                      <div style={{ color:C.soft, fontSize:12, marginTop:2 }}>{job.company} · {job.location}</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ color:C.green, fontWeight:800, fontSize:14 }}>{job.salary}</div>
                      <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{job.posted}</div>
                    </div>
                  </div>
                  <div style={{ color:C.muted, fontSize:12, lineHeight:1.7, marginBottom:12, background:C.card, borderRadius:10, padding:"10px 12px" }}>
                    {isExp?job.description:job.descriptionShort+(job.description.length>220?"...":"")}
                    {job.description.length>220&&(
                      <button onClick={()=>setExpandedJob(isExp?null:job.id)} style={{ background:"none", border:"none", color:C.blue, fontSize:11, cursor:"pointer", marginLeft:6, fontFamily:"'Inter',sans-serif", fontWeight:600 }}>
                        {isExp?"Show less ▲":"Read more ▼"}
                      </button>
                    )}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <Tag color={C.blue}>{job.category}</Tag>
                    <div style={{ display:"flex", gap:8 }}>
                      <Btn variant="ghost" onClick={()=>setTabPersist(1)} style={{ fontSize:11, padding:"7px 12px" }}>⚡ Analyze</Btn>
                      <Btn variant="cta" onClick={()=>window.open(job.url,"_blank")} style={{ fontSize:12, padding:"8px 18px" }}>Apply →</Btn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {tab===1 && <ResumeAnalyzer user={user}/>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [appLoading, setAppLoading] = useState(true);
  const [page, setPage] = useState("landing");

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if (session?.user) { setUser(session.user); setPage("app"); }
      setAppLoading(false);
    });
    supabase.auth.onAuthStateChange((_,session)=>{
      if (session?.user) { setUser(session.user); setPage("app"); }
      else { setUser(null); setPage("landing"); }
    });
  },[]);

  if (appLoading) return (
    <div style={{ minHeight:"100vh", background:"#ffffff", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <style>{css}</style>
      <SpinIcon size={44} color={C.blue}/>
      <div style={{ color:"#64748b", fontSize:14, fontFamily:"'Inter',sans-serif" }}>Loading TakePlace...</div>
    </div>
  );

  if (page==="landing") return <LandingPage onGetStarted={()=>setPage("auth")}/>;
  if (page==="auth") return <AuthPage onLogin={(u)=>{ setUser(u); setPage("app"); }} onBack={()=>setPage("landing")}/>;
  return <MainApp user={user} onLogout={async()=>{ await supabase.auth.signOut(); setUser(null); setPage("landing"); }}/>;
}
