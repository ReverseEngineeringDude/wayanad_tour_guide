import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaCalendarAlt, FaCheck, FaQuoteLeft, FaStar, FaClock, FaUserFriends, FaPhone, FaCommentDots, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { addDocument, fetchDocument } from '../../firebase/db';

const GuideBooking = () => {
   const { state } = useLocation();
   const { guideId } = useParams();
   const navigate = useNavigate();
   const { currentUser } = useAuth();

   // Retrieve Data
   const [guide, setGuide] = useState(state?.guide);
   const place = state?.place || { name: 'Unknown Place', id: 'unknown' };

   useEffect(() => {
      const loadGuide = async () => {
         if (!guide && guideId) {
            try {
               const guideData = await fetchDocument('guides', guideId);
               setGuide(guideData);
            } catch (error) {
               console.error("Guide not found");
            }
         }
      };
      loadGuide();
      window.scrollTo(0, 0);
   }, [guide, guideId]);


   // Form State
   const [formData, setFormData] = useState({
      date: '',
      time: '',
      guests: '',
      phone1: '',
      phone2: '',
      requests: ''
   });

   const [step, setStep] = useState(1);
   const [isLoading, setIsLoading] = useState(false);

   if (!guide) return <div className="min-h-screen flex items-center justify-center font-bold text-[#3D4C38]">Loading Guide...</div>;

   const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleConfirm = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
         const bookingData = {
            ...formData,
            guideId: guide.id,
            guideName: guide.name,
            placeId: place.id,
            placeName: place.name,
            placeImage: place.image || place.coverImage,
            userId: currentUser.uid,
            touristName: currentUser.displayName || currentUser.email,
            status: 'pending',
            createdAt: new Date().toISOString()
         };

         await addDocument('bookings', bookingData);
         setStep(2);

      } catch (error) {
         console.error("Booking failed:", error);
         alert("Failed to submit booking.");
      } finally {
         setIsLoading(false);
      }
   };

   const isValid = formData.date && formData.time && formData.guests && formData.phone1 && formData.phone2;

   return (
      <div className="min-h-screen bg-[#E2E6D5] font-['Poppins'] flex flex-col lg:flex-row overflow-hidden">

         {/* --- LEFT: GUIDE PROFILE --- */}
         <motion.div
            initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}
            className="w-full lg:w-5/12 h-[40vh] lg:h-screen relative bg-[#1F261C]"
         >
            <img src={guide.image || guide.profileImage || "https://placehold.co/400x600"} alt={guide.name} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F261C] via-transparent to-transparent"></div>

            <div className="absolute top-8 left-8">
               <button onClick={() => navigate(-1)} className="text-[#F3F1E7] hover:text-[#D4AF37] flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors">
                  <FaArrowLeft /> Back
               </button>
            </div>

            <div className="absolute bottom-12 left-12 right-12 text-[#F3F1E7]">
               <h1 className="text-5xl lg:text-6xl font-['Oswald'] font-bold uppercase leading-none mb-2">{guide.name}</h1>
               <div className="flex items-center gap-3 text-[#D4AF37] text-lg mb-6">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar /> <span className="text-white text-xs font-bold tracking-widest">(142 Reviews)</span>
               </div>

               <div className="relative pl-6 border-l-4 border-[#D4AF37]">
                  <FaQuoteLeft className="absolute -top-3 -left-3 text-[#D4AF37] text-xl" />
                  <p className="italic text-gray-300 font-light leading-relaxed">
                     "{guide.bio || "I am passionate about showing travelers the real beauty of Wayanad."}"
                  </p>
               </div>
            </div>
         </motion.div>

         {/* --- RIGHT: BOOKING FORM --- */}
         <motion.div
            initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-7/12 h-auto lg:h-screen bg-[#F3F1E7] flex flex-col justify-center p-6 md:p-12 relative overflow-y-auto"
         >
            <AnimatePresence mode="wait">
               {step === 1 && (
                  <motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto w-full">

                     <div className="mb-8">
                        <span className="text-[#3D4C38] font-bold uppercase tracking-widest text-xs block mb-2">Booking For</span>
                        <h2 className="text-3xl lg:text-4xl font-['Oswald'] font-bold text-[#1F261C] uppercase">{place.name}</h2>
                        <p className="text-[#5A6654] mt-2 text-sm">Fill in the details to request a booking with {guide.name}.</p>
                     </div>

                     <form onSubmit={handleConfirm} className="space-y-5">

                        {/* Form Fields (Same as before) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                           <div className="bg-white p-4 rounded-2xl border border-[#DEDBD0] shadow-sm">
                              <label className="text-[10px] font-bold uppercase text-[#5A6654] block mb-2">Date</label>
                              <div className="flex items-center gap-3 text-[#2B3326]">
                                 <FaCalendarAlt className="text-[#3D4C38]" />
                                 <input required name="date" type="date" value={formData.date} onChange={handleInputChange} className="bg-transparent w-full font-bold outline-none text-sm" />
                              </div>
                           </div>
                           <div className="bg-white p-4 rounded-2xl border border-[#DEDBD0] shadow-sm">
                              <label className="text-[10px] font-bold uppercase text-[#5A6654] block mb-2">Time</label>
                              <div className="flex items-center gap-3 text-[#2B3326]">
                                 <FaClock className="text-[#3D4C38]" />
                                 <input required name="time" type="time" value={formData.time} onChange={handleInputChange} className="bg-transparent w-full font-bold outline-none text-sm" />
                              </div>
                           </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-[#DEDBD0] shadow-sm">
                           <label className="text-[10px] font-bold uppercase text-[#5A6654] block mb-2">Number of Persons</label>
                           <div className="flex items-center gap-3 text-[#2B3326]">
                              <FaUserFriends className="text-[#3D4C38]" />
                              <input required name="guests" type="number" min="1" placeholder="e.g. 4" value={formData.guests} onChange={handleInputChange} className="bg-transparent w-full font-bold outline-none text-sm" />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                           <div className="bg-white p-4 rounded-2xl border border-[#DEDBD0] shadow-sm">
                              <label className="text-[10px] font-bold uppercase text-[#5A6654] block mb-2">Primary Contact</label>
                              <div className="flex items-center gap-3 text-[#2B3326]">
                                 <FaPhone className="text-[#3D4C38]" />
                                 <input required name="phone1" type="tel" placeholder="+91 99999 99999" value={formData.phone1} onChange={handleInputChange} className="bg-transparent w-full font-bold outline-none text-sm" />
                              </div>
                           </div>
                           <div className="bg-white p-4 rounded-2xl border border-[#DEDBD0] shadow-sm">
                              <label className="text-[10px] font-bold uppercase text-[#5A6654] block mb-2">Alternate Contact</label>
                              <div className="flex items-center gap-3 text-[#2B3326]">
                                 <FaPhone className="text-[#3D4C38]" />
                                 <input required name="phone2" type="tel" placeholder="Required" value={formData.phone2} onChange={handleInputChange} className="bg-transparent w-full font-bold outline-none text-sm" />
                              </div>
                           </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-[#DEDBD0] shadow-sm">
                           <label className="text-[10px] font-bold uppercase text-[#5A6654] block mb-2">Special Requests (Optional)</label>
                           <div className="flex items-start gap-3 text-[#2B3326]">
                              <FaCommentDots className="text-[#3D4C38] mt-1" />
                              <textarea name="requests" rows="2" placeholder="e.g. Need wheelchair assistance..." value={formData.requests} onChange={handleInputChange} className="bg-transparent w-full font-bold outline-none text-sm resize-none" />
                           </div>
                        </div>

                        <button type="submit" disabled={!isValid || isLoading} className={`w-full py-5 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${!isValid ? 'bg-[#BFC7B0] text-white cursor-not-allowed' : 'bg-[#3D4C38] text-[#F3F1E7] hover:bg-[#2B3326] hover:-translate-y-1'}`}>
                           {isLoading ? 'Sending Request...' : <><FaPaperPlane /> Send Booking Request</>}
                        </button>
                     </form>
                  </motion.div>
               )}

               {step === 2 && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg mx-auto">
                     <div className="w-28 h-28 bg-[#3D4C38] text-[#F3F1E7] rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-2xl">
                        <FaCheck />
                     </div>
                     <h2 className="text-5xl font-['Oswald'] font-bold text-[#1F261C] uppercase mb-4">Request Sent!</h2>

                     <div className="bg-white p-6 rounded-2xl border border-[#DEDBD0] mb-8">
                        <p className="text-[#5A6654] text-lg leading-relaxed">
                           Your booking request has been sent to <b>{guide.name}</b>.
                        </p>
                        <div className="w-full h-px bg-[#DEDBD0] my-4"></div>
                        <p className="text-[#3D4C38] font-bold">
                           Please wait for approval. You will be notified within <span className="text-[#D4AF37] underline decoration-2 underline-offset-4">24 hours</span>.
                        </p>
                     </div>

                     <div className="flex flex-col gap-3">
                        <button onClick={() => navigate('/explore')} className="w-full py-4 border border-[#3D4C38] text-[#3D4C38] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#E2E6D5]">Explore More</button>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </motion.div>

      </div>
   );
};

export default GuideBooking;