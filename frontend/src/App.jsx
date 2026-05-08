import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Header from "./pages/header/Header";
import Login from "./pages/auth/login/Login";
import Signup from "./pages/auth/signup/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import PostIssue from "./pages/post/Post";
import { handleError } from "./utils/utils";
import { useRef, useEffect } from "react";
import IssueDetails from "./pages/post/IssueDetails";
import Profile from "./pages/profile/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./pages/admin/AdminRoute";
import LandingPage from "./pages/landing/LandingPage";
import ChatBot from "./components/ChatBot";
import { expireSession, getStoredToken, getValidToken } from "./utils/auth";

const ProtectedRoute = ({ children }) => {
  const token = getValidToken();
  const storedToken = getStoredToken();
  const hasShownToast = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (!token && !hasShownToast.current) {
      if (storedToken) expireSession();
      else handleError("Login required!");
      hasShownToast.current = true;
    }
  }, [token, storedToken, location]);

  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        {/* Welcome / landing page */}
        <Route path="/"    element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login"   element={<Login />} />
        <Route path="/signup"  element={<Signup />} />

        {/* Issues dashboard (public) */}
        <Route path="/home"    element={<Dashboard />} />

        {/* Protected */}
        <Route path="/post"        element={<ProtectedRoute><PostIssue /></ProtectedRoute>} />
        <Route path="/issue/:id"   element={<ProtectedRoute><IssueDetails /></ProtectedRoute>} />
        <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>

      <ChatBot />
    </div>
  );
}

export default App;
