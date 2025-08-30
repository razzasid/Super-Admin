const express = require("express");
const router = express.Router();
const { verifyToken, requireSuperAdmin } = require("../middleware/auth");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  getRoles,
  createRole,
  updateRole,
  assignRole,
} = require("../controllers/roleController");

router.use(verifyToken, requireSuperAdmin);

//user routes
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Role routes
router.get("/roles", getRoles);
router.post("/roles", createRole);
router.put("/roles/:id", updateRole);

// Role assignment
router.post("/assign-role", assignRole);

module.exports = router;
