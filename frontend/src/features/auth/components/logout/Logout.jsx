import { apiRequest } from "../../../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { Button } from "../../../../../components/ui/button";

export function Logout()
{
    const navigate = useNavigate();
    const { setUser } = useAuth();
    async function logout(event)
    {
        event.preventDefault();
        const response = await apiRequest("/auth/logout", {
            method: "Post"
        });
        console.log(response);
        if (response.status === "success") {
            setUser(null);
            navigate("/login");
        }
    }
    return (
        <Button variant="ghost" onClick={logout}>
            Logout
        </Button>);
}