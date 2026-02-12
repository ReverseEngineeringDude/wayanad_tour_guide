import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaArrowDown } from 'react-icons/fa';
import { fetchCollection } from '../../firebase/db';

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

  const [featuredPlaces, setFeaturedPlaces] = useState([]);

  useEffect(() => {
    // Fetch Featured Places (Display first 3 for now)
    const loadFeatured = async () => {
      try {
        const places = await fetchCollection('places');
        setFeaturedPlaces(places.slice(0, 3));
      } catch (e) {
        console.error(e);
      }
    }
    loadFeatured();
  }, []);

  const heroImage1 = 'https://images.unsplash.com/photo-1596328842278-654db52851ee?q=80&w=2600&auto=format&fit=crop';

  // Interactive Hero Hover (Zoom effect)
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-[#E2E6D5] text-[#2B3326] font-['Poppins'] selection:bg-[#3D4C38] selection:text-[#F3F1E7]">
      {/* Dynamic Background Noise Texture */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Parallax Layer */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage1})`, filter: 'brightness(0.7)' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F261C] via-[#1F261C]/40 to-transparent opacity-90 z-0"></div>

        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-6 relative z-10 text-center"
        >
          <motion.div variants={itemVars} className="mb-4 inline-block">
            <span className="px-4 py-1 border border-[#D4AF37] rounded-full text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] bg-black/20 backdrop-blur-sm">
              Expedition Wayanad
            </span>
          </motion.div>

          <motion.h1
            variants={itemVars}
            className="text-6xl md:text-8xl lg:text-9xl font-['Oswald'] font-bold text-[#F3F1E7] uppercase leading-none mb-6 drop-shadow-2xl"
          >
            Beyond <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B9D77] to-[#D4AF37]">The Mist</span>
          </motion.h1>

          <motion.p
            variants={itemVars}
            className="text-lg md:text-xl text-[#E2E6D5] max-w-2xl mx-auto mb-10 font-light tracking-wide leading-relaxed opacity-90"
          >
            Discover the untamed soul of Kerala. Curated journeys through ancient forests, mist-clad peaks, and hidden waterfalls.
          </motion.p>

          <motion.div variants={itemVars} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/explore" className="group relative px-8 py-4 bg-[#F3F1E7] text-[#1F261C] font-bold text-xs uppercase tracking-widest overflow-hidden rounded-none hover:text-[#F3F1E7] transition-colors duration-300">
              <span className="relative z-10 flex items-center gap-2">Start Exploring <FaArrowRight /></span>
              <div className="absolute inset-0 bg-[#3D4C38] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#F3F1E7] flex flex-col items-center gap-2 opacity-60"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <FaArrowDown />
        </motion.div>
      </section>

      {/* --- FEATURED SECTION --- */}
      <section className="py-32 px-6 md:px-12 bg-[#E2E6D5]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-[#3D4C38] font-bold uppercase tracking-widest text-xs mb-2 block">Curated Destinations</span>
              <h2 className="text-4xl md:text-6xl font-['Oswald'] font-bold text-[#1F261C] uppercase leading-tight">
                Wayanad's <span className="italic text-[#8B9D77]">Finest</span>
              </h2>
            </div>
            <Link to="/explore" className="flex items-center gap-2 text-[#3D4C38] font-bold text-xs uppercase tracking-widest hover:translate-x-2 transition-transform pb-2 border-b border-[#3D4C38]">
              View All Places <FaArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPlaces.map((place, index) => (
              <motion.div
                key={place.id || index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="group cursor-pointer"
              >
                <div className="h-[400px] overflow-hidden mb-6 relative">
                  <img
                    src={place.image || place.coverImage || "https://placehold.co/600x800"}
                    alt={place.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-[#F3F1E7] text-[#1F261C] px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-10 w-fit">
                    Featured
                  </div>
                </div>
                <h3 className="text-2xl font-['Oswald'] font-bold text-[#1F261C] uppercase mb-2 group-hover:text-[#3D4C38] transition-colors">{place.name}</h3>
                <p className="text-[#5A6654] text-sm line-clamp-2">{place.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;