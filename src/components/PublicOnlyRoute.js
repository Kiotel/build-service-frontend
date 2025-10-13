import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Make sure path is correct
import useSafeNavigate from '../utils/useSafeNavigate';

const PublicOnlyRoute = ({children}) => {
    const {user, loading} = useAuth();
    const safeNavigate = useSafeNavigate();

    // While we are checking the user's status, it's best to show a loading indicator
    // to prevent the login/signup form from flashing on the screen for a logged-in user.
    useEffect(() => {
        if (!loading && user) {
            try {
                safeNavigate('/dashboard', { replace: true });
            } catch (_) {}
        }
    }, [loading, user, safeNavigate]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (user) {
        // Show minimal placeholder while redirecting imperatively
        return <div>Перенаправление...</div>;
    }

    // If loading is finished and there is NO user, show the public page (Login, Signup).
    return children;
}

export default PublicOnlyRoute;

