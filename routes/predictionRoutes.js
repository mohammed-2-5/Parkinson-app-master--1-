const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { createPrediction } = require("../controllers/predictionController");

// إعداد التخزين للصور
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// إعداد رفع الملفات (يقبل صورة واحدة باسم 'image')
const upload = multer({ storage });

// الراوت لإنشاء التنبؤ
router.post("/predict", upload.single("image"), createPrediction);

module.exports = router;
