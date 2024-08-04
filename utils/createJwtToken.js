const jwt = require("jsonwebtoken");

const SECRET_KEY = "6Dz1u:H'P;GM/B,";

// JWT-ის გენერირება
const token = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

module.exports = { token };
