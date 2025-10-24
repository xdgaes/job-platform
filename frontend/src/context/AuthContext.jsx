import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mode, setMode] = useState("clipper"); // clipper / creator

  // Load user & mode dari localStorage saat pertama kali mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedMode = localStorage.getItem("mode");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    if (storedMode) setMode(storedMode);
  }, []);

  // Fungsi login real
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  };

  // Fungsi register real
  const register = async (name, email, password) => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Setelah register sukses, langsung login
        return await login(email, password);
      } else {
        return { success: false, message: data.message || "Register failed" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const toggleMode = () => {
    const newMode = mode === "clipper" ? "creator" : "clipper";
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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
