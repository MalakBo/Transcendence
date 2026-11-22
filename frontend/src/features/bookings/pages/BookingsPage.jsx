// export default function BookingsPage()
// {
//   return (
//     <main className="min-h-screen bg-[#F7F5FF] p-10">
//       <h1 className="text-3xl font-bold text-[#28164B]">
//         My Bookings
//       </h1>

//       <p className="mt-3 text-gray-600">
//         Manage your booking requests here.
//       </p>
//     </main>
//   );
// }
// // BookingsPage is a React function component.
// // return (...) defines what appears on the screen.
// // The JSX contains a heading and a paragraph.
// // export default allows us to import this component into another file.




// import { useState, useEffect } from "react";
// import {
//   getBookings,
//   updateBookingStatus
// } from "../services/bookingServices.js";

// export default function BookingsPage() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function loadBookings() {
//       try {
//         const data = await getBookings();
//         setBookings(data.bookings);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadBookings();
//   }, []);

//   async function handleBookingDecision(bookingId, status) {
//   try {
//     const result = await updateBookingStatus(
//       bookingId,
//       status,
//       ""
//     );

//     console.log("Booking update result:", result);
//   } catch (error) {
//     console.error("Failed to update booking:", error);
//   }
// }

//   return (
//     <main className="min-h-screen bg-[#F7F5FF] p-10">
//       <h1 className="text-3xl font-bold text-[#28164B]">
//         My Bookings
//       </h1>

//       {loading && (
//         <p className="mt-4">Loading bookings...</p>
//       )}

//       {error && (
//         <p className="mt-4 text-red-600">{error}</p>
//       )}

//       {!loading && !error && (
//         <>
//           <p className="mt-3 text-gray-600">
//             Total bookings: {bookings.length}
//           </p>

//           {bookings.length === 0 ? (
//             <p className="mt-4">No bookings found.</p>
//           ) : (
            


//             bookings.map((booking) => (
//   <div
//     key={booking.id}
//     className="mt-6 rounded-xl bg-white p-6 shadow-sm border border-gray-100"
//   >
//     {/* Header */}
//     <div className="flex items-center justify-between gap-4">
//       {/* <h2 className="text-lg font-semibold text-[#28164B]">
//         Booking Request
//       </h2> */}
//       <div>
//   <h2 className="text-lg font-semibold text-[#28164B]">
//     {booking.eventTitle || "Unknown Event"}
//   </h2>

//   <p className="mt-1 text-sm text-gray-500">
//     {booking.serviceName || "Unknown Service"}
//   </p>
// </div>

//       <span
//         className={`rounded-full px-3 py-1 text-xs font-semibold ${
//           booking.status === "PENDING"
//             ? "bg-yellow-100 text-yellow-800"
//             : booking.status === "ACCEPTED"
//             ? "bg-green-100 text-green-800"
//             : "bg-red-100 text-red-800"
//         }`}
//       >
//         {booking.status}
//       </span>
//     </div>

//     {/* Booking ID */}
//     <p className="mt-2 break-all text-xs text-gray-400">
//       Booking ID: {booking.id}
//     </p>

//     {/* Provider Message */}
//     <div className="mt-5">
//       <h3 className="text-sm font-semibold text-gray-700">
//         Provider Message
//       </h3>

//       <p className="mt-2 text-sm text-gray-600">
//         {booking.providerMessage || "No message provided."}
//       </p>
//     </div>

//     {/* Organizer Message */}
//     {booking.organizerMessage && (
//       <div className="mt-4">
//         <h3 className="text-sm font-semibold text-gray-700">
//           Organizer Response
//         </h3>

//         <p className="mt-2 text-sm text-gray-600">
//           {booking.organizerMessage}
//         </p>
//       </div>
//     )}


//      {/* Accept / Reject buttons */}
//     {booking.status === "PENDING" && (
//         <div className="mt-5 flex gap-3">
//             <button
//                 type="button"
//                 disabled={updatingId !== null}
//                 onClick={() =>
//                     handleBookingDecision(
//                         booking.id,
//                         "ACCEPTED"
//                     )
//                 }
//                 className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
//                 >
//                 {updatingId === booking.id
//                     ? "Updating..."
//                     : "Accept"}
//                 </button>

//                 <button
//                     type="button"
//                     disabled={updatingId !== null}
//                     onClick={() =>
//                         handleBookingDecision(
//                             booking.id,
//                             "REJECTED"
//                         )
//                     }
//                     className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
//                     >
//                       {updatingId === booking.id
//                         ? "Updating..."
//                         : "Reject"}
//                     </button>
//                   </div>
//                 )}

//     {/* Footer */}
//     <div className="mt-5 border-t border-gray-100 pt-4">
//       <p className="text-xs text-gray-500">
//         Created on{" "}
//         {new Date(booking.createdAt).toLocaleDateString()}
//       </p>
//     </div>
//   </div>
// ))
//             // bookings.map((booking) => (
//             //   <div
//             //     key={booking.id}
//             //     className="mt-4 rounded-lg bg-white p-4 shadow"
//             //   >
//             //     <p>Booking #{booking.id}</p>
//             //     <p>Status: {booking.status}</p>
//             //   </div>
//             // ))
//           )}
//         </>
//       )}
//     </main>
//   );
// }



import { useState, useEffect } from "react";
import {
  getBookings,
  updateBookingStatus
} from "../services/bookingServices.js";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getBookings();
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  async function handleBookingDecision(bookingId, status) {
    const action = status === "ACCEPTED" ? "accept" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this booking?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(bookingId);
      setError("");

      const result = await updateBookingStatus(
        bookingId,
        status,
        ""
      );

      console.log("Booking update result:", result);

      // Update the booking in React without refreshing the page
      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, ...result.booking }
            : booking
        )
      );
    } catch (err) {
      console.error("Failed to update booking:", err);
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5FF] p-10">
      <h1 className="text-3xl font-bold text-[#28164B]">
        My Bookings
      </h1>

      {loading && (
        <p className="mt-4">Loading bookings...</p>
      )}

      {error && (
        <p className="mt-4 text-red-600">{error}</p>
      )}

      {!loading && (
        <>
          <p className="mt-3 text-gray-600">
            Total bookings: {bookings.length}
          </p>

          {bookings.length === 0 ? (
            <p className="mt-4">No bookings found.</p>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="mt-6 rounded-xl bg-white p-6 shadow-sm border border-gray-100"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#28164B]">
                      {booking.eventTitle || "Unknown Event"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {booking.serviceName || "Unknown Service"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status === "ACCEPTED"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Booking ID */}
                <p className="mt-2 break-all text-xs text-gray-400">
                  Booking ID: {booking.id}
                </p>

                {/* Provider Message */}
                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Provider Message
                  </h3>

                  <p className="mt-2 text-sm text-gray-600">
                    {booking.providerMessage || "No message provided."}
                  </p>
                </div>

                {/* Organizer Message */}
                {booking.organizerMessage && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Organizer Response
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                      {booking.organizerMessage}
                    </p>
                  </div>
                )}

                {/* Accept / Reject buttons */}
                {booking.status === "PENDING" && (
                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      disabled={updatingId !== null}
                      onClick={() =>
                        handleBookingDecision(
                          booking.id,
                          "ACCEPTED"
                        )
                      }
                      className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {updatingId === booking.id
                        ? "Updating..."
                        : "Accept"}
                    </button>

                    <button
                      type="button"
                      disabled={updatingId !== null}
                      onClick={() =>
                        handleBookingDecision(
                          booking.id,
                          "REJECTED"
                        )
                      }
                      className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {updatingId === booking.id
                        ? "Updating..."
                        : "Reject"}
                    </button>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-500">
                    Created on{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </main>
  );
}
