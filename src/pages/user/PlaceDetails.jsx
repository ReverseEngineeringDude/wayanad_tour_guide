import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowLeft, FaMapMarkerAlt, FaHistory, FaImages, FaUserTie, FaStar,
  FaArrowRight, FaClock, FaTicketAlt, FaCalendarAlt, FaLock, FaTimes
} from 'react-icons/fa';
import { fetchCollection, fetchQuery, where } from '../../firebase/db';
import { useAuth } from '../../context/AuthContext';

const PlaceDetails = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [guides, setGuides] = useState([]);

  // Use passed state or fetch place
  const place = state?.place;

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch Guides specific to this place
    const loadGuides = async () => {
      if (!place?.id) return;
      try {
        // Fetch guides where placeId matches
        const data = await fetchQuery('guides', where('placeId', '==', place.id));
        setGuides(data);
      } catch (error) {
        console.error("Error fetching guides:", error);
      }
    };
    loadGuides();

  }, [place?.id]); // Re-run if place.id changes

  if (!place) return <div className="min-h-screen flex items-center justify-center text-[#3D4C38] font-bold">Place not found</div>;

  const handleBookClick = (guide) => {
    if (currentUser) {
      navigate(`/book-guide/${guide.id}`, { state: { place, guide } });
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#E2E6D5] text-[#2B3326] font-['Poppins'] pb-20 selection:bg-[#3D4C38] selection:text-[#F3F1E7]">

      {/* --- HERO SECTION --- */}
      <div className="relative h-[60vh] md:h-[65vh] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }}
          src={place.image || place.coverImage || "https://placehold.co/1200x800"} alt={place.name} className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F261C] via-[#1F261C]/50 to-transparent opacity-90"></div>

        <div className="absolute top-0 left-0 w-full p-6 z-20">
          <button
            onClick={() => navigate('/explore')}
            className="bg-[#F3F1E7]/20 backdrop-blur-md text-[#F3F1E7] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#F3F1E7] hover:text-[#3D4C38] transition-all flex items-center gap-2 border border-white/10"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 text-[#F3F1E7] z-10">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-['Oswald'] font-bold uppercase leading-none mb-4 drop-shadow-lg">
              {place.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 md:gap-8 text-xs md:text-sm font-bold uppercase tracking-widest mb-14 sm:mb-0">
              <span className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg backdrop-blur-md border border-white/10 shadow-sm">
                <FaMapMarkerAlt className="text-[#D4AF37]" /> Wayanad, Kerala
              </span>
              <span className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg backdrop-blur-md border border-white/10 shadow-sm">
                <FaUserTie className="text-[#D4AF37]" /> {guides.length} Guides
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 -mt-10 relative z-20">

        {/* --- INFO GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

          {/* LEFT COL: History & Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#F3F1E7] p-6 md:p-10 rounded-[2rem] shadow-xl text-[#5A6654] border border-[#DEDBD0]">
              <div className="flex items-center gap-2 mb-6 text-[#3D4C38] border-b border-[#DEDBD0] pb-4">
                <FaHistory className="text-lg" />
                <span className="text-xs font-bold uppercase tracking-widest">About the Place</span>
              </div>
              <p className="text-lg md:text-xl leading-relaxed mb-6 font-medium text-[#2B3326]">
                {place.description}
              </p>
              <p className="leading-relaxed text-sm md:text-base opacity-90 text-justify">
                {place.history || "Historical details are currently being updated for this location."}
              </p>
            </div>

            {/* Photo Gallery */}
            {place.gallery && place.gallery.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6 text-[#3D4C38] px-2">
                  <FaImages /> <span className="text-xs font-bold uppercase tracking-widest">Photo Gallery</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {place.gallery.map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className={`rounded-2xl overflow-hidden shadow-md cursor-pointer ${idx === 0 ? 'col-span-2 row-span-2 h-64 md:h-80' : 'h-32 md:h-40'}`}
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COL: Visitor Info & Map */}
          <div className="space-y-6">

            {/* Visitor Info Card */}
            <div className="bg-[#3D4C38] text-[#F3F1E7] p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <FaTicketAlt size={100} />
              </div>
              <h3 className="text-2xl font-['Oswald'] font-bold uppercase mb-6 relative z-10">Visitor Info</h3>

              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#F3F1E7]/10 rounded-xl">
                    <FaClock className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Opening Hours</p>
                    <p className="font-semibold text-lg">{place.openTime} - {place.closeTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#F3F1E7]/10 rounded-xl">
                    <FaTicketAlt className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Entry Fee</p>
                    <p className="font-semibold text-lg">{place.ticketPrice}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#F3F1E7]/10 rounded-xl">
                    <FaCalendarAlt className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Best Time</p>
                    <p className="font-semibold text-lg">Sep - Mar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-[#F3F1E7] p-4 rounded-[2.5rem] shadow-lg border border-[#DEDBD0] overflow-hidden h-[300px] relative group">
              <iframe
                title="map"
                src={place.locationUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31307.54564299863!2d76.220678!3d11.624775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba60ea1887019d5%3A0xc3f8e58f04c62c4!2sEdakkal%20Caves!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
                className="w-full h-full rounded-[2rem] grayscale group-hover:grayscale-0 transition-all duration-500"
                loading="lazy"
              ></iframe>
              <div className="absolute bottom-6 left-6 pointer-events-none bg-[#3D4C38] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#F3F1E7] shadow-lg">
                View on Map
              </div>
            </div>

          </div>
        </div>

        {/* --- AVAILABLE GUIDES SECTION --- */}
        <div id="guides" className="border-t border-[#3D4C38]/10 pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 px-2 gap-4">
            <div>
              <span className="text-[#3D4C38] text-xs font-bold uppercase tracking-widest block mb-2">Expert Locals</span>
              <h2 className="text-4xl md:text-5xl font-['Oswald'] font-bold text-[#1F261C] uppercase">Available Guides</h2>
            </div>
            <p className="text-[#5A6654] text-sm md:w-1/3 text-right">
              Book a local expert to uncover hidden stories and secret spots.
            </p>
          </div>

          {guides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide, idx) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#F3F1E7] p-6 rounded-[2rem] border border-[#DEDBD0] hover:border-[#3D4C38] hover:shadow-2xl transition-all group cursor-pointer flex flex-col"
                  onClick={() => handleBookClick(guide)}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <img src={guide.profileImage || guide.image || "https://placehold.co/150"} alt={guide.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]" />
                    <div>
                      <h3 className="text-xl font-bold font-['Oswald'] uppercase text-[#1F261C]">{guide.name}</h3>
                      <div className="flex text-[#D4AF37] text-xs gap-1">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 text-sm text-[#5A6654] font-medium flex-1">
                    <div className="flex justify-between border-b border-[#DEDBD0] pb-2">
                      <span>Experience</span> <span className="text-[#2B3326] font-bold">{guide.experience}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#DEDBD0] pb-2">
                      <span>Language</span> <span className="text-[#2B3326] font-bold">{guide.languages ? guide.languages[0] : 'English'}</span>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-[#3D4C38] text-[#F3F1E7] rounded-xl text-xs font-bold uppercase tracking-widest group-hover:bg-[#2B3326] transition-colors flex items-center justify-center gap-2">
                    Show Details <FaArrowRight />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-[#5A6654]">No guides available at the moment.</div>
          )}
        </div>

      </div>

      {/* --- LOGIN REQUIRED MODAL --- */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B3326]/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#F3F1E7] w-full max-w-sm rounded-2xl shadow-2xl border border-[#DEDBD0] overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-[#3D4C38] text-[#D4AF37] rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-inner">
                  <FaLock />
                </div>
                <h3 className="text-2xl font-['Oswald'] font-bold text-[#2B3326] uppercase mb-2">
                  Login Required
                </h3>
                <p className="text-[#5A6654] text-sm leading-relaxed mb-8">
                  You need to be logged in to view guide details and book a trip.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 bg-[#3D4C38] text-[#F3F1E7] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#2B3326] transition-colors shadow-lg"
                  >
                    Login / Sign Up
                  </button>
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="w-full py-3 bg-transparent text-[#5A6654] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#DEDBD0]/50 transition-colors"
                  >
                    Cancel
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

export default PlaceDetails;