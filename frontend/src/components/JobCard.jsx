export default function JobCard({ job }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>

      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
        {job.description || "No description available."}
      </p>

      <div className="mt-4 flex justify-between items-center">
        <p className="font-medium text-green-600 text-sm">
          💰 Reward: Rp {job.reward?.toLocaleString() || "0"}
        </p>
        <button className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
          Apply
        </button>
      </div>
    </div>
  );
}
