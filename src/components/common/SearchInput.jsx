import React, { useState } from "react";
import { Search, X } from "lucide-react"; // استخدام أيقونات lucide-react

export const SearchInput = ({ value, onChange , placeholder }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="relative flex items-center transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        // إذا كان الحقل فارغاً، يعود للانكماش عند إبعاد الماوس
        if (!value) setIsExpanded(false);
      }}
    >
      {/* حقل الإدخال */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => {
          if (!value) setIsExpanded(false);
        }}
        placeholder={placeholder}
        className={`transition-all duration-300 ease-in-out outline-none rounded-xl text-white text-sm placeholder:text-gray-400 ${
          isExpanded || value
            ? "w-64 sm:w-72 pl-10 pr-9 py-2 bg-[#101B22] border border-[#0D9EF2]/40 shadow-lg shadow-black/40"
            : "w-10  pl-10 pr-0 py-0 bg-[#0F172A] border border-[#101B22] cursor-pointer"
        }`}
      />

      {/* أيقونة البحث */}
      <span className="absolute left-3 flex items-center justify-center pointer-events-none text-[#0D9EF2]">
        <Search size={18} />
      </span>

      {/* زر المسح (يظهر فقط عند وجود نص والحقل ممتد) */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          type="button"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};