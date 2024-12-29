require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");

const jwt = require("jsonwebtoken");

const checkToken = require("../middleware");
const ApiResponse = require("../models/apiResponse");
const AdminUser = require("../models/apiAdminUser");

const bcrypt = require("bcrypt");
const saltRounds = 10;

// Get All admin user
router.get("/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
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
    }
  });
});

// Add admin user
router.post("/add_user/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      bcrypt
        .hash(req.body.password_hash, saltRounds)
        .then((hash) => {
          console.log(req.body.first_name, req.body.last_name);
          pool.query(
            "INSERT INTO `admin_users` (`first_name`, `last_name`, `mobile`, `email`, `password_hash`, `is_superadmin`) VALUES (?, ?, ?, ?, ?, ?)",
            [
              req.body.first_name,
              req.body.last_name,
              req.body.mobile,
              req.body.email,
              hash,
              req.body.is_superadmin,
            ],
            function (err, results) {
              //pool.query("SELECT * FROM admin_users", function (err, results) {
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
    }
  });
});

// Update admin user
router.post("/update_user/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      console.log(req.body.first_name, req.body.last_name);
      pool.query(
        "UPDATE `admin_users` SET `first_name` = ?, `last_name` = ?, `mobile` = ?, `email` = ?, `password_hash` = ?, `is_superadmin` = ? WHERE `admin_id` = ?",
        [
          req.body.first_name,
          req.body.last_name,
          req.body.mobile,
          req.body.email,
          req.body.password_hash,
          req.body.is_superadmin,
          req.body.admin_id,
        ],
        function (err, results) {
          //pool.query("SELECT * FROM admin_users", function (err, results) {
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
    }
  });
});

// Delete admin user
router.post("/delete_user/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      console.log(req.body.admin_id);
      pool.query(
        "DELETE FROM `admin_users` WHERE `admin_id` = ?",
        [req.body.admin_id],
        function (err, results) {
          //pool.query("SELECT * FROM admin_users", function (err, results) {
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
    }
  });
});

router.post("/update_password/", (req, res) => {
  const { body } = req;
  // const { email } = body;
  // const { password } = body;
  const { admin_id, old_password, new_password } = body;

  pool.query(
    "SELECT * FROM admin_users WHERE admin_id = ?",
    admin_id,
    function (err, results) {
      if (err) {
        const errorResponse = ApiResponse.error(500, "Internal Server Error");
        res.status(500).json(errorResponse);
      } else {
        //const successResponse = ApiResponse.success(results);

        //const adminUser = AdminUser.fromUserData(successResponse.data[0]);
        const adminUser = AdminUser.fromUserData(results[0]);

        bcrypt
          .compare(old_password, adminUser.password_hash)
          .then((bcryptres) => {
            if (bcryptres) {
              bcrypt
                .hash(new_password, saltRounds)
                .then((hash) => {
                  pool.query(
                    "UPDATE `admin_users` SET `first_name` = ?, `last_name` = ?, `mobile` = ?, `email` = ?, `password_hash` = ?, `is_superadmin` = ? WHERE `admin_id` = ?",
                    [
                      adminUser.first_name,
                      adminUser.last_name,
                      adminUser.mobile,
                      adminUser.email,
                      hash,
                      adminUser.is_superadmin,
                      adminUser.admin_id,
                    ],
                    function (err, results) {
                      //pool.query("SELECT * FROM admin_users", function (err, results) {
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
            } else {
              const errorResponse = ApiResponse.error(
                401,
                "Password update failed."
              );
              res.send(errorResponse);
            }
          })
          .catch((err) => console.error(err.message));

      }
    }
  );
});

module.exports = router;
