import express from "express";

import { getBookings,
         createBooking
 } from "./booking.controller.js";

// to create my router dedicated to booking and it manages only booking endpoints
const router = express.Router();

router.get("/", getBookings);
router.post("/", createBooking);

export default router;

