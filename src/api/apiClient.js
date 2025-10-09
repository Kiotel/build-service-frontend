import axios from 'axios';

// --- ГЛАВНАЯ КОНСТАНТА API ---
// Замените этот URL на реальный адрес вашего бэкенда.
// Для локальной разработки это может быть 'http://localhost:8080' или 'http://127.0.0.1:8080'.
// Для продакшена это будет ваш публичный домен, например 'https://api.buildservice.com'.
export const API_BASE_URL = 'http://95.174.100.224:10002'; // <== ИЗМЕНИТЕ ЭТОТ АДРЕС

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Interceptor (Перехватчик) для запросов ---
// Этот код будет выполняться ПЕРЕД каждым запросом, отправленным через apiClient.
apiClient.interceptors.request.use(
    (config) => {
        // Получаем токен из localStorage
        const token = localStorage.getItem('authToken');

        // Если токен существует, добавляем его в заголовок Authorization
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // В случае ошибки с настройкой запроса, отклоняем promise
        return Promise.reject(error);
    }
);

export default apiClient;