const Media = require("../models/media");
const cloudinary = require("../config/cloudinary");

// Get all media
const getMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });

    res.json(media);
  } catch (error) {
    console.error("Get media error:", error);

    res.status(500).json({
      message: "Failed to fetch media",
    });
  }
};

// Delete media
const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({
        message: "Media not found",
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(media.publicId);

    // Delete metadata from MongoDB
    await Media.findByIdAndDelete(id);

    res.json({
      message: "Media deleted successfully",
    });
  } catch (error) {
    console.error("Delete media error:", error);

    res.status(500).json({
      message: "Failed to delete media",
    });
  }
};

module.exports = {
  getMedia,
  deleteMedia,
};