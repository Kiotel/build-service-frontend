import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import apiClient from '../api/apiClient';
import '../css/GanttPage.css';

const GanttPage = () => {
    const { contractId } = useParams();
    const ganttContainerRef = useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    const markAsChanged = useCallback(() => {
        if (!hasUnsavedChanges) {
            setHasUnsavedChanges(true);
        }
    }, [hasUnsavedChanges]);

    // --- Эффект №1: Инициализация и настройка (Выполняется только один раз) ---
    useEffect(() => {
        if (!ganttContainerRef.current) return;

        // Конфигурация диаграммы
        gantt.config.readonly = false;
        gantt.config.date_format = "%Y-%m-%d %H:%i";
        gantt.config.root_id = "root"; // Позволяет создавать корневые задачи
        gantt.config.drag_move = true;
        gantt.config.drag_progress = true;
        gantt.config.drag_resize = true;
        gantt.config.drag_links = true;
        gantt.config.details_on_dblclick = true;

        gantt.plugins({ auto_scheduling: true });
        gantt.config.auto_scheduling = true;

        gantt.config.columns = [
            { name: 'text', label: 'Задача', width: '*', tree: true },
            { name: 'start_date', label: 'Начало', align: 'center', width: 90 },
            { name: 'duration', label: 'Длительность', align: 'center', width: 80 },
            { name: 'add', label: '', width: 44 },
        ];

        gantt.config.lightbox.sections = [
            { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
            { name: "time", type: "duration", map_to: "auto" }
        ];
        gantt.locale.labels.section_description = "Название задачи";
        gantt.locale.labels.section_time = "Период";

        // Привязываем обработчики событий
        const eventIds = [
            gantt.attachEvent('onAfterTaskAdd', markAsChanged),
            gantt.attachEvent('onAfterTaskUpdate', markAsChanged),
            gantt.attachEvent('onAfterTaskDelete', function(id) {
                markAsChanged();
                // Получаем актуальное состояние диаграммы
                const currentGanttState = gantt.serialize();
                // Проверяем, что задачи с id нет в массиве
                if (!currentGanttState.data.find(task => String(task.id) === String(id))) {
                    handleSave(); // Сохраняем только если задача реально удалена
                } else {
                    setError('Ошибка: задача не была удалена из локального состояния.');
                }
            }),
            gantt.attachEvent('onAfterLinkAdd', markAsChanged),
            gantt.attachEvent('onAfterLinkUpdate', markAsChanged),
            gantt.attachEvent('onAfterLinkDelete', markAsChanged),
        ];

        // Инициализируем диаграмму в DOM-элементе
        gantt.init(ganttContainerRef.current);

        // Функция очистки при размонтировании компонента
        return () => {
            eventIds.forEach(eventId => gantt.detachEvent(eventId));
        };
    }, [markAsChanged]);

    // --- Эффект №2: Загрузка данных (Выполняется при смене contractId) ---
    useEffect(() => {
        const fetchGanttData = async () => {
            setIsLoading(true);
            setError(null);
            setIsEmpty(false);
            setHasUnsavedChanges(false);
            try {
                const response = await apiClient.get(`/api/contracts/gantt/${contractId}`);
                const raw = response?.data?.data;

                gantt.clearAll();

                // Server may now return a plain string with JSON inside. Support both string and object.
                if (typeof raw === 'string') {
                    const trimmed = raw.trim();
                    if (trimmed.length === 0) {
                        setIsEmpty(true);
                    } else {
                        try {
                            const parsed = JSON.parse(trimmed);
                            if (parsed && Array.isArray(parsed.data)) {
                                if (parsed.data.length === 0) {
                                    setIsEmpty(true);
                                } else {
                                    gantt.parse(parsed);
                                }
                            } else {
                                throw new Error('Неверный формат данных диаграммы (строка)');
                            }
                        } catch (parseErr) {
                            console.error('Gantt: Failed to parse string data:', parseErr);
                            setError('Не удалось распарсить данные диаграммы.');
                        }
                    }
                } else if (raw && Array.isArray(raw.data)) {
                    if (raw.data.length === 0) {
                        setIsEmpty(true);
                    } else {
                        gantt.parse(raw);
                    }
                } else {
                    throw new Error('Неверный формат данных диаграммы');
                }
            } catch (e) {
                console.error("Gantt: Failed to load data:", e);
                if (!error) setError('Не удалось загрузить диаграмму Ганта.');
            } finally {
                setIsLoading(false);
            }
        };
        if (contractId) fetchGanttData();
    }, [contractId]);

    // --- ОБРАБОТЧИК ДОБАВЛЕНИЯ ЗАДАЧИ ---
    const handleAddTask = () => {
        const newTask = { text: "Новая задача", start_date: new Date(), duration: 1 };
        const newTaskId = gantt.createTask(newTask);
        gantt.showTask(newTaskId);
        gantt.open(newTaskId);
        setIsEmpty(false);
    };

    // --- ОБРАБОТЧИК СОХРАНЕНИЯ (сервер ожидает строку) ---
    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            // Получаем текущее состояние диаграммы в виде объекта { data, links }
            const currentGanttState = gantt.serialize();
            // Отправляем строковое представление этого объекта
            const stringPayload = JSON.stringify(currentGanttState);

            await apiClient.put(`/api/contracts/gantt/${contractId}`, { data: stringPayload });
            setHasUnsavedChanges(false);
        } catch (err) {
            console.error("Gantt: Failed to save data:", err);
            setError("Ошибка при сохранении. Проверьте данные и попробуйте снова.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="gantt-page-container">
            <div className="gantt-page-header">
                <h1>Диаграмма Ганта</h1>
                <div className="header-actions">
                    {!isLoading && !error && (
                        <button onClick={handleAddTask} className="btn btn-success">
                            + Добавить задачу
                        </button>
                    )}
                    {hasUnsavedChanges && <span className="unsaved-changes-indicator">Есть несохраненные изменения</span>}
                    <button onClick={handleSave} className="btn btn-primary" disabled={!hasUnsavedChanges || isSaving}>
                        {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
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
