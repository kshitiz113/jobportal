"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Notifications from "@/components/Notifications";

export default function JobSeekerDashboard() {
  const router = useRouter();
  const [profileExists, setProfileExists] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState("jobs");
  const [loading, setLoading] = useState({
    jobs: true,
    quizzes: true,
    profile: true
  });

  async function fetchJobs(query = "") {
    try {
      setLoading(prev => ({...prev, jobs: true}));
      const res = await fetch(`/api/job?search=${query}`);
      const data = await res.json();
      setJobs(data.job || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(prev => ({...prev, jobs: false}));
    }
  }

  async function fetchQuizzes() {
    try {
      setLoading(prev => ({...prev, quizzes: true}));
      const res = await fetch('/api/quiz/available');
      const data = await res.json();
      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(prev => ({...prev, quizzes: false}));
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
      });
      
      if (res.ok) {
        toast.success('Logged out successfully');
        router.push('/auth');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(prev => ({...prev, profile: true}));
        const res = await fetch("/api/profile");
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await res.json();
        setProfileExists(data.profileExists);
        if (!data.profileExists) {
          toast.error("Please complete your profile to access all features");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to verify profile");
        setProfileExists(false);
      } finally {
        setLoading(prev => ({...prev, profile: false}));
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
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 hidden md:block">
        <div className="text-center mb-8">
          <h2 className="mt-2 text-xl font-bold text-white">
            {loading.profile ? (
              <span className="animate-pulse">Loading...</span>
            ) : profileExists ? (
              "Welcome Back"
            ) : (
              <span className="text-red-400">Profile Incomplete</span>
            )}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {profileExists ? "Ready for new opportunities" : "Complete your profile to get started"}
          </p>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          <button
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
              activeTab === "jobs" 
                ? "bg-blue-900/50 text-blue-300 font-medium" 
                : "text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("jobs")}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Job Listings
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
              activeTab === "quizzes" 
                ? "bg-blue-900/50 text-blue-300 font-medium" 
                : "text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("quizzes")}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Available Quizzes
          </button>
          <button
            className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center text-gray-300 hover:bg-gray-700"
            onClick={goToWishlist}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            My Wishlist
          </button>
          <button 
            className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center text-gray-300 hover:bg-gray-700"
            onClick={() => router.push("/change-password")}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Change Password
          </button>
          <Link href="/chat" className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center text-gray-300 hover:bg-gray-700">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat
          </Link>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center text-gray-300 hover:bg-red-900/50 hover:text-red-300 mt-4"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </nav>
      </aside>

      {/* Rest of the component remains the same */}
      <main className="flex-1 p-6 max-w-6xl mx-auto">
        {/* Header with Notifications */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="w-full md:w-auto md:flex-1">
            <h1 className="text-2xl font-bold text-white mb-2 md:mb-0">Dashboard</h1>
          </div>
          <div className="w-full md:w-auto flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder={activeTab === "jobs" ? "Search jobs..." : "Search quizzes..."}
                value={search}
                onChange={handleSearch}
                className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Notifications />
            <button
              className={`px-4 py-2 rounded-lg transition-all flex items-center ${
                profileExists 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
              onClick={() => router.push(profileExists ? "/profile" : "/create-profile")}
            >
              {profileExists ? "View Profile" : "Create Profile"}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex mb-6 border-b border-gray-700">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === "jobs" 
                ? "border-b-2 border-blue-500 text-blue-400" 
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("jobs")}
          >
            Jobs
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === "quizzes" 
                ? "border-b-2 border-blue-500 text-blue-400" 
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("quizzes")}
          >
            Quizzes
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "jobs" ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Available Jobs</h2>
            {loading.jobs ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-6 bg-gray-800 rounded-lg border border-gray-700 animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-700 rounded w-32"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                      <p className="text-gray-300">{job.company}</p>
                      {job.location && (
                        <p className="text-sm text-gray-400 mt-1 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-xs font-medium rounded-full">
                      {job.type || "Full-time"}
                    </span>
                  </div>
                  {job.description && (
                    <p className="mt-3 text-gray-400 line-clamp-2">{job.description}</p>
                  )}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                    <button 
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                      onClick={() => router.push(`/job/${job.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-gray-800 rounded-lg border border-gray-700">
                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-white">No jobs found</h3>
                <p className="mt-1 text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Available Quizzes</h2>
            {loading.quizzes ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-6 bg-gray-800 rounded-lg border border-gray-700 animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-700 rounded w-32"></div>
                  </div>
                ))}
              </div>
            ) : quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div key={quiz.id} className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{quiz.title}</h3>
                      {quiz.description && (
                        <p className="mt-1 text-gray-400">{quiz.description}</p>
                      )}
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        For: {quiz.job_title} at {quiz.company_name}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-xs font-medium rounded-full">
                      {quiz.questions_count || "0"} questions
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors flex items-center"
                      onClick={() => router.push(`/quiz/take/${quiz.id}`)}
                    >
                      Take Quiz
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-gray-800 rounded-lg border border-gray-700">
                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-white">No quizzes available</h3>
                <p className="mt-1 text-gray-400">Check back later for new assessment opportunities.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}