// const express = require("express");
// const router = express.Router();
// const fs = require("fs");
// const path = require("path");
// const generateBlurHash =
//   require("../utils/blurhash.util.js").getBlurHashFromBuffer;

// router.get("/", async (req, res) => {
//   const imageFileName = "generalDimensions.png";
//   const imagePath = path.join(
//     __dirname,
//     "../public/dimensionsImages",
//     imageFileName
//   );

//   fs.access(imagePath, fs.constants.F_OK, async (err) => {
//     if (err) {
//       console.error("Image file not found:", imagePath);
//       return res.status(404).json({ error: "Image not found." });
//     }

//     try {
//       const imageUrl = `${req.protocol}://${req.get(
//         "host"
//       )}/dimensionsImages/${imageFileName}`;
//       const blurHash = await generateBlurHash(imagePath);

//       res.json({
//         generalDimensionImageUrl: imageUrl,
//         blurHash,
//       });
//     } catch (error) {
//       console.error("Error generating blurhash:", error);
//       res.status(500).json({ error: "Failed to generate blurhash" });
//     }
//   });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const {
  getBlurHashFromBuffer: generateBlurHash,
} = require("../utils/blurhash.util.js");

router.get("/", async (req, res) => {
  const baseDir = path.join(__dirname, "../public/dimensionsImages");
  const files = [
    "generalDimensions.png",
    "footprintSleepingbags.png",
    "footprintBeds.png",
  ];

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
                )}/dimensionsImages/${file}`;
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
      generalDimension: {
        url: results.find((r) => r.file === "generalDimensions.png").url,
        blurHash: results.find((r) => r.file === "generalDimensions.png")
          .blurHash,
      },
      footprintSleepingbag: {
        url: results.find((r) => r.file === "footprintSleepingbags.png").url,
        blurHash: results.find((r) => r.file === "footprintSleepingbags.png")
          .blurHash,
      },
      footprintBeds: {
        url: results.find((r) => r.file === "footprintBeds.png").url,
        blurHash: results.find((r) => r.file === "footprintBeds.png").blurHash,
      },
    });
  } catch (error) {
    console.error("Error generating blurhash:", error);
    res.status(500).json({ error: "Failed to generate blurhashes" });
  }
});

module.exports = router;
