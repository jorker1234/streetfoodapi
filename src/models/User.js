const mongoose = require("mongoose");

const RoleStatus = {
  ADMIN: "admin",
  OWNER: "owner",
  MEMBER: "member",
  NONE: "none",
};

const schema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    usernameSearch: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    nameSearch: { type: String, required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId },
    role: {
      type: String,
      enum: Object.values(RoleStatus),
      default: RoleStatus.NONE,
    },
    isActived: { type: Boolean, default: true },
  },
  { timestamps: true }
);

schema.index({ username: 1 }, { unique: true });

module.exports = {
  User: mongoose.model("User", schema),
  RoleStatus,
};
