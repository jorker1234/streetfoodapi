const _ = require("lodash");
const ObjectId = require("mongoose").Types.ObjectId;
const { Bill, BillStatus } = require("../models/Bill");
const { Order } = require("../models/Order");
const Menu = require("../models/Menu");

const moment = require("moment");

const service = {
  async getSale({ shopId, menuId, from, to }) {
    const filter = {
      shopId: new ObjectId(shopId),
      isActived: true,
      status: BillStatus.COMPLETE,
      completedAt: {
        $gte: moment(from, "YYYY-MM-DD").toDate(),
        $lte: moment(to, "YYYY-MM-DD")
          .add(1, "day")
          .subtract(1, "second")
          .toDate(),
      },
    };
    if (menuId) {
      filter["items.menuId"] = new ObjectId(menuId);
    }

    const aggregateQuery = [
      { $match: filter },
      { $unwind: "$items" },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$completedAt",
              },
            },
            menuId: "$items.menuId",
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
    ];
    let reports = await Bill.aggregate(aggregateQuery);
    if (menuId && reports.length > 0) {
      reports = reports.filter((o) => o.menuId.toString() === menuId);
    }

    const menuIds = _.uniq(reports.map((o) => o.menuId));
    const menus = await Menu.find(
      {
        _id: menuIds,
        shopId,
      },
      { name: 1 }
    ).lean();

    const menuDict = _.reduce(
      menus,
      (prev, { _id, name }) => {
        const result = {
          ...prev,
          [_id.toString()]: name,
        };
        return result;
      },
      {}
    );

    return reports.map((o) => {
      return {
        ...o,
        name: menuDict[o.menuId.toString()],
      };
    });
  },
};

module.exports = { ...service };
