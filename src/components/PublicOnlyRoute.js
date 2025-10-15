import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Make sure path is correct
import useSafeNavigate from '../utils/useSafeNavigate';

const PublicOnlyRoute = ({children}) => {
    const {user, loading} = useAuth();
    const safeNavigate = useSafeNavigate();

    useEffect(() => {
        if (!loading && user) {
            try {
                // Определяем правильный дашборд на основе роли пользователя
                let targetDashboard = '/'; // Запасной вариант - главная страница
                if (user.customer_id) {
                    targetDashboard = '/customer-dashboard';
                } else if (user.brigade_id || user.brigade) { // Проверяем оба возможных поля
                    targetDashboard = '/brigade-dashboard';
                }
                
                safeNavigate(targetDashboard, { replace: true });

            } catch (_) {
                // В случае ошибки навигации ничего не делаем, чтобы избежать сбоев
            }
        }
    }, [loading, user, safeNavigate]);

    // Пока идет проверка статуса аутентификации, показываем индикатор загрузки.
    if (loading) {
        return <div>Загрузка...</div>;
    }

    // Если пользователь вошел в систему, он будет перенаправлен. Показываем заглушку.
    if (user) {
        return <div>Перенаправление...</div>;
    }

    // Если загрузка завершена и пользователя нет, показываем дочерний компонент (страницу входа или регистрации).
    return children;
}

export default PublicOnlyRoute;