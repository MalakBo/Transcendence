import express from "express";
import cors from "cors";
import providerRoutes from "./modules/providers/provider.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EventMatch API is running 🚀"
  });
});

// Provider routes
app.use("/api/providers", providerRoutes);

export default app;