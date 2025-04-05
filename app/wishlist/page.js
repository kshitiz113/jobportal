'use client'
import { useEffect, useState } from "react";

export default function Wishlist() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  async function fetchAppliedJobs() {
    try {
      const res = await fetch("/api/wishlist", { credentials: "include" });
      const data = await res.json();

      if (res.ok) {
        setAppliedJobs(data.jobs || []);
      } else {
        console.error("Error fetching wishlist:", data.error);
        setAppliedJobs([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setAppliedJobs([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">My Wishlist</h1>
            <p className="text-gray-400 mt-1">Your saved job applications</p>
          </div>
          <div className="bg-blue-900/30 px-4 py-2 rounded-full text-blue-400 border border-blue-800/50">
            {appliedJobs.length} {appliedJobs.length === 1 ? 'Job' : 'Jobs'}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-gray-800/50 rounded-lg animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : appliedJobs && appliedJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-1">No jobs applied yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">When you apply to jobs, they will appear here for easy tracking.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {appliedJobs.map((job, index) => (
              <li key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-200"></div>
                <div className="relative p-5 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
                        {job.job_title}
                      </h2>
                      <p className="text-blue-300">{job.company_name}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
                      Applied
                    </span>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {job.applied_at}
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200">
                      View Details
                    </button>
                    <button className="text-xs px-3 py-1 bg-blue-900/50 hover:bg-blue-800/50 text-blue-300 rounded-md transition-colors duration-200">
                      Track Status
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}