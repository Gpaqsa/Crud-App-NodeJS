const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database
const db = new sqlite3.Database("./crud-app.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create a new item
router.post("/items", (req, res) => {
  const { name, description, quantity } = req.body;
  db.run(
    "INSERT INTO items (name, description, quantity) VALUES (?, ?, ?)",
    [name, description, quantity],
    function (err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.json({ id: this.lastID });
    }
  );
});

// Get all items
router.get("/items", (req, res) => {
  db.all("SELECT * FROM items", [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(rows);
  });
});

// Get a single item by id
router.get("/items/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM items WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(row);
  });
});

// Update an item
router.put("/items/:id", (req, res) => {
  const { name, description, quantity } = req.body;
  const { id } = req.params;
  db.run(
    "UPDATE items SET name = ?, description = ?, quantity = ? WHERE id = ?",
    [name, description, quantity, id],
    function (err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.json({ changes: this.changes });
    }
  );
});

// Delete an item
router.delete("/items/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM items WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json({ changes: this.changes });
  });
});

module.exports = router;
