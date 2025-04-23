const mongoose = require("mongoose");

// تعريف schema للطبيب
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true }, // تم تعديلها هنا لتكون specialty بدلاً من specialization
  hospital: { type: String, required: true },
  rating: { type: Number, default: 0 },
  region: { type: String, default: "" },
  fees: { type: Number, default: 0 },
  waitingTime: { type: String, default: "" },
  address: { type: String, default: "" },
  about: { type: String, default: "" },
  image: { type: String, default: "" },
});

// تعريف الموديل بناءً على الـ schema
const Doctor = mongoose.model("Doctor", doctorSchema);

// تصدير الموديل ليتم استخدامه في أماكن أخرى
module.exports = Doctor;
