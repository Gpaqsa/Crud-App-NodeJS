const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const router = express.Router();
const { registerUser, loginUser } = require("../Controllers/userController");

// მომხმარებლის რეგისტრაცია
router.post("/register", registerUser);

// მომხმარებლის შესვლა
router.post("/login", loginUser);


module.exports = router;
