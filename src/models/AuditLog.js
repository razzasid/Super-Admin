const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: [false, "Actor user ID is required"],
    },
    action: {
      type: String,
      required: [true, "Action is required"],
      enum: [
        // User actions
        "CREATE_USER",
        "UPDATE_USER",
        "DELETE_USER",
        "LOGIN_SUCCESS",
        "LOGIN_FAILED",
        "LOGOUT",
        "PASSWORD_CHANGE",
        "ACCOUNT_LOCK",
        "ACCOUNT_UNLOCK",

        // Role actions
        "CREATE_ROLE",
        "UPDATE_ROLE",
        "DELETE_ROLE",
        "ASSIGN_ROLE",
        "REMOVE_ROLE",

        // System actions
        "SYSTEM_BACKUP",
        "SYSTEM_RESTORE",
        "SETTINGS_UPDATE",

        // Security actions
        "PERMISSION_DENIED",
        "SUSPICIOUS_ACTIVITY",
      ],
    },
    targetType: {
      type: String,
      required: [true, "Target type is required"],
      enum: ["User", "Role", "System", "Settings"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: function () {
        return this.targetType !== "System";
      },
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
