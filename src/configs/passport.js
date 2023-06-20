const passport = require("passport");
const passportJWT = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const userService = require("../services/user.service");
const { tokenSecret } = require("./app");

module.exports = (app) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await userService.signin({ username, password });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: tokenSecret,
      },
      async (jwtPayload, done) => {
        try {
          const { id } = jwtPayload;
          const user = await userService.getById(id);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
