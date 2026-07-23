import React from 'react';
import { Target, ShieldCheck, UserCircle, UserCheck, Phone } from 'lucide-react';

const LeadCard = ({ lead, onClickable }) => {
  const isAssigned = lead.assignedAgentId !== null && lead.assignedAgentId !== undefined;
  const isConverted = lead.convertedCustomerId !== null && lead.convertedCustomerId !== undefined;
  const hasCampaign = lead.campaignId !== null && lead.campaignId !== undefined;

  return (
    <div
      onClick={onClickable}
      className="bg-[#101B22] border cursor-pointer border-[#1e293b] rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(13,158,242,0.2)] hover:border-[#0D9EF2]/50 group relative overflow-hidden flex flex-col h-full"
    >
      {/* Glow Effect Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0D9EF2] to-transparent opacity-50" />

      {/* 1. Top Row: Avatar & Status */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-11 h-11 rounded-full bg-[#0F172A] border border-[#1e293b] flex items-center justify-center shrink-0 shadow-inner group-hover:border-[#0D9EF2]/30 transition-colors">
          <UserCircle className="text-[#0D9EF2]" size={24} />
        </div>
        <span className="shrink-0 px-3 py-1 rounded-full bg-[#0D9EF2]/10 border border-[#0D9EF2]/20 text-[#0D9EF2] text-[10px] font-bold uppercase tracking-wider">
          {lead.status}
        </span>
      </div>

      {/* 2. Middle Row: Name, ID & Phone */}
      <div className="mb-5 flex-grow">
        <h3 className="text-white font-bold text-base sm:text-lg tracking-wide break-words leading-snug mb-1">
          {lead.name}
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-gray-500 font-mono">
          <span>ID: #{lead.id}</span>
          {lead.phoneNumber && (
            <span className="flex items-center gap-1 text-gray-400">
              <Phone size={11} className="text-[#0D9EF2]" />
              {lead.phoneNumber}
            </span>
          )}
        </div>
      </div>

      {/* 3. Bottom Row: Data Grid */}
      <div className="space-y-2.5 mt-auto">
        {/* Campaign */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F172A]/50 border border-[#1e293b]/50 transition-colors group-hover:bg-[#0F172A]">
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium shrink-0">
            <Target size={15} className="text-gray-500" /> Campaign
          </div>
          <div className="text-right truncate ml-2">
            {hasCampaign ? (
              <span className="text-[11px] font-semibold text-white block truncate" title={lead.campaignName}>
                {lead.campaignName || `Campaign #${lead.campaignId}`}
              </span>
            ) : (
              <span className="text-[11px] text-gray-600 italic">Not linked</span>
            )}
          </div>
        </div>

        {/* Assigned Agent */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F172A]/50 border border-[#1e293b]/50 transition-colors group-hover:bg-[#0F172A]">
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium shrink-0">
            <ShieldCheck size={15} className={isAssigned ? "text-emerald-500" : "text-gray-500"} /> Agent
          </div>
          <div className="text-right truncate ml-2">
            {isAssigned ? (
              <span className="text-[11px] font-semibold text-white block truncate" title={lead.assignedAgentName}>
                {lead.assignedAgentName || `Agent #${lead.assignedAgentId}`}
              </span>
            ) : (
              <span className="text-[11px] text-gray-600 italic">Unassigned</span>
            )}
          </div>
        </div>

        {/* Converted Customer */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F172A]/50 border border-[#1e293b]/50 transition-colors group-hover:bg-[#0F172A]">
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium shrink-0">
            <UserCheck size={15} className={isConverted ? "text-[#0D9EF2]" : "text-gray-500"} /> Converted
          </div>
          <div className="text-right truncate ml-2">
            {isConverted ? (
              <div className="flex flex-col items-end">
                
                <span className="text-[9px] text-gray-500 font-mono">
                  #{lead.convertedCustomerId}
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-gray-600 italic">Not Converted</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;