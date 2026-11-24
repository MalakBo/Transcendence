import express from "express";
import { protect, authorizeRoles } from "./auth.middleware.js";
import { getOrganiserProfile, updateOrganiserProfile, getMyEvents, getUpcomingEvents, getPastEvents } from "../organisers/organiser.controller.js"
import { checkData } from "../../middleware/validate.middleware.js";

const router = express.Router();

router.get("/profile", protect, authorizeRoles("ORGANIZER", "ADMIN"), getOrganiserProfile);
router.patch("/profile", protect, authorizeRoles("ORGANIZER", "ADMIN"), checkData, updateOrganiserProfile);
router.get("/profile/events", protect, authorizeRoles("ORGANIZER", "ADMIN"), getMyEvents);
router.get("/profile/events/upcoming", protect, authorizeRoles("ORGANIZER", "ADMIN"), getUpcomingEvents);
router.get("/profile/events/past", protect, authorizeRoles("ORGANIZER", "ADMIN"), getPastEvents);
export default router;
