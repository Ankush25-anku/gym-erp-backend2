const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Create notification
router.post("/", async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    const saved = await newNotification.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to create notification" });
  }
});

// Get all notifications for a gym
router.get("/", async (req, res) => {
  const { gymId } = req.query;
  try {
    const notifications = await Notification.find({ gymId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Update notification
router.put("/:id", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update notification" });
  }
});

// Delete notification
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

module.exports = router;