import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
    {
        tableNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        qrToken: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Table = mongoose.model("Table", tableSchema);

export default Table;