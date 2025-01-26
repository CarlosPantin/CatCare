const express = require("express");
const Cat = require("../models/Cat");
const User = require("../models/User");

const router = express.Router();

router.post("/cats", async (req, res) => {
  try {
    const { userId, name, birthdate, breed, neutered, gender, weight, photo } =
      req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!Array.isArray(user.cats)) {
      user.cats = [];
    }

    // Create the new cat
    const newCat = new Cat({
      name,
      birthdate,
      breed,
      neutered,
      gender,
      weight,
      photo,
      owner: user._id,
    });

    await newCat.save();

    user.cats.push(newCat._id);
    await user.save();

    res.status(201).json(newCat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all cats for a specific user
router.get("/cats", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId).populate("cats");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single cat by ID
router.get("/cats/:id", async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id).populate("owner");

    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    res.status(200).json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a cat's profile
router.put("/cats/:id", async (req, res) => {
  try {
    const updatedCat = await Cat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedCat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    res.status(200).json(updatedCat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a cat profile
router.delete("/cats/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const cat = await Cat.findById(req.params.id);
    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    await User.findByIdAndUpdate(userId, { $pull: { cats: cat._id } });

    await cat.remove();

    res.status(200).json({ message: "Cat profile deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/cats", async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId).populate("cats");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
