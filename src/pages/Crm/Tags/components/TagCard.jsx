import React from 'react';
import Button from '../../../../components/common/Button';

function TagCard({ tag, onDelete }) {
  return (
    <div 
      className="bg-[#101B22] border border-gray-800/60 rounded-2xl p-6 hover:border-[#0D9EF2]/40 transition group flex flex-col justify-between min-h-[160px]"
    >
      {/* الجزء العلوي: الاسم والمعرف */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs text-gray-500 font-mono block">ID: #{tag.id}</span>
          <h4 className="text-xl font-extrabold text-white group-hover:text-[#0D9EF2] transition">
            {tag.name}
          </h4>
        </div>
        <span className="bg-[#0F172A] border border-gray-800 text-[#0D9EF2] text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">
          Custom
        </span>
      </div>

      {/* الجزء السفلي: العداد وزر الحذف */}
      <div className="mt-6 pt-4 border-t border-gray-800/40 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Customers:</span>
          <span className="text-white font-black bg-[#0F172A] px-2.5 py-0.5 rounded-md border border-gray-800 font-mono">
            {tag.customerCount}
          </span>
        </div>
        
        {/* زر الحذف بتنسيق متناسق وصغير */}
        <Button 
          onClick={onDelete}
          className="bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 text-red-400 hover:text-white px-4 py-1.5 text-xs font-bold rounded-full transition duration-200 ease-in-out"
        >
          Delete
        </Button>
      </div>
       
    </div>
  );
}

export default TagCard;