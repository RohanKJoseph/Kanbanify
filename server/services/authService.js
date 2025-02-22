const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

const { getRefreshTokenToDB, addRefreshTokenToDB } = require("../db/userDB");

class AuthService {
  createRefreshToken = async (userId, keepLoggedIn = false) => {
    const refreshToken = generateRefreshToken(userId, keepLoggedIn);
    const expiresAt = new Date(
      Date.now() + (keepLoggedIn ? 100 * 365 : 14) * 24 * 60 * 60 * 1000
    );
    await addRefreshTokenToDB(userId, refreshToken, expiresAt);
    return refreshToken;
  };

  refreshAccessToken = async (refreshToken) => {
    const payload = verifyRefreshToken(refreshToken);
    const savedToken = await getRefreshTokenToDB();
    if (!savedToken) {
      throw new Error("Invalid refresh token");
    }
    return generateAccessToken(payload.sub);
  };
}

module.exports = new AuthService();