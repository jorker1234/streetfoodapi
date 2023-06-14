const _ = require("lodash");
const ObjectId = require("mongoose").Types.ObjectId;
const Shop = require("../models/Shop");
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
    const menus = await Shop.find(filter, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    return menus;
  },

  async getById(id) {
    if (!ObjectId.isValid(id)) {
      throw ErrorNotFound("shop is not exists.");
    }
    const shop = await Shop.findById(id).lean();
    if (!shop || !shop.isActived) {
      throw ErrorNotFound("shop is not exists.");
    }
    return shop;
  },

  async create({ name, receiveNumber, phone, imagePath, imageUrl }) {
    const nameSearch = name.toLowerCase();
    const shop = await Shop.create({
      name,
      nameSearch,
      receiveNumber,
      phone,
      imagePath,
      imageUrl,
    });
    return shop;
  },

  async update({ id, name, receiveNumber, phone, imagePath, imageUrl }) {
    let updateCriteria = {
      name,
      receiveNumber,
      phone,
      imagePath,
      imageUrl,
    };
    return await Shop.findOneAndUpdate({ _id: id }, updateCriteria, {
      upsert: true,
      new: true,
    });
  },
};

module.exports = { ...service };
