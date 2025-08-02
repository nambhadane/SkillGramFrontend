// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function LikedPosts() {
//   const [likedPosts, setLikedPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
//   const [searchName, setSearchName] = useState('');
//   const [searchSkill, setSearchSkill] = useState('');
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchLikedPosts = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('You must be logged in to view liked posts.');
//           setLoading(false);
//           return;
//         }
//         const res = await axios.get('http://localhost:8082/api/users/liked-posts', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setLikedPosts(res.data || []);
//         setFilteredPosts(res.data || []);
//       } catch (err) {
//         setError('Failed to load liked posts.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLikedPosts();
//   }, []);

//   useEffect(() => {
//     // Filter posts by user name and skill
//     let filtered = likedPosts;
//     if (searchName.trim()) {
//       filtered = filtered.filter(post =>
//         post.authorFullName && post.authorFullName.toLowerCase().includes(searchName.trim().toLowerCase())
//       );
//     }
//     if (searchSkill.trim()) {
//       filtered = filtered.filter(post => {
//         if (!post.tags) return false;
//         const tagsArr = Array.isArray(post.tags) ? post.tags : post.tags.split(',');
//         return tagsArr.some(tag => tag.trim().toLowerCase().includes(searchSkill.trim().toLowerCase()));
//       });
//     }
//     setFilteredPosts(filtered);
//   }, [searchName, searchSkill, likedPosts]);

//   return (
//     <div className={`w-full flex flex-col items-center min-h-screen py-12 px-4 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50'}`}>
//       <div className="w-full max-w-4xl mx-auto">
//         {/* Search bar */}
//         <div className="flex flex-col md:flex-row gap-4 mb-8">
//           <input
//             type="text"
//             value={searchName}
//             onChange={e => setSearchName(e.target.value)}
//             placeholder="Search by user name..."
//             className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-sm"
//           />
//           <input
//             type="text"
//             value={searchSkill}
//             onChange={e => setSearchSkill(e.target.value)}
//             placeholder="Search by skill..."
//             className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-sm"
//           />
//         </div>
//         {loading ? (
//           <p className="text-gray-500 text-center">Loading liked posts...</p>
//         ) : error ? (
//           <p className="text-red-500 text-center">{error}</p>
//         ) : filteredPosts.length === 0 ? (
//           <p className="text-gray-500 text-center">No liked posts match your search.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {filteredPosts.map(post => (
//               <div key={post.id} className={`rounded-2xl shadow-lg p-6 border flex flex-col gap-3 transition hover:shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
//                 {/* Media at the top */}
//                 {post.mediaUrl && (
//                   post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
//                     <video
//                       src={post.mediaUrl}
//                       controls
//                       className="w-full h-48 max-h-56 rounded-lg object-cover mb-2 bg-black"
//                       style={{ objectFit: 'cover' }}
//                     />
//                   ) : (
//                     <img
//                       src={post.mediaUrl}
//                       alt="Post media"
//                       className="w-full h-48 max-h-56 rounded-lg object-cover mb-2 bg-gray-200"
//                       style={{ objectFit: 'cover' }}
//                     />
//                   )
//                 )}
//                 <div className="flex items-center mb-1">
//                   <div className="w-9 h-9 rounded-full mr-2">
//                     {post.profilePicUrl ? (
//                       <img src={post.profilePicUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-pink-400" />
//                     ) : (
//                       <div className="w-9 h-9 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
//                         {post.authorId && post.authorFullName ? (
//                           <span className="text-base font-bold text-white">{post.authorFullName[0]}</span>
//                         ) : (
//                           <span className="text-base font-bold text-white">👤</span>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <span className="font-semibold text-gray-900 text-base">{post.authorFullName || 'Not specified'}</span>
//                   </div>
//                 </div>
//                 <h2 className="text-lg font-bold text-gray-900 mb-0.5 truncate">{post.title || 'No Title'}</h2>
//                 <p className="text-gray-700 text-sm mb-1 line-clamp-2">{post.description || 'No Description'}</p>
//                 {/* Tags as chips */}
//                 <div className="flex flex-wrap gap-2 mb-1">
//                   {post.tags && post.tags.length > 0 ? (Array.isArray(post.tags) ? post.tags : post.tags.split(',')).slice(0, 4).map((tag, i) => (
//                     <span key={i} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">#{tag.trim()}</span>
//                   )) : (
//                     <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">No tags</span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default LikedPosts; 


import React, { useEffect, useState } from 'react';
import axios from 'axios';

// It's a best practice to store the API base URL in an environment variable
// so it can be easily changed between development and production environments.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

// A reusable component for the loading spinner to keep the main component clean.
const Spinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
  </div>
);

// A reusable component for displaying error or info messages.
const Message = ({ text, type = 'info' }) => {
  const baseClasses = "text-center p-4 rounded-lg";
  const typeClasses = {
    info: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    error: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
  };
  return <p className={`${baseClasses} ${typeClasses[type]}`}>{text}</p>;
};


function LikedPosts() {
  // State management
  const [likedPosts, setLikedPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchSkill, setSearchSkill] = useState('');

  // Initialize dark mode from localStorage. The toggle mechanism is assumed to be in a parent component.
  const [darkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  // Effect to fetch liked posts when the component mounts
  useEffect(() => {
    const fetchLikedPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // If there's no token, we don't need to make an API call.
          throw new Error('You must be logged in to view liked posts.');
        }
        
        const res = await axios.get(`${API_BASE_URL}/users/liked-posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const posts = res.data || [];
        setLikedPosts(posts);
        setFilteredPosts(posts); // Initialize filtered posts with all liked posts

      } catch (err) {
        // Provide a more descriptive error message.
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load liked posts.';
        setError(errorMessage);
        // Ensure that posts are cleared on error
        setLikedPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, []); // Empty dependency array means this runs once on mount

  // Effect to filter posts whenever search terms or the original post list change.
  // Note: For applications with many posts, it's more efficient to perform searching/filtering on the backend.
  useEffect(() => {
    let filtered = likedPosts;

    const trimmedName = searchName.trim().toLowerCase();
    if (trimmedName) {
      filtered = filtered.filter(post =>
        post.authorFullName && post.authorFullName.toLowerCase().includes(trimmedName)
      );
    }

    const trimmedSkill = searchSkill.trim().toLowerCase();
    if (trimmedSkill) {
      filtered = filtered.filter(post => {
        if (!post.tags) return false;
        // Defensively handle tags whether they are an array or a comma-separated string.
        const tagsArray = Array.isArray(post.tags) ? post.tags : post.tags.split(',');
        return tagsArray.some(tag => tag.trim().toLowerCase().includes(trimmedSkill));
      });
    }

    setFilteredPosts(filtered);
  }, [searchName, searchSkill, likedPosts]);

  // Main component render
  return (
    <div className={`w-full flex flex-col items-center min-h-screen py-5 px-4 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-rose-100 via-purple-200 to-orange-100 text-gray-900' : 'bg-transparent'}`}>
      <div className="w-full max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Your Liked Posts</h1>
        
        {/* Search inputs */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            placeholder="Search by author name..."
            aria-label="Search by author name"
            className={`flex-1 px-4 py-2 rounded-lg focus:ring-2 transition ${darkMode ? 'bg-gray-800 border-gray-600 focus:ring-pink-500 focus:border-pink-500' : 'bg-white border-gray-300 focus:ring-pink-300 focus:border-pink-500'}`}
          />
          <input
            type="text"
            value={searchSkill}
            onChange={e => setSearchSkill(e.target.value)}
            placeholder="Search by skill (e.g., React)..."
            aria-label="Search by skill"
            className={`flex-1 px-4 py-2 rounded-lg focus:ring-2 transition ${darkMode ? 'bg-gray-800 border-gray-600 focus:ring-purple-500 focus:border-purple-500' : 'bg-white border-gray-300 focus:ring-purple-300 focus:border-purple-500'}`}
          />
        </div>

        {/* Content display */}
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message text={error} type="error" />
        ) : filteredPosts.length === 0 ? (
          <Message text={searchName || searchSkill ? "No liked posts match your search." : "You haven't liked any posts yet."} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} darkMode={darkMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Extracted PostCard component for better separation of concerns and readability.
const PostCard = ({ post, darkMode }) => {
  const isVideo = post.mediaUrl && post.mediaUrl.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className={`rounded-2xl shadow-lg flex flex-col gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
      {/* Media Section */}
      {post.mediaUrl && (
        isVideo ? (
          <video
            src={post.mediaUrl}
            controls
            className="w-full h-48 rounded-t-2xl object-cover bg-black"
          />
        ) : (
          <img
            src={post.mediaUrl}
            alt={post.title || 'Post media'} // Use post title for more descriptive alt text
            className="w-full h-48 rounded-t-2xl object-cover bg-gray-200 dark:bg-gray-700"
          />
        )
      )}

      {/* Content Section */}
      <div className="p-5 pt-0 flex flex-col flex-grow">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full mr-3 flex-shrink-0">
            {post.profilePicUrl ? (
              <img
                src={post.profilePicUrl}
                alt={`Profile of ${post.authorFullName || 'author'}`}
                className="w-full h-full rounded-full object-cover border-2 border-pink-400"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/94a3b8/ffffff?text=A'; }} // Handle broken image links
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {post.authorFullName ? post.authorFullName[0].toUpperCase() : 'A'}
                </span>
              </div>
            )}
          </div>
          <span className={`font-semibold text-base ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {post.authorFullName || 'Anonymous'}
          </span>
        </div>
        
        <h2 className={`text-lg font-bold mb-1 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`} title={post.title}>
          {post.title || 'No Title'}
        </h2>
        
        <p className={`text-sm mb-4 line-clamp-2 flex-grow ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {post.description || 'No description available.'}
        </p>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2">
          {(Array.isArray(post.tags) ? post.tags : post.tags?.split(',') || []).slice(0, 4).map((tag, i) => (
            tag && <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium dark:bg-purple-900 dark:text-purple-200">
              #{tag.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LikedPosts;
