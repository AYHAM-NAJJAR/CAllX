import { Loader } from 'lucide-react';
import React from 'react'

function LoadingInButton() {
   return (
      <>
      
        <div className="flex items-center justify-center ">
              <Loader size={20} className=' animate-spin ' />
              
        </div>
      
    </>
  );
}

export default LoadingInButton