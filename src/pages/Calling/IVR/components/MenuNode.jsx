import React, { useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { SquareMenu, Volume2 } from 'lucide-react';

export default function MenuNode({ data, toggleProperties }) {
  const { label, options, audioUrl } = data;
  const audioRef = useRef(null);

  const playAudio = (e) => {
    e.stopPropagation();
    if (audioRef.current) audioRef.current.play();
  };

  return (
    <div 
      onClick={() => toggleProperties()} 
      className="bg-[#1f2937] p-4 rounded-xl border border-sky-400 min-w-[200px] text-white shadow-xl cursor-pointer hover:border-sky-200 transition-colors"
    >
      {audioUrl && <audio ref={audioRef} src={audioUrl} />}
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-sky-400">
              <SquareMenu size={20} />
            </div>
            <h3 className="font-bold">Main Menu</h3>
        </div>
        {audioUrl && (
          <button onClick={playAudio} className="text-sky-400 hover:text-white transition-colors">
            <Volume2 size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {options.map((option, index) => (
          <div key={index} className="relative bg-slate-800 p-2 rounded text-sm flex justify-between items-center">
            <span>{option.label}</span>
            <Handle 
              type="source" 
              position={Position.Right} 
              id={`${option.id || index}`} 
              style={{ top: `${(index + 1) * 35}%` }} 
            />
          </div>
        ))}
      </div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
}