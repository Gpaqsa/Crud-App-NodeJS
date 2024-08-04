const express = require("express");
const db = require("../db");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// პოსტების შექმნა
router.post("/", authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  // ვალიდაციის დამატება
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  db.run(
    "INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)",
    [title, content, userId],
    function (err) {
      if (err) {
        console.error("Error inserting post:", err.message);
        return res.status(500).json({ message: "Failed to create post" });
      }
      res.status(201).json({
        id: this.lastID,
        title,
        content,
        userId,
        createdAt: new Date().toISOString(),
      });
    }
  );
});

// ყველა პოსტის მიღება
router.get("/", (req, res) => {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    if (err) {
      console.error("Error fetching posts:", err.message);
      return res.status(500).json({ message: "Failed to retrieve posts" });
    }
    res.json(rows);
  });
});

module.exports = router;
