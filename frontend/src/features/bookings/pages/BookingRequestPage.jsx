
import { useParams, Link } from "react-router-dom";
import BookingRequestForm from "../components/BookingRequestForm.jsx";
import { useState, useEffect } from "react";
import { getAvailableServices } from "../services/bookingServices.js";

export default function BookingRequestPage() {
  const { eventId } = useParams();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadServices() {
        try {
            const data = await getAvailableServices();
            setServices(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    loadServices();
}, []);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link
        to="/events"
        className="mb-6 inline-block text-sm text-neutral-600 hover:text-neutral-950"
      >
        ← Back to Events
      </Link>

      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-2xl font-bold text-neutral-950">
          Send Booking Request
        </h1>

        <p className="mb-8 text-sm text-neutral-600">
          Select your service and write a message to the event organizer.
        </p>

        {loading ? (
          <p>Loading available services...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
        <BookingRequestForm
          eventId={eventId}
          services={services}
       />
      )}

        {/* <BookingRequestForm eventId={eventId} /> */}
      </div>
    </main>
  );
}
