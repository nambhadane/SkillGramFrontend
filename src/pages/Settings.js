// import React, { useState } from 'react';

// export default function Settings() {
//   // State for Change Email
//   const [newEmail, setNewEmail] = useState("");
//   const [emailMsg, setEmailMsg] = useState("");
//   const [emailLoading, setEmailLoading] = useState(false);

//   // State for Change Password
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [passwordMsg, setPasswordMsg] = useState("");
//   const [passwordLoading, setPasswordLoading] = useState(false);

//   // State for Delete Account
//   const [deleteMsg, setDeleteMsg] = useState("");
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

//   // Change Email Handler
//   const handleChangeEmail = async (e) => {
//     e.preventDefault();
//     setEmailMsg("");
//     if (!newEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmail)) {
//       setEmailMsg("Please enter a valid email address.");
//       return;
//     }
//     setEmailLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("/api/users/change-email", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { "Authorization": `Bearer ${token}` } : {})
//         },
//         body: JSON.stringify({ newEmail })
//       });
//       const text = await res.text();
//       if (res.ok) {
//         setEmailMsg("Email updated successfully. Please log in again if required.");
//         setNewEmail("");
//       } else {
//         setEmailMsg(text || "Failed to update email.");
//       }
//     } catch (err) {
//       setEmailMsg("Server error. Please try again later.");
//     }
//     setEmailLoading(false);
//   };

//   // Change Password Handler
//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     setPasswordMsg("");
//     if (!currentPassword || !newPassword) {
//       setPasswordMsg("Please fill in both fields.");
//       return;
//     }
//     setPasswordLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("/api/users/change-password", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { "Authorization": `Bearer ${token}` } : {})
//         },
//         body: JSON.stringify({ currentPassword, newPassword })
//       });
//       const text = await res.text();
//       if (res.ok) {
//         setPasswordMsg("Password updated successfully.");
//         setCurrentPassword("");
//         setNewPassword("");
//       } else {
//         setPasswordMsg(text || "Failed to update password.");
//       }
//     } catch (err) {
//       setPasswordMsg("Server error. Please try again later.");
//     }
//     setPasswordLoading(false);
//   };

//   // Delete Account Handler
//   const handleDeleteAccount = async () => {
//     if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
//     setDeleteMsg("");
//     setDeleteLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("/api/users/delete-account", {
//         method: "DELETE",
//         headers: {
//           ...(token ? { "Authorization": `Bearer ${token}` } : {})
//         }
//       });
//       const text = await res.text();
//       if (res.ok) {
//         setDeleteMsg("Account deleted successfully. Logging out...");
//         setTimeout(() => {
//           window.location.href = "/login";
//         }, 2000);
//       } else {
//         setDeleteMsg(text || "Failed to delete account.");
//       }
//     } catch (err) {
//       setDeleteMsg("Server error. Please try again later.");
//     }
//     setDeleteLoading(false);
//   };

//   return (
//     <div className={`max-w-2xl mx-auto p-8 rounded-2xl shadow-lg mt-8 ${darkMode ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-white'}`}>
//       <h1 className="text-3xl font-extrabold text-purple-700 mb-8 flex items-center gap-3">
//         <span role="img" aria-label="settings">⚙️</span> Settings
//       </h1>
//       <div className="space-y-10">
//         {/* 1. Account Settings */}
//         <section>
//           <h2 className="text-xl font-bold text-pink-600 mb-4 flex items-center gap-2">🔧 Account Settings</h2>
//           <div className="space-y-4">
//             {/* Change Email */}
//             <form onSubmit={handleChangeEmail} className="space-y-2">
//               <label className="block text-gray-700 font-semibold mb-1">Change Email</label>
//               <div className="flex gap-2">
//                 <input
//                   type="email"
//                   className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-200"
//                   placeholder="Enter new email"
//                   value={newEmail}
//                   onChange={e => setNewEmail(e.target.value)}
//                   required
//                   disabled={emailLoading}
//                 />
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
//                   disabled={emailLoading}
//                 >{emailLoading ? "Saving..." : "Save"}</button>
//               </div>
//               {emailMsg && <div className="text-sm mt-1" style={{ color: emailMsg.includes("success") ? 'green' : 'red' }}>{emailMsg}</div>}
//             </form>

//             {/* Change Password */}
//             <form onSubmit={handleChangePassword} className="space-y-2">
//               <label className="block text-gray-700 font-semibold mb-1">Change Password</label>
//               <div className="flex gap-2">
//                 <input
//                   type="password"
//                   className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-200"
//                   placeholder="Current password"
//                   value={currentPassword}
//                   onChange={e => setCurrentPassword(e.target.value)}
//                   required
//                   disabled={passwordLoading}
//                 />
//                 <input
//                   type="password"
//                   className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-200"
//                   placeholder="New password"
//                   value={newPassword}
//                   onChange={e => setNewPassword(e.target.value)}
//                   required
//                   disabled={passwordLoading}
//                 />
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
//                   disabled={passwordLoading}
//                 >{passwordLoading ? "Saving..." : "Save"}</button>
//               </div>
//               {passwordMsg && <div className="text-sm mt-1" style={{ color: passwordMsg.includes("success") ? 'green' : 'red' }}>{passwordMsg}</div>}
//             </form>

//             {/* Delete Account */}
//             {/* <div>
//               <button
//                 className="mt-2 px-4 py-2 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition"
//                 onClick={handleDeleteAccount}
//                 disabled={deleteLoading}
//               >{deleteLoading ? "Deleting..." : "Delete Account"}</button>
//               {deleteMsg && <div className="text-sm mt-1" style={{ color: deleteMsg.includes("success") ? 'green' : 'red' }}>{deleteMsg}</div>}
//             </div> */}
//           </div>
//         </section>

//         {/* <div className="text-gray-400 text-sm text-center pt-8">(Other settings coming soon!)</div> */}
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import axios from 'axios';

// It's a best practice to store the API base URL in an environment variable
// so it can be easily changed between development and production environments.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

// A reusable component for displaying messages.
const Message = ({ text, type }) => {
  if (!text) return null;
  const baseClasses = "text-sm mt-2 p-3 rounded-lg";
  const typeClasses = {
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return <div className={`${baseClasses} ${typeClasses[type]}`}>{text}</div>;
};

// Reusable Input component
const Input = (props) => (
    <input 
        {...props}
        className={`w-full px-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 ${props.darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-pink-500' : 'bg-gray-50 border-gray-300 focus:ring-pink-400'}`}
    />
);

// Reusable Button component
const Button = ({ children, loading, ...props }) => (
    <button 
        {...props}
        className="px-5 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 transition disabled:bg-pink-300 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
        disabled={loading}
    >
        {loading ? "Saving..." : children}
    </button>
);

export default function Settings() {
  // State for Change Email
  const [newEmail, setNewEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailMsgType, setEmailMsgType] = useState("error");
  const [emailLoading, setEmailLoading] = useState(false);

  // State for Change Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordMsgType, setPasswordMsgType] = useState("error");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // State for Delete Account
  const [deleteMsg, setDeleteMsg] = useState("");
  const [deleteMsgType, setDeleteMsgType] = useState("error");
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  // Change Email Handler
  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setEmailMsg("");
    if (!newEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmail)) {
      setEmailMsg("Please enter a valid email address.");
      setEmailMsgType("error");
      return;
    }
    setEmailLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/users/change-email`, { newEmail }, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setEmailMsg("Email updated successfully. Please log in again if resequired.");
      setEmailMsgType("success");
      setNewEmail("");
    } catch (err) {
      setEmailMsg(err.response?.data?.message || "Server error. Please try again later.");
      setEmailMsgType("error");
    } finally {
      setEmailLoading(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    if (!currentPassword || !newPassword) {
      setPasswordMsg("Please fill in both fields.");
      setPasswordMsgType("error");
      return;
    }
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/users/change-password`, { currentPassword, newPassword }, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setPasswordMsg("Password updated successfully.");
      setPasswordMsgType("success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || "Failed to update password.");
      setPasswordMsgType("error");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    // Replace window.confirm with a custom modal in a real app
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    setDeleteMsg("");
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/users/delete-account`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setDeleteMsg("Account deleted successfully. Logging you out...");
      setDeleteMsgType("success");
      setTimeout(() => {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Or use React Router's navigate
      }, 2000);
    } catch (err) {
      setDeleteMsg(err.response?.data?.message || "Failed to delete account.");
      setDeleteMsgType("error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className={`w-full min-h-screen flex justify-center py-12 px-4 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-rose-100 via-purple-200 to-orange-100 text-gray-900' : 'bg-transparent'}`}>
      <div className={`w-full max-w-2xl p-8 rounded-2xl shadow-lg h-fit ${darkMode ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-white'}`}>
        <h1 className={`text-3xl font-extrabold mb-8 flex items-center gap-3 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
          <span role="img" aria-label="settings">⚙️</span> Settings
        </h1>
        <div className="space-y-10">
          {/* 1. Account Settings */}
          <section>
            <h2 className={`text-xl font-bold mb-8 flex items-center gap-2 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>🔧 Account Settings</h2>
            <div className="space-y-6">
              {/* Change Email */}
              <form onSubmit={handleChangeEmail} className="space-y-2">
                <label className={`block font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Change Email</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    placeholder="Enter new email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    required
                    disabled={emailLoading}
                    darkMode={darkMode}
                  />
                  <Button type="submit" loading={emailLoading}>Save</Button>
                </div>
                <Message text={emailMsg} type={emailMsgType} />
              </form>

              {/* Change Password */}
              <form onSubmit={handleChangePassword} className="space-y-2">
                <label className={`block font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Change Password</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                    disabled={passwordLoading}
                    darkMode={darkMode}
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    disabled={passwordLoading}
                    darkMode={darkMode}
                  />
                  <Button type="submit" loading={passwordLoading}>Save</Button>
                </div>
                <Message text={passwordMsg} type={passwordMsgType} />
              </form>
            </div>
          </section>

          {/* 2. Danger Zone */}
          {/* <section>
            <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">🚨 Danger Zone</h2>
            <div>
              <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Once you delete your account, there is no going back. Please be certain.</p>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:bg-red-400"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >{deleteLoading ? "Deleting..." : "Delete Account"}</button>
              <Message text={deleteMsg} type={deleteMsgType} />
            </div>
          </section> */}
        </div>
      </div>
    </div>
  );
}
