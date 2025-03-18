import React, { useState, useEffect } from 'react';
import { mineService } from '../services/mine';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MineForm = ({ onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        location: initialData?.location || '',
        area_size: initialData?.area_size || '',
        operational_status: initialData?.operational_status || 'active'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Mine Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Area Size (hectares)</label>
                <input
                    type="number"
                    name="area_size"
                    value={formData.area_size}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Operational Status</label>
                <select
                    name="operational_status"
                    value={formData.operational_status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Under Maintenance</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                {initialData ? 'Update Mine' : 'Create Mine'}
            </button>
        </form>
    );
};

export const MineManagement = () => {
    const [mines, setMines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMine, setEditingMine] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();

    const canManageMines = user?.role === 'admin' || user?.role === 'environmental_officer';

    const loadMines = async () => {
        try {
            const data = await mineService.getMines();
            setMines(data);
        } catch (error) {
            toast.error('Failed to load mines');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMines();
    }, []);

    const handleCreateMine = async (formData) => {
        try {
            await mineService.createMine(formData);
            toast.success('Mine created successfully');
            setShowForm(false);
            loadMines();
        } catch (error) {
            toast.error('Failed to create mine');
        }
    };

    const handleUpdateMine = async (formData) => {
        try {
            await mineService.updateMine(editingMine.id, formData);
            toast.success('Mine updated successfully');
            setEditingMine(null);
            loadMines();
        } catch (error) {
            toast.error('Failed to update mine');
        }
    };

    const handleDeleteMine = async (id) => {
        if (!window.confirm('Are you sure you want to delete this mine?')) {
            return;
        }

        try {
            await mineService.deleteMine(id);
            toast.success('Mine deleted successfully');
            loadMines();
        } catch (error) {
            toast.error('Failed to delete mine');
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Mine Management</h1>
                {canManageMines && !showForm && !editingMine && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Add New Mine
                    </button>
                )}
            </div>

            {(showForm || editingMine) && canManageMines && (
                <div className="mb-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {editingMine ? 'Edit Mine' : 'New Mine'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingMine(null);
                                }}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                ✕
                            </button>
                        </div>
                        <MineForm
                            onSubmit={editingMine ? handleUpdateMine : handleCreateMine}
                            initialData={editingMine}
                        />
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded my-6">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Location</th>
                            <th className="py-3 px-6 text-center">Area Size</th>
                            <th className="py-3 px-6 text-center">Status</th>
                            {canManageMines && <th className="py-3 px-6 text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {mines.map((mine) => (
                            <tr key={mine.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left">{mine.name}</td>
                                <td className="py-3 px-6 text-left">{mine.location}</td>
                                <td className="py-3 px-6 text-center">{mine.area_size} ha</td>
                                <td className="py-3 px-6 text-center">
                                    <span className={`
                                        py-1 px-3 rounded-full text-xs
                                        ${mine.operational_status === 'active' ? 'bg-green-200 text-green-600' :
                                        mine.operational_status === 'inactive' ? 'bg-red-200 text-red-600' :
                                        mine.operational_status === 'maintenance' ? 'bg-yellow-200 text-yellow-600' :
                                        'bg-gray-200 text-gray-600'}
                                    `}>
                                        {mine.operational_status}
                                    </span>
                                </td>
                                {canManageMines && (
                                    <td className="py-3 px-6 text-center">
                                        <div className="flex item-center justify-center">
                                            <button
                                                onClick={() => setEditingMine(mine)}
                                                className="text-blue-600 hover:text-blue-800 mx-2"
                                            >
                                                Edit
                                            </button>
                                            {user.role === 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteMine(mine.id)}
                                                    className="text-red-600 hover:text-red-800 mx-2"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
