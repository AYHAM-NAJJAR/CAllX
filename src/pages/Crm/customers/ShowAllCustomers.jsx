import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import { Users, Loader2, AlertCircle, Menu } from "lucide-react";
import { Tooltip } from "react-tooltip";
import Button from "../../../components/common/Button";
import { useCustomers } from "../../../hooks/useCustomers";
import ClientCard from "./components/ClientCard";
import CreateCustomerModal from "./Modal/CreateCustomerModal";
import { SearchInput } from "../../../components/common/SearchInput";
import FloatingMakeCall from "../../Calling/FloatingMakeCall";

const ShowAllCustomers = () => {
  
  const location = useLocation();
  const token = localStorage.getItem("Token");
  const [isModalCreateCustomerOpen,setIsModalCreateCustomerOpen]=useState(false)
  const isSubRoute = location.pathname.includes("/tags") || location.pathname.includes("/details/");
  const [search, setSearch] = useState("");
   const context = useOutletContext() || {};
  const { toggleSidebar } = context;
  
  const { 
    data: Customers = [], 
    isLoading, 
    isError,
    refetch
  } = useCustomers(token,search);
  console.log(Customers);
  const [isMakeCallOpen, setIsMakeCallOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(""); 
  useEffect(() => {
    if (!isSubRoute) {
      refetch(); 
    }
  }, [isSubRoute, refetch]);
  function handleCall(phone) {
    setSelectedNumber(phone);
    setIsMakeCallOpen(true);
  }
  if (isSubRoute) {
    return <Outlet />;
  }

  // 2. واجهة حالة التحميل (Loading State)
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400 gap-3">
        <Loader2 className="animate-spin text-[#0D9EF2]" size={32} />
        <p className="text-sm">Loading clients...</p>
      </div>
    );
  }

  // 3. واجهة حالة الخطأ (Error State)
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-400 gap-3">
        <AlertCircle size={32} />
        <p className="text-sm font-semibold">Failed to fetch clients.</p>
        <p className="text-xs text-gray-500">Please check your connection or session token.</p>
      </div>
    );
  }
 
  return (
    <div className="p-12">
      <div className="flex items-center justify-between mb-12">
        <CreateCustomerModal
        data={Customers} 
        isOpen={isModalCreateCustomerOpen} 
        onSuccess={() => refetch()}
        onClose={() => setIsModalCreateCustomerOpen(false)}
        
      />
        <div className="flex items-center gap-3">
         
          <Button 
          onClick={toggleSidebar} 
          className="p-2 text-slate-300 hover:text-sky-400  rounded-lg transition-all shrink-0"
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </Button>
          

          <h1 className="text-xl text-white font-bold tracking-wide">
            All Customers
          </h1>
           <SearchInput
                        placeholder={"Search About Customer name"} 
                        value={search} 
                        onChange={(val) => {
                        setSearch(val);
                    }} 
                  />
        </div>

        <div className="flex gap-4 items-center">
          <Button
            onClick={() => setIsModalCreateCustomerOpen(true)}
            className="bg-customButton hover:bg-blue-500 text-white px-4 py-1 font-bold rounded-lg"
          >
            Create Customer
          </Button>
          <Button
            path={"/main/customers/tags"}
            className="bg-customButton hover:bg-blue-500 text-white px-4 py-1 font-bold rounded-lg"
          >
            TAGS Management
          </Button>
             
        </div>
      </div>

      {/* Tabs - مفلترة ديناميكياً حسب بيانات الـ API الحقيقية */}
      

      {/* Grid عرض العملاء بعد الفلترة */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Customers.length > 0 ? (
            Customers.map((client) => (
              <ClientCard key={client.id} client={client} onCall={() => handleCall(client.phoneNumber)} />
            ))
          ) : (
            <div className="col-span-3 text-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-lg">
              No clients found in this category
            </div>
          )}
        </div>
      </div>

      {/* التول تيب */}
      <Tooltip
        id="export-clients-tooltip"
        place="top"
        style={{
          backgroundColor: "#101B22",
          border: "1px solid #1e293b",
          color: "#f8fafc",
          fontSize: "12px",
          borderRadius: "6px",
          padding: "6px 10px",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.5)",
          zIndex: 50
        }}
      />
      {isMakeCallOpen && (
        <FloatingMakeCall onClose={() => setIsMakeCallOpen(false)} number={selectedNumber}  />
      )}
    </div>
  );
};

export default ShowAllCustomers;