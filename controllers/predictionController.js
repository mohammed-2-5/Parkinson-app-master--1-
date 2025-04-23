const Prediction = require("../models/prediction");

// إنشاء تنبؤ جديد
const createPrediction = async (req, res) => {
  try {
    const { userId, inputType, symptoms, image, predictedResult } = req.body;

    const newPrediction = new Prediction({
      userId,
      inputType,
      symptoms: inputType === "symptoms" ? symptoms : null,
      image: inputType === "image" ? image : null,
      predictedResult,
    });

    await newPrediction.save();
    res.status(201).json(newPrediction);
  } catch (error) {
    res.status(500).json({
      message: "Error creating prediction",
      error: error.message,
    });
  }
};

// جلب كل التنبؤات
const getAllPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find();
    res.status(200).json(predictions);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching predictions",
      error: error.message,
    });
  }
};

// جلب التنبؤات لمستخدم معين
const getPredictionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const predictions = await Prediction.find({ userId });
    res.status(200).json(predictions);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching predictions by user",
      error: error.message,
    });
  }
};

// جلب التنبؤات حسب النتيجة
const getPredictionsByResult = async (req, res) => {
  try {
    const { result } = req.params;
    const predictions = await Prediction.find({ predictedResult: result });
    res.status(200).json(predictions);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching predictions by result",
      error: error.message,
    });
  }
};

module.exports = {
  createPrediction,
  getAllPredictions,
  getPredictionsByUser,
  getPredictionsByResult,
};
