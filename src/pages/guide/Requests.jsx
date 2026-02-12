import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
   FaCheckCircle, FaTimesCircle, FaClock, FaMapMarkerAlt, FaUser, FaPhoneAlt, FaWhatsapp, FaUserFriends, FaCommentDots
} from 'react-icons/fa';
import { fetchQuery, where, updateDocument } from '../../firebase/db';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#3D4C38', '#D4AF37', '#e74c3c'];

const Requests = () => {
   const { currentUser } = useAuth();
   const [requests, setRequests] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const loadRequests = async () => {
         if (!currentUser?.uid) return;
         try {
            const data = await fetchQuery('bookings', where('guideId', '==', currentUser.uid));
            setRequests(data);
         } catch (error) {
            console.error("Error fetching requests:", error);
         } finally {
            setLoading(false);
         }
      };
      loadRequests();
   }, [currentUser]);

   // --- ACTIONS ---
   const handleAction = async (id, newStatus) => {
      try {
         await updateDocument('bookings', id, { status: newStatus });
         const updatedRequests = requests.map(req =>
            req.id === id ? { ...req, status: newStatus } : req
         );
         setRequests(updatedRequests);
      } catch (error) {
         console.error("Error updating booking status", error);
         alert("Failed to update status");
      }
   };

   // --- CHART DATA ---
   const getChartData = () => {
      const counts = { confirmed: 0, pending: 0, rejected: 0 };
      requests.forEach(r => {
         const status = r.status?.toLowerCase() || 'pending';
         if (counts[status] !== undefined) counts[status]++;
      });
      return [
         { name: 'Confirmed', value: counts.confirmed },
         { name: 'Pending', value: counts.pending },
         { name: 'Rejected', value: counts.rejected }
      ];
   };

   const itemVars = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 }
   };

   const getStatusBadge = (status) => {
      switch (status?.toLowerCase()) {
         case 'confirmed': return 'bg-[#3D4C38]/10 text-[#3D4C38] border-[#3D4C38]/20';
         case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
         default: return 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20';
      }
   };

   if (loading) return <div className="text-center p-10">Loading Requests...</div>;

   return (
      <motion.div
         initial="hidden" animate="visible"
         className="w-full space-y-8 pb-20"
      >

         {/* ==================== 1. HEADER & SUMMARY ==================== */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Header Text */}
            <motion.div variants={itemVars} className="lg:col-span-2 flex flex-col justify-center">
               <h1 className="text-4xl font-['Oswald'] font-bold text-[#2B3326] uppercase tracking-wide mb-2">
                  Booking Requests
               </h1>
               <p className="text-[#5A6654] text-sm leading-relaxed mb-6 max-w-xl">
                  Manage incoming trip requests. Review guest details, special requests, and contact them directly.
               </p>

               <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-[#F3F1E7] rounded-xl border border-[#DEDBD0] text-center">
                     <p className="text-xs font-bold text-[#5A6654] uppercase mb-1">Pending</p>
                     <p className="text-2xl font-bold text-[#D4AF37]">{requests.filter(r => r.status === 'pending').length}</p>
                  </div>
                  <div className="p-4 bg-[#F3F1E7] rounded-xl border border-[#DEDBD0] text-center">
                     <p className="text-xs font-bold text-[#5A6654] uppercase mb-1">Confirmed</p>
                     <p className="text-2xl font-bold text-[#3D4C38]">{requests.filter(r => r.status === 'confirmed').length}</p>
                  </div>
               </div>
            </motion.div>

            {/* Status Chart */}
            <motion.div variants={itemVars} className="lg:col-span-1 bg-[#F3F1E7] p-6 rounded-2xl shadow-xl shadow-[#3D4C38]/5 border border-[#DEDBD0]">
               <h3 className="font-['Oswald'] font-bold text-lg text-[#2B3326] uppercase mb-4 text-center">Overview</h3>
               <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={getChartData()} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value"
                        >
                           {getChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                           ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#2B3326', border: 'none', borderRadius: '8px', color: '#F3F1E7' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </motion.div>

         </div>


         {/* ==================== 2. REQUESTS LIST (Expanded Cards) ==================== */}
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatePresence>
               {requests.map((req) => (
                  <motion.div
                     key={req.id}
                     layout
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="bg-[#F3F1E7] rounded-2xl p-6 border border-[#DEDBD0] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                     {/* Top Row: User & Status */}
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-full bg-[#E2E6D5] flex items-center justify-center text-[#3D4C38] text-2xl border-2 border-white shadow-sm">
                              <FaUser />
                           </div>
                           <div>
                              <h4 className="font-['Oswald'] font-bold text-[#2B3326] text-xl uppercase">{req.touristName}</h4>
                              <div className="flex items-center gap-2 text-xs text-[#5A6654] font-bold uppercase tracking-wide">
                                 <span className="flex items-center gap-1"><FaMapMarkerAlt /> {req.placeName || req.placeId}</span>
                              </div>
                           </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusBadge(req.status)}`}>
                           {req.status}
                        </span>
                     </div>

                     {/* Details Grid */}
                     <div className="grid grid-cols-2 gap-4 mb-6 bg-white/50 p-4 rounded-xl border border-[#DEDBD0]/50">
                        <div>
                           <p className="text-[10px] text-[#5A6654] font-bold uppercase tracking-widest mb-1">Date & Time</p>
                           <div className="flex items-center gap-2 text-sm font-bold text-[#2B3326]">
                              <FaClock className="text-[#3D4C38]" /> {req.date} <span className="text-[#5A6654] font-normal">at</span> {req.time}
                           </div>
                        </div>
                        <div>
                           <p className="text-[10px] text-[#5A6654] font-bold uppercase tracking-widest mb-1">Guests</p>
                           <div className="flex items-center gap-2 text-sm font-bold text-[#2B3326]">
                              <FaUserFriends className="text-[#3D4C38]" /> {req.guests} People
                           </div>
                        </div>
                        {req.requests && (
                           <div className="col-span-2 pt-2 border-t border-[#DEDBD0]/50">
                              <p className="text-[10px] text-[#5A6654] font-bold uppercase tracking-widest mb-1">Special Request</p>
                              <div className="flex items-start gap-2 text-sm text-[#2B3326] italic">
                                 <FaCommentDots className="text-[#3D4C38] mt-1 shrink-0" /> "{req.requests}"
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Contact Actions */}
                     <div className="flex gap-3 mb-6">
                        <a href={`tel:${req.phone1}`} className="flex-1 py-3 bg-[#E2E6D5] text-[#3D4C38] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#3D4C38] hover:text-[#F3F1E7] transition-colors flex items-center justify-center gap-2">
                           <FaPhoneAlt /> Call
                        </a>
                        <a href={`https://wa.me/${req.phone1}`} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-[#E2E6D5] text-[#25D366] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center gap-2">
                           <FaWhatsapp className="text-lg" /> WhatsApp
                        </a>
                     </div>

                     {/* Footer Actions (Approve/Reject) */}
                     {req.status === 'pending' && (
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#DEDBD0]">
                           <button
                              onClick={() => handleAction(req.id, 'confirmed')}
                              className="py-3 bg-[#3D4C38] text-[#F3F1E7] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#2B3326] transition-colors flex items-center justify-center gap-2"
                           >
                              <FaCheckCircle /> Accept Request
                           </button>
                           <button
                              onClick={() => handleAction(req.id, 'rejected')}
                              className="py-3 bg-white border border-red-200 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                           >
                              <FaTimesCircle /> Reject
                           </button>
                        </div>
                     )}
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>

      </motion.div>
   );
};

export default Requests;