import express from "express";

import { getBookings,
         createBooking
 } from "./booking.controller.js";


// to protect the booking creation route

import {
    protect,
    authorizeRoles
} from "../profiles/auth.middleware.js"



// to create my router dedicated to booking and it manages only booking endpoints
const router = express.Router();

router.get("/", getBookings);
// the protect middleware checks whether the user has a valid JWT
// allow only the authenticated organizers to create bookings
router.post(
    "/",
    protect,
    authorizeRoles("ORGANIZER"),
    createBooking
);
// router.post("/", createBooking);

export default router;

