const Rating = require("../models/rating");

const createRating = async (req, res) => {
  try {
    const { applicationId, userId, rating, comment } = req.body;

    // التحقق من أن التقييم بين 1 و 5
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    const newRating = new Rating({ applicationId, userId, rating, comment });
    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating rating", error: error.message });
  }
};

module.exports = { createRating };
