
import { User, ShieldCheck, Tag, ArrowUpRight, PhoneCall, Mail } from "lucide-react";
import Button from "../../../../components/common/Button";

const ClientCard = ({ client,onCall }) => {
  const { id, name, type, status, ownerAgentId, tagNames, phoneNumber, email } = client;
  
  return (
    <div className="bg-[#101B22] border border-[#1e293b] rounded-xl p-5 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-[#0D9EF2]/40 group">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <p className="text-white font-semibold text-lg sm:text-xl tracking-wide truncate">
              {name || "Unknown Client"}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-gray-500 font-mono">ID: #{id}</span>
              {email && (
                <span className="text-[11px] text-gray-400 truncate flex items-center gap-1 max-w-[150px]">
                  <Mail size={11} className="text-gray-500 shrink-0" />
                  {email}
                </span>
              )}
            </div>
          </div>

          {/* Type Badge */}
          <span
            className={`shrink-0 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md font-bold border ${
              type === "VIP"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                : type === "Corporate"
                ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                : "bg-blue-500/10 text-blue-400 border-blue-500/30"
            }`}
          >
            {type || "Standard"}
          </span>
        </div>

        {/* 📞 HIGHLIGHTED PHONE CALL SECTION (Call Center Specific) */}
        <div className="my-3 p-2.5 rounded-lg bg-[#0F172A] border border-[#0D9EF2]/20 flex items-center justify-between gap-3 group/phone hover:border-[#0D9EF2]/60 transition-all duration-300 shadow-inner">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0D9EF2]/10 border border-[#0D9EF2]/30 flex items-center justify-center shrink-0 text-[#0D9EF2] group-hover/phone:bg-[#0D9EF2] group-hover/phone:text-white transition-all duration-300 shadow-[0_0_12px_rgba(13,158,242,0.15)]">
              <PhoneCall size={15} className="animate-pulse" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium block">
                Direct Contact
              </span>
              <span className="text-white font-mono font-bold text-xs sm:text-sm tracking-wider truncate block">
                {phoneNumber || "No Number"}
              </span>
            </div>
          </div>

          {phoneNumber && (
            <Button

              onClick={onCall}
              className="shrink-0 px-2.5 py-1 rounded-md bg-[#0D9EF2]/10 hover:bg-[#0D9EF2] text-[#0D9EF2] hover:text-white border border-[#0D9EF2]/30 text-[10px] font-bold transition-all duration-200 flex items-center gap-1"
            >
              Call
              <PhoneCall size={10} />
            </Button>
          )}
        </div>

        {/* Card Body Info */}
        <div className="space-y-2 mb-4 border-t border-b border-gray-800/60 py-2.5">
          {/* Status Row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5 text-[11px]">
              <ShieldCheck size={14} className="text-gray-500" /> Status
            </span>
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                status === "Active" || client.active
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status === "Active" || client.active ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
              {status || "Inactive"}
            </span>
          </div>

          {/* Owner Agent Row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5 text-[11px]">
              <User size={14} className="text-gray-500" /> Agent Owner
            </span>
            <span className="text-gray-300 font-mono text-[11px]">
              {ownerAgentId ? `Agent #${ownerAgentId}` : "Unassigned"}
            </span>
          </div>
        </div>

        {/* Tags Section */}
        {tagNames && tagNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 max-h-[50px] overflow-y-auto no-scrollbar">
            {tagNames.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 text-[10px] font-medium bg-[#0F172A] text-gray-300 border border-gray-800/80 px-2 py-0.5 rounded transition-colors hover:border-gray-700"
              >
                <Tag size={9} className="text-[#0D9EF2]" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <Button
        path={`/main/customers/details/${id}`}
        className="w-full group bg-[#0D9EF2] hover:bg-blue-600 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/20"
      >
        <span>View Details</span>
        <ArrowUpRight
          size={14}
          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Button>
    </div>
  );
};

export default ClientCard;