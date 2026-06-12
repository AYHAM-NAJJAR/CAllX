import React from "react";
import icon from '../../assets/loading.png'
const Loading = ({ id, LoadingPhrase }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      
      {/* Spinner */}
      
        <img className=" w-15 border-[#00A3FF]/30 border-t-[#00A3FF] animate-pulse" src={icon} alt="" />
      {/* Text */}
      <p
        id={id}
        className="text-sm font-medium tracking-wide text-gray-300"
      >
        {LoadingPhrase}
        <span className="animate-pulse">.</span>
        <span className="animate-pulse delay-150">.</span>
        <span className="animate-pulse delay-300">.</span>
      </p>
    </div>
  );
};

export default Loading;