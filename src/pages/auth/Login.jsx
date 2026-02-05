import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEnvelope, FaLock, FaGoogle, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'; // Import Auth Context

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get login function from our Mock Context
  const { login } = useAuth(); 

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      // 1. Call the dummy login function
      const role = login(email, password);
      
      setIsLoading(false);

      // 2. Redirect based on the returned role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'guide') {
        navigate('/guide');
      } else {
        navigate('/'); // Tourist
      }
    }, 1500);
  };

  return (
    // FIXED: h-screen ensures it fits exactly one viewport. overflow-hidden prevents scrolling.
    <div className="h-screen w-full bg-[#E2E6D5] text-[#2B3326] font-['Poppins'] flex items-center justify-center relative overflow-hidden">
      
      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3D4C38]/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#8B9D77]/10 rounded-full blur-[80px]"></div>

      {/* ==================== MAIN CARD ==================== */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-[#F3F1E7] w-full h-full lg:h-auto lg:max-h-[85vh] lg:aspect-[16/9] max-w-6xl rounded-none lg:rounded-2xl shadow-none lg:shadow-2xl shadow-[#3D4C38]/10 overflow-hidden flex flex-col lg:flex-row relative z-10 lg:border border-[#DEDBD0]"
      >
        
        {/* --- LEFT SIDE: FORM --- */}
        <div className="w-full lg:w-[45%] h-full p-8 md:p-12 flex flex-col justify-center relative bg-[#F3F1E7]">
           
           <Link 
             to="/" 
             className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5A6654] hover:text-[#3D4C38] transition-colors group mb-8 self-start lg:absolute lg:top-5 lg:left-12 lg:mb-0 z-20"
           >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
           </Link>

           <div className="w-full max-w-md mx-auto lg:max-w-xs xl:max-w-sm">
             
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
             >
               <h1 className="text-2xl md:text-3xl font-['Oswald'] font-bold text-[#1F261C] uppercase leading-tight mb-2">
                 Welcome Back
               </h1>
               <p className="text-[#5A6654] text-xs md:text-sm mb-6">
                 Enter your credentials to access your dashboard.
               </p>

          

               <form onSubmit={handleLogin} className="space-y-4">
                   
                   {/* Email Input */}
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Email</label>
                      <div className="relative group">
                         <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D4C38]/50 group-focus-within:text-[#3D4C38] transition-colors" />
                         <input 
                           type="email" 
                           placeholder="name@example.com" 
                           required 
                           className="w-full bg-[#E2E6D5]/50 border border-[#DEDBD0] focus:border-[#3D4C38] rounded-xl py-3 pl-12 pr-4 text-sm text-[#2B3326] outline-none transition-all placeholder:text-[#5A6654]/40"
                           onChange={(e) => setEmail(e.target.value)}
                         />
                      </div>
                   </div>

                   {/* Password Input */}
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Password</label>
                      <div className="relative group">
                         <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D4C38]/50 group-focus-within:text-[#3D4C38] transition-colors" />
                         <input 
                           type="password" 
                           placeholder="••••••••" 
                           required 
                           className="w-full bg-[#E2E6D5]/50 border border-[#DEDBD0] focus:border-[#3D4C38] rounded-xl py-3 pl-12 pr-4 text-sm text-[#2B3326] outline-none transition-all placeholder:text-[#5A6654]/40"
                           onChange={(e) => setPassword(e.target.value)}
                         />
                      </div>
                   </div>

                   {/* Submit Button */}
                   <button 
                     type="submit" 
                     disabled={isLoading}
                     className="w-full bg-[#3D4C38] text-[#F3F1E7] py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#2B3326] transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                   >
                     {isLoading ? (
                       <span className="w-4 h-4 border-2 border-[#F3F1E7] border-t-transparent rounded-full animate-spin"></span>
                     ) : (
                       <>Login <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                     )}
                   </button>

               </form>

               {/* Divider */}
               <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#DEDBD0]"></div></div>
                  <span className="relative bg-[#F3F1E7] px-3 text-[10px] font-bold uppercase text-[#5A6654] tracking-widest">Or continue with</span>
               </div>

               {/* Single Google Button */}
               <div>
                  <button className="w-full flex items-center justify-center gap-3 py-3 border border-[#DEDBD0] rounded-xl hover:bg-[#E2E6D5] transition-colors text-[#2B3326] text-xs font-bold uppercase tracking-wide bg-white/50">
                     <FaGoogle className="text-[#3D4C38]" /> <span>Google Account</span>
                  </button>
               </div>

               <p className="mt-6 text-center text-xs text-[#5A6654]">
                  Don't have an account? <Link to="/register" className="text-[#3D4C38] font-bold uppercase tracking-wide hover:underline">Register Now</Link>
               </p>
             </motion.div>
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
             <div className="w-10 h-1 bg-[#F3F1E7] mb-6"></div>
             <h2 className="text-4xl xl:text-5xl font-['Oswald'] font-bold uppercase leading-tight mb-4">
               Begin Your Journey <br/> Into the Wild
             </h2>
             <p className="text-sm opacity-90 leading-relaxed font-light max-w-md">
               Connect with local experts, discover hidden trails, and experience Wayanad like never before.
             </p>
           </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;