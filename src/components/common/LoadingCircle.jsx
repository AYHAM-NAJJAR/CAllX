import React from "react";
import circle from '../../assets/loadingcircle.png'


const LoadingCircle = () => {
  return (
    
      <>
        <img className="w-5 h-5 border-[#00A3FF]/30 border-t-[#00A3FF] animate-spin" src={circle} alt="" />
    </>
  );
};

export default LoadingCircle;