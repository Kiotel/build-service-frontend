import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => {
        try {
            return localStorage.getItem('authToken');
        } catch (_) {
            return null; // localStorage может быть недоступен
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAndFetchUser = async () => {
            if (token) {
                try {
                    const protectedResponse = await apiClient.get('/api/protected');
                    const principalString = protectedResponse.data;
                    const match = principalString.match(/id=(\d+)/);
                    if (!match || !match[1]) throw new Error("Could not parse user ID.");
                    const userId = match[1];
                    const userProfileResponse = await apiClient.get(`/api/users/${userId}`);
                    setUser(userProfileResponse.data.data);
                } catch (error) {
                    try { localStorage.removeItem('authToken'); } catch (_) {}
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        verifyAndFetchUser();
    }, [token]);

    // Для страницы входа: немедленно загружает профиль
    const login = async (newToken) => {
        try {
            const protectedResponse = await apiClient.get('/api/protected', { headers: { 'Authorization': `Bearer ${newToken}` } });
            const principalString = protectedResponse.data;
            const match = principalString.match(/id=(\d+)/);
            if (!match || !match[1]) throw new Error("Could not parse user ID on login.");
            const userId = match[1];
            const userProfileResponse = await apiClient.get(`/api/users/${userId}`, { headers: { 'Authorization': `Bearer ${newToken}` } });
            const fetchedUser = userProfileResponse.data.data;
            
            localStorage.setItem('authToken', newToken);
            setUser(fetchedUser);
            setToken(newToken);
            return fetchedUser;
        } catch (error) {
            console.error("Failed to fetch user immediately after login:", error);
            logout(); // В случае ошибки выходим из системы
            throw error; // Передаем ошибку дальше, чтобы форма входа могла ее обработать
        }
    };

    // Только для регистрации: просто устанавливает токен, не загружая профиль
    const setAuthToken = (newToken) => {
        try { localStorage.setItem('authToken', newToken); } catch (_) {}
        setToken(newToken);
    };

    const logout = () => {
        try { localStorage.removeItem('authToken'); } catch (_) {}
        setUser(null);
        setToken(null);
    };

    // Не показываем приложение, пока не будет определен статус пользователя
    if (loading) {
        return <div>Loading Application...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, setAuthToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);