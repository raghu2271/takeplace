
// api/ai.js  ← place this file at /api/ai.js in your project root
// Calls Groq API (free, fast, Llama 3 powered)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt, maxTokens = 1500, mode = "text" } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY not set in environment variables" });

  // System prompt differs by mode
  const systemPrompt = mode === "json"
    ? "You are an expert ATS analyst and resume reviewer. Always respond with valid JSON only. No markdown, no explanation, no backticks. Just raw JSON."
    : "You are an expert resume writer. Write clear, professional, ATS-optimized resumes. Return plain text only. No JSON, no markdown formatting symbols.";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "model: "llama-3.3-70b-versatile",      // Free, fast, great quality
        // Alternatives: "llama3-70b-8192" (better quality, slower)
        //               "mixtral-8x7b-32768" (long context)
        max_tokens: Math.min(maxTokens, 2000),
        temperature: mode === "json" ? 0.1 : 0.4,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `Groq API error: ${response.status}`;
      console.error("Groq error:", errMsg);
      return res.status(response.status).json({ error: errMsg });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "";

    return res.status(200).json({ text });
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
