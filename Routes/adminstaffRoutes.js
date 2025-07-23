const express = require("express");
const router = express.Router();
const AdminStaffAttendance = require("../models/adminstaffattendance");
const Staff = require("../models/Staff");
const verifyClerkToken = require("../middleware/verifyClerkToken");
const mongoose = require("mongoose");

// ✅ GET /list - Staff list by gymId
router.get("/list", verifyClerkToken, async (req, res) => {
  try {
    const { gymId } = req.query;

    if (!gymId || !mongoose.Types.ObjectId.isValid(gymId)) {
      return res.status(400).json({ error: "Valid gymId is required" });
    }

    const staffList = await Staff.find({ gymId });
    res.json(staffList);
  } catch (err) {
    console.error("❌ Failed to fetch staff by gymId:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET / - Attendance list by userEmail (from token) and/or gymId
router.get("/", verifyClerkToken, async (req, res) => {
  try {
    const userEmail = req.clerkUser?.email;
    const { gymId } = req.query;

    const filter = { userEmail };
    if (gymId && mongoose.Types.ObjectId.isValid(gymId)) {
      filter.gymId = gymId;
    }

    const attendance = await AdminStaffAttendance.find(filter).sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    console.error("❌ Error fetching attendance:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ POST / - Create new attendance record
router.post("/", verifyClerkToken, async (req, res) => {
  try {
    const { name, email, phone = "", status, date, time, remarks = "", gymId } = req.body;
    const userEmail = req.clerkUser?.email;

    // Validate required fields
    if (!userEmail || !gymId || !name || !email || !status || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(gymId)) {
      return res.status(400).json({ error: "Invalid gymId" });
    }

    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be 'Present' or 'Absent'." });
    }

    const newAttendance = new AdminStaffAttendance({
      userEmail,
      name,
      email,
      phone,
      status,
      date,
      time,
      remarks,
      gymId,
    });

    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (err) {
    console.error("❌ Error creating attendance:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ PUT /:id - Update attendance record
router.put("/:id", verifyClerkToken, async (req, res) => {
  try {
    const { name, email, phone = "", status, date, time, remarks = "", gymId } = req.body;
    const userEmail = req.clerkUser?.email;

    if (!userEmail || !gymId) {
      return res.status(400).json({ error: "userEmail and gymId are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(gymId)) {
      return res.status(400).json({ error: "Invalid gymId" });
    }

    if (status && !["Present", "Absent"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be 'Present' or 'Absent'." });
    }

    const updated = await AdminStaffAttendance.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        status,
        date,
        time,
        remarks,
        gymId,
        userEmail,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating attendance:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ DELETE /:id - Delete a record
router.delete("/:id", verifyClerkToken, async (req, res) => {
  try {
    await AdminStaffAttendance.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting attendance:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
