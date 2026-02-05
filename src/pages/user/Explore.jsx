import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaTree, FaArrowRight, FaStar, FaUserTie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { placesData } from '../../data/mockData';

const Explore = () => {
  return (
    <div className="min-h-screen bg-[#E2E6D5] text-[#2B3326] font-['Poppins'] selection:bg-[#3D4C38] selection:text-[#F3F1E7]">
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>

      {/* Header */}
      <header className="relative z-10 pt-32 pb-16 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          
          <h1 className="text-5xl md:text-7xl font-['Oswald'] font-bold text-[#1F261C] uppercase tracking-tight">
            The <span className="text-[#3D4C38] italic">Green</span> Book
          </h1>
        </motion.div>
      </header>

      {/* Grid */}
      <div className="container mx-auto px-4 md:px-8 pb-32 relative z-10">
        {/* Added items-stretch to force equal height in rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
          {placesData.map((place, index) => (
            <PlaceCard key={place.id} place={place} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PlaceCard = ({ place, index }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Navigate to BookGuide page with state
  const handleNavigate = () => {
    navigate(`/place/${place.id}`, { state: { place } });
  };

  // Mock Guide Count
  const guideCount = Math.floor(Math.random() * 6) + 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // UPDATED: h-full ensures card takes full height of grid cell
      // UPDATED: Flex-col ensures proper spacing distribution
      className="group relative bg-[#F3F1E7] rounded-[2rem] overflow-hidden border border-[#DEDBD0] shadow-lg shadow-[#2B3326]/5 flex flex-col h-full"
    >
      {/* Image */}
      {/* UPDATED: Changed from percentage to fixed/responsive height to ensure content alignment */}
      <div className="h-64 md:h-72 relative overflow-hidden shrink-0 cursor-pointer" onClick={handleNavigate}>
        <motion.img 
          src={place.image} 
          alt={place.name}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#3D4C38]/10 mix-blend-multiply"></div>
      </div>

      {/* Content */}
      {/* UPDATED: p-6 md:p-8 for responsive padding */}
      <div className="flex-1 p-6 md:p-8 flex flex-col">
        
        {/* Title */}
        <h2 className="text-3xl font-['Oswald'] font-bold text-[#1F261C] uppercase leading-none mb-3 group-hover:text-[#3D4C38] transition-colors cursor-pointer" onClick={handleNavigate}>
          {place.name}
        </h2>

        {/* Metadata Row */}
        <div className="flex items-center gap-3 mb-4 text-[#5A6654]">
           <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-[#E2E6D5] px-2 py-1 rounded-md">
             <FaMapMarkerAlt className="text-[#3D4C38]" /> Wayanad, Kerala
           </div>
           <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-[#E2E6D5] px-2 py-1 rounded-md">
             <FaUserTie className="text-[#3D4C38]" /> {guideCount} Guides
           </div>
        </div>

        {/* Rating */}
        <div className="flex text-[#D4AF37] text-xs gap-0.5 mb-4">
            <FaStar/><FaStar/><FaStar/><FaStar/><FaStar/>
            <span className="ml-2 text-[#5A6654] font-medium text-xs">(4.8)</span>
        </div>

        {/* Description */}
        <p className="text-[#5A6654] text-sm leading-relaxed mb-6 line-clamp-3">
          {place.description}
        </p>

        {/* Footer Button */}
        {/* UPDATED: mt-auto ensures button sticks to bottom, pt-6 adds the requested outer padding/space */}
        <div className="mt-auto pt-6 border-t border-[#DEDBD0]">
          <button 
            onClick={handleNavigate}
            className="w-full py-4 bg-[#3D4C38] text-[#F3F1E7] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#2B3326] transition-all flex justify-center items-center gap-2 group-btn"
          >
            Book Guide <FaArrowRight className="group-btn-hover:translate-x-1 transition-transform"/>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Explore;