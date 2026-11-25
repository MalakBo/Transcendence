
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

// Create a booking request for an event
export async function createBookingRequest(
  eventId,
  providerServiceId,
  providerMessage
) {
  return apiRequest("/api/bookings", {
    method: "POST",
    body: {
      eventId,
      providerServiceId,
      providerMessage
    }
  });
}

export async function getCurrentUser() 
{
    const response = await apiRequest("/auth/me", {
        method: "GET"
    });

    return response.user;
}
export async function getAvailableServices() {
    const response = await apiRequest(
        "/api/bookings/available-services",
        {
            method: "GET"
        }
    );

    return response.services;
}