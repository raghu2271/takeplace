// api/ai.js - Vercel Serverless Function
// Calls Gemini API server-side (no CORS issues, key stays hidden)
const GEMINI_KEY = "AIzaSyC-54kHb6x7YwVdFJ0M1o-TwaL15NKwldw";

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, maxTokens = 1500, mode = "json" } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "prompt is required" });
  }

  const systemInstruction =
    mode === "json"
      ? "Return ONLY raw JSON. No markdown, no backticks, no explanation. Start with { or [."
      : "";

  const fullPrompt =
    mode === "json" ? systemInstruction + "\n\n" + prompt : prompt;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: 0.3,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      return res.status(geminiRes.status).json({ error: errBody });
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
