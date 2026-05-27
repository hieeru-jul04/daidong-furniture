import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: "admin" });
    
    if (!existingAdmin) {
      // Create default admin
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      const admin = await User.create({
        name: "Administrator",
        username: "admin",
        password: hashedPassword,
        role: "admin"
      });

      console.log("Default admin account created:");
      console.log("Username: admin");
      console.log("Password: admin123");
      console.log("Please change the password after first login!");
    } else {
      console.log("Admin account already exists");
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};

export default createDefaultAdmin;
