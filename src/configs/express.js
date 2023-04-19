const express = require("express");
const { mongoDB } = require("./database");

module.exports = async (app) => {
  // Connect MongoDB
  mongoDB();

  // Parser Body
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Custom Response Format
  app.use(require("../configs/responseFormat"));
};
