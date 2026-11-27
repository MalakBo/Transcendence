import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { Button } from "../../../../../components/ui/button";

export function Logout() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    return (
        <Button variant="ghost" onClick={handleLogout}>
            Logout
        </Button>
    );
}