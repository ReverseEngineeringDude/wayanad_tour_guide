import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
   FaUsers, FaTrash, FaSearch, FaEllipsisV, FaFilter, FaUserCircle, FaEnvelope, FaCalendarAlt
} from 'react-icons/fa';
import { fetchCollection, deleteDocument } from '../../firebase/db';

// --- HELPER: ROBUST DATE FORMATTER ---
const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";
    try {
        if (dateInput.seconds) {
            return new Date(dateInput.seconds * 1000).toLocaleDateString("en-US", {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        }
        return new Date(dateInput).toLocaleDateString("en-US", {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    } catch (error) {
        return "Invalid Date";
    }
};

// --- HELPER: GENERATE CHART DATA ---
const generateGrowthData = (users) => {
   const monthCounts = {};
   users.forEach(user => {
      let date;
      // Handle various date formats
      const rawDate = user.joined || user.createdAt;
      
      if (rawDate?.seconds) date = new Date(rawDate.seconds * 1000);
      else if (rawDate) date = new Date(rawDate);
      else date = new Date();

      const month = date.toLocaleString('default', { month: 'short' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
   });

   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
   let cumulative = 0;
   return months.map(m => {
      cumulative += (monthCounts[m] || 0);
      return { name: m, users: cumulative };
   });
};

const ManageUsers = () => {
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");

   // --- DATA LOADING ---
   useEffect(() => {
      const loadData = async () => {
         try {
            const [usersData, bookingsData] = await Promise.all([
                fetchCollection('users'),
                fetchCollection('bookings')
            ]);

            // Calculate Booking Counts
            const bookingCounts = {};
            bookingsData.forEach(booking => {
                const uid = booking.userId || booking.user_id; 
                if (uid) bookingCounts[uid] = (bookingCounts[uid] || 0) + 1;
            });

            // Merge & Normalize Data
            const enrichedUsers = usersData.map(user => ({
                ...user,
                // --- FIX: CHECK ALL POSSIBLE NAME FIELDS ---
                realName: user.name || user.displayName || user.fullName || "Unknown User",
                realBookingCount: bookingCounts[user.id] || 0, 
                displayDate: user.createdAt || user.joined 
            }));

            setUsers(enrichedUsers);
         } catch (error) {
            console.error("Error fetching data:", error);
         } finally {
            setLoading(false);
         }
      };
      loadData();
   }, []);

   // --- DERIVED DATA ---
   const tourists = users.filter(user => user.role !== 'guide' && user.role !== 'admin');
   const userGrowthData = generateGrowthData(tourists);

   // --- FILTERING ---
   const filteredUsers = tourists.filter(user => {
      const matchesSearch = (user.realName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      return matchesSearch;
   });

   const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to remove this user? This cannot be undone.")) {
         try {
            await deleteDocument('users', id);
            setUsers(users.filter(user => user.id !== id));
         } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
         }
      }
   };

   // --- ANIMATION VARIANTS ---
   const containerVars = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
   };

   const itemVars = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 }
   };

   if (loading) return <div className="text-center p-10 text-[#5A6654]">Loading Users & Activity...</div>;

   return (
      <motion.div
         variants={containerVars}
         initial="hidden"
         animate="visible"
         className="w-full space-y-8 pb-20"
      >

         {/* ==================== 1. HEADER & CHART SECTION ==================== */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div variants={itemVars} className="lg:col-span-1 flex flex-col justify-center">
               <h1 className="text-4xl font-['Oswald'] font-bold text-[#2B3326] uppercase tracking-wide mb-2">
                  User Management
               </h1>
               <p className="text-[#5A6654] text-sm leading-relaxed mb-6">
                  View, search, and manage registered tourists. Track user growth and activity.
               </p>

               <div className="flex items-center gap-4 p-4 bg-[#F3F1E7] rounded-xl border border-[#DEDBD0] shadow-sm">
                  <div className="p-3 bg-[#3D4C38] text-[#F3F1E7] rounded-lg">
                     <FaUsers size={20} />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-[#5A6654] uppercase tracking-widest">Total Tourists</p>
                     <p className="text-2xl font-bold text-[#2B3326]">{tourists.length}</p>
                  </div>
               </div>
            </motion.div>

            <motion.div variants={itemVars} className="lg:col-span-2 bg-[#F3F1E7] p-6 rounded-2xl shadow-xl shadow-[#3D4C38]/5 border border-[#DEDBD0]">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-['Oswald'] font-bold text-lg text-[#2B3326] uppercase">New Registrations</h3>
                  <button className="text-[#3D4C38] hover:bg-[#E2E6D5] p-2 rounded-full transition-colors"><FaEllipsisV /></button>
               </div>
               <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={userGrowthData}>
                        <defs>
                           <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3D4C38" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3D4C38" stopOpacity={0} />
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DEDBD0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#5A6654', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5A6654', fontSize: 12 }} />
                        <Tooltip
                           contentStyle={{ backgroundColor: '#2B3326', border: 'none', borderRadius: '8px', color: '#F3F1E7' }}
                        />
                        <Area type="monotone" dataKey="users" stroke="#3D4C38" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </motion.div>
         </div>


         {/* ==================== 2. TOOLBAR ==================== */}
         <motion.div variants={itemVars} className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#F3F1E7] p-4 rounded-xl border border-[#DEDBD0] shadow-sm">
            <div className="relative w-full sm:w-96">
               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6654]" />
               <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-12 pr-4 py-3 bg-[#E2E6D5] border-none rounded-lg text-sm text-[#2B3326] placeholder-[#5A6654]/60 focus:ring-2 focus:ring-[#3D4C38] outline-none transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            
         </motion.div>


         {/* ==================== 3. RESPONSIVE LIST / TABLE ==================== */}
         <motion.div variants={itemVars} className="bg-[#F3F1E7] rounded-2xl border border-[#DEDBD0] shadow-lg shadow-[#3D4C38]/5 overflow-hidden">

            {/* --- DESKTOP TABLE --- */}
            <div className="hidden md:block overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-[#E2E6D5]/50 border-b border-[#DEDBD0]">
                     <tr>
                        {['User Profile', 'Contact', 'Joined Date', 'Activity', 'Status', 'Actions'].map((head) => (
                           <th key={head} className="px-6 py-5 text-[10px] font-bold text-[#5A6654] uppercase tracking-widest">
                              {head}
                           </th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DEDBD0]">
                     <AnimatePresence>
                        {filteredUsers.length > 0 ? (
                           filteredUsers.map((user) => (
                              <motion.tr
                                 key={user.id}
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: 1 }}
                                 exit={{ opacity: 0 }}
                                 className="hover:bg-[#E2E6D5]/30 transition-colors group"
                              >
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-full bg-[#DEDBD0] flex items-center justify-center text-[#5A6654] text-lg overflow-hidden">
                                          {user.image || user.photoURL ? (
                                              <img src={user.image || user.photoURL} alt="" className="w-full h-full object-cover"/>
                                          ) : (
                                              <FaUserCircle />
                                          )}
                                       </div>
                                       {/* --- USE NORMALIZED NAME --- */}
                                       <p className="font-bold text-[#2B3326] text-sm">{user.realName}</p>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-sm text-[#5A6654] font-medium">{user.email}</td>
                                 
                                 <td className="px-6 py-4 text-sm text-[#5A6654]">
                                     {formatDate(user.displayDate)}
                                 </td>

                                 <td className="px-6 py-4">
                                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                       {user.realBookingCount} Bookings
                                    </span>
                                 </td>

                                 <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 w-fit
                                    ${user.status === 'Active' ? 'bg-[#3D4C38]/10 text-[#3D4C38]' : 'bg-gray-100 text-gray-500'}
                                   `}>
                                       <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-[#3D4C38]' : 'bg-gray-400'}`}></span>
                                       {user.status || 'Active'}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                    <button
                                       onClick={() => handleDelete(user.id)}
                                       className="p-2 rounded-lg bg-[#E2E6D5] text-[#5A6654] hover:bg-red-100 hover:text-red-600 transition-colors opacity-60 group-hover:opacity-100"
                                       title="Remove User"
                                    >
                                       <FaTrash size={12} />
                                    </button>
                                 </td>
                              </motion.tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan="6" className="p-8 text-center text-[#5A6654] italic">
                                 No users found matching "{searchTerm}"
                              </td>
                           </tr>
                        )}
                     </AnimatePresence>
                  </tbody>
               </table>
            </div>

            {/* --- MOBILE CARDS --- */}
            <div className="md:hidden flex flex-col divide-y divide-[#DEDBD0]">
               <AnimatePresence>
                  {filteredUsers.length > 0 ? (
                     filteredUsers.map((user) => (
                        <motion.div
                           key={user.id}
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           className="p-6 flex flex-col gap-4 bg-[#F3F1E7]"
                        >
                           <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                 <div className="w-12 h-12 rounded-full bg-[#E2E6D5] flex items-center justify-center text-[#5A6654] text-xl overflow-hidden">
                                     {user.image || user.photoURL ? (
                                          <img src={user.image || user.photoURL} alt="" className="w-full h-full object-cover"/>
                                      ) : (
                                          <FaUserCircle />
                                      )}
                                 </div>
                                 <div>
                                    {/* --- USE NORMALIZED NAME --- */}
                                    <h4 className="font-bold text-[#2B3326] text-lg">{user.realName}</h4>
                                    <div className="flex items-center gap-1 text-xs text-[#5A6654]">
                                       <FaEnvelope size={10} /> {user.email}
                                    </div>
                                 </div>
                              </div>
                              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border
                                 ${user.status === 'Active' ? 'bg-[#3D4C38]/5 border-[#3D4C38]/20 text-[#3D4C38]' : 'bg-gray-100 border-gray-200 text-gray-500'}
                              `}>
                                 {user.status || 'Active'}
                              </span>
                           </div>

                           <div className="grid grid-cols-2 gap-4 py-2">
                              <div className="flex items-center gap-2 text-xs text-[#5A6654]">
                                 <FaCalendarAlt /> Joined: {formatDate(user.displayDate)}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-bold uppercase">
                                 Total Trips: {user.realBookingCount}
                              </div>
                           </div>

                           <button
                              onClick={() => handleDelete(user.id)}
                              className="w-full py-3 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                           >
                              <FaTrash size={12} /> Remove User
                           </button>
                        </motion.div>
                     ))
                  ) : (
                     <div className="p-8 text-center text-[#5A6654] italic">
                        No users found.
                     </div>
                  )}
               </AnimatePresence>
            </div>

         </motion.div>

      </motion.div>
   );
};

export default ManageUsers;