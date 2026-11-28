// import { Routes, Route, Navigate } from "react-router-dom";
// import BookingsPage from "../features/bookings/pages/BookingsPage";
// import BookingRequestPage from "../features/bookings/pages/BookingRequestPage";

// import ProviderListPage from "../features/providers/pages/ProviderListPage";
// import EventListPage from "../features/providers/pages/EventListPage";

// import { LoginForm } from "../features/auth/components/form/LoginForm";
// import { SignUp } from "../features/auth/components/form/SignUp";

// import ProtectedRoute from "./ProtectedRoute";

// function Placeholder({ title }) {
//     return (
//         <main>
//             <h1>{title}</h1>
//             <p>EventMatch — {title} module</p>
//         </main>
//     );
// }

// export default function App() {
//     return (
//         <Routes>
//             {/* Public routes */}
//             <Route path="/login" element={<LoginForm />} />
//             <Route path="/signup" element={<SignUp />} />

//             {/* Should be just authenticated */}
//             <Route element={<ProtectedRoute/>}>
//             <Route element={<ProtectedRoute allowedRoles={["PROVIDER", "ORGANIZER"]} />}>
//                 <Route path="/bookings" element={<BookingsPage />} />
//             </Route>

//             <Route element={<ProtectedRoute allowedRoles={["PROVIDER"]} />}>
//                 <Route path="/bookings/request/:eventId" element={<BookingRequestPage />} />
//             </Route>
//                 <Route path="/chat" element={<Placeholder title="Chat" />} />
//             </Route>


//             {/* Protected routes */}
//             {/* Provider: */}
//             <Route element={<ProtectedRoute allowedRoles={["PROVIDER", "ADMIN"]} />}>
//                 <Route path="/" element={<Navigate to="/events" replace />} />
//                 <Route path="/events" element={<EventListPage />} />
//             </Route>
//             {/* organizer: */}
//             <Route element={<ProtectedRoute allowedRoles={["ORGANIZER", "ADMIN"]} />}>
//                 <Route path="/" element={<Navigate to="/services" replace />} />
//             <Route path="/services" element={<ProviderListPage />} />
//             </Route>
//             <Route path="*" element={<Placeholder title="Page not found" />} />
//         </Routes>
//     );
// }

import ChatTest from "../ChatTest";

function App() {
  return <ChatTest />;
}

export default App;