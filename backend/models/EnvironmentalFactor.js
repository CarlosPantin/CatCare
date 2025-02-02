const mongoose = require("mongoose");

const environmentalFactorSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  factor: { type: String, required: true },
  description: { type: String, default: "" },
});

const EnvironmentalFactor = mongoose.model(
  "EnvironmentalFactor",
  environmentalFactorSchema
);

module.exports = EnvironmentalFactor;
