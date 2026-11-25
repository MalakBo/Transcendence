import { Router } from "express";
import { getProviderById, createProvider, updateProvider, getProviders } from "./provider.controller.js";
import { createService, getServices, updateService, deleteService } from "./providerService.controller.js";
import { protect, authorizeRoles } from "../profiles/auth.middleware.js";

const router = Router();

// router.get("/", getProviders);
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Provider route is working!",
  });
});
router.get("/:id", protect, getProviderById);
router.post("/", protect, authorizeRoles("PROVIDER"), createProvider);
router.patch("/:id",protect, authorizeRoles("PROVIDER"), protect, updateProvider);
// provider services routes
router.post("/:providerId/services", protect, protect, authorizeRoles("PROVIDER"),createService);
router.get("/:providerId/services", getServices);
router.patch("/:providerId/services/:serviceId", protect, updateService);
router.delete("/:providerId/services/:serviceId", protect, deleteService);
export default router;
