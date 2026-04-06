const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ MySQL (Railway Database)
const db = mysql.createPool({
  host: "interchange.proxy.rlwy.net",
  user: "root",
  password: "DcxNIVIZOsbDMKAYAgydzgTUszdhrTsg",
  database: "railway",
  port: 10375,
  waitForConnections: true,
  connectionLimit: 10
});

// ✅ Check DB connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB Connection Error:", err);
  } else {
    console.log("✅ Connected to Railway MySQL");
    connection.release();
  }
});

// ✅ Create table if not exists
const createTableQuery = `
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  message TEXT
)
`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.log("❌ Table creation error:", err);
  } else {
    console.log("✅ Contacts table ready");
  }
});

// ✅ API route
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";

  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.log("❌ Insert error:", err);
      res.status(500).send("Database error");
    } else {
      res.send("Message sent successfully!");
    }
  });
});

// ✅ Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ PORT (IMPORTANT for Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});