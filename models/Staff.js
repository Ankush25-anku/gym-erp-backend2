const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: String,
    phone: String,
    position: String,
    status: {
      type: String,
      enum: ["Present", "Absent"], // 👈 ONLY these are allowed
      required: true,
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
    },
    userEmail: String, // the user who created/owns this staff member
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Staff", staffSchema);
