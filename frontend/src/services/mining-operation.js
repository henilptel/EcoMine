import axios from './axios';

export const miningOperationService = {
    createOperation: async (operationData) => {
        const response = await axios.post('/mining-operations', operationData);
        return response.data;
    },

    getMineOperations: async (mineId) => {
        const response = await axios.get(`/mining-operations/mine/${mineId}`);
        return response.data;
    },

    getOperation: async (id) => {
        const response = await axios.get(`/mining-operations/${id}`);
        return response.data;
    },

    updateOperation: async (id, operationData) => {
        const response = await axios.put(`/mining-operations/${id}`, operationData);
        return response.data;
    },

    deleteOperation: async (id) => {
        const response = await axios.delete(`/mining-operations/${id}`);
        return response.data;
    }
};
