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
        // Перенаправляем, только если загрузка завершена, токена нет, и мы еще не перенаправляли
        if (!loading && !token && !redirectedRef.current) {
            redirectedRef.current = true;
            try {
                safeNavigate('/login', { replace: true, state: { from: location } });
            } catch (_) {
                // Обработка возможных ошибок навигации, если компонент размонтируется
            }
        }
    }, [loading, token, location, safeNavigate]);

    // Пока идет загрузка или если токена еще нет, показываем индикатор загрузки.
    // Это предотвращает рендеринг дочерних элементов или сообщения о перенаправлении
    // до того, как контекст аутентификации полностью обновится.
    if (loading || !token) {
        return <div>Загрузка сессии...</div>;
    }

    // Если токен есть и загрузка завершена, показываем дочерний компонент.
    return children;
};

export default ProtectedRoute;