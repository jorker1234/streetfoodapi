const passport = require("passport");
const { ErrorUnauthorized } = require("../configs/errors");

const localAuthenticate = (req, res, next) => {
  try {
    req.validate();
    authenticate("local", req, res, next);
  } catch (error) {
    res.error(error);
    return;
  }

  return passport.authenticate("local", { session: false }, (err, user) => {
    if (err) {
      res.error(err);
      return;
    }
    req.user = user;
    next();
  })(req, res, next);
};

const jwtAuthenticate = (req, res, next) => {
  authenticate("jwt", req, res, next);
};

const authenticate = (name, req, res, next) => {
  return passport.authenticate(name, { session: false }, (err, user, info) => {
    if (err) {
      res.error(err);
      return;
    }
    if (info) {
      res.error(info);
      return;
    }
    if (!user) {
      res.error(ErrorUnauthorized("User not found"));
      return;
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = {
  localAuthenticate,
  jwtAuthenticate,
};
