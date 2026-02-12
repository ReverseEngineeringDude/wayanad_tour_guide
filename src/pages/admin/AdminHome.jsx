import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer
} from 'recharts';
import { FaUsers, FaMapMarkedAlt, FaCalendarCheck, FaArrowUp, FaArrowDown, FaEllipsisH } from 'react-icons/fa';
import { fetchCollection } from '../../firebase/db';

const COLORS = ['#3D4C38', '#8B9D77', '#D4AF37']; // Olive, Sage, Gold

const AdminHome = () => {
  const [stats, setStats] = useState({
    users: 0,
    guides: 0,
    bookings: 0,
    admins: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [users, guides, bookings] = await Promise.all([
          fetchCollection('users'),
          fetchCollection('guides'),
          fetchCollection('bookings')
        ]);

        const adminCount = users.filter(user => user.role === 'admin').length;
        const touristCount = users.filter(user => user.role !== 'guide' && user.role !== 'admin').length;

        setStats({
          users: touristCount,
          guides: guides.length,
          bookings: bookings.length,
          admins: adminCount
        });

        // Sort bookings by date (assuming date field exists or createdAt) and take recent 5
        const sortedBookings = bookings.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        setRecentBookings(sortedBookings);

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Data for Pie Chart
  const userTypeData = [
    { name: 'Tourists', value: stats.users },
    { name: 'Guides', value: stats.guides },
    { name: 'Admins', value: stats.admins },
  ];

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Helper for Status Badge Color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-[#3D4C38]">Loading Dashboard...</div>;
  }

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
            Dashboard
          </h1>
          <p className="text-[#5A6654] text-sm mt-1">
            Overview of platform performance and activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A6654] bg-[#F3F1E7] px-3 py-1 rounded-lg border border-[#DEDBD0]">
            Last 7 Days
          </span>
          <button className="bg-[#3D4C38] text-[#F3F1E7] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-[#2B3326] transition-colors">
            Export Report
          </button>
        </div>
      </motion.div>


      {/* ==================== 2. STATS GRID (Dynamic Data) ==================== */}
      <motion.div
        variants={itemVars}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatCard
          title="Total Users"
          value={stats.users}
          change="+12%"
          isPositive={true}
          icon={<FaUsers />}
        />
        <StatCard
          title="Total Bookings"
          value={stats.bookings}
          change="+8%"
          isPositive={true}
          icon={<FaCalendarCheck />}
        />
        <StatCard
          title="Active Guides"
          value={stats.guides}
          change="+2"
          isPositive={true}
          icon={<FaMapMarkedAlt />}
        />
      </motion.div>


      {/* ==================== 3. CONTENT SECTION ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* User Distribution Chart */}
        <motion.div
          variants={itemVars}
          className="lg:col-span-1 bg-[#F3F1E7] p-6 rounded-2xl shadow-xl shadow-[#3D4C38]/5 border border-[#DEDBD0]"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-['Oswald'] font-bold text-xl text-[#2B3326] uppercase">User Base</h3>
            <button className="text-[#3D4C38] hover:bg-[#E2E6D5] p-2 rounded-full transition-colors"><FaEllipsisH /></button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#2B3326', border: 'none', borderRadius: '8px', color: '#F3F1E7', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity Table (Uses allBookingsData) */}
        <motion.div
          variants={itemVars}
          className="lg:col-span-2 bg-[#F3F1E7] rounded-2xl shadow-xl shadow-[#3D4C38]/5 border border-[#DEDBD0] overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-[#DEDBD0] flex justify-between items-center">
            <h3 className="font-['Oswald'] font-bold text-xl text-[#2B3326] uppercase">Recent Bookings</h3>
            <button className="text-xs font-bold text-[#3D4C38] uppercase tracking-widest hover:underline">View All</button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-[#E2E6D5]/50">
                <tr>
                  {['Tourist', 'Destination', 'Date', 'Status'].map((head) => (
                    <th key={head} className="px-6 py-4 text-[10px] font-bold text-[#5A6654] uppercase tracking-widest">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEDBD0]">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-[#E2E6D5]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#DEDBD0] flex items-center justify-center text-[10px] font-bold text-[#5A6654]">
                            {booking.touristName ? booking.touristName.charAt(0) : '?'}
                          </div>
                          <span className="font-bold text-[#2B3326] text-sm">{booking.touristName || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#5A6654] font-medium">{booking.placeName || booking.placeId}</td>
                      <td className="px-6 py-4 text-sm text-[#5A6654]">{booking.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-[#5A6654]">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
};

// --- SUB-COMPONENT: Stat Card ---
const StatCard = ({ title, value, change, isPositive, icon }) => (
  <div className="bg-[#F3F1E7] p-6 rounded-2xl shadow-md border border-[#DEDBD0] hover:border-[#3D4C38] transition-colors group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-[#E2E6D5] rounded-xl text-[#3D4C38] text-lg group-hover:bg-[#3D4C38] group-hover:text-[#F3F1E7] transition-colors">
        {icon}
      </div>
      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
        {change}
      </span>
    </div>
    <div>
      <p className="text-[#5A6654] text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl font-['Oswald'] font-bold text-[#2B3326]">{value}</h4>
    </div>
  </div>
);

export default AdminHome;