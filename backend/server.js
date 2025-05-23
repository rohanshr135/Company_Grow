import express from "express";
import authRoutes from "./routes/auth.routes.js"; // Adjust the path as necessary
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectMongoDB from "./db/connectMongoDB.js"; // Adjust the path as necessary
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
