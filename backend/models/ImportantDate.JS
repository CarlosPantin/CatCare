const mongoose = require("mongoose");

const importantDateSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  event: { type: String, required: true },
  description: { type: String, default: "" },
});

const ImportantDate = mongoose.model("ImportantDate", importantDateSchema);

module.exports = ImportantDate;
