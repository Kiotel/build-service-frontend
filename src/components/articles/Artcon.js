import { Link } from 'react-router-dom';
import article1 from "./../../img/images/articles.png";
import article2 from "./../../img/images/articles2.png";
import article3 from "./../../img/images/articles3.png";

// Обертка для карточки статьи, чтобы сделать ее ссылкой
const ArticleCard = ({ id, imageUrl, title, summary }) => {
    return (
        <Link to={`/articles/${id}`} className="article-card-link">
            <div className="article-card">
                <div className="article-image">
                    <img src={imageUrl} alt={title} />
                </div>
                <div className="article-content">
                    <h3>{title}</h3>
                    <p>{summary}</p>
                </div>
            </div>
        </Link>
    );
};

const Artcon = () => {
    const articles = [
        {
            id: 1,
            title: 'Как правильно сделать мягкую кровлю?',
            summary: 'Монтаж гибкой черепицы выполняют на скатах с уклоном от 12°. Важно соблюдать базовые правила укладки.',
            imageUrl: article1
        },
        {
            id: 2,
            title: 'Фундаменты для частного дома: плюсы и минусы',
            summary: 'Фундамент распределяет нагрузку от дома равномерно по грунту. Выбор зависит от типа почвы и веса строения.',
            imageUrl: article2
        },
        {
            id: 3,
            title: 'Почему необходимо утепление?',
            summary: 'Утепление снижает влагу и риск плесени, повышая комфорт и энергоэффективность жилья.',
            imageUrl: article3
        }
    ];

    return (
        <main className="articles-main">
            <h2 className="articles-title">СТАТЬИ</h2>
            <div className="articles-container">
                {articles.map(article => (
                    <ArticleCard key={article.id} {...article} />
                ))}
            </div>
        </main>
    );
}

export default Artcon;
