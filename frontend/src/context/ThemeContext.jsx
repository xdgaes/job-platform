import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

// Initialize dark mode from localStorage before React renders
const getInitialDarkMode = () => {
  try {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  } catch {
    return false;
  }
};

export const ThemeProvider = ({ children }) => {
  // Initialize state with value from localStorage
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  // Update HTML class and localStorage whenever darkMode changes
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    try {
      localStorage.setItem("darkMode", darkMode.toString());
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  }, [darkMode]);

  const toggleMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};