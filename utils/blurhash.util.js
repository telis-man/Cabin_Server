const sharp = require("sharp");
const { encode } = require("blurhash");

async function getBlurHashFromBuffer(imageBuffer) {
  // Convert the image to raw RGB data
  const image = sharp(imageBuffer);
  const { data, info } = await image
    .raw()
    .ensureAlpha()
    .resize(32, 32, { fit: "inside" }) // smaller size for faster hashing
    .toBuffer({ resolveWithObject: true });

  // Encode to BlurHash
  const blurHash = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    4, // X component
    4 // Y component
  );

  return blurHash;
}

module.exports = { getBlurHashFromBuffer };
