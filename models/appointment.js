const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  appointmentTime: { type: Date, required: true }, // تأكد أن القيمة هنا تتضمن التاريخ والوقت
  status: { type: String, default: "Scheduled" }, // الحالة: "Scheduled", "Confirmed", "Cancelled"
  paymentStatus: { type: String, default: "Pending" }, // حالة الدفع: "Pending", "Paid", "Failed"
  method: { type: String, default: "credit_card" }, // طريقة الدفع: "credit_card", "paypal"
  createdAt: { type: Date, default: Date.now }, // تاريخ إنشاء الموعد
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
