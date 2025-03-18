import axios from './axios';

export const mineService = {
    createMine: async (mineData) => {
        const response = await axios.post('/mines', mineData);
        return response.data;
    },

    getMines: async () => {
        const response = await axios.get('/mines');
        return response.data;
    },

    getMine: async (id) => {
        const response = await axios.get(`/mines/${id}`);
        return response.data;
    },

    updateMine: async (id, mineData) => {
        const response = await axios.put(`/mines/${id}`, mineData);
        return response.data;
    },

    deleteMine: async (id) => {
        const response = await axios.delete(`/mines/${id}`);
        return response.data;
    }
};

export const emissionService = {
    createEmission: async (emissionData) => {
        const response = await axios.post('/emissions', emissionData);
        return response.data;
    },

    getMineEmissions: async (mineId) => {
        const response = await axios.get(`/emissions/mine/${mineId}`);
        return response.data;
    },

    getEmissionStats: async (mineId = null) => {
        const url = mineId ? `/emissions/stats?mine_id=${mineId}` : '/emissions/stats';
        const response = await axios.get(url);
        return response.data;
    },

    calculateEmissions: async (data) => {
        const response = await axios.post('/emissions/calculate', data);
        return response.data;
    },

    updateEmission: async (id, emissionData) => {
        const response = await axios.put(`/emissions/${id}`, emissionData);
        return response.data;
    },

    deleteEmission: async (id) => {
        const response = await axios.delete(`/emissions/${id}`);
        return response.data;
    }
};
