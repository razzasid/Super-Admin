const express = require("express");
const { body, validationResult } = require("express-validator");
const { login } = require("../controllers/authController");

const router = express.Router();

// Validation middleware
const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: errors.array().map((e) => e.msg),
      },
    });
  }
  next();
};

// Public routes
router.post("/login", loginValidation, validate, login);

// Error handling for validation
router.use((err, req, res, next) => {
  if (err.array) {
    const errors = err.array().map((error) => error.msg);
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: errors,
      },
    });
  }
  next(err);
});

module.exports = router;
