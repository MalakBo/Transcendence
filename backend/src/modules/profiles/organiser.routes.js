import express from "express";
import { protect, authorizeRoles } from "./auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("ORGANIZER", "ADMIN"),
  (req, res) => {
    res.json({
      message: `Organiser area. Hello ${req.user.name}`,
      role: req.user.role,
    });
  }
);

export default router;
