import { useEffect, useState } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load jobs. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          🎯 Available <span className="text-blue-600 dark:text-blue-400">Jobs</span>
        </h2>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                </div>
                <div className="mt-4 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 dark:text-red-400">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">No jobs available right now.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}