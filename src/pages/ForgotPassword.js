// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setMessage(null);
//     try {
//       const res = await axios.post('http://localhost:8082/api/users/forgot-password', { email });
//       setMessage('Password reset instructions have been sent to your email.');
//     } catch (err) {
//       setError(err.response?.data || 'Failed to request password reset');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => {
//         navigate('/login');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [message, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center relative">
//       <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 opacity-40 -z-10"></div>
//       <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
//         <button onClick={() => navigate('/login')} className="mb-6 text-pink-600 hover:underline font-semibold">&larr; Back to Login</button>
//         <h2 className="text-2xl font-extrabold text-center mb-6 text-gray-900 font-sans tracking-tight">Forgot Password</h2>
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
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 font-bold shadow-md"
//             disabled={loading}
//           >
//             {loading ? 'Requesting...' : 'Request Password Reset'}
//           </button>
//         </form>
//         {error && <p className="text-red-500 text-center font-medium mt-4">{error}</p>}
//         {message && (
//           <div className="text-green-600 text-center font-medium mt-4 flex flex-col items-center gap-2">
//             <p>{message} Please check your email for further instructions.</p>
//             <button
//               onClick={() => navigate('/login')}
//               className="mt-2 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
//             >
//               Go to Login
//             </button>
//             <p className="text-xs text-gray-500 mt-2">You will be redirected to login automatically.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword; 


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await axios.post(`${API_BASE_URL}/users/forgot-password`, { email });
      setMessage('Password reset instructions have been sent to your email.');
    } catch (err) {
      setError(err.response?.data || 'Failed to request password reset. Please check the email address.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 5000); // Increased redirect time to 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-[Inter,sans-serif] bg-white">
      {/* Left: Form section */}
      <div className="w-full md:w-1/2 h-screen flex flex-col items-center justify-center bg-white p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.75 2.25a6.75 6.75 0 00-5.873 10.105l-8.342 8.342a.75.75 0 001.06 1.06l1.97-1.97h1.69v-1.5a.75.75 0 01.75-.75h1.5v-1.5a.75.75 0 01.75-.75h1.69l.53-.53a6.75 6.75 0 107.525-12.507zm-1.78 8.03a2.25 2.25 0 113.18-3.18 2.25 2.25 0 01-3.18 3.18z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-gray-900 tracking-tight font-[Poppins,sans-serif]">
            Forgot Password
          </h1>
          <p className="text-center text-gray-600 mb-8">Enter your email and we'll send you instructions to reset your password.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="forgot-email" className="block text-base font-semibold text-gray-700 mb-2">Email</label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base transition-all duration-200 bg-white font-[Inter,sans-serif] outline-none hover:border-orange-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:from-pink-600 hover:to-orange-600 transition-all duration-300 text-lg shadow-sm focus:scale-[1.03] focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Instructions'}
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
          <h2 className="text-4xl font-bold mb-4">Regain Access</h2>
          <p className="text-lg">We'll help you get back into your account securely.</p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;