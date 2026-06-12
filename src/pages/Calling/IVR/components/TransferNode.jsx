import React, { useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { PhoneForwarded, Volume2 } from 'lucide-react';

export default function TransferNode({ data, toggleProperties }) {
  // استخراج البيانات
  const { promptText, transferTarget, audioUrl } = data;
  
  // مرجع للتحكم في مشغل الصوت
  const audioRef = useRef(null);

  // دالة تشغيل الصوت ومنع فتح السايد بار عند الضغط على الأيقونة
  const playAudio = (e) => {
    e.stopPropagation(); 
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div 
      // الضغط على العقدة لفتح السايد بار
      onClick={() => toggleProperties()}
      className="bg-slate-900 p-4 rounded-xl border border-emerald-500 min-w-[220px] text-white shadow-lg cursor-pointer hover:border-emerald-300 transition-all"
    >
      {/* عنصر الصوت الخفي المرتبط بالـ URL */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} />}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
            <div className="bg-emerald-900/50 p-2 rounded-lg text-emerald-400">
              <PhoneForwarded size={20} />
            </div>
            <h3 className="font-bold">Transfer</h3>
        </div>
        
        {/* أيقونة الصوت: تعمل كمشغل عند الضغط عليها */}
        {audioUrl && (
            <button 
              onClick={playAudio} 
              className="text-emerald-400 hover:text-white transition-colors"
              title="Play Audio"
            >
                <Volume2 size={16} />
            </button>
        )}
      </div>
      
      <div className="text-xs text-slate-400 mb-1">Target:</div>
      <div className="bg-slate-800 p-2 rounded font-mono text-emerald-300 text-sm mb-3 truncate">
        {transferTarget || "Not set"}
      </div>

      <div className="text-xs text-slate-400">Prompt:</div>
      <p className="text-sm italic text-slate-200 truncate max-w-[180px]">
        "{promptText || "No prompt"}"
      </p>

      {/* نقطة الاتصال بالـ Flow */}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}