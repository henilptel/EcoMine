import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mineService, emissionService } from '../services/mine';
import { miningOperationService } from '../services/mining-operation';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Constants for emission calculations
const COAL_DENSITY_FACTOR = 1.5; // tons per cubic meter
const METHANE_EMISSION_FACTOR = 0.02; // cubic meters per ton of material
const WASTE_EMISSION_FACTOR = 0.05; // tons CO2e per ton of waste

export default function DataEntry() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mines, setMines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [calculatedEmissions, setCalculatedEmissions] = useState(null);
  
  const [formData, setFormData] = useState({
    mine_id: '',
    date: '',
    excavationData: {
      materialVolume: '',
      equipmentHours: '',
      fuelConsumption: '',
    },
    transportationData: {
      distance: '',
      vehicleTypes: '',
      fuelConsumption: '',
    },
    equipmentData: {
      type: '',
      operatingHours: '',
      energyConsumption: '',
    },
    energyConsumption: {
      electricity: '',
      diesel: '',
      other: '',
    },
    wasteManagement: {
      overburden: '',
      wasteRock: '',
      treatment: '',
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  useEffect(() => {
    loadMines();
  }, []);

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

  const calculateEmissionsFromOperations = async (data) => {
    const emissionData = {
      coal_output: data.excavationData.materialVolume * COAL_DENSITY_FACTOR,
      electricity_usage: parseFloat(data.equipmentData.energyConsumption) + 
                        parseFloat(data.energyConsumption.electricity),
      fuel_consumption: parseFloat(data.excavationData.fuelConsumption) + 
                       parseFloat(data.transportationData.fuelConsumption) + 
                       parseFloat(data.energyConsumption.diesel) + 
                       parseFloat(data.energyConsumption.other),
      methane_leaks: data.excavationData.materialVolume * METHANE_EMISSION_FACTOR,
      stockpile_emissions: parseFloat(data.wasteManagement.wasteRock) * WASTE_EMISSION_FACTOR
    };

    return await emissionService.calculateEmissions(emissionData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.mine_id) {
      toast.error('Please select a mine');
      return;
    }

    setCalculating(true);
    try {
      // First calculate emissions
      const { total_emissions } = await calculateEmissionsFromOperations(formData);
      
      // Save the emission record
      await emissionService.createEmission({
        mine_id: formData.mine_id,
        date: formData.date,
        coal_output: formData.excavationData.materialVolume * COAL_DENSITY_FACTOR,
        electricity_usage: parseFloat(formData.equipmentData.energyConsumption) + 
                         parseFloat(formData.energyConsumption.electricity),
        fuel_consumption: parseFloat(formData.excavationData.fuelConsumption) + 
                        parseFloat(formData.transportationData.fuelConsumption) + 
                        parseFloat(formData.energyConsumption.diesel) + 
                        parseFloat(formData.energyConsumption.other),
        methane_leaks: formData.excavationData.materialVolume * METHANE_EMISSION_FACTOR,
        stockpile_emissions: parseFloat(formData.wasteManagement.wasteRock) * WASTE_EMISSION_FACTOR
      });

      // Save detailed mining operation data
      await miningOperationService.createOperation({
        mine_id: formData.mine_id,
        date: formData.date,
        excavationData: formData.excavationData,
        transportationData: formData.transportationData,
        equipmentData: formData.equipmentData,
        energyConsumption: formData.energyConsumption,
        wasteManagement: formData.wasteManagement
      });

      toast.success('Mining data and emissions saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save data');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-900">Mining Operation Data Entry</h3>
            <p className="mt-1 text-sm text-gray-600">
              Please provide detailed information about your mining operations for carbon emission calculation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Mine</label>
              <select
                name="mine_id"
                value={formData.mine_id}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Select a mine...</option>
                {mines.map(mine => (
                  <option key={mine.id} value={mine.id}>
                    {mine.name} - {mine.location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Operation</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Excavation Data */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Excavation Data</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Material Volume (m³)</label>
                  <input
                    type="number"
                    name="excavationData.materialVolume"
                    value={formData.excavationData.materialVolume}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Equipment Hours</label>
                  <input
                    type="number"
                    name="excavationData.equipmentHours"
                    value={formData.excavationData.equipmentHours}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fuel Consumption (L)</label>
                  <input
                    type="number"
                    name="excavationData.fuelConsumption"
                    value={formData.excavationData.fuelConsumption}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Transportation Data */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Transportation Data</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Distance Covered (km)</label>
                  <input
                    type="number"
                    name="transportationData.distance"
                    value={formData.transportationData.distance}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle Types</label>
                  <input
                    type="text"
                    name="transportationData.vehicleTypes"
                    value={formData.transportationData.vehicleTypes}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Dump trucks, Loaders"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fuel Consumption (L)</label>
                  <input
                    type="number"
                    name="transportationData.fuelConsumption"
                    value={formData.transportationData.fuelConsumption}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Equipment Usage */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Equipment Usage</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Equipment Type</label>
                  <input
                    type="text"
                    name="equipmentData.type"
                    value={formData.equipmentData.type}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Excavators, Drills"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Operating Hours</label>
                  <input
                    type="number"
                    name="equipmentData.operatingHours"
                    value={formData.equipmentData.operatingHours}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Energy Consumption (kWh)</label>
                  <input
                    type="number"
                    name="equipmentData.energyConsumption"
                    value={formData.equipmentData.energyConsumption}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Energy Consumption */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Energy Consumption</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Electricity (kWh)</label>
                  <input
                    type="number"
                    name="energyConsumption.electricity"
                    value={formData.energyConsumption.electricity}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diesel (L)</label>
                  <input
                    type="number"
                    name="energyConsumption.diesel"
                    value={formData.energyConsumption.diesel}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Other Fuels (L)</label>
                  <input
                    type="number"
                    name="energyConsumption.other"
                    value={formData.energyConsumption.other}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Waste Management */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Waste Management</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Overburden Volume (m³)</label>
                  <input
                    type="number"
                    name="wasteManagement.overburden"
                    value={formData.wasteManagement.overburden}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Waste Rock (tonnes)</label>
                  <input
                    type="number"
                    name="wasteManagement.wasteRock"
                    value={formData.wasteManagement.wasteRock}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Treatment Method</label>
                  <input
                    type="text"
                    name="wasteManagement.treatment"
                    value={formData.wasteManagement.treatment}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Backfilling, Disposal"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Display calculated emissions if available */}
            {calculatedEmissions && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h4 className="text-lg font-medium text-green-800 mb-2">
                  Calculated Emissions
                </h4>
                <p className="text-green-700">
                  Total CO2 Emissions: {calculatedEmissions.total_emissions.toFixed(2)} tons CO2e
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
                    navigate('/dashboard');
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setCalculating(true);
                  try {
                    const result = await calculateEmissionsFromOperations(formData);
                    setCalculatedEmissions(result);
                    toast.success('Emissions calculated successfully');
                  } catch (error) {
                    toast.error('Failed to calculate emissions');
                  } finally {
                    setCalculating(false);
                  }
                }}
                disabled={calculating}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {calculating ? 'Calculating...' : 'Calculate Emissions'}
              </button>
              <button
                type="submit"
                disabled={calculating}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {calculating ? 'Saving...' : 'Save Data'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
