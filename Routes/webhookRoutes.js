const express = require("express");
const { Webhook } = require("svix");
const UserModel = require("../models/User"); // ensure correct path

const router = express.Router();
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

if (!CLERK_WEBHOOK_SECRET) {
  console.warn("⚠️ CLERK_WEBHOOK_SECRET not set in .env");
}

// Clerk requires raw body for signature verification
router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    if (!CLERK_WEBHOOK_SECRET) {
      return res.status(500).json({ error: "Server config error" });
    }

    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).send("Missing Svix headers");
    }

    const payload = req.body; // raw Buffer
    const body = payload.toString();

    const wh = new Webhook(CLERK_WEBHOOK_SECRET);

    let evt;
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("❌ Webhook verification failed:", err);
      return res.status(400).send("Webhook verification failed");
    }

    const { id: clerkUserId, ...userData } = evt.data;
    const eventType = evt.type;
    console.log(`Clerk Webhook Event: ${eventType} for Clerk ID: ${clerkUserId}`);

    try {
      if (eventType === "user.created" || eventType === "user.updated") {
        const dataToSync = {
          clerkId: clerkUserId,
          name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
          email: userData.email_addresses?.[0]?.email_address || "dummy@gmail.com",
          avatarUrl: userData.image_url,
          phoneNumber:
            userData.phone_numbers?.[0]?.phone_number || "1111122222",
          role: userData.private_metadata?.role || "owner",
        };

        const upsertedUser = await UserModel.findOneAndUpdate(
          { clerkId: dataToSync.clerkId },
          {
            $set: {
              ...dataToSync,
              updatedAt: new Date(),
            },
            $setOnInsert: {
              createdAt: new Date(),
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log(`✅ Synced user ${dataToSync.clerkId}`);
        return res
          .status(200)
          .json({ message: "User synced successfully", user: upsertedUser });
      }

      if (eventType === "user.deleted") {
        await UserModel.deleteOne({ clerkId: clerkUserId });
        console.log(`🗑️ Deleted user ${clerkUserId}`);
        return res.status(200).json({ message: "User deleted successfully" });
      }

      console.log("Unhandled event type:", eventType);
      return res.status(200).send("Event received");
    } catch (error) {
      console.error("Error processing webhook:", error);
      return res.status(500).send("Webhook processing failed");
    }
  }
);

module.exports = router;
