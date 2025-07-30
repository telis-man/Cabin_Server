const express = require("express");
const participantsController = require("./controllers/participants.controller.js");
const galleryController = require("./controllers/gallery.controller.js");
const logoController = require("./controllers/logoImage.controller.js");
const cors = require("cors");

const routes = (app) => {
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(express.json());
  app.use("/participants", participantsController);
  app.use("/gallery", galleryController);
  app.use("/logoImage", logoController);
};
module.exports = routes;
