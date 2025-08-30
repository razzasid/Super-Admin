const mongoose = require("mongoose");
const User = require("../src/models/User");
const Role = require("../src/models/Role");
require("dotenv").config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Create or find the superadmin role
    let superadminRole = await Role.findOne({ name: "superadmin" });
    if (!superadminRole) {
      superadminRole = await Role.create({
        name: "superadmin",
        permissions: ["system:admin"], 
      });
    }
    const superadminRoleId = superadminRole._id;

    // Create or find the superadmin user with the role ID
    let superadmin = await User.findOne({ email: "superadmin@example.com" });
    if (!superadmin) {
      superadmin = await User.create({
        name: "Super Admin",
        email: "superadmin@example.com",
        hashedPassword: "Test1234!",
        roles: [superadminRoleId], 
      });
    } else {
      // Update existing user to include the role ID if not already present
      if (!superadmin.roles.includes(superadminRoleId)) {
        superadmin.roles.push(superadminRoleId);
        await superadmin.save();
      }
    }

    console.log("Seeding complete");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedData();
