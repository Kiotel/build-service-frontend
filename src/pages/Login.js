import { Link } from 'react-router-dom';
import { useState } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import useSafeNavigate from '../utils/useSafeNavigate';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer'); // Добавлено состояние для роли
    const [error, setError] = useState('');
    const safeNavigate = useSafeNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const loginResponse = await apiClient.post('/api/login', {
                email: email,
                password: password,
            });

            const { token } = loginResponse.data.data;

            if (token) {
                await login(token); // Выполняем вход, чтобы сохранить токен и данные

                // Перенаправляем на основе выбранной роли, а не данных пользователя
                const targetDashboard = role === 'customer' ? '/customer-dashboard' : '/brigade-dashboard';
                safeNavigate(targetDashboard, { replace: true });
            }

        } catch (err) {
            console.error('Ошибка входа:', err);
            setError('Неверный email или пароль.');
        }
    };

    return (
        <main className="reg-main">
            <div className="registration-container">
                <div className="registration-title">ВХОД</div>
                <div className="registration-subtitle">В BUILDSERVICE</div>
                
                {/* Добавлен переключатель ролей */}
                <form onSubmit={handleLogin} autoComplete="off">
                    <div className="role-selector" style={{marginBottom: '20px'}}>
                        <div className="role-option">
                            <input type="radio" id="customer" name="role" value="customer" checked={role === 'customer'} onChange={() => setRole('customer')} />
                            <label htmlFor="customer">Я - Заказчик</label>
                        </div>
                        <div className="role-option">
                            <input type="radio" id="builder" name="role" value="builder" checked={role === 'builder'} onChange={() => setRole('builder')} />
                            <label htmlFor="builder">Я - Строитель</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Электронная почта*</label>
                        <input type="email" id="email" name="email" className="form-input" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Пароль*</label>
                        <input type="password" id="password" name="password" className="form-input"     required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                    </div>

                    {error && <p className="error-message" style={{color: 'red', textAlign: 'center'}}>{error}</p>}

                    <div className="remember-me">
                        {/* Функционал "Запомнить меня" можно реализовать позже */}
                    </div>

                    <button type="submit" className="register-button">ВОЙТИ</button>

                    <Link to="/signup" className="already-registered" style={{display: 'block', textAlign: 'center', marginTop: '15px'}}>
                        Еще не зарегистрированы?
                    </Link>
                </form>
            </div>
        </main>
    );
};

export default Login;