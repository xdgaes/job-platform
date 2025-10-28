export default function JobCard({ job }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">{job.title}</h3>

      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
        {job.description || "No description available."}
      </p>

      <div className="mt-4 flex justify-between items-center">
        <p className="font-medium text-green-600 dark:text-green-400 text-sm">
          💰 Reward: Rp {job.reward?.toLocaleString() || "0"}
        </p>
        <button className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
          Apply
        </button>
      </div>
    </div>
  );
}
