"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EmployerDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });
  const [applications, setApplications] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [salaryError, setSalaryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch profile
        const profileRes = await fetch("/api/profile", { credentials: "include" });
        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        
        const profileData = await profileRes.json();
        if (!profileData.profile) {
          router.push("/create-profile");
          return;
        }
        
        setProfile(profileData.profile);
        
        // Fetch jobs
        const jobsRes = await fetch("/api/job");
        if (!jobsRes.ok) throw new Error("Failed to fetch jobs");
        
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);
        
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for salary field
    if (name === "salary") {
      // Only allow numbers and commas/periods for formatting
      const numericValue = value.replace(/[^0-9]/g, '');
      
      // Validate if it's a valid number
      if (numericValue && !/^\d+$/.test(numericValue)) {
        setSalaryError("Please enter a valid number");
        return;
      } else {
        setSalaryError("");
      }
      
      // Format with commas for display
      const formattedValue = numericValue 
        ? parseInt(numericValue, 10).toLocaleString()
        : "";
      
      setNewJob(prev => ({ ...prev, [name]: formattedValue }));
    } 
    // Handling for description field
    else if (name === "description") {
      setNewJob(prev => ({ ...prev, [name]: value }));
      
      // Validate minimum length
      if (value.length > 0 && value.length < 50) {
        setDescriptionError("Description must be at least 50 characters");
      } else {
        setDescriptionError("");
      }
    } else {
      setNewJob(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogout = async () => {
    const router = useRouter();
  
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
      });
  
      if (res.ok) {
        toast.success('Logged out successfully ✨', { autoClose: 2000 });
        router.push('/auth');  // Redirect to login/auth page
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Logout failed');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleJobPost = async (e) => {
    e.preventDefault();
    
    // Validate salary before submission
    const numericSalary = newJob.salary.replace(/[^0-9]/g, '');
    if (!numericSalary || !/^\d+$/.test(numericSalary)) {
      setSalaryError("Please enter a valid salary amount");
      return;
    }
    
    // Validate description length
    if (newJob.description.length < 50) {
      setDescriptionError("Description must be at least 50 characters");
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await fetch("/api/job/[id]", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newJob,
          salary: `$${parseInt(numericSalary, 10).toLocaleString()}`,
        }),
      });

      if (!res.ok) throw new Error("Failed to post job");

      // Refresh jobs after successful post
      const jobsRes = await fetch("/api/job");
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);
      }

      setNewJob({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
      });
      setSalaryError("");
      setDescriptionError("");
    } catch (error) {
      console.error("Error posting job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-3">
            {profile?.name ? (
              <span className="text-xl font-semibold">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className="text-xl font-semibold">E</span>
            )}
          </div>
          <h2 className="text-lg font-semibold">
            {profile?.name || "Employer Dashboard"}
          </h2>
          <p className="text-sm text-gray-400">{profile?.company || ""}</p>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => router.push("/job-employer")}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span>📌</span>
            <span>Job Wishlist</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
            <span>🔔</span>
            <span>Notifications</span>
          </button>
          <button
            onClick={() => router.push("/change-password")}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span>🔑</span>
            <span>Change Password</span>
          </button>
          <Link
            href="/chat"
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span>💬</span>
            <span>Messaging</span>
          </Link>
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

        <div className="mt-auto pt-4 border-t border-gray-700">
          <button className="w-full text-left px-4 py-2 text-gray-400 hover:text-white transition-colors">
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Employer Dashboard</h1>
          
          {/* Job Posting Form */}
          <div className="mb-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Post New Job Opportunity</h3>
            <form onSubmit={handleJobPost} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g. Senior Frontend Developer"
                  value={newJob.title}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="Company Name"
                    value={newJob.company}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="e.g. Remote, New York, etc."
                    value={newJob.location}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-1">
                  Salary (USD)
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  placeholder="e.g. 90000 (numbers only)"
                  value={newJob.salary}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  required
                />
                {salaryError && (
                  <p className="mt-1 text-sm text-red-500">{salaryError}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Job Description (Minimum 50 characters)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Detailed job description, requirements, benefits..."
                  value={newJob.description}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  required
                />
                {descriptionError && (
                  <p className="mt-1 text-sm text-red-500">{descriptionError}</p>
                )}
                <p className="mt-1 text-sm text-gray-400">
                  {newJob.description.length}/50 characters (minimum)
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || descriptionError || salaryError}
                className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isLoading ? "Posting..." : "Post Job"}
              </button>
            </form>
          </div>

          {/* Applications Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Job Applications</h3>
              <button
                onClick={() => router.push("/application")}
                className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Applicant Details
              </button>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div key={job.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{job.title}</h4>
                        <p className="text-gray-400">{job.company} • {job.location}</p>
                        <p className="text-blue-400 mt-1">${job.salary}</p>
                      </div>
                      <span className="bg-gray-700 text-xs px-3 py-1 rounded-full">
                        {applications[job.id]?.length || 0} applicants
                      </span>
                    </div>
                    <p className="mt-3 text-gray-300 line-clamp-2">{job.description}</p>
                  </div>
                ))
              ) : (
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 text-center">
                  <p className="text-gray-400">No jobs posted yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}