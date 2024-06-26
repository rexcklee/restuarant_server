require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");

const jwt = require("jsonwebtoken");

const checkToken = require("../middleware");
const ApiResponse = require("../models/apiResponse");

// Get All products
router.get("/", (req, res) => {
  //pool.query("SELECT * FROM products", function (err, results) {
  pool.query(
    "SELECT * FROM products p JOIN product_categories c WHERE p.category_id=c.category_id ORDER BY category_sort",
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

// Add product
router.post("/add_product/", checkToken, (req, res) => {
  const { body } = req;
  const {
    product_name,
    product_description,
    image_id,
    product_price,
    category_id,
  } = body;

  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "INSERT INTO `products` (`product_name`, `product_description`, `image_id`, `product_price`, `category_id`) VALUES (?, ?, ?, ?, ?)",
        [
          product_name,
          product_description,
          image_id,
          product_price,
          category_id,
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

// Update product
router.post("/update_product/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "UPDATE `products` SET `product_name` = ?, `product_description` = ?, `product_price` = ?, `category_id` = ? WHERE `product_id` = ?",
        [
          req.body.product_name,
          req.body.product_description,
          req.body.product_price,
          req.body.category_id,
          req.body.product_id,
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

// Update product image
router.post("/update_product_image/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "UPDATE `products` SET `image_id` = ? WHERE `product_id` = ?",
        [req.body.image_id, req.body.product_id],
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

// Delete product
router.post("/delete_product/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "DELETE FROM `products` WHERE `product_id` = ?",
        [req.body.product_id],
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
