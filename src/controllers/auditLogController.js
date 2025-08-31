const AuditLog = require("../models/AuditLog");

exports.getAuditLogs = async (req, res, next) => {
  try {
    const {
      user,
      action,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by user (actorUserId)
    if (user) {
      query.actorUserId = user;
    }

    // Filter by action
    if (action) {
      query.action = action;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const auditLogs = await AuditLog.find(query)
      .populate("actorUserId", "name")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ timestamp: -1 });

    const total = await AuditLog.countDocuments(query);

    return res.json({
      success: true,
      data: auditLogs,
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
