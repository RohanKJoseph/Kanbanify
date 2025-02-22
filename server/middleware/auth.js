const passport = require("../config/passport");

const authenticateJWT = passport.authenticate("jwt", { session: false });
const authenticateLocal = passport.authenticate("local", { session: false });

module.exports = {
  authenticateJWT,
  authenticateLocal,
};
