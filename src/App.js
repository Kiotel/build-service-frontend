import "./css/styles.css";
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from "react-router-dom";

// Layouts and Context (These paths are correct)
import DashboardLayout from "./layouts/DashboardLayout";
import { AuthProvider } from "./context/AuthContext";

// --- ALL PATHS CORRECTED TO MATCH YOUR FOLDER STRUCTURE ---
import Certificats from "./components/certificates/Certcon"; // Assuming Certificates.js is in /components/certificates
import Gallery from "././components/gallerycon/Gallerycon"; // etc.
import Articles from "./components/articles/Artcon";
import Reviews from "./components/reviews/Revcon";
import About from "./components/about/Aboutcon";
import Call from "./components/call/Callcon";

import Signup from "./components/signup/Signcon.js";
import Login from "./components/login/Login.js";
import CustomerDashboard from "./components/dashboard/Dashboard.js";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.js";

// UI Components
import Navbar from "./components/navbar/Navbar";
import Callbtn from "./components/callbtn/Callbtn";
import Home from "./pages/Home";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

// Layout for all public-facing pages
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
                        {/* DASHBOARD ROUTES */}
                        <Route
                            path="/dashboard"
                            element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
                        >
                            <Route index element={<CustomerDashboard />} />
                        </Route>

                        {/* PUBLIC ROUTES */}
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
                        </Route>
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;