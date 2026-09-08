import dotenv from "dotenv";
import mongoose from "mongoose";
import crypto from "crypto";
import Table from "./models/Table.js";
import connectDB from "./config/db.js";

import Category from "./models/Category.js";
import FoodItem from "./models/FoodItem.js";

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        console.log("Clearing existing menu data...");

        await FoodItem.deleteMany({});
        await Category.deleteMany({});
        await Table.deleteMany({});
        
        const categories = await Category.insertMany([
            {
                name: "Pizza",
                description: "Freshly baked pizzas",
                sortOrder: 1
            },
            {
                name: "Burgers",
                description: "Juicy handcrafted burgers",
                sortOrder: 2
            },
            {
                name: "Pasta",
                description: "Italian-style pasta",
                sortOrder: 3
            },
            {
                name: "Starters",
                description: "Perfect bites to begin",
                sortOrder: 4
            },
            {
                name: "Desserts",
                description: "Sweet treats",
                sortOrder: 5
            },
            {
                name: "Drinks",
                description: "Refreshing beverages",
                sortOrder: 6
            }
        ]);
        const categoryMap = {};
        categories.forEach((category) => {
            categoryMap[category.name] = category._id;
        });

        const tables = await Table.insertMany([
            {
                tableNumber: "1",
                qrToken: crypto.randomBytes(16).toString("hex")
            },
            {
                tableNumber: "2",
                qrToken: crypto.randomBytes(16).toString("hex")
            },
            {
                tableNumber: "3",
                qrToken: crypto.randomBytes(16).toString("hex")
            },
            {
                tableNumber: "4",
                qrToken: crypto.randomBytes(16).toString("hex")
            },
            {
                tableNumber: "5",
                qrToken: crypto.randomBytes(16).toString("hex")
            }
        ]);
        console.log("Table 1 token:", tables[0].qrToken);
        
        await FoodItem.insertMany([
            // -------------------------
            // PIZZA
            // -------------------------

            {
                categoryId: categoryMap["Pizza"],
                name: "Margherita Pizza",
                description: "Classic pizza with tomato, mozzarella and basil.",
                price: 249,
                foodType: "veg",
                addons: [
                    { name: "Extra Cheese", price: 50 },
                    { name: "Jalapeños", price: 30 }
                ]
            },

            {
                categoryId: categoryMap["Pizza"],
                name: "Farmhouse Pizza",
                description: "Loaded with fresh vegetables and mozzarella.",
                price: 329,
                foodType: "veg",
                addons: [
                    { name: "Extra Cheese", price: 50 },
                    { name: "Olives", price: 40 }
                ]
            },

            {
                categoryId: categoryMap["Pizza"],
                name: "Chicken Tikka Pizza",
                description: "Spicy chicken tikka with onion and mozzarella.",
                price: 379,
                foodType: "non-veg",
                addons: [
                    { name: "Extra Chicken", price: 80 },
                    { name: "Extra Cheese", price: 50 }
                ]
            },

            // -------------------------
            // BURGERS
            // -------------------------

            {
                categoryId: categoryMap["Burgers"],
                name: "Classic Veg Burger",
                description: "Crispy veg patty with lettuce, tomato and sauce.",
                price: 179,
                foodType: "veg",
                addons: [
                    { name: "Extra Cheese", price: 40 },
                    { name: "Extra Patty", price: 70 }
                ]
            },

            {
                categoryId: categoryMap["Burgers"],
                name: "Crispy Chicken Burger",
                description: "Crispy chicken fillet with lettuce and creamy sauce.",
                price: 229,
                foodType: "non-veg",
                addons: [
                    { name: "Extra Cheese", price: 40 },
                    { name: "Extra Chicken", price: 80 }
                ]
            },

            // -------------------------
            // PASTA
            // -------------------------

            {
                categoryId: categoryMap["Pasta"],
                name: "Penne Arrabbiata",
                description: "Penne pasta tossed in spicy tomato sauce.",
                price: 229,
                foodType: "veg",
                addons: [
                    { name: "Extra Cheese", price: 40 }
                ]
            },

            {
                categoryId: categoryMap["Pasta"],
                name: "Creamy Alfredo Pasta",
                description: "Creamy white sauce pasta with herbs.",
                price: 279,
                foodType: "veg",
                addons: [
                    { name: "Extra Cheese", price: 40 },
                    { name: "Mushrooms", price: 50 }
                ]
            },

            // -------------------------
            // STARTERS
            // -------------------------

            {
                categoryId: categoryMap["Starters"],
                name: "French Fries",
                description: "Golden crispy fries with seasoning.",
                price: 129,
                foodType: "veg",
                addons: [
                    { name: "Cheese Dip", price: 30 }
                ]
            },

            {
                categoryId: categoryMap["Starters"],
                name: "Paneer Tikka",
                description: "Grilled paneer marinated with Indian spices.",
                price: 249,
                foodType: "veg",
                addons: [
                    { name: "Extra Paneer", price: 70 }
                ]
            },

            {
                categoryId: categoryMap["Starters"],
                name: "Chicken Wings",
                description: "Crispy chicken wings tossed in spicy sauce.",
                price: 299,
                foodType: "non-veg",
                addons: [
                    { name: "Extra Wings", price: 100 },
                    { name: "Cheese Dip", price: 30 }
                ]
            },

            // -------------------------
            // DESSERTS
            // -------------------------

            {
                categoryId: categoryMap["Desserts"],
                name: "Chocolate Brownie",
                description: "Warm chocolate brownie with rich chocolate flavour.",
                price: 149,
                foodType: "veg",
                addons: [
                    { name: "Vanilla Ice Cream", price: 60 }
                ]
            },

            {
                categoryId: categoryMap["Desserts"],
                name: "Classic Cheesecake",
                description: "Creamy cheesecake with a buttery biscuit base.",
                price: 199,
                foodType: "veg",
                addons: []
            },

            // -------------------------
            // DRINKS
            // -------------------------

            {
                categoryId: categoryMap["Drinks"],
                name: "Fresh Lime Soda",
                description: "Refreshing lime soda served chilled.",
                price: 99,
                foodType: "veg",
                addons: [
                    { name: "Mint", price: 20 }
                ]
            },

            {
                categoryId: categoryMap["Drinks"],
                name: "Cold Coffee",
                description: "Creamy chilled coffee.",
                price: 149,
                foodType: "veg",
                addons: [
                    { name: "Whipped Cream", price: 30 }
                ]
            }
        ]);

        console.log("✅ Demo menu seeded successfully!");
        console.log(`Categories: ${categories.length}`);
        console.log("Food Items: 15");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed error:", error);
        process.exit(1);
    }
};

seedData();