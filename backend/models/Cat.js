const mongoose = require("mongoose");

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
    default: "Unknown",
  },
  neutered: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
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
    ref: "User",
    required: true,
  },
  medicalHistory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicalHistory",
  },
  dietAndFeeding: [
    { type: mongoose.Schema.Types.ObjectId, ref: "DietAndFeeding" },
  ],
  exerciseAndActivity: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExerciseAndActivity",
    },
  ],
  behaviorNotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BehaviorNote",
    },
  ],
  environmentalFactors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EnvironmentalFactor",
    },
  ],
  importantDates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ImportantDate",
    },
  ],
  photoGallery: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PhotoGallery",
    },
  ],
  weightTracker: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeightTracker",
    },
  ],
  shoppingList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShoppingList",
    },
  ],
  generalNotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GeneralNote",
    },
  ],
});

const Cat = mongoose.model("Cat", catSchema);

module.exports = Cat;
