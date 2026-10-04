const express = require("express");
const { body } = require("express-validator");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlog);

router.post(
  "/",
  protect,
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Blog title is required"),

    body("slug")
      .trim()
      .notEmpty()
      .withMessage("Blog slug is required")
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .withMessage("Slug must contain only lowercase letters, numbers and hyphens"),

    body("content")
      .trim()
      .notEmpty()
      .withMessage("Blog content is required"),

    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array"),

    body("published")
      .optional()
      .isBoolean()
      .withMessage("Published must be a boolean"),

    body("order")
      .optional()
      .isInt()
      .withMessage("Order must be an integer"),
  ],
  validate,
  createBlog
);

router.put(
  "/:id",
  protect,
  [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Blog title cannot be empty"),

    body("slug")
      .optional()
      .trim()
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .withMessage("Slug must contain only lowercase letters, numbers and hyphens"),

    body("content")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Blog content cannot be empty"),

    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array"),

    body("published")
      .optional()
      .isBoolean()
      .withMessage("Published must be a boolean"),

    body("order")
      .optional()
      .isInt()
      .withMessage("Order must be an integer"),
  ],
  validate,
  updateBlog
);

router.delete("/:id", protect, deleteBlog);

module.exports = router;