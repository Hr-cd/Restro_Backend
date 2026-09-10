import Order from "../models/Order.js";
import ExcelJS from "exceljs";

const getISTDateRange = (startDate, endDate) => {
    return {
        start: new Date(`${startDate}T00:00:00+05:30`),
        end: new Date(`${endDate}T23:59:59.999+05:30`)
    };
};

export const getSalesSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const match = {
            status: "completed"
        };

        if (startDate || endDate) {
            match.createdAt = {};

            if (startDate) {
                match.createdAt.$gte =
                    new Date(`${startDate}T00:00:00+05:30`);
            }

            if (endDate) {
                match.createdAt.$lte =
                    new Date(`${endDate}T23:59:59.999+05:30`);
            }
        }

        const result = await Order.aggregate([
            {
                $match: match
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$total" },
                    totalOrders: { $sum: 1 },
                    averageOrderValue: { $avg: "$total" }
                }
            }
        ]);

        const summary = result[0] || {
            totalSales: 0,
            totalOrders: 0,
            averageOrderValue: 0
        };

        res.status(200).json({
            success: true,
            data: {
                totalSales: Number(summary.totalSales.toFixed(2)),
                totalOrders: summary.totalOrders,
                averageOrderValue: Number(
                    summary.averageOrderValue.toFixed(2)
                )
            }
        });
    } catch (error) {
        console.error("Sales summary error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch sales summary"
        });
    }
};

export const getDailySalesReport = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required"
            });
        }

        // India timezone boundaries
        const startOfDay = new Date(`${date}T00:00:00+05:30`);
        const endOfDay = new Date(`${date}T23:59:59.999+05:30`);

        const result = await Order.aggregate([
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
                    totalSales: {
                        $sum: "$total"
                    },
                    totalOrders: {
                        $sum: 1
                    },
                    averageOrderValue: {
                        $avg: "$total"
                    }
                }
            }
        ]);

        const data = result[0] || {
            totalSales: 0,
            totalOrders: 0,
            averageOrderValue: 0
        };

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.error("Daily sales report error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate daily sales report"
        });
    }
};

export const getWeeklySalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required"
            });
        }

        const { start, end } = getISTDateRange(startDate, endDate);

        const result = await Order.aggregate([
            {
                $match: {
                    status: "completed",
                    createdAt: {
                        $gte: start,
                        $lte: end
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    totalSales: { $sum: "$total" },
                    totalOrders: { $sum: 1 }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        const totalSales = result.reduce(
            (sum, day) => sum + day.totalSales,
            0
        );

        const totalOrders = result.reduce(
            (sum, day) => sum + day.totalOrders,
            0
        );

        res.status(200).json({
            success: true,
            data: {
                startDate,
                endDate,
                totalSales: Number(totalSales.toFixed(2)),
                totalOrders,
                averageOrderValue:
                    totalOrders > 0
                        ? Number((totalSales / totalOrders).toFixed(2))
                        : 0,
                dailyBreakdown: result.map((day) => ({
                    date: day._id,
                    totalSales: Number(day.totalSales.toFixed(2)),
                    totalOrders: day.totalOrders
                }))
            }
        });
    } catch (error) {
        console.error("Weekly sales report error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch weekly sales report"
        });
    }
};

export const getMonthlySalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required"
            });
        }

        const { start, end } = getISTDateRange(startDate, endDate);

        const result = await Order.aggregate([
            {
                $match: {
                    status: "completed",
                    createdAt: {
                        $gte: start,
                        $lte: end
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$createdAt"
                        }
                    },
                    totalSales: { $sum: "$total" },
                    totalOrders: { $sum: 1 }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        const totalSales = result.reduce(
            (sum, month) => sum + month.totalSales,
            0
        );

        const totalOrders = result.reduce(
            (sum, month) => sum + month.totalOrders,
            0
        );

        res.status(200).json({
            success: true,
            data: {
                startDate,
                endDate,
                totalSales: Number(totalSales.toFixed(2)),
                totalOrders,
                averageOrderValue:
                    totalOrders > 0
                        ? Number((totalSales / totalOrders).toFixed(2))
                        : 0,
                monthlyBreakdown: result.map((month) => ({
                    month: month._id,
                    totalSales: Number(month.totalSales.toFixed(2)),
                    totalOrders: month.totalOrders
                }))
            }
        });
    } catch (error) {
        console.error("Monthly sales report error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch monthly sales report"
        });
    }
};

export const exportSalesToExcel = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const match = {
            status: "completed"
        };

        if (startDate || endDate) {
            match.createdAt = {};

            if (startDate) {
                match.createdAt.$gte = new Date(`${startDate}T00:00:00`);
            }

            if (endDate) {
                match.createdAt.$lte = new Date(`${endDate}T23:59:59.999`);
            }
        }

        const orders = await Order.find(match)
            .populate("tableId", "tableNumber")
            .sort({ createdAt: -1 })
            .lean();

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet("Sales Report");

        worksheet.columns = [
            { header: "Order Number", key: "orderNumber", width: 18 },
            { header: "Customer", key: "customer", width: 25 },
            { header: "Mobile", key: "mobile", width: 16 },
            { header: "Table", key: "table", width: 12 },
            { header: "Items", key: "items", width: 10 },
            { header: "Total", key: "total", width: 15 },
            { header: "Status", key: "status", width: 15 },
            { header: "Date", key: "date", width: 22 }
        ];

        orders.forEach((order) => {
            worksheet.addRow({
                orderNumber: order.orderNumber,
                customer: order.customer?.name || "",
                mobile: order.customer?.mobile || "",
                table: order.tableId?.tableNumber || "-",
                items: order.items?.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                ) || 0,
                total: order.total,
                status: order.status,
                date: new Date(order.createdAt).toLocaleString("en-IN")
            });
        });

        worksheet.getRow(1).font = {
            bold: true
        };

        worksheet.views = [
            {
                state: "frozen",
                ySplit: 1
            }
        ];

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="sales-report-${Date.now()}.xlsx"`
        );

        await workbook.xlsx.write(res);

        res.end();
    } catch (error) {
        console.error("Excel export error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to export sales report"
        });
    }
};