import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import useSafeNavigate from '../utils/useSafeNavigate';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [error, setError] = useState(''); // Для ошибок сервера
    const [formErrors, setFormErrors] = useState({}); // Для ошибок валидации полей
    const [isFormValid, setIsFormValid] = useState(false);

    const safeNavigate = useSafeNavigate();
    const { login } = useAuth();

    // Эффект для проверки валидности всей формы при изменении полей
    useEffect(() => {
        const errors = {};
        if (!email.includes('@')) errors.email = 'Email должен содержать символ @';
        if (password.length < 8) errors.password = 'Пароль должен быть не менее 8 символов';

        setFormErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    }, [email, password]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setError('Пожалуйста, исправьте ошибки в форме.');
            return;
        }
        setError('');

        try {
            const loginResponse = await apiClient.post('/api/login', {
                email: email,
                password: password,
            });

            const { token } = loginResponse.data.data;

            if (token) {
                await login(token);
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
                
                <form onSubmit={handleLogin} autoComplete="off" noValidate>
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
                        <input type="email" id="email" name="email" className={`form-input ${formErrors.email ? 'invalid' : ''}`} required value={email} onChange={(e) => setEmail(e.target.value)} />
                        {formErrors.email && <p className="validation-error-message">{formErrors.email}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Пароль*</label>
                        <input type="password" id="password" name="password" className={`form-input ${formErrors.password ? 'invalid' : ''}`} required value={password} onChange={(e) => setPassword(e.target.value)} />
                        {formErrors.password && <p className="validation-error-message">{formErrors.password}</p>}
                    </div>

                    {error && <p className="error-message" style={{color: 'red', textAlign: 'center'}}>{error}</p>}

                    <div className="remember-me">
                        {/* Функционал "Запомнить меня" можно реализовать позже */}
                    </div>

                    <button type="submit" className="login-button" disabled={!isFormValid}>ВОЙТИ</button>

                    <Link to="/signup" className="already-registered" style={{display: 'block', textAlign: 'center', marginTop: '15px'}}>
                        Еще не зарегистрированы?
                    </Link>
                </form>
            </div>
        </main>
    );
};

export default Login;