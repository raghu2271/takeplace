import { useState, useCallback } from "react";

// Calls our own Vercel serverless function — no CORS, no key exposure
async function callAI(prompt, mode = "json", maxTokens = 1500) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, mode, maxTokens }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.text;
}

function parseJSON(raw) {
  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
}

const SCORE_COLOR = (s) => {
  if (s >= 80) return "#22c55e";
  if (s >= 60) return "#f59e0b";
  return "#ef4444";
};

export default function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");

  const analyze = useCallback(async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);

    try {
      // Step 1: Score & overview
      setStep("Scoring your resume…");
      const overviewRaw = await callAI(
        `You are an expert resume reviewer. Analyze this resume${jobDesc ? " against the job description" : ""} and return JSON:
{
  "overallScore": <0-100>,
  "atsScore": <0-100>,
  "readabilityScore": <0-100>,
  "impactScore": <0-100>,
  "summary": "<2-sentence overall verdict>",
  "topStrengths": ["<strength1>","<strength2>","<strength3>"],
  "criticalIssues": ["<issue1>","<issue2>","<issue3>"]
}

RESUME:
${resumeText}
${jobDesc ? `\nJOB DESCRIPTION:\n${jobDesc}` : ""}`,
        "json",
        800
      );

      const overview = parseJSON(overviewRaw);
      if (!overview) throw new Error("Could not parse overview response.");

      // Step 2: Section-by-section feedback
      setStep("Analyzing each section…");
      const sectionsRaw = await callAI(
        `Analyze the sections of this resume. Return JSON array:
[
  { "section": "<Section Name>", "score": <0-100>, "feedback": "<specific feedback>", "suggestions": ["<fix1>","<fix2>"] }
]
Include sections like: Contact Info, Summary/Objective, Work Experience, Education, Skills, Projects (if present).

RESUME:
${resumeText}`,
        "json",
        1000
      );
      const sections = parseJSON(sectionsRaw) || [];

      // Step 3: Keyword analysis (only if job desc provided)
      let keywords = null;
      if (jobDesc.trim()) {
        setStep("Matching keywords…");
        const kwRaw = await callAI(
          `Compare this resume to the job description. Return JSON:
{
  "matchedKeywords": ["<kw1>","<kw2>"],
  "missingKeywords": ["<kw1>","<kw2>"],
  "matchScore": <0-100>
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDesc}`,
          "json",
          600
        );
        keywords = parseJSON(kwRaw);
      }

      // Step 4: Rewrite suggestions
      setStep("Generating improvement tips…");
      const rewriteRaw = await callAI(
        `Give 4 specific, actionable bullet-point rewrites or improvements for this resume. Return JSON array of objects:
[{ "original": "<original text or issue>", "improved": "<improved version>", "reason": "<why this is better>" }]

RESUME:
${resumeText}`,
        "json",
        900
      );
      const rewrites = parseJSON(rewriteRaw) || [];

      setResult({ overview, sections, keywords, rewrites });
      setTab("overview");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setStep("");
    }
  }, [resumeText, jobDesc]);

  const ScoreRing = ({ score, label, size = 80 }) => {
    const r = size / 2 - 8;
    const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;
    const color = SCORE_COLOR(score);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={7} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={7}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
          <text x={size / 2} y={size / 2 + 5} textAnchor="middle"
            fill={color} fontSize={size > 70 ? 18 : 13} fontWeight="700" fontFamily="'DM Mono', monospace">
            {score}
          </text>
        </svg>
        <span style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0f1e",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#e2e8f0",
      padding: "0 0 60px"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        borderBottom: "1px solid #1e293b", padding: "28px 24px 24px"
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 28 }}>📄</span>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em",
              background: "linear-gradient(90deg,#818cf8,#c084fc)", WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent" }}>
              Resume Analyzer
            </h1>
          </div>
          <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
            AI-powered resume scoring, keyword matching & actionable feedback
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 0" }}>

        {/* Input area */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 6,
              textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Resume Text *
            </label>
            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your full resume here…"
              rows={10}
              style={{
                width: "100%", background: "#0f172a", border: "1px solid #1e293b",
                borderRadius: 10, color: "#e2e8f0", padding: "12px", fontSize: 13,
                resize: "vertical", outline: "none", boxSizing: "border-box",
                fontFamily: "inherit", lineHeight: 1.6,
                transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "#818cf8"}
              onBlur={e => e.target.style.borderColor = "#1e293b"}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 6,
              textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Job Description <span style={{ color: "#475569" }}>(optional)</span>
            </label>
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the job description for keyword matching…"
              rows={10}
              style={{
                width: "100%", background: "#0f172a", border: "1px solid #1e293b",
                borderRadius: 10, color: "#e2e8f0", padding: "12px", fontSize: 13,
                resize: "vertical", outline: "none", boxSizing: "border-box",
                fontFamily: "inherit", lineHeight: 1.6,
                transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "#818cf8"}
              onBlur={e => e.target.style.borderColor = "#1e293b"}
            />
          </div>
        </div>

        {error && (
          <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 8,
            padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#fca5a5" }}>
            ⚠ {error}
          </div>
        )}

        <button
          onClick={analyze}
          disabled={loading}
          style={{
            width: "100%", padding: "14px", borderRadius: 10, border: "none",
            background: loading ? "#1e293b" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: loading ? "#475569" : "#fff", fontSize: 15, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.02em",
            transition: "opacity 0.2s", marginBottom: 28
          }}
        >
          {loading ? `⏳ ${step}` : "✨ Analyze Resume"}
        </button>

        {/* Results */}
        {result && (
          <div>
            {/* Score cards */}
            <div style={{
              background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14,
              padding: "24px", marginBottom: 20, display: "flex", justifyContent: "space-around",
              flexWrap: "wrap", gap: 16
            }}>
              <ScoreRing score={result.overview.overallScore} label="Overall" size={90} />
              <ScoreRing score={result.overview.atsScore} label="ATS" size={90} />
              <ScoreRing score={result.overview.readabilityScore} label="Readability" size={90} />
              <ScoreRing score={result.overview.impactScore} label="Impact" size={90} />
              {result.keywords && (
                <ScoreRing score={result.keywords.matchScore} label="Job Match" size={90} />
              )}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: "1px solid #1e293b" }}>
              {["overview", "sections", result.keywords ? "keywords" : null, "rewrites"]
                .filter(Boolean).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: "8px 18px", background: "none", border: "none",
                  borderBottom: tab === t ? "2px solid #818cf8" : "2px solid transparent",
                  color: tab === t ? "#818cf8" : "#64748b", cursor: "pointer", fontSize: 13,
                  fontWeight: tab === t ? 700 : 400, textTransform: "capitalize",
                  transition: "color 0.2s"
                }}>
                  {t === "keywords" ? "Keywords" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 24 }}>

              {tab === "overview" && (
                <div>
                  <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginTop: 0, fontSize: 14 }}>
                    {result.overview.summary}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
                    <div>
                      <h3 style={{ margin: "0 0 10px", color: "#22c55e", fontSize: 13,
                        textTransform: "uppercase", letterSpacing: "0.08em" }}>✅ Top Strengths</h3>
                      {result.overview.topStrengths.map((s, i) => (
                        <div key={i} style={{ padding: "8px 12px", background: "#052e16",
                          border: "1px solid #14532d", borderRadius: 8, marginBottom: 8,
                          fontSize: 13, color: "#86efac" }}>
                          {s}
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3 style={{ margin: "0 0 10px", color: "#ef4444", fontSize: 13,
                        textTransform: "uppercase", letterSpacing: "0.08em" }}>⚡ Critical Issues</h3>
                      {result.overview.criticalIssues.map((s, i) => (
                        <div key={i} style={{ padding: "8px 12px", background: "#450a0a",
                          border: "1px solid #7f1d1d", borderRadius: 8, marginBottom: 8,
                          fontSize: 13, color: "#fca5a5" }}>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === "sections" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {result.sections.map((sec, i) => (
                    <div key={i} style={{ border: "1px solid #1e293b", borderRadius: 10, padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{sec.section}</span>
                        <span style={{ fontWeight: 700, fontSize: 14, color: SCORE_COLOR(sec.score) }}>
                          {sec.score}/100
                        </span>
                      </div>
                      <div style={{ height: 4, background: "#1e293b", borderRadius: 4, marginBottom: 10 }}>
                        <div style={{ height: "100%", width: `${sec.score}%`, background: SCORE_COLOR(sec.score),
                          borderRadius: 4, transition: "width 1s ease" }} />
                      </div>
                      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
                        {sec.feedback}
                      </p>
                      {sec.suggestions?.length > 0 && (
                        <div>
                          {sec.suggestions.map((sg, j) => (
                            <div key={j} style={{ fontSize: 12, color: "#818cf8", padding: "4px 0",
                              paddingLeft: 12, borderLeft: "2px solid #4338ca" }}>
                              → {sg}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tab === "keywords" && result.keywords && (
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ margin: "0 0 10px", color: "#22c55e", fontSize: 13,
                      textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      ✅ Matched Keywords ({result.keywords.matchedKeywords.length})
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {result.keywords.matchedKeywords.map((kw, i) => (
                        <span key={i} style={{ background: "#052e16", border: "1px solid #14532d",
                          borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#86efac" }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 10px", color: "#ef4444", fontSize: 13,
                      textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      ❌ Missing Keywords ({result.keywords.missingKeywords.length})
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {result.keywords.missingKeywords.map((kw, i) => (
                        <span key={i} style={{ background: "#450a0a", border: "1px solid #7f1d1d",
                          borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#fca5a5" }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === "rewrites" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {result.rewrites.map((rw, i) => (
                    <div key={i} style={{ border: "1px solid #1e293b", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ background: "#450a0a", padding: "10px 14px", fontSize: 12,
                        color: "#fca5a5", borderBottom: "1px solid #7f1d1d" }}>
                        <strong>Before:</strong> {rw.original}
                      </div>
                      <div style={{ background: "#052e16", padding: "10px 14px", fontSize: 12,
                        color: "#86efac", borderBottom: "1px solid #14532d" }}>
                        <strong>After:</strong> {rw.improved}
                      </div>
                      <div style={{ padding: "8px 14px", fontSize: 12, color: "#64748b" }}>
                        💡 {rw.reason}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
