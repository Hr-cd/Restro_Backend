import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket.js";

const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
app.set("io", io);

dotenv.config();
initializeSocket(io);
connectDB();


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});

// app.get("/", (req, res) => {
//     res.json({ message: "Hello Restro!" });
// });