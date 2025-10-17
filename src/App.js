import "./css/styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --- МАКЕТЫ И КОНТЕКСТ ---
import DashboardLayout from "./layouts/DashboardLayout";
import { AuthProvider } from "./context/AuthContext";

// --- КОМПОНЕНТЫ СТРАНИЦ ---
import Home from "./pages/Home";
import Certificates from "./pages/Certificates";
import Gallery from "./pages/Gallery";
import Articles from "./pages/Articles";
import ArticlePage from "./pages/ArticlePage"; // <-- ИМПОРТ НОВОЙ СТРАНИЦЫ
import Reviews from "./pages/Reviews";
import About from "./pages/About";
import Call from "./pages/Call";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BrigadeDashboard from './pages/BrigadeDashboard';
import ContractDetailsPage from "./pages/ContractDetailsPage";
import BrigadeInvitationPage from './pages/BrigadeInvitationPage';

// --- КОМПОНЕНТЫ МАРШРУТИЗАЦИИ ---
import PublicOnlyRoute from "./components/PublicOnlyRoute";

// --- КОМПОНЕНТЫ ИНТЕРФЕЙСА ---
import PublicLayout from "./layouts/PublicLayout";
import CustomerDashboard from "./components/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import GanttPage from "./pages/GanttPage";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
                        <Route path="/brigade-dashboard" element={<BrigadeDashboard />} />
                        <Route path="/dashboard/projects/:contractId" element={<ContractDetailsPage />} />
                        <Route path="/dashboard/projects/:contractId/gantt" element={<GanttPage />} />
                    </Route>

                    <Route path="/" element={<PublicLayout />}>
                        <Route index element={<Home />} />
                        <Route path="certificates" element={<Certificates />} />
                        <Route path="gallery" element={<Gallery />} />
                        <Route path="articles" element={<Articles />} />
                        <Route path="articles/:id" element={<ArticlePage />} /> {/* <-- НОВЫЙ МАРШРУТ */}
                        <Route path="reviews" element={<Reviews />} />
                        <Route path="about" element={<About />} />
                        <Route path="call" element={<Call />} />
                        <Route path="login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                        <Route path="signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
                        <Route path="/join-project/:contractId" element={<BrigadeInvitationPage />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
