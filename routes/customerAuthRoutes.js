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
  const { email } = body;
  const { password } = body;

  pool.query(
    "SELECT * FROM customers WHERE email = ?",
    email,
    function (err, results) {
      if (err) {
        console.error(err);
        const errorResponse = ApiResponse.error(500, "Internal Server Error");

        res.status(500).json(errorResponse);
      } else {
        console.log("From customers table:", results);
        const successResponse = ApiResponse.success(results);
        if (
          Array.isArray(successResponse.data) &&
          successResponse.data.length > 0
        ) {
          const customer = Customer.fromCustomerData(successResponse.data[0]);
          console.log("Password:", password);
          console.log("Customer table Password:", customer.password);
          bcrypt
            .compare(password, customer.password)
            .then((bcryptres) => {
              if (bcryptres) {
                // if (password === adminUser.password_hash) {
                console.log(bcryptres);
                jwt.sign(
                  { customer },
                  process.env.PRIVATE_KEY,
                  { expiresIn: "1h" },
                  (err, token) => {
                    if (err) {
                      console.log(err);
                    }
                    //const successResponse = ApiResponse.success(token);
                    const successResponse = ApiResponse.success({
                      token: token,
                      currentCustomer: customer,
                    });
                    console.log(token.expiresIn);
                    console.log(token);
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
