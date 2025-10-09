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
                    <p>Необходимо учитывать, что монтаж мягкой черепицы может выполняться на крышах, имеющих наклон от 12 градусов. Это свойство материала, которое важно учитывать мастерам.</p>
                    <p>Прежде чем осуществлять монтаж гибкой черепицы своими руками, необходимо учитывать некоторые правила...</p>
                </div>
                <div className="article-arrow-container"><img src={arrow} alt="Стрелка" className="article-arrow"/></div>
            </div>
            
            {/*Статья 2*/}
            <div className="article-card">
                <div className="article-image">
                    <img src={article2} alt="Фундамент"/>
                </div>
                <div className="article-content">
                    <h3>Фундаменты для частного дома: плюсы и минусы</h3>
                    <p>Фундамент необходим для передачи на землю полезной нагрузки от стен, перекрытий, людей, ветра, снега и так далее. Вторая функция – это равномерное перераспределение нагрузки.</p>
                    <p>Чтобы не было так, что один край перегружен, а другой слишком легкий. Иначе строение будет перекашиваться, трескаться и разламываться.</p>
                </div>
                <div className="article-arrow-container"><img src={arrow} alt="Стрелка" className="article-arrow"/></div>
            </div>
            
            {/*Статья 3*/}
            <div className="article-card">
                <div className="article-image">
                    <img src={article3} alt="Утепление"/>
                </div>
                <div className="article-content">
                    <h3>Почему необходимо утепление?</h3>
                    <p>Сырость в доме или квартире и образование плесени – это разрушает ремонт внутри квартиры и представляет опасность для здоровья жильцов, так как дышать сыростью и плесенью категорически запрещено.</p>
                    <p>Скапливание жидкости на потолке – это происходит в связи с такой физической реакцией как конденсат.</p>
                </div>
                <div className="article-arrow-container"><img src={arrow} alt="Стрелка" className="article-arrow"/></div>
            </div>
        </div>
    </main>
    );
}
 
export default Artcon;