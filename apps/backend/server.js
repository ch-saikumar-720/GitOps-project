const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Read from environment variables
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER || "admin";
const DB_PASSWORD = process.env.DB_PASSWORD || "password";
const DB_NAME = process.env.DB_NAME || "appdb";

// Step 1: Connect without DB
const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
});

db.connect((err) => {
  if (err) {
    console.error("Initial DB connection failed:", err);
    return;
  }

  console.log("Connected to MySQL");

  // Step 2: Create DB dynamically
  db.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``, (err) => {
    if (err) {
      console.error("Error creating database:", err);
      return;
    }

    console.log(`Database '${DB_NAME}' ensured`);

    // Step 3: Connect to that DB
    const appDb = mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    appDb.connect((err) => {
      if (err) {
        console.error("DB connection failed:", err);
        return;
      }

      console.log(`Connected to database: ${DB_NAME}`);

      // Step 4: Create table dynamically
      appDb.query(
        `CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100)
        )`,
        (err) => {
          if (err) {
            console.error("Error creating table:", err);
            return;
          }

          console.log("Users table ensured");
        }
      );

      // APIs
      app.get("/api/users", (req, res) => {
        appDb.query("SELECT * FROM users", (err, result) => {
          if (err) return res.status(500).send(err);
          res.json(result);
        });
      });

      app.post("/api/users", (req, res) => {
        const { name } = req.body;
        appDb.query(
          "INSERT INTO users (name) VALUES (?)",
          [name],
          (err) => {
            if (err) return res.status(500).send(err);
            res.send("User added");
          }
        );
      });

      app.listen(3000, () => {
        console.log("Backend running on port 3000");
      });
    });
  });
});
