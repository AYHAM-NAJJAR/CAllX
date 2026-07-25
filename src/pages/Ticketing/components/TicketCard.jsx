import React from "react";
import Button from "../../../components/common/Button";
import { Mail, PencilLine, UserPlus } from "lucide-react";

// خريطة لتحديد الألوان والـ Label لكل حالة
const STATUS_CONFIG = {
  OPEN: {
    label: "Open",
    dotColor: "bg-emerald-500",
    badgeStyle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  IN_PROGRESS: {
    label: "In Progress",
    dotColor: "bg-amber-500",
    badgeStyle: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  RESOLVED: {
    label: "Resolved",
    dotColor: "bg-sky-500",
    badgeStyle: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  },
  CLOSED: {
    label: "Closed",
    dotColor: "bg-rose-500",
    badgeStyle: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  },
};

// خريطة لتنسيقات وأسماء الأولوية (Priority) شاملة الحالات الأربع
const PRIORITY_CONFIG = {
  CRITICAL: {
    label: "Critical",
    badgeStyle: "bg-purple-950/40 text-purple-300 border-purple-700/50 font-bold",
  },
  HIGH: {
    label: "High",
    badgeStyle: "bg-red-900/20 text-red-400 border-red-900/30",
  },
  MEDIUM: {
    label: "Medium",
    badgeStyle: "bg-yellow-900/20 text-yellow-400 border-yellow-900/30",
  },
  LOW: {
    label: "Low",
    badgeStyle: "bg-blue-900/20 text-blue-400 border-blue-900/30",
  },
};

const TicketCard = ({ ticket }) => {
  // جلب إعدادات الحالة مع قيمة افتراضية للسلامة
  const currentStatus = STATUS_CONFIG[ticket.status] || {
    label: ticket.status,
    dotColor: "bg-gray-500",
    badgeStyle: "bg-gray-800 text-gray-300 border-gray-700",
  };

  // جلب إعدادات الأولوية مع قيمة افتراضية للسلامة
  const currentPriority = PRIORITY_CONFIG[ticket.priority] || {
    label: ticket.priority,
    badgeStyle: "bg-gray-800 text-gray-300 border-gray-700",
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:border-sky-600/40 transition-all duration-300 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* نقطة الحالة ملونة حسب الحالة */}
          <div className={`w-2.5 h-2.5 rounded-full ${currentStatus.dotColor}`} />

          <span className="text-[11px] font-mono text-white bg-sky-600 px-2 py-1 rounded-md">
            {ticket.ticketId}
          </span>
        </div>

        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
          {ticket.categoryName}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-white text-xl font-bold leading-tight mb-3">
          {ticket.title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
          {ticket.description}
        </p>
      </div>

      {/* User Info */}
      <div className="mt-5 pt-4 border-t border-gray-800 space-y-2">
        <p className="flex items-center gap-2 text-sm text-white font-medium">
          <UserPlus className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{ticket.userName || "Unknown User"}</span>
        </p>

        <p className="flex items-center gap-2 text-xs text-gray-400 mt-1">
          <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <span className="truncate">{ticket.userEmail}</span>
        </p>
      </div>

      {/* Badges */}
      <div className="flex gap-2 mt-4 flex-wrap">
        {/* Priority Badge */}
        <span
          className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${currentPriority.badgeStyle}`}
        >
          {currentPriority.label}
        </span>

        {/* Status Badge */}
        <span
          className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${currentStatus.badgeStyle}`}
        >
          {currentStatus.label}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <Button
          path={`/main/system/tickets/details/${ticket.id}`}
          className="items-center justify-center bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default TicketCard;