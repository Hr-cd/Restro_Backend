import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        image: {
            type: String,
            default: ""
        },

        sortOrder: {
            type: Number,
            default: 0
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

const Category = mongoose.model("Category", categorySchema);

export default Category;