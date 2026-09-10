import crypto from "crypto";
import Order from "../models/Order.js";
import FoodItem from "../models/FoodItem.js";
import Table from "../models/Table.js";
import Setting from "../models/Setting.js";
import rateLimit from "express-rate-limit"

export const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many orders. Please try again later."
    }
});

const generateOrderNumber = () => {
    const random = crypto.randomBytes(4).toString("hex").toUpperCase();

    return `ORD-${Date.now()}-${random}`;
};

export const createOrder = async (req, res) => {
    try {
        const {
            tableId,
            customer,
            items
        } = req.body;

        // -----------------------------
        // Validate basic request
        // -----------------------------

        if (!tableId) {
            return res.status(400).json({
                success: false,
                message: "Table is required"
            });
        }

        if (!customer?.name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Customer name is required"
            });
        }

        if (!customer?.mobile?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Customer mobile number is required"
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one item"
            });
        }

        // -----------------------------
        // Validate table
        // -----------------------------

        const table = await Table.findOne({
            _id: tableId,
            isActive: true
        });

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Invalid or inactive table"
            });
        }

        // -----------------------------
        // Build order items
        // -----------------------------

        const orderItems = [];

        let subtotal = 0;

        for (const requestedItem of items) {
            const foodItem = await FoodItem.findOne({
                _id: requestedItem.foodItemId || requestedItem._id,
                isAvailable: true
            });

            if (!foodItem) {
                return res.status(400).json({
                    success: false,
                    message: "One or more food items are unavailable"
                });
            }

            const quantity = Number(requestedItem.quantity);

            if (!Number.isInteger(quantity) || quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid quantity for ${foodItem.name}`
                });
            }

            // -----------------------------
            // Validate addons
            // -----------------------------

            const requestedAddons = Array.isArray(
                requestedItem.addons
            )
                ? requestedItem.addons
                : [];

            const validatedAddons = [];

            for (const requestedAddon of requestedAddons) {
                const actualAddon = foodItem.addons.find(
                    (addon) =>
                        addon.name === requestedAddon.name
                );

                if (!actualAddon) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid addon for ${foodItem.name}`
                    });
                }

                validatedAddons.push({
                    name: actualAddon.name,
                    price: actualAddon.price
                });
            }

            // -----------------------------
            // Calculate item price
            // -----------------------------

            const addonTotal = validatedAddons.reduce(
                (total, addon) =>
                    total + addon.price,
                0
            );

            const unitPrice =
                foodItem.price + addonTotal;

            const itemTotal =
                unitPrice * quantity;

            subtotal += itemTotal;

            // -----------------------------
            // Create order item snapshot
            // -----------------------------

            orderItems.push({
                foodItemId: foodItem._id,

                name: foodItem.name,

                price: foodItem.price,

                quantity,

                addons: validatedAddons,

                note:
                    typeof requestedItem.note === "string"
                        ? requestedItem.note.trim()
                        : ""
            });
        }

        // -----------------------------
        // Charges
        // -----------------------------

        const settings = await Setting.findOne();

        const tax =
            settings?.gstEnabled
                ? (subtotal * settings.gstPercentage) / 100
                : 0;

        const serviceCharge =
            settings?.serviceChargeEnabled
                ? (subtotal * settings.serviceChargePercentage) / 100
                : 0;

        const deliveryCharge =
            settings?.deliveryChargeEnabled
                ? settings.deliveryCharge
                : 0;

        const total =
            subtotal +
            tax +
            serviceCharge +
            deliveryCharge;

        // -----------------------------
        // Create Order
        // -----------------------------

        const order = await Order.create({
            orderNumber: generateOrderNumber(),

            tableId: table._id,

            customer: {
                name: customer.name.trim(),
                mobile: customer.mobile.trim()
            },

            items: orderItems,

            subtotal,

            tax,

            serviceCharge,

            deliveryCharge,

            total,

            status: "pending"
        });

        const populatedOrder = await Order.findById(order._id)
        .populate("tableId", "tableNumber");

        const io = req.app.get("io");
        io.emit("new-order", populatedOrder);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: populatedOrder
        });

    } catch (error) {
        console.error("Create order error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create order"
        });
    }
};

export const getOrdersByTable = async (req, res) => {
    try {
        const { tableId } = req.params;

        const orders = await Order.find({ tableId })
            .populate("tableId", "tableNumber")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error("Get table orders error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch table orders"
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("tableId", "tableNumber");

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
        console.error("Get order by ID error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order"
        });
    }
};