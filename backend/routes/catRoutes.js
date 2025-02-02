const express = require("express");
const multer = require("multer");
const path = require("path");
const Cat = require("../models/Cat");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

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

router.post(
  "/cats",
  authenticateUser,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { name, birthdate, breed, neutered, gender, weight } = req.body;

      if (!name || !gender) {
        return res.status(400).json({ error: "Name and gender are required" });
      }

      const newCat = new Cat({
        name,
        birthdate,
        breed,
        neutered,
        gender,
        weight,
        photo: req.file ? req.file.path : null,
        owner: req.user._id,
      });

      await newCat.save();

      req.user.cats.push(newCat._id);
      await req.user.save();

      res.status(201).json(newCat);
    } catch (err) {
      console.error("Error creating cat:", err);
      res.status(400).json({ error: err.message });
    }
  }
);

router.get("/cats", authenticateUser, async (req, res) => {
  try {
    const cats = await Cat.find({ owner: req.user._id });
    res.status(200).json(cats);
  } catch (err) {
    console.error("Error fetching cats:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/cats/:id", authenticateUser, async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id).populate("owner");

    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    console.log("Cat Owner ID:", cat.owner._id.toString());
    console.log("User ID:", req.user._id.toString());

    if (cat.owner._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this cat" });
    }

    res.status(200).json(cat);
  } catch (err) {
    console.error("Error fetching cat:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/cats/:id", authenticateUser, async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);

    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    console.log("Cat Owner ID:", cat.owner._id.toString());
    console.log("User ID:", req.user._id.toString());

    if (cat.owner._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this cat" });
    }

    const updatedCat = await Cat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedCat);
  } catch (err) {
    console.error("Error updating cat:", err);
    res.status(400).json({ error: err.message });
  }
});

router.delete("/cats/:id", authenticateUser, async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);

    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    console.log("Cat Owner ID:", cat.owner._id.toString());
    console.log("User ID:", req.user._id.toString());

    if (cat.owner._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this cat" });
    }

    req.user.cats.pull(cat._id);
    await req.user.save();

    await cat.remove();

    res.status(200).json({ message: "Cat profile deleted" });
  } catch (err) {
    console.error("Error deleting cat:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
