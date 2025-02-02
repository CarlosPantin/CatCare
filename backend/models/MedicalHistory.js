const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  visits: [{
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
    medication: { type: String, default: null },
  }],
  vaccinations: [{
    name: { type: String, required: true },
    date: { type: Date, required: true },
    nextDue: { type: Date, required: true },
  }],
});

const MedicalHistory = mongoose.model('MedicalHistory', medicalHistorySchema);

module.exports = MedicalHistory;
