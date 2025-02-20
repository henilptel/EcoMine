import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function UserDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    position: '',
    mineDetails: {
      mineName: '',
      location: '',
      annualProduction: '',
      mineType: 'opencast', // or underground
      operationalSince: '',
      totalArea: '',
    },
    experience: '',
    department: '',
  });

  const positions = [
    'Mine Operator',
    'Mining Engineer',
    'Environmental Officer',
    'Safety Officer',
    'Project Manager',
    'Site Supervisor',
    'Other'
  ];

  const departments = [
    'Operations',
    'Engineering',
    'Environmental Management',
    'Safety',
    'Planning',
    'Administration',
    'Other'
  ];

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
    // TODO: Implement API call to save user details
    toast.success('Profile details saved successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-900">Complete Your Profile</h3>
            <p className="mt-1 text-sm text-gray-600">
              Please provide additional details about yourself and your mine.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
            {/* Professional Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Professional Information</h4>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="">Select Position</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    min="0"
                    max="50"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Mine Details */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Mine Details</h4>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mine Name</label>
                  <input
                    type="text"
                    name="mineDetails.mineName"
                    value={formData.mineDetails.mineName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="mineDetails.location"
                    value={formData.mineDetails.location}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Annual Production (tonnes)</label>
                  <input
                    type="number"
                    name="mineDetails.annualProduction"
                    value={formData.mineDetails.annualProduction}
                    onChange={handleChange}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mine Type</label>
                  <select
                    name="mineDetails.mineType"
                    value={formData.mineDetails.mineType}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="opencast">Opencast</option>
                    <option value="underground">Underground</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Operational Since</label>
                  <input
                    type="date"
                    name="mineDetails.operationalSince"
                    value={formData.mineDetails.operationalSince}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Area (hectares)</label>
                  <input
                    type="number"
                    name="mineDetails.totalArea"
                    value={formData.mineDetails.totalArea}
                    onChange={handleChange}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save and Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}