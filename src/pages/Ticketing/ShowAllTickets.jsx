import React, { useState } from "react";
import Button from "../../components/common/Button";
import { Outlet, useLocation } from "react-router-dom";
import { useTickets } from "../../hooks/useTickets";
import TicketCard from "./components/TicketCard";
import CreateTicketModal from "./Modal/CreateTicketModal";

import Select from "react-select";
import ReactPaginateModule from "react-paginate";
const ReactPaginate = ReactPaginateModule.default || ReactPaginateModule;

import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Download, 
  Palette, 
  ShieldAlert, 
  Shield, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Ticket,
  XCircle,
  Zap
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import { exportCSV } from "../../services/Analytics&Reports/ExportTicketsData(CSV)";
import LoadingError from "../../components/common/LoadingError";
import LoadingCircle from "../../components/common/LoadingCircle";
import { useDepartments } from "../../hooks/useDepartments";

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#0d1527",
    borderColor: state.isFocused ? "#3b82f6" : "#1e293b",
    color: "#ffffff",
    width: "100%",
    borderRadius: "0.5rem",
    boxShadow: "none",
    fontSize: "0.875rem",
    padding: "2px 4px",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#0d1527",
    border: "1px solid #1e293b",
    borderRadius: "0.5rem",
    zIndex: 50,
    overflow: "hidden",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#2563eb"
      : state.isFocused
      ? "#1e293b"
      : "#0d1527",
    color: "#ffffff",
    fontSize: "0.875rem",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#1e293b",
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: "#ffffff",
  }),
  input: (base) => ({
    ...base,
    color: "#ffffff",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#94a3b8",
  }),
};

const ShowAllTickets = () => {
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedSort, setSelectedSort] = useState("createdAt,desc"); // 👈 حالة الترتيب

  const pageSize = 20;

  const location = useLocation();
  const token = localStorage.getItem("Token");

  // تمرير معامل الترتيب الرابع للـ Hook
  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useTickets(
    token, 
    currentPage, 
    pageSize, 
    selectedDepartment, 
    selectedStatus, 
    selectedPriority,
    selectedSort // 👈 تمرير قيمة الترتيب
  ); 

  const { 
    data: departments = [], 
    isLoading: isDepsLoading, 
  } = useDepartments(token, true);

  const statusOptions = [
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' }
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'CRITICAL', label: 'Critical' }
  ];

  // 👈 خيارات الترتيب
  const sortOptions = [
    { value: 'createdAt,desc', label: 'Newest First' },
    { value: 'createdAt,asc', label: 'Oldest First' },
  ];

  const departmentOptions = [
    { value: "", label: "Filter By departments" },
    ...departments.map((dep) => ({
      value: typeof dep === "object" ? dep.name || dep.label || dep.value : dep,
      label: typeof dep === "object" ? dep.name || dep.label : dep,
    })),
  ];

  const statusSelectOptions = [
    { value: "", label: "Filter By Status" },
    ...statusOptions,
  ];

  const prioritySelectOptions = [
    { value: "", label: "Filter By Priority" },
    ...priorityOptions,
  ];

  const tickets = responseData?.data?.content || (Array.isArray(responseData) ? responseData : []);
  const totalPages = responseData?.data?.totalPages || 0;
  const totalElements = responseData?.data?.totalElements || 0;

  const isSubRoute = location.pathname.includes("structure") || location.pathname.includes("/details/");

  if (isSubRoute) {
    return <Outlet />;
  }

  async function ExportCSV() {
    try {
      await exportCSV(token);
    } catch (err) {
      console.error("حدث خطأ أثناء تحميل الملف:", err);
    }
  }

  const handleDepartmentChange = (option) => {
    setSelectedDepartment(option ? option.value : "");
    setCurrentPage(0);
  };

  const handleStatusChange = (option) => {
    setSelectedStatus(option ? option.value : "");
    setCurrentPage(0);
  };

  const handlePriorityChange = (option) => {
    setSelectedPriority(option ? option.value : "");
    setCurrentPage(0);
  };

  const handleSortChange = (option) => {
    setSelectedSort(option ? option.value : "createdAt,desc");
    setCurrentPage(0);
  };

  if (isLoading) {
    return <LoadingCircle Phrase={"Tickets"} />;
  }

  if (isError) {
    return <LoadingError Phrase={"Tickets"} />;
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row p-4 sm:items-center justify-between gap-4 mb-8 sm:mb-12">
<CreateTicketModal isOpen={isCreateTicketModalOpen} onClose={setIsCreateTicketModalOpen} onSuccess={() => refetch()} />        
        <div className="flex items-center gap-3">
          <div>
            <Ticket className="text-sky-600 " />
          </div>

          <h1 className="text-lg sm:text-xl text-white font-bold tracking-wide flex items-center gap-2.5">
            All Tickets 
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {totalElements}
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 items-center w-full sm:w-auto">
          <Button
            onClick={ExportCSV}
            dataTooltipId="export-tickets-tooltip"
            dataTooltipContent="Export CSV"
            className="p-2 sm:p-2.5 bg-[#0d1527] rounded-md border border-[#1e293b] hover:bg-[#1e293b] transition-colors focus:outline-none shrink-0"
          >
            <Download className="text-customButton" size={18} />
          </Button>

          <Button 
            onClick={() => setIsCreateTicketModalOpen(true)}
            className="flex-1 sm:flex-initial justify-center bg-customButton hover:bg-blue-500 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
          >
            New Ticket
          </Button>

          <Button
            path="/main/system/tickets/structure"
            className="flex-1 sm:flex-initial justify-center bg-customButton hover:bg-blue-500 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
          >
            Structure
          </Button>
        </div>
      </div>

      {/* Color Legend Header */}
      <div className="bg-[#111821] border border-gray-800 rounded-2xl p-4 mb-6 text-gray-300">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800/60">
          <Palette className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Color Legend & Indicators
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <span className="font-semibold text-gray-400 text-[11px] block uppercase tracking-wider">
              Ticket Status
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="flex items-center gap-1 text-gray-300">
                  <AlertCircle className="w-3.5 h-3.5 text-emerald-500" /> Open
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="flex items-center gap-1 text-gray-300">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> In Progress
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                <span className="flex items-center gap-1 text-gray-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" /> Resolved
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="flex items-center gap-1 text-gray-300">
                  <XCircle className="w-3.5 h-3.5 text-rose-500" /> Closed
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-gray-400 text-[11px] block uppercase tracking-wider">
              Priority Levels
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold border bg-purple-950/40 text-purple-300 border-purple-700/50 uppercase">
                <Zap className="w-3 h-3 text-purple-400" /> Critical Priority
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold border bg-red-900/20 text-red-400 border-red-900/30 uppercase">
                <ShieldAlert className="w-3 h-3 text-red-400" /> High Priority
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold border bg-yellow-900/20 text-yellow-400 border-yellow-900/30 uppercase">
                <Shield className="w-3 h-3 text-yellow-400" /> Medium Priority
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold border bg-blue-900/20 text-blue-400 border-blue-900/30 uppercase">
                <ShieldCheck className="w-3 h-3 text-blue-400" /> Low Priority
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* شريط الفلاتر (Filters Bar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
        {/* فلتر القسم */}
        <div>
          <Select
            options={departmentOptions}
            isLoading={isDepsLoading}
            onChange={handleDepartmentChange}
            value={departmentOptions.find((opt) => opt.value === selectedDepartment) || null}
            placeholder="Filter by Department"
            styles={customSelectStyles}
            isSearchable
          />
        </div>

        {/* فلتر الحالة */}
        <div>
          <Select
            options={statusSelectOptions}
            onChange={handleStatusChange}
            value={statusSelectOptions.find((opt) => opt.value === selectedStatus)}
            placeholder="Filter by Status"
            styles={customSelectStyles}
            isSearchable
          />
        </div>

        {/* فلتر الأولوية */}
        <div>
          <Select
            options={prioritySelectOptions}
            onChange={handlePriorityChange}
            value={prioritySelectOptions.find((opt) => opt.value === selectedPriority)}
            placeholder="Filter by Priority"
            styles={customSelectStyles}
            isSearchable
          />
        </div>

        {/* 👈 فلتر الترتيب الجديد */}
        <div>
          <Select
            options={sortOptions}
            onChange={handleSortChange}
            value={sortOptions.find((opt) => opt.value === selectedSort)}
            placeholder="Sort By"
            styles={customSelectStyles}
            isSearchable={false}
          />
        </div>
      </div>

      {/* Grid بطاقات التذاكر */}
      <div>
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {tickets?.length > 0 ? (
              tickets.map((ticket) => (
                <TicketCard key={ticket.id || ticket._id} ticket={ticket} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400 text-sm sm:text-base">
                No tickets found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 mb-6">
          <ReactPaginate
            pageCount={totalPages}
            forcePage={currentPage}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            previousLabel={<ChevronLeft size={16} />}
            nextLabel={<ChevronRight size={16} />}
            breakLabel="..."
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            containerClassName="flex items-center gap-2"
            pageClassName="border border-gray-700 rounded-md"
            pageLinkClassName="block px-3 py-2 text-gray-300 hover:bg-gray-800"
            activeClassName="bg-blue-600 border-blue-600"
            activeLinkClassName="text-white"
            previousClassName="border border-gray-700 rounded-md"
            previousLinkClassName="block px-3 py-2 text-gray-300"
            nextClassName="border border-gray-700 rounded-md"
            nextLinkClassName="block px-3 py-2 text-gray-300"
            breakClassName="px-2 text-gray-400"
            disabledClassName="opacity-40 pointer-events-none"
          />
        </div>
      )}

      {/* Tooltip */}
      <Tooltip
        id="export-tickets-tooltip"
        place="top"
        style={{
          backgroundColor: "#1e293b",
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