// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     phone: {
//       type: String,
//       trim: true,
//     },

//     passwordHash: {
//       type: String,
//       required: true,
//     },

//     role: {
//       type: String,
//       enum: ["superadmin", "admin", "trainer", "member", "staff"], // ✅ Added superadmin
//       default: "member",
//     },

//     gymId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Gym",
//       default: null,
//     },

//     profileImage: {
//       type: String,
//       default: "",
//     },

//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "active",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.models.User || mongoose.model("User", userSchema);


// models/usermodel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    email: { type: String, index: true },
    avatarUrl: { type: String },
    phoneNumber: { type: String },
    role: { type: String, default: "owner" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    raw: { type: Object }, // optional: store the whole Clerk payload
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

