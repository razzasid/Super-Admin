const mongoose = require("mongoose");
const User = require("../src/models/User");
const Role = require("../src/models/Role");
require("dotenv").config();

const seedData = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const superadminRole = await Role.findOne({ name: "superadmin" });
  if (!superadminRole) {
    await Role.create({
      name: "superadmin",
      displayName: "Super Admin",
      permissions: ["system:admin"],
    });
  }
  const superadmin = await User.findOne({ email: "superadmin@example.com" });
  if (!superadmin) {
    await User.create({
      name: "Super Admin",
      email: "superadmin@example.com",
      hashedPassword: "Test1234!", 
      roles: ["superadmin"],
    });
  }
  console.log("Seeding complete");
  mongoose.connection.close();
};

seedData().catch(console.error);
