'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProfile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    full_name: '',
    skills: '',
    college_name: '',
    course: '',
    tenth_percentage: '',
    twelfth_percentage: '',
    github_id: '',
    email: '', // Auto-filled from backend
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile', { credentials: 'include' });
        const data = await res.json();

        if (res.ok) {
          if (data.profileExists) {
            setProfileData(data.profile);
          } else {
            setProfileData((prev) => ({ ...prev, email: data.email }));
          }
        } else {
          setError(data.error || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('Error fetching profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (profileData.tenth_percentage < 0 || profileData.tenth_percentage > 100 || 
        profileData.twelfth_percentage < 0 || profileData.twelfth_percentage > 100) {
      alert('Percentages must be between 0 and 100.');
      return;
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const result = await res.json();

      if (res.ok) {
        router.push('/profile'); // Redirect after saving
      } else {
        alert(result.error || 'Failed to save profile');
      }
    } catch (err) {
      alert('Error submitting profile');
    }
  }

  if (loading) return <div className="text-center text-white">Loading profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-blue-400">Create Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p>Email: {profileData.email || "Loading..."}</p> 
          <input type="text" placeholder="Full Name" required
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={profileData.full_name}
            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
          />
          <input type="text" placeholder="Skills" required
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={profileData.skills}
            onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
          />
          <input type="text" placeholder="Course" required
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={profileData.course}
            onChange={(e) => setProfileData({ ...profileData, course: e.target.value })}
          />
          <input type="text" placeholder="College Name" required
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={profileData.college_name}
            onChange={(e) => setProfileData({ ...profileData, college_name: e.target.value })}
          />
          <input type="number" placeholder="10th Percentage" required
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={profileData.tenth_percentage}
            onChange={(e) => setProfileData({ ...profileData, tenth_percentage: e.target.value })}
          />
          <input type="number" placeholder="12th Percentage" required
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={profileData.twelfth_percentage}
            onChange={(e) => setProfileData({ ...profileData, twelfth_percentage: e.target.value })}
          />
          <input type="text" placeholder="GitHub ID"
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={profileData.github_id}
            onChange={(e) => setProfileData({ ...profileData, github_id: e.target.value })}
          />
          <button type="submit" className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
