require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");

const jwt = require("jsonwebtoken");

const checkToken = require("../middleware");
const ApiResponse = require("../models/apiResponse");

const bcrypt = require("bcrypt");
const saltRounds = 10;

// Get All customers
router.get("/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query("SELECT * FROM customers", function (err, results) {
        if (err) {
          console.error(err);
          const errorResponse = ApiResponse.error(500, "Internal Server Error");
          res.status(500).json(errorResponse);
        } else {
          const successResponse = ApiResponse.success(results);
          res.json(successResponse);
        }
      });
    }
  });
});

// Register customer
router.post("/register_customer/", (req, res) => {
  console.log(req.body.first_name, req.body.last_name);
  bcrypt
    .hash(req.body.password_hash, saltRounds)
    .then((hash) => {
      pool.query(
        "INSERT INTO `customers` (`first_name`, `last_name`, `email`, `password`, `phone_number`, `address`) VALUES (?, ?, ?, ?, ?, ?)",
        [
          req.body.first_name,
          req.body.last_name,
          req.body.email,
          hash,
          req.body.phone_number,
          req.body.address,
        ],
        function (err, results) {
          if (err) {
            console.error(err);
            const errorResponse = ApiResponse.error(
              500,
              "Internal Server Error"
            );
            res.status(500).json(errorResponse);
          } else {
            const successResponse = ApiResponse.success(results);
            res.json(successResponse);
          }
        }
      );
    })
    .catch((bcrypterr) => console.error(bcrypterr.message));
});

// Update customer
// router.post("/update_user/", checkToken, (req, res) => {
//   jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
//     if (err) {
//       //If error send Forbidden (403)
//       console.log("ERROR: Could not connect to the protected route");
//       res.sendStatus(403);
//     } else {
//       console.log(req.body.first_name, req.body.last_name);
//       pool.query(
//         "UPDATE `admin_users` SET `first_name` = ?, `last_name` = ?, `mobile` = ?, `email` = ?, `password_hash` = ?, `is_superadmin` = ? WHERE `admin_id` = ?",
//         [
//           req.body.first_name,
//           req.body.last_name,
//           req.body.mobile,
//           req.body.email,
//           req.body.password_hash,
//           req.body.is_superadmin,
//           req.body.admin_id,
//         ],
//         function (err, results) {
//           //pool.query("SELECT * FROM admin_users", function (err, results) {
//           if (err) {
//             console.error(err);
//             const errorResponse = ApiResponse.error(
//               500,
//               "Internal Server Error"
//             );
//             res.status(500).json(errorResponse);
//           } else {
//             const successResponse = ApiResponse.success(results);
//             res.json(successResponse);
//           }
//         }
//       );
//     }
//   });
// });

// Delete customer
// router.post("/delete_user/", checkToken, (req, res) => {
//   jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
//     if (err) {
//       //If error send Forbidden (403)
//       console.log("ERROR: Could not connect to the protected route");
//       res.sendStatus(403);
//     } else {
//       console.log(req.body.admin_id);
//       pool.query(
//         "DELETE FROM `admin_users` WHERE `admin_id` = ?",
//         [req.body.admin_id],
//         function (err, results) {
//           //pool.query("SELECT * FROM admin_users", function (err, results) {
//           if (err) {
//             console.error(err);
//             const errorResponse = ApiResponse.error(
//               500,
//               "Internal Server Error"
//             );
//             res.status(500).json(errorResponse);
//           } else {
//             const successResponse = ApiResponse.success(results);
//             res.json(successResponse);
//           }
//         }
//       );
//     }
//   });
// });

module.exports = router;
