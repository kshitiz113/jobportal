'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProfile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    full_name: '',
    skills: '',
    college: '',
    course: '',
    tenth_percent: '',
    twelfth_percent: '',
    github_id: '',
    email: '', // Email auto-filled
    photo: null, // File upload
  });
  const [photoPreview, setPhotoPreview] = useState('/uploads/default-avatar.png'); // Default image

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile', { credentials: 'include' });
        const data = await res.json();
        if (data.profile) {
          setProfileData(data.profile);
          if (data.profile.photo) setPhotoPreview(data.profile.photo);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      if (profileData[key]) formData.append(key, profileData[key]);
    });

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        credentials: 'include', // Include cookies
        body: formData, // Send as FormData to handle file uploads
      });

      if (res.ok) {
        router.push('/profile'); // Redirect after saving
      } else {
        console.error('Failed to create profile');
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setProfileData({ ...profileData, photo: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-blue-400">Create Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p>Email: {profileData.email}</p> {/* Auto-filled email */}
          
          <div className="flex items-center space-x-4">
            <img src={photoPreview} alt="Profile Photo" className="w-20 h-20 rounded-full border" />
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <input 
            type="text" placeholder="Full Name" required
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={profileData.full_name}
            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
          />
          <input 
            type="text" placeholder="Skills" required
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={profileData.skills}
            onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
          />
          <input 
            type="text" placeholder="Course" required
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={profileData.course}
            onChange={(e) => setProfileData({ ...profileData, course: e.target.value })}
          />
          <input 
            type="text" placeholder="College Name" required
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={profileData.college}
            onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
          />
          <input 
            type="number" placeholder="10th Percentage" required
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={profileData.tenth_percent}
            onChange={(e) => setProfileData({ ...profileData, tenth_percent: e.target.value })}
          />
          <input 
            type="number" placeholder="12th Percentage" required
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={profileData.twelfth_percent}
            onChange={(e) => setProfileData({ ...profileData, twelfth_percent: e.target.value })}
          />
          <input 
            type="text" placeholder="GitHub ID"
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={profileData.github_id}
            onChange={(e) => setProfileData({ ...profileData, github_id: e.target.value })}
          />
          <button 
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
