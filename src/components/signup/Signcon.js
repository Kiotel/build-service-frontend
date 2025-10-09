import { Link } from 'react-router-dom';
const Signcon = () => {
    return (  
    <main className="reg-main">
        <div className="registration-container">
        <div className="registration-title">РЕГИСТРАЦИЯ</div>
        <div className="registration-subtitle">В BUILDSERVICE</div>
        <div className="registration-subtitle">ВЫБЕРИТЕ ВАШУ РОЛЬ:</div>


        <div className="role-selector">
            <div className="role-option">
                <input type="radio" id="customer" name="role" value="customer"/>
                <label for="customer">Заказчик</label>
            </div>
            <div className="role-option">
                <input type="radio" id="builder" name="role" value="builder"/>
                <label for="builder">Строитель</label>
            </div>
        </div>


        <div className="form-group">
            <label for="email" className="form-label">Электронная почта*</label>
            <input type="email" id="email" className="form-input" placeholder="Введите вашу почту" required/>
        </div>


        <div className="form-group">
            <label for="password" className="form-label">Придумайте пароль*</label>
            <input type="password" id="password" className="form-input" placeholder="Введите пароль" required/>
        </div>


        <div className="remember-me">
            <input type="checkbox" id="remember"/>
            <label for="remember">Запомнить меня</label>
            <Link to="/login" className="already-registered">Уже зарегистрированы?</Link>
        </div>


        <button type="submit" className="register-button">ЗАРЕГИСТРИРОВАТЬСЯ</button>
        </div>
    </main>
    );
}
 
export default Signcon;