import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, UnauthorizedPage } from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDetails from './pages/UserDetails';
import Dashboard from './pages/Dashboard';
import DataEntry from './pages/DataEntry';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/data-entry" element={
            <ProtectedRoute roles={['analyst', 'environmental_officer']}>
              <DataEntry />
            </ProtectedRoute>
          } />
          
          <Route path="/user-details" element={
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          } />

          {/* Redirect root to dashboard if authenticated, otherwise to login */}
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
