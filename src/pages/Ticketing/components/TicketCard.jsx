import React from "react";
import Button from "../../../components/common/Button";

const TicketCard = ({ ticket }) => {
  const statusColor =
    ticket.status === "OPEN"
      ? "bg-green-500"
      : ticket.status === "CLOSED"
      ? "bg-red-500"
      : "bg-yellow-500";

  const priorityStyles =
    ticket.priority === "HIGH"
      ? "bg-red-900/20 text-red-400 border-red-900/30"
      : ticket.priority === "MEDIUM"
      ? "bg-yellow-900/20 text-yellow-400 border-yellow-900/30"
      : "bg-blue-900/20 text-blue-400 border-blue-900/30";

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:border-sky-600/40 transition-all duration-300 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />

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
      <div className="mt-5 pt-4 border-t border-gray-800">
        <p className="text-sm text-white font-medium">
          {ticket.userName || "Unknown User"}
        </p>

        <p className="text-xs text-gray-500 mt-1 truncate">
          📧 {ticket.userEmail}
        </p>
      </div>

      {/* Badges */}
      <div className="flex gap-2 mt-4 flex-wrap">
        <span
          className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${priorityStyles}`}
        >
          {ticket.priority}
        </span>

        <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
          {ticket.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <Button
          path={`/main/system/tickets/details/${ticket.id}`}
          className="items-center justify-center  bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default TicketCard;