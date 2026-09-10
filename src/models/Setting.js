import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
    {
        restaurantName: {
            type: String,
            trim: true,
            default: ""
        },

        address: {
            type: String,
            trim: true,
            default: ""
        },

        phone: {
            type: String,
            trim: true,
            default: ""
        },

        email: {
            type: String,
            trim: true,
            default: ""
        },

        currency: {
            type: String,
            trim: true,
            default: "INR"
        },

        currencySymbol: {
            type: String,
            trim: true,
            default: "₹"
        },

        gstEnabled: {
            type: Boolean,
            default: false
        },

        gstPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        serviceChargeEnabled: {
            type: Boolean,
            default: false
        },

        serviceChargePercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        deliveryChargeEnabled: {
            type: Boolean,
            default: false
        },

        deliveryCharge: {
            type: Number,
            min: 0,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;