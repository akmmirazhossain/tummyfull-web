// pages/api/mealOrders.js

import { createConnection } from "mysql2";

export default async function handler(req, res) {
  // Database connection configuration
  const connection = createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "mealready",
  });

  // Variables
  const status = "pending";
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  try {
    // Connect to MySQL
    connection.connect();

    // Query to fetch data
    const query = `
      SELECT
        o.mrd_order_date,
        m.mrd_menu_day,
        m.mrd_menu_period,
        m.mrd_menu_price,
        f.mrd_food_name,
        f.mrd_food_desc,
        f.mrd_food_price,
        f.mrd_food_img,
        f.mrd_food_type,
        SUM(o.mrd_order_quantity) AS total_quantity,
        SUM(o.mrd_order_total_price) AS total_price
      FROM mrd_order o
      INNER JOIN mrd_menu m ON o.mrd_order_menu_id = m.mrd_menu_id
      LEFT JOIN mrd_food f ON FIND_IN_SET(f.mrd_food_id, REPLACE(m.mrd_menu_food_id, ' ', '')) > 0
      WHERE o.mrd_order_status = ? AND o.mrd_order_date >= ?
      GROUP BY o.mrd_order_date, m.mrd_menu_day, m.mrd_menu_period, m.mrd_menu_price, f.mrd_food_name
      ORDER BY o.mrd_order_date, m.mrd_menu_day, m.mrd_menu_period, f.mrd_food_name
    `;

    // Execute the query
    connection.query(query, [status, today], (error, results) => {
      if (error) {
        throw error;
      }

      // Process the results into the desired JSON format
      let formattedData = {};

      results.forEach((row) => {
        const {
          mrd_order_date,
          mrd_menu_day,
          mrd_menu_period,
          mrd_menu_price,
          mrd_food_name,
          mrd_food_desc,
          mrd_food_price,
          mrd_food_img,
          mrd_food_type,
          total_quantity,
          total_price,
        } = row;

        if (!formattedData[mrd_order_date]) {
          formattedData[mrd_order_date] = {};
        }

        if (!formattedData[mrd_order_date][mrd_menu_day]) {
          formattedData[mrd_order_date][mrd_menu_day] = {};
        }

        if (!formattedData[mrd_order_date][mrd_menu_day][mrd_menu_period]) {
          formattedData[mrd_order_date][mrd_menu_day][mrd_menu_period] = {
            food: [],
          };
        }

        formattedData[mrd_order_date][mrd_menu_day][mrd_menu_period].food.push({
          "mrd_food.mrd_food_name": mrd_food_name,
          "mrd_food.mrd_food_desc": mrd_food_desc,
          "mrd_food.mrd_food_price": mrd_food_price.toString(),
          "mrd_food.mrd_food_img": mrd_food_img,
          "mrd_food.mrd_food_type": mrd_food_type,
        });

        formattedData[mrd_order_date][mrd_menu_day][mrd_menu_period][
          "mrd_order.mrd_order_quantity"
        ] = total_quantity.toString();
        formattedData[mrd_order_date][mrd_menu_day][mrd_menu_period][
          "mrd_menu.mrd_menu_price"
        ] = mrd_menu_price.toString();
        formattedData[mrd_order_date][mrd_menu_day][mrd_menu_period][
          "mrd_order.mrd_order_total_price"
        ] = total_price.toString();
      });

      // Close connection
      connection.end();

      // Send the formatted data as JSON response
      res.status(200).json(formattedData);
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Error fetching data" });
  } finally {
    // Ensure connection is closed
    connection.end();
  }
}
