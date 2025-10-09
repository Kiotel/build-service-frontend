import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient'; // Ensure this path is correct
import { useAuth } from '../../context/AuthContext'; // Ensure this path is correct

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('customer');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth(); // We still need the login function

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError("Пожалуйста, заполните все обязательные поля.");
            return;
        }

        setIsRegistering(true);
        setError('');

        try {
            // --- Step 1: Register User (Public Endpoint) ---
            await apiClient.post('/api/users', {
                email: email,
                name: name,
                password: password,
            });

            // --- Step 2: Log In to get the token ---
            // We do a separate login call to get a fresh token
            const loginResponse = await apiClient.post('/api/login', {
                email: email,
                password: password,
            });
            const token = loginResponse.data.data.token;
            if (!token) {
                throw new Error("Login failed immediately after registration.");
            }

            // --- Step 3: Set the Token using AuthContext ---
            // The login function now fetches the user and makes the token active for apiClient
            const loggedInUser = await login(token);
            if (!loggedInUser) {
                throw new Error("Failed to fetch user profile after logging in.");
            }

            // --- Step 4: Create Profile (Protected Endpoint) ---
            // Now that the token is active, this call will be authenticated
            if (role === 'customer') {
                await apiClient.post(`/api/customer/${loggedInUser.id}`, { name: name });
            } else if (role === 'builder') {
                await apiClient.post(`/api/brigades/${loggedInUser.id}`, { name: name, workersAmount: 1 });
            }

            // --- Step 5: Navigate to the Dashboard ---
            navigate('/dashboard');

        } catch (err) {
            console.error("REGISTRATION PROCESS FAILED:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Произошла ошибка при регистрации. Возможно, такой email уже используется.");
            }
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <main className="reg-main">
            <div className="registration-container">
                <div className="registration-title">РЕГИСТРАЦИЯ</div>
                <div className="registration-subtitle">В BUILDSERVICE</div>
                <div className="registration-subtitle">ВЫБЕРИТЕ ВАШУ РОЛЬ:</div>

                <form onSubmit={handleRegister}>
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