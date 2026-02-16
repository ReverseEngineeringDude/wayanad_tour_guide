import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaEnvelope, FaArrowRight, FaLock, FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

// --- DATABASE IMPORT ---
import { fetchDocument } from '../../firebase/db'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(''); 
  
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useAuth(); 

  // --- LIVE VALIDATION ---
  useEffect(() => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    setFormError(''); 
  }, [email, password]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // --- UPDATED LOGIN LOGIC ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');
    setTouched({ email: true, password: true });

    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);

    try {
      // 1. Authenticate with Firebase Auth
      // FIX: Your AuthContext returns the 'user' object directly, not the credential wrapper.
      const user = await login(email, password);
      
      console.log("Logged in user:", user.uid); // Debugging log

      // 2. Fetch User Role using your custom db.js helper
      try {
        // We use user.uid directly here
        const userData = await fetchDocument("users", user.uid);
        const role = userData.role; // e.g., 'admin', 'guide'
        
        console.log("User Role:", role); // Debugging log

        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'guide') {
          navigate('/guide');
        } else {
          navigate('/');
        }
      } catch (dbError) {
        console.warn("User profile not found in database:", dbError);
        // Fallback: If no role is found in DB, go to home
        navigate('/'); 
      }

    } catch (error) {
      console.error("Login Failed:", error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setFormError("Invalid email or password.");
      } else {
        setFormError("Failed to login. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for input styles
  const getInputClass = (fieldName) => `w-full bg-[#E2E6D5]/50 border ${touched[fieldName] && errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-[#DEDBD0]'} focus:bg-white rounded-xl py-3 pl-12 pr-4 text-sm text-[#2B3326] outline-none transition-all placeholder:text-[#5A6654]/40 ${(!errors[fieldName] && touched[fieldName] && (fieldName === 'email' ? email : password)) ? 'border-green-500/50' : 'focus:border-[#3D4C38]'}`;

  return (
    <div className="h-screen w-full bg-[#E2E6D5] text-[#2B3326] font-['Poppins'] flex items-center justify-center relative overflow-hidden selection:bg-[#3D4C38] selection:text-[#F3F1E7]">
      
      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3D4C38]/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#8B9D77]/10 rounded-full blur-[80px]"></div>

      {/* ==================== MAIN CARD ==================== */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col lg:flex-row bg-[#F3F1E7] overflow-hidden shadow-2xl shadow-[#3D4C38]/15 w-full h-full lg:w-[95%] lg:max-w-5xl lg:h-[85vh] lg:rounded-[2rem] lg:border border-[#DEDBD0]"
      >
        
        {/* --- LEFT SIDE: FORM --- */}
        <div className="w-full lg:w-[45%] h-full flex flex-col bg-[#F3F1E7] relative">
           
           <div className="flex-none pt-8 px-8 md:px-12 pb-4 z-20">
             <Link 
               to="/" 
               className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5A6654] hover:text-[#3D4C38] transition-colors group"
             >
               <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
             </Link>
           </div>

           <div className="flex-1 flex flex-col justify-center px-8 md:px-12 pb-12 overflow-y-auto custom-scrollbar">
             <div className="w-full max-w-sm mx-auto">
               
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="mb-8"
               >
                 <h1 className="text-3xl md:text-4xl font-['Oswald'] font-bold text-[#1F261C] uppercase leading-tight mb-2">
                   Welcome Back
                 </h1>
                 <p className="text-[#5A6654] text-sm">
                   Enter your credentials to access your dashboard.
                 </p>
               </motion.div>

               <AnimatePresence>
                 {formError && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                     className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
                   >
                      <FaExclamationCircle className="text-red-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-red-600 font-medium">{formError}</p>
                   </motion.div>
                 )}
               </AnimatePresence>

               <form onSubmit={handleLogin} className="space-y-5" noValidate>
                   
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Email</label>
                      <div className="relative group">
                          <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${touched.email && errors.email ? 'text-red-400' : 'text-[#3D4C38]/50 group-focus-within:text-[#3D4C38]'}`} />
                          <input 
                            type="email" 
                            placeholder="name@example.com" 
                            className={getInputClass('email')}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => handleBlur('email')}
                          />
                      </div>
                      {touched.email && errors.email && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1 font-bold animate-pulse"><FaExclamationCircle /> {errors.email}</p>}
                   </div>

                   <div className="space-y-1.5">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654]">Password</label>
                      </div>
                      <div className="relative group">
                          <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${touched.password && errors.password ? 'text-red-400' : 'text-[#3D4C38]/50 group-focus-within:text-[#3D4C38]'}`} />
                          
                          <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className={`${getInputClass('password')} pr-12`}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => handleBlur('password')}
                          />

                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3D4C38]/50 hover:text-[#3D4C38] transition-colors cursor-pointer outline-none"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                      </div>
                      {touched.password && errors.password && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1 font-bold animate-pulse"><FaExclamationCircle /> {errors.password}</p>}
                   </div>

                   <button 
                     type="submit" 
                     disabled={isLoading || (Object.keys(errors).length > 0 && touched.email)}
                     className="w-full bg-[#3D4C38] text-[#F3F1E7] py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#2B3326] transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                   >
                     {isLoading ? (
                       <span className="w-4 h-4 border-2 border-[#F3F1E7] border-t-transparent rounded-full animate-spin"></span>
                     ) : (
                       <>Login <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                     )}
                   </button>

               </form>

               <p className="mt-8 text-center text-xs text-[#5A6654]">
                  Don't have an account? <Link to="/register" className="text-[#3D4C38] font-bold uppercase tracking-wide hover:underline">Register Now</Link>
               </p>

             </div>
           </div>
        </div>

        {/* --- RIGHT SIDE: VISUAL --- */}
        <div className="hidden lg:block w-[55%] h-full relative overflow-hidden bg-[#E2E6D5]">
           <motion.div 
             initial={{ scale: 1.1 }}
             animate={{ scale: 1 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className="absolute inset-0 h-full w-full"
           >
             <img 
               src="https://media.istockphoto.com/id/1224099098/photo/dense-green-forest-with-blue-sky-and-dramatic-cloud-landscape.jpg?s=612x612&w=0&k=20&c=d71KVhNJPXkxALu3wsBK-iN6XIfzR77ZSUOhdVY6ciE=" 
               alt="Wayanad Scenery" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#1F261C]/90 via-transparent to-transparent opacity-80"></div>
             <div className="absolute inset-0 bg-[#3D4C38]/20 mix-blend-multiply"></div>
           </motion.div>

           <div className="absolute bottom-12 left-12 right-12 text-[#F3F1E7] z-10">
             <div className="w-10 h-1 bg-[#F3F1E7] mb-6 rounded-full"></div>
             <h2 className="text-4xl xl:text-5xl font-['Oswald'] font-bold uppercase leading-tight mb-4 drop-shadow-lg">
               Begin Your Journey <br/> Into the Wild
             </h2>
             <p className="text-sm opacity-90 leading-relaxed font-light max-w-md drop-shadow-md">
               Connect with local experts, discover hidden trails, and experience Wayanad like never before.
             </p>
           </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;