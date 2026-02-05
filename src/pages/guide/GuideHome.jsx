import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaCheckCircle, FaUser, FaCalendarDay } from 'react-icons/fa';
import { allBookingsData } from '../../data/mockData';

const GuideHome = () => {
  
  // --- MOCK LOGIC: Get data for "Rahul K." (ID: 101) ---
  const myBookings = allBookingsData.filter(b => b.guideId === 101);
  
  const pendingCount = myBookings.filter(b => b.status === 'pending').length;
  const confirmedCount = myBookings.filter(b => b.status === 'confirmed').length;
  
  // Get recent 3 accepted bookings
  const recentAccepted = myBookings
    .filter(b => b.status === 'confirmed')
    .slice(0, 3);

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="visible"
      className="w-full space-y-8 pb-20"
    >
      
      {/* ==================== 1. HEADER ==================== */}
      <motion.div variants={itemVars} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-['Oswald'] font-bold text-[#2B3326] uppercase tracking-wide">
            Guide Dashboard
          </h1>
          <p className="text-[#5A6654] text-sm mt-1">
            Welcome back, Rahul. You have {pendingCount} new requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-xs font-bold uppercase tracking-widest text-[#5A6654] bg-[#F3F1E7] px-3 py-1 rounded-lg border border-[#DEDBD0]">
             Status: Online
           </span>
        </div>
      </motion.div>


      {/* ==================== 2. STATS GRID ==================== */}
      <motion.div 
        variants={itemVars} 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <StatCard 
          title="Pending Requests" 
          value={pendingCount} 
          subtext="Waiting for your approval"
          icon={<FaClock />} 
          accentColor="bg-[#D4AF37] text-[#2B3326]"
        />
        <StatCard 
          title="Upcoming Trips" 
          value={confirmedCount} 
          subtext="Confirmed bookings"
          icon={<FaMapMarkerAlt />} 
          accentColor="bg-[#3D4C38] text-[#F3F1E7]"
        />
      </motion.div>


      {/* ==================== 3. RECENT ACCEPTED BOOKINGS ==================== */}
      <motion.div variants={itemVars} className="bg-[#F3F1E7] p-6 md:p-8 rounded-2xl shadow-xl shadow-[#3D4C38]/5 border border-[#DEDBD0]">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-['Oswald'] font-bold text-xl text-[#2B3326] uppercase">Recent Accepted Bookings</h3>
            <span className="text-[#3D4C38] bg-[#3D4C38]/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
               Next 7 Days
            </span>
         </div>

         <div className="grid gap-4">
            {recentAccepted.length > 0 ? (
               recentAccepted.map((booking) => (
                  <div key={booking.id} className="bg-white p-5 rounded-xl border border-[#DEDBD0] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#3D4C38] transition-colors">
                     
                     {/* Left: Info */}
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#E2E6D5] flex items-center justify-center text-[#5A6654] font-bold text-lg">
                           {booking.touristName.charAt(0)}
                        </div>
                        <div>
                           <h4 className="font-bold text-[#2B3326] text-lg">{booking.touristName}</h4>
                           <div className="flex items-center gap-2 text-xs text-[#5A6654] mt-1">
                              <span className="flex items-center gap-1"><FaMapMarkerAlt /> {booking.place}</span>
                              <span className="w-1 h-1 bg-[#DEDBD0] rounded-full"></span>
                              <span className="flex items-center gap-1"><FaUser /> {booking.guests || 2} Guests</span>
                           </div>
                        </div>
                     </div>

                     {/* Middle: Date/Time */}
                     <div className="flex items-center gap-4 bg-[#F3F1E7]/50 px-4 py-2 rounded-lg border border-[#DEDBD0]/50">
                        <div className="text-center">
                           <p className="text-[10px] font-bold text-[#5A6654] uppercase tracking-widest">Date</p>
                           <p className="text-sm font-bold text-[#2B3326]">{booking.date}</p>
                        </div>
                        <div className="w-px h-8 bg-[#DEDBD0]"></div>
                        <div className="text-center">
                           <p className="text-[10px] font-bold text-[#5A6654] uppercase tracking-widest">Time</p>
                           <p className="text-sm font-bold text-[#2B3326]">{booking.time || '09:00 AM'}</p>
                        </div>
                     </div>

                     {/* Right: Status */}
                     <div className="flex items-center gap-2 text-[#3D4C38] bg-[#3D4C38]/5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest">
                        <FaCheckCircle /> Confirmed
                     </div>

                  </div>
               ))
            ) : (
               <div className="text-center py-10 text-[#5A6654]">
                  No upcoming trips scheduled.
               </div>
            )}
         </div>
      </motion.div>

    </motion.div>
  );
};

// --- SUB-COMPONENT: Stat Card ---
const StatCard = ({ title, value, subtext, icon, accentColor }) => (
  <div className="bg-[#F3F1E7] p-6 rounded-2xl shadow-md border border-[#DEDBD0] hover:border-[#3D4C38] transition-colors group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl text-lg shadow-sm transition-transform group-hover:scale-110 ${accentColor}`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-[#5A6654] text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-end gap-2">
         <h4 className="text-4xl font-['Oswald'] font-bold text-[#2B3326]">{value}</h4>
         <span className="text-[10px] text-[#5A6654] mb-2 font-medium">{subtext}</span>
      </div>
    </div>
  </div>
);

export default GuideHome;