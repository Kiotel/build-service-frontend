import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import apiClient from '../api/apiClient'; // Импортируем наш настроенный клиент
import { useAuth } from '../context/AuthContext';

const Signcon = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('customer');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!name) {
            setError('Необходимо указать имя.');
            return;
        }

        try {
            // =================================================================
            // ШАГ 1: Регистрация пользователя (не требует токена)
            // =================================================================
            const userResponse = await apiClient.post('/api/users', {
                email: email,
                name: name,
                password: password,
            });

            const userId = userResponse.data.data.id;

            // =================================================================
            // НОВЫЙ ШАГ 2: Вход в систему для получения токена
            // =================================================================
            const loginResponse = await apiClient.post('/api/login', {
                email: email,
                password: password,
            });

            const { token } = loginResponse.data.data;

            if (!token) {
                // Эта ситуация не должна произойти при успешной регистрации, но это хорошая проверка
                throw new Error('Токен не был получен после входа.');
            }

            // Авторизуем пользователя в контексте (сохранит токен и подгрузит профиль)
            await login(token);

            // =================================================================
            // ШАГ 3: Создание профиля в зависимости от роли (теперь этот запрос будет с токеном)
            // =================================================================
            if (role === 'customer') {
                await apiClient.post(`/api/customer/${userId}`, {
                    name: name
                });
            } else if (role === 'builder') {
                await apiClient.post(`/api/brigades/${userId}`, {
                    name: name,
                    workersAmount: 1, // Пример значения
                });
            }

            // =================================================================
            // ШАГ 4: Перенаправление на соответствующий дашборд
            // =================================================================
            const targetDashboard = role === 'customer' ? '/customer-dashboard' : '/brigade-dashboard';
            navigate(targetDashboard, { replace: true });

        } catch (err) {
            console.error('Ошибка регистрации:', err);
            // Очищаем токен на случай, если что-то пошло не так на полпути
            localStorage.removeItem('authToken');
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Не удалось завершить регистрацию. Пожалуйста, попробуйте снова.');
            }
        }
    };

    return (
        <main className="reg-main">
            <div className="registration-container">
                <div className="registration-title">РЕГИСТРАЦИЯ</div>
                <div className="registration-subtitle">В BUILDSERVICE</div>
                <div className="registration-subtitle">ВЫБЕРИТЕ ВАШУ РОЛЬ:</div>

                <form onSubmit={handleRegister} autoComplete="off">
                    <div className="role-selector">
                        <div className="role-option">
                            <input type="radio" id="customer" name="role" value="customer" checked={role === 'customer'} onChange={() => setRole('customer')} />
                            <label htmlFor="customer">Заказчик</label>
                        </div>
                        <div className="role-option">
                            <input type="radio" id="builder" name="role" value="builder" checked={role === 'builder'} onChange={() => setRole('builder')} />
                            <label htmlFor="builder">Строитель</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Ваше имя или название организации*</label>
                        <input type="text" id="name" name="name" className="form-input" placeholder="Введите ваше имя" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Электронная почта*</label>
                        <input type="email" id="email" name="email" className="form-input" placeholder="Введите вашу почту" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Придумайте пароль*</label>
                        <input type="password" id="password" name="password" className="form-input" placeholder="Введите пароль" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                    </div>

                    {error && <p className="error-message" style={{color: 'red', textAlign: 'center'}}>{error}</p>}

                    <div className="remember-me">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Запомнить меня</label>
                        <Link to="/login" className="already-registered">Уже зарегистрированы?</Link>
                    </div>

                    <button type="submit" className="register-button">ЗАРЕГИСТРИРОВАТЬСЯ</button>
                </form>
            </div>
        </main>
    );
}

export default Signcon;