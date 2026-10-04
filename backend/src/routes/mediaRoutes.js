const express = require("express");

const {
  getMedia,
  deleteMedia,
} = require("../controllers/mediaController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMedia);

router.delete("/:id", protect, deleteMedia);

module.exports = router;