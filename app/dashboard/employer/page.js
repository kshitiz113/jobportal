'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployerDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', company: '', description: '' });

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch('/api/profile', { headers: { 'user-email': 'test@example.com' } });
      const data = await res.json();

      if (!data.profile) {
        router.push('/create-profile');
      } else {
        setProfile(data.profile);
        fetchJobs();
      }
    }

    async function fetchJobs() {
      const res = await fetch('/api/job');
      const data = await res.json();
      setJobs(data.jobs);
    }

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleJobPost = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newJob),
    });

    if (res.ok) {
      alert('Job posted successfully!');
      setNewJob({ title: '', company: '', description: '' });
      fetchJobs();
    } else {
      alert('Failed to post job');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-1/4 p-6 bg-gray-800">
        <div className="flex flex-col items-center">
          <img src={profile?.photo || '/default-avatar.png'} alt="Profile" className="w-24 h-24 rounded-full border" />
          <h2 className="mt-4 text-lg font-semibold">{profile?.name}</h2>
        </div>
        <nav className="mt-6 space-y-4">
          <button className="w-full text-left">📌 Wishlist</button>
          <button className="w-full text-left">🔔 Notifications</button>
          <button className="w-full text-left">🔑 Change Password</button>
          <button className="w-full text-left">📝 Post Job</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Job Posting Form */}
        <div className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Post a Job</h3>
          <form onSubmit={handleJobPost} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={newJob.title}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
              required
            />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={newJob.company}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
              required
            />
            <textarea
              name="description"
              placeholder="Job Description"
              value={newJob.description}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
              required
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white">
              Post Job
            </button>
          </form>
        </div>

        {/* Posted Jobs */}
        <h3 className="text-lg font-semibold mb-4">Your Posted Jobs</h3>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={jobs.id} className="p-4 bg-gray-800 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{jobs.title}</h3>
              <p className="text-gray-400">{jobs.company}</p>
              <p className="text-gray-500">{jobs.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
