const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection (CHANGE THIS LATER FOR RENDER)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "devikahouse69/",
  database: "portfolio_db"
});

db.connect(err => {
  if (err) {
    console.error("DB Error:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// API
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  
  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Database error");
    } else {
      res.send("Message sent successfully!");
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});