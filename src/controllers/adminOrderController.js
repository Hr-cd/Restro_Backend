import Order from "../models/Order.js";

export const getAdminOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("tableId", "tableNumber")
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {
        console.error("Get admin orders error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};

export const getAdminOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("tableId", "tableNumber")
            .populate("items.foodItemId", "name");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error("Get admin order error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order"
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "preparing",
            "ready",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(req.params.id)
            .populate("tableId", "tableNumber");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = status;

        await order.save();

        res.status(200).json({
            success: true,
            message: `Order marked as ${status}`,
            data: order
        });

    } catch (error) {
        console.error("Update order status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update order status"
        });
    }
};