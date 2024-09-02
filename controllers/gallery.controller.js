const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size");

router.get("/", (req, res) => {
  try {
    const galleryDir = path.join(__dirname, "../public/images");

    fs.readdir(galleryDir, (err, files) => {
      if (err) {
        console.error("Error reading gallery directory:", err);
        res.status(500).json({ error: "Internal server error." });
        return;
      }

      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|gif)$/i.test(file)
      );

      const baseDir = path.join(__dirname, "..", "public", "images");
      let imgSizes = {};

      const imageUrls = imageFiles.map((file) => {
        const sizeOf = require("image-size");

        const imagePath = path.join(baseDir, file);
        const dimensions = sizeOf(imagePath);

        console.log("Width:", dimensions.width);
        console.log("Height:", dimensions.height);

        // return `${req.protocol}://${req.get("host")}/images/${file}`;
        return {
          path: `${req.protocol}://${req.get("host")}/images/${file}`,
          width: dimensions.width,
          height: dimensions.height,
        };
      });

      res.json({ images: imageUrls });
    });
  } catch (error) {
    console.error("Error retrieving gallery pictures:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
