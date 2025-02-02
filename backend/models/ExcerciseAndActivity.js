const mongoose = require("mongoose");

const exerciseActivitySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  activity: { type: String, required: true },
  duration: { type: Number, required: true },
  notes: { type: String, default: "" },
});

const ExerciseAndActivity = mongoose.model(
  "ExerciseAndActivity",
  exerciseActivitySchema
);

module.exports = ExerciseAndActivity;
