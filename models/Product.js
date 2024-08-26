const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  description: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Product", ProductSchema);
