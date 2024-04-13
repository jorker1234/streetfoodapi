const reportService = require("../services/report.service");
// const shopService = require("../services/shop.service");
// const orderService = require("../services/order.service");
// const menuService = require("../services/menu.service");
// const fileService = require("../services/file.service");
// const promptpayService = require("../services/promptpay.service");
// const billSerializer = require("../serializers/bill");

const controller = {

  async getSale(req, res) {
    try {
      req.validate();
      const reports = await reportService.getSale(req.query);
      res.success(reports);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...controller };
