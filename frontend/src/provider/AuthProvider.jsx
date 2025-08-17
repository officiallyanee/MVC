import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// ADD THIS: Import your permissions
import PERMISSIONS from "../permissions/permissions"; // Update this path to where your permissions file is

axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

// ADD THIS FUNCTION: Map roles to permissions
const getRolePermissions = (role) => {
    switch (role?.toLowerCase()) {
        case 'admin':
            return [PERMISSIONS.CAN_VIEW_ADMIN, PERMISSIONS.CAN_VIEW_CHEF];
        case 'chef':
            return [PERMISSIONS.CAN_VIEW_CHEF];
        default:
            return [];
    }
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // ADD THIS: Loading state
    const [loading, setLoading] = useState(true);

    // MODIFY THIS: Update the initial state
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                return {
                    username: parsed.username || "",
                    role: parsed.role || "",
                    permissions: getRolePermissions(parsed.role) || [] // ADD THIS LINE
                };
            }
            return { username: "", role: "", permissions: [] }; // MODIFY THIS LINE
        } catch (e) {
            return { username: "", role: "", permissions: [] }; // MODIFY THIS LINE
        }
    });

    // ADD THIS: Check authentication on app load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Optional: If you have a verify endpoint, uncomment this
                // const response = await axios.get("http://localhost:8080/verify-token");
                // Handle verification...
                
                // For now, just set loading to false
                setLoading(false);
            } catch (error) {
                console.error("Auth check failed:", error);
                setUser({ username: "", role: "", permissions: [] });
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (user.username) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = async (credentials) => {
        try {
            const response = await axios.post("http://localhost:8080/login", credentials);
            const userData = response.data;

            // MODIFY THIS: Add permissions
            setUser({
                username: userData.username,
                role: userData.role,
                permissions: getRolePermissions(userData.role) // ADD THIS LINE
            });

            const redirectPath = location.state?.path || "/home";
            navigate(redirectPath, { replace: true });

        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const signup = async (credentials) => {
        try {
            console.log("Credentials:", credentials);

            const response = await axios.post("http://localhost:8080/register", {
                name: credentials.Name,
                email: credentials.Email,
                password: credentials.Password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const userData = response.data;

            // MODIFY THIS: Add permissions
            setUser({
                username: userData.username,
                role: userData.role,
                permissions: getRolePermissions(userData.role) // ADD THIS LINE
            });

            const redirectPath = location.state?.path || "/home";
            navigate(redirectPath, { replace: true });

        } catch (error) {
            console.error("Signup failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post("http://localhost:8080/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser({ username: "", role: "", permissions: [] }); // MODIFY THIS LINE
            navigate("/login");
        }
    };

    // MODIFY THIS: Add loading to the value
    const value = { user, loading, login, signup, logout }; // ADD loading here

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};