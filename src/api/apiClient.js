import axios from 'axios';

// URL вашего бэкенда
export const API_BASE_URL = 'http://95.174.100.224:10002';

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
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

export default apiClient;