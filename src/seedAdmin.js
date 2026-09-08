import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const existingAdmin = await Admin.findOne({
            email: "admin@restro.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            "admin123",
            10
        );

        await Admin.create({
            name: "Restaurant Admin",
            email: "admin@restro.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully");

        process.exit(0);

    } catch (error) {
        console.error("Admin seed error:", error);

        process.exit(1);
    }
};

seedAdmin();