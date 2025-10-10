import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('customer');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !password.trim()) {
            setError("Пожалуйста, заполните все обязательные поля.");
            return;
        }
        setIsRegistering(true);
        setError('');
        try {
            await apiClient.post('/api/users', { email, name, password });
            const loginResponse = await apiClient.post('/api/login', { email, password });
            const token = loginResponse.data.data.token;
            if (!token) throw new Error("Login failed after registration.");

            const loggedInUser = await login(token);
            if (!loggedInUser) throw new Error("Failed to fetch user profile after logging in.");

            if (role === 'customer') {
                await apiClient.post(`/api/customer/${loggedInUser.id}`, { name });
            } else if (role === 'builder') {
                await apiClient.post(`/api/brigades/${loggedInUser.id}`, { name, workersAmount: 1 });
            }

            // A new user should ALWAYS go to the dashboard, ignoring any 'from' state.
            navigate('/dashboard', { replace: true });

        } catch (err) {
            console.error("REGISTRATION PROCESS FAILED:", err);
            setError(err.response?.data?.message || "Произошла ошибка при регистрации.");
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <main className="reg-main">
            <div className="registration-container">
                <div className="registration-title">РЕГИСТРАЦИЯ</div>
                <form onSubmit={handleRegister}>
                    {/* Your form JSX here... */}
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
                        <label htmlFor="name" className="form-label">Ваше имя*</label>
                        <input type="text" id="name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Электронная почта*</label>
                        <input type="email" id="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Придумайте пароль*</label>
                        <input type="password" id="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    <button type="submit" className="register-button" disabled={isRegistering}>
                        {isRegistering ? 'Регистрация...' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                        <Link to="/login">Уже зарегистрированы?</Link>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Signup;