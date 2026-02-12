import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserTie, FaCheck, FaTimes, FaHourglassHalf, FaSearch, FaFilter } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { fetchQuery, where } from '../../firebase/db';

const UserBookings = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      if (currentUser) {
        try {
          const data = await fetchQuery('bookings', where('userId', '==', currentUser.uid));
          // Sort by date descending (client side for now as complex queries need index)
          const sortedData = data.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
          setBookings(sortedData);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadBookings();
  }, [currentUser]);

  // Filter Logic
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesSearch = (booking.placeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.guideName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Helper for Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-200"><FaCheck /> Confirmed</span>;
      case 'pending': return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-yellow-200"><FaHourglassHalf /> Pending</span>;
      case 'cancelled': return <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-red-200"><FaTimes /> Cancelled</span>;
      default: return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#E2E6D5] text-[#2B3326] font-['Poppins'] pt-24 pb-20 px-4 md:px-8">

      <div className="max-w-5xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-['Oswald'] font-bold uppercase text-[#1F261C] mb-2">My Journeys</h1>
            <p className="text-[#5A6654]">Manage your upcoming and past trips in Wayanad.</p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6654]" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-3 bg-[#F3F1E7] rounded-xl border border-[#DEDBD0] focus:border-[#3D4C38] outline-none text-sm font-medium"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6654]" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-48 pl-10 pr-4 py-3 bg-[#F3F1E7] rounded-xl border border-[#DEDBD0] focus:border-[#3D4C38] outline-none text-sm font-bold uppercase tracking-wider appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* BOOKINGS LIST */}
        {loading ? (
          <div className="text-center py-20 font-bold text-[#5A6654]">Loading your journeys...</div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className="bg-[#F3F1E7] p-6 rounded-3xl border border-[#DEDBD0] shadow-sm hover:shadow-lg transition-all group grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
                >
                  {/* Image */}
                  <div className="md:col-span-3 h-48 md:h-32 rounded-2xl overflow-hidden relative">
                    <img src={booking.placeImage || "https://placehold.co/300x200"} alt={booking.placeName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-6 space-y-3">
                    <h3 className="text-2xl font-['Oswald'] font-bold uppercase text-[#1F261C]">{booking.placeName}</h3>

                    <div className="flex flex-wrap gap-4 text-sm text-[#5A6654] font-medium">
                      <div className="flex items-center gap-2">
                        <FaUserTie className="text-[#3D4C38]" />
                        <span>Guide: <b className="text-[#2B3326]">{booking.guideName}</b></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#3D4C38]" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-[#3D4C38]" />
                        <span>{booking.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action / Price */}
                  <div className="md:col-span-3 flex flex-col items-start md:items-end justify-between h-full gap-4">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#5A6654] tracking-widest block">Total Price</span>
                      <span className="text-2xl font-bold text-[#3D4C38]">₹{booking.price || 'Pending'}</span>
                    </div>

                    {booking.status === 'confirmed' && (
                      <button className="px-5 py-2 bg-[#E2E6D5] text-[#3D4C38] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#3D4C38] hover:text-[#F3F1E7] transition-colors">
                        View Ticket
                      </button>
                    )}
                    {booking.status === 'pending' && (
                      <button className="px-5 py-2 border border-red-200 text-red-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-colors">
                        Cancel Request
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#E2E6D5] rounded-full flex items-center justify-center mx-auto mb-6 text-[#3D4C38] text-3xl">
              <FaMapMarkerAlt />
            </div>
            <h3 className="text-xl font-bold text-[#2B3326] mb-2">No Bookings Found</h3>
            <p className="text-[#5A6654] mb-8">You haven't booked any trips yet.</p>
            <button className="px-8 py-3 bg-[#3D4C38] text-[#F3F1E7] rounded-xl font-bold uppercase tracking-widest hover:bg-[#2B3326] transition-colors">
              Explore Places
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserBookings;