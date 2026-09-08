import crypto from "crypto";
import Table from "../models/Table.js";

const generateQrToken = () => {
    return crypto.randomBytes(16).toString("hex");
};

export const getTables = async (req, res) => {
    try {
        const tables = await Table.find()
            .sort({ tableNumber: 1 });

        res.status(200).json({
            success: true,
            data: tables
        });
    } catch (error) {
        console.error("Get tables error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch tables"
        });
    }
};

export const createTable = async (req, res) => {
    try {
        const { tableNumber } = req.body;

        if (!tableNumber?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Table number is required"
            });
        }

        const existingTable = await Table.findOne({
            tableNumber: tableNumber.trim()
        });

        if (existingTable) {
            return res.status(409).json({
                success: false,
                message: "Table number already exists"
            });
        }

        const table = await Table.create({
            tableNumber: tableNumber.trim(),
            qrToken: generateQrToken()
        });

        res.status(201).json({
            success: true,
            message: "Table created successfully",
            data: table
        });
    } catch (error) {
        console.error("Create table error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create table"
        });
    }
};

export const updateTable = async (req, res) => {
    try {
        const { tableNumber } = req.body;

        if (!tableNumber?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Table number is required"
            });
        }

        const table = await Table.findById(req.params.id);

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Table not found"
            });
        }

        const duplicate = await Table.findOne({
            tableNumber: tableNumber.trim(),
            _id: { $ne: req.params.id }
        });

        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: "Table number already exists"
            });
        }

        table.tableNumber = tableNumber.trim();

        await table.save();

        res.status(200).json({
            success: true,
            message: "Table updated successfully",
            data: table
        });
    } catch (error) {
        console.error("Update table error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update table"
        });
    }
};

export const deleteTable = async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Table not found"
            });
        }

        await table.deleteOne();

        res.status(200).json({
            success: true,
            message: "Table deleted successfully"
        });
    } catch (error) {
        console.error("Delete table error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete table"
        });
    }
};

export const toggleTableStatus = async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Table not found"
            });
        }

        table.isActive = !table.isActive;

        await table.save();

        res.status(200).json({
            success: true,
            message: table.isActive
                ? "Table activated successfully"
                : "Table deactivated successfully",
            data: table
        });
    } catch (error) {
        console.error("Toggle table status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update table status"
        });
    }
};