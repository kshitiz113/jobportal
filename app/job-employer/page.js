"use client";
import { useEffect, useState } from "react";

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchJobs() {
    try {
      const res = await fetch("/api/job-employer", {
        credentials: "include",
      });

      console.log("Response status:", res.status);
      const text = await res.text();
      console.log("Response body:", text);

      if (!res.ok) {
        throw new Error(`Failed to fetch jobs: ${res.status} - ${text}`);
      }

      const data = JSON.parse(text);
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error.message);
    } finally {
      setLoading(false);
    }
  }

  // Call fetchJobs when the component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Your Job Posts</h1>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length > 0 ? (
        <div className="w-full max-w-3xl space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-400">{job.company} - {job.location}</p>
              <p className="text-gray-500"> Salary: {job.salary}</p>
              <p className="text-gray-400 mt-2">{job.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No jobs posted yet.</p>
      )}
    </div>
  );
}