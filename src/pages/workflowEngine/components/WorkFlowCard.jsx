import React from 'react';
import Button from '../../../components/common/Button';

const WorkFlowCard = ({ workflow }) => {
  const { id, name, description, priority, active } = workflow;

  return (
    <div className="max-w-md rounded-2xl border border-slate-8xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl "
         style={{ backgroundColor: '#101B22', borderColor: '#0F172A' }}>
      
     
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-slate-400">
          ID: #{id}
        </span>
        
        
        <div className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
          <span className="text-sm font-medium text-slate-300">
            {active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      
      <div className="mb-5">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      <hr className="border-slate-800 my-4" />

      
      <div className="flex items-center justify-between mt-auto">
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">
            Priority
          </span>
          <span className="text-sm font-semibold text-slate-200 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
            {priority}
          </span>
        </div>

     
        <Button
          path={`/main/workengine/details/${workflow.id}`}
          className="bg-customButton text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 shadow-md hover:brightness-110"
          
        >
         Details
        </Button>
      </div>
    </div>
  );
};

export default WorkFlowCard;