const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema({
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], required: true },
  notes: { type: String, default: "" },
});

const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);

module.exports = ShoppingList;
