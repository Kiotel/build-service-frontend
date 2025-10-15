import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import useSafeNavigate from '../utils/useSafeNavigate';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const safeNavigate = useSafeNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const from = location.state?.from?.pathname || "/dashboard";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await apiClient.post('/api/login', {
                email: email,
                password: password,
            });

            const { token } = response.data.data;

            if (token) {
                await login(token);
                try { safeNavigate(from, { replace: true }); } catch (_) {}
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

                <form onSubmit={handleLogin} autoComplete="off">
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

                    <Link to="/" className="already-registered" style={{display: 'block', textAlign: 'center', marginTop: '15px'}}>
                        Еще не зарегистрированы?
                    </Link>
                </form>
            </div>
        </main>
    );
};

export default Login;