const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET_KEY || "XdfggtFhgfs";

const signToken = (payload) => {
  return jwt.sign(payload, SECRET);
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = { signToken, verifyToken };
