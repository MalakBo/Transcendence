import { Routes, Route, Navigate } from "react-router-dom";

import ProviderListPage from "../features/providers/pages/ProviderListPage";
import EventListPage from "../features/providers/pages/EventListPage";

import { LoginForm } from "../features/auth/components/form/LoginForm";
import { SignUp } from "../features/auth/components/form/SignUp";

import ProtectedRoute from "./ProtectedRoute";

function Placeholder({ title }) {
    return (
        <main>
            <h1>{title}</h1>
            <p>EventMatch — {title} module</p>
        </main>
    );
}

export default function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Navigate to="/events" replace />} />
                <Route path="/services" element={<ProviderListPage />} />
                <Route path="/events" element={<EventListPage />} />
                <Route path="/bookings" element={<Placeholder title="Bookings" />} />
                <Route path="/chat" element={<Placeholder title="Chat" />} />
            </Route>

            <Route path="*" element={<Placeholder title="Page not found" />} />
        </Routes>
    );
}