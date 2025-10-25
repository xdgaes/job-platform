import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const Leaderboard = () => {
  // Dummy stats
  const totalClippers = 128;
  const totalViews = 54321;
  const totalCampaigns = 42;

  // Dummy top users
  const topUsers = Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    name: `User ${i + 1}`,
    campaigns: Math.floor(Math.random() * 20),
    views: Math.floor(Math.random() * 1000),
  }));

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, time: new Date().toLocaleTimeString() }]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pt-6 lg:pt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0 px-6 pb-4">
              Leaderboard
        </h1>
      <main className="container mx-auto px-6 flex-grow mb-10">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-gray-500">Total Clippers</h3>
            <p className="text-2xl font-bold text-indigo-600">{totalClippers}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-gray-500">Total Views</h3>
            <p className="text-2xl font-bold text-indigo-600">{totalViews}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-gray-500">Total Campaigns</h3>
            <p className="text-2xl font-bold text-indigo-600">{totalCampaigns}</p>
          </div>
        </div>

        {/* Top Users Table */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Top Users</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border-b px-4 py-2 text-left text-gray-500">#</th>
                <th className="border-b px-4 py-2 text-left text-gray-500">User</th>
                <th className="border-b px-4 py-2 text-left text-gray-500">Campaigns</th>
                <th className="border-b px-4 py-2 text-left text-gray-500">Views</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user) => (
                <tr key={user.rank} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="border-b px-4 py-2">{user.rank}</td>
                  <td className="border-b px-4 py-2">{user.name}</td>
                  <td className="border-b px-4 py-2">{user.campaigns}</td>
                  <td className="border-b px-4 py-2">{user.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Floating Chat */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {chatOpen && (
          <div className="w-72 bg-white dark:bg-gray-800 shadow-lg rounded-xl flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="flex justify-between items-center px-4 py-2 bg-indigo-600 text-white">
              <span>Chat</span>
              <button onClick={() => setChatOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 space-y-2 max-h-64 overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-gray-400 text-sm">No messages yet</p>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className="text-sm text-gray-700 dark:text-gray-200">
                  <span className="font-medium mr-1">You:</span>
                  {msg.text}{" "}
                  <span className="text-gray-400 text-xs">({msg.time})</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex border-t border-gray-200 dark:border-gray-700 p-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Chat Toggle Button */}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg"
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;