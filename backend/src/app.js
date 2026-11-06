import express from "express";
// by basma
import bookingRoutes from "./modules/bookings/booking.routes.js";
import cors from "cors";
// Think of app as the central object that organizes your backend's HTTP behavior.
const app = express();

// Middleware
app.use(cors());
// thats what enables express to parse incoming JSON into req.body
app.use(express.json());
// by basma
app.use("/api/bookings", bookingRoutes);

// Test route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EventMatch API is running 🚀"
  });
});

export default app;