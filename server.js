require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productCategoryRoutes = require("./routes/productCategoryRoutes");
const productRoutes = require("./routes/productRoutes");
const googleRoutes = require("./routes/googleRoutes");
const branchesRoutes = require("./routes/branchesRoutes");
const customerAuthRoutes = require("./routes/customerAuthRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mounting routes
app.use("/auth", authRoutes);
app.use("/admin_users", userRoutes);
app.use("/productCategory", productCategoryRoutes);
app.use("/products", productRoutes);
app.use("/uploadGoogle", googleRoutes);
app.use("/branches", branchesRoutes);
app.use("/customer_auth", customerAuthRoutes);
app.use("/customers", customerRoutes);
app.use("/orders", orderRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
