require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");

const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const checkToken = require("../middleware");
const ApiResponse = require("../models/apiResponse");

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hongkong.two.go@gmail.com',
    pass: 'irfj qmee huzw vgzg'
  }
});

// Set up email data
const mailOptions = {
  from: '"HongKong2Go" <hongkong.two.go@gmail.com>', // Sender
  to: 'hongkong.two.go@gmail.com', // Recipient
  subject: 'New Order', // Subject line
  //text: 'You have new order.', // Plain text body
  html: '<b>Your have a new order.</b>' // HTML body
};

function generateOrderNumber() {
  let now = Date.now().toString(); // Current timestamp in milliseconds
  let randomPart = Math.floor(Math.random() * 1e6).toString(); // Random 6-digit number

  // Ensure random part is always 6 digits
  while (randomPart.length < 6) {
    randomPart = "0" + randomPart;
  }

  let orderNumber = now + randomPart;

  // Format the order number
  return [
    orderNumber.slice(0, 4),
    orderNumber.slice(4, 10),
    orderNumber.slice(10, 16),
  ].join("-");
}

router.get("/", checkToken, (req, res) =>
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "SELECT * FROM orders o JOIN customers c ON o.customer_id = c.customer_id ORDER BY order_date DESC",
        function (err, results) {
          if (err) {
            console.error(err);
            const errorResponse = ApiResponse.error(500, "Internal Server Error");
            res.status(500).json(errorResponse);
          } else {
            const successResponse = ApiResponse.success(results);
            res.json(successResponse);
          }
        }
      );
    }
  }));

router.get("/orders_by_user", checkToken, (req, res) =>
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      console.log(authorizedData.customer.customer_id);
      pool.query(
        "SELECT order_id, order_number, order_date, total_amount FROM orders o JOIN customers c ON o.customer_id = c.customer_id WHERE o.customer_id = ? ORDER BY order_date DESC", [authorizedData.customer.customer_id],
        function (err, results) {
          if (err) {
            console.error(err);
            const errorResponse = ApiResponse.error(500, "Internal Server Error");
            res.status(500).json(errorResponse);
          } else {
            const successResponse = ApiResponse.success(results);
            res.json(successResponse);
          }
        }
      );
    }
  }));

router.post("/order_items_by_user/", checkToken, (req, res) => {
  const { body } = req;
  const { order_id } = body;
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      console.log(order_id);
      pool.query(
        "SELECT product_name, quantity, unit_price  FROM order_items o JOIN products p ON o.product_id=p.product_id WHERE o.order_id = ?", [order_id],
        function (err, results) {
          if (err) {
            console.error(err);
            const errorResponse = ApiResponse.error(500, "Internal Server Error");
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

router.get("/order_items/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "SELECT * FROM order_items o JOIN products p WHERE o.product_id=p.product_id ORDER BY order_id",
        function (err, results) {
          if (err) {
            console.error(err);
            const errorResponse = ApiResponse.error(500, "Internal Server Error");
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

router.get("/order_table_columns/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_industry' AND TABLE_NAME = 'orders';",
        function (err, results) {
          if (err) {
            console.error(err);
            const errorResponse = ApiResponse.error(500, "Internal Server Error");
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

// Add order
router.post("/create_order/", (req, res) => {
  let orderNumber = generateOrderNumber();
  console.log(orderNumber);
  pool.query(
    "INSERT INTO `orders` (`order_number`, `customer_id`, `phone_number`, `shipping_address`, `billing_address`, `total_amount` ) VALUES (?,?,?,?,?,?)",
    [
      orderNumber,
      req.body.currentUser.customer_id,
      req.body.currentUser.phone_number,
      req.body.currentUser.address,
      req.body.currentUser.address,
      req.body.total_price,
    ],
    function (err, results) {
      if (err) {
        console.error(err);
        const errorResponse = ApiResponse.error(500, "Internal Server Error");
        res.status(500).json(errorResponse);
      } else {
        // Send a notification email to owner
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
        });
        req.body.items.map((order) => {
          pool.query(
            "INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`, `unit_price`, `total_price` ) VALUES (?,?,?,?,?)",
            [
              results.insertId,
              order.product_id,
              order.order_quantity,
              order.unit_price,
              order.total_price,
            ],
            function (err, itemresults) {
              if (err) {
                console.error(err);
                const errorResponse = ApiResponse.error(
                  500,
                  "Internal Server Error"
                );
                res.status(500).json(errorResponse);
              } else {
                console.log(itemresults);
                // const successResponse = ApiResponse.success(results);
                // res.json(successResponse);
              }
            }
          );
        });

        const successResponse = ApiResponse.success({
          result: results,
          order_number: orderNumber,
        });
        res.json(successResponse);
      }
    }
  );
  console.log(req.body.items.length);
  //     }
  //   });
});

// Update order
router.post("/update_order/", checkToken, (req, res) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      pool.query(
        "UPDATE `orders` SET `order_status` = ?, `phone_number` = ?, `shipping_address` = ?, `billing_address` = ?, `payment_method` = ?, `payment_status` = ?, `comments` = ? WHERE `order_id` = ?",
        [
          req.body.order_status,
          req.body.phone_number,
          req.body.shipping_address,
          req.body.billing_address,
          req.body.payment_method,
          req.body.payment_status,
          req.body.comments,
          req.body.order_id,
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

module.exports = router;
