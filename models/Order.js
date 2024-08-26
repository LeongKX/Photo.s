const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	purchased_date: { type: Date, default: Date.now },
	product: { type: mongoose.Schema.Types.ObjectId, ref:"Product" }
});

module.exports = mongoose.model("Order", OrderSchema);
