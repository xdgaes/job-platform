import { useEffect, useState } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          🎯 Available <span className="text-blue-600">Jobs</span>
        </h2>

        {jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No jobs available right now.
          </div>
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