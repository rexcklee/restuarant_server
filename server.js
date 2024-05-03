require("dotenv").config();
const ApiResponse = require("./apiResponse").default;

const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 3000;

const mysql = require("mysql2");
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
});

app.use(cors());
app.use(express.json());

app.get("/admin_users", (req, res) => {
  pool.query("SELECT * FROM admin_users", function (err, results) {
    if (err) {
      console.error(err);
      const errorResponse = ApiResponse.error(500, "Internal Server Error");
      res.status(500).json(errorResponse);
    } else {
      const successResponse = ApiResponse.success(results);
      res.json(successResponse);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
