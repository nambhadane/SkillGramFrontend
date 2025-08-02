// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';

// function ResetPassword() {
//   const [email, setEmail] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [message, setMessage] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const urlToken = params.get('token');

//   const [resetToken, setResetToken] = useState(urlToken || '');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setMessage(null);
//     try {
//       const res = await axios.post('http://localhost:8082/api/users/reset-password', {
//         email,
//         resetToken,
//         newPassword,
//       });
//       setMessage(res.data);
//     } catch (err) {
//       setError(err.response?.data || 'Failed to reset password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center relative">
//       <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 opacity-40 -z-10"></div>
//       <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
//         <button onClick={() => navigate('/login')} className="mb-6 text-pink-600 hover:underline font-semibold">&larr; Back to Login</button>
//         <h2 className="text-2xl font-extrabold text-center mb-6 text-gray-900 font-sans tracking-tight">Reset Password</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               placeholder="your@email.com"
//               required
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
//             />
//           </div>
//           {urlToken ? (
//             <div className="text-green-700 text-sm">Reset token detected from link.</div>
//           ) : (
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Reset Token</label>
//               <input
//                 type="text"
//                 value={resetToken}
//                 onChange={e => setResetToken(e.target.value)}
//                 placeholder="Enter the reset token you received"
//                 required
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
//               />
//             </div>
//           )}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
//             <input
//               type="password"
//               value={newPassword}
//               onChange={e => setNewPassword(e.target.value)}
//               placeholder="New password"
//               required
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 font-bold shadow-md"
//             disabled={loading}
//           >
//             {loading ? 'Resetting...' : 'Reset Password'}
//           </button>
//         </form>
//         {error && <p className="text-red-500 text-center font-medium mt-4">{error}</p>}
//         {message && <p className="text-green-600 text-center font-medium mt-4">{message}</p>}
//       </div>
//     </div>
//   );
// }

// export default ResetPassword; 



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';

// // It's a best practice to store the API base URL in an environment variable
// // so it can be easily changed between development and production environments.
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

// // A reusable component for displaying messages.
// const Message = ({ text, type }) => {
//     if (!text) return null;
//     const messageText = typeof text === 'string' ? text : text.message || 'An unexpected error occurred.';
//     const baseClasses = "text-center font-medium p-3 rounded-lg w-full mt-4";
//     const typeClasses = {
//       error: "bg-red-100 text-red-700",
//       success: "bg-green-100 text-green-700",
//     };
//     return <div className={`${baseClasses} ${typeClasses[type]}`}>{messageText}</div>;
//   };

// function ResetPassword() {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Extract token from URL query parameters
//   const urlToken = new URLSearchParams(location.search).get('token');

//   const [form, setForm] = useState({
//     email: '',
//     newPassword: '',
//     resetToken: urlToken || '',
//   });
//   const [message, setMessage] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setMessage(null);
//     try {
//       const res = await axios.post(`${API_BASE_URL}/users/reset-password`, form);
//       setMessage(res.data || 'Password has been reset successfully! Redirecting to login...');
//       setTimeout(() => {
//         navigate('/login');
//       }, 3000);
//     } catch (err) {
//       setError(err.response?.data || 'Failed to reset password. The token may be invalid or expired.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex flex-col md:flex-row font-[Inter,sans-serif] bg-white">
//         {/* Left: Form section */}
//         <div className="w-full md:w-1/2 h-screen flex flex-col items-center justify-center bg-white p-6 md:p-12">
//             <div className="w-full max-w-md">
//                 <div className="flex justify-center mb-8">
//                     <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                         </svg>
//                     </div>
//                 </div>
//                 <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-gray-900 tracking-tight font-[Poppins,sans-serif]">
//                     Reset Your Password
//                 </h1>
//                 <p className="text-center text-gray-600 mb-8">Enter your email, new password, and the token from your email.</p>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <label className="block text-base font-semibold text-gray-700 mb-2">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={form.email}
//                             onChange={handleChange}
//                             placeholder="your@email.com"
//                             required
//                             className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-orange-400"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-base font-semibold text-gray-700 mb-2">New Password</label>
//                         <input
//                             type="password"
//                             name="newPassword"
//                             value={form.newPassword}
//                             onChange={handleChange}
//                             placeholder="Enter your new password"
//                             required
//                             className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-orange-400"
//                         />
//                     </div>
//                      <div>
//                         <label className="block text-base font-semibold text-gray-700 mb-2">Reset Token</label>
//                         <input
//                             type="text"
//                             name="resetToken"
//                             value={form.resetToken}
//                             onChange={handleChange}
//                             placeholder="Paste the token from your email"
//                             required
//                             className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-orange-400"
//                         />
//                          {urlToken && <p className="text-sm text-green-600 mt-2">Token from URL has been pre-filled.</p>}
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:from-pink-600 hover:to-orange-600 transition-all duration-300 text-lg shadow-sm focus:scale-[1.03] focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
//                         disabled={loading}
//                     >
//                         {loading ? 'Resetting...' : 'Reset Password'}
//                     </button>
//                 </form>

//                 {error && <Message text={error} type="error" />}
//                 {message && <Message text={message} type="success" />}

//                 <div className="text-center mt-6">
//                     <button
//                         type="button"
//                         onClick={() => navigate('/login')}
//                         className="text-pink-600 hover:underline font-semibold text-base transition-colors duration-200"
//                     >
//                         &larr; Back to Login
//                     </button>
//                 </div>
//             </div>
//         </div>

//         {/* Right: Tech Illustration or Background */}
//         <div className="relative w-full md:w-1/2 h-64 md:h-screen flex items-center justify-center overflow-hidden">
//             <img
//             src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop"
//             alt="Team collaboration"
//             className="absolute inset-0 w-full h-full object-cover object-center"
//             onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1000x1200/1e293b/ffffff?text=Collaboration'; }}
//             />
//             <div className="absolute inset-0 bg-gradient-to-br from-orange-900/60 via-pink-700/40 to-red-900/60"></div>
//             <div className="relative z-10 text-white text-center p-8">
//                 <h2 className="text-4xl font-bold mb-4">Secure Your Account</h2>
//                 <p className="text-lg">Create a new, strong password to keep your account safe.</p>
//             </div>
//         </div>
//     </div>
//   );
// }

// export default ResetPassword;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// It's a best practice to store the API base URL in an environment variable
// so it can be easily changed between development and production environments.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

// A reusable component for displaying messages.
const Message = ({ text, type }) => {
    if (!text) return null;
    const messageText = typeof text === 'string' ? text : text.message || 'An unexpected error occurred.';
    const baseClasses = "text-center font-medium p-3 rounded-lg w-full mt-4";
    const typeClasses = {
      error: "bg-red-100 text-red-700",
      success: "bg-green-100 text-green-700",
    };
    return <div className={`${baseClasses} ${typeClasses[type]}`}>{messageText}</div>;
  };

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token from URL query parameters
  const urlToken = new URLSearchParams(location.search).get('token');

  const [form, setForm] = useState({
    email: '',
    newPassword: '',
    resetToken: urlToken || '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/users/reset-password`, form);
      setMessage(res.data || 'Password has been reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data || 'Failed to reset password. The token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-[Inter,sans-serif] bg-white">
        {/* Left: Form section */}
        <div className="w-full md:w-1/2 h-screen flex flex-col items-center justify-center bg-white p-6 md:p-12">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-gray-900 tracking-tight font-[Poppins,sans-serif]">
                    Reset Your Password
                </h1>
                <p className="text-center text-gray-600 mb-8">Enter your email, new password, and the token from your email.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                            className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-orange-400"
                        />
                    </div>
                    <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            placeholder="Enter your new password"
                            required
                            className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-orange-400"
                        />
                    </div>
                    {urlToken ? (
                        <div className="bg-green-100 p-3 rounded-lg">
                            <p className="text-sm text-green-700 font-medium">Reset token from your link has been applied automatically.</p>
                        </div>
                    ) : (
                     <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">Reset Token</label>
                        <input
                            type="text"
                            name="resetToken"
                            value={form.resetToken}
                            onChange={handleChange}
                            placeholder="Paste the token from your email"
                            required
                            className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-orange-400"
                        />
                    </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:from-pink-600 hover:to-orange-600 transition-all duration-300 text-lg shadow-sm focus:scale-[1.03] focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                {error && <Message text={error} type="error" />}
                {message && <Message text={message} type="success" />}

                <div className="text-center mt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-pink-600 hover:underline font-semibold text-base transition-colors duration-200"
                    >
                        &larr; Back to Login
                    </button>
                </div>
            </div>
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
                <h2 className="text-4xl font-bold mb-4">Secure Your Account</h2>
                <p className="text-lg">Create a new, strong password to keep your account safe.</p>
            </div>
        </div>
    </div>
  );
}

export default ResetPassword;