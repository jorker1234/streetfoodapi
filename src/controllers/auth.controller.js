const jwt = require("jsonwebtoken");
const { tokenSecret, tokenAge } = require("../configs/app");
const userSerializer = require("../serializers/user");

const controller = {
  async signin(req, res, next) {
    const token = jwt.sign({ id: req.user._id.toString() }, tokenSecret, {
      expiresIn: Math.floor(tokenAge / 1000),
    });
    const user = { ...req.user, token };
    const userSerialized = userSerializer.serialize([user]);
    res.success(userSerialized);
  },

  auth(req, res, next, token = undefined) {
    const user = { ...req.user, token };
    const userSerialized = userSerializer.serialize([user]);
    res.success(userSerialized);
  },
};

module.exports = { ...controller };
