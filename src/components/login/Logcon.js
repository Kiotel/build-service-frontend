import { Link } from 'react-router-dom';
const Logcon = () => {
    return (  
    <main className="log-main">
    
    <div className="login-container">
    <div className="login-title">ДОБРО ПОЖАЛОВАТЬ В</div>
    <div className="login-subtitle">BUILDSERVICE</div>

   
    <div className="form-group">
        <label for="email" className="form-label">Электронная почта*</label>
        <input type="email" id="email" className="form-input" placeholder="Введите вашу почту" required/>
    </div>

    
    <div className="form-group">
        <label for="password" className="form-label">Пароль*</label>
        <input type="password" id="password" className="form-input" placeholder="Введите пароль" required/>
    </div>

    
    <div className="remember-forgot">
        <div className="remember-me">
            <input type="checkbox" id="remember"/>
            <label for="remember">Запомнить меня</label>
        </div>
        <a href="#" className="forgot-password">Восстановить пароль</a>
    </div>

    
    <button type="submit" className="login-button">ВОЙТИ</button>

    
    <div className="register-link">
        Первый раз в BUILDSERVICE? <Link to="/signup" className="register-link-text">Зарегистрироваться</Link>
    </div>
</div>

    </main>
    );
}
 
export default Logcon;