import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import JobList from "./pages/JobList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Leaderboard from "./pages/Leaderboard";
import CampaignDetails from "./pages/CampaignDetails";
import ConnectedAccounts from "./pages/ConnectedAccounts";
import Wallet from "./pages/Wallet";
import CreateCampaign from "./pages/CreateCampaign";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import PrivateRoute from "./components/PrivateRoute";

// Wrapper untuk memeriksa route saat ini
function AppWrapper() {
  const location = useLocation();
  const routesWithoutNavbar = [
    "/profile",
    "/edit-profile",
    "/connected-accounts",
    "/wallet",
    "/create-campaign",
  ];
  const hideNavbar = routesWithoutNavbar.includes(location.pathname);

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
          <Route
            path="/campaigns/:campaignId"
            element={
              <PrivateRoute>
                <CampaignDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/connected-accounts"
            element={
              <PrivateRoute>
                <ConnectedAccounts />
              </PrivateRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <PrivateRoute>
                <Wallet />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-campaign"
            element={
              <PrivateRoute>
                <CreateCampaign />
              </PrivateRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
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