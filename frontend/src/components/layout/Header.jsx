import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and main nav */}
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/dashboard" className="text-2xl font-bold text-green-600">
                                Carbon
                                <span className="text-gray-600">Track</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right side nav */}
                    <div className="flex items-center">
                        {/* User dropdown */}
                        <div className="ml-3 relative">
                            <div>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="text-green-700 font-medium">
                                            {user?.username?.[0]?.toUpperCase()}
                                        </span>
                                    </div>
                                </button>
                            </div>

                            {/* Dropdown menu */}
                            {isUserMenuOpen && (
                                <div
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                                    role="menu"
                                >
                                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                        <div>Signed in as</div>
                                        <div className="font-medium truncate">{user?.username}</div>
                                        <div className="text-xs text-gray-500">{user?.role}</div>
                                    </div>

                                    <Link
                                        to="/user-details"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        Profile Settings
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
