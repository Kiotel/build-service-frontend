import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // <-- Import useLocation
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation(); // <-- Get the location object
    const { login } = useAuth();

    // --- THIS IS THE KEY ---
    // Check if there's a saved 'from' path in the location state.
    // If not, we default to '/dashboard'.
    const from = location.state?.from?.pathname || "/dashboard";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await apiClient.post('/api/login', { email, password });
            const { token } = response.data.data;
            if (token) {
                await login(token);
                // --- THE CRITICAL CHANGE ---
                // Navigate to the 'from' path instead of a hardcoded one.
                // The 'replace: true' prevents the login page from being in the history.
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError('Неверный email или пароль.');
        }
    };

    return (
        <main className="log-main">
            <div className="login-container">
                <div className="login-title">ВХОД</div>
                <div className="login-subtitle">В BUILDSERVICE</div>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Электронная почта*</label>
                        <input type="email" id="email" className="form-input" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Пароль*</label>
                        <input type="password" id="password" className="form-input" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    <button type="submit" className="login-button">ВОЙТИ</button>
                    <div className="register-link" style={{ textAlign: 'center', marginTop: '15px' }}>
                        <p>Еще не зарегистрированы? <Link to="/signup">Зарегистрироваться</Link></p>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Login;