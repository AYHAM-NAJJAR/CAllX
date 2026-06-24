import React from 'react';

// نمرر الـ props اللي بنحتاجها
function Header({ title, description, icon: Icon, extraContent }) {
  return (
    <div className="flex items-center justify-between mb-8 p-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
          {Icon && <Icon size={24} />}
          {title}
        </h1>
        <p className="text-sm text-white mt-1">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2">
        
        {extraContent ? (
        extraContent
        ) : (
          <div className="flex items-center gap-2 text-xs bg-primary border border-slate-800 px-3 py-1.5 rounded-md text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Metrics
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;