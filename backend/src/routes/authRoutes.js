const express = require("express");
const { body } = require("express-validator");

const validate = require("../middleware/validationMiddleware");
const { login } = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimitMiddleware");
const { refreshAccessToken } = require("../controllers/refreshTokenController");

const router = express.Router();

router.post("/refresh", refreshAccessToken);

router.post(
  "/login",
  loginLimiter,
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email is required"),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  validate,
  login
);

module.exports = router;