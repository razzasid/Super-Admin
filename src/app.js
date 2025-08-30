const express = require("express");
const authRoutes = require("./routes/auth.js");
const superadminRoutes = require("./routes/superadmin.js");
const { verifyToken, requireSuperAdmin } = require("./middleware/auth");
require("dotenv").config();

const connectDB = require("./utils/database.js");

const app = express();

// Connect to Database
connectDB();

//middlewares
app.use(express.json());

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/superadmin", superadminRoutes);

app.get("/", (req, res) => {
  return res.send("hello world");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
