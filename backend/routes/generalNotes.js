const express = require("express");
const router = express.Router();
const GeneralNote = require("../models/GeneralNote");
const Cat = require("../models/Cat");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/:catId", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  console.log("Received Token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ error: "No token provided, authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id);
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { note } = req.body;
    const catId = req.params.catId;

    if (!note) {
      return res.status(400).json({ message: "Note is required" });
    }

    const cat = await Cat.findById(catId);
    if (!cat) {
      return res.status(404).json({ message: "Cat not found" });
    }

    if (cat.owner.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this cat" });
    }

    const generalNote = new GeneralNote({ note });
    await generalNote.save();

    if (!cat.generalNotes) {
      cat.generalNotes = [];
    }

    cat.generalNotes.push(generalNote._id);
    await cat.save();

    res.status(201).json(generalNote);
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});
console.log("Server started");
router.get("/:catId", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  console.log("Received Token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ error: "No token provided, authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id);
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const catId = req.params.catId;
    const cat = await Cat.findById(catId).populate("generalNotes");

    if (!cat) {
      return res.status(404).json({ message: "Cat not found" });
    }

    if (cat.owner.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this cat" });
    }

    res.status(200).json(cat.generalNotes);
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

router.delete("/:catId/:noteId", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  console.log("Received Token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ error: "No token provided, authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id);
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { catId, noteId } = req.params;
    const cat = await Cat.findById(catId);

    if (!cat) {
      return res.status(404).json({ message: "Cat not found" });
    }

    if (cat.owner.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this cat" });
    }

    const noteIndex = cat.generalNotes.indexOf(noteId);
    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    cat.generalNotes.splice(noteIndex, 1);
    await cat.save();

    await GeneralNote.findByIdAndDelete(noteId);

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
