const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const isAuth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const fs = require("fs"); //allows you to read and wirte on the file system
const path = require("path"); //allows you to change directories
const multer = require("multer"); //form handling with file upload

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  }, //where to save the images
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }, //format the filename before storing it
});

const upload = multer({ storage });

//ADD PRODUCT
router.post("/", isAuth, upload.single("image"), async (req, res) => {
  try {
    let product = new Product({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
      user: req.user._id,
    });
    if (req.file) product.image = req.file.filename;
    product.save();
    return res.json({ product, msg: "Product added successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    return res.json({ products });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

//GET ALL PRODUCTS
router.get("/admin", isAuth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      const products = await Product.find({
        user: req.user._id,
      });
      return res.json({ products });
    } else {
      const products = await Product.find({ isActive: false });
      return res.json({ products });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

//GET PRODUCT BY ID

//DELETE PRODUCT
router.delete("/:id", isAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(400).json({ msg: "Product doesn't exist" });

    //Delete the image of this product inside the public folder
    if (product.image) {
      const fileName = product.image; //1231312-logo.jpg
      const filePath = path.join(__dirname, "../public/" + fileName);

      fs.unlinkSync(filePath);
    }
    await Product.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Product successfully deleted" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

//UPDATE PRODUCT
router.put("/:id", isAuth, upload.single("image"), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(400).json({ msg: "Product not found" });

    if (req.file) {
      //the admin is uploading a new image.
      const fileName = product.image;
      const filePath = path.join(__dirname, "../public/" + fileName);
      fs.unlinkSync(filePath);
    }

    let updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: req.file ? req.file.filename : product.image,
      },
      { new: true }
    );
    return res.json({
      msg: "Product has been updated",
      product: updatedProduct,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

//product ID
router.patch("/:id", isAuth, async (req, res) => {
  // console.log("ID:", req.params.id)

  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(400).json({ msg: "Product not found" });
    let approveProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        isActive: true,
      },
      { new: true }
    );
    return res.json({
      msg: "Product has been approved",
      product: approveProduct,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = router;
