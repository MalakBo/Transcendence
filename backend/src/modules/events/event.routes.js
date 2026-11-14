import express from "express";

import { getEvent, createEvent, getEventById, updateEvent, deleteEvent } from "./event.controller.js";
import { protect, authorizeRoles} from "../profiles/auth.middleware.js";
import checkEvent from "../../middleware/validate.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("ORGANIZER"), checkEvent, createEvent);
router.get("/", protect, authorizeRoles("ORGANIZER"), getEvent);
router.get("/:id", protect, authorizeRoles("ORGANIZER"), getEventById);
router.patch("/:id", protect, authorizeRoles("ORGANIZER"), updateEvent);
router.delete("/:id", protect, authorizeRoles("ORGANIZER"), deleteEvent);

export default router;