import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";

export default function JobList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/jobs`, { params: { page, limit } })
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.items ? res.data : { items: res.data, total: res.data?.length || 0, page: 1, limit };
        setItems(data.items);
        setTotalPages(Math.max(1, Math.ceil((data.total || 0) / (data.limit || limit))));
      })
      .catch((err) => console.error(err))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [page, limit]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          🎯 Available <span className="text-blue-600">Jobs</span>
        </h2>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading jobs…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No jobs available right now.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
      {/* Pagination */}
      <div className="max-w-6xl mx-auto mt-8 flex items-center justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          className={`px-3 py-1.5 rounded border text-sm ${page === 1 || loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-50"}`}
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">Page {page} / {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || loading}
          className={`px-3 py-1.5 rounded border text-sm ${page === totalPages || loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-50"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}