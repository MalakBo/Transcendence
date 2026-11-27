
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBookingRequest } from "../services/bookingServices.js";

export default function BookingRequestForm({ eventId, services = [] }) {
  const [providerServiceId, setProviderServiceId] = useState("");
  const [providerMessage, setProviderMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Only active services can be selected
  const activeServices = services.filter(
    (service) => service.isActive === true
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!eventId) {
      setError("Event information is missing.");
      return;
    }

    if (!providerServiceId) {
      setError("Please select a service.");
      return;
    }

    if (!providerMessage.trim()) {
      setError("Please enter a message for the organizer.");
      return;
    }

    try {
      setLoading(true);

      await createBookingRequest(
        eventId,
        providerServiceId,
        providerMessage.trim()
      );

      navigate("/bookings");
    } catch (err) {
      setError(err.message || "Failed to send booking request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="providerService"
          className="mb-2 block text-sm font-medium"
        >
          Select your service
        </label>

        <select
          id="providerService"
          value={providerServiceId}
          onChange={(event) => setProviderServiceId(event.target.value)}
          className="w-full rounded-lg border border-neutral-300 p-3"
          required
        >
          <option value="">Choose a service</option>

          {activeServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>

        {activeServices.length === 0 && (
          <p className="mt-2 text-sm text-neutral-500">
            No active services are available.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="providerMessage"
          className="mb-2 block text-sm font-medium"
        >
          Message to organizer
        </label>

        <textarea
          id="providerMessage"
          value={providerMessage}
          onChange={(event) => setProviderMessage(event.target.value)}
          placeholder="Explain why your service is suitable for this event..."
          rows={5}
          maxLength={1000}
          className="w-full rounded-lg border border-neutral-300 p-3"
          required
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || activeServices.length === 0}
        className="rounded-lg bg-neutral-950 px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Booking Request"}
      </button>
    </form>
  );
}
