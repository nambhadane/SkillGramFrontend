// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';

// const NavItem = ({ to, icon, children }) => (
//   <NavLink
//     to={to}
//     className={({ isActive }) =>
//       `flex items-center gap-3 py-2.5 px-4 rounded-lg font-medium text-gray-700 hover:bg-purple-100 transition-colors ${
//         isActive ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 shadow-inner' : ''
//       }`
//     }
//   >
//     {icon}
//     <span>{children}</span>
//   </NavLink>
// );

// const PlaceholderNavItem = ({ icon, children }) => (
//   <div className="flex items-center gap-3 py-2.5 px-4 rounded-lg font-medium text-gray-400 cursor-not-allowed">
//     {icon}
//     <span>{children}</span>
//   </div>
// );

// function Layout() {
//   // State for post count/limit
//   const [isPremium, setIsPremium] = useState(false);
//   const [monthlyPostCount, setMonthlyPostCount] = useState(0);
//   const [userStatusError, setUserStatusError] = useState(null);
//   const [subscriptionExpiry, setSubscriptionExpiry] = useState(null); // ISO string or null

//   // Fetch user status (premium, monthly post count)
//   const fetchUserStatus = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;
//       const res = await axios.get('http://localhost:8082/api/users/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setIsPremium(res.data.premium);
//       setMonthlyPostCount(res.data.monthlyPostCount);
//       if (res.data.subscriptionExpiry) {
//         setSubscriptionExpiry(res.data.subscriptionExpiry);
//       } else {
//         setSubscriptionExpiry(null);
//       }
//     } catch (err) {
//       setUserStatusError('Failed to fetch user status.');
//     }
//   };

//   useEffect(() => {
//     fetchUserStatus();
//   }, []);
//   const navigate = useNavigate();
//   const userId = localStorage.getItem('userId');
//   const profilePicUrl = localStorage.getItem('profilePicUrl');
//   const userRole = localStorage.getItem('role');
//   const [searchValue, setSearchValue] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [showResults, setShowResults] = useState(false);
//   const [darkMode, setDarkMode] = useState(() => {
//     // Try to get from localStorage, else default to false
//     const stored = localStorage.getItem('darkMode');
//     return stored === 'true';
//   });
//   const searchRef = useRef(null);
//   // Apply dark mode class to body
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//     localStorage.setItem('darkMode', darkMode);
//   }, [darkMode]);

//   const handleToggleDarkMode = () => {
//     setDarkMode((prev) => !prev);
//   };

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowResults(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!searchValue.trim()) return;
//     const token = localStorage.getItem('token');
//     try {
//       const res = await axios.get(`http://localhost:8082/api/users/search?skill=${encodeURIComponent(searchValue)}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setSearchResults(res.data.content || []);
//       setShowResults(true);
//     } catch (err) {
//       setSearchResults([]);
//       setShowResults(true);
//     }
//   };

//   const handleResultClick = (userId) => {
//     setShowResults(false);
//     setSearchValue('');
//     window.location.href = `/profile/${userId}`;
//   };

//   // Razorpay subscribe handler (copied from Dashboard.js)
//   function loadRazorpayScript(src) {
//     return new Promise((resolve) => {
//       const script = document.createElement('script');
//       script.src = src;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   }

//   const RAZORPAY_PLAN_ID = 'plan_QxX8BP3ukEUjZf'; // Replace with your actual planId

//   const handleSubscribe = async () => {
//     const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
//     if (!res) {
//       alert('Failed to load Razorpay SDK.');
//       return;
//     }
//     try {
//       const token = localStorage.getItem('token');
//       const email = localStorage.getItem('userEmail');
//       if (!email) {
//         alert('User email not found. Please log in again.');
//         return;
//       }
//       // Call backend to create subscription
//       const response = await axios.post('http://localhost:8082/api/razorpay/create-subscription', null, {
//         params: { planId: RAZORPAY_PLAN_ID, email },
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
//       const subscriptionId = data.id;
//       const razorpayKey = 'rzp_test_1bUZdMIZIKpoPz'; // Replace with your Razorpay key id or fetch from backend

//       const options = {
//         key: razorpayKey,
//         subscription_id: subscriptionId,
//         name: 'SkillUp',
//         description: 'Monthly Subscription',
//         image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Meetup_Logo.png',
//         handler: async (response) => {
//           alert('Subscription successful! Payment ID: ' + response.razorpay_payment_id);
//           // Call backend to activate subscription
//           try {
//             await axios.post('http://localhost:8082/api/razorpay/activate-subscription', null, {
//               params: { email: email },
//               headers: { Authorization: `Bearer ${token}` }
//             });
//           } catch (e) {
//             alert('Failed to activate subscription on server.');
//           }
//           // Wait a moment for backend to update, then refresh user status
//           setTimeout(async () => {
//             await fetchUserStatus();
//           }, 1200);
//         },
//         prefill: {
//           email: email,
//         },
//         theme: {
//           color: '#a78bfa',
//         },
//       };
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       alert('Failed to initiate subscription.');
//     }
//   };

//   return (
//     <div className={`min-h-screen flex ${darkMode ? 'dark bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-pink-50 via-purple-100 to-indigo-100'}`}> 
//       {/* Sidebar */}
//       <aside className={`w-64 min-h-screen fixed top-0 left-0 flex flex-col ${darkMode ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 border-gray-800' : 'bg-gradient-to-b from-pink-100 via-purple-50 to-white border-pink-200'} border-r shadow-lg z-20`}>
//         <div className={`h-20 flex items-center justify-center border-b ${darkMode ? 'border-gray-800' : 'border-pink-200'}`}>
//           <span className={`text-2xl font-extrabold tracking-tight ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>SkillGram</span>
//         </div>
//         <nav className="flex-1 flex flex-col justify-between p-4">
//           <div className="flex flex-col gap-2">
//             <h3 className="px-4 pt-2 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Main</h3>
//             <NavItem to="/dashboard" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}>Home</NavItem>
//             {/* Admin Dashboard link for admin users only */}
//             {userRole === 'ADMIN' && (
//               <NavItem to="/admin-dashboard" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" /></svg>}>Admin Dashboard</NavItem>
//             )}
//             <NavItem to="/explore" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.49 4.51l-1.42 1.42a9 9 0 11-12.72 0L4.51 4.51M12 21a9 9 0 01-9-9" /></svg>}>Explore</NavItem>
//             <NavItem to="/create-post" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}>
//               Upload
//               <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
//                 {isPremium ? 'Unlimited' : `${monthlyPostCount} / 5`}
//               </span>
//             </NavItem>
//             {/* Subscribe button or days remaining for free users (only for non-admin users) */}
//             {userRole !== 'ADMIN' && (
//               !isPremium ? (
//                 <div className="mt-4 flex flex-col items-center">
//                   {monthlyPostCount >= 5 && (
//                     <div className="text-red-600 font-semibold mb-2 text-center">
//                       You have reached your free post limit.<br />Subscribe for unlimited posts!
//                     </div>
//                   )}
//                   <button
//                     onClick={handleSubscribe}
//                     className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:scale-105 transition"
//                   >
//                     Subscribe Now
//                   </button>
//                 </div>
//               ) : (
//                 subscriptionExpiry && (
//                   <div className="mt-4 flex flex-col items-center">
//                     <div className="text-green-600 font-semibold mb-2 text-center">
//                       Premium Active<br />
//                       {(() => {
//                         const now = new Date();
//                         const expiry = new Date(subscriptionExpiry);
//                         const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
//                         return diff > 0 ? `${diff} day${diff > 1 ? 's' : ''} remaining` : 'Expired';
//                       })()}
//                     </div>
//                   </div>
//                 )
//               )
//             )}
//             {/* <PlaceholderNavItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4.39-1.02L3 21l1.02-3.39A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}>Messages</PlaceholderNavItem> */}
//             <NavItem to={`/profile/${userId}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>Profile</NavItem>
            
//             <h3 className="px-4 pt-6 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Personal</h3>
//             <NavItem to="/liked-posts" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>}>
//               Liked Posts
//             </NavItem>
//             <NavItem to="/saved-posts" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 17V5z" /></svg>}>Saved Posts</NavItem>
//             <NavItem to="/settings" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>}>Settings</NavItem>
//           </div>
          
//           <div className="flex flex-col gap-2">
//             <button
//               onClick={handleToggleDarkMode}
//               className={`flex items-center gap-3 py-2.5 px-4 rounded-lg font-medium transition-colors ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-yellow-300 shadow-inner' : 'bg-gradient-to-r from-purple-50 to-pink-50 text-gray-700 hover:bg-purple-100'} `}
//               aria-pressed={darkMode}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
//               </svg>
//               {darkMode ? 'Light Mode' : 'Dark Mode'}
//             </button>
//             {/* Logout button removed from sidebar */}
//           </div>
//         </nav>
//       </aside>
//       {/* Main content area */}
//       <div className={`flex-1 flex flex-col min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100' : 'bg-gradient-to-br from-pink-50 via-purple-100 to-indigo-100'} `} style={{ marginLeft: '16rem' }}>
//         {/* Header */}
//         <header className={`sticky top-0 w-full z-10 ${darkMode ? 'bg-gray-950/90 border-gray-800' : 'bg-gradient-to-r from-pink-100 via-purple-50 to-white/80 border-pink-200'} backdrop-blur border-b shadow-sm h-20 flex items-center px-8 gap-8`}>
//           {/* Centered Search Bar */}
//           <form className="flex-1 flex justify-center relative" onSubmit={handleSearch} autoComplete="off" ref={searchRef}>
//             <div className="relative w-full max-w-xl">
//               <button
//                 type="submit"
//                 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-70 focus:outline-none"
//                 tabIndex="0"
//                 aria-label="Search"
//                 style={{ background: 'none', border: 'none', padding: 0 }}
//               >
//                 <img src="/search-icon.png" alt="Search" className="w-5 h-5" />
//               </button>
//               <input
//                 type="text"
//                 value={searchValue}
//                 onChange={e => setSearchValue(e.target.value)}
//                 placeholder="Search skills, creators, posts..."
//                 className={`w-full pl-12 pr-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400' : 'border-gray-200 bg-white text-base placeholder-gray-400'} shadow focus:outline-none focus:ring-2 focus:ring-pink-200`}
//                 onFocus={() => searchResults.length > 0 && setShowResults(true)}
//               />
//             </div>
//             {showResults && (
//               <div className={`absolute left-0 top-14 w-full max-w-xl ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white'} rounded-xl shadow-lg z-50`}>
//                 {searchResults.length === 0 ? (
//                   <div className="p-4 text-gray-500">No users found.</div>
//                 ) : (
//                   <ul>
//                     {searchResults.map(user => (
//                       <li
//                         key={user.id}
//                         className={`p-4 border-b last:border-b-0 flex items-center gap-3 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-50'}`}
//                         onClick={() => handleResultClick(user.id)}
//                       >
//                         {user.profilePicUrl && (
//                           <img src={user.profilePicUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
//                         )}
//                         <span className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{user.fullName}</span>
//                         <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.skills}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             )}
//           </form>
//           {/* Profile Icon (replaces Skill Showcase text) */}
//           <div className="flex-1 flex justify-end items-center gap-4">
//             <button
//               onClick={() => navigate('/create-post')}
//               className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg hover:scale-110 transition-transform focus:outline-none"
//               title="Create Post"
//               aria-label="Create Post"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//               </svg>
//             </button>
//             <button
//               onClick={() => navigate(`/profile/${userId}`)}
//               className="focus:outline-none"
//               aria-label="Go to profile"
//               style={{ background: 'none', border: 'none', padding: 0 }}
//             >
//               {profilePicUrl ? (
//                 <img
//                   src={profilePicUrl}
//                   alt="Profile"
//                   className="w-9 h-9 rounded-full object-cover bg-purple-100 p-1 shadow hover:bg-purple-200 transition"
//                 />
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#a78bfa" strokeWidth="2" className="w-9 h-9 rounded-full bg-purple-100 p-1 shadow hover:bg-purple-200 transition">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </header>
//         {/* Content */}
//         <main className={`flex-1 flex flex-col items-center px-8 py-8 w-full ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100' : 'bg-gradient-to-br from-pink-50 via-purple-100 to-indigo-100'}`}>
//           <div className="w-full max-w-7xl">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }



// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { NavLink, useNavigate, Outlet } from 'react-router-dom';

// // NavItem with updated active/hover states to match the new theme
// const NavItem = ({ to, icon, children }) => (
//   <NavLink
//     to={to}
//     className={({ isActive }) =>
//       `flex items-center gap-3 py-2.5 px-4 rounded-lg font-medium transition-colors ${
//         isActive
//           ? 'bg-gradient-to-r from-rose-400 to-orange-400 text-white shadow-md' // Active state with a vibrant gradient
//           : 'text-gray-700 dark:text-gray-300 hover:bg-rose-100 dark:hover:bg-gray-700'
//       }`
//     }
//   >
//     {icon}
//     <span>{children}</span>
//   </NavLink>
// );

// // New component for the header subscription status
// const SubscriptionStatus = ({ isPremium, monthlyPostCount, subscriptionExpiry, handleSubscribe, userRole }) => {
//     if (userRole === 'ADMIN') {
//         return null; // Admins don't see subscription options
//     }

//     if (isPremium) {
//         if (!subscriptionExpiry) return null;
//         const diff = Math.ceil((new Date(subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24));
//         return (
//             <div className="flex items-center gap-2 text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1.5 rounded-full">
//                 <span>Premium</span>
//                 <span className="font-normal">{diff > 0 ? `(${diff}d left)` : '(Expired)'}</span>
//             </div>
//         );
//     } else {
//         return (
//              <button
//                 onClick={handleSubscribe}
//                 className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 transition text-sm whitespace-nowrap"
//               >
//                 {monthlyPostCount >= 5 ? 'Limit Reached - Upgrade' : 'Upgrade'}
//               </button>
//         );
//     }
// };


// function Layout() {
//   // State for post count/limit
//   const [isPremium, setIsPremium] = useState(false);
//   const [monthlyPostCount, setMonthlyPostCount] = useState(0);
//   const [userStatusError, setUserStatusError] = useState(null);
//   const [subscriptionExpiry, setSubscriptionExpiry] = useState(null); // ISO string or null

//   // --- All original state and logic remains unchanged ---
//   const navigate = useNavigate();
//   const userId = localStorage.getItem('userId');
//   const profilePicUrl = localStorage.getItem('profilePicUrl');
//   const userRole = localStorage.getItem('role');
//   const [searchValue, setSearchValue] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [showResults, setShowResults] = useState(false);
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
//   const searchRef = useRef(null);
  
//   // All useEffect hooks and handler functions (fetchUserStatus, handleLogout, handleSearch, handleSubscribe, etc.) are identical to your original code and are kept here for completeness.
//   // ... (All handler functions from the original code are preserved here) ...
//   const fetchUserStatus = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;
//       const res = await axios.get('http://localhost:8082/api/users/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setIsPremium(res.data.premium);
//       setMonthlyPostCount(res.data.monthlyPostCount);
//       setSubscriptionExpiry(res.data.subscriptionExpiry || null);
//     } catch (err) {
//       setUserStatusError('Failed to fetch user status.');
//     }
//   };

//   useEffect(() => {
//     fetchUserStatus();
//   }, []);

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//     localStorage.setItem('darkMode', darkMode);
//   }, [darkMode]);

//   const handleToggleDarkMode = () => setDarkMode((prev) => !prev);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowResults(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!searchValue.trim()) return;
//     const token = localStorage.getItem('token');
//     try {
//       const res = await axios.get(`http://localhost:8082/api/users/search?skill=${encodeURIComponent(searchValue)}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setSearchResults(res.data.content || []);
//       setShowResults(true);
//     } catch (err) {
//       setSearchResults([]);
//       setShowResults(true);
//     }
//   };

//   const handleResultClick = (id) => {
//     setShowResults(false);
//     setSearchValue('');
//     navigate(`/profile/${id}`);
//   };
  
//   function loadRazorpayScript(src) {
//     return new Promise((resolve) => {
//       const script = document.createElement('script');
//       script.src = src;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   }

//   const handleSubscribe = async () => {
//     const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
//     if (!res) {
//       alert('Failed to load Razorpay SDK.');
//       return;
//     }
//     try {
//       const token = localStorage.getItem('token');
//       const email = localStorage.getItem('userEmail');
//       if (!email) {
//         alert('User email not found. Please log in again.');
//         return;
//       }
//       const response = await axios.post('http://localhost:8082/api/razorpay/create-subscription', null, {
//         params: { planId: 'plan_QxX8BP3ukEUjZf', email },
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
//       const { id: subscriptionId, key_id: razorpayKey } = data;
//       const options = {
//         key: razorpayKey,
//         subscription_id: subscriptionId,
//         name: 'SkillGram',
//         description: 'Premium Monthly Subscription',
//         handler: async (paymentResponse) => {
//           try {
//             await axios.post('http://localhost:8082/api/razorpay/activate-subscription', null, {
//               params: { email },
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             alert('Subscription successful!');
//             setTimeout(() => fetchUserStatus(), 1200);
//           } catch (e) {
//             alert('Failed to activate subscription.');
//           }
//         },
//         prefill: { email },
//         theme: { color: '#f43f5e' },
//       };
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       alert('Failed to initiate subscription.');
//     }
//   };


//   return (
//     // Main background: A richer, more saturated gradient
//     <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-rose-100 via-purple-200 to-orange-100'}`}> 
//       {/* Sidebar with a complementary background */}
//       <aside className={`w-64 min-h-screen fixed top-0 left-0 flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-md border-rose-200'} border-r shadow-lg z-20`}>
//         <div className={`h-20 flex items-center justify-center border-b ${darkMode ? 'border-gray-700' : 'border-rose-200'}`}>
//           {/* Logo with a punchier color */}
//           <span className={`text-2xl font-extrabold tracking-tight ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>SkillGram</span>
//         </div>
//         <nav className="flex-1 flex flex-col justify-between p-4">
//           <div className="flex flex-col gap-2">
//             <h3 className="px-4 pt-2 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Main</h3>
//             <NavItem to="/dashboard" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}>Home</NavItem>
//             {userRole === 'ADMIN' && (
//               <NavItem to="/admin-dashboard" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" /></svg>}>Admin Dashboard</NavItem>
//             )}
//             <NavItem to="/explore" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.49 4.51l-1.42 1.42a9 9 0 11-12.72 0L4.51 4.51M12 21a9 9 0 01-9-9" /></svg>}>Explore</NavItem>
//             <NavItem to="/create-post" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}>
//               Upload
//               <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${isPremium ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'}`}>
//                 {isPremium ? 'Unlimited' : `${monthlyPostCount} / 5`}
//               </span>
//             </NavItem>
//             <h3 className="px-4 pt-6 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Personal</h3>
//             <NavItem to={`/profile/${userId}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>Profile</NavItem>
//             <NavItem to="/liked-posts" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>}>
//               Liked Posts
//             </NavItem>
//             <NavItem to="/saved-posts" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 17V5z" /></svg>}>Saved Posts</NavItem>
//             <NavItem to="/settings" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>}>Settings</NavItem>
//           </div>
          
//           <div className="flex flex-col gap-2">
//             <button
//               onClick={handleToggleDarkMode}
//               className={`flex items-center gap-3 py-2.5 px-4 rounded-lg font-medium transition-colors ${darkMode ? 'text-yellow-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-rose-100'} `}
//               aria-pressed={darkMode}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
//               {darkMode ? 'Light Mode' : 'Dark Mode'}
//             </button>
//           </div>
//         </nav>
//       </aside>
      
//       {/* Main content area */}
//       <main className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '16rem' }}>
//         {/* Header with a richer background and clear separation */}
//         <header className={`sticky top-0 w-full z-10 ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/70 backdrop-blur-lg border-rose-200'} border-b shadow-sm h-20 flex items-center px-8 gap-8`}>
//           <form className="flex-1 flex justify-center relative" onSubmit={handleSearch} autoComplete="off" ref={searchRef}>
//             <div className="relative w-full max-w-xl">
//               <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
//               </div>
//               <input
//                 type="text"
//                 value={searchValue}
//                 onChange={e => setSearchValue(e.target.value)}
//                 placeholder="Search skills, creators..."
//                 className={`w-full pl-12 pr-4 py-3 rounded-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200 focus:ring-rose-500' : 'border-gray-300 bg-white text-gray-800 focus:ring-rose-400'} shadow-sm focus:outline-none focus:ring-2 transition`}
//                 onFocus={() => searchResults.length > 0 && setShowResults(true)}
//               />
//             </div>
//             {showResults && (
//               <div className={`absolute left-0 right-0 mx-auto top-14 w-full max-w-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-lg z-50 border`}>
//                 {searchResults.length === 0 ? (
//                   <div className="p-4 text-gray-500">No users found.</div>
//                 ) : (
//                   <ul>
//                     {searchResults.map(user => (
//                       <li
//                         key={user.id}
//                         className={`p-4 border-b last:border-b-0 flex items-center gap-3 cursor-pointer ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-rose-50'}`}
//                         onClick={() => handleResultClick(user.id)}
//                       >
//                         {user.profilePicUrl && <img src={user.profilePicUrl} alt="" className="w-8 h-8 rounded-full object-cover" />}
//                         <span className="font-semibold">{user.fullName}</span>
//                         <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{user.skills}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             )}
//           </form>
//           <div className="flex items-center gap-4">
//             <SubscriptionStatus
//                 isPremium={isPremium}
//                 monthlyPostCount={monthlyPostCount}
//                 subscriptionExpiry={subscriptionExpiry}
//                 handleSubscribe={handleSubscribe}
//                 userRole={userRole}
//             />
//             <button
//               onClick={() => navigate('/create-post')}
//               className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg hover:scale-110 transition-transform focus:outline-none"
//               title="Create Post"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
//             </button>
//             <button
//               onClick={() => navigate(`/profile/${userId}`)}
//               className="focus:outline-none"
//               title="Go to profile"
//             >
//               {profilePicUrl ? (
//                 <img src={profilePicUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover ring-2 ring-offset-2 ring-rose-300 dark:ring-rose-500" />
//               ) : (
//                   <div className="w-9 h-9 rounded-full bg-rose-200 dark:bg-rose-800 flex items-center justify-center ring-2 ring-offset-2 ring-rose-300 dark:ring-rose-500">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-rose-600 dark:text-rose-300">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                   </div>
//               )}
//             </button>
//           </div>
//         </header>
//         <div className="flex-1 p-8">
//             <div className="w-full max-w-7xl mx-auto">
//                 <Outlet />
//             </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Layout;


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';

// NavItem with updated active/hover states to match the new theme
const NavItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 py-2.5 px-4 rounded-lg font-medium transition-colors ${
        isActive
          ? 'bg-gradient-to-r from-rose-400 to-orange-400 text-white shadow-md' // Active state with a vibrant gradient
          : 'text-gray-700 dark:text-gray-300 hover:bg-rose-100 dark:hover:bg-gray-700'
      }`
    }
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);

// New component for the header subscription status
const SubscriptionStatus = ({ isPremium, monthlyPostCount, subscriptionExpiry, handleSubscribe, userRole }) => {
    if (userRole === 'ADMIN') {
        return null; // Admins don't see subscription options
    }

    if (isPremium) {
        if (!subscriptionExpiry) return null;
        const diff = Math.ceil((new Date(subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24));
        return (
            <div className="flex items-center gap-2 text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1.5 rounded-full">
                <span>Premium</span>
                <span className="font-normal">{diff > 0 ? `(${diff}d left)` : '(Expired)'}</span>
            </div>
        );
    } else {
        return (
             <button
                onClick={handleSubscribe}
                className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 transition text-sm whitespace-nowrap"
              >
                {monthlyPostCount >= 5 ? 'Limit Reached - Upgrade' : 'Upgrade'}
              </button>
        );
    }
};


function Layout() {
  // State for post count/limit
  const [isPremium, setIsPremium] = useState(false);
  const [monthlyPostCount, setMonthlyPostCount] = useState(0);
  const [userStatusError, setUserStatusError] = useState(null);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState(null); // ISO string or null

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const profilePicUrl = localStorage.getItem('profilePicUrl');
  const userRole = localStorage.getItem('role');
  
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  
  const fetchUserStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:8082/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsPremium(res.data.premium);
      setMonthlyPostCount(res.data.monthlyPostCount);
      setSubscriptionExpiry(res.data.subscriptionExpiry || null);
      localStorage.setItem('profilePicUrl', res.data.profilePicUrl || '');
    } catch (err) {
      setUserStatusError('Failed to fetch user status.');
    }
  };

  useEffect(() => {
    fetchUserStatus();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleToggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  
  function loadRazorpayScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  const handleSubscribe = async () => {
    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Failed to load Razorpay SDK.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('userEmail');
      if (!email) {
        alert('User email not found. Please log in again.');
        return;
      }
      const response = await axios.post('http://localhost:8082/api/razorpay/create-subscription', null, {
        params: { planId: 'plan_QxX8BP3ukEUjZf', email },
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const { id: subscriptionId, key_id: razorpayKey } = data;
      const options = {
        key: razorpayKey,
        subscription_id: subscriptionId,
        name: 'SkillGram',
        description: 'Premium Monthly Subscription',
        handler: async (paymentResponse) => {
          try {
            await axios.post('http://localhost:8082/api/razorpay/activate-subscription', null, {
              params: { email },
              headers: { Authorization: `Bearer ${token}` },
            });
            alert('Subscription successful!');
            setTimeout(() => fetchUserStatus(), 1200);
          } catch (e) {
            alert('Failed to activate subscription.');
          }
        },
        prefill: { email },
        theme: { color: '#f43f5e' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Failed to initiate subscription.');
    }
  };


  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-rose-100 via-purple-200 to-orange-100'}`}> 
      <aside className={`w-64 min-h-screen fixed top-0 left-0 flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-md border-rose-200'} border-r shadow-lg z-20`}>
        <div className={`h-20 flex items-center justify-center border-b ${darkMode ? 'border-gray-700' : 'border-rose-200'}`}>
          <span className={`text-2xl font-extrabold tracking-tight ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>SkillGram</span>
        </div>
        <nav className="flex-1 flex flex-col justify-between p-4">
          <div className="flex flex-col gap-2">
            <h3 className="px-4 pt-2 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Main</h3>
            <NavItem to="/dashboard" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}>Home</NavItem>
            {userRole === 'ADMIN' && (
              <NavItem to="/admin-dashboard" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" /></svg>}>Admin Dashboard</NavItem>
            )}
            <NavItem to="/explore" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.49 4.51l-1.42 1.42a9 9 0 11-12.72 0L4.51 4.51M12 21a9 9 0 01-9-9" /></svg>}>Explore</NavItem>
            <NavItem to="/create-post" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}>
              Upload
              <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${isPremium ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'}`}>
                {isPremium ? 'Unlimited' : `${monthlyPostCount} / 5`}
              </span>
            </NavItem>
            <h3 className="px-4 pt-6 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Personal</h3>
            <NavItem to={`/profile/${userId}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>Profile</NavItem>
            <NavItem to="/liked-posts" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>}>
              Liked Posts
            </NavItem>
            <NavItem to="/saved-posts" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 17V5z" /></svg>}>Saved Posts</NavItem>
            <NavItem to="/settings" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>}>Settings</NavItem>
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={handleToggleDarkMode}
              className={`flex items-center gap-3 py-2.5 px-4 rounded-lg font-medium transition-colors ${darkMode ? 'text-yellow-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-rose-100'} `}
              aria-pressed={darkMode}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
             {/* <button
              onClick={handleLogout}
              className={`flex items-center gap-3 py-2.5 px-4 rounded-lg font-medium transition-colors text-red-500 hover:bg-red-100 dark:hover:bg-gray-700`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button> */}
          </div>
        </nav>
      </aside>
      
      <main className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '16rem' }}>
        <header className={`sticky top-0 w-full z-10 ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/70 backdrop-blur-lg border-rose-200'} border-b shadow-sm h-20 flex items-center justify-end px-8 gap-4`}>
          <div className="flex items-center gap-4">
            <SubscriptionStatus
                isPremium={isPremium}
                monthlyPostCount={monthlyPostCount}
                subscriptionExpiry={subscriptionExpiry}
                handleSubscribe={handleSubscribe}
                userRole={userRole}
            />
            <button
              onClick={() => navigate('/create-post')}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg hover:scale-110 transition-transform focus:outline-none"
              title="Create Post"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </button>
            <button
              onClick={() => navigate(`/profile/${userId}`)}
              className="focus:outline-none"
              title="Go to profile"
            >
              {profilePicUrl ? (
                <img src={profilePicUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover ring-2 ring-offset-2 ring-rose-300 dark:ring-rose-500" />
              ) : (
                  <div className="w-9 h-9 rounded-full bg-rose-200 dark:bg-rose-800 flex items-center justify-center ring-2 ring-offset-2 ring-rose-300 dark:ring-rose-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-rose-600 dark:text-rose-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
              )}
            </button>
          </div>
        </header>
        <div className="flex-1 p-8">
            <div className="w-full max-w-7xl mx-auto">
                <Outlet />
            </div>
        </div>
      </main>
    </div>
  );
}

export default Layout;