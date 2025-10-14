const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const generateBlurHash =
  require("../utils/blurhash.util.js").getBlurHashFromBuffer;

router.get("/", async (req, res) => {
  const imageFileName = "about.png";
  const imagePath = path.join(
    __dirname,
    "../public/aboutImages",
    imageFileName
  );

  fs.access(imagePath, fs.constants.F_OK, async (err) => {
    if (err) {
      console.error("Image file not found:", imagePath);
      return res.status(404).json({ error: "Image not found." });
    }

    try {
      const imageUrl = `${req.protocol}://${req.get(
        "host"
      )}/aboutImages/${imageFileName}`;
      const blurHash = await generateBlurHash(imagePath);

      res.json({
        imageUrl: imageUrl,
        blurHash,
      });
    } catch (error) {
      console.error("Error generating blurhash:", error);
      res.status(500).json({ error: "Failed to generate blurhash" });
    }
  });
});

module.exports = router;
