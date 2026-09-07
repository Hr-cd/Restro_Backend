import Category from "../models/Category.js";
import FoodItem from "../models/FoodItem.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            isActive: true
        }).sort({
            sortOrder: 1,
            name: 1
        });

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories"
        });
    }
};

export const getFoodItems = async (req, res) => {
    try {
        const { category, search } = req.query;

        const filter = {
            isAvailable: true
        };

        if (category) {
            filter.categoryId = category;
        }

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        const items = await FoodItem.find(filter)
            .populate("categoryId", "name")
            .sort({
                name: 1
            });

        res.status(200).json({
            success: true,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch food items"
        });
    }
};

export const getFoodItemById = async (req, res) => {
    try {
        const item = await FoodItem.findOne({
            _id: req.params.id,
            isAvailable: true
        }).populate("categoryId", "name");

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }

        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch food item"
        });
    }
};