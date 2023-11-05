const _ = require("lodash");
const ObjectId = require("mongoose").Types.ObjectId;
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
    if (!ObjectId.isValid(id)) {
      throw ErrorNotFound("menu is not exists.");
    }
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

  async update({ id, name, shopId, price, description, imagePath, imageUrl, isHidden }) {
    const updateCriteria = {
      name,
      price,
      description,
      imagePath,
      imageUrl,
      isHidden,
    };
    await service.getById(shopId, id);
    return await Menu.findByIdAndUpdate(id, updateCriteria, {
      upsert: true,
      new: true,
    });
  },

  async remove({ shopId, id, removeFile }) {
    const updateCriteria = {
      isActived: false,
    };
    await service.getById(shopId, id);
    const menu = await Menu.findByIdAndUpdate(id, updateCriteria, { new: true }).lean();
    if (menu.imagePath) {
      await removeFile(menu.imagePath);
    }
    return menu;
  },

  async updateMaterial({ shopId, id, materialId, quantity, note }) {
    const menu = await this.getById(shopId, id);
    const material = _.find(
      menu.materials,
      (item) => item.materialId.toString() === materialId
    );
    if (!material && quantity === 0) {
      return menu;
    }

    const searchCriteria = { _id: id, shopId };
    let updateCriteria = null;
    if (!material && quantity > 0) {
      updateCriteria = {
        $push: {
          materials: {
            materialId,
            quantity,
            note,
          },
        },
      };
    }
    if (material && quantity > 0) {
      searchCriteria["materials._id"] = material._id;
      updateCriteria = {
        $set: {
          "materials.$.quantity": quantity,
          "materials.$.note": note,
        },
      };
    }
    if (material && quantity === 0) {
      updateCriteria = {
        $pull: { materials: { _id: material._id } },
      };
    }

    return await Menu.findOneAndUpdate(searchCriteria, updateCriteria, {
      new: true,
    });
  },
};

module.exports = { ...service };
