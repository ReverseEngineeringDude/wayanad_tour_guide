import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaTree, FaMapMarkerAlt } from 'react-icons/fa';

const Home = () => {
  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  // YOUR ORIGINAL IMAGE URLS (Preserved)
  const imagesCol1 = [
    { src: "https://images.unsplash.com/photo-1596323493543-c0032549a0d8?q=80&w=600", title: "Chembra Peak" },
    { src: "https://images.unsplash.com/photo-1625413156093-6c8273752e51?q=80&w=600", title: "Soochipara Falls" },
    { src: "https://images.unsplash.com/photo-1544646736-22c943034293?q=80&w=600", title: "Edakkal Caves" },
    // Duplicates for seamless loop
    { src: "https://images.unsplash.com/photo-1596323493543-c0032549a0d8?q=80&w=600", title: "Chembra Peak" }, 
    { src: "https://images.unsplash.com/photo-1625413156093-6c8273752e51?q=80&w=600", title: "Soochipara Falls" },
  ];

  const imagesCol2 = [
    { src: "https://images.unsplash.com/photo-1589983935240-3b0357ce268f?q=80&w=600", title: "Banasura Dam" },
    { src: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600", title: "Thirunelli Temple" },
    { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600", title: "900 Kandi" },
    // Duplicates for seamless loop
    { src: "https://images.unsplash.com/photo-1589983935240-3b0357ce268f?q=80&w=600", title: "Banasura Dam" },
    { src: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600", title: "Thirunelli Temple" },
  ];

  return (
    // Outer Container: Sage & Earth Palette
    <div className="relative min-h-screen w-full bg-[#E2E6D5] text-[#2B3326] font-['Poppins'] overflow-hidden selection:bg-[#3D4C38] selection:text-[#F3F1E7]">
      
      {/* --- BACKGROUND TEXTURE --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
      
      {/* ==================== MAIN CONTENT ==================== */}
      <div className="container mx-auto px-6 h-screen flex flex-col lg:flex-row items-center justify-center relative z-10 pt-24 lg:pt-0">
        
        {/* --- LEFT SIDE: TEXT & CTA (Responsive Sizing) --- */}
        <motion.div 
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-1/2 flex flex-col justify-center items-start z-20 pb-4 lg:pb-0 h-[40%] lg:h-auto"
        >
      

           {/* Main Headline */}
           <motion.h1 variants={itemVars} className="font-['Oswald'] text-5xl sm:text-6xl lg:text-8xl font-bold uppercase leading-[0.9] text-[#1F261C] mb-4 lg:mb-6">
             The Roots <br/>
             <span className="text-[#4A5D45] opacity-80">of Nature</span>
           </motion.h1>

           <motion.p variants={itemVars} className="text-[#5A6654] text-sm lg:text-lg leading-relaxed max-w-md mb-6 lg:mb-10 border-l-4 border-[#3D4C38] pl-4 lg:pl-6">
             Discover the untold stories of Wayanad. From mist-covered peaks to hidden waterfalls, connect with the soul of the land.
           </motion.p>

           {/* Stats & CTA */}
           <motion.div variants={itemVars} className="flex items-center gap-6 lg:gap-8 w-full sm:w-auto">
              <Link to="/explore">
                <button className="px-8 py-3 lg:px-10 lg:py-4 bg-[#3D4C38] text-[#F3F1E7] font-['Oswald'] font-bold uppercase tracking-wider rounded-full flex items-center justify-center gap-3 hover:bg-[#2B3326] transition-all shadow-xl shadow-[#3D4C38]/20 group text-xs lg:text-sm">
                  Start Journey <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <div className="flex items-center gap-3">
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-[#E2E6D5] bg-[#E2E6D5] overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                 </div>
                 <div className="text-[10px] lg:text-xs font-bold uppercase tracking-wide text-[#3D4C38]">
                    <span className="block text-sm lg:text-lg font-['Oswald']">12k+</span> Explorers
                 </div>
              </div>
           </motion.div>
        </motion.div>


        {/* --- RIGHT SIDE: SMOOTH VERTICAL SCROLL (Desktop & Mobile) --- */}
        {/* On mobile, this takes the bottom ~50% of the screen. On desktop, it takes the right 50% */}
        <div className="w-full lg:w-1/2 h-[60%] lg:h-full relative flex items-center justify-center perspective-1000 overflow-hidden mt-6 lg:mt-0">
           
           {/* Floating Grid Container - Scaled for Mobile/Desktop */}
           <div className="relative w-[140%] lg:w-[120%] h-full grid grid-cols-2 gap-4 lg:gap-6 rotate-6 lg:-translate-y-12 opacity-90 mask-image-gradient">
              
              {/* Column 1 (Moves Up) */}
              <div className="flex flex-col gap-4 lg:gap-6 animate-scroll-up hover:pause">
                 {imagesCol1.map((img, idx) => (
                   <ImageCard key={idx} src={img.src} title={img.title} />
                 ))}
              </div>

              {/* Column 2 (Moves Down) */}
              <div className="flex flex-col gap-4 lg:gap-6 animate-scroll-down hover:pause">
                 {imagesCol2.map((img, idx) => (
                   <ImageCard key={idx} src={img.src} title={img.title} />
                 ))}
              </div>

           </div>

           {/* Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-[#E2E6D5]/10 to-[#E2E6D5] z-10 pointer-events-none"></div>
        </div>

      </div>
      
      {/* --- CUSTOM ANIMATION STYLES --- */}
      <style>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-scroll-up { animation: scrollUp 40s linear infinite; }
        .animate-scroll-down { animation: scrollDown 40s linear infinite; }
        .hover\\:pause:hover { animation-play-state: paused; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>

    </div>
  );
};

// --- SUB-COMPONENT: Image Card (Responsive Height) ---
const ImageCard = ({ src, title }) => (
  <div className="relative group rounded-3xl overflow-hidden shadow-xl shadow-[#3D4C38]/10 h-48 lg:h-[350px] w-full bg-[#F3F1E7] border border-[#DEDBD0]">
     <img src={src} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
     <div className="absolute inset-0 bg-[#2B3326]/20 group-hover:bg-[#2B3326]/10 transition-colors"></div>
     <div className="absolute bottom-3 left-3 lg:bottom-4 lg:left-4 bg-[#F3F1E7]/90 backdrop-blur-sm px-2 py-1 lg:px-3 lg:py-1.5 rounded-full flex items-center gap-2 shadow-sm">
        <FaMapMarkerAlt className="text-[#3D4C38] text-[10px] lg:text-xs" />
        <span className="text-[10px] lg:text-xs font-bold uppercase text-[#2B3326] tracking-widest">{title}</span>
     </div>
  </div>
);

export default Home;