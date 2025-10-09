import "./css/styles.css";
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Logos from "./components/logos/Logos";
import Home from "./pages/Home";
import Certificats from "./pages/Certificates";
import Gallery from "./pages/Gallery";
import Articles from "./pages/Articles";
import Reviews from "./pages/Reviews";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Artcon from "./components/articles/Artcon";
import Call from "./pages/Call";
import Callbtn from "./components/callbtn/Callbtn";
import Login from "./pages/Login";






function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <MainContent />
      </div>
    </Router>
  );
}

// Вспомогательный компонент для условного рендера кнопки
const MainContent = () => {
  const location = useLocation();

  // Показываем кнопку только на главной странице
  const showCallButton = location.pathname === '/';

  return (
    <>
      {showCallButton && <Callbtn />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/certificats" element={<Certificats />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/articles" element={<Artcon />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/call" element={<Call />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
