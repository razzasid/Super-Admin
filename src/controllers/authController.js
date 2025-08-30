const User = require("../models/User");
const { generateToken } = require("../middleware/auth");
const AuditLog = require("../models/AuditLog");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "invalid credentials",
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      await AuditLog.create({
        actorUserId: null,
        action: "LOGIN_FAILED",
        targetType: "System",
        details: { email, reason: "User not found" },
      });
      return res.status(401).json({
        success: false,
        message: "invalid credentials",
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await AuditLog.create({
        actorUserId: null,
        action: "LOGIN_FAILED",
        targetType: "System",
        details: { email, reason: "Invalid password" },
      });
      return res.status(401).json({
        success: false,
        message: "invalid credentials",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      roles: user.roles,
    });

    // Log successful login
    await AuditLog.create({
      actorUserId: user._id,
      action: "LOGIN_SUCCESS",
      targetType: "System",
      details: { email },
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    next(error); 
  }
};

module.exports = {
  login,
};
