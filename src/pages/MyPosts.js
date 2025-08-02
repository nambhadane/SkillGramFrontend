import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [showLikes, setShowLikes] = useState({});
  const [likesData, setLikesData] = useState({}); // postId -> array of users
  const [showComments, setShowComments] = useState({}); // postId -> boolean
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8082/api/users/posts?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data || []);
      } catch (err) {
        setError('Failed to load your posts.');
      }
    };
    fetchMyPosts();
  }, [userId]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8082/api/users/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      alert('Failed to delete post.');
    }
  };

  const toggleShowLikes = async (postId) => {
    setShowLikes(prev => ({ ...prev, [postId]: !prev[postId] }));
    if (!likesData[postId]) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8082/api/users/posts/${postId}/likes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikesData(prev => ({ ...prev, [postId]: response.data }));
      } catch (err) {
        setLikesData(prev => ({ ...prev, [postId]: [] }));
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {error && <p className="text-red-500 text-center col-span-full">{error}</p>}
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">You have not created any posts yet.</p>
        ) : (
          posts.map(post => {
            let tags = Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
            return (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100 flex flex-col gap-3 transition hover:shadow-2xl">
                {post.mediaUrl && (
                  post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video src={post.mediaUrl} controls className="w-full h-48 max-h-56 rounded-lg object-cover mb-2 bg-black" style={{ objectFit: 'cover' }} />
                  ) : (
                    <img src={post.mediaUrl} alt="Post media" className="w-full h-48 max-h-56 rounded-lg object-cover mb-2 bg-gray-200" style={{ objectFit: 'cover' }} />
                  )
                )}
                <h2 className="text-lg font-bold text-gray-900 mb-0.5 truncate">{post.title || 'No Title'}</h2>
                <p className="text-gray-700 text-sm mb-1 line-clamp-2">{post.description || 'No Description'}</p>
                <div className="flex flex-wrap gap-2 mb-1">
                  {tags.length > 0 ? tags.slice(0, 4).map((tag, i) => (
                    <span key={i} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">#{tag}</span>
                  )) : (
                    <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">No tags</span>
                  )}
                </div>
                <div className="flex items-center gap-6 text-gray-500 text-sm mt-1">
                  {/* Heart icon for likes */}
                  <button
                    onClick={() => toggleShowLikes(post.id)}
                    className="flex items-center gap-1 focus:outline-none"
                    title="Show Likes"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={showLikes[post.id] ? '#ef4444' : 'none'} />
                    </svg>
                    <span>{post.likeCount || 0}</span>
                  </button>
                  {/* Comment icon for comments */}
                  <button
                    onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                    className="flex items-center gap-1 focus:outline-none"
                    title="Show Comments"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#374151" strokeWidth="2" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 0 1-4.39-1.02L3 21l1.02-3.39A8.96 8.96 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{post.comments ? post.comments.length : 0}</span>
                  </button>
                  <button onClick={() => handleDeletePost(post.id)} className="ml-auto px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold shadow-md hover:from-red-600 hover:to-pink-600 transition-all text-xs">Delete</button>
                </div>
                {/* Collapsible like list */}
                {showLikes[post.id] && likesData[post.id] && likesData[post.id].length > 0 && (
                  <div className="mt-2 bg-gray-50 rounded-lg p-2 border border-gray-100">
                    <strong className="block mb-1 text-gray-700 text-xs">Liked by:</strong>
                    <ul className="pl-2">
                      {likesData[post.id].map(user => (
                        <li
                          key={user.id}
                          className="flex items-center mb-1 cursor-pointer hover:bg-purple-100 rounded px-2 py-1"
                          onClick={() => navigate(`/profile/${user.id}`)}
                        >
                          {user.profilePicUrl && (
                            <img src={user.profilePicUrl} alt="" width={24} height={24} className="rounded-full mr-2" />
                          )}
                          <span className="text-sm text-gray-800 font-medium">{user.fullName}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Collapsible comments list */}
                {showComments && showComments[post.id] && post.comments && post.comments.length > 0 && (
                  <div className="mt-2 bg-gray-50 rounded-lg p-2 border border-gray-100">
                    <strong className="block mb-1 text-gray-700 text-xs">Comments:</strong>
                    <ul className="pl-2">
                      {post.comments.map(comment => (
                        <li
                          key={comment.id}
                          className="flex items-center mb-1 cursor-pointer hover:bg-purple-50 rounded px-2 py-1"
                          onClick={() => navigate(`/profile/${comment.commenterId}`)}
                        >
                          {comment.profilePicUrl && (
                            <img src={comment.profilePicUrl} alt="" width={24} height={24} className="rounded-full mr-2" />
                          )}
                          <span className="font-semibold text-gray-900 text-xs mr-2">{comment.commenterName}:</span>
                          <span className="text-gray-700 text-sm">{comment.comment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyPosts; 