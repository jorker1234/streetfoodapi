const userService = require("../services/user.service");
const userSerializer = require("../serializers/user");

const controller = {
  async query(req, res) {
    try {
      req.validate();
      const users = await userService.query(req.query);
      const userSerialized = userSerializer.serialize(users);
      res.success(userSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async create(req, res) {
    try {
      req.validate();
      const param = { ...req.body };
      const user = await userService.create(param);
      const userSerialized = userSerializer.serialize([user]);
      res.success(userSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async changePassword(req, res) {
    try {
      req.validate();
      const { _id } = req.user;
      const param = { ...req.body, id: _id };
      const user = await userService.changePassword(param);
      const userSerialized = userSerializer.serialize([user]);
      res.success(userSerialized);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...controller };
