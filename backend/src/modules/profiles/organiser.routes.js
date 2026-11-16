import express from "express";
import { protect, authorizeRoles } from "./auth.middleware.js";
import { getOrganiserProfile, updateOrganiserProfile, chechDAta } from "../organisers/organiser.controller.js"

const router = express.Router();

router.get("/profile", protect, authorizeRoles("ORGANIZER", "ADMIN"), getOrganiserProfile);
// router.patch("/profile", protect, authorizeRoles("ORGANIZER", "ADMIN"), chechDAta, updateOrganiserProfile);
router.patch("/profile", protect, authorizeRoles("ORGANIZER", "ADMIN"), updateOrganiserProfile);


export default router;
