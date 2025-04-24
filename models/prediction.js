const mongoose = require("mongoose");

// تعريف الموديل للأعراض
const predictionSchema = new mongoose.Schema(
  {
    predictedResult: {
      type: String,
      required: true,
    },
    symptoms: [
      {
        _id: {
          type: String, // لأن الأعراض سيتم تحديدها من قبل النظام
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        value: {
          type: mongoose.Schema.Types.Mixed, // يمكن أن يكون true/false أو قيمة عشرية أو عدد صحيح
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // إضافة الوقت
  }
);

const Prediction = mongoose.model("Prediction", predictionSchema);
module.exports = Prediction;
