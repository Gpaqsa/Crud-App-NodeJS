const bcrypt = require("bcrypt");
const db = require("../db");

// User registration
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  try {
    // Check if email already exists
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Database query failed" });
      }
      if (row) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Check if username already exists
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, row) => {
          if (err) {
            return res.status(500).json({ message: "Database query failed" });
          }
          if (row) {
            return res.status(400).json({ message: "Username already exists" });
          }

          // Hash password and insert user
          const hashedPassword = await bcrypt.hash(password, 10);
          db.run(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword],
            function (err) {
              if (err) {
                return res
                  .status(500)
                  .json({ message: "Failed to register user" });
              }
              res.status(201).json({ message: "User registered successfully" });
            }
          );
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerUser };
