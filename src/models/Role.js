const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      trim: true,
      lowercase: true,
      enum: {
        values: ["superadmin", "admin", "user", "viewer"],
        message: "Role must be one of: superadmin, admin, user, viewer",
      },
    },

    permissions: [
      {
        type: String,
        required: true,
        enum: [
          // User permissions
          "read:users",
          "create:users",
          "update:users",
          "delete:users",
          "assign:roles",

          // Role permissions
          "read:roles",
          "create:roles",
          "update:roles",
          "delete:roles",

          // Audit permissions
          "read:audit-logs",

          // Analytics permissions
          "read:analytics",

          // Settings permissions
          "read:settings",
          "update:settings",

          // System permissions
          "system:admin",
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Role", roleSchema);
