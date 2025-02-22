const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../utils/env");
const { getUserFromDB } = require("../db/userDB");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await getUserFromDB({ email });
        if (!user) {
          return done(null, false, {
            error: "User with this email does not exist",
          });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          return done(null, false, { error: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        console.error("Login error:", error);
        return done(error);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, data) => {
      try {
        const user = await getUserFromDB({ id: payload.sub });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }
      } catch (error) {
        console.log(error);
        return done(null, false, { error: error });
      }
    }
  )
);

module.exports = passport;