const express = require("express");
const router = express.Router();
const ImportantDate = require("../models/ImportantDate");
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

// Create an important date for a cat
router.post("/:catId", authenticateUser, async (req, res) => {
  try {
    const { date, event, description } = req.body;
    const catId = req.params.catId;

    if (!date || !event) {
      return res.status(400).json({ error: "Date and event are required" });
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

    const importantDate = new ImportantDate({ date, event, description });
    await importantDate.save();

    cat.importantDates.push(importantDate._id);
    await cat.save();

    res.status(201).json(importantDate);
  } catch (error) {
    console.error("Error adding important date:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all important dates for a cat
router.get("/:catId", authenticateUser, async (req, res) => {
  try {
    const catId = req.params.catId;
    const cat = await Cat.findById(catId).populate("importantDates");

    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    if (cat.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this cat" });
    }

    res.status(200).json(cat.importantDates);
  } catch (error) {
    console.error("Error fetching important dates:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update an important date
router.put("/:catId/:dateId", authenticateUser, async (req, res) => {
  try {
    const { date, event, description } = req.body;
    const { catId, dateId } = req.params;

    const cat = await Cat.findById(catId);
    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    if (cat.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this cat" });
    }

    const updatedDate = await ImportantDate.findByIdAndUpdate(
      dateId,
      { date, event, description },
      { new: true }
    );

    if (!updatedDate) {
      return res.status(404).json({ error: "Important date not found" });
    }

    res.status(200).json(updatedDate);
  } catch (error) {
    console.error("Error updating important date:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete an important date
router.delete("/:catId/:dateId", authenticateUser, async (req, res) => {
  try {
    const { catId, dateId } = req.params;

    const cat = await Cat.findById(catId);
    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    if (cat.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this cat" });
    }

    cat.importantDates.pull(dateId);
    await cat.save();

    await ImportantDate.findByIdAndDelete(dateId);

    res.status(200).json({ message: "Important date deleted" });
  } catch (error) {
    console.error("Error deleting important date:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
