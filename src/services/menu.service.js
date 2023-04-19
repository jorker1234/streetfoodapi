const _ = require("lodash");
const Menu = require("../models/Menu");
const { ErrorNotFound } = require("../configs/errors");

const service = {
  async query({
    shopId,
    keyword,
    skip = 0,
    limit = 10,
    sort = { name: 1 },
    projection = null,
  }) {
    const filter = {
      shopId,
      isActived: true,
    };
    if (!_.isNil(keyword)) {
      filter.nameSearch = new RegExp(`^${keyword.toLowerCase()}`);
    }
    const menus = await Menu.find(filter, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    return menus;
  },

  async getById(shopId, id) {
    const menu = await Menu.findById(id).lean();
    if (!menu || !menu.isActived || menu.shopId.toString() !== shopId) {
      throw ErrorNotFound("menu is not exists.");
    }
    return menu;
  },

  async getByIds(shopId, ids = []) {
    const uniqIds = _.uniq(ids);
    const menus = await Menu.find({
      _id: uniqIds,
      shopId,
      isActived: true,
    }).lean();
    if (!menus || uniqIds.length !== menus.length) {
      throw ErrorNotFound("menus are not exists.");
    }
    return menus;
  },

  async create({ name, shopId, price, description, imagePath, imageUrl }) {
    const nameSearch = name.toLowerCase();
    const menu = await Menu.create({
      name,
      nameSearch,
      shopId,
      price,
      description,
      imagePath,
      imageUrl,
    });
    return menu;
  },

  async remove({ shopId, id, removeFile }) {
    const menu = await Menu.findOneAndDelete({
      _id: id,
      shopId,
    }, {new: true}).lean();
    if(menu.imagePath) {
      await removeFile(menu.imagePath);
    }
    return menu;
  },
};

module.exports = { ...service };
