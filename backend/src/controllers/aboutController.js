const About = require("../models/about");

// Get About
const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        message: "About information not found",
      });
    }

    res.json({
      about,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch about information",
      error: error.message,
    });
  }
};

// Create About
const createAbout = async (req, res) => {
  try {
    const existingAbout = await About.findOne();

    if (existingAbout) {
      return res.status(400).json({
        message: "About information already exists",
      });
    }

    const about = await About.create(req.body);

    res.status(201).json({
      message: "About information created successfully",
      about,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create about information",
      error: error.message,
    });
  }
};

// Update About
const updateAbout = async (req, res) => {
  try {
    const about = await About.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!about) {
      return res.status(404).json({
        message: "About information not found",
      });
    }

    res.json({
      message: "About information updated successfully",
      about,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update about information",
      error: error.message,
    });
  }
};

module.exports = {
  getAbout,
  createAbout,
  updateAbout,
};