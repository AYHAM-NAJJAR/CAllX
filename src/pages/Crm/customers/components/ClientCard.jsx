import React from "react";
import { User, ShieldCheck, Tag, ArrowUpRight } from "lucide-react";
import Button from "../../../../components/common/Button";

const ClientCard = ({ client }) => {
  const { id, name, type, status, ownerAgentId, tagNames } = client;



  return (
    <div className="bg-[#101B22] border border-[#1e293b] rounded-xl p-5  shadow-xl flex flex-col justify-between  ">
      
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
           
            <div className="min-w-0">
              <p className="text-white font-semibold text-xl  tracking-wide ">
                {name || "Unknown Client"}
              </p>
              <p className="text-[11px] text-gray-500 font-mono mt-0.5">ID: #{id}</p>
            </div>
          </div>

          {/* Badges Stack */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold border ${
              type === "VIP" 
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
            }`}>
              {type || "Standard"}
            </span>
          </div>
        </div>

        {/* Card Body Info */}
        <div className="space-y-2.5 my-4 border-t border-b border-gray-800/50 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-gray-500" /> Status
            </span>
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
              status === "Active" || client.active 
                ? "bg-emerald-500/10 text-emerald-400" 
                : "bg-rose-500/10 text-rose-400"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status === "Active" || client.active ? "bg-emerald-400" : "bg-rose-400"}`} />
              {status || "Inactive"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <User size={14} className="text-gray-500" /> Owner Agent
            </span>
            <span className="text-gray-300 font-mono text-[11px]">ID: {ownerAgentId || "N/A"}</span>
          </div>
        </div>

        {/* Tags Section */}
        {tagNames && tagNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5 max-h-[60px] overflow-y-auto no-scrollbar">
            {tagNames.map((tag, index) => (
              <span 
                key={index} 
                className="flex items-center gap-1 text-[10px] font-medium bg-[#0F172A] text-gray-400 border border-gray-800/80 px-2 py-0.5 rounded transition-colors hover:border-gray-700"
              >
                <Tag size={9} className="text-[#0D9EF2]/70" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <Button
        path={`/main/customers/details/${id}`}
        className="w-full mt-2 group bg-[#0D9EF2] hover:bg-blue-600 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/20"
      >
        <span>View Details</span>
        <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 " />
      </Button>
      
    </div>
  );
};

export default ClientCard;