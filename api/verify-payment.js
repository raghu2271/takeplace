import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role key — never expose this to the client
);

const PLAN_DAYS = { week: 7, month: 30, prep_week: 7, prep_month: 30 };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
    userId,
  } = req.body || {};

  // Validate all required fields are present before doing anything else
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ ok: false, error: "Missing Razorpay payment fields" });
  }
  if (!plan || !PLAN_DAYS[plan]) {
    return res.status(400).json({ ok: false, error: "Missing or invalid plan" });
  }
  if (!userId) {
    return res.status(400).json({ ok: false, error: "Missing userId" });
  }
  if (!process.env.RAZORPAY_KEY_SECRET) {
    console.error("RAZORPAY_KEY_SECRET missing");
    return res.status(500).json({ ok: false, error: "Payment gateway not configured" });
  }

  try {
    // 1. Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ ok: false, error: "Invalid signature" });
    }

    // 2. Write subscription to Supabase
    const days = PLAN_DAYS[plan];
    const expiresAt = new Date(Date.now() + days * 86400 * 1000).toISOString();

    const { error } = await supabase.from("user_subscriptions").insert({
      user_id:    userId,
      plan,
      status:     "active",
      expires_at: expiresAt,
      payment_id: razorpay_payment_id,
      order_id:   razorpay_order_id,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ ok: false, error: error.message });
    }

    res.json({ ok: true });
  } catch (e) {
    console.error("verify-payment handler error:", e);
    res.status(500).json({ ok: false, error: e.message || "Verification failed" });
  }
}
