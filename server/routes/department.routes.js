const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/department.controller");

const asyncHandler = (fn) => (req, res, next) => {
  if (typeof fn !== "function") {
    console.error("Route handler is not a function:", fn);
    return next(new Error("Route handler is not a function"));
  }
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Doctor routes
router.get(
  "/admin/getAllDepartments",
  asyncHandler(departmentController.getAllDepartments)
);

module.exports = router;
