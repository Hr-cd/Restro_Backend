import "dotenv/config";
import app from "./app.js";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket.js";

const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
app.set("io", io);
initializeSocket(io);
connectDB();


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Authentication required"));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        socket.admin = decoded;

        next();
    } catch (error) {
        next(new Error("Invalid authentication token"));
    }
});

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.join("admins");

    socket.on("join-order", (orderId) => {
        socket.join(`order:${orderId}`);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});

// app.get("/", (req, res) => {
//     res.json({ message: "Hello Restro!" });
// });