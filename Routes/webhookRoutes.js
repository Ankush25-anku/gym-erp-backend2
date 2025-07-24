const express = require("express");
const { Webhook } = require("svix");
const UserModel = require("../models/User"); // ensure correct path

const router = express.Router();
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

if (!CLERK_WEBHOOK_SECRET) {
  console.warn("⚠️ CLERK_WEBHOOK_SECRET not set in .env");
}

// Clerk requires raw body for signature verification
router.post("/", express.raw({ type: "application/json" }), (req, res) => {
  const headers = req.headers;
  const rawPayload = req.body; // This will be a Buffer

  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    const evt = wh.verify(rawPayload, headers);
    console.log("✅ Verified Clerk event:", evt.type);
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    res.status(400).json({ error: "Invalid signature" });
  }
});


module.exports = router;
