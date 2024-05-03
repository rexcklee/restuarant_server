require("dotenv").config();
const ApiResponse = require("./apiResponse");
const AdminUser = require("./apiAdminUser");
//import { ApiResponse, AdminUser } from "./apiResponse";
// const ApiResponse = require("./apiResponse").ApiResponse;
// const AdminUser = require("./apiAdminUser").AdminUser;
const jwt = require("jsonwebtoken");

const express = require("express");
const cors = require("cors");
const app = express();
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

app.post("/auth/login", (req, res) => {
  const { body } = req;
  const { email } = body;
  const { password } = body;
  pool.query(
    "SELECT * FROM admin_users WHERE email = ?",
    email,
    function (err, results) {
      if (err) {
        console.error(err);
        const errorResponse = ApiResponse.error(500, "Internal Server Error");

        res.status(500).json(errorResponse);
      } else {
        const successResponse = ApiResponse.success(results);
        const adminUser = AdminUser.fromUserData(successResponse.data[0]);

        if (password === adminUser.password_hash) {
          console.log("Password is match");
          //if user log in success, generate a JWT token for the user with a secret key
          jwt.sign(
            { adminUser },
            "privatekey",
            { expiresIn: "1h" },
            (err, token) => {
              if (err) {
                console.log(err);
              }
              console.log(token);
              const successResponse = ApiResponse.success(token);
              res.send(successResponse);
            }
          );
        } else {
          const errorResponse = ApiResponse.error(
            401,
            "ERROR: Could not log in"
          );
          res.send(errorResponse);
        }
        // const successResponse = ApiResponse.success(results);
        // console.log(successResponse);
        // res.json(successResponse);
      }
    }
  );
  // results = "ABC Response";
  // const successResponse = ApiResponse.success(results);
  // res.json(successResponse);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
