export const getBookings = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Booking API is working!",
    bookings: []
  });
};

export const createBooking = (req, res) => {
  const { eventId, providerServiceId, organizerMessage } = req.body;

  return res.status(200).json({
    success: true,
    message: "Booking request received (not saved yet)",
    booking: {
      eventId,
      providerServiceId,
      organizerMessage: organizerMessage ?? null,
      status: "PENDING"
    }
  });
};
