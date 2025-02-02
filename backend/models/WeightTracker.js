const mongoose = require("mongoose");

const weightEntrySchema = new mongoose.Schema({
  weight: { type: Number, required: true },
  date: { type: Date, required: true },
  notes: { type: String, default: "" },
});

const WeightTracker = mongoose.model("WeightTracker", weightEntrySchema);

module.exports = WeightTracker;
