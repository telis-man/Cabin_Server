const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const {
  getBlurHashFromBuffer: generateBlurHash,
} = require("../utils/blurhash.util.js");

router.get("/", async (req, res) => {
  const baseDir = path.join(__dirname, "../public/imagesPreview");
  const files = ["dog.jpg", "g6.jpg", "g7.jpg"];

  try {
    // map over the files to build { url, blurHash }
    const results = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const imagePath = path.join(baseDir, file);

            fs.access(imagePath, fs.constants.F_OK, async (err) => {
              if (err) {
                console.error("Image file not found:", imagePath);
                return reject(new Error(`Image not found: ${file}`));
              }

              try {
                const imageUrl = `${req.protocol}://${req.get(
                  "host"
                )}/imagesPreview/${file}`;
                const blurHash = await generateBlurHash(imagePath);
                console.log({ file, imageUrl, blurHash });
                resolve({ file, url: imageUrl, blurHash });
              } catch (error) {
                reject(error);
              }
            });
          })
      )
    );

    // shape the response however you want
    res.json({
      img1: {
        url: results.find((r) => r.file === "dog.jpg").url,
        blurHash: results.find((r) => r.file === "dog.jpg").blurHash,
      },
      img2: {
        url: results.find((r) => r.file === "g6.jpg").url,
        blurHash: results.find((r) => r.file === "g6.jpg").blurHash,
      },
      img3: {
        url: results.find((r) => r.file === "g7.jpg").url,
        blurHash: results.find((r) => r.file === "g7.jpg").blurHash,
      },
    });
  } catch (error) {
    console.error("Error generating blurhash:", error);
    res.status(500).json({ error: "Failed to generate blurhashes" });
  }
});

module.exports = router;
