import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = 3000;

dotenv.config();
connectDB();


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// app.get("/", (req, res) => {
//     res.json({ message: "Hello Restro!" });
// });