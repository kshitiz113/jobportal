"use client";
import { useEffect, useState } from "react";
import { FiBriefcase, FiDollarSign, FiMapPin, FiClock, FiPlus } from "react-icons/fi";

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchJobs() {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch("/api/job-employer", {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch jobs");
      }

      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(error.message || "An error occurred while loading jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Job Posts</h1>
            <p className="text-gray-400">
              {jobs.length > 0 
                ? `Showing ${jobs.length} ${jobs.length === 1 ? 'job' : 'jobs'}`
                : "Manage your job listings"}
            </p>
          </div>
          <button 
            onClick={() => window.location.href = "/post-job"}
            className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/20"
          >
            <FiPlus className="text-lg" />
            Post New Job
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 text-red-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
            <button 
              onClick={fetchJobs}
              className="mt-4 bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <FiBriefcase className="text-3xl text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Jobs Posted Yet</h3>
            <p className="text-gray-500 mb-6">Get started by posting your first job opportunity</p>
            <button 
              onClick={() => window.location.href = "/post-job"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              Post a Job
            </button>
          </div>
        )}

        {/* Jobs List */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-600 transition-all duration-200 shadow-lg hover:shadow-blue-500/10"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white line-clamp-1">{job.title}</h2>
                    <span className="bg-blue-900/30 text-blue-400 text-xs px-3 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-300">
                      <FiBriefcase className="text-gray-500" />
                      <span className="line-clamp-1">{job.company}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <FiMapPin className="text-gray-500" />
                      <span>{job.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <FiDollarSign className="text-gray-500" />
                      <span>{job.salary}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <FiClock className="text-gray-500" />
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p className="mt-4 text-gray-400 line-clamp-3">{job.description}</p>
                </div>

                <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex justify-between">
                  <button className="text-blue-400 hover:text-blue-300 transition">
                    View Applicants
                  </button>
                  <button className="text-gray-400 hover:text-white transition">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}