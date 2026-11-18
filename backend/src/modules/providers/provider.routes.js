import { Router } from "express";
import { getProviderById, createProvider, updateProvider } from "./provider.controller.js";
import { createService } from "./providerService.controller.js";

import { protect, authorizeRoles } from "../profiles/auth.middleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Provider route is working!",
  });
});
router.get("/:id", protect, getProviderById);
router.post("/", protect, authorizeRoles("PROVIDER"), createProvider);
router.patch("/:id",protect, authorizeRoles("PROVIDER"), updateProvider);
router.post("/:providerId/services", protect, authorizeRoles("PROVIDER"),createService);

export default router;
