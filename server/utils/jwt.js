const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_REFRESH_SECRET } = require("./env");

const generateAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId, keepLoggedIn) => {
  return jwt.sign({ sub: userId }, JWT_REFRESH_SECRET, {
    expiresIn: keepLoggedIn ? "100y" : "14d",
  });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
