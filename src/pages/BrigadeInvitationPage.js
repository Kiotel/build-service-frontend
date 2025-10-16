import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import '../css/BrigadeInvitationPage.css';

const BrigadeInvitationPage = () => {
    const { contractId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [contract, setContract] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAccepting, setIsAccepting] = useState(false);

    useEffect(() => {
        const fetchInvitationDetails = async () => {
            try {
                const response = await apiClient.get(`/api/contracts/invitation/${contractId}`);
                setContract(response.data.data);
            } catch (err) {
                setError("Не удалось найти приглашение. Возможно, ссылка недействительна.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvitationDetails();
    }, [contractId]);

    const handleAcceptInvitation = async () => {
        setError(null);

        if (!user) {
            alert("Пожалуйста, войдите в систему как бригада, чтобы принять приглашение.");
            navigate('/login');
            return;
        }
        if (!user.brigade_id && !user.brigade) { // Улучшенная проверка
            setError("Принять приглашение может только пользователь с профилем бригады.");
            return;
        }
        if (contract && user.customer_id === contract.customer_id) {
            setError("Вы не можете принять приглашение в собственный проект.");
            return;
        }

        setIsAccepting(true);
        try {
            // Вызов API для принятия приглашения
            await apiClient.get(`/api/contracts/invitation/${contractId}`);

            alert("Вы успешно присоединились к проекту!");
            // Перенаправляем на страницу только что принятого проекта
            navigate(`/dashboard/projects/${contractId}`);
        } catch (err) {
            console.error("Failed to accept invitation:", err);
            setError("Не удалось принять приглашение. Возможно, оно уже было принято или срок его действия истек.");
        } finally {
            setIsAccepting(false);
        }
    };

    const renderActionArea = () => {
        if (!user) {
            return (
                <>
                    <p className="note">Для принятия приглашения необходимо войти в систему.</p>
                    <button onClick={() => navigate('/login')} className="btn btn-primary">
                        Войти в систему
                    </button>
                </>
            );
        }

        const isNotBrigade = !user.brigade_id && !user.brigade;
        const isOwnProject = contract && user.customer_id === contract.customer_id;

        return (
            <>
                <p className="note">Вы вошли в систему как: <strong>{user.name}</strong>.</p>
                <button
                    onClick={handleAcceptInvitation}
                    disabled={isAccepting || isNotBrigade || isOwnProject}
                    className="btn btn-success"
                >
                    {isAccepting ? 'Принимаем...' : 'Принять приглашение'}
                </button>
                {isNotBrigade && <p className="validation-error">Ваш профиль не является профилем бригады.</p>}
                {isOwnProject && <p className="validation-error">Нельзя принять приглашение в собственный проект.</p>}
            </>
        );
    };

    if (isLoading) {
        return <div className="invitation-page-container"><p>Загрузка приглашения...</p></div>;
    }

    return (
        <div className="invitation-page-container">
            {error && !contract ? (
                <div className="invitation-card error-card">
                    <h2>Ошибка</h2>
                    <p>{error}</p>
                </div>
            ) : (
                <div className="invitation-card">
                    <h2>Приглашение в проект</h2>
                    <p>Вас пригласили присоединиться к проекту:</p>
                    <div className="project-name">{contract?.name}</div>
                    {renderActionArea()}
                    {error && <p className="validation-error" style={{marginTop: '15px'}}>{error}</p>}
                </div>
            )}
        </div>
    );
};

export default BrigadeInvitationPage;