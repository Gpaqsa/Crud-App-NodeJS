const express = require("express");
const cors = require("cors");
const itemRoutes = require("./routes/items");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database("./crud-app.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");

    // Uncomment the following code to create the table and insert some data initially
    /*
    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        quantity INTEGER
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        // Insert some data
        db.run(`
          INSERT INTO items (name, description, quantity)
          VALUES ('Item1', 'Description1', 10),
                 ('Item2', 'Description2', 20)
        `);
      }
    });
    */
  }
});

// Use routes
app.use("/api", itemRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the CRUD application!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
