// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function AdminDashboard() {
//   const navigate = useNavigate();
//   useEffect(() => {
//     const role = localStorage.getItem('role');
//     if (role !== 'ADMIN') {
//       navigate('/dashboard');
//     }
//   }, [navigate]);

//   const [users, setUsers] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   // No post count/limit state for admin

//   useEffect(() => {
//     fetchAdminData();
//   }, []);
//   // No post count/limit logic for admin

//   const fetchAdminData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('token');
//       const [userRes, postRes] = await Promise.all([
//         axios.get('http://localhost:8082/api/users/list', {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get('http://localhost:8082/api/users/posts', {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);
//       setUsers(userRes.data);
//       setPosts(postRes.data);
//     } catch (err) {
//       setError('Failed to load admin data');
//       console.error('Fetch admin data failed:', err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // No post count/limit logic for admin

//   const handleVerifyUser = async (userId, isVerified) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `http://localhost:8082/api/users/verify/${userId}?isVerified=${!isVerified}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       fetchAdminData();
//     } catch (err) {
//       alert('Failed to update verification');
//       console.error('Verify user failed:', err.response?.data || err.message);
//     }
//   };

//   const handleEditUser = (userId) => {
//     navigate(`/admin/edit-user/${userId}`);
//   };

//   const handleDeleteUser = async (userId) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:8082/api/users/delete/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchAdminData();
//     } catch (err) {
//       alert('Failed to delete user');
//       console.error('Delete user failed:', err.response?.data || err.message);
//     }
//   };

//   const handleApprovePost = async (postId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `http://localhost:8082/api/users/posts/${postId}/status?status=APPROVED`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchAdminData();
//     } catch (err) {
//       alert('Failed to approve post');
//       console.error('Approve post failed:', err.response?.data || err.message);
//     }
//   };

//   const handleRejectPost = async (postId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `http://localhost:8082/api/users/posts/${postId}/status?status=REJECTED`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchAdminData();
//     } catch (err) {
//       alert('Failed to reject post');
//       console.error('Reject post failed:', err.response?.data || err.message);
//     }
//   };

//   const handleDeletePost = async (postId) => {
//     if (!window.confirm('Are you sure you want to delete this post?')) return;
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:8082/api/users/posts/${postId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchAdminData();
//     } catch (err) {
//       alert('Failed to delete post');
//       console.error('Delete post failed:', err.response?.data || err.message);
//     }
//   };

//   return (
//     <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center p-6">
//       <h1 className="text-3xl font-bold mb-6 text-purple-700">Admin Dashboard</h1>
//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : (
//         <>
//           <button
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium mb-6 shadow-sm"
//             onClick={fetchAdminData}
//           >
//             Refresh Data
//           </button>

//           {/* User Management */}
//           <section className="w-full max-w-5xl mb-8">
//             <h2 className="text-xl font-semibold mb-4">User Management</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white rounded-lg shadow">
//                 <thead>
//                   <tr>
//                     <th className="px-4 py-3 text-left">ID</th>
//                     <th className="px-4 py-3 text-left">Name</th>
//                     <th className="px-4 py-3 text-left">Email</th>
//                     <th className="px-4 py-3 text-left">Verified</th>
//                     <th className="px-4 py-3 text-left">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((user) => (
//                     <tr key={user.id} className="border-b">
//                       <td className="px-4 py-3">{user.id}</td>
//                       <td className="px-4 py-3">{user.fullName}</td>
//                       <td className="px-4 py-3">{user.email}</td>
//                       <td className="px-4 py-3">{user.isVerified ? 'Yes' : 'No'}</td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-3">
//                           <button
//                             title={user.isVerified ? 'Unverify' : 'Verify'}
//                             className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
//                               user.isVerified
//                                 ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             }`}
//                             onClick={() => handleVerifyUser(user.id, user.isVerified)}
//                           >
//                             {user.isVerified ? 'Unverify' : 'Verify'}
//                           </button>
//                           <button
//                             title="Edit"
//                             className="px-3 py-1 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm font-medium transition-colors duration-200"
//                             onClick={() => handleEditUser(user.id)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             title="Delete"
//                             className="px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium transition-colors duration-200"
//                             onClick={() => handleDeleteUser(user.id)}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </section>

//           {/* Post Moderation */}
//           <section className="w-full max-w-5xl">
//             <h2 className="text-xl font-semibold mb-4">Post Moderation</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white rounded-lg shadow">
//                 <thead>
//                   <tr>
//                     <th className="px-4 py-3 text-left">ID</th>
//                     <th className="px-4 py-3 text-left">Title</th>
//                     <th className="px-4 py-3 text-left">Author</th>
//                     <th className="px-4 py-3 text-left">Status</th>
//                     <th className="px-4 py-3 text-left">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {posts.map((post) => (
//                     <tr key={post.id} className="border-b">
//                       <td className="px-4 py-3">{post.id}</td>
//                       <td className="px-4 py-3">{post.title}</td>
//                       <td className="px-4 py-3">{post.authorFullName}</td>
//                       <td className="px-4 py-3">{post.status}</td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-3">
//                           <button
//                             title="Approve"
//                             className="px-3 py-1 rounded-md bg-green-100 text-green-700 hover:bg-green-200 text-sm font-medium transition-colors duration-200"
//                             onClick={() => handleApprovePost(post.id)}
//                           >
//                             Approve
//                           </button>
//                           <button
//                             title="Reject"
//                             className="px-3 py-1 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-sm font-medium transition-colors duration-200"
//                             onClick={() => handleRejectPost(post.id)}
//                           >
//                             Reject
//                           </button>
//                           <button
//                             title="Delete"
//                             className="px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium transition-colors duration-200"
//                             onClick={() => handleDeletePost(post.id)}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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


function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // --- Role Check ---
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      navigate('/dashboard'); // Redirect if not an admin
    }
  }, [navigate]);

  // --- Data Fetching ---
  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Using actual API calls now
      const [userRes, postRes] = await Promise.all([
        axios.get('http://localhost:8082/api/users/list', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:8082/api/users/posts', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUsers(userRes.data);
      setPosts(postRes.data);
    } catch (err) {
      setError('Failed to load admin data. Please try again later.');
      console.error('Fetch admin data failed:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);
  
  // --- Modal Controls ---
  const showModal = (title, message, onConfirm) => {
    setModal({ isOpen: true, title, message, onConfirm });
  };
  const hideModal = () => {
    setModal({ isOpen: false, title: '', message: '', onConfirm: null });
  };

  // --- Action Handlers ---
  const handleAction = async (action, successMessage, failureMessage) => {
    try {
      await action();
      fetchAdminData(); // Refresh data on success
    } catch (err) {
      showModal('Error', `${failureMessage}: ${err.response?.data?.message || err.message}`, hideModal);
      console.error(err);
    }
  };

  // --- User Management ---
  const handleVerifyUser = (userId, isVerified) => {
    const token = localStorage.getItem('token');
    handleAction(
      () => axios.put(`http://localhost:8082/api/users/verify/${userId}?isVerified=${!isVerified}`, {}, { headers: { Authorization: `Bearer ${token}` } }),
      'User verification updated!',
      'Failed to update verification'
    );
  };

  const handleDeleteUser = (userId) => {
    showModal('Delete User', 'Are you sure you want to delete this user? This action cannot be undone.', () => {
        const token = localStorage.getItem('token');
        handleAction(
            () => axios.delete(`http://localhost:8082/api/users/delete/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
            'User deleted successfully!',
            'Failed to delete user'
        );
        hideModal();
    });
  };

  // --- Post Management ---
  const handlePostStatusChange = (postId, status) => {
    const token = localStorage.getItem('token');
    handleAction(
        () => axios.put(`http://localhost:8082/api/users/posts/${postId}/status?status=${status}`, {}, { headers: { Authorization: `Bearer ${token}` } }),
        `Post status changed to ${status}!`,
        'Failed to update post status'
    );
  };
  
  const handleDeletePost = (postId) => {
     showModal('Delete Post', 'Are you sure you want to delete this post?', () => {
        const token = localStorage.getItem('token');
        handleAction(
            () => axios.delete(`http://localhost:8082/api/users/posts/${postId}`, { headers: { Authorization: `Bearer ${token}` } }),
            'Post deleted successfully!',
            'Failed to delete post'
        );
        hideModal();
    });
  };


  if (loading) {
    return <div className="flex items-center justify-center h-screen"><p className="text-xl">Loading Admin Panel...</p></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen"><p className="text-xl text-red-500">{error}</p></div>;
  }

  return (
    <>
    <Modal 
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={hideModal}
    />
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-rose-600 dark:text-rose-400">Admin Panel</h1>
        <button
          className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:scale-105 transition-transform flex items-center gap-2"
          onClick={fetchAdminData}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l16 16" /></svg>
          Refresh Data
        </button>
      </div>

      {/* --- User Management Table --- */}
      <section className="w-full mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">User Management</h2>
        <div className="overflow-x-auto bg-white/70 dark:bg-gray-800/50 backdrop-blur-md rounded-lg shadow-lg p-1">
          <table className="min-w-full">
            <thead className="border-b-2 border-rose-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-rose-100 dark:border-gray-700 last:border-b-0">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{user.fullName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                      {user.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleVerifyUser(user.id, user.isVerified)} className="p-2 rounded-md bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 transition" title={user.isVerified ? 'Unverify User' : 'Verify User'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6-4v6m2-6l-2 2" /></svg>
                      </button>
                      <button onClick={() => navigate(`/admin/edit-user/${user.id}`)} className="p-2 rounded-md bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 transition" title="Edit User">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L13.5 6.5z" /></svg>
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} className="p-2 rounded-md bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-700 transition" title="Delete User">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- Post Moderation Table --- */}
      <section className="w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Post Moderation</h2>
        <div className="overflow-x-auto bg-white/70 dark:bg-gray-800/50 backdrop-blur-md rounded-lg shadow-lg p-1">
          <table className="min-w-full">
             <thead className="border-b-2 border-rose-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Post</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-rose-100 dark:border-gray-700 last:border-b-0">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{post.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">by {post.authorFullName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${post.status === 'APPROVED' ? 'bg-green-100 text-green-800' : post.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handlePostStatusChange(post.id, 'APPROVED')} className="p-2 rounded-md bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 transition" title="Approve Post">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </button>
                      <button onClick={() => handlePostStatusChange(post.id, 'REJECTED')} className="p-2 rounded-md bg-gray-100 hover:bg-yellow-100 text-gray-600 hover:text-yellow-700 transition" title="Reject Post">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <button onClick={() => handleDeletePost(post.id)} className="p-2 rounded-md bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-700 transition" title="Delete Post">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
    </>
  );
}

export default AdminDashboard;