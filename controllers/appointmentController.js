const Appointment = require("../models/appointment");

// إنشاء موعد
const createAppointment = async (req, res) => {
  try {
    const {
      userId,
      doctorId,
      date,
      time,
      paymentStatus = "Pending",
      method = "credit_card",
    } = req.body;

    // تحقق إذا كان الدكتور محجوز في نفس الوقت
    const appointmentTime = new Date(`${date} ${time}`);
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentTime,
    });

    if (existingAppointment) {
      return res.status(400).json({
        message:
          "Doctor is already booked at this time. Please choose another time.",
      });
    }

    const newAppointment = new Appointment({
      userId,
      doctorId,
      appointmentTime,
      paymentStatus,
      method,
    });
    await newAppointment.save();

    res.status(201).json(newAppointment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating appointment", error: error.message });
  }
};

// الحصول على كل المواعيد
const getAllAppointments = async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};

    if (date) {
      query.appointmentTime = {
        $gte: new Date(date),
      };
    }

    const appointments = await Appointment.find(query)
      .populate("userId")
      .populate("doctorId");
    res.status(200).json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

// الحصول على مواعيد يوزر معين
const getAppointmentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ userId }).populate(
      "doctorId"
    );
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user's appointments",
      error: error.message,
    });
  }
};

// الحصول على مواعيد دكتور معين
const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctorId }).populate(
      "userId"
    );
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching doctor's appointments",
      error: error.message,
    });
  }
};

// تعديل موعد
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentTime, status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { appointmentTime, status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({
      message: "Error updating appointment",
      error: error.message,
    });
  }
};

// حذف موعد
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting appointment",
      error: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentsByUser,
  getAppointmentsByDoctor,
  updateAppointment,
  deleteAppointment,
};
