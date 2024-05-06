const express = require("express");
const router = express.Router();
const pool = require("../db");
const ApiResponse = require("../models/apiResponse");
const AdminUser = require("../models/apiAdminUser");

const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
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
        if (
          Array.isArray(successResponse.data) &&
          successResponse.data.length > 0
        ) {
          const adminUser = AdminUser.fromUserData(successResponse.data[0]);

          if (password === adminUser.password_hash) {
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
