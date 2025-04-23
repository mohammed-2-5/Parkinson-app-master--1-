const express = require("express");
const router = express.Router();
const {
  createPrediction,
  getAllPredictions,
  getPredictionsByUser,
  getPredictionsByResult,
} = require("../controllers/predictionController");

router.post("/", createPrediction); // إضافة تنبؤ
router.get("/", getAllPredictions); // كل التنبؤات
router.get("/user/:userId", getPredictionsByUser); // تنبؤات مستخدم معين
router.get("/result/:result", getPredictionsByResult); // تنبؤات حسب النتيجة

module.exports = router;
