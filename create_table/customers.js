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

// Function to create the branches table
const createCustomersTable = () => {
  const sql = `
    CREATE TABLE customers (
        customer_id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20),
        address TEXT,
        registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        payment_method VARCHAR(50)
    )
  `;

  pool.query(sql, (err, result) => {
    if (err) throw err;
    console.log("Customers table created");
  });
};

// Create the table
createCustomersTable();
