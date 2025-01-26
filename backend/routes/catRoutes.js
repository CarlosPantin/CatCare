const express = require("express");
const Cat = require("../models/Cat");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to authenticate user from JWT token
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
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // Attach the user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Create a new cat profile (authentication required)
router.post("/cats", authenticateUser, async (req, res) => {
  try {
    const { name, birthdate, breed, neutered, gender, weight, photo } =
      req.body;

    // Ensure all required fields are provided
    if (!name || !gender) {
      return res.status(400).json({ error: "Name and gender are required" });
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
      owner: req.user._id, // Link the cat to the authenticated user
    });

    // Save the cat
    await newCat.save();

    // Link the cat to the user's cats array
    req.user.cats.push(newCat._id);
    await req.user.save();

    res.status(201).json(newCat); // Return the newly created cat
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all cats for the authenticated user
router.get("/cats", authenticateUser, async (req, res) => {
  try {
    // Populate the cats field for the authenticated user
    await req.user.populate("cats");

    res.status(200).json(req.user.cats); // Return the user's cats
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single cat by ID (authentication required)
router.get("/cats/:id", authenticateUser, async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id).populate("owner");

    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    if (cat.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this cat" });
    }

    res.status(200).json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a cat's profile (authentication required)
router.put("/cats/:id", authenticateUser, async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);

    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    if (cat.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this cat" });
    }

    const updatedCat = await Cat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedCat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/cats/:id", authenticateUser, async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);

    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    if (cat.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this cat" });
    }

    req.user.cats.pull(cat._id);
    await req.user.save();

    await cat.remove();

    res.status(200).json({ message: "Cat profile deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
