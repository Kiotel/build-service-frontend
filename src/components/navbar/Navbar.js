import { useState } from "react";
import { Link } from "react-router-dom";
import '../../css/navbar.css'; // Make sure this path is correct

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/" onClick={closeMenu}>BUILDSERVICE</Link>
            </div>

            {/* Added 'active' class to toggle for the 'X' animation */}
            <div className={`navbar-toggle ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>

            <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
                <Link to="/certificats" onClick={closeMenu}>СЕРТИФИКАТЫ</Link>
                <Link to="/gallery" onClick={closeMenu}>ГАЛЕРЕЯ</Link>
                <Link to="/articles" onClick={closeMenu}>СТАТЬИ</Link>
                <Link to="/reviews" onClick={closeMenu}>ОТЗЫВЫ</Link>
                <Link to="/about" onClick={closeMenu}>О НАС</Link>
                <Link to="/signup" className="register-button" onClick={closeMenu}>РЕГИСТРАЦИЯ</Link>
            </div>
        </nav>
    );
};

export default Navbar;