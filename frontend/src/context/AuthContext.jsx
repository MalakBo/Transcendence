import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await authService.getMe();
                setUser(response.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    async function login(credentials) {
        const response = await authService.login(credentials);
        setUser(response.data.user);
        return response;
    }

    async function signup(data) {
        const response = await authService.register(data);
        setUser(response.data.user);
        return response;
    }

    async function logout() {
        await authService.logout();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}