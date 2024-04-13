const reportService = require("../services/report.service");

const controller = {
  async getSale(req, res) {
    try {
      req.validate();
      const reports = await reportService.getSale(req.query);
      res.success({ reports });
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...controller };
