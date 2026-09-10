import Order from "../models/Order.js";
import FoodItem from "../models/FoodItem.js";

export const getDashboardStats = async (req, res) => {
    try {
        // Start and end of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Today's orders
        const todayOrders = await Order.countDocuments({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        // Today's completed sales
        const salesResult = await Order.aggregate([
            {
                $match: {
                    status: "completed",
                    createdAt: {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$total" }
                }
            }
        ]);

        const todaySales = salesResult[0]?.totalSales || 0;

        // Pending orders
        const pendingOrders = await Order.countDocuments({
            status: "pending"
        });

        // Total menu items
        const menuItems = await FoodItem.countDocuments();

        // Order status counts
        const statusResult = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusCounts = {
            pending: 0,
            preparing: 0,
            ready: 0,
            completed: 0,
            cancelled: 0
        };

        statusResult.forEach((item) => {
            if (statusCounts[item._id] !== undefined) {
                statusCounts[item._id] = item.count;
            }
        });

        // Recent orders
        const recentOrders = await Order.find()
            .populate("tableId", "tableNumber")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                todayOrders,
                todaySales,
                pendingOrders,
                menuItems,
                statusCounts,
                recentOrders
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};