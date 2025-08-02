import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({ bio: '', skills: '', profilePicUrl: '', instaLink: '' });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8082/api/users/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setFormData({
            bio: response.data.bio || '',
            skills: response.data.skills || '',
            profilePicUrl: response.data.profilePicUrl || '',
            instaLink: response.data.instaLink || '',
          });
        }
      } catch (err) {
        setError('Failed to load profile.');
      }
    };
    fetchProfile();
  }, [userId]);

  const handleCloudinaryUpload = async () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'duk7fa4je',
        uploadPreset: 'unsigned_profile_upload',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: 'image',
        cropping: true,
        maxFileSize: 5242880,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
        styles: {
          palette: {
            window: '#f3e8ff',
            sourceBg: '#fff',
            windowBorder: '#a78bfa',
            tabIcon: '#d946ef',
            inactiveTabIcon: '#a1a1aa',
            menuIcons: '#d946ef',
            link: '#a21caf',
            action: '#a21caf',
            inProgress: '#a21caf',
            complete: '#22c55e',
            error: '#ef4444',
            textDark: '#111827',
            textLight: '#f3e8ff'
          }
        }
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setFormData(prev => ({ ...prev, profilePicUrl: result.info.secure_url }));
        }
        setUploading(false);
      }
    );
    setUploading(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8082/api/users/profile/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Profile updated!');
      setTimeout(() => navigate(`/profile/${userId}`), 1200);
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-8">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 border border-gray-200 relative">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-pink-600">Edit Profile</h2>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {success && <p className="text-green-600 text-center mb-2">{success}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <label className="font-semibold text-gray-700">Bio
            <textarea
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
            />
          </label>
          <label className="font-semibold text-gray-700">Skills (comma separated)
            <input
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={formData.skills}
              onChange={e => setFormData({ ...formData, skills: e.target.value })}
            />
          </label>
          <label className="font-semibold text-gray-700">Instagram Link
            <input
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={formData.instaLink}
              onChange={e => setFormData({ ...formData, instaLink: e.target.value })}
            />
          </label>
          <label className="font-semibold text-gray-700">Profile Picture
            <div className="flex items-center gap-3 mt-1">
              {formData.profilePicUrl && (
                <img src={formData.profilePicUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-pink-400" />
              )}
              <button
                type="button"
                className="px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold shadow hover:from-pink-600 hover:to-purple-600 transition-all text-xs"
                onClick={handleCloudinaryUpload}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </label>
          <label className="font-semibold text-gray-700">Or paste image URL
            <input
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={formData.profilePicUrl}
              onChange={e => setFormData({ ...formData, profilePicUrl: e.target.value })}
            />
          </label>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-green-700 transition-all text-base mt-2"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile; 