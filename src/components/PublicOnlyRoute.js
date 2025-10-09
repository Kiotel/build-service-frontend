import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicOnlyRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');

    if (token) {
        // If user is logged in, redirect them from public pages to the dashboard
        return <Navigate to="/dashboard" replace />;
    }

    // If not logged in, show the public page (e.g., Login or Signup)
    return children;
};

// --- THIS LINE WAS MISSING ---
export default PublicOnlyRoute;