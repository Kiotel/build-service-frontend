import arrow from "./../../img/icons/arrow.png";
import article1 from "./../../img/images/articles.png";
import article2 from "./../../img/images/articles2.png";
import article3 from "./../../img/images/articles3.png";

const Artcon = () => {
    return (  
        <main className="articles-main">
        <h2 className="articles-title">СТАТЬИ</h2>
        
        <div className="articles-container">
            {/*Статья 1*/}
            <div className="article-card">
                <div className="article-image">
                    <img src={article1} alt="Мягкая кровля"/>
                </div>
                <div className="article-content">
                    <h3>Как правильно сделать мягкую кровлю?</h3>
                    <p>Монтаж гибкой черепицы выполняют на скатах с уклоном от 12°. Важно соблюдать базовые правила укладки.</p>
                </div>
            </div>
            
            {/*Статья 2*/}
            <div className="article-card">
                <div className="article-image">
                    <img src={article2} alt="Фундамент"/>
                </div>
                <div className="article-content">
                    <h3>Фундаменты для частного дома: плюсы и минусы</h3>
                    <p>Фундамент распределяет нагрузку от дома равномерно по грунту. Выбор зависит от типа почвы и веса строения.</p>
                </div>
            </div>
            
            {/*Статья 3*/}
            <div className="article-card">
                <div className="article-image">
                    <img src={article3} alt="Утепление"/>
                </div>
                <div className="article-content">
                    <h3>Почему необходимо утепление?</h3>
                    <p>Утепление снижает влагу и риск плесени, повышая комфорт и энергоэффективность жилья.</p>
                </div>
            </div>
        </div>
    </main>
    );
}
 
export default Artcon;