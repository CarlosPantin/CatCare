const mongoose = require("mongoose");

const photoGallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  description: { type: String, default: "" },
  dateAdded: { type: Date, default: Date.now },
});

const PhotoGallery = mongoose.model("PhotoGallery", photoGallerySchema);

module.exports = PhotoGallery;
