import axios from 'axios';

// Prefer env-based config if available (CRA style)
const envBaseUrl =
    (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL)
        ? process.env.REACT_APP_API_BASE_URL
        : null;

// Fallback to existing hardcoded URL if env not provided
export const API_BASE_URL = envBaseUrl || 'http://95.174.100.224:10002';

// Create axios instance with sane defaults
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// --- ВОТ ЭТА ЧАСТЬ ДОБАВЛЯЕТ ТОКЕН ---
// Перехватчик для всех исходящих запросов
apiClient.interceptors.request.use(
    (config) => {
        // 1. Получаем токен из localStorage
        const token = localStorage.getItem('authToken');

        // 2. Если токен существует...
        if (token) {
            // 3. ...добавляем заголовок Authorization к запросу
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // 4. Возвращаем измененную конфигурацию запроса
        return config;
    },
    (error) => {
        // В случае ошибки, отклоняем promise
        return Promise.reject(error);
    }
);

// Basic response interceptor to catch 401s and optionally clear auth
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error && error.response && error.response.status === 401) {
            // Best-effort sign-out to recover from invalid tokens
            try {
                localStorage.removeItem('authToken');
            } catch (_) {}
        }
        return Promise.reject(error);
    }
);

export default apiClient;