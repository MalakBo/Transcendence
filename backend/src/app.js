import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js"
import providerRoutes from "./modules/profiles/provider.routes.js";
import organiserRoutes from "./modules/profiles/organiser.routes.js";
import 'temporal-polyfill/full/global'
import cookieParser from "cookie-parser";
import providerRoutes from "./modules/providers/provider.routes.js";



const app = express();

// Middleware
app.use(cors());
app.use(cookieParser()); 
app.use(express.json());

// Test route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EventMatch API is running 🚀",
  });
});


//Auth routes
app.use("/auth", authRoutes);

//Profiles routes
app.use("/api/providers", providerRoutes);
app.use("/organiser", organiserRoutes);


export default app;
