const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

const login = require("../controllers/loginController.controller");
const asyncHandler = (fn) => (req, res, next) => {
  if (typeof fn !== "function") {
    console.error("Route handler is not a function:", fn);
    return next(new Error("Route handler is not a function"));
  }
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Define POST route for login
router.post("/login", asyncHandler(login.loginCheck));

// Token verification endpoint
router.get("/verify-token", (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.json({ valid: false });
    }

    // Verify token using the same secret used to create it
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    jwt.verify(token, secret);

    // If verification passes, token is valid
    return res.json({ valid: true });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.json({ valid: false });
  }
});

module.exports = router;