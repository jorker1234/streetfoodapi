const menuService = require("../services/menu.service");
const fileService = require("../services/file.service");
const menuSerializer = require("../serializers/menu");

const controller = {
  async query(req, res) {
    try {
      req.validate();
      const menus = await menuService.query(req.query);
      const menuSerialized = menuSerializer.serialize(menus);
      res.success(menuSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async create(req, res) {
    try {
      req.validate();
      let file = {};
      if (req.file) {
        file = await fileService.upload(req.file, "menus");
      }
      const param = { ...req.body, ...file };
      const menu = await menuService.create(param);
      const menuSerialized = menuSerializer.serialize([menu]);
      res.success(menuSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async remove(req, res) {
    try {
      req.validate();
      const { id } = req.params;
      const param = { ...req.body, id, removeFile: fileService.remove };
      const menu = await menuService.remove(param);
      const menuSerialized = menuSerializer.serialize([menu]);
      res.success(menuSerialized);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...controller };
