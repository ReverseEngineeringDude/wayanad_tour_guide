// src/App.jsx
import { useEffect , useRef } from 'react'; // 1. Import useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis'; // 2. Import Lenis

import Navbar from './components/Navbar';
import Home from './pages/user/Home';
import Explore from './pages/user/Explore';


// Guide Imports
import GuideLayout from './components/GuideLayout';

import MyProfile from './pages/guide/MyProfile';
import GuideHome from './pages/guide/GuideHome';
import AdminLayout from './components/AdminLayout';

import ManageGuides from './pages/admin/ManageGuides';
import ManagePlaces from './pages/admin/ManagePlaces';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminHome from './pages/admin/AdminHome';
import ManageUsers from './pages/admin/ManageUsers';
import ViewBookings from './pages/admin/ViewBooking';
import Requests from './pages/guide/Requests';

import PlaceDetails from './pages/user/PlaceDetails';
import GuideBooking from './pages/user/GuideBooking';

function App() {

 
  // 3. Initialize Lenis Smooth Scroll

 


  return (
    <Router>
      <Routes>
        {/* --- Public / User Routes (With Standard Navbar) --- */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/explore" element={<><Navbar /><Explore /></>} />
        <Route path="/place/:id" element={<PlaceDetails />} />
        <Route path="/book-guide/:guideId" element={<GuideBooking />} />

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