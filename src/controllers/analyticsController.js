const User = require("../models/User");
const Role = require("../models/Role");

exports.getAnalyticsSummary = async (req, res, next) => {
  try {
    // Get current date and 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Count total users
    const userCount = await User.countDocuments();

    // Count total roles
    const roleCount = await Role.countDocuments();

    // Count users with lastLogin in the last 7 days
    const loginCount = await User.countDocuments({
      lastLogin: { $gte: sevenDaysAgo },
    });

    return res.json({
      success: true,
      data: {
        totalUsers: userCount,
        totalRoles: roleCount,
        loginsLast7Days: loginCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
