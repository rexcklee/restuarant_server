require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");

const jwt = require("jsonwebtoken");

const checkToken = require("../middleware");
const ApiResponse = require("../models/apiResponse");

// Get All branches
router.get("/", (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query("SELECT * FROM branches", function (err, results) {
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

// Add branch
router.post("/add_branch/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "INSERT INTO `branches` (`branch_name`, `branch_address`, `branch_phone`,`branch_email`,`branch_facebook_link`,`branch_ig_link`,`branch_x_link`,`branch_reserve_link`,`branch_opening_hours`) VALUES (?,?,?,?,?,?,?,?,?)",
        [
          req.body.branch_name,
          req.body.branch_address,
          req.body.branch_phone,
          req.body.branch_email,
          req.body.branch_facebook_link,
          req.body.branch_ig_link,
          req.body.branch_x_link,
          req.body.branch_reserve_link,
          req.body.branch_opening_hours,
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
    }
  });
});

// Update branch
router.post("/update_branch/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "UPDATE `branches` SET `branch_name` = ? , `branch_address` = ?, `branch_phone` = ?, `branch_email` = ?, `branch_facebook_link` = ?, `branch_ig_link` = ?, `branch_x_link` = ?, `branch_reserve_link` = ?, `branch_opening_hours` = ? WHERE `branch_id` = ?",
        [
          req.body.branch_name,
          req.body.branch_address,
          req.body.branch_phone,
          req.body.branch_email,
          req.body.branch_facebook_link,
          req.body.branch_ig_link,
          req.body.branch_x_link,
          req.body.branch_reserve_link,
          req.body.branch_opening_hours,
          req.body.branch_id,
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
    }
  });
});

// Delete branch
router.post("/delete_branch/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "DELETE FROM `branches` WHERE `branch_id` = ?",
        [req.body.branch_id],
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
    }
  });
});

module.exports = router;
