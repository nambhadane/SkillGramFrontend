// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function Register() {
//   const [form, setForm] = useState({
//     email: '',
//     fullName: '',
//     password: '',
//     roles: 'USER',
//   });
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);
//     try {
//       const response = await axios.post('http://localhost:8082/api/users/register', form, {
//         headers: { 'Content-Type': 'application/json' },
//       });
//       setSuccess('Registration successful! You can now log in.');
//       // Set role in localStorage for login redirect
//       localStorage.setItem('role', form.roles);
//       setForm({ email: '', fullName: '', password: '', roles: 'USER' });
//       // Redirect to login page
//       navigate('/login');
//     } catch (err) {
//       setError(err.response?.data || 'Registration failed');
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex flex-col md:flex-row font-[Inter,sans-serif] bg-gradient-to-br from-pink-400 via-purple-300 to-indigo-200">
//       {/* Left: Tech Illustration or Background */}
//       <div className="relative w-full md:w-1/2 h-64 md:h-screen flex items-center justify-center overflow-hidden">
//         <img
//           src="/login-visual.png"
//           alt="Tech Visual"
//           className="absolute inset-0 w-full h-full object-cover object-center scale-105 md:scale-100"
//           style={{ zIndex: 1 }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-pink-700/40 to-indigo-900/60" style={{ zIndex: 2 }}></div>
//         <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
//           {/* Optionally add a logo or tagline here */}
//         </div>
//       </div>
//       {/* Right: Form section */}
//       <div className="w-full md:w-1/2 h-auto md:h-screen flex items-center justify-center bg-white/90">
//         <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col justify-center px-6 md:px-12 py-12 md:py-0">
//           <div className="flex justify-center mb-8">
//             <img src="/skillshowcase-icon.png" alt="SkillShowcase Icon" className="w-16 h-16 object-contain rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-2" />
//           </div>
//           <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-900 tracking-tight font-[Poppins,sans-serif]">
//             Create your SkillGram account
//           </h1>
//           <label htmlFor="reg-fullName" className="block text-base font-semibold text-gray-700 mb-2">Full Name</label>
//           <input
//             id="reg-fullName"
//             type="text"
//             name="fullName"
//             value={form.fullName}
//             onChange={handleChange}
//             placeholder="Enter Your Name"
//             required
//             className="w-full px-5 py-3 mb-6 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-purple-400"
//           />
//           <label htmlFor="reg-email" className="block text-base font-semibold text-gray-700 mb-2">Email</label>
//           <input
//             id="reg-email"
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="your@email.com"
//             required
//             className="w-full px-5 py-3 mb-6 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-purple-400"
//           />
//           <label htmlFor="reg-password" className="block text-base font-semibold text-gray-700 mb-2">Password</label>
//           <input
//             id="reg-password"
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="••••••••"
//             required
//             className="w-full px-5 py-3 mb-6 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-purple-400"
//           />
//           <label htmlFor="reg-roles" className="block text-base font-semibold text-gray-700 mb-2">Role</label>
//           <select
//             id="reg-roles"
//             name="roles"
//             value={form.roles}
//             onChange={handleChange}
//             className="w-full px-5 py-3 mb-8 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-purple-400"
//           >
//             <option value="USER">USER</option>
//             <option value="ADMIN">ADMIN</option>
//           </select>
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-bold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 text-lg mb-4 shadow-sm focus:scale-[1.03] focus:outline-none"
//           >
//             Register
//           </button>
//           {error && <p className="text-red-500 text-center font-medium mb-2">{typeof error === 'string' ? error : error.message || JSON.stringify(error)}</p>}
//           {success && <p className="text-green-600 text-center font-medium mb-2">{success}</p>}
//           <button
//             type="button"
//             onClick={() => navigate('/login')}
//             className="text-pink-600 hover:underline font-semibold text-base mt-2 transition-colors duration-200"
//           >
//             Already have an account? Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register; 



import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      success: "bg-green-100 text-green-700",
    };
    return <div className={`${baseClasses} ${typeClasses[type]}`}>{messageText}</div>;
  };

function Register() {
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    password: '',
    roles: 'USER', // Default role
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/users/register`, form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-[Inter,sans-serif] bg-white">
      {/* Left: Form section */}
      <div className="w-full md:w-1/2 h-screen flex flex-col items-center justify-center bg-white overflow-y-auto p-6 md:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col justify-center">
          <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-900 tracking-tight font-[Poppins,sans-serif]">
            Create your SkillGram account
          </h1>
          
          <label htmlFor="reg-fullName" className="block text-base font-semibold text-gray-700 mb-2">Full Name</label>
          <input
            id="reg-fullName"
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter Your Name"
            required
            className="w-full px-5 py-3 mb-6 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-orange-400"
          />

          <label htmlFor="reg-email" className="block text-base font-semibold text-gray-700 mb-2">Email</label>
          <input
            id="reg-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            className="w-full px-5 py-3 mb-6 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-orange-400"
          />

          <label htmlFor="reg-password" className="block text-base font-semibold text-gray-700 mb-2">Password</label>
          <input
            id="reg-password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full px-5 py-3 mb-6 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-orange-400"
          />

          <label htmlFor="reg-roles" className="block text-base font-semibold text-gray-700 mb-2">Role</label>
          <select
            id="reg-roles"
            name="roles"
            value={form.roles}
            onChange={handleChange}
            className="w-full px-5 py-3 mb-8 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-orange-400"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          {error && <Message text={error} type="error" />}
          {success && <Message text={success} type="success" />}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:from-pink-600 hover:to-orange-600 transition-all duration-300 text-lg my-4 shadow-sm focus:scale-[1.03] focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          
          <div className="text-center">
            <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-pink-600 hover:underline font-semibold text-base mt-2 transition-colors duration-200"
            >
                Already have an account? Login
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

export default Register;
