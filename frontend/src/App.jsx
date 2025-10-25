import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import JobList from "./pages/JobList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Leaderboard from "./pages/Leaderboard";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Komponen PrivateRoute — hanya untuk user login
function PrivateRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Wrapper untuk memeriksa route saat ini
function AppWrapper() {
  const location = useLocation();

  // Sembunyikan navbar global jika route profile
  const hideNavbar = location.pathname === "/profile" || location.pathname === "/edit-profile";

  const [darkMode, setDarkMode] = useState(false);

  // Ambil preferensi dark mode dari localStorage saat pertama kali load
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Simpan ke localStorage setiap kali darkMode berubah
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Navbar global */}
      {!hideNavbar && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}

      {/* Isi halaman */}
      <main className="flex-grow">
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

          {/* Fallback: route tidak ada */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Footer global */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;
