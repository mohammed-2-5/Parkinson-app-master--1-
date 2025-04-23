const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  inputType: { type: String, enum: ["symptoms", "image"], required: true },
  symptoms: { type: String, default: null },
  image: { type: String, default: null },
  predictedResult: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Prediction = mongoose.model("Prediction", predictionSchema);
module.exports = Prediction;
