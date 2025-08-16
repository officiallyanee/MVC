import  { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : { username: "", permissions: [] };
        } catch (e) {
            return { username: "", permissions: [] };
        }
    });

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

            setUser({
                username: userData.username,
                role: userData.role,
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

            setUser({
                username: userData.username,
                role: userData.role
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
            setUser({ username: "", permissions: [] });
            navigate("/login");
        }
    };

    const value = { user, login, signup, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};