require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");

const jwt = require("jsonwebtoken");

const checkToken = require("../middleware");
const ApiResponse = require("../models/apiResponse");

// Get All home sections
router.get("/", (req, res) => {
  pool.query(
    "SELECT * FROM homeSections ORDER BY sort",
    function (err, results) {
      if (err) {
        console.error(err);
        const errorResponse = ApiResponse.error(500, "Internal Server Error");
        res.send(errorResponse);
      } else {
        const successResponse = ApiResponse.success(results);
        res.json(successResponse);
      }
    }
  );
});

// Add home section
router.post("/add_homeSection/", checkToken, (req, res) => {
  const { body } = req;
  const { homeSection_title, homeSection_content, image_id, isshow, sort } =
    body;

  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "INSERT INTO `homeSections` (`homeSection_title`, `homeSection_content`, `image_id`, `isshow`, `sort`) VALUES (?, ?, ?, ?, ?)",
        [homeSection_title, homeSection_content, image_id, isshow, sort],
        function (err, results) {
          if (err) {
            console.error(err);
            const errorResponse = ApiResponse.error(
              500,
              "Internal Server Error"
            );
            res.send(errorResponse);
          } else {
            const successResponse = ApiResponse.success(results);
            res.json(successResponse);
          }
        }
      );
    }
  });
});

// Update home section
router.post("/update_homeSection/", checkToken, (req, res) => {
  const { body } = req;
  const {
    homeSection_title,
    homeSection_content,
    image_id,
    isshow,
    sort,
    homeSection_id,
  } = body;
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "UPDATE `homeSections` SET `homeSection_title` = ?, `homeSection_content` = ?, `image_id` = ?, `isshow` = ?, `sort` = ? WHERE `homeSection_id` = ?",
        [
          homeSection_title,
          homeSection_content,
          image_id,
          isshow,
          sort,
          homeSection_id,
        ],
        function (err, results) {
          if (err) {
            console.error(err);
            const errorResponse = ApiResponse.error(
              500,
              "Internal Server Error"
            );
            res.send(errorResponse);
          } else {
            const successResponse = ApiResponse.success(results);
            res.json(successResponse);
          }
        }
      );
    }
  });
});

// Update home section image
router.post("/update_homeSection_image/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "UPDATE `homeSections` SET `image_id` = ? WHERE `homeSection_id` = ?",
        [req.body.image_id, req.body.homeSection_id],
        function (err, results) {
          if (err) {
            console.error(err);
            const errorResponse = ApiResponse.error(
              500,
              "Internal Server Error"
            );
            res.send(errorResponse);
          } else {
            const successResponse = ApiResponse.success(results);
            res.json(successResponse);
          }
        }
      );
    }
  });
});

// Delete home section
router.post("/delete_homeSection/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "DELETE FROM `homeSections` WHERE `homeSection_id` = ?",
        [req.body.homeSection_id],
        function (err, results) {
          if (err) {
            console.error(err);
            const errorResponse = ApiResponse.error(
              500,
              "Internal Server Error"
            );
            res.send(errorResponse);
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
