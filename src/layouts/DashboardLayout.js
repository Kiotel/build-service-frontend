import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

// This path is correct for your structure. Ensure the file exists.
import '../css/DashboardLayout.css';
import { useAuth } from '../context/AuthContext'; // Correct path from /layouts to /context

const DashboardLayout = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-layout">
            <div className="top-bar">
                <span>{user ? user.name : 'Загрузка...'}</span>
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
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;