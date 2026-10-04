const express = require("express");
const { body } = require("express-validator");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  getAbout,
  createAbout,
  updateAbout,
} = require("../controllers/aboutController");

const router = express.Router();

router.get("/", getAbout);

router.post(
  "/",
  protect,
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required"),

    body("bio")
      .trim()
      .notEmpty()
      .withMessage("Bio is required"),

    body("profileImage")
      .optional()
      .isURL()
      .withMessage("Profile image must be a valid URL"),

    body("resumeUrl")
      .optional()
      .isURL()
      .withMessage("Resume URL must be a valid URL"),

    body("location")
      .optional()
      .trim(),
  ],
  validate,
  createAbout
);

router.put(
  "/",
  protect,
  [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),

    body("bio")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Bio cannot be empty"),

    body("profileImage")
      .optional()
      .isURL()
      .withMessage("Profile image must be a valid URL"),

    body("resumeUrl")
      .optional()
      .isURL()
      .withMessage("Resume URL must be a valid URL"),

    body("location")
      .optional()
      .trim(),
  ],
  validate,
  updateAbout
);

module.exports = router;