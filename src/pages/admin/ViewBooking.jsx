import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
   FaCalendarCheck, FaUserTie, FaMapMarkerAlt, FaFilter, FaSearch, FaEllipsisV, FaCircle
} from 'react-icons/fa';
import { fetchCollection } from '../../firebase/db';

// --- HELPER: GENERATE CHART DATA FROM REAL BOOKINGS ---
const generateBookingTrends = (bookings) => {
   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
   const trends = days.map(d => ({ name: d, confirmed: 0, pending: 0, rejected: 0 }));

   bookings.forEach(booking => {
      let date;
      if (booking.date) {
         // Try to parse booking.date
         date = new Date(booking.date);
      } else if (booking.createdAt) {
         date = new Date(booking.createdAt);
      } else {
         return;
      }

      if (!isNaN(date.getTime())) {
         const dayIndex = date.getDay();
         const status = booking.status?.toLowerCase() || 'pending';
         if (trends[dayIndex][status] !== undefined) {
            trends[dayIndex][status]++;
         }
      }
   });

   return trends;
};

const ViewBookings = () => {
   const [bookings, setBookings] = useState([]);
   const [loading, setLoading] = useState(true);
   const [filterStatus, setFilterStatus] = useState("All");
   const [searchTerm, setSearchTerm] = useState("");

   useEffect(() => {
      const loadBookings = async () => {
         try {
            const data = await fetchCollection('bookings');
            setBookings(data);
         } catch (error) {
            console.error("Error fetching bookings:", error);
         } finally {
            setLoading(false);
         }
      };
      loadBookings();
   }, []);

   const bookingTrendsData = generateBookingTrends(bookings);

   // --- FILTER LOGIC ---
   const filteredBookings = bookings.filter(booking => {
      const matchesStatus = filterStatus === "All" ? true : booking.status === filterStatus.toLowerCase();
      const matchesSearch = (booking.touristName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
         (booking.placeName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
   });

   // --- ANIMATION VARIANTS ---
   const containerVars = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
   };

   const itemVars = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 }
   };

   const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
         case 'confirmed': return 'text-[#3D4C38] bg-[#3D4C38]/10 border-[#3D4C38]/20';
         case 'rejected': return 'text-red-600 bg-red-50 border-red-100';
         default: return 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20';
      }
   };

   if (loading) return <div className="text-center p-10">Loading Bookings...</div>;

   return (
      <motion.div
         variants={containerVars}
         initial="hidden"
         animate="visible"
         className="w-full space-y-8 pb-20"
      >

         {/* ==================== 1. HEADER & CHART SECTION ==================== */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Header Text */}
            <motion.div variants={itemVars} className="lg:col-span-1 flex flex-col justify-center">
               <h1 className="text-4xl font-['Oswald'] font-bold text-[#2B3326] uppercase tracking-wide mb-2">
                  Bookings
               </h1>
               <p className="text-[#5A6654] text-sm leading-relaxed mb-6">
                  Track all tourist reservations, monitor status updates, and view transaction history.
               </p>

               {/* Quick Stat */}
               <div className="flex items-center gap-4 p-4 bg-[#F3F1E7] rounded-xl border border-[#DEDBD0] shadow-sm">
                  <div className="p-3 bg-[#3D4C38] text-[#F3F1E7] rounded-lg">
                     <FaCalendarCheck size={20} />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-[#5A6654] uppercase tracking-widest">Total Bookings</p>
                     <p className="text-2xl font-bold text-[#2B3326]">{bookings.length}</p>
                  </div>
               </div>
            </motion.div>

            {/* Trends Chart */}
            <motion.div variants={itemVars} className="lg:col-span-2 bg-[#F3F1E7] p-6 rounded-2xl shadow-xl shadow-[#3D4C38]/5 border border-[#DEDBD0]">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-['Oswald'] font-bold text-lg text-[#2B3326] uppercase">Weekly Activity</h3>
                  <button className="text-[#3D4C38] hover:bg-[#E2E6D5] p-2 rounded-full transition-colors"><FaEllipsisV /></button>
               </div>
               <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={bookingTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DEDBD0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#5A6654', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5A6654', fontSize: 12 }} />
                        <Tooltip
                           contentStyle={{ backgroundColor: '#2B3326', border: 'none', borderRadius: '8px', color: '#F3F1E7' }}
                           cursor={{ fill: '#E2E6D5' }}
                        />
                        <Bar dataKey="confirmed" stackId="a" fill="#3D4C38" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="pending" stackId="a" fill="#8B9D77" />
                        <Bar dataKey="rejected" stackId="a" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </motion.div>

         </div>


         {/* ==================== 2. TOOLBAR ==================== */}
         <motion.div variants={itemVars} className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#F3F1E7] p-4 rounded-xl border border-[#DEDBD0] shadow-sm">

            {/* Search Input */}
            <div className="relative w-full md:w-96">
               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6654]" />
               <input
                  type="text"
                  placeholder="Search by tourist or location..."
                  className="w-full pl-12 pr-4 py-3 bg-[#E2E6D5] border-none rounded-lg text-sm text-[#2B3326] placeholder-[#5A6654]/60 focus:ring-2 focus:ring-[#3D4C38] outline-none transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>

            {/* Filter Dropdown */}
            <div className="relative w-full md:w-auto">
               <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D4C38] z-10" />
               <select
                  className="w-full md:w-48 pl-10 pr-4 py-3 bg-[#E2E6D5] text-[#3D4C38] text-xs font-bold uppercase tracking-widest rounded-lg border-none focus:ring-2 focus:ring-[#3D4C38] outline-none appearance-none cursor-pointer hover:bg-[#DEDBD0] transition-colors"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
               >
                  <option value="All">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
               </select>
            </div>
         </motion.div>


         {/* ==================== 3. RESPONSIVE LIST / TABLE ==================== */}
         <motion.div variants={itemVars} className="bg-[#F3F1E7] rounded-2xl border border-[#DEDBD0] shadow-lg shadow-[#3D4C38]/5 overflow-hidden">

            {/* --- DESKTOP TABLE (Hidden on Mobile) --- */}
            <div className="hidden md:block overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-[#E2E6D5]/50 border-b border-[#DEDBD0]">
                     <tr>
                        {['Tourist', 'Assigned Guide', 'Location', 'Date', 'Amount', 'Status'].map((head) => (
                           <th key={head} className="px-6 py-5 text-[10px] font-bold text-[#5A6654] uppercase tracking-widest">
                              {head}
                           </th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DEDBD0]">
                     <AnimatePresence>
                        {filteredBookings.length > 0 ? (
                           filteredBookings.map((booking) => (
                              <motion.tr
                                 key={booking.id}
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: 1 }}
                                 exit={{ opacity: 0 }}
                                 className="hover:bg-[#E2E6D5]/30 transition-colors group"
                              >
                                 <td className="px-6 py-4 font-bold text-[#2B3326] text-sm">{booking.touristName}</td>
                                 <td className="px-6 py-4 text-sm text-[#3D4C38] font-medium flex items-center gap-2">
                                    <FaUserTie size={12} className="opacity-50" /> {booking.guideName}
                                 </td>
                                 <td className="px-6 py-4 text-sm text-[#5A6654]">{booking.placeName || booking.placeId}</td>
                                 <td className="px-6 py-4 text-sm text-[#5A6654] font-mono">{booking.date}</td>
                                 <td className="px-6 py-4 text-sm font-bold text-[#2B3326]">{booking.amount}</td>
                                 <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border flex items-center gap-2 w-fit ${getStatusColor(booking.status)}`}>
                                       <FaCircle size={6} /> {booking.status}
                                    </span>
                                 </td>
                              </motion.tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan="6" className="p-8 text-center text-[#5A6654] italic">
                                 No bookings found matching filters.
                              </td>
                           </tr>
                        )}
                     </AnimatePresence>
                  </tbody>
               </table>
            </div>

            {/* --- MOBILE CARDS (Visible on Mobile) --- */}
            <div className="md:hidden flex flex-col divide-y divide-[#DEDBD0]">
               <AnimatePresence>
                  {filteredBookings.length > 0 ? (
                     filteredBookings.map((booking) => (
                        <motion.div
                           key={booking.id}
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           className="p-6 flex flex-col gap-4 bg-[#F3F1E7]"
                        >
                           <div className="flex justify-between items-start">
                              <div>
                                 <h4 className="font-bold text-[#2B3326] text-lg">{booking.touristName}</h4>
                                 <div className="flex items-center gap-1 text-xs text-[#5A6654] mt-1">
                                    <FaMapMarkerAlt size={10} /> {booking.placeName || booking.placeId}
                                 </div>
                              </div>
                              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(booking.status)}`}>
                                 {booking.status}
                              </span>
                           </div>

                           <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-[#DEDBD0]/50">
                              <div>
                                 <p className="text-[10px] text-[#5A6654] uppercase tracking-widest mb-1">Guide</p>
                                 <p className="text-sm font-medium text-[#3D4C38] flex items-center gap-1">
                                    <FaUserTie size={10} /> {booking.guideName}
                                 </p>
                              </div>
                              <div>
                                 <p className="text-[10px] text-[#5A6654] uppercase tracking-widest mb-1">Date</p>
                                 <p className="text-sm font-medium text-[#2B3326]">{booking.date}</p>
                              </div>
                           </div>

                           <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-[#5A6654] uppercase tracking-widest">Total Amount</span>
                              <span className="text-lg font-['Oswald'] font-bold text-[#2B3326]">{booking.amount}</span>
                           </div>
                        </motion.div>
                     ))
                  ) : (
                     <div className="p-8 text-center text-[#5A6654] italic">
                        No bookings found.
                     </div>
                  )}
               </AnimatePresence>
            </div>

         </motion.div>

      </motion.div>
   );
};

export default ViewBookings;