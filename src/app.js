import express from "express";
import cors from "cors";
import menuRoutes from "./routes/menuRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Restro API is running"
    });
});

app.use("/api/menu", menuRoutes);

export default app;