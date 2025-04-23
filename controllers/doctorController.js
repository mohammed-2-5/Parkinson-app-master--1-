const mongoose = require("mongoose");
const Doctor = require("../models/doctor");

// دالة إنشاء طبيب
const createDoctor = async (req, res) => {
  try {
    const {
      name,
      specialty,
      hospital,
      rating,
      region,
      fees,
      waitingTime,
      address,
      about,
      image,
    } = req.body;
    const newDoctor = new Doctor({
      name,
      specialty,
      hospital,
      rating,
      region,
      fees,
      waitingTime,
      address,
      about,
      image,
    });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(500).json({
      message: "Error creating doctor",
      error: error.message,
    });
  }
};

// دالة الحصول على طبيب معين
const getDoctorById = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    // التأكد من أن الـ ID الذي تم تمريره هو ObjectId صالح
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // البحث عن الطبيب باستخدام الـ ID
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching doctor",
      error: error.message,
    });
  }
};

// دالة جلب كل الدكاترة
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};

// تصدير الدوال
module.exports = { createDoctor, getDoctorById, getAllDoctors };
