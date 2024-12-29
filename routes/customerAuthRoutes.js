require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");
const ApiResponse = require("../models/apiResponse");
const Customer = require("../models/apiCustomer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const { body } = req;
  const { email, password } = body;

  pool.query(
    "SELECT * FROM customers WHERE email = ?",
    email,
    function (err, results) {
      if (err) {
        console.error(err);
        const errorResponse = ApiResponse.error(500, "Internal Server Error");
        res.send(errorResponse);
      } else {
        //const successResponse = ApiResponse.success(results);
        if (
          //   Array.isArray(successResponse.data) &&
          //   successResponse.data.length > 0
          Array.isArray(results) &&
          results.length > 0
        ) {
          //const customer = Customer.fromCustomerData(successResponse.data[0]);
          const customer = Customer.fromCustomerData(results[0]);
          bcrypt
            .compare(password, customer.password)
            .then((bcryptres) => {
              if (bcryptres) {
                jwt.sign(
                  { customer },
                  process.env.PRIVATE_KEY,
                  { expiresIn: "180days" },
                  (err, token) => {
                    if (err) {
                      console.log(err);
                    }
                    const successResponse = ApiResponse.success({
                      token: token,
                      currentCustomer: customer,
                    });
                    res.send(successResponse);
                    const currentDate = new Date();
                    pool.query(
                      "UPDATE customers SET last_login = ? WHERE email = ?",
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
