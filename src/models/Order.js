import mongoose from "mongoose";

const addonSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        _id: false
    }
);

const orderItemSchema = new mongoose.Schema(
    {
        foodItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FoodItem",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        addons: {
            type: [addonSchema],
            default: []
        },

        note: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        tableId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Table",
            required: true
        },

        customer: {
            name: {
                type: String,
                required: true,
                trim: true
            },

            mobile: {
                type: String,
                required: true,
                trim: true
            }
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "Order must contain at least one item"
            }
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        tax: {
            type: Number,
            default: 0,
            min: 0
        },

        serviceCharge: {
            type: Number,
            default: 0,
            min: 0
        },

        deliveryCharge: {
            type: Number,
            default: 0,
            min: 0
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "pending",
                "preparing",
                "ready",
                "completed",
                "cancelled"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;