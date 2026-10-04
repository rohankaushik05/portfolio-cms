const express = require("express");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadImage,
  deleteImage,
} = require("../controllers/uploadController");

const router = express.Router();

router.post(
  "/image",
  protect,
  upload.single("image"),
  uploadImage
);

router.delete(
  "/image",
  protect,
  deleteImage
);

module.exports = router;