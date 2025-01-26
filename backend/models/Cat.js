const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    default: null,
  },
  breed: {
    type: String,
    default: 'Unknown',
  },
  neutered: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  weight: {
    type: Number,
    default: null,
  },
  photo: {
    type: String, 
    default: null,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Cat = mongoose.model('Cat', catSchema);

module.exports = Cat;
