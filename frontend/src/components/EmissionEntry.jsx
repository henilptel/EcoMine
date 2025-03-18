import React, { useState, useEffect } from 'react';
import { mineService, emissionService } from '../services/mine';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const EmissionEntry = () => {
    const [mines, setMines] = useState([]);
    const [selectedMine, setSelectedMine] = useState('');
    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);
    const { user } = useAuth();
    
    const [formData, setFormData] = useState({
        coal_output: '',
        electricity_usage: '',
        fuel_consumption: '',
        methane_leaks: '0',
        stockpile_emissions: '0',
        date: new Date().toISOString().split('T')[0]
    });

    const [calculatedEmissions, setCalculatedEmissions] = useState(null);

    useEffect(() => {
        loadMines();
    }, []);

    const loadMines = async () => {
        try {
            const data = await mineService.getMines();
            setMines(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load mines');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear calculated emissions when form changes
        setCalculatedEmissions(null);
    };

    const handleMineSelect = (e) => {
        setSelectedMine(e.target.value);
        setCalculatedEmissions(null);
    };

    const calculateEmissions = async () => {
        setCalculating(true);
        try {
            const { total_emissions } = await emissionService.calculateEmissions({
                coal_output: parseFloat(formData.coal_output),
                electricity_usage: parseFloat(formData.electricity_usage),
                fuel_consumption: parseFloat(formData.fuel_consumption),
                methane_leaks: parseFloat(formData.methane_leaks),
                stockpile_emissions: parseFloat(formData.stockpile_emissions)
            });
            setCalculatedEmissions(total_emissions);
            toast.success('Emissions calculated successfully');
        } catch (error) {
            toast.error('Failed to calculate emissions');
        } finally {
            setCalculating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMine) {
            toast.error('Please select a mine');
            return;
        }

        try {
            await emissionService.createEmission({
                mine_id: selectedMine,
                ...formData,
                coal_output: parseFloat(formData.coal_output),
                electricity_usage: parseFloat(formData.electricity_usage),
                fuel_consumption: parseFloat(formData.fuel_consumption),
                methane_leaks: parseFloat(formData.methane_leaks),
                stockpile_emissions: parseFloat(formData.stockpile_emissions)
            });
            toast.success('Emission record created successfully');
            
            // Reset form
            setFormData({
                coal_output: '',
                electricity_usage: '',
                fuel_consumption: '',
                methane_leaks: '0',
                stockpile_emissions: '0',
                date: new Date().toISOString().split('T')[0]
            });
            setCalculatedEmissions(null);
        } catch (error) {
            toast.error('Failed to save emission record');
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Record Emissions</h1>

                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Select Mine
                        </label>
                        <select
                            value={selectedMine}
                            onChange={handleMineSelect}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Select a mine...</option>
                            {mines.map(mine => (
                                <option key={mine.id} value={mine.id}>
                                    {mine.name} - {mine.location}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Coal Output (tons)
                        </label>
                        <input
                            type="number"
                            name="coal_output"
                            value={formData.coal_output}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Electricity Usage (kWh)
                        </label>
                        <input
                            type="number"
                            name="electricity_usage"
                            value={formData.electricity_usage}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Fuel Consumption (liters)
                        </label>
                        <input
                            type="number"
                            name="fuel_consumption"
                            value={formData.fuel_consumption}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Methane Leaks (cubic meters)
                        </label>
                        <input
                            type="number"
                            name="methane_leaks"
                            value={formData.methane_leaks}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Stockpile Emissions (tons CO2e)
                        </label>
                        <input
                            type="number"
                            name="stockpile_emissions"
                            value={formData.stockpile_emissions}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {calculatedEmissions !== null && (
                        <div className="mb-6 p-4 bg-green-50 rounded">
                            <h3 className="text-lg font-semibold text-green-800">
                                Calculated Total Emissions
                            </h3>
                            <p className="text-green-700">
                                {calculatedEmissions.toFixed(2)} tons CO2e
                            </p>
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={calculateEmissions}
                            disabled={calculating}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
                        >
                            {calculating ? 'Calculating...' : 'Calculate Emissions'}
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
                        >
                            Save Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
