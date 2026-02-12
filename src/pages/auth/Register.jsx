import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowLeft, FaUser, FaEnvelope, FaLock, FaEye, FaIdBadge,
  FaArrowRight, FaEyeSlash, FaPhone, FaBriefcase, FaMapMarkerAlt, FaPen, FaCheck, FaExclamationCircle, FaCamera, FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { setDocument, convertToBase64 } from '../../firebase/db';

const Register = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  // --- FORM STATE ---
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    experience: '',
    location: '',
    bio: ''
  });

  // Image State
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const availableLanguages = ["English", "Malayalam", "Hindi", "Tamil", "Arabic", "French"];

  // --- UI STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [passStrength, setPassStrength] = useState({ label: '', color: 'bg-gray-200', width: '0%' });

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const toggleLanguage = (lang) => {
    setSelectedLanguages(prev => {
      const newLangs = prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang];
      if (!touched.languages) setTouched(prevT => ({ ...prevT, languages: true }));
      return newLangs;
    });
  };

  // Image Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setTouched(prev => ({ ...prev, profileImage: true }));
    }
  };

  // FIXED: Added event parameters to stop bubbling
  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents triggering the file input underneath
    setProfileImage(null);
    setImagePreview(null);
  };

  // --- LIVE VALIDATION ---
  useEffect(() => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    else if (formData.name.trim().length < 3) newErrors.name = "Name too short (min 3 chars)";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email address";

    if (!formData.password) {
      newErrors.password = "Password is required";
      setPassStrength({ label: '', color: 'bg-gray-200', width: '0%' });
    } else {
      let strength = 0;
      if (formData.password.length >= 6) strength++;
      if (formData.password.length >= 10) strength++;
      if (/[A-Z]/.test(formData.password)) strength++;
      if (/[0-9]/.test(formData.password)) strength++;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength++;

      if (formData.password.length < 6) {
        newErrors.password = "Must be at least 6 characters";
        setPassStrength({ label: 'Too Short', color: 'bg-red-500', width: '20%' });
      } else if (strength < 3) {
        setPassStrength({ label: 'Weak', color: 'bg-orange-400', width: '40%' });
      } else if (strength < 5) {
        setPassStrength({ label: 'Medium', color: 'bg-yellow-400', width: '70%' });
      } else {
        setPassStrength({ label: 'Strong', color: 'bg-green-500', width: '100%' });
      }
    }

    if (role === 'guide') {
      const phoneRegex = /^\d{10}$/;
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = "Must be a valid 10-digit number";

      if (!formData.experience.trim()) newErrors.experience = "Experience is required";
      if (!formData.location.trim()) newErrors.location = "Location is required";
      if (!formData.bio.trim()) newErrors.bio = "Bio is required";
      else if (formData.bio.trim().length < 20) newErrors.bio = "Bio is too short (min 20 chars)";

      if (selectedLanguages.length === 0) newErrors.languages = "Select at least one language";
      if (!profileImage) newErrors.profileImage = "Profile picture is required";
    }

    setErrors(newErrors);
  }, [formData, role, selectedLanguages, profileImage]);


  const handleRegister = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched({ ...allTouched, languages: true, profileImage: true });

    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);

    try {
      // 1. Sign up user (creates Auth & 'users' doc)
      const user = await signup(formData.name, formData.email, formData.password, role);

      // 2. If Guide, create 'guides' doc and handle image
      if (role === 'guide') {
        let imageBase64 = "https://via.placeholder.com/150";
        if (profileImage) {
          try {
            imageBase64 = await convertToBase64(profileImage);
          } catch (err) {
            console.error("Error converting image:", err);
          }
        }

        const guideData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          experience: formData.experience,
          location: formData.location,
          languages: selectedLanguages, // Array
          bio: formData.bio,
          image: imageBase64,
          status: 'Active', // Or 'Pending' if approval needed
          joined: new Date().toISOString().split('T')[0],
          rating: 0,
          reviewCount: 0,
          uid: user.uid
        };

        // Use setDocument to use the same UID
        await setDocument('guides', user.uid, guideData);
      }

      setIsLoading(false);

      if (role === 'guide') {
        navigate('/guide');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error("Registration Error:", error);
      setIsLoading(false);
      // You might want to show an error message to the user here
    }
  };

  const getInputClass = (fieldName) => `w-full bg-[#E2E6D5]/50 border ${touched[fieldName] && errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-[#DEDBD0]'} focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm text-[#2B3326] outline-none transition-all placeholder:text-[#5A6654]/40 ${(!errors[fieldName] && touched[fieldName] && formData[fieldName]) ? 'border-green-500/50' : 'focus:border-[#3D4C38]'}`;

  return (
    <div className="h-screen w-full bg-[#E2E6D5] text-[#2B3326] font-['Poppins'] flex items-center justify-center relative overflow-hidden selection:bg-[#3D4C38] selection:text-[#F3F1E7]">

      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#3D4C38]/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#8B9D77]/10 rounded-full blur-[80px]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col lg:flex-row bg-[#F3F1E7] overflow-hidden shadow-2xl shadow-[#3D4C38]/15 w-full h-full lg:w-[95%] lg:max-w-5xl lg:h-[90vh] lg:rounded-[2rem] lg:border border-[#DEDBD0]"
      >

        {/* --- LEFT: FORM --- */}
        <div className="w-full lg:w-1/2 h-full flex flex-col bg-[#F3F1E7] relative">

          <div className="flex-none pt-6 px-6 md:px-12 pb-4 z-20 bg-[#F3F1E7]">
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5A6654] hover:text-[#3D4C38] transition-colors group">
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Home
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-8 custom-scrollbar">
            <div className="w-full max-w-sm mx-auto space-y-6 pt-2">

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h1 className="text-3xl md:text-4xl font-['Oswald'] font-bold text-[#1F261C] uppercase leading-none mb-2">Create Account</h1>
                <p className="text-[#5A6654] text-xs font-medium">Join us as an Explorer or a Local Expert.</p>
              </motion.div>

              <form onSubmit={handleRegister} className="space-y-4" noValidate>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">I am a</label>
                  <div className="relative group">
                    <FaIdBadge className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D4C38]/40" />
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-[#E2E6D5]/50 border border-[#DEDBD0] focus:border-[#3D4C38] focus:bg-white rounded-xl py-3 pl-11 pr-10 text-sm text-[#2B3326] outline-none cursor-pointer font-medium">
                      <option value="user">Tourist (Explorer)</option>
                      <option value="guide">Local Guide</option>
                    </select>
                  </div>
                </div>

                {/* Standard Fields */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Full Name</label>
                  <div className="relative group">
                    <FaUser className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${touched.name && errors.name ? 'text-red-400' : 'text-[#3D4C38]/40'}`} />
                    <input type="text" name="name" placeholder={role === 'guide' ? "Guide Name" : "John Doe"} className={getInputClass('name')} value={formData.name} onChange={handleChange} onBlur={handleBlur} />
                  </div>
                  {touched.name && errors.name && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1 font-bold animate-pulse"><FaExclamationCircle /> {errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Email</label>
                  <div className="relative group">
                    <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${touched.email && errors.email ? 'text-red-400' : 'text-[#3D4C38]/40'}`} />
                    <input type="email" name="email" placeholder="name@example.com" className={getInputClass('email')} value={formData.email} onChange={handleChange} onBlur={handleBlur} />
                  </div>
                  {touched.email && errors.email && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1 font-bold animate-pulse"><FaExclamationCircle /> {errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Password</label>
                  <div className="relative group">
                    <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${touched.password && errors.password ? 'text-red-400' : 'text-[#3D4C38]/40'}`} />
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" className={`${getInputClass('password')} pr-12`} value={formData.password} onChange={handleChange} onBlur={handleBlur} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3D4C38]/40 hover:text-[#3D4C38]">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="px-1 space-y-1">
                      <div className="h-1 w-full bg-[#DEDBD0]/50 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${passStrength.color}`} style={{ width: passStrength.width }}></div>
                      </div>
                      <p className={`text-[10px] font-bold text-right ${passStrength.color.replace('bg-', 'text-')}`}>{passStrength.label}</p>
                    </div>
                  )}
                  {touched.password && errors.password && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1 font-bold"><FaExclamationCircle /> {errors.password}</p>}
                </div>

                {/* --- GUIDE FIELDS --- */}
                <AnimatePresence>
                  {role === 'guide' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                      <div className="py-2 flex items-center gap-4"><div className="h-px bg-[#DEDBD0] flex-1"></div><p className="text-[10px] font-bold text-[#3D4C38] uppercase">Guide Details</p><div className="h-px bg-[#DEDBD0] flex-1"></div></div>

                      {/* --- PROFILE IMAGE INPUT --- */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Profile Picture (Portrait)</label>

                        <div className={`w-full bg-[#E2E6D5]/50 border-2 border-dashed ${touched.profileImage && errors.profileImage ? 'border-red-400 bg-red-50' : 'border-[#DEDBD0] hover:border-[#3D4C38]'} rounded-xl p-4 transition-all text-center relative group cursor-pointer`}>

                          {/* Image Preview & Remove Button */}
                          {imagePreview ? (
                            <div className="relative w-32 mx-auto aspect-[3/4] rounded-lg overflow-hidden shadow-md z-10">
                              <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                              {/* FIXED: Added z-20 and onClick handlers */}
                              <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 z-20 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors cursor-pointer"
                              >
                                <FaTimes size={12} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-center mb-2 text-[#3D4C38]/50 group-hover:text-[#3D4C38] transition-colors">
                                <FaCamera size={24} />
                              </div>
                              <p className="text-xs text-[#5A6654]">Click to upload image</p>
                              <p className="text-[10px] text-[#5A6654]/60 mt-1">Recommended: 3:4 Aspect Ratio</p>
                            </>
                          )}

                          {/* File Input - Only active if no preview exists */}
                          {!imagePreview && (
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
                            />
                          )}
                        </div>
                        {touched.profileImage && errors.profileImage && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1 font-bold"><FaExclamationCircle /> {errors.profileImage}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Contact</label>
                        <div className="relative group">
                          <FaPhone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${touched.phone && errors.phone ? 'text-red-400' : 'text-[#3D4C38]/40'}`} />
                          <input type="tel" name="phone" placeholder="10-digit Mobile" className={getInputClass('phone')} value={formData.phone} onChange={handleChange} onBlur={handleBlur} />
                        </div>
                        {touched.phone && errors.phone && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1 font-bold"><FaExclamationCircle /> {errors.phone}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Experience</label>
                          <div className="relative group">
                            <FaBriefcase className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${touched.experience && errors.experience ? 'text-red-400' : 'text-[#3D4C38]/40'}`} />
                            <input type="text" name="experience" placeholder="e.g. 5 Yrs" className={getInputClass('experience')} value={formData.experience} onChange={handleChange} onBlur={handleBlur} />
                          </div>
                          {touched.experience && errors.experience && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.experience}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Service Location</label>
                          <div className="relative group">
                            <FaMapMarkerAlt className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${touched.location && errors.location ? 'text-red-400' : 'text-[#3D4C38]/40'}`} />
                            <input type="text" name="location" placeholder="City" className={getInputClass('location')} value={formData.location} onChange={handleChange} onBlur={handleBlur} />
                          </div>
                          {touched.location && errors.location && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.location}</p>}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Languages</label>
                        <div className={`flex flex-wrap gap-2 p-2 rounded-xl border ${touched.languages && errors.languages ? 'border-red-300 bg-red-50' : 'border-transparent'}`}>
                          {availableLanguages.map((lang) => (
                            <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all border ${selectedLanguages.includes(lang) ? 'bg-[#3D4C38] text-[#F3F1E7] border-[#3D4C38]' : 'bg-white border-[#DEDBD0] text-[#5A6654]'}`}
                            >
                              {lang} {selectedLanguages.includes(lang) && <FaCheck className="inline ml-1" />}
                            </button>
                          ))}
                        </div>
                        {touched.languages && errors.languages && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1 font-bold"><FaExclamationCircle /> {errors.languages}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Bio</label>
                        <div className="relative group">
                          <FaPen className={`absolute left-4 top-4 transition-colors ${touched.bio && errors.bio ? 'text-red-400' : 'text-[#3D4C38]/40'}`} />
                          <textarea rows="3" name="bio" placeholder="Short bio (min 20 chars)..." className={`${getInputClass('bio')} resize-none custom-scrollbar`} value={formData.bio} onChange={handleChange} onBlur={handleBlur} />
                        </div>
                        {touched.bio && errors.bio && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1 font-bold"><FaExclamationCircle /> {errors.bio}</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={isLoading || Object.keys(errors).length > 0} className="w-full bg-[#3D4C38] text-[#F3F1E7] py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#2B3326] transition-all shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? <span className="w-4 h-4 border-2 border-[#F3F1E7] border-t-transparent rounded-full animate-spin"></span> : <>Register <FaArrowRight /></>}
                </button>

              </form>
              <p className="text-center text-xs text-[#5A6654] pt-2">Already have an account? <Link to="/login" className="text-[#3D4C38] font-bold uppercase tracking-wide hover:underline">Login</Link></p>
            </div>
          </div>
        </div>

        {/* --- RIGHT: IMAGE --- */}
        <div className="hidden lg:block w-1/2 h-full relative overflow-hidden bg-[#E2E6D5]">
          <motion.div initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0 h-full w-full">
            <img src="https://i.pinimg.com/736x/1b/e0/07/1be007fc4c429641c747215df72d8bc9.jpg" alt="Wayanad" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F261C]/90 via-[#1F261C]/20 to-transparent opacity-80"></div>
          </motion.div>
          <div className="absolute bottom-14 left-14 right-14 text-[#F3F1E7] z-10">
            <div className="w-12 h-1 bg-[#F3F1E7] mb-8 rounded-full"></div>
            <h2 className="text-5xl xl:text-6xl font-['Oswald'] font-bold uppercase leading-[0.9] mb-6 drop-shadow-lg">Join the <br /> Expedition</h2>
            <p className="text-sm opacity-90 leading-relaxed font-light max-w-md">Unlock exclusive guides, manage your itinerary, and curate your ultimate Wayanad experience.</p>
          </div>
        </div>

      </motion.div>

      {/* --- SCROLLBAR STYLE --- */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #DEDBD0;
          border-radius: 50px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #3D4C38;
        }
      `}</style>
    </div>
  );
};

export default Register;