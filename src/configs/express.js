const express = require("express");
const { mongoDB } = require("./database");
const cors = require('cors');
const passport = require('./passport');
const appConfig = require("./app");

module.exports = async (app) => {
  // Connect MongoDB
  mongoDB();

  // CORS
  const allowedOrigins = appConfig.origin.toString().split(",");
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  };
  app.use(cors(corsOptions));

  // Parser Body
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  passport(app);

  // Custom Response Format
  app.use(require("../configs/responseFormat"));
};
