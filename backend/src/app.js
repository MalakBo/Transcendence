import express from "express";
// by basma
import bookingRoutes from "./modules/bookings/booking.routes.js";
import cors from "cors";
// Think of app as the central object that organizes your backend's HTTP behavior.

import authRoutes from "./modules/auth/auth.routes.js"
import providerAreaRoutes from "./modules/profiles/provider.routes.js";
import providerRoutes from "./modules/providers/provider.routes.js";
import organiserRoutes from "./modules/profiles/organiser.routes.js";
import 'temporal-polyfill/full/global'
import cookieParser from "cookie-parser";





const app = express();

// Middleware
app.use(cors());
// thats what enables express to parse incoming JSON into req.body
app.use(cookieParser());
app.use(express.json());
// by basma
app.use("/api/bookings", bookingRoutes);

// Test route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EventMatch API is running ",
  });
});


//Auth routes
app.use("/auth", authRoutes);

//Profiles routes
app.use("/api/providers", providerRoutes);
app.use("/api/provider-area", providerAreaRoutes);
app.use("/organiser", organiserRoutes);


export default app;
