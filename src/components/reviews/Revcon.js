import avatar from "./../../img/icons/ava.png"
const Revcon = () => {
    return ( 
    <main className="reviews-main">
        <div className="reviews-header">
            <div className="write-review-btn">
                <a href="#">Написать отзыв</a>
            </div>
            <h2 className="reviews-title">ОТЗЫВЫ</h2>
        </div>
        
        <div className="reviews-container">
            {/*Отзыв 1*/}
            <div className="review-card">
                <div className="review-author">
                    <img src={avatar} alt="Автор отзыва" className="author-avatar"/>
                    <div className="author-info">
                        <h4>Марина Элянова</h4>
                        <div className="review-rating">
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                        </div>
                    </div>
                </div>
                <div className="review-content">
                    <p>Если хочется красивый и современный дом, но бюджет ограничен, то здесь за вас уже все придумали.  За 3 недели дом был готов, 75 квадратов с отделкой! Материалы все экологически чистые, соответствуют современным стандартам и требованиям. Дизайнер помог нам определиться со стилем, подсказал что сейчас модно, а что уже устарело. Фирмой довольны, показали себя прекрасно на всех этапах нашего сотрудничества.</p>
                </div>
            </div>
            
            {/*Отзыв 2*/}
            <div className="review-card">
                <div className="review-author">
                    <img src={avatar} alt="Автор отзыва" className="author-avatar"/>
                    <div className="author-info">
                        <h4>Фёдор Слива</h4>
                        <div className="review-rating">
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                        </div>
                    </div>
                </div>
                <div className="review-content">
                    <p>Бригада уложились в срок, это очень радует, потому что дом нужен был срочно, квартиру продали и жили на съëмной пока стороились. Работники очень вежливые. Мы выбрали не стандартную внутреннюю планировку, сделали всë аккуратно и надëжно. Спасибо BILDSERVICE!!!!!!</p>
                </div>
            </div>
            
            {/*Отзыв 3*/}
            <div className="review-card">
                <div className="review-author">
                    <img src={avatar} alt="Автор отзыва" className="author-avatar"/>
                    <div className="author-info">
                        <h4>Гордей Комаров</h4>
                        <div className="review-rating">
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                        </div>
                    </div>
                </div>
                <div className="review-content">
                    <p>Долго искал, подбирал компанию застройщика, по рекомендации знакомых, посмотрел отзывы в интернете. При личной встрече с представителем компании Дома РФ, сразу понял, что обратился куда нужно. Подобрали проект под мои запросы, включили в график начало строительных работ, причем согласовали оперативно с учетом моих пожеланий. Порадовали широким спектром предоставляемых услуг. Благодарю!</p>
                </div>
            </div>
        </div>
    </main> 
    );
}
 
export default Revcon;