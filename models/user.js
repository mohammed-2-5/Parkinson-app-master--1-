const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    region: { type: String, required: true },
    gender: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    settings: {
      notifications: { type: Boolean, default: true },
      language: { type: String, default: "en" },
      theme: { type: String, default: "light" },
    },
    profileImage: { type: String }, // حقل جديد للصورة الشخصية
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
