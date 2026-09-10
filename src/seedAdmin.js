import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            throw new Error(
                "ADMIN_EMAIL and ADMIN_PASSWORD must be configured"
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.create({
            name: "Restaurant Admin",
            email,
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