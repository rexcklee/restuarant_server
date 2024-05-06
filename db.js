require("dotenv").config();
const mysql = require("mysql2");

// Create a connection pool with the provided configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
});

module.exports = pool;
