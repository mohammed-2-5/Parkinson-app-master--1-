const express = require("express");
const router = express.Router();
const { createPrediction } = require("../controllers/predictionController");

// راوتر التنبؤ
router.post("/predict", createPrediction);

module.exports = router;
