import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './pages/header/Header';
import Login from './pages/auth/login/Login';
import Signup from './pages/auth/signup/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import PostIssue from "./pages/post/Post";

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="min-h-screen bg-[#181818] text-blue-100">
      <Header />
      <Routes>
        {/* Default Route Redirects to Dashboard */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/post" element={
        <PostIssue />
        } />
      </Routes>
      
    </div>
  );
}

export default App;
