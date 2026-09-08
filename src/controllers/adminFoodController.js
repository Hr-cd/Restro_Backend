import FoodItem from "../models/FoodItem.js";

export const getAdminFoodItems = async (req, res) => {
    try {
        const items = await FoodItem.find()
            .populate("categoryId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: items
        });
    } catch (error) {
        console.error("Get admin food items error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch food items"
        });
    }
};

export const createFoodItem = async (req, res) => {
    try {
        const {
            categoryId,
            name,
            description,
            price,
            image,
            foodType,
            addons
        } = req.body;

        if (!categoryId || !name || price === undefined || !foodType) {
            return res.status(400).json({
                success: false,
                message: "Category, name, price and food type are required"
            });
        }

        const foodItem = await FoodItem.create({
            categoryId,
            name: name.trim(),
            description: description?.trim() || "",
            price,
            image: image || "",
            foodType,
            addons: addons || []
        });

        const populatedItem = await FoodItem.findById(foodItem._id)
            .populate("categoryId", "name");

        res.status(201).json({
            success: true,
            message: "Food item created successfully",
            data: populatedItem
        });
    } catch (error) {
        console.error("Create food item error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create food item"
        });
    }
};

export const updateFoodItem = async (req, res) => {
    try {
        const {
            categoryId,
            name,
            description,
            price,
            image,
            foodType,
            addons
        } = req.body;

        const foodItem = await FoodItem.findById(req.params.id);

        if (!foodItem) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }

        if (categoryId !== undefined) {
            foodItem.categoryId = categoryId;
        }

        if (name !== undefined) {
            foodItem.name = name.trim();
        }

        if (description !== undefined) {
            foodItem.description = description.trim();
        }

        if (price !== undefined) {
            foodItem.price = price;
        }

        if (image !== undefined) {
            foodItem.image = image;
        }

        if (foodType !== undefined) {
            foodItem.foodType = foodType;
        }

        if (addons !== undefined) {
            foodItem.addons = addons;
        }

        await foodItem.save();

        const populatedItem = await FoodItem.findById(foodItem._id)
            .populate("categoryId", "name");

        res.status(200).json({
            success: true,
            message: "Food item updated successfully",
            data: populatedItem
        });
    } catch (error) {
        console.error("Update food item error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update food item"
        });
    }
};

export const deleteFoodItem = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);

        if (!foodItem) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }

        await foodItem.deleteOne();

        res.status(200).json({
            success: true,
            message: "Food item deleted successfully"
        });
    } catch (error) {
        console.error("Delete food item error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete food item"
        });
    }
};

export const toggleFoodAvailability = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);

        if (!foodItem) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }

        foodItem.isAvailable = !foodItem.isAvailable;

        await foodItem.save();

        const populatedItem = await FoodItem.findById(foodItem._id)
            .populate("categoryId", "name");

        res.status(200).json({
            success: true,
            message: foodItem.isAvailable
                ? "Food item is now available"
                : "Food item is now unavailable",
            data: populatedItem
        });
    } catch (error) {
        console.error("Toggle food availability error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update availability"
        });
    }
};