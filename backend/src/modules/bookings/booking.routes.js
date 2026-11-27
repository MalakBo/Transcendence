import express from "express";

import { getBookings,
         createBooking,
         updateBookingStatus,
         getBookingAvailableServices
 } from "./booking.controller.js";


// to protect the booking creation route

import {
    protect,
    authorizeRoles
} from "../profiles/auth.middleware.js"


// to create my router dedicated to booking and it manages only booking endpoints
const router = express.Router();

router.get(
    "/",
    protect,
    authorizeRoles("ORGANIZER", "PROVIDER"),
    getBookings
);
// the protect middleware checks whether the user has a valid JWT
// allow only the authenticated provider to create bookings
router.post(
    "/",
    protect,
    authorizeRoles("PROVIDER"),
    createBooking
);

router.patch(
    "/:id/status",
    protect,
    authorizeRoles("ORGANIZER"),
    updateBookingStatus
);
// router.post("/", createBooking);

router.get(
    "/available-services",
    protect,
    authorizeRoles("PROVIDER"),
    getBookingAvailableServices
);

export default router;

