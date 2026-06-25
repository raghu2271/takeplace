const Razorpay = require("razorpay");

const PLANS = {
  week:  { amount: 4900,  currency: "INR" }, // ₹49 in paise
  month: { amount: 19900, currency: "INR" }, // ₹199 in paise
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { plan, userId } = req.body;
  if (!PLANS[plan]) return res.status(400).json({ error: "Invalid plan" });

  const razorpay = new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const order = await razorpay.orders.create({
      amount:   PLANS[plan].amount,
      currency: PLANS[plan].currency,
      receipt:  `tp_${userId}_${plan}_${Date.now()}`,
      notes:    { userId, plan },
    });

    res.json({
      id:       order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID, // safe to send key_id to frontend
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
