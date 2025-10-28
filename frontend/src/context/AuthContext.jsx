import React, { createContext, useState, useEffect } from "react";
import API_BASE_URL from "../config/api";

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
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
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
        // Set mode based on user's currentRole from database
        if (data.user.currentRole) {
          setMode(data.user.currentRole);
          localStorage.setItem("mode", data.user.currentRole);
        }
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
  const register = async (name, email, password, currentRole = "clipper") => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, currentRole }),
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

  // Switch role and update in database
  const switchRole = async (newRole) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/auth/switch-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ currentRole: newRole }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update token and user with new role
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("mode", data.user.currentRole);
        setUser(data.user);
        setMode(data.user.currentRole);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Failed to switch role" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  };

  const toggleMode = async () => {
    const newMode = mode === "clipper" ? "creator" : "clipper";
    await switchRole(newMode);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        mode,
        setUser,
        login,
        register,
        logout,
        toggleMode,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
