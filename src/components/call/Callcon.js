const Callcon = () => {
    return (
    
    <main className="call-main">

        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
       
        <div className="callback-container">
        <div className="callback-title">ЗАКАЗАТЬ ЗВОНОК</div>

        
        <div className="form-group">
            <input type="text" id="fullname" className="form-input" placeholder="ФИО:" required/>
        </div>

        
        <div className="form-group">
            <input type="tel" id="phone" className="form-input" placeholder="+7 ___ ___ __ __" required/>
        </div>

        <div className="consent-checkbox">
            <input type="checkbox" id="consent"/>
            <label for="consent">
                Нажимая на кнопку "Отправить", я даю своё согласие на обработку моих персональных данных в соответствии с ФЗ от 27.07.2006 №152-ФЗ "О персональных данных".
            </label>
        </div>

    
        <div className="recaptcha-box">
            <div className="g-recaptcha" data-sitekey="6LdgZd4rAAAAABbjf4ZNirkWn8qFkUPCdE9wusr_"></div>
        </div>

        
        <button type="submit" className="send-button">ОТПРАВИТЬ</button>
        </div>
    </main>
    );
}
 
export default Callcon;