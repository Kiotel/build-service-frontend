import "./css/styles.css";
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from "react-router-dom";

// --- МАКЕТЫ И КОНТЕКСТ ---
import DashboardLayout from "./layouts/DashboardLayout";
import { AuthProvider } from "./context/AuthContext";

// --- КОМПОНЕНТЫ СТРАНИЦ ---
// (Все импорты приведены к единому стилю для ясности)
import Home from "./pages/Home";
import Certificats from "./pages/Certificates";
import Gallery from "./pages/Gallery";
import Articles from "./pages/Articles";
import Reviews from "./pages/Reviews";
import About from "./pages/About";
import Call from "./pages/Call";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BrigadeDashboard from './pages/BrigadeDashboard';   // <-- ДОБАВЛЕН ИМПОРТ
import ContractDetailsPage from "./pages/ContractDetailsPage";
import BrigadeInvitationPage from './pages/BrigadeInvitationPage';

// --- КОМПОНЕНТЫ МАРШРУТИЗАЦИИ ---
import PublicOnlyRoute from "./components/PublicOnlyRoute"; // Предполагается, что путь теперь такой
import DashboardRedirect from './components/DashboardRedirect'; // <-- ДОБАВЛЕН ИМПОРТ

// --- КОМПОНЕНТЫ ИНТЕРФЕЙСА ---
import Navbar from "./components/navbar/Navbar";
import Callbtn from "./components/callbtn/Callbtn";
import CustomerDashboard from "./components/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Макет для всех публичных страниц (хедер, футер и т.д.)
const PublicLayout = () => {
    const location = useLocation();
    const showCallButton = location.pathname === '/';
    return (
        <>
            <Navbar />
            {showCallButton && <Callbtn />}
            <main><Outlet /></main>
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* --- ЛОГИКА ДАШБОРДА (ПОЛНОСТЬЮ ПЕРЕРАБОТАНА) --- */}

                        {/* 1. Маршрут-распределитель: /dashboard */}
                        {/* При заходе сюда, компонент DashboardRedirect определит роль и перенаправит */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardRedirect />
                                </ProtectedRoute>
                            }
                        />

                        {/* 2. Группа маршрутов, использующих макет дашборда */}
                        {/* Все, что находится внутри, будет защищено и иметь хедер дашборда */}
                        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
                            <Route path="/brigade-dashboard" element={<BrigadeDashboard />} />
                            <Route path="/dashboard/projects/:contractId" element={<ContractDetailsPage />} />
                        </Route>

                        {/* --- ПУБЛИЧНЫЕ МАРШРУТЫ --- */}
                        <Route path="/" element={<PublicLayout />}>
                            <Route index element={<Home />} />
                            <Route path="certificats" element={<Certificats />} />
                            <Route path="gallery" element={<Gallery />} />
                            <Route path="articles" element={<Articles />} />
                            <Route path="reviews" element={<Reviews />} />
                            <Route path="about" element={<About />} />
                            <Route path="call" element={<Call />} />
                            <Route path="login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                            <Route path="signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
                            <Route path="/join-project/:contractId" element={<BrigadeInvitationPage />} />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;