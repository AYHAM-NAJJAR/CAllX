import React from 'react';
import error from "../../assets/error.png"
const ServiceDown = ({ errorCode , message}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1118] text-white p-6 font-sans">
      {/* الصورة المعبرة */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-[#151D29] rounded-full flex items-center justify-center animate-pulse border border-red-500">
           <img src={error} className='h-30 w-30' alt="" />
        </div>
        {/* تأثير الدائرة المتحركة */}
        <div className="absolute inset-0 rounded-full border-2 border-red-600 animate-ping opacity-50"></div>
      </div>

      {/* النص ورقم الخطأ */}
      <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text text-red-600 mb-2">
        {errorCode}
      </h1>
    
      <p className="text-red-600 max-w-md text-center mb-8 font-bold">
        {message} Please try again later or contact support if the problem persists.
      </p> 

      
      <button 
        onClick={() => window.location.reload()}
        className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full transition-all active:scale-95 "
      >
        Try Again
      </button>
    </div>
  );
};

export default ServiceDown;