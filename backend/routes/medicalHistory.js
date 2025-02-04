const express = require("express");
const router = express.Router();
const MedicalHistory = require("../models/MedicalHistory");
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

// Fetch medical history by Cat ID
router.get("/:catId", authenticateUser, async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.catId);
    if (!cat) return res.status(404).json({ error: "Cat not found" });

    if (cat.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const medicalHistory = await MedicalHistory.findOne({
      cat: req.params.catId,
    });
    if (!medicalHistory)
      return res.status(404).json({ error: "No medical history found" });

    res.status(200).json(medicalHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add medical visit
router.post("/:catId/visits", authenticateUser, async (req, res) => {
  try {
    const { date, reason, diagnosis, treatment, medication } = req.body;
    const catId = req.params.catId;

    const cat = await Cat.findById(catId);
    if (!cat) return res.status(404).json({ error: "Cat not found" });

    if (cat.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    let medicalHistory = await MedicalHistory.findOne({ cat: catId });

    if (!medicalHistory) {
      medicalHistory = new MedicalHistory({
        cat: catId,
        visits: [],
        vaccinations: [],
      });
    }

    medicalHistory.visits.push({
      date,
      reason,
      diagnosis,
      treatment,
      medication,
    });
    await medicalHistory.save();

    res.status(201).json(medicalHistory);
  } catch (error) {
    console.error("Error adding visit:", error);
    res.status(500).json({ error: error.message });
  }
});

//  Add vaccination record
router.post("/:catId/vaccinations", authenticateUser, async (req, res) => {
  try {
    const { name, date, nextDue } = req.body;
    const catId = req.params.catId;

    const cat = await Cat.findById(catId);
    if (!cat) return res.status(404).json({ error: "Cat not found" });

    if (cat.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    let medicalHistory = await MedicalHistory.findOne({ cat: catId });

    if (!medicalHistory) {
      medicalHistory = new MedicalHistory({
        cat: catId,
        visits: [],
        vaccinations: [],
      });
    }

    medicalHistory.vaccinations.push({ name, date, nextDue });
    await medicalHistory.save();

    res.status(201).json(medicalHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a visit
router.delete("/:catId/visits/:visitId", authenticateUser, async (req, res) => {
  try {
    const { catId, visitId } = req.params;

    const medicalHistory = await MedicalHistory.findOne({ cat: catId });

    if (!medicalHistory) {
      return res.status(404).json({ error: "No medical history found" });
    }

    medicalHistory.visits = medicalHistory.visits.filter(
      (visit) => visit._id.toString() !== visitId
    );
    await medicalHistory.save();

    res.status(200).json(medicalHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a vaccination
router.delete(
  "/:catId/vaccinations/:vaccinationId",
  authenticateUser,
  async (req, res) => {
    try {
      const { catId, vaccinationId } = req.params;

      const medicalHistory = await MedicalHistory.findOne({ cat: catId });

      if (!medicalHistory) {
        return res.status(404).json({ error: "No medical history found" });
      }

      medicalHistory.vaccinations = medicalHistory.vaccinations.filter(
        (vaccination) => vaccination._id.toString() !== vaccinationId
      );
      await medicalHistory.save();

      res.status(200).json(medicalHistory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update a specific visit
router.put("/:catId/visits/:visitId", authenticateUser, async (req, res) => {
  try {
    const { catId, visitId } = req.params;
    const { date, reason, diagnosis, treatment, medication } = req.body;

    const medicalHistory = await MedicalHistory.findOne({ cat: catId });

    if (!medicalHistory) {
      return res.status(404).json({ error: "No medical history found" });
    }

    const visit = medicalHistory.visits.id(visitId);
    if (!visit) {
      return res.status(404).json({ error: "Visit not found" });
    }

    visit.date = date;
    visit.reason = reason;
    visit.diagnosis = diagnosis;
    visit.treatment = treatment;
    visit.medication = medication;

    await medicalHistory.save();
    res.status(200).json(medicalHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a specific vaccination
router.put(
  "/:catId/vaccinations/:vaccinationId",
  authenticateUser,
  async (req, res) => {
    try {
      const { catId, vaccinationId } = req.params;
      const { name, date, nextDue } = req.body;

      const medicalHistory = await MedicalHistory.findOne({ cat: catId });

      if (!medicalHistory) {
        return res.status(404).json({ error: "No medical history found" });
      }

      const vaccination = medicalHistory.vaccinations.id(vaccinationId);
      if (!vaccination) {
        return res.status(404).json({ error: "Vaccination not found" });
      }

      vaccination.name = name;
      vaccination.date = date;
      vaccination.nextDue = nextDue;

      await medicalHistory.save();
      res.status(200).json(medicalHistory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
