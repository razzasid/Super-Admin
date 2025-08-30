const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query)
      .select("-hashedPassword")
      .skip(skip)
      .limit(parseInt(limit));
    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-hashedPassword");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.create({ name, email, hashedPassword: password });
    await AuditLog.create({
      actorUserId: req.user._id,
      action: "CREATE_USER",
      targetType: "User",
      targetId: user._id,
    });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, ...(password && { hashedPassword: password }) },
      { new: true, runValidators: true }
    ).select("-hashedPassword");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    await AuditLog.create({
      actorUserId: req.user._id,
      action: "UPDATE_USER",
      targetType: "User",
      targetId: user._id,
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    await AuditLog.create({
      actorUserId: req.user._id,
      action: "DELETE_USER",
      targetType: "User",
      targetId: user._id,
    });
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};
