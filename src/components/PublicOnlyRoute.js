import React from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext'; // Make sure path is correct

const PublicOnlyRoute = ({children}) => {
    const {user, loading} = useAuth();
// While we are checking the user's status, it's best to show a loading indicator
// to prevent the login/signup form from flashing on the screen for a logged-in user.
    if (loading) {
        return <div>Загрузка...</div>;
    }

// --- THIS IS THE KEY LOGIC ---
// If loading is finished AND we have a user, it means they are logged in.
// We should immediately redirect them to the main dashboard entry point.
    if (user) {
        // The /dashboard route will then handle redirecting them to the correct role-specific dashboard.
        return <Navigate to="/dashboard" replace/>;
    }

// If loading is finished and there is NO user, show the public page (Login, Signup).
    return children;
}

export default PublicOnlyRoute;

