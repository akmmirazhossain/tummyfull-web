// pages/api/getOrders.js
import mysql from "mysql2/promise";

// Configure the database connection
const dbConfig = {
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "mysql", // Replace with your MySQL password
  database: "mealready",
};

// The API handler
export default async function handler(req, res) {
  try {
    // Create a connection to the database
    const connection = await mysql.createConnection(dbConfig);

    // Query to fetch data from the mrd_order table
    const [rows] = await connection.execute(
      "SELECT * FROM `mrd_order` ORDER BY `mrd_order_date` ASC"
    );

    // Close the database connection
    await connection.end();

    // Send the result as a JSON response
    res.status(200).json(rows);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: error.message });
  }
}
