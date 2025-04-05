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
        
        // Fetch applications for each job
     /*   await Promise.all(
       //   jobsData.jobs.map(async (job) => {
        //    const appsRes = await fetch(`/api/applications/${job.id}`);
            if (appsRes.ok) {
              const appsData = await appsRes.json();
              setApplications(prev => ({ ...prev, [job.id]: appsData.applications || [] }));
            }
          })
        );*/
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

  const handleChange = (e) => {
    setNewJob((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleJobPost = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch("/api/job/[id]", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
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
                  Salary Range
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  placeholder="e.g. $90,000 - $120,000"
                  value={newJob.salary}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Job Description
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
              </div>

              <button
                type="submit"
                disabled={isLoading}
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
                        <p className="text-blue-400 mt-1">{job.salary}</p>
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
                  <p className="text-gray-400"></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}