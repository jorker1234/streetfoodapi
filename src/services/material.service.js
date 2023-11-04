const _ = require("lodash");
const ObjectId = require("mongoose").Types.ObjectId;
const Material = require("../models/Material");
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
    const materials = await Material.find(filter, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    return materials;
  },

  async getById(shopId, id) {
    if (!ObjectId.isValid(id)) {
      throw ErrorNotFound("material is not exists.");
    }
    const material = await Material.findById(id).lean();
    if (!material || !material.isActived || material.shopId.toString() !== shopId) {
      throw ErrorNotFound("material is not exists.");
    }
    return material;
  },

  async getByIds(shopId, ids = []) {
    const uniqIds = _.uniq(ids);
    const materials = await Material.find({
      _id: uniqIds,
      shopId,
      isActived: true,
    }).lean();
    if (!materials || uniqIds.length !== materials.length) {
      throw ErrorNotFound("materials are not exists.");
    }
    return menus;
  },

  async create({ name, shopId, price, description, unit }) {
    const nameSearch = name.toLowerCase();
    const material = await Material.create({
      name,
      nameSearch,
      shopId,
      price,
      description,
      unit,
    });
    return material;
  },

  async update({ id, name, shopId, price, description, unit }) {
    const updateCriteria = {
      name,
      price,
      description,
      unit,
    };
    await service.getById(shopId, id);
    return await Material.findByIdAndUpdate(id, updateCriteria, {
      upsert: true,
      new: true,
    });
  },

  async remove({ shopId, id }) {
    const updateCriteria = {
      isActived: false,
    };
    await service.getById(shopId, id);
    const material = await Material.findByIdAndUpdate(id, updateCriteria, { new: true }).lean();
    return material;
  },
};

module.exports = { ...service };
