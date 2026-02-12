import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkedAlt, FaPlus, FaTrash, FaImage, FaPen, FaSearch, FaClock, FaHistory, FaTicketAlt, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import {
   fetchCollection, addDocument, deleteDocument, convertToBase64
} from '../../firebase/db';

const ManagePlaces = () => {
   const [places, setPlaces] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [loading, setLoading] = useState(true);

   // New State for Place Form
   const [newPlace, setNewPlace] = useState({
      name: '',
      description: '',
      history: '',
      ticketPrice: '',
      openTime: '',
      closeTime: '',
      locationUrl: ''
   });

   const [coverImage, setCoverImage] = useState(null);
   const [galleryImages, setGalleryImages] = useState([]);

   // --- FETCH PLACES FROM FIRESTORE ---
   useEffect(() => {
      const loadPlaces = async () => {
         try {
            const data = await fetchCollection('places');
            setPlaces(data);
         } catch (error) {
            console.error("Error fetching places:", error);
         } finally {
            setLoading(false);
         }
      };
      loadPlaces();
   }, []);

   const handleImageChange = async (e, type) => {
      const file = e.target.files[0];
      if (file) {
         try {
            const base64 = await convertToBase64(file);
            if (type === 'cover') {
               setCoverImage(base64);
            } else {
               setGalleryImages([...galleryImages, base64]);
            }
         } catch (error) {
            console.error("Error converting image:", error);
         }
      }
   };

   const removeGalleryImage = (index) => {
      setGalleryImages(galleryImages.filter((_, i) => i !== index));
   };

   const handleAddPlace = async (e) => {
      e.preventDefault();

      if (!newPlace.name) {
         alert("Place Title is required");
         return;
      }

      try {
         const placeData = {
            ...newPlace,
            image: coverImage || "https://via.placeholder.com/300",
            gallery: galleryImages,
            status: 'active'
         };

         const docId = await addDocument('places', placeData);
         setPlaces([...places, { id: docId, ...placeData }]);

         // Reset Form
         setNewPlace({
            name: '', description: '', history: '', ticketPrice: '', openTime: '', closeTime: '', locationUrl: ''
         });
         setCoverImage(null);
         setGalleryImages([]);
         alert("Destination Added Successfully!");

      } catch (error) {
         console.error("Error adding place:", error);
         alert("Failed to add place");
      }
   };

   const handleDeletePlace = async (id) => {
      if (window.confirm("Delete this destination?")) {
         try {
            await deleteDocument('places', id);
            setPlaces(places.filter(p => p.id !== id));
         } catch (error) {
            console.error("Error deleting place:", error);
            alert("Failed to delete place");
         }
      }
   };

   const filteredPlaces = places.filter(place =>
      place.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   if (loading) return <div className="text-center p-10">Loading Destinations...</div>;

   return (
      <div className="w-full pb-20 space-y-8">

         {/* ==================== 1. HEADER ==================== */}
         <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-[#3D4C38]/10 pb-6">
            <div>
               <h1 className="text-4xl font-['Oswald'] font-bold text-[#2B3326] uppercase tracking-wide mb-2">
                  Destinations
               </h1>
               <p className="text-[#5A6654] text-sm max-w-md leading-relaxed">
                  Curate the list of Wayanad's hidden gems. Upload photos, set timings, and manage ticket details.
               </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6654]" />
               <input
                  type="text"
                  placeholder="Search places..."
                  className="w-full pl-10 pr-4 py-3 bg-[#F3F1E7] border border-[#DEDBD0] rounded-xl text-sm text-[#2B3326] focus:ring-1 focus:ring-[#3D4C38] outline-none transition-all placeholder-[#5A6654]/50"
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>


         {/* ==================== 2. MAIN CONTENT GRID ==================== */}
         <div className="flex flex-col lg:flex-row gap-8 items-start relative">

            {/* --- LEFT: ADD PLACE FORM (Sticky Sidebar on Desktop Only) --- */}
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="w-full lg:w-[40%] bg-[#F3F1E7] p-6 md:p-8 rounded-2xl shadow-xl shadow-[#3D4C38]/5 border border-[#DEDBD0] lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto custom-scrollbar"
            >
               <div className="flex items-center gap-3 mb-6 text-[#3D4C38]">
                  <div className="p-2 bg-[#E2E6D5] rounded-lg"><FaPlus /></div>
                  <h3 className="font-['Oswald'] font-bold text-xl uppercase">Add New Location</h3>
               </div>

               <form onSubmit={handleAddPlace} className="space-y-6">

                  {/* Basic Info */}
                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] block mb-1">Place Name</label>
                     <input
                        type="text"
                        className="w-full bg-white border border-[#DEDBD0] rounded-lg p-3 text-sm text-[#2B3326] focus:border-[#3D4C38] outline-none transition-colors"
                        placeholder="e.g. 900 Kandi"
                        value={newPlace.name}
                        onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                     />
                  </div>

                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] block mb-1">Overview Description</label>
                     <textarea
                        rows="3"
                        className="w-full bg-white border border-[#DEDBD0] rounded-lg p-3 text-sm text-[#2B3326] focus:border-[#3D4C38] outline-none transition-colors resize-none"
                        placeholder="Short summary..."
                        value={newPlace.description}
                        onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
                     ></textarea>
                  </div>

                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] block mb-1 flex items-center gap-2"><FaHistory /> Detailed History</label>
                     <textarea
                        rows="4"
                        className="w-full bg-white border border-[#DEDBD0] rounded-lg p-3 text-sm text-[#2B3326] focus:border-[#3D4C38] outline-none transition-colors resize-none"
                        placeholder="Historical background..."
                        value={newPlace.history}
                        onChange={(e) => setNewPlace({ ...newPlace, history: e.target.value })}
                     ></textarea>
                  </div>

                  {/* Details Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] block mb-1 flex items-center gap-1"><FaTicketAlt /> Ticket Price</label>
                        <input
                           type="text"
                           className="w-full bg-white border border-[#DEDBD0] rounded-lg p-3 text-sm text-[#2B3326] focus:border-[#3D4C38] outline-none"
                           placeholder="e.g. ₹50 / Person"
                           value={newPlace.ticketPrice}
                           onChange={(e) => setNewPlace({ ...newPlace, ticketPrice: e.target.value })}
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] block mb-1 flex items-center gap-1"><FaClock /> Open - Close</label>
                        <div className="flex gap-2">
                           <input
                              type="text"
                              className="w-full bg-white border border-[#DEDBD0] rounded-lg p-3 text-sm focus:border-[#3D4C38] outline-none"
                              placeholder="09:00 AM"
                              value={newPlace.openTime}
                              onChange={(e) => setNewPlace({ ...newPlace, openTime: e.target.value })}
                           />
                           <input
                              type="text"
                              className="w-full bg-white border border-[#DEDBD0] rounded-lg p-3 text-sm focus:border-[#3D4C38] outline-none"
                              placeholder="05:00 PM"
                              value={newPlace.closeTime}
                              onChange={(e) => setNewPlace({ ...newPlace, closeTime: e.target.value })}
                           />
                        </div>
                     </div>
                  </div>

                  {/* --- IMAGE UPLOAD SECTION --- */}
                  <div className="space-y-4 pt-2 border-t border-[#DEDBD0]">

                     {/* Cover Image Upload */}
                     <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] block mb-2">Cover Image</label>
                        <div className="flex items-center gap-4">
                           <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-3 bg-white border border-dashed border-[#5A6654] rounded-lg hover:bg-[#E2E6D5] transition-colors text-xs text-[#5A6654] font-bold uppercase tracking-wide">
                              <FaCloudUploadAlt size={16} /> Choose File
                              <input type="file" className="hidden" onChange={(e) => handleImageChange(e, 'cover')} accept="image/*" />
                           </label>
                           {coverImage && (
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#DEDBD0]">
                                 <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                              </div>
                           )}
                        </div>
                     </div>

                     {/* Gallery Upload */}
                     <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] block mb-2">Gallery Images</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                           {galleryImages.map((img, idx) => (
                              <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border border-[#DEDBD0] relative group">
                                 <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                                 <button
                                    type="button"
                                    onClick={() => removeGalleryImage(idx)}
                                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                    <FaTimes size={10} />
                                 </button>
                              </div>
                           ))}
                           <label className="w-12 h-12 cursor-pointer flex items-center justify-center bg-white border border-dashed border-[#5A6654] rounded-lg hover:bg-[#E2E6D5] transition-colors text-[#5A6654]">
                              <FaPlus size={12} />
                              <input type="file" className="hidden" onChange={(e) => handleImageChange(e, 'gallery')} accept="image/*" />
                           </label>
                        </div>
                     </div>

                  </div>

                  {/* Map Link */}
                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] block mb-1">Google Map Embed URL</label>
                     <input
                        type="text"
                        className="w-full bg-white border border-[#DEDBD0] rounded-lg p-3 text-sm text-[#2B3326] focus:border-[#3D4C38] outline-none"
                        placeholder="<iframe> src link..."
                        value={newPlace.locationUrl}
                        onChange={(e) => setNewPlace({ ...newPlace, locationUrl: e.target.value })}
                     />
                  </div>

                  <button type="submit" className="w-full py-4 bg-[#3D4C38] text-[#F3F1E7] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#2B3326] transition-all shadow-lg flex items-center justify-center gap-2 mt-4">
                     <FaMapMarkedAlt /> Publish Location
                  </button>
               </form>
            </motion.div>


            {/* --- RIGHT: EXISTING PLACES LIST --- */}
            <div className="w-full lg:w-[60%] space-y-6">
               <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A6654]">
                     Library ({filteredPlaces.length})
                  </h3>
               </div>

               {places.length === 0 ? (
                  <div className="text-center p-8 bg-[#F3F1E7] rounded-xl border border-[#DEDBD0] text-[#5A6654]">
                     No destinations added yet.
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <AnimatePresence>
                        {filteredPlaces.map((place) => (
                           <motion.div
                              key={place.id}
                              layout
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="group relative bg-[#F3F1E7] rounded-xl overflow-hidden border border-[#DEDBD0] hover:border-[#3D4C38] transition-all shadow-sm hover:shadow-md flex flex-col"
                           >
                              {/* Image Header */}
                              <div className="h-48 w-full relative overflow-hidden">
                                 <img src={place.image} alt={place.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                 <div className="absolute inset-0 bg-[#2B3326]/20 group-hover:bg-[#2B3326]/10 transition-colors"></div>

                                 {/* Actions Overlay */}
                                 <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-10px] group-hover:translate-y-0 duration-300">
                                    <button className="p-2 bg-[#F3F1E7] text-[#3D4C38] rounded-lg shadow-sm hover:bg-[#3D4C38] hover:text-[#F3F1E7] transition-colors" title="Edit">
                                       <FaPen size={12} />
                                    </button>
                                    <button
                                       onClick={() => handleDeletePlace(place.id)}
                                       className="p-2 bg-[#F3F1E7] text-red-500 rounded-lg shadow-sm hover:bg-red-500 hover:text-[#F3F1E7] transition-colors"
                                       title="Delete"
                                    >
                                       <FaTrash size={12} />
                                    </button>
                                 </div>
                              </div>

                              {/* Content */}
                              <div className="p-5 flex-1 flex flex-col">
                                 <h4 className="font-['Oswald'] font-bold text-[#2B3326] text-xl uppercase truncate mb-2">{place.name}</h4>

                                 <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="bg-[#E2E6D5] text-[#5A6654] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                                       <FaClock size={10} /> {place.openTime} - {place.closeTime}
                                    </span>
                                    <span className="bg-[#E2E6D5] text-[#5A6654] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                                       <FaTicketAlt size={10} /> {place.ticketPrice}
                                    </span>
                                 </div>

                                 <p className="text-[#5A6654] text-xs leading-relaxed line-clamp-3 mb-4">
                                    {place.description}
                                 </p>

                                 <div className="mt-auto border-t border-[#DEDBD0] pt-3 flex justify-between items-center text-[10px] font-bold text-[#3D4C38] uppercase tracking-widest">
                                    <span>ID: ...{place.id.slice(-4)}</span>
                                    <span>{place.gallery?.length || 0} Photos</span>
                                 </div>
                              </div>
                           </motion.div>
                        ))}
                     </AnimatePresence>
                  </div>
               )}
            </div>

         </div>
      </div>
   );
};

export default ManagePlaces;