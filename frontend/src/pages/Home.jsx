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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-3 px-8 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">CLIPPA</div>

        <div className="flex items-center gap-8">
          <a href="#" className="text-gray-700 hover:text-blue-600">Dashboard</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Leaderboard</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Program</a>

          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none ml-2 text-sm"
            />
          </div>

          <FaWallet className="text-gray-700 text-xl cursor-pointer hover:text-blue-600" />
          <FaUserCircle className="text-gray-700 text-2xl cursor-pointer hover:text-blue-600" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Get Started with Clipping</h1>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {dummyData.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">
                  Participants: <span className="font-medium">{item.participants}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Views: <span className="font-medium">{item.views}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Flat Rate: <span className="font-medium">{item.rate}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Performance:{" "}
                  <span
                    className={`font-medium ${
                      item.performance === "Excellent"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {item.performance}
                  </span>
                </p>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-10 gap-2">
          <button className="px-3 py-1 border rounded-md hover:bg-blue-50">1</button>
          <button className="px-3 py-1 border rounded-md hover:bg-blue-50">2</button>
          <button className="px-3 py-1 border rounded-md hover:bg-blue-50">3</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 mt-auto shadow-inner">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-blue-600 font-bold text-lg">CLIPPA</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-blue-600">Contact Us</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Terms</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
