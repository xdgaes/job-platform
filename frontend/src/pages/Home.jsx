import React from "react";
import { FaSearch, FaUserCircle, FaWallet } from "react-icons/fa";

const Dashboard = () => {
  const dummyData = [
    {
      id: 1,
      title: "Product Photography",
      participants: 126,
      views: 1520,
      rate: "$20",
      performance: "Excellent",
      progress: 85,
      image: "https://via.placeholder.com/400x200.png?text=Campaign+1",
    },
    {
      id: 2,
      title: "Outdoor Lifestyle Shoot",
      participants: 98,
      views: 940,
      rate: "$18",
      performance: "Good",
      progress: 70,
      image: "https://via.placeholder.com/400x200.png?text=Campaign+2",
    },
    {
      id: 3,
      title: "Brand Collaboration",
      participants: 75,
      views: 860,
      rate: "$25",
      performance: "Excellent",
      progress: 90,
      image: "https://via.placeholder.com/400x200.png?text=Campaign+3",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-sm py-3 px-8 flex justify-between items-center sticky top-0 z-10">
        <div className="text-2xl font-bold text-blue-600 tracking-wide">CLIPPA</div>

        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-blue-600 transition">Dashboard</a>
          <a href="#" className="hover:text-blue-600 transition">Leaderboard</a>
          <a href="#" className="hover:text-blue-600 transition">Program</a>

          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none ml-2 text-sm w-28 sm:w-40"
            />
          </div>

          <FaWallet className="text-gray-600 text-xl cursor-pointer hover:text-blue-600 transition" />
          <FaUserCircle className="text-gray-600 text-2xl cursor-pointer hover:text-blue-600 transition" />
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Get Started with <span className="text-blue-600">Clipping</span>
        </h1>

        {/* Cards Grid */}
        <div className="grid gap-8 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {dummyData.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-2xl shadow hover:shadow-lg transition duration-300 overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-44 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>👥 Participants: <span className="font-medium text-gray-800">{item.participants}</span></p>
                  <p>👁️ Views: <span className="font-medium text-gray-800">{item.views}</span></p>
                  <p>💲 Rate: <span className="font-medium text-gray-800">{item.rate}</span></p>
                  <p>
                    ⚡ Performance:{" "}
                    <span
                      className={`font-semibold ${
                        item.performance === "Excellent"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {item.performance}
                    </span>
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-10 gap-2">
          {["1", "2", "3"].map((num) => (
            <button
              key={num}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white transition"
            >
              {num}
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-blue-600 font-bold text-lg">CLIPPA</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-blue-600">Contact</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Terms</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;