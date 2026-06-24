import React from "react";
import { Play, ToggleLeft, ToggleRight, ArrowRight } from "lucide-react";
import Button from "../../../../components/common/Button";

function FlowCard({ flow , openUpdate  }) {
  
  return (
    <div
      onClick={()=>openUpdate(flow)}
      className="group relative bg-[#101B22] p-6 rounded-2xl border border-slate-800 
      hover:border-[#0D9EF2]/50 transition-all duration-300 ease-in-out 
        shadow-lg hover:shadow-[#0D9EF2]/5 flex flex-col justify-between h-full"
    >
      {/* Top Section: Name and Status Badge */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-[#0D9EF2] transition-colors duration-200 line-clamp-1">
            {flow.name}
          </h3>
          
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-300 ${
              flow.active
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {flow.active ? (
              <>
                
                
                  <ToggleRight className="w-3.5 h-3.5" />
                    Active
                
                
              </>
            ) : (
              <>
                <ToggleLeft className="w-3.5 h-3.5" />
                Inactive
              </>
            )}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
          {flow.description || "No description provided for this IVR flow."}
        </p>
      </div>

      {/* Action Button Section */}
      <div className="mt-auto pt-4 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-mono">ID: {flow.id}</span>
        
        <div className="flex items-center justify-center gap-2 ">
          <Button
          
          className="bg-[#0D9EF2] hover:bg-[#0D9EF2]/90 text-white px-4 py-2 rounded-xl
            font-medium text-sm flex items-center gap-2 transition-all duration-200 
            shadow-sm shadow-[#0D9EF2]/20 "
            path={`/ivr/${flow.id}`}
        >
          <Play className="w-3 h-3 fill-current group-hover:animate-bounce  " />
          <span>Build IVR</span>
          <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
        </Button>
        </div>
      </div>
    </div>
  );
}

export default FlowCard;