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

router.use(verifyToken, requireSuperAdmin);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
