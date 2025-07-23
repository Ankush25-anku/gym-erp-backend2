// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");

// Create payment
router.post("/", async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    console.error("🛑 POST /api/payments error:", err);
    res.status(500).json({ error: err.message });
  }
});


// Get all payments by gymId
router.get("/", async (req, res) => {
  try {
    const { gymId } = req.query;
    const payments = await Payment.find({ gymId });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update payment
router.put("/:id", async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete payment
router.delete("/:id", async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
