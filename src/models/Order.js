const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    menuId: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    note: { type: String },
    isActived: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const schema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, required: true },
    items: { type: [ItemSchema], default: [] },
    isActived: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", schema);
