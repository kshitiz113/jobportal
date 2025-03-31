"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function JobDetails() {
  const params = useParams();
  const id = params?.id; // Ensure `id` exists
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      console.log("Fetching job for ID:", id);
      fetchJobDetails(id); // Pass ID to function
    }
  }, [id]);

  async function fetchJobDetails() {
    try {
      const res = await fetch(`/api/job/${id}`);
      if (!res.ok) throw new Error("Job not found");
  
      const data = await res.json();
      console.log("Job Data:", data);
      
      // Extract first job from array
      setJob(data.job[0]); 
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div className="flex h-screen bg-gray-900 text-white p-6">
      {loading ? (
        <p>Loading job details...</p>
      ) : job ? (
        <div className="w-full max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-blue-400">{job.title}</h1>
          <p className="text-gray-400">{job.company} - {job.location}</p>
          <p className="mt-2">{job.description}</p>
          <p className="mt-2 font-semibold text-green-400">Salary: {job.salary}</p>

          {/* Upload Resume & Apply Button */}
          <div className="mt-4">
            <input
              type="file"
              className="block w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
            />
            <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
              Apply
            </button>
          </div>
        </div>
      ) : (
        <p className="text-red-500">Job not found</p>
      )}
    </div>
  );
}
