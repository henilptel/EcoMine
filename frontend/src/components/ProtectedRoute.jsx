import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, roles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated()) {
        // Not logged in, redirect to login page with return url
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user?.role)) {
        // Role not authorized, redirect to home page
        return <Navigate to="/unauthorized" replace />;
    }

    // Authorized, render component
    return children;
};

// Component for displaying unauthorized access message
export const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Unauthorized Access
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    You do not have permission to access this page.
                </p>
            </div>
        </div>
    );
};
