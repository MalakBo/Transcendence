import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function navigateByRole(role) {
    if (role === "PROVIDER")
        return "/events";
    if (role === "ORGANIZER")
        return "/services";
}

export default function ProtectedRoute({ allowedRoles }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={navigateByRole(user.role)} replace/>;
    }
    return <Outlet />;
}