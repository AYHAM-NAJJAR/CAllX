import React from 'react';
import Button from "../../../components/common/Button";

// DepartmentCard.jsx
const DepartmentCard = ({ department }) => {
  const agentsList = department?.employees?.agents || [];
  const categoriesList = department?.categories || [];

  return (
    <div className="bg-[#101B22] border border-slate-700/80 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
      
      {/* القسم العلوي: الاسم والتصنيفات */}
      <div>
        {/* اسم القسم */}
        <h3 className="text-white text-xl font-bold mb-4 border-b border-sky-600/50 pb-2">
          {department.name}
        </h3>

        {/* تفاصيل الموظفين (Agents) */}
        <div className="mb-5">
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">
            Agents:
          </p>
          
          {agentsList.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto custom-scrollbar">
              {agentsList.map((agent) => (
                <span 
                  key={agent.id} 
                  className="bg-[#1E293B] text-sky-400 text-xs px-2.5 py-1 rounded-md border border-slate-700/50 font-medium"
                >
                  {agent.fullName}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-500 text-xs italic">No agents assigned</span>
          )}
        </div>

        {/* التصنيفات (Categories) */}
        <div className="mb-4">
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">
            Categories:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {categoriesList.length > 0 ? (
              categoriesList.map((cat, index) => (
                <span 
                  key={index} 
                  className="text-white text-xs bg-sky-600/80 hover:bg-sky-600 px-2.5 py-0.5 rounded-full transition-colors"
                >
                  {cat.name}
                </span>
              ))
            ) : (
              <span className="text-gray-600 text-xs italic">No categories</span>
            )}
          </div>
        </div>
      </div>

      {/* القسم السفلي (Footer): عرض العدد في خلفية ملونة وجميلة */}
      <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-slate-400 text-xs font-medium">Total Agents</span>
        <div className="bg-sky-500/10 border border-sky-500/30 text-sky-400 px-3 py-1 rounded-lg text-xs font-bold shadow-inner flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          {agentsList.length} Agents
        </div>
      </div>

    </div>
  );
};

export default DepartmentCard;