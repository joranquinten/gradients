const sharp = require("sharp");

export const blurImage = async (image, size, mode, background) => {
  const attr = mode === "landscape" ? "width" : "height";
  const originResized = await sharp(image)
    .resize({ [attr]: size })
    .toBuffer();

  if (background === "blurred") {
    return sharp(image)
      .resize({
        width: size,
        height: size,
        fit: "cover",
      })
      .blur(50)
      .composite([{ input: originResized }])
      .toBuffer();
  } else {
    return sharp({
      create: {
        width: size,
        height: size,
        channels: 3,
        background,
      },
    })
      .jpeg()
      .composite([{ input: originResized }])
      .toBuffer();
  }
};
