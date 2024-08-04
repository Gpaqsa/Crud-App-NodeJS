const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();

const SECRET_KEY = "your_secret_key"; // გამოიყენეთ უსაფრთხო საიდუმლო გასაღები

// მომხმარებლის რეგისტრაცია
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE constraint failed")) {
            return res.status(400).json({ message: "Username already exists" });
          }
          return res.status(500).json({ message: "Failed to register user" });
        }
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// მომხმარებლის შესვლა
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
          return res
            .status(400)
            .json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res
            .status(400)
            .json({ message: "Invalid username or password" });
        }

        const token = jwt.sign(
          { id: user.id, username: user.username },
          SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );

        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
