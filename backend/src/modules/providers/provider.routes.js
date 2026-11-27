import { Router } from "express";
import { getProviderById, createProvider, updateProvider, getProviders } from "./provider.controller.js";
import { createService, getServices, updateService, deleteService, getCategories } from "./providerService.controller.js";
import { protect, authorizeRoles } from "../profiles/auth.middleware.js";
const router = Router();

router.get("/", getProviders);
router.get("/categories", getCategories);
router.get("/:id", getProviderById);
router.post("/", protect, authorizeRoles("PROVIDER"), createProvider);
router.patch("/:id", protect, authorizeRoles("PROVIDER"), updateProvider);

// provider services routes
router.post("/:providerId/services", protect, authorizeRoles("PROVIDER"), createService);
router.get("/:providerId/services", getServices);
router.patch("/:providerId/services/:serviceId", protect, authorizeRoles("PROVIDER"), updateService);
router.delete("/:providerId/services/:serviceId", protect, authorizeRoles("PROVIDER"), deleteService);

export default router;
