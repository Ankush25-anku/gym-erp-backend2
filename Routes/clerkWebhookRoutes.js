const express = require("express");
const { Webhook } = require("svix");
const router = express.Router();
const bodyParser = require("body-parser");
require("dotenv").config(); // ✅ Load env

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

router.use(bodyParser.raw({ type: "application/json" }));

router.post("/", async (req, res) => {
  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  const eventType = evt.type;
  const eventData = evt.data;

  console.log(`✅ Received Clerk event: ${eventType}`);
  console.log("Event Data:", eventData);

  res.status(200).json({ received: true });
});

module.exports = router;
