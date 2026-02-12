import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
   FaUserTie, FaTrash, FaSearch, FaEllipsisV, FaFilter, FaEnvelope, FaCalendarAlt, FaPlus
} from 'react-icons/fa';
import {
   fetchCollection, addDocument, deleteDocument, convertToBase64
} from '../../firebase/db';

// --- HELPER: GENERATE CHART DATA (Total Joins per Month) ---
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
   const [searchTerm, setSearchTerm] = useState('');
   const [loading, setLoading] = useState(true);

   // New State for Adding Guide
   const [showAddForm, setShowAddForm] = useState(false);
   const [newGuide, setNewGuide] = useState({ name: '', email: '', experience: '', rate: '', languages: '', bio: '' });
   const [guideImage, setGuideImage] = useState(null);

   const [places, setPlaces] = useState([]);

   // --- FETCH GUIDES AND PLACES FROM FIRESTORE ---
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

   // Generate dynamic chart data based on real data
   const guideActivityData = generateGuideGrowthData(guides);

   // --- ACTIONS ---
   const handleDeleteGuide = async (id) => {
      if (window.confirm("Are you sure you want to remove this guide?")) {
         try {
            await deleteDocument('guides', id);
            setGuides(guides.filter(guide => guide.id !== id));
         } catch (error) {
            console.error("Error deleting guide:", error);
            alert("Failed to delete guide");
         }
      }
   };

   const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (file) {
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
            languages: newGuide.languages.split(',').map(l => l.trim()), // Convert CSV to Array
            joined: new Date().toISOString().split('T')[0],
            status: 'Active',
            image: guideImage || "https://via.placeholder.com/150" // Fallback image
         };

         const docId = await addDocument('guides', guideData);
         setGuides([...guides, { id: docId, ...guideData }]);

         // Reset Form
         setNewGuide({ name: '', email: '', experience: '', rate: '', languages: '', bio: '', placeId: '', placeName: '' });
         setGuideImage(null);
         setShowAddForm(false);
      } catch (error) {
         console.error("Error adding guide:", error);
         alert("Failed to add guide");
      }
   };

   // --- FILTERING ---
   const filteredGuides = guides.filter(guide =>
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.email.toLowerCase().includes(searchTerm.toLowerCase())
   );

   // --- ANIMATION VARIANTS ---
   const containerVars = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
   };

   const itemVars = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 }
   };

   if (loading) return <div className="text-center p-10">Loading Guides...</div>;

   return (
      <motion.div
         variants={containerVars}
         initial="hidden"
         animate="visible"
         className="w-full space-y-8 pb-20"
      >

         {/* ==================== 1. HEADER & CHART SECTION ==================== */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Header Text */}
            <motion.div variants={itemVars} className="lg:col-span-1 flex flex-col justify-center">
               <h1 className="text-4xl font-['Oswald'] font-bold text-[#2B3326] uppercase tracking-wide mb-2">
                  Manage Guides
               </h1>
               <p className="text-[#5A6654] text-sm leading-relaxed mb-6">
                  View registered guides and manage platform access.
               </p>

               {/* Quick Stat */}
               <div className="flex items-center gap-4 p-4 bg-[#F3F1E7] rounded-xl border border-[#DEDBD0] shadow-sm">
                  <div className="p-3 bg-[#3D4C38] text-[#F3F1E7] rounded-lg">
                     <FaUserTie size={20} />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-[#5A6654] uppercase tracking-widest">Total Guides</p>
                     <p className="text-2xl font-bold text-[#2B3326]">{guides.length}</p>
                  </div>
               </div>
            </motion.div>

            {/* Growth Chart */}
            <motion.div variants={itemVars} className="lg:col-span-2 bg-[#F3F1E7] p-6 rounded-2xl shadow-xl shadow-[#3D4C38]/5 border border-[#DEDBD0]">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-['Oswald'] font-bold text-lg text-[#2B3326] uppercase">Guide Growth</h3>
                  <button className="text-[#3D4C38] hover:bg-[#E2E6D5] p-2 rounded-full transition-colors"><FaEllipsisV /></button>
               </div>

               {guides.length > 0 ? (
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
                           <Tooltip
                              contentStyle={{ backgroundColor: '#2B3326', border: 'none', borderRadius: '8px', color: '#F3F1E7' }}
                           />
                           <Area type="monotone" dataKey="guides" stroke="#3D4C38" strokeWidth={3} fillOpacity={1} fill="url(#colorGuides)" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               ) : (
                  <div className="h-[200px] w-full flex items-center justify-center text-[#5A6654]">No Data Available</div>
               )}
            </motion.div>

         </div>


         {/* ==================== 2. TOOLBAR & FORM TOGGLE ==================== */}
         <motion.div variants={itemVars} className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#F3F1E7] p-4 rounded-xl border border-[#DEDBD0] shadow-sm">

            {/* Search Input */}
            <div className="relative w-full sm:w-96">
               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6654]" />
               <input
                  type="text"
                  placeholder="Search guides by name or email..."
                  className="w-full pl-12 pr-4 py-3 bg-[#E2E6D5] border-none rounded-lg text-sm text-[#2B3326] placeholder-[#5A6654]/60 focus:ring-2 focus:ring-[#3D4C38] outline-none transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>

            <div className="flex gap-2">
               <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#3D4C38] text-[#F3F1E7] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#2B3326] transition-colors shadow-lg"
               >
                  <FaPlus /> {showAddForm ? 'Cancel' : 'Add Guide'}
               </button>

               <button className="flex items-center gap-2 px-6 py-3 bg-[#E2E6D5] text-[#3D4C38] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#DEDBD0] transition-colors">
                  <FaFilter /> Filter
               </button>
            </div>
         </motion.div>

         {/* --- ADD GUIDE FORM --- */}
         <AnimatePresence>
            {showAddForm && (
               <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
               >
                  <form onSubmit={handleAddGuide} className="bg-[#F3F1E7] p-6 rounded-xl border border-[#DEDBD0] grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input type="text" placeholder="Name" required className="p-3 rounded-lg border border-[#DEDBD0]" value={newGuide.name} onChange={e => setNewGuide({ ...newGuide, name: e.target.value })} />
                     <input type="email" placeholder="Email" required className="p-3 rounded-lg border border-[#DEDBD0]" value={newGuide.email} onChange={e => setNewGuide({ ...newGuide, email: e.target.value })} />
                     <input type="text" placeholder="Experience (e.g. 2 Years)" className="p-3 rounded-lg border border-[#DEDBD0]" value={newGuide.experience} onChange={e => setNewGuide({ ...newGuide, experience: e.target.value })} />
                     <input type="number" placeholder="Rate (₹)" className="p-3 rounded-lg border border-[#DEDBD0]" value={newGuide.rate} onChange={e => setNewGuide({ ...newGuide, rate: e.target.value })} />
                     <input type="text" placeholder="Languages (comma separated)" className="p-3 rounded-lg border border-[#DEDBD0]" value={newGuide.languages} onChange={e => setNewGuide({ ...newGuide, languages: e.target.value })} />
                     <textarea placeholder="Bio" className="p-3 rounded-lg border border-[#DEDBD0] md:col-span-2" value={newGuide.bio} onChange={e => setNewGuide({ ...newGuide, bio: e.target.value })}></textarea>

                     {/* Place Selection */}
                     <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-[#5A6654] uppercase mb-1">Assign to Place</label>
                        <select
                           className="w-full p-3 rounded-lg border border-[#DEDBD0] text-sm text-[#2B3326]"
                           value={newGuide.placeId || ''}
                           onChange={e => {
                              const selectedPlace = places.find(p => p.id === e.target.value);
                              setNewGuide({
                                 ...newGuide,
                                 placeId: e.target.value,
                                 placeName: selectedPlace ? selectedPlace.name : ''
                              });
                           }}
                        >
                           <option value="">-- Select a Place --</option>
                           {places.map(place => (
                              <option key={place.id} value={place.id}>{place.name}</option>
                           ))}
                        </select>
                     </div>

                     <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-[#5A6654] uppercase mb-1">Profile Image</label>
                        <input type="file" onChange={handleImageUpload} accept="image/*" className="block w-full text-sm text-[#5A6654] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#3D4C38] file:text-[#F3F1E7] hover:file:bg-[#2B3326]" />
                        {guideImage && <img src={guideImage} alt="Preview" className="h-20 w-20 object-cover rounded-full mt-2 border border-[#DEDBD0]" />}
                     </div>

                     <div className="md:col-span-2 text-right">
                        <button type="submit" className="px-6 py-3 bg-[#3D4C38] text-[#F3F1E7] font-bold rounded-lg uppercase tracking-wide">Save Guide</button>
                     </div>
                  </form>
               </motion.div>
            )}
         </AnimatePresence>

         {/* ==================== 3. RESPONSIVE LIST / TABLE ==================== */}
         <motion.div variants={itemVars} className="bg-[#F3F1E7] rounded-2xl border border-[#DEDBD0] shadow-lg shadow-[#3D4C38]/5 overflow-hidden">

            {/* --- DESKTOP TABLE (Hidden on Mobile) --- */}
            <div className="hidden md:block overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-[#E2E6D5]/50 border-b border-[#DEDBD0]">
                     <tr>
                        {['Guide Profile', 'Contact', 'Joined Date', 'Actions'].map((head) => (
                           <th key={head} className="px-6 py-5 text-[10px] font-bold text-[#5A6654] uppercase tracking-widest">
                              {head}
                           </th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DEDBD0]">
                     <AnimatePresence>
                        {filteredGuides.map((guide) => (
                           <motion.tr
                              key={guide.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="hover:bg-[#E2E6D5]/30 transition-colors group"
                           >
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-4">
                                    {guide.image ? (
                                       <img src={guide.image} alt={guide.name} className="w-10 h-10 rounded-full object-cover border border-[#DEDBD0]" />
                                    ) : (
                                       <div className="w-10 h-10 rounded-full bg-[#DEDBD0] flex items-center justify-center text-[#5A6654] font-bold text-lg">
                                          {guide.name.charAt(0)}
                                       </div>
                                    )}
                                    <div>
                                       <p className="font-bold text-[#2B3326] text-sm">{guide.name}</p>
                                       <p className="text-[10px] text-[#5A6654] uppercase tracking-wide">ID: {guide.id}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-[#5A6654] font-medium">{guide.email}</td>
                              <td className="px-6 py-4 text-sm text-[#5A6654]">{guide.joined}</td>
                              <td className="px-6 py-4">
                                 <button
                                    onClick={() => handleDeleteGuide(guide.id)}
                                    className="p-2 rounded-lg bg-[#E2E6D5] text-[#5A6654] hover:bg-red-100 hover:text-red-600 transition-colors opacity-60 group-hover:opacity-100"
                                    title="Delete Guide"
                                 >
                                    <FaTrash size={12} />
                                 </button>
                              </td>
                           </motion.tr>
                        ))}
                     </AnimatePresence>
                  </tbody>
               </table>
            </div>

            {/* --- MOBILE CARDS (Visible on Mobile) --- */}
            <div className="md:hidden flex flex-col divide-y divide-[#DEDBD0]">
               <AnimatePresence>
                  {filteredGuides.map((guide) => (
                     <motion.div
                        key={guide.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6 flex flex-col gap-4 bg-[#F3F1E7]"
                     >
                        <div className="flex justify-between items-start">
                           <div className="flex items-center gap-3">
                              {guide.image ? (
                                 <img src={guide.image} alt={guide.name} className="w-12 h-12 rounded-full object-cover border border-[#DEDBD0]" />
                              ) : (
                                 <div className="w-12 h-12 rounded-full bg-[#E2E6D5] flex items-center justify-center text-[#3D4C38] font-bold text-xl">
                                    {guide.name.charAt(0)}
                                 </div>
                              )}
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
                              <FaCalendarAlt /> Joined: {guide.joined}
                           </div>
                           <button
                              onClick={() => handleDeleteGuide(guide.id)}
                              className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                           >
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