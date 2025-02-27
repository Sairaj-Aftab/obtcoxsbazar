import sharp from "sharp";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
export const processFiles = async (files, folderName) => {
  return Promise.all(
    files.map(async (file) => {
      // Get image metadata
      const metadata = await sharp(file.path).metadata();

      // Auto-resize based on original width
      const newWidth = metadata.width > 2000 ? 2000 : metadata.width;
      const quality =
        metadata.width > 3000 ? 50 : metadata.width > 2000 ? 60 : 70;

      const newFilePath = path.join(
        path.dirname(file.path),
        `${crypto.randomBytes(16).toString("hex")}.webp`
      );

      // Resize and optimize
      await sharp(file.path)
        .resize({ width: newWidth }) // Resize dynamically
        .toFormat("webp", { quality }) // Adjust quality
        .toFile(newFilePath);

      file.path = newFilePath; // Update the file path to point to the new WebP file
      file.mimetype = "image/webp"; // Update file type
      file.size = (await fs.stat(newFilePath)).size; // Update file size

      return `${folderName}/${path.basename(newFilePath)}`;
    })
  );
};
