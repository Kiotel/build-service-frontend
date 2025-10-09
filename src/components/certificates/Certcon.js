import sert1 from "./../../img/images/sert1.png";
import sert2 from "./../../img/images/sert2.png";
const Certcon = () => {
    return ( 
    
    <main className="certificates-main">
        <h2 className="certificates-title">
            СЕРТИФИКАТЫ
        </h2>
        
        <div className="certificates-wrapper">
            <div className="certificates-container">
                <img src={sert1} alt="Сертификат 1"/>
                <img src={sert1} alt="Сертификат 2"/>
                <img src={sert1} alt="Сертификат 3"/>
                <img src={sert2} alt="Сертификат 4"/>
                <img src={sert2} alt="Сертификат 5"/>
                <img src={sert2} alt="Сертификат 6"/>
            </div>
        </div>
    </main> 
    );
}
 
export default Certcon;