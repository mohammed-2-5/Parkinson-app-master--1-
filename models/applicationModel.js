const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  version: { type: String, required: true },
  description: { type: String },
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
