const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema(
  {
    gymId: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    source: String,
    amount: Number,
    date: Date,
    paymentMethod: String,
    description: String,
    referenceId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", IncomeSchema);
