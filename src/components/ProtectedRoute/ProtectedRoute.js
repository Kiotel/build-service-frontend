import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {useAuth} from "../../context/AuthContext";
import useSafeNavigate from '../../utils/useSafeNavigate';

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();
    const location = useLocation();
    const safeNavigate = useSafeNavigate();
    const redirectedRef = useRef(false);

    useEffect(() => {
        if (!loading && !token && !redirectedRef.current) {
            redirectedRef.current = true;
            try {
                safeNavigate('/login', { replace: true, state: { from: location } });
            } catch (_) {}
        }
    }, [loading, token, location, safeNavigate]);

    if (loading) {
        return <div>Загрузка сессии...</div>;
    }

    if (!token) {
        return <div>Перенаправление на страницу входа...</div>;
    }

    return children;
};

export default ProtectedRoute;



