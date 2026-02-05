import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUserTie, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaHistory, FaArrowRight } from 'react-icons/fa';
import { myBookingsData } from '../../data/mockData';

const UserBookings = () => {
  const [filter, setFilter] = useState('all');

  // Filter Logic
  const filteredBookings = myBookingsData.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'pending') return booking.status === 'pending';
    if (filter === 'approved') return booking.status === 'confirmed';
    if (filter === 'history') return ['completed', 'cancelled', 'rejected'].includes(booking.status);
    return true;
  });

  return (
    <div className="min-h-screen bg-[#E2E6D5] text-[#2B3326] font-['Poppins'] selection:bg-[#3D4C38] selection:text-[#F3F1E7]">
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>

      {/* --- HEADER --- */}
      <div className="relative z-10 pt-32 pb-12 container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-[#5A6654] font-bold uppercase tracking-widest text-xs block mb-2">Your Journey</span>
            <h1 className="text-4xl md:text-5xl font-['Oswald'] font-bold text-[#1F261C] uppercase leading-none">
              My Bookings
            </h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-[#F3F1E7]/50 p-1 rounded-xl backdrop-blur-sm border border-[#DEDBD0] overflow-x-auto">
            {['all', 'pending', 'approved', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === tab 
                    ? 'bg-[#3D4C38] text-[#F3F1E7] shadow-md' 
                    : 'text-[#5A6654] hover:bg-[#E2E6D5]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* --- BOOKINGS LIST --- */}
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-20 bg-[#F3F1E7]/50 rounded-3xl border border-[#DEDBD0] border-dashed"
              >
                <div className="w-16 h-16 bg-[#E2E6D5] rounded-full flex items-center justify-center mx-auto mb-4 text-[#5A6654]">
                  <FaHistory className="text-2xl opacity-50" />
                </div>
                <h3 className="text-xl font-['Oswald'] font-bold text-[#1F261C] uppercase">No Bookings Found</h3>
                <p className="text-[#5A6654] text-sm mt-2 mb-6">Start exploring to book your first guide.</p>
                <Link to="/explore" className="inline-flex items-center gap-2 px-6 py-3 bg-[#3D4C38] text-[#F3F1E7] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#2B3326] transition-colors">
                  Explore Places <FaArrowRight />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- INDIVIDUAL BOOKING CARD COMPONENT ---
const BookingCard = ({ booking }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed': return { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <FaCheckCircle />, label: 'Approved' };
      case 'pending': return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: <FaHourglassHalf />, label: 'Pending Approval' };
      case 'completed': return { color: 'bg-gray-200 text-gray-700 border-gray-300', icon: <FaHistory />, label: 'Completed' };
      case 'cancelled': 
      case 'rejected': return { color: 'bg-red-100 text-red-800 border-red-200', icon: <FaTimesCircle />, label: 'Cancelled' };
      default: return { color: 'bg-gray-100', icon: null, label: status };
    }
  };

  const statusConfig = getStatusConfig(booking.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#F3F1E7] rounded-[2rem] p-4 md:p-6 shadow-sm hover:shadow-xl hover:border-[#3D4C38]/30 border border-[#DEDBD0] transition-all group"
    >
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        
        {/* Image Thumbnail */}
        <div className="w-full md:w-48 h-48 md:h-32 rounded-2xl overflow-hidden shrink-0 relative">
          <img src={booking.image || "https://placehold.co/400"} alt={booking.place} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-[#3D4C38]/10 mix-blend-multiply"></div>
        </div>

        {/* Info Section (Full Width now) */}
        <div className="flex-1 space-y-3 w-full">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <div>
              <h3 className="text-2xl font-['Oswald'] font-bold text-[#1F261C] uppercase leading-none">{booking.place}</h3>
              <div className="flex items-center gap-2 text-[#5A6654] text-xs font-bold uppercase tracking-wider mt-1">
                <FaMapMarkerAlt className="text-[#3D4C38]" /> Wayanad, Kerala
              </div>
            </div>
            
            {/* Status Badge */}
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${statusConfig.color}`}>
              {statusConfig.icon} {statusConfig.label}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#E2E6D5]/30 p-3 rounded-xl border border-[#DEDBD0]">
              <span className="block text-[10px] text-[#5A6654] font-bold uppercase mb-1">Guide</span>
              <div className="flex items-center gap-2 font-bold text-[#2B3326] text-sm">
                <FaUserTie className="text-[#3D4C38]" /> {booking.guideName}
              </div>
            </div>
            <div className="bg-[#E2E6D5]/30 p-3 rounded-xl border border-[#DEDBD0]">
              <span className="block text-[10px] text-[#5A6654] font-bold uppercase mb-1">Date</span>
              <div className="flex items-center gap-2 font-bold text-[#2B3326] text-sm">
                <FaCalendarAlt className="text-[#3D4C38]" /> {booking.date}
              </div>
            </div>
            <div className="bg-[#E2E6D5]/30 p-3 rounded-xl border border-[#DEDBD0]">
              <span className="block text-[10px] text-[#5A6654] font-bold uppercase mb-1">Time</span>
              <div className="flex items-center gap-2 font-bold text-[#2B3326] text-sm">
                <FaClock className="text-[#3D4C38]" /> {booking.time}
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default UserBookings;