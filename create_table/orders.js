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

// Function to create the order's items table
const createOrderItemsTable = () => {
  const sql = `
    CREATE TABLE order_items (
        order_item_id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        order_number VARCHAR(30) NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        total_price DECIMAL(10, 2) AS (quantity * unit_price) STORED,
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
    )
    `;

  pool.query(sql, (err, result) => {
    if (err) throw err;
    console.log("Order items table created");
  });
};

// Function to create the orders table
const createOrdersTable = () => {
  const sql = `
    CREATE TABLE orders (
        order_id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_amount DECIMAL(10, 2) NOT NULL,
        order_status VARCHAR(50) NOT NULL,
        shipping_address VARCHAR(255) NOT NULL,
        billing_address VARCHAR(255),
        payment_method VARCHAR(50),
        payment_status VARCHAR(50) NOT NULL,
        comments TEXT,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    )
  `;

  pool.query(sql, (err, result) => {
    if (err) throw err;
    console.log("Orders table created");
  });
};

// Create the tables
createOrdersTable();
createOrderItemsTable();
