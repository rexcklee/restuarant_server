require("dotenv").config();

const https = require("https");
const fs = require("fs");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productCategoryRoutes = require("./routes/productCategoryRoutes");
const productRoutes = require("./routes/productRoutes");
const googleRoutes = require("./routes/googleRoutes");
const branchesRoutes = require("./routes/branchesRoutes");
const customerAuthRoutes = require("./routes/customerAuthRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const newsRoutes = require("./routes/newsRoutes");
const homeSectionRoutes = require("./routes/homeSectionRoutes");
const summaryRoutes = require("./routes/summaryRoutes");

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Path to SSL certificates
const certPath = "/etc/letsencrypt/live/rexlee.space/";

const options = {
  key: fs.readFileSync(path.join(certPath, "privkey.pem")),
  cert: fs.readFileSync(path.join(certPath, "cert.pem")),
  ca: fs.readFileSync(path.join(certPath, "chain.pem")),
};

//app.use(cors(corsOptions));

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
app.use("/news", newsRoutes);
app.use("/homeSections", homeSectionRoutes);
app.use("/summary", summaryRoutes);

//Create an HTTPS server
https.createServer(options, app).listen(444, () => {
  console.log("HTTPS server running on port 444");
});

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
