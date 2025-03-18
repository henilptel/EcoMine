import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MineManagement } from '../components/MineManagement';
import { EmissionEntry } from '../components/EmissionEntry';
import { emissionService } from '../services/mine';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await emissionService.getEmissionStats();
            setStats(data);
        } catch (error) {
            toast.error('Failed to load emission statistics');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', roles: ['admin', 'analyst', 'environmental_officer', 'user'] },
        { id: 'mines', label: 'Mine Management', roles: ['admin', 'environmental_officer'] },
        { id: 'emissions', label: 'Record Emissions', roles: ['analyst', 'environmental_officer'] }
    ];

    const visibleTabs = tabs.filter(tab => tab.roles.includes(user.role));

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Carbon Neutrality Dashboard
                        </h1>
                        <div className="text-sm text-gray-600">
                            Welcome, {user.username} ({user.role})
                        </div>
                    </div>
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {visibleTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        py-4 px-1 border-b-2 font-medium text-sm
                                        ${activeTab === tab.id
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                    `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Total Records
                            </h3>
                            <p className="text-3xl font-bold text-green-600">
                                {loading ? '...' : stats?.total_records || 0}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Total Emissions
                            </h3>
                            <p className="text-3xl font-bold text-green-600">
                                {loading ? '...' : `${(stats?.total_emissions || 0).toFixed(2)} tCO2e`}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Average Emissions
                            </h3>
                            <p className="text-3xl font-bold text-green-600">
                                {loading ? '...' : `${(stats?.average_emissions || 0).toFixed(2)} tCO2e`}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Peak Emissions
                            </h3>
                            <p className="text-3xl font-bold text-green-600">
                                {loading ? '...' : `${(stats?.max_emissions || 0).toFixed(2)} tCO2e`}
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'mines' && <MineManagement />}
                {activeTab === 'emissions' && <EmissionEntry />}
            </div>
        </div>
    );
}
