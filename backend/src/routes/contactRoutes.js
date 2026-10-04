const express = require("express");
const { body } = require("express-validator");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const { contactLimiter } = require("../middleware/rateLimitMiddleware");

const {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

// Public
router.post(
  "/",
  contactLimiter,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email is required"),

    body("message")
      .trim()
      .notEmpty()
      .withMessage("Message is required"),
  ],
  validate,
  createContact
);

// Protected
router.get("/", protect, getContacts);
router.get("/:id", protect, getContact);
router.put("/:id", protect, updateContact);
router.delete("/:id", protect, deleteContact);

module.exports = router;