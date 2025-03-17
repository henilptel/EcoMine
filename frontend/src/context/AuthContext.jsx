import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            const { user: storedUser } = authService.getAuthData();
            if (storedUser) {
                try {
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    authService.logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const { user: userData, token } = await authService.login(username, password);
            authService.setAuthData(token, userData);
            setUser(userData);
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const { user: newUser, token } = await authService.register(userData);
            authService.setAuthData(token, newUser);
            setUser(newUser);
            toast.success('Registration successful!');
            navigate('/dashboard');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const updateUserRole = async (userId, role) => {
        try {
            const updatedUser = await authService.updateUserRole(userId, role);
            if (user?.id === userId) {
                setUser({ ...user, role: updatedUser.role });
            }
            return updatedUser;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        register,
        updateUserRole,
        isAuthenticated: authService.isAuthenticated
    };

    if (loading) {
        return <div>Loading...</div>; // You might want to replace this with a proper loading component
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
