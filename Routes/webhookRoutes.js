// Routes/webhookRoutes.js
const express = require("express");
const { Webhook } = require("svix");
const router = express.Router();
require("dotenv").config();

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

/**
 * -----------------------------------------------------
 * 1) TEMP ENDPOINT (no signature verification)
 *    Call this with Postman to quickly confirm the route
 *    is reachable and you see the payload.
 *    URL: POST /api/webhook/test
 * -----------------------------------------------------
 */
router.post("/test", express.raw({ type: "application/json" }), (req, res) => {
  let raw;
  if (Buffer.isBuffer(req.body)) {
    raw = req.body.toString();
  } else if (typeof req.body === "object") {
    raw = JSON.stringify(req.body);
  } else {
    raw = req.body || "";
  }

  console.log("🔍 [TEST] Webhook raw payload:", raw);

  try {
    const json = JSON.parse(raw || "{}");
    return res.status(200).json({ received: true, test: true, parsed: json });
  } catch (e) {
    return res.status(200).json({ received: true, test: true, raw });
  }
});

/**
 * -----------------------------------------------------
 * 2) PRODUCTION ENDPOINT (WITH Svix VERIFICATION)
 *    This is what Clerk should call.
 *    URL: POST /api/webhook
 * -----------------------------------------------------
 */
router.post("/", express.raw({ type: "application/json" }), (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  console.log("▶︎ /api/webhook hit");
  console.log("🔐 Secret loaded?", !!WEBHOOK_SECRET, WEBHOOK_SECRET ? `(len=${WEBHOOK_SECRET.length})` : "");
  console.log("▶︎ headers:", {
    "svix-id": req.headers["svix-id"],
    "svix-timestamp": req.headers["svix-timestamp"],
    "svix-signature-present": !!req.headers["svix-signature"],
  });
  console.log("▶︎ body is buffer?", Buffer.isBuffer(req.body), "size:", Buffer.isBuffer(req.body) ? req.body.length : 0);

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ error: "Server misconfigured: missing CLERK_WEBHOOK_SECRET" });
  }

  const { Webhook } = require("svix");
  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    const evt = wh.verify(req.body, req.headers);
    console.log(`✅ Verified: ${evt.type}`);
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }
});



router.get("/", (req, res) => {
  res.json({ message: "Webhook endpoint is up and running!" });
});

module.exports = router;
