import Table from "../models/Table.js";

export const resolveTable = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Table token is required"
            });
        }

        const table = await Table.findOne({
            qrToken: token,
            isActive: true
        }).select("_id tableNumber");

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Invalid or inactive table"
            });
        }

        res.status(200).json({
            success: true,
            data: table
        });
    } catch (error) {
        console.error("Resolve table error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to resolve table"
        });
    }
};