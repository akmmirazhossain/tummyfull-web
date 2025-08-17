// pages/api/discount.js
import mysql from "mysql2/promise";

export default async function handler(req, res) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      "SELECT mrd_setting_discount_reg FROM mrd_setting LIMIT 1"
    );
    await connection.end();

    res.status(200).json({ discount: rows[0]?.mrd_setting_discount_reg || 0 });
  } catch (err) {
    console.error("Database error:", err.message);
    return res
      .status(500)
      .json({ error: "Database error", message: err.message });
  }
}
