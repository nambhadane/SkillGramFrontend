// import React, { useState, useEffect } from 'react';

// const skills = [
//   'Art', 'Music', 'Coding', 'Design', 'Writing', 'Photography', 'Cooking', 'Fitness'
// ];

// // Trending skills will be calculated dynamically from posts


// function getTrendingSkills(posts, topN = 5) {
//   const skillCount = {};
//   posts.forEach(post => {
//     if (post.tags) {
//       post.tags.split(',').forEach(tag => {
//         const skill = tag.trim();
//         if (skill) {
//           skillCount[skill] = (skillCount[skill] || 0) + 1;
//         }
//       });
//     }
//   });
//   // Convert to array and sort by count descending
//   const sorted = Object.entries(skillCount)
//     .map(([name, count]) => ({ name, count }))
//     .sort((a, b) => b.count - a.count)
//     .slice(0, topN);
//   return sorted;
// }

// function Explore() {
//   const [selectedSkill, setSelectedSkill] = useState('All');
//   const [search, setSearch] = useState('');
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

//   useEffect(() => {
//     // Fetch all posts from all users
//     setLoading(true);
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setPosts([]);
//       setLoading(false);
//       return;
//     }
//     fetch('http://localhost:8082/api/users/posts', {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (Array.isArray(data)) {
//           setPosts(data);
//         } else if (data && Array.isArray(data.content)) {
//           setPosts(data.content);
//         } else {
//           setPosts([]);
//         }
//         setLoading(false);
//       })
//       .catch(() => {
//         setPosts([]);
//         setLoading(false);
//       });
//   }, []);

//   // Filter posts by search and selected skill
//   const filteredPosts = posts.filter(post => {
//     // Skill filter
//     let skillMatch = selectedSkill === 'All' || (post.tags && post.tags.split(',').map(t => t.trim().toLowerCase()).includes(selectedSkill.toLowerCase()));
//     // Search filter
//     let searchMatch = true;
//     if (search.trim() !== '') {
//       const s = search.trim().toLowerCase();
//       searchMatch = (
//         (post.title && post.title.toLowerCase().includes(s)) ||
//         (post.description && post.description.toLowerCase().includes(s)) ||
//         (post.tags && post.tags.toLowerCase().includes(s)) ||
//         (post.authorFullName && post.authorFullName.toLowerCase().includes(s))
//       );
//     }
//     return skillMatch && searchMatch;
//   });

//   return (
//     <div className={`w-full min-h-screen flex flex-col gap-8 p-8 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50'}`}>
//       <div className="mb-8">
//         <h1 className={`text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2 drop-shadow-lg ${darkMode ? 'drop-shadow' : ''}`}>
//           Unleash Your Curiosity<br />
//           <span className={`text-2xl font-semibold block mt-2 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Explore a world of creativity, connect with passionate creators, and discover the skills shaping tomorrow.</span>
//         </h1>
//         <form className="flex flex-col md:flex-row gap-4 items-center mt-6" onSubmit={e => e.preventDefault()}>
//           <input
//             type="text"
//             className={`w-full md:w-96 px-5 py-3 rounded-xl border shadow focus:outline-none focus:ring-2 focus:ring-pink-200 text-base placeholder-gray-400 ${darkMode ? 'border-gray-700 bg-gray-800 text-gray-100' : 'border-gray-200 bg-white'}`}
//             placeholder="Search skills, tags, or creators..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//         </form>
//         <div className="flex flex-wrap gap-3 mt-6">
//           <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Filter by Skill</span>
//           <button
//             className={`px-4 py-1 rounded-full text-sm font-medium border ${selectedSkill === 'All' ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow' : (darkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-700 border-gray-200')}`}
//             onClick={() => setSelectedSkill('All')}
//           >All</button>
//           {skills.map(skill => (
//             <button
//               key={skill}
//               className={`px-4 py-1 rounded-full text-sm font-medium border ${selectedSkill === skill ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow' : (darkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-700 border-gray-200')}`}
//               onClick={() => setSelectedSkill(skill)}
//             >{skill}</button>
//           ))}
//         </div>
//       </div>
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Trending Skills (Dynamic) */}
//         <div className={`w-full md:w-1/3 rounded-2xl shadow p-6 flex flex-col gap-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//           <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Trending Skills</h2>
//           <ul className="flex flex-col gap-3">
//             {getTrendingSkills(posts).length === 0 ? (
//               <li className={darkMode ? 'text-gray-500' : 'text-gray-400'}>No trending skills yet.</li>
//             ) : (
//               getTrendingSkills(posts).map((skill, idx) => (
//                 <li key={skill.name} className="flex items-center justify-between">
//                   <span className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>#{idx + 1} {skill.name}</span>
//                   <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{skill.count} posts</span>
//                 </li>
//               ))
//             )}
//           </ul>
//         </div>
//         {/* Featured Posts */}
//         <div className={`flex-1 rounded-2xl shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//           <div className="flex items-center justify-between mb-4">
//             <h2 className={`text-xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Featured Posts</h2>
//             <span className={`text-sm font-semibold ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>{filteredPosts.length} posts</span>
//           </div>
//           {loading ? (
//             <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading...</div>
//           ) : filteredPosts.length === 0 ? (
//             <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No posts found.</div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {filteredPosts.map(post => (
//                 <div key={post.id} className={`rounded-xl shadow p-4 border flex flex-col gap-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
//                   <div className="flex items-center gap-3 mb-2">
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-pink-200 to-purple-200'}`}>
//                       {post.profilePicUrl ? (
//                         <img src={post.profilePicUrl} alt="" className="w-full h-full object-cover" />
//                       ) : (
//                         <span className={`text-lg font-bold ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>{post.authorFullName ? post.authorFullName[0] : ''}</span>
//                       )}
//                     </div>
//                     <div>
//                       <div className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{post.authorFullName || 'Unknown'}</div>
//                       <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</div>
//                     </div>
//                     <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-pink-900 text-pink-200' : 'bg-pink-100 text-pink-600'}`}>{post.category || ''}</span>
//                   </div>
//                   <div className="w-full rounded-xl overflow-hidden mb-2">
//                     {post.mediaUrl && post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
//                       <video controls className="w-full h-56 object-cover rounded-xl">
//                         <source src={post.mediaUrl} type="video/mp4" />
//                         Your browser does not support the video tag.
//                       </video>
//                     ) : post.mediaUrl ? (
//                       <img src={post.mediaUrl} alt={post.title} className="w-full h-56 object-cover" />
//                     ) : null}
//                   </div>
//                   <div className={`font-semibold text-lg mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{post.title}</div>
//                   <div className={darkMode ? 'text-gray-300 mb-2' : 'text-gray-700 mb-2'}>{post.description}</div>
//                   {post.tags && (
//                     <div className="flex flex-wrap gap-2 mb-1">
//                       {post.tags.split(',').map((tag, i) => (
//                         <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>#{tag.trim()}</span>
//                       ))}
//                     </div>
//                   )}
//                   {post.content && (
//                     <div className={`prose max-w-none mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`} dangerouslySetInnerHTML={{ __html: post.content }} />
//                   )}
//                   <div className={`flex gap-4 text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                     {typeof post.likeCount !== 'undefined' && (
//                       <span>👍 {post.likeCount}</span>
//                     )}
//                     {typeof post.commentsCount !== 'undefined' && (
//                       <span>💬 {post.commentsCount}</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Explore;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Helper function to calculate trending skills from posts
function getTrendingSkills(posts, topN = 5) {
  const skillCount = {};
  posts.forEach(post => {
    const tags = Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? post.tags.split(',') : []);
    tags.forEach(tag => {
      const skill = tag.trim();
      if (skill) {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      }
    });
  });
  // Convert to array and sort by count descending
  return Object.entries(skillCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

// A simple SVG for the empty state to make it more engaging
const EmptyStateIllustration = () => (
    <div className="text-center py-10">
        <svg className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.5 9.5a.5.5 0 11-1 0 .5.5 0 011 0zM8.5 9.5a.5.5 0 11-1 0 .5.5 0 011 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-200">No Posts Found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try a different skill or search term.</p>
    </div>
);


function Explore() {
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for dark mode changes from the Layout component
    const handleStorageChange = () => {
        setDarkMode(localStorage.getItem('darkMode') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in.');
      setLoading(false);
      return;
    }

    axios.get('http://localhost:8082/api/users/posts', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
            setPosts(data);
            const initialLikedPosts = new Set(data.filter(post => post.likedByCurrentUser).map(post => post.id));
            setLikedPosts(initialLikedPosts);
            const initialSavedPosts = new Set(data.filter(post => post.savedByCurrentUser).map(post => post.id));
            setSavedPosts(initialSavedPosts);
        } else {
            setPosts([]);
            setError('Received an unexpected data format.');
        }
    })
    .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch posts.');
        console.error(err);
    })
    .finally(() => {
        setLoading(false);
    });

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- Like and Save Handlers (from Dashboard) ---
  const handleLike = async (postId) => {
    const token = localStorage.getItem('token');
    const isLiked = likedPosts.has(postId);
    // Optimistic update
    setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (isLiked) newSet.delete(postId); else newSet.add(postId);
        return newSet;
    });
    setPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, likeCount: isLiked ? p.likeCount - 1 : p.likeCount + 1 } : p));
    try {
      await axios.post(`http://localhost:8082/api/users/posts/${postId}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error("Failed to update like status:", err);
      // Revert on error
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (isLiked) newSet.add(postId); else newSet.delete(postId);
        return newSet;
      });
       setPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, likeCount: isLiked ? p.likeCount + 1 : p.likeCount - 1 } : p));
    }
  };

  const handleSave = async (postId) => {
    const token = localStorage.getItem('token');
    const isSaved = savedPosts.has(postId);
    setSavedPosts(prev => {
        const newSet = new Set(prev);
        if (isSaved) newSet.delete(postId); else newSet.add(postId);
        return newSet;
    });
    try {
      await axios.post(`http://localhost:8082/api/users/posts/${postId}/save`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error("Failed to update save status:", err);
       setSavedPosts(prev => {
        const newSet = new Set(prev);
        if (isSaved) newSet.add(postId); else newSet.delete(postId);
        return newSet;
      });
    }
  };

  const viewProfile = (userId) => {
    if (userId) navigate(`/profile/${userId}`);
  };

  // Filter posts by search and selected skill
  const filteredPosts = posts.filter(post => {
    const s = search.trim().toLowerCase();
    const tags = Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? post.tags.split(',').map(t => t.trim().toLowerCase()) : []);
    
    const skillMatch = selectedSkill === 'All' || tags.includes(selectedSkill.toLowerCase());
    const searchMatch = s === '' || 
      (post.title && post.title.toLowerCase().includes(s)) ||
      (post.description && post.description.toLowerCase().includes(s)) ||
      (tags.some(tag => tag.includes(s))) ||
      (post.authorFullName && post.authorFullName.toLowerCase().includes(s));
      
    return skillMatch && searchMatch;
  });

  const trendingSkills = getTrendingSkills(posts);

  return (
    <div className={`w-full min-h-screen flex flex-col gap-8`}>
      <div className="mb-4 animate-fade-in-down">
        <h1 className={`text-5xl font-extrabold bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent mb-2 drop-shadow-lg`}>
          Unleash Your Curiosity
        </h1>
        <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Explore a world of creativity and connect with passionate creators.</p>
        
        {/* Search Bar */}
        <form className="relative mt-8 max-w-lg" onSubmit={e => e.preventDefault()}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
                type="text"
                className={`w-full pl-12 pr-4 py-3 rounded-full border-2 shadow-sm focus:outline-none focus:ring-2 transition-all ${darkMode ? 'border-gray-700 bg-gray-800 text-gray-100 focus:ring-rose-500' : 'border-gray-200 bg-white focus:ring-rose-400'}`}
                placeholder="Search skills, tags, or creators..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </form>

        <div className="flex flex-wrap gap-3 mt-8 items-center">
          <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Filter by Skill:</span>
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all transform hover:scale-105 ${selectedSkill === 'All' ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white border-transparent shadow-md' : (darkMode ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100')}`}
            onClick={() => setSelectedSkill('All')}
          >All</button>
          {['Art', 'Music', 'Coding', 'Design', 'Writing'].map(skill => (
            <button
              key={skill}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all transform hover:scale-105 ${selectedSkill === skill ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white border-transparent shadow-md' : (darkMode ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100')}`}
              onClick={() => setSelectedSkill(skill)}
            >{skill}</button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Featured Posts */}
        <div className="lg:col-span-2">
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>Featured Posts</h2>
             {loading ? (
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading posts...</p>
             ) : error ? (
                <p className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">{error}</p>
             ) : filteredPosts.length === 0 ? (
                <EmptyStateIllustration />
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map(post => {
                      const tags = Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
                      const isLiked = likedPosts.has(post.id);
                      const isSaved = savedPosts.has(post.id);
                      return (
                         <div key={post.id} className={`rounded-2xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 backdrop-blur-md border border-rose-100'}`}>
                            {post.mediaUrl && (
                                <div className="relative">
                                    {post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? 
                                    <video src={post.mediaUrl} controls className="w-full h-48 rounded-t-2xl object-cover bg-black" /> : 
                                    <img src={post.mediaUrl} alt={post.title} className="w-full h-48 rounded-t-2xl object-cover" />}
                                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full">{post.category || 'General'}</div>
                                </div>
                            )}
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex items-center mb-3">
                                    <img src={post.profilePicUrl || `https://placehold.co/40x40/f43f5e/ffffff?text=${post.authorFullName ? post.authorFullName[0] : 'S'}`} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-rose-300" />
                                    <div className="ml-3">
                                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-base cursor-pointer hover:underline" onClick={() => viewProfile(post.authorId)}>{post.authorFullName || 'Unknown User'}</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1 truncate">{post.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 flex-grow">{post.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {tags.length > 0 ? tags.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-full text-xs font-medium">#{tag}</span>
                                    )) : <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">No tags</span>}
                                </div>
                                <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm mt-auto pt-3 border-t border-rose-100 dark:border-gray-700">
                                    <button onClick={() => handleLike(post.id)} className="focus:outline-none flex items-center gap-1.5 transition-colors hover:text-red-500" title={isLiked ? 'Unlike' : 'Like'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-5 h-5 transition-all ${isLiked ? 'text-red-500 fill-current' : 'text-gray-500 dark:text-gray-400 fill-none'}`} stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                        <span className="font-semibold">{post.likeCount || 0}</span>
                                    </button>
                                    <button className="focus:outline-none flex items-center gap-1.5 transition-colors hover:text-rose-500" title="Comment">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 0 1-4.39-1.02L3 21l1.02-3.39A8.96 8.96 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                                        <span className="font-semibold">{post.comments ? post.comments.length : 0}</span>
                                    </button>
                                    <button className="ml-auto focus:outline-none transition-colors hover:text-rose-500" title={isSaved ? "Unsave" : "Save"} onClick={() => handleSave(post.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 transition-all ${isSaved ? 'text-rose-500 fill-current' : 'text-gray-500 dark:text-gray-400 fill-none'}`}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-5-7 5V5z"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                      )
                  })}
                </div>
            )}
        </div>
        
        {/* Sidebar: Trending Skills */}
        <div className="lg:col-span-1">
          <div className={`sticky top-24 rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 backdrop-blur-md border border-rose-100'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>Trending Skills</h2>
            <ul className="flex flex-col gap-4">
              {trendingSkills.length === 0 ? (
                <li className={darkMode ? 'text-gray-500' : 'text-gray-400'}>No trending skills yet.</li>
              ) : (
                trendingSkills.map((skill, idx) => (
                  <li key={skill.name} className="flex items-center justify-between border-b border-rose-100 dark:border-gray-700 pb-3 last:border-b-0">
                    <div>
                        <span className={`font-bold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>#{idx + 1} {skill.name}</span>
                    </div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${darkMode ? 'bg-orange-800/50 text-orange-300' : 'bg-orange-100 text-orange-700'}`}>{skill.count} posts</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
