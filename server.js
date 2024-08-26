const express = require("express");
const app = express();
const PORT = 8888;
const cors = require("cors");
const connectDB = require("./connection");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", require("./controllers/users"));
app.use("/products", require("./controllers/products"));
app.use("/orders", require("./controllers/orders"));

connectDB();
app.listen(PORT, () => console.log(`App is flying on PORT: ${PORT}`));
