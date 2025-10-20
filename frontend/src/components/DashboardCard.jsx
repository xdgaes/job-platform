import React from "react";

function DashboardCard({ title, image, views, rate, participants, progress }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg mb-1">{title}</h3>
        <div className="text-sm text-gray-500 mb-2">Participants: {participants}</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-700 mt-2">
          <div><strong>${rate}</strong> / 1k Views</div>
          <div>{views.toLocaleString()} Views</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
