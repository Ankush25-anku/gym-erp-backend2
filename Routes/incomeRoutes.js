const express = require("express");
const router = express.Router();
const Income = require("../models/incomeModel");

// CREATE
router.post("/", async (req, res) => {
  try {
    const newIncome = new Income(req.body);
    const saved = await newIncome.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ (by gymId)
router.get("/", async (req, res) => {
  try {
    const { gymId } = req.query;
    const incomes = await Income.find({ gymId }).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
