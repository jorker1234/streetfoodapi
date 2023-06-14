const _ = require("lodash");
const ObjectId = require("mongoose").Types.ObjectId;
const { User, RoleStatus } = require("../models/User");
const { ErrorNotFound } = require("../configs/errors");

const service = {
  async query({
    keyword,
    skip = 0,
    limit = 10,
    sort = { name: 1 },
    projection = null,
  }) {
    const filter = {
      isActived: true,
    };
    if (!_.isNil(keyword)) {
      filter.nameSearch = new RegExp(`^${keyword.toLowerCase()}`);
    }
    const users = await User.find(filter, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    return users;
  },

  async getById(id) {
    if (!ObjectId.isValid(id)) {
      throw ErrorNotFound("user is not exists.");
    }
    const user = await User.findById(id).lean();
    if (!user || !user.isActived) {
      throw ErrorNotFound("user is not exists.");
    }
    return user;
  },

  async create({ name, username, password, role, shopId }) {
    const nameSearch = name.toLowerCase();
    const usernameearch = username.toLowerCase();
    const user = await User.create({
      name,
      nameSearch,
      username,
      usernameearch,
      password,
      role,
      shopId,
    });
    return user;
  },
};

module.exports = { ...service };
