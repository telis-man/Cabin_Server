const express = require("express");
const participantsController = require("./controllers/participants.controller.js");
const galleryController = require("./controllers/gallery.controller.js");
const logoImageController = require("./controllers/logoImage.controller.js");
const aboutImageController = require("./controllers/aboutImage.controller.js");
const backgroundImageController = require("./controllers/backgroundImage.controller.js");
const dimensionsImagesController = require("./controllers/dimensionsImages.controller.js");
const imagesPreviewController = require("./controllers/imagesPreview.controller.js");

const cors = require("cors");

const routes = (app) => {
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(express.json());
  app.use("/participants", participantsController);
  app.use("/gallery", galleryController);
  app.use("/logoImage", logoImageController);
  app.use("/backgroundImage", backgroundImageController);
  app.use("/aboutImage", aboutImageController);
  app.use("/dimensionsImages", dimensionsImagesController);
  app.use("/imagesPreview", imagesPreviewController);
};
module.exports = routes;
