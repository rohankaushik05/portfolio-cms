const express = require("express");
const { body } = require("express-validator");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  createSkill,
  getSkills,
  getSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");

const router = express.Router();

router.get("/", getSkills);
router.get("/:id", getSkill);

router.post(
  "/",
  protect,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Skill name is required"),

    body("category")
      .trim()
      .notEmpty()
      .withMessage("Skill category is required"),

    body("order")
      .optional()
      .isInt()
      .withMessage("Order must be an integer"),
  ],
  validate,
  createSkill
);

router.put(
  "/:id",
  protect,
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Skill name cannot be empty"),

    body("category")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Skill category cannot be empty"),

    body("order")
      .optional()
      .isInt()
      .withMessage("Order must be an integer"),
  ],
  validate,
  updateSkill
);

router.delete("/:id", protect, deleteSkill);

module.exports = router;