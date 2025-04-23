const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getAppointmentsByUser,
  getAppointmentsByDoctor,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");

// إنشاء موعد
router.post("/", createAppointment);

// الحصول على كل المواعيد
router.get("/", getAllAppointments);

// الحصول على مواعيد يوزر معين
router.get("/user/:userId", getAppointmentsByUser);

// الحصول على مواعيد دكتور معين
router.get("/doctor/:doctorId", getAppointmentsByDoctor);

// تعديل موعد
router.put("/:id", updateAppointment);

// حذف موعد
router.delete("/:id", deleteAppointment);

module.exports = router;
