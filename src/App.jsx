// src/App.jsx
import { useEffect } from 'react'; // 1. Import useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis'; // 2. Import Lenis

import Navbar from './components/Navbar';
import Home from './pages/user/Home';
import Explore from './pages/user/Explore';
import UserBookings from './pages/user/UserBookings';

// Guide Imports
import GuideLayout from './components/GuideLayout';

import MyProfile from './pages/Guide/MyProfile';
import GuideHome from './pages/Guide/GuideHome';
import AdminLayout from './components/AdminLayout';

import ManageGuides from './pages/admin/ManageGuides';
import ManagePlaces from './pages/admin/ManagePlaces';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminHome from './pages/admin/adminHome';
import ManageUsers from './pages/admin/ManageUsers';
import ViewBookings from './pages/admin/ViewBooking';
import Requests from './pages/Guide/Requests';

function App() {

  // 3. Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Adjust speed (default is 1.2)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
      smoothWheel: true,
      gestureOrientation: 'vertical',
    });

    // Request Animation Frame loop (Required for Lenis)
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* --- Public / User Routes (With Standard Navbar) --- */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/explore" element={<><Navbar /><Explore /></>} />
        <Route path="/my-bookings" element={<><Navbar /><UserBookings /></>} />

        {/* --- Guide Dashboard Routes (With Sidebar Layout) --- */}
        <Route path="/guide" element={<GuideLayout />}>
          <Route index element={<GuideHome />} />
          <Route path="requests" element={<Requests/>} />
          <Route path="profile" element={<MyProfile />} />
        </Route>

        {/* --- Admin Routes --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="guides" element={<ManageGuides />} />
          <Route path="bookings" element={<ViewBookings/>} />
          <Route path="places" element={<ManagePlaces />} />
        </Route>

        {/* --- Auth Routes --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
  );
}

export default App;