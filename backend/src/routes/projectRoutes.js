const express = require("express");
const { body } = require("express-validator");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProject);

router.post(
  "/",
  protect,
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Project title is required"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Project description is required"),

    body("technologies")
      .optional()
      .isArray()
      .withMessage("Technologies must be an array"),

    body("featured")
      .optional()
      .isBoolean()
      .withMessage("Featured must be a boolean"),

    body("order")
      .optional()
      .isInt()
      .withMessage("Order must be an integer"),
  ],
  validate,
  createProject
);

router.put(
  "/:id",
  protect,
  [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Project title cannot be empty"),

    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Project description cannot be empty"),

    body("technologies")
      .optional()
      .isArray()
      .withMessage("Technologies must be an array"),

    body("featured")
      .optional()
      .isBoolean()
      .withMessage("Featured must be a boolean"),

    body("order")
      .optional()
      .isInt()
      .withMessage("Order must be an integer"),
  ],
  validate,
  updateProject
);

router.delete("/:id", protect, deleteProject);

module.exports = router;