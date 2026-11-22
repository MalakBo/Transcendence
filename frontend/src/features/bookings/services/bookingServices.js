
import { apiRequest } from "../../../services/api.js";

export function getBookings(token) 
{
  return apiRequest("/api/bookings", {
    method: "GET",
    token
  });
}

export function updateBookingStatus(
  bookingId,
  status,
  organizerMessage = ""
) 
{
  return apiRequest(`/api/bookings/${bookingId}/status`, {
    method: "PATCH",
    body: {
      status,
      organizerMessage
    }
  });
}

