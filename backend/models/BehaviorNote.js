const mongoose = require("mongoose");

const behaviorNoteSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  note: { type: String, required: true },
});

const BehaviorNote = mongoose.model("BehaviorNote", behaviorNoteSchema);

module.exports = BehaviorNote;
