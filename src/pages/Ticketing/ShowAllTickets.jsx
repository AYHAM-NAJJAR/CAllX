import React, { useState } from "react";
import Button from "../../components/common/Button";
import { Outlet, useLocation } from "react-router-dom";
import { useTickets } from "../../hooks/useTickets";
import TicketCard from "./components/TicketCard";
import CreateTicketModal from "./Modal/CreateTicketModal";
import { Download } from "lucide-react";
// 1. استيراد مكتبة الـ Tooltip
import { Tooltip } from "react-tooltip";
import { exportCSV } from "../../services/Analytics&Reports/ExportTicketsData(CSV)";

const ShowAllTickets = () => {
  const [activeTab, setActiveTab] = useState("Open");
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const location = useLocation();

  const token = localStorage.getItem("Token");

  const {
    data: tickets,
    isLoading,
    isError,
    error,
  } = useTickets(token);

  const isSubRoute = location.pathname.includes("structure");

  if (isSubRoute) {
    return <Outlet />;
  }
  async function ExportCSV() {
  try {
    const fileData = await exportCSV(token);
    
    if (fileData) {
      // 1. تحويل البيانات النصية القادمة إلى ملف Blob بصيغة CSV
      const blob = new Blob([fileData], { type: 'text/csv;charset=utf-8;' });
      
      // 2. إنشاء رابط وهمي (URL) في ذاكرة المتصفح يشير إلى هذا الملف
      const url = window.URL.createObjectURL(blob);
      
      // 3. إنشاء عنصر وسم <a> وهمي وغير مرئي في الصفحة
      const link = document.createElement('a');
      link.href = url;
      
      // 4. تحديد اسم الملف الذي سيظهر للمستخدم عند التحميل
      link.setAttribute('download', `tickets_report_${new Date().toISOString().split('T')[0]}.csv`);
      
      // 5. إضافة الرابط للصفحة وضغط الزر تلقائياً ثم حذفه
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (err) {
    console.error("حدث خطأ أثناء تحميل الملف:", err);
  }
}
  return (
    <>
      {/* Header - يظل ثابتاً في الأعلى دائماً */}
      <div className="flex items-center justify-between mb-12">
        <CreateTicketModal isOpen={isCreateTicketModalOpen} onClose={setIsCreateTicketModalOpen} />
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-400 rounded-sm flex items-center justify-center">
            <div className="w-3 h-1 bg-blue-400"></div>
          </div>

          <h1 className="text-xl text-white font-bold tracking-wide">
            All Tickets
          </h1>
        </div>

        <div className="flex gap-4 items-center">
          {/* زر التحميل مع الـ attributes الخاصة بالـ tooltip */}
          <Button
            onClick={ExportCSV}
            dataTooltipId="export-tickets-tooltip"
            dataTooltipContent="Export CSV"
            className="p-2 bg-[#0d1527] rounded-md border border-[#1e293b] hover:bg-[#1e293b] transition-colors focus:outline-none"
          >
            <Download className="text-customButton" size={20} />
          </Button>

          <Button 
            onClick={() => setIsCreateTicketModalOpen(true)}
            className="bg-customButton hover:bg-blue-500 px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
          >
            New Ticket
          </Button>

          <Button
            path="/main/system/tickets/structure"
            className="bg-customButton hover:bg-blue-500 px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
          >
            Structure
          </Button>
        </div>
      </div>

      {/* Tabs - تظل ثابتة في الأعلى دائماً */}
      <div className="flex gap-8 mb-6 border-b border-gray-800 pb-0.5">
        {["Open (24)", "Pending (12)", "Closed (158)"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.split(" ")[0])}
            className={`pb-3 text-sm font-medium transition-all ${
              activeTab === tab.split(" ")[0]
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* منطقة المحتوى الديناميكي (التيكتات / التحميل / الخطأ) */}
      <div>
        {isLoading && (
          <div className="text-center py-20 text-white text-lg">
            Loading tickets...
          </div>
        )}

        {isError && (
          <div className="text-center py-20 text-red-500 text-lg">
            {error?.message || "Failed to load tickets"}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-3 gap-8">
            {tickets?.length > 0 ? (
              tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-400">
                No tickets found
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. مكون التولتيب مخصص وبألوان تناسب الـ Dark Mode الخاص بك */}
      <Tooltip
        id="export-tickets-tooltip"
        place="top"
        style={{
          backgroundColor: "#1e293b", // لون متناسق مع حواف الأزرار والخلفية الداكنة
          color: "#f8fafc",
          fontSize: "12px",
          borderRadius: "6px",
          padding: "6px 10px",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.5)",
          zIndex: 50
        }}
      />
    </>
  );
};

export default ShowAllTickets;