import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import { FaHeart } from 'react-icons/fa';
import '../css/DashboardLayout.css'; // Убедитесь, что путь верный
import { useAuth } from '../context/AuthContext'; // Убедитесь, что путь верный

const DashboardLayout = () => {
    // Получаем пользователя и функцию logout из нашего контекста
    const { user, logout } = useAuth();
    // Получаем функцию для навигации
    const navigate = useNavigate();

    // --- НОВЫЙ ОБРАБОТЧИК ДЛЯ ВЫХОДА ---
    const handleLogout = () => {
        // 1. Вызываем функцию logout из контекста
        logout();
        // 2. Перенаправляем пользователя на страницу входа
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            <div className="top-bar">
                {/* Отображаем имя пользователя */}
                <span>{user ? user.name : 'Загрузка...'}</span>

                {/* --- НОВАЯ КНОПКА ВЫХОДА --- */}
                <button onClick={handleLogout} className="logout-button">
                    Выйти
                </button>
            </div>

            <header className="dashboard-header">
                <div className="header-left">
                    <div className="header-logo">
                        <Link to="/dashboard">BuildService</Link>
                    </div>
                    <nav className="header-nav">
                        <Link to="/dashboard">ГЛАВНАЯ</Link>
                        <Link to="/dashboard/my-projects" className="active">МОИ ПРОЕКТЫ</Link>
                        <Link to="/dashboard/messages">СООБЩЕНИЯ</Link>
                        <Link to="/dashboard/about">О НАС</Link>
                    </nav>
                </div>
                <div className="header-right">
                    <button className="wishlist-button"><FaHeart /></button>
                    <button className="btn btn-primary">Разместить объявление</button>
                </div>
            </header>

            <main className="dashboard-page-content">
                {/* Здесь будут рендериться вложенные страницы, такие как CustomerDashboard */}
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;