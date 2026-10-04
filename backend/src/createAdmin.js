require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
    });

    console.log("Admin created successfully");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
  }
};

createAdmin();