import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const Signcon = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('customer');
    const [error, setError] = useState(''); // Для ошибок сервера
    const [formErrors, setFormErrors] = useState({}); // Для ошибок валидации полей
    const [isFormValid, setIsFormValid] = useState(false);

    const navigate = useNavigate();
    const { setAuthToken } = useAuth();

    // Эффект для проверки валидности всей формы при изменении полей
    useEffect(() => {
        const errors = {};

        if (email && !email.includes('@')) {
            errors.email = 'Email должен содержать символ @';
        }
        if (password && password.length < 8) {
            errors.password = 'Пароль должен быть не менее 8 символов';
        }
        
        setFormErrors(errors);

        const nameIsValid = name.length > 0;
        const emailIsValid = email.length > 0 && email.includes('@');
        const passwordIsValid = password.length > 0 && password.length >= 8;

        setIsFormValid(nameIsValid && emailIsValid && passwordIsValid);
    }, [name, email, password]);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setError('Пожалуйста, исправьте ошибки в форме.');
            return;
        }
        setError('');

        try {
            const userResponse = await apiClient.post('/api/users', {
                email: email,
                name: name,
                password: password,
            });
            const userId = userResponse.data.data.id;

            const loginResponse = await apiClient.post('/api/login', {
                email: email,
                password: password,
            });
            const { token } = loginResponse.data.data;
            if (!token) {
                throw new Error('Токен не был получен после входа.');
            }

            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            if (role === 'customer') {
                await apiClient.post(`/api/customer/${userId}`, { name: name });
            } else if (role === 'builder') {
                await apiClient.post(`/api/brigades/${userId}`, { name: name, workersAmount: 1 });
            }

            setAuthToken(token);

            const targetDashboard = role === 'customer' ? '/customer-dashboard' : '/brigade-dashboard';
            navigate(targetDashboard, { replace: true });

        } catch (err) {
            console.error('Ошибка регистрации:', err);
            localStorage.removeItem('authToken');
            delete apiClient.defaults.headers.common['Authorization'];
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

                <form onSubmit={handleRegister} autoComplete="off" noValidate>
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
                        <input type="text" id="name" name="name" className={`form-input ${formErrors.name ? 'invalid' : ''}`} placeholder="Введите ваше имя" required value={name} onChange={(e) => setName(e.target.value)} />
                        {formErrors.name && <p className="validation-error-message">{formErrors.name}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Электронная почта*</label>
                        <input type="email" id="email" name="email" className={`form-input ${formErrors.email ? 'invalid' : ''}`} placeholder="Введите вашу почту" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        {formErrors.email && <p className="validation-error-message">{formErrors.email}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Придумайте пароль*</label>
                        <input type="password" id="password" name="password" className={`form-input ${formErrors.password ? 'invalid' : ''}`} placeholder="Введите пароль" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        {formErrors.password && <p className="validation-error-message">{formErrors.password}</p>}
                    </div>

                    {error && <p className="error-message" style={{color: 'red', textAlign: 'center'}}>{error}</p>}

                    <div className="remember-me">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Запомнить меня</label>
                        <Link to="/login" className="already-registered">Уже зарегистрированы?</Link>
                    </div>

                    <button type="submit" className="register-button" disabled={!isFormValid}>ЗАРЕГИСТРИРОВАТЬСЯ</button>
                </form>
            </div>
        </main>
    );
}

export default Signcon;