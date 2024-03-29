const materialService = require("../services/material.service");
const menuService = require("../services/menu.service");
const materialSerializer = require("../serializers/material");

const controller = {
  async query(req, res) {
    try {
      req.validate();
      const materials = await materialService.query(req.query);
      const materialSerialized = materialSerializer.serialize(materials);
      res.success(materialSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async getByMenuId(req, res) {
    try {
      req.validate();
      const { menuId } = req.params;
      const { shopId } = req.query;
      const menu = await menuService.getById(shopId, menuId);
      const menuMaterials = menu.materials ?? [];
      const materialIds = menuMaterials.map((o) => o.materialId.toString());
      const materials = await materialService.getByIds(shopId, materialIds, false);
      const materialSerialized = materialSerializer.serialize(materials, menuMaterials);
      res.success(materialSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async create(req, res) {
    try {
      req.validate();
      const material = await materialService.create(req.body);
      const materialSerialized = materialSerializer.serialize([material]);
      res.success(materialSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async update(req, res) {
    try {
      req.validate();
      const { id } = req.params;
      const param = { ...req.body, id };
      const material = await materialService.update(param);
      const materialSerialized = materialSerializer.serialize([material]);
      res.success(materialSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async remove(req, res) {
    try {
      req.validate();
      const { id } = req.params;
      const param = { ...req.query, id };
      const material = await materialService.remove(param);
      const materialSerialized = materialSerializer.serialize([material]);
      res.success(materialSerialized);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...controller };
