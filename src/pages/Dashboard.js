
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreatePost from './CreatePost';
// Razorpay script loader
function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Dashboard() {
  const [postLimitError, setPostLimitError] = useState(null);
  // Subscription state
  const [subscribing, setSubscribing] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(null);

  // Premium and post limit state
  const [isPremium, setIsPremium] = useState(false);
  const [monthlyPostCount, setMonthlyPostCount] = useState(0);
  const [userStatusError, setUserStatusError] = useState(null);
  // Fetch user status (premium, monthly post count)
  const fetchUserStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUserStatusError('No token found. Please log in.');
        return;
      }
      const res = await axios.get('http://localhost:8082/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsPremium(res.data.premium);
      setMonthlyPostCount(res.data.monthlyPostCount);
    } catch (err) {
      setUserStatusError('Failed to fetch user status.');
    }
  };

  // Replace with your actual planId from Razorpay dashboard
  const RAZORPAY_PLAN_ID = 'plan_QxX8BP3ukEUjZf';

  const handleSubscribe = async () => {
    setSubscribing(true);
    setSubscriptionError(null);
    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      setSubscriptionError('Failed to load Razorpay SDK.');
      setSubscribing(false);
      return;
    }
    try {
      // Get user email (replace with your logic)
      const email = localStorage.getItem('userEmail') || 'test@example.com';
      // Call backend to create subscription
      const response = await axios.post('http://localhost:8082/api/razorpay/create-subscription', null, {
        params: { planId: RAZORPAY_PLAN_ID, email },
      });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const subscriptionId = data.id;
      const razorpayKey = 'rzp_test_1bUZdMIZIKpoPz'; // Replace with your Razorpay key id or fetch from backend

      const options = {
        key: razorpayKey,
        subscription_id: subscriptionId,
        name: 'SkillUp',
        description: 'Monthly Subscription',
        image: '/skillshowcase-icon.png',
        handler: function (response) {
          alert('Subscription successful! Payment ID: ' + response.razorpay_payment_id);
        },
        prefill: {
          email: email,
        },
        theme: {
          color: '#a78bfa',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setSubscriptionError('Failed to initiate subscription.');
    }
    setSubscribing(false);
  };
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [commentInput, setCommentInput] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [searchSkill, setSearchSkill] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showComments, setShowComments] = useState({});
  const [newPostIndicator, setNewPostIndicator] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const navigate = useNavigate();
  const loggedInUserId = localStorage.getItem('userId');
  const loggedInUserProfilePic = localStorage.getItem('profilePicUrl');

  const handlePostCreated = () => {
    fetchPosts();
    fetchUserStatus();
    setNewPostIndicator(true);
    setTimeout(() => setNewPostIndicator(false), 5000);
  };

  useEffect(() => {
    fetchPosts();
    fetchUserStatus();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }
      const response = await axios.get('http://localhost:8082/api/users/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setPosts(response.data);
        const initialLikedPosts = new Set(response.data.filter(post => post.likedByCurrentUser).map(post => post.id));
        setLikedPosts(initialLikedPosts);
        const initialSavedPosts = new Set(response.data.filter(post => post.savedByCurrentUser).map(post => post.id));
        setSavedPosts(initialSavedPosts);
      } else {
        setPosts([]);
      }
    } catch (err) {
      setError(err.response?.data || 'Failed to load posts due to a server error.');
    }
  };

  const handleCreatePostError = (err) => {
  if (err.response && err.response.status === 403) {
    setPostLimitError('You have reached your free post limit for this month. Subscribe for unlimited posts!');
  } else {
    setPostLimitError('Failed to create post. Please try again.');
  }
};


  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const isLiked = likedPosts.has(postId);
      await axios.post(`http://localhost:8082/api/users/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchPosts();
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (isLiked) newSet.delete(postId);
        else newSet.add(postId);
        return newSet;
      });
    } catch (err) {
      // Optionally show error
    }
  };

  const handleSave = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const isSaved = savedPosts.has(postId);
      await axios.post(`http://localhost:8082/api/users/posts/${postId}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchPosts();
      setSavedPosts(prev => {
        const newSet = new Set(prev);
        if (isSaved) newSet.delete(postId);
        else newSet.add(postId);
        return newSet;
      });
    } catch (err) {
      // Optionally show error
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInput({ ...commentInput, [postId]: value });
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8082/api/users/posts/${postId}/comments`, {
        comment: commentInput[postId],
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommentInput({ ...commentInput, [postId]: '' });
      fetchPosts();
    } catch (err) {
      // Optionally show error
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setSearchError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8082/api/users/search?skill=${encodeURIComponent(searchSkill)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(res.data.content || []);
    } catch (err) {
      setSearchError('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  

  const viewProfile = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      navigate('/profile/1');
    }
  };

  return (
    <div className={`w-full flex flex-col items-center min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' : ''}`}>
      {/* Subscription and post limit section removed as per request */}
      {/* Search bar
      <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto flex gap-2 mt-6 mb-4">
        <input
          type="text"
          value={searchSkill}
          onChange={e => setSearchSkill(e.target.value)}
          placeholder="Search by skill..."
          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold shadow-md hover:from-pink-600 hover:to-purple-600 transition-all text-sm"
          disabled={searching}
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form> */}
      {/* Feed area */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {error && <p className="text-red-500 text-center mt-4 col-span-full">{error}</p>}
        {searchError && <p className="text-red-500 text-center mb-2 col-span-full">{searchError}</p>}
        {newPostIndicator && <p className="text-green-600 text-center mb-2 col-span-full">New post created!</p>}
        {/* Show search results if searching or results exist */}
        {searchResults && searchResults.length > 0 ? (
          searchResults.map(user => (
            <div key={user.id} className={`rounded-2xl shadow-lg p-4 border flex flex-col gap-3 transition hover:shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center mb-1">
                <div className="w-9 h-9 rounded-full mr-2">
                  {user.profilePicUrl ? (
                    <img src={user.profilePicUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-pink-400" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
                      <span className="text-base font-bold text-white">👤</span>
                    </div>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-gray-900 text-base">{user.fullName || 'Not specified'}</span>
                  <button
                    onClick={() => viewProfile(user.id)}
                    className="ml-2 text-pink-600 hover:underline text-xs"
                  >
                    View Profile
                  </button>
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5 truncate">{user.skills || 'No Skills'}</h2>
              <p className="text-gray-700 text-sm mb-1 line-clamp-2">{user.bio || 'No Bio'}</p>
              {/* Tags as chips */}
              <div className="flex flex-wrap gap-2 mb-1">
                {user.skills ? user.skills.split(',').map((skill, i) => (
                  <span key={i} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">#{skill.trim()}</span>
                )) : (
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">No skills</span>
                )}
              </div>
            </div>
          ))
        ) : (
          posts && posts.length > 0 ? (
            [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(post => {
              // ...existing code for post card...
              let tags = Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
              return (
                // ...existing code for post card...
                <div key={post.id} className={`rounded-2xl shadow-lg p-4 border flex flex-col gap-3 transition hover:shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                  {/* ...existing code for post card... */}
                  {/* Media at the top */}
                  {post.mediaUrl && (
                    post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video
                        src={post.mediaUrl}
                        controls
                        className="w-full h-48 max-h-56 rounded-lg object-cover mb-2 bg-black"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <img
                        src={post.mediaUrl}
                        alt="Post media"
                        className="w-full h-48 max-h-56 rounded-lg object-cover mb-2 bg-gray-200"
                        style={{ objectFit: 'cover' }}
                      />
                    )
                  )}
                  <div className="flex items-center mb-1">
                    <div className="w-9 h-9 rounded-full mr-2">
                      {post.profilePicUrl ? (
                        <img src={post.profilePicUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-pink-400" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
                          {post.authorId && post.authorFullName ? (
                            <span className="text-base font-bold text-white">{post.authorFullName[0]}</span>
                          ) : (
                            <span className="text-base font-bold text-white">👤</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 text-base">{post.authorFullName || 'Not specified'}</span>
                      <button
                        onClick={() => viewProfile(post.authorId)}
                        className="ml-2 text-pink-600 hover:underline text-xs"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-0.5 truncate">{post.title || 'No Title'}</h2>
                  <p className="text-gray-700 text-sm mb-1 line-clamp-2">{post.description || 'No Description'}</p>
                  {/* Tags as chips */}
                  <div className="flex flex-wrap gap-2 mb-1">
                    {tags.length > 0 ? tags.slice(0, 4).map((tag, i) => (
                      <span key={i} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">#{tag}</span>
                    )) : (
                      <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">No tags</span>
                    )}
                  </div>
                  {/* Actions row */}
                  <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                    <button onClick={() => handleLike(post.id)} className="focus:outline-none flex items-center gap-1" title={likedPosts.has(post.id) ? 'Unlike' : 'Like'}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={likedPosts.has(post.id) ? '#ef4444' : 'none'} stroke="#ef4444" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      <span>{post.likeCount || 0}</span>
                    </button>
                    <button className="focus:outline-none flex items-center gap-1" title="Comment">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#374151" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 0 1-4.39-1.02L3 21l1.02-3.39A8.96 8.96 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                      <span>{post.comments ? post.comments.length : 0}</span>
                    </button>
                    <button className="ml-auto focus:outline-none" title={savedPosts.has(post.id) ? "Unsave" : "Save"} onClick={() => handleSave(post.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill={savedPosts.has(post.id) ? "#a78bfa" : "none"} viewBox="0 0 24 24" stroke="#374151" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-5-7 5V5z"/></svg>
                    </button>
                  </div>
                  {/* Always show comment section */}
                  <div className="mt-2 border-t pt-2">
                    {post.comments && post.comments.length > 0 ? (
                      <div className="mb-2 text-sm text-gray-700">
                        <span className="font-semibold text-gray-900 mr-2">{post.comments[post.comments.length-1].commenterName || 'Anonymous'}:</span>
                        <span>{post.comments[post.comments.length-1].comment || 'No Comment'}</span>
                      </div>
                    ) : (
                      <div className="mb-2 text-sm text-gray-500">No comments yet.</div>
                    )}
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={commentInput[post.id] || ''}
                        onChange={e => handleCommentChange(post.id, e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-1 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-sm"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold shadow-md hover:from-pink-600 hover:to-purple-600 transition-all text-xs"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            !error && <p className="text-gray-500 text-center col-span-full">No posts available.</p>
          )
        )}
      </div>
    </div>
  );
}

export default Dashboard;


////////////////////////////////////////////////////////////////////////////////////////////////////


