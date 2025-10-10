import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirect = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            return;
        }

        if (user) {
            if (user.customer_id) {
                navigate('/customer-dashboard', { replace: true });
            } else if (user.brigade_id) {
                navigate('/brigade-dashboard', { replace: true });
            } else {
                console.error("User is logged in but has no role.");
                navigate('/login', { replace: true });
            }
        }
        // No 'else' needed because ProtectedRoute handles non-logged-in users.
    }, [user, loading, navigate]);

    return <div>Проверка вашего профиля, пожалуйста, подождите...</div>;
};

export default DashboardRedirect;