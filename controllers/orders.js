const express = require("express");
const router = express.Router();
// const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const isAuth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");

//GET ALL ORDERS BY THE USER
router.get("/", isAuth, async (req, res) => {
  try {
    let orders = await Order.find({ user: req.user._id })
      .populate("product")
      .populate("user");
    return res.json(orders);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

//GET ALL USERS ORDER (ADMIN ONLY)

router.get("/allOrders", isAuth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('product').populate('user');
    return res.json(orders);
  } catch (e) {
	console.error('Error fetching orders:', e);
    res.status(400).json({ error: e.message });
  }
});
//CREATE ORDER
router.post("/:id", isAuth, async (req, res) => {
  const productId = req.params.id;
  try {
    let myOrder = await Order.create({
      user: req.user._id,
      product: productId,
    }); //will create an order
    // await Cart.findByIdAndDelete(cart._id); //will delete your current cart
    return res.json({ msg: "Checkout successfully", order: myOrder });
  } catch (e) {
    return res.json({ error: e.message });
  }
});

module.exports = router;
