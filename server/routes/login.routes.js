const express = require("express");
const router = express.Router();

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

module.exports = router;
