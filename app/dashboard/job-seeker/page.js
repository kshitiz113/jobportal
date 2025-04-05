"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Notifications from "@/components/Notifications";

export default function JobSeekerDashboard() {
  const router = useRouter();
  const [profileExists, setProfileExists] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState("jobs"); // 'jobs' or 'quizzes'

  async function fetchJobs(query = "") {
    try {
      const res = await fetch(`/api/job?search=${query}`);
      const data = await res.json();
      setJobs(data.job || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  async function fetchQuizzes() {
    try {
      const res = await fetch('/api/quiz/available');
      const data = await res.json();
      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
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
    fetchQuizzes();
  }, []);

  function handleSearch(e) {
    setSearch(e.target.value);
    if (activeTab === "jobs") {
      fetchJobs(e.target.value);
    }
  }

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
          <button
            className="w-full text-left px-4 py-2 bg-gray-700 rounded"
            onClick={goToWishlist}
          >
            MY Wishlist 
          </button>
          <button 
            className="w-full text-left px-4 py-2 bg-gray-700 rounded"
            onClick={() => router.push("/change-password")}
          >
            Change Password
          </button>
          <button className="w-full text-left px-4 py-2 bg-gray-700 rounded">Chat</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header with Notifications */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder={activeTab === "jobs" ? "Search jobs..." : "Search quizzes..."}
              value={search}
              onChange={handleSearch}
              className="w-3/4 px-4 py-2 bg-gray-700 rounded text-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <Notifications />
            <button
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white"
              onClick={() => router.push("/create-profile")}
            >
              Create Profile
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 border-b border-gray-700">
          <button
            className={`px-4 py-2 ${activeTab === "jobs" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveTab("jobs")}
          >
            Job Listings
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "quizzes" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveTab("quizzes")}
          >
            Available Quizzes
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "jobs" ? (
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
        ) : (
          <div className="space-y-4">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div key={quiz.id} className="p-4 bg-gray-800 rounded">
                  <h3 className="text-lg font-semibold">{quiz.title}</h3>
                  {quiz.description && (
                    <p className="text-gray-400 mb-2">{quiz.description}</p>
                  )}
                  <p className="text-sm text-gray-400">
                    For: {quiz.job_title} at {quiz.company_name}
                  </p>
                  <button
                    className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
                    onClick={() => router.push(`/quiz/take/${quiz.id}`)}
                  >
                    Take Quiz
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No quizzes available.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}