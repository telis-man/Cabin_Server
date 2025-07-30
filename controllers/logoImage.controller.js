const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {
  const logoFileName = "GlampisNoName.png";
  const logoPath = path.join(__dirname, "../public/logos", logoFileName);
  const imageUrl = `${req.protocol}://${req.get("host")}/logos/${logoFileName}`;
  fs.access(logoPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Logo file not found:", logoPath);
      return res.status(404).json({ error: "Logo not found." });
    }
    const imageUrl = `${req.protocol}://${req.get(
      "host"
    )}/logos/${logoFileName}`;
    res.json({ logoUrl: imageUrl });
  });
});

module.exports = router;
