import express from "express";
import authRoutes from "./routes/auth.routes.js"; // Adjust the path as necessary
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectMongoDB from "./db/connectMongoDB.js"; // Adjust the path as necessary
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
app.use(express.json({ type: "*/*" }));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
