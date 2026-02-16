import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
   FaUserTie, FaTrash, FaSearch, FaEllipsisV, FaFilter, FaEnvelope, 
   FaCalendarAlt, FaPlus, FaTimes, FaMapMarkerAlt, FaLanguage, FaBriefcase, FaIdBadge
} from 'react-icons/fa';
import {
   fetchCollection, addDocument, deleteDocument, convertToBase64
} from '../../firebase/db';

// --- HELPER: GENERATE CHART DATA ---
const generateGuideGrowthData = (guides) => {
   const monthCounts = {};
   guides.forEach(guide => {
      const month = new Date(guide.joined).toLocaleString('default', { month: 'short' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
   });

   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
   let cumulative = 0;

   return months.map(m => {
      cumulative += (monthCounts[m] || 0);
      return { name: m, guides: cumulative };
   });
};

const ManageGuides = () => {
   const [guides, setGuides] = useState([]);
   const [places, setPlaces] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [loading, setLoading] = useState(true);

   // --- MODAL STATE ---
   const [selectedGuide, setSelectedGuide] = useState(null); 
   const [showAddForm, setShowAddForm] = useState(false);
   
   // Form State
   const [newGuide, setNewGuide] = useState({ name: '', email: '', experience: '', rate: '', languages: '', bio: '', placeId: '', placeName: '' });
   const [guideImage, setGuideImage] = useState(null);

   // --- FETCH DATA ---
   useEffect(() => {
      const loadData = async () => {
         try {
            const [guidesData, placesData] = await Promise.all([
               fetchCollection('guides'),
               fetchCollection('places')
            ]);
            setGuides(guidesData);
            setPlaces(placesData);
         } catch (error) {
            console.error("Error fetching data:", error);
         } finally {
            setLoading(false);
         }
      };
      loadData();
   }, []);

   const guideActivityData = generateGuideGrowthData(guides);

   // --- ACTIONS ---
   const handleDeleteGuide = async (id, e) => {
      if(e) e.stopPropagation(); 
      if (window.confirm("Are you sure you want to remove this guide?")) {
         try {
            await deleteDocument('guides', id);
            setGuides(guides.filter(guide => guide.id !== id));
            if (selectedGuide?.id === id) setSelectedGuide(null);
         } catch (error) {
            console.error("Error deleting guide:", error);
            alert("Failed to delete guide");
         }
      }
   };

   const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (file) {
         if (file.size > 400 * 1024) {
            alert("File is too large! Please choose an image under 400KB.");
            return;
         }
         try {
            const base64 = await convertToBase64(file);
            setGuideImage(base64);
         } catch (error) {
            console.error("Error converting image:", error);
         }
      }
   };

   const handleAddGuide = async (e) => {
      e.preventDefault();
      try {
         if (!newGuide.name || !newGuide.email) {
            alert("Name and Email are required");
            return;
         }

         const guideData = {
            ...newGuide,
            languages: newGuide.languages.split(',').map(l => l.trim()),
            joined: new Date().toISOString().split('T')[0],
            status: 'Active',
            image: guideImage || "https://via.placeholder.com/150"
         };

         const docId = await addDocument('guides', guideData);
         setGuides([...guides, { id: docId, ...guideData }]);

         setNewGuide({ name: '', email: '', experience: '', rate: '', languages: '', bio: '', placeId: '', placeName: '' });
         setGuideImage(null);
         setShowAddForm(false);
      } catch (error) {
         console.error("Error adding guide:", error);
         alert(`Failed to add guide: ${error.message}`);
      }
   };

   const filteredGuides = guides.filter(guide =>
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.email.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const containerVars = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
   };

   const itemVars = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 }
   };

   if (loading) return <div className="text-center p-10 text-[#5A6654]">Loading Guides...</div>;

   return (
      <motion.div
         variants={containerVars}
         initial="hidden"
         animate="visible"
         className="w-full space-y-8 pb-20 relative"
      >

         {/* ==================== 1. REDESIGNED GUIDE DETAILS POPUP ==================== */}
         <AnimatePresence>
            {selectedGuide && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                  onClick={() => setSelectedGuide(null)}
               >
                  <motion.div
                     initial={{ scale: 0.95, opacity: 0, y: 20 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     exit={{ scale: 0.95, opacity: 0, y: 20 }}
                     className="bg-[#F3F1E7] w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl border border-[#DEDBD0] relative custom-scrollbar flex flex-col"
                     onClick={(e) => e.stopPropagation()}
                  >
                     
                     {/* --- A. Banner Header --- */}
                     <div className="relative h-36  shrink-0">
                        {/* Decorative Noise */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
                        
                        <button 
                           onClick={() => setSelectedGuide(null)}
                           className="absolute top-4 right-4 p-2 bg-white/20 text-white hover:bg-white/40 rounded-full transition-colors backdrop-blur-md z-10"
                        >
                           <FaTimes />
                        </button>
                     </div>

                     {/* --- B. Main Content --- */}
                     <div className="px-8 pb-8 -mt-16 flex-1">
                        
                        {/* 1. Identity Section (Image & Name) */}
                        <div className="flex flex-col md:flex-row gap-6 items-end md:items-end mb-6">
                           <div className="w-32 h-32 rounded-full border-[6px] border-[#F3F1E7] shadow-xl overflow-hidden bg-white shrink-0">
                              <img 
                                 src={selectedGuide.image || "https://via.placeholder.com/150"} 
                                 alt={selectedGuide.name} 
                                 className="w-full h-full object-cover"
                              />
                           </div>
                           <div className="flex-1 pb-2 text-center md:text-left">
                              <h2 className="text-3xl md:text-4xl font-['Oswald'] font-bold text-[#2B3326] uppercase leading-none mb-1">
                                 {selectedGuide.name}
                              </h2>
                              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-[#5A6654] font-medium">
                                 <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#DEDBD0] rounded-full">
                                    <FaEnvelope size={12} className="text-[#3D4C38]"/> {selectedGuide.email}
                                 </span>
                                 <span className="flex items-center gap-1.5 px-3 py-1 bg-[#3D4C38] text-[#F3F1E7] rounded-full text-xs uppercase tracking-wide">
                                    {selectedGuide.status || "Active"}
                                 </span>
                              </div>
                           </div>
                        </div>

                        {/* 2. Key Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                           {/* Location Card */}
                           <div className="bg-white p-4 rounded-xl border border-[#DEDBD0] shadow-sm flex flex-col items-center text-center">
                              <div className="p-2 bg-[#E2E6D5] text-[#3D4C38] rounded-full mb-2">
                                 <FaMapMarkerAlt size={16} />
                              </div>
                              <p className="text-[10px] font-bold text-[#5A6654] uppercase tracking-widest">Registered Location</p>
                              <p className="text-[#2B3326] font-bold text-sm mt-1">
                                 {selectedGuide.placeName || selectedGuide.location || "Not Assigned"}
                              </p>
                           </div>

                           {/* Experience Card */}
                           <div className="bg-white p-4 rounded-xl border border-[#DEDBD0] shadow-sm flex flex-col items-center text-center">
                              <div className="p-2 bg-[#E2E6D5] text-[#3D4C38] rounded-full mb-2">
                                 <FaBriefcase size={16} />
                              </div>
                              <p className="text-[10px] font-bold text-[#5A6654] uppercase tracking-widest">Experience</p>
                              <p className="text-[#2B3326] font-bold text-sm mt-1">
                                 {selectedGuide.experience || "0 Years"}
                              </p>
                           </div>

                           {/* Joined Date Card */}
                           <div className="bg-white p-4 rounded-xl border border-[#DEDBD0] shadow-sm flex flex-col items-center text-center">
                              <div className="p-2 bg-[#E2E6D5] text-[#3D4C38] rounded-full mb-2">
                                 <FaCalendarAlt size={16} />
                              </div>
                              <p className="text-[10px] font-bold text-[#5A6654] uppercase tracking-widest">Joined On</p>
                              <p className="text-[#2B3326] font-bold text-sm mt-1">
                                 {selectedGuide.joined}
                              </p>
                           </div>
                        </div>

                        {/* 3. Bio & Languages */}
                        <div className="space-y-6">
                           <div>
                              <h3 className="text-xs font-bold text-[#3D4C38] uppercase tracking-widest mb-3 flex items-center gap-2">
                                 <FaLanguage size={14}/> Languages Spoken
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                 {Array.isArray(selectedGuide.languages) && selectedGuide.languages.length > 0 ? (
                                    selectedGuide.languages.map((lang, idx) => (
                                       <span key={idx} className="px-4 py-1.5 bg-[#2B3326] text-[#F3F1E7] text-xs font-bold rounded-lg uppercase tracking-wide shadow-sm">
                                          {lang}
                                       </span>
                                    ))
                                 ) : (
                                    <span className="text-sm text-[#5A6654] italic">No languages listed.</span>
                                 )}
                              </div>
                           </div>

                           <div>
                              <h3 className="text-xs font-bold text-[#3D4C38] uppercase tracking-widest mb-3 flex items-center gap-2">
                                 <FaIdBadge size={14}/> About Guide
                              </h3>
                              <div className="bg-white p-5 rounded-2xl border border-[#DEDBD0] text-sm text-[#5A6654] leading-relaxed shadow-sm">
                                 {selectedGuide.bio ? selectedGuide.bio : <span className="italic opacity-70">No biography provided for this guide.</span>}
                              </div>
                           </div>
                        </div>

                        {/* 4. Footer Actions */}
                        <div className="mt-8 pt-6 border-t border-[#DEDBD0] flex justify-between items-center">
                           <p className="text-[10px] text-[#5A6654] uppercase tracking-widest">
                              ID: {selectedGuide.id}
                           </p>
                           <button 
                              onClick={(e) => handleDeleteGuide(selectedGuide.id, e)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors shadow-sm"
                           >
                              <FaTrash size={12} /> Remove Guide
                           </button>
                        </div>

                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>


         {/* ==================== 2. MAIN CONTENT ==================== */}
         
         {/* Header & Chart */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div variants={itemVars} className="lg:col-span-1 flex flex-col justify-center">
               <h1 className="text-4xl font-['Oswald'] font-bold text-[#2B3326] uppercase tracking-wide mb-2">Manage Guides</h1>
               <p className="text-[#5A6654] text-sm leading-relaxed mb-6">View registered guides and manage platform access.</p>
               <div className="flex items-center gap-4 p-4 bg-[#F3F1E7] rounded-xl border border-[#DEDBD0] shadow-sm">
                  <div className="p-3 bg-[#3D4C38] text-[#F3F1E7] rounded-lg"><FaUserTie size={20} /></div>
                  <div>
                     <p className="text-xs font-bold text-[#5A6654] uppercase tracking-widest">Total Guides</p>
                     <p className="text-2xl font-bold text-[#2B3326]">{guides.length}</p>
                  </div>
               </div>
            </motion.div>

            <motion.div variants={itemVars} className="lg:col-span-2 bg-[#F3F1E7] p-6 rounded-2xl shadow-xl shadow-[#3D4C38]/5 border border-[#DEDBD0]">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-['Oswald'] font-bold text-lg text-[#2B3326] uppercase">Guide Growth</h3>
                  <button className="text-[#3D4C38] hover:bg-[#E2E6D5] p-2 rounded-full transition-colors"><FaEllipsisV /></button>
               </div>
               <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={guideActivityData}>
                        <defs>
                           <linearGradient id="colorGuides" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3D4C38" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3D4C38" stopOpacity={0} />
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DEDBD0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#5A6654', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5A6654', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#2B3326', border: 'none', borderRadius: '8px', color: '#F3F1E7' }} />
                        <Area type="monotone" dataKey="guides" stroke="#3D4C38" strokeWidth={3} fillOpacity={1} fill="url(#colorGuides)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </motion.div>
         </div>

         {/* Toolbar */}
         <motion.div variants={itemVars} className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#F3F1E7] p-4 rounded-xl border border-[#DEDBD0] shadow-sm">
            <div className="relative w-full sm:w-96">
               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6654]" />
               <input
                  type="text"
                  placeholder="Search guides..."
                  className="w-full pl-12 pr-4 py-3 bg-[#E2E6D5] border-none rounded-lg text-sm text-[#2B3326] placeholder-[#5A6654]/60 focus:ring-2 focus:ring-[#3D4C38] outline-none transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
           
         </motion.div>

      

         {/* ==================== 3. GUIDE LIST ==================== */}
         <motion.div variants={itemVars} className="bg-[#F3F1E7] rounded-2xl border border-[#DEDBD0] shadow-lg shadow-[#3D4C38]/5 overflow-hidden">
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-[#E2E6D5]/50 border-b border-[#DEDBD0]">
                     <tr>
                        {['Guide Profile', 'Contact', 'Location', 'Actions'].map((head) => (
                           <th key={head} className="px-6 py-5 text-[10px] font-bold text-[#5A6654] uppercase tracking-widest">{head}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DEDBD0]">
                     <AnimatePresence>
                        {filteredGuides.map((guide) => (
                           <motion.tr
                              key={guide.id}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              onClick={() => setSelectedGuide(guide)} 
                              className="hover:bg-[#E2E6D5]/30 transition-colors group cursor-pointer"
                           >
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#DEDBD0] flex items-center justify-center text-[#5A6654] font-bold text-lg overflow-hidden">
                                       {guide.image ? <img src={guide.image} alt="" className="w-full h-full object-cover" /> : guide.name.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="font-bold text-[#2B3326] text-sm">{guide.name}</p>
                                       <p className="text-[10px] text-[#5A6654] uppercase tracking-wide">ID: {guide.id.slice(0,6)}...</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-[#5A6654] font-medium">{guide.email}</td>
                              <td className="px-6 py-4 text-sm text-[#5A6654]">
                                 {guide.placeName || guide.location || "Not Assigned"}
                              </td>
                              <td className="px-6 py-4">
                                 <button onClick={(e) => handleDeleteGuide(guide.id, e)} className="p-2 rounded-lg bg-[#E2E6D5] text-[#5A6654] hover:bg-red-100 hover:text-red-600 transition-colors opacity-60 group-hover:opacity-100">
                                    <FaTrash size={12} />
                                 </button>
                              </td>
                           </motion.tr>
                        ))}
                     </AnimatePresence>
                  </tbody>
               </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col divide-y divide-[#DEDBD0]">
               <AnimatePresence>
                  {filteredGuides.map((guide) => (
                     <motion.div
                        key={guide.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedGuide(guide)} 
                        className="p-6 flex flex-col gap-4 bg-[#F3F1E7] cursor-pointer active:bg-[#E2E6D5]/50"
                     >
                        <div className="flex justify-between items-start">
                           <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-[#E2E6D5] flex items-center justify-center text-[#3D4C38] font-bold text-xl overflow-hidden">
                                 {guide.image ? <img src={guide.image} alt="" className="w-full h-full object-cover" /> : guide.name.charAt(0)}
                              </div>
                              <div>
                                 <h4 className="font-bold text-[#2B3326] text-lg">{guide.name}</h4>
                                 <div className="flex items-center gap-1 text-xs text-[#5A6654]">
                                    <FaEnvelope size={10} /> {guide.email}
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-[#DEDBD0]/50">
                           <div className="flex items-center gap-2 text-xs text-[#5A6654]">
                              <FaMapMarkerAlt /> {guide.placeName || "Not Assigned"}
                           </div>
                           <button onClick={(e) => handleDeleteGuide(guide.id, e)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                              <FaTrash size={14} />
                           </button>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>

         </motion.div>

      </motion.div>
   );
};

export default ManageGuides;