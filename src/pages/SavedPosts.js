// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function SavedPosts() {
//   const [posts, setPosts] = useState([]);
//   const [error, setError] = useState(null);
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

//   useEffect(() => {
//     const fetchSavedPosts = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('http://localhost:8082/api/users/saved-posts', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setPosts(res.data);
//       } catch (err) {
//         setError('Failed to load saved posts');
//       }
//     };
//     fetchSavedPosts();
//   }, []);

//   return (
//     <div className={`${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 min-h-screen py-12 px-4' : ''}`}>
//       {/* <h2 className="text-2xl font-bold mb-4">Saved Posts</h2> */}
//       {error && <p className="text-red-500">{error}</p>}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {posts.length === 0 ? (
//           <p className="text-gray-500">No saved posts.</p>
//         ) : (
//           posts.map(post => (
//             <div key={post.id} className={`rounded-2xl shadow-lg p-4 border flex flex-col gap-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
//               {/* Title */}
//               {/* Description */}
//               {/* <p className="text-gray-700 mb-2">{post.description || 'No Description'}</p> */}
//               {/* Image or Video */}
//               {post.imageUrl && post.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
//                 <video controls className="w-full max-h-64 rounded-xl mb-2">
//                   <source src={post.imageUrl} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               ) : post.imageUrl ? (
//                 <img src={post.imageUrl} alt="Post" className="w-full max-h-64 object-cover rounded-xl mb-2" />
//               ) : null}

//                             <h3 className="text-lg font-bold text-gray-900 mb-1">{post.title || 'No Title'}</h3>

//               {/* Tags */}
//               <div className="flex flex-wrap gap-2 mb-1">
//                 {post.tags && post.tags.split(',').map((tag, i) => (
//                   <span key={i} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">#{tag.trim()}</span>
//                 ))}
//               </div>
//               {/* Author and Date */}
//               <div className="flex items-center gap-3 text-sm text-gray-500 mb-1">
//                 {post.authorName && <span>By <span className="font-semibold text-purple-700">{post.authorName}</span></span>}
//                 {post.createdAt && <span>• {new Date(post.createdAt).toLocaleString()}</span>}
//               </div>
//               {/* Content (HTML) */}
//               {post.content && (
//                 <div className="prose max-w-none text-gray-800 mb-2" dangerouslySetInnerHTML={{ __html: post.content }} />
//               )}
//               {/* Likes, Comments, etc. */}
//               <div className="flex gap-4 text-sm text-gray-500 mt-2">
//                 {typeof post.likesCount !== 'undefined' && (
//                   <span>👍 {post.likesCount}</span>
//                 )}
//                 {typeof post.commentsCount !== 'undefined' && (
//                   <span>💬 {post.commentsCount}</span>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default SavedPosts;



import React, { useEffect, useState } from 'react';
import axios from 'axios';

// It's a best practice to store the API base URL in an environment variable
// so it can be easily changed between development and production environments.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

// A reusable component for the loading spinner.
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

function SavedPosts() {
  // State management
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize dark mode from localStorage.
  const [darkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  // Effect to fetch saved posts when the component mounts
  useEffect(() => {
    const fetchSavedPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('You must be logged in to view saved posts.');
        }
        
        const res = await axios.get(`${API_BASE_URL}/users/saved-posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts(res.data || []);

      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load saved posts.';
        setError(errorMessage);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, []); // Empty dependency array means this runs once on mount

  // Main component render
  return (
    <div className={`w-full flex flex-col items-center min-h-screen py-3 px-4 transition-colors duration-300 ${darkMode ?'bg-gradient-to-br from-rose-100 via-purple-200 to-orange-100 text-gray-900' : 'bg-transparent'}`}>
      <div className="w-full max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Your Saved Posts</h1>
        
        {/* Content display */}
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message text={error} type="error" />
        ) : posts.length === 0 ? (
          <Message text="You haven't saved any posts yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <SavedPostCard key={post.id} post={post} darkMode={darkMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// A dedicated component for rendering a saved post card.
const SavedPostCard = ({ post, darkMode }) => {
  const isVideo = post.imageUrl && post.imageUrl.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className={`rounded-2xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
      {/* Media Section */}
      {post.imageUrl && (
        isVideo ? (
          <video
            src={post.imageUrl}
            controls
            className="w-full h-48 rounded-t-2xl object-cover bg-black"
          />
        ) : (
          <img
            src={post.imageUrl}
            alt={post.title || 'Post media'}
            className="w-full h-48 rounded-t-2xl object-cover bg-gray-200 dark:bg-gray-700"
          />
        )
      )}

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h2 className={`text-lg font-bold mb-2 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`} title={post.title}>
          {post.title || 'No Title'}
        </h2>

        {/* Author and Date */}
        <div className={`flex items-center gap-2 text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {post.authorName && <span>By <span className="font-semibold text-purple-600 dark:text-purple-400">{post.authorName}</span></span>}
          {post.createdAt && <span>• {new Date(post.createdAt).toLocaleDateString()}</span>}
        </div>

        {/* Content (HTML) */}
        {post.content && (
          <div 
            className={`prose prose-sm max-w-none mb-4 flex-grow ${darkMode ? 'prose-invert' : ''}`} 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        )}

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(Array.isArray(post.tags) ? post.tags : post.tags?.split(',') || []).map((tag, i) => (
            tag && <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium dark:bg-purple-900 dark:text-purple-200">
              #{tag.trim()}
            </span>
          ))}
        </div>
        
        {/* Stats Section */}
        <div className={`flex gap-4 text-sm mt-auto pt-4 border-t ${darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'}`}>
          {typeof post.likesCount !== 'undefined' && (
            <span className="flex items-center gap-1">👍 {post.likesCount}</span>
          )}
          {typeof post.commentsCount !== 'undefined' && (
            <span className="flex items-center gap-1">💬 {post.commentsCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPosts;
