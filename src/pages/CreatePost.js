// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function CreatePost({ onPostCreated }) {
//   const [postData, setPostData] = useState({ title: '', description: '', category: '', mediaUrl: '', status: 'published', tags: [] });
//   const [tagInput, setTagInput] = useState('');
//   const [error, setError] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
//   const navigate = useNavigate();

//   // Cloudinary upload handler
//   const handleCloudinaryUpload = async () => {
//     window.cloudinary.openUploadWidget(
//       {
//         cloudName: 'duk7fa4je',
//         uploadPreset: 'unsigned_profile_upload',
//         sources: ['local', 'url', 'camera'],
//         multiple: false,
//         resourceType: 'auto',
//         cropping: false,
//         maxFileSize: 10485760,
//         clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm', 'ogg'],
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
//           setPostData(prev => ({ ...prev, mediaUrl: result.info.secure_url }));
//         }
//         setUploading(false);
//       }
//     );
//     setUploading(true);
//   };

//   // Tag input handlers
//   const handleTagInputChange = (e) => {
//     setTagInput(e.target.value);
//   };
//   const handleTagInputKeyDown = (e) => {
//     if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
//       e.preventDefault();
//       if (postData.tags.length < 5 && !postData.tags.includes(tagInput.trim())) {
//         setPostData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
//       }
//       setTagInput('');
//     }
//   };
//   const removeTag = (tag) => {
//     setPostData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!postData.title || !postData.description) {
//       setError('Title and description are required.');
//       return;
//     }
//     setSubmitting(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('token');
//       const payload = { ...postData, tags: postData.tags.join(',') };
//       await axios.post('http://localhost:8082/api/users/posts', payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPostData({ title: '', description: '', category: '', mediaUrl: '', status: 'published', tags: [] });
//       setTagInput('');
//       setSuccess(true);
//       if (onPostCreated) onPostCreated();
//       setTimeout(() => {
//         setSuccess(false);
//         navigate('/dashboard');
//       }, 2000);
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || err.message || 'Network Error';
//       setError(`Failed to create post: ${errorMessage}`);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className={`flex flex-col items-center min-h-screen py-12 px-4 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50'}`}>
//       <div className={`w-full max-w-3xl rounded-2xl shadow-xl p-8 relative ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
//         <button
//           type="button"
//           onClick={() => navigate('/dashboard')}
//           className="absolute left-6 top-6 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all"
//         >
//           ← Back to Dashboard
//         </button>
//         <h2 className="text-3xl font-bold mb-6 text-center text-pink-600">Share Your Skill</h2>
//         {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
//         {success && <p className="text-green-600 text-center mb-4 text-sm">Post created! Redirecting...</p>}
        
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
//           {/* Left Column: Media Upload */}
//           <div className={`flex flex-col gap-4 items-center justify-center rounded-xl p-6 border-2 border-dashed ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-purple-50 border-purple-200'}`}>
//             {postData.mediaUrl ? (
//               postData.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
//                 <video src={postData.mediaUrl} controls className="w-full h-auto max-h-64 rounded-lg object-cover bg-black" />
//               ) : (
//                 <img src={postData.mediaUrl} alt="Preview" className="w-full h-auto max-h-64 rounded-lg object-cover bg-gray-200" />
//               )
//             ) : (
//               <div className="text-center text-purple-500">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
//                 <p className="mt-2 text-sm">Upload an image or video</p>
//               </div>
//             )}
//             <button
//               type="button"
//               onClick={handleCloudinaryUpload}
//               className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold shadow-md hover:from-pink-600 hover:to-purple-600 transition-all"
//               disabled={uploading}
//             >
//               {uploading ? 'Uploading...' : (postData.mediaUrl ? 'Replace Media' : 'Choose Media')}
//             </button>
//             {postData.mediaUrl && (
//               <button type="button" onClick={() => setPostData({ ...postData, mediaUrl: '' })} className="text-xs text-red-500 hover:underline">Remove</button>
//             )}
//           </div>

//           {/* Right Column: Text Fields */}
//           <div className="flex flex-col gap-4">
//             <input
//               value={postData.title}
//               onChange={(e) => setPostData({ ...postData, title: e.target.value })}
//               placeholder="Post Title"
//               required
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
//             />
//             <textarea
//               value={postData.description}
//               onChange={(e) => setPostData({ ...postData, description: e.target.value })}
//               placeholder="Tell us about your skill..."
//               required
//               rows="4"
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
//             />
//             <input
//               value={postData.category}
//               onChange={(e) => setPostData({ ...postData, category: e.target.value })}
//               placeholder="Category (e.g., Music, Art)"
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
//             />
//             <div>
//               <input
//                 value={tagInput}
//                 onChange={handleTagInputChange}
//                 onKeyDown={handleTagInputKeyDown}
//                 placeholder="Add up to 5 tags..."
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
//               />
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {postData.tags.map(tag => (
//                   <span key={tag} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium flex items-center">
//                     #{tag}
//                     <button type="button" className="ml-2 text-purple-500 hover:text-purple-800" onClick={() => removeTag(tag)}>&times;</button>
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-bold shadow-lg hover:from-green-600 hover:to-teal-600 transition-all text-base" disabled={submitting}>
//               {submitting ? 'Sharing...' : 'Share Post'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default CreatePost;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost({ onPostCreated }) {
  const [postData, setPostData] = useState({ title: '', description: '', category: '', mediaUrl: '', status: 'published', tags: [] });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const navigate = useNavigate();

  // Load Cloudinary script and apply dark mode listener
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    document.body.appendChild(script);

    const handleDarkMode = () => {
        setDarkMode(localStorage.getItem('darkMode') === 'true');
    };
    // Listen for changes from other components
    window.addEventListener('storage', handleDarkMode);

    return () => {
        // Check if the script is still in the body before trying to remove it
        if (script.parentNode) {
            document.body.removeChild(script);
        }
        window.removeEventListener('storage', handleDarkMode);
    };
  }, []);


  // Cloudinary upload handler with updated theme
  const handleCloudinaryUpload = () => {
    if (!window.cloudinary) {
        // A simple, non-blocking notification
        setError("Image uploader is loading. Please try again in a moment.");
        setTimeout(() => setError(null), 3000);
        return;
    }
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'duk7fa4je', // Replace with your cloud name
        uploadPreset: 'unsigned_profile_upload', // Replace with your upload preset
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: 'auto',
        cropping: false,
        maxFileSize: 10485760, // 10MB
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm', 'ogg'],
        styles: {
          palette: {
            window: darkMode ? '#1f2937' : '#fff',
            sourceBg: darkMode ? '#374151' : '#f9fafb',
            windowBorder: '#f43f5e',
            tabIcon: '#f43f5e',
            inactiveTabIcon: '#9ca3af',
            menuIcons: '#f43f5e',
            link: '#ec4899',
            action: '#ec4899',
            inProgress: '#ec4899',
            complete: '#10b981',
            error: '#ef4444',
            textDark: '#111827',
            textLight: '#f9fafb'
          }
        }
      },
      (error, result) => {
        setUploading(false);
        if (!error && result && result.event === 'success') {
          setPostData(prev => ({ ...prev, mediaUrl: result.info.secure_url }));
        }
      }
    );
    setUploading(true);
  };

  // Tag input handlers
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  const handleTagInputKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (postData.tags.length < 5 && !postData.tags.includes(tagInput.trim())) {
        setPostData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };
  const removeTag = (tag) => {
    setPostData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postData.title || !postData.description) {
      setError('Title and description are required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const payload = { ...postData, tags: postData.tags.join(',') };
      await axios.post('http://localhost:8082/api/users/posts', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setPostData({ title: '', description: '', category: '', mediaUrl: '', status: 'published', tags: [] });
      setTagInput('');
      setSuccess(true);
      if (onPostCreated) onPostCreated();
      
      setTimeout(() => {
        setSuccess(false);
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Network Error';
      setError(`Failed to create post: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col items-center min-h-screen py-12 px-4 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-rose-100 via-purple-200 to-orange-100'}`}>
      <div className={`w-full max-w-4xl rounded-2xl shadow-2xl p-8 relative ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 backdrop-blur-lg border border-rose-200'}`}>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="absolute left-6 top-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>
        <h2 className="text-4xl font-bold mb-8 text-center text-rose-600 dark:text-rose-400">Share Your Skill</h2>
        
        {error && <p className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-center mb-6">{error}</p>}
        {success && <p className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md text-center mb-6">Post created successfully! Redirecting...</p>}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {/* Left Column: Media Upload */}
          <div className={`flex flex-col gap-4 items-center justify-center rounded-xl p-6 border-2 border-dashed ${darkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-rose-50 border-rose-200'}`}>
            {postData.mediaUrl ? (
              postData.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={postData.mediaUrl} controls className="w-full h-auto max-h-64 rounded-lg object-cover bg-black" />
              ) : (
                <img src={postData.mediaUrl} alt="Preview" className="w-full h-auto max-h-64 rounded-lg object-cover bg-gray-200" />
              )
            ) : (
              <div className="text-center text-rose-500 dark:text-rose-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <p className="mt-2 text-sm font-semibold">Upload an image or video</p>
              </div>
            )}
            <button
              type="button"
              onClick={handleCloudinaryUpload}
              className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold shadow-md hover:scale-105 transition-transform"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : (postData.mediaUrl ? 'Replace Media' : 'Choose Media')}
            </button>
            {postData.mediaUrl && (
              <button type="button" onClick={() => setPostData({ ...postData, mediaUrl: '' })} className="text-xs text-red-500 hover:underline">Remove</button>
            )}
          </div>

          {/* Right Column: Text Fields */}
          <div className="flex flex-col gap-5">
            <input
              value={postData.title}
              onChange={(e) => setPostData({ ...postData, title: e.target.value })}
              placeholder="Post Title"
              required
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-rose-500 focus:ring-rose-500' : 'bg-white border-gray-300 focus:border-rose-400 focus:ring-rose-400'}`}
            />
            <textarea
              value={postData.description}
              onChange={(e) => setPostData({ ...postData, description: e.target.value })}
              placeholder="Tell us about your skill..."
              required
              rows="4"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-rose-500 focus:ring-rose-500' : 'bg-white border-gray-300 focus:border-rose-400 focus:ring-rose-400'}`}
            />
            <input
              value={postData.category}
              onChange={(e) => setPostData({ ...postData, category: e.target.value })}
              placeholder="Category (e.g., Music, Art, Programming)"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-rose-500 focus:ring-rose-500' : 'bg-white border-gray-300 focus:border-rose-400 focus:ring-rose-400'}`}
            />
            <div>
              <input
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add up to 5 tags (press Enter)"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-rose-500 focus:ring-rose-500' : 'bg-white border-gray-300 focus:border-rose-400 focus:ring-rose-400'}`}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {postData.tags.map(tag => (
                  <span key={tag} className="bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    #{tag}
                    <button type="button" className="ml-2 text-rose-500 hover:text-rose-800 dark:hover:text-white" onClick={() => removeTag(tag)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition-transform text-base" disabled={submitting}>
              {submitting ? 'Sharing...' : 'Share Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;