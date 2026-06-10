// api/ai.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt, maxTokens = 1500, mode = "text", image } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  // ── VISION REQUEST → Google Gemini Flash (free, no credit card) ──────
  if (image?.base64) {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not set in environment variables" });

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inline_data: {
                      mime_type: image.mediaType || "image/jpeg",
                      data: image.base64,
                    },
                  },
                  {
                    text: "Extract every single word of text from this image exactly as it appears. Return ONLY the raw extracted text. No explanations, no greetings, no commentary. Just the text.",
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 2000,
              temperature: 0.1,
            },
            systemInstruction: {
              parts: [
                {
                  text: "You are an OCR tool. Your only job is to extract and return the exact text visible in images. Output ONLY the raw text. Nothing else.",
                },
              ],
            },
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.error?.message || `Gemini API error: ${response.status}`;
        console.error("Gemini vision error:", errMsg);
        return res.status(response.status).json({ error: errMsg });
      }

      const data = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts
          ?.filter((p) => p.text)
          ?.map((p) => p.text)
          ?.join("\n") || "";

      if (!text.trim()) {
        return res.status(200).json({ error: "No text found in image. Try a clearer photo." });
      }

      return res.status(200).json({ text });
    } catch (err) {
      console.error("Vision handler error:", err);
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

  // Fallback chain: 70B best quality → 8B if rate limited
  const MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
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

  return res.status(429).json({
    error: `Service busy. Last error: ${lastError}. Please wait 30 seconds and try again.`,
  });
}
