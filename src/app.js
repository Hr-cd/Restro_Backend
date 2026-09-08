import express from "express";
import cors from "cors";
import menuRoutes from "./routes/menuRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import adminFoodRoutes from "./routes/adminFoodRoutes.js";
import adminTableRoutes from "./routes/adminTableRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Restro API is running"
    });
});

app.use("/api/menu", menuRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin/food-items", adminFoodRoutes);
app.use("/api/admin/tables", adminTableRoutes);

export default app;