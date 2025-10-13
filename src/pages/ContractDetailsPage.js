import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient'; // Убедитесь, что путь верный
import { useAuth } from '../context/AuthContext'; // Убедитесь, что путь верный
import '../css/ContractDetailsPage.css'; // Убедитесь, что путь верный
import Modal from '../components/modal/Modal'; // Убедитесь, что путь верный
import GanttChart from '../components/gantt/GanttChart';

const ContractDetailsPage = () => {
    const { contractId } = useParams();
    const { user } = useAuth();

    // Состояния для данных и загрузки
    const [contract, setContract] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Состояния для режима редактирования
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    // Состояния для модального окна приглашения
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [invitationUrl, setInvitationUrl] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    // Состояния для смены статуса
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const [toggleStatusError, setToggleStatusError] = useState(null);

    useEffect(() => {
        const fetchContractDetails = async () => {
            if (!user) return;
            try {
                setIsLoading(true);
                setError(null);
                const response = await apiClient.get(`/api/contracts/${contractId}`);
                setContract(response.data.data);
                setFormData(response.data.data);
            } catch (err) {
                setError("Не удалось загрузить детали проекта.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchContractDetails();
    }, [contractId, user]);

    // --- ОБРАБОТЧИКИ ДЛЯ РЕДАКТИРОВАНИЯ ---
    const handleEdit = () => {
        setFormData(contract);
        setIsEditing(true);
        setSaveError(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveError(null);
        try {
            const payload = {
                name: formData.name,
                customer_id: contract.customer_id, // customer_id не меняется
                brigade_id: contract.brigade_id, // brigade_id не меняется
                startDate: new Date(formData.start_date).toISOString(),
                endDate: formData.end_date ? new Date(formData.end_date).toISOString() : null,
            };
            const response = await apiClient.put(`/api/contracts/${contractId}`, payload);
            setContract(response.data.data);
            setIsEditing(false);
        } catch (err) {
            setSaveError("Не удалось сохранить изменения. Проверьте данные.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- ОБРАБОТЧИКИ ДЛЯ ПРИГЛАШЕНИЯ ---
    const handleCreateInvitation = () => {
        const url = `${window.location.origin}/join-project/${contract.id}`;
        setInvitationUrl(url);
        setIsCopied(false);
        setIsInviteModalOpen(true);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(invitationUrl);
        setIsCopied(true);
    };

    // --- ОБРАБОТЧИК ДЛЯ СМЕНЫ СТАТУСА ---
    const handleToggleStatus = async () => {
        setIsTogglingStatus(true);
        setToggleStatusError(null);
        try {
            const newEndDate = contract.end_date ? null : new Date().toISOString();
            const payload = {
                name: contract.name,
                customer_id: contract.customer_id,
                brigade_id: contract.brigade_id,
                startDate: contract.start_date,
                endDate: newEndDate,
            };
            const response = await apiClient.put(`/api/contracts/${contractId}`, payload);
            setContract(response.data.data);
            setFormData(response.data.data);
        } catch (err) {
            setToggleStatusError("Не удалось изменить статус проекта.");
        } finally {
            setIsTogglingStatus(false);
        }
    };

    // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return 'Не указана';
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    // --- ЛОГИКА РЕНДЕРА ---
    if (isLoading) return <div className="page-status">Загрузка данных проекта...</div>;
    if (error) return <div className="page-status error">{error}</div>;
    if (!contract) return <div className="page-status">Проект не найден.</div>;

    return (
        <>
            <div className="contract-details-container">
                <div className="contract-header">
                    {isEditing ? (
                        <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="header-input" />
                    ) : (
                        <h1>{contract.name}</h1>
                    )}
                    <div className="header-actions">
                        <Link to={`/dashboard/projects/${contractId}/gantt`} className="btn btn-info">
                            Диаграмма Гантта
                        </Link>
                        {!isEditing && (
                            <button
                                onClick={handleToggleStatus}
                                className={`btn ${contract.end_date ? 'btn-warning' : 'btn-success'}`}
                                disabled={isTogglingStatus}
                            >
                                {isTogglingStatus ? 'Обновление...' : (contract.end_date ? 'Возобновить проект' : 'Завершить проект')}
                            </button>
                        )}
                        {!isEditing && (
                            <button onClick={handleEdit} className="btn btn-primary">Изменить</button>
                        )}
                        <Link to="/dashboard" className="btn btn-secondary">← Назад</Link>
                    </div>
                </div>

                {toggleStatusError && <div className="page-status error" style={{padding: '15px 0'}}>{toggleStatusError}</div>}

                <div className="details-grid">
                    <div className="detail-item"><strong>ID Проекта:</strong> <span>{contract.id}</span></div>
                    <div className="detail-item"><strong>ID Заказчика:</strong> <span>{contract.customer_id}</span></div>
                    <div className="detail-item"><strong>ID Бригады:</strong> <span>{contract.brigade_id || 'Не назначена'}</span></div>
                    <div className="detail-item">
                        <strong>Дата начала:</strong>
                        {isEditing ? <input type="date" name="start_date" value={formatDateForInput(formData.start_date)} onChange={handleInputChange} className="form-input" /> : <span>{formatDateForDisplay(contract.start_date)}</span>}
                    </div>

				<div style={{ marginTop: '24px' }}>
					<h2 style={{ marginBottom: '12px' }}>Диаграмма Гантта</h2>
					<GanttChart contractId={contract.id} height={500} />
				</div>
                    <div className="detail-item">
                        <strong>Дата окончания:</strong>
                        {isEditing ? <input type="date" name="end_date" value={formatDateForInput(formData.end_date)} onChange={handleInputChange} className="form-input" /> : <span>{formatDateForDisplay(contract.end_date)}</span>}
                    </div>
                    <div className="detail-item"><strong>Статус:</strong> <span className={`status ${contract.end_date ? 'completed' : 'active'}`}>{contract.end_date ? 'Завершен' : 'В работе'}</span></div>
                </div>

                {!isEditing && contract.brigade_id === null && (
                    <div className="invitation-action">
                        <p>Для этого проекта еще не назначена бригада.</p>
                        <button onClick={handleCreateInvitation} className="btn btn-success">Создать приглашение</button>
                    </div>
                )}

                {isEditing && (
                    <div className="edit-actions">
                        {saveError && <div className="save-error">{saveError}</div>}
                        <button onClick={handleCancel} className="btn btn-secondary">Отмена</button>
                        <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
                            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                )}
            </div>

            <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)}>
                <h2>Приглашение для бригады</h2>
                <p>Отправьте эту ссылку руководителю бригады. Перейдя по ней, он сможет принять приглашение и присоединиться к вашему проекту.</p>
                <div className="invitation-url-box">
                    <input type="text" value={invitationUrl} readOnly />
                    <button onClick={copyToClipboard} className="btn btn-primary">{isCopied ? 'Скопировано!' : 'Копировать'}</button>
                </div>
            </Modal>
        </>
    );
};

export default ContractDetailsPage;