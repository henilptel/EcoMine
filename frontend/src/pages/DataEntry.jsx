import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DataEntry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to save mining data
    toast.success('Mining data saved successfully!');
    navigate('/dashboard');
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

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}