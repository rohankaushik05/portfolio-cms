const cloudinary = require("../config/cloudinary");
const Media = require("../models/media");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "portfolio",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(req.file.buffer);
    });

    const media = await Media.create({
      filename: req.file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
      type: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json({
      message: "Image uploaded successfully",
      media,
    });
  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      message: "Image upload failed",
    });
  }
};
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        message: "Public ID is required",
      });
    }

    await cloudinary.uploader.destroy(publicId);

    res.json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};