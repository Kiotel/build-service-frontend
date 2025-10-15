import React, { useEffect, useRef, useState } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import apiClient from '../../api/apiClient'; // Ensure this path is correct

const GanttChart = ({ contractId, height = 500 }) => {
    const ganttContainerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEmpty, setIsEmpty] = useState(false); // New state to track if the chart has no data

    useEffect(() => {
        // --- This section for basic Gantt config is unchanged ---
        if (!ganttContainerRef.current) return;

        // Basic config
        gantt.config.readonly = true;
        gantt.config.autosize = 'xy';
        gantt.config.columns = [
            { name: 'text', label: 'Задача', width: '*', tree: true },
            { name: 'start_date', label: 'Начало', align: 'center' },
            { name: 'duration', label: 'Длительность', align: 'center' },
        ];

        gantt.init(ganttContainerRef.current);

        return () => {
            try {
                // Safely clear the Gantt instance on component unmount
                gantt.clearAll();
            } catch (_) {}
        };
    }, []); // This effect runs only once to initialize the Gantt chart

    useEffect(() => {
        const fetchGanttData = async () => {
            setIsLoading(true);
            setError(null);
            setIsEmpty(false); // Reset empty state on new fetch

            try {
                const response = await apiClient.get(`/api/contracts/gantt/${contractId}`);

                // Server may now return a plain string with JSON inside. Support both string and object.
                const raw = response?.data?.data;

                if (typeof raw === 'string') {
                    const trimmed = raw.trim();
                    if (trimmed.length === 0) {
                        setIsEmpty(true);
                        gantt.clearAll();
                    } else {
                        try {
                            const parsed = JSON.parse(trimmed);
                            if (!parsed || !Array.isArray(parsed.data) || !Array.isArray(parsed.links)) {
                                throw new Error('Неверный формат данных диаграммы (строка)');
                            }
                            if (parsed.data.length === 0) {
                                setIsEmpty(true);
                                gantt.clearAll();
                            } else {
                                gantt.clearAll();
                                gantt.parse(parsed);
                            }
                        } catch (parseErr) {
                            console.error('Failed to parse string Gantt data:', parseErr);
                            throw parseErr;
                        }
                    }
                } else {
                    const ganttData = raw;
                    // Validate the structure of the received data
                    if (!ganttData || !Array.isArray(ganttData.data) || !Array.isArray(ganttData.links)) {
                        throw new Error('Неверный формат данных диаграммы');
                    }

                    // --- NEW LOGIC: HANDLE EMPTY CHART ---
                    // Check if the 'data' array (which holds the tasks) is empty
                    if (ganttData.data.length === 0) {
                        setIsEmpty(true);
                        gantt.clearAll(); // Clear any previous data from the chart
                    } else {
                        gantt.clearAll();
                        gantt.parse(ganttData); // Parse the data if it's not empty
                    }
                }

            } catch (e) {
                console.error("Failed to load Gantt chart:", e);
                setError('Не удалось загрузить диаграмму Ганта.');
            } finally {
                setIsLoading(false);
            }
        };

        if (contractId) {
            fetchGanttData();
        }
    }, [contractId]); // Re-fetch when contractId changes

    // --- RENDER LOGIC WITH NEW 'isEmpty' STATE ---

    if (isLoading) {
        return <div className="page-status">Загрузка диаграммы...</div>;
    }

    if (error) {
        return <div className="page-status error">{error}</div>;
    }


    // If data exists, show the Gantt chart
    return (
        <div style={{ height }}>
            <div ref={ganttContainerRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default GanttChart;