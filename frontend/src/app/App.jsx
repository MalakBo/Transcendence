
import { Routes, Route, Navigate } from "react-router-dom";

import ProviderListPage from "../features/providers/pages/ProviderListPage";
import EventListPage from "../features/providers/pages/EventListPage";
import ProviderDetailPage from "../features/providers/pages/ProviderDetailPage";

import { LoginForm } from "../features/auth/components/form/LoginForm";
import { SignUp } from "../features/auth/components/form/SignUp";

function Placeholder({ title }) {
  return (
    <main className="min-h-screen bg-[#F7F5FF] p-10">
      <h1 className="text-3xl font-bold text-[#28164B]">
        {title}
      </h1>
      <p className="mt-3 text-gray-600">
        EventMatch — {title} module
      </p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/events" replace />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/providers" element={<ProviderListPage />} />
      <Route path="/events" element={<EventListPage />} />
      <Route path="/events" element={<Placeholder title="Events" />} />
      <Route path="/bookings" element={<Placeholder title="Bookings" />} />
      <Route path="/chat" element={<Placeholder title="Chat" />} />
      <Route path="/providers/:id" element={<ProviderDetailPage />} />
      <Route path="*" element={<Placeholder title="Page not found" />} />
    </Routes>
  );
}
