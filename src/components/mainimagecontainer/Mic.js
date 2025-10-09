import home from "./../../img/images/home.png"

function Mic () {
    return (
    
    <div className="main-image-container">
            <img src={home} alt="Главное изображение" className="main-image"/>
            <div className="main-image-text">
                <p>BUILDSERVICE - обеспечит владельцам частных строек и подрядчикам платформу для управления проетами, включая планирование работ, отслеживание бюджета и сроков.</p>
            </div>
        </div>
    );
}

export default Mic;