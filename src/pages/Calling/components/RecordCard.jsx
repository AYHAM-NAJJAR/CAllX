import React, { useState } from 'react';
import { Play, ChevronUp, ChevronDown, Mic } from 'lucide-react';

function RecordCard({ audioUrl }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      style={{ backgroundColor: '#101B22' }} 
      className="p-5 rounded-2xl border border-slate-800 text-white w-full max-w-md transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-[#0D9EF2]">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-base text-slate-100">Call Recording</h4>
            <p className="text-xs text-slate-400">Click the button to listen to the recording</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ backgroundColor: '#0D9EF2' }}
          className="text-white p-3 rounded-full shadow-md hover:opacity-90 transition-transform active:scale-95 flex items-center justify-center focus:outline-none"
          title={isOpen ? "Hide Player" : "Play Recording"}
        >
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 translate-x-0.5" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-800 animate-fadeIn">
          {audioUrl ? (
            <div className="p-2">
              <audio controls className="w-full h-10 filter invert hue-rotate-180 brightness-90">
                <source src={audioUrl} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center">No audio file available at the moment</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RecordCard;