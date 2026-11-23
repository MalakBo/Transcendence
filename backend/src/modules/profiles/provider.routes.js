
import express from "express";
import { protect, authorizeRoles } from "./auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("PROVIDER", "ADMIN"),
  (req, res) => {
    res.json({
      message: `Provider area. Hello ${req.user.name}`,
      role: req.user.role,
    });
  }
);

export default router;
