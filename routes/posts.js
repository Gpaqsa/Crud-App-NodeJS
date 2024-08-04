const express = require("express");
const router = express.Router();
const db = require("../db");

// Create a new post
router.post("/posts", (req, res) => {
  const { title, content, userId } = req.body;
  const sql = `INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)`;
  db.run(sql, [title, content, userId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Get all posts
router.get("/posts", (req, res) => {
  const sql = `SELECT * FROM posts`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get a single post by ID
router.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM posts WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(row);
  });
});

// Update a post by ID
router.put("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { title, content, userId } = req.body;
  const sql = `UPDATE posts SET title = ?, content = ?, userId = ? WHERE id = ?`;
  db.run(sql, [title, content, userId, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post updated" });
  });
});

// Delete a post by ID
router.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM posts WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted" });
  });
});

module.exports = router;
