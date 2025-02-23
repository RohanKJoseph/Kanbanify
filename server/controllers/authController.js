const authService = require("../services/authService");
const { generateAccessToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const {
  getUserFromDB,
  addUserToDB,
  updateUserDataInDB,
} = require("../db/userDB");
const libravatar = require("libravatar");

class AuthController {
  signup = async (req, res) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name)
        return res
          .status(400)
          .json({ error: "email, password & name are required fields" });

      const existingUser = await getUserFromDB({ email });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const avatarUrl = await libravatar.get_avatar_url({
        email,
        size: 400,
        default: "mm",
      });
      await addUserToDB(email, hashedPassword, name, avatarUrl);

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error creating user" });
    }
  };

  login = async (req, res) => {
    try {
      const accessToken = generateAccessToken(req.user.id);
      const refreshToken = await authService.createRefreshToken(
        req.user.id,
        req.body.keepLoggedIn
      );
      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: "Error logging in" });
    }
  };

  refreshAccessToken = async (req, res) => {
    try {
      const { refreshToken } = req.body;
      const accessToken = await authService.refreshAccessToken(refreshToken);
      res.json({ accessToken });
    } catch (error) {
      res.status(401).json({ error: "Invalid refresh token" });
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      const isValid = await bcrypt.compare(oldPassword, req.user.password);

      if (!isValid)
        return res.status(400).json({ error: "Old password is incorrect" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await updateUserDataInDB(
        (where = { id: req.user.id }),
        (data = { password: hashedPassword })
      );

      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  };
}

module.exports = new AuthController();
