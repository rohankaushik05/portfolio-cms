const express = require("express");
const { body } = require("express-validator");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  createExperience,
  getExperiences,
  getExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");

const router = express.Router();

router.get("/", getExperiences);
router.get("/:id", getExperience);

router.post(
  "/",
  protect,
  [
    body("company")
      .trim()
      .notEmpty()
      .withMessage("Company is required"),

    body("role")
      .trim()
      .notEmpty()
      .withMessage("Role is required"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),

    body("startDate")
      .trim()
      .notEmpty()
      .withMessage("Start date is required"),

    body("technologies")
      .optional()
      .isArray()
      .withMessage("Technologies must be an array"),

    body("order")
      .optional()
      .isInt()
      .withMessage("Order must be an integer"),
  ],
  validate,
  createExperience
);

router.put(
  "/:id",
  protect,
  [
    body("company")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Company cannot be empty"),

    body("role")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Role cannot be empty"),

    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Description cannot be empty"),

    body("startDate")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Start date cannot be empty"),

    body("technologies")
      .optional()
      .isArray()
      .withMessage("Technologies must be an array"),

    body("order")
      .optional()
      .isInt()
      .withMessage("Order must be an integer"),
  ],
  validate,
  updateExperience
);

router.delete("/:id", protect, deleteExperience);

module.exports = router;