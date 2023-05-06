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
    if(!ObjectId.isValid(id)) {
      throw ErrorNotFound("menu is not exists.");
    }
    const shop = await Shop.findById(id).lean();
    if (!shop || !shop.isActived) {
      throw ErrorNotFound("shop is not exists.");
    }
    return shop;
  },

  async create({ name, receiveNumber, phone, imagePath, imageUrl  }) {
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
};

module.exports = { ...service };
