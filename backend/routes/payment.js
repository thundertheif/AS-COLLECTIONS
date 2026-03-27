const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

// ✅ FORCE TEST MODE CHECK
if (!process.env.RAZORPAY_KEY_ID.startsWith("rzp_test_")) {
  console.error("❌ ERROR: You are using LIVE Razorpay key!");
  process.exit(1); // stop server
}

// ✅ Initialize Razorpay (TEST MODE)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Order (ONLY ONE ROUTE)
router.post("/create-order", async (req, res) => {
  try {
    let { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    amount = Math.round(amount);

    const order = await razorpay.orders.create({
      amount: amount * 100, // paisa
      currency: "INR",
      receipt: "test_order_" + Date.now(), // 👈 mark as test
    });

    res.json({
      success: true,
      order,
      mode: "TEST",
    });

  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// ✅ Verify Payment
router.post("/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      return res.json({
        success: true,
        message: "✅ Test Payment Verified",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "❌ Invalid signature",
      });
    }

  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;