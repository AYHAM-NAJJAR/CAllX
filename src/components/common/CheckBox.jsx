import React from 'react';


function CheckBox({ id, label, checked, onChange, classNames = {} }) {
  return (
    <label htmlFor={id} className={`flex items-center gap-3 cursor-pointer ${classNames.label}`}>
      {/* الـ input الحقيقي مخفي ولكن متاح للـ Accessibility */}
      <input
        id={id}
        type="checkbox"
        className="sr-only" // هذا الكلاس من Tailwind يخفي العنصر بصرياً
        checked={checked}
        onChange={onChange}
      />
      
      {/* شكل المربع المخصص */}
      <div className={`w-5 h-5  rounded flex items-center justify-center transition-colors 
        ${checked ? ' border-blue-600' : 'bg-slate-900 border-slate-600'}`}>
        {checked && <div className="w-2.5 h-2.5 r bg-blue-600 rounded-lg"></div>}
      </div>
      
      <span>{label}</span>
    </label>
  );
}

export default CheckBox;
