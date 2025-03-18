import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const MainLayout = ({ children }) => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            
            <div className="flex">
                <Sidebar />
                
                <main className="flex-1 p-8">
                    {/* Breadcrumbs container */}
                    <div className="mb-4">
                        {/* Breadcrumbs will be added here */}
                    </div>

                    {/* Main content */}
                    <div className="bg-white rounded-lg shadow p-6">
                        {children}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};
