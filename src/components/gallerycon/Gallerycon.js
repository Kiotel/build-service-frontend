import homeG1 from "./../../img/images/homeG1.png";
import homeG2 from "./../../img/images/homeG2.png";
import homeG3 from "./../../img/images/homeG3.png";
const Gallerycon = () => {
    return ( 
    <main className="gallery-main">
        <h2 className="gallery-title">ГАЛЕРЕЯ</h2>
        
        <div className="gallery-wrapper">
            <div className="gallery-container"> 
                <img src={homeG1} alt="Изображение 1"/>
                <img src={homeG2} alt="Изображение 2"/>
                <img src={homeG3} alt="Изображение 3"/>
            </div>
        </div>
    </main> 
    );
}
 
export default Gallerycon;