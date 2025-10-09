import {Link} from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">BUILDSERVICE</Link>
      </div>
      <div className="navbar-links">
        <Link to="/certificats">СЕРТИФИКАТЫ</Link>
        <Link to="/gallery">ГАЛЕРЕЯ</Link>
        <Link to="/articles">СТАТЬИ</Link>
        <Link to="/reviews">ОТЗЫВЫ</Link>
        <Link to="/about">О НАС</Link>
        <Link to="/signup" className="register-button">РЕГИСТРАЦИЯ</Link>
      </div>
    </nav>
  );
};

export default Navbar;