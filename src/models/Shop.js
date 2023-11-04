const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameSearch: { type: String, required: true },
    receiveNumber: { type: String, required: true },
    phone: { type: String },
    isActived: { type: Boolean, default: true },
    imagePath: { type: String },
    imageUrl: { type: String },
    promptpay: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", schema);
