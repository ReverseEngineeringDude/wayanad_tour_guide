import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUser, FaEnvelope, FaLock, FaIdBadge, FaGoogle, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { signup } = useAuth(); 

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // simulate async signup
      signup(name, email, password);
      setIsLoading(false);
      
      if (role === 'guide') navigate('/guide');
      else navigate('/');
    }, 1500);
  };

  return (
    // OUTER CONTAINER: Strictly 100vh (h-screen) and hidden overflow to lock the viewport.
    <div className="h-screen w-full bg-[#E2E6D5] text-[#2B3326] font-['Poppins'] flex items-center justify-center relative overflow-hidden selection:bg-[#3D4C38] selection:text-[#F3F1E7]">
      
      {/* --- BACKGROUND TEXTURES --- */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#3D4C38]/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#8B9D77]/10 rounded-full blur-[80px]"></div>

      {/* ==================== MAIN CARD ==================== */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // smooth ease-out-quint
        className="
          relative z-10 flex flex-col lg:flex-row bg-[#F3F1E7] overflow-hidden shadow-2xl shadow-[#3D4C38]/15
          w-full h-full                        /* Mobile: Fill screen */
          lg:w-[95%] lg:max-w-5xl lg:h-auto    /* Desktop: Width constraints */
          lg:max-h-[90vh] lg:aspect-[16/9]     /* Desktop: Height constraints (Prevents page scroll) */
          lg:rounded-[2rem] lg:border border-[#DEDBD0]
        "
      >
        
        {/* --- LEFT SIDE: FORM CONTAINER --- */}
        {/* We use flex-col to keep the Header static and make the Middle scrollable */}
        <div className="w-full lg:w-1/2 h-full flex flex-col bg-[#F3F1E7] relative">
           
           {/* 1. Header (Static - Does not scroll) */}
           <div className="flex-none pt-6 px-8 md:px-12 pb-4">
             <Link 
               to="/" 
               className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5A6654] hover:text-[#3D4C38] transition-colors group"
             >
               <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Home
             </Link>
           </div>

           {/* 2. Scrollable Content Area (Flex-1 takes remaining height) */}
           <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-8 custom-scrollbar">
             <div className="h-full flex flex-col justify-center min-h-[500px] lg:min-h-0">
               <div className="w-full max-w-sm mx-auto space-y-6">
                 
                 {/* Title Section */}
                 <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                 >
                   <h1 className="text-3xl md:text-4xl font-['Oswald'] font-bold text-[#1F261C] uppercase leading-none mb-2">
                     Create Account
                   </h1>
                   <p className="text-[#5A6654] text-xs font-medium">
                     Start your Wayanad expedition today.
                   </p>
                 </motion.div>

                 {/* Form */}
                 <form onSubmit={handleRegister} className="space-y-4">
                   
                   {/* Full Name */}
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Full Name</label>
                      <div className="relative group">
                         <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D4C38]/40 group-focus-within:text-[#3D4C38] transition-colors" />
                         <input 
                           type="text" 
                           placeholder="John Doe" 
                           required 
                           className="w-full bg-[#E2E6D5]/30 border border-[#DEDBD0] focus:border-[#3D4C38] focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm text-[#2B3326] outline-none transition-all placeholder:text-[#5A6654]/40"
                           onChange={(e) => setName(e.target.value)}
                         />
                      </div>
                   </div>

                   {/* Email */}
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Email</label>
                      <div className="relative group">
                         <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D4C38]/40 group-focus-within:text-[#3D4C38] transition-colors" />
                         <input 
                           type="email" 
                           placeholder="name@example.com" 
                           required 
                           className="w-full bg-[#E2E6D5]/30 border border-[#DEDBD0] focus:border-[#3D4C38] focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm text-[#2B3326] outline-none transition-all placeholder:text-[#5A6654]/40"
                           onChange={(e) => setEmail(e.target.value)}
                         />
                      </div>
                   </div>

                   {/* Password */}
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">Password</label>
                      <div className="relative group">
                         <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D4C38]/40 group-focus-within:text-[#3D4C38] transition-colors" />
                         <input 
                           type="password" 
                           placeholder="••••••••" 
                           required 
                           className="w-full bg-[#E2E6D5]/30 border border-[#DEDBD0] focus:border-[#3D4C38] focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm text-[#2B3326] outline-none transition-all placeholder:text-[#5A6654]/40"
                           onChange={(e) => setPassword(e.target.value)}
                         />
                      </div>
                   </div>

                   {/* Role Select */}
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A6654] ml-1">I am a</label>
                      <div className="relative group">
                         <FaIdBadge className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D4C38]/40 group-focus-within:text-[#3D4C38] transition-colors" />
                         <select 
                           value={role}
                           onChange={(e) => setRole(e.target.value)}
                           className="w-full bg-[#E2E6D5]/30 border border-[#DEDBD0] focus:border-[#3D4C38] focus:bg-white rounded-xl py-3 pl-11 pr-10 text-sm text-[#2B3326] outline-none transition-all appearance-none cursor-pointer"
                         >
                           <option value="user">Tourist (Explorer)</option>
                           <option value="guide">Local Guide</option>
                         </select>
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#5A6654] text-[10px]">▼</div>
                      </div>
                   </div>

                   {/* Submit Button */}
                   <button 
                     type="submit" 
                     disabled={isLoading}
                     className="w-full bg-[#3D4C38] text-[#F3F1E7] py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#2B3326] transition-all shadow-lg shadow-[#3D4C38]/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                   >
                     {isLoading ? (
                       <span className="w-4 h-4 border-2 border-[#F3F1E7] border-t-transparent rounded-full animate-spin"></span>
                     ) : (
                       <>Register <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                     )}
                   </button>

                 </form>

                 {/* Social / Divider */}
                 <div className="space-y-4">
                    <div className="relative text-center">
                       <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#DEDBD0]"></div></div>
                       <span className="relative bg-[#F3F1E7] px-3 text-[10px] font-bold uppercase text-[#5A6654] tracking-widest">Or</span>
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 py-3 border border-[#DEDBD0] rounded-xl hover:bg-white transition-colors text-[#2B3326] text-xs font-bold uppercase tracking-wide bg-[#E2E6D5]/20">
                       <FaGoogle className="text-[#3D4C38]" /> <span>Sign up with Google</span>
                    </button>
                 </div>

                 <p className="text-center text-xs text-[#5A6654]">
                   Already have an account? <Link to="/login" className="text-[#3D4C38] font-bold uppercase tracking-wide hover:underline">Login</Link>
                 </p>
               </div>
             </div>
           </div>
           
           {/* 3. Footer Spacer (Optional - adds nice breathing room at bottom of card) */}
           <div className="h-4 lg:h-8 flex-none bg-[#F3F1E7]"></div>

        </div>


        {/* --- RIGHT SIDE: VISUAL (Hidden on Mobile) --- */}
        <div className="hidden lg:block w-1/2 h-full relative overflow-hidden bg-[#E2E6D5]">
           <motion.div 
             initial={{ scale: 1.15 }}
             animate={{ scale: 1 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className="absolute inset-0 h-full w-full"
           >
             <img 
               src="https://i.pinimg.com/736x/1b/e0/07/1be007fc4c429641c747215df72d8bc9.jpg" 
               alt="Wayanad Tea Garden" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#1F261C]/90 via-[#1F261C]/20 to-transparent opacity-80"></div>
             <div className="absolute inset-0 bg-[#3D4C38]/20 mix-blend-multiply"></div>
           </motion.div>

           <div className="absolute bottom-14 left-14 right-14 text-[#F3F1E7] z-10">
             <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
             >
                <div className="w-12 h-1 bg-[#F3F1E7] mb-8 rounded-full"></div>
                <h2 className="text-5xl xl:text-6xl font-['Oswald'] font-bold uppercase leading-[0.9] mb-6 drop-shadow-lg">
                  Join the <br/> Expedition
                </h2>
                <p className="text-sm opacity-90 leading-relaxed font-light max-w-md drop-shadow-md">
                  Unlock exclusive guides, manage your itinerary, and curate your ultimate Wayanad experience.
                </p>
             </motion.div>
           </div>
        </div>

      </motion.div>

      {/* Style for hiding scrollbar visually while keeping functionality */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #DEDBD0;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #3D4C38;
        }
      `}</style>
    </div>
  );
};

export default Register;