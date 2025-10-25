import React, { useState } from "react";
import { FaPlus, FaFilter, FaSort } from "react-icons/fa";

const Home = () => {
  const dummyData = Array.from({ length: 42 }, (_, i) => ({
    id: i + 1,
    title: `Campaign ${i + 1}`,
    image: `https://via.placeholder.com/400x200.png?text=Campaign+${i + 1}`,
    participants: Math.floor(Math.random() * 200),
    views: Math.floor(Math.random() * 3000),
    rate: `$${10 + i}`,
    performance: ["Excellent", "Good", "Average"][i % 3],
    progress: Math.floor(Math.random() * 100),
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 9;
  const totalPages = Math.ceil(dummyData.length / perPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const paginatedData = dummyData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pt-6 lg:pt-10 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      {/* Main container */}
      <main className="container mx-auto px-6">
        {/* Card wrapper */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* Header bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              Get Started with Clipping
            </h1>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-lg bg-white">
                <FaFilter className="text-gray-500" />
                <select className="outline-none text-sm">
                  <option>All Categories</option>
                  <option>Photography</option>
                  <option>Marketing</option>
                  <option>Design</option>
                </select>
              </div>

              <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-lg bg-white">
                <FaSort className="text-gray-500" />
                <select className="outline-none text-sm">
                  <option>Sort by</option>
                  <option>Most Viewed</option>
                  <option>Top Rated</option>
                  <option>Newest</option>
                </select>
              </div>

              <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
                <FaPlus /> Create
              </button>
            </div>
          </div>

          {/* Grid content */}
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {paginatedData.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
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
                          : item.performance === "Good"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.performance}
                    </span>
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-10 px-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-indigo-50 text-gray-700"
            }`}
          >
            Previous
          </button>

          <div className="flex gap-2 items-center">
            {getVisiblePages().map((page, index) =>
              page === "..." ? (
                <span key={index} className="px-2 text-gray-400">...</span>
              ) : (
                <button
                  key={index}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded-md transition ${
                    currentPage === page
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white hover:bg-indigo-50 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-indigo-50 text-gray-700"
            }`}
          >
            Next
          </button>
        </div>
      </main>

      {/* Floating chat button */}
      <button className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50">
        Chat
      </button>
    </div>
  );
};

export default Home;