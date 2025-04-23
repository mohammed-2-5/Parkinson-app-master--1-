const express = require("express");
const router = express.Router();
const { createRating } = require("../controllers/ratingController");

router.post("/", createRating); // لا توجد تغييرات هنا، لأننا فقط نعدل طريقة إرسال البيانات.

module.exports = router;
