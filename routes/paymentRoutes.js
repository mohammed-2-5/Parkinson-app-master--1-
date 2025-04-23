const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  stripeWebhook,
} = require("../controllers/paymentController");

router.post("/create-checkout-session", createCheckoutSession);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }), // لازم نستخدم express.raw للمحتوى الخام
  stripeWebhook
);

module.exports = router;
