import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTree, FaBars, FaTimes, FaUser, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get current user & logout function from context
  const { currentUser, logout } = useAuth(); 

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Explore", path: "/explore" },
    ...(currentUser ? [{ title: "My Bookings", path: "/my-bookings" }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileOpen(false);
  };

  const displayName = currentUser?.displayName || "Traveler";

  // Common button style class for both Login and Register
  const authButtonStyle = "flex items-center gap-2 px-6 py-2.5 bg-[#3D4C38] border border-[#3D4C38] rounded-full font-['Oswald'] font-bold text-xs uppercase tracking-widest text-[#F3F1E7] hover:bg-[#2B3326] transition-all shadow-md hover:shadow-lg";

  return (
    <>
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full z-50 pt-6 pb-4"
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-[#3D4C38] text-[#F3F1E7] p-2.5 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300">
              <FaTree className="text-sm" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Oswald'] font-bold uppercase tracking-[0.2em] text-[#2B3326] text-lg leading-none group-hover:text-[#3D4C38] transition-colors">
                Wayanad
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] hidden sm:block">
                Official Guide
              </span>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <Link 
                key={index} 
                to={link.path}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-300
                  ${location.pathname === link.path ? 'text-[#2B3326]' : 'text-[#5A6654] hover:text-[#2B3326]'}
                `}
              >
                <span className="relative z-10">{link.title}</span>
                {hoveredIndex === index && (
                  <motion.span 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-[#3D4C38]"
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  />
                )}
                {location.pathname === link.path && hoveredIndex !== index && (
                   <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#3D4C38] rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  
                  {/* CHANGED: User Name in Styled Div with Background */}
                  <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-[#F3F1E7] border border-[#3D4C38]/20 rounded-full shadow-sm">
                      <div className="bg-[#3D4C38] text-[#F3F1E7] p-1 rounded-full">
                         <FaUser size={10} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[8px] text-[#5A6654] font-bold uppercase tracking-widest leading-none">Welcome</span>
                         <span className="text-[10px] font-bold text-[#3D4C38] uppercase tracking-wider leading-none">{displayName}</span>
                      </div>
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 border border-[#3D4C38] rounded-full font-['Oswald'] font-bold text-xs uppercase tracking-widest  bg-[#3D4C38] text-[#F3F1E7] transition-all"
                  >
                    <FaSignOutAlt /> <span className="hidden xl:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* CHANGED: Login Button now uses the exact same style as Register */}
                  <Link to="/login" className={authButtonStyle}>
                     <FaUser className="text-[10px]" /> Login
                  </Link>
                  
                  <Link to="/register" className={authButtonStyle}>
                    <FaUserPlus className="text-[10px]" /> Sign Up
                  </Link>
                </>
              )}
            </div>

            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="md:hidden p-2 text-[#3D4C38] hover:bg-[#3D4C38]/10 rounded-lg transition-colors">
              {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-20 left-0 w-full z-40 md:hidden bg-[#E2E6D5] border-b border-[#DEDBD0] overflow-hidden shadow-xl"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <Link key={index} to={link.path} onClick={() => setIsMobileOpen(false)} className="text-xl font-['Oswald'] font-bold uppercase tracking-widest text-[#5A6654] hover:text-[#2B3326]">
                  {link.title}
                </Link>
              ))}
              <div className="h-[1px] w-full bg-[#DEDBD0] my-2"></div>
              {currentUser ? (
                <>
                   {/* Mobile View User Display */}
                   <div className="flex items-center gap-3 px-4 py-3 bg-[#F3F1E7] rounded-xl w-fit">
                      <div className="bg-[#3D4C38] text-[#F3F1E7] p-2 rounded-full">
                         <FaUser size={12} />
                      </div>
                      <span className="text-[#3D4C38] font-bold uppercase tracking-widest text-sm">{displayName}</span>
                   </div>
                   <button onClick={handleLogout} className="text-left text-[#5A6654] font-bold uppercase tracking-widest text-sm hover:text-red-600 transition-colors flex items-center gap-2 mt-2">
                     <FaSignOutAlt /> Logout
                   </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3 text-[#3D4C38] font-bold uppercase tracking-widest text-sm"><FaUser /> Login</Link>
                  <Link to="/register" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3 text-[#3D4C38] font-bold uppercase tracking-widest text-sm"><FaUserPlus /> Create Account</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;