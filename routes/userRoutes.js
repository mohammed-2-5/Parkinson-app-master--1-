// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  getProfile,
  deleteUser,
} = require("../controllers/userController");

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/update/:id", updateProfile);
router.put("/:id/change-password", changePassword);
router.get("/profile/:id", getProfile);
router.delete("/delete/:id", deleteUser);

module.exports = router;
