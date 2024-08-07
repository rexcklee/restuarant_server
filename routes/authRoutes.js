require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");
const ApiResponse = require("../models/apiResponse");
const AdminUser = require("../models/apiAdminUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  let token_expire_sec = 1800; // in second
  const { body } = req;
  // const { email } = body;
  // const { password } = body;
  const { email, password } = body;

  pool.query(
    "SELECT * FROM admin_users WHERE email = ?",
    email,
    function (err, results) {
      if (err) {
        const errorResponse = ApiResponse.error(500, "Internal Server Error");
        res.status(500).json(errorResponse);
      } else {
        //const successResponse = ApiResponse.success(results);
        if (
          // Array.isArray(successResponse.data) &&
          // successResponse.data.length > 0
          Array.isArray(results) &&
          results.length > 0
        ) {
          //const adminUser = AdminUser.fromUserData(successResponse.data[0]);
          const adminUser = AdminUser.fromUserData(results[0]);

          bcrypt
            .compare(password, adminUser.password_hash)
            .then((bcryptres) => {
              if (bcryptres) {
                jwt.sign(
                  { adminUser },
                  process.env.PRIVATE_KEY,
                  { expiresIn: token_expire_sec },
                  (err, token) => {
                    if (err) {
                      console.log(err);
                    }
                    const successResponse = ApiResponse.success({
                      token: token,
                      expire_in: token_expire_sec,
                      currentUser: adminUser,
                    });
                    res.send(successResponse);
                    const currentDate = new Date();
                    pool.query(
                      "UPDATE admin_users SET last_login = ? WHERE email = ?",
                      [currentDate, email],
                      (err, results) => {
                        if (err) {
                          console.error(err);
                          return;
                        }
                        console.log(
                          "Last login updated successfully:",
                          results
                        );
                      }
                    );
                  }
                );
              } else {
                const errorResponse = ApiResponse.error(
                  401,
                  "ERROR: Could not log in"
                );
                res.send(errorResponse);
              }
            })
            .catch((err) => console.error(err.message));
        } else {
          const errorResponse = ApiResponse.error(
            401,
            "ERROR: Could not log in"
          );
          res.send(errorResponse);
        }
      }
    }
  );
});

module.exports = router;
