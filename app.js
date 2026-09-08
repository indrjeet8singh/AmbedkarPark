import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import ugaaiRoutes from "./routes/ugaaiRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";

dotenv.config();

const app = express();

// Middleware

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Test Route

app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes

app.use("/api/auth", authRoutes);

app.use("/api/ugaai", ugaaiRoutes);

app.use("/api/gallery", galleryRoutes);

// Error Handler

app.use(notFound);

app.use(errorHandler);

export default app;
