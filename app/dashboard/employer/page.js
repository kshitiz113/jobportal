"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        if (!data.profile) {
          router.push("/create-profile");
        } else {
          setProfile(data.profile);
          fetchJobs(); // Fetch jobs only after profile is loaded
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    async function fetchJobs() {
      try {
        const res = await fetch("/api/job");
        if (!res.ok) throw new Error("Failed to fetch jobs");

        const data = await res.json();
        setJobs(data.jobs || []);

        data.jobs.forEach((job) => fetchApplications(job.id));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }

    async function fetchApplications(jobId) {
      try {
        const res = await fetch(`/api/applications/${jobId}`);
        if (!res.ok) throw new Error(`Failed to fetch applications for job ${jobId}`);

        const data = await res.json();
        setApplications((prev) => ({ ...prev, [jobId]: data.applications || [] }));
      } catch (error) {
        console.error(`Error fetching applications for job ${jobId}:`, error);
      }
    }

    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    setNewJob((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleJobPost = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/job/[id]", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });

      if (!res.ok) throw new Error("Failed to post job");

      alert("Job posted successfully!");
      setNewJob({ title: "", company: "", location: "", salary: "", description: "" });
      fetchJobs();
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-1/4 p-6 bg-gray-800">
        <div className="flex flex-col items-center">
          <h2 className="mt-4 text-lg font-semibold">{profile?.name || "Employer"}</h2>
        </div>
        <nav className="mt-6 space-y-4">
          <button className="w-full text-left" onClick={() => router.push("/job-employer")}>
            📌 Wishlist
          </button>
          <button className="w-full text-left">
            🔔 Notifications</button>
          <button className="w-full text-left px-4 py-2 bg-gray-700 rounded" onClick={() => router.push("/change-password")}>
            🔑 Change Password
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <div className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Post a Job</h3>
          <form onSubmit={handleJobPost} className="space-y-4">
            <input type="text" name="title" placeholder="Job Title" value={newJob.title} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" required />
            <input type="text" name="company" placeholder="Company Name" value={newJob.company} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" required />
            <input type="text" name="location" placeholder="Location" value={newJob.location} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" required />
            <input type="text" name="salary" placeholder="Salary" value={newJob.salary} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" required />
            <textarea name="description" placeholder="Job Description" value={newJob.description} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" required />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white">Post Job</button>
          </form>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold"></h3>
          <button
            onClick={() => router.push("/application")}
            className="bg-blue-500 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-400 transition"
          >
            View Applicant Details
          </button>
        </div>

       
      </main>
    </div>
  );
}
