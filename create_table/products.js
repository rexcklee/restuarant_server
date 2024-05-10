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

// Function to create the product categories table
const createProductCategoriesTable = () => {
  const sql = `
  CREATE TABLE product_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
  )
`;

  pool.query(sql, (err, result) => {
    if (err) throw err;
    console.log("Product categories table created");
  });
};

// Function to create the products table
const createProductsTable = () => {
  const sql = `
    CREATE TABLE products (
      product_id INT AUTO_INCREMENT PRIMARY KEY,
      product_name VARCHAR(255) NOT NULL,
      product_description VARCHAR(255) NOT NULL,
      product_price DECIMAL(8, 2) NOT NULL,
      category_id INT,
      FOREIGN KEY (category_id) REFERENCES product_categories(category_id)
    )
  `;

  pool.query(sql, (err, result) => {
    if (err) throw err;
    console.log("Products table created");
  });
};

// Create the tables
createProductCategoriesTable();
createProductsTable();
