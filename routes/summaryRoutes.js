require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");

const jwt = require("jsonwebtoken");

const checkToken = require("../middleware");
const ApiResponse = require("../models/apiResponse");
const Summary = require("../models/apiSummary");

// Get summary
router.get("/",checkToken, (req, res) => {
    const summary = new Summary();
    jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
        if (err) {
          //If error send Forbidden (403)
          console.log("ERROR: Could not connect to the protected route");
          res.sendStatus(403);
        } else {
  pool.query(
    "SELECT COUNT(order_id) AS order_number_total FROM orders",
    function (err, results) {
      if (err) {
        console.error(err);
        const errorResponse = ApiResponse.error(500, "Internal Server Error");
        res.send(errorResponse);
      } else {
        summary.order_number_total = results[0].order_number_total;
        pool.query(
          "SELECT DATE_FORMAT(order_date, '%Y-%m') AS month, COUNT(order_id) AS order_no FROM orders WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) GROUP BY DATE_FORMAT(order_date, '%Y-%m') ORDER BY DATE_FORMAT(order_date, '%Y-%m')",
          function (err, results) {
            if (err) {
              console.error(err);
              const errorResponse = ApiResponse.error(500, "Internal Server Error");
              res.send(errorResponse);
            } else {
              summary.order_number_in_a_year = results;
              pool.query(
                "SELECT SUM(total_amount) AS order_amount_total FROM orders",
                function (err, results) {
                  if (err) {
                    console.error(err);
                    const errorResponse = ApiResponse.error(500, "Internal Server Error");
                    res.send(errorResponse);
                  } else {
                    summary.order_amount_total = results[0].order_amount_total;
                    pool.query(
                      "SELECT DATE_FORMAT(order_date, '%Y-%m') AS month, SUM(total_amount) AS total_amount FROM orders WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) GROUP BY DATE_FORMAT(order_date, '%Y-%m') ORDER BY DATE_FORMAT(order_date, '%Y-%m')",
                      function (err, results) {
                        if (err) {
                          console.error(err);
                          const errorResponse = ApiResponse.error(500, "Internal Server Error");
                          res.send(errorResponse);
                        } else {
                          summary.order_amount_in_a_year = results;
                          pool.query(
                            "SELECT COUNT(customer_id) AS customer_number FROM customers",
                            function (err, results) {
                              if (err) {
                                console.error(err);
                                const errorResponse = ApiResponse.error(500, "Internal Server Error");
                                res.send(errorResponse);
                              } else {
                                summary.customer_number = results[0].customer_number;
                                pool.query(
                                  "SELECT COUNT(quantity) as sold, o.product_id, p.product_name FROM order_items o JOIN products p ON o.product_id = p.product_id GROUP BY o.product_id, p.product_name order by sold DESC LIMIT 5",
                                  function (err, results) {
                                    if (err) {
                                      console.error(err);
                                      const errorResponse = ApiResponse.error(500, "Internal Server Error");
                                      res.send(errorResponse);
                                    } else {
                                      summary.top5_products = results;
                                      console.log(summary);
                                      const successResponse = ApiResponse.success(summary);
                                      res.json(successResponse);
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
}
})});

module.exports = router;