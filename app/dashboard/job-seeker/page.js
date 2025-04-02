"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function JobSeekerDashboard() {
  const router = useRouter();
  const [profileExists, setProfileExists] = useState(null); // Track profile existence
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  async function fetchJobs(query = "") {
    try {
      const res = await fetch(`/api/job?search=${query}`);
      const data = await res.json();
      setJobs(data.job || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await res.json();
        setProfileExists(data.profileExists);
        if (!data.profileExists) {
          toast.error("Profile not found. Please create one.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to verify profile.");
        setProfileExists(false);
      }
    }

    fetchProfile();
    fetchJobs();
  }, []);

  function handleSearch(e) {
    setSearch(e.target.value);
    fetchJobs(e.target.value);
  }

  // 🚀 **Navigate to Wishlist Page**
  function goToWishlist() {
    router.push("/wishlist");
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-800 p-6">
        <div className="text-center">
          <h2 className="mt-2 text-lg font-semibold">
            {profileExists === null ? "Loading..." : profileExists ? "Welcome" : "No Profile"}
          </h2>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 space-y-4">
          {/* 🚀 Wishlist Button (Applied Jobs) */}
          <button
            className="w-full text-left px-4 py-2 bg-gray-700 rounded"
            onClick={goToWishlist}
          >
           MY Wishlist 
          </button>
          <button className="w-full text-left px-4 py-2 bg-gray-700 rounded">Notifications</button>
          <button className="w-full text-left px-4 py-2 bg-gray-700 rounded">Change Password</button>
          <button className="w-full text-left px-4 py-2 bg-gray-700 rounded">Chat</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Navigation Bar with Create Profile Button */}
        <div className="flex justify-between mb-6">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={handleSearch}
            className="w-3/4 px-4 py-2 bg-gray-700 rounded text-white"
          />
          <button
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white"
            onClick={() => router.push("/create-profile")}
          >
            Create Profile
          </button>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="p-4 bg-gray-800 rounded">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-400">{job.company}</p>
                <button 
                  className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
                  onClick={() => router.push(`/job/${job.id}`)}
                >
                  Apply Now
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No jobs found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
