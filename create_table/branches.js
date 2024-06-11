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
const createBranchesTable = () => {
  const sql = `
    CREATE TABLE branches (
        branch_id INT AUTO_INCREMENT PRIMARY KEY,
        branch_name VARCHAR(255) NOT NULL,
        branch_address VARCHAR(255) NOT NULL,
        branch_phone VARCHAR(255) NOT NULL,
        branch_email VARCHAR(255) NOT NULL,
        branch_facebook_link VARCHAR(255) NOT NULL,
        branch_ig_link VARCHAR(255) NOT NULL,
        branch_x_link VARCHAR(255) NOT NULL,
        branch_reserve_link VARCHAR(255) NOT NULL,
        branch_opening_hours VARCHAR(255) NOT NULL
    )
  `;

  pool.query(sql, (err, result) => {
    if (err) throw err;
    console.log("Branches table created");
  });
};

// Create the tables
createBranchesTable();
