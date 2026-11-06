import {
  getAllBookings,
  createBooking as createBookingService
} from "./booking.service.js";

export const getBookings = async (req, res) => {
  try {
    const bookings = await getAllBookings();

    return res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { eventId, providerServiceId, organizerMessage } = req.body;
    if (!eventId || !providerServiceId) {
  return res.status(400).json({
    success: false,
    message: "eventId and providerServiceId are required"
  });
}

    const booking = await createBookingService(
      eventId,
      providerServiceId,
      organizerMessage
    );

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking
    });
  } catch (error) {
    console.error("Error creating booking:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create booking"
    });
  }
};
