const _ = require("lodash");
const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;
const { User } = require("../models/User");
const {
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorBadRequest,
} = require("../configs/errors");

const service = {
  async query({
    keyword,
    skip = 0,
    limit = 10,
    sort = { username: 1 },
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
    const userExists = await User.findOne({ username }).lean();
    if (userExists) {
      throw ErrorBadRequest("username is exists.");
    }
    const nameSearch = name.toLowerCase();
    const usernameSearch = username.toLowerCase();
    const passwordHashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      nameSearch,
      username,
      usernameSearch,
      password: passwordHashed,
      role,
      shopId,
    });
    return user;
  },

  async signin({ username, password }) {
    const user = await User.findOne({ username }).lean();
    if (!user || !user.isActived) {
      throw ErrorUnauthorized("username or password is invalid.");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw ErrorUnauthorized("username or password is invalid.");
    }
    return user;
  },

  async changePassword({ id, password, oldPassword }) {
    const user = await service.getById(id);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      throw ErrorUnauthorized("old password is invalid.");
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    const userUpdated = await User.findByIdAndUpdate(
      user._id,
      {
        password: passwordHashed,
      },
      {
        new: true,
      }
    );
    return userUpdated;
  },
};

module.exports = { ...service };
