import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if the auth token exists in localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
        // If no token, redirect to the login page
        // 'replace' prevents the user from going "back" to the protected page
        return <Navigate to="/login" replace />;
    }

    // If token exists, render the child component (e.g., dashboard)
    return children;
};

export default ProtectedRoute;