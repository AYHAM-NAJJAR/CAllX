import React, { useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { PhoneOff, Volume2 } from 'lucide-react';

export default function HangupNode({ data, toggleProperties }) {
  const { promptText, audioUrl } = data;
  const audioRef = useRef(null);

  const playAudio = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div 
      onClick={() => toggleProperties()}
      className="bg-slate-900 p-4 rounded-xl border-2 border-red-500 min-w-[200px] text-white shadow-lg cursor-pointer hover:border-red-400 transition-all"
    >
      {audioUrl && <audio ref={audioRef} src={audioUrl} />}

      <div className="flex items-center justify-between mb-3 text-red-500">
        <div className="flex items-center gap-3">
          <PhoneOff size={20} />
          <h3 className="font-bold">Hangup</h3>
        </div>
        
        {audioUrl && (
          <button 
            onClick={playAudio} 
            className="text-red-400 hover:text-white transition-colors"
            title="Play Goodbye Prompt"
          >
            <Volume2 size={16} />
          </button>
        )}
      </div>
      
      <div className="text-xs text-slate-400 mb-1">Goodbye Prompt:</div>
      <p className="text-sm italic text-slate-300 truncate max-w-[160px]">
        "{promptText || "Goodbye"}"
      </p>

      <Handle type="target" position={Position.Left} />
    </div>
  );
}