const mongoose = require("mongoose");

const feedingScheduleSchema = new mongoose.Schema({
  time: { type: String, required: true },
  portion: { type: String, required: true },
  foodType: { type: String, required: true },
  notes: { type: String, default: "" },
});

const DietAndFeeding = mongoose.model("DietAndFeeding", feedingScheduleSchema);

module.exports = DietAndFeeding;
