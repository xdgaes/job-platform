import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, MessageCircle, Menu, Wallet } from "lucide-react";

function Navbar({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);

  // Shadow muncul saat scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* LEFT */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="h-8" />
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              CLIPPA
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/leaderboard"
              className="font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              to="/program"
              className="font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors"
            >
              Program
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 relative">
          {/* Search */}
          <div className="relative hidden sm:block w-48">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Message Icon */}
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <MessageCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Wallet */}
          <button className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
            <Wallet className="h-4 w-4" />
            <span>Wallet</span>
          </button>

          {/* Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 transition-all duration-200">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Profile
                </Link>
                <Link
                  to="/support"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Support
                </Link>
                <Link
                  to="/faq"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  FAQ
                </Link>

                {/* Dark Mode */}
                <div className="px-4 py-2 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Dark Mode</span>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${
                      darkMode ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                        darkMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;