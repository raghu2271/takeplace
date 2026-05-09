import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// --- CONFIG ----------------------------------------------------------------
const SUPABASE_URL = "https://mdwxmiywtghznpwulwko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3htaXl3dGdoem5wd3Vsd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTkyOTIsImV4cCI6MjA5MzU3NTI5Mn0.b6yq6bIu0ntAbrrb2CP1H_alIcCTLc9sbix7tuERVAw";
const ADZUNA_ID = "845f6cff";
const ADZUNA_KEY = "1255514b43792f219448b455d585c3ea";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- AI API (Anthropic Claude - direct from frontend) ---------------------
async function callClaude(prompt, maxTokens = 1500, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "",           // Anthropic proxy handles auth
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: maxTokens,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error("AI error " + res.status + ": " + errBody.slice(0, 120));
      }
      const data = await res.json();
      return data.content?.[0]?.text || "";
    } catch (e) {
      if (attempt < retries) { await new Promise(r => setTimeout(r, 1200 * (attempt + 1))); continue; }
      throw e;
    }
  }
}

// JSON mode - instructs Claude to return only JSON
async function callAI(prompt, maxTokens = 1500, retries = 2) {
  const jsonPrompt = `Return ONLY raw JSON. No markdown, no backticks, no explanation. Start your response with { or [.\n\n${prompt}`;
  return callClaude(jsonPrompt, maxTokens, retries);
}

// Text mode - plain text response
async function callAIText(prompt, maxTokens = 1500, retries = 2) {
  return callClaude(prompt, maxTokens, retries);
}

function safeJSON(raw, fallback = {}) {
  if (!raw) return fallback;
  try {
    const clean = raw.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    return JSON.parse(clean);
  } catch {
    try { const obj = raw.match(/\{[\s\S]*\}/); if (obj) return JSON.parse(obj[0]); } catch {}
    try { const arr = raw.match(/\[[\s\S]*\]/); if (arr) return JSON.parse(arr[0]); } catch {}
    return fallback;
  }
}

// --- DESIGN TOKENS ---------------------------------------------------------
const C = {
  bg: "#07080f", card: "#0d1117", border: "#1a2030",
  orange: "#FF5C1A", orangeLight: "#FF8A5B",
  green: "#1DDB8B", text: "#e2e8f0", muted: "#4b5563", soft: "#94a3b8",
  danger: "#f87171", warn: "#fbbf24", purple: "#a78bfa",
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
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  .fade{animation:fadeUp 0.5s ease forwards;}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  .float{animation:float 3s ease-in-out infinite;}
  .hover{transition:all 0.2s;} .hover:hover{transform:translateY(-2px);}
  input:focus,textarea:focus{border-color:${C.orange}88!important;outline:none;}
  details summary::-webkit-details-marker{display:none;}
`;

const inp = {
  width: "100%", background: "#0a0e18", border: `1px solid ${C.border}`,
  borderRadius: 10, padding: "11px 14px", color: C.text, fontSize: 13,
  fontFamily: "'Outfit',sans-serif", outline: "none", transition: "border-color 0.2s",
};

const Btn = ({ children, onClick, variant = "primary", style = {}, disabled = false }) => {
  const variants = {
    primary: { background: `linear-gradient(135deg,${C.orange},${C.orangeLight})`, color: "#07080f" },
    ghost: { background: "transparent", color: C.soft, border: `1px solid ${C.border}` },
    purple: { background: `linear-gradient(135deg,#7c3aed,${C.purple})`, color: "#fff" },
    green: { background: `linear-gradient(135deg,#065f46,${C.green})`, color: "#07080f" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      style={{ padding: "10px 20px", borderRadius: 10, border: "none", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 13, transition: "all 0.2s", opacity: disabled ? 0.5 : 1, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const Spin = ({ size = 20, color = C.orange }) => (
  <span className="spin" style={{ fontSize: size, color, display: "inline-block" }}>⚡</span>
);

// --- SCORE BAR -------------------------------------------------------------
const ScoreBar = ({ score, color }) => (
  <div style={{ background: "#0a0e18", borderRadius: 4, height: 6, overflow: "hidden", marginTop: 4 }}>
    <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 4, transition: "width 1s ease" }} />
  </div>
);

// --- RESUME ANALYZER TAB ---------------------------------------------------
function ResumeAnalyzer() {
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [activeSection, setActiveSection] = useState("analysis");
  const fileRef = useRef();

  const analyze = async () => {
    if (!jd.trim() || !resume.trim()) { setErr("Please fill in both the Job Description and your Resume."); return; }
    setLoading(true); setErr(""); setResult(null);

    const jdTrim = jd.trim().slice(0, 600);
    const resTrim = resume.trim().slice(0, 700);

    try {
      // Call 1: Analysis JSON
      const p1 = `ATS analyst. Compare resume to JD. JSON only, no markdown.

JD: ${jdTrim}

RESUME: ${resTrim}

Return exactly this JSON structure:
{"matchScore":68,"atsScore":72,"verdict":"Good Match","summary":"2 sentences","strongMatches":[{"skill":"Spring Boot","reason":"in both","strength":85}],"missingKeywords":[{"keyword":"Docker","importance":"High","tip":"add to skills"}],"weakAreas":[{"area":"Metrics","detail":"no numbers"}],"projectFit":[{"name":"Project","relevance":80,"reason":"relevant","keep":true,"suggestion":"highlight X"}],"suggestedSkillsToAdd":["Kubernetes"]}`;

      const raw1 = await callAI(p1, 1200);
      const analysis = safeJSON(raw1, null);
      if (!analysis?.matchScore) throw new Error("Analysis failed - please try again.");

      setResult({ ...analysis, optimizedResume: "Generating optimized resume..." });
      setActiveSection("analysis");

      // Call 2: Resume rewrite as plain text
      const p2 = `Rewrite this resume for the job below. Use Jake format. ALL CAPS section names: EDUCATION, EXPERIENCE, PROJECTS, SKILLS. Use bullet points starting with action verbs. Mirror keywords from the JD. Remove irrelevant projects. Add metrics where possible.

JD keywords: ${jdTrim.slice(0, 300)}

RESUME: ${resTrim}

Return plain text resume only. No JSON. No markdown symbols.`;

      const raw2 = await callAIText(p2, 1500);
      setResult(prev => ({ ...prev, optimizedResume: raw2.trim() || "Could not generate - please try again." }));

    } catch (e) {
      setErr(e.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const scoreColor = (s) => s >= 75 ? C.green : s >= 50 ? C.warn : C.danger;
  const importanceBg = (imp) => imp === "High" ? ["#450a0a", C.danger] : imp === "Medium" ? ["#451a03", C.warn] : ["#052e16", C.green];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 22, color: C.text, marginBottom: 4 }}>⚡ Resume Analyzer</div>
        <div style={{ color: C.muted, fontSize: 13 }}>Paste the job description + your resume. AI finds gaps, scores your fit, and rewrites your resume to match.</div>
      </div>

      {/* Input Section */}
      {!result && (
        <div className="fade">
          {err && (
            <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: C.danger, fontSize: 13 }}>
              ⚠ {err}
            </div>
          )}

          {/* JD Box */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${C.orange}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📋</div>
              <div>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>Job Description</div>
                <div style={{ color: C.muted, fontSize: 11 }}>Paste the full JD - the more detail, the better the analysis</div>
              </div>
            </div>
            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              placeholder={"Paste the job description here...\n\nExample:\nWe're looking for a Backend Developer with 2+ years of experience in Java, Spring Boot, microservices, REST APIs...\nRequirements: Docker, Kubernetes, AWS, CI/CD..."}
              style={{ ...inp, minHeight: 180, resize: "vertical", lineHeight: 1.7 }}
            />
            {jd && (
              <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, color: C.muted }}>{jd.split(/\s+/).filter(Boolean).length} words</span>
                <span style={{ fontSize: 10, color: jd.length > 200 ? C.green : C.warn }}>
                  {jd.length > 200 ? "✓ Good length" : "⚠ Add more detail for better results"}
                </span>
              </div>
            )}
          </div>

          {/* Resume Box */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${C.purple}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📄</div>
                <div>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>Your Resume</div>
                  <div style={{ color: C.muted, fontSize: 11 }}>Paste text or upload a .txt file</div>
                </div>
              </div>
              <button
                onClick={() => fileRef.current.click()}
                style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.soft, fontSize: 11, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
                📁 Upload .txt
              </button>
            </div>
            <input ref={fileRef} type="file" accept=".txt" onChange={e => {
              const f = e.target.files[0]; if (!f) return;
              const r = new FileReader();
              r.onload = ev => setResume(ev.target.result);
              r.readAsText(f);
            }} style={{ display: "none" }} />
            <textarea
              value={resume}
              onChange={e => setResume(e.target.value)}
              placeholder={"Paste your resume here...\n\nInclude: Education, Experience, Projects, Skills\n\nThe more complete your resume, the better the rewrite."}
              style={{ ...inp, minHeight: 220, resize: "vertical", lineHeight: 1.7 }}
            />
            {resume && (
              <div style={{ marginTop: 8 }}>
                <span style={{ fontSize: 10, color: resume.length > 300 ? C.green : C.warn }}>
                  {resume.length > 300 ? "✓ Resume looks complete" : "⚠ Resume seems short - add more details"}
                </span>
              </div>
            )}
          </div>

          <Btn
            onClick={analyze}
            disabled={!jd.trim() || !resume.trim() || loading}
            style={{ width: "100%", padding: "14px", fontSize: 15, letterSpacing: 0.3 }}>
            {loading ? <><Spin size={16} /> &nbsp; Analyzing...</> : "🔍 Analyze & Optimize Resume"}
          </Btn>
        </div>
      )}

      {/* Loading */}
      {loading && !result && (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: 64, marginBottom: 20, animation: "float 2s ease-in-out infinite" }}>🧠</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: C.text, marginBottom: 8 }}>Analyzing Your Resume</div>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>AI is reading the JD, scanning your resume, and crafting the perfect rewrite...</div>
          <Spin size={40} />
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="fade">
          {/* Score Header */}
          <div style={{ background: `linear-gradient(135deg,${C.purple}15,${C.orange}10)`, border: `1px solid ${C.purple}30`, borderRadius: 16, padding: 24, marginBottom: 16, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 40, marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 56, color: scoreColor(result.matchScore), lineHeight: 1 }}>{result.matchScore}</div>
                <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Match Score</div>
              </div>
              <div style={{ width: 1, background: C.border }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 56, color: scoreColor(result.atsScore), lineHeight: 1 }}>{result.atsScore}</div>
                <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>ATS Score</div>
              </div>
            </div>
            <div style={{ display: "inline-block", padding: "8px 20px", borderRadius: 20, background: result.matchScore >= 75 ? "#052e16" : result.matchScore >= 50 ? "#451a03" : "#450a0a", color: scoreColor(result.matchScore), fontWeight: 800, fontSize: 14, marginBottom: 12 }}>
              {result.verdict}
            </div>
            <div style={{ color: C.soft, fontSize: 13, lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>{result.summary}</div>
          </div>

          {/* Section Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
            {[["analysis", "📊 Analysis"], ["missing", "⚠️ Gaps"], ["projects", "🏗️ Projects"], ["resume", "✨ Optimized Resume"]].map(([key, label]) => (
              <button key={key} onClick={() => setActiveSection(key)}
                style={{ padding: "8px 16px", borderRadius: 20, border: `1px solid ${activeSection === key ? C.orange : C.border}`, background: activeSection === key ? `${C.orange}15` : "transparent", color: activeSection === key ? C.orange : C.soft, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: activeSection === key ? 700 : 400, fontSize: 12, whiteSpace: "nowrap", transition: "all 0.2s" }}>
                {label}
              </button>
            ))}
          </div>

          {/* Analysis Section */}
          {activeSection === "analysis" && (
            <div className="fade">
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 16 }}>✅</span>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>Strong Matches</div>
                  <span style={{ background: "#052e16", color: C.green, fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>{result.strongMatches?.length || 0}</span>
                </div>
                {result.strongMatches?.length > 0 ? result.strongMatches.map((m, i) => (
                  <div key={i} style={{ marginBottom: 14, background: "#0a0e18", borderRadius: 10, padding: 14, border: "1px solid #052e16" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, color: C.text, fontSize: 13 }}>{m.skill}</div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: scoreColor(m.strength) }}>{m.strength}%</div>
                    </div>
                    <div style={{ color: C.muted, fontSize: 12, marginBottom: 6 }}>{m.reason}</div>
                    <ScoreBar score={m.strength} color={C.green} />
                  </div>
                )) : <div style={{ color: C.muted, fontSize: 13 }}>No strong matches found. Consider tailoring your resume more closely to the JD.</div>}
              </div>

              {result.suggestedSkillsToAdd?.length > 0 && (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: 15, marginBottom: 12 }}>🎯 Skills to Add to Your Resume</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {result.suggestedSkillsToAdd.map((s, i) => (
                      <span key={i} style={{ background: `${C.purple}20`, color: C.purple, fontSize: 12, padding: "6px 14px", borderRadius: 20, fontWeight: 600 }}>+ {s}</span>
                    ))}
                  </div>
                </div>
              )}

              {result.weakAreas?.length > 0 && (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: 15, marginBottom: 12 }}>⚡ Areas to Strengthen</div>
                  {result.weakAreas.map((w, i) => (
                    <div key={i} style={{ background: "#0a0e18", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #451a03" }}>
                      <div style={{ fontWeight: 700, color: C.warn, fontSize: 13, marginBottom: 4 }}>{w.area}</div>
                      <div style={{ color: C.soft, fontSize: 12, lineHeight: 1.6 }}>{w.detail}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Missing Keywords Section */}
          {activeSection === "missing" && (
            <div className="fade">
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 16 }}>⚠️</span>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>Missing Keywords from JD</div>
                  <span style={{ background: "#450a0a", color: C.danger, fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>{result.missingKeywords?.length || 0} gaps</span>
                </div>
                {result.missingKeywords?.length > 0 ? result.missingKeywords.map((m, i) => {
                  const [bg, col] = importanceBg(m.importance);
                  return (
                    <div key={i} style={{ background: "#0a0e18", borderRadius: 10, padding: 14, marginBottom: 10, border: `1px solid ${bg}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ fontWeight: 700, color: C.text, fontSize: 13 }}>🔍 {m.keyword}</div>
                        <span style={{ background: bg, color: col, fontSize: 10, padding: "3px 10px", borderRadius: 10, fontWeight: 700 }}>{m.importance}</span>
                      </div>
                      <div style={{ color: C.soft, fontSize: 12, lineHeight: 1.6 }}>💡 {m.tip}</div>
                    </div>
                  );
                }) : (
                  <div style={{ textAlign: "center", padding: "24px 0", color: C.green, fontSize: 14 }}>
                    🎉 No critical missing keywords! Your resume covers the JD well.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {activeSection === "projects" && (
            <div className="fade">
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 15, marginBottom: 4 }}>🏗️ Project Relevance to This JD</div>
                <div style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>Which projects to keep, remove, or reframe for this role</div>
                {result.projectFit?.length > 0 ? result.projectFit.map((p, i) => (
                  <div key={i} style={{ background: "#0a0e18", borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${p.keep ? "#14532d" : "#1c1917"}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{p.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 800, fontSize: 16, color: scoreColor(p.relevance) }}>{p.relevance}%</span>
                        <span style={{ background: p.keep ? "#052e16" : "#1c1917", color: p.keep ? C.green : C.muted, fontSize: 10, padding: "3px 10px", borderRadius: 10, fontWeight: 700 }}>
                          {p.keep ? "✓ Keep" : "Low priority"}
                        </span>
                      </div>
                    </div>
                    <div style={{ color: C.soft, fontSize: 12, marginBottom: 8 }}>{p.reason}</div>
                    <ScoreBar score={p.relevance} color={scoreColor(p.relevance)} />
                    {p.suggestion && (
                      <div style={{ marginTop: 10, background: `${C.purple}10`, border: `1px solid ${C.purple}30`, borderRadius: 8, padding: "8px 12px", color: C.soft, fontSize: 12 }}>
                        💡 <strong style={{ color: C.purple }}>Suggestion:</strong> {p.suggestion}
                      </div>
                    )}
                  </div>
                )) : <div style={{ color: C.muted, fontSize: 13 }}>No projects detected. Make sure your resume includes a Projects section.</div>}
              </div>
            </div>
          )}

          {/* Optimized Resume Section */}
          {activeSection === "resume" && (
            <div className="fade">
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>✨ Optimized Resume</div>
                    <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>Tailored to this JD - ATS-optimized, Jake format, strong bullet points</div>
                  </div>
                  <Btn variant="green" onClick={() => navigator.clipboard.writeText(result.optimizedResume || "")} style={{ padding: "7px 14px", fontSize: 12 }}>
                    📋 Copy
                  </Btn>
                </div>
                <div style={{ background: "#070c14", border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
                  <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: C.soft, lineHeight: 1.9, fontFamily: "'DM Mono',monospace", maxHeight: 600, overflowY: "auto" }}>
                    {result.optimizedResume || "Resume could not be generated. Please try again."}
                  </pre>
                </div>
                <div style={{ marginTop: 14, background: `${C.green}10`, border: `1px solid ${C.green}30`, borderRadius: 10, padding: "12px 16px", fontSize: 12, color: C.soft, lineHeight: 1.6 }}>
                  💡 <strong style={{ color: C.green }}>Pro tip:</strong> Copy this into a Google Doc or Overleaf. Match formatting to a clean template. Always save as PDF before submitting.
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <Btn variant="ghost" onClick={() => { setResult(null); setErr(""); }} style={{ width: "100%", fontSize: 13 }}>
              🔄 Analyze Another Job
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// --- AUTH PAGE -------------------------------------------------------------
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr(""); setMsg(""); setLoading(true);
    try {
      if (mode === "register") {
        if (!form.name || !form.email || !form.password) throw new Error("All fields required");
        const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.name } } });
        if (error) throw error;
        setMsg("✅ Account created! Check your email to confirm, then sign in.");
        setMode("login");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        onLogin(data.user);
      }
    } catch (e) { setErr(e.message || "Something went wrong"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <style>{css}</style>
      {[["10%", "20%", "#FF5C1A"], ["80%", "70%", "#1DDB8B"]].map(([l, t, c], i) => (
        <div key={i} style={{ position: "absolute", left: l, top: t, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,${c}12,transparent 70%)`, pointerEvents: "none" }} />
      ))}
      <div className="fade" style={{ width: "100%", maxWidth: 420, background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 40, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="float" style={{ fontSize: 48, marginBottom: 8 }}>⚡</div>
          <div style={{ fontWeight: 800, fontSize: 30, background: `linear-gradient(135deg,${C.orange},${C.orangeLight})`, backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gradShift 3s ease infinite" }}>TakePlace</div>
          <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>It&apos;s your time. TakePlace.</div>
        </div>
        <div style={{ display: "flex", background: "#0a0e18", borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setErr(""); setMsg(""); }}
              style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 13, transition: "all 0.2s", background: mode === m ? C.border : "transparent", color: mode === m ? C.text : C.muted }}>
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "register" && <input style={inp} placeholder="Full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />}
          <input style={inp} placeholder="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} onKeyDown={e => e.key === "Enter" && handle()} />
          <input style={inp} placeholder="Password" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && handle()} />
        </div>
        {err && <div style={{ color: C.danger, fontSize: 12, marginTop: 10 }}>⚠ {err}</div>}
        {msg && <div style={{ color: C.green, fontSize: 12, marginTop: 10 }}>{msg}</div>}
        <Btn onClick={handle} disabled={loading} style={{ width: "100%", marginTop: 20, padding: "13px", fontSize: 14 }}>
          {loading ? <Spin size={16} /> : mode === "login" ? "Sign In →" : "Create Account →"}
        </Btn>
      </div>
    </div>
  );
}

// --- ONBOARD PAGE ----------------------------------------------------------
function OnboardPage({ user, onDone }) {
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{css}</style>
      <div className="fade" style={{ textAlign: "center", maxWidth: 520 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>👋</div>
        <div style={{ fontWeight: 800, fontSize: 32, color: C.text, marginBottom: 8 }}>
          Hey, <span style={{ background: `linear-gradient(135deg,${C.orange},${C.orangeLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{name.split(" ")[0]}!</span>
        </div>
        <div style={{ color: C.soft, fontSize: 15, lineHeight: 1.8, marginBottom: 36 }}>
          Welcome to TakePlace.<br />
          <strong style={{ color: C.text }}>Real jobs. AI resume. Zero guesswork.</strong>
        </div>
        {[
          { icon: "🔥", text: "Real live jobs from Adzuna - Indian companies updated daily" },
          { icon: "⚡", text: "Paste any JD + your resume → AI finds every gap instantly" },
          { icon: "🎯", text: "See which projects to keep and what keywords you're missing" },
          { icon: "✨", text: "Get a fully rewritten, ATS-optimized resume in seconds" },
        ].map((f, i) => (
          <div key={i} className="fade" style={{ display: "flex", alignItems: "center", gap: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 10, textAlign: "left", animationDelay: `${i * 0.08}s` }}>
            <span style={{ fontSize: 22 }}>{f.icon}</span>
            <span style={{ color: C.soft, fontSize: 13 }}>{f.text}</span>
          </div>
        ))}
        <Btn onClick={() => onDone()} style={{ marginTop: 24, padding: "13px 40px", fontSize: 15 }}>Let&apos;s Go →</Btn>
      </div>
    </div>
  );
}

// --- MAIN APP --------------------------------------------------------------
function MainApp({ user, onLogout }) {
  const [tab, setTab] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");
  const [search, setSearch] = useState("software engineer fresher");
  const [location, setLocation] = useState("hyderabad");
  const [expandedJob, setExpandedJob] = useState(null);
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async (q = search, loc = location) => {
    setJobsLoading(true); setJobsError("");
    try {
      const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&what=${encodeURIComponent(q)}&where=${encodeURIComponent(loc)}&sort_by=date&content-type=application/json`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.results?.length > 0) {
        setJobs(data.results.map(j => ({
          id: j.id, title: j.title,
          company: j.company?.display_name || "Company",
          location: j.location?.display_name || loc,
          salary: j.salary_min ? `₹${Math.round(j.salary_min / 100000)}–${Math.round((j.salary_max || j.salary_min * 1.5) / 100000)} LPA` : "Competitive",
          description: j.description || "No description available.",
          descriptionShort: (j.description || "").slice(0, 220),
          url: j.redirect_url,
          posted: new Date(j.created).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          category: j.category?.label || "Technology",
        })));
      } else { setJobsError("No jobs found. Try 'java developer' or 'python engineer'."); }
    } catch { setJobsError("Could not load jobs. Check your internet connection."); }
    setJobsLoading(false);
  };

  const TABS = ["🔥 Jobs", "⚡ Resume"];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Outfit',sans-serif" }}>
      <style>{css}</style>

      {/* Header */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "14px 20px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 800, fontSize: 20, background: `linear-gradient(135deg,${C.orange},${C.orangeLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>⚡ TakePlace</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 12, color: C.muted }}>Hey {name.split(" ")[0]} 👋</div>
            <Btn variant="ghost" onClick={onLogout} style={{ padding: "6px 12px", fontSize: 11 }}>Logout</Btn>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 53, zIndex: 99 }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex" }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)}
              style={{ flex: 1, padding: "14px 6px", border: "none", background: "transparent", cursor: "pointer", color: tab === i ? C.orange : C.muted, fontFamily: "'Outfit',sans-serif", fontWeight: tab === i ? 700 : 400, fontSize: 13, borderBottom: `2px solid ${tab === i ? C.orange : "transparent"}`, transition: "all 0.2s" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "20px 16px 60px" }}>

        {/* JOBS TAB */}
        {tab === 0 && (
          <div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <input style={inp} placeholder="Role (java developer...)" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchJobs()} />
                <input style={inp} placeholder="City (hyderabad...)" value={location} onChange={e => setLocation(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchJobs()} />
              </div>
              <Btn onClick={() => fetchJobs()} style={{ width: "100%" }}>🔍 Search Jobs</Btn>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>Live Job Feed</div>
              {!jobsLoading && jobs.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#052e16", borderRadius: 20, padding: "5px 12px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "pulse 1.5s infinite" }} />
                  <span style={{ color: C.green, fontSize: 11, fontWeight: 700 }}>{jobs.length} live jobs</span>
                </div>
              )}
            </div>

            {jobsLoading && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <Spin size={40} />
                <div style={{ color: C.muted, fontSize: 14, marginTop: 12 }}>Fetching real jobs...</div>
              </div>
            )}
            {jobsError && (
              <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 12, padding: 20, color: C.danger, textAlign: "center", fontSize: 13 }}>{jobsError}</div>
            )}

            {!jobsLoading && jobs.map((job, i) => {
              const isExpanded = expandedJob === job.id;
              return (
                <div key={job.id} className="fade hover" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", marginBottom: 12, borderLeft: `3px solid ${C.orange}`, animationDelay: `${i * 0.04}s` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{job.title}</div>
                      <div style={{ color: C.soft, fontSize: 12, marginTop: 2 }}>{job.company} - {job.location}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ color: C.green, fontWeight: 700, fontSize: 13 }}>{job.salary}</div>
                      <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{job.posted}</div>
                    </div>
                  </div>
                  <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 10, background: "#0a0e18", borderRadius: 8, padding: "8px 10px" }}>
                    {isExpanded ? job.description : job.descriptionShort + (job.description.length > 220 ? "..." : "")}
                    {job.description.length > 220 && (
                      <button onClick={() => setExpandedJob(isExpanded ? null : job.id)} style={{ background: "none", border: "none", color: "#60a5fa", fontSize: 11, cursor: "pointer", marginLeft: 6 }}>
                        {isExpanded ? "Show less ▲" : "Read more ▼"}
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ background: "#0c1a3a", color: "#60a5fa", fontSize: 10, padding: "3px 8px", borderRadius: 6 }}>{job.category}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn variant="ghost" onClick={() => { setTab(1); }} style={{ fontSize: 11, padding: "7px 12px" }}>⚡ Analyze Resume</Btn>
                      <Btn onClick={() => window.open(job.url, "_blank")} style={{ fontSize: 12, padding: "7px 16px" }}>Apply →</Btn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* RESUME TAB */}
        {tab === 1 && <ResumeAnalyzer />}

      </div>
    </div>
  );
}

// --- ROOT ------------------------------------------------------------------
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) setOnboarded(true);
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      if (session?.user) setOnboarded(true);
    });
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null); setOnboarded(false);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#07080f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{css}</style>
      <div style={{ textAlign: "center" }}>
        <span className="spin" style={{ fontSize: 48, color: "#FF5C1A", display: "inline-block" }}>⚡</span>
        <div style={{ color: "#4b5563", fontSize: 14, marginTop: 16, fontFamily: "'Outfit',sans-serif" }}>Loading TakePlace...</div>
      </div>
    </div>
  );

  if (!user) return <AuthPage onLogin={setUser} />;
  if (!onboarded) return <OnboardPage user={user} onDone={() => setOnboarded(true)} />;
  return <MainApp user={user} onLogout={logout} />;
}
