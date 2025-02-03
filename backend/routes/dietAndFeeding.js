const express = require("express");
const router = express.Router();
const DietAndFeeding = require("../models/DietAndFeeding");
const Cat = require("../models/Cat");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ error: "No token provided, authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Create a feeding schedule
router.post("/:catId", authenticateUser, async (req, res) => {
  try {
    const { time, portion, foodType, notes } = req.body;
    const catId = req.params.catId;

    if (!time || !portion || !foodType) {
      return res
        .status(400)
        .json({ error: "Time, portion, and foodType are required" });
    }

    const cat = await Cat.findById(catId);
    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    if (cat.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this cat" });
    }

    const dietEntry = new DietAndFeeding({ time, portion, foodType, notes });
    await dietEntry.save();

    if (!cat.dietAndFeeding) {
      cat.dietAndFeeding = [];
    }

    cat.dietAndFeeding.push(dietEntry._id);
    await cat.save();

    res.status(201).json(dietEntry);
  } catch (error) {
    console.error("Error adding diet and feeding entry:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all feeding schedules for a cat
router.get("/:catId", authenticateUser, async (req, res) => {
  try {
    const catId = req.params.catId;
    const cat = await Cat.findById(catId).populate("dietAndFeeding");

    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    if (cat.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this cat" });
    }

    res.status(200).json(cat.dietAndFeeding);
  } catch (error) {
    console.error("Error fetching feeding schedule:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update a feeding entry
router.put("/:catId/:entryId", authenticateUser, async (req, res) => {
  try {
    const { time, portion, foodType, notes } = req.body;
    const { catId, entryId } = req.params;

    const cat = await Cat.findById(catId);
    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    if (cat.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this cat" });
    }

    const updatedEntry = await DietAndFeeding.findByIdAndUpdate(
      entryId,
      { time, portion, foodType, notes },
      { new: true }
    );

    if (!updatedEntry) {
      return res
        .status(404)
        .json({ error: "Diet and feeding entry not found" });
    }

    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error("Error updating feeding entry:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a feeding entry
router.delete("/:catId/:entryId", authenticateUser, async (req, res) => {
  try {
    const { catId, entryId } = req.params;

    const cat = await Cat.findById(catId);
    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    if (cat.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this cat" });
    }

    cat.dietAndFeeding = cat.dietAndFeeding.filter(
      (id) => id.toString() !== entryId
    );
    await cat.save();

    await DietAndFeeding.findByIdAndDelete(entryId);

    res.status(200).json({ message: "Diet and feeding entry deleted" });
  } catch (error) {
    console.error("Error deleting feeding entry:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
