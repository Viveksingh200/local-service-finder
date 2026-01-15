import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import serviceRoute from "./routes/serviceRoute.js";

dotenv.config();
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api/user", userRoute);
app.use("/api/services", serviceRoute);
app.use("/api/admin", adminRoute);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("server is running")
});


app.listen(PORT, () => {
    console.log("app is listening at port 5000");
});

(async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected successfully");
    } catch (error) {
        console.log("connection failed", error);
        process.exit(1);
    }
})()