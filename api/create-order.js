const Razorpay = require("razorpay");

const PLANS = {
  week:       { amount: 4900,  currency: "INR" }, // ₹49 in paise
  month:      { amount: 19900, currency: "INR" }, // ₹199 in paise
  prep_week:  { amount: 5900,  currency: "INR" }, // ₹59 in paise
  prep_month: { amount: 19900, currency: "INR" }, // ₹199 in paise
};
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { plan, userId } = req.body || {};

  if (!plan || !PLANS[plan]) {
    return res.status(400).json({ error: "Invalid plan" });
  }
  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("Razorpay env vars missing");
    return res.status(500).json({ error: "Payment gateway not configured" });
  }

  const razorpay = new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    // IMPORTANT: Razorpay's `receipt` field has a hard 40-character limit.
    // Do NOT embed the userId (a 36-char UUID) here — that's what was
    // causing the "Could not create order (500)" error. userId/plan are
    // still safely stored in `notes` below, which has no length limit.
    const receipt = `tp_${Date.now()}`; // e.g. "tp_1719340800000" — well under 40 chars

    const order = await razorpay.orders.create({
      amount:   PLANS[plan].amount,
      currency: PLANS[plan].currency,
      receipt,
      notes: { userId, plan },
    });

    res.json({
      id:       order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID, // safe to send key_id to frontend
    });
  } catch (e) {
    // Razorpay errors usually come back as e.error.description; fall back to e.message
    const message = e?.error?.description || e?.message || "Unknown error creating order";
    console.error("Razorpay order creation failed:", e);
    res.status(500).json({ error: message });
  }
}
