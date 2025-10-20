export default function JobCard({ job }) {
  return (
    <div className="border p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold">{job.title}</h3>
      <p className="text-gray-600">{job.description}</p>
      <p className="mt-2 font-semibold text-green-600">Reward: Rp {job.reward}</p>
    </div>
  );
}
