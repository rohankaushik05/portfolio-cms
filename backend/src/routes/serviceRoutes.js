const express = require("express");
const { body } = require("express-validator");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const router = express.Router();

const serviceValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("icon")
    .optional()
    .trim(),

  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),

  body("order")
    .optional()
    .isInt()
    .withMessage("Order must be an integer"),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be true or false"),
];

// Public
router.get("/", getServices);
router.get("/:id", getService);

// Protected
router.post(
  "/",
  protect,
  serviceValidation,
  validate,
  createService
);

router.put(
  "/:id",
  protect,
  serviceValidation,
  validate,
  updateService
);

router.delete("/:id", protect, deleteService);

module.exports = router;