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

// Department routes
router.get(
  "/admin/getAllDepartments",
  asyncHandler(departmentController.getAllDepartments)
);

router.post(
  "/admin/addDepartment",
  asyncHandler(departmentController.addDepartment)
);

router.delete(
  "/admin/deleteDepartment/:id",
  asyncHandler(departmentController.deleteDepartment)
);

module.exports = router;
