import { apiRequest } from "../../../../services/api";
import { useNavigate } from "react-router-dom";

export function Logout()
{
    const navigate = useNavigate();
    async function logout(event)
    {
        event.preventDefault();
        const response = await apiRequest("/auth/logout", {
            method: "Post"
        });
        console.log(response);
        if (response.status === "success") {
            navigate("/login");
        }
    }
    return (
        <form onSubmit={logout}>
            <button>Logout</button>
        </form>);
}