// api/ai.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt, maxTokens = 1500, mode = "text", image } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  // ── VISION REQUEST → Anthropic Claude Haiku (Groq has no vision) ──────
  if (image?.base64) {
    const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_KEY) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: Math.min(maxTokens, 2000),
          system: "You are an OCR tool. Extract and return ONLY the exact text visible in the image. No greetings, no explanations, no commentary, no questions. Just the raw text from the image exactly as it appears.",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: image.mediaType || "image/jpeg",
                    data: image.base64,
                  },
                },
                { type: "text", text: prompt },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return res.status(response.status).json({
          error: errData?.error?.message || `Anthropic error: ${response.status}`,
        });
      }

      const data = await response.json();
      const text = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n");

      return res.status(200).json({ text });
    } catch (err) {
      console.error("Vision error:", err);
      return res.status(500).json({ error: err.message || "Vision request failed" });
    }
  }

  // ── TEXT / JSON REQUEST → Groq with fallback chain ───────────────────
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY not set" });

  const systemPrompt =
    mode === "json"
      ? "You are an expert ATS analyst and resume reviewer. Always respond with valid JSON only. No markdown, no explanation, no backticks. Just raw JSON."
      : "You are an expert resume writer. Write clear, professional, ATS-optimized content. Return plain text only.";

  // Model fallback chain: try 70B first → fall back to 8B if rate limited
  const MODELS = [
    "llama-3.3-70b-versatile",  // best quality
    "llama-3.1-8b-instant",     // faster, higher rate limits
  ];

  let lastError = "";

  for (const model of MODELS) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          max_tokens: Math.min(maxTokens, 2000),
          temperature: mode === "json" ? 0.1 : 0.4,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
        }),
      });

      // Rate limited → try next model in chain
      if (response.status === 429) {
        const errData = await response.json().catch(() => ({}));
        lastError = errData?.error?.message || "Rate limit hit";
        console.warn(`Rate limited on ${model}, trying fallback...`);
        continue;
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        lastError = errData?.error?.message || `Groq error: ${response.status}`;
        console.error(`Groq error on ${model}:`, lastError);
        continue;
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content || "";
      return res.status(200).json({ text });

    } catch (err) {
      lastError = err.message || "Network error";
      console.error(`Exception on ${model}:`, lastError);
      continue;
    }
  }

  // All models failed
  return res.status(429).json({
    error: `All models failed. Last error: ${lastError}. Please wait 30 seconds and try again.`,
  });
}
