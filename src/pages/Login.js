
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// It's a best practice to store the API base URL in an environment variable
// so it can be easily changed between development and production environments.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

// A reusable component for displaying messages.
const Message = ({ text, type }) => {
    if (!text) return null;
    const messageText = typeof text === 'string' ? text : text.message || 'An unexpected error occurred.';
    const baseClasses = "text-center font-medium p-3 rounded-lg w-full";
    const typeClasses = {
      error: "bg-red-100 text-red-700",
    };
    return <div className={`${baseClasses} ${typeClasses[type]}`}>{messageText}</div>;
  };

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/users/authenticate`, {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);

      // Decode token to get user info
      const decoded = jwtDecode(token);
      const { userId, role } = decoded;

      if (userId) {
        localStorage.setItem('userId', userId);
      }
      if (role) {
        localStorage.setItem('role', role);
      }

      // Redirect based on role
      if (role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.response?.data || 'Login failed. Please check your credentials.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-[Inter,sans-serif] bg-white">
      {/* Left: Form section */}
      <div className="w-full md:w-1/2 h-auto md:h-screen flex items-center justify-center bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col justify-center px-6 md:px-12 py-12 md:py-0">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-900 tracking-tight font-[Poppins,sans-serif]">
            Sign in to SkillGram
          </h1>
          
          <label htmlFor="login-email" className="block text-base font-semibold text-gray-700 mb-2">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-5 py-3 mb-6 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-orange-400"
          />
          
          <label htmlFor="login-password" className="block text-base font-semibold text-gray-700 mb-2">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-5 py-3 mb-4 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-orange-400"
          />
          
          <div className="flex justify-end items-center mb-8">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-orange-600 hover:underline font-semibold text-sm transition-colors duration-200"
            >
              Forgot Password?
            </button>
          </div>

          {error && <Message text={error} type="error" />}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:from-pink-600 hover:to-orange-600 transition-all duration-300 text-lg my-4 shadow-sm focus:scale-[1.03] focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className="text-center">
            <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-pink-600 hover:underline font-semibold text-base mt-2 transition-colors duration-200"
            >
                Don't have an account? Register
            </button>
          </div>
        </form>
      </div>

      {/* Right: Tech Illustration or Background */}
      <div className="relative w-full md:w-1/2 h-64 md:h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop"
          alt="Team collaboration"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1000x1200/1e293b/ffffff?text=Collaboration'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/60 via-pink-700/40 to-red-900/60"></div>
        <div className="relative z-10 text-white text-center p-8">
            <h2 className="text-4xl font-bold mb-4">Showcase Your Skills</h2>
            <p className="text-lg">Join a community of creators and professionals.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;