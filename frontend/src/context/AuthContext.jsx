import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../services/api.js";
import { socket } from "../features/chat/services/chatSocket.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await apiRequest("/auth/me");
                setUser(response.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    useEffect(() => {
    if (loading) return;

    if (user) {
        socket.connect();
    } else {
        socket.disconnect();
    }

    return () => {
        socket.disconnect();
    };
    }, [user, loading]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
