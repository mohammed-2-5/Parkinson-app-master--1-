const express = require("express");
const router = express.Router();
const {
  createDoctor,
  getDoctorById,
  getAllDoctors,
} = require("../controllers/doctorController");

// جلب كل الدكاترة
router.get("/", getAllDoctors);

// إضافة دكتور
router.post("/", createDoctor);

// جلب دكتور معين بالـ ID
router.get("/:doctorId", getDoctorById);

module.exports = router;
