const shopService = require("../services/shop.service");
const fileService = require("../services/file.service");
const shopSerializer = require("../serializers/shop");

const controller = {
  async query(req, res) {
    try {
      req.validate();
      const shops = await shopService.query(req.query);
      const shopSerialized = shopSerializer.serialize(shops);
      res.success(shopSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async create(req, res) {
    try {
      req.validate();
      let file = {};
      if (req.file) {
        file = await fileService.upload(req.file, "shops");
      }
      const param = { ...req.body, ...file };
      const shop = await shopService.create(param);
      const shopSerialized = shopSerializer.serialize([shop]);
      res.success(shopSerialized);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...controller };
