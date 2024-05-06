require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mounting routes
app.use("/auth", authRoutes);
app.use("/admin_users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
