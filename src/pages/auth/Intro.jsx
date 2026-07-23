import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';

const Intro = ({ onFirstTimeLogin, onNormalLogin }) => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-center items-center p-6 font-sans overflow-hidden">
      
      {/* Animated Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-xl w-full bg-[#101B22] rounded-2xl shadow-2xl border border-slate-800 p-8 text-center space-y-8"
      >
        
        {/* Header & Brand Logo */}
        <div className="space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex p-4 bg-[#0D9EF2]/10 rounded-full text-[#0D9EF2] mb-1"
          >
            {/* Phone/Headset SVG Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </motion.div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Cloud Call Center Platform
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Welcome to your intelligent communication hub. Optimize call distribution, manage agent performance, and streamline your operations in real-time.
          </p>
        </div>

        <hr className="border-slate-800" />

        {/* The Question Area */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-200">
            Would you like to complete the initial system setup?
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            This will guide you through creating your initial departments, roles, and employee accounts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          {/* YES - Start Setup Button */}
          <button
            onClick={onFirstTimeLogin}
            className="flex-1 bg-[#0D9EF2] hover:bg-[#0D9EF2]/90 text-slate-900 font-bold py-4 px-6 rounded-xl transition duration-200 transform hover:-translate-y-0.5 active:scale-95 text-sm md:text-base flex flex-col items-center justify-center gap-1 shadow-lg shadow-[#0D9EF2]/10"
          >
            <span>Yes, Start Setup</span>
            <span className="text-[10px] text-slate-800 font-medium">Configure first-time settings</span>
          </button>

          {/* NO - Go to Login */}
          <Button
            onClick={onNormalLogin}
            className="flex-1 bg-transparent hover:bg-slate-800 text-slate-200 hover:text-white font-semibold py-4 px-6 rounded-xl transition duration-200 border border-slate-700 text-sm md:text-base flex flex-col items-center justify-center gap-1"
          >
            <span>No, I'm Done</span>
            <span className="text-[10px] text-slate-400 font-normal">Go directly to dashboard</span>
          </Button>

        </div>

        {/* Support Footer */}
        <p className="text-xs text-slate-500">
          Need any assistance? <a href="#support" className="text-[#0D9EF2] hover:underline transition duration-150">Contact Technical Support</a>
        </p>

      </motion.div>
    </div>
  );
};

export default Intro;