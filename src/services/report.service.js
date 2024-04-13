const _ = require("lodash");
const ObjectId = require("mongoose").Types.ObjectId;
const { Bill, BillStatus } = require("../models/Bill");

const service = {
  async getSale({ shopId, menuId, from, to }) {
    const filter = {
      shopId,
      isActived: true,
      status: BillStatus.COMPLETE,
      updatedAt: {
        $gte: from,
        $lte: to,
      },
    };
    if (menuId) {
      filter["$items.menuId"] = menuId;
    }

    const reports = await Bill.aggregate([
      { $match: filter },
      { $unwind: "$items" },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$updatedAt",
              },
            },
            menuId: "$items.name",
          },
          amount: { $sum: "$items.amount" },
        },
      },
      {
        $project: {
          date: "$_id.date",
          menuId: "$_id.menuId",
          amount: 1,
          _id: 0,
        },
      },
      { $sort: { date: 1 } },
    ]);

    return reports;
  },
};

module.exports = { ...service };
