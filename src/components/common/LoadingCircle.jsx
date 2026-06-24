import React from "react";
import circle from '../../assets/loadingcircle.png'
import { LoaderCircle } from "lucide-react";


const LoadingCircle = ({Phrase}) => {
  return (
    
      <>
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-center p-4 text-slate-100">
        <div className="flex items-center justify-center flex-col">
              <LoaderCircle className="w-10 h-10 text-sky-300 animate-spin" src={circle} alt=""  />
              <p className="font-bold text-white text-lg animate-pulse mt-2">Loading  {Phrase}</p>
        </div>
      </div>
    </>
  );
};

export default LoadingCircle;