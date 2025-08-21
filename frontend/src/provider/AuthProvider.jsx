import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";

import PERMISSIONS from "../permissions/permissions"; 
import { BackendUrlContext } from "../context/BackendUrl";

axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

const getRolePermissions = (role) => {
    switch (role?.toLowerCase()) {
        case 'admin':
            return [PERMISSIONS.CAN_VIEW_ADMIN];
        case 'chef':
            return [PERMISSIONS.CAN_VIEW_CHEF];
        default:
            return [];
    }
};

export const AuthProvider = ({ children }) => {
    const backendURL = useContext(BackendUrlContext)
    const navigate = useNavigate();
    const location = useLocation();
    const toastStyle={
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    }
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                return {
                    username: parsed.username || "",
                    role: parsed.role || "",
                    permissions: getRolePermissions(parsed.role) || [] 
                };
            } 
            return { username: "", role: "", permissions: [] }; 
        } catch (error) {
            return { username: "", role: "", permissions: [] }; 
        }
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    if (location.pathname !== '/login') {
                        navigate('/login', { 
                            state: { path: location.pathname },
                            replace: true 
                        });
                    }
                    setUser({ username: "", role: "", permissions: [] });
                }
                setLoading(false);
            } catch (error) {
                setUser({ username: "", role: "", permissions: [] });
                navigate('/login', { replace: true });
                setLoading(false);
            }
        };

        checkAuth();
    }, [location.pathname, navigate]);

    useEffect(() => {
        if (user.username) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = async (credentials) => {
        try {
            const response = await axios.post(`${backendURL}/login`, credentials);
            const userData = response.data;

            const newUser = {
                username: userData.username,
                role: userData.role,
                permissions: getRolePermissions(userData.role)
            };

            setUser(newUser);

            const redirectPath = location.state?.path || "/home";
            navigate(redirectPath, { replace: true });

        } catch (error) {
            toast.error((error.response?.data|| "Login failed"), toastStyle);
            throw error;
        }
    };

    const signup = async (credentials) => {
        try {
            const response = await axios.post(backendURL + "/register", {
                name: credentials.Name,
                email: credentials.Email,
                password: credentials.Password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const userData = response.data;

            const newUser = {
                username: userData.username,
                role: userData.role,
                permissions: getRolePermissions(userData.role) 
            };

            setUser(newUser);

            const redirectPath = location.state?.path || "/home";
            navigate(redirectPath, { replace: true });

        } catch (error) {
            toast.error((error.response?.data|| "Login failed"), toastStyle);
        }
    };

    const logout = async () => {
        try {
            await axios.delete(backendURL + "/logout");
            setUser({ username: "", role: "", permissions: [] }); 
            localStorage.removeItem('user');
            localStorage.removeItem('itemList');
            navigate("/login");
        } catch (error) {
            toast.error(("Logout failed"), toastStyle);
        }
    };

    const value = { user, loading, login, signup, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};