import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../../css/CustomerDashboard.css'; // Убедитесь, что путь верный
import apiClient from '../../api/apiClient'; // Убедитесь, что путь верный
import { useAuth } from '../../context/AuthContext'; // Убедитесь, что путь верный
import Modal from '../modal/Modal'; // Убедитесь, что путь верный

const wavingHandImageUrl = 'https://em-content.zobj.net/source/apple/354/waving-hand_1f44b.png';

const CustomerDashboard = () => {
    const { user } = useAuth();

    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState(null);

    const fetchCustomerProjects = useCallback(async () => {
        if (!user || !user.customer_id) {
            if (user && !user.customer_id) setError("Этот пользователь не является заказчиком.");
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const response = await apiClient.get(`/api/contracts/byCustomerId/${user.customer_id}`);
            setProjects(response.data.data.contracts || []);
        } catch (err) {
            setError("Не удалось загрузить проекты.");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchCustomerProjects();
        }
    }, [user, fetchCustomerProjects]);

    const handleCreateProjectSubmit = async (e) => {
        e.preventDefault();
        if (!newProjectName.trim()) {
            setCreateError("Название проекта не может быть пустым.");
            return;
        }

        setIsCreating(true);
        setCreateError(null);
        try {
            // --- ГЛАВНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ ---
            // Создаем объект payload, который ЯВНО включает ВСЕ поля из DTO.
            const projectPayload = {
                name: newProjectName,
                start_date: new Date().toISOString(), // Обязательное поле
                end_date: null, // Явно указываем null
                brigade_id: null  // Явно указываем null
            };

            // Отправляем полный объект на сервер
            await apiClient.post('/api/contracts', projectPayload);

            setNewProjectName('');
            setIsModalOpen(false);
            await fetchCustomerProjects(); // Обновляем список проектов
        } catch (err) {
            console.error("Failed to create project:", err);
            setCreateError("Не удалось создать проект. Попробуйте снова.");
        } finally {
            setIsCreating(false);
        }
    };

    const openCreateModal = () => {
        setNewProjectName('');
        setCreateError(null);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="dashboard-content">
                <aside className="projects-sidebar">
                    <div className="sidebar-actions">
                        <Link to="/dashboard">НА ГЛАВНУЮ</Link>
                        <Link to="/projects/new">СОГЛАСОВАТЬ ПРОЕКТ</Link>
                    </div>
                    <div className="projects-list-container">
                        <h2>МОИ ПРОЕКТЫ:</h2>
                        {isLoading && <p>Загрузка проектов...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {!isLoading && !error && (
                            <ul className="projects-list">
                                {projects.length > 0 ? (
                                    projects.map((project) => (
                                        <li key={project.id}>
                                            <button
                                                className={`project-item ${selectedProjectId === project.id ? 'selected' : ''}`}
                                                onClick={() => setSelectedProjectId(project.id)}
                                            >
                                                {project.name}
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <p>У вас еще нет проектов.</p>
                                )}
                            </ul>
                        )}
                        <button
                            className="btn btn-secondary btn-full-width"
                            onClick={openCreateModal}
                        >
                            + Согласовать проект
                        </button>
                    </div>
                </aside>
                <section className="actions-panel">
                    <button
                        className="btn btn-large btn-create-project"
                        onClick={openCreateModal}
                    >
                        + СОЗДАТЬ НОВЫЙ ПРОЕКТ
                    </button>
                    <div className="tutorial-hint">
                        <div className="tutorial-step"><span className="checkmark">✔</span><button disabled className="btn btn-secondary">+ ДОБАВИТЬ НАЗВАНИЕ</button></div>
                        <div className="arrow-down">↓</div>
                        <div className="tutorial-step"><button disabled className="btn btn-secondary">ПЕРЕЙТИ В ПРОЕКТ</button></div>
                    </div>
                    <img src={wavingHandImageUrl} alt="Waving Hand" className="waving-hand" />
                </section>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 style={{ marginBottom: '20px' }}>Создать новый проект</h2>
                <form onSubmit={handleCreateProjectSubmit}>
                    <div className="form-group">
                        <label htmlFor="projectName" style={{ display: 'block', marginBottom: '8px' }}>Название проекта</label>
                        <input
                            type="text"
                            id="projectName"
                            className="form-input"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="например, 'Дом на Лесной улице'"
                            autoFocus
                        />
                    </div>
                    {createError && <p style={{ color: 'red', marginTop: '10px' }}>{createError}</p>}
                    <button type="submit" className="btn btn-primary" disabled={isCreating} style={{ marginTop: '20px', width: '100%' }}>
                        {isCreating ? 'Создание...' : 'Создать проект'}
                    </button>
                </form>
            </Modal>
        </>
    );
};

export default CustomerDashboard;