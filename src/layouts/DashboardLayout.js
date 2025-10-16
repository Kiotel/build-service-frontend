import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../css/DashboardLayout.css';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Определяем правильный URL для дашборда в зависимости от роли пользователя
    const dashboardUrl = user
        ? (user.customer_id ? '/customer-dashboard' : '/brigade-dashboard')
        : '/'; // Запасной вариант, если пользователь еще не загружен

    return (
        <div className="dashboard-layout">
            <div className="top-bar">
                <span>{user ? user.name : 'Загрузка...'}</span>
                <button onClick={handleLogout} className="logout-button">
                    Выйти
                </button>
            </div>

            <header className="dashboard-header">
                <div className="header-left">
                    <div className="header-logo">
                        {/* Используем динамическую ссылку */}
                        <Link to={dashboardUrl}>BuildService</Link>
                    </div>
                    <nav className="header-nav">
                        {/* Используем динамическую ссылку */}
                        <Link to={dashboardUrl} className="active">ГЛАВНАЯ</Link>
                    </nav>
                </div>
            </header>

            <main className="dashboard-page-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;