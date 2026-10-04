const express = require("express");
const { body } = require("express-validator");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  createTestimonial,
  getTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const router = express.Router();

// Validation
const testimonialValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required"),

  body("role")
    .optional()
    .trim(),

  body("company")
    .optional()
    .trim(),

  body("image")
    .optional()
    .isURL()
    .withMessage("Image must be a valid URL"),

  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be true or false"),

  body("order")
    .optional()
    .isInt()
    .withMessage("Order must be an integer"),
];

// Public
router.get("/", getTestimonials);
router.get("/:id", getTestimonial);

// Protected
router.post(
  "/",
  protect,
  testimonialValidation,
  validate,
  createTestimonial
);

router.put(
  "/:id",
  protect,
  testimonialValidation,
  validate,
  updateTestimonial
);

router.delete("/:id", protect, deleteTestimonial);

module.exports = router;