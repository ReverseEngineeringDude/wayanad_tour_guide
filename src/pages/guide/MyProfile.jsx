import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
   FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaCamera, FaSave, FaIdBadge,
   FaBriefcase, FaLanguage, FaPen, FaSpinner
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { fetchDocument, updateDocument, convertToBase64 } from '../../firebase/db';

const MyProfile = () => {
   const { currentUser } = useAuth();
   const fileInputRef = useRef(null);

   // --- STATE ---
   const [isSaving, setIsSaving] = useState(false);
   const [isFetching, setIsFetching] = useState(true);
   
   // Default image placeholder
   const [imagePreview, setImagePreview] = useState("https://placehold.co/150");
   const [newImageFile, setNewImageFile] = useState(null);

   const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      experience: '',
      languages: '',
      bio: '',
      location: ''
   });

   // --- 1. FETCH DATA FROM 'GUIDES' COLLECTION ---
   useEffect(() => {
      const loadProfileData = async () => {
         if (!currentUser?.uid) return;

         setIsFetching(true);
         try {
            // 1. Determine Collection: Check if the logged-in user is a guide
            // Ideally, your AuthContext provides currentUser.role. 
            // If not, we default to checking 'guides' first if we suspect they are a guide.
            const collectionName = currentUser.role === 'guide' ? 'guides' : 'users';
            
            console.log(`Fetching profile from collection: ${collectionName} for UID: ${currentUser.uid}`);

            // 2. Fetch the document
            const data = await fetchDocument(collectionName, currentUser.uid);

            if (data) {
               console.log("Data fetched:", data); // Debugging

               // 3. Map Firestore Data to Form State
               setFormData({
                  name: data.name || '', 
                  email: data.email || currentUser.email || '',
                  phone: data.phone || '',
                  experience: data.experience || '',
                  // Register.js saves languages as an Array, so we join it for the text input
                  languages: Array.isArray(data.languages) ? data.languages.join(', ') : (data.languages || ''),
                  bio: data.bio || '',
                  location: data.location || ''
               });

               // 4. Set Image
               // Register.js saves it in the field 'image'
               if (data.image) {
                  setImagePreview(data.image);
               }
            }
         } catch (error) {
            console.error("Error fetching profile data:", error);
         } finally {
            setIsFetching(false);
         }
      };

      loadProfileData();
   }, [currentUser]);

   // --- HANDLERS ---

   const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const triggerImageUpload = () => {
      fileInputRef.current.click();
   };

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setNewImageFile(file);
         const objectUrl = URL.createObjectURL(file);
         setImagePreview(objectUrl);
      }
   };

   const handleSave = async (e) => {
      e.preventDefault();
      setIsSaving(true);

      try {
         // 1. Convert Languages String back to Array
         const languagesArray = formData.languages.split(',').map(l => l.trim()).filter(l => l);

         // 2. Handle Image
         let finalImage = imagePreview; 
         
         // Only convert if a NEW file was selected
         if (newImageFile) {
             if(newImageFile.size > 800 * 1024) { // 800KB Limit check
                 alert("Image is too large. Please choose an image under 800KB.");
                 setIsSaving(false);
                 return;
             }
             finalImage = await convertToBase64(newImageFile);
         }

         // 3. Create Update Object
         const updates = {
            name: formData.name,
            phone: formData.phone,
            experience: formData.experience,
            languages: languagesArray, // Save as Array
            bio: formData.bio,
            location: formData.location,
            image: finalImage          // Save Base64
         };

         // 4. Save to 'guides' collection
         const collectionName = currentUser.role === 'guide' ? 'guides' : 'users';
         await updateDocument(collectionName, currentUser.uid, updates);

         // 5. Optional: Sync basic details to 'users' collection for Auth consistency
         if (collectionName === 'guides') {
             try {
                await updateDocument('users', currentUser.uid, { 
                    displayName: formData.name, 
                    photoURL: finalImage 
                });
             } catch(e) { /* Ignore if user doc doesn't exist */ }
         }

         alert("Profile Updated Successfully!");

      } catch (error) {
         console.error("Error updating profile:", error);
         alert("Failed to update profile: " + error.message);
      } finally {
         setIsSaving(false);
      }
   };

   // --- RENDER ---
   if (isFetching) {
       return (
           <div className="w-full h-96 flex items-center justify-center text-[#5A6654]">
               <div className="flex flex-col items-center gap-2">
                   <FaSpinner className="animate-spin text-3xl" />
                   <p className="text-xs uppercase tracking-widest">Loading Profile...</p>
               </div>
           </div>
       );
   }

   const containerVars = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
   };

   const itemVars = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 }
   };

   return (
      <motion.div
         variants={containerVars}
         initial="hidden"
         animate="visible"
         className="w-full pb-20 space-y-8"
      >
         {/* HEADER */}
         <motion.div variants={itemVars}>
            <h1 className="text-4xl font-['Oswald'] font-bold text-[#2B3326] uppercase tracking-wide mb-2">
               My Profile
            </h1>
            <p className="text-[#5A6654] text-sm leading-relaxed">
               Manage your public profile and contact details visible to tourists.
            </p>
         </motion.div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* LEFT: PROFILE CARD */}
            <motion.div variants={itemVars} className="lg:col-span-1 space-y-6">
               <div className="bg-[#F3F1E7] p-8 rounded-2xl border border-[#DEDBD0] shadow-xl shadow-[#3D4C38]/5 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-24 bg-[#3D4C38]/10"></div>

                  <div className="relative mt-4 mb-4 group cursor-pointer" onClick={triggerImageUpload}>
                     <div className="w-28 h-28 rounded-full bg-[#E2E6D5] border-4 border-[#F3F1E7] shadow-lg flex items-center justify-center text-4xl overflow-hidden relative">
                        <img src={imagePreview} alt={formData.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                           Change
                        </div>
                     </div>
                     <button type="button" className="absolute bottom-0 right-0 p-2 bg-[#3D4C38] text-[#F3F1E7] rounded-full shadow-md hover:bg-[#2B3326] transition-colors z-10">
                        <FaCamera size={12} />
                     </button>
                     <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                  </div>

                  <h2 className="text-2xl font-['Oswald'] font-bold text-[#2B3326]">{formData.name || "User Name"}</h2>
                  <div className="flex items-center gap-2 text-[#5A6654] text-sm mt-1 mb-4">
                     <FaIdBadge /> <span>ID: {currentUser?.uid?.slice(0, 6)}...</span>
                  </div>

                  <div className="w-full pt-6 border-t border-[#DEDBD0] flex justify-between text-xs font-bold text-[#5A6654] uppercase tracking-widest">
                     <span>Role</span>
                     <span className="text-[#3D4C38] flex items-center gap-1 uppercase">{currentUser?.role || "User"}</span>
                  </div>
               </div>
            </motion.div>

            {/* RIGHT: EDIT FORM */}
            <motion.div variants={itemVars} className="lg:col-span-2 bg-[#F3F1E7] p-8 rounded-2xl border border-[#DEDBD0] shadow-xl shadow-[#3D4C38]/5">
               <div className="flex items-center gap-3 mb-8 border-b border-[#DEDBD0] pb-4">
                  <div className="p-2 bg-[#E2E6D5] text-[#3D4C38] rounded-lg"><FaUser /></div>
                  <h3 className="font-['Oswald'] font-bold text-xl uppercase text-[#2B3326]">Edit Details</h3>
               </div>

               <form onSubmit={handleSave} className="space-y-6">

                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="group">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] mb-2 block">Full Name</label>
                        <div className="relative">
                           <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6654]" />
                           <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[#E2E6D5] rounded-xl py-3 pl-12 pr-4 text-sm font-medium text-[#2B3326] outline-none border border-transparent focus:border-[#3D4C38] transition-all" />
                        </div>
                     </div>

                     <div className="group">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] mb-2 block">Email Address</label>
                        <div className="relative">
                           <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6654]" />
                           <input type="email" name="email" value={formData.email} disabled className="w-full bg-[#E2E6D5]/50 rounded-xl py-3 pl-12 pr-4 text-sm font-medium text-[#5A6654] border border-[#DEDBD0] cursor-not-allowed" />
                        </div>
                     </div>
                  </div>

                  {/* Contact & Professional */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="group">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] mb-2 block">Contact Number</label>
                        <div className="relative">
                           <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6654]" />
                           <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-[#E2E6D5] rounded-xl py-3 pl-12 pr-4 text-sm font-medium text-[#2B3326] outline-none border border-transparent focus:border-[#3D4C38] transition-all" />
                        </div>
                     </div>

                     <div className="group">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] mb-2 block">Experience</label>
                        <div className="relative">
                           <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6654]" />
                           <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} className="w-full bg-[#E2E6D5] rounded-xl py-3 pl-12 pr-4 text-sm font-medium text-[#2B3326] outline-none border border-transparent focus:border-[#3D4C38] transition-all" />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="group">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] mb-2 block">Languages (comma separated)</label>
                        <div className="relative">
                           <FaLanguage className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6654]" />
                           <input type="text" name="languages" value={formData.languages} onChange={handleInputChange} className="w-full bg-[#E2E6D5] rounded-xl py-3 pl-12 pr-4 text-sm font-medium text-[#2B3326] outline-none border border-transparent focus:border-[#3D4C38] transition-all" />
                        </div>
                     </div>

                     <div className="group">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] mb-2 block">Location</label>
                        <div className="relative">
                           <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6654]" />
                           <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-[#E2E6D5] rounded-xl py-3 pl-12 pr-4 text-sm font-medium text-[#2B3326] outline-none border border-transparent focus:border-[#3D4C38] transition-all" />
                        </div>
                     </div>
                  </div>

                  <div className="group">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] mb-2 block">Bio</label>
                     <div className="relative">
                        <FaPen className="absolute left-4 top-4 text-[#5A6654]" />
                        <textarea name="bio" rows="4" value={formData.bio} onChange={handleInputChange} className="w-full bg-[#E2E6D5] rounded-xl py-3 pl-12 pr-4 text-sm font-medium text-[#2B3326] outline-none border border-transparent focus:border-[#3D4C38] transition-all resize-none"></textarea>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-[#DEDBD0]">
                     <button type="submit" disabled={isSaving} className="w-full md:w-auto px-8 py-3 bg-[#3D4C38] text-[#F3F1E7] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#2B3326] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                        {isSaving ? <span className="w-4 h-4 border-2 border-[#F3F1E7] border-t-transparent rounded-full animate-spin"></span> : <> <FaSave /> Save Changes </>}
                     </button>
                  </div>

               </form>
            </motion.div>
         </div>
      </motion.div>
   );
};

export default MyProfile;