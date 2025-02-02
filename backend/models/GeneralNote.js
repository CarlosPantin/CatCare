const mongoose = require('mongoose');

const generalNoteSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  note: { type: String, required: true }, 
});

const GeneralNote = mongoose.model('GeneralNote', generalNoteSchema);

module.exports = GeneralNote;
