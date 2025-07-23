// const express = require("express");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const router = express.Router();
// const User = require("../models/User");
// const ALLOWED_ROLES = require("../config/allowedRoles");

// // 🔐 Ensure you have JWT_SECRET in .env
// // e.g., JWT_SECRET=yourSecretKey

// // ✅ REGISTER
// router.post("/register", async (req, res) => {
//   const { email, password, role } = req.body;

//   if (!email || !password || !role) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   if (!ALLOWED_ROLES.includes(role)) {
//     return res.status(400).json({ error: "Invalid role provided" });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await User.create({
//       email,
//       password: hashedPassword,
//       role,
//     });

//     res.status(201).json({ message: "User registered", role: newUser.role });
//   } catch (err) {
//     console.error("Registration Error:", err);
//     res.status(500).json({ error: "Registration failed" });
//   }
// });

// // ✅ LOGIN
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required" });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     // ✅ Generate JWT Token
//     const token = jwt.sign(
//       {
//         _id: user._id,
//         email: user.email,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       message: "Login successful",
//       token, // ✅ Send token to frontend
//       user: {
//         _id: user._id,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Login Error:", err);
//     res.status(500).json({ error: "Login failed" });
//   }
// });

// module.exports = router;
