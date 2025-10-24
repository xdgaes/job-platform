import React, { createContext, useState, useEffect } from "react";

// Buat context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State global untuk login & mode
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("clipper"); // atau "creator"

  // Saat pertama kali load, cek localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedMode = localStorage.getItem("mode");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    if (storedMode) setMode(storedMode);
  }, []);

  // Fungsi login dummy
  const login = (email, password) => {
    // Simulasi login sukses
    const loggedInUser = { email, name: "John Doe" };
    setUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
  };

  // Fungsi register dummy
  const register = (email, password) => {
    // Simulasi register
    const newUser = { email, name: "New User" };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // Fungsi logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  // Ganti mode creator/clipper
  const toggleMode = () => {
    const newMode = mode === "clipper" ? "creator" : "clipper";
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        mode,
        login,
        register,
        logout,
        toggleMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};