'use client'
import { useEffect, useState } from "react";

export default function Wishlist() {
  const [appliedJobs, setAppliedJobs] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  async function fetchAppliedJobs() {
    try {
      const res = await fetch("/api/wishlist", { credentials: "include" });
      const data = await res.json();

      if (res.ok) {
        setAppliedJobs(data.jobs || []); // Ensure data.jobs is always an array
      } else {
        console.error("Error fetching wishlist:", data.error);
        setAppliedJobs([]); // Handle error by setting an empty array
      }
    } catch (error) {
      console.error("Error:", error);
      setAppliedJobs([]); // Handle error by setting an empty array
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold text-blue-400 mb-4">My Wishlist</h1>

      {loading ? (
        <p>Loading...</p>
      ) : appliedJobs && appliedJobs.length === 0 ? (
        <p className="text-gray-400">No jobs applied yet.</p>
      ) : (
        <ul className="space-y-4">
          {appliedJobs.map((job, index) => (
            <li key={index} className="p-4 bg-gray-800 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-green-400">{job.job_title}</h2>
              <p className="text-gray-400">{job.company_name}</p>
              <p className="text-gray-400">{job.applied_at}</p>
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
