import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Layout from './Layout';
import MyPosts from './pages/MyPosts';
import LikedPosts from './pages/LikedPosts';
import SavedPosts from './pages/SavedPosts';

import EditProfile from './pages/EditProfile';
import EditUser from './pages/EditUser';
import Explore from './pages/Explore';
import Settings from './pages/Settings';

function App() {
  // Simple auth check
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset" element={<ResetPassword />} />
      {/* Main app pages with sidebar layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/liked-posts" element={<LikedPosts />} />
        <Route path="/saved-posts" element={<SavedPosts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/edit-user/:userId" element={<EditUser />} />
      </Route>
    </Routes>
  );
}

export default App;