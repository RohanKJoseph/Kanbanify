const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const { authenticateJWT } = require("../middleware/auth");

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  authController.login
);
router.post("/refresh-token", authController.refreshAccessToken);
router.post("/signup", authController.signup);
router.post("/resetpassword", authenticateJWT, authController.resetPassword);

module.exports = router;