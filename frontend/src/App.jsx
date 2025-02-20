import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDetails from './pages/UserDetails';
import Dashboard from './pages/Dashboard';
import DataEntry from './pages/DataEntry';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-details" element={<UserDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/data-entry" element={<DataEntry />} /> <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;