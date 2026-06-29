import React, { useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Mic, Volume2 } from 'lucide-react';

export default function VoicEmailNode({ data, toggleProperties }) {
  const { promptText, audioUrl } = data;
  const audioRef = useRef(null);

  const playAudio = (e) => {
    e.stopPropagation();
    if (audioRef.current) audioRef.current.play();
  };

  return (
    <div 
      onClick={() => toggleProperties()}
      className="bg-slate-900 p-4 rounded-xl border-2 border-purple-500 min-w-[220px] text-white shadow-lg cursor-pointer hover:border-purple-400 transition-all"
    >
      
      <Handle type="target" position={Position.Left} />

      {audioUrl && <audio ref={audioRef} src={audioUrl} />}

      <div className="flex items-center justify-between mb-3 text-purple-400">
        <div className="flex items-center gap-3">
          <Mic size={20} />
          <h3 className="font-bold">Voicemail</h3>
        </div>
        {audioUrl && (
          <button onClick={playAudio} className="hover:text-white transition-colors">
            <Volume2 size={16} />
          </button>
        )}
      </div>
      
      <div className="text-xs text-slate-400 mb-1">Intro Prompt:</div>
      <p className="text-sm italic text-slate-300 truncate max-w-[180px]">
        "{promptText || "Please leave a message"}"
      </p>

      {/* مقبض الخروج الجديد لإكمال المسار */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="next-node" 
        style={{ background: '#a855f7' }} 
      />
    </div>
  );
}