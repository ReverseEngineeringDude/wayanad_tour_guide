import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCompass, FaCalendarCheck, FaUserCircle, FaSignOutAlt, FaTree } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const GuideLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const { logout } = useAuth();

  const menuItems = [
    { path: '/guide', label: 'Dashboard', icon: <FaCompass /> },
    { path: '/guide/requests', label: 'Booking Requests', icon: <FaCalendarCheck /> },
    { path: '/guide/profile', label: 'My Profile', icon: <FaUserCircle /> },
  ];

  const handleLogout = () => {
    logout();
    setShowLogout(false);
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#E2E6D5] text-[#2B3326] font-['Poppins'] overflow-hidden selection:bg-[#3D4C38] selection:text-[#F3F1E7]">
      
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>

      {/* ==================== DESKTOP SIDEBAR ==================== */}
      <aside className="w-72 bg-[#2B3326] text-[#F3F1E7] hidden md:flex flex-col relative z-20 shadow-2xl shadow-[#3D4C38]/20 flex-shrink-0">
        <div className="p-8 border-b border-[#F3F1E7]/10">
          <div className="flex items-center gap-3 mb-1">
             <div className="w-8 h-8 bg-[#8B9D77] text-[#2B3326] rounded-lg flex items-center justify-center shadow-lg">
                <FaTree className="text-sm" />
             </div>
             <h2 className="text-2xl font-['Oswald'] font-bold tracking-widest uppercase">Guide</h2>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#F3F1E7]/50 pl-11">Partner Portal</p>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-4 px-6 py-4 rounded-xl transition-colors duration-300 group z-10 ${isActive ? 'text-[#2B3326]' : 'text-[#F3F1E7] hover:text-[#8B9D77]'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGuide"
                    className="absolute inset-0 bg-[#E2E6D5] rounded-xl shadow-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`text-lg relative z-10 ${isActive ? 'text-[#3D4C38]' : 'text-[#F3F1E7]/60 group-hover:text-[#8B9D77]'}`}>
                  {item.icon}
                </span>
                <span className="font-bold text-sm tracking-wide relative z-10">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[#F3F1E7]/10 mt-auto">
          <button 
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-3 px-6 py-3 text-[#F3F1E7]/60 hover:text-[#FF6B6B] transition-colors rounded-xl hover:bg-[#F3F1E7]/5"
          >
            <FaSignOutAlt />
            <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>


      {/* ==================== MAIN CONTENT AREA ==================== */}
      <main className="flex-1 flex flex-col relative z-10 min-w-0 bg-[#E2E6D5]">
        
        {/* Scrollable Container */}
        {/* REMOVED: The <div className="md:hidden h-20..."> spacer block */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 lg:p-12 pb-32 md:pb-12">
           <Outlet />
        </div>

      </main>


      {/* ==================== MOBILE BOTTOM BAR ==================== */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <nav className="bg-[#2B3326]/95 backdrop-blur-xl text-[#F3F1E7] rounded-2xl shadow-2xl shadow-black/30 border border-[#F3F1E7]/10 flex justify-between items-center px-6 py-3">
           {menuItems.map((item) => { 
             const isActive = location.pathname === item.path;
             return (
               <Link 
                 key={item.path} 
                 to={item.path}
                 className="flex flex-col items-center gap-1 relative p-2"
               >
                 <span className={`text-lg transition-all duration-300 ${isActive ? 'text-[#8B9D77] -translate-y-1' : 'text-[#F3F1E7]/50'}`}>
                    {item.icon}
                 </span>
                 {isActive && (
                   <motion.div 
                     layoutId="mobileActiveGuide"
                     className="absolute -bottom-1 w-1 h-1 bg-[#8B9D77] rounded-full"
                   />
                 )}
               </Link>
             )
           })}
           
           <button 
             onClick={() => setShowLogout(true)}
             className="flex flex-col items-center gap-1 p-2 text-[#F3F1E7]/50 hover:text-[#FF6B6B]"
           >
             <FaSignOutAlt className="text-lg" />
           </button>
        </nav>
      </div>


      {/* ==================== LOGOUT CONFIRMATION MODAL ==================== */}
      <AnimatePresence>
        {showLogout && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#2B3326]/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#F3F1E7] w-full max-w-sm rounded-2xl shadow-2xl border border-[#DEDBD0] overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-inner">
                  <FaSignOutAlt />
                </div>
                <h3 className="text-2xl font-['Oswald'] font-bold text-[#2B3326] uppercase mb-2">
                  Leaving so soon?
                </h3>
                <p className="text-[#5A6654] text-sm leading-relaxed mb-8">
                  You will need to sign in again to access your guide dashboard.
                </p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowLogout(false)}
                    className="flex-1 py-3 bg-[#E2E6D5] text-[#5A6654] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#DEDBD0] transition-colors"
                  >
                    Stay
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex-1 py-3 bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GuideLayout;