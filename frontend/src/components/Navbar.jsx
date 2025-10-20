import React from "react";

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm border-b border-gray-100">
      <div className="flex items-center gap-6">
        <img src="/logo.svg" alt="Logo" className="h-8" />
        <a href="/" className="font-medium text-gray-700 hover:text-indigo-600">Dashboard</a>
        <a href="/" className="font-medium text-gray-700 hover:text-indigo-600">Leaderboard</a>
        <a href="/" className="font-medium text-gray-700 hover:text-indigo-600">Program</a>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search"
          className="border rounded-lg px-3 py-1 text-sm focus:outline-none"
        />
        <button className="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800">
          Wallet
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
