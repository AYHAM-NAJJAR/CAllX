import React, { useState, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { SquareMenu, Volume2, Loader2 } from 'lucide-react';
import { runAudio } from '../../../../services/call/IVR/audio/RunAudio';


export default function MenuNode({ data, toggleProperties }) {
  const token = localStorage.getItem("Token")
  const { label, options, audioUrl, audioFileName } = data; 
  
  // تحديد اسم الملف أو الرابط المستهدف
  const targetAudio = audioFileName || audioUrl;

  const [isLoading, setIsLoading] = useState(false);
  // نستخدم useRef للاحتفاظ بمرجع الكائن الصوتي المشغل حالياً لمنع التكرار
  const currentAudioRef = useRef(null); 

  const playAudio = async (e) => {
    e.stopPropagation(); // منع فتح قائمة الخصائص عند الضغط على زر الصوت

    if (!targetAudio || !token) {
      console.warn("بيانات الصوت أو التوكن غير متوفرة في هذه العقدة");
      return;
    }

    // إذا كان الصوت يعمل حالياً، قم بإيقافه وتشغيله من البداية
    if (currentAudioRef.current) {
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current.play();
      return;
    }

    setIsLoading(true);
    try {
      // 1. استدعاء الخدمة لجلب الـ Blob
      const audioBlob = await runAudio(targetAudio, token);
      
      // 2. تحويل الـ Blob إلى رابط مؤقت
      const blobUrl = URL.createObjectURL(audioBlob);
      
      // 3. إنشاء كائن Audio وتشغيله برمجياً
      const audio = new Audio(blobUrl);
      currentAudioRef.current = audio;
      
      audio.play();

      // 4. تنظيف الذاكرة وتفريغ المرجع عند انتهاء الصوت
      audio.onended = () => {
        URL.revokeObjectURL(blobUrl);
        currentAudioRef.current = null;
      };

    } catch (error) {
      console.error("خطأ أثناء تشغيل الملف الصوتي:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      onClick={() => toggleProperties()} 
      className="bg-[#1f2937] p-4 rounded-xl border border-sky-400 min-w-[200px] text-white shadow-xl cursor-pointer hover:border-sky-200 transition-colors"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-sky-400">
              <SquareMenu size={20} />
            </div>
            <h3 className="font-bold">{label || "Main Menu"}</h3>
        </div>

        {/* تظهر الأيقونة دائماً إذا كان هناك أي إشارة لملف صوتي قادم في الـ data */}
        {targetAudio && (
          <button 
            onClick={playAudio} 
            disabled={isLoading}
            className="text-sky-400 hover:text-white transition-colors disabled:text-gray-500 p-1 rounded hover:bg-slate-700"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Volume2 size={16} />
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {options && options.map((option, index) => (
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