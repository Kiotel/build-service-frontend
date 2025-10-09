import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
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
                    localStorage.removeItem('authToken');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        verifyAndFetchUser();
    }, [token]);

    const login = async (newToken) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken); // Setting the token triggers the useEffect above

        // --- KEY CHANGE ---
        // We will now manually fetch the user right here and return it.
        // This makes the user data available immediately after login.
        try {
            const protectedResponse = await apiClient.get('/api/protected');
            const principalString = protectedResponse.data;
            const match = principalString.match(/id=(\d+)/);
            if (!match || !match[1]) throw new Error("Could not parse user ID on login.");
            const userId = match[1];
            const userProfileResponse = await apiClient.get(`/api/users/${userId}`);
            const fetchedUser = userProfileResponse.data.data;
            setUser(fetchedUser); // Also set the user in the context state
            return fetchedUser; // Return the user object
        } catch (error) {
            console.error("Failed to fetch user immediately after login:", error);
            // If it fails, log out to be safe
            logout();
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setToken(null);
    };

    if (loading) {
        return <div>Loading Application...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);