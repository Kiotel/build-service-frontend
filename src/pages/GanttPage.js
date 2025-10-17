import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import apiClient from '../api/apiClient';
import '../css/GanttPage.css';
import { useAuth } from '../context/AuthContext'; // Импортируем useAuth

const GanttPage = () => {
    const { contractId } = useParams();
    const { user } = useAuth(); // Получаем пользователя из контекста
    const ganttContainerRef = useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Определяем роль пользователя
    const isCustomer = user && !!user.customer_id;

    const markAsChanged = useCallback(() => {
        if (isCustomer) return; // Заказчики не могут отмечать изменения
        if (!hasUnsavedChanges) {
            setHasUnsavedChanges(true);
        }
    }, [hasUnsavedChanges, isCustomer]);

    const handleSave = useCallback(async () => {
        if (isCustomer) return; // Заказчики не могут сохранять
        setIsSaving(true);
        setError(null);
        try {
            const currentGanttState = gantt.serialize();
            const stringPayload = JSON.stringify(currentGanttState);

            await apiClient.put(`/api/contracts/gantt/${contractId}`, { data: stringPayload });
            setHasUnsavedChanges(false);
        } catch (err) {
            console.error("Gantt: Failed to save data:", err);
            setError("Ошибка при сохранении. Проверьте данные и попробуйте снова.");
        } finally {
            setIsSaving(false);
        }
    }, [contractId, isCustomer, setHasUnsavedChanges, setIsSaving, setError]);

    useEffect(() => {
        if (!ganttContainerRef.current) return;

        // --- Настройка в зависимости от роли ---
        gantt.config.readonly = isCustomer;
        gantt.config.drag_move = !isCustomer;
        gantt.config.drag_progress = !isCustomer;
        gantt.config.drag_resize = !isCustomer;
        gantt.config.drag_links = !isCustomer;
        gantt.config.details_on_dblclick = !isCustomer;
        // ---

        gantt.config.date_format = "%Y-%m-%d %H:%i";
        gantt.config.root_id = "root";
        gantt.plugins({ auto_scheduling: true });
        gantt.config.auto_scheduling = true;

        const columns = [
            { name: 'text', label: 'Задача', width: '*', tree: true },
            { name: 'start_date', label: 'Начало', align: 'center', width: 90 },
            { name: 'duration', label: 'Длительность', align: 'center', width: 80 },
        ];

        if (!isCustomer) {
            columns.push({ name: 'add', label: '', width: 44 });
        }
        gantt.config.columns = columns;

        gantt.config.lightbox.sections = [
            { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
            { name: "time", type: "duration", map_to: "auto" }
        ];
        gantt.locale.labels.section_description = "Название задачи";
        gantt.locale.labels.section_time = "Период";

        const eventIds = [
            gantt.attachEvent('onAfterTaskAdd', markAsChanged),
            gantt.attachEvent('onAfterTaskUpdate', markAsChanged),
            gantt.attachEvent('onAfterTaskDelete', (id) => {
                markAsChanged();
                handleSave();
            }),
            gantt.attachEvent('onAfterLinkAdd', markAsChanged),
            gantt.attachEvent('onAfterLinkUpdate', markAsChanged),
            gantt.attachEvent('onAfterLinkDelete', markAsChanged),
        ];

        gantt.init(ganttContainerRef.current);

        return () => {
            eventIds.forEach(eventId => gantt.detachEvent(eventId));
        };
    }, [isCustomer, markAsChanged, handleSave]);

    useEffect(() => {
        const fetchGanttData = async () => {
            setIsLoading(true);
            setError(null);
            setHasUnsavedChanges(false);
            try {
                const response = await apiClient.get(`/api/contracts/gantt/${contractId}`);
                const raw = response?.data?.data;

                gantt.clearAll();

                if (typeof raw === 'string') {
                    const trimmed = raw.trim();
                    if (trimmed.length > 0) {
                        gantt.parse(JSON.parse(trimmed));
                    }
                } else if (raw && Array.isArray(raw.data)) {
                    if (raw.data.length > 0) {
                        gantt.parse(raw);
                    }
                }
            } catch (e) {
                console.error("Gantt: Failed to load data:", e);
                if (!error) setError('Не удалось загрузить диаграмму Ганта.');
            } finally {
                setIsLoading(false);
            }
        };
        if (contractId) fetchGanttData();
    }, [contractId, error]);

    const handleAddTask = () => {
        if (isCustomer) return;
        const newTask = { text: "Новая задача", start_date: new Date(), duration: 1 };
        gantt.createTask(newTask);
    };

    return (
        <div className="gantt-page-container">
            <div className="gantt-page-header">
                <h1>Диаграмма Ганта</h1>
                <div className="header-actions">
                    {!isCustomer && !isLoading && !error && (
                        <button onClick={handleAddTask} className="btn btn-success">
                            + Добавить задачу
                        </button>
                    )}
                    {!isCustomer && hasUnsavedChanges && <span className="unsaved-changes-indicator">Есть несохраненные изменения</span>}
                    {!isCustomer && (
                        <button onClick={handleSave} className="btn btn-primary" disabled={!hasUnsavedChanges || isSaving}>
                            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    )}
                    <Link to={`/dashboard/projects/${contractId}`} className="btn btn-secondary">
                        ← Назад к проекту
                    </Link>
                </div>
            </div>

            <div className="gantt-wrapper">
                {isLoading && <div className="page-status">Загрузка диаграммы...</div>}
                {error && <div className="page-status error">{error}</div>}
                <div ref={ganttContainerRef} style={{ width: '100%', height: '100%', display: isLoading || error ? 'none' : 'block' }} />
            </div>
        </div>
    );
};

export default GanttPage;