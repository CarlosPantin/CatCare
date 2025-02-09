const express = require("express");
const router = express.Router();
const ShoppingList = require("../models/ShoppingList");

router.get("/", async (req, res) => {
  try {
    const items = await ShoppingList.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shopping list items" });
  }
});

router.post("/", async (req, res) => {
  const { item, quantity, priority, notes } = req.body;

  if (!item || !quantity || !priority) {
    return res
      .status(400)
      .json({ message: "All fields except notes are required" });
  }

  try {
    const newItem = new ShoppingList({ item, quantity, priority, notes });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding item to shopping list" });
  }
});

router.put("/:id", async (req, res) => {
  const { item, quantity, priority, notes } = req.body;

  try {
    const updatedItem = await ShoppingList.findByIdAndUpdate(
      req.params.id,
      { item, quantity, priority, notes },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await ShoppingList.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item" });
  }
});

module.exports = router;
