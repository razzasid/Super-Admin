const Role = require("../models/Role");
const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find();
    res.json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
};

exports.createRole = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;
    if (!name || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: "Name, and permissions array are required",
      });
    }

    const role = await Role.create({ name, permissions });

    await AuditLog.create({
      actorUserId: req.user._id,
      action: "CREATE_ROLE",
      targetType: "Role",
      targetId: role._id,
    });

    res.status(201).json({ success: true, data: role });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: messages.length > 0 ? messages : "Invalid role data",
        },
      });
    }
    next(error);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, permissions },
      { new: true, runValidators: true }
    );

    if (!role)
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });

    await AuditLog.create({
      actorUserId: req.user._id,
      action: "UPDATE_ROLE",
      targetType: "Role",
      targetId: role._id,
    });

    res.json({ success: true, data: role });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: messages.length > 0 ? messages : "Invalid role data",
        },
      });
    }
    next(error);
  }
};

exports.assignRole = async (req, res, next) => {
  try {
    const { userId, roleId } = req.body;
    if (!userId || !roleId) {
      return res
        .status(400)
        .json({ success: false, message: "userId and roleId are required" });
    }

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(roleId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId or roleId format" });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Validate role exists
    const role = await Role.findOne({ _id: roleId });
    if (!role) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    // Check if role is already assigned
    if (user.roles.includes(roleId)) {
      return res
        .status(400)
        .json({ success: false, message: "Role already assigned to user" });
    }

    // Assign role
    user.roles.push(roleId);
    await user.save();

    // Log the assignment
    await AuditLog.create({
      actorUserId: req.user._id,
      action: "ASSIGN_ROLE",
      targetType: "User",
      targetId: userId,
      details: { roleId: roleId },
    });

    res.json({
      success: true,
      message: "Role assigned successfully",
      data: user,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId or roleId" });
    }
    next(error);
  }
};
