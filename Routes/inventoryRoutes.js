const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");

// GET all items for a gym
router.get("/", async (req, res) => {
  try {
    const { gymId } = req.query;
    if (!gymId) return res.status(400).json({ error: "Missing gymId" });

    const items = await Inventory.find({ gymId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

// POST add new item
router.post("/", async (req, res) => {
  try {
    const { gymId, itemName, quantity, status, notes } = req.body;

    if (!gymId || !itemName || quantity === undefined || !status) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const newItem = new Inventory({ gymId, itemName, quantity, status, notes });
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to save inventory item" });
  }
});

// PUT update item
router.put("/:id", async (req, res) => {
  try {
    const { gymId, itemName, quantity, status, notes } = req.body;

    if (!gymId || !itemName || quantity === undefined || !status) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const updated = await Inventory.findByIdAndUpdate(
      req.params.id,
      { gymId, itemName, quantity, status, notes },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Item not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

// DELETE item
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Inventory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Item not found" });

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

module.exports = router;
