import axios from './axios';

export const authService = {
    login: async (username, password) => {
        const response = await axios.post('/users/login', { username, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await axios.post('/users/register', userData);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await axios.get('/users/me');
        return response.data;
    },

    updateUserRole: async (userId, role) => {
        const response = await axios.patch(`/users/${userId}/role`, { role });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    setAuthData: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    getAuthData: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return {
            token,
            user: user ? JSON.parse(user) : null
        };
    }
};
