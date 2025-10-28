import React, { Suspense, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";

// Route-based code splitting
const Home = React.lazy(() => import("./pages/Home"));
const JobList = React.lazy(() => import("./pages/JobList"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Profile = React.lazy(() => import("./pages/Profile"));
const EditProfile = React.lazy(() => import("./pages/EditProfile"));
const Leaderboard = React.lazy(() => import("./pages/Leaderboard"));

// Komponen PrivateRoute — hanya untuk user login
function PrivateRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Wrapper untuk memeriksa route saat ini
function AppWrapper() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/profile" || location.pathname === "/edit-profile";

  // Ambil darkMode dari ThemeContext
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Navbar global, sticky */}
      {!hideNavbar && <Navbar />}

      {/* Main content */}
      <main className="flex-grow">
        <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
          <Routes>
          {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              }
            />

          {/* Fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppWrapper />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;