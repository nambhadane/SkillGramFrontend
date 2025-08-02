// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

// function Profile() {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);
//   const [userPosts, setUserPosts] = useState([]);
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const query = useQuery();
//   const loggedInUserId = localStorage.getItem('userId');
//   const [showLikes, setShowLikes] = useState({});
//   const [uploading, setUploading] = useState(false);
//   const [activeTab, setActiveTab] = useState(query.get('tab') || 'posts');
//   const [likedPosts, setLikedPosts] = useState([]);
//   const [loadingLiked, setLoadingLiked] = useState(false);
//   const [likedError, setLikedError] = useState(null);
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

//   // Logout handler
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   useEffect(() => {
//     const tab = query.get('tab');
//     if (tab) {
//       setActiveTab(tab);
//     }
//   }, [query]);

//   // Cloudinary upload handler for profile picture
//   const handleCloudinaryUpload = async () => {
//     window.cloudinary.openUploadWidget(
//       {
//         cloudName: 'duk7fa4je',
//         uploadPreset: 'unsigned_profile_upload',
//         sources: ['local', 'url', 'camera'],
//         multiple: false,
//         resourceType: 'image',
//         cropping: true,
//         maxFileSize: 5242880,
//         clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
//         styles: {
//           palette: {
//             window: '#f3e8ff',
//             sourceBg: '#fff',
//             windowBorder: '#a78bfa',
//             tabIcon: '#d946ef',
//             inactiveTabIcon: '#a1a1aa',
//             menuIcons: '#d946ef',
//             link: '#a21caf',
//             action: '#a21caf',
//             inProgress: '#a21caf',
//             complete: '#22c55e',
//             error: '#ef4444',
//             textDark: '#111827',
//             textLight: '#f3e8ff'
//           }
//         }
//       },
//       (error, result) => {
//         if (!error && result && result.event === 'success') {
//           // handle upload success
//         }
//         setUploading(false);
//       }
//     );
//     setUploading(true);
//   };

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('No token found. Please log in.');
//           return;
//         }
//         const userId = id ? parseInt(id, 10) : null;
//         if (!userId) {
//           setError('No user ID provided.');
//           return;
//         }
//         const response = await axios.get(`http://localhost:8082/api/users/profile/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.data) {
//           setUser(response.data);
//           if (response.data.profilePicUrl) {
//             localStorage.setItem('profilePicUrl', response.data.profilePicUrl);
//           } else {
//             localStorage.removeItem('profilePicUrl');
//           }
//         } else {
//           setError('No user data received from server.');
//         }
//         // Fetch user's posts
//         const postsRes = await axios.get(`http://localhost:8082/api/users/posts?userId=${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUserPosts(postsRes.data || []);
//       } catch (err) {
//         const errorMessage = err.response?.data?.message || err.response?.statusText || err.message;
//         setError(`Failed to load profile: ${errorMessage}`);
//       }
//     };
//     fetchProfile();
//   }, [id]);

//   useEffect(() => {
//     if (activeTab === 'liked') {
//       setLoadingLiked(true);
//       setLikedError(null);
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setLikedError('Authentication required to see liked posts.');
//         setLoadingLiked(false);
//         return;
//       }
//       axios.get(`http://localhost:8082/api/users/liked-posts`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//         .then(res => {
//           setLikedPosts(res.data || []);
//         })
//         .catch(() => {
//           setLikedError('Failed to load liked posts.');
//         })
//         .finally(() => {
//           setLoadingLiked(false);
//         });
//     }
//   }, [activeTab]);

//   // Delete post handler
//   const handleDeletePost = async (postId) => {
//     if (!window.confirm('Are you sure you want to delete this post?')) return;
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('No authentication token found. Please log in again.');
//       return;
//     }
//     try {
//       await axios.delete(`http://localhost:8082/api/users/posts/${postId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       // Remove post from UI
//       setUserPosts(userPosts.filter(post => post.id !== postId));
//       // Optionally: trigger a callback or event to update Dashboard if using global state
//     } catch (err) {
//       if (err.response && err.response.status === 403) {
//         alert('You are not authorized to delete this post. Make sure you are logged in as the post author.');
//       } else if (err.response && err.response.status === 401) {
//         alert('Authentication failed. Please log in again.');
//       } else {
//         alert('Failed to delete post: ' + (err.response?.data?.message || err.message));
//       }
//     }
//   };

//   const handleTabClick = (tabName) => {
//     setActiveTab(tabName);
//     navigate(`/profile/${id}?tab=${tabName}`, { replace: true });
//   };

//   if (error) return <p className="text-red-500 text-center font-medium">{typeof error === 'string' ? error : error.message || JSON.stringify(error)}</p>;
//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className={`w-full flex flex-col items-center min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50'}`}>
//       <div className="w-full max-w-3xl mx-auto mt-12 relative">
//         {/* Edit Profile Icon Button (top-right corner) */}
//         {String(user.id) === String(loggedInUserId) && (
//           <>
//             {/* Edit Profile Icon */}
//             <button
//               className="absolute top-4 right-16 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-purple-100 transition"
//               onClick={() => navigate('/edit-profile')}
//               aria-label="Edit Profile"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-purple-500">
//                 <circle cx="12" cy="8" r="5" />
//                 <rect x="15" y="15" width="7" height="3" rx="1.5" transform="rotate(-45 15 15)" />
//               </svg>
//             </button>
//             {/* Logout Icon */}
//             <button
//               className="absolute top-4 right-4 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-red-100 transition"
//               onClick={handleLogout}
//               aria-label="Logout"
//               title="Logout"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-red-500">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
//               </svg>
//             </button>
//           </>
//         )}
//         <div className={`rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
//           {/* Profile Picture */}
//           <div className="flex-shrink-0">
//             <div className="w-36 h-36 rounded-full border-4 border-pink-200 flex items-center justify-center overflow-hidden bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
//               {user.profilePicUrl ? (
//                 <img src={user.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
//               ) : (
//                 <span className="text-6xl font-extrabold text-white">👤</span>
//               )}
//             </div>
//           </div>
//           {/* Profile Info */}
//           <div className="flex-1 flex flex-col gap-2">
//             <h1 className="text-3xl font-bold text-gray-900">{user.fullName || 'Not set'}</h1>
//             <p className="text-gray-600 text-lg mb-2">{user.bio || 'No bio set.'}</p>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {user.skills && user.skills.split(',').map((skill, i) => (
//                 <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">{skill.trim()}</span>
//               ))}
//             </div>
//             <div className="flex flex-wrap gap-4 text-gray-500 text-sm mt-2">
//               <span><strong>Reputation:</strong> {user.reputationPoints || 0}</span>
//               {user.instaLink && (
//                 <span className="flex items-center gap-1">
//                   <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c3.727 0 6.75 3.023 6.75 6.75v6c0 3.727-3.023 6.75-6.75 6.75s-6.75-3.023-6.75-6.75v-6c0-3.727 3.023-6.75 6.75-6.75z" /><circle cx="12" cy="12" r="3.5" /></svg>
//                   <a href={user.instaLink} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Instagram</a>
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//         {/* Stats Row */}
//         <div className={`flex justify-around rounded-2xl shadow mt-8 py-6 text-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}> 
//           <div>
//             <div className="text-xl font-bold text-gray-900">{userPosts ? userPosts.length : 0}</div>
//             <div className="text-gray-500 text-xs">Posts</div>
//           </div>
//           <div>
//             <div className="text-xl font-bold text-gray-900">{user.reputationPoints || 0}</div>
//             <div className="text-gray-500 text-xs">Reputation</div>
//           </div>
//         </div>
//         {/* Tabs */}
//         <div className="flex justify-center mt-8">
//           <button
//             className={`px-6 py-2 rounded-t-lg font-semibold text-sm transition-all ${activeTab === 'posts' ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow' : 'bg-white text-gray-700 border-b-2 border-gray-200'}`}
//             onClick={() => handleTabClick('posts')}
//           >
//             Posts
//           </button>
//           <button
//             className={`px-6 py-2 rounded-t-lg font-semibold text-sm transition-all ${activeTab === 'achievements' ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow' : 'bg-white text-gray-700 border-b-2 border-gray-200'}`}
//             onClick={() => handleTabClick('achievements')}
//           >
//             Achievements
//           </button>
//           <button
//             className={`px-6 py-2 rounded-t-lg font-semibold text-sm transition-all ${activeTab === 'liked' ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow' : 'bg-white text-gray-700 border-b-2 border-gray-200'}`}
//             onClick={() => handleTabClick('liked')}
//           >
//             Liked
//           </button>
//         </div>
//         {/* Tab Content */}
//         <div className={`rounded-b-2xl shadow px-6 py-8 min-h-[200px] ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
//           {activeTab === 'posts' && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {userPosts && userPosts.length > 0 ? userPosts.map(post => (
//                 <div key={post.id} className={`relative rounded-xl shadow p-4 border flex flex-col gap-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
//                   {/* Delete button for own posts */}
//                   {String(user.id) === String(loggedInUserId) && (
//                     <button
//                       className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition font-semibold text-sm"
//                       onClick={() => handleDeletePost(post.id)}
//                       aria-label="Delete Post"
//                       title="Delete Post"
//                     >
//                       Delete
//                     </button>
//                   )}
//                   <h3 className="text-lg font-bold text-gray-900 mb-1">{post.title || 'No Title'}</h3>
//                   <p className="text-gray-700 mb-2">{post.description || 'No Description'}</p>
//                   {/* Media (image or video) */}
//                   {post.mediaUrl && (
//                     post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
//                       <video src={post.mediaUrl} controls className="w-full max-h-64 rounded-xl mb-2 object-cover bg-black" />
//                     ) : (
//                       <img src={post.mediaUrl} alt="Post media" className="w-full max-h-64 object-cover rounded-xl mb-2 bg-gray-200" />
//                     )
//                   )}
//                   {/* Tags */}
//                   <div className="flex flex-wrap gap-2 mb-1">
//                     {post.tags && post.tags.split(',').map((tag, i) => (
//                       <span key={i} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">#{tag.trim()}</span>
//                     ))}
//                   </div>
//                   {/* Content (HTML) */}
//                   {post.content && (
//                     <div className="prose max-w-none text-gray-800 mb-2" dangerouslySetInnerHTML={{ __html: post.content }} />
//                   )}
//                   {/* Date and stats */}
//                   <div className="flex flex-wrap gap-4 text-gray-500 text-xs mt-2">
//                     {post.createdAt && <span>{new Date(post.createdAt).toLocaleString()}</span>}
//                     {typeof post.likeCount !== 'undefined' && <span>👍 {post.likeCount}</span>}
//                     {typeof post.commentsCount !== 'undefined' && <span>💬 {post.commentsCount}</span>}
//                   </div>
//                 </div>
//               )) : <p className="text-gray-500 col-span-full">No posts yet.</p>}
//             </div>
//           )}
//           {activeTab === 'achievements' && (
//             <div className="flex flex-col items-center justify-center min-h-[120px] text-gray-500">No achievements yet.</div>
//           )}
//           {activeTab === 'liked' && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {loadingLiked ? (
//                 <p className="text-gray-500 col-span-full">Loading liked posts...</p>
//               ) : likedError ? (
//                 <p className="text-red-500 col-span-full">{likedError}</p>
//               ) : likedPosts && likedPosts.length > 0 ? (
//                 likedPosts.map(post => (
//                   <div key={post.id} className={`rounded-xl shadow p-4 border flex flex-col gap-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
//                     <h3 className="text-lg font-bold text-gray-900 mb-1">{post.title || 'No Title'}</h3>
//                     <p className="text-gray-700 mb-2">{post.description || 'No Description'}</p>
//                     <div className="flex flex-wrap gap-2 mb-1">
//                       {post.tags && post.tags.split(',').map((tag, i) => (
//                         <span key={i} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">#{tag.trim()}</span>
//                       ))}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500 col-span-full">You haven't liked any posts yet.</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// --- Reusable Modal Component ---
const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md transform transition-all scale-100">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useQuery();
  const loggedInUserId = localStorage.getItem('userId');
  const [activeTab, setActiveTab] = useState(query.get('tab') || 'posts');
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // --- Modal Controls ---
  const showModal = (title, message, onConfirm) => {
    setModal({ isOpen: true, title, message, onConfirm });
  };
  const hideModal = () => {
    setModal({ isOpen: false, title: '', message: '', onConfirm: null });
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const tab = query.get('tab');
    if (tab) setActiveTab(tab);
  }, [query]);

  // Cloudinary upload handler for profile picture
  const handleCloudinaryUpload = () => {
    if (!window.cloudinary) return;
    window.cloudinary.openUploadWidget({
        cloudName: 'duk7fa4je', // Replace with your cloud name
        uploadPreset: 'unsigned_profile_upload', // Replace with your upload preset
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: 'image',
        cropping: true,
        styles: { palette: { /* Theme styles */ } }
    }, (error, result) => {
        if (!error && result && result.event === 'success') {
            // Here you would typically send the new URL to your backend to save it
            console.log('New profile picture URL:', result.info.secure_url);
            setUser(prev => ({ ...prev, profilePicUrl: result.info.secure_url }));
            localStorage.setItem('profilePicUrl', result.info.secure_url);
        }
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in.');
        
        const userId = id || loggedInUserId;
        if (!userId) throw new Error('No user ID provided.');

        const [profileRes, postsRes] = await Promise.all([
             axios.get(`http://localhost:8082/api/users/profile/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
             axios.get(`http://localhost:8082/api/users/posts?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (profileRes.data) {
          setUser(profileRes.data);
          if (String(profileRes.data.id) === String(loggedInUserId) && profileRes.data.profilePicUrl) {
            localStorage.setItem('profilePicUrl', profileRes.data.profilePicUrl);
          }
        } else {
          throw new Error('No user data received from server.');
        }
        setUserPosts(postsRes.data || []);

      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(`Failed to load profile: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, loggedInUserId]);

  useEffect(() => {
    if (activeTab === 'liked') {
      const token = localStorage.getItem('token');
      if (!token) return;
      setLoading(true);
      axios.get(`http://localhost:8082/api/users/liked-posts`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setLikedPosts(res.data || []))
        .catch(() => setError('Failed to load liked posts.'))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  // Delete post handler
  const handleDeletePost = async (postId) => {
     showModal('Delete Post', 'Are you sure you want to delete this post? This will also remove all related comments, likes, and saved records. This action cannot be undone.', async () => {
        const token = localStorage.getItem('token');
        try {
            // Send a query param to request manual cascade delete in backend
            await axios.delete(`http://localhost:8082/api/users/posts/${postId}?cascade=true`, { headers: { Authorization: `Bearer ${token}` } });
            setUserPosts(userPosts.filter(post => post.id !== postId));
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete post.';
            setError(errorMessage);
        }
        hideModal();
     });
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    navigate(`/profile/${id}?tab=${tabName}`, { replace: true });
  };

  if (loading) return <p className="text-center mt-20">Loading Profile...</p>;
  if (error) return <p className="text-red-500 text-center mt-20 font-medium">{error}</p>;
  if (!user) return <p className="text-center mt-20">User not found.</p>;

  return (
    <>
    <Modal isOpen={modal.isOpen} title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onCancel={hideModal} />
    <div className={`w-full flex flex-col items-center min-h-screen`}>
      <div className="w-full max-w-4xl mx-auto mt-12 relative">
        {/* Profile Header */}
        <div className={`relative rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row items-center gap-8 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 backdrop-blur-md border border-rose-100'}`}>
            {String(user.id) === String(loggedInUserId) && (
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button className="bg-white/80 dark:bg-gray-700/80 rounded-full shadow-lg p-2 hover:bg-rose-100 dark:hover:bg-gray-600 transition" onClick={() => navigate('/edit-profile')} title="Edit Profile">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L13.5 6.5z" /></svg>
                </button>
                <button className="bg-white/80 dark:bg-gray-700/80 rounded-full shadow-lg p-2 hover:bg-rose-100 dark:hover:bg-gray-600 transition" onClick={handleLogout} title="Logout">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
                </button>
              </div>
            )}
            <div className="flex-shrink-0 relative">
                <img src={user.profilePicUrl || `https://placehold.co/144x144/f43f5e/ffffff?text=${user.fullName ? user.fullName[0] : 'S'}`} alt="Profile" className="w-36 h-36 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg" />
                {String(user.id) === String(loggedInUserId) && (
                    <button onClick={handleCloudinaryUpload} className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                    </button>
                )}
            </div>
            <div className="flex-1 flex flex-col gap-2 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{user.fullName || 'Not set'}</h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">{user.bio || 'No bio set.'}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2">
                    {user.skills && user.skills.split(',').map((skill, i) => (
                        <span key={i} className="bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-full text-xs font-medium">{skill.trim()}</span>
                    ))}
                </div>
                 <div className="flex flex-wrap gap-4 text-gray-500 dark:text-gray-400 text-sm mt-2 justify-center md:justify-start">
                    {user.instaLink && (
                        <a href={user.instaLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.585.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.415 2.175 8.796 2.163 12 2.163zm0 1.44c-3.115 0-3.486.011-4.71.066-2.783.127-4.044 1.39-4.171 4.171-.055 1.225-.066 1.596-.066 4.71s.011 3.486.066 4.71c.127 2.783 1.388 4.044 4.171 4.171 1.225.055 1.596.066 4.71.066s3.486-.011 4.71-.066c2.783-.127 4.044-1.39 4.171-4.171.055-1.225.066-1.596.066-4.71s-.011-3.486-.066-4.71c-.127-2.783-1.388-4.044-4.171-4.171-1.225-.055-1.596-.066-4.71-.066zM12 6.837a5.163 5.163 0 100 10.326 5.163 5.163 0 000-10.326zm0 8.42a3.257 3.257 0 110-6.514 3.257 3.257 0 010 6.514zM18.837 5.96a1.292 1.292 0 100 2.583 1.292 1.292 0 000-2.583z"></path></svg>
                            <span>Instagram</span>
                        </a>
                    )}
                </div>
            </div>
        </div>

        {/* Stats Row */}
        <div className={`flex justify-around rounded-2xl shadow-lg mt-8 py-6 text-center ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 backdrop-blur-md border border-rose-100'}`}>
            <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{userPosts.length}</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Posts</div>
            </div>
            {/* <div>
                {/* <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.reputationPoints || 0}</div> */}
                {/* <div className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Reputation</div> */}
            {/* </div> */} 
        </div>

        {/* Tabs */}
        <div className="flex justify-center mt-8 border-b border-rose-200 dark:border-gray-700">
            <button className={`px-6 py-3 font-semibold transition-all ${activeTab === 'posts' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-gray-500 dark:text-gray-400'}`} onClick={() => handleTabClick('posts')}>Posts</button>
            <button className={`px-6 py-3 font-semibold transition-all ${activeTab === 'achievements' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-gray-500 dark:text-gray-400'}`} onClick={() => handleTabClick('achievements')}>Achievements</button>
            <button className={`px-6 py-3 font-semibold transition-all ${activeTab === 'liked' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-gray-500 dark:text-gray-400'}`} onClick={() => handleTabClick('liked')}>Liked</button>
        </div>

        {/* Tab Content */}
        <div className="py-8 min-h-[200px]">
            {activeTab === 'posts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userPosts.length > 0 ? userPosts.map(post => (
                        <div key={post.id} className={`relative rounded-xl shadow-lg p-4 flex flex-col gap-2 transition-all hover:shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border-gray-100'}`}>
                            {String(user.id) === String(loggedInUserId) && (
                                <button className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow hover:bg-red-600 transition" onClick={() => handleDeletePost(post.id)} title="Delete Post (removes all related data)">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            )}
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{post.title}</h3>
                            {post.mediaUrl && (post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? 
                                <video src={post.mediaUrl} controls className="w-full h-40 rounded-lg object-cover bg-black" /> : 
                                <img src={post.mediaUrl} alt="Post media" className="w-full h-40 object-cover rounded-lg" />
                            )}
                            <p className="text-gray-700 dark:text-gray-300 text-sm flex-grow">{post.description}</p>
                             <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm mt-auto pt-3 border-t border-rose-100 dark:border-gray-700">
                                <span>❤️ {post.likeCount || 0}</span>
                                <span>💬 {post.comments?.length || 0}</span>
                            </div>
                        </div>
                    )) : <p className="text-gray-500 col-span-full text-center">No posts yet.</p>}
                </div>
            )}
            {activeTab === 'achievements' && (
                <div className="flex flex-col items-center justify-center min-h-[120px] text-gray-500">No achievements yet.</div>
            )}
            {activeTab === 'liked' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {likedPosts.length > 0 ? likedPosts.map(post => (
                        <div key={post.id} className={`rounded-xl shadow-lg p-4 flex flex-col gap-2 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border-gray-100'}`}>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{post.title}</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">by {post.authorFullName}</p>
                        </div>
                    )) : <p className="text-gray-500 col-span-full text-center">You haven't liked any posts yet.</p>}
                </div>
            )}
        </div>
      </div>
    </div>
    </>
  );
}

export default Profile;
