const express = require("express");
const router = express.Router();
const pool = require("../db");

const ApiResponse = require("../models/apiResponse");

router.get("/", (req, res) => {
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
});

module.exports = router;
