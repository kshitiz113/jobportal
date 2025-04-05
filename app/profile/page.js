'use client'
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    skills: '',
    course: '',
    college_name: '',
    tenth_percentage: '',
    twelfth_percentage: '',
    github_id: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile', { credentials: 'include' });
      const data = await res.json();

      if (res.ok) {
        if (data.profileExists) {
          setProfile(data.profile);
          setFormData({
            full_name: data.profile.full_name || '',
            skills: data.profile.skills || '',
            course: data.profile.course || '',
            college_name: data.profile.college_name || '',
            tenth_percentage: data.profile.tenth_percentage || '',
            twelfth_percentage: data.profile.twelfth_percentage || '',
            github_id: data.profile.github_id || ''
          });
        }
      } else {
        console.error('Error fetching profile:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await res.json();
      if (res.ok) {
        await fetchProfile(); // Refresh profile data
        setEditMode(false);
      } else {
        console.error('Error saving profile:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-800 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-800 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-400 mb-4">Create Your Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300">Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300">Course</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300">College Name</label>
                <input
                  type="text"
                  name="college_name"
                  value={formData.college_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300">10th Percentage</label>
                <input
                  type="number"
                  name="tenth_percentage"
                  value={formData.tenth_percentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300">12th Percentage</label>
                <input
                  type="number"
                  name="twelfth_percentage"
                  value={formData.twelfth_percentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300">GitHub ID (optional)</label>
                <input
                  type="text"
                  name="github_id"
                  value={formData.github_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-colors"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-400">Your Profile</h1>
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white font-medium transition-colors"
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-gray-300 capitalize">
                    {key.replace('_', ' ')}
                    {(key === 'tenth_percentage' || key === 'twelfth_percentage') && ' (%)'}
                  </label>
                  <input
                    type={key.includes('percentage') ? 'number' : 'text'}
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={key.includes('percentage') ? '0' : undefined}
                    max={key.includes('percentage') ? '100' : undefined}
                    required={key !== 'github_id'}
                  />
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{profile.full_name}</h2>
                  <p className="text-gray-400">{profile.course} • {profile.college_name}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Education</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400">10th Percentage</p>
                      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${profile.tenth_percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-right text-sm text-gray-300">{profile.tenth_percentage}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">12th Percentage</p>
                      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${profile.twelfth_percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-right text-sm text-gray-300">{profile.twelfth_percentage}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.split(',').map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm text-blue-300"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {profile.github_id && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">GitHub</h3>
                    <a 
                      href={`https://github.com/${profile.github_id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                      github.com/{profile.github_id}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}