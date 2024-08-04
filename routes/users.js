const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const router = express.Router();

const SECRET_KEY = "6Dz1u:H'P;GM/B,";

// მომხმარებლის რეგისტრაცია
router.post("/register", registerUser);

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

        const authToken = token({ id: user.id, username: user.username });

        res.json({ token: authToken });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
