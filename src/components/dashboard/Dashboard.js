import React, { useState, useEffect, useCallback } from 'react';
import '../../css/CustomerDashboard.css';
import {useAuth} from "../../context/AuthContext";
import apiClient from "../../api/apiClient";
import Modal from "../modal/Modal";
import {useNavigate} from "react-router-dom";

const wavingHandImageUrl = 'https://em-content.zobj.net/source/apple/354/waving-hand_1f44b.png';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeProjects, setActiveProjects] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState(null);

    const fetchCustomerProjects = useCallback(async () => {
        if (!user || !user.customer_id) {
            if (user && !user.customer_id) setError("This user is not a customer.");
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            let allProjects = [];
            let currentPage = 1;
            let hasMore = true;

            // Loop through pages to fetch all projects, accounting for pagination.
            while (hasMore) {
                const response = await apiClient.get(
                    `/api/contracts/byCustomerId/${user.customer_id}?page=${currentPage}`
                );

                const responseData = response.data.data;
                const projectsOnPage = responseData.contracts || [];
                
                if (projectsOnPage.length > 0) {
                    allProjects = allProjects.concat(projectsOnPage);
                    currentPage++;
                } else {
                    // Stop when an empty page is returned, indicating no more projects.
                    hasMore = false;
                }
            }

            setActiveProjects(allProjects.filter(p => !p.end_date));
            setCompletedProjects(allProjects.filter(p => p.end_date));

        } catch (err) {
            console.error("Failed to fetch projects:", err);
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
            const projectPayload = {
                name: newProjectName,
                customer_id: user.customer_id,
                start_date: new Date().toISOString(),
                end_date: null,
                brigade_id: null
            };
            await apiClient.post('/api/contracts', projectPayload);
            
            setNewProjectName('');
            setIsModalOpen(false);

            // Directly refetch all projects to ensure the new one is included.
            await fetchCustomerProjects();

        } catch (err) {
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

    const renderProjectList = (projects, title) => (
        <div className="projects-column">
            <h3 className="projects-column-title">{title}</h3>
            {projects.length > 0 ? (
                <div className="projects-grid">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className={`project-card${selectedProjectId === project.id ? ' selected' : ''}`}
                            onClick={() => {
                                setSelectedProjectId(project.id);
                                navigate(`/dashboard/projects/${project.id}`);
                            }}
                            tabIndex={0}
                            role="button"
                            onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setSelectedProjectId(project.id);
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
        <>
            <div className="dashboard-content redesigned">
                <div className="projects-list-container">
                    <div className="projects-header">
                        <h2 className="projects-title">МОИ ПРОЕКТЫ</h2>
                        <button className="add-project-btn" onClick={openCreateModal}>+ Согласовать проект</button>
                    </div>
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