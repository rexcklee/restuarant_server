require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");

const jwt = require("jsonwebtoken");

const checkToken = require("../middleware");
const ApiResponse = require("../models/apiResponse");

// Get All news
router.get("/", (req, res) => {
  //pool.query("SELECT * FROM products", function (err, results) {
  pool.query(
    "SELECT * FROM news ORDER BY create_date DESC",
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

// Add news
router.post("/add_news/", checkToken, (req, res) => {
  const { body } = req;
  const { news_title, news_content, image_id, isshow, sort } = body;

  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "INSERT INTO `news` (`news_title`, `news_content`, `image_id`, `isshow`, `sort`) VALUES (?, ?, ?, ?, ?)",
        [news_title, news_content, image_id, isshow, sort],
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

// Update news
router.post("/update_news/", checkToken, (req, res) => {
  const { body } = req;
  const { news_title, news_content, image_id, isshow, sort, news_id } = body;
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "UPDATE `news` SET `news_title` = ?, `news_content` = ?, `image_id` = ?, `isshow` = ?, `sort` = ? WHERE `news_id` = ?",
        [news_title, news_content, image_id, isshow, sort, news_id],
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

// Update news image
router.post("/update_news_image/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "UPDATE `news` SET `image_id` = ? WHERE `news_id` = ?",
        [req.body.image_id, req.body.news_id],
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

// Delete news
router.post("/delete_news/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "DELETE FROM `news` WHERE `news_id` = ?",
        [req.body.news_id],
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
