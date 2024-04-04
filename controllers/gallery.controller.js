const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size");

router.get("/", (req, res) => {
  try {
    // Assuming your gallery pictures are stored in a directory named "gallery"
    const galleryDir = path.join(__dirname, "../public/images");

    // Read the contents of the gallery directory
    fs.readdir(galleryDir, (err, files) => {
      if (err) {
        console.error("Error reading gallery directory:", err);
        res.status(500).json({ error: "Internal server error." });
        return;
      }

      // Filter out any non-image files
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|gif)$/i.test(file)
      );

      // Create an array of complete image URLs
      const imageUrls = imageFiles.map((file) => {
        // const sizeOf = require('image-size');

        // // Path to your image file
        // const imagePath = 'path/to/your/image.jpg';+++++++++

        // // Get the dimensions of the image
        // const dimensions = sizeOf(imagePath);

        // console.log('Width:', dimensions.width);
        // console.log('Height:', dimensions.height);

        return `${req.protocol}://${req.get("host")}/images/${file}`;
      });

      res.json({ images: imageUrls });
    });
  } catch (error) {
    console.error("Error retrieving gallery pictures:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
