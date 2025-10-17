import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import '../css/CustomerDashboard.css'; // Мы можем переиспользовать стили для единообразия

const BrigadeDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeProjects, setActiveProjects] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBrigadeProjects = useCallback(async () => {
        if (!user || !user.brigade_id) {
            if (user) setError("Ваш профиль не является профилем подрядчика.");
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const response = await apiClient.get(`/api/contracts/byBrigadeId/${user.brigade_id}`);
            const allProjects = response.data.data.contracts || [];
            setActiveProjects(allProjects.filter(p => !p.end_date));
            setCompletedProjects(allProjects.filter(p => p.end_date));
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

    const renderProjectList = (projects, title) => (
        <div className="projects-column">
            <h3 className="projects-column-title">{title}</h3>
            {projects.length > 0 ? (
                <div className="projects-grid">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="project-card"
                            onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                            tabIndex={0}
                            role="button"
                            onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    navigate(`/dashboard/projects/${project.id}`);
                                }
                            }}
                        >
                            <span className="project-card-title">{project.name}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Нет проектов для отображения.</p>
            )}
        </div>
    );

    return (
        <div className="dashboard-content redesigned">
            <div className="projects-list-container">
                <h2 className="projects-title">НАЗНАЧЕННЫЕ ПРОЕКТЫ</h2>
                {isLoading && <p>Загрузка проектов...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!isLoading && !error && (
                    <div className="projects-columns-container">
                        {renderProjectList(activeProjects, "АКТИВНЫЕ ПРОЕКТЫ")}
                        {renderProjectList(completedProjects, "ЗАВЕРШЕННЫЕ ПРОЕКТЫ")}
                    </div>
                )}
            </div>
            <section className="actions-panel">
                <h1 className="brigade-panel-title">Панель управления подрядчика</h1>
                <p className="brigade-panel-desc">Здесь вы можете видеть все проекты, в которых вы участвуете. Нажмите на проект слева, чтобы просмотреть его детали.</p>
            </section>
        </div>
    );
};

export default BrigadeDashboard;