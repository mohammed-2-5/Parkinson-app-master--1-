const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: {
    type: Number,
    required: true,
    min: 1, // أقل قيمة للتقييم
    max: 5, // أعلى قيمة للتقييم
  },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
