const express = require("express");
const app = express();
const PORT = 8888;
const cors = require("cors");
const connectDB = require("./connection");
const path = require("path");

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", require("./controllers/users"));
app.use("/products", require("./controllers/products"));
app.use("/orders", require("./controllers/orders"));

connectDB();
app.listen(PORT, () => console.log(`App is flying on PORT: ${PORT}`));
