"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function JobSeekerDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
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
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Error fetching profile");

        if (!data.profileExists) {
          toast.error("Profile not found. Please create one.");
          router.push("/api/create-profile");
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to verify profile.");
      }
    }

    fetchProfile();
    fetchJobs();
  }, [router]);

  function handleSearch(e) {
    setSearch(e.target.value);
    fetchJobs(e.target.value);
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-800 p-6">
        <div className="text-center">
          <img
            src={profile?.photo || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full border-2 border-white"
          />
          <h2 className="mt-2 text-lg font-semibold">{profile?.full_name || "Loading..."}</h2>
        </div>

        <nav className="mt-6 space-y-4">
          <button className="w-full text-left px-4 py-2 bg-gray-700 rounded">Wishlist</button>
          <button className="w-full text-left px-4 py-2 bg-gray-700 rounded">Notifications</button>
          <button className="w-full text-left px-4 py-2 bg-gray-700 rounded">Change Password</button>
          <button className="w-full text-left px-4 py-2 bg-gray-700 rounded">Chat</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={handleSearch}
            className="w-full px-4 py-2 bg-gray-700 rounded text-white"
          />
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="p-4 bg-gray-800 rounded">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-400">{job.company}</p>
                <button 
                  className="mt-2 px-4 py-2 bg-blue-500 rounded text-white"
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
