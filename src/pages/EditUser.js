import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8082/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFullName(res.data.fullName || res.data.full_name || '');
        setEmail(res.data.email || '');
        setIsVerified(res.data.isVerified ?? res.data.is_verified ?? false);
      } catch (err) {
        setError('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8082/api/users/update/${userId}`, {
        fullName,
        email,
        isVerified,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User updated successfully');
      navigate('/admin-dashboard');
    } catch (err) {
      setError('Failed to update user');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-purple-700">Edit User</h1>
      <form className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md" onSubmit={handleSave}>
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Full Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6 flex items-center gap-2">
          <label className="font-semibold text-gray-700">Verified</label>
          <input
            type="checkbox"
            checked={isVerified}
            onChange={e => setIsVerified(e.target.checked)}
            className="accent-purple-600 w-5 h-5"
          />
        </div>
        <div className="flex flex-row gap-4 justify-center items-center mt-6">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition-colors duration-150"
          >
            <span className="material-icons text-lg">Save</span>
            
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-gray-300 text-gray-700 font-semibold shadow hover:bg-gray-400 transition-colors duration-150"
            onClick={() => navigate('/admin-dashboard')}
          >
            <span className="material-icons text-lg">Cancel</span>
          
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
