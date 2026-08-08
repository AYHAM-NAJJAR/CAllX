import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Pin, X } from 'lucide-react';

const StickyNote = ({ id, onDelete, onSelect, zIndex }) => {
  const [text, setText] = useState('');

  // حساب الموقع الافتراضي لتظهر الملاحظة مباشرة فوق الزر (في الزاوية السفلية اليمنى)
  const defaultX = typeof window !== 'undefined' ? window.innerWidth - 240 : 100;
  const defaultY = typeof window !== 'undefined' ? window.innerHeight - 300 : 100;

  return (
    <Rnd
      default={{
        x: defaultX,
        y: defaultY,
        width: 220,
        height: 220,
      }}
      minWidth={150}
      minHeight={150}
      bounds="window"
      style={{ zIndex: zIndex }}
      onMouseDown={onSelect}
      className="bg-sky-950 border border-sky-500/60 rounded-lg shadow-xl flex flex-col overflow-hidden"
    >
      {/* شريط الملاحظة العلوي (مخصص للسحب) */}
      <div className="bg-sky-900/80 border-b border-sky-800/50 p-2 flex justify-between items-center cursor-move select-none">
        <div className="flex items-center gap-1.5">
          <Pin className="w-4 h-4 text-sky-400 -rotate-45" />
          <span className="text-sm font-bold text-white tracking-wide">Note</span>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
          title="Delete Note"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* منطقة كتابة النص */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write Note here ... if you refresh your Note will disappear"
        className="w-full h-full p-3 bg-transparent resize-none outline-none text-sky-100 placeholder-sky-400/50 font-sans leading-relaxed text-sm"
      />
    </Rnd>
  );
};

export default StickyNote;