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
const createHomeSectionsTable = () => {
  const sql = `
    CREATE TABLE homeSections (
        homeSection_id INT AUTO_INCREMENT PRIMARY KEY,
        homeSection_title VARCHAR(255) NOT NULL,
        homeSection_content TEXT,
        image_id VARCHAR(100) NOT NULL,
        create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        isshow TINYINT DEFAULT 0,
        sort INT DEFAULT 0
    );
  `;

  pool.query(sql, (err, result) => {
    if (err) throw err;
    console.log("Home section table created");
  });
};

// Create the table
createHomeSectionsTable();
