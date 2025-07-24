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
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
      evt = wh.verify(req.body, req.headers); // Verify signature
    } catch (err) {
      console.error("❌ Webhook verification failed:", err.message);
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Now safely use the event
    const eventType = evt.type;
    const userData = evt.data; // This will contain the "user" object

    console.log(`✅ Clerk Event Received: ${eventType}`);
    console.log("User Data:", userData);

    // Example: store user info in DB
    if (eventType === "user.created") {
      // Save userData.id, userData.email_addresses, userData.first_name, etc.
    }

    return res.status(200).json({ success: true });
  }
);


router.get("/", (req, res) => {
  res.json({ message: "Webhook endpoint is up and running!" });
});

module.exports = router;
