import React from "react";
import { Link } from "react-router-dom";
import { Search, MessageCircle, Menu, Wallet } from "lucide-react";

function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="h-8" />
            <span className="text-xl font-bold text-indigo-600">CLIPPA</span>
          </Link>

          {/* Navigation links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/leaderboard"
              className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              to="/program"
              className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Program
            </Link>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div className="relative hidden sm:block w-48">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Message Icon */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <MessageCircle className="h-5 w-5 text-gray-600" />
          </button>

          {/* Wallet Button */}
          <button className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
            <Wallet className="h-4 w-4" />
            <span>Wallet</span>
          </button>

          {/* Menu Icon */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
