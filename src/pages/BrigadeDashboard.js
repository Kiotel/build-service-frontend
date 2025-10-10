import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import '../css/CustomerDashboard.css'; // Мы можем переиспользовать стили для единообразия

const BrigadeDashboard = () => {
    const { user } = useAuth(); // Получаем залогиненного пользователя (бригаду)

    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBrigadeProjects = useCallback(async () => {
        // Убеждаемся, что у пользователя есть ID бригады
        if (!user || !user.brigade_id) {
            if (user) setError("Ваш профиль не является профилем бригады.");
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            // Используем эндпоинт для получения контрактов по ID бригады
            const response = await apiClient.get(`/api/contracts/byBrigadeId/${user.brigade_id}`);
            setProjects(response.data.data.contracts || []);
        } catch (err) {
            setError("Не удалось загрузить назначенные проекты.");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchBrigadeProjects();
        }
    }, [user, fetchBrigadeProjects]);

    return (
        <div className="dashboard-content">
            {/* Левая панель с проектами */}
            <aside className="projects-sidebar" style={{ flex: '0 0 400px' }}>
                <div className="projects-list-container">
                    <h2>НАЗНАЧЕННЫЕ ПРОЕКТЫ:</h2>
                    {isLoading && <p>Загрузка проектов...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {!isLoading && !error && (
                        <ul className="projects-list">
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <li key={project.id}>
                                        <Link
                                            to={`/dashboard/projects/${project.id}`}
                                            className="project-item"
                                        >
                                            {project.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <p>На вас еще не назначено ни одного проекта.</p>
                            )}
                        </ul>
                    )}
                </div>
            </aside>

            {/* Правая панель с информацией */}
            <section className="actions-panel">
                <h1>Панель управления Бригады</h1>
                <p>Здесь вы можете видеть все проекты, в которых вы участвуете. Нажмите на проект слева, чтобы просмотреть его детали.</p>
                {/* Здесь можно добавить другую релевантную для бригады информацию */}
            </section>
        </div>
    );
};

export default BrigadeDashboard;